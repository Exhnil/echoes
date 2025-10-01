import { axiosInstance } from "@/lib/axios";

const BASE_URL = axiosInstance.defaults.baseURL;

export const attributeIcons: Record<string, string> = {
  Fusion: BASE_URL + "/attributes/fusion/icon.png",
  Glacio: BASE_URL + "/attributes/glacio/icon.png",
  Aero: BASE_URL + "/attributes/aero/icon.png",
  Electro: BASE_URL + "/attributes/electro/icon.png",
  Spectro: BASE_URL + "/attributes/spectro/icon.png",
  Havoc: BASE_URL + "/attributes/havoc/icon.png",
};

export const weaponIcons: Record<string, string> = {
  Broadblades: BASE_URL + "/weapon-type/broadblades/icon.png",
  Swords: BASE_URL + "/weapon-type/swords/icon.png",
  Gauntlets: BASE_URL + "/weapon-type/gauntlets/icon.png",
  Pistols: BASE_URL + "/weapon-type/pistols/icon.png",
  Rectifiers: BASE_URL + "/weapon-type/rectifiers/icon.png",
};

export const elementColor: Record<string, string> = {
  Fusion: "#E58B66",
  Glacio: "#5FBFF5",
  Aero: "#49F4B2",
  Electro: "#A665DD",
  Spectro: "#D9D383",
  Havoc: "#BE4B91",
};

export const menuIcons: Record<string, string> = {
  Characters: BASE_URL + "/ui/sidebar/character.png",
  Weapons: BASE_URL + "/ui/sidebar/weapons.png",
  Inventory: BASE_URL + "/ui/sidebar/inventory.png",
  Planner: BASE_URL + "/ui/sidebar/planner.png",
  Settings: BASE_URL + "/ui/sidebar/settings.png",
};
