import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import toast from "react-hot-toast";

import AuthShell from "../components/AuthShell";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function ForgotPassword() {

  const { t } = useLanguage();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email)
    ) {

      toast.error(
        t("validEmail")
      );

      return;
    }

    setLoading(true);

    try {

      const response =
        await api.post(
          "/auth/forgot-password",
          { email }
        );

      toast.success(
        response.data.message || t("resetLinkSent")
      );

    }
    catch (error) {

      toast.error(
        error.response?.data?.message ||
        t("somethingWrong")
      );

    }
    finally {

      setLoading(false);

    }

  };


  return (

    <AuthShell

      mode="login"

      title={t("forgotPasswordTitle")}

      subtitle={t("forgotPasswordSubtitle")}

    >

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <div className="input-box">

          <Mail size={21} />

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder={t("emailLabel")}
          />

        </div>


        <button
          className="quest-button"
          disabled={loading}
        >

          {loading
            ? t("sendingResetLink")
            : t("sendResetLinkBtn")}

        </button>


        <p className="switch-text">

          <Link to="/login">

            <ArrowLeft size={16} />

            {t("backToLogin")}

          </Link>

        </p>

      </form>

    </AuthShell>
  );
}

export default ForgotPassword;