// Formats product and order prices in one consistent currency style.
export function formatMoney(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Formats backend timestamps into short dates that are easier to read.
export function formatDate(value) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

// Creates a placeholder image URL when a product has no real image link.
export function fallbackImage(name = "Product") {
  return `https://placehold.co/800x600/f4f7fb/243043?text=${encodeURIComponent(name)}`;
}
