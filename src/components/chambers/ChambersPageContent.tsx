"use client";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CHAMBERS } from "@/constants/chambers";
import { useTranslation } from "@/hooks/useTranslation";
import { ChamberDetailList } from "./ChamberDetailList";
import { ChambersContact } from "./ChambersContact";
import { ChambersHero } from "./ChambersHero";

export function ChambersPageContent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Breadcrumbs Banner */}
      <div className="container mx-auto px-6 pt-32 pb-0">
        <Breadcrumbs title={t("breadcrumbs.chambers")} />
      </div>

      {/* Hero & Selection */}
      <div className="container mx-auto px-6 pt-8 pb-16">
        <SectionHeading
          badge={t("chambers.badge")}
          title={t("chambers.title")}
          subtitle={t("chambers.subtitle")}
          centered
        />
        <ChambersHero chambers={CHAMBERS} />
      </div>

      {/* Detail Cards List */}
      <div className="bg-bg-light-soft dark:bg-bg-dark-soft border-y border-border-light/40 dark:border-border-dark/40 py-20">
        <div className="container mx-auto px-6">
          <ChamberDetailList chambers={CHAMBERS} />
        </div>
      </div>

      {/* Inquiry and emergency numbers */}
      <div className="container mx-auto px-6 py-20">
        <ChambersContact />
      </div>
    </div>
  );
}
