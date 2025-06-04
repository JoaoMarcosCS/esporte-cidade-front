import React, { useEffect, useState } from "react";
import HeaderBasic from "../components/navigation/HeaderBasic";
import { AppSidebar } from "../components/navigation/AppSidebar-prof";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import axios from "axios";
import { useUser } from "../hooks/useAuth";

interface Falta {
  data: string;
  modalidade: string;
  professor: string;
  local: string;
}

interface Modality {
  id: number;
  name: string;
}

const AtletaFaltas = () => {
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [totalFaltas, setTotalFaltas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ modalityId: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
 
  // Get authenticated user data
  const user = useUser();
  console.log (user);
 
  useEffect(() => {
    const fetchFaltas = async () => {
      try {
        setLoading(true);
        setError(null);
    
        if (!user?.name) {
          throw new Error("acesso negado");
        }
    
        // Properly encode the athlete name in the URL
        const url = new URL("http://localhost:3002/api/absences");
        url.searchParams.append("athlete", encodeURIComponent(user.name));
        
        if (filters.modalityId) {
          url.searchParams.append("modality", filters.modalityId);
        }
    
        const response = await axios.get(url.toString(), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
    
        setFaltas(response.data.absences || []);
        setTotalFaltas(response.data.totalAbsences || 0);
        
        if (response.data.modalities && !modalities.length) {
          setModalities(response.data.modalities);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("falha no carregamento");
      } finally {
        setLoading(false);
      }
    };

    fetchFaltas();
  }, [filters.modalityId, user?.name]); 

  const filteredFaltas = faltas.filter((falta) => {
    return (
      filters.modalityId === "" ||
      falta.modalidade ===
        modalities.find((m) => m.id.toString() === filters.modalityId)?.name
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFaltas = filteredFaltas.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredFaltas.length / itemsPerPage);

  const handleModalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, modalityId: e.target.value });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  function formatDate(dateStr: string) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }

  return (
    <SidebarProvider>
      <AppSidebar type="atleta" />
      <SidebarInset>
        <div className="min-h-screen bg-[#F4F6FF]">
          <HeaderBasic
            type="usuario"
            links={[
              { label: "Home", path: "/home-atleta" },
              { label: "Faltas", path: "/home-atleta/faltas-atleta" },
              { label: "Modalidades", path: "/home-atleta/modalidade" }
            ]}
          />
          <main className="px-4 py-6 md:px-8 w-3/4 m-auto">
            <div className="text-4xl font-bold my-10">Suas Faltas</div>

            {loading && (
              <div className="text-center py-8">Carregando dados...</div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                <section className="mb-8 p-6 rounded-lg border-black border bg-[#D9D9D9]">
                  <div className="text-xl font-bold">
                    Número total de faltas:
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-6xl font-bold text-[#EB8317]">
                      {String(totalFaltas).padStart(2, "0")}
                    </div>
                    <div className="text-gray-600">
                      Número de faltas permitidas:{" "}
                      <span className="font-semibold">10</span>
                    </div>
                  </div>
                </section>

                {/* Filtros */}
                <section className="flex flex-wrap gap-4 mb-8">
                  <select
                    className="w-1/3 md:w-1/6 px-4 py-2 rounded-md border-black border bg-[#D9D9D9]"
                    value={filters.modalityId}
                    onChange={handleModalityChange}
                  >
                    <option value="">Todas modalidades</option>
                    {modalities.map((modality) => (
                      <option key={modality.id} value={modality.id}>
                        {modality.name}
                      </option>
                    ))}
                  </select>
                </section>

                {/* Tabela */}
                <section className="p-6 border-black border bg-[#D9D9D9]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left border-b border-black">
                          Data
                        </th>
                        <th className="px-4 py-2 text-left border-b border-black">
                          Modalidade
                        </th>
                        {/* <th className="px-4 py-2 text-left border-b border-black">
                          Professor
                        </th>
                        <th className="px-4 py-2 text-left border-b border-black">
                          Local
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentFaltas.map((falta, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border-b">{formatDate(falta.data)}</td>
                          <td className="px-4 py-2 border-b">
                            {falta.modalidade}
                          </td>
                          {/* <td className="px-4 py-2 border-b">
                            {falta.professor}
                          </td>
                          <td className="px-4 py-2 border-b">{falta.local}</td> */}
                        </tr>
                      ))}
                      {currentFaltas.length === 0 && (
                        <tr>
                          <td
                            colSpan={4} 
                            className="px-4 py-2 text-center text-gray-500"
                          >
                            Nenhuma falta
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>

                {/* Paginação */}
                <section className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    Página {currentPage} de {totalPages}
                  </span>

                  <div className="flex justify-end items-center mt-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={`px-4 py-2 rounded-l-md border border-black ${
                        currentPage === 1
                          ? "bg-[#D9D9D9] cursor-not-allowed"
                          : "bg-[#EB8317] text-white hover:bg-orange-600"
                      }`}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={`px-4 py-2 rounded-r-md border border-black ${
                        currentPage === totalPages
                          ? "bg-[#D9D9D9] cursor-not-allowed"
                          : "bg-[#EB8317] text-white hover:bg-orange-600"
                      }`}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button>
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AtletaFaltas;