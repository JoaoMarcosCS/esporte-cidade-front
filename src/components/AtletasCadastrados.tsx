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
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nome</th>
            <th className="border px-2 py-1">CPF</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Telefone</th>
            <th className="border px-2 py-1">Foto</th>
            <th className="border px-2 py-1">Ações</th>
          </tr>
        </thead>
        <tbody>
          
          {athletes.map((athlete, idx) => (
            
            <tr
              key={athlete.id || idx}
              className={selectedAthlete && athlete.id === selectedAthlete.id ? 'bg-blue-100' : ''}
            >
              
              <td className="border px-2 py-1">{athlete.name}</td>
              <td className="border px-2 py-1">{formatCpf(athlete.cpf)}</td>
              <td className="border px-2 py-1">{athlete.email}</td>
              <td className="border px-2 py-1">{formatPhone(athlete.phone)}</td>
              <td className="border px-2 py-1">
                <img
                  src={
                      athlete.athletePhotoUrl || 'https://via.placeholder.com/40'
                  }
                  alt={`Foto de ${athlete.name || 'atleta'}`}
                  className="h-10 w-10 border border-black cursor-pointer rounded-full"
                />
                
              </td>
              <td className="border px-2 py-1 space-x-2">
                {onEdit && (
                  <button
                    className="w-7"
                    onClick={() => handleEdit(athlete)}
                  >
                    <img src="/icon/pencil.svg" alt="Editar" className="w-full" />
                  </button>
                )}
                <button
                  className="w-7"
                  onClick={() => handleDelete(athlete.id || '')}
                  disabled={!athlete.id}
                >
                  <img src="/icon/trash.svg" alt="Editar" className="w-full" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

