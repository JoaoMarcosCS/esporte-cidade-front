import { useContext, useEffect } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

export const useAuthStatus = (requiredRole?: string) => {
    const { isAuthenticated, loading, user, fetchUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (loading) return;
            
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");
                
                // Convert both to string for comparison
                const userRole = user?.role?.toString();
                
                if (requiredRole && userRole !== requiredRole) {
                    throw new Error(`Role mismatch. User: ${userRole}, Required: ${requiredRole}`);
                }
                
                if (!user && token) {
                    await fetchUser();
                }
            } catch (err) {
                console.warn("Auth check failed:", err);
                navigate("/");
            }
        };

        checkAuth();
    }, [loading, user, requiredRole]);

    return {
        isAuthenticated,
        isLoading: loading,
        user
    };
};