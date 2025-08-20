"""
Management command to add comprehensive English books with all 13 required sections.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from books.models import Book, Chapter, ChapterSection, Tag, BookTag
from institutes.models import Institute

User = get_user_model()

class Command(BaseCommand):
    help = 'Add comprehensive English books with all 13 required sections for each chapter'

    def handle(self, *args, **options):
        self.stdout.write('Creating comprehensive English books with all 13 sections...')
        
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
            {'name': 'Literature', 'color': '#EC4899'},
            {'name': 'Communication', 'color': '#14B8A6'},
        ]
        
        tags = {}
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(
                name=tag_data['name'],
                defaults={'color': tag_data['color']}
            )
            tags[tag.name] = tag

        # Comprehensive English book with all 13 sections
        comprehensive_book_data = {
            'title': 'Complete English Mastery',
            'subject': 'ENGLISH',
            'level': 'INTERMEDIATE',
            'description': 'A comprehensive English course covering all aspects of language learning with structured chapters and interactive exercises.',
            'tags': ['Grammar', 'Vocabulary', 'Writing', 'Reading', 'Speaking', 'Communication'],
            'chapters': [
                {
                    'title': 'The Art of Effective Communication',
                    'sections': [
                        {
                            'kind': 'INTRODUCTION',
                            'title': 'Understanding Communication',
                            'content': {
                                'text': 'Communication is the foundation of human interaction. This chapter explores the principles of effective communication in English, covering both verbal and non-verbal aspects.',
                                'key_concepts': ['Verbal communication', 'Non-verbal cues', 'Active listening', 'Clear expression'],
                                'overview': 'Learn how to express yourself clearly, listen actively, and understand the nuances of English communication.'
                            }
                        },
                        {
                            'kind': 'SUMMARY',
                            'title': 'Chapter Overview',
                            'content': {
                                'main_points': [
                                    'Communication involves both speaking and listening',
                                    'Non-verbal cues enhance verbal messages',
                                    'Active listening requires full attention and engagement',
                                    'Clear expression depends on vocabulary and grammar',
                                    'Cultural context influences communication styles'
                                ],
                                'learning_outcomes': 'By the end of this chapter, you will be able to communicate more effectively in various situations.'
                            }
                        },
                        {
                            'kind': 'SLOS',
                            'title': 'Student Learning Objectives',
                            'content': {
                                'objectives': [
                                    'Define effective communication and its components',
                                    'Identify barriers to effective communication',
                                    'Apply active listening techniques in conversations',
                                    'Use appropriate non-verbal communication cues',
                                    'Demonstrate clear and concise verbal expression',
                                    'Adapt communication style to different audiences',
                                    'Recognize cultural differences in communication'
                                ]
                            }
                        },
                        {
                            'kind': 'PRE_READING',
                            'title': 'Pre-Reading Questions',
                            'content': {
                                'questions': [
                                    'What makes a conversation successful?',
                                    'How do you know when someone is really listening to you?',
                                    'What role does body language play in communication?',
                                    'How does culture affect the way people communicate?',
                                    'What are some common communication problems you face?'
                                ],
                                'reflection_prompt': 'Think about a recent conversation that went well. What made it successful?'
                            }
                        },
                        {
                            'kind': 'VOCABULARY_TRANSLATION',
                            'title': 'Key Vocabulary & Translation',
                            'content': {
                                'vocabulary': [
                                    {
                                        'word': 'Articulate',
                                        'definition': 'To express thoughts clearly and effectively',
                                        'translation': 'واضح طور پر اظہار کرنا',
                                        'example': 'She was able to articulate her ideas clearly during the presentation.',
                                        'synonyms': ['express', 'communicate', 'convey']
                                    },
                                    {
                                        'word': 'Empathy',
                                        'definition': 'The ability to understand and share the feelings of others',
                                        'translation': 'ہمدردی',
                                        'example': 'Showing empathy helps build stronger relationships.',
                                        'synonyms': ['compassion', 'understanding', 'sympathy']
                                    },
                                    {
                                        'word': 'Nuance',
                                        'definition': 'A subtle difference in meaning or expression',
                                        'translation': 'باریک فرق',
                                        'example': 'Understanding the nuances of language helps avoid misunderstandings.',
                                        'synonyms': ['subtlety', 'distinction', 'shade']
                                    }
                                ],
                                'text': 'Effective communication requires a rich vocabulary and understanding of subtle meanings. The words we choose can significantly impact how our message is received.',
                                'translation': 'موثر مواصلات کے لیے وسیع الفاظ اور باریک معانی کی سمجھ درکار ہے۔ ہم جو الفاظ منتخب کرتے ہیں وہ ہمارے پیغام کے تاثر پر نمایاں اثر ڈال سکتے ہیں۔'
                            }
                        },
                        {
                            'kind': 'GLOSSARY',
                            'title': 'Important Terms',
                            'content': {
                                'terms': {
                                    'Active Listening': 'A communication technique that requires the listener to fully concentrate, understand, respond, and remember what is being said.',
                                    'Body Language': 'Non-verbal communication through facial expressions, gestures, posture, and eye contact.',
                                    'Communication Barrier': 'Any obstacle that prevents effective communication between people.',
                                    'Context': 'The circumstances or setting in which communication takes place.',
                                    'Feedback': 'Information about reactions to a product, person\'s performance, etc., used as a basis for improvement.',
                                    'Paraphrasing': 'Expressing the meaning of something using different words, especially to achieve greater clarity.',
                                    'Tone': 'The general character or attitude of a piece of writing, speech, etc.'
                                }
                            }
                        },
                        {
                            'kind': 'SHORT_QUESTIONS',
                            'title': 'Short Answer Questions',
                            'content': {
                                'questions': [
                                    {
                                        'question': 'What are the three main components of communication?',
                                        'answer': 'Sender, message, and receiver are the three main components of communication.',
                                        'explanation': 'Communication is a process that involves these three essential elements working together.'
                                    },
                                    {
                                        'question': 'How does active listening differ from passive listening?',
                                        'answer': 'Active listening involves full attention, understanding, and response, while passive listening is just hearing without engagement.',
                                        'explanation': 'Active listening requires mental effort and participation in the communication process.'
                                    },
                                    {
                                        'question': 'Why is cultural awareness important in communication?',
                                        'answer': 'Cultural awareness helps avoid misunderstandings and ensures respectful communication across different cultural backgrounds.',
                                        'explanation': 'Different cultures have different communication norms and expectations.'
                                    }
                                ]
                            }
                        },
                        {
                            'kind': 'OBJECTIVE_QUESTIONS',
                            'title': 'Multiple Choice Questions',
                            'content': {
                                'questions': [
                                    {
                                        'question': 'Which of the following is NOT a component of effective communication?',
                                        'options': ['Clear expression', 'Active listening', 'Cultural awareness', 'Monopolizing conversation'],
                                        'correct_answer': 3,
                                        'explanation': 'Monopolizing conversation is actually a barrier to effective communication.'
                                    },
                                    {
                                        'question': 'What percentage of communication is non-verbal according to research?',
                                        'options': ['30-40%', '50-60%', '70-80%', '90-100%'],
                                        'correct_answer': 2,
                                        'explanation': 'Research suggests that 70-80% of communication is non-verbal.'
                                    },
                                    {
                                        'question': 'Which listening technique involves repeating what the speaker said in your own words?',
                                        'options': ['Summarizing', 'Paraphrasing', 'Clarifying', 'Questioning'],
                                        'correct_answer': 1,
                                        'explanation': 'Paraphrasing involves restating the speaker\'s message in your own words.'
                                    }
                                ]
                            }
                        },
                        {
                            'kind': 'VOCAB_GRAMMAR',
                            'title': 'Vocabulary & Grammar Practice',
                            'content': {
                                'vocabulary_exercises': [
                                    {
                                        'exercise': 'Fill in the blanks with appropriate vocabulary words',
                                        'sentences': [
                                            'Good leaders must be able to _____ their vision clearly to their team.',
                                            'Showing _____ helps build trust in relationships.',
                                            'Understanding cultural _____ prevents misunderstandings.'
                                        ],
                                        'answers': ['articulate', 'empathy', 'nuances']
                                    }
                                ],
                                'grammar_focus': {
                                    'topic': 'Modal Verbs for Communication',
                                    'examples': [
                                        'You should listen carefully to understand better.',
                                        'You could ask for clarification if needed.',
                                        'You must be respectful in all communications.',
                                        'You might want to consider the other person\'s perspective.'
                                    ],
                                    'practice': 'Complete the sentences using appropriate modal verbs: "You _____ always be clear in your communication."'
                                }
                            }
                        },
                        {
                            'kind': 'ORAL_COMMUNICATION',
                            'title': 'Speaking Activities',
                            'content': {
                                'activities': [
                                    {
                                        'activity': 'Role-Play: Difficult Conversation',
                                        'description': 'Practice having a difficult conversation with a partner. One person plays the role of an employee who needs to discuss a problem with their manager.',
                                        'scenario': 'You\'ve been consistently working overtime but haven\'t received the promised compensation.',
                                        'objectives': ['Practice clear expression', 'Use appropriate tone', 'Listen actively to responses']
                                    },
                                    {
                                        'activity': 'Group Discussion: Communication Challenges',
                                        'description': 'In groups of 4-5, discuss common communication challenges in the workplace or personal life.',
                                        'discussion_points': [
                                            'What communication barriers do you face most often?',
                                            'How do you handle misunderstandings?',
                                            'What strategies help improve communication?'
                                        ]
                                    }
                                ],
                                'speaking_tips': [
                                    'Speak clearly and at an appropriate pace',
                                    'Use pauses effectively to emphasize points',
                                    'Maintain appropriate eye contact',
                                    'Use gestures to support your message'
                                ]
                            }
                        },
                        {
                            'kind': 'WRITING_SKILLS',
                            'title': 'Writing Practice',
                            'content': {
                                'writing_tasks': [
                                    {
                                        'task': 'Email Communication',
                                        'description': 'Write a professional email to a colleague explaining a new project idea.',
                                        'requirements': [
                                            'Clear subject line',
                                            'Professional greeting',
                                            'Concise explanation',
                                            'Call to action',
                                            'Professional closing'
                                        ],
                                        'word_limit': '150-200 words'
                                    },
                                    {
                                        'task': 'Reflection Journal',
                                        'description': 'Write a reflection on a recent communication experience.',
                                        'prompts': [
                                            'What went well in the communication?',
                                            'What could have been improved?',
                                            'What did you learn about effective communication?',
                                            'How will you apply these lessons in the future?'
                                        ],
                                        'word_limit': '200-250 words'
                                    }
                                ],
                                'writing_tips': [
                                    'Use clear and concise language',
                                    'Organize your thoughts logically',
                                    'Proofread for clarity and accuracy',
                                    'Consider your audience\'s perspective'
                                ]
                            }
                        },
                        {
                            'kind': 'IDIOMS_PHRASALS',
                            'title': 'Idioms & Phrasal Verbs',
                            'content': {
                                'idioms': [
                                    {
                                        'idiom': 'Get the message across',
                                        'meaning': 'To successfully communicate an idea or information',
                                        'example': 'It took several attempts, but I finally got the message across to my team.',
                                        'usage': 'Use when you want to emphasize successful communication.'
                                    },
                                    {
                                        'idiom': 'Read between the lines',
                                        'meaning': 'To understand the hidden or implied meaning',
                                        'example': 'You need to read between the lines to understand what she\'s really saying.',
                                        'usage': 'Use when referring to understanding subtle or implied meanings.'
                                    },
                                    {
                                        'idiom': 'Speak the same language',
                                        'meaning': 'To have similar opinions, beliefs, or ways of thinking',
                                        'example': 'We speak the same language when it comes to business ethics.',
                                        'usage': 'Use when describing shared understanding or agreement.'
                                    }
                                ],
                                'phrasal_verbs': [
                                    {
                                        'phrasal': 'Speak up',
                                        'meaning': 'To speak more loudly or to express your opinion',
                                        'example': 'Don\'t be afraid to speak up if you have concerns.',
                                        'usage': 'Use when encouraging someone to express their thoughts.'
                                    },
                                    {
                                        'phrasal': 'Get through to',
                                        'meaning': 'To successfully communicate with someone',
                                        'example': 'I tried to get through to him about the importance of punctuality.',
                                        'usage': 'Use when describing successful communication with someone difficult.'
                                    },
                                    {
                                        'phrasal': 'Come across as',
                                        'meaning': 'To appear or seem to be a particular type of person',
                                        'example': 'She comes across as very confident in meetings.',
                                        'usage': 'Use when describing how someone appears to others.'
                                    }
                                ]
                            }
                        },
                        {
                            'kind': 'ASSESSMENT_TEST',
                            'title': 'Chapter Assessment',
                            'content': {
                                'test_info': {
                                    'duration': '30 minutes',
                                    'total_questions': 20,
                                    'passing_score': '70%'
                                },
                                'questions': [
                                    {
                                        'question': 'What is the primary purpose of active listening?',
                                        'options': [
                                            'To prepare your response while the other person is speaking',
                                            'To fully understand the speaker\'s message',
                                            'To show that you\'re paying attention',
                                            'To interrupt with your own ideas'
                                        ],
                                        'correct_answer': 1,
                                        'points': 5
                                    },
                                    {
                                        'question': 'Which of the following is an example of non-verbal communication?',
                                        'options': [
                                            'Speaking clearly',
                                            'Using appropriate vocabulary',
                                            'Maintaining eye contact',
                                            'Asking questions'
                                        ],
                                        'correct_answer': 2,
                                        'points': 5
                                    },
                                    {
                                        'question': 'True or False: Cultural context has no impact on communication styles.',
                                        'options': ['True', 'False'],
                                        'correct_answer': 1,
                                        'points': 5
                                    }
                                ],
                                'scoring': {
                                    'excellent': '90-100%',
                                    'good': '80-89%',
                                    'satisfactory': '70-79%',
                                    'needs_improvement': 'Below 70%'
                                }
                            }
                        }
                    ]
                }
            ]
        }

        # Create the comprehensive book
        book, created = Book.objects.get_or_create(
            title=comprehensive_book_data['title'],
            defaults={
                'subject': comprehensive_book_data['subject'],
                'level': comprehensive_book_data['level'],
                'description': comprehensive_book_data['description'],
                'created_by': user,
                'institute': institute,
                'is_published': True,
                'language': 'EN'
            }
        )
        
        if created:
            self.stdout.write(f'Created comprehensive book: {book.title}')
            
            # Add tags
            for tag_name in comprehensive_book_data['tags']:
                if tag_name in tags:
                    BookTag.objects.get_or_create(book=book, tag=tags[tag_name])
            
            # Create chapters with all 13 sections
            for chapter_index, chapter_data in enumerate(comprehensive_book_data['chapters'], 1):
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
                    
                    # Create all 13 required sections
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
                            self.stdout.write(f'    Created section {section_index}: {section.title} ({section.kind})')
                        else:
                            self.stdout.write(f'    Section already exists: {section.title}')
        else:
            self.stdout.write(f'Book already exists: {book.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created comprehensive English book with all 13 required sections!')
        ) 