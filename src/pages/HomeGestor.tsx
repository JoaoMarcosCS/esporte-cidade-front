import React from "react";
import AgendaSemanal from "../components/AgendaSemanal";
import FaltaAtleta from "../components/FaltaAtleta";
import FaltaProfessor from "../components/FaltaProfessor";
import useNavigateTo from "../hooks/useNavigateTo";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import { Escala } from "../components/Escala";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import { CalendarioCompromissos } from '../components/Comunicados';

import {
    SidebarInset,
    SidebarProvider,
} from "../components/ui/sidebar"


//depois da para trocar com o backend
const nomeDoGestor = "maria"


const HomeGestor = () => {

    const GoTo = useNavigateTo();
    const userType = "gestor"

    return (

        <SidebarProvider>
            <AppSidebar type="gestor" />
            <SidebarInset>
                <div className="min-h-screen flex flex-col  bg-white pb-16">

                    <HeaderBasic
                        type="usuario"
                        links={[
                            { label: "Home", path: "/home-gestor" },
                            { label: "Comunicados", path: "/home-gestor/cadastrar-comunicado" },
                            { label: "Professores", path: "/home-gestor/professores" },
                        ]} />

                    <div className="  ml-20 mt-32 pb-6">
                        <h2 className="text-4xl font-bold pb-2">
                            Olá, Gestor(a) <span className="text-[#EB8317]">{nomeDoGestor}</span>
                        </h2>
                        <div className="xl:items-start items-center flex flex-col xl:flex-row">
                            <div className="mt-12">
                                <Escala />
                            </div>
                            <div className="mt-12">
                                <CalendarioCompromissos type="DisableEdit"  />
                            </div>
                        </div>
                    </div>
                    <FooterMobile />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default HomeGestor;