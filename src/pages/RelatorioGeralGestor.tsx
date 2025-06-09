import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterMobile from "../components/navigation/FooterMobile";
import HeaderBasic from "../components/navigation/HeaderBasic";
import api from "../services/api";

export const RelatorioGeralGestor: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const downloadRelatorio = async () => {
    try {
      setLoading(true);

      // Mostra notificação de início
      const toastId = toast.info("Preparando relatório...", {
        autoClose: false,
        closeButton: false,
      });

      const response = await api.get("/manager/relatorio-geral-download", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`progresso: ${percent}`);
            toast.update(toastId, {
              render: `Baixando relatório... ${percent}%`,
            });
          }
        },
      });

      // Cria o arquivo PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const filename = `relatorio_geral_${new Date().toLocaleDateString(
        "pt-BR"
      )}.pdf`;

      saveAs(blob, filename);

      // Notificação de sucesso
      toast.dismiss(toastId);
      toast.success("Relatório baixado com sucesso!", {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Erro ao baixar relatório. Tente novamente.");
      console.error("Erro ao baixar relatório:", error);
    } finally {
      setLoading(false);
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
          { label: "Relatório Geral", path: "/home-gestor/relatorio-geral" },
        ]}
      />

      <div className="min-h-screen xl:px-36 md:px-11 px-5 py-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Relatório Geral
          </h1>
          <p className="text-gray-600 mb-6">
            Gere um relatório completo com todas as informações de atendimentos,
            presenças e faltas por modalidade.
          </p>

          <button
            onClick={downloadRelatorio}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors duration-200 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Gerando Relatório...
              </>
            ) : (
              "Baixar Relatório Completo"
            )}
          </button>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              O que inclui o relatório:
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Lista completa de todas as modalidades</li>
              <li>Quantidade de alunos ativos por modalidade</li>
              <li>Total de atendimentos realizados</li>
              <li>Taxa de presença e faltas</li>
              <li>Detalhamento mensal de cada modalidade</li>
            </ul>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <FooterMobile />
    </section>
  );
};
