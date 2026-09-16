import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";

const QuizPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
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
          setQuiz(res.data.quiz);
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

  if (loading) return <div className="loading-screen">Loading quiz...</div>;
  if (!quiz) return <div className="loading-screen">Quiz not available.</div>;

  // ==========================================
  // RESULTS SCREEN
  // ==========================================

  if (results) {
    return (
      <div className="quiz-page">
        <DashboardHeader />
        <main className="quiz-results">
          <h2>Quiz Completed! 🎉</h2>

          <div className="quiz-score-circle">
            <span className="quiz-score-number">{results.score}%</span>
          </div>

          <div className="quiz-points-earned">
            +{results.pointsEarned} XP Earned! (Total: {results.totalPoints})
          </div>

          {(results.newBadges?.length > 0 || results.newBadge) && (
            <div className="quiz-new-badge">
              {(results.newBadges || [results.newBadge]).filter(Boolean).map((badge, i) => (
                <div key={i} className="badge-unlock-item">
                  🎊 New Badge Unlocked: {badge.icon} {badge.name}
                </div>
              ))}
            </div>
          )}

          <div className="quiz-breakdown">
            {results.results.map((r, i) => {
              const isCorrect = r.userAnswer === r.correctIndex;
              return (
                <div
                  key={i}
                  className={`quiz-result-item ${
                    isCorrect ? "correct" : "wrong"
                  }`}
                >
                  <p>
                    <strong>
                      Q{i + 1}: {r.question}
                    </strong>
                  </p>
                  <p>
                    Your answer: {r.options[r.userAnswer] ?? "No answer"}
                  </p>
                  {!isCorrect && (
                    <p>Correct answer: {r.options[r.correctIndex]}</p>
                  )}
                  {r.explanation && (
                    <p className="explanation">💡 {r.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            className="quest-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  // ==========================================
  // QUIZ QUESTION SCREEN
  // ==========================================

  const q = quiz.questions[currentQuestion];
  const progressPercent =
    ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-page">
      <DashboardHeader />
      <main className="quiz-content">
        <div className="quiz-progress">
          <p>
            Question {currentQuestion + 1} of {quiz.questions.length}
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
            Previous
          </button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              className="modal-primary"
              disabled={answers[currentQuestion] === null}
              onClick={() => setCurrentQuestion((c) => c + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="quest-button submit-quiz-btn"
              disabled={answers.includes(null) || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "⏳ Submitting..." : "Submit Quiz ✨"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
