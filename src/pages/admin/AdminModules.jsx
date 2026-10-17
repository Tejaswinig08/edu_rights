import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const EMPTY_MODULE = {
  title: "", slug: "", description: "", icon: "", content: "",
  order: 1, pointsReward: 50, requiredLevel: 1, videoUrls: [],
};

const AdminModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [showModal, setShowModal] = useState(false);
  const [editModule, setEditModule] = useState(null);
  const [form, setForm] = useState(EMPTY_MODULE);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/modules");
      if (res.data.success) setModules(res.data.modules);
    } catch {
      setAlert({ type: "error", msg: "Failed to load modules." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModules(); }, []);

  const openCreate = () => {
    setEditModule(null);
    setForm(EMPTY_MODULE);
    setShowModal(true);
  };

  const openEdit = (mod) => {
    setEditModule(mod);
    setForm({
      title: mod.title || "",
      slug: mod.slug || "",
      description: mod.description || "",
      icon: mod.icon || "",
      content: mod.content || "",
      order: mod.order || 1,
      pointsReward: mod.pointsReward || 50,
      requiredLevel: mod.requiredLevel || 1,
      videoUrls: mod.videoUrls || [],
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      setAlert({ type: "error", msg: "Title and slug are required." });
      return;
    }
    setSaving(true);
    try {
      if (editModule) {
        await api.put(`/admin/modules/${editModule._id}`, form);
        setAlert({ type: "success", msg: "Module updated!" });
      } else {
        await api.post("/admin/modules", form);
        setAlert({ type: "success", msg: "Module created!" });
      }
      setShowModal(false);
      fetchModules();
    } catch (err) {
      setAlert({ type: "error", msg: err.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/modules/${id}`);
      setAlert({ type: "success", msg: "Module deleted." });
      setDeleteConfirm(null);
      fetchModules();
    } catch {
      setAlert({ type: "error", msg: "Delete failed." });
    }
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <AdminLayout pageTitle="Modules">
      {alert.msg && (
        <div className={`admin-alert ${alert.type}`} onClick={() => setAlert({ type: "", msg: "" })}>{alert.msg}</div>
      )}

      <div className="admin-page-header">
        <h2>📚 Learning Modules ({modules.length})</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ New Module</button>
      </div>

      <div className="admin-card">
        {loading ? <div className="admin-loading">Loading...</div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Points</th>
                  <th>Level Req.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.length === 0 && <tr><td colSpan={7} className="admin-empty">No modules.</td></tr>}
                {modules.map((m) => (
                  <tr key={m._id}>
                    <td>{m.order}</td>
                    <td style={{ fontSize: 20 }}>{m.icon}</td>
                    <td><strong>{typeof m.title === "object" ? m.title.en || m.title.mr : m.title}</strong></td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{m.slug}</td>
                    <td>+{m.pointsReward} XP</td>
                    <td>Level {m.requiredLevel}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(m)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{editModule ? "Edit Module" : "New Module"}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Title *</label>
                  <input className="admin-form-input" value={form.title} onChange={(e) => setField("title", e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Slug *</label>
                  <input className="admin-form-input" value={form.slug} onChange={(e) => setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} required />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Icon (emoji)</label>
                  <input className="admin-form-input" value={form.icon} onChange={(e) => setField("icon", e.target.value)} placeholder="📚" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Order</label>
                  <input className="admin-form-input" type="number" min="1" value={form.order} onChange={(e) => setField("order", Number(e.target.value))} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Points Reward</label>
                  <input className="admin-form-input" type="number" min="0" value={form.pointsReward} onChange={(e) => setField("pointsReward", Number(e.target.value))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Required Level</label>
                  <input className="admin-form-input" type="number" min="1" value={form.requiredLevel} onChange={(e) => setField("requiredLevel", Number(e.target.value))} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <input className="admin-form-input" value={form.description} onChange={(e) => setField("description", e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Content</label>
                <textarea className="admin-form-textarea" value={form.content} onChange={(e) => setField("content", e.target.value)} style={{ minHeight: 160 }} />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editModule ? "Update Module" : "Create Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12, color: "#2c3e50" }}>⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{typeof deleteConfirm.title === "object" ? deleteConfirm.title.en : deleteConfirm.title}</strong>?</p>
            <p style={{ color: "#e74c3c", fontSize: 13 }}>This will also delete associated quiz, progress and feedback. This action cannot be undone.</p>
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

export default AdminModules;
