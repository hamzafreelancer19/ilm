"""
Serializers for the quizzes app.
"""
from rest_framework import serializers
from .models import Quiz, Question, QuizAttempt, QuizAnswer, QuestionOption

class QuestionOptionSerializer(serializers.ModelSerializer):
    """
    Serializer for QuestionOption model.
    """
    class Meta:
        model = QuestionOption
        fields = ['id', 'text', 'is_correct', 'order']

class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for Question model.
    """
    options = QuestionOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = [
            'id', 'quiz', 'text', 'question_type', 'options', 
            'points', 'order', 'is_active'
        ]
        read_only_fields = ['id']

class QuizSerializer(serializers.ModelSerializer):
    """
    Basic serializer for Quiz model.
    """
    question_count = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'chapter', 'institute', 'time_limit',
            'passing_score', 'is_active', 'created_by', 'created_by_name',
            'created_at', 'updated_at', 'question_count'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_question_count(self, obj):
        return obj.questions.filter(is_active=True).count()

class QuizDetailSerializer(QuizSerializer):
    """
    Detailed serializer for Quiz model including questions.
    """
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta(QuizSerializer.Meta):
        fields = QuizSerializer.Meta.fields + ['questions']

class QuizAttemptSerializer(serializers.ModelSerializer):
    """
    Serializer for QuizAttempt model.
    """
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'quiz_title', 'user', 'user_name', 'started_at',
            'completed_at', 'score', 'max_score', 'percentage', 'passed', 'status'
        ]
        read_only_fields = ['id', 'user', 'started_at', 'completed_at', 'score', 'max_score', 'percentage', 'passed']

class QuizResultsSerializer(serializers.ModelSerializer):
    """
    Serializer for quiz results.
    """
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    total_questions = serializers.SerializerMethodField()
    correct_answers = serializers.SerializerMethodField()
    accuracy_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'quiz_title', 'user', 'user_name', 'started_at',
            'completed_at', 'score', 'max_score', 'percentage', 'passed',
            'total_questions', 'correct_answers', 'accuracy_percentage', 'status'
        ]
    
    def get_total_questions(self, obj):
        return obj.quiz.questions.filter(is_active=True).count()
    
    def get_correct_answers(self, obj):
        if hasattr(obj, 'answers'):
            return obj.answers.filter(is_correct=True).count()
        return 0
    
    def get_accuracy_percentage(self, obj):
        if obj.max_score and obj.max_score > 0:
            return round((obj.score / obj.max_score) * 100, 2) if obj.score else 0
        return 0 