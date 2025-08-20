import axios, { AxiosInstance } from 'axios';

// Cria uma única instância exportável do Axios
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configura um interceptor de requisições para anexar o token JWT
api.interceptors.request.use(
  (config) => {
    // Apenas anexa o token se a requisição não for para o endpoint de login
    if (config.url !== '/auth/login') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;