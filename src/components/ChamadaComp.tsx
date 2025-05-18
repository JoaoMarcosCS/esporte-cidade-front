import React, { useState } from "react";
import ModuloConfirmacao from "./ModuloConfirmacao";

interface Student {
  id: number;
  name: string;
  status: "PRESENTE" | "AUSENTE";
  absences: number;
  modality: string;
  semesterYear: string;
}

export interface AttendanceProps {
  userType: string;
  fetchAtletasDaModalidade: (modalityId: number) => Promise<any>;
  registrarChamada: ({
    modalityId,
    teacherId,
    attendances,
  }: {
    modalityId: number;
    teacherId: number;
    attendances: { athleteId: number; present: boolean }[];
  }) => Promise<any>;
}

const initialStudents: Student[] = [
];

const ChamadaComp: React.FC<AttendanceProps> = ({
  userType,
  fetchAtletasDaModalidade,
  registrarChamada,
}) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModality, setSelectedModality] = useState<string>("");
  const [selectedSemesterYear, setSelectedSemesterYear] = useState<string>("");

  const toggleStatus = (studentId: number) => {
    if (userType === "professor") {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? {
                ...student,
                status: student.status === "PRESENTE" ? "AUSENTE" : "PRESENTE",
                absences:
                  student.status === "PRESENTE"
                    ? student.absences + 1
                    : student.absences - 1,
              }
            : student
        )
      );
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleGerarLista = async () => {
    if (!selectedModality) {
      console.log("Selecione uma modalidade antes de buscar atletas.");
      return;
    }
    try {
      console.log("Consultando API: fetchAtletasDaModalidade", selectedModality);
      const atletas = await fetchAtletasDaModalidade(Number(selectedModality));
      console.log("Resposta da API (atletas):", atletas);
      setStudents(
        atletas.map((a: any) => ({
          id: a.id,
          name: a.name,
          status: "PRESENTE",
          absences: a.absences ?? 0,
          modality: a.modality ?? selectedModality,
          semesterYear: a.semesterYear ?? selectedSemesterYear,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar atletas:", error);
    }
  };

  const handleConfirm = async () => {
    try {
      const modalityId = Number(selectedModality);
      const teacherId = 1;
      const attendances = students.map((s) => ({
        athleteId: s.id,
        present: s.status === "PRESENTE",
      }));
      console.log("Chamando registrarChamada", { modalityId, teacherId, attendances });
      const res = await registrarChamada({ modalityId, teacherId, attendances });
      console.log("Resposta da API (registrarChamada):", res);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao registrar chamada:", error);
    }
  };

  const handleModalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModality(e.target.value);
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemesterYear(e.target.value);
  };

  const filteredStudents = students.filter(
    (student) =>
      (!selectedModality || student.modality === selectedModality) &&
      (!selectedSemesterYear || student.semesterYear === selectedSemesterYear)
  );

  return (
    <div className="p-6  min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-1">Modalidade:</label>
          <select
            value={selectedModality}
            onChange={handleModalityChange}
            className="w-full p-2 border border-black bg-[#d9d9d9]"
          >
            <option value="">Selecione a modalidade</option>
            <option value="1">Futebol</option>
            <option value="2">Basquete</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Ano/Semestre:</label>
          <select
            value={selectedSemesterYear}
            onChange={handleSemesterChange}
            className="w-full p-2 border border-black bg-[#d9d9d9]"
          >
            <option value="">Selecione o ano/semestre</option>
            <option value="2024/1">2024/1</option>
            <option value="2024/2">2024/2</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Informe a data da chamada:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-black bg-[#d9d9d9]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Informe o horário:</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-2 border border-black bg-[#d9d9d9]"
          />
        </div>
      </div>

      <button
        className="bg-[#EB8317] mb-6 text-black py-2 px-4 mt-6 rounded border border-black"
        onClick={handleGerarLista}
      >
        Gerar Lista de Chamada
      </button>

      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="p-4 bg-[#d9d9d9] border border-black flex flex-col cursor-pointer"
            onClick={() => toggleStatus(student.id)}
          >
            <div className="flex items-center">
              <img src="https://via.placeholder.com/50" alt={student.name} className="rounded-full mr-4" />
              <div className="flex-1">
                <h3 className="font-semibold">{student.name}</h3>
                <p className={`font-bold ${student.status === "PRESENTE" ? "text-green-500" : "text-red-500"}`}>
                  {student.status}
                </p>
                <p>{student.absences} Faltas</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleOpenModal}
        className="bg-[#EB8317] mb-6 text-black py-2 px-4 mt-6 rounded border border-black"
      >
        Gravar Chamada
      </button>
      <ModuloConfirmacao
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        message="Você tem certeza que deseja gravar a chamada?"
      />
    </div>
  );
};

export default ChamadaComp;
