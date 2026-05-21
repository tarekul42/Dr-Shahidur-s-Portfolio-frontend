import { BilingualText } from "@/components/shared/BilingualText";
import { translate } from "@/lib/translations";

const SPECIALTIES = [
  {
    titleKey: "specialties.ilizarov.title",
    descKey: "specialties.ilizarov.desc",
    icon: (
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    ),
  },
  {
    titleKey: "specialties.spine.title",
    descKey: "specialties.spine.desc",
    icon: <path d="M12 2v20M8 6h8M8 12h8M8 18h8" />,
  },
  {
    titleKey: "specialties.arthroplasty.title",
    descKey: "specialties.arthroplasty.desc",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </>
    ),
  },
  {
    titleKey: "specialties.arthroscopy.title",
    descKey: "specialties.arthroscopy.desc",
    icon: (
      <>
        <path d="M10 21v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8" />
        <path d="M17 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
        <path d="M2 14h20" />
      </>
    ),
  },
  {
    titleKey: "specialties.reconstructive.title",
    descKey: "specialties.reconstructive.desc",
    icon: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
  },
  {
    titleKey: "specialties.trauma.title",
    descKey: "specialties.trauma.desc",
    icon: <path d="M18 6L6 18M6 6l12 12" />,
  },
] as const;

export function SpecialtiesSection() {
  return (
    <section className="py-24 bg-white dark:bg-bg-dark">
      <div className="container mx-auto px-6">
        <div className="mb-12 space-y-4 text-center flex flex-col items-center">
          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary bg-brand-softbg dark:bg-brand-primary/10 rounded-full">
            <BilingualText
              en={translate("specialties.badge")}
              bn={translate("specialties.badge", "bn")}
            />
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
            <BilingualText
              en={translate("specialties.title")}
              bn={translate("specialties.title", "bn")}
            />
          </h2>
          <p className="text-lg text-text-para-light dark:text-text-para-dark max-w-2xl leading-relaxed">
            <BilingualText
              en={translate("specialties.subtitle")}
              bn={translate("specialties.subtitle", "bn")}
            />
          </p>
          <div className="h-1.5 bg-brand-primary rounded-full mt-6 w-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPECIALTIES.map((item) => (
            <div
              key={item.titleKey}
              className="p-8 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark"
            >
              <div className="w-14 h-14 bg-brand-softbg dark:bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {item.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark mb-4">
                <BilingualText
                  en={translate(item.titleKey)}
                  bn={translate(item.titleKey, "bn")}
                />
              </h3>
              <p className="text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">
                <BilingualText
                  en={translate(item.descKey)}
                  bn={translate(item.descKey, "bn")}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
