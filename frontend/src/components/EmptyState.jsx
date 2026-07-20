// Shows a friendly message when a page has no data to display.
export default function EmptyState({ title, message, action }) {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </section>
  );
}
