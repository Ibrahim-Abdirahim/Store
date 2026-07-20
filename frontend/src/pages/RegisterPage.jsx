import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

// Handles new customer account registration.
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Updates the register form whenever the user types.
  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // Checks the form before sending registration details to the backend.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(form.fullName)) {
      setError("Full name can only contain letters and spaces.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Create account</h1>
      <p className="muted">Registration logs you in automatically after success.</p>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Full name
          <input name="fullName" value={form.fullName} onChange={updateField} />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={updateField} />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </section>
  );
}
