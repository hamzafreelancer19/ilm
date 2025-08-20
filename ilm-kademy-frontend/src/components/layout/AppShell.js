import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar when route changes
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="h-screen bg-light-background dark:bg-dark-background flex flex-col">
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />
      
      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="h-full">
            <div className="container-app py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppShell; 