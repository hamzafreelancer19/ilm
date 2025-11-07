import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem('tokens');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define logout function early so it can be used in interceptors
  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('tokens');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
    toast.success('Logged out successfully');
  }, [navigate]);

  // Configure axios defaults
  useEffect(() => {
    // Set base URL for all axios requests
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    
    if (tokens?.access) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [tokens]);

  // Setup axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if the failed request is the refresh endpoint itself
        const isRefreshEndpoint = originalRequest.url?.includes('/token/refresh/');
        
        // If refresh endpoint fails, logout immediately to prevent infinite loop
        if (isRefreshEndpoint && error.response?.status === 401) {
          logout();
          return Promise.reject(error);
        }
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Create a separate axios instance for refresh to avoid interceptor loop
            const refreshAxios = axios.create({
              baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'
            });
            
            const response = await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH, {
              refresh: tokens?.refresh
            });
            
            const newTokens = {
              access: response.data.access,
              refresh: tokens?.refresh // Keep the same refresh token
            };
            setTokens(newTokens);
            localStorage.setItem('tokens', JSON.stringify(newTokens));
            
            originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout immediately
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [tokens, logout]);

  // Check if user is authenticated on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE);
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      // If the profile endpoint returns 401 it usually means the access token is
      // missing or expired. Don't force a full logout/navigation here because
      // that can trigger other parts of the UI to receive `null` props and
      // cause unrelated runtime errors. Instead, clear the user state and
      // leave token handling to the interceptor logic which attempts refresh.
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        // For other errors (network, 5xx), perform a normal logout to keep
        // the app in a predictable state.
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (tokens?.access) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [tokens, checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      
      const { user: userData, tokens: tokenData } = response.data;
      const newTokens = { access: tokenData.access, refresh: tokenData.refresh };
      
      setUser(userData);
      setTokens(newTokens);
      localStorage.setItem('tokens', JSON.stringify(newTokens));
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (userData.role === 'SUPER_ADMIN') {
        navigate('/app');
      } else if (userData.role === 'INSTITUTE_ADMIN') {
        navigate('/app');
      } else if (userData.role === 'TEACHER') {
        navigate('/app');
      } else {
        navigate('/app');
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      toast.success('Registration successful! Please log in.');
      navigate('/login');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.patch(API_ENDPOINTS.AUTH.PROFILE, profileData);
      setUser(response.data);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await axios.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    tokens,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 