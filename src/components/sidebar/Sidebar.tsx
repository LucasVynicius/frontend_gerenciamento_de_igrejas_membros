import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaChurch, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="./logo.png" alt="Logo" className="sidebar-logo" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><NavLink to="/" end className="nav-item active"><FaHome /><span>Dashboard</span></NavLink></li>
          <li><Link to="/membros" className="nav-item"><FaUsers /><span>Membros</span></Link></li>
          <li><Link to="/igrejas" className="nav-item"><FaChurch /><span>Igrejas</span></Link></li>
          <li><Link to="/configuracoes" className="nav-item"><FaCog /><span>Configurações</span></Link></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn"><FaSignOutAlt /><span>Sair</span></button>
      </div>
    </div>
  );
};

export default Sidebar;