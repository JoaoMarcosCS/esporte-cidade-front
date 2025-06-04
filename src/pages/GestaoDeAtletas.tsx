import React, { useEffect, useRef, useState } from "react";
import { Athlete } from "@/types/Athlete";
import AtletasCadastrados from "../components/AtletasCadastrados";
import FormularioAtletas from "../components/FormularioAtletas";
// import { getAthletes, saveAthlete, deleteAthlete } from "../services/athleteService";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import api from '../services/api';
import { Modality } from "@/types/Modality";

const GestaoDeAtletas: React.FC = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]); // each enrollment has athlete and modality
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedModality, setSelectedModality] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  // Fetch all data in parallel
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [athletesResp, enrollmentsResp, modalitiesResp] = await Promise.all([
        api.get('/athletes/'),
        api.get('/enrollment/'),
        api.get('/modality/')
      ]);
      setAthletes(athletesResp.data);
      setEnrollments(enrollmentsResp.data);
      setModalities(modalitiesResp.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddOrEdit = async (athlete: Athlete) => {
    try {
      if (athlete.id) {
        // Atualizar
        const formData = new FormData();
        Object.entries(athlete).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        await api.put(`/athletes/${athlete.id}`, formData);
      } else {
        // Criar novo
        const formData = new FormData();
        Object.entries(athlete).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        await api.post('/athletes/', formData);
      }
      await fetchAllData();
      setSelectedAthlete(null);
    } catch (error) {
      console.error("Erro ao salvar atleta:", error);
      throw error;
    }
  };

  const handleEditClick = async (athlete: Athlete) => {
    try {
      const response = await api.get(`/athletes/${athlete.id}`);
      setSelectedAthlete(response.data); // agora terá address
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error('Erro ao buscar atleta para edição:', error);
      alert('Erro ao buscar dados completos do atleta.');
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/athletes/${id}`);
      await fetchAllData();
    } catch (error) {
      console.error('Erro ao deletar atleta:', error);
    }
  };


  // Join enrollments with athletes for filtering
  const getAthleteModalities = (athleteId: string | number) => {
    return enrollments
      .filter((enr) => enr.athlete && (enr.athlete.id?.toString() === athleteId?.toString()))
      .map((enr) => enr.modality);
  };

  const filteredAthletes = athletes.filter((athlete) => {
    const searchLower = search.toLowerCase();
    const matchesText =
      athlete.name.toLowerCase().includes(searchLower) ||
      (athlete.rg && athlete.rg.toLowerCase().includes(searchLower)) ||
      athlete.cpf.toLowerCase().includes(searchLower);
    if (!matchesText) return false;
    if (!selectedModality) return true;
    const athleteModalities = getAthleteModalities(athlete.id || "");
    return athleteModalities.some((mod: any) => mod.id?.toString() === selectedModality);
  });

  return (
    <section className="bg-[#F4F6FF] pb-20">
      <HeaderBasic
        type="visitante"
        links={[
          { label: "Home", path: "/home-gestor" },
          { label: "Comunicados", path: "/home-gestor/cadastrar-comunicado" }, 
          { label: "Modalidades", path: "/home-gestor/cadastrar-modalidade" },
        ]}
      />

      <FooterMobile />

      <div className="min-h-screen xl:px-36 md:px-11 px-5 py-6">
        <main className="space-y-8 mt-6">
          <section>
            <h1 className="text-2xl font-bold mb-6">Gestão de Atletas</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-4 bg-[#D9D9D9] border border-black rounded-lg p-4">
              <input
                type="text"
                placeholder="Buscar por nome, RG ou CPF"
                className="border border-black rounded px-3 py-2 w-full md:w-1/2"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="border border-black rounded px-3 py-2 w-full md:w-1/3"
                value={selectedModality}
                onChange={e => setSelectedModality(e.target.value)}
              >
                <option value="">Todas modalidades</option>
                {modalities.map((mod) => (
                  <option key={mod.id} value={mod.id}>{mod.name}</option>
                ))}
              </select>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB8317]"></div>
              </div>
            ) : (
              <AtletasCadastrados
                athletes={filteredAthletes}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                selectedAthlete={selectedAthlete}
              />
            )}
          </section>

          <section ref={formRef} >
            <h2 className="text-xl font-semibold mb-4">
              {selectedAthlete ? <FormularioAtletas
              athlete={selectedAthlete}
              onSubmit={handleAddOrEdit}
              onCancel={() => setSelectedAthlete(null)}
            /> : ''}
            </h2>
            
          </section>
        </main>
      </div>
    </section>
  );
};

export default GestaoDeAtletas;
