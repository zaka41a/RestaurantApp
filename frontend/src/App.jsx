import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OrdersPage from "./OrdersPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/orders" replace />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="*" element={<Navigate to="/orders" replace />} />
    </Routes>
  );
}
