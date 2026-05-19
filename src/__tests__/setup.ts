import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// Set environment variables for testing environment
process.env.NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeT1-EsAAAAAH1OQQkxHj-IXdMVPPQYS_bVRoeR";

// Mock Next.js navigation modules globally for all tests
vi.mock("next/navigation", () => {
  const actual = vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    redirect: (url: string) => {
      throw new Error(`Redirected to: ${url}`);
    },
  };
});

// Mock next/image to render standard img tag
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    return React.createElement("img", props);
  },
}));

// Mock framer-motion layout animations to prevent timing and environment errors
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("div", props, children),
    span: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("span", props, children),
    section: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("section", props, children),
    h1: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("h1", props, children),
    h2: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("h2", props, children),
    h3: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("h3", props, children),
    p: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("p", props, children),
    a: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("a", props, children),
    button: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("button", { type: "button", ...props }, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => true,
  LayoutGroup: ({ children }: { children: React.ReactNode }) => children,
}));