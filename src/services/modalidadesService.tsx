import api from "./api";
import { Modality } from "@/types/Modality";
import axios from "axios";

const API_URL = "http://localhost:3002/api/modality/";

export const getModalities = async (): Promise<Modality[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar modalides:", error);
        return [];
    }
};