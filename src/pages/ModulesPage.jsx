import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import ModuleCard from "../components/ModuleCard";
import api from "../api/axios";

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [modulesRes, progressRes] = await Promise.all([
          api.get("/modules").catch(() => ({ data: { success: true, modules: [] } })),
          api.get("/modules/progress/summary").catch(() => ({ data: { success: true, stats: { level: 1 } } }))
        ]);

        if (modulesRes.data.success) {
          setModules(modulesRes.data.modules);
        }
        if (progressRes.data.success) {
          setUserLevel(progressRes.data.stats.level);
        }
      } catch (error) {
        console.error("Failed to load modules", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <main className="dashboard-content">
        <section className="modules-section" style={{ marginTop: "2rem" }}>
          <div className="section-heading">
            <h2>All Learning Quests</h2>
          </div>
          {loading ? (
            <div className="loading">Loading modules...</div>
          ) : (
            <div className="modules-grid">
              {modules.map((mod) => (
                <ModuleCard key={mod._id || mod.slug} module={mod} userLevel={userLevel} />
              ))}
              {modules.length === 0 && <p className="empty-state">No modules available yet.</p>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ModulesPage;
