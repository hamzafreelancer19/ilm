import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  StarIcon,
  UserIcon,
  CalendarIcon,
  GlobeAltIcon,
  PlayIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api';

const BookDetailPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBookDetails();
    fetchChapters();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      // Get auth token from localStorage
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (tokens.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`;
      }

      const response = await fetch(`${API_ENDPOINTS.BOOKS}${bookId}/`, { headers });
      if (response.ok) {
        const data = await response.json();
        setBook(data);
      } else if (response.status === 401) {
        // If unauthorized, show mock data for development
        console.log('Using mock data due to authentication required');
        setBook({
          id: bookId,
          title: 'Advanced Mathematics',
          author: 'Dr. Sarah Johnson',
          subject: 'mathematics',
          language: 'english',
          level: 'advanced',
          description: 'This comprehensive guide covers advanced mathematical concepts including calculus, linear algebra, differential equations, and mathematical analysis. Perfect for university students and professionals seeking to deepen their mathematical understanding.',
          long_description: 'Advanced Mathematics is designed to provide a thorough understanding of complex mathematical concepts that form the foundation of modern science and engineering. The book progresses from fundamental principles to advanced applications, ensuring readers develop both theoretical knowledge and practical problem-solving skills.',
          cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=500&fit=crop',
          chapters_count: 12,
          total_pages: 450,
          rating: 4.8,
          students_enrolled: 1250,
          estimated_hours: 80,
          last_updated: '2024-01-15',
          tags: ['calculus', 'linear algebra', 'differential equations', 'mathematical analysis'],
          prerequisites: ['Basic calculus', 'Linear algebra fundamentals', 'Mathematical reasoning'],
          learning_objectives: [
            'Master advanced calculus techniques',
            'Understand linear algebra concepts',
            'Solve complex differential equations',
            'Apply mathematical analysis methods'
          ]
        });
      } else {
        toast.error('Failed to load book details');
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error('Failed to load book details');
    }
  };

  const fetchChapters = async () => {
    try {
      // Get auth token from localStorage
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (tokens.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`;
      }

      const response = await fetch(`${API_ENDPOINTS.BOOKS}${bookId}/chapters/`, { headers });
      if (response.ok) {
        const data = await response.json();
        setChapters(data.results || []);
      } else if (response.status === 401) {
        // If unauthorized, show mock data for development
        console.log('Using mock data due to authentication required');
        setChapters([
          {
            id: 1,
            title: 'Introduction to Advanced Calculus',
            description: 'Overview of calculus concepts and mathematical foundations',
            duration: '6 hours',
            sections_count: 8,
            is_completed: false,
            progress: 0
          },
          {
            id: 2,
            title: 'Limits and Continuity',
            description: 'Deep dive into limit concepts and continuous functions',
            duration: '8 hours',
            sections_count: 12,
            is_completed: false,
            progress: 0
          },
          {
            id: 3,
            title: 'Differentiation Techniques',
            description: 'Advanced differentiation methods and applications',
            duration: '10 hours',
            sections_count: 15,
            is_completed: false,
            progress: 0
          },
          {
            id: 4,
            title: 'Integration Methods',
            description: 'Complex integration techniques and applications',
            duration: '12 hours',
            sections_count: 18,
            is_completed: false,
            progress: 0
          }
        ]);
      } else {
        toast.error('Failed to load chapters');
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error('Failed to load chapters');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'mathematics':
        return <AcademicCapIcon className="h-6 w-6 text-blue-600" />;
      case 'science':
        return <AcademicCapIcon className="h-6 w-6 text-green-600" />;
      case 'history':
        return <BookOpenIcon className="h-6 w-6 text-amber-600" />;
      case 'computer_science':
        return <AcademicCapIcon className="h-6 w-6 text-purple-600" />;
      default:
        return <BookOpenIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getLevelBadge = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[level] || colors.beginner}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Level
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Book not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The book you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/app/library"
              className="text-indigo-600 hover:text-indigo-500"
            >
              ← Back to Library
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{book.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Book Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start space-x-6">
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-32 h-40 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getSubjectIcon(book.subject)}
                    <span className="text-sm font-medium text-gray-500 uppercase">
                      {book.subject.replace('_', ' ')}
                    </span>
                    {getLevelBadge(book.level)}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {book.title}
                  </h1>
                  
                  <p className="text-lg text-gray-600 mb-4">
                    by {book.author}
                  </p>
                  
                  <p className="text-gray-700 mb-4">
                    {book.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{book.chapters_count}</div>
                      <div className="text-sm text-gray-500">Chapters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{book.estimated_hours}</div>
                      <div className="text-sm text-gray-500">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{book.students_enrolled}</div>
                      <div className="text-sm text-gray-500">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{book.rating}</div>
                      <div className="text-sm text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
                    { id: 'chapters', name: 'Chapters', icon: BookOpenIcon },
                    { id: 'objectives', name: 'Learning Objectives', icon: ChartBarIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 inline mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">About This Book</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {book.long_description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Prerequisites</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {book.prerequisites?.map((prereq, index) => (
                          <li key={index}>{prereq}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {book.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Chapters Tab */}
                {activeTab === 'chapters' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Course Content ({chapters.length} chapters)
                    </h3>
                    {chapters.map((chapter, index) => (
                      <div
                        key={chapter.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                              <p className="text-sm text-gray-600">{chapter.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {chapter.duration}
                                </span>
                                <span className="flex items-center">
                                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                                  {chapter.sections_count || chapter.sections?.length || 0} sections
                                </span>
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/app/library/${bookId}/chapter/${chapter.id}`}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                          >
                            Start Chapter
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Learning Objectives Tab */}
                {activeTab === 'objectives' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">What You'll Learn</h3>
                      <ul className="space-y-3">
                        {book.learning_objectives?.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                              ✓
                            </div>
                            <span className="text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Learning Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Start Learning</h3>
              <Link
                to={`/app/library/${bookId}/chapter/1`}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-indigo-700 transition-colors duration-200 mb-4 block"
              >
                <PlayIcon className="h-5 w-5 inline mr-2" />
                Begin Course
              </Link>
              <p className="text-sm text-gray-600 text-center">
                Free access to first chapter
              </p>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Instructor: {book.author}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Last updated: {book.last_updated}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <GlobeAltIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Language: {book.language}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpenIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Pages: {book.total_pages}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Rating</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{book.rating}</div>
                <div className="flex items-center justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(book.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {book.students_enrolled} student ratings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage; 