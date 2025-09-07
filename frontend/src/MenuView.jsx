import { useEffect, useState } from "react";

const th = { textAlign: "left", padding: "10px 8px" };
const td = { padding: "10px 8px" };

export default function MenuView() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost/RestaurantApp/backend/api/menu.php", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0c1a", color: "#eaeaff", padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 18 }}>📋 Menu</h1>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Catégorie</th>
              <th style={th}>Plat</th>
              <th style={th}>Prix</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} style={{ borderTop: "1px solid #ffffff22" }}>
                <td style={td}>{i.category}</td>
                <td style={td}>{i.name}</td>
                <td style={td}>{(+i.price).toFixed(2)} €</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td style={td} colSpan={3}>
                  Aucun plat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
