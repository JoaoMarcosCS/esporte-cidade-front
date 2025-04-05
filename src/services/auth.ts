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
        const response = await api.post('/api/v1/auth/athlete/', {
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
        const response = await api.post('/api/v1/auth/teacher/login', {
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

export const loginManager = async (credentials: ManagerLoginCredentials) => {
    try {
        const response = await api.post('/api/v1/auth/manager/login', {
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
