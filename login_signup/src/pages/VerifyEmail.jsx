import { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthShell from "../components/AuthShell";
import api from "../api/axios";

function VerifyEmail() {

  const { token } =
    useParams();

  const [status, setStatus] =
    useState("loading");


  useEffect(() => {

    const verifyEmail = async () => {

      try {

        const response =
          await api.get(
            `/auth/verify-email/${token}`
          );

        toast.success(
          response.data.message
        );

        setStatus("success");

      }
      catch {

        setStatus("error");

      }

    };

    verifyEmail();

  }, [token]);


  return (

    <AuthShell

      mode="login"

      title={
        status === "success"
          ? "Email verified!"
          : status === "error"
          ? "Verification failed"
          : "Verifying your email..."
      }

      subtitle={
        status === "success"
          ? "Your account is ready. Continue your quest."
          : status === "error"
          ? "This verification link may be invalid or expired."
          : "Please wait while we verify your account."
      }

    >

      {status !== "loading" && (

        <div className="verify-area">

          <div
            className={`verify-icon ${
              status
            }`}
          >

            {status === "success"
              ? "✓"
              : "!"}

          </div>

          <Link
            to="/login"
            className="quest-button verify-button"
          >
            Go to Login
          </Link>

        </div>

      )}

    </AuthShell>
  );
}

export default VerifyEmail;