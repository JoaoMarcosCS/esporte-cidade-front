import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

import {
  CadastroAtleta,
  Home,
  Chamada,
  ErrorPage,
  HomeAtleta,
  LoginAtleta,
  LoginProfessor,
  LoginGestor,
  ProfileSelect,
  AtletasLista,
  HomeProfessor
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
        element: <Home />,
      },
      {
        path: "/profile-select",
        index: true,
        element: <ProfileSelect />,
      },
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
      {
        path: "/chamada",
        index: true,
        element: <Chamada />,
      },
      {
        path: "/home-atleta",
        index: true,
        element: <HomeAtleta />,
      },
      {
        path: "/cadastro-atleta",
        index: true,
        element: <CadastroAtleta />,
      },
      {
        path: "/home-professor",
        index: true,
        element: <HomeProfessor />,
      },
      {
        path: "/lista-atletas",
        index: true,
        element: <AtletasLista />,
      },
    ],
  },
]);

export default router;
