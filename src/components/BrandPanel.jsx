import { Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function BrandPanel({ mode }) {
  const { t } = useLanguage();
  const isSignup = mode === "signup";

  return (
    <div className="brand-panel">

      <div className="brand-logo">

        <div className="brand-icon">
          ⚖
        </div>

        <span>
          EduRight
        </span>

      </div>

      <Sparkles
        className="brand-sparkle"
        size={32}
      />

      <div className="hero-image">

        <div className="hero-image-placeholder">

          <div className="hero-emoji">
            {isSignup
              ? "👩‍🎓 👨‍🎓 📚"
              : "📚 👩‍🎓 📖"}
          </div>

          <span>
            {isSignup
              ? "Excited kids learning together in a classroom"
              : "Student surrounded by books, ready to learn"}
          </span>

        </div>

      </div>

      <div className="hero-text">

        <h1 style={{ whiteSpace: "pre-line" }}>
          {isSignup ? t("brandHeroSignupHeading") : t("brandHeroLoginHeading")}
        </h1>

        <p>
          {t("brandHeroText")}
        </p>

      </div>

      <div className="hero-pills">

        <span>{t("learn")}</span>
        <span>{t("explore")}</span>
        <span>{t("play")}</span>

      </div>

      <div className="circle circle-one"></div>
      <div className="circle circle-two"></div>

    </div>
  );
}

export default BrandPanel;