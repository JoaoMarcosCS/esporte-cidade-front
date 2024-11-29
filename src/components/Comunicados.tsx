import React, { useState, useMemo } from "react"
import useNavigateTo from "../hooks/useNavigateTo";
import { CalendarDays } from 'lucide-react';
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown, } from 'lucide-react'

interface Comunicados {
  texto: string;
  horario?: string
}

const comunicados = [
  { horario: "12:50", texto: "varias coisas" },
  { horario: "12:50",texto: "varias coisas" },
  { horario: "12:50",texto: "varias coisas" },
  { horario: "12:50",texto: "varias coisas" },
  {horario: "12:50", texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "varias coisas" },
  { texto: "outas coisas" }
]

export const CalendarioCompromissos = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15;

  const PagedComunicados = useMemo(() => {
    return comunicados.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage, comunicados]);

  const totalPages = Math.ceil(comunicados.length / itemsPerPage);

  const GoTo = useNavigateTo();
  return (
    <div className="mr-6">
      <div className="flex flex-col h-[600px] mx-auto">
        <h2 className="text-lg font-semibold mb-1">Calendário de compromissos</h2>
        <div className="border rounded-md border-black w-full w-[400px] h-full bg-[#d9d9d9] p-4 shadow">
          <div>
            {PagedComunicados.map((comunicado, index) => (
              <p key={index} className="flex flex-row space-x-1 text-gray-700">
                <p className=""><CalendarDays /></p>
                <p>
                  {comunicado.horario && `${comunicado.horario} - `}</p>
                <p className="">{comunicado.texto}</p>
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[#d9d9d9] hover:bg-orange-500"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-[#d9d9d9] hover:bg-orange-500"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      </div >
    </div>
  );
};


