import React from 'react'

interface Atleta {
    nome: string
    modalidade: string
    endereco: string
    telefone: string
    nomeResponsavel: string
    telefoneResponsavel: string
    horario: string
}

interface PersonDetailsProps {
    atleta: Atleta
}

export function PersonDetailsPopover({ atleta }: PersonDetailsProps) {
    return (
        <div className="flex bg-[#d9d9d9] w-96 border-black border relative p-4 rounded-md">
            <div className="flex flex-col justify-center w-full">
                <p className="font-inter mt-2 mb-1">
                    <span className="font-semibold">Nome:</span> {atleta.nome}
                </p>
                <p className="font-inter mt-2 mb-1">
                    <span className="font-semibold">Modalidade:</span> {atleta.modalidade}
                </p>
                <p className="font-inter mt-2 mb-1">
                    <span className="font-semibold">Endereço:</span> {atleta.endereco}
                </p>
                <p className="font-inter mt-2 mb-1">
                    <span className="font-semibold">Telefone:</span> {atleta.telefone}
                </p>
                <p className="font-inter mt-2 mb-1">
                    <span className="font-semibold">Nome do Responsável:</span> {atleta.nomeResponsavel}
                </p>
                <p className="font-inter mt-2 mb-1">
                    <span className="font-semibold">Telefone do Responsável:</span> {atleta.telefoneResponsavel}
                </p>
                <p className="font-inter mt-2 mb-1">
                    <span className="font-semibold">Horário:</span> {atleta.horario}
                </p>
            </div>
        </div>
    )
}
