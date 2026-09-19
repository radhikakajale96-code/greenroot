from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(source='date_joined', read_only=True)
    _id = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', '_id', 'name', 'email', 'avatar', 'provider', 'is_staff', 'role', 'created_at', 'date_joined']
        read_only_fields = ['id', '_id', 'provider', 'is_staff', 'role', 'created_at', 'date_joined']

    def get__id(self, obj):
        return str(obj.id)

    def get_role(self, obj):
        return 'admin' if obj.is_staff else 'user'

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    avatar = serializers.URLField(required=False, allow_blank=True)

    def validate_email(self, value):
        email_lower = value.lower().strip()
        if User.objects.filter(email__iexact=email_lower).exists():
            raise serializers.ValidationError("Email is already registered.")
        return email_lower

    def create(self, validated_data):
        name = validated_data.get('name', '').strip()
        name_parts = name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        username = validated_data['email'].split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
            avatar=validated_data.get('avatar') or None,
            provider='local'
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
