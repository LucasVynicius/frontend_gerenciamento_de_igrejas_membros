import React, { ReactNode } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;