import React, { useState } from "react";
import MultipartForm from "../components/MultipartForm";
import { Athlete } from "@/types/Athlete";
import axios from "axios";
import { useFileUpload } from "../hooks/useFileConvert";
import { Navigate } from "react-router-dom";
import useNavigateTo from "../hooks/useNavigateTo";
import { useNavigate } from 'react-router-dom';


const CadastroAtleta: React.FC = () => {
  const { convertFile } = useFileUpload();
  const GoTo = useNavigateTo();
  const [athlete, setAthlete] = useState<Athlete>({
    name: "",
    cpf: "",
    rg: "",
    phone: "",
    address: "",
    fatherName: "",
    motherName: "",
    birthday: "",
    phoneNumber: "",
    password: "",
    email: "",
    responsibleName: "",
    responsibleEmail: "",
    motherPhoneNumber: "",
    fatherPhoneNumber: "",
    bloodType: "",
    frontIdPhotoUrl: null,
    backIdPhotoUrl: null,
    athletePhotoUrl: null,
    foodAllergies: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numeroDaCasa: "",
    complemento: "",
    referencia: "",

  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string, numeroDaCasa?: string, cep?: string, cpf?: string }>({
    name: "",
    email: "",
    password: "",
    numeroDaCasa: "",
    cep: "",
    cpf: ""
  });

  const [isValidating, setIsValidating] = useState(false);
  const [cpfValidationError, setCpfValidationError] = useState("");

  //controlador do formulario
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = async () => {
    setIsValidating(true);
    try {
      const isCpfValid = await validateCpf(athlete.cpf);
      if (!isCpfValid) {
        setIsValidating(false);
        return;
      }
      setCurrentStep((prev) => prev + 1);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  //formatar inputs

  const formatInputValue = (name: string, value: string): string => {
    let formattedValue = value;

    if (["cpf", "rg", "phone", "motherPhoneNumber", "fatherPhoneNumber", "CEP"].includes(name)) {
      formattedValue = value.replace(/\D/g, "");

    }

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
    } else if (name === "phone" || name === "motherPhoneNumber" || name === "fatherPhoneNumber") {
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
    else if (name === "motherPhoneNumber") {
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
    else if (name === "fatherPhoneNumber") {
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

  //para limpar a formatação para enviar para o banco
  const cleanInput = (value: string) => {
    return value.replace(/[^\w\s]/gi, "").replace(/\s/g, "");
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    //formatação de valores
    if (files && files.length > 0) {
      setAthlete((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      const rawValue = value.replace(/\D/g, ""); // só números
      const formattedValue = formatInputValue(name, value);
      setAthlete((prevState) => ({ ...prevState, [name]: formattedValue }));
    }

    if (name === "cpf") {
      const cleanedCpf = value.replace(/\D/g, "");
      if (cleanedCpf.length === 11) {
        await validateCpf(value);
      } else {
        setCpfValidationError(cleanedCpf.length > 0 ? "CPF deve ter 11 dígitos" : "");
      }
    }


    //validação de cep
    if (name === "CEP" && /^\d{8}$/.test(value)) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();

        if (data.erro) {
          console.error("CEP inválido.");
          setErrors((prev) => ({ ...prev, cep: "CEP inválido" }));
          return;
        }
        setErrors((prev) => ({ ...prev, cep: "" }));

        setAthlete((prevState) => ({
          ...prevState,
          estado: data.uf || "",
          cidade: data.localidade || "",
          bairro: data.bairro || "",
          rua: data.logradouro || "",
        }));
      } catch (error) {
        setErrors((prev) => ({ ...prev, cep: "Erro ao buscar o CEP" }));
        console.error("Erro ao buscar endereço:", error);
      }
    }
  };

  //validação de cpf
  const validateCpf = async (cpf: string): Promise<boolean> => {
    const cleanedCpf = cpf.replace(/\D/g, "");

    // Client-side validation first
    if (cleanedCpf.length !== 11) {
      setCpfValidationError("CPF deve ter 11 dígitos");
      return false;
    }

    // Check for obvious invalid patterns (all same digits)
    if (/^(\d)\1{10}$/.test(cleanedCpf)) {
      setCpfValidationError("CPF inválido");
      return false;
    }

    try {
      const response = await axios.post("http://localhost:3002/api/validate-cpf", {
        cpf: cleanedCpf
      });

      if (response.data.valid) {
        setCpfValidationError("");
        return true;
      } else {
        setCpfValidationError(response.data.message);
        return false;
      }

    } catch (error) {
      // Handle network errors differently from validation errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          setCpfValidationError(error.response.data.message || "Erro na validação");
        } else {
          // Network error
          setCpfValidationError("Erro de conexão. Verifique sua internet.");
        }
      } else {
        setCpfValidationError("Erro desconhecido ao validar CPF");
      }
      return false;
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async () => {
    const frontBase64 = await convertFile(athlete.frontIdPhotoUrl);
    const backBase64 = await convertFile(athlete.backIdPhotoUrl);
    const photoBase64 = await convertFile(athlete.athletePhotoUrl);

    const cleanedAthlete = {
      ...athlete,
      cpf: athlete.cpf.replace(/\D/g, ""),
      rg: athlete.rg.replace(/\D/g, ""),
      phone: athlete.phone.replace(/\D/g, ""),
      fatherPhoneNumber: athlete.fatherPhoneNumber?.replace(/\D/g, ""),
      motherPhoneNumber: athlete.motherPhoneNumber?.replace(/\D/g, ""),
      phoneNumber: athlete.phoneNumber?.replace(/\D/g, ""),

      athletePhotoUrl: photoBase64 || undefined,
      frontIdPhotoUrl: frontBase64 || undefined,
      backIdPhotoUrl: backBase64 || undefined,


    };

    console.log("Athlete Data (clean):", cleanedAthlete);

    try {
      const response = await axios.post("http://localhost:3002/api/register", cleanedAthlete, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Cadastro realizado:", response.data);
      navigate("/redirecting", { replace: true });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
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
              onBlur={() => validateCpf(athlete.cpf)}
              className={`px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border rounded-sm ${cpfValidationError ? "border-red-500" : "border-black"
                }`}
              placeholder="Insira seu CPF"
              disabled={isValidating}
            />
            {cpfValidationError && (
              <p className="text-red-500 text-sm mt-1">{cpfValidationError}</p>
            )}
            {isValidating && (
              <p className="text-blue-500 text-sm mt-1">Validando CPF...</p>
            )}
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
              name="phone"
              value={athlete.phone}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>
        </div>
      ),
    },
    //============================Endereço======================= 
    {
      step: 2,
      title: "Endereço",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Endereço</h2>
          <div className="mb-4 relative">
            <label className="font-semibold block text-sm">CEP</label>
            <div className="relative">
              <input
                type="text"
                name="CEP"
                maxLength={8}
                onChange={handleChange}
                className={`px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border ${errors.cep ? "border-red-500" : "border-black"
                  } rounded-sm pr-10`}
                placeholder="Insira seu CEP"
              />
              {errors.cep && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 font-bold text-lg">
                  ✖
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="font-semibold block text-sm">Estado</label>
            <input
              type="estado"
              name="estado"
              value={athlete.estado}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Cidade"
            />

          </div>

          <div className="mb-4">
            <label className="font-semibold block text-sm">Cidade</label>
            <input
              type="cidade"
              name="cidade"
              value={athlete.cidade}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="cidade"
            />

          </div>

          <div className="mb-4">
            <label className="font-semibold block text-sm">Bairro</label>
            <input
              type="bairro"
              name="bairro"
              value={athlete.bairro}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="bairro"
            />

          </div>

          <div className="mb-4">
            <label className="font-semibold block text-sm">Rua</label>
            <input
              type="rua"
              name="rua"
              value={athlete.rua}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="rua"
            />

          </div>

          <div className="mb-4">
            <label className="font-semibold block text-sm">Numero Da Casa</label>
            <input
              type="numeroDaCasa"
              name="numeroDaCasa"
              value={athlete.numeroDaCasa}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="numeroDaCasa"
            />
            {errors.numeroDaCasa && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>


          <div className="mb-4">
            <label className="font-semibold block text-sm">Complemento</label>
            <input
              type="complemento"
              name="complemento"
              value={athlete.complemento}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="complemento"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold block text-sm">Referência</label>
            <input
              type="referencia"
              name="referencia"
              value={athlete.referencia}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="referencia"
            />
          </div>

        </div>
      ),
    },
    {
      step: 3,
      title: "Credenciais",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Credenciais</h2>
          <div className="mb-4">
            <label className="font-semibold block text-sm">Email</label>
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
            <label className="font-semibold block text-sm">Senha</label>
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
      step: 4,
      title: "Informações Adicionais",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Informações Médicas</h2>
          <div className="mb-4">
            <label className="font-semibold block text-sm">Data de Nascimento</label>
            <input
              type="date"
              name="birthday"
              value={athlete.birthday}
              onChange={handleChange}
              className="px-4 py-3 bg-[#d9d9d9] mt-1 block w-full border border-black rounded-sm"
              placeholder="Insira sua data de nascimento"
            />
          </div>
          <div>
            <label className="font-semibold block text-sm text-gray-700">
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
            <label className="font-semibold block text-sm">Alergias Alimentares</label>
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
      step: 5,
      title: "Informações Familiares",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Informações Familiares</h2>
          <div className="mb-4">
            <label className="font-semibold block text-sm">Nome do Pai</label>
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
            <label className="font-semibold block text-sm">Nome da Mãe</label>
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
            <label className="font-semibold block text-sm">Telefone da Mãe</label>
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
            <label className="font-semibold block text-sm">Telefone do Pai</label>
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
      step: 6,
      title: "Fotos",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Fotos</h2>
          <div className="mb-4">
            <label className="font-semibold block text-sm">Foto de Frente do RG</label>
            <input
              type="file"
              name="frontIdPhotoUrl"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold block text-sm">Foto de Verso do RG</label>
            <input
              type="file"
              name="backIdPhotoUrl"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold block text-sm">Foto do Atleta</label>
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
    <MultipartForm
      steps={steps}
      onSubmit={handleSubmit}
      onNext={handleNext}
      onPrevious={handlePrevious}
      currentStep={currentStep}
    />
  </>;
};

export default CadastroAtleta;
