import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    login();
    navigate("/dashboard");
  };

  const styles = {
    // This wrapper acts as the main background
    wrapper: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      margin: 0,
      padding: 0,
      overflow: "hidden",
      backgroundColor: "#d1dbe4", // Matches the soft blue of the image
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
    },
    // LEFT SIDE: We push the background image to the left
    leftSection: {
      flex: "1.2", 
      backgroundImage: "url('/dashboard.png')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left center", // Pins the house to the left
      height: "100%",
      width: "100%"
    },
    // RIGHT SIDE: This section will have a solid background to hide the "fake" box
    rightSection: {
      flex: "0.8",
      backgroundColor: "#d1dbe4", // Solid color to hide the extra image bits
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingRight: "5%",
    },
    card: {
      background: "white", 
      padding: "50px 40px",
      borderRadius: "24px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
      textAlign: "center",
      zIndex: 10, // Ensures it sits above everything
    },
    title: {
      fontSize: "28px",
      color: "#1e293b",
      marginBottom: "8px",
      fontWeight: "bold",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "14px",
      marginBottom: "35px",
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s ease",
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* This part shows the house and materials on the left */}
      <div style={styles.leftSection}></div>

      {/* This part hides the grayed-out placeholder and shows your real login */}
      <div style={styles.rightSection}>
        <div style={styles.card}>
          <h2 style={styles.title}>Construction Portal</h2>
          <p style={styles.subtitle}>Manage materials and inventory</p>
          
          <form onSubmit={handleLogin}>
            <button 
              type="submit"
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
            >
              Log In
            </button>
          </form>

          <p style={{ marginTop: "25px", fontSize: "14px", color: "#64748b" }}>
            Don't have an account? <span style={{color: "#2563eb", cursor: "pointer", fontWeight: "bold"}}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}