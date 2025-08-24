import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaChurch, FaSignOutAlt, FaUserCog, FaUserGraduate, FaFileContract, FaLock, FaTimes } from 'react-icons/fa';
import useAuth from '../../context/useAuth';
import { Role } from '../../enums/Role';
import './Sidebar.css';

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        // A classe 'open' é adicionada ou removida de acordo com a prop 'isSidebarOpen'
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                {/* Botão para fechar a sidebar em telas pequenas */}
                <button className="close-btn" onClick={toggleSidebar}>
                    <FaTimes />
                </button>
                <NavLink to="/" >
                    <img src="/logo.png" alt="Logo" className="sidebar-logo" />
                </NavLink>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {/* ... seus links de navegação ... */}
                    <li>
                        <NavLink to="/" end className="nav-item">
                            <FaHome />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/igrejas" className="nav-item">
                            <FaChurch />
                            <span>Igrejas</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/membros" className="nav-item">
                            <FaUsers />
                            <span>Membros</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/ministros" className="nav-item">
                            <FaUserGraduate />
                            <span>Ministros</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/oficios" className="nav-item">
                            <FaFileContract />
                            <span>Ofícios</span>
                        </NavLink>
                    </li>

                    {/* Links que só aparecem para o ADMIN */}
                    {user?.role === Role.ADMIN && (
                        <li>
                            <NavLink to="/permissoes" className="nav-item">
                                <FaLock />
                                <span>Permissões</span>
                            </NavLink>
                        </li>
                    )}

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