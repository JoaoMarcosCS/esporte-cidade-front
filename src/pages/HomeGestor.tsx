import React from "react";
import AgendaSemanal from "../components/AgendaSemanal";
import FaltaAtleta from "../components/FaltaAtleta";
import FaltaProfessor from "../components/FaltaProfessor";
import useNavigateTo from "../hooks/useNavigateTo";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import { Escala } from "../components/Escala";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import {CalendarioCompromissos} from '../components/Comunicados';

import {
    SidebarInset,
    SidebarProvider,
} from "../components/ui/sidebar"


//depois da para trocar com o backend
const nomeDoGestor = "maria"


const HomeGestor = () => {

    const GoTo = useNavigateTo();
    const userType = "gestor"
    const user = {
        name: "",
        profilePicture: "",
    };

    return (

        <SidebarProvider>
            <AppSidebar type="gestor" />
            <SidebarInset>
                <div className="min-h-screen flex flex-col  bg-white pb-16">

                    <HeaderBasic type="usuario" user={user}
                        links={[
                            { label: "Home", path: "/home-gestor" },
                            { label: "Comunicados", path: "/home-gestor/Comunicados" },
                            { label: "Professores", path: "/home-gestor/Professores" },
                        ]} />

                    <div className="  ml-20 mt-32">
                        <h2 className="text-2xl font-bold mb-4 text-left ">
                            Olá, Gestor(a) <span className="text-[#EB8317]">{nomeDoGestor}</span>
                        </h2>
                        <div className="lg:items-start items-center flex gap-5 flex-col lg:flex-row">
                            <div className="mt-12">
                                <Escala />
                            </div>
                            <div className="mt-16">
                                <CalendarioCompromissos/>
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