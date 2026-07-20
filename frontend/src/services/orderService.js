import api from "./api";

// Groups customer order API calls in one place.
export const orderService = {
  // Creates an order from the current cart.
  checkout() {
    return api.post("/orders/checkout").then((response) => response.data);
  },

  // Gets the logged-in user's order history.
  getOrders() {
    return api.get("/orders").then((response) => response.data);
  },

  // Cancels one order if it is still cancellable.
  cancelOrder(orderId) {
    return api.put(`/orders/${orderId}/cancel`).then((response) => response.data);
  },
};
