import React, { useState, useEffect } from "react";
import { useUser } from '../hooks/useAuth';
import api from '../services/api';
import useNavigateTo from "../hooks/useNavigateTo";

interface FaltaAtletaProps {
  onNavigate?: () => void;
}

interface Falta {
  modalidade: string;
  professor: string;
  local: string;
  data: string;
}

const FaltaAtleta: React.FC<FaltaAtletaProps> = ({
  onNavigate,
}) => {
  const user = useUser();
  const GoTo = useNavigateTo();
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaltas = async () => {
      try {
        setLoading(true);
        if (!user?.id) return;

        const response = await api.get(`/faltas/${user.id}`);
        setFaltas(response.data);
      } catch (error) {
        console.error('Erro ao buscar faltas:', error);
        // Se falhar, usa dados padrão
        setFaltas([
          {
            modalidade: "Judô",
            professor: "João Silva",
            local: "Quadra A",
            data: "2024-04-05"
          },
          {
            modalidade: "Atletismo",
            professor: "Maria Santos",
            local: "Quadra B",
            data: "2024-04-04"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaltas();
  }, [user?.id]);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      GoTo('/home-atleta/faltas-atleta');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-[#F4F6FF] p-4 rounded border border-black shadow-md">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faltas.map((falta, index) => (
        <div 
          key={index} 
          className="flex flex-col cursor-pointer p-4 rounded border border-black bg-[#D9D9D9]" 
          onClick={handleNavigate}
        >
          <div className="text-[#EB8317] text-lg font-bold mb-2">{falta.modalidade}</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-gray-600">Professor: </span>
              <span className="font-semibold ml-2">{falta.professor}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Local: </span>
              <span className="font-semibold ml-2">{falta.local}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Data: </span>
              <span className="font-semibold ml-2">{formatDate(falta.data)}</span>
            </div>
          </div>
        </div>
      ))}
      {faltas.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          Nenhuma falta registrada
        </div>
      )}
    </div>
  );
};

export default FaltaAtleta;
