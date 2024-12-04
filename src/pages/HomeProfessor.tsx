import * as React from "react"
import HeaderBasic from "../components/navigation/HeaderBasic"

import { VisualizarAtendimentos, QuantidadeAtendimentos, AtendimentosAnteriores } from "../components/Atendimentos-professor";
import useNavigateTo from "../hooks/useNavigateTo";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import FooterMobile from "../components/navigation/FooterMobile";
import {
    SidebarInset,
    SidebarProvider,
} from "../components/ui/sidebar"



export function useMediaQuerie() {
    const customBreakpoint = 854
    const [isMobile, setIsmobile] = React.useState<boolean | undefined>(undefined)
    React.useEffect(() => {
        const media = window.matchMedia(`(max-width:${customBreakpoint - 1}px)`)
        const onChange = () => {
            setIsmobile(window.innerWidth < customBreakpoint)
        }
        media.addEventListener('change', onChange)
        setIsmobile(window.innerWidth < customBreakpoint)
        return () => { media.removeEventListener('change', onChange) }
    })
    return !!isMobile

}

const HomeProfessor: React.FC = () => {
    const isMobile = useMediaQuerie()
    const GoTo = useNavigateTo();
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
                        type="usuario"
                        user={user}
                        links={[
                            { label: "Home", path: "/home-professor" },
                            { label: "Chamada", path: "/home-professor/chamada" },
                            { label: "Atletas", path: "/home-professor/lista-atletas" },
                        ]}

                    />

                    <div className="max-w-7xl pb-24 ml-24 mr-10 mt-14 ">

                        <h1 className="text-2xl font-bold">
                            Olá, Professor(a) <span className="text-orange-500">Moisés</span>
                        </h1>

                        {isMobile ? (
                            <div className="mt-4 flex flex-col mr-6 items-center gap-8">
                                <VisualizarAtendimentos />
                                <QuantidadeAtendimentos />
                                <AtendimentosAnteriores />
                            </div>
                        ) : (
                            <div className="mt-4 grid grid-cols-2 mr-6 gap-14 space-x-10">
                                <div className="flex flex-col">
                                    <VisualizarAtendimentos />
                                    <QuantidadeAtendimentos />
                                </div>
                                <AtendimentosAnteriores />
                            </div>
                        )}
                    </div>
                    <FooterMobile />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default HomeProfessor;
