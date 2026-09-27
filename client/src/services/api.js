import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('research_os_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const projectAPI = {
  getAll: () => API.get('/projects'),
  getOne: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  delete: (id) => API.delete(`/projects/${id}`),
};

export const paperAPI = {
  getByProject: (projectId) => API.get(`/projects/${projectId}/papers`),
  upload: (projectId, formData) => API.post(`/projects/${projectId}/papers/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadBatch: (projectId, formData) => API.post(`/projects/${projectId}/papers/batch-upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/papers/${id}`),
};

export const aiAPI = {
  chat: (data) => API.post('/ai/chat', data),
  search: (data) => API.post('/ai/search', data),
  litReview: (data) => API.post('/ai/lit-review', data),
  compareMatrix: (data) => API.post('/ai/compare-matrix', data),
  gapDetector: (data) => API.post('/ai/gap-detector', data),
  citations: (data) => API.post('/ai/citations', data),
  timeline: (data) => API.post('/ai/timeline', data),
  quiz: (data) => API.post('/ai/quiz', data),
};

export const bookmarkAPI = {
  getAll: () => API.get('/bookmarks'),
  create: (data) => API.post('/bookmarks', data),
  delete: (id) => API.delete(`/bookmarks/${id}`),
};

export default API;
