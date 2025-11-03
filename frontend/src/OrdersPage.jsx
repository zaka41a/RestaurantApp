import React, { useEffect, useState } from "react";

const IMAGE_BASE = "http://localhost/RestaurantApp/backend/";

export default function OrdersPage() {
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost/RestaurantApp/backend/api/menu.php", { credentials: "include" })
      .then((response) => response.json())
      .then(setMenu)
      .catch(() => setMenu([]));

    fetch("http://localhost/RestaurantApp/backend/api/tables.php", { credentials: "include" })
      .then((response) => response.json())
      .then(setTables)
      .catch(() => setTables([]));
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((line) => line.id !== id));

  const total = cart.reduce((sum, line) => sum + Number(line.price) * line.qty, 0);

  const submitOrder = () => {
    if (!selectedTable) {
      alert("Select a table before submitting the order.");
      return;
    }

    fetch("http://localhost/RestaurantApp/backend/api/orders.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_id: selectedTable,
        items: cart.map((line) => ({
          menu_item_id: line.id,
          qty: line.qty,
          unit_price: Number(line.price),
        })),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert("Order submitted successfully.");
          setCart([]);
        } else {
          alert("Something went wrong: " + JSON.stringify(data));
        }
      })
      .catch((error) => alert("Network error: " + error.message));
  };

  return (
    <div className="page">
      <div className="orders-layout">
        <section className="surface-card orders-menu">
          <header className="page-header">
            <div className="page-header__info">
              <span className="eyebrow">Order capture</span>
              <h2 className="page-title">Build the perfect ticket in a few taps.</h2>
              <p className="page-subtitle">
                Select a table, add dishes, and send the order directly to the kitchen workflow.
              </p>
            </div>
          </header>

          <div className="table-select">
            <label>Table</label>
            <select
              className="select"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="">Select a table</option>
              {tables.map((table) => {
                const statusLabel =
                  table.status === "free"
                    ? "available"
                    : table.status === "occupied"
                    ? "occupied"
                    : table.status;
                return (
                  <option key={table.id} value={table.id}>
                    Table {table.id} ({table.seats} seats) — {statusLabel}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="catalog-grid">
            {menu.map((item) => (
              <article key={item.id} className="catalog-card" onClick={() => addToCart(item)}>
                <div className="catalog-card__media">
                  {item.image_path ? (
                    <img src={`${IMAGE_BASE}${item.image_path}`} alt={item.name} />
                  ) : null}
                </div>
                <div className="catalog-card__body">
                  <span className="catalog-card__category">{item.category_name}</span>
                  <h3 className="catalog-card__title">{item.name}</h3>
                  <p className="catalog-card__description">
                    {item.description || "No description available for this dish yet."}
                  </p>
                  <div className="catalog-card__footer">
                    <span className="price-tag">{Number(item.price).toFixed(2)} €</span>
                    <span className="badge badge-neutral">Add</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="orders-cart surface-card">
          <div className="page-header cart-header">
            <div className="page-header__info">
              <span className="eyebrow">Current basket</span>
              <h3 className="page-title cart-title">Live order</h3>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">No items added to this order yet.</div>
          ) : (
            <ul className="cart-list">
              {cart.map((line) => (
                <li key={line.id} className="cart-item">
                  <div className="cart-item__text">
                    <span className="cart-item__title">{line.name}</span>
                    <span className="cart-item__meta">
                      {line.qty} × {Number(line.price).toFixed(2)} €
                    </span>
                  </div>
                  <button className="cart-remove" type="button" onClick={() => removeFromCart(line.id)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="cart-summary">
            <span>Total</span>
            <span className="price-tag">{total.toFixed(2)} €</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={cart.length === 0}
            onClick={submitOrder}
          >
            Submit order
          </button>
        </aside>
      </div>
    </div>
  );
}
