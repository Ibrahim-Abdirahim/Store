# Frontend Explanation

This frontend is a normal React app built with Vite. The backend already exposes REST endpoints, so the frontend mainly does four jobs: show data, collect form input, send requests with Axios, and remember the logged-in user.

## Main flow

When the app starts, `main.jsx` wraps everything with `BrowserRouter` and `AuthProvider`.

`BrowserRouter` allows routes like `/cart`, `/orders`, and `/admin` to work without refreshing the whole page.

`AuthProvider` is the global login state. It checks `localStorage` for an existing token and user, then gives the rest of the app access to:

- whether the user is logged in
- the current user details
- whether the user is an admin
- login, register, and logout functions

## API calls

All backend calls go through `src/services/api.js`.

That file creates one Axios instance with this base URL:

```js
http://localhost:8080/api
```

It also has an interceptor. Before a request is sent, the interceptor checks if a JWT token exists in `localStorage`. If it exists, it adds:

```js
Authorization: Bearer token_here
```

That is why protected endpoints like `/api/cart`, `/api/orders`, and `/api/admin` work after login.

## Routing and protection

Routes are defined in `App.jsx`.

Public routes:

- `/` for products
- `/products/:id` for product details
- `/login`
- `/register`

Protected user routes:

- `/cart`
- `/orders`

Protected admin route:

- `/admin`

`PrivateRoute.jsx` handles the protection. If a user is not logged in, it redirects them to login. If a route needs the admin role and the user is not an admin, it sends them back to the products page.

Cart and Orders are protected for normal users only. Admins can browse products, but the frontend hides shopping actions and sends admins to the Admin page for product management.

## Pages

`ProductsPage.jsx` loads products from the backend. It supports pagination, search by product name, category filtering, loading states, empty states, and add-to-cart.

`ProductDetailsPage.jsx` shows one product and lets a logged-in user choose a quantity before adding it to the cart.

`CartPage.jsx` loads the current user's cart. It lets the user update quantities, remove items, and checkout. Checkout calls `/api/orders/checkout`.

`OrdersPage.jsx` shows the user's order history and allows cancelling orders when the backend says the status can still be cancelled.

`AdminPage.jsx` uses the admin endpoints. Admins can create, edit, and delete products, update order statuses, and promote or demote users.

Admins do not use the cart in this frontend. Their main job is managing the store data, while normal users shop, checkout, and view their own orders.

## Why the structure matches the guideline

The project uses the required React pieces:

- React Router DOM v6 for routing
- Axios for backend requests
- Context API for authentication state
- React hooks like `useState` and `useEffect`
- protected routes for JWT-only pages
- role-based UI for admin links
- client-side validation in login, register, and product forms
- loading, error, and empty-state messages
- responsive CSS for mobile, tablet, and desktop

The code is split by responsibility, so it is easier to explain:

- `components` contains reusable UI
- `pages` contains full screens
- `services` contains API calls
- `context` contains global authentication state
- `hooks` contains reusable React hook logic
- `utils` contains formatting helpers
