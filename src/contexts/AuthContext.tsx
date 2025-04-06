import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { LoginCredentials, User, AuthContextType } from '../types/auth';
import { loginAthlete } from '../services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            const payloadBase64 = token.split('.')[1];
            if (!payloadBase64) throw new Error('Token inválido');

            const decoded = JSON.parse(atob(payloadBase64));
            const userId = decoded.id;
            const role = decoded.role; // 1 for athlete, 2 for teacher

            if (!userId) throw new Error('ID do usuário não encontrado no token');
            if (!role) throw new Error('Role do usuário não encontrado no token');

            console.log('AuthProvider: ID do usuário:', userId, 'Role:', role);

            let response;
            if (role === 2) { // 2 means teacher
                response = await api.get(`/teachers/${userId}`);
            } else {
                response = await api.get(`/athletes/${userId}`);
            }

            const userFromApi = response.data;
            console.log('Resposta da API do usuário:', response.data);

            if (userFromApi) {
                setUser(userFromApi);
                localStorage.setItem('user', JSON.stringify(userFromApi));
            } else {
                throw new Error('Usuário não encontrado');
            }
        } catch (error) {
            console.error('AuthProvider: Erro ao buscar dados do usuário:', error);
            throw error;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser().catch(err => {
                console.error('AuthProvider: Erro ao buscar usuário:', err);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);

            const response = await loginAthlete(credentials);
            if (response.success && response.data) {
                const { accessToken, athlete } = response.data;

                if (!athlete) throw new Error('Usuário não encontrado na resposta');

                localStorage.setItem('token', accessToken);
                localStorage.setItem('user', JSON.stringify(athlete));
                setUser(athlete);

                await fetchUser();
                return;
            } else {
                throw new Error(response.message || 'Erro ao fazer login');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                logout,
                isAuthenticated: !!user,
                fetchUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
