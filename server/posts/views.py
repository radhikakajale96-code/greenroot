import cloudinary.uploader
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Post, Like, Comment
from .serializers import PostSerializer, CommentSerializer

def upload_image_file(image_file):
    """
    Upload image file to Cloudinary if credentials are configured,
    or return None to allow standard Django local media file storage.
    """
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', '')
    api_key = getattr(settings, 'CLOUDINARY_API_KEY', '')
    api_secret = getattr(settings, 'CLOUDINARY_API_SECRET', '')

    is_configured = cloud_name and cloud_name != 'demo' and api_key and api_key != 'demo'

    if is_configured:
        try:
            res = cloudinary.uploader.upload(
                image_file,
                folder="greenroots_posts",
                resource_type="image"
            )
            return res.get('secure_url')
        except Exception as e:
            print(f"[Cloudinary Upload Exception] {e}")

    return None

class PostListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request):
        search = request.GET.get('search', '').strip()
        queryset = Post.objects.all().select_related('user').prefetch_related('likes', 'comments__user')

        if search:
            queryset = queryset.filter(caption__icontains=search)

        posts = list(queryset)
        serializer = PostSerializer(posts, many=True, context={'request': request})

        return Response({
            'success': True,
            'posts': serializer.data,
            'count': len(serializer.data),
            'results': serializer.data,
        })

    def post(self, request):
        caption = request.data.get('caption', '') or request.data.get('content', '')
        image_file = request.FILES.get('image')

        # Validate that image is provided
        if not image_file:
            return Response(
                {'success': False, 'message': 'An image file is required to create a post.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate MIME type / extension
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        allowed_exts = ('.jpg', '.jpeg', '.png', '.webp')
        content_type = getattr(image_file, 'content_type', '').lower()
        file_name = getattr(image_file, 'name', '').lower()

        if content_type and content_type not in allowed_types and not file_name.endswith(allowed_exts):
            return Response(
                {'success': False, 'message': 'Invalid image format! Only JPEG, JPG, PNG, and WebP are allowed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file size (max 5MB)
        if image_file.size > 5 * 1024 * 1024:
            return Response(
                {'success': False, 'message': 'Image size exceeds the 5MB limit.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Upload image to Cloudinary if configured
        image_url = upload_image_file(image_file)

        post = Post.objects.create(
            user=request.user,
            caption=caption.strip() if caption else '',
            image=image_file if not image_url else None,
            image_url=image_url
        )

        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PostDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'success': False, 'message': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(post, context={'request': request})
        return Response({'success': True, 'post': serializer.data})

    def delete(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'success': False, 'message': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        if post.user != request.user and not request.user.is_staff:
            return Response({'success': False, 'message': 'Not authorized to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({'success': True, 'message': 'Post deleted successfully.'})

class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        return self._toggle_like(request, post_id)

    def put(self, request, post_id):
        return self._toggle_like(request, post_id)

    def _toggle_like(self, request, post_id):
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({'success': False, 'message': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        like_obj = Like.objects.filter(user=request.user, post=post).first()

        if like_obj:
            like_obj.delete()
            liked = False
        else:
            Like.objects.create(user=request.user, post=post)
            liked = True

        likes_count = post.likes.count()
        return Response({
            'liked': liked,
            'likes_count': likes_count,
            'success': True
        })

class CommentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        text = request.data.get('text', '') or request.data.get('content', '')
        if not text or not text.strip():
            return Response(
                {'success': False, 'message': 'Comment text cannot be empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({'success': False, 'message': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        comment = Comment.objects.create(
            post=post,
            user=request.user,
            text=text.strip()
        )

        serializer = CommentSerializer(comment, context={'request': request})
        return Response({
            'success': True,
            'comment': serializer.data,
            **serializer.data
        }, status=status.HTTP_201_CREATED)

class CommentDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, post_id, comment_id):
        try:
            comment = Comment.objects.get(pk=comment_id, post_id=post_id)
        except Comment.DoesNotExist:
            return Response({'success': False, 'message': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

        if comment.user != request.user and not request.user.is_staff:
            return Response(
                {'success': False, 'message': 'Unauthorized: You can only delete your own comment.'},
                status=status.HTTP_403_FORBIDDEN
            )

        comment.delete()
        return Response({'success': True, 'message': 'Comment deleted successfully.'})
