import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

// Handles user login and redirects back to the page the user originally wanted.
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Updates the login form whenever the user types.
  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // Validates the form, calls the login API, and stores the returned JWT.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.includes("@") || !form.password) {
      setError("Enter a valid email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Login failed. Check your email and password."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Login</h1>
      <p className="muted">Use your account to access the cart and orders.</p>

      <form className="form-stack" onSubmit={handleSubmit}>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="muted">No account yet? <Link to="/register">Create one</Link></p>
    </section>
  );
}
