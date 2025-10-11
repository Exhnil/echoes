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

  const sameGroup = allItems.filter((i) => i.group === target.group);
  if (sameGroup.length === 0) return 0;

  const lowerRarities = sameGroup
    .filter((i) => i.rarity < target.rarity)
    .sort((a, b) => a.rarity - b.rarity);

  let totalEquivalent = 0;
  const ratio = 3;

  for (const lower of lowerRarities) {
    const owned = inventory.find((i) => i.id === lower.id)?.owned ?? 0;
    const required = inventory.find((i) => i.id === lower.id)?.required ?? 0;
    const available = Math.max(0, owned - required);
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

  const targetItem = allItems.find((i) => i.id === targetId);
  if (!targetItem) return inventory;

  const targetState = newInventory.find((i) => i.id === targetId);
  if (!targetState) return inventory;

  const sameGroup = allItems
    .filter((i) => i.group === targetItem.group)
    .sort((a, b) => a.rarity - b.rarity);

  const ratio = 3;
  const minRarity = sameGroup[0]?.rarity ?? 1;

  const consume = (rarity: number, amount: number): boolean => {
    const sourceItem = sameGroup.find((i) => i.rarity === rarity);
    if (!sourceItem) return false;

    const sourceState = newInventory.find((i) => i.id === sourceItem.id);
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

    const requiredLower = needFromLower * ratio;
    const ok = consume(rarity - 1, requiredLower);
    if (!ok) {
      sourceState.owned += available;
      return false;
    }

    return true;
  };

  const success = consume(targetItem.rarity - 1, ratio);
  if (!success) return inventory;

  targetState.owned += 1;
  return newInventory;

  /*for (let r = targetItem.rarity - 1; r > 0; r--) {
    const lowerItem = sameGroup.find((i) => i.rarity === r);
    if (!lowerItem) continue;

    const lowerState = newInventory.find((i) => i.id === lowerItem.id);
    if (!lowerState) continue;

    const rarityDiff = targetItem.rarity - lowerItem.rarity;
    const cost = 3 ** rarityDiff;

    if (lowerState.owned >= lowerState.required + cost) {
      lowerState.owned -= cost;
      targetState.owned += 1;
      break;
    }
  }

  return newInventory;*/
};
