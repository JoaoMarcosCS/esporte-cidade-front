import React from "react";
import { Professor } from "@/types/Professor";

interface Props {
  professores: Professor[];
  professorEdicao: Professor | null;
  onEdit: (professor: Professor) => void;
  onDelete: (id: number) => void;
}

const ProfessoresCadastrados: React.FC<Props> = ({ professores, professorEdicao, onEdit, onDelete }) => {
  
  return (
    <div>
      <h2 className="font-bold text-3xl mb-10">Professores Cadastrados</h2>
      <div className="border border-black md:pb-36 bg-[#D9D9D9]">
        {/* Adicionando rolagem horizontal para telas pequenas */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[600px]">
            <thead>
              <tr>
                <th className="px-4 py-3 text-lg font-bold">Nome</th>
                <th className="px-4 py-3 text-lg font-bold">Modalidade</th>
                <th className="px-4 py-3 text-lg font-bold">Email</th>
                <th className="px-4 py-3 text-lg font-bold">Telefone</th>
                <th className="px-4 py-3 text-lg font-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {professores.map((professor) => (
                <tr key={professor.id} className="border-t border-gray-300">
                  <td className="px-4 py-3">{professor.name}</td>
                  <td className="px-4 py-3">
                    {professor.modality != null && professor.modality.name}
                  </td>
                  <td className="px-4 py-3">{professor.email}</td>
                  <td className="px-4 py-3">{professor.phone}</td>
                  <td className="px-4 py-3 space-x-2 flex">
                    <button onClick={() => onEdit(professor)} className="w-7">
                      <img
                        src="/icon/pencil.svg"
                        alt="Editar"
                        className="w-full"
                      />
                    </button>
                    <button onClick={() => onDelete(professor.id)} className={`w-7 ${professorEdicao?.id === professor.id && "opacity-35"}`} disabled={professorEdicao?.id === professor.id}>
                      <img
                        src="/icon/trash.svg"
                        alt="Deletar"
                        className="w-full"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfessoresCadastrados;
