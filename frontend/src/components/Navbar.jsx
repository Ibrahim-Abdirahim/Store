import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Shows the top navigation and changes links based on the logged-in user's role.
export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  // Clears the saved login session and sends the user back to the login page.
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link className="brand" to="/">
          Storefront
        </Link>

        <div className="nav-links">
          <NavLink to="/">Products</NavLink>
          {isAuthenticated && !isAdmin && <NavLink to="/cart">Cart</NavLink>}
          {isAuthenticated && !isAdmin && <NavLink to="/orders">Orders</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-chip">{user?.fullName}</span>
              <button className="ghost-button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="ghost-button" to="/login">Login</Link>
              <Link className="primary-button compact" to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
