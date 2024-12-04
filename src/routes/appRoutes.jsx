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
  GestaoDeProfessores
} from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <ProfileSelect />,
      },

     

      // Rotas login
      {
        path: "/login-atleta",
        index: true,
        element: <LoginAtleta />,
      },
      {
        path: "/login-professor",
        index: true,
        element: <LoginProfessor />,
      },
      {
        path: "/login-gestor",
        index: true,
        element: <LoginGestor />,
      },

      // Rotas atleta
      {
        path: "/home-atleta",
        element: <HomeAtleta />,
      },
      {
        path: "/home-atleta/faltas-atleta",
        element: <FaltasAtleta />,
      },
      {
        path: "/home-atleta/cadastro",
        element: <CadastroAtleta />,
      },
      {
        path: "/home-atleta/editar-perfil",
        element: <EditarPerfil />,
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
        index: true,
        element: <Chamada />,
      },

      // Rotas Gestor
      {
        path: "/home-Gestor",
        index: true,
        element: <HomeGestor/>,
      },
      {
        path: "/home-Gestor/cadastrar-comunicado",
        index: true,
        element: <CadastroComunicados/>,
      },
      {
        path: "/home-Gestor/professores",
        index: true,
        element: <GestaoDeProfessores/>,
      },      
    ],
  },
]);
export default router;
