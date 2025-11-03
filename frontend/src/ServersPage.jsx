import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "./components/TopBar";
import Icon from "./components/Icon.jsx";

export default function ServersPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function logout() {
    await fetch("http://localhost/RestaurantApp/backend/api/auth/logout.php", {
      credentials: "include",
    });
    window.location.href = "/";
  }

  async function load() {
    const response = await fetch("http://localhost/RestaurantApp/backend/api/admin/servers.php", {
      credentials: "include",
    });
    setList(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function addServer(e) {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("http://localhost/RestaurantApp/backend/api/admin/servers.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (response.ok) {
      setForm({ full_name: "", email: "", phone: "", password: "" });
      load();
    } else {
      const err = await response.json().catch(() => ({}));
      alert(err.error || "Unable to create the server profile.");
    }
  }

  async function remove(id) {
    if (!confirm("Remove this server from the team?")) return;
    const response = await fetch(
      `http://localhost/RestaurantApp/backend/api/admin/servers.php?id=${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (response.ok) load();
  }

  return (
    <div className="page">
      <TopBar
        title="Server management"
        onLogout={logout}
        backTo="/admin"
        right={
          <Link to="/admin/tables" className="btn btn-outline">
            <Icon name="table" size={18} />
            <span>Table board</span>
          </Link>
        }
      />

      <section className="surface-card section-card">
        <header className="page-header">
          <div className="page-header__info">
            <span className="eyebrow">Floor team</span>
            <h2 className="page-title">Invite your servers and keep the service coordinated.</h2>
            <p className="page-subtitle">
              Capture their contact details. Provide a starter password—they can update it after the
              first login.
            </p>
          </div>
        </header>

        <form className="form-grid" onSubmit={addServer}>
          <div className="form-grid inline">
            <input
              required
              placeholder="Full name"
              className="input"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Work email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-grid inline">
            <input
              placeholder="Phone number (optional)"
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              placeholder="Initial password (default: server123)"
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="page-header__actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating…" : "Add server"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setForm({ full_name: "", email: "", phone: "", password: "" })}
            >
              Clear form
            </button>
          </div>
        </form>
      </section>

      <section className="menu-preview">
        <div className="surface-card menu-preview__table">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((server) => (
                <tr key={server.id}>
                  <td>{server.id}</td>
                  <td>{server.full_name}</td>
                  <td>{server.email}</td>
                  <td>{server.phone || "—"}</td>
                  <td>{server.created_at?.slice(0, 19).replace("T", " ")}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => remove(server.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">No server profiles yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
