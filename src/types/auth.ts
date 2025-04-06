export interface User {
    id: number;
    name?: string; // Agora opcional
    cpf: string;
    role: number; // Mudando para number para corresponder ao backend
    email?: string;
    phone?: string;
    birthday?: string;
    rg?: string;
    password?: string;
    photo_url?: string;
    profilePicture?: string;
    isAtleta?: boolean;
    isProfessor?: boolean;
    isGestor?: boolean;
    [key: string]: any; // Permite propriedades adicionais
}

export interface LoginCredentials {
    cpf: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    fetchUser: () => Promise<void>;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: {
        accessToken: string;
        athlete?: User;
        teacher?: User;
        manager?: User;
    };
}
