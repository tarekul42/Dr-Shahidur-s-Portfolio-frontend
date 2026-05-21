import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  badge?: string;
}

export const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  className,
  badge,
}: SectionHeadingProps) => {
  return (
    <div
      className={cn(
        "mb-12 space-y-4",
        centered ? "text-center flex flex-col items-center" : "text-left",
        className,
      )}
    >
      {badge && (
        <span
          className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary bg-brand-softbg dark:bg-brand-primary/10 rounded-full animate-fade-in"
          style={{ animationFillMode: "both" }}
        >
          {badge}
        </span>
      )}
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight animate-slide-up"
        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-lg text-text-para-light dark:text-text-para-dark max-w-2xl leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          {subtitle}
        </p>
      )}
      <div
        className="h-1.5 bg-brand-primary rounded-full mt-6 animate-scale-in"
        style={{
          animationDelay: "0.3s",
          animationFillMode: "both",
          width: "80px",
        }}
      />
    </div>
  );
};
