import { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { Check } from "lucide-react";
import toast from "react-hot-toast";

import AuthShell from "../components/AuthShell";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function VerifyEmail() {

  const { token } =
    useParams();

  const { t, language } = useLanguage();

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
          response.data.message || t("emailVerifiedSuccess")
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
          ? (language === "hi" ? "ईमेल सत्यापित हो गया!" : "Email verified!")
          : status === "error"
          ? (language === "hi" ? "सत्यापन विफल" : "Verification failed")
          : t("verifyingEmail")
      }

      subtitle={
        status === "success"
          ? (language === "hi" ? "आपका खाता तैयार है। अपनी यात्रा जारी रखें।" : "Your account is ready. Continue your quest.")
          : status === "error"
          ? (language === "hi" ? "यह सत्यापन लिंक अमान्य या समाप्त हो सकता है।" : "This verification link may be invalid or expired.")
          : (language === "hi" ? "कृपया प्रतीक्षा करें जब तक हम आपके खाते को सत्यापित करते हैं।" : "Please wait while we verify your account.")
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
              ? <Check size={28} />
              : "!"}

          </div>

          <Link
            to="/login"
            className="quest-button verify-button"
          >
            {language === "hi" ? "लॉगिन पर जाएं" : "Go to Login"}
          </Link>

        </div>

      )}

    </AuthShell>
  );
}

export default VerifyEmail;