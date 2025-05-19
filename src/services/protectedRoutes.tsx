import axios from 'axios';

const BASE_URL = 'http://localhost:3002/api/protect/';

export const checkProtectedRoute = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Acesso autorizado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao acessar rota protegida:', error.response?.data || error.message);
    throw error;
  }
};