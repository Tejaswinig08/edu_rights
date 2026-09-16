import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";
import LevelProgressBar from "../components/LevelProgressBar";
import StatCard from "../components/StatCard";
import ModuleCard from "../components/ModuleCard";
import BadgeShowcase from "../components/BadgeShowcase";
import { CheckCircle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({ points: 0, level: 1, badges: [], completedCount: 0, totalModules: 0 });
  const [modules, setModules] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [progressRes, modulesRes, knowledgeRes] = await Promise.all([
          api.get("/modules/progress/summary").catch(() => ({ data: { success: true, stats: { points: 0, level: 1, badges: [], completedCount: 0, totalModules: 0 } } })),
          api.get("/modules").catch(() => ({ data: { success: true, modules: [] } })),
          api.get("/knowledge").catch(() => ({ data: { success: true, articles: [] } }))
        ]);

        if (progressRes.data.success) setStats(progressRes.data.stats);
        if (modulesRes.data.success) setModules(modulesRes.data.modules);
        if (knowledgeRes.data.success) setKnowledge(knowledgeRes.data.articles);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [location.key]);

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard-page">
      <DashboardHeader />
      
      <main className="dashboard-content">
        <section className="welcome-hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR QUEST</span>
            <h1>
              Welcome back, {user?.name}! 👋
              {user?.isVerified && <CheckCircle className="verified-icon" size={24} />}
            </h1>
            <p className="subtitle">Continue your journey to become a Justice Master!</p>
            
            <LevelProgressBar points={stats.points} level={stats.level} />
          </div>
        </section>

        <section className="stats-row">
          <StatCard icon="⭐" label="Total Points" value={stats.points} color="gold" />
          <StatCard icon="🏆" label="Badges Earned" value={stats.badges?.length || 0} color="teal" />
          <StatCard icon="📚" label="Modules Completed" value={`${stats.completedCount}/${stats.totalModules || modules.length}`} color="blue" />
        </section>

        <section className="modules-section">
          <div className="section-heading">
            <h2>Your Learning Quests</h2>
          </div>
          <div className="modules-grid">
            {modules.map((mod) => (
              <ModuleCard key={mod._id || mod.slug} module={mod} userLevel={stats.level} />
            ))}
            {modules.length === 0 && <p className="empty-state">No modules available yet.</p>}
          </div>
        </section>

        <section className="badges-section">
          <div className="section-heading">
            <h2>Your Badges</h2>
          </div>
          <BadgeShowcase badges={stats.badges} />
        </section>

        <section className="knowledge-section">
          <div className="section-heading">
            <h2>Knowledge Hub</h2>
            <Link to="/knowledge">View All →</Link>
          </div>
          <div className="knowledge-preview-grid">
            {knowledge.slice(0, 3).map((article) => (
              <Link to={`/knowledge/${article._id}`} key={article._id} className="knowledge-card">
                <span className="knowledge-card-category">{article.category}</span>
                <h3 className="knowledge-card-title">{article.title}</h3>
                <p className="knowledge-card-preview">{article.content?.substring(0, 80)}...</p>
              </Link>
            ))}
            {knowledge.length === 0 && <p className="empty-state">No articles available.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;