import { Check, Circle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function PasswordRules({ password }) {
  const { t, language } = useLanguage();

  if (!password) {
    return null;
  }

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(rules).filter(Boolean).length;

  let strength = language === "hi" ? "कमज़ोर" : "Weak";

  if (score >= 3) {
    strength = language === "hi" ? "मध्यम" : "Medium";
  }

  if (score === 5) {
    strength = language === "hi" ? "मजबूत" : "Strong";
  }

  return (
    <div className="password-rules">

      <div className="strength-header">
        <span>{language === "hi" ? "पासवर्ड की मजबूती" : "Password strength"}</span>

        <strong>{strength}</strong>
      </div>

      <div className="strength-bar">
        <span
          style={{
            width: `${score * 20}%`,
          }}
        />
      </div>

      <div className="rules">

        <Rule
          valid={rules.length}
          text={language === "hi" ? "8+ वर्ण" : "8+ characters"}
        />

        <Rule
          valid={rules.uppercase}
          text={language === "hi" ? "बड़ा अक्षर (A-Z)" : "Uppercase"}
        />

        <Rule
          valid={rules.lowercase}
          text={language === "hi" ? "छोटा अक्षर (a-z)" : "Lowercase"}
        />

        <Rule
          valid={rules.number}
          text={language === "hi" ? "संख्या (0-9)" : "Number"}
        />

        <Rule
          valid={rules.special}
          text={language === "hi" ? "विशेष वर्ण" : "Special character"}
        />

      </div>

    </div>
  );
}

function Rule({ valid, text }) {
  return (
    <span
      className={
        valid
          ? "rule valid"
          : "rule"
      }
    >
      {valid ? (
        <Check size={14} />
      ) : (
        <Circle size={12} />
      )}

      {text}
    </span>
  );
}

export default PasswordRules;