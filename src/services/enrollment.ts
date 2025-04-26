import api from './api';

export const inscreverEmModalidade = async (modalityId: number) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/enrollment/', { modalityId }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};