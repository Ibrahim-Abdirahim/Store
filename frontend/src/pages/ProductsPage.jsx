import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import { cartService } from "../services/cartService";
import { productService } from "../services/productService";

// Shows the public product catalog with search, category filtering, and pagination.
export default function ProductsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Categories are used for the dropdown filter above the product grid.
  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let mounted = true;

    // Reload products when the page number, search text, or category changes.
    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const result = await productService.getProducts({ page, search, category });
        if (!mounted) return;
        setProducts(result.content || []);
        setTotalPages(result.totalPages || 1);
      } catch (requestError) {
        if (mounted) setError(getErrorMessage(requestError, "Products could not be loaded."));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      // Prevents setting state if the user leaves the page before the request finishes.
      mounted = false;
    };
  }, [page, search, category]);

  // Adds a product to the current user's cart.
  async function handleAddToCart(productId) {
    setNotice("");

    if (isAdmin) {
      setNotice("Admins manage products from the admin page.");
      return;
    }

    if (!isAuthenticated) {
      setNotice("Please login before adding products to your cart.");
      return;
    }

    // The cart endpoint is protected, so api.js will attach the JWT automatically.
    try {
      await cartService.addItem(productId, 1);
      setNotice("Product added to cart.");
    } catch (requestError) {
      setNotice(getErrorMessage(requestError, "Could not add this product to the cart."));
    }
  }

  // Keeps the search form from refreshing the page and restarts from page one.
  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(0);
  }

  return (
    <div className="stack">
      <section className="hero">
        <div>
          <p className="eyebrow">Online shop</p>
          <h1>Browse products and order from one simple store.</h1>
          <p>
            A React frontend connected to the Spring Boot REST API with product browsing,
            authentication, cart management, checkout, and order history.
          </p>
        </div>
        <Link className="primary-button" to={isAdmin ? "/admin" : isAuthenticated ? "/cart" : "/login"}>
          {isAdmin ? "Go to admin panel" : isAuthenticated ? "View cart" : "Login to shop"}
        </Link>
      </section>

      <section className="toolbar">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products by name"
            aria-label="Search products by name"
          />
          <button className="primary-button compact" type="submit">Search</button>
        </form>

        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setSearch("");
            setPage(0);
          }}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </section>

      {notice && <p className="notice">{notice}</p>}
      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <LoadingSpinner label="Loading products" />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Try another search term or category."
        />
      ) : (
        <section className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isAdmin={isAdmin}
            />
          ))}
        </section>
      )}

      <div className="pagination">
        <button type="button" onClick={() => setPage((value) => Math.max(value - 1, 0))} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button type="button" onClick={() => setPage((value) => value + 1)} disabled={page + 1 >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
