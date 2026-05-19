import { translations } from "@/lib/translations";
import { useLanguageStore } from "@/store/use-language-store";

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();

  function t(key: string, vars?: Record<string, string | number>): string {
    const entry = translations[key as keyof typeof translations];
    if (!entry) return key; // fallback: show the key itself
    let result = entry[language] ?? entry.en ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        result = result.replace(`{${k}}`, String(v));
      }
    }
    return result;
  }

  return { t, language, setLanguage, toggleLanguage };
}
