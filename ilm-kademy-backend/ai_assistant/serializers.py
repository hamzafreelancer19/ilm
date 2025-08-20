"""
Serializers for the AI assistant app.
"""
from rest_framework import serializers
from .models import AIConversation, AIMessage, GrammarCheck, QuizSuggestion

class AIMessageSerializer(serializers.ModelSerializer):
    """
    Serializer for AIMessage model.
    """
    class Meta:
        model = AIMessage
        fields = [
            'id', 'conversation', 'content', 'message_type', 'metadata',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class AIConversationSerializer(serializers.ModelSerializer):
    """
    Serializer for AIConversation model.
    """
    messages = AIMessageSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = AIConversation
        fields = [
            'id', 'user', 'user_name', 'title', 'context_type', 'context_id',
            'created_at', 'updated_at', 'messages'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class GrammarCheckSerializer(serializers.ModelSerializer):
    """
    Serializer for GrammarCheck model.
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = GrammarCheck
        fields = [
            'id', 'user', 'user_name', 'original_text', 'corrected_text',
            'suggestions', 'language', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']

class QuizSuggestionSerializer(serializers.ModelSerializer):
    """
    Serializer for QuizSuggestion model.
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = QuizSuggestion
        fields = [
            'id', 'user', 'user_name', 'source_text', 'suggested_questions',
            'subject', 'difficulty', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at'] 