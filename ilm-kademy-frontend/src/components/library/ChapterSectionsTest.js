import React, { useState } from 'react';
import ChapterSections from './ChapterSections';

const ChapterSectionsTest = () => {
  const [completedSections, setCompletedSections] = useState([]);

  // Sample data that matches the structure from our backend
  const sampleSections = [
    {
      id: 1,
      kind: 'INTRODUCTION',
      title: 'Understanding Communication',
      content: {
        text: 'Communication is the foundation of human interaction. This chapter explores the principles of effective communication in English, covering both verbal and non-verbal aspects.',
        key_concepts: ['Verbal communication', 'Non-verbal cues', 'Active listening', 'Clear expression'],
        overview: 'Learn how to express yourself clearly, listen actively, and understand the nuances of English communication.'
      }
    },
    {
      id: 2,
      kind: 'SUMMARY',
      title: 'Chapter Overview',
      content: {
        main_points: [
          'Communication involves both speaking and listening',
          'Non-verbal cues enhance verbal messages',
          'Active listening requires full attention and engagement',
          'Clear expression depends on vocabulary and grammar',
          'Cultural context influences communication styles'
        ],
        learning_outcomes: 'By the end of this chapter, you will be able to communicate more effectively in various situations.'
      }
    },
    {
      id: 3,
      kind: 'SLOS',
      title: 'Student Learning Objectives',
      content: {
        objectives: [
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
      id: 4,
      kind: 'PRE_READING',
      title: 'Pre-Reading Questions',
      content: {
        questions: [
          'What makes a conversation successful?',
          'How do you know when someone is really listening to you?',
          'What role does body language play in communication?',
          'How does culture affect the way people communicate?',
          'What are some common communication problems you face?'
        ],
        reflection_prompt: 'Think about a recent conversation that went well. What made it successful?'
      }
    },
    {
      id: 5,
      kind: 'VOCABULARY_TRANSLATION',
      title: 'Key Vocabulary & Translation',
      content: {
        vocabulary: [
          {
            word: 'Articulate',
            definition: 'To express thoughts clearly and effectively',
            translation: 'واضح طور پر اظہار کرنا',
            example: 'She was able to articulate her ideas clearly during the presentation.',
            synonyms: ['express', 'communicate', 'convey']
          },
          {
            word: 'Empathy',
            definition: 'The ability to understand and share the feelings of others',
            translation: 'ہمدردی',
            example: 'Showing empathy helps build stronger relationships.',
            synonyms: ['compassion', 'understanding', 'sympathy']
          }
        ],
        text: 'Effective communication requires a rich vocabulary and understanding of subtle meanings.',
        translation: 'موثر مواصلات کے لیے وسیع الفاظ اور باریک معانی کی سمجھ درکار ہے۔'
      }
    },
    {
      id: 6,
      kind: 'GLOSSARY',
      title: 'Important Terms',
      content: {
        terms: {
          'Active Listening': 'A communication technique that requires the listener to fully concentrate, understand, respond, and remember what is being said.',
          'Body Language': 'Non-verbal communication through facial expressions, gestures, posture, and eye contact.',
          'Communication Barrier': 'Any obstacle that prevents effective communication between people.'
        }
      }
    },
    {
      id: 7,
      kind: 'SHORT_QUESTIONS',
      title: 'Short Answer Questions',
      content: {
        questions: [
          {
            question: 'What are the three main components of communication?',
            answer: 'Sender, message, and receiver are the three main components of communication.',
            explanation: 'Communication is a process that involves these three essential elements working together.'
          },
          {
            question: 'How does active listening differ from passive listening?',
            answer: 'Active listening involves full attention, understanding, and response, while passive listening is just hearing without engagement.',
            explanation: 'Active listening requires mental effort and participation in the communication process.'
          }
        ]
      }
    },
    {
      id: 8,
      kind: 'OBJECTIVE_QUESTIONS',
      title: 'Multiple Choice Questions',
      content: {
        questions: [
          {
            question: 'Which of the following is NOT a component of effective communication?',
            options: ['Clear expression', 'Active listening', 'Cultural awareness', 'Monopolizing conversation'],
            correct_answer: 3,
            explanation: 'Monopolizing conversation is actually a barrier to effective communication.'
          },
          {
            question: 'What percentage of communication is non-verbal according to research?',
            options: ['30-40%', '50-60%', '70-80%', '90-100%'],
            correct_answer: 2,
            explanation: 'Research suggests that 70-80% of communication is non-verbal.'
          }
        ]
      }
    },
    {
      id: 9,
      kind: 'VOCAB_GRAMMAR',
      title: 'Vocabulary & Grammar Practice',
      content: {
        vocabulary_exercises: [
          {
            exercise: 'Fill in the blanks with appropriate vocabulary words',
            sentences: [
              'Good leaders must be able to _____ their vision clearly to their team.',
              'Showing _____ helps build trust in relationships.',
              'Understanding cultural _____ prevents misunderstandings.'
            ],
            answers: ['articulate', 'empathy', 'nuances']
          }
        ],
        grammar_focus: {
          topic: 'Modal Verbs for Communication',
          examples: [
            'You should listen carefully to understand better.',
            'You could ask for clarification if needed.',
            'You must be respectful in all communications.'
          ],
          practice: 'Complete the sentences using appropriate modal verbs: "You _____ always be clear in your communication."'
        }
      }
    },
    {
      id: 10,
      kind: 'ORAL_COMMUNICATION',
      title: 'Speaking Activities',
      content: {
        activities: [
          {
            activity: 'Role-Play: Difficult Conversation',
            description: 'Practice having a difficult conversation with a partner.',
            scenario: 'You\'ve been consistently working overtime but haven\'t received the promised compensation.',
            objectives: ['Practice clear expression', 'Use appropriate tone', 'Listen actively to responses']
          }
        ],
        speaking_tips: [
          'Speak clearly and at an appropriate pace',
          'Use pauses effectively to emphasize points',
          'Maintain appropriate eye contact'
        ]
      }
    },
    {
      id: 11,
      kind: 'WRITING_SKILLS',
      title: 'Writing Practice',
      content: {
        writing_tasks: [
          {
            task: 'Email Communication',
            description: 'Write a professional email to a colleague explaining a new project idea.',
            requirements: [
              'Clear subject line',
              'Professional greeting',
              'Concise explanation',
              'Call to action'
            ],
            word_limit: '150-200 words'
          }
        ],
        writing_tips: [
          'Use clear and concise language',
          'Organize your thoughts logically',
          'Proofread for clarity and accuracy'
        ]
      }
    },
    {
      id: 12,
      kind: 'IDIOMS_PHRASALS',
      title: 'Idioms & Phrasal Verbs',
      content: {
        idioms: [
          {
            idiom: 'Get the message across',
            meaning: 'To successfully communicate an idea or information',
            example: 'It took several attempts, but I finally got the message across to my team.',
            usage: 'Use when you want to emphasize successful communication.'
          }
        ],
        phrasal_verbs: [
          {
            phrasal: 'Speak up',
            meaning: 'To speak more loudly or to express your opinion',
            example: 'Don\'t be afraid to speak up if you have concerns.',
            usage: 'Use when encouraging someone to express their thoughts.'
          }
        ]
      }
    },
    {
      id: 13,
      kind: 'ASSESSMENT_TEST',
      title: 'Chapter Assessment',
      content: {
        test_info: {
          duration: '30 minutes',
          total_questions: 20,
          passing_score: '70%'
        },
        questions: [
          {
            question: 'What is the primary purpose of active listening?',
            options: [
              'To prepare your response while the other person is speaking',
              'To fully understand the speaker\'s message',
              'To show that you\'re paying attention',
              'To interrupt with your own ideas'
            ],
            correct_answer: 1,
            points: 5
          }
        ],
        scoring: {
          'excellent': '90-100%',
          'good': '80-89%',
          'satisfactory': '70-79%',
          'needs_improvement': 'Below 70%'
        }
      }
    }
  ];

  const handleSectionComplete = (sectionId, sectionIndex) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
      console.log(`Section ${sectionId} completed!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ChapterSections Component Test
          </h1>
          <p className="text-gray-600">
            This page tests the ChapterSections component with sample data to ensure it renders correctly.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Test Status:</strong> {completedSections.length} of {sampleSections.length} sections completed
            </p>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSections.length / sampleSections.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ChapterSections 
            sections={sampleSections}
            onSectionComplete={handleSectionComplete}
            completedSections={completedSections}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterSectionsTest; 