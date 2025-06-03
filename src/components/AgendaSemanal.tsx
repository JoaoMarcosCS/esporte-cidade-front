import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useAuth';
import { useDecodedToken } from '../hooks/useDecodedToken';
import api from '../services/api';
import { getScheduleAthlete } from '../services/schedule';
import dayjs from 'dayjs';

interface Modality {
  id: number;
  name: string;
  description: string;
  days_of_week: string | string[];
  start_time: string;
  end_time: string;
  class_locations: string;
}

interface Enrollment {
  id: number;
  athlete: any;
  modality: Modality;
  active: boolean;
  approved: boolean;
}

interface DayNote {
  day: string;
  address: string;
  modality: string;
  schedule: string;
}
const dayMap: { [key: string]: string } = {
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
  sab: 'Sábado',
};

const AgendaSemanal: React.FC = () => {
  const user = useUser();
   console.log("\n\n\n\n\n\n\n\nusuario",user);
  const decodedToken = useDecodedToken();
  const [notes, setNotes] = useState<DayNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [horarios, setHorarios] = useState<any[]>([]);
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        if (!user?.id) return;

        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token não encontrado no localStorage');
          return;
        }

        try {
          const responseData = await getScheduleAthlete(token);
          setHorarios(responseData);
          console.log('Resposta da API:', responseData);

          const formattedNotes = responseData.map((modality: any) => {
            // Convert days_of_week string to array if it's not already
            const days = typeof modality.days_of_week === 'string'
              ? modality.days_of_week.split(',').map((day: any) => day.trim())
              : modality.days_of_week || [];

            // Create notes for each day
            return days.map((day: string) => ({
              day: dayMap[day] || day, // converte 'ter' para 'Terça'
              modality: modality.name,
              schedule: modality.start_time,
              address: Array.isArray(modality.class_locations)
                ? modality.class_locations.join(', ')
                : modality.class_locations || 'Local não especificado'
            }));
          }).flat();

          setNotes(formattedNotes);
        } catch (error: any) {
          console.error('Erro ao buscar horário:', error.response?.data || error.message);
          // Se falhar, usa os dados padrão
          setNotes([
            { day: 'Segunda', modality: "-", schedule: "-", address: '-' },
            { day: 'Terça', modality: "-", schedule: "-", address: '-' },
            { day: 'Quarta', modality: "-", schedule: "-", address: '-' },
            { day: 'Quinta', modality: "-", schedule: "-", address: '-' },
            { day: 'Sexta', modality: "-", schedule: "-", address: '-' },
            { day: 'Sábado', modality: "-", schedule: "-", address: '-' },
          ]);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao buscar horário:', error);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user?.id, decodedToken?.token]);

  if (loading) {
    return (
      <div className="bg-[#F4F6FF] p-3 pt-0 rounded border border-black">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 sm:gap-4">
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

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <div className="bg-[#F4F6FF] p-3 pt-0 rounded border border-black">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6  sm:gap-4">
        {daysOfWeek.map((day, index) => {
          const dayNotes = notes.filter(note => note.day === day);
          return (
            <div key={index} className="bg-[#F4F6FF] p-2 rounded text-center">
              <h3 className="font-semibold mb-2">{day}</h3>
              {dayNotes.length > 0 ? (
                <div className="space-y-2">
                  {dayNotes.map((note, noteIndex) => (
                    <div key={noteIndex} className="bg-[#F4F6FF] p-1">
                      <p className='text-gray-700 font-medium'>{note.modality}</p>
                      <p className='text-gray-600 text-sm'>{note.schedule}</p>
                      <p className='text-gray-500 text-sm'>{note.address}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-sm'></p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaSemanal;