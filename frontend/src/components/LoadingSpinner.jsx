// Shows a loading indicator while data is being fetched from the backend.
export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="loading-block" role="status">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
