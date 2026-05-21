import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safe-persist-storage";
import type { SearchType } from "@/types/search";

interface RecentSearch {
  query: string;
  type: SearchType | "all";
  timestamp: number;
}

interface SearchState {
  recentSearches: RecentSearch[];
  activeType: SearchType | "all";

  // Actions
  addRecentSearch: (query: string, type: SearchType | "all") => void;
  setActiveType: (type: SearchType | "all") => void;
  clearRecentSearches: () => void;
}

const MAX_RECENT = 8;

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      activeType: "all",

      addRecentSearch: (query, type) =>
        set((state) => {
          // Don't store empty or too-short queries
          const trimmed = query.trim();
          if (trimmed.length < 2) return state;

          // Deduplicate: if same query+type exists, move to top
          const filtered = state.recentSearches.filter(
            (s) => !(s.query === trimmed && s.type === type),
          );

          return {
            recentSearches: [
              { query: trimmed, type, timestamp: Date.now() },
              ...filtered,
            ].slice(0, MAX_RECENT),
          };
        }),

      setActiveType: (type) => set({ activeType: type }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "ds-search",
      storage: safeLocalStorage,
      // Only persist recentSearches and activeType
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        activeType: state.activeType,
      }),
    },
  ),
);
