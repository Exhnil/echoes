import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InventoryStore {
  inventoryState: Record<string, number>;
  init: boolean;

  error: string | null;

  setOwned: (id: string, value: number) => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set) => ({
      inventoryState: {},
      init: false,
      error: null,
      setOwned(id, value) {
        set((prev) => ({
          inventoryState: { ...prev.inventoryState, [id]: value },
        }));
      },
    }),
    {
      name: "inventory",
      partialize: (prev) => ({ inventoryState: prev.inventoryState }),
    },
  ),
);
