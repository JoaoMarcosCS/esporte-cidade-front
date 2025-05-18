// src/App.tsx ou src/components/ui/Home.tsx
import React from 'react';
import ChamadaComp from '../components/ChamadaComp';
import HeaderBasic from "../components/navigation/HeaderBasic"
import useNavigateTo from "../hooks/useNavigateTo";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import FooterMobile from "../components/navigation/FooterMobile";
import api from "../services/api";

import {
  SidebarInset,
  SidebarProvider,
} from "../components/ui/sidebar"

const Chamada: React.FC = () => {
  const userType = "professor";
  const user = {
    name: "",
    profilePicture: "",
  };

  // Função para buscar atletas de uma modalidade
  const fetchAtletasDaModalidade = async (modalityId: number) => {
    const res = await api.get(`/modality/${modalityId}/athletes-availible`);
    // Ajuste conforme o retorno da API
    return res.data.athletes_availible || [];
  };

  // Função para registrar chamada
  const registrarChamada = async ({
    modalityId,
    teacherId,
    attendances,
  }: {
    modalityId: number;
    teacherId: number;
    attendances: { athleteId: number; present: boolean }[];
  }) => {
    // Envie apenas o array de presenças, mas inclua modalityId em cada objeto
    const atendimentos = attendances.map((a) => ({
      modalityId,
      athleteId: a.athleteId,
      present: a.present,
    }));
    return api.post(`/modality/${modalityId}/receive-atendiments`, atendimentos);
  };

  return (
    <SidebarProvider>
      <AppSidebar type="professor" />
      <SidebarInset>
        <div className="min-h-screen bg-gray-100">
          <HeaderBasic
            type="usuario"
            user={user}
            links={[
              { label: "Home", path: "/home-professor" },
              { label: "Chamada", path: "/home-professor/chamada" },
              { label: "Atletas", path: "/home-professor/lista-atletas" },
              { label: "Aprovar Inscrições", path: "/home-professor/aprovar-inscricoes" },
            ]}
          />
          <ChamadaComp
            userType={userType}
            fetchAtletasDaModalidade={fetchAtletasDaModalidade}
            registrarChamada={registrarChamada}
          />
          <FooterMobile />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Chamada;
