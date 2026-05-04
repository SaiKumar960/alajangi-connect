import axios from 'axios';

// Use environment variable for API URL in production, fallback to local proxy path
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ─── Axios instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// ─── Helper to set/clear auth token ──────────────────────────────────────────
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ─── Request interceptor — attach JWT ────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ac_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 ──────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ac_token');
      // Let the AuthContext/ProtectedRoute handle redirect
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authAPI = {
  sendOtp: (data) => api.post('/auth/send-otp', data),
  register: (formData) => api.post('/auth/register', formData),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Posts API ───────────────────────────────────────────────────────────────
export const postsAPI = {
  getFeed: (page = 1, limit = 10, filter = '') => {
    const params = new URLSearchParams({ page, limit });
    if (filter) params.append('filter', filter);
    return api.get(`/posts?${params.toString()}`);
  },
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => api.post('/posts', formData),
  editPost: (id, text) => api.put(`/posts/${id}`, { text }),
  deletePost: (id) => api.delete(`/posts/${id}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  toggleSave: (id) => api.post(`/posts/${id}/save`),
  addComment: (id, text) => api.post(`/posts/${id}/comment`, { text }),
  getComments: (id, page = 1) => api.get(`/posts/${id}/comments?page=${page}`),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

// ─── Users API ───────────────────────────────────────────────────────────────
export const userAPI = {
  searchUsers: (query) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
  getSuggestedUsers: () => api.get('/users/suggestions'),
  getProfile: (id) => api.get(`/users/${id}`),
  getUser: (id) => api.get(`/users/${id}`),
  getUserPosts: (id, page = 1) => api.get(`/users/${id}/posts?page=${page}`),
  getSavedPosts: (page = 1) => api.get(`/users/me/saved?page=${page}`),
  updateProfile: (formData) => api.put('/users/me', formData),
  toggleFollow: (id) => api.post(`/users/${id}/follow`),
  followUser: (id) => api.post(`/users/${id}/follow`),
};

export default api;
