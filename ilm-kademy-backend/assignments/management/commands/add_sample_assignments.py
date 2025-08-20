"""
Management command to add sample assignments data.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from assignments.models import Assignment, AssignmentSubmission
from books.models import Book, Chapter
from users.models import User
from institutes.models import Institute

class Command(BaseCommand):
    help = 'Add sample assignments related to English books'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample assignments...')
        
        # Get existing user, institute and books
        try:
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                self.stdout.write('No superuser found. Please create one first.')
                return
                
            institute = Institute.objects.filter(name='Ilm Kademy').first()
            if not institute:
                self.stdout.write('Institute not found. Please run add_sample_books first.')
                return
                
            # Get some books to associate assignments with
            books = Book.objects.filter(subject='ENGLISH')[:3]
            if not books.exists():
                self.stdout.write('No English books found. Please run add_sample_books first.')
                return
                
        except Exception as e:
            self.stdout.write(f'Error: {e}')
            return

        # Sample assignments data
        assignments_data = [
            {
                'title': 'Parts of Speech Analysis',
                'description': 'Analyze a paragraph and identify all parts of speech. Write a brief explanation of how each word functions in the sentence.',
                'chapter': None,
                'due_date': timezone.now() + timedelta(days=7),
                'max_points': 100
            },
            {
                'title': 'Essay Writing: My Learning Journey',
                'description': 'Write a 500-word essay about your English learning experience. Use proper essay structure with introduction, body paragraphs, and conclusion.',
                'chapter': None,
                'due_date': timezone.now() + timedelta(days=14),
                'max_points': 150
            },
            {
                'title': 'Shakespeare Character Analysis',
                'description': 'Choose a character from Romeo and Juliet or Macbeth and write a character analysis essay. Discuss their motivations, development, and role in the story.',
                'chapter': None,
                'due_date': timezone.now() + timedelta(days=21),
                'max_points': 200
            },
            {
                'title': 'Poetry Analysis',
                'description': 'Select a modern poem and analyze its themes, poetic devices, and meaning. Write a 300-word analysis focusing on imagery and symbolism.',
                'chapter': None,
                'due_date': timezone.now() + timedelta(days=10),
                'max_points': 120
            },
            {
                'title': 'Research Paper Outline',
                'description': 'Create a detailed outline for a research paper on any topic of your choice. Include thesis statement, main points, and supporting evidence structure.',
                'chapter': None,
                'due_date': timezone.now() + timedelta(days=5),
                'max_points': 80
            }
        ]

        # Create assignments
        for assignment_data in assignments_data:
            assignment, created = Assignment.objects.get_or_create(
                title=assignment_data['title'],
                defaults={
                    'description': assignment_data['description'],
                    'chapter': assignment_data['chapter'],
                    'due_date': assignment_data['due_date'],
                    'max_points': assignment_data['max_points'],
                    'created_by': user,
                    'institute': institute
                }
            )
            
            if created:
                self.stdout.write(f'Created assignment: {assignment.title}')
            else:
                self.stdout.write(f'Assignment already exists: {assignment.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample assignments!')
        ) 