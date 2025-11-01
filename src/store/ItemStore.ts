import { axiosInstance } from "@/lib/axios";
import type { Domain, Item } from "@/types";
import { create } from "zustand";

interface ItemStore {
  items: Item[];
  domains: Domain[];
  isLoading: boolean;
  error: string | null;

  fetchAllMaterials: () => Promise<void>;
  fetchAllDomains: () => Promise<void>;
}

export const useItemStore = create<ItemStore>((set) => ({
  items: [],
  itemsList: [],
  domains: [],
  isLoading: false,
  error: null,

  fetchAllMaterials: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/materials/all");
      set({ items: response.data });
    } catch (error: unknown) {
      set({ error: parseError(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAllDomains: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/domains/all");
      set({ domains: response.data });
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
