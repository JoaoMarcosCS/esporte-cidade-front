import React from 'react';
import HomeAtleta from './pages/HomeAtleta'
import Chamada from './pages/Chamada';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="">
      <Outlet/>
    </div>
  );
}

export default App;