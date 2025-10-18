/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface MiscStore {
  nations: string[];
  attributes: string[];
  weaponsTypes: string[];

  isLoading: boolean;
  error: string | null;

  fetchNations: () => Promise<void>;
  fetchAttributes: () => Promise<void>;
  fetchWeaponsType: () => Promise<void>;
}

export const useMiscStore = create<MiscStore>((set, get) => ({
  nations: [],
  attributes: [],
  weaponsTypes: [],
  isLoading: false,
  error: null,

  fetchNations: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/misc/misc");
      set({ nations: response.data.nations });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAttributes: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/misc/misc");
      set({ attributes: response.data.attributes });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchWeaponsType: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/misc/misc");
      set({ weaponsTypes: response.data.weapons });
    } catch (error: any) {
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
