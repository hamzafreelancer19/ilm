import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  SunIcon, 
  MoonIcon 
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', searchQuery);
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'SUPER_ADMIN': 'Super Admin',
      'INSTITUTE_ADMIN': 'Institute Admin',
      'TEACHER': 'Teacher',
      'STUDENT': 'Student'
    };
    return roleMap[role] || role;
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 fixed top-0 left-0 right-0 z-50">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and search */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search books, chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-80"
                />
              </div>
            </form>
          </div>

          {/* Right side - Actions and profile */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 relative">
              <BellIcon className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-error-500 rounded-full"></span>
            </button>

            {/* Profile menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
                <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-medium">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.full_name || user?.email}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 focus:outline-none z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                    <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">
                      {getRoleDisplay(user?.role)}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/app/settings"
                          className={`${
                            active ? 'bg-gray-100 dark:bg-slate-700' : ''
                          } block px-4 py-2 text-sm text-gray-700 dark:text-slate-300`}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-slate-700' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 