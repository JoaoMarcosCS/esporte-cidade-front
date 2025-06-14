import { Professor } from "../types/Professor";
import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:3002/api/teacher/";

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
        const method = professor.id == -1 ? "POST" : "PUT";
        const url = professor.id === -1 ? API_URL : `${API_URL}/${professor.id}`;

        const professorToSave: Partial<Professor> = { ...professor };
        delete professorToSave.id;

        const response = method === "POST" 
            ? await axios.post(url, professorToSave)
            : await axios.put(url, professorToSave);

        return response.data;
    } catch (error) {
        console.error(professor.id === -1 ? "Erro ao adicionar professor" : "Erro ao editar professor:", error);
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
