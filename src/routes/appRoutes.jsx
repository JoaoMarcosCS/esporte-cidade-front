import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { CadastroAtleta, Chamada, ErrorPage, Home, HomeAtleta, LoginAtleta, LoginGestor, LoginProfessor, ProfileSelect, AtletaFaltas } from '../pages/index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '/',
        index: true,
        element: <Home/>,
      },
      {
        path: '/profile-select',
        index: true,
        element: <ProfileSelect/>,
      },
      {
        path: '/login-atleta',
        index: true,
        element: <LoginAtleta/>,
      },
      {
        path: '/login-professor',
        index: true,
        element: <LoginProfessor/>,
      },
      {
        path: '/login-gestor',
        index: true,
        element: <LoginGestor/>,
      },
      {
        path: "/chamada",
        index: true,
        element: <Chamada/>,
      },
      {
        path: "/home-atleta",
        index: true,
        element: <HomeAtleta/>,
      },
      {
        path: "/cadastro-atleta",
        index: true,
        element: <CadastroAtleta/>,
      },
      {
        path: "/atleta-faltas",
        index: true,
        element: <AtletaFaltas/>,
      }
    ],
  },
]);

export default router;