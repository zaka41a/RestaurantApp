import { useEffect, useState } from "react";

export default function MenuView() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost/RestaurantApp/backend/api/menu.php", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="page">
      <section className="surface-card section-card menu-view-page">
        <header className="page-header">
          <div className="page-header__info">
            <span className="eyebrow">Static overview</span>
            <h2 className="page-title">The read-only menu.</h2>
            <p className="page-subtitle">
              An elegant view optimized for lobby displays or quick back-of-house consultation.
            </p>
          </div>
        </header>

        <div className="menu-preview__table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Dish</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.name}</td>
                  <td>{Number(item.price).toFixed(2)} €</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div className="empty-state">No dishes available yet.</div>
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
