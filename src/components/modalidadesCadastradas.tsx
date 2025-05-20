import { useEffect, useState } from "react";
import { getAllModalities, deleteModality } from "../services/modalityService";
import { Modality } from "@/types/Modality";
import { split } from "postcss/lib/list";


interface ModalidadesCadastradasProps {
    modalidades: Modality[];
    onEdit: (modalidade: Modality) => void;
    onDelete: (id: number) => void;
    modalidadeEdicao: Modality | null;
    setModalidades: React.Dispatch<React.SetStateAction<Modality[]>>;
}

export const ModalidadesCadastradas: React.FC<ModalidadesCadastradasProps> = ({
    modalidades,
    onEdit,
    onDelete,
    modalidadeEdicao,
    setModalidades
}) => {

    const handleDelete = async (id: number) => {
        if (window.confirm("Tem certeza que deseja excluir esta modalidade?")) {
            try {
                await deleteModality(id);
                setModalidades(prev => prev.filter(m => m.id !== id));

            } catch (error) {
                console.error("Erro ao deletar modalidade:", error);
            }
        }
    };
    console.log('Modalidade data:', JSON.stringify(modalidades, null, 2));

    return (
        <div>

            <div className="border border-black md:pb-36 bg-[#D9D9D9]">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left min-w-[600px]">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-lg font-bold">Nome</th>
                                <th className="px-4 py-3 text-lg font-bold">Descrição</th>
                                {/* <th className="px-4 py-3 text-lg font-bold">Local</th> */}
                                <th className="px-4 py-3 text-lg font-bold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalidades.map((modalidade) => (
                                <tr key={modalidade.id} className="border-t border-gray-300">
                                    <td className="px-4 py-3">{modalidade.name}</td>
                                    <td className="px-4 py-3">{modalidade.description || "-"}</td>
                                    {/* <td className="px-4 py-3">{modalidade.class_locations || "-"}</td> */}
                                    
                                    <td className="px-4 py-3 space-x-2 flex">


                                        <button className="w-7">
                                            <img src="/icon/pencil.svg" alt="Editar" className="w-full" />
                                        </button>
                                        <button onClick={() => handleDelete(modalidade.id)} className="w-7">
                                            <img src="/icon/trash.svg" alt="Deletar" className="w-full" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {modalidades.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-center text-gray-600">
                                        Nenhuma modalidade cadastrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>

        </div>
    );

};