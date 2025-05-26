import React, { useEffect, useRef, useState } from "react";
import { Professor } from "@/types/Professor";
import ProfessoresCadastrados from "../components/ProfessoresCadastrados";
import FormularioProfessores from "../components/FormularioProfessores";
import { getProfessores, saveProfessor, deleteProfessor } from "../services/professorService";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/navigation/AppSidebar-prof";

const GestaoDeProfessor: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const formularioRef = useRef<HTMLFormElement>(null);

  const fetchProfessores = async () => {
    try {
      const data = await getProfessores();
      setProfessores(data);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  const handleAddOrEdit = async (professor: Professor) => {
    try {
      await saveProfessor(professor);
      await fetchProfessores();
      setSelectedProfessor(null);
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
    }
  };

  const handleEditClick = (professor: Professor) => {
    professor.password = "";
    setSelectedProfessor(professor);
    formularioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProfessor(Number(id));
      setProfessores(prev => prev.filter(prof => prof.id === id));
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
    }
  };

  return (

    <SidebarProvider>
      <AppSidebar type="gestor" />
      <SidebarInset>
        <section className="bg-[#F4F6FF] pb-20">
          <HeaderBasic
            type="usuario"
            links={[
              { label: "Home", path: "/home-gestor" },
              { label: "Comunicados", path: "/home-gestor/cadastrar-comunicado" },
              { label: "Professores", path: "/home-gestor/cadastrar-professor" },
              { label: "modalidades", path: "/home-gestor/cadastrar-modalidade" },
            ]}
          />

          <FooterMobile />

          <div className="min-h-screen xl:px-36 md:px-11 px-5 py-6">
            <main className="space-y-8 mt-6">
              <section>
                <ProfessoresCadastrados
                  professores={professores}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  professorEdicao={selectedProfessor}
                />
              </section>

              <section>
                <FormularioProfessores
                  ref={formularioRef}
                  professorEdicao={selectedProfessor}
                  onSubmit={handleAddOrEdit}
                  onCancelEdit={() => setSelectedProfessor(null)}
                />
              </section>
            </main>
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider >
  );
};

export default GestaoDeProfessor;
