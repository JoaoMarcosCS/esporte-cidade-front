import api from './api';

interface LoginCredentials {
    cpf: string;
    password: string;
}

interface TeacherLoginCredentials {
    email: string;
    password: string;
}

interface ManagerLoginCredentials {
    email: string;
    password: string;
}

export const loginAthlete = async (credentials: LoginCredentials) => {
    try {
        const response = await api.post('/auth/login', {
            type: "athlete",
            credentials: {
                cpf: credentials.cpf,
                password: credentials.password
            }
        });

        if (response.data.accessToken && response.data.user) {
            return response.data;
        }
        throw new Error(response.data.message || "Erro ao fazer login");
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
};

export const loginTeacher = async (credentials: TeacherLoginCredentials) => {
    try {
        const response = await api.post('/auth/login', {
            type: "teacher",
            credentials: {
                email: credentials.email,
                password: credentials.password
            }
        });

        if (response.data.accessToken && response.data.user) {
            return response.data;
        }
        throw new Error(response.data.message || "Erro ao fazer login");
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('Senha incorreta');
        }
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
};

export const loginManager = async (credentials: ManagerLoginCredentials) => {
    try {
        const response = await api.post('/auth/login', {
            type: "manager",
            credentials: {
                email: credentials.email,
                password: credentials.password
            }
        });

        if (response.data.accessToken && response.data.user) {
            return response.data;
        }
        throw new Error(response.data.message || "Erro ao fazer login");
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('Senha incorreta');
        }
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
};