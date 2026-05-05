import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface MiscStore {
  nations: string[];
  attributes: string[];
  weaponsTypes: string[];

  isLoading: boolean;
  error: string | null;
  fetchMisc: () => Promise<void>;
}

export const useMiscStore = create<MiscStore>((set, get) => ({
  nations: [],
  attributes: [],
  weaponsTypes: [],
  isLoading: false,
  error: null,

  fetchMisc: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/misc/misc");
      set({ attributes: response.data.attributes });
      set({ weaponsTypes: response.data.weapons });
      set({ nations: response.data.nations });
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
