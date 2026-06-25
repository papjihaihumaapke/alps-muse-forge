/**
 * Full-screen centered spinner shown while route data is loading.
 * Uses brand red (#ee2d4d) with a clean circular ring animation.
 */
export function CenteredSpinner() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-brand-light" />
          <div className="absolute inset-0 rounded-full border-[3px] border-t-brand-red border-r-transparent border-b-transparent border-l-transparent animate-[spin_0.8s_linear_infinite]" />
        </div>
        <span className="text-sm tracking-wide text-brand-mid lowercase">loading</span>
      </div>
    </div>
  );
}
