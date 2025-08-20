import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, BookOpenIcon, AcademicCapIcon, ClockIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'literature', name: 'Literature' },
    { id: 'geography', name: 'Geography' },
    { id: 'computer_science', name: 'Computer Science' },
    { id: 'languages', name: 'Languages' }
  ];

  const languages = [
    { id: 'all', name: 'All Languages' },
    { id: 'english', name: 'English' },
    { id: 'urdu', name: 'Urdu' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'french', name: 'French' },
    { id: 'spanish', name: 'Spanish' }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, selectedSubject, selectedLanguage, selectedLevel]);

  const fetchBooks = async () => {
    try {
      // Get auth token from localStorage
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (tokens.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`;
      }

      const response = await fetch(API_ENDPOINTS.BOOKS, { headers });
      if (response.ok) {
        const data = await response.json();
        setBooks(data.results || []);
            } else if (response.status === 401) {
        // If unauthorized, show mock data for development
        console.log('Using mock data due to authentication required');
        setBooks([
          {
            id: 1,
            title: 'Advanced Mathematics',
            author: 'Dr. Sarah Johnson',
            subject: 'mathematics',
            language: 'english',
            level: 'advanced',
            description: 'Comprehensive guide to advanced mathematical concepts including calculus, linear algebra, and differential equations.',
            cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=500&fit=crop',
            chapters_count: 12,
            rating: 4.8,
            students_enrolled: 1250
          },
          {
            id: 2,
            title: 'Physics Fundamentals',
            author: 'Prof. Michael Chen',
            subject: 'science',
            language: 'english',
            level: 'intermediate',
            description: 'Essential physics concepts covering mechanics, thermodynamics, and electromagnetism with practical examples.',
            cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
            chapters_count: 15,
            rating: 4.6,
            students_enrolled: 980
          },
          {
            id: 3,
            title: 'Islamic History',
            author: 'Dr. Ahmed Hassan',
            subject: 'history',
            language: 'urdu',
            level: 'intermediate',
            description: 'Comprehensive overview of Islamic civilization, from the early caliphates to modern times.',
            cover_image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=500&fit=crop',
            chapters_count: 18,
            rating: 4.9,
            students_enrolled: 2100
          },
          {
            id: 4,
            title: 'Programming Basics',
            author: 'Dr. Emily Rodriguez',
            subject: 'computer_science',
            language: 'english',
            level: 'beginner',
            description: 'Learn programming fundamentals with Python, covering variables, loops, functions, and object-oriented programming.',
            cover_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=500&fit=crop',
            chapters_count: 10,
            rating: 4.7,
            students_enrolled: 3200
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(book => book.subject === selectedSubject);
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(book => book.subject === selectedLanguage);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(book => book.level === selectedLevel);
    }

    setFilteredBooks(filtered);
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[level] || colors.beginner}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading library...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Library</h1>
              <p className="mt-2 text-gray-600">
                Explore our collection of educational books and resources
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {filteredBooks.length} of {books.length} books
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
                  placeholder="Search books, authors, or topics..."
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

            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Book Cover */}
                <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getSubjectIcon(book.subject)}
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {book.subject.replace('_', ' ')}
                      </span>
                    </div>
                    {getLevelBadge(book.level)}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    by {book.author}
                  </p>
                  
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{book.chapters_count} chapters</span>
                    <div className="flex items-center space-x-1">
                      <span>★</span>
                      <span>{book.rating}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/app/library/${book.id}`}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 text-center block"
                  >
                    View Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage; 