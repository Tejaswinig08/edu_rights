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

function ResetPassword() {

  const { token } =
    useParams();

  const navigate =
    useNavigate();

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
        "Passwords do not match."
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
        response.data.message
      );

      navigate("/login");

    }
    catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Reset link is invalid or expired."
      );

    }
    finally {

      setLoading(false);

    }

  };


  return (

    <AuthShell

      mode="login"

      title="Create a new password"

      subtitle="Choose a strong password for your EduRight account."

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
              placeholder="New password"
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
            placeholder="Confirm new password"
          />

        </div>


        <button
          className="quest-button"
          disabled={loading}
        >

          {loading
            ? "⏳ Updating..."
            : "Update Password  ✨"}

        </button>

      </form>

    </AuthShell>
  );
}

export default ResetPassword;