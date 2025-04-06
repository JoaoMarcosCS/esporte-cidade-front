import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5173/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Interceptor para adicionar token nos headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== '/login-professor') {
            localStorage.removeItem('token');
            localStorage.removeItem('teacher');
            // Não redireciona se já estiver na página de login
            if (!window.location.pathname.includes('login')) {
                window.location.href = '/login-professor';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
