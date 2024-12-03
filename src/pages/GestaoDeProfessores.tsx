import React, { useEffect, useState } from "react";
import { Professor } from "@/types/Professor";
import ProfessoresCadastrados from "../components/ProfessoresCadastrados";
import FormularioProfessores from "../components/FormularioProfessores";
import { getProfessores, saveProfessor, deleteProfessor } from "../services/professorService";

const GestaoDeProfessor: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [professorEdicao, setProfessorEdicao] = useState<Professor | null>(null);

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

  const handleAddOrEdit = async (professor: Professor): Promise<void> => {
    try {
      await saveProfessor(professor);
      await fetchProfessores();
      setProfessorEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
    }
  };


  const handleDelete = async (id: number) => {
    try {
      await deleteProfessor(id);
      await fetchProfessores(); // Atualiza a lista de professores após exclusão
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FF] px-52 py-6">

      <main className="space-y-8 mt-6">
        <section>
          <ProfessoresCadastrados
            professores={professores}
            onEdit={(prof) => setProfessorEdicao(prof)}
            onDelete={handleDelete}
          />
        </section>

        <section>
          <FormularioProfessores
            professorEdicao={professorEdicao}
            onSubmit={handleAddOrEdit}
            onCancelEdit={() => setProfessorEdicao(null)}
          />
        </section>
      </main>
    </div>
  );
};

export default GestaoDeProfessor;
