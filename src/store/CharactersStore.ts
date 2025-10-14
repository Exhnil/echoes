import { axiosInstance } from "@/lib/axios";
import type { Character } from "@/types";
import { create } from "zustand";

interface CharacterStore {
  characters: Character[];

  isLoading: boolean;
  error: string | null;

  fetchCharacters: () => Promise<void>;
}

export const useCharactersStore = create<CharacterStore>((set) => ({
  characters: [],
  isLoading: false,
  error: null,

  fetchCharacters: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/characters/all");
      set({ characters: response.data });
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
