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
  LightBulbIcon
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
        setBook({
          id: bookId,
          title: 'Advanced Mathematics',
          author: 'Dr. Sarah Johnson'
        });
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
        setChapter({
          id: chapterId,
          title: 'The Art of Effective Communication',
          description: 'Learn the principles of effective communication in English, covering both verbal and non-verbal aspects.',
          sections: [
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
              kind: 'SLOS',
              title: 'Student Learning Objectives',
              content: {
                objectives: [
                  'Define effective communication and its components',
                  'Identify barriers to effective communication',
                  'Apply active listening techniques in conversations',
                  'Use appropriate non-verbal communication cues'
                ]
              }
            }
          ]
        });
      }

      if (chaptersResponse.ok) {
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData.results || []);
      } else if (chaptersResponse.status === 401) {
        // If unauthorized, show mock data for development
        console.log('Using mock chapters data due to authentication required');
        setChapters([
          {
            id: 1,
            title: 'Introduction to Advanced Calculus',
            description: 'Overview of calculus concepts and mathematical foundations',
            duration: '6 hours',
            sections_count: 8,
            is_completed: false,
            progress: 0
          }
        ]);
      }

      // Mock data for development if no data was loaded
      if (!book) {
        setBook({
          id: bookId,
          title: 'Advanced Mathematics',
          author: 'Dr. Sarah Johnson'
        });
      }

      if (!chapter) {
        setChapter({
          id: chapterId,
          title: 'Introduction to Advanced Calculus',
          description: 'Overview of calculus concepts and mathematical foundations',
          duration: '6 hours',
          sections: [
            {
              id: 1,
              title: 'What is Calculus?',
              content: 'Calculus is a branch of mathematics that deals with continuous change. It provides a framework for modeling systems in which there is change, and a way to deduce the predictions of such models.',
              type: 'text',
              duration: '15 min'
            },
            {
              id: 2,
              title: 'Historical Development',
              content: 'The development of calculus was motivated by the need to solve problems in physics and astronomy. Isaac Newton and Gottfried Leibniz are credited with independently developing calculus in the late 17th century.',
              type: 'text',
              duration: '20 min'
            },
            {
              id: 3,
              title: 'Key Concepts',
              content: 'The two main branches of calculus are differential calculus and integral calculus. Differential calculus concerns the rate of change of quantities, while integral calculus concerns the accumulation of quantities.',
              type: 'text',
              duration: '25 min'
            },
            {
              id: 4,
              title: 'Interactive Example',
              content: 'Let\'s explore a simple example: finding the slope of a curve at a point. This is one of the fundamental problems that calculus solves.',
              type: 'interactive',
              duration: '30 min'
            }
          ]
        });
      }

      if (chapters.length === 0) {
        setChapters([
          { id: 1, title: 'Introduction to Advanced Calculus' },
          { id: 2, title: 'Limits and Continuity' },
          { id: 3, title: 'Differentiation Techniques' },
          { id: 4, title: 'Integration Methods' }
        ]);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/app/library/${bookId}`}
                className="text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Back to Book
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{chapter.title}</span>
            </div>
            
            {/* Audio Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAudio}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <PlayIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Chapter Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {chapter.title}
                  </h1>
                  <p className="text-gray-600">{chapter.description}</p>
                </div>
                              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round((completedSections.length / (chapter.sections?.length || 1)) * 100)}%
                </div>
              </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSections.length / (chapter.sections?.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Chapter Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <ChapterSections 
                sections={chapter.sections || []}
                onSectionComplete={handleSectionComplete}
                completedSections={completedSections}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateToChapter('prev')}
                disabled={!hasPreviousChapter}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                Previous Chapter
              </button>
              
              <button
                onClick={() => navigateToChapter('next')}
                disabled={!hasNextChapter}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Chapter
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chapter Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chapter Sections</h3>
              <div className="space-y-2">
                {chapter.sections?.map((section, index) => {
                  const isCompleted = completedSections.includes(section.id);
                  const isCurrent = index === currentSection;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(index)}
                      className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                        isCurrent
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : isCompleted
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {section.kind ? section.kind.replace('_', ' ') : section.title}
                        </span>
                        {isCompleted && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        Section {index + 1} of {chapter.sections.length}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">My Notes</h3>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-indigo-600 hover:text-indigo-500 text-sm"
                >
                  {showNotes ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showNotes && (
                <div>
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Add your notes here..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                  />
                  <button className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">
                    Save Notes
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  <LightBulbIcon className="h-5 w-5 mr-2" />
                  Ask AI Assistant
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Take Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterViewerPage; 