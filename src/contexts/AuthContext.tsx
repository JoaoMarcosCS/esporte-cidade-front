import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { LoginCredentials, User, AuthContextType } from '../types/auth';
import { loginAthlete, loginManager, loginTeacher } from '../services/auth';
import { AxiosResponse } from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeToken = (token: string) => {
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) throw new Error('Invalid token format');
        return JSON.parse(atob(payloadBase64));
    } catch (error) {
        console.error('Token decoding failed:', error);
        throw new Error('Invalid token');
    }
};

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
            console.log('[fetchUser] Token encontrado:', token);
            if (!token) throw new Error('Token não encontrado');

            const decoded = decodeToken(token);
            console.log('[fetchUser] Token decodificado:', decoded);
            const userId = decoded.id;
            const role = decoded.role?.toString(); // Ensure role is string

            if (!userId) throw new Error('ID do usuário não encontrado no token');
            if (!role) throw new Error('Role do usuário não encontrado no token');

            console.log('[fetchUser] ID do usuário:', userId, 'Role:', role);

            let response: AxiosResponse;
            if (role === "1" || role === 1) {
                response = await api.get(`/athletes/${userId}`);
            } else if (role === "2" || role === 2) {
                response = await api.get(`/teacher/${userId}`);
            } else if (role === "3") {
                response = await api.get(`/manager/${userId}`);
            } else {
                throw new Error('Tipo de usuário inválido');
            }

            const userFromApi = response.data;
            console.log('[fetchUser] Resposta da API do usuário:', userFromApi);

            if (userFromApi) {
                // Ensure role is preserved as string
                const userData = {
                    ...userFromApi,
                    role: role
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                throw new Error('Usuário não encontrado');
            }
        } catch (error) {
            console.error('[fetchUser] Erro ao buscar dados do usuário:', error);
            throw error;
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await fetchUser();
                } catch (err) {
                    console.error('Failed to fetch user:', err);
                    logout();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);

            let response;
            switch (credentials.type) {
                case 'athlete':
                    response = await loginAthlete(credentials);
                    break;
                case 'teacher':
                    response = await loginTeacher(credentials);
                    break;
                case 'manager':
                    response = await loginManager(credentials); // Make sure this uses loginManager
                    break;
                default:
                    throw new Error('Tipo de login inválido');
            }

            if (response.accessToken && response.user) {
                localStorage.setItem('token', response.accessToken);
                const userData = {
                    ...response.user,
                    role: response.user.role?.toString()
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                await fetchUser();
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