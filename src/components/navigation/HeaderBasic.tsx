import React, { useState } from "react";
import useNavigateTo from "../../hooks/useNavigateTo";
import { CustomSidebarTrigger } from '../ui/custom-trigger'
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../hooks/useAuth";
import { useDecodedToken } from "../../hooks/useDecodedToken";

interface HeaderBasicProps {
  links?: { label: string; path: string }[];
  type?: "usuario" | "visitante";
  logo?: "show" | "hide";
  user?: {
    name: string;
    profilePicture: string;
  };
}

const HeaderBasic: React.FC<HeaderBasicProps> = ({ links = [], type, logo = "show", user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const GoTo = useNavigateTo();
  const { logout } = useAuth();
  const userData = useUser();
  const decodedToken = useDecodedToken();

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    GoTo("/");
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-white flex items-center justify-between gap-4 px-6 py-4 shadow sticky top-0 z-50">
      <div className="flex items-center md:gap-0 gap-2">
        {type === "usuario" && <CustomSidebarTrigger />}
        
       
          <img
            src="https://lh3.googleusercontent.com/proxy/X-B99B9HsP3Lo4ae0nDQMozyMHTcxxdcPINH959IZlOUhqK7j0tdAK-sz09ISiS2c0ew2N4wyhXsHyR5EZ1vqwJKbh0VhZBj7gEfvT4DeFZkKw"
            alt="Logo"
            className="h-10 mr-4 hidden md:block"
          />
        
        <h1
          className="text-xl font-jockey cursor-pointer"
          onClick={() => GoTo("/")}
        >
          ESPORTE NA CIDADE
        </h1>
      </div>

      <div className="flex gap-3">
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => GoTo(link.path)}
              className="text-black font-bold hover:text-[#EB8317] transition-transform"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Foto de perfil do usuário */}
        <div className="relative">
           {logo === "show" && (
          <img
            src={userData?.profilePicture || user?.profilePicture || "https://via.placeholder.com/40"}
            alt={`${userData?.name || user?.name || 'Usuário'}'s profile`}
            className="h-10 w-10 border border-black cursor-pointer rounded-full"
            onClick={handleMenuToggle}
          />
           )}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold">{userData?.name || user?.name || decodedToken?.name || 'Usuário'}</h3>
                <p className="text-sm text-gray-500">{'Perfil'}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    GoTo("/editar-perfil");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Editar Perfil
                </button>
                {decodedToken?.role === "atleta" && (
                  <button
                    onClick={() => {
                      GoTo("/faltas-atleta");
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Ver Faltas
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBasic;