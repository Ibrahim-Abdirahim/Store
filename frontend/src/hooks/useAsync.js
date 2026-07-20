import { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";

// Reusable hook for pages that need to load backend data.
export default function useAsync(callback, dependencies = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Runs the API function and stores loading, error, and data states.
    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await callback();
        if (mounted) setData(result);
      } catch (requestError) {
        if (mounted) setError(getErrorMessage(requestError));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, setData, error, setError, loading, setLoading };
}
