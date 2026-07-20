import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import { getErrorMessage } from "../services/api";
import { cartService } from "../services/cartService";
import { productService } from "../services/productService";
import { fallbackImage, formatMoney } from "../utils/format";

// Shows full information for one product and lets normal users add it to cart.
export default function ProductDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const { data: product, error, loading } = useAsync(() => productService.getProduct(id), [id]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // Adds the selected quantity to the cart after checking the user's role.
  async function handleAddToCart() {
    setMessage("");

    if (isAdmin) {
      setMessage("Admins manage products from the admin page.");
      return;
    }

    if (!isAuthenticated) {
      setMessage("Please login before adding products to your cart.");
      return;
    }

    try {
      await cartService.addItem(Number(id), Number(quantity));
      setMessage("Product added to cart.");
    } catch (requestError) {
      setMessage(getErrorMessage(requestError, "Could not add this product to the cart."));
    }
  }

  if (loading) return <LoadingSpinner label="Loading product details" />;
  if (error) return <p className="error-text">{error}</p>;
  if (!product) return null;

  return (
    <section className="details-layout">
      <img
        className="details-image"
        src={product.imageUrl || fallbackImage(product.name)}
        alt={product.name}
        onError={(event) => {
          event.currentTarget.src = fallbackImage(product.name);
        }}
      />

      <div className="details-panel">
        <Link className="text-link" to="/">Back to products</Link>
        <p className="category-label">{product.category || "General"}</p>
        <h1>{product.name}</h1>
        <p className="details-price">{formatMoney(product.price)}</p>
        <p>{product.description || "No product description has been added yet."}</p>
        <p className="muted">{product.stockQuantity} item(s) in stock</p>

        <div className="quantity-row">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={product.stockQuantity || 1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>

        {isAdmin ? (
          <Link className="primary-button" to={`/admin?editProduct=${product.id}`}>Edit product</Link>
        ) : (
          <button
            className="primary-button"
            type="button"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
          >
            Add to cart
          </button>
        )}

        {message && <p className="notice">{message}</p>}
      </div>
    </section>
  );
}
