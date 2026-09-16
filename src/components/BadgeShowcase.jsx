import React from "react";

const BadgeShowcase = ({ badges = [] }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="empty-state">
        <p>Complete quizzes to earn your first badge! 🌟</p>
      </div>
    );
  }

  return (
    <div className="badges-row">
      {badges.map((badge, idx) => (
        <div key={idx} className="badge-item">
          <div className="badge-icon-circle">{badge.icon || "🏆"}</div>
          <span className="badge-name">{badge.name}</span>
        </div>
      ))}
    </div>
  );
};

export default BadgeShowcase;
