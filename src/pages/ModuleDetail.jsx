import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/feedback.css";
import DashboardHeader from "../components/DashboardHeader";
import VideoPlayer from "../components/VideoPlayer";
import { useLanguage } from "../context/LanguageContext";
import { ArrowLeft, Star } from "lucide-react";

const ModuleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, getModuleTitle, getModuleDescription, getModuleContent, formatNumber } = useLanguage();
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [existingFeedback, setExistingFeedback] = useState(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.get(`/modules/${slug}`);
        if (res.data.success) {
          setModule(res.data.module);
          setProgress(res.data.progress);
          // Load existing feedback if module is completed
          if (res.data.progress?.completed) {
            try {
              const fbRes = await api.get(`/feedback/my/${res.data.module._id}`);
              if (fbRes.data.feedback) {
                setExistingFeedback(fbRes.data.feedback);
                setFeedbackRating(fbRes.data.feedback.rating);
                setFeedbackComment(fbRes.data.feedback.comment || "");
              }
            } catch (_) {}
          }
        }
      } catch (err) {
        setError(t("moduleNotFound"));
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [slug]);

  const handleSubmitFeedback = async () => {
    setFeedbackError("");
    setFeedbackSuccess("");
    if (!feedbackRating) {
      setFeedbackError("Please select a rating (1–5 stars).");
      return;
    }
    if (feedbackComment.trim().length > 1000) {
      setFeedbackError("Comment cannot exceed 1000 characters.");
      return;
    }
    setFeedbackSubmitting(true);
    try {
      await api.post("/feedback", {
        moduleId: module._id,
        rating: feedbackRating,
        comment: feedbackComment.trim(),
      });
      setFeedbackSuccess("✅ Thank you! Your feedback has been submitted.");
      setExistingFeedback({ rating: feedbackRating, comment: feedbackComment });
    } catch (err) {
      setFeedbackError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

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

        {/* Feedback Section — only for completed modules */}
        {progress?.completed && (
          <div className="feedback-section">
            <h3 className="feedback-title">
              ⭐ {existingFeedback ? "Update Your Feedback" : "Rate This Module"}
            </h3>

            {feedbackSuccess && (
              <div className="feedback-success">{feedbackSuccess}</div>
            )}

            <div className="feedback-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`feedback-star-btn${star <= (feedbackHover || feedbackRating) ? " active" : ""}`}
                  onClick={() => { setFeedbackRating(star); setFeedbackSuccess(""); }}
                  onMouseEnter={() => setFeedbackHover(star)}
                  onMouseLeave={() => setFeedbackHover(0)}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
              {feedbackRating > 0 && (
                <span className="feedback-star-label">{feedbackRating}/5</span>
              )}
            </div>

            <textarea
              className="feedback-textarea"
              placeholder="Share your thoughts about this module... (optional, max 1000 chars)"
              value={feedbackComment}
              onChange={(e) => { setFeedbackComment(e.target.value); setFeedbackSuccess(""); }}
              maxLength={1000}
              rows={3}
            />
            <div className="feedback-char-count">{feedbackComment.length}/1000</div>

            {feedbackError && (
              <div className="feedback-error">{feedbackError}</div>
            )}

            <button
              className="feedback-submit-btn"
              onClick={handleSubmitFeedback}
              disabled={feedbackSubmitting || !feedbackRating}
            >
              {feedbackSubmitting ? "Submitting..." : existingFeedback ? "Update Feedback" : "Submit Feedback"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ModuleDetail;
