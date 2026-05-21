export function HomeBelowFoldSkeleton() {
  return (
    <div aria-hidden>
      <div className="py-24 bg-white dark:bg-bg-dark">
        <div className="container mx-auto px-6 space-y-6">
          <div className="h-6 w-40 bg-border-light/50 dark:bg-border-dark/50 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-2/3 max-w-md bg-border-light/50 dark:bg-border-dark/50 rounded-lg mx-auto animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-border-light/30 dark:bg-border-dark/30 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="h-96 bg-bg-light-soft dark:bg-bg-dark-soft animate-pulse" />
    </div>
  );
}
