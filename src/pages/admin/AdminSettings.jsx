import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <AdminLayout pageTitle="Settings">
      <div className="admin-page-header">
        <h2>⚙️ Settings</h2>
      </div>

      <div className="admin-card" style={{ maxWidth: 500 }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">👤 Admin Profile</h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Name</label>
            <input className="admin-form-input" value={user?.name || ""} readOnly style={{ background: "#f8f9fa" }} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Email</label>
            <input className="admin-form-input" value={user?.email || ""} readOnly style={{ background: "#f8f9fa" }} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Role</label>
            <input className="admin-form-input" value={user?.role || ""} readOnly style={{ background: "#f8f9fa", textTransform: "capitalize" }} />
          </div>
        </div>

        <div style={{ marginTop: 20, padding: 12, background: "#fef3e2", borderRadius: 8, fontSize: 13, color: "#7f8c8d" }}>
          ℹ️ To change your name, email, or password, please contact the system administrator or update directly in MongoDB.
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 500, marginTop: 20 }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">🔐 Session</h3>
        </div>
        <p style={{ color: "#7f8c8d", fontSize: 14, marginBottom: 16 }}>
          You are currently logged in as <strong>{user?.name}</strong> with admin privileges.
        </p>
        <button className="btn btn-danger" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="admin-card" style={{ maxWidth: 500, marginTop: 20 }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">📋 System Info</h3>
        </div>
        <table className="admin-table">
          <tbody>
            <tr><td><strong>Application</strong></td><td>EduRights Admin</td></tr>
            <tr><td><strong>Backend</strong></td><td>Node.js + Express</td></tr>
            <tr><td><strong>Database</strong></td><td>MongoDB (Atlas)</td></tr>
            <tr><td><strong>Frontend</strong></td><td>React + Vite</td></tr>
            <tr><td><strong>Auth</strong></td><td>JWT (Bearer token)</td></tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
