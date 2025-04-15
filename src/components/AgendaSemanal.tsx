import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useAuth';
import { useDecodedToken } from '../hooks/useDecodedToken';
import api from '../services/api';

interface DayNote {
  day: string;
  address: string;
  modality: string;
  schedule: string;
}

const AgendaSemanal: React.FC = () => {
  const user = useUser();
  const decodedToken = useDecodedToken();
  const [notes, setNotes] = useState<DayNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        if (!user?.id) return;

        const response = await api.get(`/schedule/${user.id}`);
        setNotes(response.data);
      } catch (error) {
        console.error('Erro ao buscar horário:', error);
        // Se falhar, usa os dados padrão
        setNotes([
          { day: 'Segunda', modality: "Atletismo", schedule: "18h", address: 'Centro polo esportivo' },
          { day: 'Terça', modality: "Atletismo", schedule: "18h", address: 'Centro polo esportivo' },
          { day: 'Quarta', modality: "Atletismo", schedule: "18h", address: 'Centro polo esportivo' },
          { day: 'Quinta', modality: "Judo", schedule: "18h", address: 'Rua Alencar Correa de Carvalho, 70' },
          { day: 'Sexta', modality: "Judo", schedule: "18h", address: 'Rua Alencar Correa de Carvalho, 70,' },
          { day: 'Sábado', modality: "Atletismo", schedule: "9h", address: 'Campo do Migule Vieira' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="bg-[#F4F6FF] p-3 pt-0 rounded border border-black">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-[#F4F6FF] p-2 rounded text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6FF] p-3 pt-0 rounded border border-black">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
        {notes.map((dayNote, index) => (
          <div key={index} className="bg-[#F4F6FF] p-2 rounded text-center">
            <h3 className="font-semibold ">{dayNote.day}</h3>
            <div>
              <p className='text-gray-700'>{dayNote.modality}</p>
              <br />
              <p className='text-gray-700'>{dayNote.address}</p>
              <br />
              <p className='text-gray-700'>{dayNote.schedule}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaSemanal;
