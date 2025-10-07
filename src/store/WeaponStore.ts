import { axiosInstance } from "@/lib/axios";
import type { Weapon } from "@/types";
import { create } from "zustand";

interface WeaponStore {
  weaponsList: string[];
  weapons: Weapon[];

  isLoading: boolean;
  error: string | null;

  fetchWeapons: () => Promise<void>;
}

export const useWeaponStore = create<WeaponStore>((set) => ({
  weaponsList: [],
  weapons: [],
  isLoading: false,
  error: null,

  fetchWeapons: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/weapons/all");
      console.log(response.data)
      set({ weapons: response.data });
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
}));
