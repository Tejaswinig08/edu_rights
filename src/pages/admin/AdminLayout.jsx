import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

// ==========================================
// ADMIN NAV ITEMS
// ==========================================

const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard",     path: "/admin",            end: true  },
  { icon: "👥", label: "Users",         path: "/admin/users"                  },
  { icon: "📚", label: "Modules",       path: "/admin/modules"                },
  { icon: "🧩", label: "Quizzes",       path: "/admin/quizzes"                },
  { icon: "📰", label: "Knowledge Hub", path: "/admin/knowledge"              },
  { icon: "💬", label: "Feedback",      path: "/admin/feedback"               },
  { icon: "📊", label: "Analytics",     path: "/admin/analytics"              },
  { icon: "⚙️", label: "Settings",      path: "/admin/settings"               },
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
          <span>🎓</span>
          <h2>EduRights</h2>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end ?? false}
              className={({ isActive }) =>
                `admin-nav-item${isActive ? " active" : ""}`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/dashboard"
            className="admin-nav-item"
            style={{ marginTop: "12px", borderTop: "1px solid #2d3f55", color: "#68d391" }}
          >
            <span>🎒</span>
            Student Dashboard
          </NavLink>
        </nav>

        {/* Footer / Logout */}
        <div className="admin-sidebar-footer">
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>

      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="admin-main">

        {/* Top bar */}
        <header className="admin-topbar">
          <h1>{pageTitle || "Admin Panel"}</h1>
          <div className="admin-topbar-info">
            👤&nbsp;
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
