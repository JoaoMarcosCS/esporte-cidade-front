import  api  from "./api"; // base axios configurado

export const getAllModalities = async () => {
  try {
    const response = await api.get('/use/modality/all');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao buscar modalidades");
  }
};

export const getModalityById = async (id: number) => {
  try {
    const response = await api.get(`/use/modality/single/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao buscar modalidade");
  }
};

export const createModality = async (data: any) => {
  try {
    const response = await api.post('/use/modality/create', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao criar modalidade");
  }
};

export const updateModality = async (id: number, data: any) => {
  try {
    const response = await api.put(`/use/modality/update/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao atualizar modalidade");
  }
};

export const deleteModality = async (id: number) => {
  try {
    const response = await api.delete(`/use/modality/delete/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao excluir modalidade");
  }
};

export const  assignTeacherToModality = async (id:number, data:any) =>{
   try {
    const response = await api.put(`/use/modality/assign-teacher/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao atualizar modalidade");
  }
}