import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getModalidades, getModalidadesInscritas } from "../services/modality";
import { inscreverEmModalidade } from "../services/enrollment";
import { useUser } from "../hooks/useAuth";

export default function ModalidadesInscricao() {
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inscrevendo, setInscrevendo] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [modalidadesInscritas, setModalidadesInscritas] = useState<number[]>([]);
  const user = useUser();

  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const data = await getModalidades();
        setModalidades(data);
      } catch (error) {
        setMensagem("Erro ao carregar modalidades");
      } finally {
        setLoading(false);
      }
    };
    fetchModalidades();
  }, []);

  useEffect(() => {
    const fetchModalidadesInscritas = async () => {
      if (!user?.id) return;
      try {
        const enrollments = await getModalidadesInscritas(user.id);
        // O endpoint retorna uma lista de objetos Enrollment, cada um tem um campo "modality" com o objeto modalidade
        const enrolledIds = enrollments.map((enr: any) => enr.modality?.id).filter(Boolean);
        setModalidadesInscritas(enrolledIds);
      } catch (error) {
        // Não bloqueia o fluxo, só loga
        console.warn("Erro ao buscar modalidades inscritas", error);
      }
    };
    fetchModalidadesInscritas();
  }, [user]);

  const handleInscrever = async (modalityId: number) => {
    setInscrevendo(modalityId);
    setMensagem("");
    try {
      await inscreverEmModalidade(modalityId);
      setMensagem("Inscrição realizada com sucesso!");
      setModalidadesInscritas((prev) => [...prev, modalityId]);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setMensagem(error.response.data.message);
      } else {
        setMensagem("Erro ao inscrever-se na modalidade");
      }
    } finally {
      setInscrevendo(null);
    }
  };

  if (loading) return <div>Carregando modalidades...</div>;

  return (
    <main className="w-full lg:w-3/4 mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-8 text-left text-[#EB8317]">
        Modalidades Disponíveis
      </h2>
      {mensagem && (
        <div className="mb-4 text-center text-sm text-red-600 font-semibold">{mensagem}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modalidades.map((mod: any, index: number) => (
          <div
            key={mod.id || index}
            className="bg-[#d9d9d9] p-6 rounded border border-black shadow-md flex flex-col justify-between mb-4"
          >
            <div>
              <h3 className="text-xl font-semibold text-orange-500 mb-2 uppercase tracking-wide text-center">{mod.name}</h3>
              <p className="text-gray-700 text-center mb-1">Horário: <span className="font-medium">{mod.start_time} - {mod.end_time}</span></p>
              <p className="text-gray-500 text-center mb-2">Local: <span className="font-medium">
                {Array.isArray(mod.class_locations)
                  ? mod.class_locations.join(", ")
                  : typeof mod.class_locations === 'object' && mod.class_locations !== null
                    ? JSON.stringify(mod.class_locations)
                    : mod.class_locations || "-"}
              </span></p>
              <p className="text-gray-500 text-center mb-2">Dias: <span className="font-medium">
                {Array.isArray(mod.days_of_week)
                  ? mod.days_of_week.join(", ")
                  : typeof mod.days_of_week === 'object' && mod.days_of_week !== null
                    ? JSON.stringify(mod.days_of_week)
                    : mod.days_of_week || "-"}
              </span></p>
            </div>
            <Button
              className="mt-4"
              onClick={() => handleInscrever(mod.id)}
              disabled={inscrevendo === mod.id || modalidadesInscritas.includes(mod.id)}
            >
              {modalidadesInscritas.includes(mod.id)
                ? "Inscrito"
                : inscrevendo === mod.id
                ? "Inscrevendo..."
                : "Inscrever-se"}
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}