"""
Serializers for the notifications app.
"""
from rest_framework import serializers
from .models import Notification, Announcement, NotificationPreference

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model.
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_name', 'title', 'message', 'notification_type',
            'is_read', 'created_at', 'metadata'
        ]
        read_only_fields = ['id', 'user', 'created_at']

class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Serializer for Announcement model.
    """
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'announcement_type', 'target_audience',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationPreference model.
    """
    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'user', 'notification_type', 'email_enabled', 'push_enabled',
            'sms_enabled', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at'] 