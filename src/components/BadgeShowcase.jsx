import React from "react";
import { Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const BadgeShowcase = ({ badges = [] }) => {
  const { t, getBadgeName } = useLanguage();

  if (!badges || badges.length === 0) {
    return (
      <div className="empty-state">
        <p>{t("noBadgesEarned")}</p>
      </div>
    );
  }

  return (
    <div className="badges-row">
      {badges.map((badge, idx) => (
        <div key={idx} className="badge-item">
          <div className="badge-icon-circle">{badge.icon ? badge.icon : <Award size={22} />}</div>
          <span className="badge-name">{getBadgeName(badge.name)}</span>
        </div>
      ))}
    </div>
  );
};

export default BadgeShowcase;
