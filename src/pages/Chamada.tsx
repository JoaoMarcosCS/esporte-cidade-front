// src/App.tsx ou src/components/ui/Home.tsx
import React from 'react';
import ChamadaComp from '../components/ChamadaComp';
import HeaderBasic from "../components/navigation/HeaderBasic"
import useNavigateTo from "../hooks/useNavigateTo";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import FooterMobile from "../components/navigation/FooterMobile";

import {
  SidebarInset,
  SidebarProvider,
} from "../components/ui/sidebar"

const Chamada: React.FC = () => {
  const userType = "professor"
  const user = {
    name: "",
    profilePicture: "",
  };
  return (

    <SidebarProvider>
      <AppSidebar type="professor" />
      <SidebarInset>
        <div className="min-h-screen bg-gray-100">
          
          <HeaderBasic
            type='usuario'
            user={user}
            links={[
              { label: "Home", path: "/home-professor" },
              { label: "Chamada", path: "/home-professor/chamada" },
              { label: "Atletas", path: "/home-professor/lista-atletas" },
              { label: "Aprovar Inscrições", path: "/home-professor/aprovar-inscricoes" }
            ]}

          />
          <ChamadaComp userType={userType} />

          <FooterMobile />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Chamada;
