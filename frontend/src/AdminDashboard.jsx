import React from "react";
import Icon from "./components/Icon.jsx";

export default function AdminDashboard({ onLogout }) {
  async function handleLogout() {
    await fetch(
      `${
        import.meta.env.VITE_API_BASE ?? "http://localhost/RestaurantApp/backend/api"
      }/auth/logout.php`,
      { method: "POST", credentials: "include" }
    );
    onLogout();
  }

  return (
    <div className="page">
      <section className="surface-card section-card admin-dashboard">
        <span className="eyebrow">Admin overview</span>
        <h1 className="page-title">Welcome back to the control room.</h1>
        <p className="page-subtitle">
          Use the navigation to reach menu updates, staffing, tables, and live ordering in seconds.
        </p>
        <div className="hero__actions hero__actions--center">
          <button type="button" className="btn btn-danger" onClick={handleLogout}>
            <Icon name="logout" size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </section>
    </div>
  );
}
