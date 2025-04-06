import { Modality } from "./Modality";

export interface Professor {
    id: string;
    name: string;
    password: string;
    cpf: string;
    rg: string;
    birthday: string;
    phone: string;
    photo_url: string;
    email: string;
    about: string;
    modality: Modality | null;
}