// src/App.tsx ou src/components/ui/Home.tsx
import React from 'react';
import ChamadaComp from '../components/ChamadaComp';

const Chamada: React.FC = () => {
  const userType: 'professor' | 'atleta' = 'professor'; // Defina o tipo de usuário aqui

  return (
    <div>
      <ChamadaComp userType={userType} />
    </div>
  );
};

export default Chamada;
