import React from "react";

export default function AdminDashboard({ onLogout }) {
  async function handleLogout() {
    await fetch(
      `${import.meta.env.VITE_API_BASE ?? "http://localhost/RestaurantApp/backend/api"}/auth/logout.php`,
      { method: "POST", credentials: "include" }
    );
    onLogout();
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>👨‍💼 Espace Admin</h1>
      <p>Bienvenue dans votre tableau de bord.</p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          background: "linear-gradient(90deg, #ef4444, #dc2626)",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 10px #00000033",
        }}
      >
        🚪 Déconnexion
      </button>
    </div>
  );
}
