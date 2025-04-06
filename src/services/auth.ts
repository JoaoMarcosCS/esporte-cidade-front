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
        const response = await api.post('/auth/athlete', {
            cpf: credentials.cpf,
            password: credentials.password
        });

        if (response.data.success) {
            return response.data;
        }
        throw new Error(response.data.message);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
};

export const loginTeacher = async (credentials: TeacherLoginCredentials) => {
    try {
        const response = await api.post('/auth/teacher/login', {
            email: credentials.email,
            password: credentials.password
        });

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('Senha incorreta');
        }
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
};

export const loginManager = async (credentials: ManagerLoginCredentials) => {
    try {
        const response = await api.post('/auth/manager/login', {
            email: credentials.email,
            password: credentials.password
        });

        if (response.data.success) {
            return response.data;
        }
        throw new Error(response.data.message);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
};