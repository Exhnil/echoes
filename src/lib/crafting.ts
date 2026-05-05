import type { Item } from "@/types";

export const findNextRarityItem = (item: Item, allItems: Item[]) => {
  if (!item.group || item.group === "none") return undefined;
  return allItems.find(
    (i) => i.group === item.group && i.rarity === item.rarity + 1,
  );
};

export const getCraftable = (
  id: string,
  inventory: Record<string, number>,
  allItems: Item[],
): number => {
  const target = allItems.find((i) => i.id === id);
  if (!target || !target.group || target.group === "none") return 0;

  const group = allItems.filter((i) => i.group === target.group);
  if (group.length === 0) return 0;

  const lowerRarities = group.filter((i) => i.rarity < target.rarity);
  const ratio = 3;
  let totalTargetItemValue = 0;

  for (const lower of lowerRarities) {
    const owned = inventory[lower.id] ?? 0;

    const rarityDiff = target.rarity - lower.rarity;

    totalTargetItemValue += owned / Math.pow(ratio, rarityDiff);
  }

  return Math.floor(totalTargetItemValue);
};
