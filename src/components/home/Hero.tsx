import Link from "next/link";
import { HeroViewerIsland } from "@/components/home/HeroViewerIsland";
import { BilingualText } from "@/components/shared/BilingualText";
import { heroCtaLinkClass } from "@/lib/link-styles";
import { translate } from "@/lib/translations";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute top-1/3 left-0 w-72 h-72 bg-brand-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none hidden lg:block"
        aria-hidden
      />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 min-h-0 lg:min-h-[92vh]">
        <div className="flex flex-col justify-center gap-8 py-16 sm:py-20 lg:py-0 lg:pr-10">
          <div className="space-y-5">
            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold tracking-widest uppercase">
              <BilingualText
                en={translate("hero.badge")}
                bn={translate("hero.badge", "bn")}
              />
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-text-heading-light dark:text-text-heading-dark leading-[1.08]">
              <BilingualText
                en={translate("hero.title1")}
                bn={translate("hero.title1", "bn")}
              />
              <br />
              <BilingualText
                en={translate("hero.title2")}
                bn={translate("hero.title2", "bn")}
              />{" "}
              <span className="text-brand-primary">
                <BilingualText
                  en={translate("hero.title3")}
                  bn={translate("hero.title3", "bn")}
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-text-para-light dark:text-text-para-dark max-w-lg leading-relaxed">
              <BilingualText
                en={translate("hero.subtitle")}
                bn={translate("hero.subtitle", "bn")}
              />
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/appointment"
              className={heroCtaLinkClass("primary", "justify-center")}
            >
              <BilingualText
                en={translate("hero.cta.primary")}
                bn={translate("hero.cta.primary", "bn")}
              />
            </Link>
            <Link
              href="/articles"
              className={heroCtaLinkClass("outline", "justify-center")}
            >
              <BilingualText
                en={translate("hero.cta.secondary")}
                bn={translate("hero.cta.secondary", "bn")}
              />
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-2 border-t border-border-light dark:border-border-dark w-fit">
            <div>
              <span className="block text-3xl font-bold text-brand-primary">
                11+
              </span>
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-50">
                <BilingualText
                  en={translate("hero.stat1")}
                  bn={translate("hero.stat1", "bn")}
                />
              </span>
            </div>
            <div
              className="w-px h-10 bg-border-light dark:bg-border-dark"
              aria-hidden
            />
            <div>
              <span className="block text-3xl font-bold text-brand-primary">
                5
              </span>
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-50">
                <BilingualText
                  en={translate("hero.stat2")}
                  bn={translate("hero.stat2", "bn")}
                />
              </span>
            </div>
          </div>
        </div>

        <HeroViewerIsland />
      </div>
    </section>
  );
}
