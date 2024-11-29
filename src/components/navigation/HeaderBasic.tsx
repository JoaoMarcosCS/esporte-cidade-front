import React, { useState } from "react";
import useNavigateTo from "../../hooks/useNavigateTo";
import { CustomSidebarTrigger } from '../ui/custom-trigger'
import { useIsMobile } from "../../hooks/use-mobile";


interface HeaderBasicProps {
  links?: { label: string; path: string }[]; // Define links dinamicamente
  user?: { name: string; profilePicture: string }; // Dados do usuário logado
  type?: "usuario" | "visitante"; // define o tipo de usuario para a sidebar saber se pode renderizar
}




const HeaderBasic: React.FC<HeaderBasicProps> = ({ links = [], user, type }) => {
  const [menuOpen, setMenuOpen] = useState(false); // Estado do menu
  const GoTo = useNavigateTo();

  //define se o usuario pode ver ou não a sidebar
  const headerLeft:boolean = type === "usuario" ? true : false;

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    // Implementar lógica de logout
    console.log("Logout realizado");
    GoTo("/login"); // Exemplo: redirecionar para a página de login
  };

  

  return (
    <header className="w-full bg-white flex items-center justify-between gap-4 px-6 py-4 shadow">
      {/* Logo e título */}
      <div className="flex items-center md:gap-0  gap-2">

        {headerLeft?
        <CustomSidebarTrigger />:
        <></>}
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
        {user && (
          <div className="relative">
            <img
              src={user.profilePicture}
              alt={`${user.name}'s profile`}
              className="h-10 w-10 rounded-full border border-gray-300 shadow-md cursor-pointer"
              onClick={handleMenuToggle}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
                <button
                  onClick={() => GoTo("/editar-perfil")}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>

  );
};

export default HeaderBasic;


{/*
  <HeaderBasic 
          user={user}
          links={[
            { label: "Faltas", path: "/faltas-atleta" },
            { label: "Modalidades", path: "/modalidade" },
            { label: "Horário", path: "/horarios" },
          ]}
          
  />
*/ }