import React from "react";
import { Professor } from "@/types/Professor";

interface Props {
  professores: Professor[];
  onEdit: (professor: Professor) => void;
  onDelete: (id: number) => void;
}

const ProfessoresCadastrados: React.FC<Props> = ({ professores, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="text-lg font-bold">Professores Cadastrados</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nome</th>
            <th className="border border-gray-300 px-4 py-2">Modalidade</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {professores.map((professor) => (
            <tr key={professor.id}>
              <td className="border border-gray-300 px-4 py-2">{professor.nome}</td>
              <td className="border border-gray-300 px-4 py-2">{professor.modalidade}</td>
              <td className="border border-gray-300 px-4 py-2">{professor.email}</td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <button onClick={() => onEdit(professor)} className="text-blue-500">
                  Editar
                </button>
                <button onClick={() => onDelete(professor.id)} className="text-red-500">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessoresCadastrados;
