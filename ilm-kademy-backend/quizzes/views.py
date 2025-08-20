"""
Quizzes views for CRUD operations.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from django.db import models

from .models import Quiz, Question, QuizAttempt
from .serializers import (
    QuizSerializer, QuizDetailSerializer, QuestionSerializer,
    QuizAttemptSerializer, QuizResultsSerializer
)

class QuizListView(generics.ListCreateAPIView):
    """
    List all quizzes or create a new one.
    """
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        try:
            if user.is_super_admin():
                return Quiz.objects.all()
            elif user.is_teacher():
                # Teachers can see quizzes they created and quizzes from their institutes
                return Quiz.objects.filter(
                    models.Q(created_by=user) |
                    models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN', 'TEACHER'])
                )
            else:
                # Students can see published quizzes from their institutes
                return Quiz.objects.filter(
                    is_published=True,
                    institute__memberships__user=user,
                    institute__memberships__status='ACTIVE'
                )
        except Exception as e:
            # Log the error and return empty queryset
            print(f"Error in QuizListView.get_queryset: {e}")
            return Quiz.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class QuizCreateView(generics.CreateAPIView):
    """
    Create a new quiz.
    """
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a quiz.
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Quiz.objects.all()
        elif user.is_teacher():
            return Quiz.objects.filter(
                models.Q(created_by=user) |
                models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN', 'TEACHER'])
            )
        else:
            return Quiz.objects.filter(
                is_published=True,
                institute__memberships__user=user,
                institute__memberships__status='ACTIVE'
            )

class QuizUpdateView(generics.UpdateAPIView):
    """
    Update a quiz.
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Quiz.objects.all()
        elif user.is_teacher():
            return Quiz.objects.filter(
                models.Q(created_by=user) |
                models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN', 'TEACHER'])
            )
        else:
            return Quiz.objects.filter(
                is_published=True,
                institute__memberships__user=user,
                institute__memberships__status='ACTIVE'
            )

class QuestionListView(generics.ListCreateAPIView):
    """
    List all questions of a quiz or create a new one.
    """
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        quiz_id = self.kwargs['pk']
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        
        # Check if user has access to this quiz
        user = self.request.user
        if not user.is_super_admin():
            if quiz.created_by != user and not quiz.institute:
                raise PermissionDenied("You don't have access to this quiz")
            elif quiz.institute:
                membership = get_object_or_404(
                    'institutes.Membership',
                    user=user,
                    institute=quiz.institute,
                    role__in=['OWNER', 'ADMIN', 'TEACHER'],
                    status='ACTIVE'
                )
        
        return Question.objects.filter(quiz=quiz)
    
    def perform_create(self, serializer):
        quiz_id = self.kwargs['pk']
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        serializer.save(quiz=quiz)

class QuestionCreateView(generics.CreateAPIView):
    """
    Create a new question.
    """
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        quiz_id = self.kwargs['pk']
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        serializer.save(quiz=quiz)

class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a question.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        quiz_id = self.kwargs['pk']
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        
        # Check if user has access to this quiz
        user = self.request.user
        if not user.is_super_admin():
            if quiz.created_by != user and not quiz.institute:
                raise PermissionDenied("You don't have access to this quiz")
            elif quiz.institute:
                membership = get_object_or_404(
                    'institutes.Membership',
                    user=user,
                    institute=quiz.institute,
                    role__in=['OWNER', 'ADMIN', 'TEACHER'],
                    status='ACTIVE'
                )
        
        return Question.objects.filter(quiz=quiz)

class QuestionUpdateView(generics.UpdateAPIView):
    """
    Update a question.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        quiz_id = self.kwargs['pk']
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        
        # Check if user has access to this quiz
        user = self.request.user
        if not user.is_super_admin():
            if quiz.created_by != user and not quiz.institute:
                raise PermissionDenied("You don't have access to this quiz")
            elif quiz.institute:
                membership = get_object_or_404(
                    'institutes.Membership',
                    user=user,
                    institute=quiz.institute,
                    role__in=['OWNER', 'ADMIN', 'TEACHER'],
                    status='ACTIVE'
                )
        
        return Question.objects.filter(quiz=quiz)

class StartQuizAttemptView(generics.CreateAPIView):
    """
    Start a new quiz attempt.
    """
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        quiz_id = self.kwargs['pk']
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        
        # Check if user can take this quiz
        user = request.user
        if not user.is_super_admin():
            if quiz.created_by != user and not quiz.institute:
                raise PermissionDenied("You don't have access to this quiz")
            elif quiz.institute:
                membership = get_object_or_404(
                    'institutes.Membership',
                    user=user,
                    institute=quiz.institute,
                    status='ACTIVE'
                )
        
        # Check if user already has an active attempt
        active_attempt = QuizAttempt.objects.filter(
            user=user,
            quiz=quiz,
            status='IN_PROGRESS'
        ).first()
        
        if active_attempt:
            return Response(
                {'error': 'You already have an active attempt for this quiz'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create new attempt
        attempt = QuizAttempt.objects.create(
            user=user,
            quiz=quiz,
            started_at=timezone.now()
        )
        
        serializer = self.get_serializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SubmitQuizView(generics.UpdateAPIView):
    """
    Submit a quiz attempt.
    """
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        attempt = self.get_object()
        
        if attempt.user != request.user:
            return Response(
                {'error': 'You can only submit your own attempts'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if attempt.status != 'IN_PROGRESS':
            return Response(
                {'error': 'This attempt has already been submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate score
        answers = request.data.get('answers', {})
        score = self.calculate_score(attempt.quiz, answers)
        
        # Update attempt
        attempt.answers = answers
        attempt.score = score
        attempt.status = 'COMPLETED'
        attempt.completed_at = timezone.now()
        attempt.save()
        
        serializer = self.get_serializer(attempt)
        return Response(serializer.data)
    
    def calculate_score(self, quiz, answers):
        """
        Calculate quiz score based on answers.
        """
        total_questions = quiz.questions.count()
        if total_questions == 0:
            return 0
        
        correct_answers = 0
        for question in quiz.questions.all():
            question_id = str(question.id)
            if question_id in answers:
                user_answer = answers[question_id]
                if question.is_correct_answer(user_answer):
                    correct_answers += 1
        
        return (correct_answers / total_questions) * 100
    
    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)

class QuizAttemptListView(generics.ListAPIView):
    """
    List quiz attempts for the current user.
    """
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)

class QuizAttemptDetailView(generics.RetrieveAPIView):
    """
    Retrieve a quiz attempt.
    """
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)

class QuizResultsView(generics.RetrieveAPIView):
    """
    Retrieve quiz results.
    """
    serializer_class = QuizResultsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user) 