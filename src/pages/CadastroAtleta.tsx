import React, { useState } from "react";
import MultipartForm from "../components/MultipartForm";
import { Athlete } from "@/types/Athlete";

const CadastroAtleta: React.FC = () => {
  const [athlete, setAthlete] = useState<Athlete>({
    name: "",
    cpf: "",
    rg: "",
    address: "",
    fatherName: "",
    motherName: "",
    birthDate: "",
    phoneNumber: "",
    password: "",
    email: "",
    responsibleName: "",
    responsibleEmail: "",
    motherPhoneNumber: "",
    fatherPhoneNumber: "",
    bloodType: "",
    frontIdPhotoUrl: "",
    backIdPhotoUrl: "",
    athletePhotoUrl: "",
    foodAllergies: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({
    name: "",
    email: "",
    password: "",
  });

  const formatInputValue = (name: string, value: string): string => {
    let formattedValue = value.replace(/\D/g, ""); // Remove caracteres não numéricos
  
    if (name === "cpf") {
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const formattedValue = formatInputValue(name, value);
    setAthlete((prevState) => ({ ...prevState, [name]: formattedValue }));
  };

  const handleSubmit = () => {
    console.log("Athlete Data:", athlete);
    // Enviar para a API
  };

  const steps = [
    {
      step: 1,
      title: "Dados Pessoais",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-6">Dados Pessoais</h2>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Nome</label>
            <input
              type="text"
              name="name"
              value={athlete.name}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Insira seu nome completo"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">CPF</label>
            <input
              type="text"
              name="cpf"
              value={athlete.cpf}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Insira seu CPF"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">RG</label>
            <input
              type="text"
              name="rg"
              value={athlete.rg}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Insira seu RG"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Telefone</label>
            <input
              type="text"
              name="phoneNumber"
              value={athlete.phoneNumber}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Endereço</label>
            <input
              type="text"
              name="address"
              value={athlete.address}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Insira seu endereço"
            />
          </div>
        </div>
      ),
    },
    {
      step: 2,
      title: "Credenciais",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Credenciais</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={athlete.email}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Insira seu e-mail"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              name="password"
              value={athlete.password}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Crie uma senha"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: "Informações Adicionais",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Informações Médicas</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium">Data de Nascimento</label>
            <input
              type="date"
              name="birthDate"
              value={athlete.birthDate}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Insira sua data de nascimento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo Sanguíneo
            </label>
            <select
              name="bloodType"
              value={athlete.bloodType}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
            >
              <option value="">Selecione...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <br />
          <div className="mb-4">
            <label className="block text-sm font-medium">Alergias Alimentares</label>
            <input
              type="text"
              name="foodAllergies"
              value={athlete.foodAllergies}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Informe suas alergias alimentares"
            />
          </div>
        </div>
      ),
    },
    {
      step: 4,
      title: "Informações Familiares",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Informações Familiares</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nome do Pai</label>
            <input
              type="text"
              name="fatherName"
              value={athlete.fatherName}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Nome completo do pai"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nome da Mãe</label>
            <input
              type="text"
              name="motherName"
              value={athlete.motherName}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Nome completo da mãe"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Telefone da Mãe</label>
            <input
              type="text"
              name="motherPhoneNumber"
              value={athlete.motherPhoneNumber}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Telefone do Pai</label>
            <input
              type="text"
              name="fatherPhoneNumber"
              value={athlete.fatherPhoneNumber}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: "Fotos",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Fotos</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium">Foto de Frente do RG</label>
            <input
              type="file"
              name="frontIdPhotoUrl"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Foto de Verso do RG</label>
            <input
              type="file"
              name="backIdPhotoUrl"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Foto do Atleta</label>
            <input
              type="file"
              name="athletePhotoUrl"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
        </div>
      ),
    },
  ];

  return <>
    <div className="mb-6 mt-6">
      <h1 className="w-full m-auto text-center">
        <span className="font-jockey text-xl mr-2">ESPORTE NA CIDADE</span>
      </h1>
    </div>
    <MultipartForm steps={steps} onSubmit={handleSubmit} />
  </>;
};

export default CadastroAtleta;
