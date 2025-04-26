import api from './api';

export const getModalidades = async () => {
  const response = await api.get('/modality/');
  return response.data;
};

export const getModalidadesInscritas = async (athleteId: number) => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/enrollment/${athleteId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};