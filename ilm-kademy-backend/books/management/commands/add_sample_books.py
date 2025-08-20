"""
Management command to add sample English books data.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from books.models import Book, Chapter, ChapterSection, Tag, BookTag
from institutes.models import Institute

User = get_user_model()

class Command(BaseCommand):
    help = 'Add sample English books with chapters and sections'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample English books...')
        
        # Get or create a super user
        try:
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@ilmkademy.com',
                    password='admin123'
                )
        except Exception as e:
            self.stdout.write(f'Error creating user: {e}')
            return

        # Get or create institute
        institute, created = Institute.objects.get_or_create(
            name='Ilm Kademy',
            defaults={
                'description': 'A leading educational institution',
                'address': '123 Education Street, Learning City',
                'website': 'https://ilmkademy.com',
                'owner': user
            }
        )

        # Create tags
        tags_data = [
            {'name': 'Grammar', 'color': '#EF4444'},
            {'name': 'Vocabulary', 'color': '#10B981'},
            {'name': 'Writing', 'color': '#3B82F6'},
            {'name': 'Reading', 'color': '#8B5CF6'},
            {'name': 'Speaking', 'color': '#F59E0B'},
            {'name': 'Listening', 'color': '#06B6D4'},
        ]
        
        tags = {}
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(
                name=tag_data['name'],
                defaults={'color': tag_data['color']}
            )
            tags[tag.name] = tag

        # Sample books data
        books_data = [
            {
                'title': 'English Grammar Fundamentals',
                'subject': 'ENGLISH',
                'level': 'BEGINNER',
                'description': 'A comprehensive guide to English grammar basics, perfect for beginners starting their English learning journey.',
                'tags': ['Grammar', 'Vocabulary'],
                'chapters': [
                    {
                        'title': 'Introduction to Parts of Speech',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'Welcome to English Grammar',
                                'content': {
                                    'text': 'This chapter introduces you to the fundamental building blocks of English language - the parts of speech.',
                                    'objectives': ['Understand what parts of speech are', 'Identify basic word categories', 'Recognize the importance of grammar']
                                }
                            },
                            {
                                'kind': 'SLOS',
                                'title': 'Learning Objectives',
                                'content': {
                                    'objectives': [
                                        'Define and identify nouns, verbs, adjectives, and adverbs',
                                        'Use parts of speech correctly in simple sentences',
                                        'Recognize the role of each part of speech in sentence structure'
                                    ]
                                }
                            },
                            {
                                'kind': 'VOCAB_GRAMMAR',
                                'title': 'Parts of Speech Overview',
                                'content': {
                                    'grammar_points': [
                                        {'term': 'Noun', 'definition': 'A word that names a person, place, thing, or idea', 'examples': ['cat', 'London', 'happiness']},
                                        {'term': 'Verb', 'definition': 'A word that shows action or state of being', 'examples': ['run', 'is', 'think']},
                                        {'term': 'Adjective', 'definition': 'A word that describes a noun', 'examples': ['big', 'red', 'beautiful']},
                                        {'term': 'Adverb', 'definition': 'A word that describes a verb, adjective, or other adverb', 'examples': ['quickly', 'very', 'well']}
                                    ]
                                }
                            },
                            {
                                'kind': 'SHORT_QUESTIONS',
                                'title': 'Practice Questions',
                                'content': {
                                    'questions': [
                                        {'question': 'What is a noun?', 'answer': 'A word that names a person, place, thing, or idea'},
                                        {'question': 'Give three examples of verbs.', 'answer': 'run, walk, think, sleep, eat, etc.'},
                                        {'question': 'How do adjectives help in a sentence?', 'answer': 'They describe or modify nouns, adding detail and clarity.'}
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        'title': 'Building Simple Sentences',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'Sentence Structure Basics',
                                'content': {
                                    'text': 'Learn how to construct clear and grammatically correct simple sentences using the parts of speech you learned.',
                                    'key_concepts': ['Subject-Verb agreement', 'Basic sentence patterns', 'Punctuation rules']
                                }
                            },
                            {
                                'kind': 'VOCAB_GRAMMAR',
                                'title': 'Sentence Patterns',
                                'content': {
                                    'patterns': [
                                        {'pattern': 'Subject + Verb', 'example': 'Birds fly.', 'explanation': 'The simplest sentence structure'},
                                        {'pattern': 'Subject + Verb + Object', 'example': 'I love pizza.', 'explanation': 'Adding an object to receive the action'},
                                        {'pattern': 'Subject + Verb + Adjective', 'example': 'The sky is blue.', 'explanation': 'Using linking verbs with adjectives'}
                                    ]
                                }
                            },
                            {
                                'kind': 'WRITING_SKILLS',
                                'title': 'Writing Practice',
                                'content': {
                                    'exercises': [
                                        'Write three sentences using the Subject + Verb pattern',
                                        'Create sentences describing your favorite food',
                                        'Practice writing sentences about your daily routine'
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'Advanced English Composition',
                'subject': 'ENGLISH',
                'level': 'INTERMEDIATE',
                'description': 'Master the art of writing compelling essays, stories, and academic papers with advanced techniques.',
                'tags': ['Writing', 'Reading'],
                'chapters': [
                    {
                        'title': 'Essay Writing Techniques',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'The Art of Essay Writing',
                                'content': {
                                    'text': 'Discover the secrets of crafting engaging and persuasive essays that captivate readers and convey your ideas effectively.',
                                    'essay_types': ['Argumentative', 'Descriptive', 'Narrative', 'Expository']
                                }
                            },
                            {
                                'kind': 'SLOS',
                                'title': 'Learning Objectives',
                                'content': {
                                    'objectives': [
                                        'Structure essays with clear introduction, body, and conclusion',
                                        'Use persuasive techniques and evidence effectively',
                                        'Develop coherent arguments with logical flow',
                                        'Apply proper citation and formatting standards'
                                    ]
                                }
                            },
                            {
                                'kind': 'WRITING_SKILLS',
                                'title': 'Essay Structure',
                                'content': {
                                    'structure': {
                                        'introduction': {
                                            'hook': 'Engage the reader with an interesting opening',
                                            'background': 'Provide context and background information',
                                            'thesis': 'Present your main argument or position'
                                        },
                                        'body': {
                                            'topic_sentences': 'Start each paragraph with a clear main idea',
                                            'evidence': 'Support claims with facts, examples, and reasoning',
                                            'transitions': 'Use connecting words to link ideas smoothly'
                                        },
                                        'conclusion': {
                                            'restate_thesis': 'Reinforce your main argument',
                                            'summarize_points': 'Briefly recap key supporting points',
                                            'closing_thought': 'End with a memorable final statement'
                                        }
                                    }
                                }
                            },
                            {
                                'kind': 'ASSESSMENT_TEST',
                                'title': 'Essay Writing Quiz',
                                'content': {
                                    'questions': [
                                        {
                                            'question': 'What are the three main parts of an essay?',
                                            'options': ['Introduction, Body, Conclusion', 'Beginning, Middle, End', 'Start, Content, Finish'],
                                            'correct_answer': 0
                                        },
                                        {
                                            'question': 'Which part of the essay should contain your main argument?',
                                            'options': ['Body', 'Introduction', 'Conclusion'],
                                            'correct_answer': 1
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        'title': 'Creative Writing Skills',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'Unleashing Your Creativity',
                                'content': {
                                    'text': 'Explore the world of creative writing through storytelling, poetry, and descriptive writing exercises.',
                                    'creative_elements': ['Imagery', 'Character development', 'Plot structure', 'Voice and style']
                                }
                            },
                            {
                                'kind': 'WRITING_SKILLS',
                                'title': 'Storytelling Techniques',
                                'content': {
                                    'techniques': [
                                        {'technique': 'Show, Don\'t Tell', 'description': 'Use vivid descriptions and actions instead of stating facts', 'example': 'Instead of "She was sad," write "Tears streamed down her face."'},
                                        {'technique': 'Character Development', 'description': 'Create believable characters with distinct personalities', 'example': 'Give characters goals, fears, and unique speech patterns'},
                                        {'technique': 'Sensory Details', 'description': 'Engage all five senses to make scenes come alive', 'example': 'Describe sights, sounds, smells, tastes, and textures'}
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'Business English Communication',
                'subject': 'ENGLISH',
                'level': 'ADVANCED',
                'description': 'Develop professional English skills for business meetings, presentations, and written communication.',
                'tags': ['Speaking', 'Writing', 'Vocabulary'],
                'chapters': [
                    {
                        'title': 'Professional Presentations',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'Mastering Business Presentations',
                                'content': {
                                    'text': 'Learn to deliver compelling business presentations that engage your audience and achieve your objectives.',
                                    'presentation_types': ['Sales pitches', 'Project updates', 'Training sessions', 'Board meetings']
                                }
                            },
                            {
                                'kind': 'ORAL_COMMUNICATION',
                                'title': 'Presentation Skills',
                                'content': {
                                    'skills': [
                                        {'skill': 'Voice Modulation', 'description': 'Vary your pitch, pace, and volume for emphasis', 'tips': ['Practice breathing exercises', 'Record yourself speaking', 'Use pauses strategically']},
                                        {'skill': 'Body Language', 'description': 'Use confident posture and gestures', 'tips': ['Maintain eye contact', 'Stand with open posture', 'Use hand gestures naturally']},
                                        {'skill': 'Audience Engagement', 'description': 'Keep your audience interested and involved', 'tips': ['Ask questions', 'Use stories and examples', 'Encourage participation']}
                                    ]
                                }
                            },
                            {
                                'kind': 'VOCABULARY_TRANSLATION',
                                'title': 'Business Vocabulary',
                                'content': {
                                    'vocabulary': [
                                        {'word': 'Stakeholder', 'definition': 'A person with an interest in a business', 'example': 'Our stakeholders include investors, employees, and customers.'},
                                        {'word': 'ROI', 'definition': 'Return on Investment', 'example': 'The new marketing campaign showed a 25% ROI.'},
                                        {'word': 'Synergy', 'definition': 'The interaction of elements that produces a total effect greater than the sum of individual elements', 'example': 'The merger created synergy between the two companies.'}
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        'title': 'Business Writing',
                        'sections': [
                            {
                                'kind': 'WRITING_SKILLS',
                                'title': 'Professional Email Writing',
                                'content': {
                                    'email_structure': {
                                        'subject_line': 'Clear and specific subject that summarizes the email content',
                                        'greeting': 'Professional salutation using the recipient\'s name when possible',
                                        'opening': 'Brief introduction and purpose of the email',
                                        'body': 'Clear, concise information organized in short paragraphs',
                                        'closing': 'Professional closing with next steps or call to action',
                                        'signature': 'Professional signature with contact information'
                                    },
                                    'tone_tips': [
                                        'Be professional but not overly formal',
                                        'Use clear, direct language',
                                        'Avoid jargon unless necessary',
                                        'Maintain a positive, helpful tone'
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ]

        # Create books and chapters
        for book_data in books_data:
            # Create book
            book, created = Book.objects.get_or_create(
                title=book_data['title'],
                defaults={
                    'subject': book_data['subject'],
                    'level': book_data['level'],
                    'description': book_data['description'],
                    'created_by': user,
                    'institute': institute,
                    'is_published': True,
                    'language': 'EN'
                }
            )
            
            if created:
                self.stdout.write(f'Created book: {book.title}')
                
                # Add tags
                for tag_name in book_data['tags']:
                    if tag_name in tags:
                        BookTag.objects.get_or_create(book=book, tag=tags[tag_name])
                
                # Create chapters
                for chapter_index, chapter_data in enumerate(book_data['chapters'], 1):
                    chapter, created = Chapter.objects.get_or_create(
                        book=book,
                        title=chapter_data['title'],
                        defaults={
                            'order': chapter_index,
                            'is_published': True
                        }
                    )
                    
                    if created:
                        self.stdout.write(f'  Created chapter: {chapter.title}')
                        
                        # Create chapter sections
                        for section_index, section_data in enumerate(chapter_data['sections'], 1):
                            section, created = ChapterSection.objects.get_or_create(
                                chapter=chapter,
                                kind=section_data['kind'],
                                title=section_data['title'],
                                defaults={
                                    'content': section_data['content'],
                                    'order': section_index,
                                    'is_active': True
                                }
                            )
                            
                            if created:
                                self.stdout.write(f'    Created section: {section.title}')
            else:
                self.stdout.write(f'Book already exists: {book.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample English books with chapters and sections!')
        ) 