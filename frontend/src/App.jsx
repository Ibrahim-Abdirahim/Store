import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Defines the main routes for the React application.
export default function App() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/cart"
            element={
              <PrivateRoute role="USER">
                <CartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute role="USER">
                <OrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="ADMIN">
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route path="/products" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
