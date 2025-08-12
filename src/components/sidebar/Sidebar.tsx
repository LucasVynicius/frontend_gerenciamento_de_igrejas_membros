import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaChurch, FaCog, FaSignOutAlt, FaUserCog, FaUserGraduate } from 'react-icons/fa';
import useAuth from '../../context/useAuth';
import { Role } from '../../enums/Role';
import './Sidebar.css';

const Sidebar: React.FC = () => {

  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/" >
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
        </NavLink>
      </div>
      <nav className="sidebar-nav">
        <ul>

          <li><NavLink to="/" end className="nav-item"><FaHome /><span>Dashboard</span></NavLink></li>
          <li><NavLink to="/igrejas" className="nav-item"><FaChurch /><span>Igrejas</span></NavLink></li>
          <li><NavLink to="/membros" className="nav-item"><FaUsers /><span>Membros</span></NavLink></li>
          <li><NavLink to="/ministros" className="nav-item"><FaUserGraduate /><span>Ministros</span></NavLink></li>
          <li><NavLink to="/configuracoes" className="nav-item"><FaCog /><span>Configurações</span></NavLink></li>

          {user?.role === Role.ADMIN && (
            <li>
              <NavLink to="/admin/users" className="nav-item">
                <FaUserCog />
                <span>Gerenciar Usuários</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="sidebar-footer">

        <button onClick={logout} className="logout-btn">
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;