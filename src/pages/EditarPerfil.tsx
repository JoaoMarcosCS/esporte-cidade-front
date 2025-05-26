import React, { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import useNavigateTo from "../hooks/useNavigateTo";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import ModuloConfirmacao from "../components/ModuloConfirmacao";

const athleteSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
    photo: z.string().optional(),
    cep: z.string().optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "Confirmação de senha deve ter pelo menos 6 caracteres"),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const EditarPerfil: React.FC = () => {
  const { user } = useAuth();
  const GoTo = useNavigateTo();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(athleteSchema),
  });

  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/athletes/${user?.id}`);
        const athleteData = response.data;

        console.log("Dados recebidos do servidor:", athleteData); // Debug log

        const { password, confirmPassword, ...otherData } = athleteData;

        // Mapear os campos retornados pela API para os campos do formulário
        const fieldMapping = {
          name: otherData.name,
          email: otherData.email,
          phone: otherData.phone,
          photo: otherData.photo_url || "", // Mapeando photo_url para o campo photo
          cep: otherData.cep || "", // Adicione um valor padrão se o campo não existir
          street: otherData.street || "",
          neighborhood: otherData.neighborhood || "",
          city: otherData.city || "",
          cpf: otherData.cpf || "",
          rg: otherData.rg || "",
        };

        Object.entries(fieldMapping).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setValue(key as keyof FieldValues, value);
          } else {
            console.warn(`Campo ausente ou nulo: ${key}`); // Warn about missing fields
          }
        });
      } catch (error) {
        console.error("Erro ao buscar dados do atleta:", error);
        toast.error("Erro ao carregar dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchAthleteData();
    }
  }, [user?.id, setValue]);

  const handleSave = () => setIsModalOpen(true);
  const handleCancel = () => setIsEditing(false);
  const handleConfirm = async () => {
    try {
      setLoading(true);
      const formData = getValues();

      const payload = {
        ...formData,
        password: formData.password?.trim() || undefined,
        confirmPassword: formData.confirmPassword?.trim() || undefined,
      };

      await api.put(`/athletes/${user?.id}`, payload);
      toast.success("Perfil atualizado com sucesso!");
      setIsModalOpen(false);
      setIsEditing(false);
      GoTo("/home-atleta");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <>
      <HeaderBasic
        links={[
          { label: "Home", path: "/home-atleta" },
          { label: "Faltas", path: "/home-atleta/faltas-atleta" },
          { label: "Modalidades", path: "/home-atleta/modalidade" },
        ]}
      />
      <Toaster />
      <div className="p-6 bg-[#F4F6FF] min-h-screen">
        <h1 className="text-xl text-center font-bold mb-6">Editar Perfil</h1>
        <div className="space-y-4 max-w-lg mx-auto">
          <form onSubmit={handleSubmit(handleConfirm)} >
            <div>
              <label className="block text-gray-700 mt-1">Foto</label>
              {getValues("photo") && (
                <img src={getValues("photo")}
                     alt="Pré-visualização"
                     className="mt-2 rounded w-32 h-32 object-cover border"
                />
              )}
              <input
                type="file"
                id="photo"
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${!isEditing ? "bg-gray-100 text-gray-500" : ""}`}
                onChange={async (e) => {
                  if (!isEditing) return;
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("profile", file);
                  try {
                    const response = await fetch("http://localhost:3002/uploads/upload", {
                      method: "POST",
                      body: formData,
                    });
                    const data = await response.json();
                    if (data.profile) {
                      setValue("photo", data.profile);
                      toast.success("Imagem de perfil atualizada!");
                    } else {
                      toast.error("Falha ao processar imagem.");
                    }
                  } catch (err) {
                    toast.error("Erro ao fazer upload da imagem.");
                  }
                }}
              />
              
            </div>
            <div>
              <label className="block text-gray-700 mt-1">Nome</label>
              <input
                type="text"
                id="name"
                {...register("name")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mt-1">E-mail</label>
              <input
                type="email"
                id="email"
                {...register("email")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mt-1">Telefone</label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message as string}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mt-1">CEP</label>
              <input
                type="text"
                id="cep"
                {...register("cep")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.cep && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cep.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mt-1">Rua</label>
              <input
                type="text"
                id="street"
                {...register("street")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.street && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.street.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mt-1">Bairro</label>
              <input
                type="text"
                id="neighborhood"
                {...register("neighborhood")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.neighborhood && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.neighborhood.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mt-1">Cidade</label>
              <input
                type="text"
                id="city"
                {...register("city")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mt-1">Nova Senha</label>
              <input
                type="password"
                id="password"
                {...register("password")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mt-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                  !isEditing ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>
            <div className="flex justify-between mt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-[#10375C] text-white py-2 px-4 rounded-md shadow-sm hover:scale-105 transition-transform border border-black"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-[#EB8317] transition-transform border border-black"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#EB8317] text-black py-2 px-4 rounded-md hover:scale-105 transition-transform border border-black"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <FooterMobile />
      <ModuloConfirmacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        message="Você tem certeza que deseja gravar as alterações?"
      />
    </>
  );
};

export default EditarPerfil;
