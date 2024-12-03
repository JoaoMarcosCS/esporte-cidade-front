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
      <h2 className="font-bold text-3xl mb-10">Professores Cadastrados</h2>
      <div className="border border-black pb-36 bg-[#D9D9D9]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="px-10 py-6 text-lg font-bold">Nome</th>
              <th className="px-10 py-6 text-lg font-bold">Modalidade</th>
              <th className="px-10 py-6 text-lg font-bold">Email</th>
              <th className="px-10 py-6 text-lg font-bold">Telefone</th>
              <th className="px-10 py-6 text-lg font-bold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {professores.map((professor) => {
              return (
                <tr key={professor.id}>
                  <td className="px-10">{professor.name}</td>
                  <td className="px-10">{professor.modality != null && professor.modality.name}</td>
                  <td className="px-10">{professor.email}</td>
                  <th className="px-10">{professor.phone}</th>
                  <td className="px-10 space-x-2">
                    <button onClick={() => onEdit(professor)} className="w-7">
                      <img src="/icon/pencil.svg" alt="pencil_icon_for_editing" className="w-full" />
                    </button>
                    <button onClick={() => onDelete(professor.id)} className="w-7">
                      <img src="/icon/trash.svg" alt="trash_icon_for_deletion" className="w-full" />
                    </button>
                  </td>
                </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessoresCadastrados;
