import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { CenteredSpinner } from "./components/alps/CenteredSpinner";

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


