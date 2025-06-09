import React, { useState } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import HeaderBasic from '../components/navigation/HeaderBasic';
import { Toaster } from "react-hot-toast";
import { Button } from '../components/ui/button';

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
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
        <HeaderBasic logo="hide" />
        <main className="flex flex-col items-center flex-1">
          <div className="flex flex-col m-4 md:mx-20 p-4 md:px-24 py-7 md:py-12 w-full max-w-5xl">
            <div className="text-start px-8 mb-8">
              <h2 className="text-4xl font-bold pb-2">
                Recuperar <span className="text-orange-600">Senha do Professor</span>
              </h2>
              <p className="font-inter">Informe seu e-mail para receber o link de redefinição.</p>
            </div>
            <form
              className="bg- p-8 rounded-lg w-full"
              onSubmit={handleSubmit}
            >
              <section className="mb-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="mb4">
                    <label
                      htmlFor="email"
                      className="block text-sm pb-2 font-medium text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Preencha com seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 bg-[#D9D9D9] opacity-70 placeholder-black h-12 p-3 border border-black rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-orange-600 focus:ring-opacity-40"
                      required
                    />
                    {error && (
                      <p className="text-xs text-red-400 mt-1">{error}</p>
                    )}
                    {message && (
                      <p className="text-xs text-green-600 mt-1">{message}</p>
                    )}
                  </div>
                </div>
              </section>
              <div className="py-10 flex justify-end gap-7">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="h-13 md:w-52 font-bold font-inter bg-gray-200 text-gray-700 py-3 px-9 rounded-lg hover:bg-gray-300 transition duration-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="h-13 md:w-52 font-bold font-inter bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Enviar Link
                </button>
              </div>
            </form>
          </div>
        </main>
        <footer className="w-full text-center mt-auto">
          <p className="text-sm text-gray-500">
            2024 Esporte na cidade. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default TeacherRequestPasswordReset;
