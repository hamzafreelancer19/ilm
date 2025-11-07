import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  AcademicCapIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../config/api';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [hasLoaded, setHasLoaded] = useState(false);

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'literature', name: 'Literature' },
    { id: 'geography', name: 'Geography' },
    { id: 'computer_science', name: 'Computer Science' }
  ];

  const statuses = [
    { id: 'all', name: 'All Statuses' },
    { id: 'not_started', name: 'Not Started' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'submitted', name: 'Submitted' },
    { id: 'graded', name: 'Graded' }
  ];

  useEffect(() => {
    if (!hasLoaded) {
      fetchAssignments();
    }
  }, [hasLoaded]);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, selectedSubject, selectedStatus]);

  const loadMockAssignmentsData = () => {
    setAssignments([
      {
        id: 1,
        title: 'Calculus Problem Set',
        subject: 'mathematics',
        description: 'Complete problems 1-15 from Chapter 3. Show all work and justify your solutions.',
        due_date: '2024-02-15',
        points: 100,
        status: 'in_progress',
        submitted_at: null,
        grade: null,
        feedback: null,
        created_at: '2024-01-20',
        attachments: ['problem_set.pdf', 'guidelines.docx']
      },
      {
        id: 2,
        title: 'Physics Lab Report',
        subject: 'science',
        description: 'Write a comprehensive lab report on the pendulum experiment. Include data analysis and conclusions.',
        due_date: '2024-02-10',
        points: 150,
        status: 'submitted',
        submitted_at: '2024-02-08',
        grade: null,
        feedback: null,
        created_at: '2024-01-15',
        attachments: ['lab_manual.pdf', 'data_sheet.xlsx']
      },
      {
        id: 3,
        title: 'Historical Analysis Essay',
        subject: 'history',
        description: 'Analyze the impact of the Industrial Revolution on European society. 1500-2000 words.',
        due_date: '2024-02-20',
        points: 200,
        status: 'not_started',
        submitted_at: null,
        grade: null,
        feedback: null,
        created_at: '2024-01-25',
        attachments: ['essay_guidelines.pdf', 'sources.docx']
      },
      {
        id: 4,
        title: 'Programming Project',
        subject: 'computer_science',
        description: 'Create a simple calculator application using Python. Include error handling and user interface.',
        due_date: '2024-02-25',
        points: 300,
        status: 'graded',
        submitted_at: '2024-02-20',
        grade: 85,
        feedback: 'Good implementation but could improve error handling. Consider adding more input validation.',
        created_at: '2024-01-30',
        attachments: ['project_requirements.pdf', 'rubric.docx']
      }
    ]);
  };

  const fetchAssignments = async () => {
    try {
      // Get auth token from localStorage
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      
      // Check if we have valid authentication
      if (!tokens.access) {
        console.log('No authentication token found, using mock data');
        loadMockAssignmentsData();
        setHasLoaded(true);
        setIsLoading(false);
        return;
      }

      // For development, skip API calls and use mock data
      console.log('Development mode: using mock data instead of API calls');
      loadMockAssignmentsData();
      setHasLoaded(true);
      setIsLoading(false);
      return;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      };

      const response = await fetch(API_ENDPOINTS.ASSIGNMENTS, { headers });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.results || []);
      } else if (response.status === 401) {
                // If unauthorized, show mock data due to authentication required
        console.log('Using mock data due to authentication required');
        setAssignments([
          {
            id: 1,
            title: 'Calculus Problem Set',
            subject: 'mathematics',
            description: 'Complete problems 1-15 from Chapter 3. Show all work and justify your solutions.',
            due_date: '2024-02-15',
            points: 100,
            status: 'in_progress',
            submitted_at: null,
            grade: null,
            feedback: null,
            created_at: '2024-01-20',
            attachments: ['problem_set.pdf', 'guidelines.docx']
          },
          {
            id: 2,
            title: 'Physics Lab Report',
            subject: 'science',
            description: 'Write a comprehensive lab report on the pendulum experiment. Include data analysis and conclusions.',
            due_date: '2024-02-10',
            points: 150,
            status: 'submitted',
            submitted_at: '2024-02-08',
            grade: null,
            feedback: null,
            created_at: '2024-01-15',
            attachments: ['lab_manual.pdf', 'data_sheet.xlsx']
          },
          {
            id: 3,
            title: 'Historical Analysis Essay',
            subject: 'history',
            description: 'Analyze the impact of the Industrial Revolution on European society. 1500-2000 words.',
            due_date: '2024-02-20',
            points: 200,
            status: 'not_started',
            submitted_at: null,
            grade: null,
            feedback: null,
            created_at: '2024-01-25',
            attachments: ['essay_guidelines.pdf', 'sources.docx']
          },
          {
            id: 4,
            title: 'Programming Project',
            subject: 'computer_science',
            description: 'Create a simple calculator application using Python. Include error handling and user interface.',
            due_date: '2024-02-25',
            points: 300,
            status: 'graded',
            submitted_at: '2024-02-20',
            grade: 85,
            feedback: 'Good implementation but could improve error handling. Consider adding more input validation.',
            created_at: '2024-01-30',
            attachments: ['project_requirements.pdf', 'rubric.docx']
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      console.log('Using mock data due to error');
      loadMockAssignmentsData();
    } finally {
      setHasLoaded(true);
      setIsLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = [...assignments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === selectedSubject);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === selectedStatus);
    }

    setFilteredAssignments(filtered);
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

  const getStatusBadge = (status) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      submitted: 'bg-yellow-100 text-yellow-800',
      graded: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      submitted: 'Submitted',
      graded: 'Graded'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.not_started}`}>
        {labels[status] || 'Unknown'}
      </span>
    );
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Overdue', color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-orange-600' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: 'text-yellow-600' };
    } else {
      return { text: `Due in ${diffDays} days`, color: 'text-gray-600' };
    }
  };

  const getActionButton = (assignment) => {
    switch (assignment.status) {
      case 'not_started':
        return (
          <Link
            to={`/app/assignments/${assignment.id}/submit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Start Assignment
          </Link>
        );
      case 'in_progress':
        return (
          <Link
            to={`/app/assignments/${assignment.id}/submit`}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors duration-200"
          >
            Continue
          </Link>
        );
      case 'submitted':
        return (
          <span className="text-sm text-gray-500">
            Submitted on {new Date(assignment.submitted_at).toLocaleDateString()}
          </span>
        );
      case 'graded':
        return (
          <Link
            to={`/app/assignments/${assignment.id}/results`}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
          >
            View Grade
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
          <p className="mt-4 text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assignments</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Complete your assignments and track your progress
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-500">
                {filteredAssignments.length} of {assignments.length} assignments
              </span>
              <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">
                <PlusIcon className="h-4 w-4 inline mr-1" />
                New Assignment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
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

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getSubjectIcon(assignment.subject)}
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {assignment.subject.replace('_', ' ')}
                      </span>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {assignment.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {assignment.description}
                  </p>

                  {/* Assignment Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      {assignment.points} points
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Due Date Warning */}
                  <div className="mb-4">
                    <span className={`text-sm font-medium ${getDaysUntilDue(assignment.due_date).color}`}>
                      {getDaysUntilDue(assignment.due_date).text}
                    </span>
                  </div>

                  {/* Grade Info */}
                  {assignment.status === 'graded' && (
                    <div className="mb-4 p-3 bg-green-50 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Grade:</span>
                        <span className="font-medium text-green-900">{assignment.grade}%</span>
                      </div>
                      {assignment.feedback && (
                        <p className="text-xs text-gray-600 mt-1">{assignment.feedback}</p>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-center">
                    {getActionButton(assignment)}
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

export default AssignmentsPage; 