import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic page-level skeleton used as a pendingComponent for routes
 * and as a fallback inside Suspense boundaries.
 */
export function PageSkeleton() {
  return (
    <div className="max-w-[1760px] mx-auto px-6 lg:px-10 py-10 animate-[fade-in_0.2s_ease-out]">
      <Skeleton className="h-6 w-40 mb-8" />
      <Skeleton className="h-[42vh] w-full mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact inline loader — three brand-coloured bouncing dots. */
export function BrandDots({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="loading"
      className={"inline-flex items-center gap-1.5 " + className}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-black animate-[dot-bounce_1s_ease-in-out_infinite]" />
      <span className="h-1.5 w-1.5 rounded-full bg-brand-red animate-[dot-bounce_1s_ease-in-out_0.15s_infinite]" />
      <span className="h-1.5 w-1.5 rounded-full bg-brand-mid animate-[dot-bounce_1s_ease-in-out_0.3s_infinite]" />
    </span>
  );
}
