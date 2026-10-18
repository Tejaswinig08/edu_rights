import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Puzzle,
  Newspaper,
  MessageSquare,
  BarChart3,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import "../../styles/admin.css";

// ==========================================
// ADMIN NAV ITEMS
// ==========================================

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",     path: "/admin",            end: true  },
  { icon: Users,           label: "Users",         path: "/admin/users"                  },
  { icon: BookOpen,        label: "Modules",       path: "/admin/modules"                },
  { icon: Puzzle,          label: "Quizzes",       path: "/admin/quizzes"                },
  { icon: Newspaper,       label: "Knowledge Hub", path: "/admin/knowledge"              },
  { icon: MessageSquare,   label: "Feedback",      path: "/admin/feedback"               },
  { icon: BarChart3,       label: "Analytics",     path: "/admin/analytics"              },
  { icon: Settings,        label: "Settings",      path: "/admin/settings"               },
];

// ==========================================
// ADMIN LAYOUT
// Shell for all admin pages. Renders the
// dark sidebar + topbar + children content.
// ==========================================

function AdminLayout({ children, pageTitle }) {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ----------------------------------------
  // LOGOUT
  // ----------------------------------------

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <div className="admin-layout">

      {/* ===== SIDEBAR ===== */}
      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="admin-sidebar-logo">
          <h2>EduRights</h2>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end ?? false}
                className={({ isActive }) =>
                  `admin-nav-item${isActive ? " active" : ""}`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <NavLink
            to="/dashboard"
            className="admin-nav-item"
            style={{ marginTop: "12px", borderTop: "1px solid #2d3f55", color: "#68d391" }}
          >
            <ArrowLeft size={16} />
            <span>Student Dashboard</span>
          </NavLink>
        </nav>

        {/* Footer / Logout */}
        <div className="admin-sidebar-footer">
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="admin-main">

        {/* Top bar */}
        <header className="admin-topbar">
          <h1>{pageTitle || "Admin Panel"}</h1>
          <div className="admin-topbar-info">
            {user?.name || user?.email || "Admin"}
            &nbsp;·&nbsp;
            <strong>Admin</strong>
          </div>
        </header>

        {/* Page content */}
        {children}

      </div>

    </div>
  );
}

export default AdminLayout;
