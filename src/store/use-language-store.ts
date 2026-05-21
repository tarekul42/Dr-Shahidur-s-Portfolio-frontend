import { create } from "zustand";
import type { Language } from "@/lib/translations";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  setLanguage: (language) => {
    set({ language });
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
      document.documentElement.dataset.lang = language;
    }
  },
  toggleLanguage: () =>
    set((state) => {
      const next = state.language === "en" ? "bn" : "en";
      if (typeof window !== "undefined") {
        localStorage.setItem("language", next);
        document.documentElement.dataset.lang = next;
      }
      return { language: next };
    }),
}));
