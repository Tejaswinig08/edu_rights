import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import toast from "react-hot-toast";

import AuthShell from "../components/AuthShell";
import api from "../api/axios";

function ForgotPassword() {

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
        "Enter a valid email."
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
        response.data.message
      );

    }
    catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong."
      );

    }
    finally {

      setLoading(false);

    }

  };


  return (

    <AuthShell

      mode="login"

      title="Forgot your password?"

      subtitle="Enter your email and we'll send you a secure reset link."

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
            placeholder="Email address"
          />

        </div>


        <button
          className="quest-button"
          disabled={loading}
        >

          {loading
            ? "⏳ Sending..."
            : "Send Reset Link  ✨"}

        </button>


        <p className="switch-text">

          <Link to="/login">

            <ArrowLeft size={16} />

            Back to login

          </Link>

        </p>

      </form>

    </AuthShell>
  );
}

export default ForgotPassword;