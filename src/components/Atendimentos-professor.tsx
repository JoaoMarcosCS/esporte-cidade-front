import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "../components/ui/button";
import api from "../services/api";
import { useAuth } from '../contexts/AuthContext';

import { ChevronLeft, ChevronRight, ChevronDown, } from 'lucide-react'
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format } from "date-fns"
import { getScheduleTeacher } from "../services/schedule";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./ui/carousel"
import { useUser } from "../hooks/useAuth";
import { useDecodedToken } from "../hooks/useDecodedToken";


interface ScheduleItem {
    name: string;
    time: string;
    date: string;
}

interface ScheduleSection {
    title: string;
    items: ScheduleItem[];
}

interface BackendSchedule {
    name: string;
    time: string;
    date: Date;
}

interface BackendScheduleResponse {
    today: BackendSchedule[];
    tomorrow: BackendSchedule[];
}

interface FullSchedule {
    id: number;
    name: string;
    time: string;
    date: Date;
    teacher: {
        id: number;
        name: string;
    };
}

interface FullScheduleResponse {
    today: FullSchedule[];
    tomorrow: FullSchedule[];
}

interface Attendance {
    data: string;
    local: string;
    atendimento: string;
}

interface CardItem {
    modalidade: string
    quantidade: number
}

interface ContentItem {
    title: string
    items: CardItem[]
}

dayjs.locale('pt-br');
const attendances: Attendance[] = [
    { data: "10/12/2023", local: "Raspadão", atendimento: "Futebol" },
    { data: "11/12/2023", local: "Quadra Coberta", atendimento: "Basquete" },
    { data: "12/12/2023", local: "Piscina Olímpica", atendimento: "Natação" },
    { data: "13/12/2023", local: "Raspadão", atendimento: "Futebol" },
    { data: "14/12/2023", local: "Quadra de Tênis", atendimento: "Tênis" },
    { data: "15/12/2023", local: "Pista de Atletismo", atendimento: "Atletismo" },
    { data: "16/12/2023", local: "Ginásio", atendimento: "Vôlei" },
    { data: "17/12/2023", local: "Raspadão", atendimento: "Futebol" },
    { data: "18/12/2023", local: "Quadra Coberta", atendimento: "Basquete" },
    { data: "19/12/2023", local: "Piscina Olímpica", atendimento: "Natação" },
    { data: "20/12/2023", local: "Quadra de Tênis", atendimento: "Tênis" },
    { data: "21/12/2023", local: "Pista de Atletismo", atendimento: "Atletismo" },
]

const locations = Array.from(new Set(attendances.map(a => a.local)));
const dayMap: Record<string, string> = {
    dom: 'Domingo',
    seg: 'Segunda',
    ter: 'Terça',
    qua: 'Quarta',
    qui: 'Quinta',
    sex: 'Sexta',
    sab: 'Sábado',
};
const getDiasHojeEAmanha = () => {
    const hoje = dayjs();
    const amanha = hoje.add(1, 'day');

    const hojeAbrev = hoje.format('ddd').toLowerCase(); // já com locale pt-br, 'ter'
    const amanhaAbrev = amanha.format('ddd').toLowerCase(); // 'qua'

    return {
        hoje: hojeAbrev,
        amanha: amanhaAbrev
    };
};
const { hoje, amanha } = getDiasHojeEAmanha();

