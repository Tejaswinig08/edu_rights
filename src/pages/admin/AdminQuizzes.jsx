import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const EMPTY_Q = { question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" };

const QuestionEditor = ({
  questions,
  updateQ,
  updateOption,
  addQuestion,
  removeQuestion,
  onSubmit,
  onCancel,
  submitLabel,
  saving,
}) => (
  <form className="admin-form" onSubmit={onSubmit}>
    {questions.map((q, qi) => (
      <div key={qi} className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-header">
          <span className="admin-card-title">Question {qi + 1}</span>
          {questions.length > 1 && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => removeQuestion(qi)}
            >
              Remove
            </button>
          )}
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Question Text *</label>
          <input
            className="admin-form-input"
            value={q.question}
            onChange={(e) => updateQ(qi, "question", e.target.value)}
            placeholder="Enter question text..."
            required
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Options (4 required) *</label>
          {q.options.map((opt, oi) => (
            <div
              key={oi}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: Number(q.correctIndex) === oi ? "700" : "500",
                  color: Number(q.correctIndex) === oi ? "#27ae60" : "#7f8c8d",
                  minWidth: 85,
                }}
                title="Mark as correct answer"
              >
                <input
                  type="radio"
                  name={`correct-answer-${qi}`}
                  checked={Number(q.correctIndex) === oi}
                  onChange={() => updateQ(qi, "correctIndex", oi)}
                  style={{ accentColor: "#27ae60", width: 16, height: 16, cursor: "pointer" }}
                />
                <span>{Number(q.correctIndex) === oi ? "✓ Correct" : `Option ${oi + 1}`}</span>
              </label>
              <input
                className="admin-form-input"
                value={opt}
                onChange={(e) => updateOption(qi, oi, e.target.value)}
                placeholder={`Option ${oi + 1} text`}
                required
              />
            </div>
          ))}
          <small style={{ color: "#7f8c8d" }}>
            Select the radio button next to the correct answer.
          </small>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Explanation (optional)</label>
          <input
            className="admin-form-input"
            value={q.explanation || ""}
            onChange={(e) => updateQ(qi, "explanation", e.target.value)}
            placeholder="Explanation shown after quiz completion..."
          />
        </div>
      </div>
    ))}
    <div style={{ marginBottom: 16 }}>
      <button type="button" className="btn btn-ghost" onClick={addQuestion}>
        + Add Question
      </button>
    </div>
    <div className="admin-modal-actions">
      <button type="button" className="btn btn-ghost" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </div>
  </form>
);

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newModuleId, setNewModuleId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editQuestions, setEditQuestions] = useState([{ ...EMPTY_Q, options: ["", "", "", ""] }]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [qRes, mRes] = await Promise.all([
        api.get("/admin/quizzes"),
        api.get("/admin/modules"),
      ]);
      if (qRes.data.success) setQuizzes(qRes.data.quizzes);
      if (mRes.data.success) setModules(mRes.data.modules);
    } catch {
      setAlert({ type: "error", msg: "Failed to load data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const getModuleTitle = (m) => {
    if (!m) return "Unknown";
    return typeof m.title === "object" ? (m.title.en || m.title.mr || "Unknown") : m.title;
  };

  const openQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    const normalized = (quiz.questions || []).map((q) => {
      let opts = Array.isArray(q.options) ? [...q.options] : [];
      if (typeof q.options === "object" && !Array.isArray(q.options)) {
        opts = q.options.en || ["", "", "", ""];
      }
      while (opts.length < 4) opts.push("");
      opts = opts.slice(0, 4);

      return {
        _id: q._id,
        question: typeof q.question === "object" ? q.question.en || "" : q.question || "",
        options: opts,
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : Number(q.correctIndex || 0),
        explanation: typeof q.explanation === "object" ? q.explanation.en || "" : q.explanation || "",
      };
    });
    setEditQuestions(normalized.length > 0 ? normalized : [{ ...EMPTY_Q, options: ["", "", "", ""] }]);
  };

  const updateQ = (idx, field, value) => {
    setEditQuestions((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const updateOption = (qIdx, optIdx, value) => {
    setEditQuestions((prev) => {
      const updated = [...prev];
      const q = { ...updated[qIdx] };
      const opts = [...(q.options || ["", "", "", ""])];
      opts[optIdx] = value;
      q.options = opts;
      updated[qIdx] = q;
      return updated;
    });
  };

  const addQuestion = () => {
    setEditQuestions((prev) => [...prev, { ...EMPTY_Q, options: ["", "", "", ""] }]);
  };

  const removeQuestion = (idx) => {
    setEditQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateQuiz = (questions) => {
    if (!questions || questions.length === 0) {
      return "Quiz must contain at least one question.";
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.question.trim()) {
        return `Question #${i + 1} is missing question text.`;
      }
      if (!q.options || q.options.length < 2) {
        return `Question #${i + 1} must have at least 2 options.`;
      }
      for (let oi = 0; oi < q.options.length; oi++) {
        if (!q.options[oi] || !q.options[oi].trim()) {
          return `Question #${i + 1}, Option ${oi + 1} cannot be empty.`;
        }
      }
      if (q.correctIndex === undefined || q.correctIndex === null || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        return `Question #${i + 1} must have a valid correct answer selected.`;
      }
    }
    return null;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const errorMsg = validateQuiz(editQuestions);
    if (errorMsg) {
      setAlert({ type: "error", msg: errorMsg });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        questions: editQuestions.map((q) => ({
          _id: q._id,
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctIndex: Number(q.correctIndex),
          explanation: (q.explanation || "").trim(),
        })),
      };
      await api.put(`/admin/quizzes/${selectedQuiz._id}`, payload);
      setAlert({ type: "success", msg: "Quiz updated successfully!" });
      setSelectedQuiz(null);
      fetchAll();
    } catch (err) {
      setAlert({ type: "error", msg: err.response?.data?.message || "Update failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newModuleId) {
      setAlert({ type: "error", msg: "Select a module." });
      return;
    }
    const errorMsg = validateQuiz(editQuestions);
    if (errorMsg) {
      setAlert({ type: "error", msg: errorMsg });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        moduleId: newModuleId,
        questions: editQuestions.map((q) => ({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctIndex: Number(q.correctIndex),
          explanation: (q.explanation || "").trim(),
        })),
      };
      await api.post("/admin/quizzes", payload);
      setAlert({ type: "success", msg: "Quiz created successfully!" });
      setShowCreate(false);
      setNewModuleId("");
      setEditQuestions([{ ...EMPTY_Q, options: ["", "", "", ""] }]);
      fetchAll();
    } catch (err) {
      setAlert({ type: "error", msg: err.response?.data?.message || "Create failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/quizzes/${id}`);
      setAlert({ type: "success", msg: "Quiz deleted." });
      setDeleteConfirm(null);
      fetchAll();
    } catch {
      setAlert({ type: "error", msg: "Delete failed." });
    }
  };

  return (
    <AdminLayout pageTitle="Quizzes">
      {alert.msg && (
        <div className={`admin-alert ${alert.type}`} onClick={() => setAlert({ type: "", msg: "" })}>{alert.msg}</div>
      )}

      {!selectedQuiz && !showCreate && (
        <>
          <div className="admin-page-header">
            <h2>🧩 Quizzes ({quizzes.length})</h2>
            <button className="btn btn-primary" onClick={() => { setShowCreate(true); setEditQuestions([{ ...EMPTY_Q }]); }}>+ New Quiz</button>
          </div>
          <div className="admin-card">
            {loading ? <div className="admin-loading">Loading...</div> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Module</th><th>Questions</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {quizzes.length === 0 && <tr><td colSpan={3} className="admin-empty">No quizzes.</td></tr>}
                    {quizzes.map((q) => (
                      <tr key={q._id}>
                        <td>{getModuleTitle(q.moduleId)}</td>
                        <td>{q.questions?.length || 0} questions</td>
                        <td style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openQuiz(q)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(q)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {showCreate && (
        <>
          <div className="admin-page-header">
            <h2>+ New Quiz</h2>
          </div>
          <div className="admin-card">
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label className="admin-form-label">Select Module *</label>
              <select className="admin-form-select" value={newModuleId} onChange={(e) => setNewModuleId(e.target.value)} required>
                <option value="">— Select Module —</option>
                {modules.map((m) => (
                  <option key={m._id} value={m._id}>{getModuleTitle(m)}</option>
                ))}
              </select>
            </div>
            <QuestionEditor
              questions={editQuestions}
              updateQ={updateQ}
              updateOption={updateOption}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
              submitLabel="Create Quiz"
              saving={saving}
            />
          </div>
        </>
      )}

      {selectedQuiz && (
        <>
          <div className="admin-page-header">
            <h2>✏️ Edit Quiz — {getModuleTitle(selectedQuiz.moduleId)}</h2>
          </div>
          <div className="admin-card">
            <QuestionEditor
              questions={editQuestions}
              updateQ={updateQ}
              updateOption={updateOption}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
              onSubmit={handleUpdate}
              onCancel={() => setSelectedQuiz(null)}
              submitLabel="Update Quiz"
              saving={saving}
            />
          </div>
        </>
      )}

      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12 }}>⚠️ Delete Quiz</h3>
            <p>Delete the quiz for <strong>{getModuleTitle(deleteConfirm.moduleId)}</strong>?</p>
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

export default AdminQuizzes;
