import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Assuming you have an API service
import { useParams, useNavigate } from 'react-router-dom';

const TeacherResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { teacherId, token } = useParams<{ teacherId: string; token: string }>(); // Get teacherId and token from URL
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !teacherId) {
      setError('Link de redefinição inválido ou ausente de informações.');
      // Optionally redirect or disable form
    }
  }, [token, teacherId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Por favor, preencha ambos os campos de senha.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!token || !teacherId) {
      setError('Link de redefinição inválido. Solicite um novo link.');
      return;
    }

    try {
      await api.post(`/teacher/password-reset/${teacherId}/${token}`, { password });
      

      setMessage('Sua senha foi redefinida com sucesso! Você pode fazer login com sua nova senha.');
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        navigate('/login-professor');
      }, 3000);
    } catch (err) {
      setError('Ocorreu um erro ao tentar redefinir a senha. O link pode ter expirado ou ser inválido. Tente novamente.');
      console.error('Password reset failed:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h2>Redefinir Senha do Professor</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Nova Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua nova senha"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirmar Nova Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua nova senha"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} disabled={!token || !teacherId}>
          Redefinir Senha
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
      {(!token || !teacherId) && <p style={{color: 'orange', marginTop: '15px'}}>Se você chegou aqui sem um link válido ou completo, por favor, solicite a recuperação de senha novamente.</p>}
    </div>
  );
};

export default TeacherResetPassword;
