import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../services/productService";
import ProductCard from "../components/ProductCard";
import React from "react";


export default function Products() {
  const { category } = useParams();
  const products = getProductsByCategory(category);

  return (
    <div>
      <h2>{category}</h2>

      {products.length === 0 && <p>No products found</p>}

      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
