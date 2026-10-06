import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AuthTabs({ active }) {
  const { t } = useLanguage();

  return (
    <div className="auth-tabs">

      <Link
        to="/login"
        className={active === "login" ? "active" : ""}
      >
        {t("login")}
      </Link>

      <Link
        to="/signup"
        className={active === "signup" ? "active" : ""}
      >
        {t("signup")}
      </Link>

    </div>
  );
}

export default AuthTabs;