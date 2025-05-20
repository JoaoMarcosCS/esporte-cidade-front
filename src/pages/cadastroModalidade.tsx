import React, { useEffect, useRef, useState } from "react";
import { Modality } from "@/types/Modality";
import { ModalidadesCadastradas } from "../components/modalidadesCadastradas";
import FormularioModalidades from "../components/FormularioModalidades";
import {
    getAllModalities,
    createModality,
    deleteModality
} from "../services/modalityService";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import { ConfirmModal } from "../components/ComfirmModal";


export const CadastroModalidades: React.FC = () => {
    const [modalidades, setModalidades] = useState<Modality[]>([]);
    const [modalidadeSelecionada, setModalidadeSelecionada] = useState<Modality | null>(null);
    const formularioRef = useRef<HTMLFormElement>(null);

    //modal form
    const [showModal, setShowModal] = useState(false);

    //modal confirmar delete
    const [modalAberto, setModalAberto] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
    const handleDeleteClick = (id: number) => {
        setIdParaExcluir(id);
        setModalAberto(true);
    };

    useEffect(() => {
        fetchModalidades();
    }, []);

    const fetchModalidades = async () => {
        try {
            const data = await getAllModalities();
            setModalidades(data);
        } catch (error) {
            console.error("Erro ao carregar modalidades:", error);
        }
    };

    const handleCreate = async (data: Omit<Modality, "id" | "teachers" | "registred_athletes">) => {
        try {
            await createModality(data);
            await fetchModalidades()
        } catch (error) {
            console.error("Erro ao salvar modalidade:", error);
            throw error;
        }
    };

    const handleEditClick = (modality: Modality) => {
        setModalidadeSelecionada(modality);
        formularioRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteModality(id);
            setModalidades(prev => prev.filter(mod => mod.id !== id));
            if (modalidadeSelecionada?.id === id) {
                setModalidadeSelecionada(null);
            }
        } catch (error) {
            console.error("Erro ao deletar modalidade:", error);
            throw error
        }
    };
    const confirmarExclusao = async () => {
        if (idParaExcluir === null) return;

        try {
            await deleteModality(idParaExcluir);
            setModalidades((prev) => prev.filter((mod) => mod.id !== idParaExcluir));
            if (modalidadeSelecionada?.id === idParaExcluir) {
                setModalidadeSelecionada(null);
            }
        } catch (error) {
            console.error("Erro ao deletar modalidade:", error);
        } finally {
            setModalAberto(false);
            setIdParaExcluir(null);
        }
    };



    return (
        <section className="bg-[#F4F6FF] pb-20">
            <HeaderBasic
                type="visitante"
                links={[
                    { label: "Home", path: "/home-gestor" },
                    { label: "Comunicados", path: "/home-gestor/cadastrar-comunicado" },
                    { label: "Modalidades", path: "/home-gestor/cadastrar-modalidade" },
                ]}
            />
            <FooterMobile />

            <div className="min-h-screen xl:px-36 md:px-11 px-5 py-6">
                <main className="space-y-8 mt-6">
                    <section>
                        <div className="flex justify-evenly">

                            <h2 className="font-bold text-3xl mb-10">Modalidades Cadastradas</h2>
                            <button
                                className="h-10 md:w-fit font-bold font-inter bg-orange-600 text-white px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                                onClick={() => {
                                    setModalidadeSelecionada(null);
                                    setShowModal(true);
                                }}
                            >
                                Cadastrar Nova Modalidade
                            </button>


                        </div>

                        <ModalidadesCadastradas
                            modalidades={modalidades}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            modalidadeEdicao={modalidadeSelecionada}
                            setModalidades={setModalidades}
                        />



                    </section>


                    <ConfirmModal
                        isOpen={modalAberto}
                        onClose={() => setModalAberto(false)}
                        onConfirm={confirmarExclusao}
                    />

                    <section className="flex justify-end">


                        {showModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">

                                    <FormularioModalidades
                                        ref={formularioRef}
                                        modalityEdicao={modalidadeSelecionada}
                                        onSubmit={async (data) => {
                                            await handleCreate(data);
                                            setShowModal(false);
                                            await fetchModalidades();
                                        }}
                                        onCancelEdit={() => {
                                            setModalidadeSelecionada(null);
                                            setShowModal(false);
                                            fetchModalidades();
                                        }}
                                    />

                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </section>
    );
};
