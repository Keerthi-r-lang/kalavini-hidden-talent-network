// src/pages/Register.jsx
//
// Registration page. Same split-panel layout as Login (shares
// Auth.module.css). Collects name, email, password, and a
// confirm-password field (confirm-password is a frontend-only
// check - the backend never sees it, it just protects against
// typos before we send the real password).
//
// On success, useAuth().register() both creates the account AND
// logs the user in immediately (the backend returns a token on
// registration), so we navigate straight to the dashboard.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      // confirmPassword is intentionally excluded - the backend
      // doesn't expect or need it.
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.brandPanel}>
        <div className={styles.brandLogo}>Kalavini</div>
        <div className={styles.brandContent}>
          <h2>Teach what you know. Learn what you love.</h2>
          <p>
            Join a community where skills are the currency. No money changes
            hands - just knowledge, craft, and connection.
          </p>
        </div>
        <div className={styles.brandFooterNote}>
          Art &middot; Knowledge &middot; Culture &middot; Community
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <h1>Create your account</h1>
          <p className={styles.formSubtitle}>
            Already have an account? <Link to="/login">Log in</Link> instead.
          </p>

          {serverError && <div className={styles.serverError}>{serverError}</div>}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={fieldErrors.name ? styles.inputError : ""}
                placeholder="Asha Rao"
              />
              {fieldErrors.name && (
                <span className={styles.fieldErrorText}>{fieldErrors.name}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={fieldErrors.email ? styles.inputError : ""}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <span className={styles.fieldErrorText}>{fieldErrors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={fieldErrors.password ? styles.inputError : ""}
                placeholder="At least 6 characters"
              />
              {fieldErrors.password && (
                <span className={styles.fieldErrorText}>{fieldErrors.password}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={fieldErrors.confirmPassword ? styles.inputError : ""}
                placeholder="Re-enter your password"
              />
              {fieldErrors.confirmPassword && (
                <span className={styles.fieldErrorText}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className={styles.switchText}>
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
