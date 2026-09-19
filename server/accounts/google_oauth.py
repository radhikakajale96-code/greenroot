import logging
import os

from django.conf import settings
from google_auth_oauthlib.flow import Flow

# Google may return extra granted scopes; allow token exchange to succeed locally.
os.environ.setdefault("OAUTHLIB_RELAX_TOKEN_SCOPE", "1")

logger = logging.getLogger(__name__)

GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

_PLACEHOLDERS = {
    "",
    "demo",
    "changeme",
    "your_google_client_id",
    "your_google_client_secret",
}


def google_oauth_configured():
    client_id = (getattr(settings, "GOOGLE_CLIENT_ID", "") or "").strip()
    client_secret = (getattr(settings, "GOOGLE_CLIENT_SECRET", "") or "").strip()

    if client_id in _PLACEHOLDERS or client_secret in _PLACEHOLDERS:
        logger.error(
            "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and "
            "GOOGLE_CLIENT_SECRET in server/.env to a real Web client from Google Cloud Console."
        )
        return False

    if not client_id.endswith(".apps.googleusercontent.com"):
        logger.error(
            "GOOGLE_CLIENT_ID is not a valid Web client ID "
            "(must end with .apps.googleusercontent.com). prefix=%s",
            client_id[:24],
        )
        return False

    return True


def build_google_flow(state=None):
    client_id = settings.GOOGLE_CLIENT_ID.strip()
    client_secret = settings.GOOGLE_CLIENT_SECRET.strip()
    redirect_uri = settings.GOOGLE_CALLBACK_URL.strip()

    kwargs = {
        "scopes": GOOGLE_SCOPES,
        "redirect_uri": redirect_uri,
    }
    if state:
        kwargs["state"] = state

    return Flow.from_client_config(
        {
            "web": {
                "client_id": client_id,
                "client_secret": client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [redirect_uri],
            }
        },
        **kwargs,
    )
