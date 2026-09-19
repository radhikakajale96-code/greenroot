from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Post, Like, Comment

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    author = UserSerializer(source='user', read_only=True)
    content = serializers.CharField(source='text', read_only=True)
    _id = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', '_id', 'user', 'author', 'text', 'content', 'created_at', 'createdAt']

    def get__id(self, obj):
        return str(obj.id)

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    author = UserSerializer(source='user', read_only=True)
    _id = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', '_id', 'caption', 'image', 'user', 'author',
            'likes_count', 'comments_count', 'likes', 'is_liked',
            'comments', 'created_at', 'createdAt'
        ]

    def get__id(self, obj):
        return str(obj.id)

    def get_image(self, obj):
        if obj.image_url:
            return obj.image_url
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return ""

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_likes(self, obj):
        return list(obj.likes.values_list('user_id', flat=True))

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
