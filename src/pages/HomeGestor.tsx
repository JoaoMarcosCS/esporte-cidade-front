import React from "react";
import HeaderBasic from "../components/navigation/HeaderBasic";
import useNavigateTo from "../hooks/useNavigateTo";
import { AppSidebar } from "../components/navigation/AppSidebar-prof";
import FooterMobile from "../components/navigation/FooterMobile";
import { Escala } from "../components/Escala";
import { CalendarioCompromissos } from "../components/Comunicados";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useUser, useAuthStatus } from "../hooks/useAuth";
import { useDecodedToken } from "../hooks/useDecodedToken";
import { Navigate } from "react-router-dom";

const HomeGestor = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const { isLoading: authCheckLoading } = useAuthStatus("3");
  const GoTo = useNavigateTo();
  const userType = "gestor";
  const userData = useUser();
  const decodedToken = useDecodedToken();

  // Logs para depuração (igual HomeProfessor)
  console.log(localStorage.getItem("token"));
  console.log("decodedToken:", decodedToken);
  console.log("localStorage accessToken:", localStorage.getItem("accessToken"));
  console.log("Current auth state:", {
    isAuthenticated,
    loading,
    user,
    token: localStorage.getItem("accessToken"),
  });

  if (loading || authCheckLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Log extra para depuração do token JWT
    const token = localStorage.getItem("accessToken");
    let decodedPayload = undefined;
    if (token) {
      try {
        decodedPayload = JSON.parse(atob(token.split(".")[1]));
        // Log para garantir que role está correto
        console.log("Token payload (gestor):", decodedPayload);
      } catch (e) {
        console.warn("Erro ao decodificar token:", e);
      }
    }
    console.warn("Redirecting due to:", {
      isAuthenticated,
      userRole: user?.role,
      expectedRole: "3",
      decodedRole: decodedPayload?.role,
      decodedType: decodedPayload?.type,
      tokenPayload: decodedPayload,
    });
    // Sugestão: informe ao usuário que o login expirou ou está inválido
    // alert("Sessão expirada ou inválida. Faça login novamente.");
    return <Navigate to="/" replace />;
  }

  // Fallback para nome e email
  const nomeDoGestor = userData?.name || userData?.email || "Gestor";

  // Exemplo de objeto user para passar para HeaderBasic e outros componentes
  const userObj = {
    name: userData?.name ?? userData?.email ?? "Gestor",
    profilePicture: userData?.photo_url ?? "",
  };

  return (
    <SidebarProvider>
      <AppSidebar type="gestor" />
      <SidebarInset>
        <div className="min-h-screen flex flex-col  bg-white pb-16">
          <HeaderBasic
            type="usuario"
            user={userObj}
            links={[
              { label: "Home", path: "/home-gestor" },
              {
                label: "Comunicados",
                path: "/home-gestor/cadastrar-comunicado",
              },
              { label: "Professores", path: "/home-gestor/professores" },
            ]}
          />
          <div className="  ml-20 mt-32 pb-6">
            <h2 className="text-4xl font-bold pb-2">
              Olá, Gestor(a){" "}
              <span className="text-[#EB8317]">{nomeDoGestor}</span>
            </h2>
            <div className="xl:items-start items-center flex flex-col xl:flex-row">
              <div className="mt-12">
                <Escala />
              </div>
              <div className="mt-12">
                <CalendarioCompromissos type="DisableEdit" />
              </div>
            </div>
          </div>
          <FooterMobile />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default HomeGestor;
