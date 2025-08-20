"""
Management command to add more diverse English books data.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from books.models import Book, Chapter, ChapterSection, Tag, BookTag
from institutes.models import Institute

User = get_user_model()

class Command(BaseCommand):
    help = 'Add more diverse English books with chapters and sections'

    def handle(self, *args, **options):
        self.stdout.write('Creating additional English books...')
        
        # Get existing user and institute
        try:
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                self.stdout.write('No superuser found. Please create one first.')
                return
                
            institute = Institute.objects.filter(name='Ilm Kademy').first()
            if not institute:
                self.stdout.write('Institute not found. Please run add_sample_books first.')
                return
        except Exception as e:
            self.stdout.write(f'Error: {e}')
            return

        # Get or create additional tags
        additional_tags = [
            {'name': 'Literature', 'color': '#EC4899'},
            {'name': 'Poetry', 'color': '#8B5CF6'},
            {'name': 'Drama', 'color': '#F97316'},
            {'name': 'Novel', 'color': '#059669'},
            {'name': 'Academic', 'color': '#DC2626'},
            {'name': 'Technical', 'color': '#7C3AED'},
        ]
        
        tags = {}
        for tag_data in additional_tags:
            tag, created = Tag.objects.get_or_create(
                name=tag_data['name'],
                defaults={'color': tag_data['color']}
            )
            tags[tag.name] = tag

        # Additional books data
        additional_books = [
            {
                'title': 'Shakespeare\'s Greatest Works',
                'subject': 'LITERATURE',
                'level': 'ADVANCED',
                'description': 'Explore the timeless works of William Shakespeare with detailed analysis and modern interpretations.',
                'tags': ['Literature', 'Drama', 'Poetry'],
                'chapters': [
                    {
                        'title': 'Romeo and Juliet',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'The Tragedy of Romeo and Juliet',
                                'content': {
                                    'text': 'Shakespeare\'s most famous tragedy about two young lovers from feuding families.',
                                    'themes': ['Love vs. Hate', 'Fate vs. Free Will', 'Youth vs. Age'],
                                    'setting': 'Verona, Italy during the Renaissance'
                                }
                            },
                            {
                                'kind': 'VOCAB_GRAMMAR',
                                'title': 'Shakespearean Language',
                                'content': {
                                    'language_features': [
                                        {'term': 'Iambic Pentameter', 'definition': 'A metrical pattern of five iambs per line', 'example': 'But soft, what light through yonder window breaks?'},
                                        {'term': 'Soliloquy', 'definition': 'A speech given by a character alone on stage', 'example': 'Romeo\'s balcony speech'},
                                        {'term': 'Aside', 'definition': 'A remark made to the audience, not heard by other characters', 'example': 'Mercutio\'s witty comments'}
                                    ]
                                }
                            },
                            {
                                'kind': 'SHORT_QUESTIONS',
                                'title': 'Comprehension Questions',
                                'content': {
                                    'questions': [
                                        {'question': 'What are the names of the two feuding families?', 'answer': 'Montague and Capulet'},
                                        {'question': 'How do Romeo and Juliet first meet?', 'answer': 'At the Capulet\'s party where Romeo is disguised'},
                                        {'question': 'What is the main theme of the play?', 'answer': 'The destructive power of hatred and the redemptive power of love'}
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        'title': 'Macbeth',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'The Scottish Play',
                                'content': {
                                    'text': 'A dark tragedy about ambition, power, and the consequences of unchecked desire.',
                                    'themes': ['Ambition', 'Fate', 'Guilt', 'Power'],
                                    'historical_context': 'Based on Scottish history and written during King James I\'s reign'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'Modern English Poetry',
                'subject': 'LITERATURE',
                'level': 'INTERMEDIATE',
                'description': 'Contemporary poetry from the 20th and 21st centuries, exploring modern themes and poetic techniques.',
                'tags': ['Poetry', 'Literature', 'Reading'],
                'chapters': [
                    {
                        'title': 'Free Verse Poetry',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'Breaking Traditional Forms',
                                'content': {
                                    'text': 'Explore how modern poets broke away from traditional rhyme schemes and meter.',
                                    'key_poets': ['Walt Whitman', 'T.S. Eliot', 'Ezra Pound', 'William Carlos Williams'],
                                    'characteristics': ['No fixed meter', 'Natural speech rhythms', 'Free line breaks', 'Focus on imagery']
                                }
                            },
                            {
                                'kind': 'VOCAB_GRAMMAR',
                                'title': 'Poetic Devices',
                                'content': {
                                    'devices': [
                                        {'device': 'Metaphor', 'definition': 'Direct comparison without using like or as', 'example': 'Life is a journey'},
                                        {'device': 'Simile', 'definition': 'Comparison using like or as', 'example': 'Life is like a box of chocolates'},
                                        {'device': 'Alliteration', 'definition': 'Repetition of initial consonant sounds', 'example': 'Peter Piper picked a peck of pickled peppers'},
                                        {'device': 'Imagery', 'definition': 'Vivid descriptive language that appeals to the senses', 'example': 'The golden sun sank behind the purple mountains'}
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'Academic Writing for University',
                'subject': 'ENGLISH',
                'level': 'ADVANCED',
                'description': 'Master the skills needed for university-level academic writing, including research papers and dissertations.',
                'tags': ['Academic', 'Writing', 'Technical'],
                'chapters': [
                    {
                        'title': 'Research Paper Writing',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'Academic Research Fundamentals',
                                'content': {
                                    'text': 'Learn the essential components of writing a research paper at the university level.',
                                    'paper_types': ['Argumentative', 'Analytical', 'Expository', 'Research'],
                                    'key_components': ['Abstract', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion']
                                }
                            },
                            {
                                'kind': 'WRITING_SKILLS',
                                'title': 'Citation and Referencing',
                                'content': {
                                    'citation_styles': [
                                        {'style': 'APA', 'description': 'American Psychological Association style', 'use_case': 'Social sciences, psychology'},
                                        {'style': 'MLA', 'description': 'Modern Language Association style', 'use_case': 'Humanities, literature'},
                                        {'style': 'Chicago', 'description': 'Chicago Manual of Style', 'use_case': 'History, arts, humanities'},
                                        {'style': 'Harvard', 'description': 'Harvard referencing style', 'use_case': 'General academic writing'}
                                    ],
                                    'citation_examples': {
                                        'book': 'Author, A. (Year). Title of book. Publisher.',
                                        'journal': 'Author, A. (Year). Title of article. Journal Name, Volume(Issue), Pages.',
                                        'website': 'Author, A. (Year). Title of webpage. Website Name. URL.'
                                    }
                                }
                            },
                            {
                                'kind': 'ASSESSMENT_TEST',
                                'title': 'Academic Writing Quiz',
                                'content': {
                                    'questions': [
                                        {
                                            'question': 'Which section of a research paper typically comes first?',
                                            'options': ['Abstract', 'Introduction', 'Literature Review', 'Methodology'],
                                            'correct_answer': 0
                                        },
                                        {
                                            'question': 'What is the purpose of a literature review?',
                                            'options': ['To summarize existing research', 'To present your findings', 'To list references', 'To conclude the paper'],
                                            'correct_answer': 0
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'English for Science and Technology',
                'subject': 'ENGLISH',
                'level': 'INTERMEDIATE',
                'description': 'Specialized English vocabulary and writing skills for science, engineering, and technology fields.',
                'tags': ['Technical', 'Vocabulary', 'Academic'],
                'chapters': [
                    {
                        'title': 'Scientific Writing',
                        'sections': [
                            {
                                'kind': 'INTRODUCTION',
                                'title': 'Writing in the Sciences',
                                'content': {
                                    'text': 'Learn to write clear, precise, and objective scientific documents.',
                                    'document_types': ['Lab reports', 'Research papers', 'Technical specifications', 'User manuals'],
                                    'writing_principles': ['Clarity', 'Precision', 'Objectivity', 'Conciseness']
                                }
                            },
                            {
                                'kind': 'VOCABULARY_TRANSLATION',
                                'title': 'Scientific Terminology',
                                'content': {
                                    'common_terms': [
                                        {'term': 'Hypothesis', 'definition': 'A proposed explanation for a phenomenon', 'example': 'The hypothesis states that increased temperature will accelerate the reaction.'},
                                        {'term': 'Variable', 'definition': 'A factor that can change in an experiment', 'example': 'Temperature and pressure are the independent variables in this study.'},
                                        {'term': 'Control', 'definition': 'A standard for comparison in an experiment', 'example': 'The control group received no treatment.'},
                                        {'term': 'Replication', 'definition': 'Repeating an experiment to verify results', 'example': 'The experiment was replicated three times to ensure reliability.'}
                                    ]
                                }
                            },
                            {
                                'kind': 'WRITING_SKILLS',
                                'title': 'Lab Report Structure',
                                'content': {
                                    'structure': {
                                        'title': 'Clear, descriptive title that indicates the experiment',
                                        'abstract': 'Brief summary of the experiment, methods, results, and conclusions',
                                        'introduction': 'Background information and purpose of the experiment',
                                        'materials_methods': 'Detailed description of procedures and materials used',
                                        'results': 'Data presentation with tables, graphs, and statistical analysis',
                                        'discussion': 'Interpretation of results and their significance',
                                        'conclusion': 'Summary of findings and implications',
                                        'references': 'List of sources cited in the report'
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]

        # Create additional books and chapters
        for book_data in additional_books:
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
            self.style.SUCCESS('Successfully created additional English books with chapters and sections!')
        ) 