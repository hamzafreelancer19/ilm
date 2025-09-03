import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  BookOpenIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  LightBulbIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api';
import ChapterSections from '../../components/library/ChapterSections';

const ChapterViewerPage = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [showNotes, setShowNotes] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [completedSections, setCompletedSections] = useState([]);

  useEffect(() => {
    fetchBookAndChapter();
  }, [bookId, chapterId]);

  const fetchBookAndChapter = async () => {
    try {
      // Get auth token from localStorage
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (tokens.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`;
      }

      const [bookResponse, chapterResponse, chaptersResponse] = await Promise.all([
        fetch(`${API_ENDPOINTS.BOOKS}${bookId}/`, { headers }),
        fetch(`${API_ENDPOINTS.BOOKS}${bookId}/chapters/${chapterId}/`, { headers }),
        fetch(`${API_ENDPOINTS.BOOKS}${bookId}/chapters/`, { headers })
      ]);

      if (bookResponse.ok) {
        const bookData = await bookResponse.json();
        setBook(bookData);
      } else if (bookResponse.status === 401) {
        // If unauthorized, show mock data for development
        console.log('Using mock book data due to authentication required');
        
        // Dynamic mock book data based on book ID
        const mockBookData = {
          1: {
            id: bookId,
            title: 'English Grammar Fundamentals',
            author: 'Dr. Sarah Johnson'
          },
          2: {
            id: bookId,
            title: 'Advanced English Composition',
            author: 'Prof. Michael Chen'
          },
          11: {
            id: bookId,
            title: 'Master English: Complete Language Course',
            author: 'Dr. Emily Rodriguez'
          }
        };
        
        const bookData = mockBookData[parseInt(bookId)] || mockBookData[1];
        setBook(bookData);
      }

      if (chapterResponse.ok) {
        const chapterData = await chapterResponse.json();
        setChapter(chapterData);
        
        // If this is an English book, fetch the detailed sections
        if (chapterData.book_title && chapterData.sections) {
          // Set completed sections from reading progress if available
          if (chapterData.reading_progress) {
            setCompletedSections(chapterData.reading_progress.completed_sections || []);
          }
        }
      } else if (chapterResponse.status === 401) {
        // If unauthorized, show mock data for development
        console.log('Using mock chapter data due to authentication required');
        
        // Dynamic mock chapter data based on book ID and chapter ID
        const mockChapterData = {
          1: { // Book ID 1 - English Grammar Fundamentals
            1: { // Chapter 1
              id: chapterId,
              title: 'Basic Grammar Concepts',
              description: 'Introduction to parts of speech and sentence structure in English.',
              sections: [
                {
                  id: 1,
                  kind: 'INTRODUCTION',
                  title: 'Introduction to Grammar',
                  content: {
                    text: 'Welcome to Basic Grammar Concepts. This chapter will introduce you to the fundamental building blocks of English grammar.',
                    overview: 'Learn the essential grammar concepts that form the foundation of English language.',
                    key_concepts: ['Parts of speech', 'Sentence structure', 'Basic rules', 'Common patterns']
                  }
                },
                {
                  id: 2,
                  kind: 'POINT_WISE_SUMMARY',
                  title: 'Point-wise Summary',
                  content: {
                    points: [
                      'Understanding the eight parts of speech and their functions',
                      'Learning how sentences are structured with subjects and predicates',
                      'Mastering basic grammar rules for clear communication',
                      'Building a strong vocabulary foundation'
                    ],
                    main_ideas: ['Grammar fundamentals', 'Language structure', 'Basic patterns']
                  }
                },
                {
                  id: 3,
                  kind: 'SLOS',
                  title: 'Student Learning Objectives',
                  content: {
                    objectives: [
                      'Identify and classify different parts of speech correctly',
                      'Understand and apply basic sentence structure rules',
                      'Apply grammar rules correctly in writing and speaking',
                      'Build confidence in using English grammar'
                    ],
                    outcomes: ['Knowledge of grammar', 'Improved writing', 'Better communication']
                  }
                },
                {
                  id: 4,
                  kind: 'PRE_READING_QUESTIONS',
                  title: 'Pre-reading Questions',
                  content: {
                    questions: [
                      'What do you already know about English grammar?',
                      'How do you think grammar helps in clear communication?',
                      'What grammar concepts do you find most challenging?'
                    ],
                    purpose: 'These questions help prepare your mind for learning grammar concepts.'
                  }
                },
                {
                  id: 5,
                  kind: 'VOCABULARY_TEXT_TRANSLATION',
                  title: 'Vocabulary, Text & Translation',
                  content: {
                    vocabulary: {
                      'grammar': 'The rules and structure of a language',
                      'sentence': 'A group of words that express a complete thought',
                      'structure': 'The way something is organized or arranged'
                    },
                    text: 'This section covers essential grammar concepts with practical examples.',
                    translation: 'Key terms will be explained in simple language for better understanding.'
                  }
                },
                {
                  id: 6,
                  kind: 'GLOSSARY',
                  title: 'Glossary',
                  content: {
                    terms: {
                      'grammar': 'The system of rules that govern how words are used in a language',
                      'sentence': 'A grammatical unit that contains a subject and predicate',
                      'structure': 'The arrangement of and relations between the parts of something'
                    }
                  }
                },
                {
                  id: 7,
                  kind: 'EXERCISE_SHORT_QUESTIONS',
                  title: 'Exercise: Short Questions',
                  content: {
                    questions: [
                      'What are the eight main parts of speech in English?',
                      'How does sentence structure work in English?',
                      'Why is grammar important for effective communication?'
                    ],
                    answers: {
                      'What are the eight main parts of speech in English?': 'Nouns, verbs, adjectives, adverbs, pronouns, prepositions, conjunctions, and interjections',
                      'How does sentence structure work in English?': 'A sentence typically has a subject and a predicate',
                      'Why is grammar important for effective communication?': 'Grammar helps us organize our thoughts clearly and avoid misunderstandings'
                    }
                  }
                },
                {
                  id: 8,
                  kind: 'EXERCISE_OBJECTIVES',
                  title: 'Exercise: Objectives',
                  content: {
                    questions: [
                      {
                        question: 'Which of the following is NOT a part of speech?',
                        options: ['Noun', 'Verb', 'Sentence', 'Adjective'],
                        correct_answer: 'Sentence'
                      },
                      {
                        question: 'True or False: Grammar is not important for communication.',
                        options: ['True', 'False'],
                        correct_answer: 'False'
                      }
                    ]
                  }
                },
                {
                  id: 9,
                  kind: 'EXERCISE_VOCABULARY_GRAMMAR',
                  title: 'Exercise: Vocabulary and Grammar',
                  content: {
                    vocabulary_exercises: [
                      'Match words with their definitions',
                      'Fill in the blanks with correct words',
                      'Identify parts of speech in sentences'
                    ],
                    grammar_exercises: [
                      'Correct grammar errors in sentences',
                      'Complete sentences with appropriate words',
                      'Practice subject-verb agreement'
                    ]
                  }
                },
                {
                  id: 10,
                  kind: 'EXERCISE_ORAL_COMMUNICATION',
                  title: 'Exercise: Oral Communication',
                  content: {
                    speaking_activities: [
                      'Practice pronunciation of grammar terms',
                      'Discuss grammar concepts with classmates',
                      'Explain grammar rules to others'
                    ],
                    discussion_topics: [
                      'How does grammar help in speaking clearly?',
                      'What grammar mistakes do you commonly make?',
                      'How can we improve our grammar in daily conversations?'
                    ]
                  }
                },
                {
                  id: 11,
                  kind: 'EXERCISE_WRITING_SKILLS',
                  title: 'Exercise: Writing Skills',
                  content: {
                    writing_prompts: [
                      'Write about your experience learning grammar',
                      'Create sentences using different parts of speech',
                      'Explain a grammar rule in your own words'
                    ],
                    writing_tasks: [
                      'Grammar practice exercises with corrections',
                      'Sentence construction practice',
                      'Grammar rule explanations in writing'
                    ]
                  }
                },
                {
                  id: 12,
                  kind: 'IDIOMS_PHRASAL_VERBS',
                  title: 'Idioms and Phrasal Verbs of the Lesson',
                  content: {
                    idioms: {
                      'get the hang of': 'To learn how to do something after practicing',
                      'piece of cake': 'Something very easy to do',
                      'hit the books': 'To study hard and seriously'
                    },
                    phrasal_verbs: {
                      'look up': 'To search for information in a book or online',
                      'figure out': 'To understand or solve something',
                      'catch on': 'To understand or learn something'
                    }
                  }
                },
                {
                  id: 13,
                  kind: 'ASSESSMENT_TEST',
                  title: 'Assessment Test',
                  content: {
                    questions: [
                      {
                        question: 'What is the main purpose of this chapter?',
                        type: 'multiple_choice',
                        options: ['To memorize vocabulary', 'To understand grammar basics', 'To pass an exam', 'To complete homework'],
                        correct_answer: 'To understand grammar basics',
                        marks: 10
                      },
                      {
                        question: 'Explain how grammar helps in communication.',
                        type: 'short_answer',
                        marks: 15
                      }
                    ],
                    time_limit: '30 minutes',
                    total_marks: 25
                  }
                }
              ]
            }
          },
          2: { // Book ID 2 - Advanced English Composition
            1: { // Chapter 1
              id: chapterId,
              title: 'Essay Writing Fundamentals',
              description: 'Learn the basics of essay structure and organization.',
              sections: [
                {
                  id: 1,
                  kind: 'INTRODUCTION',
                  title: 'Introduction to Essay Writing',
                  content: {
                    text: 'Welcome to Essay Writing Fundamentals. This chapter will teach you how to write clear, organized essays.',
                    overview: 'Learn the essential elements of essay writing and structure.',
                    key_concepts: ['Essay structure', 'Organization', 'Clear writing', 'Logical flow']
                  }
                },
                {
                  id: 2,
                  kind: 'POINT_WISE_SUMMARY',
                  title: 'Point-wise Summary',
                  content: {
                    points: [
                      'Understanding essay structure and organization',
                      'Learning to write clear thesis statements',
                      'Developing logical arguments with evidence',
                      'Creating smooth transitions between ideas'
                    ],
                    main_ideas: ['Structure', 'Organization', 'Clarity', 'Logic']
                  }
                },
                {
                  id: 3,
                  kind: 'SLOS',
                  title: 'Student Learning Objectives',
                  content: {
                    objectives: [
                      'Master essay structure and organization',
                      'Write clear and focused thesis statements',
                      'Develop logical arguments with evidence',
                      'Create smooth transitions between ideas'
                    ],
                    outcomes: ['Essay writing skills', 'Critical thinking', 'Clear communication']
                  }
                },
                {
                  id: 4,
                  kind: 'PRE_READING_QUESTIONS',
                  title: 'Pre-reading Questions',
                  content: {
                    questions: [
                      'What makes a good essay in your opinion?',
                      'How do you currently organize your writing?',
                      'What challenges do you face when writing essays?'
                    ],
                    purpose: 'These questions help prepare your mind for learning essay writing techniques.'
                  }
                },
                {
                  id: 5,
                  kind: 'VOCABULARY_TEXT_TRANSLATION',
                  title: 'Vocabulary, Text & Translation',
                  content: {
                    vocabulary: {
                      'thesis': 'The main argument of an essay',
                      'structure': 'The organization of ideas',
                      'transition': 'Words that connect ideas',
                      'evidence': 'Supporting facts and examples'
                    },
                    text: 'This section covers essential essay writing concepts.',
                    translation: 'Key terms will be explained clearly with examples.'
                  }
                },
                {
                  id: 6,
                  kind: 'GLOSSARY',
                  title: 'Glossary',
                  content: {
                    terms: {
                      'thesis': 'The central argument of an essay',
                      'structure': 'The organization of ideas in writing',
                      'transition': 'Connecting words between ideas',
                      'evidence': 'Supporting material for arguments'
                    }
                  }
                },
                {
                  id: 7,
                  kind: 'EXERCISE_SHORT_QUESTIONS',
                  title: 'Exercise: Short Questions',
                  content: {
                    questions: [
                      'What are the main parts of an essay?',
                      'Why is a thesis statement important?',
                      'How do transitions improve essay flow?'
                    ],
                    answers: {
                      'What are the main parts of an essay?': 'Introduction, body, and conclusion',
                      'Why is a thesis statement important?': 'It provides focus and guides the reader',
                      'How do transitions improve essay flow?': 'They create smooth connections between ideas'
                    }
                  }
                },
                {
                  id: 8,
                  kind: 'EXERCISE_OBJECTIVES',
                  title: 'Exercise: Objectives',
                  content: {
                    questions: [
                      {
                        question: 'Which part contains the thesis statement?',
                        options: ['Body', 'Conclusion', 'Introduction'],
                        correct_answer: 'Introduction'
                      }
                    ]
                  }
                },
                {
                  id: 9,
                  kind: 'EXERCISE_VOCABULARY_GRAMMAR',
                  title: 'Exercise: Vocabulary and Grammar',
                  content: {
                    vocabulary_exercises: ['Learn essay writing terms', 'Practice academic vocabulary'],
                    grammar_exercises: ['Improve sentence structure', 'Work on transitions']
                  }
                },
                {
                  id: 10,
                  kind: 'EXERCISE_ORAL_COMMUNICATION',
                  title: 'Exercise: Oral Communication',
                  content: {
                    speaking_activities: ['Present essay outlines', 'Discuss essay topics'],
                    discussion_topics: ['How does speaking help writing?', 'What makes good essays?']
                  }
                },
                {
                  id: 11,
                  kind: 'EXERCISE_WRITING_SKILLS',
                  title: 'Exercise: Writing Skills',
                  content: {
                    writing_prompts: ['Write a thesis statement', 'Create an essay outline'],
                    writing_tasks: ['Essay outline creation', 'Thesis statement writing']
                  }
                },
                {
                  id: 12,
                  kind: 'IDIOMS_PHRASAL_VERBS',
                  title: 'Idioms and Phrasal Verbs of the Lesson',
                  content: {
                    idioms: {
                      'get to the point': 'Speak directly about the main issue',
                      'in a nutshell': 'Summarize briefly'
                    },
                    phrasal_verbs: {
                      'come up with': 'Think of an idea',
                      'get across': 'Make something understood'
                    }
                  }
                },
                {
                  id: 13,
                  kind: 'ASSESSMENT_TEST',
                  title: 'Assessment Test',
                  content: {
                    questions: [
                      {
                        question: 'What is the purpose of an essay introduction?',
                        type: 'multiple_choice',
                        options: ['To list points', 'To introduce topic and thesis', 'To provide evidence'],
                        correct_answer: 'To introduce topic and thesis',
                        marks: 10
                      }
                    ],
                    time_limit: '30 minutes',
                    total_marks: 10
                  }
                }
              ]
            }
          },
          11: { // Book ID 11 - Master English: Complete Language Course
            1: { // Chapter 1
              id: chapterId,
              title: 'English Fundamentals: Building Strong Foundations',
              description: 'Master the basics of English grammar and vocabulary.',
              sections: [
                {
                  id: 1,
                  kind: 'INTRODUCTION',
                  title: 'Introduction to English Fundamentals',
                  content: {
                    text: 'Welcome to English Fundamentals. This comprehensive chapter covers all essential aspects of English language learning.',
                    overview: 'Build a strong foundation in English with grammar, vocabulary, and communication skills.',
                    key_concepts: ['Grammar basics', 'Vocabulary building', 'Communication skills', 'Practical application']
                  }
                },
                {
                  id: 2,
                  kind: 'POINT_WISE_SUMMARY',
                  title: 'Point-wise Summary',
                  content: {
                    points: [
                      'Understanding fundamental English concepts',
                      'Building comprehensive vocabulary',
                      'Developing communication skills',
                      'Applying language in real situations'
                    ],
                    main_ideas: ['Grammar mastery', 'Vocabulary expansion', 'Communication skills']
                  }
                },
                {
                  id: 3,
                  kind: 'SLOS',
                  title: 'Student Learning Objectives',
                  content: {
                    objectives: [
                      'Master fundamental English grammar',
                      'Build comprehensive vocabulary',
                      'Develop communication skills',
                      'Apply language practically'
                    ],
                    outcomes: ['Grammar proficiency', 'Vocabulary mastery', 'Communication competence']
                  }
                },
                {
                  id: 4,
                  kind: 'PRE_READING_QUESTIONS',
                  title: 'Pre-reading Questions',
                  content: {
                    questions: [
                      'What are your current English strengths?',
                      'How do you plan to use English?',
                      'What areas do you want to improve?'
                    ],
                    purpose: 'Assess your current level and set learning goals.'
                  }
                },
                {
                  id: 5,
                  kind: 'VOCABULARY_TEXT_TRANSLATION',
                  title: 'Vocabulary, Text & Translation',
                  content: {
                    vocabulary: {
                      'fundamental': 'Basic and essential',
                      'comprehensive': 'Complete and thorough',
                      'proficiency': 'High degree of skill'
                    },
                    text: 'This section covers essential English language concepts.',
                    translation: 'Key concepts explained clearly with examples.'
                  }
                },
                {
                  id: 6,
                  kind: 'GLOSSARY',
                  title: 'Glossary',
                  content: {
                    terms: {
                      'fundamental': 'Basic and essential; forming a foundation',
                      'comprehensive': 'Complete and thorough; covering all aspects',
                      'proficiency': 'A high degree of skill or expertise'
                    }
                  }
                },
                {
                  id: 7,
                  kind: 'EXERCISE_SHORT_QUESTIONS',
                  title: 'Exercise: Short Questions',
                  content: {
                    questions: [
                      'What are the components of communication?',
                      'How does vocabulary improve skills?',
                      'Why is grammar important?'
                    ],
                    answers: {
                      'What are the components of communication?': 'Speaking, listening, and understanding',
                      'How does vocabulary improve skills?': 'Allows precise expression and comprehension',
                      'Why is grammar important?': 'Provides structure for clear communication'
                    }
                  }
                },
                {
                  id: 8,
                  kind: 'EXERCISE_OBJECTIVES',
                  title: 'Exercise: Objectives',
                  content: {
                    questions: [
                      {
                        question: 'What is most important for language learning?',
                        options: ['Memorizing rules', 'Regular practice', 'Perfect pronunciation'],
                        correct_answer: 'Regular practice'
                      }
                    ]
                  }
                },
                {
                  id: 9,
                  kind: 'EXERCISE_VOCABULARY_GRAMMAR',
                  title: 'Exercise: Vocabulary and Grammar',
                  content: {
                    vocabulary_exercises: ['Match words with definitions', 'Create sentences'],
                    grammar_exercises: ['Practice sentence structures', 'Work on verb tenses']
                  }
                },
                {
                  id: 10,
                  kind: 'EXERCISE_ORAL_COMMUNICATION',
                  title: 'Exercise: Oral Communication',
                  content: {
                    speaking_activities: ['Practice pronunciation', 'Engage in conversations'],
                    discussion_topics: ['How do you prefer to learn?', 'What challenges do you face?']
                  }
                },
                {
                  id: 11,
                  kind: 'EXERCISE_WRITING_SKILLS',
                  title: 'Exercise: Writing Skills',
                  content: {
                    writing_prompts: ['Write about your learning journey', 'Describe your goals'],
                    writing_tasks: ['Journal writing', 'Short paragraphs']
                  }
                },
                {
                  id: 12,
                  kind: 'IDIOMS_PHRASAL_VERBS',
                  title: 'Idioms and Phrasal Verbs of the Lesson',
                  content: {
                    idioms: {
                      'get the hang of': 'Learn how to do something',
                      'piece of cake': 'Something very easy'
                    },
                    phrasal_verbs: {
                      'look up': 'Search for information',
                      'figure out': 'Understand something'
                    }
                  }
                },
                {
                  id: 13,
                  kind: 'ASSESSMENT_TEST',
                  title: 'Assessment Test',
                  content: {
                    questions: [
                      {
                        question: 'What is the main goal of this course?',
                        type: 'multiple_choice',
                        options: ['To pass exams', 'To build strong foundations', 'To memorize vocabulary'],
                        correct_answer: 'To build strong foundations',
                        marks: 15
                      }
                    ],
                    time_limit: '45 minutes',
                    total_marks: 15
                  }
                }
              ]
            }
          }
        };
        
        // Get the appropriate chapter data based on book ID and chapter ID
        const bookChapters = mockChapterData[parseInt(bookId)] || {};
        const chapterData = bookChapters[parseInt(chapterId)] || bookChapters[1] || {
          id: chapterId,
          title: 'English Language Learning',
          description: 'Learn English fundamentals and communication skills.',
          sections: []
        };
        
        setChapter(chapterData);
      } else if (chaptersResponse.status === 401) {
        // If unauthorized, show mock data for development
        console.log('Using mock chapters data due to authentication required');
        
        // Dynamic mock chapters data based on book ID
        const mockChaptersData = {
          1: [ // English Grammar Fundamentals
            {
              id: 1,
              title: 'Basic Grammar Concepts',
              description: 'Introduction to parts of speech and sentence structure',
              duration: '4 hours',
              sections_count: 13,
              is_completed: false,
              progress: 0
            },
            {
              id: 2,
              title: 'Essential Vocabulary Building',
              description: 'Building a strong foundation of English vocabulary',
              duration: '3 hours',
              sections_count: 13,
              is_completed: false,
              progress: 0
            }
          ],
          2: [ // Advanced English Composition
            {
              id: 1,
              title: 'Essay Writing Fundamentals',
              description: 'Learn the basics of essay structure and organization',
              duration: '5 hours',
              sections_count: 13,
              is_completed: false,
              progress: 0
            },
            {
              id: 2,
              title: 'Advanced Writing Techniques',
              description: 'Master sophisticated writing styles and techniques',
              duration: '6 hours',
              sections_count: 13,
              is_completed: false,
              progress: 0
            }
          ],
          11: [ // Master English: Complete Language Course
            {
              id: 1,
              title: 'English Fundamentals: Building Strong Foundations',
              description: 'Master the basics of English grammar and vocabulary',
              duration: '6 hours',
              sections_count: 13,
              is_completed: false,
              progress: 0
            },
            {
              id: 2,
              title: 'Effective Communication: Speaking with Confidence',
              description: 'Develop your speaking and listening skills',
              duration: '8 hours',
              sections_count: 13,
              is_completed: false,
              progress: 0
            },
            {
              id: 3,
              title: 'Advanced Writing: Expressing Ideas Clearly',
              description: 'Learn to write clearly and persuasively',
              duration: '10 hours',
              sections_count: 13,
              is_completed: false,
              progress: 0
            }
          ]
        };
        
        // Use the appropriate chapters data based on book ID, or default to first book
        const chaptersData = mockChaptersData[parseInt(bookId)] || mockChaptersData[1];
        setChapters(chaptersData);
      }

      // Mock data for development if no data was loaded
      if (!book) {
        const mockBookData = {
          1: {
            id: bookId,
            title: 'English Grammar Fundamentals',
            author: 'Dr. Sarah Johnson'
          },
          2: {
            id: bookId,
            title: 'Advanced English Composition',
            author: 'Prof. Michael Chen'
          },
          11: {
            id: bookId,
            title: 'Master English: Complete Language Course',
            author: 'Dr. Emily Rodriguez'
          }
        };
        
        const bookData = mockBookData[parseInt(bookId)] || mockBookData[1];
        setBook(bookData);
      }

      if (!chapter) {
        const mockChapterData = {
          1: { // Book ID 1
            1: { // Chapter 1
              id: chapterId,
              title: 'Basic Grammar Concepts',
              description: 'Introduction to parts of speech and sentence structure in English.',
              sections: [
                {
                  id: 1,
                  kind: 'INTRODUCTION',
                  title: 'Introduction to Grammar',
                  content: {
                    text: 'Welcome to Basic Grammar Concepts. This chapter will introduce you to the fundamental building blocks of English grammar.',
                    overview: 'Learn the essential grammar concepts that form the foundation of English language.',
                    key_concepts: ['Parts of speech', 'Sentence structure', 'Basic rules', 'Common patterns']
                  }
                },
                {
                  id: 2,
                  kind: 'POINT_WISE_SUMMARY',
                  title: 'Point-wise Summary',
                  content: {
                    points: [
                      'Understanding the eight parts of speech and their functions',
                      'Learning how sentences are structured with subjects and predicates',
                      'Mastering basic grammar rules for clear communication',
                      'Building a strong vocabulary foundation'
                    ],
                    main_ideas: ['Grammar fundamentals', 'Language structure', 'Basic patterns']
                  }
                },
                {
                  id: 3,
                  kind: 'SLOS',
                  title: 'Student Learning Objectives',
                  content: {
                    objectives: [
                      'Identify and classify different parts of speech correctly',
                      'Understand and apply basic sentence structure rules',
                      'Apply grammar rules correctly in writing and speaking',
                      'Build confidence in using English grammar'
                    ],
                    outcomes: ['Knowledge of grammar', 'Improved writing', 'Better communication']
                  }
                },
                {
                  id: 4,
                  kind: 'PRE_READING_QUESTIONS',
                  title: 'Pre-reading Questions',
                  content: {
                    questions: [
                      'What do you already know about English grammar?',
                      'How do you think grammar helps in clear communication?',
                      'What grammar concepts do you find most challenging?'
                    ],
                    purpose: 'These questions help prepare your mind for learning grammar concepts.'
                  }
                },
                {
                  id: 5,
                  kind: 'VOCABULARY_TEXT_TRANSLATION',
                  title: 'Vocabulary, Text & Translation',
                  content: {
                    vocabulary: {
                      'grammar': 'The rules and structure of a language',
                      'sentence': 'A group of words that express a complete thought',
                      'structure': 'The way something is organized or arranged'
                    },
                    text: 'This section covers essential grammar concepts with practical examples.',
                    translation: 'Key terms will be explained in simple language for better understanding.'
                  }
                },
                {
                  id: 6,
                  kind: 'GLOSSARY',
                  title: 'Glossary',
                  content: {
                    terms: {
                      'grammar': 'The system of rules that govern how words are used in a language',
                      'sentence': 'A grammatical unit that contains a subject and predicate',
                      'structure': 'The arrangement of and relations between the parts of something'
                    }
                  }
                },
                {
                  id: 7,
                  kind: 'EXERCISE_SHORT_QUESTIONS',
                  title: 'Exercise: Short Questions',
                  content: {
                    questions: [
                      'What are the eight main parts of speech in English?',
                      'How does sentence structure work in English?',
                      'Why is grammar important for effective communication?'
                    ],
                    answers: {
                      'What are the eight main parts of speech in English?': 'Nouns, verbs, adjectives, adverbs, pronouns, prepositions, conjunctions, and interjections',
                      'How does sentence structure work in English?': 'A sentence typically has a subject and a predicate',
                      'Why is grammar important for effective communication?': 'Grammar helps us organize our thoughts clearly and avoid misunderstandings'
                    }
                  }
                },
                {
                  id: 8,
                  kind: 'EXERCISE_OBJECTIVES',
                  title: 'Exercise: Objectives',
                  content: {
                    questions: [
                      {
                        question: 'Which of the following is NOT a part of speech?',
                        options: ['Noun', 'Verb', 'Sentence', 'Adjective'],
                        correct_answer: 'Sentence'
                      },
                      {
                        question: 'True or False: Grammar is not important for communication.',
                        options: ['True', 'False'],
                        correct_answer: 'False'
                      }
                    ]
                  }
                },
                {
                  id: 9,
                  kind: 'EXERCISE_VOCABULARY_GRAMMAR',
                  title: 'Exercise: Vocabulary and Grammar',
                  content: {
                    vocabulary_exercises: [
                      'Match words with their definitions',
                      'Fill in the blanks with correct words',
                      'Identify parts of speech in sentences'
                    ],
                    grammar_exercises: [
                      'Correct grammar errors in sentences',
                      'Complete sentences with appropriate words',
                      'Practice subject-verb agreement'
                    ]
                  }
                },
                {
                  id: 10,
                  kind: 'EXERCISE_ORAL_COMMUNICATION',
                  title: 'Exercise: Oral Communication',
                  content: {
                    speaking_activities: [
                      'Practice pronunciation of grammar terms',
                      'Discuss grammar concepts with classmates',
                      'Explain grammar rules to others'
                    ],
                    discussion_topics: [
                      'How does grammar help in speaking clearly?',
                      'What grammar mistakes do you commonly make?',
                      'How can we improve our grammar in daily conversations?'
                    ]
                  }
                },
                {
                  id: 11,
                  kind: 'EXERCISE_WRITING_SKILLS',
                  title: 'Exercise: Writing Skills',
                  content: {
                    writing_prompts: [
                      'Write about your experience learning grammar',
                      'Create sentences using different parts of speech',
                      'Explain a grammar rule in your own words'
                    ],
                    writing_tasks: [
                      'Grammar practice exercises with corrections',
                      'Sentence construction practice',
                      'Grammar rule explanations in writing'
                    ]
                  }
                },
                {
                  id: 12,
                  kind: 'IDIOMS_PHRASAL_VERBS',
                  title: 'Idioms and Phrasal Verbs of the Lesson',
                  content: {
                    idioms: {
                      'get the hang of': 'To learn how to do something after practicing',
                      'piece of cake': 'Something very easy to do',
                      'hit the books': 'To study hard and seriously'
                    },
                    phrasal_verbs: {
                      'look up': 'To search for information in a book or online',
                      'figure out': 'To understand or solve something',
                      'catch on': 'To understand or learn something'
                    }
                  }
                },
                {
                  id: 13,
                  kind: 'ASSESSMENT_TEST',
                  title: 'Assessment Test',
                  content: {
                    questions: [
                      {
                        question: 'What is the main purpose of this chapter?',
                        type: 'multiple_choice',
                        options: ['To memorize vocabulary', 'To understand grammar basics', 'To pass an exam', 'To complete homework'],
                        correct_answer: 'To understand grammar basics',
                        marks: 10
                      },
                      {
                        question: 'Explain how grammar helps in communication.',
                        type: 'short_answer',
                        marks: 15
                      }
                    ],
                    time_limit: '30 minutes',
                    total_marks: 25
                  }
                }
              ]
            }
          },
          2: { // Book ID 2
            1: { // Chapter 1
              id: chapterId,
              title: 'Essay Writing Fundamentals',
              description: 'Learn the basics of essay structure and organization.',
              sections: [
                {
                  id: 1,
                  kind: 'INTRODUCTION',
                  title: 'Introduction to Essay Writing',
                  content: {
                    text: 'Welcome to Essay Writing Fundamentals. This chapter will teach you how to write clear, organized essays.',
                    overview: 'Learn the essential elements of essay writing and structure.',
                    key_concepts: ['Essay structure', 'Organization', 'Clear writing', 'Logical flow']
                  }
                },
                {
                  id: 2,
                  kind: 'POINT_WISE_SUMMARY',
                  title: 'Point-wise Summary',
                  content: {
                    points: [
                      'Understanding essay structure and organization',
                      'Learning to write clear thesis statements',
                      'Developing logical arguments with evidence',
                      'Creating smooth transitions between ideas'
                    ],
                    main_ideas: ['Structure', 'Organization', 'Clarity', 'Logic']
                  }
                },
                {
                  id: 3,
                  kind: 'SLOS',
                  title: 'Student Learning Objectives',
                  content: {
                    objectives: [
                      'Master essay structure and organization',
                      'Write clear and focused thesis statements',
                      'Develop logical arguments with evidence',
                      'Create smooth transitions between ideas'
                    ],
                    outcomes: ['Essay writing skills', 'Critical thinking', 'Clear communication']
                  }
                },
                {
                  id: 4,
                  kind: 'PRE_READING_QUESTIONS',
                  title: 'Pre-reading Questions',
                  content: {
                    questions: [
                      'What makes a good essay in your opinion?',
                      'How do you currently organize your writing?',
                      'What challenges do you face when writing essays?'
                    ],
                    purpose: 'These questions help prepare your mind for learning essay writing techniques.'
                  }
                },
                {
                  id: 5,
                  kind: 'VOCABULARY_TEXT_TRANSLATION',
                  title: 'Vocabulary, Text & Translation',
                  content: {
                    vocabulary: {
                      'thesis': 'The main argument of an essay',
                      'structure': 'The organization of ideas',
                      'transition': 'Words that connect ideas',
                      'evidence': 'Supporting facts and examples'
                    },
                    text: 'This section covers essential essay writing concepts.',
                    translation: 'Key terms will be explained clearly with examples.'
                  }
                },
                {
                  id: 6,
                  kind: 'GLOSSARY',
                  title: 'Glossary',
                  content: {
                    terms: {
                      'thesis': 'The central argument of an essay',
                      'structure': 'The organization of ideas in writing',
                      'transition': 'Connecting words between ideas',
                      'evidence': 'Supporting material for arguments'
                    }
                  }
                },
                {
                  id: 7,
                  kind: 'EXERCISE_SHORT_QUESTIONS',
                  title: 'Exercise: Short Questions',
                  content: {
                    questions: [
                      'What are the main parts of an essay?',
                      'Why is a thesis statement important?',
                      'How do transitions improve essay flow?'
                    ],
                    answers: {
                      'What are the main parts of an essay?': 'Introduction, body, and conclusion',
                      'Why is a thesis statement important?': 'It provides focus and guides the reader',
                      'How do transitions improve essay flow?': 'They create smooth connections between ideas'
                    }
                  }
                },
                {
                  id: 8,
                  kind: 'EXERCISE_OBJECTIVES',
                  title: 'Exercise: Objectives',
                  content: {
                    questions: [
                      {
                        question: 'Which part contains the thesis statement?',
                        options: ['Body', 'Conclusion', 'Introduction'],
                        correct_answer: 'Introduction'
                      }
                    ]
                  }
                },
                {
                  id: 9,
                  kind: 'EXERCISE_VOCABULARY_GRAMMAR',
                  title: 'Exercise: Vocabulary and Grammar',
                  content: {
                    vocabulary_exercises: ['Learn essay writing terms', 'Practice academic vocabulary'],
                    grammar_exercises: ['Improve sentence structure', 'Work on transitions']
                  }
                },
                {
                  id: 10,
                  kind: 'EXERCISE_ORAL_COMMUNICATION',
                  title: 'Exercise: Oral Communication',
                  content: {
                    speaking_activities: ['Present essay outlines', 'Discuss essay topics'],
                    discussion_topics: ['How does speaking help writing?', 'What makes good essays?']
                  }
                },
                {
                  id: 11,
                  kind: 'EXERCISE_WRITING_SKILLS',
                  title: 'Exercise: Writing Skills',
                  content: {
                    writing_prompts: ['Write a thesis statement', 'Create an essay outline'],
                    writing_tasks: ['Essay outline creation', 'Thesis statement writing']
                  }
                },
                {
                  id: 12,
                  kind: 'IDIOMS_PHRASAL_VERBS',
                  title: 'Idioms and Phrasal Verbs of the Lesson',
                  content: {
                    idioms: {
                      'get to the point': 'Speak directly about the main issue',
                      'in a nutshell': 'Summarize briefly'
                    },
                    phrasal_verbs: {
                      'come up with': 'Think of an idea',
                      'get across': 'Make something understood'
                    }
                  }
                },
                {
                  id: 13,
                  kind: 'ASSESSMENT_TEST',
                  title: 'Assessment Test',
                  content: {
                    questions: [
                      {
                        question: 'What is the purpose of an essay introduction?',
                        type: 'multiple_choice',
                        options: ['To list points', 'To introduce topic and thesis', 'To provide evidence'],
                        correct_answer: 'To introduce topic and thesis',
                        marks: 10
                      }
                    ],
                    time_limit: '30 minutes',
                    total_marks: 10
                  }
                }
              ]
            }
          },
          11: { // Book ID 11
            1: { // Chapter 1
              id: chapterId,
              title: 'English Fundamentals: Building Strong Foundations',
              description: 'Master the basics of English grammar and vocabulary.',
              sections: [
                {
                  id: 1,
                  kind: 'INTRODUCTION',
                  title: 'Introduction to English Fundamentals',
                  content: {
                    text: 'Welcome to English Fundamentals. This comprehensive chapter covers all essential aspects of English language learning.',
                    overview: 'Build a strong foundation in English with grammar, vocabulary, and communication skills.',
                    key_concepts: ['Grammar basics', 'Vocabulary building', 'Communication skills', 'Practical application']
                  }
                },
                {
                  id: 2,
                  kind: 'POINT_WISE_SUMMARY',
                  title: 'Point-wise Summary',
                  content: {
                    points: [
                      'Understanding fundamental English concepts',
                      'Building comprehensive vocabulary',
                      'Developing communication skills',
                      'Applying language in real situations'
                    ],
                    main_ideas: ['Grammar mastery', 'Vocabulary expansion', 'Communication skills']
                  }
                },
                {
                  id: 3,
                  kind: 'SLOS',
                  title: 'Student Learning Objectives',
                  content: {
                    objectives: [
                      'Master fundamental English grammar',
                      'Build comprehensive vocabulary',
                      'Develop communication skills',
                      'Apply language practically'
                    ],
                    outcomes: ['Grammar proficiency', 'Vocabulary mastery', 'Communication competence']
                  }
                },
                {
                  id: 4,
                  kind: 'PRE_READING_QUESTIONS',
                  title: 'Pre-reading Questions',
                  content: {
                    questions: [
                      'What are your current English strengths?',
                      'How do you plan to use English?',
                      'What areas do you want to improve?'
                    ],
                    purpose: 'Assess your current level and set learning goals.'
                  }
                },
                {
                  id: 5,
                  kind: 'VOCABULARY_TEXT_TRANSLATION',
                  title: 'Vocabulary, Text & Translation',
                  content: {
                    vocabulary: {
                      'fundamental': 'Basic and essential',
                      'comprehensive': 'Complete and thorough',
                      'proficiency': 'High degree of skill'
                    },
                    text: 'This section covers essential English language concepts.',
                    translation: 'Key concepts explained clearly with examples.'
                  }
                },
                {
                  id: 6,
                  kind: 'GLOSSARY',
                  title: 'Glossary',
                  content: {
                    terms: {
                      'fundamental': 'Basic and essential; forming a foundation',
                      'comprehensive': 'Complete and thorough; covering all aspects',
                      'proficiency': 'A high degree of skill or expertise'
                    }
                  }
                },
                {
                  id: 7,
                  kind: 'EXERCISE_SHORT_QUESTIONS',
                  title: 'Exercise: Short Questions',
                  content: {
                    questions: [
                      'What are the components of communication?',
                      'How does vocabulary improve skills?',
                      'Why is grammar important?'
                    ],
                    answers: {
                      'What are the components of communication?': 'Speaking, listening, and understanding',
                      'How does vocabulary improve skills?': 'Allows precise expression and comprehension',
                      'Why is grammar important?': 'Provides structure for clear communication'
                    }
                  }
                },
                {
                  id: 8,
                  kind: 'EXERCISE_OBJECTIVES',
                  title: 'Exercise: Objectives',
                  content: {
                    questions: [
                      {
                        question: 'What is most important for language learning?',
                        options: ['Memorizing rules', 'Regular practice', 'Perfect pronunciation'],
                        correct_answer: 'Regular practice'
                      }
                    ]
                  }
                },
                {
                  id: 9,
                  kind: 'EXERCISE_VOCABULARY_GRAMMAR',
                  title: 'Exercise: Vocabulary and Grammar',
                  content: {
                    vocabulary_exercises: ['Match words with definitions', 'Create sentences'],
                    grammar_exercises: ['Practice sentence structures', 'Work on verb tenses']
                  }
                },
                {
                  id: 10,
                  kind: 'EXERCISE_ORAL_COMMUNICATION',
                  title: 'Exercise: Oral Communication',
                  content: {
                    speaking_activities: ['Practice pronunciation', 'Engage in conversations'],
                    discussion_topics: ['How do you prefer to learn?', 'What challenges do you face?']
                  }
                },
                {
                  id: 11,
                  kind: 'EXERCISE_WRITING_SKILLS',
                  title: 'Exercise: Writing Skills',
                  content: {
                    writing_prompts: ['Write about your learning journey', 'Describe your goals'],
                    writing_tasks: ['Journal writing', 'Short paragraphs']
                  }
                },
                {
                  id: 12,
                  kind: 'IDIOMS_PHRASAL_VERBS',
                  title: 'Idioms and Phrasal Verbs of the Lesson',
                  content: {
                    idioms: {
                      'get the hang of': 'Learn how to do something',
                      'piece of cake': 'Something very easy'
                    },
                    phrasal_verbs: {
                      'look up': 'Search for information',
                      'figure out': 'Understand something'
                    }
                  }
                },
                {
                  id: 13,
                  kind: 'ASSESSMENT_TEST',
                  title: 'Assessment Test',
                  content: {
                    questions: [
                      {
                        question: 'What is the main goal of this course?',
                        type: 'multiple_choice',
                        options: ['To pass exams', 'To build strong foundations', 'To memorize vocabulary'],
                        correct_answer: 'To build strong foundations',
                        marks: 15
                      }
                    ],
                    time_limit: '45 minutes',
                    total_marks: 15
                  }
                }
              ]
            }
          }
        };
        
        const bookChapters = mockChapterData[parseInt(bookId)] || {};
        const chapterData = bookChapters[parseInt(chapterId)] || bookChapters[1] || {
          id: chapterId,
          title: 'English Language Learning',
          description: 'Learn English fundamentals and communication skills.',
          sections: []
        };
        
        setChapter(chapterData);
      }

      if (chapters.length === 0) {
        const mockChaptersData = {
          1: [ // English Grammar Fundamentals
            { id: 1, title: 'Basic Grammar Concepts' },
            { id: 2, title: 'Essential Vocabulary Building' }
          ],
          2: [ // Advanced English Composition
            { id: 1, title: 'Essay Writing Fundamentals' },
            { id: 2, title: 'Advanced Writing Techniques' }
          ],
          11: [ // Master English: Complete Language Course
            { id: 1, title: 'English Fundamentals: Building Strong Foundations' },
            { id: 2, title: 'Effective Communication: Speaking with Confidence' },
            { id: 3, title: 'Advanced Writing: Expressing Ideas Clearly' }
          ]
        };
        
        const chaptersData = mockChaptersData[parseInt(bookId)] || mockChaptersData[1];
        setChapters(chaptersData);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load chapter content');
    } finally {
      setIsLoading(false);
    }
  };

  const currentChapterIndex = chapters.findIndex(ch => ch.id === parseInt(chapterId));
  const hasPreviousChapter = currentChapterIndex > 0;
  const hasNextChapter = currentChapterIndex < chapters.length - 1;

  const navigateToChapter = (direction) => {
    if (direction === 'prev' && hasPreviousChapter) {
      const prevChapter = chapters[currentChapterIndex - 1];
      navigate(`/app/library/${bookId}/chapter/${prevChapter.id}`);
    } else if (direction === 'next' && hasNextChapter) {
      const nextChapter = chapters[currentChapterIndex + 1];
      navigate(`/app/library/${bookId}/chapter/${nextChapter.id}`);
    }
  };

  const handleSectionComplete = (sectionId, sectionIndex) => {
    // Add section to completed sections
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
      
      // Progress is now calculated dynamically from completedSections
      
      // Auto-expand next section if available
      if (sectionIndex < chapter.sections.length - 1) {
        setCurrentSection(sectionIndex + 1);
      }
      
      toast.success('Section completed!');
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
    toast.success(isPlaying ? 'Audio paused' : 'Audio playing');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement actual mute functionality
    toast.success(isMuted ? 'Audio unmuted' : 'Audio muted');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!chapter || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chapter not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The chapter you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      {/* Top Header Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to={`/app/library/${bookId}`}
                className="text-[#1E3A8A] hover:text-[#1E40AF] flex items-center font-['Roboto'] font-medium transition-colors duration-200"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Back to Book
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-[#111827] font-['Roboto'] text-sm">{chapter.title}</span>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <button className="bg-[#10B981] text-white px-4 py-2 rounded-lg text-sm font-['Poppins'] font-semibold hover:bg-[#059669] transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <PlayIcon className="h-4 w-4 mr-2" />
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen flex-col">
        {/* Chapter Sections List */}
        <div className="w-fit bg-white border-r border-gray-200 p-3 shadow-sm flex flex-col gap-10 ">
          <h3 className="text-base font-['Poppins'] font-bold text-[#111827] mb-3 text-center">Chapter Sections</h3>
          <div className="space-y-1 ">
            {chapter.sections?.map((section, index) => {
              const isCompleted = completedSections.includes(section.id);
              const isCurrent = index === currentSection;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={`w-90 text-left p-3 rounded-md ml-5 border border-gray-200 transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#10B981] text-white shadow-lg transform scale-105'
                      : isCompleted
                      ? 'bg-[#1E3A8A] text-white shadow-md'
                      : 'hover:bg-gray-50 text-[#111827] hover:shadow-md hover:transform hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-['Poppins'] font-medium ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-white' : 'text-[#111827]'
                    }`}>
                      {String.fromCharCode(97 + index)}. {section.kind ? section.kind.replace(/_/g, ' ') : section.title}
                    </span>
                    {isCompleted && (
                      <CheckCircleIcon className="h-3 w-3 text-[#FBBF24]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#F9FAFB] p-4 w-screen md:w-screen">
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-4 w-[76%]">
            <div className="flex items-center space-x-2 ">
              <button className="flex items-center px-3 py-2 border border-[#1E3A8A] rounded-md text-sm font-['Poppins'] font-semibold text-[#1E3A8A] bg-white hover:bg-[#1E3A8A] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <AcademicCapIcon className="h-4 w-4 mr-1" />
                AI Help
              </button>
              <button className="flex items-center px-3 py-2 border border-[#10B981] rounded-md text-sm font-['Poppins'] font-semibold text-[#10B981] bg-white hover:bg-[#10B981] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <SpeakerWaveIcon className="h-4 w-4 mr-1" />
                Read Aloud
              </button>
              <button className="flex items-center px-3 py-2 border border-[#FBBF24] rounded-md text-sm font-['Poppins'] font-semibold text-[#FBBF24] bg-white hover:bg-[#FBBF24] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <BookmarkIcon className="h-4 w-4 mr-1" />
                Bookmark
              </button>
            </div>
            
            <button className="bg-[#10B981] text-white px-4 py-2 rounded-md text-sm font-['Poppins'] font-semibold hover:bg-[#059669] transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <PlayIcon className="h-4 w-4 mr-1" />
              Mark Complete
            </button>
          </div>

          {/* Section Content */}
          <div className="mb-4 ">
            <h1 className="text-xl font-['Poppins'] font-bold text-[#111827] mb-3">
              {chapter.sections?.[currentSection]?.kind ? 
                chapter.sections[currentSection].kind.replace(/_/g, ' ') : 
                'Introduction'
              }
            </h1>
            
            <div className="prose max-w-none">
              {chapter.sections && chapter.sections[currentSection] ? (
                <div className="bg-white w-[76%] rounded-lg border border-gray-200 p-4 shadow-lg">
                  <div className="space-y-3">
                    {(() => {
                      const section = chapter.sections[currentSection];
                      const { kind, content } = section;
                      
                      switch (kind) {
                        case 'INTRODUCTION':
                          return (
                            <div className="space-y-4">
                              {content.text && (
                                <p className="text-[#111827] leading-relaxed text-base font-['Roboto']">{content.text}</p>
                              )}
                              {content.overview && (
                                <div className="bg-[#1E3A8A] bg-opacity-10 p-3 rounded-md border-l-4 border-[#1E3A8A]">
                                  <h4 className="font-['Poppins'] font-bold text-[#1E3A8A] mb-2 text-sm">Overview</h4>
                                  <p className="text-[#1E3A8A] font-['Roboto'] leading-relaxed text-sm">{content.overview}</p>
                                </div>
                              )}
                              {content.key_concepts && (
                                <div className="bg-[#F9FAFB] p-3 rounded-md border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-2 text-sm">Key Concepts</h4>
                                  <ul className="space-y-1">
                                    {content.key_concepts.map((concept, index) => (
                                      <li key={index} className="flex items-start space-x-2">
                                        <span className="flex-shrink-0 w-4 h-4 bg-[#10B981] text-white rounded-full flex items-center justify-center text-xs font-['Poppins'] font-bold">
                                          {index + 1}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] text-sm">{concept}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'POINT_WISE_SUMMARY':
                          return (
                            <div className="space-y-4">
                              {content.points && (
                                <div className="bg-[#F9FAFB] p-4 rounded-lg border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-3 text-base">Main Points</h4>
                                  <ul className="space-y-2">
                                    {content.points.map((point, index) => (
                                      <li key={index} className="flex items-start space-x-2">
                                        <span className="flex-shrink-0 w-5 h-5 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-xs font-['Poppins'] font-bold">
                                          {String.fromCharCode(97 + index)}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed text-sm">{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'SLOS':
                          return (
                            <div className="space-y-4">
                              {content.objectives && (
                                <div className="bg-[#F9FAFB] p-4 rounded-lg border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-3 text-base">Learning Objectives</h4>
                                  <ul className="space-y-2">
                                    {content.objectives.map((objective, index) => (
                                      <li key={index} className="flex items-start space-x-2">
                                        <span className="flex-shrink-0 w-5 h-5 bg-[#10B981] text-white rounded-full flex items-center justify-center text-xs font-['Poppins'] font-bold">
                                          {index + 1}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed text-sm">{objective}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'PRE_READING_QUESTIONS':
                          return (
                            <div className="space-y-4">
                              {content.questions && (
                                <div className="bg-[#F9FAFB] p-4 rounded-lg border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-3 text-base">Pre-reading Questions</h4>
                                  <ul className="space-y-2">
                                    {content.questions.map((question, index) => (
                                      <li key={index} className="flex items-start space-x-2">
                                        <span className="flex-shrink-0 w-5 h-5 bg-[#FBBF24] text-white rounded-full flex items-center justify-center text-xs font-['Poppins'] font-bold">
                                          {String.fromCharCode(97 + index)}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed text-sm">{question}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {content.purpose && (
                                <div className="bg-[#FBBF24] bg-opacity-10 p-4 rounded-lg border-l-4 border-[#FBBF24]">
                                  <h4 className="font-['Poppins'] font-bold text-[#B45309] mb-2 text-base">Purpose</h4>
                                  <p className="text-[#B45309] font-['Roboto'] leading-relaxed text-sm">{content.purpose}</p>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'VOCABULARY_TEXT_TRANSLATION':
                          return (
                            <div className="space-y-6">
                              {content.vocabulary && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Key Vocabulary</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(content.vocabulary).map(([word, definition]) => (
                                      <div key={word} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <span className="font-['Poppins'] font-bold text-[#1E3A8A] text-lg">{word}</span>
                                        <p className="text-[#111827] font-['Roboto'] text-sm mt-2 leading-relaxed">{definition}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {content.text && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Main Text</h4>
                                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <p className="text-[#111827] font-['Roboto'] leading-relaxed text-lg">{content.text}</p>
                                  </div>
                                </div>
                              )}
                              {content.translation && (
                                <div className="bg-[#10B981] bg-opacity-10 p-6 rounded-xl border-l-4 border-[#10B981]">
                                  <h4 className="font-['Poppins'] font-bold text-[#10B981] mb-3 text-lg">Translation</h4>
                                  <p className="text-[#10B981] font-['Roboto'] leading-relaxed text-lg">{content.translation}</p>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'GLOSSARY':
                          return (
                            <div className="space-y-6">
                              {content.terms && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Terms and Definitions</h4>
                                  <div className="space-y-4">
                                    {Object.entries(content.terms).map(([term, definition]) => (
                                      <div key={term} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <span className="font-['Poppins'] font-bold text-[#1E3A8A] text-lg">{term}</span>
                                        <p className="text-[#111827] font-['Roboto'] text-sm mt-2 leading-relaxed">{definition}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'EXERCISE_SHORT_QUESTIONS':
                          return (
                            <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                              <h4 className="font-['Poppins'] font-bold text-[#111827] mb-6 text-xl">Short Answer Questions</h4>
                              <div className="space-y-6">
                                {content.questions && content.questions.map((question, index) => (
                                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-start space-x-4">
                                      <span className="flex-shrink-0 w-8 h-8 bg-[#FBBF24] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                        {index + 1}
                                      </span>
                                      <div className="flex-1">
                                        <h5 className="font-['Poppins'] font-bold text-[#111827] mb-3 text-lg">
                                          Question {index + 1}
                                        </h5>
                                        <p className="text-[#111827] font-['Roboto'] mb-4 text-lg leading-relaxed">{question}</p>
                                        {content.answers && content.answers[question] && (
                                          <div className="bg-[#10B981] bg-opacity-10 p-4 rounded-lg border border-[#10B981]">
                                            <p className="text-[#10B981] font-['Roboto'] text-sm">
                                              <strong>Answer:</strong> {content.answers[question]}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        
                        case 'EXERCISE_OBJECTIVES':
                          return (
                            <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                              <h4 className="font-['Poppins'] font-bold text-[#111827] mb-6 text-xl">Objective Questions</h4>
                              <div className="space-y-6">
                                {content.questions && content.questions.map((question, index) => (
                                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-start space-x-4">
                                      <span className="flex-shrink-0 w-8 h-8 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                        {index + 1}
                                      </span>
                                      <div className="flex-1">
                                        <h5 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">
                                          Question {index + 1}
                                        </h5>
                                        <p className="text-[#111827] font-['Roboto'] mb-4 text-lg leading-relaxed">{question.question}</p>
                                        <div className="space-y-3">
                                          {question.options && question.options.map((option, optIndex) => (
                                            <label key={optIndex} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                                              <input
                                                type="radio"
                                                name={`objective-${index}`}
                                                value={optIndex}
                                                className="mr-3 text-[#1E3A8A]"
                                                disabled
                                              />
                                              <span className={`text-sm font-['Roboto'] ${
                                                optIndex === question.correct_answer 
                                                  ? 'text-[#10B981] font-bold' 
                                                  : 'text-[#111827]'
                                              }`}>
                                                {option}
                                                {optIndex === question.correct_answer && ' ✓'}
                                              </span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        
                        case 'EXERCISE_VOCABULARY_GRAMMAR':
                          return (
                            <div className="space-y-6">
                              {content.vocabulary_exercises && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Vocabulary Exercises</h4>
                                  <ul className="space-y-3">
                                    {content.vocabulary_exercises.map((exercise, index) => (
                                      <li key={index} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                          {index + 1}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed">{exercise}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {content.grammar_exercises && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Grammar Exercises</h4>
                                  <ul className="space-y-3">
                                    {content.grammar_exercises.map((exercise, index) => (
                                      <li key={index} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-[#10B981] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                          {index + 1}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed">{exercise}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'EXERCISE_ORAL_COMMUNICATION':
                          return (
                            <div className="space-y-6">
                              {content.speaking_activities && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Speaking Activities</h4>
                                  <ul className="space-y-3">
                                    {content.speaking_activities.map((activity, index) => (
                                      <li key={index} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-[#10B981] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                          {index + 1}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed">{activity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {content.discussion_topics && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Discussion Topics</h4>
                                  <ul className="space-y-3">
                                    {content.discussion_topics.map((topic, index) => (
                                      <li key={index} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-[#FBBF24] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                          {String.fromCharCode(97 + index)}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed">{topic}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'EXERCISE_WRITING_SKILLS':
                          return (
                            <div className="space-y-6">
                              {content.writing_prompts && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Writing Prompts</h4>
                                  <ul className="space-y-3">
                                    {content.writing_prompts.map((prompt, index) => (
                                      <li key={index} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                          {index + 1}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed">{prompt}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {content.writing_tasks && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Writing Tasks</h4>
                                  <ul className="space-y-3">
                                    {content.writing_tasks.map((task, index) => (
                                      <li key={index} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-[#10B981] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                          {index + 1}
                                        </span>
                                        <span className="text-[#111827] font-['Roboto'] leading-relaxed">{task}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'IDIOMS_PHRASAL_VERBS':
                          return (
                            <div className="space-y-6">
                              {content.idioms && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Idioms</h4>
                                  <div className="space-y-4">
                                    {Object.entries(content.idioms).map(([idiom, meaning]) => (
                                      <div key={idiom} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <h5 className="font-['Poppins'] font-bold text-[#FBBF24] text-lg mb-2">{idiom}</h5>
                                        <p className="text-[#111827] font-['Roboto'] text-sm leading-relaxed">{meaning}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {content.phrasal_verbs && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">Phrasal Verbs</h4>
                                  <div className="space-y-4">
                                    {Object.entries(content.phrasal_verbs).map(([phrasal, meaning]) => (
                                      <div key={phrasal} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <h5 className="font-['Poppins'] font-bold text-[#FBBF24] text-lg mb-2">{phrasal}</h5>
                                        <p className="text-[#111827] font-['Roboto'] text-sm leading-relaxed">{meaning}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        
                        case 'ASSESSMENT_TEST':
                          return (
                            <div className="space-y-6">
                              {content.time_limit && content.total_marks && (
                                <div className="bg-[#FBBF24] bg-opacity-10 p-6 rounded-xl border-l-4 border-[#FBBF24]">
                                  <h4 className="font-['Poppins'] font-bold text-[#B45309] mb-4 text-lg">Test Information</h4>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <span className="text-[#B45309] font-['Poppins'] font-bold text-sm">Time Limit:</span>
                                      <p className="text-[#B45309] font-['Roboto'] text-lg font-semibold">{content.time_limit}</p>
                                    </div>
                                    <div>
                                      <span className="text-[#B45309] font-['Poppins'] font-bold text-sm">Total Marks:</span>
                                      <p className="text-[#B45309] font-['Roboto'] text-lg font-semibold">{content.total_marks}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {content.questions && (
                                <div className="bg-[#F9FAFB] p-6 rounded-xl border border-gray-200">
                                  <h4 className="font-['Poppins'] font-bold text-[#111827] mb-6 text-xl">Assessment Questions</h4>
                                  <div className="space-y-6">
                                    {content.questions.map((question, index) => (
                                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <div className="flex items-start space-x-4">
                                          <span className="flex-shrink-0 w-8 h-8 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-sm font-['Poppins'] font-bold">
                                            {index + 1}
                                          </span>
                                          <div className="flex-1">
                                            <h5 className="font-['Poppins'] font-bold text-[#111827] mb-4 text-lg">
                                              Question {index + 1} ({question.marks} marks)
                                            </h5>
                                            <p className="text-[#111827] font-['Roboto'] mb-4 text-lg leading-relaxed">{question.question}</p>
                                            {question.options && (
                                              <div className="space-y-3">
                                                {question.options.map((option, optIndex) => (
                                                  <label key={optIndex} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                                                    <input
                                                      type="radio"
                                                      name={`assessment-${index}`}
                                                      value={optIndex}
                                                      className="mr-3"
                                                      disabled
                                                    />
                                                    <span className="text-sm font-['Roboto'] text-[#111827]">{option}</span>
                                                  </label>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        
                        default:
                          return (
                            <div className="text-center py-12">
                              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="text-[#111827] font-['Roboto'] mt-4">Section content not available.</p>
                            </div>
                          );
                      }
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-['Poppins'] font-bold text-[#111827]">No sections available</h3>
                  <p className="mt-1 text-sm font-['Roboto'] text-gray-500">
                    This chapter doesn't have any sections yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-4 w-[76%]">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-['Poppins'] font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <ChevronLeftIcon className="h-4 w-4 " />
              Previous Section
            </button>
            
            <button
              onClick={() => setCurrentSection(Math.min((chapter.sections?.length || 1) - 1, currentSection + 1))}
              disabled={currentSection >= (chapter.sections?.length || 1) - 1}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-['Poppins'] font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
            >
              Next Section
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* Personal Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg w-[76%]">
            <h3 className="text-base font-['Poppins'] font-bold text-[#111827] mb-3">Personal Notes</h3>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Add your notes for this section..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E40AF] resize-none font-['Roboto'] text-sm"
              rows={2}
            />
            <button className="mt-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-md text-sm font-['Poppins'] font-semibold hover:bg-[#1E40AF] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterViewerPage; 