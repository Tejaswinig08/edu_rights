import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, BookOpen, Home, Library } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <header className="dashboard-header">
      <div className="brand-logo">
        <span className="brand-icon">⚖</span>
        <span className="brand-text">EduRight</span>
      </div>

      <nav className="dashboard-nav">
        <NavLink to="/dashboard" end>
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/modules">
          <BookOpen size={18} />
          <span>Modules</span>
        </NavLink>
        <NavLink to="/knowledge">
          <Library size={18} />
          <span>Knowledge Hub</span>
        </NavLink>
      </nav>

      <div className="user-section">
        <div className="user-pill">
          <div className="user-avatar">{initial}</div>
          <span className="user-name">{user?.name}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
