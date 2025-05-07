import React, { useState } from "react";
import HeaderBasic from "../components/navigation/HeaderBasic";
import ModuloConfirmacao from "../components/ModuloConfirmacao";
import FooterMobile from "../components/navigation/FooterMobile";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const EditarPerfil: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirm = () => {
    console.log("Alterações salvas:", profile);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    handleOpenModal();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const user = {
    name: "",
    profilePicture: "",
  };

  return (
    <>
      <HeaderBasic 
          user={user}
          links={[
            { label: "Home", path: "/home-atleta" },
            { label: "Faltas", path: "/home-atleta/faltas-atleta" },
            { label: "Modalidades", path: "/home-atleta/modalidade" }
          ]}
          
      />
      <div className="p-6 bg-[#F4F6FF] min-h-screen">
        <h1 className="text-xl text-center font-bold mb-6">Editar Perfil</h1>

        <div className="space-y-4 max-w-lg mx-auto">
          <div>
            <label className="block text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border border-2 ${
                isEditing ? "border-black" : "border-black text-gray-400"
              } rounded-md bg-white`}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border border-2 ${
                isEditing ? "border-black" : "border-black text-gray-400"
              } rounded-md bg-white`}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border border-2 ${
                isEditing ? "border-black" : "border-black text-gray-400"
              } rounded-md bg-white`}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Nova Senha</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Deixe em branco para não alterar"
              className={`w-full p-2 border border-2 ${
                isEditing ? "border-black" : "border-black text-gray-400"
              } rounded-md bg-white`}
            />
          </div>

          <div className="flex justify-between mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-[#10375C] text-white py-2 px-4 rounded-md shadow-sm shadow-slate-500 text-black hover:scale-105 transition-transform flex items-center justify-center border border-black"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md shadow-sm shadow-slate-500 text-black hover:scale-105 hover:bg-[#EB8317] transition-transform flex items-center justify-center border border-black"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#EB8317] text-black py-2 px-4 rounded-md shadow-sm text-black hover:scale-105 hover:bg-[#EB8317] transition-transform flex items-center justify-center border border-black"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>
      <FooterMobile />
      {/* Modal de Confirmação */}
      <ModuloConfirmacao
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        message="Você tem certeza que deseja gravar as alterações?"
      />
    </>
  );
};

export default EditarPerfil;
