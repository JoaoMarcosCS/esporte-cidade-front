import React, { useEffect, useState } from "react";
import { Professor } from "@/types/Professor";
import ProfessoresCadastrados from "../components/ProfessoresCadastrados";
import FormularioProfessores from "../components/FormularioProfessores";
import { getProfessores, saveProfessor, deleteProfessor } from "../services/professorService";

const GestaoDeProfessor: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [professorEdicao, setProfessorEdicao] = useState<Professor | null>(null);

  useEffect(() => {
    const fetchProfessores = async () => {
      const data = await getProfessores();
      setProfessores(data);
    };

    fetchProfessores();
  }, []);

  const handleAddOrEdit = async (professor: Professor) => {
    try {
      const savedProfessor = await saveProfessor(professor);
      setProfessores((prev) =>
        professor.id === 0 ? [...prev, savedProfessor] : prev.map((p) => (p.id === professor.id ? savedProfessor : p))
      );
      setProfessorEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProfessor(id);
      setProfessores((prev) => prev.filter((prof) => prof.id !== id));
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <header className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-700">Esporte na Cidade</h1>
        <nav className="space-x-4">
          <a href="/" className="text-gray-500 hover:text-gray-700">
            Início
          </a>
          <a href="/comunicados" className="text-gray-500 hover:text-gray-700">
            Comunicados
          </a>
          <a href="/professores" className="text-gray-500 hover:text-gray-700">
            Professores
          </a>
        </nav>
      </header>

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
