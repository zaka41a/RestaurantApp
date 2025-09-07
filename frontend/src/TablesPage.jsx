import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
const API = "http://localhost/RestaurantApp/backend/api";

export default function TablesPage() {
  const [tables, setTables] = useState([]);

  async function loadTables() {
    const r = await fetch(`${API}/tables.php`, { credentials: "include" });
    setTables(await r.json());
  }
  useEffect(() => { loadTables(); }, []);

  async function toggleStatus(id, status) {
    const r = await fetch(`${API}/tables.php?id=${id}`, {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (r.ok) loadTables();
  }

  async function logout(){
    await fetch(`${API}/auth/logout.php`,{credentials:"include"});
    location.href="/";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0c1a", color: "#fff" }}>
      <TopBar title="Gestion des tables" onLogout={logout} />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
          gap: 16
        }}>
          {tables.map((t) => (
            <div key={t.id} style={{
              background: "#141529", border: "1px solid #ffffff22", borderRadius: 12, padding: 16, textAlign: "center"
            }}>
              <h2 style={{ fontSize: 20, margin: "0 0 6px" }}>Table {t.number}</h2>
              <p>Places : {t.seats}</p>
              <p>Status : <b style={{ color: t.status === "free" ? "lightgreen" : "tomato" }}>{t.status}</b></p>
              <button
                onClick={() => toggleStatus(t.id, t.status === "free" ? "occupied" : "free")}
                style={{
                  marginTop: 10,
                  background: t.status === "free" ? "#2563eb" : "#ef4444",
                  border: 0, color: "#fff", padding: "8px 12px", borderRadius: 8,
                }}
              >
                {t.status === "free" ? "Occuper" : "Libérer"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
