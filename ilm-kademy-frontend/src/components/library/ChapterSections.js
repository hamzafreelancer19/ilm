import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  BookOpenIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  LanguageIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  LightBulbIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const ChapterSections = ({ sections = [], onSectionComplete, completedSections = [] }) => {
  const [expandedSections, setExpandedSections] = useState(new Set([0])); // Start with first section expanded

  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionIcon = (kind) => {
    if (!kind) return DocumentTextIcon;
    
    const iconMap = {
      'INTRODUCTION': BookOpenIcon,
      'POINT_WISE_SUMMARY': DocumentTextIcon,
      'SLOS': AcademicCapIcon,
      'PRE_READING_QUESTIONS': QuestionMarkCircleIcon,
      'VOCABULARY_TEXT_TRANSLATION': LanguageIcon,
      'GLOSSARY': DocumentTextIcon,
      'EXERCISE_SHORT_QUESTIONS': QuestionMarkCircleIcon,
      'EXERCISE_OBJECTIVES': ClipboardDocumentCheckIcon,
      'EXERCISE_VOCABULARY_GRAMMAR': AcademicCapIcon,
      'EXERCISE_ORAL_COMMUNICATION': ChatBubbleLeftRightIcon,
      'EXERCISE_WRITING_SKILLS': PencilIcon,
      'IDIOMS_PHRASAL_VERBS': LightBulbIcon,
      'ASSESSMENT_TEST': ClipboardDocumentCheckIcon,
    };
    return iconMap[kind] || DocumentTextIcon;
  };

  const getSectionColor = (kind) => {
    if (!kind) return 'bg-gray-50 border-gray-200 text-gray-800';
    
    const colorMap = {
      'INTRODUCTION': 'bg-blue-50 border-blue-200 text-blue-800',
      'POINT_WISE_SUMMARY': 'bg-green-50 border-green-200 text-green-800',
      'SLOS': 'bg-purple-50 border-purple-200 text-purple-800',
      'PRE_READING_QUESTIONS': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'VOCABULARY_TEXT_TRANSLATION': 'bg-indigo-50 border-indigo-200 text-indigo-800',
      'GLOSSARY': 'bg-teal-50 border-teal-200 text-teal-800',
      'EXERCISE_SHORT_QUESTIONS': 'bg-orange-50 border-orange-200 text-orange-800',
      'EXERCISE_OBJECTIVES': 'bg-red-50 border-red-200 text-red-800',
      'EXERCISE_VOCABULARY_GRAMMAR': 'bg-pink-50 border-pink-200 text-pink-800',
      'EXERCISE_ORAL_COMMUNICATION': 'bg-emerald-50 border-emerald-200 text-emerald-800',
      'EXERCISE_WRITING_SKILLS': 'bg-cyan-50 border-cyan-200 text-cyan-800',
      'IDIOMS_PHRASAL_VERBS': 'bg-amber-50 border-amber-200 text-amber-800',
      'ASSESSMENT_TEST': 'bg-rose-50 border-rose-200 text-rose-800',
    };
    return colorMap[kind] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getSectionTitle = (kind) => {
    if (!kind) return 'Unknown Section';
    
    const titleMap = {
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
    };
    return titleMap[kind] || (typeof kind === 'string' ? kind.replace('_', ' ') : 'Unknown Section');
  };

  const renderSectionContent = (section) => {
    if (!section || !section.kind || !section.content) {
      return (
        <div className="text-gray-600 p-4">
          <p>Section content not available.</p>
        </div>
      );
    }
    
    const { kind, content } = section;

    switch (kind) {
      case 'INTRODUCTION':
        return (
          <div className="space-y-4">
            {content.text && (
              <p className="text-gray-700 leading-relaxed">{content.text}</p>
            )}
            {content.overview && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Overview</h4>
                <p className="text-blue-800">{content.overview}</p>
              </div>
            )}
            {content.key_concepts && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Concepts</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.key_concepts.map((concept, index) => (
                    <li key={index}>{concept}</li>
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
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Main Points</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {content.points.map((point, index) => (
                    <li key={index} className="text-gray-700">{point}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.main_ideas && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Ideas</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.main_ideas.map((idea, index) => (
                    <li key={index}>{idea}</li>
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
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {content.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.outcomes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Expected Outcomes</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.outcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
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
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Pre-reading Questions</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {content.questions.map((question, index) => (
                    <li key={index} className="text-gray-700">{question}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.purpose && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Purpose</h4>
                <p className="text-yellow-800">{content.purpose}</p>
              </div>
            )}
          </div>
        );

      case 'VOCABULARY_TEXT_TRANSLATION':
        return (
          <div className="space-y-4">
            {content.vocabulary && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Vocabulary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(content.vocabulary).map(([word, definition]) => (
                    <div key={word} className="bg-indigo-50 p-3 rounded-lg">
                      <span className="font-medium text-indigo-900">{word}</span>
                      <p className="text-indigo-800 text-sm mt-1">{definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content.text && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Main Text</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{content.text}</p>
                </div>
              </div>
            )}
            {content.translation && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Translation</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800">{content.translation}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'GLOSSARY':
        return (
          <div className="space-y-4">
            {content.terms && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Terms and Definitions</h4>
                <div className="space-y-3">
                  {Object.entries(content.terms).map(([term, definition]) => (
                    <div key={term} className="bg-teal-50 p-3 rounded-lg">
                      <span className="font-medium text-teal-900">{term}</span>
                      <p className="text-teal-800 text-sm mt-1">{definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'EXERCISE_SHORT_QUESTIONS':
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Short Answer Questions</h4>
            <div className="space-y-4">
              {content.questions && content.questions.map((question, index) => (
                <div key={index} className="bg-orange-50 p-4 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">
                    Question {index + 1}
                  </h5>
                  <p className="text-orange-800 mb-3">{question}</p>
                  {content.answers && content.answers[question] && (
                    <div className="bg-white p-3 rounded border border-orange-200">
                      <p className="text-sm text-gray-700">
                        <strong>Answer:</strong> {content.answers[question]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'EXERCISE_OBJECTIVES':
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Objective Questions</h4>
            <div className="space-y-4">
              {content.questions && content.questions.map((question, index) => (
                <div key={index} className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-3">
                    Question {index + 1}
                  </h5>
                  <p className="text-red-800 mb-3">{question.question}</p>
                  <div className="space-y-2">
                    {question.options && question.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`objective-${index}`}
                          value={optIndex}
                          className="mr-2 text-red-600"
                          disabled
                        />
                        <span className={`text-sm ${
                          optIndex === question.correct_answer 
                            ? 'text-green-700 font-medium' 
                            : 'text-gray-700'
                        }`}>
                          {option}
                          {optIndex === question.correct_answer && ' ✓'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'EXERCISE_VOCABULARY_GRAMMAR':
        return (
          <div className="space-y-4">
            {content.vocabulary_exercises && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Vocabulary Exercises</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.vocabulary_exercises.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.grammar_exercises && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Grammar Exercises</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.grammar_exercises.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'EXERCISE_ORAL_COMMUNICATION':
        return (
          <div className="space-y-4">
            {content.speaking_activities && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Speaking Activities</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.speaking_activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.discussion_topics && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Discussion Topics</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.discussion_topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'EXERCISE_WRITING_SKILLS':
        return (
          <div className="space-y-4">
            {content.writing_prompts && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Writing Prompts</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.writing_prompts.map((prompt, index) => (
                    <li key={index}>{prompt}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.writing_tasks && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Writing Tasks</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.writing_tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'IDIOMS_PHRASAL_VERBS':
        return (
          <div className="space-y-4">
            {content.idioms && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Idioms</h4>
                <div className="space-y-3">
                  {Object.entries(content.idioms).map(([idiom, meaning]) => (
                    <div key={idiom} className="bg-amber-50 p-4 rounded-lg">
                      <h5 className="font-medium text-amber-900">{idiom}</h5>
                      <p className="text-amber-800 text-sm mt-1">{meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content.phrasal_verbs && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Phrasal Verbs</h4>
                <div className="space-y-3">
                  {Object.entries(content.phrasal_verbs).map(([phrasal, meaning]) => (
                    <div key={phrasal} className="bg-amber-50 p-4 rounded-lg">
                      <h5 className="font-medium text-amber-900">{phrasal}</h5>
                      <p className="text-amber-800 text-sm mt-1">{meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'ASSESSMENT_TEST':
        return (
          <div className="space-y-4">
            {content.time_limit && content.total_marks && (
              <div className="bg-rose-50 p-4 rounded-lg">
                <h4 className="font-medium text-rose-900 mb-2">Test Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-rose-700 font-medium">Time Limit:</span>
                    <p className="text-rose-800">{content.time_limit}</p>
                  </div>
                  <div>
                    <span className="text-rose-700 font-medium">Total Marks:</span>
                    <p className="text-rose-800">{content.total_marks}</p>
                  </div>
                </div>
              </div>
            )}
            {content.questions && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Assessment Questions</h4>
                <div className="space-y-4">
                  {content.questions.map((question, index) => (
                    <div key={index} className="bg-white border border-rose-200 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">
                        Question {index + 1}
                      </h5>
                      <p className="text-gray-700 mb-3">{question.question}</p>
                      {question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <label key={optIndex} className="flex items-center">
                              <input
                                type="radio"
                                name={`assessment-${index}`}
                                value={optIndex}
                                className="mr-2 text-rose-600"
                                disabled
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-gray-600">
            <p>Content type "{kind}" not yet implemented.</p>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No sections available</h3>
        <p className="mt-1 text-sm text-gray-500">
          This chapter doesn't have any sections yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Chapter Content</h2>
        <p className="text-gray-600">
          This chapter contains {sections.length} structured sections covering all aspects of English language learning.
        </p>
      </div>

      {sections.map((section, index) => {
        // Safety check for section structure
        if (!section || typeof section !== 'object') {
          console.warn('Invalid section at index:', index, section);
          return null;
        }
        
        const IconComponent = getSectionIcon(section.kind);
        const isExpanded = expandedSections.has(index);
        const isCompleted = completedSections.includes(section.id);
        const sectionColor = getSectionColor(section.kind);

        return (
          <div key={section.id || index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${sectionColor}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {getSectionTitle(section.kind)}
                    </h3>
                    {section.title && (
                      <p className="text-sm text-gray-600 mt-1">{section.title}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isCompleted && (
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="pt-4">
                  {renderSectionContent(section)}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onSectionComplete && onSectionComplete(section.id, index)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChapterSections;