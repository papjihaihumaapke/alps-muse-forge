import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { CenteredSpinner } from "./components/alps/CenteredSpinner";

// After a redeploy, a tab opened earlier still asks for the old page files,
// which no longer exist. Reload once to pick up the new build instead of crashing.
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    const key = "alps-chunk-reload";
    try {
      const last = Number(sessionStorage.getItem(key) ?? 0);
      if (Date.now() - last < 10_000) return; // already tried; let the error show
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      /* storage blocked — still reload */
    }
    event.preventDefault();
    window.location.reload();
  });
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: CenteredSpinner,
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
  });

  return router;
};


