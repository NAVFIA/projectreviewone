import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  console.log('Token present:', !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    return Promise.reject(error);
  }
);

// Poll API functions
export const pollAPI = {
  getAllPolls: () => api.get('/polls'),
  getPollById: (id) => api.get(`/polls/${id}`),
  createPoll: (poll) => api.post('/polls', poll),
  closePoll: (id) => api.put(`/polls/${id}/close`),
  deletePoll: (id) => api.delete(`/polls/${id}`),
};

// User API functions
export const userAPI = {
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Auth API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Vote API functions
export const voteAPI = {
  vote: (optionId) => api.post('/votes', { optionId }),
  getVotesByPoll: (pollId) => api.get(`/votes/poll/${pollId}`),
};

export default api;


