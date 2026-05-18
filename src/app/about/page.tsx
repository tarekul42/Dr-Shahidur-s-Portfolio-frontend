import type { Metadata } from "next";
import { AboutBio } from "@/components/about/AboutBio";
import { AboutCTA } from "@/components/about/AboutCTA";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutQualifications } from "@/components/about/AboutQualifications";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getAppInfo } from "@/lib/api/app-info";

export const metadata: Metadata = {
  title: "About Dr. Sahidur",
  description:
    "Learn about Dr. Sahidur Rahman Khan — his journey, qualifications, and commitment to advanced orthopedic care in Bangladesh.",
};

export default async function AboutPage() {
  const appInfo = await getAppInfo().catch(() => undefined);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 pt-32 pb-0">
        <Breadcrumbs title="About" />
      </div>

      <AboutHero
        doctorName={appInfo?.doctorName ?? "Dr. Sahidur Rahman Khan"}
        doctorTitle={appInfo?.doctorTitle ?? "Orthopedic Surgeon"}
        doctorSpecialty={appInfo?.doctorSpecialty ?? "Orthopedic Surgery"}
        doctorImageUrl={appInfo?.doctorImage?.url}
      />

      <AboutBio doctorBio={appInfo?.doctorBio} />

      <AboutQualifications />

      <AboutCTA clinicHours={appInfo?.clinicHours} />
    </div>
  );
}
