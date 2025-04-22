import * as React from "react"
import HeaderBasic from "../components/navigation/HeaderBasic"
import { useUser, useAuthStatus } from '../hooks/useAuth';
import useNavigateTo from "../hooks/useNavigateTo";
import { VisualizarAtendimentos, QuantidadeAtendimentos, AtendimentosAnteriores } from "../components/Atendimentos-professor";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import FooterMobile from "../components/navigation/FooterMobile";
import {
    SidebarInset,
    SidebarProvider,
} from "../components/ui/sidebar"
import { useAuth } from '../contexts/AuthContext';
import { useDecodedToken } from '../hooks/useDecodedToken';
import { Navigate } from "react-router-dom";

export function useMediaQuerie() {
    const customBreakpoint = 854
    const [isMobile, setIsmobile] = React.useState<boolean | undefined>(undefined)
    React.useEffect(() => {
        const media = window.matchMedia(`(max-width:${customBreakpoint - 1}px)`)
        const onChange = () => {
            setIsmobile(window.innerWidth < customBreakpoint)
        }
        media.addEventListener('change', onChange)
        setIsmobile(window.innerWidth < customBreakpoint)
        return () => { media.removeEventListener('change', onChange) }
    })
    return !!isMobile

}

const HomeProfessor = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const { isLoading: authCheckLoading } = useAuthStatus("2");
    const isMobile = useMediaQuerie()
    const GoTo = useNavigateTo();
    const userType = "professor"
    const userData = useUser();
      //const { fetchUser } = useAuthStatus();
      const decodedToken = useDecodedToken();

      console.log('decodedToken:', decodedToken);
      console.log('localStorage token:', localStorage.getItem('token'));

      console.log('Current auth state:', {
        isAuthenticated,
        loading,
        user,
        token: localStorage.getItem('token')
    });
      if (loading || authCheckLoading) {
         return <div>Loading...</div>;
     }
   
     if (!isAuthenticated) {
         console.warn('Redirecting due to:', {
             isAuthenticated,
             userRole: user?.role,
             expectedRole: "1"
         });
         return <Navigate to="/" replace />;
     }
     return (
        <SidebarProvider>
            <AppSidebar type={userType} />
            <SidebarInset>
                <div className="min-h-screen bg-gray-100">
                    <HeaderBasic
                        type="usuario"
                        links={[
                            { label: "Home", path: "/home-professor" },
                            { label: "Chamada", path: "/home-professor/chamada" },
                            { label: "Atletas", path: "/home-professor/lista-atletas" },
                        ]}
                    />

                    <div className="max-w-7xl pb-24 ml-24 mr-10 mt-14 ">

                        <h1 className="text-2xl font-bold">
                            Olá, Professor(a) <span className="text-[#EB8317]">{userData?.name}</span>!
                        </h1>

                        {isMobile ? (
                            <div className="mt-4 flex flex-col mr-6 items-center gap-8">
                                <VisualizarAtendimentos />
                                <QuantidadeAtendimentos />
                                <AtendimentosAnteriores />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <VisualizarAtendimentos />
                                <QuantidadeAtendimentos />
                                <AtendimentosAnteriores />
                            </div>
                        )}
                    </div>
                    <FooterMobile />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default HomeProfessor;
