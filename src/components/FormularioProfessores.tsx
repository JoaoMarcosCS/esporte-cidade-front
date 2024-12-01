import React, { useEffect, useState } from "react";
import { Professor } from "@/types/Professor";
import { Modality } from "@/types/Modality";
import { getModalities } from "../services/modalityService";

interface Props {
  professorEdicao?: Professor | null; // Dados do professor sendo editado
  onSubmit: (professor: Professor) => Promise<void>; // Callback para salvar (edição ou criação)
  onCancelEdit: () => void; // Callback para cancelar edição
}

const FormularioProfessores: React.FC<Props> = ({ professorEdicao, onSubmit, onCancelEdit }) => {
  const [formData, setFormData] = useState<Professor>({
    id: 0,
    name: "",
    password: "",
    cpf: "",
    rg: "",
    birthday: "",
    phone: "",
    photo_url: "",
    email: "",
    about: "",
    modality: 0,
  });

  const [modalities, setModalities] = useState<Modality[]>([]);

  useEffect(() => {
    if (professorEdicao) {
      setFormData(professorEdicao);
    }
  }, [professorEdicao]);

  useEffect(() => {
    const fetchModalities = async () => {
      const data = await getModalities();
      setModalities(data);
    };
    fetchModalities();
  }, []);

  const formatInputValue = (name: string, value: string): string => {
    let formattedValue = value; // Remove caracteres não numéricos

    if (name === "cpf") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 3) {
        return formattedValue;
      } else if (formattedValue.length <= 6) {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3)}`;
      } else if (formattedValue.length <= 9) {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3, 6)}.${formattedValue.slice(6)}`;
      } else {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3, 6)}.${formattedValue.slice(6, 9)}-${formattedValue.slice(9, 11)}`;
      }
    } else if (name === "rg") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 2) {
        return formattedValue;
      } else if (formattedValue.length <= 5) {
        formattedValue = `${formattedValue.slice(0, 2)}.${formattedValue.slice(2)}`;
      } else if (formattedValue.length <= 8) {
        formattedValue = `${formattedValue.slice(0, 2)}.${formattedValue.slice(2, 5)}.${formattedValue.slice(5)}`;
      } else {
        formattedValue = `${formattedValue.slice(0, 2)}.${formattedValue.slice(2, 5)}.${formattedValue.slice(5, 8)}-${formattedValue.slice(8, 9)}`;
      }
    } else if (name === "phone") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 2) {
        formattedValue = `(${formattedValue}`;
      } else if (formattedValue.length <= 6) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2)}`;
      } else if (formattedValue.length <= 10) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2, 7)}-${formattedValue.slice(7)}`;
      } else {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2, 7)}-${formattedValue.slice(7, 11)}`;
      }
    }
    return formattedValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const formattedValue = formatInputValue(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "modality" ? Number(value) : formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      id: 0,
      name: "",
      password: "",
      cpf: "",
      rg: "",
      birthday: "",
      phone: "",
      photo_url: "",
      email: "",
      about: "",
      modality: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">{professorEdicao ? "Editar Professor" : "Cadastrar Professor"}</h2>

      {/* Nome */}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome completo"
        className="border p-2 w-full"
        required
      />

      {/* Data de Nascimento */}
      <input
        type="date"
        name="birthday"
        value={formData.birthday}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      {/* Senha */}
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Senha"
        className="border p-2 w-full"
        required
      />

      {/* Telefone */}
      <h2>Telefone</h2>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="(XX) XXXXX-XXXX"
        className="border p-2 w-full"
        required
      />

      {/* Modalidade */}
      <select
        name="modality"
        value={formData.modality}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Selecione a modalidade</option>
        {modalities.map((modality) => (
          <option key={modality.id} value={modality.id}>
            {modality.name}
          </option>
        ))}
      </select>

      {/* CPF */}
      <input
        type="text"
        name="cpf"
        value={formData.cpf}
        onChange={handleChange}
        placeholder="CPF"
        className="border p-2 w-full"
        required
      />

      {/* RG */}
      <input
        type="text"
        name="rg"
        value={formData.rg}
        onChange={handleChange}
        placeholder="RG"
        className="border p-2 w-full"
        required
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full"
        required
      />

      {/* Sobre */}
      <textarea
        name="about"
        value={formData.about}
        onChange={handleChange}
        placeholder="Sobre o professor"
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
