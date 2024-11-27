import React from 'react';
import HeaderBasic from "../components/navigation/header-professor"
import Navbar from "../components/navigation/navbar-professor"
import { useIsMobile } from "../hooks/use-mobile";
import useNavigateTo from "../hooks/useNavigateTo";
import { AppSidebar } from '../components/navigation/AppSidebar-prof';
import { Lista, Contador } from "../components/Lista-atletas";
import { atletas } from '../components/Lista-atletas';
import {
    SidebarInset,
    SidebarProvider,
} from "../components/ui/sidebar"

const AtletasLista: React.FC = () => {
    const GoTo = useNavigateTo()
    const isMobile = useIsMobile();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="min-h-screen pb-24 bg-gray-100">
                    <HeaderBasic />
                    <div className="max-w-7xl pb-5 ml-24 mr-10 mt-12 ">
                        <h1 className="text-2xl font-bold">
                            Alunos Inscritos
                        </h1>
                    </div>

                 

                    <Contador />
                    <div className='pt-8'>
                        <Lista items={atletas} itemsPerPage={10}/>
                    </div>
                    <Navbar />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AtletasLista;
