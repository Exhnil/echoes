import { axiosInstance } from "@/lib/axios";
import type { Item } from "@/types";
import { create } from "zustand";

interface ItemStore {
  items: Item[];
  itemsList: string[];
  isLoading: boolean;
  error: string | null;

  fetchItemsList: () => Promise<void>;
  fetchMaterial: () => Promise<void>;
  fetchAllMaterials: () => Promise<void>;
}

export const useItemStore = create<ItemStore>((set, get) => ({
  items: [],
  itemsList: [],
  isLoading: false,
  error: null,

  fetchItemsList: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/materials");
      set({ itemsList: response.data });
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
  fetchMaterial: async () => {},
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
}));

const parseError = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
};
