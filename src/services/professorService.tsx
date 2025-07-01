import { Professor } from "../types/Professor";
import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:3002/api/teacher";

export const getProfessores = async (): Promise<Professor[]> => {
    try {
        const response = await api.get("/teacher");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar professores:", error);
        return [];
    }
};

export const saveProfessor = async (professor: Professor): Promise<Professor> => {
    try {
        const method = professor.id === -1 ? "POST" : "PUT";
        const url = professor.id === -1 ? API_URL : `${API_URL}/${professor.id}`;

        // Cria um objeto com os dados do professor, incluindo o objeto completo da modalidade
        const professorToSave: any = { 
            ...professor
        };
        
        // Remove campos que não devem ser enviados
        delete professorToSave.id;

        console.log('Enviando dados para a API:', {
            url,
            method,
            data: professorToSave
        });

        const response = method === "POST" 
            ? await axios.post(url, professorToSave)
            : await axios.put(url, professorToSave);

        console.log('Resposta da API:', response.data);
        return response.data;
    } catch (error) {
        console.error(professor.id === -1 ? "Erro ao adicionar professor" : "Erro ao editar professor:", error);
        throw error;
    }
};

export const getProfessorById = async (id: number): Promise<Professor> => {
    try {
        const response = await api.get(`/teacher/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar detalhes do professor:", error);
        throw error;
    }
};

export const deleteProfessor = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir professor:", error);
        throw error;
    }
};
