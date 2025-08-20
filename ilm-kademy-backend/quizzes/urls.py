"""
Quizzes app URL configuration.
"""
from django.urls import path
from . import views

app_name = 'quizzes'

urlpatterns = [
    path('', views.QuizListView.as_view(), name='quiz-list'),
    path('create/', views.QuizCreateView.as_view(), name='quiz-create'),
    path('<int:pk>/', views.QuizDetailView.as_view(), name='quiz-detail'),
    path('<int:pk>/update/', views.QuizUpdateView.as_view(), name='quiz-update'),
    path('<int:pk>/questions/', views.QuestionListView.as_view(), name='question-list'),
    path('<int:pk>/questions/create/', views.QuestionCreateView.as_view(), name='question-create'),
    path('<int:pk>/questions/<int:question_pk>/', views.QuestionDetailView.as_view(), name='question-detail'),
    path('<int:pk>/questions/<int:question_pk>/update/', views.QuestionUpdateView.as_view(), name='question-update'),
    path('<int:pk>/attempt/', views.StartQuizAttemptView.as_view(), name='start-attempt'),
    path('<int:pk>/submit/', views.SubmitQuizView.as_view(), name='submit-quiz'),
    path('attempts/', views.QuizAttemptListView.as_view(), name='attempt-list'),
    path('attempts/<int:pk>/', views.QuizAttemptDetailView.as_view(), name='attempt-detail'),
    path('attempts/<int:pk>/results/', views.QuizResultsView.as_view(), name='attempt-results'),
] 