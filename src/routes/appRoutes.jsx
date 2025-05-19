import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";

import {
  CadastroAtleta,
  Home,
  Chamada,
  ErrorPage,
  HomeAtleta,
  HomeProfessor,
  LoginAtleta,
  LoginProfessor,
  LoginGestor,
  ProfileSelect,
  AtletasLista,
  FaltasAtleta,
  EditarPerfil,
  HomeGestor,
  CadastroComunicados,
  GestaoDeProfessores,
  AtletaFaltas,
  RedirecionarHome,
  CadastroModalidades,
} from "../pages";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        // ROTAS PUBLICAS
        {
          path: "/",
          element: <ProfileSelect />,
        },
        {
          path: "/redirecting",
          element: <RedirecionarHome />,
        },

        // Rotas login e cadastro (PUBLICAS)
        {
          path: "/login-atleta",
          element: <LoginAtleta />,
        },
        {
          path: "/login-professor",
          element: <LoginProfessor />,
        },
        {
          path: "/login-gestor",
          element: <LoginGestor />,
        },
        {
          path: "/home-atleta/cadastro",
          element: <CadastroAtleta />,
        },

        // ROTAS PRIVADAS

        // Rotas atleta (PRIVADO)
        {
          path: "/home-atleta",
          element: (
            <ProtectedRoute requiredRole="1">
              <HomeAtleta />
            </ProtectedRoute>
          ),
        },
        {
          path: "/home-atleta/faltas-atleta",
          element: (
            <ProtectedRoute requiredRole="1">
              <AtletaFaltas />
            </ProtectedRoute>
          ),
        },
        {
          path: "/home-atleta/editar-perfil",
          element: (
            <ProtectedRoute requiredRole="1">
              <EditarPerfil />
            </ProtectedRoute>
          ),
        },

        // Rotas professor (PRIVADO)
        {
          path: "/home-professor",
          element: (
           
              <HomeProfessor />
           
          ),
        },
        {
          path: "/home-professor/lista-atletas",
          element: (
            <ProtectedRoute requiredRole="2">
              <AtletasLista />
            </ProtectedRoute>
          ),
        },
        {
          path: "/home-professor/chamada",
          element: (
            <ProtectedRoute requiredRole="2">
              <Chamada />
            </ProtectedRoute>
          ),
        },

        // Rotas Gestor (PRIVADO)
        {
          path: "/home-Gestor",
          element: (
            //<ProtectedRoute requiredRole="3">
              <HomeGestor />
            //</ProtectedRoute>
          ),
        },
        {
          path: "/home-Gestor/cadastrar-comunicado",
          element: (
           // <ProtectedRoute requiredRole="3">
              <CadastroComunicados />
          //  </ProtectedRoute>
          ),
        },
        {
          path: "/home-Gestor/cadastrar-Modalidade",
          element: (
          //  <ProtectedRoute requiredRole="3">
              <CadastroModalidades />
           // </ProtectedRoute>
          ),
        },
        {
          path: "/home-Gestor/cadastrar-professor",
          element: (
            //<ProtectedRoute requiredRole="3">
              <GestaoDeProfessores />
            //</ProtectedRoute>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
export default router;
