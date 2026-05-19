"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      href,
      target,
      rel,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "bg-brand-primary text-white hover:bg-brand-hover",
      secondary: "bg-brand-secondary text-white hover:bg-blue-700",
      outline:
        "border border-brand-primary text-brand-primary hover:bg-brand-softbg dark:hover:bg-brand-primary/10",
      ghost:
        "text-text-para-light dark:text-text-para-dark hover:bg-gray-100 dark:hover:bg-gray-800",
      white: "bg-white text-gray-900 hover:bg-gray-100",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

    const content = (
      <>
        {loading && <Spinner size="sm" className="mr-2" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          target={target}
          rel={rel}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";
