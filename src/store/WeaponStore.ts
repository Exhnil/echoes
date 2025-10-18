import { axiosInstance } from "@/lib/axios";
import type { Weapon } from "@/types";
import { create } from "zustand";

interface WeaponStore {
  weapons: Weapon[];

  isLoading: boolean;
  error: string | null;

  fetchWeapons: () => Promise<void>;
}

export const useWeaponStore = create<WeaponStore>((set, get) => ({
  weapons: [],
  isLoading: false,
  error: null,

  fetchWeapons: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/weapons/all");
      set({ weapons: response.data });
    } catch (error: unknown) {
      set({ error: parseError(error) });
    } finally {
      set({ isLoading: false });
    }
  },
}));

const parseError = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
};
