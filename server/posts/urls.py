from django.urls import path
from .views import (
    PostListCreateView,
    PostDetailView,
    LikeToggleView,
    CommentListCreateView,
    CommentDeleteView,
)

urlpatterns = [
    # GET /api/posts/  — list all posts
    # POST /api/posts/ — create post
    path('', PostListCreateView.as_view(), name='post-list-create'),

    # GET /api/posts/<id>/    — post detail
    # DELETE /api/posts/<id>/ — delete own post
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),

    # POST /api/posts/<id>/like/ — toggle like
    path('<int:post_id>/like/', LikeToggleView.as_view(), name='post-like-toggle'),

    # POST /api/posts/<id>/comments/ — add comment
    path('<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-create'),

    # DELETE /api/posts/<post_id>/comments/<comment_id>/ — delete own comment
    path('<int:post_id>/comments/<int:comment_id>/', CommentDeleteView.as_view(), name='comment-delete'),
]
