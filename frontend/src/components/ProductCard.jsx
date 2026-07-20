import { Link } from "react-router-dom";
import { fallbackImage, formatMoney } from "../utils/format";

// Displays one product in the catalog grid.
export default function ProductCard({ product, onAddToCart, isAdmin }) {
  const isSoldOut = product.stockQuantity === 0;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-link">
        <img
          src={product.imageUrl || fallbackImage(product.name)}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = fallbackImage(product.name);
          }}
        />
      </Link>

      <div className="product-card-body">
        <p className="category-label">{product.category || "General"}</p>
        <h3>{product.name}</h3>
        <p className="muted line-clamp">{product.description || "No description added yet."}</p>

        <div className="card-footer">
          <strong>{formatMoney(product.price)}</strong>
          {isAdmin ? (
            <Link className="primary-button compact" to={`/admin?editProduct=${product.id}`}>
              Edit
            </Link>
          ) : (
            <button
              type="button"
              className="primary-button compact"
              onClick={() => onAddToCart(product.id)}
              disabled={isSoldOut}
            >
              {isSoldOut ? "Sold out" : "Add"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
