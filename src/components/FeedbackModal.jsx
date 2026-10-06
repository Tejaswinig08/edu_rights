import React, { useState, useEffect } from "react";
import { Star, X, CheckCircle, MessageSquare } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const FeedbackModal = ({ isOpen, onClose, module, completedModules = [], onFeedbackSubmitted }) => {
  const [selectedModule, setSelectedModule] = useState(module || null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update selected module when prop changes or default to first completed
  useEffect(() => {
    if (module) {
      setSelectedModule(module);
    } else if (completedModules.length > 0 && !selectedModule) {
      setSelectedModule(completedModules[0]);
    }
  }, [module, completedModules]);

  // Load existing feedback when selectedModule changes
  useEffect(() => {
    if (!isOpen || !selectedModule?._id) return;

    const loadFeedback = async () => {
      setLoadingExisting(true);
      setError("");
      setSuccess("");
      try {
        const res = await api.get(`/feedback/my/${selectedModule._id}`);
        if (res.data.feedback) {
          setExistingFeedback(res.data.feedback);
          setRating(res.data.feedback.rating);
          setComment(res.data.feedback.comment || "");
        } else {
          setExistingFeedback(null);
          setRating(0);
          setComment("");
        }
      } catch (err) {
        console.error("Error loading existing feedback:", err);
      } finally {
        setLoadingExisting(false);
      }
    };

    loadFeedback();
  }, [isOpen, selectedModule]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedModule?._id) {
      setError("Please select a module to review.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a star rating from 1 to 5.");
      return;
    }

    if (comment.trim().length > 1000) {
      setError("Comment cannot exceed 1000 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/feedback", {
        moduleId: selectedModule._id,
        rating,
        comment: comment.trim(),
      });

      if (res.data.success) {
        toast.success(existingFeedback ? "Feedback updated!" : "Feedback submitted successfully!");
        setSuccess("Thank you! Your feedback has been saved.");
        setExistingFeedback(res.data.feedback || { rating, comment });
        if (onFeedbackSubmitted) onFeedbackSubmitted(res.data.feedback);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = (m) => {
    if (!m) return "";
    return typeof m.title === "object" ? m.title.en || m.title.mr || "" : m.title;
  };

  const hasCompletedModules = completedModules.length > 0 || selectedModule;

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="feedback-modal-header">
          <div className="feedback-modal-title-wrap">
            <span className="feedback-modal-icon">
              <Star size={22} color="#f59e0b" fill="#f59e0b" />
            </span>
            <div>
              <h3>{existingFeedback ? "Edit Module Feedback" : "Give Module Feedback"}</h3>
              <p className="feedback-modal-subtitle">Share your experience to help us improve learning quests!</p>
            </div>
          </div>
          <button className="feedback-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {!hasCompletedModules ? (
          <div className="feedback-empty-state">
            <div className="feedback-empty-icon">
              <MessageSquare size={44} color="#095957" />
            </div>
            <h4>No Completed Modules Yet</h4>
            <p>
              Feedback is available for completed modules. Finish any module and pass its quiz with 70% or more to unlock feedback!
            </p>
            <button className="feedback-submit-btn" style={{ marginTop: 16 }} onClick={onClose}>
              Explore Modules
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-modal-form">
            {/* Module Picker if multiple completed */}
            {completedModules.length > 1 && (
              <div className="feedback-form-group">
                <label className="feedback-label">Completed Module</label>
                <select
                  className="feedback-select"
                  value={selectedModule?._id || ""}
                  onChange={(e) => {
                    const found = completedModules.find((m) => m._id === e.target.value);
                    if (found) setSelectedModule(found);
                  }}
                >
                  {completedModules.map((m) => (
                    <option key={m._id} value={m._id}>
                      {getTitle(m)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selected Module Display if single */}
            {completedModules.length <= 1 && selectedModule && (
              <div className="feedback-module-badge">
                {selectedModule.icon && <span className="badge-icon">{selectedModule.icon}</span>}
                <span className="badge-name">{getTitle(selectedModule)}</span>
              </div>
            )}

            {loadingExisting ? (
              <div className="feedback-loading-hint">Loading your previous rating...</div>
            ) : (
              <>
                {/* Star Rating */}
                <div className="feedback-form-group">
                  <label className="feedback-label">How would you rate this module?</label>
                  <div className="feedback-stars-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`feedback-star-btn ${star <= (hover || rating) ? "active" : ""}`}
                        onClick={() => {
                          setRating(star);
                          setError("");
                        }}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`${star} star`}
                      >
                        <Star size={24} fill={star <= (hover || rating) ? "#f59e0b" : "none"} color={star <= (hover || rating) ? "#f59e0b" : "#cbd5e1"} />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="feedback-rating-text">
                        {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Needs Improvement"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment Box */}
                <div className="feedback-form-group">
                  <label className="feedback-label">
                    Your comments or suggestions <span className="feedback-optional">(optional)</span>
                  </label>
                  <textarea
                    className="feedback-modal-textarea"
                    placeholder="What did you learn? Was anything confusing or fun? Let us know!"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      setError("");
                    }}
                    maxLength={1000}
                    rows={4}
                  />
                  <div className="feedback-char-count">{comment.length} / 1000 characters</div>
                </div>

                {/* Error Banner */}
                {error && <div className="feedback-alert error">{error}</div>}

                {/* Success Banner */}
                {success && <div className="feedback-alert success">{success}</div>}

                {/* Actions */}
                <div className="feedback-modal-actions">
                  <button type="button" className="feedback-cancel-btn" onClick={onClose} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="feedback-submit-btn" disabled={submitting || !rating}>
                    {submitting ? "Saving..." : existingFeedback ? "Update Feedback" : "Submit Feedback"}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
