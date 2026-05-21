"use client";

import { ChambersContact } from "@/components/chambers/ChambersContact";
import { RecaptchaProvider } from "@/providers/RecaptchaProvider";

export default function ChambersContactBlock() {
  return (
    <RecaptchaProvider>
      <ChambersContact />
    </RecaptchaProvider>
  );
}
