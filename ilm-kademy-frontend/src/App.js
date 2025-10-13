import React from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import PricingPage from './pages/public/PricingPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage'; 
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Protected Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import LibraryPage from './pages/library/LibraryPage';
import BookDetailPage from './pages/library/BookDetailPage';
import ChapterViewerPage from './pages/library/ChapterViewerPage';
import QuizzesPage from './pages/quizzes/QuizzesPage';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import SubscriptionsPage from './pages/subscriptions/SubscriptionsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <div className="h-full bg-light-background dark:bg-dark-background transition-colors duration-200">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected Routes */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="library" element={<LibraryPage />} />
                <Route path="library/:bookId" element={<BookDetailPage />} />
                <Route path="library/:bookId/chapter/:chapterId" element={<ChapterViewerPage />} />
                <Route path="quizzes" element={<QuizzesPage />} />
                <Route path="quizzes/:quizId/attempt" element={<div className="p-6"><h1 className="text-2xl font-bold">Quiz Attempt</h1><p>Quiz attempt feature coming soon!</p></div>} />
                <Route path="quizzes/:quizId/results" element={<div className="p-6"><h1 className="text-2xl font-bold">Quiz Results</h1><p>Quiz results feature coming soon!</p></div>} />
                <Route path="assignments" element={<AssignmentsPage />} />
                <Route path="classes" element={<div className="p-6"><h1 className="text-2xl font-bold">Classes</h1><p>Classes feature coming soon!</p></div>} />
                <Route path="content" element={<div className="p-6"><h1 className="text-2xl font-bold">Content</h1><p>Content management feature coming soon!</p></div>} />
                <Route path="progress" element={<div className="p-6"><h1 className="text-2xl font-bold">Progress</h1><p>Track your learning progress and achievements!</p></div>} />
                <Route path="subscriptions" element={<SubscriptionsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
            
            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.75rem',
                },
                success: {
                  iconTheme: {
                    primary: '#22C55E',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App; 