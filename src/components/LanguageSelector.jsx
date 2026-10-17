import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (langCode) => {
    if (langCode === "en" || langCode === "hi" || langCode === "mr" || langCode === "es") {
      setLanguage(langCode);
    }
  };

  return (
    <div className="language-selector" aria-label="Language selection">
      <button
        type="button"
        className={`lang-btn ${language === "en" ? "active" : ""}`}
        onClick={() => handleSelect("en")}
      >
        English
      </button>

      <span className="lang-divider">|</span>

      <button
        type="button"
        className={`lang-btn ${language === "hi" ? "active" : ""}`}
        onClick={() => handleSelect("hi")}
      >
        हिंदी
      </button>

      <span className="lang-divider">|</span>

      <button
        type="button"
        className={`lang-btn ${language === "mr" ? "active" : ""}`}
        onClick={() => handleSelect("mr")}
      >
        मराठी
      </button>

      <span className="lang-divider">|</span>

      <button
        type="button"
        className={`lang-btn ${language === "es" ? "active" : ""}`}
        onClick={() => handleSelect("es")}
      >
        Español
      </button>
    </div>
  );
};

export default LanguageSelector;
