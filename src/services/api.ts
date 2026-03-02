import axios from 'axios';

// Variáveis de ambiente corrigidas para Next.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.origindata.com.br';
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || false;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Evita redirecionamento infinito se o erro for na página de login
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);