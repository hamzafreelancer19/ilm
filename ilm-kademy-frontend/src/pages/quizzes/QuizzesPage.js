import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'literature', name: 'Literature' },
    { id: 'geography', name: 'Geography' },
    { id: 'computer_science', name: 'Computer Science' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Difficulties' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' }
  ];

  const statuses = [
    { id: 'all', name: 'All Statuses' },
    { id: 'not_started', name: 'Not Started' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'completed', name: 'Completed' }
  ];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, selectedSubject, selectedDifficulty, selectedStatus]);

  const fetchQuizzes = async () => {
    try {
      // Get auth token from localStorage
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (tokens.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`;
      }

      const response = await fetch(API_ENDPOINTS.QUIZZES, { headers });
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.results || []);
      } else if (response.status === 401) {
                // If unauthorized, show mock data for development
        console.log('Using mock data due to authentication required');
        setQuizzes([
          {
            id: 1,
            title: 'Calculus Fundamentals Quiz',
            subject: 'mathematics',
            difficulty: 'medium',
            description: 'Test your knowledge of basic calculus concepts including limits, derivatives, and integrals.',
            time_limit: 30,
            questions_count: 20,
            passing_score: 70,
            status: 'not_started',
            best_score: null,
            attempts_count: 0,
            last_attempt: null,
            created_at: '2024-01-15'
          },
          {
            id: 2,
            title: 'Physics Mechanics Assessment',
            subject: 'science',
            difficulty: 'hard',
            description: 'Comprehensive assessment covering Newton\'s laws, energy, momentum, and rotational motion.',
            time_limit: 45,
            questions_count: 25,
            passing_score: 75,
            status: 'in_progress',
            best_score: 65,
            attempts_count: 2,
            last_attempt: '2024-01-20',
            created_at: '2024-01-10'
          },
          {
            id: 3,
            title: 'Islamic History Quiz',
            subject: 'history',
            difficulty: 'easy',
            description: 'Basic quiz covering key events and figures in Islamic history from the early caliphates.',
            time_limit: 20,
            questions_count: 15,
            passing_score: 60,
            status: 'completed',
            best_score: 85,
            attempts_count: 1,
            last_attempt: '2024-01-18',
            created_at: '2024-01-05'
          },
          {
            id: 4,
            title: 'Programming Basics Test',
            subject: 'computer_science',
            difficulty: 'medium',
            description: 'Test your understanding of programming fundamentals including variables, loops, and functions.',
            time_limit: 35,
            questions_count: 18,
            passing_score: 70,
            status: 'not_started',
            best_score: null,
            attempts_count: 0,
            last_attempt: null,
            created_at: '2024-01-12'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = [...quizzes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(quiz => quiz.subject === selectedSubject);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(quiz => quiz.status === selectedStatus);
    }

    setFilteredQuizzes(filtered);
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'mathematics':
        return <AcademicCapIcon className="h-6 w-6 text-blue-600" />;
      case 'science':
        return <AcademicCapIcon className="h-6 w-6 text-green-600" />;
      case 'history':
        return <AcademicCapIcon className="h-6 w-6 text-amber-600" />;
      case 'computer_science':
        return <AcademicCapIcon className="h-6 w-6 text-purple-600" />;
      default:
        return <AcademicCapIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[difficulty] || colors.medium}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.not_started}`}>
        {labels[status] || 'Unknown'}
      </span>
    );
  };

  const getActionButton = (quiz) => {
    switch (quiz.status) {
      case 'not_started':
        return (
          <Link
            to={`/app/quizzes/${quiz.id}/attempt`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            <PlayIcon className="h-4 w-4 inline mr-1" />
            Start Quiz
          </Link>
        );
      case 'in_progress':
        return (
          <Link
            to={`/app/quizzes/${quiz.id}/attempt`}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors duration-200"
          >
            <PlayIcon className="h-4 w-4 inline mr-1" />
            Continue
          </Link>
        );
      case 'completed':
        return (
          <Link
            to={`/app/quizzes/${quiz.id}/results`}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
          >
            <CheckCircleIcon className="h-4 w-4 inline mr-1" />
            View Results
          </Link>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
              <p className="mt-2 text-gray-600">
                Test your knowledge and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {filteredQuizzes.length} of {quizzes.length} quizzes
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getSubjectIcon(quiz.subject)}
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {quiz.subject.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getDifficultyBadge(quiz.difficulty)}
                      {getStatusBadge(quiz.status)}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {quiz.description}
                  </p>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {quiz.time_limit} min
                    </div>
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      {quiz.questions_count} questions
                    </div>
                  </div>

                  {/* Progress Info */}
                  {quiz.status !== 'not_started' && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Best Score:</span>
                        <span className="font-medium text-gray-900">{quiz.best_score}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Attempts:</span>
                        <span className="font-medium text-gray-900">{quiz.attempts_count}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-center">
                    {getActionButton(quiz)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage; 