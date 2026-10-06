import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const EMPTY_ARTICLE = { title: "", category: "article", content: "", tags: "", sourceUrl: "", source: "", moduleSlug: "" };

const AdminKnowledge = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [showModal, setShowModal] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [form, setForm] = useState(EMPTY_ARTICLE);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [viewArticle, setViewArticle] = useState(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (catFilter) params.append("category", catFilter);
      const res = await api.get(`/admin/knowledge?${params}`);
      if (res.data.success) setArticles(res.data.articles);
    } catch {
      setAlert({ type: "error", msg: "Failed to load knowledge hub." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const getTitle = (a) => typeof a.title === "object" ? a.title.en || a.title.mr || "" : a.title;
  const getContent = (a) => typeof a.content === "object" ? a.content.en || a.content.mr || "" : a.content;

  const openCreate = () => {
    setEditArticle(null);
    setForm(EMPTY_ARTICLE);
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditArticle(a);
    setForm({
      title: getTitle(a),
      category: a.category,
      content: getContent(a),
      tags: (a.tags || []).join(", "),
      sourceUrl: a.sourceUrl || "",
      source: a.source || "",
      moduleSlug: a.moduleSlug || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setAlert({ type: "error", msg: "Title and content are required." });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      if (editArticle) {
        await api.put(`/admin/knowledge/${editArticle._id}`, payload);
        setAlert({ type: "success", msg: "Article updated!" });
      } else {
        await api.post("/admin/knowledge", payload);
        setAlert({ type: "success", msg: "Article created!" });
      }
      setShowModal(false);
      fetchArticles();
    } catch (err) {
      setAlert({ type: "error", msg: err.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/knowledge/${id}`);
      setAlert({ type: "success", msg: "Article deleted." });
      setDeleteConfirm(null);
      fetchArticles();
    } catch {
      setAlert({ type: "error", msg: "Delete failed." });
    }
  };

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <AdminLayout pageTitle="Knowledge Hub">
      {alert.msg && (
        <div className={`admin-alert ${alert.type}`} onClick={() => setAlert({ type: "", msg: "" })}>{alert.msg}</div>
      )}

      <div className="admin-page-header">
        <h2>📰 Knowledge Hub ({articles.length})</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ New Article</button>
      </div>

      <div className="admin-search-bar">
        <input className="admin-search-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchArticles()} />
        <select className="admin-form-select" style={{ width: "auto", padding: "9px 14px" }} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="article">Articles</option>
          <option value="faq">FAQs</option>
          <option value="case-study">Case Studies</option>
        </select>
        <button className="btn btn-primary" onClick={fetchArticles}>Search</button>
      </div>

      <div className="admin-card">
        {loading ? <div className="admin-loading">Loading...</div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Title</th><th>Category</th><th>Source</th><th>Tags</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {articles.length === 0 && <tr><td colSpan={5} className="admin-empty">No articles found.</td></tr>}
                {articles.map((a) => (
                  <tr key={a._id}>
                    <td style={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <strong>{getTitle(a)}</strong>
                    </td>
                    <td><span className={`badge ${a.category}`}>{a.category}</span></td>
                    <td style={{ fontSize: 12, color: "#7f8c8d" }}>{a.source || "—"}</td>
                    <td style={{ fontSize: 12 }}>{(a.tags || []).slice(0, 3).join(", ") || "—"}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewArticle(a)}>View</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(a)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(a)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewArticle && (
        <div className="admin-modal-overlay" onClick={() => setViewArticle(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{getTitle(viewArticle)}</h3>
              <button className="admin-modal-close" onClick={() => setViewArticle(null)}>✕</button>
            </div>
            <p><span className={`badge ${viewArticle.category}`}>{viewArticle.category}</span></p>
            <p style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7, color: "#2c3e50" }}>{getContent(viewArticle)}</p>
            {viewArticle.source && <p style={{ fontSize: 12, color: "#7f8c8d" }}>Source: {viewArticle.source}</p>}
            {viewArticle.sourceUrl && <a href={viewArticle.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>View Source ↗</a>}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{editArticle ? "Edit Article" : "New Article"}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Title *</label>
                  <input className="admin-form-input" value={form.title} onChange={(e) => setField("title", e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Category *</label>
                  <select className="admin-form-select" value={form.category} onChange={(e) => setField("category", e.target.value)}>
                    <option value="article">Article</option>
                    <option value="faq">FAQ</option>
                    <option value="case-study">Case Study</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Content *</label>
                <textarea className="admin-form-textarea" value={form.content} onChange={(e) => setField("content", e.target.value)} required style={{ minHeight: 160 }} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Source</label>
                  <input className="admin-form-input" value={form.source} onChange={(e) => setField("source", e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Source URL</label>
                  <input className="admin-form-input" type="url" value={form.sourceUrl} onChange={(e) => setField("sourceUrl", e.target.value)} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Tags (comma-separated)</label>
                  <input className="admin-form-input" value={form.tags} onChange={(e) => setField("tags", e.target.value)} placeholder="safety, rights, protection" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Module Slug (optional)</label>
                  <input className="admin-form-input" value={form.moduleSlug} onChange={(e) => setField("moduleSlug", e.target.value)} />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editArticle ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12 }}>⚠️ Delete Article</h3>
            <p>Delete "<strong>{getTitle(deleteConfirm)}</strong>"?</p>
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

export default AdminKnowledge;
