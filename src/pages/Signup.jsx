import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
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
    const response = await api.post("/auth/signup", {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    toast.success(
      response.data?.message ||
        t("signupSuccess")
    );

    toast(
      language === "hi"
        ? "सत्यापन के लिए अपना ईमेल देखें।"
        : "Check your email for verification.",
      { icon: "✉️" }
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
                ✓ {language === "hi" ? "पासवर्ड मेल खाते हैं" : "Passwords match"}
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