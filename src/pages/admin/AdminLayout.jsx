import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
<<<<<<< HEAD
=======
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
>>>>>>> origin/feature/tejaswini-final
import "../../styles/admin.css";

// ==========================================
// ADMIN NAV ITEMS
// ==========================================

const NAV_ITEMS = [
<<<<<<< HEAD
  { icon: "🏠", label: "Dashboard",     path: "/admin",            end: true  },
  { icon: "👥", label: "Users",         path: "/admin/users"                  },
  { icon: "📚", label: "Modules",       path: "/admin/modules"                },
  { icon: "🧩", label: "Quizzes",       path: "/admin/quizzes"                },
  { icon: "📰", label: "Knowledge Hub", path: "/admin/knowledge"              },
  { icon: "💬", label: "Feedback",      path: "/admin/feedback"               },
  { icon: "📊", label: "Analytics",     path: "/admin/analytics"              },
  { icon: "⚙️", label: "Settings",      path: "/admin/settings"               },
=======
  { icon: LayoutDashboard, label: "Dashboard",     path: "/admin",            end: true  },
  { icon: Users,           label: "Users",         path: "/admin/users"                  },
  { icon: BookOpen,        label: "Modules",       path: "/admin/modules"                },
  { icon: Puzzle,          label: "Quizzes",       path: "/admin/quizzes"                },
  { icon: Newspaper,       label: "Knowledge Hub", path: "/admin/knowledge"              },
  { icon: MessageSquare,   label: "Feedback",      path: "/admin/feedback"               },
  { icon: BarChart3,       label: "Analytics",     path: "/admin/analytics"              },
  { icon: Settings,        label: "Settings",      path: "/admin/settings"               },
>>>>>>> origin/feature/tejaswini-final
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
<<<<<<< HEAD
          <span>🎓</span>
=======
>>>>>>> origin/feature/tejaswini-final
          <h2>EduRights</h2>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/feature/tejaswini-final
          <NavLink
            to="/dashboard"
            className="admin-nav-item"
            style={{ marginTop: "12px", borderTop: "1px solid #2d3f55", color: "#68d391" }}
          >
<<<<<<< HEAD
            <span>🎒</span>
            Student Dashboard
=======
            <ArrowLeft size={16} />
            <span>Student Dashboard</span>
>>>>>>> origin/feature/tejaswini-final
          </NavLink>
        </nav>

        {/* Footer / Logout */}
        <div className="admin-sidebar-footer">
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
<<<<<<< HEAD
          >
            🚪 Logout
=======
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <LogOut size={14} />
            <span>Logout</span>
>>>>>>> origin/feature/tejaswini-final
          </button>
        </div>

      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="admin-main">

        {/* Top bar */}
        <header className="admin-topbar">
          <h1>{pageTitle || "Admin Panel"}</h1>
          <div className="admin-topbar-info">
<<<<<<< HEAD
            👤&nbsp;
=======
>>>>>>> origin/feature/tejaswini-final
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
