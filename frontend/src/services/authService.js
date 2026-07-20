import api from "./api";

// Groups authentication API calls in one place.
export const authService = {
  // Sends login credentials to the backend.
  login(credentials) {
    return api.post("/auth/login", credentials).then((response) => response.data);
  },

  // Sends new account details to the backend.
  register(details) {
    return api.post("/auth/register", details).then((response) => response.data);
  },
};
