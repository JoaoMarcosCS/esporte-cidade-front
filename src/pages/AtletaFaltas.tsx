import React, { useState } from "react";
import useNavigateTo from "../hooks/useNavigateTo";
import HeaderBasic from "../components/navigation/HeaderBasic";
import FooterMobile from "../components/navigation/FooterMobile";
import { AppSidebar } from "../components/navigation/AppSidebar-prof";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";

const AtletaFaltas = () => {
  const GoTo = useNavigateTo();
  const userType = "atleta";
  const user = {
    name: "",
    profilePicture: "",
  };
  const [faltas, setFaltas] = useState([
    {
      data: "2024-01-01",
      modalidade: "Futebol",
      professor: "João Silva",
      local: "Quadra A",
    },
    {
      data: "2024-01-02",
      modalidade: "Basquete",
      professor: "Maria Santos",
      local: "Quadra B",
    },
    {
      data: "2024-01-03",
      modalidade: "Vôlei",
      professor: "Carlos Oliveira",
      local: "Quadra A",
    },
    {
      data: "2024-01-04",
      modalidade: "Futebol",
      professor: "João Silva",
      local: "Quadra B",
    },
    {
      data: "2024-01-05",
      modalidade: "Basquete",
      professor: "Maria Santos",
      local: "Quadra A",
    },
  ]);

  const [filters, setFilters] = useState({
    data: "",
    modalidade: "",
    local: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Format date in Brazilian format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const filteredFaltas = faltas.filter((falta) => {
    return (
      (filters.data === "" || falta.data === filters.data) &&
      (filters.modalidade === "" || falta.modalidade === filters.modalidade) &&
      (filters.local === "" || falta.local === filters.local)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFaltas = filteredFaltas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredFaltas.length / itemsPerPage);

  return (
    <SidebarProvider>
      <AppSidebar type="atleta" />
      <SidebarInset>
        <div className=" bg-[#F4F6FF]">
          <HeaderBasic
            type="usuario"
            user={user}
            links={[
              { label: "Home", path: "/home-atleta" },
              { label: "Faltas", path: "/home-atleta/faltas-atleta" },
              { label: "Modalidades", path: "/home-atleta/modalidade" },
              { label: "Horário", path: "/home-atleta/horarios" },
            ]}
          />

          <main className="px-4 py-6 md:px-8 w-full lg:w-3/4 m-auto">
            <div className="text-4xl font-bold my-10 text-center md:text-left">Suas Faltas</div>
            
            {/* Total Faltas Section */}
            <section className="mb-8 p-6 rounded-lg border-black border bg-[#D9D9D9]">
              <div className="text-xl font-bold mb-4">Numero total de faltas:</div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-6xl font-bold text-[#EB8317] text-center md:text-left">
                  {String(faltas.length).padStart(2, "0")}
                </div>
                <div className="text-gray-600 text-center md:text-left">
                  Número de faltas permitidas: <span className="font-semibold">10</span>
                </div>
              </div>
            </section>

            {/* Filters Section */}
            <section className="mb-8">
              <div className="text-xl font-bold mb-4">Filtros</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="w-full px-4 py-2 rounded-md border-black border bg-[#D9D9D9] focus:outline-none"
                  value={filters.data}
                  onChange={(e) => setFilters({ ...filters, data: e.target.value })}
                >
                  <option value="">Data</option>
                  {Array.from(new Set(faltas.map((f) => f.data))).map((data) => (
                    <option key={data} value={data}>
                      {formatDate(data)}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full px-4 py-2 rounded-md border-black border bg-[#D9D9D9] focus:outline-none"
                  value={filters.modalidade}
                  onChange={(e) => setFilters({ ...filters, modalidade: e.target.value })}
                >
                  <option value="">Modalidade</option>
                  {Array.from(new Set(faltas.map((f) => f.modalidade))).map((modalidade) => (
                    <option key={modalidade} value={modalidade}>
                      {modalidade}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full px-4 py-2 rounded-md border-black border bg-[#D9D9D9] focus:outline-none"
                  value={filters.local}
                  onChange={(e) => setFilters({ ...filters, local: e.target.value })}
                >
                  <option value="">Local</option>
                  {Array.from(new Set(faltas.map((f) => f.local))).map((local) => (
                    <option key={local} value={local}>
                      {local}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Table Section */}
            <section className="p-6 border-black border bg-[#D9D9D9]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left border-b border-black">Data</th>
                    <th className="px-4 py-2 text-left border-b border-black">Modalidade</th>
                    <th className="px-4 py-2 text-left border-b border-black">Professor</th>
                    <th className="px-4 py-2 text-left border-b border-black">Local</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFaltas.map((falta, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b">{formatDate(falta.data)}</td>
                      <td className="px-4 py-2 border-b">{falta.modalidade}</td>
                      <td className="px-4 py-2 border-b">{falta.professor}</td>
                      <td className="px-4 py-2 border-b">{falta.local}</td>
                    </tr>
                  ))}
                  {currentFaltas.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {/* Pagination Section */}
            <section className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="font-bold text-sm">Página {currentPage} de {totalPages}</span>

              <div className="flex justify-center md:justify-end items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
          </main>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AtletaFaltas;
