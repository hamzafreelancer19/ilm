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
      'SUMMARY': DocumentTextIcon,
      'SLOS': AcademicCapIcon,
      'PRE_READING': QuestionMarkCircleIcon,
      'VOCABULARY_TRANSLATION': LanguageIcon,
      'GLOSSARY': DocumentTextIcon,
      'SHORT_QUESTIONS': QuestionMarkCircleIcon,
      'OBJECTIVE_QUESTIONS': ClipboardDocumentCheckIcon,
      'VOCAB_GRAMMAR': AcademicCapIcon,
      'ORAL_COMMUNICATION': ChatBubbleLeftRightIcon,
      'WRITING_SKILLS': PencilIcon,
      'IDIOMS_PHRASALS': LightBulbIcon,
      'ASSESSMENT_TEST': ClipboardDocumentCheckIcon,
    };
    return iconMap[kind] || DocumentTextIcon;
  };

  const getSectionColor = (kind) => {
    if (!kind) return 'bg-gray-50 border-gray-200 text-gray-800';
    
    const colorMap = {
      'INTRODUCTION': 'bg-blue-50 border-blue-200 text-blue-800',
      'SUMMARY': 'bg-green-50 border-green-200 text-green-800',
      'SLOS': 'bg-purple-50 border-purple-200 text-purple-800',
      'PRE_READING': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'VOCABULARY_TRANSLATION': 'bg-indigo-50 border-indigo-200 text-indigo-800',
      'GLOSSARY': 'bg-teal-50 border-teal-200 text-teal-800',
      'SHORT_QUESTIONS': 'bg-orange-50 border-orange-200 text-orange-800',
      'OBJECTIVE_QUESTIONS': 'bg-red-50 border-red-200 text-red-800',
      'VOCAB_GRAMMAR': 'bg-pink-50 border-pink-200 text-pink-800',
      'ORAL_COMMUNICATION': 'bg-emerald-50 border-emerald-200 text-emerald-800',
      'WRITING_SKILLS': 'bg-cyan-50 border-cyan-200 text-cyan-800',
      'IDIOMS_PHRASALS': 'bg-amber-50 border-amber-200 text-amber-800',
      'ASSESSMENT_TEST': 'bg-rose-50 border-rose-200 text-rose-800',
    };
    return colorMap[kind] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getSectionTitle = (kind) => {
    if (!kind) return 'Unknown Section';
    
    const titleMap = {
      'INTRODUCTION': 'Introduction',
      'SUMMARY': 'Point-wise Summary',
      'SLOS': 'Student Learning Objectives',
      'PRE_READING': 'Pre-reading Questions',
      'VOCABULARY_TRANSLATION': 'Vocabulary, Text & Translation',
      'GLOSSARY': 'Glossary',
      'SHORT_QUESTIONS': 'Exercise: Short Questions',
      'OBJECTIVE_QUESTIONS': 'Exercise: Objectives',
      'VOCAB_GRAMMAR': 'Exercise: Vocabulary and Grammar',
      'ORAL_COMMUNICATION': 'Exercise: Oral Communication',
      'WRITING_SKILLS': 'Exercise: Writing Skills',
      'IDIOMS_PHRASALS': 'Idioms and Phrasal Verbs',
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

      case 'SUMMARY':
        return (
          <div className="space-y-4">
            {content.main_points && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Main Points</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {content.main_points.map((point, index) => (
                    <li key={index} className="pl-2">{point}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.learning_outcomes && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Learning Outcomes</h4>
                <p className="text-green-800">{content.learning_outcomes}</p>
              </div>
            )}
          </div>
        );

      case 'SLOS':
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Learning Objectives</h4>
            <ul className="space-y-2">
              {content.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'PRE_READING':
        return (
          <div className="space-y-4">
            {content.questions && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Pre-Reading Questions</h4>
                <ul className="space-y-3">
                  {content.questions.map((question, index) => (
                    <li key={index} className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-yellow-900 font-medium">{question}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.reflection_prompt && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-amber-900 mb-2">Reflection Prompt</h4>
                <p className="text-amber-800 italic">{content.reflection_prompt}</p>
              </div>
            )}
          </div>
        );

      case 'VOCABULARY_TRANSLATION':
        return (
          <div className="space-y-4">
            {content.text && (
              <p className="text-gray-700 leading-relaxed mb-4">{content.text}</p>
            )}
            {content.vocabulary && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Vocabulary</h4>
                <div className="space-y-3">
                  {content.vocabulary.map((item, index) => (
                    <div key={index} className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-indigo-900">{item.word}</h5>
                          <p className="text-indigo-800 text-sm mt-1">{item.definition}</p>
                          {item.example && (
                            <p className="text-indigo-700 text-sm mt-2 italic">"{item.example}"</p>
                          )}
                        </div>
                        {item.translation && (
                          <div className="text-right text-sm text-indigo-600">
                            <span className="font-medium">Translation:</span>
                            <p className="mt-1">{item.translation}</p>
                          </div>
                        )}
                      </div>
                      {item.synonyms && (
                        <div className="mt-2 pt-2 border-t border-indigo-200">
                          <span className="text-xs text-indigo-600 font-medium">Synonyms: </span>
                          <span className="text-xs text-indigo-600">{item.synonyms.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content.translation && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Full Translation</h4>
                <p className="text-gray-700">{content.translation}</p>
              </div>
            )}
          </div>
        );

      case 'GLOSSARY':
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Important Terms</h4>
            <div className="space-y-3">
              {Object.entries(content.terms || {}).map(([term, definition], index) => (
                <div key={index} className="bg-teal-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-teal-900">{term}</h5>
                  <p className="text-teal-800 text-sm mt-1">{definition}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'SHORT_QUESTIONS':
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Short Answer Questions</h4>
            <div className="space-y-4">
              {content.questions.map((item, index) => (
                <div key={index} className="bg-orange-50 p-4 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">{item.question}</h5>
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <p className="text-orange-800 text-sm"><strong>Answer:</strong> {item.answer}</p>
                    {item.explanation && (
                      <p className="text-orange-700 text-sm mt-2 italic">{item.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'OBJECTIVE_QUESTIONS':
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Multiple Choice Questions</h4>
            <div className="space-y-4">
              {content.questions.map((item, index) => (
                <div key={index} className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-3">{item.question}</h5>
                  <div className="space-y-2">
                    {item.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optIndex}
                          className="mr-2 text-red-600"
                          disabled
                        />
                        <span className={`text-sm ${
                          optIndex === item.correct_answer 
                            ? 'text-green-700 font-medium' 
                            : 'text-red-700'
                        }`}>
                          {option}
                          {optIndex === item.correct_answer && ' ✓'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {item.explanation && (
                    <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-green-800 text-sm"><strong>Explanation:</strong> {item.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'VOCAB_GRAMMAR':
        return (
          <div className="space-y-4">
            {content.vocabulary_exercises && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Vocabulary Exercises</h4>
                {content.vocabulary_exercises.map((exercise, index) => (
                  <div key={index} className="bg-pink-50 p-4 rounded-lg mb-3">
                    <h5 className="font-medium text-pink-900 mb-2">{exercise.exercise}</h5>
                    <div className="space-y-2">
                      {exercise.sentences.map((sentence, sentIndex) => (
                        <div key={sentIndex} className="bg-white p-2 rounded border border-pink-200">
                          <p className="text-pink-800 text-sm">{sentence}</p>
                        </div>
                      ))}
                    </div>
                    {exercise.answers && (
                      <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                        <p className="text-green-800 text-sm"><strong>Answers:</strong> {exercise.answers.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {content.grammar_focus && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Grammar Focus: {content.grammar_focus.topic}</h4>
                <div className="space-y-3">
                  {content.grammar_focus.examples.map((example, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 text-sm italic">"{example}"</p>
                    </div>
                  ))}
                  {content.grammar_focus.practice && (
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-amber-800 text-sm"><strong>Practice:</strong> {content.grammar_focus.practice}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'ORAL_COMMUNICATION':
        return (
          <div className="space-y-4">
            {content.activities && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Speaking Activities</h4>
                <div className="space-y-4">
                  {content.activities.map((activity, index) => (
                    <div key={index} className="bg-emerald-50 p-4 rounded-lg">
                      <h5 className="font-medium text-emerald-900 mb-2">{activity.activity}</h5>
                      <p className="text-emerald-800 text-sm mb-3">{activity.description}</p>
                      {activity.scenario && (
                        <div className="bg-white p-3 rounded border border-emerald-200 mb-3">
                          <p className="text-emerald-700 text-sm"><strong>Scenario:</strong> {activity.scenario}</p>
                        </div>
                      )}
                      {activity.objectives && (
                        <div>
                          <h6 className="font-medium text-emerald-800 text-sm mb-2">Objectives:</h6>
                          <ul className="list-disc list-inside space-y-1 text-emerald-700 text-sm">
                            {activity.objectives.map((obj, objIndex) => (
                              <li key={objIndex}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content.speaking_tips && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Speaking Tips</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.speaking_tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'WRITING_SKILLS':
        return (
          <div className="space-y-4">
            {content.writing_tasks && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Writing Tasks</h4>
                <div className="space-y-4">
                  {content.writing_tasks.map((task, index) => (
                    <div key={index} className="bg-cyan-50 p-4 rounded-lg">
                      <h5 className="font-medium text-cyan-900 mb-2">{task.task}</h5>
                      <p className="text-cyan-800 text-sm mb-3">{task.description}</p>
                      {task.requirements && (
                        <div className="mb-3">
                          <h6 className="font-medium text-cyan-800 text-sm mb-2">Requirements:</h6>
                          <ul className="list-disc list-inside space-y-1 text-cyan-700 text-sm">
                            {task.requirements.map((req, reqIndex) => (
                              <li key={reqIndex}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {task.word_limit && (
                        <div className="bg-white p-2 rounded border border-cyan-200">
                          <p className="text-cyan-700 text-sm"><strong>Word Limit:</strong> {task.word_limit}</p>
                        </div>
                      )}
                      {task.prompts && (
                        <div className="mt-3">
                          <h6 className="font-medium text-cyan-800 text-sm mb-2">Writing Prompts:</h6>
                          <ul className="list-disc list-inside space-y-1 text-cyan-700 text-sm">
                            {task.prompts.map((prompt, promptIndex) => (
                              <li key={promptIndex}>{prompt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content.writing_tips && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Writing Tips</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {content.writing_tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'IDIOMS_PHRASALS':
        return (
          <div className="space-y-4">
            {content.idioms && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Idioms</h4>
                <div className="space-y-3">
                  {content.idioms.map((idiom, index) => (
                    <div key={index} className="bg-amber-50 p-4 rounded-lg">
                      <h5 className="font-medium text-amber-900">{idiom.idiom}</h5>
                      <p className="text-amber-800 text-sm mt-1"><strong>Meaning:</strong> {idiom.meaning}</p>
                      <p className="text-amber-700 text-sm mt-2 italic">"{idiom.example}"</p>
                      <p className="text-amber-600 text-xs mt-2"><strong>Usage:</strong> {idiom.usage}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content.phrasal_verbs && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Phrasal Verbs</h4>
                <div className="space-y-3">
                  {content.phrasal_verbs.map((phrasal, index) => (
                    <div key={index} className="bg-amber-50 p-4 rounded-lg">
                      <h5 className="font-medium text-amber-900">{phrasal.phrasal}</h5>
                      <p className="text-amber-800 text-sm mt-1"><strong>Meaning:</strong> {phrasal.meaning}</p>
                      <p className="text-amber-700 text-sm mt-2 italic">"{phrasal.example}"</p>
                      <p className="text-amber-600 text-xs mt-2"><strong>Usage:</strong> {phrasal.usage}</p>
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
            {content.test_info && (
              <div className="bg-rose-50 p-4 rounded-lg">
                <h4 className="font-medium text-rose-900 mb-2">Test Information</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-rose-700 font-medium">Duration:</span>
                    <p className="text-rose-800">{content.test_info.duration}</p>
                  </div>
                  <div>
                    <span className="text-rose-700 font-medium">Questions:</span>
                    <p className="text-rose-800">{content.test_info.total_questions}</p>
                  </div>
                  <div>
                    <span className="text-rose-700 font-medium">Passing Score:</span>
                    <p className="text-rose-800">{content.test_info.passing_score}</p>
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
                        Question {index + 1} ({question.points} points)
                      </h5>
                      <p className="text-gray-700 mb-3">{question.question}</p>
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
                      {question.explanation && (
                        <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-green-800 text-sm"><strong>Explanation:</strong> {question.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content.scoring && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Scoring Guide</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(content.scoring).map(([level, range]) => (
                    <div key={level} className="text-center">
                      <span className="text-gray-700 font-medium capitalize">{level}:</span>
                      <p className="text-gray-600">{range}</p>
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