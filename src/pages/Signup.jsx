import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  KeyRound,
  Mail,
  UserRound,
} from "lucide-react";

import toast from "react-hot-toast";

import AuthShell from "../components/AuthShell";
import PasswordInput from "../components/PasswordInput";
import PasswordRules from "../components/PasswordRules";
import ErrorModal from "../components/ErrorModal";

import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function Signup() {

  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [form, setForm] = useState({

    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    role: "user",
    adminCode: "",

  });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [accountExists, setAccountExists] =
    useState(false);


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

  };


  const validate = () => {

    const newErrors = {};

    if (!form.name.trim()) {

      newErrors.name =
        t("fullNameRequired");

    }

    if (!form.email.trim()) {

      newErrors.email =
        t("emailRequired");

    }
   else if (
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    form.email.trim()
  )
) {
  newErrors.email = t("validEmail");
}


    const strongPassword =
      form.password.length >= 8 &&
      /[A-Z]/.test(form.password) &&
      /[a-z]/.test(form.password) &&
      /\d/.test(form.password) &&
      /[^A-Za-z0-9]/.test(form.password);


    if (!strongPassword) {

      newErrors.password =
        language === "hi"
          ? "पासवर्ड में कम से कम 8 वर्ण, बड़ा अक्षर, छोटा अक्षर, संख्या और विशेष वर्ण होना चाहिए"
          : "Password must contain at least 8 characters, uppercase, lowercase, number and special character";

    }


    if (
      form.password !==
      form.confirmPassword
    ) {

      newErrors.confirmPassword =
        t("passwordMismatch");

    }


    if (form.role === "admin" && !form.adminCode.trim()) {
      newErrors.adminCode =
        language === "hi"
          ? "व्यवस्थापक पंजीकरण कोड आवश्यक है"
          : language === "mr"
          ? "प्रशासक नोंदणी कोड आवश्यक आहे"
          : "Admin registration code is required";
    }

    if (!form.acceptTerms) {

      newErrors.acceptTerms =
        language === "hi"
          ? "कृपया नियम और शर्तें स्वीकार करें"
          : "Please accept the Terms & Conditions";

    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );

  };


