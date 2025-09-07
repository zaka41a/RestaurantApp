import React, { useEffect, useState } from "react";
import "./index.css";

export default function OrdersPage() {
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [cart, setCart] = useState([]);

  // Base URL pour les images (ton backend)
  const IMAGE_BASE = "http://localhost/RestaurantApp/backend/";

  // Charger menu et tables
  useEffect(() => {
    fetch("http://localhost/RestaurantApp/backend/api/menu.php", { credentials: "include" })
      .then((r) => r.json())
      .then(setMenu)
      .catch(() => setMenu([]));

    fetch("http://localhost/RestaurantApp/backend/api/tables.php", { credentials: "include" })
      .then((r) => r.json())
      .then(setTables)
      .catch(() => setTables([]));
  }, []);

  // Ajouter au panier
  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // Retirer un article du panier
  const removeFromCart = (id) => setCart(cart.filter((c) => c.id !== id));

  // Total
  const total = cart.reduce((sum, c) => sum + Number(c.price) * c.qty, 0);

  // Valider la commande
  const submitOrder = () => {
    if (!selectedTable) {
      alert("Choisissez une table !");
      return;
    }
    fetch("http://localhost/RestaurantApp/backend/api/orders.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_id: selectedTable,
        items: cart.map((c) => ({
          menu_item_id: c.id,
          qty: c.qty,
          unit_price: Number(c.price),
        })),
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          alert("Commande validée !");
          setCart([]);
        } else {
          alert("Erreur: " + JSON.stringify(d));
        }
      })
      .catch((e) => alert("Erreur réseau: " + e.message));
  };

  return (
    <div className="orders-container">
      {/* Colonne gauche : liste des plats */}
      <div className="menu-list">
        <h2>Prendre une commande</h2>

        <div className="table-select">
          <label>Table </label>
          <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
            <option value="">-- Choisir --</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                Table {t.id} ({t.seats} places) — {t.status}
              </option>
            ))}
          </select>
        </div>

        <div className="menu-grid">
          {menu.map((m) => (
            <div key={m.id} className="menu-card" onClick={() => addToCart(m)}>
              <img src={`${IMAGE_BASE}${m.image_path}`} alt={m.name} />
              <div className="menu-card-body">
                <p className="category">{m.category_name}</p>
                <h3 className="title">{m.name}</h3>
                {m.description ? (
                  <p className="description">{m.description}</p>
                ) : null}
                <p className="price">{Number(m.price).toFixed(2)} €</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colonne droite : panier */}
      <aside className="cart-box">
        <h3>🧺 Panier</h3>

        {cart.length === 0 ? (
          <p className="empty">Aucun article.</p>
        ) : (
          <ul className="cart-list">
            {cart.map((c) => (
              <li key={c.id} className="cart-item">
                <span className="cart-line">
                  {c.name} × {c.qty}
                </span>
                <button className="cart-remove" onClick={() => removeFromCart(c.id)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-total">
          Total: <strong>{total.toFixed(2)} €</strong>
        </div>

        <button className="cart-btn" disabled={cart.length === 0} onClick={submitOrder}>
          Valider la commande
        </button>
      </aside>
    </div>
  );
}
