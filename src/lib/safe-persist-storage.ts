import { createJSONStorage } from "zustand/middleware";

export const safeLocalStorage = createJSONStorage(() => ({
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    try {
      const value = localStorage.getItem(name);
      if (!value?.trim()) return null;
      JSON.parse(value);
      return value;
    } catch {
      localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
}));
