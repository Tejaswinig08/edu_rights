import { useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthShell from "../components/AuthShell";
import PasswordInput from "../components/PasswordInput";
import PasswordRules from "../components/PasswordRules";

import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function ResetPassword() {

  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const { t } = useLanguage();

  const [form, setForm] =
    useState({
      password: "",
      confirmPassword: "",
    });

  const [loading, setLoading] =
    useState(false);


  const handleChange = (event) => {

    setForm((previous) => ({

      ...previous,

      [event.target.name]:
        event.target.value,

    }));

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    if (
      form.password !==
      form.confirmPassword
    ) {

      toast.error(
        t("passwordMismatch")
      );

      return;
    }

    setLoading(true);

    try {

      const response =
        await api.post(
          `/auth/reset-password/${token}`,
          form
        );

      toast.success(
        response.data.message || t("resetSuccess")
      );

      navigate("/login");

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

      title={t("resetPasswordTitle")}

      subtitle={t("resetPasswordSubtitle")}

    >

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <div>

          <div className="input-box">

            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t("passwordLabel")}
            />

          </div>

          <PasswordRules
            password={form.password}
          />

        </div>


        <div className="input-box">

          <PasswordInput
            name="confirmPassword"
            value={
              form.confirmPassword
            }
            onChange={handleChange}
            placeholder={t("confirmPasswordLabel")}
          />

        </div>


        <button
          className="quest-button"
          disabled={loading}
        >

          {loading
            ? t("resettingPassword")
            : t("resetPasswordBtn")}

        </button>

      </form>

    </AuthShell>
  );
}

export default ResetPassword;