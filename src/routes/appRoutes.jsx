import { createBrowserRouter } from "react-router-dom";
import App from "../App";

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
  Modalidade
} from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ProfileSelect />,
      },

      // Rotas login
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

      // Rotas atleta
      {
        path: "/home-atleta",
        element: <HomeAtleta />,
      },
      {
        path: "/home-atleta/faltas-atleta",
        element: <AtletaFaltas />,
      },
      {
        path: "/home-atleta/cadastro",
        element: <CadastroAtleta />,
      },
      {
        path: "/home-atleta/editar-perfil",
        element: <EditarPerfil />,
      },
      {
        path: "/home-atleta/modalidade",
        element: <Modalidade />,
      },

      // Rotas de professor
      {
        path: "/home-professor",
        element: <HomeProfessor />,
      },
      {
        path: "/home-professor/lista-atletas",
        element: <AtletasLista />,
      },
      {
        path: "/home-professor/chamada",
        element: <Chamada />,
      },

      // Rotas Gestor
      {
        path: "/home-Gestor",
        element: <HomeGestor/>,
      },
      {
        path: "/home-Gestor/cadastrar-comunicado",
        element: <CadastroComunicados/>,
      },
      {
        path: "/home-Gestor/professores",
        element: <GestaoDeProfessores/>,
      },  
      {
        path: "/redirecting",
        element: <RedirecionarHome/>,
      },      
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});
export default router;
