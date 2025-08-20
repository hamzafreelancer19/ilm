"""
Books views for CRUD operations.
"""
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.core.exceptions import PermissionDenied

from .models import Book, Chapter, ChapterSection, Tag, ReadingProgress
from .serializers import (
    BookSerializer, BookDetailSerializer, ChapterSerializer, 
    ChapterSectionSerializer, TagSerializer, ReadingProgressSerializer
)

class BookListView(generics.ListCreateAPIView):
    """
    List all books or create a new one.
    """
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject', 'language', 'level', 'visibility', 'is_published']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Book.objects.all()
        elif user.is_institute_admin():
            # Institute admins can see their institute's books and public books
            return Book.objects.filter(
                models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN']) |
                models.Q(visibility='PUBLIC')
            )
        else:
            # Regular users can see public books and books from their institutes
            return Book.objects.filter(
                models.Q(visibility='PUBLIC') |
                models.Q(institute__memberships__user=user, institute__memberships__status='ACTIVE')
            )
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BookCreateView(generics.CreateAPIView):
    """
    Create a new book.
    """
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a book.
    """
    queryset = Book.objects.all()
    serializer_class = BookDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Book.objects.all()
        elif user.is_institute_admin():
            return Book.objects.filter(
                models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN']) |
                models.Q(visibility='PUBLIC')
            )
        else:
            return Book.objects.filter(
                models.Q(visibility='PUBLIC') |
                models.Q(institute__memberships__user=user, institute__memberships__status='ACTIVE')
            )

class BookUpdateView(generics.UpdateAPIView):
    """
    Update a book.
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Book.objects.all()
        elif user.is_institute_admin():
            return Book.objects.filter(
                models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN']) |
                models.Q(visibility='PUBLIC')
            )
        else:
            return Book.objects.filter(
                models.Q(visibility='PUBLIC') |
                models.Q(institute__memberships__user=user, institute__memberships__status='ACTIVE')
            )

class ChapterListView(generics.ListCreateAPIView):
    """
    List all chapters of a book or create a new one.
    """
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        book_id = self.kwargs['pk']
        book = get_object_or_404(Book, pk=book_id)
        
        # Check if user has access to this book
        user = self.request.user
        if not user.is_super_admin():
            if book.visibility == 'PRIVATE':
                # Check if user is the creator or has institute access
                if book.created_by != user and not book.institute:
                    raise PermissionDenied("You don't have access to this book")
                elif book.institute:
                    membership = get_object_or_404(
                        'institutes.Membership',
                        user=user,
                        institute=book.institute,
                        status='ACTIVE'
                    )
        
        return Chapter.objects.filter(book=book)
    
    def perform_create(self, serializer):
        book_id = self.kwargs['pk']
        book = get_object_or_404(Book, pk=book_id)
        serializer.save(book=book)

class ChapterCreateView(generics.CreateAPIView):
    """
    Create a new chapter.
    """
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        book_id = self.kwargs['pk']
        book = get_object_or_404(Book, pk=book_id)
        serializer.save(book=book)

