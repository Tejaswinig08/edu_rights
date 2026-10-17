import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const Bar = ({ label, value, max, color = "#4a90e2" }) => (
  <div className="analytics-bar">
    <div className="analytics-bar-label" title={label}>{label}</div>
    <div className="analytics-bar-track">
      <div
        className="analytics-bar-fill"
        style={{ width: max ? `${(value / max) * 100}%` : "0%", background: color }}
      />
    </div>
    <div className="analytics-bar-count">{value}</div>
  </div>
);

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/admin/analytics");
        if (res.data.success) setData(res.data.analytics);
      } catch {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <AdminLayout pageTitle="Analytics"><div className="admin-loading">⏳ Loading analytics...</div></AdminLayout>;
  if (error) return <AdminLayout pageTitle="Analytics"><div className="admin-alert error">{error}</div></AdminLayout>;

  const scoreLabels = { 0: "0–20%", 20: "20–40%", 40: "40–60%", 60: "60–80%", 80: "80–100%" };
  const maxModuleCount = Math.max(...(data.moduleCompletions.map((m) => m.count) || [1]));
  const maxBadgeCount = Math.max(...(data.badgeDistribution.map((b) => b.count) || [1]));
  const maxScoreCount = Math.max(...(data.scoreDistribution.map((s) => s.count) || [1]));

  return (
    <AdminLayout pageTitle="Analytics">
      <div className="admin-page-header">
        <h2>📊 Platform Analytics</h2>
        <span style={{ color: "#7f8c8d", fontSize: 13 }}>Live data from MongoDB</span>
      </div>

      <div className="analytics-grid">

        {/* Users by Level */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">🎮 Users by Level</h3>
          </div>
          {data.usersByLevel.length === 0 ? (
            <div className="admin-empty">No data yet.</div>
          ) : (
            data.usersByLevel.map((u) => (
              <Bar key={u._id} label={`Level ${u._id}`} value={u.count}
                max={Math.max(...data.usersByLevel.map((x) => x.count))} color="#9b59b6" />
            ))
          )}
        </div>

        {/* Module Completions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">✅ Module Completions</h3>
          </div>
          {data.moduleCompletions.length === 0 ? (
            <div className="admin-empty">No completions yet.</div>
          ) : (
            data.moduleCompletions.map((m) => (
              <Bar key={m._id} label={(m.icon || "📚") + " " + (m.title || "Unknown")}
                value={m.count} max={maxModuleCount} color="#27ae60" />
            ))
          )}
        </div>

        {/* Score Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">📊 Quiz Score Distribution</h3>
          </div>
          {data.scoreDistribution.length === 0 ? (
            <div className="admin-empty">No quiz data yet.</div>
          ) : (
            data.scoreDistribution.map((s) => (
              <Bar key={s._id} label={scoreLabels[s._id] || `${s._id}%+`}
                value={s.count} max={maxScoreCount} color="#4a90e2" />
            ))
          )}
        </div>

        {/* Badge Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">🏅 Badge Distribution</h3>
          </div>
          {data.badgeDistribution.length === 0 ? (
            <div className="admin-empty">No badges earned yet.</div>
          ) : (
            data.badgeDistribution.map((b) => (
              <Bar key={b._id} label={b._id} value={b.count} max={maxBadgeCount} color="#f39c12" />
            ))
          )}
        </div>

        {/* Feedback by Module */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">⭐ Feedback by Module</h3>
          </div>
          {data.feedbackByModule.length === 0 ? (
            <div className="admin-empty">No feedback yet.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Module</th><th>Count</th><th>Avg Rating</th></tr>
              </thead>
              <tbody>
                {data.feedbackByModule.map((f) => (
                  <tr key={f._id}>
                    <td>{f.title || "Unknown"}</td>
                    <td>{f.count}</td>
                    <td><span style={{ color: "#f39c12" }}>{"★".repeat(Math.round(f.avgRating))}</span> {f.avgRating}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Avg score per module */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">🎯 Avg Quiz Score per Module</h3>
          </div>
          {data.moduleCompletions.length === 0 ? (
            <div className="admin-empty">No data yet.</div>
          ) : (
            data.moduleCompletions.map((m) => (
              <Bar key={m._id + "-score"} label={(m.icon || "📚") + " " + (m.title || "Unknown")}
                value={m.avgScore || 0} max={100} color="#e74c3c" />
            ))
          )}
        </div>

        {/* Recent Registrations by Day */}
        <div className="admin-card" style={{ gridColumn: "span 2" }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">📅 Daily Registrations (Last 30 Days)</h3>
          </div>
          {data.registrationsByDay.length === 0 ? (
            <div className="admin-empty">No registrations in the last 30 days.</div>
          ) : (
            data.registrationsByDay.map((r) => (
              <Bar key={r._id} label={r._id} value={r.count}
                max={Math.max(...data.registrationsByDay.map((x) => x.count))} color="#4a90e2" />
            ))
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
