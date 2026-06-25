import { useRouterState } from "@tanstack/react-router";

/**
 * Global route transition indicator.
 * Shows a thin red top bar + three bouncing dots (black / red / grey)
 * while the router is navigating, loading, or transitioning.
 */
export function RouteLoader() {
  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center"
    >
      <div className="h-[2px] w-full overflow-hidden bg-transparent">
        <div className="h-full w-1/3 bg-primary animate-[route-bar_1.1s_ease-in-out_infinite]" />
      </div>
      <div className="mt-3 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 backdrop-blur-sm shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-black animate-[dot-bounce_1s_ease-in-out_infinite]" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-red animate-[dot-bounce_1s_ease-in-out_0.15s_infinite]" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-mid animate-[dot-bounce_1s_ease-in-out_0.3s_infinite]" />
      </div>
    </div>
  );
}
