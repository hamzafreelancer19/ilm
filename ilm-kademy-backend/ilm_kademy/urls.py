"""
URL configuration for ilm_kademy project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('core.urls')),
    path('api/v1/auth/', include('users.urls')),
    path('api/v1/auth/', include('core.urls')),  # Include JWT endpoints
    path('api/v1/institutes/', include('institutes.urls')),
    path('api/v1/books/', include('books.urls')),
    path('api/v1/quizzes/', include('quizzes.urls')),
    path('api/v1/assignments/', include('assignments.urls')),
    path('api/v1/ai/', include('ai_assistant.urls')),
    path('api/v1/subscriptions/', include('subscriptions.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 