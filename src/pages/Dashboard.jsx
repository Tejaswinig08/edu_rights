import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";
import LevelProgressBar from "../components/LevelProgressBar";
import StatCard from "../components/StatCard";
import ModuleCard from "../components/ModuleCard";
import BadgeShowcase from "../components/BadgeShowcase";
import FeedbackModal from "../components/FeedbackModal";
import ProfileModal from "../components/ProfileModal";
import "../styles/feedback.css";
import { CheckCircle, MessageSquarePlus, User } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { t, formatNumber, getArticleList, getModuleTitle, getFeedbackComment } = useLanguage();
  const location = useLocation();
  const [stats, setStats] = useState({ points: 0, level: 1, badges: [], completedCount: 0, totalModules: 0 });
  const [modules, setModules] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedFeedbackModule, setSelectedFeedbackModule] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyFeedbacks = async () => {
    try {
      const res = await api.get("/feedback/my");
      if (res.data.success) {
        setMyFeedbacks(res.data.feedbacks || []);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [progressRes, modulesRes, knowledgeRes, feedbackRes] = await Promise.all([
          api.get("/modules/progress/summary").catch(() => ({ data: { success: true, stats: { points: 0, level: 1, badges: [], completedCount: 0, totalModules: 0 } } })),
          api.get("/modules").catch(() => ({ data: { success: true, modules: [] } })),
          api.get("/knowledge").catch(() => ({ data: { success: true, articles: [] } })),
          api.get("/feedback/my").catch(() => ({ data: { success: true, feedbacks: [] } })),
        ]);

        if (progressRes.data.success) setStats(progressRes.data.stats);
        if (modulesRes.data.success) setModules(modulesRes.data.modules);
        if (knowledgeRes.data.success) setKnowledge(knowledgeRes.data.articles);
        if (feedbackRes.data.success) setMyFeedbacks(feedbackRes.data.feedbacks || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [location.key]);

  if (loading) return <div className="loading">{t("loadingDashboard")}</div>;

  const displayKnowledge = getArticleList(knowledge);

  const completedModules = modules.filter((m) => m.userProgress?.completed);
  const feedbackMap = myFeedbacks.reduce((acc, f) => {
    const k = f.module?._id || f.module;
    if (k) acc[k.toString()] = f;
    return acc;
  }, {});

  return (
    <div className="dashboard-page">
      <DashboardHeader onEditProfile={() => setProfileModalOpen(true)} />
      
      <main className="dashboard-content">
        <section className="welcome-hero">
          <div className="hero-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <span className="eyebrow">{t("yourQuest")}</span>
                <h1>
                  {t("welcomeBack", { name: user?.name || "" })}
                  {user?.isVerified && <CheckCircle className="verified-icon" size={24} />}
                </h1>
                <p className="subtitle">{t("dashboardSubtitle")}</p>
              </div>
              <button
                type="button"
                className="feedback-open-btn"
                onClick={() => setProfileModalOpen(true)}
                style={{
                  background: "linear-gradient(135deg, #0abfa6, #095957)",
                  boxShadow: "0 2px 8px rgba(9, 89, 87, 0.2)",
                  marginTop: 6,
                }}
              >
                <User size={16} />
                <span>{t("updateProfile") || "Update Profile"}</span>
              </button>
            </div>
            
            <LevelProgressBar points={stats.points} level={stats.level} />
          </div>
        </section>

        <section className="stats-row">
          <StatCard label={t("statTotalPoints")} value={formatNumber(stats.points)} color="gold" />
          <StatCard label={t("statBadgesEarned")} value={formatNumber(stats.badges?.length || 0)} color="teal" />
          <StatCard label={t("statModulesCompleted")} value={`${formatNumber(stats.completedCount)}/${formatNumber(stats.totalModules || modules.length)}`} color="blue" />
        </section>

        <section className="modules-section">
          <div className="section-heading">
            <h2>{t("yourLearningQuests")}</h2>
          </div>
          <div className="modules-grid">
            {modules.map((mod) => (
              <ModuleCard
                key={mod._id || mod.slug}
                module={mod}
                userLevel={stats.level}
                onOpenFeedback={(m) => {
                  setSelectedFeedbackModule(m);
                  setFeedbackModalOpen(true);
                }}
              />
            ))}
            {modules.length === 0 && <p className="empty-state">{t("noModulesAvailable")}</p>}
          </div>
        </section>

        {/* =====================================================
            MODULE FEEDBACK SECTION (USER DASHBOARD)
        ===================================================== */}
        <section id="dashboard-feedback" className="dashboard-feedback-section">
          <div className="section-heading">
            <h2>{t("moduleFeedback")}</h2>
            {completedModules.length > 0 && (
              <button
                type="button"
                className="feedback-open-btn"
                onClick={() => {
                  setSelectedFeedbackModule(completedModules[0]);
                  setFeedbackModalOpen(true);
                }}
              >
                <MessageSquarePlus size={16} />
                <span>{t("giveFeedback")}</span>
              </button>
            )}
          </div>

          {completedModules.length === 0 ? (
            <div className="feedback-dashboard-empty">
              <div className="feedback-empty-badge">
                <MessageSquarePlus size={28} color="#095957" />
              </div>
              <div className="feedback-empty-text">
                <h3>{t("feedbackUnlockTitle")}</h3>
                <p>
                  {t("feedbackUnlockDesc")}
                </p>
              </div>
            </div>
          ) : (
            <div className="feedback-cards-grid">
              {completedModules.map((mod) => {
                const fb = feedbackMap[mod._id?.toString()];
                const modTitle = getModuleTitle(mod);
                return (
                  <div key={mod._id} className="feedback-item-card">
                    <div className="feedback-item-header">
                      {mod.icon && <span className="feedback-item-icon">{mod.icon}</span>}
                      <div className="feedback-item-title-wrap">
                        <h4>{modTitle}</h4>
                        <div className="feedback-item-status">
                          {fb ? (
                            <span className="feedback-rated-tag">
                              {t("feedbackRated", { rating: formatNumber(fb.rating) })}
                            </span>
                          ) : (
                            <span className="feedback-pending-tag">{t("notReviewedYet")}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {fb?.comment && (
                      <p className="feedback-item-comment">"{getFeedbackComment(fb)}"</p>
                    )}

                    <button
                      type="button"
                      className="feedback-action-btn"
                      onClick={() => {
                        setSelectedFeedbackModule(mod);
                        setFeedbackModalOpen(true);
                      }}
                    >
                      {fb ? t("editFeedback") : t("leaveFeedback")}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="badges-section">
          <div className="section-heading">
            <h2>{t("yourBadges")}</h2>
          </div>
          <BadgeShowcase badges={stats.badges} />
        </section>

        <section className="knowledge-section">
          <div className="section-heading">
            <h2>{t("knowledgeHubSection")}</h2>
            <Link to="/knowledge">{t("viewAll")}</Link>
          </div>
          <div className="knowledge-preview-grid">
            {displayKnowledge.slice(0, 3).map((article) => (
              <Link to={`/knowledge/${article._id}`} key={article._id} className="knowledge-card">
                <span className="knowledge-card-category">{article.category}</span>
                <h3 className="knowledge-card-title">{article.title}</h3>
                <p className="knowledge-card-preview">{article.content?.substring(0, 80)}...</p>
              </Link>
            ))}
            {displayKnowledge.length === 0 && <p className="empty-state">{t("noArticlesAvailable")}</p>}
          </div>
        </section>

        {/* Global Dashboard Feedback Modal */}
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          module={selectedFeedbackModule}
          completedModules={completedModules}
          onFeedbackSubmitted={() => {
            fetchMyFeedbacks();
          }}
        />

        {/* User Profile Update Modal */}
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default Dashboard;