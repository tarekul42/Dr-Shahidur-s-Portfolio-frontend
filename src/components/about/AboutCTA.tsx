"use client";

import { CTASection } from "@/components/home/CTASection";

export function AboutCTA({ clinicHours }: { clinicHours?: string }) {
  return <CTASection clinicHours={clinicHours} />;
}
