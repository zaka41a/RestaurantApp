import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";

const API = "http://localhost/RestaurantApp/backend/api";

export default function TablesPage() {
  const [tables, setTables] = useState([]);

  async function loadTables() {
    const response = await fetch(`${API}/tables.php`, { credentials: "include" });
    setTables(await response.json());
  }

  useEffect(() => {
    loadTables();
  }, []);

  async function toggleStatus(id, status) {
    const response = await fetch(`${API}/tables.php?id=${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) loadTables();
  }

  async function logout() {
    await fetch(`${API}/auth/logout.php`, { credentials: "include" });
    window.location.href = "/";
  }

  return (
    <div className="page">
      <TopBar title="Table management" onLogout={logout} />

      <section className="surface-card section-card">
        <header className="page-header">
          <div className="page-header__info">
            <span className="eyebrow">Dining room map</span>
            <h2 className="page-title">Monitor real-time availability at a glance.</h2>
            <p className="page-subtitle">
              Toggle a table between available and occupied to keep everyone synced and speed up
              turnover.
            </p>
          </div>
        </header>

        <div className="tiles-grid">
          {tables.map((table) => (
            <div key={table.id} className="table-card">
              <h2>Table {table.number}</h2>
              <p>Seats available: {table.seats}</p>
              <span className={`status-pill ${table.status}`}>
                {table.status === "free" ? "Available" : "Occupied"}
              </span>
              <div className="table-card__actions">
                <button
                  type="button"
                  className={table.status === "free" ? "btn btn-outline" : "btn btn-danger"}
                  onClick={() => toggleStatus(table.id, table.status === "free" ? "occupied" : "free")}
                >
                  {table.status === "free" ? "Mark as occupied" : "Mark as free"}
                </button>
              </div>
            </div>
          ))}
          {tables.length === 0 && (
            <div className="empty-state">No tables to display right now.</div>
          )}
        </div>
      </section>
    </div>
  );
}
