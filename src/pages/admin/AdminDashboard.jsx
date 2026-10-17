import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        if (res.data.success) setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fmt = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <AdminLayout pageTitle="Dashboard">
      {loading && <div className="admin-loading">⏳ Loading dashboard...</div>}
      {error && <div className="admin-alert error">{error}</div>}

      {data && (
        <>
          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{data.stats.totalUsers}</div>
              <div className="stat-label">Total Students</div>
            </div>
            <div className="admin-stat-card green">
              <div className="stat-icon">📚</div>
              <div className="stat-value">{data.stats.totalModules}</div>
              <div className="stat-label">Modules</div>
            </div>
            <div className="admin-stat-card orange">
              <div className="stat-icon">🧩</div>
              <div className="stat-value">{data.stats.totalQuizzes}</div>
              <div className="stat-label">Quizzes</div>
            </div>
            <div className="admin-stat-card purple">
              <div className="stat-icon">💬</div>
              <div className="stat-value">{data.stats.totalFeedback}</div>
              <div className="stat-label">Feedback</div>
            </div>
            <div className="admin-stat-card red">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{data.stats.totalCompletions}</div>
              <div className="stat-label">Completions</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{data.stats.avgScore}%</div>
              <div className="stat-label">Avg Quiz Score</div>
            </div>
            <div className="admin-stat-card green">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{data.stats.avgRating}/5</div>
              <div className="stat-label">Avg Rating</div>
            </div>
            <div className="admin-stat-card orange">
              <div className="stat-icon">📰</div>
              <div className="stat-value">{data.stats.totalKnowledge}</div>
              <div className="stat-label">Knowledge Articles</div>
            </div>
          </div>

          {/* Recent Activity Grid */}
          <div className="admin-recent-grid">
            {/* Recent Registrations */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">🆕 Recent Registrations</h3>
                <Link to="/admin/users" className="btn btn-ghost btn-sm">View All</Link>
              </div>
              {data.recentUsers.length === 0 ? (
                <div className="admin-empty">No users yet.</div>
              ) : (
                data.recentUsers.map((u) => (
                  <div key={u._id} className="admin-activity-item">
                    <div className="admin-activity-icon user">👤</div>
                    <div className="admin-activity-info">
                      <p><strong>{u.name}</strong></p>
                      <small>{u.email} · {fmt(u.createdAt)}</small>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recent Completions */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">✅ Recent Completions</h3>
              </div>
              {data.recentCompletions.length === 0 ? (
                <div className="admin-empty">No completions yet.</div>
              ) : (
                data.recentCompletions.map((p) => (
                  <div key={p._id} className="admin-activity-item">
                    <div className="admin-activity-icon module">{p.moduleId?.icon || "📚"}</div>
                    <div className="admin-activity-info">
                      <p><strong>{p.userId?.name || "Unknown"}</strong> completed <strong>{p.moduleId?.title || "Unknown"}</strong></p>
                      <small>{fmt(p.completedAt)}</small>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recent Feedback */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">💬 Recent Feedback</h3>
                <Link to="/admin/feedback" className="btn btn-ghost btn-sm">View All</Link>
              </div>
              {data.recentFeedback.length === 0 ? (
                <div className="admin-empty">No feedback yet.</div>
              ) : (
                data.recentFeedback.map((f) => (
                  <div key={f._id} className="admin-activity-item">
                    <div className="admin-activity-icon feedback">⭐</div>
                    <div className="admin-activity-info">
                      <p>
                        <strong>{f.user?.name || "User"}</strong> rated{" "}
                        <strong>{f.module?.title || "Module"}</strong>{" "}
                        <span className="admin-stars">{"★".repeat(f.rating)}</span>
                      </p>
                      <small>{f.comment ? `"${f.comment.substring(0, 50)}..."` : "No comment"} · {fmt(f.createdAt)}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
