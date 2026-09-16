import React from "react";
import { useNavigate } from "react-router-dom";

const ModuleCard = ({ module, userLevel }) => {
  const navigate = useNavigate();
  const { slug, title, description, icon, pointsReward, requiredLevel, userProgress } = module;
  
  const isLocked = userLevel < requiredLevel;
  const isCompleted = userProgress?.completed;
  
  const handleClick = () => {
    if (!isLocked) {
      navigate(`/modules/${slug}`);
    }
  };

  return (
    <div 
      className={`module-card ${isLocked ? "locked" : ""}`} 
      onClick={handleClick}
    >
      <div className="module-card-header">
        <span className="module-card-icon">{icon || "📚"}</span>
        <div className="module-card-status">
          {isLocked && <span className="status-badge locked-badge">🔒 Locked</span>}
          {isCompleted && <span className="status-badge completed-badge">✅ Completed</span>}
        </div>
      </div>
      
      <div className="module-card-body">
        <h3 className="module-card-title">{title}</h3>
        <p className="module-card-desc">{description}</p>
      </div>
      
      <div className="module-card-footer">
        <span className="module-xp">+{pointsReward} XP</span>
        {!isLocked && !isCompleted && (
          <button className="start-quest-btn">Start Quest</button>
        )}
        {isCompleted && (
          <span className="module-score">Score: {userProgress?.quizScore}%</span>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
