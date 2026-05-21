export function HomeSectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={`py-24 ${className ?? ""}`} aria-hidden>
      <div className="container mx-auto px-6">
        <div className="h-8 w-48 bg-border-light/60 dark:bg-border-dark/60 rounded-full mb-6 animate-pulse" />
        <div className="h-12 w-2/3 max-w-lg bg-border-light/60 dark:bg-border-dark/60 rounded-lg mb-4 animate-pulse" />
        <div className="h-4 w-full max-w-xl bg-border-light/40 dark:bg-border-dark/40 rounded animate-pulse" />
      </div>
    </div>
  );
}
