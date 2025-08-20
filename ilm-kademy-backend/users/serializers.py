"""
User serializers for API endpoints.
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Profile

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm', 'role']
        extra_kwargs = {
            'role': {'required': False}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Create profile
        Profile.objects.create(user=user)
        return user

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information.
    """
    profile = serializers.SerializerMethodField()
    memberships = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'avatar', 'profile', 'memberships']
        read_only_fields = ['id', 'email', 'role']
    
    def get_profile(self, obj):
        if hasattr(obj, 'profile'):
            return {
                'phone': obj.profile.phone,
                'locale': obj.profile.locale,
                'timezone': obj.profile.timezone,
                'bio': obj.profile.bio,
                'date_of_birth': obj.profile.date_of_birth,
            }
        return None
    
    def get_memberships(self, obj):
        # This will be populated by the view
        return getattr(obj, 'memberships_data', [])

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    """
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    
    class Meta:
        model = Profile
        fields = ['phone', 'locale', 'timezone', 'bio', 'date_of_birth']
    
    def update(self, instance, validated_data):
        # Update user fields
        user_data = {}
        for field in ['first_name', 'last_name']:
            if field in validated_data:
                user_data[field] = validated_data.pop(field)
        
        if user_data:
            instance.user.__class__.objects.filter(id=instance.user.id).update(**user_data)
        
        return super().update(instance, validated_data)

class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change.
    """
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect')
        return value 