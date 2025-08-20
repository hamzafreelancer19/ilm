"""
Books app URL configuration.
"""
from django.urls import path
from . import views

app_name = 'books'

urlpatterns = [
    path('', views.BookListView.as_view(), name='book-list'),
    path('create/', views.BookCreateView.as_view(), name='book-create'),
    path('<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    path('<int:pk>/update/', views.BookUpdateView.as_view(), name='book-update'),
    path('<int:pk>/chapters/', views.ChapterListView.as_view(), name='chapter-list'),
    path('<int:pk>/chapters/create/', views.ChapterCreateView.as_view(), name='chapter-create'),
    path('<int:pk>/chapters/<int:chapter_pk>/', views.ChapterDetailView.as_view(), name='chapter-detail'),
    path('<int:pk>/chapters/<int:chapter_pk>/update/', views.ChapterUpdateView.as_view(), name='chapter-update'),
    path('<int:pk>/chapters/<int:chapter_pk>/sections/', views.ChapterSectionListView.as_view(), name='section-list'),
    path('<int:pk>/chapters/<int:chapter_pk>/sections/create/', views.ChapterSectionCreateView.as_view(), name='section-create'),
    path('<int:pk>/chapters/<int:chapter_pk>/sections/<int:section_pk>/', views.ChapterSectionDetailView.as_view(), name='section-detail'),
    path('<int:pk>/chapters/<int:chapter_pk>/sections/<int:section_pk>/update/', views.ChapterSectionUpdateView.as_view(), name='section-update'),
    path('tags/', views.TagListView.as_view(), name='tag-list'),
    path('tags/create/', views.TagCreateView.as_view(), name='tag-create'),
    path('progress/', views.ReadingProgressListView.as_view(), name='progress-list'),
    path('progress/<int:pk>/', views.ReadingProgressDetailView.as_view(), name='progress-detail'),
    path('progress/<int:pk>/update/', views.ReadingProgressUpdateView.as_view(), name='progress-update'),
] 