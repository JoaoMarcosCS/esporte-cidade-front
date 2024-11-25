import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
      <div className="text-lg font-bold">Esporte na Cidade</div>
      <div className="flex gap-6">
        <a href="/inicio" className="text-gray-700 hover:text-orange-500">
          Início
        </a>
        <a href="/faltas" className="text-gray-700 hover:text-orange-500">
          Faltas
        </a>
        <a href="/modalidade" className="text-gray-700 hover:text-orange-500">
          Modalidade
        </a>
        <a href="/calendario" className="text-gray-700 hover:text-orange-500">
          Calendário
        </a>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
    </nav>
  );
};

export default Navbar;
