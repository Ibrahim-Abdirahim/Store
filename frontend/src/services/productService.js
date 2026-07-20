import api from "./api";

// Groups public product API calls in one place.
export const productService = {
  // Gets products, with optional search, category, and pagination.
  getProducts({ page = 0, size = 12, search = "", category = "" } = {}) {
    const params = { page, size };
    const endpoint = search
      ? "/products/search"
      : category
        ? "/products/category"
        : "/products";

    if (search) params.name = search;
    if (category && !search) params.category = category;

    return api.get(endpoint, { params }).then((response) => response.data);
  },

  // Gets one product by its id.
  getProduct(id) {
    return api.get(`/products/${id}`).then((response) => response.data);
  },

  // Gets distinct product categories for the filter dropdown.
  getCategories() {
    return api.get("/products/categories").then((response) => response.data);
  },
};
