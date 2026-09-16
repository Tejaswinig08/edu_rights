import { Check, Circle } from "lucide-react";

function PasswordRules({ password }) {
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

  let strength = "Weak";

  if (score >= 3) {
    strength = "Medium";
  }

  if (score === 5) {
    strength = "Strong";
  }

  return (
    <div className="password-rules">

      <div className="strength-header">
        <span>Password strength</span>

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
          text="8+ characters"
        />

        <Rule
          valid={rules.uppercase}
          text="Uppercase"
        />

        <Rule
          valid={rules.lowercase}
          text="Lowercase"
        />

        <Rule
          valid={rules.number}
          text="Number"
        />

        <Rule
          valid={rules.special}
          text="Special character"
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