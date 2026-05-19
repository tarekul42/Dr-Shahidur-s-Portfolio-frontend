import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

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
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock framer-motion layout animations to prevent timing and environment errors
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) =>
      <div {...props}>{children}</div>,
    span: ({ children, ...props }: Record<string, unknown>) =>
      <span {...props}>{children}</span>,
    section: ({ children, ...props }: Record<string, unknown>) =>
      <section {...props}>{children}</section>,
    h1: ({ children, ...props }: Record<string, unknown>) =>
      <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: Record<string, unknown>) =>
      <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: Record<string, unknown>) =>
      <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: Record<string, unknown>) =>
      <p {...props}>{children}</p>,
    a: ({ children, ...props }: Record<string, unknown>) =>
      <a {...props}>{children}</a>,
    button: ({ children, ...props }: Record<string, unknown>) =>
      <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({
    start: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => true,
  LayoutGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));