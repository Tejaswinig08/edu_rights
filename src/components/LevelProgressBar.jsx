import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LevelProgressBar = ({ points = 0, level = 1 }) => {
  const { t, getLevelName, formatNumber } = useLanguage();
  const thresholds = [0, 100, 200, 325, 450];
  
  const currentLevelIndex = level - 1;
  const levelName = getLevelName(level);
  
  const currentThreshold = thresholds[currentLevelIndex] || thresholds[thresholds.length - 1];
  const nextThreshold = thresholds[currentLevelIndex + 1];
  
  const isMaxLevel = level >= 5;
  
  let progressPercent = 100;
  if (!isMaxLevel) {
    const pointsInLevel = Math.max(0, points - currentThreshold);
    const levelRange = nextThreshold - currentThreshold;
    progressPercent = Math.min(100, (pointsInLevel / levelRange) * 100);
  }

  return (
    <div className="level-bar-wrapper">
      <div className="level-bar-header">
        <span className="level-name">{t("level")} {formatNumber(level)}: {levelName}</span>
        <span className="level-bar-text">
          {isMaxLevel ? t("maxLevel") : `${formatNumber(points)} / ${formatNumber(nextThreshold)} XP`}
        </span>
      </div>
      <div className="level-bar-track">
        <div 
          className="level-bar-fill" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default LevelProgressBar;
