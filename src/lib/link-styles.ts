import { cn } from "@/lib/utils";

const linkBase =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50";

export function chamberCardLinkClass(
  variant: "primary" | "outline",
  extra?: string,
) {
  return cn(
    linkBase,
    variant === "primary"
      ? "bg-brand-primary text-white hover:bg-brand-hover"
      : "border border-brand-primary text-brand-primary hover:bg-brand-softbg dark:hover:bg-brand-primary/10",
    "px-3 py-1.5 text-xs flex-1",
    extra,
  );
}

export function heroCtaLinkClass(
  variant: "primary" | "outline",
  extra?: string,
) {
  return cn(
    linkBase,
    variant === "primary"
      ? "bg-brand-primary text-white hover:bg-brand-hover"
      : "border border-brand-primary text-brand-primary hover:bg-brand-softbg dark:hover:bg-brand-primary/10",
    "h-14 px-8 text-base",
    extra,
  );
}
