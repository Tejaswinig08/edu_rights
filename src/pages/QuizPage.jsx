import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";
import { useLanguage } from "../context/LanguageContext";

const QuizPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, getBadgeName, getQuizData, formatNumber } = useLanguage();

  const [rawQuiz, setRawQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/modules/${slug}/quiz`);
        if (res.data.success) {
          setRawQuiz(res.data.quiz);
          setAnswers(new Array(res.data.quiz.questions.length).fill(null));
        }
      } catch (err) {
        console.error("Failed to load quiz", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [slug]);

  const activeQuiz = getQuizData(slug, rawQuiz);

  const handleSelectOption = (optIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/modules/${slug}/quiz/submit`, { answers });
      if (res.data.success) {
        setResults(res.data);
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen">{t("loadingQuiz")}</div>;
  if (!activeQuiz) return <div className="loading-screen">{t("quizNotAvailable")}</div>;

  // ==========================================
  // RESULTS SCREEN
  // ==========================================

  if (results) {
    return (
      <div className="quiz-page">
        <DashboardHeader />
        <main className="quiz-results">
          <h2>{t("quizCompleted")}</h2>

          <div className="quiz-score-circle">
            <span className="quiz-score-number">{formatNumber(results.score)}%</span>
          </div>

          <div className="quiz-points-earned">
            {t("xpEarned", { points: formatNumber(results.pointsEarned), total: formatNumber(results.totalPoints) })}
          </div>

          {(results.newBadges?.length > 0 || results.newBadge) && (
            <div className="quiz-new-badge">
              {(results.newBadges || [results.newBadge]).filter(Boolean).map((badge, i) => (
                <div key={i} className="badge-unlock-item">
                  {t("newBadgeUnlocked", { icon: badge.icon || "", name: getBadgeName(badge.name) })}
                </div>
              ))}
            </div>
          )}

          <div className="quiz-breakdown">
            {results.results.map((r, i) => {
              const isCorrect = r.userAnswer === r.correctIndex;
              const activeQ = activeQuiz.questions[i] || {};
              const displayQuestion = activeQ.question || r.question;
              const displayOptions = activeQ.options || r.options;
              const displayExplanation = activeQ.explanation || r.explanation;

              return (
                <div
                  key={i}
                  className={`quiz-result-item ${
                    isCorrect ? "correct" : "wrong"
                  }`}
                >
                  <p>
                    <strong>
                      {t("question")} {formatNumber(i + 1)}: {displayQuestion}
                    </strong>
                  </p>
                  <p>
                    {t("yourAnswer")} {displayOptions[r.userAnswer] ?? t("noAnswerSelected")}
                  </p>
                  {!isCorrect && (
                    <p>{t("correctAnswer")} {displayOptions[r.correctIndex]}</p>
                  )}
                  {displayExplanation && (
                    <p className="explanation">{displayExplanation}</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            className="quest-button"
            onClick={() => navigate("/dashboard")}
          >
            {t("backToDashboard")}
          </button>
        </main>
      </div>
    );
  }

  // ==========================================
  // QUIZ QUESTION SCREEN
  // ==========================================

  const q = activeQuiz.questions[currentQuestion];
  const progressPercent =
    ((currentQuestion + 1) / activeQuiz.questions.length) * 100;

  return (
    <div className="quiz-page">
      <DashboardHeader />
      <main className="quiz-content">
        <div className="quiz-progress">
          <p>
            {t("questionCounter", { current: formatNumber(currentQuestion + 1), total: formatNumber(activeQuiz.questions.length) })}
          </p>
          <div className="quiz-step-bar">
            <div
              className="quiz-step-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="quiz-question-card">
          <h2 className="quiz-question-text">{q.question}</h2>
          <div className="quiz-options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option ${
                  answers[currentQuestion] === i ? "selected" : ""
                }`}
                onClick={() => handleSelectOption(i)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-nav-buttons">
          <button
            className="cancel-button"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((c) => c - 1)}
          >
            {t("previous")}
          </button>

          {currentQuestion < activeQuiz.questions.length - 1 ? (
            <button
              className="modal-primary"
              disabled={answers[currentQuestion] === null}
              onClick={() => setCurrentQuestion((c) => c + 1)}
            >
              {t("next")}
            </button>
          ) : (
            <button
              className="quest-button submit-quiz-btn"
              disabled={answers.includes(null) || submitting}
              onClick={handleSubmit}
            >
              {submitting ? t("submittingQuiz") : t("submitQuizBtn")}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
