import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BilingualTextProps {
  en: ReactNode;
  bn: ReactNode;
  as?: ElementType;
  className?: string;
}

/** Renders EN/BN copy in HTML; visibility toggled via html[data-lang] (no client JS). */
export function BilingualText({
  en,
  bn,
  as: Tag = "span",
  className,
}: BilingualTextProps) {
  return (
    <Tag className={className}>
      <span className="lang-en">{en}</span>
      <span className="lang-bn">{bn}</span>
    </Tag>
  );
}
