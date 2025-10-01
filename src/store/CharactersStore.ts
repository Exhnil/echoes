import { axiosInstance } from "@/lib/axios";
import type { Character } from "@/types";
import { create } from "zustand";

interface CharacterStore {
  charactersList: string[];
  characters: Character[];

  isLoading: boolean;
  error: string | null;

  fetchCharactersList: () => Promise<void>;
  fetchCharacters: () => Promise<void>;
}

export const useCharactersStore = create<CharacterStore>((set) => ({
  charactersList: [],
  characters: [],
  isLoading: false,
  error: null,

  fetchCharactersList: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/characters");
      set({ charactersList: response.data });
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

  fetchCharacters: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/characters/all");
      set({ characters: response.data });
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
