import { useState } from "react";
import logoWord from "./assets/logo-word.svg";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("http://localhost/RestaurantApp/backend/api/auth/login.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (response.ok && data.success) {
      onLogin(data);
    } else {
      alert(data.message || "Invalid credentials");
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card surface-card">
        <div className="login-card__head">
          <span className="brand-lockup">
            <img src={logoWord} alt="RestaurantApp" />
          </span>
          <div>
            <p className="eyebrow">Secure workspace</p>
            <h1 className="page-title">Sign in</h1>
            <p className="page-subtitle">
              Authenticate with your staff account to manage the dining room and service flow.
            </p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Work email</label>
            <input
              type="email"
              className="input"
              placeholder="e.g. server@restaurant.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in…" : "Access workspace"}
          </button>
        </form>

        <div className="login-footer">© 2025 RestaurantApp • Operated by Zaka41a</div>
      </div>
    </div>
  );
}
