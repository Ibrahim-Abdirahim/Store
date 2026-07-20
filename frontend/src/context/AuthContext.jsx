import { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

// localStorage keeps the user logged in after a page refresh.
function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

// Provides login state and auth actions to the whole application.
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(readStoredUser);

  // The backend returns the token and user details together after login/register.
  function saveSession(authResponse) {
    const currentUser = {
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
    };

    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("user", JSON.stringify(currentUser));
    setToken(authResponse.token);
    setUser(currentUser);
  }

  // Sends login details to the backend and saves the returned session.
  async function login(credentials) {
    const response = await authService.login(credentials);
    saveSession(response);
    return response;
  }

  // Creates a new account and saves the returned session.
  async function register(details) {
    const response = await authService.register(details);
    saveSession(response);
    return response;
  }

  // Removes the saved session from the browser.
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      // The role comes from the backend AuthResponse, so the navbar/routes can check it.
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Small helper so components can read auth data without importing the context directly.
export function useAuth() {
  return useContext(AuthContext);
}
