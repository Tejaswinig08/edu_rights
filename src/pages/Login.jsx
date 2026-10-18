import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

import AuthShell from "../components/AuthShell";
import PasswordInput from "../components/PasswordInput";
import ErrorModal from "../components/ErrorModal";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  // ==========================================
  // FORM — ALWAYS START EMPTY
  // ==========================================

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [invalidCredentials, setInvalidCredentials] =
    useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    // Remove error when user starts correcting field
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email = t("validEmail");
    }

    if (!form.password) {
      newErrors.password = t("passwordRequired");
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await login({
        email: form.email.trim(),
        password: form.password,
      });

      // ======================================
      // SUCCESS
      // ======================================

      toast.success(t("loginSuccess"));

      // Clear form after successful login
      setForm({
        email: "",
        password: "",
        rememberMe: false,
      });

      // Navigate after successful login
      if (res?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      const data =
        error.response?.data;

      if (
        data?.code ===
        "INVALID_CREDENTIALS"
      ) {
        setInvalidCredentials(true);
      } else if (!error.response) {
        toast.error(t("serverErrorMsg"));
      } else {
        toast.error(
          data?.message || t("somethingWrong")
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <AuthShell
      mode="login"
      title={t("loginTitle")}
      subtitle={t("loginSubtitle")}
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >

        {/* =====================================
            EMAIL
        ====================================== */}

        <div>
          <div
            className={`input-box ${
              errors.email
                ? "input-error"
                : ""
            }`}
          >
            <Mail size={21} />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t("emailLabel")}

              /*
                Prevent browser from restoring
                previously entered login data.
              */
              autoComplete="off"

              spellCheck="false"
            />
          </div>

          {errors.email && (
            <small className="field-error">
              {errors.email}
            </small>
          )}
        </div>


        {/* =====================================
            PASSWORD
        ====================================== */}

        <div>
          <div
            className={`input-box ${
              errors.password
                ? "input-error"
                : ""
            }`}
          >
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t("passwordLabel")}
              autoComplete="new-password"
            />
          </div>

          {errors.password && (
            <small className="field-error">
              {errors.password}
            </small>
          )}
        </div>


        {/* =====================================
            REMEMBER ME
        ====================================== */}

        <div className="login-options">

          <label className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              autoComplete="off"
            />

            <span>
              {t("rememberMe")}
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="forgot-link"
          >
            {t("forgotPasswordLink")}
          </Link>

        </div>


        {/* =====================================
            LOGIN BUTTON
        ====================================== */}

        <button
          type="submit"
          className="quest-button"
          disabled={loading}
        >
          {loading
            ? t("loggingIn")
            : t("letsGo")}
        </button>


        {/* =====================================
            SIGNUP
        ====================================== */}

        <p className="switch-text">
          {t("newToEduRight")}{" "}

          <Link to="/signup">
            {t("signup")}
          </Link>
        </p>

      </form>


      {/* =======================================
          INVALID LOGIN MODAL
      ======================================== */}

      {invalidCredentials && (
        <ErrorModal
          title={t("loginFailed")}
          message={t("invalidCredsMsg")}
          primaryLabel={t("tryAgain")}
          onClose={() =>
            setInvalidCredentials(false)
          }
          onPrimary={() => {
            setInvalidCredentials(false);

            setForm((previous) => ({
              ...previous,
              password: "",
            }));
          }}
        />
      )}

    </AuthShell>
  );
}

export default Login;