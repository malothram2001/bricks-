import React from "react";
export default function CategoryCard({ name, onSelect }) {
  return (
    <div onClick={() => onSelect(name)} style={{ border: "1px solid #ccc", padding: 20 }}>
      <h3>{name}</h3>
    </div>
  );
}
