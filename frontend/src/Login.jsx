import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("http://localhost/RestaurantApp/backend/api/auth/login.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await r.json().catch(() => ({}));
    setLoading(false);

    if (r.ok && data.success) {
      onLogin(data);
    } else {
      alert(data.message || "Login failed");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* En-tête */}
        <div className="login-header">
          <div>
            <h1 className="login-title">RestaurantApp</h1>
            <p className="login-sub">Accès sécurisé</p>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="ex: zaksab89@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="login-label">Mot de passe</label>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-btn"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "👁️" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Liens */}


        <div className="login-copy">© 2025 Zaka41a</div>
      </div>
    </div>
  );
}
