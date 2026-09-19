import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach JWT access token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('greenroots_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth API ────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register/', data);
export const loginUser    = (data) => API.post('/auth/login/', data);
export const logoutUser   = ()     => API.post('/auth/logout/');
export const getMe        = ()     => API.get('/auth/me/');

// Google OAuth — redirects browser to Django backend which handles the flow
export const getGoogleLoginUrl = () => `${API_BASE_URL}/auth/google/`;

// ─── Posts API ────────────────────────────────────────────────────────────────
export const getPosts = (params) => API.get('/posts/', { params });
export const getPost  = (id)     => API.get(`/posts/${id}/`);

export const createPost = (formData) =>
  API.post('/posts/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletePost = (id) => API.delete(`/posts/${id}/`);

// ─── Like API ────────────────────────────────────────────────────────────────
export const likePost = (postId) => API.post(`/posts/${postId}/like/`);

// ─── Comment API ─────────────────────────────────────────────────────────────
export const addComment    = (postId, data)              => API.post(`/posts/${postId}/comments/`, data);
export const deleteComment = (postId, commentId)         => API.delete(`/posts/${postId}/comments/${commentId}/`);

export const getUserProfile = (id) => API.get(`/auth/users/${id}/`);
export const followUser = (id) => API.post(`/auth/users/${id}/follow/`);
export const updateProfile = (data) => API.patch('/auth/me/', data);
export const getDiary = (userId) => API.get('/diary/', { params: { user: userId } });
export const createDiaryEntry = (data) => API.post('/diary/', data);
export const addGrowthLog = (entryId, data) => API.post(`/diary/${entryId}/logs/`, data);
export const bookmarkPost = (id) => API.post(`/posts/${id}/bookmark/`);
export const getChallenges = () => API.get('/challenges/');
export const joinChallenge = (id) => API.post(`/challenges/${id}/join/`);

export default API;
