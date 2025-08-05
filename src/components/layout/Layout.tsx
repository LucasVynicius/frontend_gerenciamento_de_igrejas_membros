// Em: src/components/layout/Layout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar'; // Verifique se o caminho para sua sidebar está correto
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <main className="page-content">
          {/* O Outlet é o espaço onde o conteúdo da sua rota (Dashboard, MemberPage, etc.) será renderizado */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;