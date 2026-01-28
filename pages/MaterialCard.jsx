import React from 'react';

const MaterialCard = ({ name, count, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        textAlign: "center",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
      }}
    >
      {/* Order Count Badge */}
      <div style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        backgroundColor: "#2563eb",
        color: "white",
        fontSize: "10px",
        fontWeight: "bold",
        padding: "4px 8px",
        borderRadius: "8px",
        zIndex: 2
      }}>
        {count} Orders
      </div>

      {/* Image Container - Replaces the Emoji Div */}
      <div style={{ 
        width: "100%", 
        height: "140px", 
        marginBottom: "16px", 
        borderRadius: "12px", 
        overflow: "hidden",
        backgroundColor: "#f1f5f9" // Light grey fallback background
      }}>
        <img
          src={icon}
          alt={name}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover", // Keeps your uploaded photos from stretching
            display: "block"
          }}
          // Simple fallback if an image fails to load
          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
        />
      </div>

      <h3 style={{ 
        fontSize: "18px", 
        fontWeight: "bold", 
        color: "#1e293b", 
        margin: "0 0 8px 0" 
      }}>
        {name}
      </h3>

      <div style={{ 
        color: "#2563eb", 
        fontSize: "14px", 
        fontWeight: "500",
        marginTop: "auto" 
      }}>
        View Qualities →
      </div>
    </div>
  );
};

export default MaterialCard;