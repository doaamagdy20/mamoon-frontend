import { useCallback, useEffect, useState } from "react";

/**
 * Runs an async function and tracks { data, loading, error }.
 * Re-runs whenever `deps` changes. Call the returned `reload()`
 * to retry manually (e.g. from an ErrorState "Try again" button).
 *
 * Usage:
 *   const { data: jobs, loading, error, reload } = useApiRequest(
 *     () => jobsApi.getJobs(),
 *     []
 *   );
 */
export function useApiRequest(requestFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    requestFn()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { data, loading, error, reload: run };
}
