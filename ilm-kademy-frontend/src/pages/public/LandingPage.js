import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  SparklesIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container-app pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-display text-light-text-primary dark:text-dark-text-primary mb-6">
              Welcome to{' '}
              <span className="text-brand-600 dark:text-brand-400">Ilm Kademy</span>
            </h1>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-3xl mx-auto">
              A comprehensive educational platform that transforms learning through 
              interactive books, AI-powered assistance, and personalized learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-3"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container-app">
          <h2 className="text-h2 text-center text-light-text-primary dark:text-dark-text-primary mb-12">
            Why Choose Ilm Kademy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-100 dark:bg-brand-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-h3 text-light-text-primary dark:text-dark-text-primary mb-2">
                Rich Content Library
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Access thousands of educational books across multiple subjects, languages, and levels.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-info-100 dark:bg-info-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="h-8 w-8 text-info-600 dark:text-info-400" />
              </div>
              <h3 className="text-h3 text-light-text-primary dark:text-dark-text-primary mb-2">
                Interactive Learning
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Engage with quizzes, assignments, and progress tracking for effective learning.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-ai-100 dark:bg-ai-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-ai-600 dark:text-ai-400" />
              </div>
              <h3 className="text-h3 text-light-text-primary dark:text-dark-text-primary mb-2">
                AI-Powered Assistance
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Get instant help with grammar checks, explanations, and personalized learning support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-app">
          <div className="text-center">
            <h2 className="text-h2 text-light-text-primary dark:text-dark-text-primary mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8">
              Join thousands of students and educators already using Ilm Kademy.
            </p>
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3"
            >
              Create Your Account
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 