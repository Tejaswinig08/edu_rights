import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, BookOpen, Home, Library } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import toast from "react-hot-toast";

const DashboardHeader = ({ onEditProfile }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t("loggedOutSuccess"));
      navigate("/login");
    } catch (err) {
      toast.error(t("logoutFailed"));
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
          <span>{t("navDashboard")}</span>
        </NavLink>
        <NavLink to="/modules">
          <BookOpen size={18} />
          <span>{t("navModules")}</span>
        </NavLink>
        <NavLink to="/knowledge">
          <Library size={18} />
          <span>{t("navKnowledge")}</span>
        </NavLink>
        <a
          href="/dashboard#dashboard-feedback"
          onClick={(e) => {
            if (window.location.pathname === "/dashboard") {
              e.preventDefault();
              const el = document.getElementById("dashboard-feedback");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }
          }}
          style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: "inherit", fontWeight: 600, fontSize: 14 }}
        >
          <span style={{ fontSize: 16 }}>⭐</span>
          <span>Feedback</span>
        </a>
        {user?.role === "admin" && (
          <NavLink to="/admin" style={{ color: "#e67e22", fontWeight: 700 }}>
            <span style={{ fontSize: 16 }}>🛡️</span>
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      <div className="user-section">
        <LanguageSelector />
        <div
          className="user-pill"
          onClick={onEditProfile}
          style={onEditProfile ? { cursor: "pointer" } : undefined}
          title={onEditProfile ? (t("profile") || "Update Profile") : undefined}
          role={onEditProfile ? "button" : undefined}
          tabIndex={onEditProfile ? 0 : undefined}
          onKeyDown={onEditProfile ? (e) => { if (e.key === "Enter" || e.key === " ") onEditProfile(); } : undefined}
        >
          <div className="user-avatar">{initial}</div>
          <span className="user-name">{user?.name}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn" title={t("logout")}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
