"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-6 py-24 text-center space-y-6">
      <h2 className="text-2xl font-bold text-text-heading-light dark:text-text-heading-dark">
        Something went wrong
      </h2>
      <p className="text-text-para-light dark:text-text-para-dark max-w-md mx-auto">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
