import api from "./api";

// Groups admin-only API calls in one place.
export const adminService = {
  // Creates a product from the admin form.
  createProduct(product) {
    return api.post("/admin/products", product).then((response) => response.data);
  },

  // Updates an existing product by id.
  updateProduct(id, product) {
    return api.put(`/admin/products/${id}`, product).then((response) => response.data);
  },

  // Deletes a product by id.
  deleteProduct(id) {
    return api.delete(`/admin/products/${id}`);
  },

  // Gets every order in the system for admin review.
  getOrders() {
    return api.get("/admin/orders").then((response) => response.data);
  },

  // Updates the status of one order.
  updateOrderStatus(orderId, status) {
    return api.put(`/admin/orders/${orderId}/status`, null, { params: { status } }).then((response) => response.data);
  },

  // Gets all registered users.
  getUsers() {
    return api.get("/admin/users").then((response) => response.data);
  },

  // Changes a normal user into an admin.
  promoteUser(id) {
    return api.put(`/admin/users/${id}/promote`).then((response) => response.data);
  },

  // Changes an admin back to a normal user.
  demoteUser(id) {
    return api.put(`/admin/users/${id}/demote`).then((response) => response.data);
  },
};
