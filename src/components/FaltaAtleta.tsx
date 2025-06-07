import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const FaltaAtleta = () => {
  const [absences, setAbsences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        console.log("auth:", auth);
        const athleteName = auth?.user?.name;
        if (!athleteName) {
          console.log("Nome do usuário não disponível");
          return;
        }
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`http://localhost:3002/api/absences?athlete=${encodeURIComponent(athleteName)}`, { headers });
        console.log("Resposta da API (faltas):", response.data);
        const absencesArray = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.absences)
            ? response.data.absences
            : [];
        setAbsences(absencesArray);
      } catch (error: any) {
        if (error.response) {
          console.error("Erro ao buscar faltas dos atletas:", error.response.data);
        } else {
          console.error("Erro ao buscar faltas dos atletas:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAbsences();
  }, [auth]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  // Função utilitária para formatar a data
  function formatDate(dateStr: string) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }

  
  function handleNavigate() {
    navigate('/home-atleta/faltas-atleta');
  }

  return (
    <div className="space-y-4 ">
      {absences.map((falta, index) => (
        <div
          key={index}
          className="flex flex-col cursor-pointer p-4  border border-black bg-white rounded-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] m-4 justify-between mb-4 "
          onClick={handleNavigate}
        >
          <div className="text-[#EB8317] text-lg font-bold mb-2">{falta.modalidade}</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-gray-600">Local: </span>
              <span className="font-semibold ml-2">{falta.local || "-"}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Data: </span>
              <span className="font-semibold ml-2">{formatDate(falta.data)}</span>
            </div>
          </div>
        </div>
      ))}
      {absences.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          Nenhuma falta registrada
        </div>
      )}
    </div>
  );
};

export default FaltaAtleta;