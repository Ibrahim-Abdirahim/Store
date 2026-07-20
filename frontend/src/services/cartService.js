import api from "./api";

// Groups cart API calls in one place.
export const cartService = {
  // Gets the current logged-in user's cart.
  getCart() {
    return api.get("/cart").then((response) => response.data);
  },

  // Adds a product and quantity to the cart.
  addItem(productId, quantity = 1) {
    return api.post("/cart/items", { productId, quantity }).then((response) => response.data);
  },

  // Changes the quantity of one cart item.
  updateItem(cartItemId, quantity) {
    return api.put(`/cart/items/${cartItemId}`, { quantity }).then((response) => response.data);
  },

  // Removes one item from the cart.
  removeItem(cartItemId) {
    return api.delete(`/cart/items/${cartItemId}`).then((response) => response.data);
  },

  // Removes all items from the cart.
  clearCart() {
    return api.delete("/cart");
  },
};
