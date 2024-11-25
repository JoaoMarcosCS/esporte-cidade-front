import React, { useState, useEffect } from "react";

interface Compromisso {
  id: number;
  data: string;
  descricao: string;
}

interface CalendarioCompromissosProps {
  userType: "gestor" | "atleta" | "professor";
}

const CalendarioCompromissos: React.FC<CalendarioCompromissosProps> = ({ userType }) => {
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const savedCompromissos = localStorage.getItem("compromissos");
    if (savedCompromissos) {
      setCompromissos(JSON.parse(savedCompromissos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("compromissos", JSON.stringify(compromissos));
  }, [compromissos]);

  const handleAddOrEditCompromisso = () => {
    if (editId !== null) {
      setCompromissos(compromissos.map(comp => comp.id === editId ? { id: editId, data, descricao } : comp));
      setEditId(null);
    } else {
      const newCompromisso = { id: Date.now(), data, descricao };
      setCompromissos([...compromissos, newCompromisso]);
    }
    setData("");
    setDescricao("");
  };

  const handleEdit = (id: number) => {
    const compromisso = compromissos.find(comp => comp.id === id);
    if (compromisso) {
      setData(compromisso.data);
      setDescricao(compromisso.descricao);
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    setCompromissos(compromissos.filter(comp => comp.id !== id));
  };

  return (
    <div className="bg-[#F4F6FF] p-2 rounded shadow-md border border-black ">


      {userType === "gestor" && (
        <div className="mb-4">
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="border p-2 mr-2 rounded"
          />
          <input
            type="text"
            placeholder="Descrição do compromisso"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border p-2 mr-2 rounded"
          />
          <button
            onClick={handleAddOrEditCompromisso}
            className="bg-orange-600 text-white p-2 rounded"
          >
            {editId ? "Editar Compromisso" : "Adicionar Compromisso"}
          </button>
        </div>
      )}

      <ul className="space-y-2">
        {compromissos.map((comp) => (
          <li key={comp.id} className="bg-white p-2 rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{comp.data}</p>
              <p>{comp.descricao}</p>
            </div>
            {userType === "gestor" && (
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(comp.id)} className="text-blue-500">Editar</button>
                <button onClick={() => handleDelete(comp.id)} className="text-red-500">Excluir</button>
              </div>
            )}
          </li>
        ))}
        {compromissos.length === 0 && <p>Nenhum compromisso adicionado</p>}
      </ul>
    </div>
  );
};

export default CalendarioCompromissos;
