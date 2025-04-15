import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const useUser = () => {
    const { user } = useAuth();
    return user;
};

export const useAuthStatus = () => {
    const { isAuthenticated, loading, error, fetchUser } = useAuth();
    return {
        isAuthenticated,
        isLoading: loading,
        error,
        fetchUser
    };
};
