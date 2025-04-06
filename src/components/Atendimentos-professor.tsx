import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "../components/ui/button";
import api from "../services/api";
import { useAuth } from '../contexts/AuthContext';

import { ChevronLeft, ChevronRight, ChevronDown,  } from 'lucide-react'
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

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./ui/carousel"

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

const locations = Array.from(new Set(attendances.map(a => a.local)))

export const VisualizarAtendimentos = () => {
    const [schedule, setSchedule] = useState<ScheduleSection[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const { user, isAuthenticated, fetchUser } = useAuth();

    // Log component state when it mounts
    useEffect(() => {
        console.log('VisualizarAtendimentos component mounted');
        console.log('Current user:', user);
        console.log('Is authenticated:', isAuthenticated);

        // Try to fetch user data if not authenticated
        if (!isAuthenticated && !user) {
            console.log('Attempting to fetch user data');
            fetchUser().catch(err => {
                console.error('Error fetching user data:', err);
            });
        }
    }, [isAuthenticated, user, fetchUser]);

    const fetchSchedule = useCallback(async () => {
        try {
            console.log('Attempting to fetch schedule');
            console.log('Current auth state:', { isAuthenticated, user });

            if (!isAuthenticated) {
                console.log('User is not authenticated');
                return;
            }

            if (!user?.id) {
                console.log('User ID not found:', user);
                return;
            }

            console.log('Fetching schedule for user:', user.id);
            
            // Log the API endpoint being called
            const endpoint = `/schedule/teacher/${user.id}`;
            console.log('Calling API endpoint:', endpoint);

            try {
                const response = await api.get(endpoint);
                console.log('API Response:', response.data);
                
                // Check if response data exists
                if (!response.data) {
                    console.error('No data received from API');
                    setSchedule([
                        {
                            title: "Aulas de Hoje",
                            items: []
                        },
                        {
                            title: "Aulas de Amanhã",
                            items: []
                        }
                    ]);
                    return;
                }

                // Transform the backend response to match our component's expected format
                const todaySchedules = response.data.today ? response.data.today.map((schedule: any) => ({
                    name: schedule.name,
                    time: schedule.time,
                    date: new Date(schedule.date).toISOString().split('T')[0]
                })) : [];

                const tomorrowSchedules = response.data.tomorrow ? response.data.tomorrow.map((schedule: any) => ({
                    name: schedule.name,
                    time: schedule.time,
                    date: new Date(schedule.date).toISOString().split('T')[0]
                })) : [];

                console.log('Transformed schedules:', {
                    today: todaySchedules,
                    tomorrow: tomorrowSchedules
                });

                setSchedule([
                    {
                        title: "Aulas de Hoje",
                        items: todaySchedules
                    },
                    {
                        title: "Aulas de Amanhã",
                        items: tomorrowSchedules
                    }
                ]);

            } catch (error: unknown) {
                console.error('Erro ao carregar o horário:', error);
                console.error('Error details:', {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined
                });
                
                setSchedule([
                    {
                        title: "Aulas de Hoje",
                        items: []
                    },
                    {
                        title: "Aulas de Amanhã",
                        items: []
                    }
                ]);
            }
        } catch (error: unknown) {
            console.error('Erro ao carregar o horário:', error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            
            setSchedule([
                {
                    title: "Aulas de Hoje",
                    items: []
                },
                {
                    title: "Aulas de Amanhã",
                    items: []
                }
            ]);
        }
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        console.log('Auth state changed:', { isAuthenticated, user });
        
        if (isAuthenticated && user?.id) {
            console.log('Starting schedule fetch with interval');
            fetchSchedule();
            const intervalId = setInterval(fetchSchedule, 60000);
            return () => {
                console.log('Clearing schedule fetch interval');
                clearInterval(intervalId);
            };
        } else {
            console.log('Not authenticated or no user ID, clearing schedule');
            setSchedule([
                {
                    title: "Aulas de Hoje",
                    items: []
                },
                {
                    title: "Aulas de Amanhã",
                    items: []
                }
            ]);
        }
    }, [isAuthenticated, user?.id, fetchSchedule]);

    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Carregando dados do usuário...</p>
            </div>
        );
    }

    

    return (
        <div className="flex flex-col gap-8">
            {schedule.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mt-4">
                    <h2 className="text-lg font-semibold text-start mb-4">{section.title}</h2>
                    {section.items.length === 0 ? (
                        <p className="text-gray-500 text-center">Nenhuma aula agendada</p>
                    ) : (
                        <>
                            <p className="text-gray-500 text-center mb-4">Total de aulas: {section.items.length}</p>
                            <Carousel
                                opts={{
                                    align: "start",
                                }}
                                className="w-full max-w-3xl"
                            >
                                <CarouselContent>
                                    {section.items.map((item, itemIndex) => (
                                        <CarouselItem
                                            key={itemIndex}
                                            className="basis-1/2 min-w-36"
                                        >
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent className="p-6 border rounded-md border-black bg-[#d9d9d9]">
                                                        <p>{item.name}</p>
                                                        <p className="text-orange-500">
                                                            {item.time}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="bg-[#d9d9d9] shadow-none border-none hover:bg-orange-500" />
                                <CarouselNext className="bg-[#d9d9d9] shadow-none border-none hover:bg-orange-500" />
                            </Carousel>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export const QuantidadeAtendimentos = () => {
    const content = [
        {
            title: "Quantidade de Atendimentos",
            items: [
                { modalidade: "Futebol", quantidade: 12 },
                { modalidade: "Volley", quantidade: 2 },
                { modalidade: "Natação", quantidade: 5 },
                { modalidade: "Basquete", quantidade: 8 },
                { modalidade: "Tênis", quantidade: 6 },
                { modalidade: "Atletismo", quantidade: 4 },
                { modalidade: "Ginástica", quantidade: 7 },
                { modalidade: "Judô", quantidade: 3 },
                { modalidade: "Ciclismo", quantidade: 9 },
            ]
        }

    ]

    const [currentPage, setCurrentPage] = React.useState(1)
    const itemsPerPage = 3
    const totalPages = Math.ceil(content[0].items.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = content[0].items.slice(startIndex, endIndex)

    return (
        <div className="w-full  max-w-screen-md pt-10 ">
            <h2 className="text-lg font-semibold mb-4">{content[0].title}</h2>
            {currentItems.map((item, index) => (
                <Card key={index} className="mb-4 bg-[#d9d9d9]  transition-colors">
                    <CardContent className="p-5 flex justify-between items-center border rounded-md border-black">
                        <p>
                            <span className="font-inter">Modalidade:</span> <span className="font-semibold">{item.modalidade}</span>
                        </p>
                        <p className="text-orange-500 font-bold text-lg">{item.quantidade}</p>
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-[#d9d9d9] hover:bg-orange-500"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
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
                    <span className="sr-only">Next page</span>
                </Button>
            </div>
        </div>
    )

};

export const AtendimentosAnteriores = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

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
        <div className="w-full mt-4 max-w-2xl mx-auto ">
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
                    <SelectTrigger className="bg-[#d9d9d9] hover:shadow-md hover:shadow-slate-700  w-40  border rounded-md border-black">
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