class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a chapter.
    """
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        book_id = self.kwargs['pk']
        book = get_object_or_404(Book, pk=book_id)
        
        # Check if user has access to this book
        user = self.request.user
        if not user.is_super_admin():
            if book.visibility == 'PRIVATE':
                if book.created_by != user and not book.institute:
                    raise PermissionDenied("You don't have access to this book")
                elif book.institute:
                    membership = get_object_or_404(
                        'institutes.Membership',
                        user=user,
                        institute=book.institute,
                        status='ACTIVE'
                    )
        
        return Chapter.objects.filter(book=book)

class ChapterUpdateView(generics.UpdateAPIView):
    """
    Update a chapter.
    """
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        book_id = self.kwargs['pk']
        book = get_object_or_404(Book, pk=book_id)
        
        # Check if user has access to this book
        user = self.request.user
        if not user.is_super_admin():
            if book.visibility == 'PRIVATE':
                if book.created_by != user and not book.institute:
                    raise PermissionDenied("You don't have access to this book")
                elif book.institute:
                    membership = get_object_or_404(
                        'institutes.Membership',
                        user=user,
                        institute=book.institute,
                        status='ACTIVE'
                    )
        
        return Chapter.objects.filter(book=book)

class ChapterSectionListView(generics.ListCreateAPIView):
    """
    List all sections of a chapter or create a new one.
    """
    serializer_class = ChapterSectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        book_id = self.kwargs['pk']
        chapter_pk = self.kwargs['chapter_pk']
        chapter = get_object_or_404(Chapter, pk=chapter_pk, book_id=book_id)
        
        # Check if user has access to this chapter
        user = self.request.user
        if not user.is_super_admin():
            book = chapter.book
            if book.visibility == 'PRIVATE':
                if book.created_by != user and not book.institute:
                    raise PermissionDenied("You don't have access to this book")
                elif book.institute:
                    membership = get_object_or_404(
                        'institutes.Membership',
                        user=user,
                        institute=book.institute,
                        status='ACTIVE'
                    )
        
        return ChapterSection.objects.filter(chapter=chapter)
    
    def perform_create(self, serializer):
        book_id = self.kwargs['pk']
        chapter_pk = self.kwargs['chapter_pk']
        chapter = get_object_or_404(Chapter, pk=chapter_pk, book_id=book_id)
        serializer.save(chapter=chapter)

class ChapterSectionCreateView(generics.CreateAPIView):
    """
    Create a new chapter section.
    """
    serializer_class = ChapterSectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        book_id = self.kwargs['pk']
        chapter_pk = self.kwargs['chapter_pk']
        chapter = get_object_or_404(Chapter, pk=chapter_pk, book_id=book_id)
        serializer.save(chapter=chapter)

class ChapterSectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a chapter section.
    """
    queryset = ChapterSection.objects.all()
    serializer_class = ChapterSectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        book_id = self.kwargs['pk']
        chapter_pk = self.kwargs['chapter_pk']
        chapter = get_object_or_404(Chapter, pk=chapter_pk, book_id=book_id)
        
        # Check if user has access to this chapter
        user = self.request.user
        if not user.is_super_admin():
            book = chapter.book
            if book.visibility == 'PRIVATE':
                if book.created_by != user and not book.institute:
                    raise PermissionDenied("You don't have access to this book")
                elif book.institute:
                    membership = get_object_or_404(
                        'institutes.Membership',
                        user=user,
                        institute=book.institute,
                        status='ACTIVE'
                    )
        
        return ChapterSection.objects.filter(chapter=chapter)

class ChapterSectionUpdateView(generics.UpdateAPIView):
    """
    Update a chapter section.
    """
    queryset = ChapterSection.objects.all()
    serializer_class = ChapterSectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        book_id = self.kwargs['pk']
        chapter_pk = self.kwargs['chapter_pk']
        chapter = get_object_or_404(Chapter, pk=chapter_pk, book_id=book_id)
        
        # Check if user has access to this chapter
        user = self.request.user
        if not user.is_super_admin():
            book = chapter.book
            if book.visibility == 'PRIVATE':
                if book.created_by != user and not book.institute:
                    raise PermissionDenied("You don't have access to this book")
                elif book.institute:
                    membership = get_object_or_404(
                        'institutes.Membership',
                        user=user,
                        institute=book.institute,
                        status='ACTIVE'
                    )
        
        return ChapterSection.objects.filter(chapter=chapter)

class TagListView(generics.ListCreateAPIView):
    """
    List all tags or create a new one.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class TagCreateView(generics.CreateAPIView):
    """
    Create a new tag.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReadingProgressListView(generics.ListAPIView):
    """
    List reading progress for the current user.
    """
    serializer_class = ReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ReadingProgress.objects.filter(user=self.request.user)

class ReadingProgressDetailView(generics.RetrieveAPIView):
    """
    Retrieve reading progress.
    """
    serializer_class = ReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ReadingProgress.objects.filter(user=self.request.user)

class ReadingProgressUpdateView(generics.UpdateAPIView):
    """
    Update reading progress.
    """
    serializer_class = ReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ReadingProgress.objects.filter(user=self.request.user) 