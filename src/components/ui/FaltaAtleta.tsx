import React from "react";
import useNavigateTo from "../../hooks/useNavigateTo";

interface StudentAbsencesProps {
  subject: string;
  absences: number;
  maxAbsences: number;
}

const FaltaAtleta: React.FC<StudentAbsencesProps> = ({
  subject,
  absences,
  maxAbsences,

  
}) => {
  const GoTo = useNavigateTo();
  return (
    <div className="flex flex-col ">
      <div className="text-[#EB8317] text-lg font-bold mt-2">{subject}</div>
      <div className="flex items-baseline mt-1">
        <span className="text-4xl font-bold text-black">{absences}</span>
        <span className="text-lg font-semibold text-gray-700 ml-2">Faltas</span>
      </div>
      <p className="text-sm text-black mt-1">
        Número de faltas permitidas {maxAbsences}
      </p>
      <div className="flex justify-end mt-4">
        
        <button onClick={()=> GoTo("/faltas-atleta")} className="bg-[#EB8317] hover:scale-105 text-black text-sm font-semibold py-2 px-4 rounded border border-black">
          
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

export default FaltaAtleta;
