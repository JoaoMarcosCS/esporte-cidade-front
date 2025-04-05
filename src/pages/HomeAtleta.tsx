import React from "react";
import AgendaSemanal from "../components/AgendaSemanal";
import FaltaAtleta from "../components/FaltaAtleta";
import FaltaProfessor from "../components/FaltaProfessor";
import CalendarioCompromissos from "../components/CalendarioCompromissos";
import useNavigateTo from "../hooks/useNavigateTo";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";

import { AppSidebar } from '../components/navigation/AppSidebar-prof';

import {
  SidebarInset,
  SidebarProvider,
} from "../components/ui/sidebar"

const HomeAtleta: React.FC = () => {
  const GoTo = useNavigateTo();
  const userType = "atleta"
  const user = {
    name: "",
    profilePicture: "",
  };

  return (
    <SidebarProvider>
      <AppSidebar type="atleta" />
      <SidebarInset>
        {/* <div className="min-h-screen bg-white flex flex-col items-center pb-16"> */}
          {/* Cabeçalho: visível apenas em telas md ou maiores */}
          {/*<header> ... </header>*/}
  
          <HeaderBasic
            type="usuario"
            user={user}
            links={[
              { label: "Home", path: "/home-atleta" },
              { label: "Faltas", path: "/home-atleta/faltas-atleta" },
              { label: "Modalidades", path: "/home-atleta/modalidade" },
              { label: "Horário", path: "/home-atleta/horarios" },
            ]}
          />
  
          {/* Conteúdo Principal */}
          <main className="w-full lg:w-3/4 mx-auto mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4 text-left">
              Olá, <span className="text-[#EB8317]">Atleta!</span>
            </h2>
  
            {/* Layout principal usando grid */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="col-span-2 bg-[#d9d9d9] p-4 rounded border border-black shadow-md mb-4 md:mb-4 md:mr-4">
                <h3 className="font-semibold mb-2">HORÁRIO SEMANAL</h3>
                <AgendaSemanal userType={userType} />
              </div>
  
              <div className="row-span-2 bg-[#d9d9d9] p-4 rounded border border-black shadow-md mb-4 md:mb-0 md:mr-4">
                <h3 className="font-semibold mb-2">CALENDÁRIO DE COMPROMISSOS</h3>
                <CalendarioCompromissos userType={userType} />
              </div>
  
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#d9d9d9] p-4 rounded border border-black shadow-md mb-4 md:mb-0">
                  <h3 className="font-semibold mb-2">AUSÊNCIA DE PROFESSOR</h3>
                  <FaltaProfessor userType={userType} />
                </div>
  
                <div className="bg-[#d9d9d9] p-4 rounded border border-black shadow-md md:mr-4">
                  <h3 className="font-semibold mb-2">FALTAS</h3>
                  <FaltaAtleta subject="Judô" absences={4} maxAbsences={10} />
                </div>
              </div>
            </div>
          </main>

          {/* <FooterMobile /> */}
        {/* </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}

        export default HomeAtleta;
