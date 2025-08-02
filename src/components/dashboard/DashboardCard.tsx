import React from "react";
import { Link } from "react-router-dom";
import './Dashboard.css';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  link: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, link }) => {
  return (
    <Link to={link} className="dashboard-card">
      <div className="dashboard-card-icon">{icon}</div>
      <div className="dashboard-card-title">{title}</div>
    </Link>
  );
};

export default DashboardCard;
