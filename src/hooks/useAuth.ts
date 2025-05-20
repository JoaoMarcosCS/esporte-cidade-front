import { useContext, useEffect } from "react";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
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

        // If we have a token but no user, fetch user data
        if (!user) {
          await fetchUser();
          return;
        }

        // Check role if required
        if (requiredRole && user.role !== requiredRole) {
          throw new Error(`Acesso não autorizado para role ${user.role}`);
        }
      } catch (err) {
        console.warn("Auth check failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    checkAuth();
  }, [loading, user, requiredRole, navigate]);

  return {
    isAuthenticated,
    isLoading: loading,
    user,
  };
};
