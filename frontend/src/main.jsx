import React, { useEffect, useState, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./Login.jsx";
import AdminHome from "./AdminHome.jsx";
import ServerHome from "./ServerHome.jsx";
import ServersPage from "./ServersPage.jsx";
import TablesPage from "./TablesPage.jsx";
import MenuPage from "./MenuPage.jsx";
import OrdersPage from "./OrdersPage.jsx";
import MenuView from "./MenuView.jsx";

// Chargement différé du composant ServerMenu (correct, sans "await" dans JSX)
const ServerMenu = React.lazy(() => import("./ServerMenu.jsx"));

function App() {
  const [me, setMe] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("http://localhost/RestaurantApp/backend/api/auth/me.php", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.auth) setMe(d);
      })
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;
  if (!me) return <Login onLogin={setMe} />;

  const isAdmin = me.role_id === 1;

  return (
    <Routes>
      {isAdmin ? (
        <>
          {/* Admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/admin/tables" element={<TablesPage />} />
          <Route path="/admin/menu" element={<MenuPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </>
      ) : (
        <>
          {/* Serveur : page d’atterrissage = accueil serveur */}
          <Route path="/" element={<Navigate to="/server" replace />} />
          <Route path="/server" element={<ServerHome />} />

          {/* Pages serveur */}
          <Route path="/server/orders" element={<OrdersPage />} />
          <Route path="/server/tables" element={<TablesPage />} />
          <Route
            path="/server/menu"
            element={
              <Suspense fallback={<div style={{ padding: 24 }}>Chargement…</div>}>
                <ServerMenu />
              </Suspense>
            }
          />

          {/* (optionnel) ancienne vue simple du menu */}
          <Route path="/menu-view" element={<MenuView />} />

          <Route path="*" element={<Navigate to="/server" replace />} />
        </>
      )}
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
