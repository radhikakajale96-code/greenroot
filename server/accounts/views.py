import logging
import urllib.parse

from django.contrib.auth import get_user_model
from django.conf import settings
from django.shortcuts import redirect
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .google_oauth import build_google_flow, google_oauth_configured
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

User = get_user_model()
logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    token_str = str(refresh.access_token)
    return {
        'token': token_str,
        'access': token_str,
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
    }


def _client_url():
    return getattr(settings, 'CLIENT_URL', 'http://localhost:5173').rstrip('/')


def _redirect_login_error(code):
    return redirect(f"{_client_url()}/login?error={code}")


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            data = get_tokens_for_user(user)
            data['success'] = True
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(
            {'success': False, 'errors': serializer.errors, 'message': 'Invalid registration data.'},
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email'].lower().strip()
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                return Response(
                    {'success': False, 'message': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if not user.check_password(password):
                return Response(
                    {'success': False, 'message': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            data = get_tokens_for_user(user)
            data['success'] = True
            return Response(data, status=status.HTTP_200_OK)

        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response({'success': True, 'message': 'Logged out successfully.'})


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'success': True, 'user': serializer.data})

    def patch(self, request):
        user = request.user
        name = (request.data.get('name') or '').strip()
        avatar = request.data.get('avatar')

        if name:
            parts = name.split(' ', 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ''
        if avatar:
            user.avatar = avatar
        user.save()
        return Response({'success': True, 'user': UserSerializer(user).data})


class GoogleAuthUrlView(APIView):
    """Start Google OAuth 2.0 authorization-code flow and redirect the browser."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not google_oauth_configured():
            logger.error("Refusing Google login: credentials missing or placeholder (would cause 401 invalid_client).")
            return _redirect_login_error('google_not_configured')

        try:
            flow = build_google_flow()
            auth_url, state = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='select_account',
            )
            request.session['google_oauth_state'] = state
            request.session.save()
            logger.info(
                "Redirecting to Google OAuth. client_id_prefix=%s redirect_uri=%s",
                settings.GOOGLE_CLIENT_ID[:20],
                settings.GOOGLE_CALLBACK_URL,
            )
            return redirect(auth_url)
        except Exception:
            logger.exception("Failed to build Google authorization URL")
            return _redirect_login_error('google_auth_failed')


class GoogleCallbackView(APIView):
    """Exchange the authorization code, verify the ID token, issue a JWT, send the user back to the SPA."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.GET.get('error'):
            logger.warning("Google returned OAuth error: %s", request.GET.get('error'))
            return _redirect_login_error('google_cancelled')

        code = request.GET.get('code')
        if not code:
            return _redirect_login_error('google_no_code')

        if not google_oauth_configured():
            return _redirect_login_error('google_not_configured')

        expected_state = request.session.get('google_oauth_state')
        incoming_state = request.GET.get('state')
        if expected_state and incoming_state and expected_state != incoming_state:
            logger.error("Google OAuth state mismatch")
            return _redirect_login_error('google_auth_failed')

        try:
            flow = build_google_flow(state=incoming_state)
            flow.fetch_token(code=code)
            credentials = flow.credentials

            if not credentials.id_token:
                logger.error("Google token response did not include an ID token")
                return _redirect_login_error('google_auth_failed')

            try:
                payload = id_token.verify_oauth2_token(
                    credentials.id_token,
                    google_requests.Request(),
                    audience=settings.GOOGLE_CLIENT_ID.strip(),
                    clock_skew_in_seconds=10,
                )
            except TypeError:
                payload = id_token.verify_oauth2_token(
                    credentials.id_token,
                    google_requests.Request(),
                    settings.GOOGLE_CLIENT_ID.strip(),
                )

            if payload.get('iss') not in ('accounts.google.com', 'https://accounts.google.com'):
                logger.error("Invalid ID token issuer: %s", payload.get('iss'))
                return _redirect_login_error('google_auth_failed')

            google_id = payload.get('sub')
            email = payload.get('email')
            name = payload.get('name') or 'Google User'
            picture = payload.get('picture') or ''

            if not email:
                return _redirect_login_error('google_no_email')

            user = (
                User.objects.filter(google_id=google_id).first()
                or User.objects.filter(email__iexact=email).first()
            )

            if not user:
                username = email.split('@')[0]
                base_username = username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1

                name_parts = name.split(' ', 1)
                user = User.objects.create_user(
                    username=username,
                    email=email.lower(),
                    first_name=name_parts[0],
                    last_name=name_parts[1] if len(name_parts) > 1 else '',
                    google_id=google_id,
                    avatar=picture,
                    provider='google',
                )
                user.set_unusable_password()
                user.save()
                logger.info("Created Google user id=%s email=%s", user.id, user.email)
            else:
                updated = False
                if not user.google_id:
                    user.google_id = google_id
                    updated = True
                if user.provider != 'google' and user.google_id:
                    user.provider = 'google'
                    updated = True
                if picture and not user.avatar:
                    user.avatar = picture
                    updated = True
                if updated:
                    user.save()
                logger.info("Logged in existing Google user id=%s email=%s", user.id, user.email)

            tokens = get_tokens_for_user(user)
            encoded_token = urllib.parse.quote(tokens['token'])
            request.session.pop('google_oauth_state', None)
            return redirect(f"{_client_url()}/login?token={encoded_token}")

        except Exception:
            logger.exception("Google OAuth callback failed")
            return _redirect_login_error('google_auth_failed')
