import { Link } from "react-router-dom";

// Simple fallback page for unknown routes.
export default function NotFoundPage() {
  return (
    <section className="empty-state">
      <h1>Page not found</h1>
      <p>The page you opened does not exist.</p>
      <Link className="primary-button" to="/">Back to products</Link>
    </section>
  );
}
