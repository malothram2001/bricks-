export default function ProductCard({ product }) {
  return (
    <div>
      <strong>{product.name}</strong> - ₹{product.price}
    </div>
  );
}
