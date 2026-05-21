import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safe-persist-storage";

interface UIState {
  isMobileMenuOpen: boolean;
  cookieConsentAccepted: boolean;

  // Actions
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  acceptCookieConsent: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      cookieConsentAccepted: false,

      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      toggleMobileMenu: () =>
        set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
      acceptCookieConsent: () => set({ cookieConsentAccepted: true }),
    }),
    {
      name: "ds-ui",
      storage: safeLocalStorage,
      // Only persist cookieConsent — mobile menu resets on page load
      partialize: (state) => ({
        cookieConsentAccepted: state.cookieConsentAccepted,
      }),
    },
  ),
);
