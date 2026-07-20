import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getErrorMessage } from "../services/api";
import { adminService } from "../services/adminService";
import { productService } from "../services/productService";
import { formatDate, formatMoney } from "../utils/format";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  imageUrl: "",
  category: "",
};

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
// Default category choices for the admin product form.
const defaultCategories = ["Electronics", "Bags", "Home & Kitchen", "Stationery", "Clothing", "Accessories"];

// Admin dashboard for managing products, orders, and users.
export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Combines default categories with categories already used by saved products.
  const categoryOptions = Array.from(
    new Set([...defaultCategories, ...products.map((product) => product.category).filter(Boolean)])
  );

  useEffect(() => {
    loadAdminData();
  }, []);

  // If the admin clicked Edit from a product card, load that product into the form.
  useEffect(() => {
    const productId = Number(searchParams.get("editProduct"));

    if (!productId || products.length === 0) return;

    const productToEdit = products.find((product) => product.id === productId);

    if (productToEdit) {
      editProduct(productToEdit);
      setSearchParams({});
    }
  }, [products, searchParams, setSearchParams]);

  // Loads all data needed by the admin dashboard.
  async function loadAdminData() {
    setLoading(true);
    setError("");

    try {
      const [productPage, orderList, userList] = await Promise.all([
        productService.getProducts({ size: 50 }),
        adminService.getOrders(),
        adminService.getUsers(),
      ]);

      setProducts(productPage.content || []);
      setOrders(orderList || []);
      setUsers(userList || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Admin data could not be loaded."));
    } finally {
      setLoading(false);
    }
  }

  // Updates the product form as the admin types.
  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // Fills the form with an existing product so it can be edited.
  function editProduct(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stockQuantity: product.stockQuantity || "",
      imageUrl: product.imageUrl || "",
      category: product.category || "",
    });
    setActiveTab("products");
  }

  // Creates a new product or updates the selected existing product.
  async function saveProduct(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim() || Number(form.price) <= 0 || Number(form.stockQuantity) < 0) {
      setError("Name, price, and stock quantity are required.");
      return;
    }

    const productPayload = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    };

    try {
      if (editingId) {
        await adminService.updateProduct(editingId, productPayload);
        setMessage("Product updated.");
      } else {
        await adminService.createProduct(productPayload);
        setMessage("Product created.");
      }

      setForm(emptyProduct);
      setEditingId(null);
      loadAdminData();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Product could not be saved."));
    }
  }

  // Deletes a product from the store.
  async function deleteProduct(id) {
    setError("");

    try {
      await adminService.deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      setMessage("Product deleted.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Product could not be deleted."));
    }
  }

  // Changes an order status, for example from PENDING to SHIPPED.
  async function updateStatus(orderId, status) {
    setError("");

    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders(orders.map((order) => (order.orderId === orderId ? updated : order)));
      setMessage("Order status updated.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Order status could not be updated."));
    }
  }

  // Promotes a user to admin or demotes an admin back to user.
  async function changeRole(user) {
    setError("");

    try {
      if (user.role === "ADMIN") {
        await adminService.demoteUser(user.id);
      } else {
        await adminService.promoteUser(user.id);
      }
      setMessage("User role updated.");
      loadAdminData();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "User role could not be updated."));
    }
  }

  if (loading) return <LoadingSpinner label="Loading admin panel" />;

  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Store management</h1>
        </div>
      </div>

      <div className="tabs">
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")} type="button">Products</button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")} type="button">Orders</button>
        <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")} type="button">Users</button>
      </div>

      {message && <p className="notice">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      {activeTab === "products" && (
        <section className="admin-grid">
          <form className="panel form-stack" onSubmit={saveProduct}>
            <h2>{editingId ? "Edit product" : "Add product"}</h2>
            <label>Name<input name="name" value={form.name} onChange={updateForm} /></label>
            <label>Description<textarea name="description" value={form.description} onChange={updateForm} /></label>
            <label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={updateForm} /></label>
            <label>Stock quantity<input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={updateForm} /></label>
            <label>Image URL<input name="imageUrl" value={form.imageUrl} onChange={updateForm} /></label>
            <label>
              Category
              <select name="category" value={form.category} onChange={updateForm}>
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <button className="primary-button" type="submit">{editingId ? "Save changes" : "Create product"}</button>
            {editingId && <button className="ghost-button" type="button" onClick={() => { setEditingId(null); setForm(emptyProduct); }}>Cancel edit</button>}
          </form>

          <div className="panel table-wrap">
            <h2>Products</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category || "General"}</td>
                    <td>{formatMoney(product.price)}</td>
                    <td>{product.stockQuantity}</td>
                    <td className="table-actions">
                      <button className="ghost-button" type="button" onClick={() => editProduct(product)}>Edit</button>
                      <button className="ghost-button danger" type="button" onClick={() => deleteProduct(product.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "orders" && (
        <section className="panel table-wrap">
          <h2>Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatMoney(order.totalAmount)}</td>
                  <td>
                    <select value={order.status} onChange={(event) => updateStatus(order.orderId, event.target.value)}>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === "users" && (
        <section className="panel table-wrap">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <button className="ghost-button" type="button" onClick={() => changeRole(user)}>
                      {user.role === "ADMIN" ? "Demote" : "Promote"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
