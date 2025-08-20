"""
Management command to add sample quizzes data.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from quizzes.models import Quiz, Question, QuestionOption
from users.models import User
from institutes.models import Institute

User = get_user_model()

class Command(BaseCommand):
    help = 'Add sample quizzes related to English books'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample quizzes...')
        
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
                
            # Get some books to associate quizzes with
            # books = Book.objects.filter(subject='ENGLISH')[:3]
            # if not books.exists():
            #     self.stdout.write('No English books found. Please run add_sample_books first.')
            #     return
                
        except Exception as e:
            self.stdout.write(f'Error: {e}')
            return

        # Sample quizzes data
        quizzes_data = [
            {
                'title': 'Parts of Speech Quiz',
                'description': 'Test your knowledge of English parts of speech with this comprehensive quiz.',
                'chapter': None,
                'time_limit': 30,
                'passing_score': 70,
                'questions': [
                    {
                        'text': 'Which of the following is a noun?',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 10,
                        'options': [
                            {'text': 'run', 'is_correct': False},
                            {'text': 'quickly', 'is_correct': False},
                            {'text': 'beautiful', 'is_correct': False},
                            {'text': 'happiness', 'is_correct': True}
                        ]
                    },
                    {
                        'text': 'What part of speech describes a noun?',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 10,
                        'options': [
                            {'text': 'Verb', 'is_correct': False},
                            {'text': 'Adjective', 'is_correct': True},
                            {'text': 'Adverb', 'is_correct': False},
                            {'text': 'Preposition', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Identify the verb in the sentence: "The cat sleeps peacefully."',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 10,
                        'options': [
                            {'text': 'cat', 'is_correct': False},
                            {'text': 'sleeps', 'is_correct': True},
                            {'text': 'peacefully', 'is_correct': False},
                            {'text': 'the', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Essay Writing Quiz',
                'description': 'Test your knowledge of essay structure and writing techniques.',
                'chapter': None,
                'time_limit': 45,
                'passing_score': 75,
                'questions': [
                    {
                        'text': 'What are the three main parts of an essay?',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 15,
                        'options': [
                            {'text': 'Beginning, Middle, End', 'is_correct': False},
                            {'text': 'Introduction, Body, Conclusion', 'is_correct': True},
                            {'text': 'Title, Content, Summary', 'is_correct': False},
                            {'text': 'Opening, Main, Closing', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Where should you place your thesis statement?',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 15,
                        'options': [
                            {'text': 'In the conclusion', 'is_correct': False},
                            {'text': 'In the body paragraphs', 'is_correct': False},
                            {'text': 'In the introduction', 'is_correct': True},
                            {'text': 'At the end of the essay', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the purpose of topic sentences?',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 15,
                        'options': [
                            {'text': 'To introduce the essay', 'is_correct': False},
                            {'text': 'To start each body paragraph with a main idea', 'is_correct': True},
                            {'text': 'To conclude the essay', 'is_correct': False},
                            {'text': 'To list references', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Shakespeare Literature Quiz',
                'description': 'Test your knowledge of Shakespeare\'s works and literary devices.',
                'chapter': None,
                'time_limit': 40,
                'passing_score': 80,
                'questions': [
                    {
                        'text': 'Which play features the famous balcony scene?',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 20,
                        'options': [
                            {'text': 'Macbeth', 'is_correct': False},
                            {'text': 'Romeo and Juliet', 'is_correct': True},
                            {'text': 'Hamlet', 'is_correct': False},
                            {'text': 'Othello', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is iambic pentameter?',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 20,
                        'options': [
                            {'text': 'A type of rhyme scheme', 'is_correct': False},
                            {'text': 'A metrical pattern of five iambs per line', 'is_correct': True},
                            {'text': 'A dramatic technique', 'is_correct': False},
                            {'text': 'A character type', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a soliloquy?',
                        'question_type': 'MULTIPLE_CHOICE',
                        'points': 20,
                        'options': [
                            {'text': 'A conversation between two characters', 'is_correct': False},
                            {'text': 'A speech given by a character alone on stage', 'is_correct': True},
                            {'text': 'A type of stage direction', 'is_correct': False},
                            {'text': 'A chorus song', 'is_correct': False}
                        ]
                    }
                ]
            }
        ]

        # Create quizzes and questions
        for quiz_data in quizzes_data:
            # Create quiz
            quiz, created = Quiz.objects.get_or_create(
                title=quiz_data['title'],
                defaults={
                    'description': quiz_data['description'],
                    'chapter': quiz_data['chapter'],
                    'time_limit': quiz_data['time_limit'],
                    'passing_score': quiz_data['passing_score'],
                    'created_by': user,
                    'institute': institute,
                    'is_active': True
                }
            )
            
            if created:
                self.stdout.write(f'Created quiz: {quiz.title}')
                
                # Create questions
                for question_index, question_data in enumerate(quiz_data['questions'], 1):
                    question, created = Question.objects.get_or_create(
                        quiz=quiz,
                        text=question_data['text'],
                        defaults={
                            'question_type': question_data['question_type'],
                            'points': question_data['points'],
                            'order': question_index
                        }
                    )
                    
                    if created:
                        self.stdout.write(f'  Created question: {question.text[:50]}...')
                        
                        # Create options
                        for option_index, option_data in enumerate(question_data['options'], 1):
                            option, created = QuestionOption.objects.get_or_create(
                                question=question,
                                text=option_data['text'],
                                defaults={
                                    'is_correct': option_data['is_correct'],
                                    'order': option_index
                                }
                            )
                            
                            if created:
                                self.stdout.write(f'    Created option: {option.text}')
            else:
                self.stdout.write(f'Quiz already exists: {quiz.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample quizzes!')
        ) 