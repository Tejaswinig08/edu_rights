import { Link } from "react-router-dom";

function AuthTabs({ active }) {
  return (
    <div className="auth-tabs">

      <Link
        to="/login"
        className={active === "login" ? "active" : ""}
      >
        Log In
      </Link>

      <Link
        to="/signup"
        className={active === "signup" ? "active" : ""}
      >
        Sign Up
      </Link>

    </div>
  );
}

export default AuthTabs;