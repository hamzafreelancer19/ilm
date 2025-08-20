// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/v1/auth/register/`,
    LOGIN: `${API_BASE_URL}/api/v1/auth/login/`,
    LOGOUT: `${API_BASE_URL}/api/v1/auth/logout/`,
    PROFILE: `${API_BASE_URL}/api/v1/auth/profile/`,
    REFRESH: `${API_BASE_URL}/api/v1/auth/refresh/`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/v1/auth/change-password/`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/auth/forgot-password/`,
  },
  // Other endpoints
  BOOKS: `${API_BASE_URL}/api/v1/books/`,
  QUIZZES: `${API_BASE_URL}/api/v1/quizzes/`,
  ASSIGNMENTS: `${API_BASE_URL}/api/v1/assignments/`,
  SUBSCRIPTIONS: `${API_BASE_URL}/api/v1/subscriptions/`,
  INSTITUTES: `${API_BASE_URL}/api/v1/institutes/`,
  AI: `${API_BASE_URL}/api/v1/ai/`,
  NOTIFICATIONS: `${API_BASE_URL}/api/v1/notifications/`,
};

export default API_BASE_URL; 