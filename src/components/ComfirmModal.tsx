import React, { useState } from "react";
import Textbox from "./Textbox";
import { confirmPassword } from "../services/auth"; // ajuste o caminho conforme necessário

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ password: '' });
  const type = "manager"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleConfirm = async (e: React.FormEvent) => {
  e.preventDefault(); 
  setLoading(true);
  setError(null);

  try {
    await confirmPassword(formData, type);
    onConfirm();
  } catch (err: any) {
    setError(err.message || "Erro ao confirmar senha");
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-[#d9d9d9] rounded p-6 w-80 shadow-md border border-black">
      <form onSubmit={handleConfirm}>
        <p className="text-center text-black font-bold">{message}</p>

        <Textbox
          value={formData.password}
          onChange={handleChange}
          name="password"
          label="Confirme sua senha"
          placeholder="Digite sua senha"
          type="password"
          required
          disabled={loading}
        />

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <div className="mt-4 flex justify-around">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded text-black border border-black"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#EB8317] px-4 py-2 rounded text-white border border-black"
            disabled={loading}
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};


