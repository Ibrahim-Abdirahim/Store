# Ecommerce Frontend

This is the React frontend for the Spring Boot ecommerce backend.

## What it includes

- React Router pages for products, product details, cart, orders, login, register, and admin.
- Axios API services with a JWT interceptor.
- AuthContext for the logged-in user and role checks.
- PrivateRoute for protected user/admin pages.
- Client-side form validation and user-friendly API error messages.
- Responsive CSS for desktop, tablet, and mobile screens.

## How to run

1. Start the Spring Boot backend on `http://localhost:8080`.
2. In this `frontend` folder, install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm run dev
```

4. Open the Vite URL, usually `http://localhost:5173`.

If the backend URL changes, copy `.env.example` to `.env` and update `VITE_API_BASE_URL`.

## Main idea

The frontend is split into simple parts:

- `services/api.js` creates the shared Axios instance and attaches the JWT token.
- `context/AuthContext.jsx` stores the token and current user in one place.
- `components/PrivateRoute.jsx` blocks pages that need login or admin access.
- `pages/` contains one screen per route.
