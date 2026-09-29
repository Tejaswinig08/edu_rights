import React from "react";

const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className={`stat-card stat-${color || "default"}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
