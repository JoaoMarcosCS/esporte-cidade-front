import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useNavigateTo from "../../hooks/useNavigateTo";

interface FooterMobileProps {
  links?: { label: string; path: string; icon?: JSX.Element }[]; // Ícones opcionais
}

const FooterMobile: React.FC<FooterMobileProps> = ({ links = [] }) => {
  const location = useLocation();
  const GoTo = useNavigateTo();

  // Links baseados na rota atual
  const dynamicLinks = () => {
    switch (location.pathname) {
      case "/home-atleta":
        return [
          { label: "Início", path: "/", icon: <i className="fas fa-home"></i> },
          {
            label: "Perfil",
            path: "/editar-perfil",
            icon: <i className="fas fa-user-circle"></i>,
          },
        ];
      case "/chamada":
        return [
          { label: "Início", path: "/", icon: <i className="fas fa-home"></i> },
          { label: "Chamada", path: "/chamada", icon: <i className="fas fa-list"></i> },
        ];
      default:
        return links; // Links passados como props, se existirem
    }
  };

  const allLinks = dynamicLinks();

  return (
    <footer className="fixed bottom-0 w-full bg-[#F4F6FF] border-t border-gray-200 shadow-inner flex justify-around py-3 md:hidden gap-4">
        <button onClick={() => GoTo("/home")} className=" bg-[#d9d9d9] flex-1 flex flex-col items-center text-black shadow-md rounded-md py-1 bg-[#F4F6FF] border border-black ml-2 hover:bg-[#EB8317] transition-transform">
          <i className="material-icons"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
            <path d="M39.5,43h-9c-1.381,0-2.5-1.119-2.5-2.5v-9c0-1.105-0.895-2-2-2h-4c-1.105,0-2,0.895-2,2v9c0,1.381-1.119,2.5-2.5,2.5h-9	C7.119,43,6,41.881,6,40.5V21.413c0-2.299,1.054-4.471,2.859-5.893L23.071,4.321c0.545-0.428,1.313-0.428,1.857,0L39.142,15.52	C40.947,16.942,42,19.113,42,21.411V40.5C42,41.881,40.881,43,39.5,43z"></path>
          </svg></i>
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => GoTo("/faltas-atleta")} className="bg-[#d9d9d9] flex-1 flex flex-col items-center text-black shadow-md rounded-md py-1 bg-[#F4F6FF] border border-black hover:bg-[#EB8317] transition-transform">
          <i className="material-icons"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
            <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
          </svg></i>
          <span className="text-xs">Faltas</span>
        </button>
        <button onClick={() => GoTo("/faltas-atleta")} className="bg-[#d9d9d9] flex-1 flex flex-col items-center text-black shadow-md rounded-md py-1 bg-[#F4F6FF] border border-black hover:bg-[#EB8317] transition-transform">
          <i className="material-icons"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
            <path d="M 17.5 4 C 15.190108 4 13.30317 5.756334 13.050781 8 L 10.5 8 C 8.5850452 8 7 9.5850452 7 11.5 L 7 17.5 C 7 21.071938 9.9280619 24 13.5 24 L 13.548828 24 C 14.885791 28.172832 18.546016 31.306266 23 31.890625 L 23 35 L 19.5 35 C 15.916 35 13 37.916 13 41.5 L 13 42.5 C 13 43.329 13.671 44 14.5 44 L 34.5 44 C 35.329 44 36 43.329 36 42.5 L 36 41.5 C 36 37.916 33.084 35 29.5 35 L 26 35 L 26 31.890625 C 30.453984 31.306266 34.114209 28.172832 35.451172 24 L 35.5 24 C 39.071938 24 42 21.071938 42 17.5 L 42 11.5 C 42 9.5850452 40.414955 8 38.5 8 L 35.949219 8 C 35.69683 5.756334 33.809892 4 31.5 4 L 17.5 4 z M 10.5 11 L 13 11 L 13 20.5 C 13 20.653 13.017486 20.801558 13.023438 20.953125 C 11.305593 20.722554 10 19.286673 10 17.5 L 10 11.5 C 10 11.204955 10.204955 11 10.5 11 z M 36 11 L 38.5 11 C 38.795045 11 39 11.204955 39 11.5 L 39 17.5 C 39 19.286673 37.694407 20.722554 35.976562 20.953125 C 35.982514 20.801558 36 20.653 36 20.5 L 36 11 z"></path>
          </svg></i>
          <span className="text-xs">Modalidades</span>
        </button>
        <button onClick={() => GoTo("/calendario")} className="bg-[#d9d9d9] flex-1 flex flex-col items-center text-black shadow-md rounded-md py-1 bg-[#F4F6FF] border border-black mr-2 hover:bg-[#EB8317] transition-transform">
          <i className="material-icons"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
            <path d="M42 14v-1.5C42 8.916 39.084 6 35.5 6h-23C8.916 6 6 8.916 6 12.5V14H42zM6 17v18.5c0 3.584 2.916 6.5 6.5 6.5h23c3.584 0 6.5-2.916 6.5-6.5V17H6zM15.5 36c-1.381 0-2.5-1.119-2.5-2.5 0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5C18 34.881 16.881 36 15.5 36zM15.5 27c-1.381 0-2.5-1.119-2.5-2.5 0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5C18 25.881 16.881 27 15.5 27zM24 36c-1.381 0-2.5-1.119-2.5-2.5 0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5C26.5 34.881 25.381 36 24 36zM24 27c-1.381 0-2.5-1.119-2.5-2.5 0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5C26.5 25.881 25.381 27 24 27zM32.5 27c-1.381 0-2.5-1.119-2.5-2.5 0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5C35 25.881 33.881 27 32.5 27z"></path>
          </svg></i>
          <span className="text-xs">Calendário</span>
        </button>
      </footer>
  );
};

export default FooterMobile;
