"""
Management command to create a featured English book for the library.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from books.models import Book, Chapter, ChapterSection
from institutes.models import Institute

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a featured English book for the library'

    def handle(self, *args, **options):
        self.stdout.write('Creating featured English book...')
        
        # Get or create a user
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.filter(role='SUPER_ADMIN').first()
        if not user:
            # Create a system user if none exists
            user = User.objects.create_user(
                email='system@ilmkademy.com',
                first_name='System',
                last_name='Admin',
                role='SUPER_ADMIN',
                is_staff=True,
                is_superuser=True,
                password='systemadmin123'
            )
            self.stdout.write('Created system admin user')
        
        # Get or create an institute
        institute = Institute.objects.first()
        if not institute:
            institute = Institute.objects.create(
                name='Ilm Kademy Institute',
                description='Official Ilm Kademy Educational Institute',
                created_by=user
            )
            self.stdout.write('Created default institute')
        
        # Create the featured English book
        book = Book.objects.create(
            title='Complete English Language Mastery',
            subject='ENGLISH',
            language='EN',
            level='INTERMEDIATE',
            description='A comprehensive English language course designed for intermediate to advanced learners. This book covers all essential aspects of English including grammar, vocabulary, writing, speaking, and comprehension skills.',
            visibility='PUBLIC',
            created_by=user,
            institute=institute,
            is_published=True,
            version=1
        )
        
        self.stdout.write(f'Created featured English book: {book.title}')
        
        # Create comprehensive chapters
        chapters_data = [
            {
                'title': 'Foundation of English Communication',
                'order': 1,
                'description': 'Master the fundamentals of English communication including pronunciation, basic grammar, and essential vocabulary.'
            },
            {
                'title': 'Grammar Essentials and Advanced Structures',
                'order': 2,
                'description': 'Comprehensive coverage of English grammar from basic to advanced levels with practical examples and exercises.'
            },
            {
                'title': 'Vocabulary Building and Word Power',
                'order': 3,
                'description': 'Systematic approach to expanding your English vocabulary with focus on academic and professional contexts.'
            },
            {
                'title': 'Writing Skills: From Essays to Professional Documents',
                'order': 4,
                'description': 'Develop strong writing skills for academic, professional, and creative purposes.'
            },
            {
                'title': 'Speaking and Oral Communication Excellence',
                'order': 5,
                'description': 'Build confidence in spoken English with focus on pronunciation, fluency, and effective communication.'
            }
        ]
        
        for chapter_data in chapters_data:
            chapter = Chapter.objects.create(
                book=book,
                title=chapter_data['title'],
                order=chapter_data['order'],
                is_published=True
            )
            
            self.stdout.write(f'Created chapter: {chapter.title}')
            
            # Add the 13 required sections for English books
            self._add_comprehensive_sections(chapter, chapter_data['order'])
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created featured English book with ID: {book.id}')
        )
        self.stdout.write(
            self.style.SUCCESS(f'Book URL: http://localhost:3000/library/books/{book.id}')
        )

    def _add_comprehensive_sections(self, chapter, chapter_number):
        """Add comprehensive sections with rich content."""
        
        sections_content = {
            'INTRODUCTION': {
                'text': f'Welcome to Chapter {chapter_number}: {chapter.title}. This chapter provides comprehensive coverage of essential English language concepts and practical applications.',
                'overview': f'In this chapter, you will explore key concepts, practice essential skills, and develop mastery through structured exercises and assessments.',
                'key_concepts': [
                    'Fundamental principles and concepts',
                    'Practical application techniques',
                    'Real-world usage examples',
                    'Progressive skill development'
                ]
            },
            'POINT_WISE_SUMMARY': {
                'points': [
                    'Core concepts and fundamental principles',
                    'Essential vocabulary and terminology',
                    'Grammar structures and usage patterns',
                    'Practical exercises and applications',
                    'Communication strategies and techniques',
                    'Assessment and evaluation methods'
                ],
                'main_ideas': [
                    'Foundation building through systematic learning',
                    'Skill development through practice and repetition',
                    'Confidence building through structured progression'
                ]
            },
            'SLOS': {
                'objectives': [
                    'Understand and apply fundamental English language principles',
                    'Demonstrate mastery of key vocabulary and grammar concepts',
                    'Effectively communicate ideas in both written and spoken English',
                    'Analyze and evaluate English texts and communications',
                    'Create original content using appropriate English language structures',
                    'Develop critical thinking skills through English language study'
                ],
                'outcomes': [
                    'Enhanced language proficiency and confidence',
                    'Improved communication skills in academic and professional contexts',
                    'Greater cultural understanding through language study'
                ]
            },
            'PRE_READING_QUESTIONS': {
                'questions': [
                    'What do you already know about this topic area?',
                    'How might this knowledge be useful in your academic or professional life?',
                    'What specific challenges do you expect to encounter in this chapter?',
                    'How does this topic relate to your previous English language learning?',
                    'What are your goals for mastering this material?'
                ],
                'purpose': 'These questions help activate your prior knowledge and prepare your mind for learning. Take time to reflect on each question before proceeding.'
            },
            'VOCABULARY_TEXT_TRANSLATION': {
                'vocabulary': {
                    'proficiency': 'The ability to do something successfully or efficiently',
                    'comprehensive': 'Complete and including everything that is necessary',
                    'fundamental': 'Forming a necessary base or core; essential',
                    'systematic': 'Done or acting according to a fixed plan or system',
                    'mastery': 'Comprehensive knowledge or skill in a subject or accomplishment',
                    'articulate': 'Having or showing the ability to speak fluently and coherently',
                    'eloquent': 'Fluent or persuasive in speaking or writing',
                    'nuance': 'A subtle difference in or shade of meaning, expression, or response'
                },
                'text': f'This chapter focuses on developing {chapter.title.lower()}. Through systematic study and practice, learners will build comprehensive understanding and practical skills. The content is designed to progress from fundamental concepts to advanced applications, ensuring mastery at each level.',
                'translation': 'This text introduces the chapter theme and learning approach, emphasizing the systematic and comprehensive nature of the content.'
            },
            'GLOSSARY': {
                'terms': {
                    'Active Voice': 'A sentence construction where the subject performs the action',
                    'Passive Voice': 'A sentence construction where the subject receives the action',
                    'Syntax': 'The arrangement of words and phrases to create well-formed sentences',
                    'Semantics': 'The meaning of words, phrases, and sentences',
                    'Pragmatics': 'The study of how context affects meaning in communication',
                    'Discourse': 'Written or spoken communication or debate',
                    'Register': 'The level of formality in language use',
                    'Collocation': 'Words that naturally go together'
                },
                'definitions': {
                    'Active Voice': 'A grammatical voice where the subject of the sentence performs the action expressed by the verb (e.g., "The student wrote the essay")',
                    'Passive Voice': 'A grammatical voice where the subject receives the action rather than performing it (e.g., "The essay was written by the student")',
                    'Syntax': 'The set of rules that govern how words combine to form phrases and sentences in a language',
                    'Semantics': 'The branch of linguistics concerned with meaning in language',
                    'Pragmatics': 'The study of how speakers use language in context and how context affects meaning',
                    'Discourse': 'Connected speech or writing that forms a unified whole',
                    'Register': 'A variety of language defined by its use in particular situations',
                    'Collocation': 'The habitual juxtaposition of particular words'
                }
            },
            'EXERCISE_SHORT_QUESTIONS': {
                'questions': [
                    'Define the key concepts introduced in this chapter.',
                    'Explain how these concepts apply to real-world communication.',
                    'What are the main challenges in mastering this material?',
                    'How do these concepts relate to previous chapters?',
                    'Provide three examples of practical applications.',
                    'What strategies would you use to remember this information?'
                ],
                'answers': {
                    'Define the key concepts introduced in this chapter.': 'The key concepts include fundamental language principles, practical application methods, and systematic skill development approaches.',
                    'Explain how these concepts apply to real-world communication.': 'These concepts enhance clarity, effectiveness, and appropriateness in both academic and professional communication contexts.',
                    'What are the main challenges in mastering this material?': 'Main challenges include understanding complex grammar rules, expanding vocabulary systematically, and applying concepts consistently in various contexts.'
                }
            },
            'EXERCISE_OBJECTIVES': {
                'questions': [
                    {
                        'question': 'Which of the following best describes effective communication?',
                        'options': ['Speaking loudly', 'Using complex vocabulary', 'Clear and appropriate expression', 'Formal language only'],
                        'correct_answer': 'Clear and appropriate expression'
                    },
                    {
                        'question': 'True or False: Grammar rules are the same in all varieties of English.',
                        'options': ['True', 'False'],
                        'correct_answer': 'False'
                    },
                    {
                        'question': 'What is the primary purpose of studying vocabulary in context?',
                        'options': ['Memorization', 'Understanding usage patterns', 'Spelling practice', 'Translation'],
                        'correct_answer': 'Understanding usage patterns'
                    }
                ],
                'options': {},
                'correct_answers': {}
            },
            'EXERCISE_VOCABULARY_GRAMMAR': {
                'vocabulary_exercises': [
                    'Match vocabulary words with their definitions',
                    'Complete sentences using appropriate vocabulary',
                    'Identify synonyms and antonyms for key terms',
                    'Use new vocabulary in original sentences',
                    'Classify words by parts of speech'
                ],
                'grammar_exercises': [
                    'Identify and correct grammatical errors',
                    'Transform sentences between active and passive voice',
                    'Practice complex sentence structures',
                    'Apply appropriate verb tenses',
                    'Use conditional statements correctly'
                ]
            },
            'EXERCISE_ORAL_COMMUNICATION': {
                'speaking_activities': [
                    'Practice pronunciation of key vocabulary',
                    'Role-play professional conversations',
                    'Deliver short presentations on chapter topics',
                    'Participate in structured debates',
                    'Practice impromptu speaking exercises'
                ],
                'discussion_topics': [
                    'How has English become a global language?',
                    'What are the benefits of multilingualism?',
                    'How do cultural differences affect communication?',
                    'What role does technology play in language learning?',
                    'How can we maintain language diversity in a globalized world?'
                ]
            },
            'EXERCISE_WRITING_SKILLS': {
                'writing_prompts': [
                    'Write a formal email requesting information',
                    'Compose a persuasive essay on a topic of your choice',
                    'Create a detailed report summarizing the chapter content',
                    'Write a reflective piece on your language learning journey',
                    'Develop a proposal for improving English education'
                ],
                'writing_tasks': [
                    'Academic essay writing with proper structure',
                    'Professional correspondence and documentation',
                    'Creative writing exercises',
                    'Technical writing and instructions',
                    'Summary and synthesis writing'
                ]
            },
            'IDIOMS_PHRASAL_VERBS': {
                'idioms': {
                    'break the ice': 'To initiate conversation or ease tension in a social situation',
                    'get the hang of': 'To understand or master how to do something',
                    'hit the books': 'To study hard or seriously',
                    'piece of cake': 'Something that is very easy to do',
                    'spill the beans': 'To reveal a secret or give away information',
                    'bite the bullet': 'To face a difficult situation with courage'
                },
                'phrasal_verbs': {
                    'look up': 'To search for information, especially in a reference book',
                    'work out': 'To solve or find a solution to something',
                    'figure out': 'To understand or solve something',
                    'bring up': 'To mention or introduce a topic',
                    'point out': 'To indicate or draw attention to something',
                    'sum up': 'To give a brief summary of the main points'
                }
            },
            'ASSESSMENT_TEST': {
                'questions': [
                    {
                        'question': 'Analyze the effectiveness of the communication strategies discussed in this chapter.',
                        'type': 'essay',
                        'marks': 25,
                        'time_suggested': '15 minutes'
                    },
                    {
                        'question': 'Which grammatical structure is most appropriate for formal academic writing?',
                        'type': 'multiple_choice',
                        'options': ['Simple present', 'Present perfect', 'Complex sentences with subordinate clauses', 'Informal contractions'],
                        'correct_answer': 'Complex sentences with subordinate clauses',
                        'marks': 5
                    },
                    {
                        'question': 'Demonstrate your understanding by using five vocabulary words from this chapter in original sentences.',
                        'type': 'short_answer',
                        'marks': 15
                    }
                ],
                'time_limit': '45 minutes',
                'total_marks': 100
            }
        }
        
        # Create all 13 sections
        required_sections = [
            'INTRODUCTION',
            'POINT_WISE_SUMMARY',
            'SLOS',
            'PRE_READING_QUESTIONS',
            'VOCABULARY_TEXT_TRANSLATION',
            'GLOSSARY',
            'EXERCISE_SHORT_QUESTIONS',
            'EXERCISE_OBJECTIVES',
            'EXERCISE_VOCABULARY_GRAMMAR',
            'EXERCISE_ORAL_COMMUNICATION',
            'EXERCISE_WRITING_SKILLS',
            'IDIOMS_PHRASAL_VERBS',
            'ASSESSMENT_TEST'
        ]
        
        for order, section_kind in enumerate(required_sections, 1):
            section = ChapterSection.objects.create(
                chapter=chapter,
                kind=section_kind,
                title=self._get_section_title(section_kind),
                content=sections_content[section_kind],
                order=order,
                is_active=True
            )
            
            self.stdout.write(f'  - Created section: {section.title}')
    
    def _get_section_title(self, section_kind):
        """Get the display title for a section kind."""
        title_map = {
            'INTRODUCTION': 'Introduction',
            'POINT_WISE_SUMMARY': 'Point-wise Summary',
            'SLOS': 'Student Learning Objectives',
            'PRE_READING_QUESTIONS': 'Pre-reading Questions',
            'VOCABULARY_TEXT_TRANSLATION': 'Vocabulary, Text & Translation',
            'GLOSSARY': 'Glossary',
            'EXERCISE_SHORT_QUESTIONS': 'Exercise: Short Questions',
            'EXERCISE_OBJECTIVES': 'Exercise: Objectives',
            'EXERCISE_VOCABULARY_GRAMMAR': 'Exercise: Vocabulary and Grammar',
            'EXERCISE_ORAL_COMMUNICATION': 'Exercise: Oral Communication',
            'EXERCISE_WRITING_SKILLS': 'Exercise: Writing Skills',
            'IDIOMS_PHRASAL_VERBS': 'Idioms and Phrasal Verbs of the Lesson',
            'ASSESSMENT_TEST': 'Assessment Test',
        }
        return title_map.get(section_kind, section_kind.replace('_', ' ')) 