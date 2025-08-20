"""
AI Assistant views for chat, grammar check, and quiz suggestions.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import AIConversation, AIMessage, GrammarCheck, QuizSuggestion
from .serializers import (
    AIConversationSerializer, AIMessageSerializer,
    GrammarCheckSerializer, QuizSuggestionSerializer
)

class AIConversationListView(generics.ListCreateAPIView):
    """
    List all AI conversations or create a new one.
    """
    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AIConversation.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AIConversationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an AI conversation.
    """
    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AIConversation.objects.filter(user=self.request.user)

class AIMessageListView(generics.ListCreateAPIView):
    """
    List all messages in an AI conversation or create a new one.
    """
    serializer_class = AIMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        conversation = get_object_or_404(AIConversation, pk=self.kwargs['conversation_id'], user=self.request.user)
        return AIMessage.objects.filter(conversation=conversation)
    
    def perform_create(self, serializer):
        conversation = get_object_or_404(AIConversation, pk=self.kwargs['conversation_id'], user=self.request.user)
        serializer.save(conversation=conversation)
        # TODO: Integrate with AI service for response generation

class GrammarCheckCreateView(generics.CreateAPIView):
    """
    Create a new grammar check request.
    """
    serializer_class = GrammarCheckSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # TODO: Integrate with AI service for grammar checking
        serializer.save(user=self.request.user)

class GrammarCheckListView(generics.ListAPIView):
    """
    List all grammar checks for the current user.
    """
    serializer_class = GrammarCheckSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return GrammarCheck.objects.filter(user=self.request.user)

class QuizSuggestionCreateView(generics.CreateAPIView):
    """
    Create a new quiz suggestion request.
    """
    serializer_class = QuizSuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # TODO: Integrate with AI service for quiz suggestions
        serializer.save(user=self.request.user)

class QuizSuggestionListView(generics.ListAPIView):
    """
    List all quiz suggestions for the current user.
    """
    serializer_class = QuizSuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return QuizSuggestion.objects.filter(user=self.request.user) 