// src/ServerMenu.jsx
import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";

const API = "http://localhost/RestaurantApp/backend/api";
const IMG_BASE = "http://localhost/RestaurantApp/backend/";

export default function ServerMenu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/menu.php`, { credentials: "include" })
      .then((response) => response.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function logout() {
    await fetch(`${API}/auth/logout.php`, { credentials: "include" });
    window.location.href = "/";
  }

  return (
    <div className="page">
      <TopBar title="Service menu" onLogout={logout} backTo="/server" />

      <section className="surface-card section-card">
        <header className="page-header">
          <div className="page-header__info">
            <span className="eyebrow">Live menu</span>
            <h2 className="page-title">Every dish available during service.</h2>
            <p className="page-subtitle">
              Review the menu curated by management. Use descriptions and visuals to guide guest
              recommendations confidently.
            </p>
          </div>
        </header>

        <div className="catalog-grid">
          {items.map((item) => (
            <article key={item.id} className="catalog-card">
              <div className="catalog-card__media">
                {item.image_path ? (
                  <img src={`${IMG_BASE}${item.image_path}`} alt={item.name} />
                ) : (
                  <div className="catalog-card__placeholder">Visual coming soon</div>
                )}
              </div>
              <div className="catalog-card__body">
                <span className="catalog-card__category">{item.category}</span>
                <h3 className="catalog-card__title">{item.name}</h3>
                <p className="catalog-card__description">
                  {item.description || "No description has been provided for this dish yet."}
                </p>
                <div className="catalog-card__footer">
                  <span className="price-tag">{Number(item.price).toFixed(2)} €</span>
                </div>
              </div>
            </article>
          ))}
          {items.length === 0 && <div className="empty-state">No dishes to show.</div>}
        </div>
      </section>
    </div>
  );
}
