import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { PersonDetailsPopover } from './ui/person-details-popover'

interface Atleta {
    nome: string
    cpf: string
    email: string
    modalidade: string
    endereco: string
    telefone: string
    nomeResponsavel: string
    telefoneResponsavel: string
    horario: string
}

interface PaginatedListProps {
    items: Atleta[]
    itemsPerPage: number
}
interface Lista {
    atleta: Atleta;
}

export const Lista: React.FC<PaginatedListProps> = ({ items, itemsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(1)
  
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(items.length / itemsPerPage)
  
    return (
        <div className="mt-4 max-w-7xl mx-20">
            <div className="border rounded-md border-black bg-[#d9d9d9] p-4 min-w-[550px] shadow">
                <div className="grid grid-cols-3 gap-2 lg:gap-10 font-semibold text-gray-700 mb-2">
                    <p className="border-b-2 border-black pb-2">Nome</p>
                    <p className="border-b-2 border-black pb-2">CPF</p>
                    <p className="border-b-2 border-black pb-2">E-mail</p>
                </div>
                {currentItems.map((item, index) => (
                    <Popover key={index}>
                        <PopoverTrigger asChild>
                            <div className="grid grid-cols-3 gap-2 lg:gap-10 py-2 border-t border-gray-200 cursor-pointer hover:bg-gray-100">
                                <p>{item.nome}</p>
                                <p>{item.cpf}</p>
                                <p>{item.email}</p>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <PersonDetailsPopover atleta={item} />
                        </PopoverContent>
                    </Popover>
                ))}
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
        </div>
    )
}

export const atletas: Atleta[] = [
    { nome: "Joao", cpf: "123.123.123-45", email: "joazinho@gmail.com", modalidade: "futebol", horario: "12:50", endereco: "rua guaraniz", telefone: "12345678", nomeResponsavel: "Julio", telefoneResponsavel: "987654321" },
    { nome: "Maria", cpf: "234.234.234-56", email: "mariazinha@gmail.com", modalidade: "natação", horario: "14:30", endereco: "rua das flores", telefone: "23456789", nomeResponsavel: "Ana", telefoneResponsavel: "876543210" },
    { nome: "Carlos", cpf: "345.345.345-67", email: "carlos@gmail.com", modalidade: "basquete", horario: "15:00", endereco: "avenida brasil", telefone: "34567890", nomeResponsavel: "Marcos", telefoneResponsavel: "765432109" },
    { nome: "Ana", cpf: "456.456.456-78", email: "ana@gmail.com", modalidade: "voleibol", horario: "16:00", endereco: "rua esperança", telefone: "45678901", nomeResponsavel: "Paula", telefoneResponsavel: "654321098" },
    { nome: "Pedro", cpf: "567.567.567-89", email: "pedro@gmail.com", modalidade: "futebol", horario: "10:00", endereco: "praça central", telefone: "56789012", nomeResponsavel: "Joana", telefoneResponsavel: "543210987" },
    { nome: "Beatriz", cpf: "678.678.678-90", email: "bia@gmail.com", modalidade: "ginástica", horario: "11:30", endereco: "rua dos anjos", telefone: "67890123", nomeResponsavel: "Fernanda", telefoneResponsavel: "432109876" },
    { nome: "Lucas", cpf: "789.789.789-01", email: "lucas@gmail.com", modalidade: "atletismo", horario: "09:00", endereco: "alameda verde", telefone: "78901234", nomeResponsavel: "Ricardo", telefoneResponsavel: "321098765" },
    { nome: "Fernanda", cpf: "890.890.890-12", email: "fernanda@gmail.com", modalidade: "ciclismo", horario: "08:00", endereco: "rua da paz", telefone: "89012345", nomeResponsavel: "Cecília", telefoneResponsavel: "210987654" },
    { nome: "Rafael", cpf: "901.901.901-23", email: "rafael@gmail.com", modalidade: "futebol", horario: "13:30", endereco: "estrada do sol", telefone: "90123456", nomeResponsavel: "Gustavo", telefoneResponsavel: "109876543" },
    { nome: "Julia", cpf: "012.012.012-34", email: "julia@gmail.com", modalidade: "dança", horario: "17:00", endereco: "rua das oliveiras", telefone: "01234567", nomeResponsavel: "Luiza", telefoneResponsavel: "098765432" },
    { nome: "Marcelo", cpf: "123.123.123-45", email: "marcelo@gmail.com", modalidade: "handebol", horario: "11:00", endereco: "rua primavera", telefone: "12345678", nomeResponsavel: "Gabriel", telefoneResponsavel: "987654321" },
    { nome: "Gabriela", cpf: "234.234.234-56", email: "gabi@gmail.com", modalidade: "esgrima", horario: "18:30", endereco: "avenida das nações", telefone: "23456789", nomeResponsavel: "Carlos", telefoneResponsavel: "876543210" }
];


export const Contador: React.FC = () => {
    const totalUsers = atletas.length;

    return (
        <div className="flex bg-[#d9d9d9] max-w-7xl max-h-32 mx-20 border-black border relative">
            <div className="flex flex-col justify-center">
                <p className="font-inter mt-4 mx-6 font-semibold mb-1">
                    Quantidade de Alunos Inscritos
                </p>
                <p className="text-5xl mb-2 mx-6 font-bold text-orange-500">
                    {totalUsers}
                </p>
            </div>
            <button
                className="bg-[#EB8317] text-black py-1 px-4 rounded border border-black absolute bottom-3 right-4"
            >
                Gerar Lista
            </button>
        </div>
    );
};

