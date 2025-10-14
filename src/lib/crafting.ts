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
  if (!target || !target.group || target.group === "none") return 0;

  const sameGroup = allItems.filter((i) => i.group === target.group);
  if (sameGroup.length === 0) return 0;

  const lowerRarities = sameGroup
    .filter((i) => i.rarity < target.rarity)
    .sort((a, b) => a.rarity - b.rarity);

  let totalEquivalent = 0;
  const ratio = 3;

  for (const lower of lowerRarities) {
    const state = inventory.find((i) => i.id === lower.id);
    const available = Math.max(0, (state?.owned ?? 0) - (state?.required ?? 0));
    const rarityDiff = target.rarity - lower.rarity;
    const effectiveValue = available / Math.pow(ratio, rarityDiff);
    totalEquivalent += effectiveValue;
  }

  return Math.floor(totalEquivalent);
};

export const craftItem = (
  targetId: string,
  inventory: ItemState[],
  allItems: Item[]
) => {
  const newInventory = structuredClone(inventory);
  const inventoryMap = Object.fromEntries(newInventory.map((i) => [i.id, i]));

  const targetItem = allItems.find((i) => i.id === targetId);
  if (!targetItem) return inventory;

  const targetState = inventoryMap[targetId];
  if (!targetState) return inventory;

  const itemGroup = allItems
    .filter((i) => i.group === targetItem.group)
    .sort((a, b) => a.rarity - b.rarity);

  const ratio = 3;
  const minRarity = itemGroup[0]?.rarity ?? 1;

  const success = consume(
    targetItem.rarity - 1,
    ratio,
    minRarity,
    itemGroup,
    inventoryMap
  );
  if (!success) return inventory;

  targetState.owned += 1;
  return newInventory;
};

const consume = (
  rarity: number,
  amount: number,
  minRarity: number,
  itemGroup: Item[],
  inventoryMap: Record<string, ItemState>
): boolean => {
  const sourceItem = itemGroup.find((i) => i.rarity === rarity);
  if (!sourceItem) return false;

  const sourceState = inventoryMap[sourceItem.id];
  if (!sourceState) return false;

  const available = Math.max(0, sourceState.owned - sourceState.required);

  if (available >= amount) {
    sourceState.owned -= amount;
    return true;
  }

  const needFromLower = amount - available;
  sourceState.owned -= available;

  if (rarity <= minRarity) {
    sourceState.owned += available;
    return false;
  }

  const requiredLower = needFromLower * 3;
  const ok = consume(
    rarity - 1,
    requiredLower,
    minRarity,
    itemGroup,
    inventoryMap
  );
  if (!ok) {
    sourceState.owned += available;
    return false;
  }

  return true;
};
