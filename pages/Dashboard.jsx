import React from "react";
import { useNavigate } from "react-router-dom";
import MaterialCard from "./MaterialCard";

export default function Dashboard() {
  const navigate = useNavigate();

  const materialData = [
    { name: "Furnitures", count: 12, icon: "🪑" },
    { name: "PVCs", count: 45, icon: "🧪" },
    { name: "Electricals", count: 28, icon: "⚡" },
    { name: "Cements", count: 90, icon: "🏗️" },
    { name: "Bricks", count: 150, icon: "🧱" },
    { name: "Briks (alt)", count: 150, icon: "🧱" },
    { name: "Tiles", count: 65, icon: "🔳" },
    { name: "Marbles", count: 34, icon: "💎" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header Section */}
      <header style={{ 
        backgroundColor: "white", 
        padding: "16px 40px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ backgroundColor: "#2563eb", padding: "8px", borderRadius: "8px", color: "white", fontWeight: "bold" }}>🏠</div>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>Construction Portal</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <div style={{ color: "#475569", fontSize: "14px", fontWeight: "600" }}>
            📞 <span style={{ marginLeft: "5px" }}>+1 234 567 890</span>
          </div>
          <button 
            onClick={() => navigate("/login")}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#dc2626", 
              fontWeight: "bold", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            Logout 🚪
          </button>
        </div>
      </header>

      {/* Grid Content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Material Inventory</h2>
          <p style={{ color: "#64748b" }}>Click on a category to view specific qualities and details.</p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
          gap: "24px" 
        }}>
          {materialData.map((material, index) => (
            <MaterialCard 
              key={index}
              name={material.name}
              count={material.count}
              icon={material.icon}
              onClick={() => navigate(`/qualities/${material.name.toLowerCase()}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}