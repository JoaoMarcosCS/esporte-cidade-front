import React from 'react';
import HeaderBasic from "../components/navigation/header-professor"
import Navbar from "../components/navigation/navbar-professor"
import { useIsMobile } from "../hooks/use-mobile";
import { VisualizarAtendimentos, QuantidadeAtendimentos, AtendimentosAnteriores } from "../components/Atendimentos-professor";
import useNavigateTo from "../hooks/useNavigateTo";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';

import {
    SidebarInset,
    SidebarProvider,
} from "../components/ui/sidebar"

const HomeProfessor: React.FC = () => {
    const GoTo = useNavigateTo()
    const isMobile = useIsMobile();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="min-h-screen bg-gray-100">
                    <HeaderBasic />

                    <div className="max-w-7xl pb-24 ml-24 mr-10 mt-14 ">

                        <h1 className="text-2xl font-bold">
                            Olá, Professor(a) <span className="text-orange-500">Moisés</span>
                        </h1>

                        {isMobile ? (
                            <div className="mt-4 flex flex-col mr-6 items-center gap-8">
                                <VisualizarAtendimentos/>
                                <QuantidadeAtendimentos/>
                                <AtendimentosAnteriores/>
                            </div>
                        ) : (
                            <div className="mt-4 grid grid-cols-2 mr-6 gap-14 space-x-10">
                                <div className="flex flex-col">
                                    <VisualizarAtendimentos/>
                                    <QuantidadeAtendimentos/>
                                </div>
                                <AtendimentosAnteriores/>
                            </div>
                        )}
                    </div>
                    <Navbar/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default HomeProfessor;