export const VisualizarAtendimentos = () => {
    const user = useAuth() 
    const userData = useUser();
    console.log(userData);




    const decodedToken = useDecodedToken();
    const [loading, setLoading] = useState(true);
    const [formattedSchedule, setFormattedSchedule] = useState<any[]>([]);

    const { hoje, amanha } = getDiasHojeEAmanha();

    const fetchScheduleTeacher = async () => {
        try {
            setLoading(true);

            console.log("asdasdsad\n\n\n\n\n", userData?.name);


            if (!userData) return;
            const token = localStorage.getItem("token");
            if (!token) return;

            const responseData = await getScheduleTeacher(token);
            const scheduleArray = Array.isArray(responseData)
                ? responseData
                : responseData ? [responseData] : [];

            const formatted = scheduleArray.map((classInfo: any) => {
                const days = typeof classInfo.days === 'string'
                    ? classInfo.days.split(',').map((d: string) => d.trim())
                    : [];

                return days.map((day: string) => ({
                    dia: day, // manter a abreviação original para comparação direta
                    modalidade: classInfo.name,
                    horario: `${classInfo.start_time} - ${classInfo.end_time}`,
                    local: Array.isArray(classInfo.class_locations)
                        ? classInfo.class_locations.join(', ')
                        : classInfo.class_locations || 'Local não especificado',
                }));
            }).flat();

            setFormattedSchedule(formatted);
            console.log("formatado: ", formatted)
        } catch (error: any) {
            console.error("Erro ao buscar horário do professor:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScheduleTeacher();
    }, []);

    console.log('Hoje (abrev):', hoje);
    console.log('Amanhã (abrev):', amanha);

    console.log('Dias no formattedSchedule:');
    formattedSchedule.forEach((aula, i) => {
        console.log(i, 'dia:', aula.dia, '| comparação com hoje:', aula.dia === hoje, '| comparação com amanhã:', aula.dia === amanha);
    });

    const filtrarAulasPorDia = (dia: string) => {
        return formattedSchedule.filter(aula => aula.dia === dia);
    };

    const aulasHoje = filtrarAulasPorDia(hoje);
    const aulasAmanha = filtrarAulasPorDia(amanha);

    console.log('aulasHoje:', aulasHoje);
    console.log('aulasAmanha:', aulasAmanha);

    const renderCarousel = (aulas: any[], titulo: string) => (
        <div className="mt-4">
            <h2 className="text-lg font-semibold text-start mb-4">{titulo}</h2>
            {aulas.length === 0 ? (

                //sem Aulas 
                 <>
                    <Carousel opts={{ align: "start" }} className=" w-full max-w-3xl">
                        <CarouselContent>
                                <CarouselItem className=" basis-1/2 min-w-36">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="min-h-32 p-6 border rounded-md  min-w-52 border-black bg-[#d9d9d9]">
                                                <p>sem aulas Hoje</p>
                                               
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>

                        </CarouselContent>
                        {/* <CarouselPrevious className="bg-[#d9d9d9] shadow-none border-none hover:bg-orange-500" />
                        <CarouselNext className="bg-[#d9d9d9] shadow-none border-none hover:bg-orange-500" /> */}
                    </Carousel>
                </>
            ) : (
                <>
                    <Carousel opts={{ align: "start" }} className="w-full max-w-3xl">
                        <CarouselContent>
                            {aulas.map((aula, index) => (
                                <CarouselItem key={index} className="basis-1/2 min-w-36">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="min-h-32 p-6 border rounded-md  min-w-52 border-black bg-[#d9d9d9]">
                                                <p>{aula.modalidade}</p>
                                                <p className="text-orange-500">{aula.horario}</p>
                                                <p className="text-sm text-gray-600">{aula.local}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {/* <CarouselPrevious className="bg-[#d9d9d9] shadow-none border-none hover:bg-orange-500" />
                        <CarouselNext className="bg-[#d9d9d9] shadow-none border-none hover:bg-orange-500" /> */}
                    </Carousel>
                </>
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1>Aulas do professor</h1>
                {loading ? (
                    <p>Carregando...</p>
                ) : formattedSchedule.length === 0 ? (
                    <p>Nenhuma aula encontrada</p>
                ) : (
                    <>
                        {renderCarousel(aulasHoje, `Aulas de hoje (${hoje.toUpperCase()})`)}
                        {renderCarousel(aulasAmanha, `Aulas de amanhã (${amanha.toUpperCase()})`)}
                    </>
                )}
            </div>
        </div>
    );
};


export const AtendimentosAnteriores = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

   const content = [
        {
            title: "Quantidade de Atendimentos",
            items: [
                { modalidade: "Futebol", quantidade: 12 },
            ]
        }

    ]


    const filteredAttendances = useMemo(() => {
        return attendances.filter(attendance => {
            const dateMatch = selectedDate ? attendance.data === format(selectedDate, "dd/MM/yyyy") : true;
            const locationMatch = !selectedLocation || selectedLocation === "all" || attendance.local === selectedLocation;
            return dateMatch && locationMatch;
        });
    }, [selectedDate, selectedLocation]);

    const totalPages = Math.ceil(filteredAttendances.length / 10);
    const currentItems = filteredAttendances.slice(
        (currentPage - 1) * 10,
        currentPage * 10
    );

    return (
        <div className="w-full mt-4 max-w-2xl  ">
            <h2 className="text-lg font-semibold mb-4">Atendimentos Anteriores</h2>
            <div className="flex gap-4 mb-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-[#d9d9d9] hover:bg-[#d9d9d9]   hover:shadow-md hover:shadow-slate-700 
                        flex w-40 justify-between items-center font-normal  border rounded-md border-black">
                            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Data</span>}
                            <ChevronDown className="ml-2 h-4 w-4 hover:shadow-lg hover:shadow-slate-900" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Select onValueChange={(value) => setSelectedLocation(value)}>
                    <SelectTrigger className="bg-[#d9d9d9] hover:bg-[#d9d9d9] hover:shadow-md hover:shadow-slate-700 flex w-40 justify-between items-center font-normal h-12 border rounded-md border-black">
                        <SelectValue placeholder="Local" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">Todos os locais</SelectItem>
                        {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                                {location}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className=" border rounded-md border-black bg-[#d9d9d9] p-4 rounded-lg shadow">
               
                    <Card className="mb-4 bg-[#d9d9d9]  transition-colors">
                        <CardContent className="p-5 flex justify-between items-center border rounded-md border-black">
                            <p>
                                <span className="font-inter">Modalidade:</span> <span className="font-semibold">Futebol</span>
                            </p>
                            <p className="text-orange-500 font-bold text-lg">12</p>
                        </CardContent>
                    </Card>
               

                <div className=" grid grid-cols-3 gap-2 lg:gap-10 font-semibold text-gray-700 mb-2">
                    <p className="border-b-2 border-black pb-2">Data</p>
                    <p className="border-b-2 border-black pb-2">Local</p>
                    <p className="border-b-2 border-black pb-2">Atendimento</p>
                </div>
                {currentItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 lg:gap-10 py-2  border-t border-gray-200">
                        <p>{item.data}</p>
                        <p>{item.local}</p>
                        <p>{item.atendimento}</p>
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
    );
};
