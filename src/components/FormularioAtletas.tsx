import React, { useEffect, useState } from "react";
import axios from "axios";
import { Athlete } from "../types/Athlete";

interface FormularioAtletasProps {
  athlete?: Athlete | null;
  onSubmit: (athlete: Athlete) => void;
  onCancel: () => void;
}

const emptyForm = {
  name: "", cpf: "", rg: "", birthday: "", phone: "",
  email: "", password: "", bloodType: "", foodAllergies: "",
  fatherName: "", motherName: "", fatherPhoneNumber: "", motherPhoneNumber: "",
  estado: "", cidade: "", bairro: "", rua: "", numeroDaCasa: "",
  complemento: "", referencia: "", cep: "",
  frontIdPhotoUrl: "", backIdPhotoUrl: "", athletePhotoUrl: ""
};

const FormularioAtletas: React.FC<FormularioAtletasProps> = ({ athlete, onSubmit, onCancel }) => {
  const [form, setForm] = useState<any>(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const isEditing = !!athlete;
  useEffect(() => {
    if (athlete) {
      console.log('[EDIT] Iniciando edição do atleta:', athlete);
      setForm({ ...emptyForm, ...athlete, password: "" }); // Limpa o campo senha!
      setEditMode(false); // Sempre inicia desabilitado ao selecionar atleta
    } else {
      setForm(emptyForm);
      setEditMode(false);
    }
  }, [athlete]);

  // Funções de formatação
  const formatCPF = (value: string) => value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const formatRG = (value: string) => value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1})$/, "$1-$2");

  const formatPhone = (value: string) => value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");

  const formatDate = (value: string) => value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);

  const formatCEP = (value: string) => value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "cpf") formattedValue = formatCPF(value);
    if (name === "rg") formattedValue = formatRG(value);
    if (name === "phone" || name === "fatherPhoneNumber" || name === "motherPhoneNumber") formattedValue = formatPhone(value);
    if (name === "birthday") formattedValue = formatDate(value);
    if (name === "cep") formattedValue = formatCEP(value);
    setForm({ ...form, [name]: formattedValue });

    if (name === "cep" && /^\d{5}-\d{3}$/.test(formattedValue)) {
      fetch(`https://viacep.com.br/ws/${formattedValue.replace(/\D/g, "")}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setForm((f: typeof form) => ({
              ...f,
              estado: data.uf,
              cidade: data.localidade,
              bairro: data.bairro,
              rua: data.logradouro
            }));
          }
        });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profile", file);

    try {
      const response = await fetch("http://localhost:3002/api/uploads/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.profile) {
        setForm((prev: typeof form) => ({ ...prev, [field]: data.profile }));
      }
    } catch {
      console.error("Erro ao fazer upload da imagem.");
    }
  };

  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [genericError, setGenericError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && !editMode) return;
    setEmailError("");
    setSuccessMessage("");
    setGenericError("");
    const payload = {
      ...form,
      cpf: (form.cpf || '').replace(/\D/g, ""),
      rg: (form.rg || '').replace(/\D/g, ""),
      phone: (form.phone || '').replace(/\D/g, ""),
      fatherPhoneNumber: (form.fatherPhoneNumber || '').replace(/\D/g, ""),
      motherPhoneNumber: (form.motherPhoneNumber || '').replace(/\D/g, ""),
      photo_url: form.athletePhotoUrl || '',
      photo_url_cpf_front: form.frontIdPhotoUrl || '',
      photo_url_cpf_back: form.backIdPhotoUrl || ''
    };
    try {
      if (isEditing && athlete?.id) {
        // UPDATE direto igual EditarPerfil
        const url = `http://localhost:3002/api/athletes/${athlete.id}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        console.log('[UPDATE] Resposta do fetch (edição):', response);
        let responseData: any;
        try {
          responseData = await response.clone().json();
        } catch (e) {
          responseData = await response.text();
        }
        console.log('[UPDATE] Conteúdo do response:', responseData);
        if (!response.ok) {
          const errorText = JSON.stringify(responseData);
          console.error('[UPDATE] Erro ao atualizar atleta:', errorText);
          throw new Error('Erro ao atualizar atleta: ' + errorText);
        }
        // Atualiza o formulário/local state com os dados retornados
        if (responseData && typeof responseData === 'object') {
          setForm((prev: typeof form) => ({ ...prev, ...responseData }));
        }
        setSuccessMessage("Edição realizada com sucesso!");
        setEditMode(false);
        onSubmit({ ...payload, id: athlete.id } as Athlete); // Atualiza lista
      } else {
        // Cadastro normal
        const resp = await onSubmit(payload as Athlete);
        console.log('[CREATE] Resposta do onSubmit (cadastro):', resp);
        setSuccessMessage("Cadastro realizado com sucesso!");
      }
      setGenericError("");
      setEmailError("");
    } catch (err: any) {
      console.error('[ERROR] Erro no submit:', err);
      let backendMsg = isEditing ? "Erro ao editar." : "Erro ao cadastrar.";
      if (err.message) {
        backendMsg = err.message;
      }
      setGenericError(backendMsg);
      setSuccessMessage("");
    }
  };




  const handleCancel = () => {
    setForm(emptyForm);
    setEmailError("");
    setSuccessMessage("");
    setGenericError("");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4 bg-[#D9D9D9] border border-black rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Edição de Atleta</h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-2">
          {successMessage}
        </div>
      )}
      {genericError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
          {genericError}
        </div>
      )}

      {(() => {
        // Lista dos campos em ordem
        const fields = [
          { label: "Nome completo", name: "name" },
          { label: "CPF", name: "cpf" },
          { label: "RG", name: "rg" },
          { label: "Data de nascimento", name: "birthday", type: "text" },
          { label: "Telefone", name: "phone" },
          { label: "Email", name: "email", type: "email" },
          { label: "Senha", name: "password", type: "password" },
          { label: "Alergias Alimentares", name: "foodAllergies" },
          { label: "Nome do Pai", name: "fatherName" },
          { label: "Telefone do Pai", name: "fatherPhoneNumber" },
          { label: "Nome da Mãe", name: "motherName" },
          { label: "Telefone da Mãe", name: "motherPhoneNumber" },
          { label: "CEP", name: "cep" },
          { label: "Estado", name: "estado" },
          { label: "Cidade", name: "cidade" },
          { label: "Bairro", name: "bairro" },
          { label: "Rua", name: "rua" },
          { label: "Número", name: "numeroDaCasa" },
          { label: "Complemento", name: "complemento" },
          { label: "Referência", name: "referencia" },
        ];
        // Cria refs para cada campo
        const inputRefs = Array(fields.length).fill(null).map(() => React.createRef<HTMLInputElement>());
        // Renderização dos campos
        return fields.map(({ label, name, type = "text" }, idx) => (
          <div key={name}>
            <label className="block font text-sm mb-1">{label}</label>
            <input
              ref={inputRefs[idx]}
              name={name}
              type={type}
              value={(form as any)[name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-sm bg-gray-100 text-sm"
              maxLength={
                name === "cpf" ? 14 :
                name === "rg" ? 12 :
                name === "cep" ? 9 :
                undefined
              }
              disabled={isEditing && !editMode}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // Vai para o próximo input se não for o último campo
                  if (idx < inputRefs.length - 1) {
                    inputRefs[idx + 1].current?.focus();
                  } else {
                    // Se for o último campo, submete
                    (e.target as HTMLInputElement).form?.requestSubmit();
                  }
                }
              }}
            />
            {name === "email" && emailError && (
              <span className="text-red-500 text-sm">{emailError}</span>
            )}
          </div>
        ));
      })()}


      <div>
        <label className="block font-semibold text-sm mb-1">Tipo Sanguíneo</label>
        <select
          name="bloodType"
          value={form.bloodType}
          onChange={handleChange}
          className="text-sm w-full px-4 py-2 border border-gray-400 rounded-sm bg-gray-100"
          disabled={isEditing && !editMode}
        >
          <option value="">Selecione...</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm">Foto Frente do RG</label>
        <input type="file" disabled={isEditing && !editMode} onChange={(e) => handleImageUpload(e, "frontIdPhotoUrl")} className="text-sm mt-1 p-2 border border-gray-300 rounded" />
      </div>

      <div>
        <label className="block text-sm">Foto Verso do RG</label>
        <input type="file" disabled={isEditing && !editMode} onChange={(e) => handleImageUpload(e, "backIdPhotoUrl")} className="text-sm mt-1 p-2 border border-gray-300 rounded" />
      </div>

      <div>
        <label className="block text-sm">Foto do Atleta</label>
        <input type="file" disabled={isEditing && !editMode} onChange={(e) => handleImageUpload(e, "athletePhotoUrl")} className="text-sm mt-1 p-2 border border-gray-300 rounded" />
      </div>

      {!isEditing && (
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Cadastrar</button>
      )}
      {isEditing && !editMode && (
        <button type="button" className="bg-yellow-600 text-white px-4 py-2 rounded mr-2" onClick={() => setEditMode(true)}>Editar</button>
      )}
      {isEditing && editMode && (
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">Salvar</button>
      )}
      <button type="button" onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded">Cancelar</button>
    </form>
  );
};

export default FormularioAtletas;
