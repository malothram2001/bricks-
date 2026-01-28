import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import { useAuth } from "./hooks/useAuth";


export default function App() {
  const auth = useAuth();

  // 🔴 SAFETY CHECK (prevents crash)
  if (!auth) {
    return <h2>Auth context not available</h2>;
  }

  const { isLoggedIn } = auth;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/products/:category"
        element={isLoggedIn ? <Products /> : <Navigate to="/login" />}
      />

      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}
