import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import { 
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BellIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  const getNavigationItems = (role) => {
    const baseItems = [
      { name: 'Dashboard', href: '/app', icon: HomeIcon },
      { name: 'Library', href: '/app/library', icon: BookOpenIcon },
    ];

    const roleSpecificItems = {
      'SUPER_ADMIN': [
        { name: 'Users', href: '/app/users', icon: UserGroupIcon },
        { name: 'Institutes', href: '/app/institutes', icon: AcademicCapIcon },
        { name: 'Platform Stats', href: '/app/stats', icon: ChartBarIcon },
        { name: 'System Settings', href: '/app/settings', icon: Cog6ToothIcon },
      ],
      'INSTITUTE_ADMIN': [
        { name: 'Members', href: '/app/members', icon: UserGroupIcon },
        { name: 'Institute Stats', href: '/app/stats', icon: ChartBarIcon },
        { name: 'Billing', href: '/app/billing', icon: CreditCardIcon },
        { name: 'Settings', href: '/app/settings', icon: Cog6ToothIcon },
      ],
      'TEACHER': [
        { name: 'My Classes', href: '/app/classes', icon: AcademicCapIcon },
        { name: 'Create Content', href: '/app/content', icon: DocumentTextIcon },
        { name: 'Grade Assignments', href: '/app/assignments', icon: ClipboardDocumentListIcon },
        { name: 'Student Progress', href: '/app/progress', icon: ChartBarIcon },
        { name: 'Settings', href: '/app/settings', icon: Cog6ToothIcon },
      ],
      'STUDENT': [
        { name: 'My Assignments', href: '/app/assignments', icon: ClipboardDocumentListIcon },
        { name: 'My Quizzes', href: '/app/quizzes', icon: QuestionMarkCircleIcon },
        { name: 'My Progress', href: '/app/progress', icon: ChartBarIcon },
        { name: 'Settings', href: '/app/settings', icon: Cog6ToothIcon },
      ]
    };

    const commonItems = [
      { name: 'Quizzes', href: '/app/quizzes', icon: QuestionMarkCircleIcon },
      { name: 'Assignments', href: '/app/assignments', icon: ClipboardDocumentListIcon },
      { name: 'Subscriptions', href: '/app/subscriptions', icon: CreditCardIcon },
      { name: 'Notifications', href: '/app/notifications', icon: BellIcon },
    ];

    return [
      ...baseItems,
      ...(roleSpecificItems[role] || []),
      ...commonItems
    ];
  };

  const navigationItems = getNavigationItems(user?.role);

  return (
    <>
      {/* Desktop Sidebar (visible and fixed under navbar) */}
      <div className="hidden lg:block">
        <div className="fixed top-16 left-0 z-40 h-full w-64 mt-[-4rem]">
          <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-6 dark:bg-brand-700">
              <img src="/image/club_logo.svg" alt="Ilm" className="h-8" />
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                        isActive
                          ? 'bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100'
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-brand-600 dark:bg-brand-700">
            <h1 className="text-xl font-bold text-white">Ilm Kademy</h1>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                      isActive
                        ? 'bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 