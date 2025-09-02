"""
Management command to add sample English book chapters with the 13 required sections.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from books.models import Book, Chapter, ChapterSection
from institutes.models import Institute

User = get_user_model()

class Command(BaseCommand):
    help = 'Add sample English book chapters with the 13 required sections'

    def add_arguments(self, parser):
        parser.add_argument(
            '--book-id',
            type=int,
            help='ID of the book to add chapters to'
        )
        parser.add_argument(
            '--create-book',
            action='store_true',
            help='Create a new English book if none exists'
        )

    def handle(self, *args, **options):
        self.stdout.write('Starting to add English book chapters...')
        
        # Get or create a book
        book = None
        if options['book_id']:
            try:
                book = Book.objects.get(id=options['book_id'])
                if book.language != 'EN':
                    self.stdout.write(
                        self.style.ERROR(f'Book {book.id} is not an English book')
                    )
                    return
            except Book.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Book with ID {options["book_id"]} does not exist')
                )
                return
        elif options['create_book']:
            # Create a new English book
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                self.stdout.write(
                    self.style.ERROR('No superuser found to create book')
                )
                return
            
            institute = Institute.objects.first()
            
            book = Book.objects.create(
                title='Advanced English Communication Skills',
                subject='ENGLISH',
                language='EN',
                level='INTERMEDIATE',
                description='A comprehensive English course covering communication skills, vocabulary, grammar, and practical exercises.',
                created_by=user,
                institute=institute,
                is_published=True
            )
            self.stdout.write(
                self.style.SUCCESS(f'Created new English book: {book.title}')
            )
        else:
            # Try to find an existing English book
            book = Book.objects.filter(language='EN', is_published=True).first()
            if not book:
                self.stdout.write(
                    self.style.ERROR('No English book found. Use --create-book to create one.')
                )
                return
        
        self.stdout.write(f'Using book: {book.title}')
        
        # Create sample chapters
        chapters_data = [
            {
                'title': 'Effective Communication Fundamentals',
                'order': 1,
                'description': 'Learn the basics of effective communication in English, including verbal and non-verbal aspects.'
            },
            {
                'title': 'Advanced Vocabulary Building',
                'order': 2,
                'description': 'Expand your English vocabulary with advanced words, idioms, and phrasal verbs.'
            },
            {
                'title': 'Grammar Mastery',
                'order': 3,
                'description': 'Master essential English grammar concepts and their practical applications.'
            }
        ]
        
        for chapter_data in chapters_data:
            chapter, created = Chapter.objects.get_or_create(
                book=book,
                order=chapter_data['order'],
                defaults={
                    'title': chapter_data['title'],
                    'is_published': True
                }
            )
            
            if created:
                self.stdout.write(f'Created chapter: {chapter.title}')
            else:
                self.stdout.write(f'Chapter already exists: {chapter.title}')
            
            # Add the 13 required sections
            self._add_chapter_sections(chapter)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully added English book chapters with sections!')
        )

    def _add_chapter_sections(self, chapter):
        """Add the 13 required sections to a chapter."""
        sections_data = [
            {
                'kind': 'INTRODUCTION',
                'title': 'Introduction',
                'content': {
                    'text': f'Welcome to {chapter.title}. This chapter will provide you with comprehensive knowledge and practical skills.',
                    'overview': 'This chapter covers essential concepts and practical applications.',
                    'key_concepts': ['Communication', 'Language skills', 'Practical application']
                },
                'order': 1
            },
            {
                'kind': 'POINT_WISE_SUMMARY',
                'title': 'Point-wise Summary',
                'content': {
                    'points': [
                        'Understanding core concepts',
                        'Practical application methods',
                        'Key takeaways and insights'
                    ],
                    'main_ideas': ['Foundation building', 'Skill development', 'Real-world usage']
                },
                'order': 2
            },
            {
                'kind': 'SLOS',
                'title': 'Student Learning Objectives',
                'content': {
                    'objectives': [
                        'Understand fundamental principles',
                        'Apply concepts in practical scenarios',
                        'Develop critical thinking skills',
                        'Enhance communication abilities'
                    ],
                    'outcomes': ['Knowledge acquisition', 'Skill development', 'Confidence building']
                },
                'order': 3
            },
            {
                'kind': 'PRE_READING_QUESTIONS',
                'title': 'Pre-reading Questions',
                'content': {
                    'questions': [
                        'What do you already know about this topic?',
                        'How do you think this knowledge will be useful?',
                        'What challenges do you expect to face?'
                    ],
                    'purpose': 'These questions help prepare your mind for learning and connect new information with existing knowledge.'
                },
                'order': 4
            },
            {
                'kind': 'VOCABULARY_TEXT_TRANSLATION',
                'title': 'Vocabulary, Text & Translation',
                'content': {
                    'vocabulary': {
                        'communication': 'The act of sharing information',
                        'effective': 'Producing the desired result',
                        'fundamental': 'Basic and essential'
                    },
                    'text': 'This section contains the main content of the chapter with detailed explanations and examples.',
                    'translation': 'Translations will be provided for key concepts and phrases.'
                },
                'order': 5
            },
            {
                'kind': 'GLOSSARY',
                'title': 'Glossary',
                'content': {
                    'terms': {
                        'communication': 'The process of exchanging information',
                        'verbal': 'Relating to words or speech',
                        'non-verbal': 'Communication without words'
                    },
                    'definitions': {
                        'communication': 'The process of exchanging information, ideas, or feelings between people',
                        'verbal': 'Relating to words or speech, especially in contrast to non-verbal communication',
                        'non-verbal': 'Communication that occurs without the use of words, such as body language and gestures'
                    }
                },
                'order': 6
            },
            {
                'kind': 'EXERCISE_SHORT_QUESTIONS',
                'title': 'Exercise: Short Questions',
                'content': {
                    'questions': [
                        'What are the three main components of effective communication?',
                        'How does non-verbal communication complement verbal communication?',
                        'Why is active listening important in communication?'
                    ],
                    'answers': {
                        'What are the three main components of effective communication?': 'Verbal, non-verbal, and written communication',
                        'How does non-verbal communication complement verbal communication?': 'It reinforces, clarifies, and sometimes contradicts verbal messages',
                        'Why is active listening important in communication?': 'It ensures understanding and shows respect to the speaker'
                    }
                },
                'order': 7
            },
            {
                'kind': 'EXERCISE_OBJECTIVES',
                'title': 'Exercise: Objectives',
                'content': {
                    'questions': [
                        {
                            'question': 'Which of the following is NOT a component of effective communication?',
                            'options': ['Verbal', 'Non-verbal', 'Written', 'Telepathic'],
                            'correct_answer': 'Telepathic'
                        },
                        {
                            'question': 'True or False: Non-verbal communication is less important than verbal communication.',
                            'options': ['True', 'False'],
                            'correct_answer': 'False'
                        }
                    ],
                    'options': {},
                    'correct_answers': {}
                },
                'order': 8
            },
            {
                'kind': 'EXERCISE_VOCABULARY_GRAMMAR',
                'title': 'Exercise: Vocabulary and Grammar',
                'content': {
                    'vocabulary_exercises': [
                        'Match the word with its definition',
                        'Fill in the blanks with appropriate vocabulary',
                        'Create sentences using new words'
                    ],
                    'grammar_exercises': [
                        'Identify parts of speech',
                        'Correct grammar errors',
                        'Transform sentences using different structures'
                    ]
                },
                'order': 9
            },
            {
                'kind': 'EXERCISE_ORAL_COMMUNICATION',
                'title': 'Exercise: Oral Communication',
                'content': {
                    'speaking_activities': [
                        'Role-play communication scenarios',
                        'Practice pronunciation of key terms',
                        'Group discussion on chapter topics'
                    ],
                    'discussion_topics': [
                        'How has communication changed in the digital age?',
                        'What are the challenges of cross-cultural communication?',
                        'How can we improve our listening skills?'
                    ]
                },
                'order': 10
            },
            {
                'kind': 'EXERCISE_WRITING_SKILLS',
                'title': 'Exercise: Writing Skills',
                'content': {
                    'writing_prompts': [
                        'Write a paragraph explaining effective communication',
                        'Describe a communication challenge you faced',
                        'Create a dialogue between two people'
                    ],
                    'writing_tasks': [
                        'Essay on communication importance',
                        'Email writing practice',
                        'Summary writing exercise'
                    ]
                },
                'order': 11
            },
            {
                'kind': 'IDIOMS_PHRASAL_VERBS',
                'title': 'Idioms and Phrasal Verbs of the Lesson',
                'content': {
                    'idioms': {
                        'get the message across': 'To successfully communicate an idea',
                        'speak volumes': 'To reveal a lot of information',
                        'break the ice': 'To start a conversation in a social situation'
                    },
                    'phrasal_verbs': {
                        'speak up': 'To speak louder or more clearly',
                        'talk down to': 'To speak to someone as if they are less intelligent',
                        'get through to': 'To successfully communicate with someone'
                    }
                },
                'order': 12
            },
            {
                'kind': 'ASSESSMENT_TEST',
                'title': 'Assessment Test',
                'content': {
                    'questions': [
                        {
                            'question': 'What is the primary purpose of communication?',
                            'type': 'multiple_choice',
                            'options': ['To impress others', 'To exchange information', 'To win arguments', 'To pass time'],
                            'correct_answer': 'To exchange information',
                            'marks': 5
                        },
                        {
                            'question': 'Explain the importance of non-verbal communication in 2-3 sentences.',
                            'type': 'short_answer',
                            'marks': 10
                        }
                    ],
                    'time_limit': '30 minutes',
                    'total_marks': 100
                },
                'order': 13
            }
        ]
        
        for section_data in sections_data:
            section, created = ChapterSection.objects.get_or_create(
                chapter=chapter,
                kind=section_data['kind'],
                defaults={
                    'title': section_data['title'],
                    'content': section_data['content'],
                    'order': section_data['order'],
                    'is_active': True
                }
            )
            
            if created:
                self.stdout.write(f'  - Created section: {section.title}')
            else:
                # Update existing section
                section.title = section_data['title']
                section.content = section_data['content']
                section.order = section_data['order']
                section.save()
                self.stdout.write(f'  - Updated section: {section.title}') 