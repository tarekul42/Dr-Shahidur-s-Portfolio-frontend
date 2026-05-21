import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ChambersHero } from "@/components/chambers/ChambersHero";
import { ChambersPageHeading } from "@/components/chambers/ChambersPageHeading";
import { StaticBreadcrumbs } from "@/components/shared/StaticBreadcrumbs";
import { CHAMBERS } from "@/constants/chambers";
import { translate } from "@/lib/translations";

const ChamberDetailList = dynamic(
  () =>
    import("@/components/chambers/ChamberDetailList").then(
      (mod) => mod.ChamberDetailList,
    ),
  {
    loading: () => (
      <div
        className="min-h-[480px] rounded-2xl border border-border-light/40 dark:border-border-dark/40 bg-card-light/50 dark:bg-card-dark/50 animate-pulse"
        aria-hidden
      />
    ),
  },
);

const ChambersContactBlock = dynamic(
  () => import("@/components/chambers/ChambersContactBlock"),
);

export const metadata: Metadata = {
  title: "Chambers & Schedule | Dr. Sahidur Rahman Khan",
  description:
    "Consult with Dr. Md. Sahidur Rahman Khan, Orthopedic & Trauma Surgeon, at any of his 4 chambers in Dhaka and Manikganj. View schedules, assistant details, and book your appointment.",
};

export default function ChambersPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <div className="container mx-auto px-6 pt-24 pb-0">
        <StaticBreadcrumbs
          titleEn={translate("breadcrumbs.chambers")}
          titleBn={translate("breadcrumbs.chambers", "bn")}
        />
      </div>

      <div className="container mx-auto px-6 pt-6 pb-16">
        <ChambersPageHeading />
        <ChambersHero chambers={CHAMBERS} />
      </div>

      <div className="bg-bg-light-soft dark:bg-bg-dark-soft border-y border-border-light/40 dark:border-border-dark/40 py-20">
        <div className="container mx-auto px-6">
          <ChamberDetailList chambers={CHAMBERS} />
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <ChambersContactBlock />
      </div>
    </div>
  );
}
