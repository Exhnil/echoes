import type { Item, ItemState } from "@/types";

export const findNextRarityItem = (item: Item, allItems: Item[]) => {
  if (!item.group || item.group === "none") return undefined;
  return allItems.find(
    (i) => i.group === item.group && i.rarity === item.rarity + 1
  );
};

export const getCraftableAmount = (
  targetId: string,
  inventory: ItemState[],
  allItems: Item[]
) => {
  const target = allItems.find((i) => i.id === targetId);
  if (!target) return 0;

  const source = allItems.find(
    (i) => i.group === target.group && i.rarity === target.rarity - 1
  );
  if (!source) return 0;

  const ownedSource = inventory.find((i) => i.id === source.id)?.owned ?? 0;
  return Math.floor(ownedSource / 3);
};

export const craftItem = (
  targetId: string,
  inventory: ItemState[],
  allItems: Item[]
) => {
  const target = allItems.find((i) => i.id === targetId);
  if (!target) return inventory;

  const source = allItems.find(
    (i) => i.group === target.group && i.rarity === target.rarity - 1
  );

  if (!source) return inventory;

  const newInventory = structuredClone(inventory);
  const sourceState = newInventory.find((i) => i.id === source.id);
  const targetState = newInventory.find((i) => i.id === target.id);

  if (!sourceState || sourceState.owned < 3) return inventory;

  sourceState.owned -= 3;
  if (targetState) targetState.owned += 1;
  else
    newInventory.push({
      id: target.id,
      name: target.name,
      owned: 1,
      required: 0,
    });

  return newInventory;
};
