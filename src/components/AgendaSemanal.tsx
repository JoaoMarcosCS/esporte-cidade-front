import React, { useState } from 'react';

type UserType = 'professor' | 'atleta' | "gestor";

interface ScheduleProps {
  userType: UserType;
}

interface DayNote {
  day: string;
  address: string;
  modality: string;
  schedule: string;
}

const initialNotes: DayNote[] = [
  { day: 'Segunda', modality:"Atletismo", schedule: "18h", address: 'Centro polo esportivo' },
  { day: 'Terça', modality:"Atletismo", schedule: "18h", address: 'Centro polo esportivo' },
  { day: 'Quarta', modality:"Atletismo", schedule: "18h", address: 'Centro polo esportivo' },
  { day: 'Quinta', modality:"Judo", schedule: "18h", address: 'Rua Alencar Correa de Carvalho, 70' },
  { day: 'Sexta', modality:"Judo", schedule: "18h", address: 'Rua Alencar Correa de Carvalho, 70,' },
  { day: 'Sábado', modality:"Atletismo", schedule: "9h", address: 'Campo do Migule Vieira' },
];

const AgendaSemanal: React.FC<ScheduleProps> = ({ userType }) => {
  const [notes, setNotes] = useState<DayNote[]>(initialNotes);

  // const handleNoteChange = (index: number, value: string) => {
  //   if (userType === 'professor' || 'gestor') {
  //     const updatedNotes = [...notes];
  //     updatedNotes[index].note = value;
  //     setNotes(updatedNotes);
  //   }
  // };

  return (
    <div className="bg-[#F4F6FF] p-3 pt-0 rounded border border-black">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
        {notes.map((dayNote, index) => (
          <div key={index} className="bg-[#F4F6FF] p-2 rounded text-center">
            <h3 className="font-semibold ">{dayNote.day}</h3>
            {userType === 'professor' ? (
              <textarea
                className="mt-2 w-full p-2 rounded"
                // value={dayNote.note}
                // onChange={(e) => handleNoteChange(index, e.target.value)}
                placeholder=""
              />
            ) : (
              <div>
                <p className='text-gray-700'>{dayNote.modality}</p>
                <br />
                <p className='text-gray-700'>{dayNote.address}</p>
                <br />
                <p className='text-gray-700'>{dayNote.schedule}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaSemanal;
