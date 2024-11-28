import React, { useEffect, useState } from "react";
import { Professor } from "@/types/Professor";

interface Props {
  professorEdicao?: Professor | null; // Dados do professor sendo editado
  onSubmit: (professor: Professor) => Promise<void>; // Callback para salvar (edição ou criação)
  onCancelEdit: () => void; // Callback para cancelar edição
}

const FormularioProfessores: React.FC<Props> = ({ professorEdicao, onSubmit, onCancelEdit }) => {
  const [formData, setFormData] = useState<Professor>({
    id: 0,
    nome: "",
    dataNascimento: "",
    endereco: "",
    telefone: "",
    modalidade: "",
    cpf: "",
    email: "",
  });

  // Preenche o formulário caso seja um professor em edição
  useEffect(() => {
    if (professorEdicao) {
      setFormData(professorEdicao);
    }
  }, [professorEdicao]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData); // Envia os dados ao pai
    setFormData({
      id: 0,
      nome: "",
      dataNascimento: "",
      endereco: "",
      telefone: "",
      modalidade: "",
      cpf: "",
      email: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">{professorEdicao ? "Editar Professor" : "Cadastrar Professor"}</h2>
      <input
        type="text"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        placeholder="Nome completo"
        className="border p-2 w-full"
        required
      />
      <input
        type="date"
        name="dataNascimento"
        value={formData.dataNascimento}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="endereco"
        value={formData.endereco}
        onChange={handleChange}
        placeholder="Endereço"
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="telefone"
        value={formData.telefone}
        onChange={handleChange}
        placeholder="Telefone"
        className="border p-2 w-full"
        required
      />
      <select
        name="modalidade"
        value={formData.modalidade}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Selecione a modalidade</option>
        <option value="Atletismo">Atletismo</option>
        <option value="Futebol">Futebol</option>
        <option value="Basquete">Basquete</option>
      </select>
      <input
        type="text"
        name="cpf"
        value={formData.cpf}
        onChange={handleChange}
        placeholder="CPF"
        className="border p-2 w-full"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full"
        required
      />
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {professorEdicao ? "Salvar Alterações" : "Cadastrar"}
        </button>
        {professorEdicao && (
          <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={onCancelEdit}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormularioProfessores;
