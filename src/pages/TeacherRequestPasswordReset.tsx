import React, { useState } from 'react';
import api from '../services/api'; // Assuming you have an API service
import { useNavigate } from 'react-router-dom';

const TeacherRequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    try {
      await api.post('/teacher/password-reset', { email });
      
      setMessage('Se o email estiver cadastrado, um link para redefinição de senha foi enviado.');
      setEmail('');
    } catch (err) {
      setError('Ocorreu um erro ao tentar solicitar a redefinição de senha. Tente novamente.');
      console.error('Password reset request failed:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h2>Recuperar Senha do Professor</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Enviar Link de Redefinição
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginTop: '20px', padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Voltar
      </button>
    </div>
  );
};

export default TeacherRequestPasswordReset;
