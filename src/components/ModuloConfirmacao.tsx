import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ModuloConfirmacao: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#d9d9d9] rounded p-6 w-80 shadow-md border border-black">
        <p className="text-center text-black font-bold">{message}</p>
        <div className="mt-4 flex justify-around">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded text-black border border-black"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#EB8317] px-4 py-2 rounded text-white border border-black"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuloConfirmacao;
