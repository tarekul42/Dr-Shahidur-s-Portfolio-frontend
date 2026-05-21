import { BilingualText } from "@/components/shared/BilingualText";
import { translate } from "@/lib/translations";

/** Server-rendered chambers hero heading (LCP-critical, no client JS). */
export function ChambersPageHeading() {
  return (
    <div className="mb-12 space-y-4 text-center flex flex-col items-center">
      <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary bg-brand-softbg dark:bg-brand-primary/10 rounded-full">
        <BilingualText
          en={translate("chambers.badge")}
          bn={translate("chambers.badge", "bn")}
        />
      </span>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
        <BilingualText
          en={translate("chambers.title")}
          bn={translate("chambers.title", "bn")}
        />
      </h1>
      <p className="text-lg text-text-para-light dark:text-text-para-dark max-w-2xl leading-relaxed">
        <BilingualText
          en={translate("chambers.subtitle")}
          bn={translate("chambers.subtitle", "bn")}
        />
      </p>
      <div className="h-1.5 bg-brand-primary rounded-full mt-6 w-20" />
    </div>
  );
}