const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validate()) {
    return;
  }

  setLoading(true);

  try {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
    };

    if (form.role === "admin") {
      payload.adminCode = form.adminCode.trim();
    }

    const response = await api.post("/auth/signup", payload);

    toast.success(
      response.data?.message ||
        t("signupSuccess")
    );

    toast(
      language === "hi"
        ? "सत्यापन के लिए अपना ईमेल देखें।"
        : "Check your email for verification."
    );

    navigate("/login");

  } catch (error) {
    const data = error.response?.data;

    if (data?.code === "ACCOUNT_EXISTS") {
      setAccountExists(true);
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


  return (

    <AuthShell

      mode="signup"

      title={t("signupTitle")}

      subtitle={t("signupSubtitle")}

    >

      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
      >

        {/* ROLE SELECTION */}
        <div className="role-selector-container">
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "800",
              color: "#006863",
              marginBottom: "8px",
              letterSpacing: "0.5px",
              textTransform: "uppercase"
            }}
          >
            {language === "hi" ? "अपनी भूमिका चुनें" : language === "mr" ? "आपली भूमिका निवडा" : language === "es" ? "Selecciona tu Rol" : "Select Your Role"}
          </label>
          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            <label
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px 16px",
                borderRadius: "18px",
                border: form.role === "user" ? "2px solid #00b8ad" : "2px solid #b9f2eb",
                background: form.role === "user" ? "#e6faf7" : "#fbfffe",
                cursor: "pointer",
                fontWeight: "800",
                fontSize: "15px",
                color: form.role === "user" ? "#006863" : "#689290",
                boxShadow: form.role === "user" ? "0 4px 12px rgba(0, 184, 173, 0.15)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === "user"}
                onChange={handleChange}
                style={{ accentColor: "#00b8ad", width: "17px", height: "17px", cursor: "pointer" }}
              />
              <span>{language === "es" ? "Usuario" : "User"}</span>
            </label>

            <label
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px 16px",
                borderRadius: "18px",
                border: form.role === "admin" ? "2px solid #00b8ad" : "2px solid #b9f2eb",
                background: form.role === "admin" ? "#e6faf7" : "#fbfffe",
                cursor: "pointer",
                fontWeight: "800",
                fontSize: "15px",
                color: form.role === "admin" ? "#006863" : "#689290",
                boxShadow: form.role === "admin" ? "0 4px 12px rgba(0, 184, 173, 0.15)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === "admin"}
                onChange={handleChange}
                style={{ accentColor: "#00b8ad", width: "17px", height: "17px", cursor: "pointer" }}
              />
              <span>{language === "es" ? "Administrador" : "Admin"}</span>
            </label>
          </div>
        </div>

        {/* ADMIN REGISTRATION CODE (Conditional) */}
        {form.role === "admin" && (
          <div>
            <div
              className={`input-box ${
                errors.adminCode
                  ? "input-error"
                  : ""
              }`}
            >
              <KeyRound size={21} />
              <input
                type="password"
                name="adminCode"
                value={form.adminCode}
                onChange={handleChange}
                placeholder={
                  language === "hi"
                    ? "व्यवस्थापक पंजीकरण कोड दर्ज करें *"
                    : language === "mr"
                    ? "प्रशासक नोंदणी कोड प्रविष्ट करा *"
                    : language === "es"
                    ? "Código de Registro de Administrador *"
                    : "Admin Registration Code *"
                }
                autoComplete="off"
              />
            </div>

            {errors.adminCode && (
              <small className="field-error">
                {errors.adminCode}
              </small>
            )}
          </div>
        )}

        {/* NAME */}

        <div>

          <div
            className={`input-box ${
              errors.name
                ? "input-error"
                : ""
            }`}
          >

            <UserRound size={21} />

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("fullNameLabel")}
              autoComplete="name"
            />

          </div>

          {errors.name && (

            <small className="field-error">
              {errors.name}
            </small>

          )}

        </div>


        {/* EMAIL */}

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
              autoComplete="email"
            />

          </div>

          {errors.email && (

            <small className="field-error">
              {errors.email}
            </small>

          )}

        </div>


        {/* PASSWORD */}

        <div>

          <div
            className={`input-box ${
              errors.password
                ? "input-error"
                : ""
            }`}
          >

            <PasswordInput
              value={form.password}
              onChange={handleChange}
              placeholder={t("passwordLabel")}
            />

          </div>

          <PasswordRules
            password={form.password}
          />

          {errors.password && (

            <small className="field-error">
              {errors.password}
            </small>

          )}

        </div>


        {/* CONFIRM PASSWORD */}

        <div>

          <div
            className={`input-box ${
              errors.confirmPassword
                ? "input-error"
                : ""
            }`}
          >

            <PasswordInput
              name="confirmPassword"
              value={
                form.confirmPassword
              }
              onChange={handleChange}
              placeholder={t("confirmPasswordLabel")}
            />

          </div>

          {form.confirmPassword &&
            form.password ===
              form.confirmPassword && (

              <small className="match-success">
                {language === "hi" ? "पासवर्ड मेल खाते हैं" : "Passwords match"}
              </small>

            )}

          {errors.confirmPassword && (

            <small className="field-error">
              {errors.confirmPassword}
            </small>

          )}

        </div>


        {/* TERMS */}

        <label
          className={`terms ${
            errors.acceptTerms
              ? "terms-error"
              : ""
          }`}
        >

          <input
            type="checkbox"
            name="acceptTerms"
            checked={
              form.acceptTerms
            }
            onChange={handleChange}
          />

          <span>

            {language === "hi" ? "मैं स्वीकार करता हूँ " : "I accept the "}

            <a
              href="#terms"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              {language === "hi" ? "नियम और शर्तें" : "Terms & Conditions"}
            </a>

          </span>

        </label>

        {errors.acceptTerms && (

          <small className="field-error">
            {errors.acceptTerms}
          </small>

        )}


        {/* BUTTON */}

        <button
          type="submit"
          className="quest-button"
          disabled={loading}
        >

          {loading
            ? t("creatingAccount")
            : t("createAccountBtn")}

        </button>


        <p className="switch-text">

          {t("alreadyHaveAccount")}{" "}

          <Link to="/login">
            {t("login")}
          </Link>

        </p>

      </form>


      {/* ACCOUNT EXISTS MODAL */}

      {accountExists && (

        <ErrorModal

          title={language === "hi" ? "खाता पहले से मौजूद है" : "Account Already Exists"}

          message={language === "hi" ? "इस ईमेल के साथ एक खाता पहले से मौजूद है।" : "An account with this email already exists."}

          primaryLabel={language === "hi" ? "लॉगिन पर जाएं" : "Go to Login"}

          onClose={() =>
            setAccountExists(false)
          }

          onPrimary={() =>
            navigate("/login")
          }

        />

      )}

    </AuthShell>
  );
}

export default Signup;