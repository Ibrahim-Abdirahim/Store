import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import useAsync from "../hooks/useAsync";
import { orderService } from "../services/orderService";
import { formatDate, formatMoney } from "../utils/format";

// Shows the logged-in user's order history.
export default function OrdersPage() {
  const { data: orders, setData: setOrders, error, loading } = useAsync(orderService.getOrders, []);

  // Cancels an order when the backend still allows cancellation.
  async function cancelOrder(orderId) {
    const updated = await orderService.cancelOrder(orderId);
    setOrders((orders || []).map((order) => (order.orderId === orderId ? updated : order)));
  }

  if (loading) return <LoadingSpinner label="Loading orders" />;

  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Order history</p>
          <h1>Your orders</h1>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {!orders || orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Orders will appear here after checkout." />
      ) : (
        <section className="order-list">
          {orders.map((order) => (
            <article className="order-card" key={order.orderId}>
              <div className="order-header">
                <div>
                  <h2>Order #{order.orderId}</h2>
                  <p className="muted">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`status-pill status-${order.status?.toLowerCase()}`}>{order.status}</span>
              </div>

              <div className="order-items">
                {order.items?.map((item) => (
                  <div className="summary-line" key={`${order.orderId}-${item.productId}`}>
                    <span>{item.productName} x {item.quantity}</span>
                    <strong>{formatMoney(item.subtotal)}</strong>
                  </div>
                ))}
              </div>

              <div className="summary-line total-line">
                <span>Total</span>
                <strong>{formatMoney(order.totalAmount)}</strong>
              </div>

              {["PENDING", "CONFIRMED"].includes(order.status) && (
                <button className="ghost-button danger" type="button" onClick={() => cancelOrder(order.orderId)}>
                  Cancel order
                </button>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
