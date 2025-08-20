"""
Notifications views for managing user notifications.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Notification, Announcement, NotificationPreference
from .serializers import (
    NotificationSerializer, AnnouncementSerializer, NotificationPreferenceSerializer
)

class NotificationListView(generics.ListAPIView):
    """
    List all notifications for the current user.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class NotificationDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a notification.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    def patch(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

class MarkAllAsReadView(generics.UpdateAPIView):
    """
    Mark all notifications as read for the current user.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

class AnnouncementListView(generics.ListAPIView):
    """
    List all active announcements.
    """
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Announcement.objects.filter(is_active=True).order_by('-created_at')

class NotificationPreferenceListView(generics.ListCreateAPIView):
    """
    List or create notification preferences for the current user.
    """
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return NotificationPreference.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NotificationPreferenceDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update notification preferences.
    """
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return NotificationPreference.objects.filter(user=self.request.user) 