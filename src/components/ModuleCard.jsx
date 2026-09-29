import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const ModuleCard = ({ module, userLevel }) => {
  const navigate = useNavigate();
  const { t, getModuleTitle, getModuleDescription, formatNumber } = useLanguage();
  const { slug, icon, pointsReward, requiredLevel, userProgress } = module;
  
  const isLocked = userLevel < requiredLevel;
  const isCompleted = userProgress?.completed;

  const displayTitle = getModuleTitle(module);
  const displayDesc = getModuleDescription(module);
  
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
          {isLocked && <span className="status-badge locked-badge">{t("badgeLocked")}</span>}
          {isCompleted && <span className="status-badge completed-badge">{t("badgeCompleted")}</span>}
        </div>
      </div>
      
      <div className="module-card-body">
        <h3 className="module-card-title">{displayTitle}</h3>
        <p className="module-card-desc">{displayDesc}</p>
      </div>
      
      <div className="module-card-footer">
        <span className="module-xp">+{formatNumber(pointsReward)} XP</span>
        {!isLocked && !isCompleted && (
          <button className="start-quest-btn">{t("startQuest")}</button>
        )}
        {isCompleted && (
          <span className="module-score">{t("score")}: {formatNumber(userProgress?.quizScore)}%</span>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
