import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";
import VideoPlayer from "../components/VideoPlayer";
import { useLanguage } from "../context/LanguageContext";
import { ArrowLeft } from "lucide-react";

const ModuleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, getModuleTitle, getModuleDescription, getModuleContent, formatNumber } = useLanguage();
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.get(`/modules/${slug}`);
        if (res.data.success) {
          setModule(res.data.module);
          setProgress(res.data.progress);
        }
      } catch (err) {
        setError(t("moduleNotFound"));
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [slug]);

  if (loading) return <div className="loading-screen">{t("loadingModule")}</div>;
  if (error || !module)
    return <div className="loading-screen">{error || t("moduleNotFound")}</div>;

  const displayTitle = getModuleTitle(module);
  const displayDesc = getModuleDescription(module);
  const displayContent = getModuleContent(module);

  // Render content with section headers (lines starting with emoji or special chars)
  const renderContent = (content) => {
    if (!content) return null;

    const lines = content.split("\n");
    const elements = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Section headers (emoji prefix patterns)
      if (
        trimmed.startsWith("🌟") ||
        trimmed.startsWith("🛡️") ||
        trimmed.startsWith("🏥") ||
        trimmed.startsWith("🌱") ||
        trimmed.startsWith("🗣️") ||
        trimmed.startsWith("💧") ||
        trimmed.startsWith("🪪") ||
        trimmed.startsWith("🏠") ||
        trimmed.startsWith("⚽") ||
        trimmed.startsWith("🔐") ||
        trimmed.startsWith("♿") ||
        trimmed.startsWith("🍎") ||
        trimmed.startsWith("⚖️") ||
        trimmed.startsWith("📚") ||
        trimmed.startsWith("❤️") ||
        trimmed.startsWith("🎤")
      ) {
        elements.push(
          <h3 key={i} className="module-section-header">
            {trimmed}
          </h3>
        );
      } else if (
        trimmed.startsWith("What is this right?") ||
        trimmed.startsWith("What is the solution?") ||
        trimmed.startsWith("Lesson Learnt") ||
        trimmed.startsWith("Important Laws") ||
        trimmed.startsWith("Important Law") ||
        trimmed.startsWith("Legal and Government Support") ||
        trimmed.startsWith("Legal and Policy Support") ||
        trimmed.startsWith("Legal and International Support") ||
        trimmed.startsWith("Government Support") ||
        trimmed.startsWith("Constitutional Support") ||
        trimmed.startsWith("International and Policy Support") ||
        trimmed.startsWith("यह अधिकार क्या है?") ||
        trimmed.startsWith("समाधान क्या है?") ||
        trimmed.startsWith("सीखा गया पाठ") ||
        trimmed.startsWith("महत्वपूर्ण कानून") ||
        trimmed.startsWith("कानूनी और सरकारी सहायता") ||
        trimmed.startsWith("कानूनी और नीतिगत सहायता") ||
        trimmed.startsWith("कानूनी और अंतर्राष्ट्रीय सहायता") ||
        trimmed.startsWith("सरकारी सहायता") ||
        trimmed.startsWith("संवैधानिक सहायता") ||
        trimmed.startsWith("अंतर्राष्ट्रीय और नीतिगत सहायता") ||
        trimmed.startsWith("कानूनी सहायता")
      ) {
        elements.push(
          <h4 key={i} className="module-subsection-header">
            {trimmed}
          </h4>
        );
      } else if (
        trimmed.startsWith("•") ||
        trimmed.startsWith("-") ||
        trimmed.startsWith("–")
      ) {
        elements.push(
          <li key={i} className="module-list-item">
            {trimmed.substring(1).trim()}
          </li>
        );
      } else {
        elements.push(
          <p key={i} className="module-paragraph">
            {trimmed}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="module-detail-page">
      <DashboardHeader />

      <main className="module-content-area">
        <Link to="/dashboard" className="module-back-link">
          <ArrowLeft size={16} /> {t("backToDashboard")}
        </Link>

        <div className="module-detail-header">
          <div className="header-left">
            <span className="module-icon-large">{module.icon || "📚"}</span>
            <div>
              <h1>{displayTitle}</h1>
              <p className="module-detail-desc">{displayDesc}</p>
            </div>
          </div>
          <div className="header-right">
            <span className="module-xp-large">+{formatNumber(module.pointsReward)} XP</span>
          </div>
        </div>

        {progress?.completed && (
          <div className="module-score-banner">
            {t("completedBanner", { score: formatNumber(progress.quizScore) })}
          </div>
        )}

        {/* Embedded YouTube Videos */}
        {module.videoUrls && module.videoUrls.length > 0 && (
          <VideoPlayer videos={module.videoUrls} />
        )}

        <div className="module-content">{renderContent(displayContent)}</div>

        <div className="module-actions">
          <button
            className="module-quiz-cta"
            onClick={() => navigate(`/modules/${slug}/quiz`)}
          >
            {t("takeQuizBtn")}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ModuleDetail;
