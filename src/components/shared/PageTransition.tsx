"use client";

import type React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <div className="animate-fade-in" style={{ animationDuration: "0.35s" }}>
      {children}
    </div>
  );
};
