import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [viewFeedback, setViewFeedback] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchFeedbacks = async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 15 });
      if (statusFilter) params.append("status", statusFilter);
      if (ratingFilter) params.append("rating", ratingFilter);
      const res = await api.get(`/admin/feedback?${params}`);
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks);
        setTotal(res.data.total);
        setPages(res.data.pages);
        setPage(pg);
      }
    } catch {
      setAlert({ type: "error", msg: "Failed to load feedback." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(1); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/feedback/${id}/status`, { status });
      setAlert({ type: "success", msg: `Marked as ${status}.` });
      fetchFeedbacks(page);
      if (viewFeedback?._id === id) setViewFeedback((prev) => ({ ...prev, status }));
    } catch {
      setAlert({ type: "error", msg: "Status update failed." });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/feedback/${id}`);
      setAlert({ type: "success", msg: "Feedback deleted." });
      setDeleteConfirm(null);
      setViewFeedback(null);
      fetchFeedbacks(page);
    } catch {
      setAlert({ type: "error", msg: "Delete failed." });
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  const getModuleTitle = (m) => {
    if (!m) return "Unknown";
    return typeof m.title === "object" ? m.title.en || m.title.mr || "" : m.title;
  };

  return (
    <AdminLayout pageTitle="Feedback">
      {alert.msg && (
        <div className={`admin-alert ${alert.type}`} onClick={() => setAlert({ type: "", msg: "" })}>{alert.msg}</div>
      )}

      <div className="admin-page-header">
        <h2>💬 Feedback ({total})</h2>
      </div>

      <div className="admin-search-bar">
        <select className="admin-form-select" style={{ padding: "9px 14px" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
        <select className="admin-form-select" style={{ padding: "9px 14px" }} value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => fetchFeedbacks(1)}>Filter</button>
      </div>

      <div className="admin-card">
        {loading ? <div className="admin-loading">Loading...</div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Module</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length === 0 && <tr><td colSpan={7} className="admin-empty">No feedback found.</td></tr>}
                {feedbacks.map((f) => (
                  <tr key={f._id}>
                    <td>{f.user?.name || "Unknown"}</td>
                    <td>{getModuleTitle(f.module)}</td>
                    <td><span style={{ color: "#f39c12", fontWeight: 700 }}>{stars(f.rating)}</span></td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, color: "#7f8c8d" }}>
                      {f.comment || <em>No comment</em>}
                    </td>
                    <td><span className={`badge ${f.status}`}>{f.status}</span></td>
                    <td>{fmt(f.createdAt)}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewFeedback(f)}>View</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(f)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="admin-pagination">
            <button disabled={page === 1} onClick={() => fetchFeedbacks(page - 1)}>← Prev</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={page === p ? "active" : ""} onClick={() => fetchFeedbacks(p)}>{p}</button>
            ))}
            <button disabled={page === pages} onClick={() => fetchFeedbacks(page + 1)}>Next →</button>
          </div>
        )}
      </div>

      {/* View / Manage Modal */}
      {viewFeedback && (
        <div className="admin-modal-overlay" onClick={() => setViewFeedback(null)}>
          <div className="admin-modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Feedback Details</h3>
              <button className="admin-modal-close" onClick={() => setViewFeedback(null)}>✕</button>
            </div>
            <p><strong>User:</strong> {viewFeedback.user?.name} ({viewFeedback.user?.email})</p>
            <p><strong>Module:</strong> {getModuleTitle(viewFeedback.module)}</p>
            <p><strong>Rating:</strong> <span style={{ color: "#f39c12", fontSize: 18 }}>{stars(viewFeedback.rating)}</span> {viewFeedback.rating}/5</p>
            <p><strong>Status:</strong> <span className={`badge ${viewFeedback.status}`}>{viewFeedback.status}</span></p>
<<<<<<< HEAD
            <p><strong>Date:</strong> {fmt(viewFeedback.createdAt)}</p>
            <div style={{ marginTop: 12, padding: 12, background: "#f8f9fa", borderRadius: 8, fontSize: 14 }}>
              {viewFeedback.comment || <em style={{ color: "#7f8c8d" }}>No comment provided.</em>}
            </div>
=======
            <div style={{ marginTop: 12, padding: 12, background: "#f8f9fa", borderRadius: 8, fontSize: 14 }}>
              <strong>Original Comment:</strong>
              <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>
                {viewFeedback.comment || <em style={{ color: "#7f8c8d" }}>No comment provided.</em>}
              </div>
              {viewFeedback.detectedLanguage && (
                <div style={{ fontSize: 12, color: "#7f8c8d", marginTop: 6 }}>
                  Detected language: <code>{viewFeedback.detectedLanguage.toUpperCase()}</code>
                </div>
              )}
            </div>

            {viewFeedback.translations && Object.keys(viewFeedback.translations).length > 0 && (
              <div style={{ marginTop: 12, padding: 12, background: "#f0f7ff", borderRadius: 8, fontSize: 13, border: "1px solid #d0e4ff" }}>
                <strong style={{ color: "#1e3a8a", display: "block", marginBottom: 6 }}>Automated Translations:</strong>
                {Object.entries(viewFeedback.translations).map(([lang, text]) => {
                  if (!text || text === viewFeedback.comment) return null;
                  const langLabels = { hi: "Hindi (हिन्दी)", mr: "Marathi (मराठी)", es: "Spanish (Español)", en: "English" };
                  return (
                    <div key={lang} style={{ marginBottom: 6, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600, color: "#2563eb" }}>{langLabels[lang] || lang}:</span> {text}
                    </div>
                  );
                })}
              </div>
            )}
>>>>>>> origin/feature/tejaswini-final
            <div className="admin-modal-actions">
              {viewFeedback.status !== "reviewed" && (
                <button className="btn btn-primary" onClick={() => handleStatusChange(viewFeedback._id, "reviewed")}>
                  Mark Reviewed
                </button>
              )}
<<<<<<< HEAD
              {viewFeedback.status !== "resolved" && (
                <button className="btn btn-success" onClick={() => handleStatusChange(viewFeedback._id, "resolved")}>
                  Mark Resolved
                </button>
              )}
=======
>>>>>>> origin/feature/tejaswini-final
              <button className="btn btn-danger" onClick={() => setDeleteConfirm(viewFeedback)}>Delete</button>
              <button className="btn btn-ghost" onClick={() => setViewFeedback(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Delete Feedback</h3>
            <p>Delete feedback by <strong>{deleteConfirm.user?.name}</strong>?</p>
            <div className="admin-modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFeedback;
