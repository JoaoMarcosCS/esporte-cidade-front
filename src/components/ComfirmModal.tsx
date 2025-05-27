import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
     <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center overflow-hidden">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Deseja excluir esta modalidade?</h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="h-13 font-bold font-inter bg-gray-400 text-white py-3 px-6 rounded-lg hover:bg-gray-500 transition duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="h-13 font-bold font-inter bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
