import React, { useState } from "react";
import Navbar from "../components/Navbar";

const AtletaFaltas = () => {
  const [faltas, setFaltas] = useState([
    { data: "2024-01-01", modalidade: "Futebol", professor: "João Silva", local: "Quadra A" },
    { data: "2024-01-02", modalidade: "Basquete", professor: "Maria Santos", local: "Quadra B" },
    { data: "2024-01-03", modalidade: "Vôlei", professor: "Carlos Oliveira", local: "Quadra A" },
    { data: "2024-01-04", modalidade: "Futebol", professor: "João Silva", local: "Quadra B" },
    { data: "2024-01-05", modalidade: "Basquete", professor: "Maria Santos", local: "Quadra A" },
  ]);

  const [filters, setFilters] = useState({ data: "", modalidade: "", local: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const filteredFaltas = faltas.filter((falta) => {
    return (
      (filters.data === "" || falta.data === filters.data) &&
      (filters.modalidade === "" || falta.modalidade === filters.modalidade) &&
      (filters.local === "" || falta.local === filters.local)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFaltas = filteredFaltas.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredFaltas.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="px-4 py-6 md:px-8">
        {/* Número total de faltas */}
        <section className="mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="text-xl font-bold">Suas Faltas</div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-6xl font-bold text-orange-500">{faltas.length}</div>
            <div className="text-gray-600">
              Número de faltas permitidas: <span className="font-semibold">10</span>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="flex flex-wrap gap-4 mb-8">
          <select
            className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none"
            value={filters.data}
            onChange={(e) => setFilters({ ...filters, data: e.target.value })}
          >
            <option value="">Data</option>
            {Array.from(new Set(faltas.map((f) => f.data))).map((data) => (
              <option key={data} value={data}>
                {data}
              </option>
            ))}
          </select>
          <select
            className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none"
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
            className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none"
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
        </section>

        {/* Tabela */}
        <section className="bg-gray-100 p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 border-b">Data</th>
                <th className="px-4 py-2 text-left text-gray-600 border-b">Modalidade</th>
                <th className="px-4 py-2 text-left text-gray-600 border-b">Professor</th>
                <th className="px-4 py-2 text-left text-gray-600 border-b">Local</th>
              </tr>
            </thead>
            <tbody>
              {currentFaltas.map((falta, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b">{falta.data}</td>
                  <td className="px-4 py-2 border-b">{falta.modalidade}</td>
                  <td className="px-4 py-2 border-b">{falta.professor}</td>
                  <td className="px-4 py-2 border-b">{falta.local}</td>
                </tr>
              ))}
              {currentFaltas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded-md shadow ${
                currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <span className="text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 rounded-md shadow ${
                currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AtletaFaltas;
