import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  BellIcon 
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user } = useAuth();

  const getRoleDisplay = (role) => {
    const roleMap = {
      'SUPER_ADMIN': 'Super Administrator',
      'INSTITUTE_ADMIN': 'Institute Administrator',
      'TEACHER': 'Teacher',
      'STUDENT': 'Student'
    };
    return roleMap[role] || role;
  };

  const getWelcomeMessage = (role) => {
    const messages = {
      'SUPER_ADMIN': 'Welcome to the admin dashboard. Manage the entire platform.',
      'INSTITUTE_ADMIN': 'Welcome to your institute dashboard. Manage your educational institution.',
      'TEACHER': 'Welcome to your teaching dashboard. Create content and track student progress.',
      'STUDENT': 'Welcome to your learning dashboard. Continue your educational journey.'
    };
    return messages[role] || 'Welcome to your dashboard.';
  };

  const getQuickActions = (role) => {
    const actions = {
      'SUPER_ADMIN': [
        { name: 'Manage Users', icon: '👥', href: '/app/users' },
        { name: 'Platform Stats', icon: '📊', href: '/app/stats' },
        { name: 'System Settings', icon: '⚙️', href: '/app/settings' }
      ],
      'INSTITUTE_ADMIN': [
        { name: 'Manage Members', icon: '👥', href: '/app/members' },
        { name: 'Institute Stats', icon: '📊', href: '/app/stats' },
        { name: 'Billing', icon: '💳', href: '/app/billing' }
      ],
      'TEACHER': [
        { name: 'Create Content', icon: '✍️', href: '/app/content' },
        { name: 'Grade Assignments', icon: '📝', href: '/app/assignments' },
        { name: 'Student Progress', icon: '📈', href: '/app/progress' }
      ],
      'STUDENT': [
        { name: 'My Library', icon: '📚', href: '/app/library' },
        { name: 'My Assignments', icon: '📝', href: '/app/assignments' },
        { name: 'My Progress', icon: '📈', href: '/app/progress' }
      ]
    };
    return actions[role] || [];
  };

  return (
    <div className="space-y-6 ">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
            <AcademicCapIcon className="h-8 w-8 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-h1 text-light-text-primary dark:text-dark-text-primary">
              Welcome back, {user?.full_name || 'User'}!
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg">
              {getWelcomeMessage(user?.role)}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 dark:bg-brand-900/20 text-brand-800 dark:text-brand-200">
                {getRoleDisplay(user?.role)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {getQuickActions(user?.role).map((action, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="text-4xl mb-4">{action.icon}</div>
            <h3 className="text-h3 text-light-text-primary dark:text-dark-text-primary mb-2">
              {action.name}
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Click to access {action.name.toLowerCase()}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Total Books
              </p>
              <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                24
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Progress
              </p>
              <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                68%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BellIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Notifications
              </p>
              <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                3
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Assignments
              </p>
              <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                5
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-h2 text-light-text-primary dark:text-dark-text-primary mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">✓</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Completed Chapter 3: Advanced Grammar
              </p>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                2 hours ago
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">📝</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                New assignment available: Essay Writing
              </p>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                1 day ago
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">🎯</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Quiz completed: Vocabulary Test
              </p>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                2 days ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 