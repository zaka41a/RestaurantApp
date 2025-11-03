import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";

const API = "http://localhost/RestaurantApp/backend/api";
const IMG_BASE = "http://localhost/RestaurantApp/backend/";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    category_id: 1,
    name: "",
    price: "",
    image_path: "",
    description: "",
  });
  const [file, setFile] = useState(null);

  async function load() {
    const response = await fetch(`${API}/menu.php`, { credentials: "include" });
    setItems(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e) {
    e.preventDefault();

    if (file) {
      const fd = new FormData();
      fd.append("category_id", form.category_id);
      fd.append("name", form.name);
      fd.append("price", form.price);
      fd.append("description", form.description);
      fd.append("image", file);

      const response = await fetch(`${API}/menu.php`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) return alert(data.error || "Image upload failed.");
    } else {
      const response = await fetch(`${API}/menu.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return alert(data.error || "Unable to save the dish.");
    }

    setForm({ category_id: 1, name: "", price: "", image_path: "", description: "" });
    setFile(null);
    await load();
  }

  async function del(id) {
    if (!confirm("Remove this dish from the menu?")) return;
    const response = await fetch(`${API}/menu.php?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) load();
  }

  async function logout() {
    await fetch(`${API}/auth/logout.php`, { credentials: "include" });
    window.location.href = "/";
  }

  return (
    <div className="page">
      <TopBar title="Menu management" onLogout={logout} />

      <section className="surface-card section-card">
        <header className="page-header">
          <div className="page-header__info">
            <span className="eyebrow">Restaurant menu</span>
            <h2 className="page-title">Add, illustrate, and publish signature dishes.</h2>
            <p className="page-subtitle">
              Upload photography, set pricing, and push instant updates to every ordering interface.
            </p>
          </div>
        </header>

        <form className="form-grid" onSubmit={add}>
          <div className="form-grid inline">
            <select
              className="select"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
            >
              <option value={1}>Starters</option>
              <option value={2}>Pizzas</option>
              <option value={3}>Burgers</option>
              <option value={4}>Pasta</option>
              <option value={5}>Salads</option>
              <option value={6}>Desserts</option>
              <option value={7}>Drinks</option>
            </select>
            <input
              className="input"
              placeholder="Dish name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Price (€)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <textarea
            className="textarea"
            placeholder="Optional description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />

          <div className="page-header__actions">
            <button type="submit" className="btn btn-primary">
              Add dish
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setForm({ category_id: 1, name: "", price: "", image_path: "", description: "" });
                setFile(null);
              }}
            >
              Reset form
            </button>
          </div>
        </form>
      </section>

      <section className="menu-preview">
        <div className="surface-card menu-preview__table">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Category</th>
                <th>Name</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {item.image_path ? (
                      <span className="menu-thumb">
                        <img src={`${IMG_BASE}${item.image_path}`} alt={item.name} />
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{item.category}</td>
                  <td>{item.name}</td>
                  <td>{Number(item.price).toFixed(2)} €</td>
                  <td>
                    <button type="button" className="btn btn-danger" onClick={() => del(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">No dishes published yet.</div>
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
