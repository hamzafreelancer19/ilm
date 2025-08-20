"""
Notifications app URL configuration.
"""
from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('mark-all-read/', views.MarkAllAsReadView.as_view(), name='mark-all-read'),
    path('announcements/', views.AnnouncementListView.as_view(), name='announcement-list'),
    path('preferences/', views.NotificationPreferenceListView.as_view(), name='preference-list'),
    path('preferences/<int:pk>/', views.NotificationPreferenceDetailView.as_view(), name='preference-detail'),
] 