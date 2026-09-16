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

function Signup() {

  const navigate = useNavigate();

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
        "Name is required";

    }

    if (!form.email.trim()) {

      newErrors.email =
        "Email is required";

    }
   else if (
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    form.email.trim()
  )
) {
  newErrors.email = "Enter a valid email";
}


    const strongPassword =
      form.password.length >= 8 &&
      /[A-Z]/.test(form.password) &&
      /[a-z]/.test(form.password) &&
      /\d/.test(form.password) &&
      /[^A-Za-z0-9]/.test(form.password);


    if (!strongPassword) {

      newErrors.password =
        "Password must contain at least 8 characters, uppercase, lowercase, number and special character";

    }


    if (
      form.password !==
      form.confirmPassword
    ) {

      newErrors.confirmPassword =
        "Passwords do not match";

    }


    if (!form.acceptTerms) {

      newErrors.acceptTerms =
        "Please accept the Terms & Conditions";

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
        "Account created successfully!"
    );

    toast("Check your email for verification.", {
      icon: "✉️",
    });

    navigate("/login");

  } catch (error) {
    const data = error.response?.data;

    if (data?.code === "ACCOUNT_EXISTS") {
      setAccountExists(true);
    } else if (!error.response) {
      toast.error(
        "Unable to connect to the server. Please try again."
      );
    } else {
      toast.error(
        data?.message ||
          "Something went wrong. Please try again later."
      );
    }

  } finally {
    setLoading(false);
  }
};


  return (

    <AuthShell

      mode="signup"

      title="Create your account"

      subtitle="Join thousands of young explorers learning their rights."

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
              placeholder="Your name"
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
              placeholder="Email address"
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
              placeholder="Password"
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
              placeholder="Confirm password"
            />

          </div>

          {form.confirmPassword &&
            form.password ===
              form.confirmPassword && (

              <small className="match-success">
                ✓ Passwords match
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

            I accept the{" "}

            <a
              href="#terms"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              Terms & Conditions
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
            ? "⏳ Creating Account..."
            : "Start My Quest  ✨"}

        </button>


        <p className="switch-text">

          Already have an account?{" "}

          <Link to="/login">
            Log in
          </Link>

        </p>

      </form>


      {/* ACCOUNT EXISTS MODAL */}

      {accountExists && (

        <ErrorModal

          title="Account Already Exists"

          message="An account with this email already exists."

          primaryLabel="Go to Login"

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