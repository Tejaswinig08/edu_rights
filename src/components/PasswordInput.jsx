import { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

function PasswordInput({
  name = "password",
  value = "",
  onChange,
  placeholder = "Password",
  autoComplete = "new-password",
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <>
      <LockKeyhole size={21} />

      <input
        type={
          showPassword
            ? "text"
            : "password"
        }

        name={name}

        value={value}

        onChange={onChange}

        placeholder={placeholder}

        autoComplete={autoComplete}

        spellCheck="false"
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() =>
          setShowPassword(
            (previous) => !previous
          )
        }

        aria-label={
          showPassword
            ? "Hide password"
            : "Show password"
        }
      >
        {showPassword ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </>
  );
}

export default PasswordInput;