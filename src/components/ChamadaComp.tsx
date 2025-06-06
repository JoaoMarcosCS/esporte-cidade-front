import React, { useState, useEffect } from "react";
import ModuloConfirmacao from "./ModuloConfirmacao";
import { AtletaAtivos } from "../pages/Chamada";
import api from "../services/api";
import useNavigateTo from "../hooks/useNavigateTo";

interface AttendanceProps {
  userType: "professor" | "atleta";
  initialStudents: AtletaAtivos[];
}

const ChamadaComp: React.FC<AttendanceProps> = ({
  userType,
  initialStudents,
}) => {
  const [students, setStudents] = useState<AtletaAtivos[]>(initialStudents);
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const GoTo = useNavigateTo();

  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().substring(0, 5);
    setDateTime({ date: currentDate, time: currentTime });
  }, []);

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
                    ? student.faltas + 1
                    : student.faltas - 1,
              }
            : student
        )
      );
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirm = async () => {
    try {
      const formatDateTime = (dateStr: string, timeStr: string) => {
        const [hours, minutes] = timeStr.split(":");
        return `${dateStr} ${hours}:${minutes}:00.000`;
      };

      const formattedDateTime = formatDateTime(dateTime.date, dateTime.time);

      const atendiments = students.map((student) => ({
        modalityId: student.modalityId, // Certifique-se que modalityId existe no student
        athleteId: student.id,
        present: student.status === "PRESENTE",
        created_at: formattedDateTime, 
      }));

      const response = await api.post(
        `modality/${students[0].modalityId}/receive-atendiments`,
        atendiments 
      );

      console.log("Chamada gravada com sucesso:", response.data);
      setIsModalOpen(false);
      GoTo("/home-professor");
    } catch (error) {
      console.error("Erro ao gravar chamada:", error);
    }
  };
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateTime((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-1">Modalidade:</label>
          <input
            type="text"
            value="Futebol"
            readOnly
            className="w-full p-2 border border-black bg-[#d9d9d9]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">
            Informe a data da chamada:
          </label>
          <input
            type="date"
            name="date"
            value={dateTime.date}
            onChange={handleDateTimeChange}
            className="w-full p-2 border border-black bg-[#d9d9d9]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Informe o horário:</label>
          <input
            type="time"
            name="time"
            value={dateTime.time}
            onChange={handleDateTimeChange}
            className="w-full p-2 border border-black bg-[#d9d9d9]"
          />
        </div>
      </div>

      {/* <button className="bg-[#EB8317] mb-6 text-black py-2 px-4 mt-6 rounded border border-black">
        Gerar Lista de Chamada
      </button> */}

      <div className="space-y-4 mt-6">
        <p className="text-2xl font-semibold">Alunos da modalidade</p>

        {students.map((student) => (
          <div
            key={student.id}
            className="p-4 bg-[#d9d9d9] border border-black flex flex-col cursor-pointer"
            onClick={() => toggleStatus(student.id)}
          >
            <div className="flex items-center">
              <img
                src={student.photo_url || "https://via.placeholder.com/50"}
                alt={student.name}
                className="rounded-full mr-4 w-12 h-12 sm:w-14 sm:h-14 object-cover"
                style={{
                  maxWidth: "56px", 
                  minWidth: "48px", 
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{student.name}</h3>
                <p
                  className={`font-bold ${
                    student.status === "PRESENTE"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {student.status}
                </p>
                <p>{student.faltas} Faltas</p>
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
