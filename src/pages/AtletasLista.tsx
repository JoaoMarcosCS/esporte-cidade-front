import * as React from "react"
import HeaderBasic from "../components/navigation/HeaderBasic"
import { useIsMobile } from "../hooks/use-mobile";
import useNavigateTo from "../hooks/useNavigateTo";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import { Lista, Contador } from "../components/Lista-atletas";
import { atletas } from '../components/Lista-atletas';
import FooterMobile from "../components/navigation/FooterMobile";
import {
    SidebarInset,
    SidebarProvider,
} from "../components/ui/sidebar"
import AgendaSemanal from "../components/AgendaSemanal";


const AtletasLista: React.FC = () => {
    const GoTo = useNavigateTo()
    const isMobile = useIsMobile();
    const userType = "professor"
    return (
        <SidebarProvider>
            <AppSidebar type="professor" />
            <SidebarInset>
                <div className="min-h-screen pb-24 bg-gray-100">
                    <HeaderBasic
                        type="usuario"
                        links={[
                            { label: "Home", path: "/home-professor" },
                            { label: "Chamada", path: "/home-professor/chamada" },
                            { label: "Atletas", path: "/home-professor/lista-atletas" },
                            { label: "Aprovar Inscrições", path: "/home-professor/aprovar-inscricoes" },
                            { label: "Horário", path: "/home-professor/horario" },
                        ]}
                    />
                    <div className="max-w-7xl pb-5 ml-24 mr-10 mt-12 ">
                        <h1 className="text-2xl font-bold">
                            Alunos Inscritos
                        </h1>

                     
                    </div>
                    <Contador />
                    <div className='pt-8'>
                        <Lista items={atletas} itemsPerPage={10} />
                    </div>
                    <FooterMobile />
                </div>
            </SidebarInset>
            </SidebarProvider>
    );
};

export default AtletasLista;
