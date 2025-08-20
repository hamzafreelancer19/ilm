"""
AI Assistant app URL configuration.
"""
from django.urls import path
from . import views

app_name = 'ai_assistant'

urlpatterns = [
    path('conversations/', views.AIConversationListView.as_view(), name='ai-conversation-list'),
    path('conversations/<int:pk>/', views.AIConversationDetailView.as_view(), name='ai-conversation-detail'),
    path('conversations/<int:conversation_id>/messages/', views.AIMessageListView.as_view(), name='ai-message-list'),
    path('grammar-check/', views.GrammarCheckCreateView.as_view(), name='grammar-check'),
    path('grammar-check/list/', views.GrammarCheckListView.as_view(), name='grammar-check-list'),
    path('quiz-suggestions/', views.QuizSuggestionCreateView.as_view(), name='quiz-suggestions'),
    path('quiz-suggestions/list/', views.QuizSuggestionListView.as_view(), name='quiz-suggestions-list'),
] 