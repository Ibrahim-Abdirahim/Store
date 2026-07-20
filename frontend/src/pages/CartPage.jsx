import { useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import useAsync from "../hooks/useAsync";
import { getErrorMessage } from "../services/api";
import { cartService } from "../services/cartService";
import { orderService } from "../services/orderService";
import { fallbackImage, formatMoney } from "../utils/format";

// Shows the current user's cart and checkout summary.
export default function CartPage() {
  const { data: cart, setData: setCart, error, setError, loading, setLoading } = useAsync(cartService.getCart, []);
  const [message, setMessage] = useState("");

  // Updating an item returns the full cart again, so the page can refresh totals immediately.
  async function updateQuantity(item, quantity) {
    if (quantity < 1) return;

    try {
      const updated = await cartService.updateItem(item.cartItemId, quantity);
      setCart(updated);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not update the cart."));
    }
  }

  // Removes one item from the cart.
  async function removeItem(cartItemId) {
    try {
      const updated = await cartService.removeItem(cartItemId);
      setCart(updated);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not remove this item."));
    }
  }

  // Places an order using all items currently in the cart.
  async function checkout() {
    setLoading(true);
    setMessage("");

    try {
      // Checkout creates an order from the current cart on the backend.
      await orderService.checkout();
      setCart({ cartId: cart?.cartId, items: [], totalPrice: 0 });
      setMessage("Order placed successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Checkout failed."));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading cart" />;

  const items = cart?.items || [];

  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h1>Your cart</h1>
        </div>
        <Link className="ghost-button" to="/">Continue shopping</Link>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="notice">{message}</p>}

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Add a few products before checking out."
          action={<Link className="primary-button" to="/">Browse products</Link>}
        />
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.cartItemId}>
                <img src={item.imageUrl || fallbackImage(item.productName)} alt={item.productName} />
                <div>
                  <h3>{item.productName}</h3>
                  <p className="muted">{formatMoney(item.price)} each</p>
                  <div className="quantity-row">
                    <label htmlFor={`quantity-${item.cartItemId}`}>Qty</label>
                    <input
                      id={`quantity-${item.cartItemId}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item, Number(event.target.value))}
                    />
                  </div>
                </div>
                <strong>{formatMoney(item.subtotal)}</strong>
                <button className="ghost-button danger" type="button" onClick={() => removeItem(item.cartItemId)}>
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="summary-panel">
            <h2>Summary</h2>
            <div className="summary-line">
              <span>Total</span>
              <strong>{formatMoney(cart.totalPrice)}</strong>
            </div>
            <button className="primary-button" type="button" onClick={checkout}>
              Checkout
            </button>
          </aside>
        </section>
      )}
    </div>
  );
}
