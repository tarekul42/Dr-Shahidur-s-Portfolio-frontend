import Link from "next/link";
import { ChambersHero } from "@/components/chambers/ChambersHero";
import { BilingualText } from "@/components/shared/BilingualText";
import { CHAMBERS } from "@/constants/chambers";
import { heroCtaLinkClass } from "@/lib/link-styles";
import { translate } from "@/lib/translations";

export function HomeChamberOverview() {
  return (
    <section id="chambers" className="py-20 bg-bg-light-soft dark:bg-bg-dark-soft border-y border-border-light/40 dark:border-border-dark/40">
      <div className="container mx-auto px-6">
        <div className="mb-12 space-y-4 text-center flex flex-col items-center">
          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary bg-brand-softbg dark:bg-brand-primary/10 rounded-full">
            <BilingualText
              en={translate("chambers.badge")}
              bn={translate("chambers.badge", "bn")}
            />
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
            <BilingualText
              en={translate("chambers.title")}
              bn={translate("chambers.title", "bn")}
            />
          </h2>
          <p className="text-lg text-text-para-light dark:text-text-para-dark max-w-2xl leading-relaxed">
            <BilingualText
              en={translate("chambers.subtitle")}
              bn={translate("chambers.subtitle", "bn")}
            />
          </p>
          <div className="h-1.5 bg-brand-primary rounded-full mt-6 w-20" />
        </div>

        <ChambersHero chambers={CHAMBERS} />

        <div className="flex justify-center mt-12">
          <Link
            href="/chambers"
            className={heroCtaLinkClass("primary", "shadow-lg shadow-brand-primary/20")}
          >
            <BilingualText
              en="View All Chambers & Schedules"
              bn="সকল চেম্বার ও সময়সূচী দেখুন"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
