import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useAuth';
import { useDecodedToken } from '../hooks/useDecodedToken';
import api from '../services/api';
import { getScheduleAthlete } from '../services/schedule';
import dayjs from 'dayjs';
import { AgendaSemanalMobile } from './AgendaSemanalMobile';

interface Modality {
  id: number;
  name: string;
  description: string;
  days_of_week: string | string[];
  start_time: string;
  end_time: string;
  start_time_minutes: string;
  end_time_minutes: string;
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
 const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const AgendaSemanal: React.FC = () => {
  const user = useUser();
  //console.log("\n\n\n\n\n\n\n\nusuario", user);
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
          //console.log('Resposta da API:', responseData);

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
                : modality.class_locations || 'Local não especificado',
              startTimeMinutes: modality.start_time_minutes || 0,
            }));
          }).flat();

          const sortedNotes = formattedNotes.sort((a: any, b: any) => {
            if (a.day === b.day) {
              return a.startTimeMinutes - b.startTimeMinutes;
            }
            return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
          });
          //console.log("Notas ordenadas:", sortedNotes);
          setNotes(sortedNotes);
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

 
  const maxNotesPerDay = Math.max(...daysOfWeek.map(day =>
    notes.filter(note => note.day === day).length
  ));

  return (
    <>
    <div className="hidden md:block w-full px-1 sm:px-2 md:px-4">
      <div className="bg-white rounded-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] border border-black p-2 sm:p-4 w-full max-w-6xl mx-auto overflow-x-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 sm:gap-2 lg:gap-6 font-semibold mb-2 border-b-2 border-black pb-2">
          {daysOfWeek.map(day => (
            <p key={day} className="text-start gap-1 truncate">{day}</p>
          ))}
        </div>
        {/* Render rows */}
        {Array.from({ length: maxNotesPerDay }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 sm:gap-2 lg:gap-6 py-2 border-t mb-2 border-gray-200">
            {daysOfWeek.map(day => {
              const dayNotes = notes.filter(note => note.day === day);
              const note = dayNotes[rowIndex];
              return (
                <div key={day} className="space-y-1 min-w-0">
                  {note ? (
                    <div className="flex flex-col gap-1">
                      <div className="font-medium truncate"><strong>{note.modality}</strong></div>
                      <div className="text-sm text-gray-600 truncate">{note.schedule}</div>
                      <div className="text-xs text-gray-600 truncate">Local: {note.address}</div>
                    </div>
                  ) : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
    <div className="block md:hidden bg-[#d9d9d9] p-2 sm:p-4 w-full max-w-sm mx-auto overflow-x-hidden">
      <AgendaSemanalMobile />
    </div>
    </>
    
);
};

export default AgendaSemanal;