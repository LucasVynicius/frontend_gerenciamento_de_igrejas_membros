import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar'; 
import { FaBars } from 'react-icons/fa';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="layout-container">
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <FaBars />
            </button>
            
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;