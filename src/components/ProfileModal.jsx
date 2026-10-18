import React, { useState, useEffect } from "react";
import { X, User, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const ProfileModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const { user, updateUser, loadUser } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setError("");
      setSuccess("");
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Name is required.");
      return;
    }

    if (cleanName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (cleanName.length > 50) {
      setError("Name cannot exceed 50 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put("/auth/profile", {
        name: cleanName,
        email: cleanEmail,
      });

      if (res.data.success) {
        if (updateUser) {
          updateUser(res.data.user);
        } else if (loadUser) {
          await loadUser();
        }

        toast.success("Profile updated successfully! ✨");
        setSuccess("Profile updated successfully!");

        if (onProfileUpdated) {
          onProfileUpdated(res.data.user);
        }

        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div
        className="feedback-modal-card"
        style={{ maxWidth: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="feedback-modal-header">
          <div className="feedback-modal-title-wrap">
            <span className="feedback-modal-icon">👤</span>
            <div>
              <h3>{t("updateProfile") || "Update Profile"}</h3>
              <p className="feedback-modal-subtitle">
                Update your personal account information
              </p>
            </div>
          </div>
          <button
            className="feedback-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="feedback-modal-form"
          style={{ padding: 24 }}
        >
          {/* Quick Account Summary */}
          <div className="profile-stats-summary">
            <div className="profile-stat-item">
              <div className="stat-num">
                {user?.role === "admin" ? "🛡️ Admin" : "🎓 Student"}
              </div>
              <div className="stat-lbl">Role</div>
            </div>
            <div className="profile-stat-item">
              <div className="stat-num">Level {user?.level || 1}</div>
              <div className="stat-lbl">Rank</div>
            </div>
            <div className="profile-stat-item">
              <div className="stat-num">{user?.points || 0} XP</div>
              <div className="stat-lbl">Points</div>
            </div>
            <div className="profile-stat-item">
              <div className="stat-num">{user?.badges?.length || 0} 🏆</div>
              <div className="stat-lbl">Badges</div>
            </div>
          </div>

          {/* Full Name */}
          <div className="feedback-form-group" style={{ marginBottom: 16 }}>
            <label
              className="feedback-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <User size={15} />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              className="profile-modal-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter your name"
              required
              minLength={2}
              maxLength={50}
              disabled={submitting}
            />
          </div>

          {/* Email Address */}
          <div className="feedback-form-group" style={{ marginBottom: 16 }}>
            <label
              className="feedback-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <Mail size={15} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              className="profile-modal-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              required
              disabled={submitting}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="feedback-alert error"
              style={{ marginBottom: 16 }}
            >
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div
              className="feedback-alert success"
              style={{ marginBottom: 16 }}
            >
              {success}
            </div>
          )}

          {/* Modal Actions */}
          <div className="feedback-modal-actions">
            <button
              type="button"
              className="feedback-cancel-btn"
              onClick={onClose}
              disabled={submitting}
            >
              {t("cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              className="feedback-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Saving..." : t("save") || "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
