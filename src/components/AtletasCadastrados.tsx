import React, { useEffect, useState } from 'react';
import { Athlete } from '../types/Athlete';
import api from '../services/api';

export interface AtletasCadastradosProps {
  athletes?: Athlete[];
  onEdit?: (athlete: Athlete) => void;
  onDelete?: (id: string) => Promise<void>;
  selectedAthlete?: Athlete | null;
}

function formatCpf(cpf?: string) {
  if (!cpf) return '';
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(phone?: string) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= 10) {
    // Fixo ou celular antigo
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  } else {
    // Celular novo
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }
}

export default function AtletasCadastrados({
  athletes: athletesProp,
  onEdit,
  onDelete,
  selectedAthlete,
}: AtletasCadastradosProps) {
  // Estado para atletas
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Atualiza atletas do prop quando necessário
  // Cards por página
  const [perPage, setPerPage] = useState(6);
  const PER_PAGE_OPTIONS = [3, 6, 9, 12];

  useEffect(() => {
    if (!athletesProp) {
      fetchAthletes();
    } else {
      // Map fields from prop to ensure compatibility
      const mappedAthletes = athletesProp.map((athlete: any) => ({
        ...athlete,
        athletePhotoUrl: athlete.photo_url,
        frontIdPhotoUrl: athlete.photo_url_cpf_front,
        backIdPhotoUrl: athlete.photo_url_cpf_back,
      }));
      setAthletes(mappedAthletes);
      setLoading(false);
    }
    setCurrentPage(1); 
  }, [athletesProp, perPage]);

  const [orderBy, setOrderBy] = useState<'matricula' | 'alfabetica'>('matricula');

 
  const getSortedAthletes = () => {
    if (orderBy === 'alfabetica') {
      // Ordena por nome
      return [...athletes].sort((a, b) => a.name.localeCompare(b.name));
    }
   
    return [...athletes].sort((a, b) => {
      if (!a.id || !b.id) return 0;
      // Se id for string, converte para número se possível
      const aId = isNaN(Number(a.id)) ? a.id : Number(a.id);
      const bId = isNaN(Number(b.id)) ? b.id : Number(b.id);
      if (aId < bId) return -1;
      if (aId > bId) return 1;
      return 0;
    });
  };
  const sortedAthletes = getSortedAthletes();

 
  const totalPages = Math.ceil(sortedAthletes.length / perPage) || 1;
  const paginatedAthletes = sortedAthletes.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }


  useEffect(() => {
    if (!athletesProp) {
      fetchAthletes();
    } else {
      const mappedAthletes = athletesProp.map((athlete: any) => ({
        ...athlete,
        athletePhotoUrl: athlete.photo_url,
        frontIdPhotoUrl: athlete.photo_url_cpf_front,
        backIdPhotoUrl: athlete.photo_url_cpf_back,
      }));
      setAthletes(mappedAthletes);
      setLoading(false);
    }
  }, [athletesProp]);

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      const response = await api.get('athletes/');
      const mappedAthletes = response.data.map((athlete: any) => ({
        ...athlete,
        athletePhotoUrl: athlete.photo_url,
        frontIdPhotoUrl: athlete.photo_url_cpf_front,
        backIdPhotoUrl: athlete.photo_url_cpf_back,
      }));
      setAthletes(mappedAthletes);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar atletas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (onDelete) return onDelete(id);
    if (!window.confirm('Tem certeza que deseja excluir este atleta?')) return;
    try {
      await api.delete(`athletes/${id}`);
      fetchAthletes();
    } catch (err: any) {
      alert('Erro ao excluir atleta: ' + err.message);
    }
  };

  const handleEdit = (athlete: Athlete) => {
    if (onEdit) onEdit(athlete);
  };

  if (loading) return <p>Carregando atletas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-[#D9D9D9] border border-black md:p-6 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Atletas Cadastrados</h2>
      {/* Filtro de ordenação e quantidade de cards */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">Ordenar por:</label>
          <select
            className="border border-black rounded px-2 py-1 text-sm bg-white"
            value={orderBy}
            onChange={e => { setOrderBy(e.target.value as 'matricula' | 'alfabetica'); setCurrentPage(1); }}
          >
            <option value="matricula">Matrícula</option>
            <option value="alfabetica">Nome (A-Z)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">Atletas por página:</label>
          <select
            className="border border-black rounded px-2 py-1 text-sm bg-white"
            value={perPage}
            onChange={e => setPerPage(Number(e.target.value))}
          >
            {PER_PAGE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6`}>
        {paginatedAthletes.map((athlete, idx) => (
          <div
            key={athlete.id || idx}
            className={`bg-white border border-black rounded-lg p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center relative ${selectedAthlete && athlete.id === selectedAthlete.id ? 'ring-2 ring-[#EB8317]' : ''}`}
          >
            <img
              src={athlete.athletePhotoUrl || 'https://via.placeholder.com/80'}
              alt={`Foto de ${athlete.name || 'atleta'}`}
              className="h-20 w-20 border border-black cursor-pointer rounded-full mb-3 object-cover"
            />
            <div className="text-center w-full">
              <h3 className="font-bold text-lg mb-1">{athlete.name}</h3>
              <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">CPF:</span> {formatCpf(athlete.cpf)}</p>
              <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Email:</span> {athlete.email}</p>
              <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Telefone:</span> {formatPhone(athlete.phone)}</p>
            </div>
            <div className="flex gap-2 mt-3">
              {onEdit && (
                <button
                  className="w-8 h-8 flex items-center justify-center hover:scale-150 transition-transform"
                  onClick={() => handleEdit(athlete)}
                  title="Editar"
                >
                  <img src="/icon/pencil.svg" alt="Editar" className="w-5 h-5" />
                </button>
              )}
              <button
                className="w-8 h-8 flex items-center justify-center hover:scale-150 transition-transform"
                onClick={() => handleDelete(athlete.id || '')}
                disabled={!athlete.id}
                title="Excluir"
              >
                <img src="/icon/trash.svg" alt="Excluir" className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            className="px-3 py-1 rounded border border-black bg-white hover:bg-gray-200 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="mx-2 text-sm font-semibold">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border border-black bg-white hover:bg-gray-200 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

