import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ type: "", msg: "" });

  const fetchUsers = async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 15 });
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);
      const res = await api.get(`/admin/users?${params}`);
      if (res.data.success) {
        setUsers(res.data.users);
        setTotal(res.data.total);
        setPages(res.data.pages);
        setPage(pg);
      }
    } catch {
      setAlert({ type: "error", msg: "Failed to load users." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(1); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const openUser = async (userId) => {
    try {
      const res = await api.get(`/admin/users/${userId}`);
      if (res.data.success) setSelectedUser(res.data);
    } catch {
      setAlert({ type: "error", msg: "Failed to load user details." });
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <AdminLayout pageTitle="User Management">
      {alert.msg && (
        <div className={`admin-alert ${alert.type}`} onClick={() => setAlert({ type: "", msg: "" })}>
          {alert.msg}
        </div>
      )}

      <div className="admin-page-header">
        <h2>👥 All Users ({total})</h2>
      </div>

      <form className="admin-search-bar" onSubmit={handleSearch}>
        <input
          className="admin-search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-form-select"
          style={{ width: "auto", padding: "9px 14px" }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Level</th>
                  <th>Points</th>
                  <th>Badges</th>
                  <th>Completed</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={9} className="admin-empty">No users found.</td></tr>
                )}
                {users.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                    <td>Level {u.level}</td>
                    <td>{u.points}</td>
                    <td>{u.badges?.length || 0}</td>
                    <td>{u.completedModules}</td>
                    <td>{fmt(u.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openUser(u._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="admin-pagination">
            <button disabled={page === 1} onClick={() => fetchUsers(page - 1)}>← Prev</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={page === p ? "active" : ""} onClick={() => fetchUsers(p)}>{p}</button>
            ))}
            <button disabled={page === pages} onClick={() => fetchUsers(page + 1)}>Next →</button>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">👤 {selectedUser.user.name}</h3>
              <button className="admin-modal-close" onClick={() => setSelectedUser(null)}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p><strong>Email:</strong> {selectedUser.user.email}</p>
              <p><strong>Role:</strong> <span className={`badge ${selectedUser.user.role}`}>{selectedUser.user.role}</span></p>
              <p><strong>Points:</strong> {selectedUser.user.points} &nbsp; <strong>Level:</strong> {selectedUser.user.level}</p>
              <p><strong>Badges:</strong> {selectedUser.user.badges?.map((b) => <span key={b.name} title={b.name}>{b.icon} </span>)}</p>
            </div>

            <h4 style={{ marginBottom: 8, color: "#2c3e50" }}>Module Progress</h4>
            {selectedUser.progress.length === 0 ? (
              <p style={{ color: "#7f8c8d" }}>No progress yet.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr><th>Module</th><th>Score</th><th>Status</th><th>Completed</th></tr>
                </thead>
                <tbody>
                  {selectedUser.progress.map((p) => (
                    <tr key={p._id}>
                      <td>{p.moduleId?.icon} {p.moduleId?.title}</td>
                      <td>{p.quizScore}%</td>
                      <td>{p.completed ? "✅ Done" : "⏳ In progress"}</td>
                      <td>{p.completedAt ? fmt(p.completedAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="admin-modal-actions">
              <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
