
import React, { useState, useMemo } from "react"
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown, } from 'lucide-react'
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format } from "date-fns"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select"

interface DiasDaSemana {
  segunda: Atividade[];
  terca: Atividade[];
  quarta: Atividade[];
  quinta: Atividade[];
  sexta: Atividade[];
  sabado: Atividade[];
}
interface Atividade {
  modalidade: string
  horario: string
}


const programacao = {
  segunda: [
    { modalidade: 'Natação', horario: '12:30' },
    { modalidade: 'Futebol', horario: '16:00' },
    { modalidade: 'Vôlei', horario: '18:00' },
  ],
  terca: [
    { modalidade: 'Basquete', horario: '09:00' },
    { modalidade: 'Tênis', horario: '14:00' },
    { modalidade: 'Atletismo', horario: '17:00' },
  ],
  quarta: [
    { modalidade: 'Judô', horario: '10:00' },
    { modalidade: 'Futsal', horario: '13:00' },
    { modalidade: 'Natação', horario: '15:30' },
  ],
  quinta: [
    { modalidade: 'Ciclismo', horario: '08:00' },
    { modalidade: 'Ginástica', horario: '11:00' },
    { modalidade: 'Futebol', horario: '16:30' },
  ],
  sexta: [
    { modalidade: 'Rugby', horario: '09:30' },
    { modalidade: 'Natação', horario: '13:00' },
    { modalidade: 'Vôlei', horario: '18:00' },
  ],
  sabado: [
    { modalidade: 'Tênis', horario: '10:00' },
    { modalidade: 'Futebol', horario: '14:00' },
    { modalidade: 'Basquete', horario: '17:00' },
  ],
};

export const Escala = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalActivities = Math.max(
    programacao.segunda.length,
    programacao.terca.length,
    programacao.quarta.length,
    programacao.quinta.length,
    programacao.sexta.length,
    programacao.sabado.length
  );

  const Ativo = useMemo(() => {
    const allActivities = [];
    for (let i = 0; i < totalActivities; i++) {
      allActivities.push({
        segunda: programacao.segunda[i] || null,
        terca: programacao.terca[i] || null,
        quarta: programacao.quarta[i] || null,
        quinta: programacao.quinta[i] || null,
        sexta: programacao.sexta[i] || null,
        sabado: programacao.sabado[i] || null,
      });
    }

    return allActivities.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage]);

  const totalPages = Math.ceil(totalActivities / itemsPerPage);

  return (
    <div className="mr-16 lg:mr-6">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-1">Escala Semanal</h2>

        <div className="border rounded-md border-black bg-[#d9d9d9] p-4 shadow">
          <div className="grid grid-cols-6 gap-2 lg:gap-6 font-semibold mb-2">
            <p className="border-b-2 border-black pb-2">Segunda-Feira</p>
            <p className="border-b-2 border-black pb-2">Terça-Feira</p>
            <p className="border-b-2 border-black pb-2">Quarta-Feira</p>
            <p className="border-b-2 border-black pb-2">Quinta-Feira</p>
            <p className="border-b-2 border-black pb-2">Sexta-Feira</p>
            <p className="border-b-2 border-black pb-2">Sábado</p>
          </div>
          {Ativo.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-2 lg:gap-10 py-2 border-t border-gray-200"
            >
              <p>{item.segunda ? `${item.segunda.modalidade} - ${item.segunda.horario}` : ""}</p>
              <p>{item.terca ? `${item.terca.modalidade} - ${item.terca.horario}` : ""}</p>
              <p>{item.quarta ? `${item.quarta.modalidade} - ${item.quarta.horario}` : ""}</p>
              <p>{item.quinta ? `${item.quinta.modalidade} - ${item.quinta.horario}` : ""}</p>
              <p>{item.sexta ? `${item.sexta.modalidade} - ${item.sexta.horario}` : ""}</p>
              <p>{item.sabado ? `${item.sabado.modalidade} - ${item.sabado.horario}` : ""}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-[#d9d9d9] hover:bg-orange-500"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      </div>
    </div>

  );
};
