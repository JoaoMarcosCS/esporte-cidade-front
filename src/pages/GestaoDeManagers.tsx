import React, { useEffect, useRef, useState } from "react";
import { Manager } from "@/types/Manager";
import ManagersCadastrados from "../components/ManagersCadastrados";
import FormularioManagers from "../components/FormularioManagers";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import { getManagers, saveManager, deleteManager } from "../services/managerService";

const GestaoDeManagers: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchManagers = async () => {
    try {
      const data = await getManagers();
      setManagers(data);
    } catch (error) {
      console.error("Erro ao buscar gerentes:", error);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleAddOrEdit = async (manager: Manager) => {
    try {
      await saveManager(manager);
      await fetchManagers();
      setSelectedManager(null);
    } catch (error) {
      console.error("Erro ao salvar gerente:", error);
    }
  };

  const handleEditClick = (manager: Manager) => {
    setSelectedManager(manager);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id: string | null) => {
    try {
      if (!id) return;
      await deleteManager(Number(id));
      setManagers(prev => prev.filter(m => Number(m.id) !== Number(id)));
    } catch (error) {
      console.error('Erro ao deletar gerente:', error);
    }
  };

  return (
    <section className="bg-[#F4F6FF] pb-20">
      <HeaderBasic
        type="visitante"
        links={[
          { label: "Home", path: "/home-gestor" },
          { label: "Comunicados", path: "/home-gestor/cadastrar-comunicado" }, 
          { label: "Modalidades", path: "/home-gestor/cadastrar-modalidade" },
          { label: "Relatório Geral", path: "/home-gestor/relatorio-geral" },
          
        ]}
      />

      <FooterMobile />

      <div className="min-h-screen xl:px-36 md:px-11 px-5 py-6">
        <main className="space-y-8 mt-6">
          <section>
            <ManagersCadastrados
              managers={managers}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              managerEdicao={selectedManager}
            />
          </section>

          <section>
            <FormularioManagers
              ref={formRef}
              managerEdicao={selectedManager}
              onSubmit={handleAddOrEdit}
              onCancelEdit={() => setSelectedManager(null)}
            />
          </section>
        </main>
      </div>
    </section>
  );
};

export default GestaoDeManagers;
