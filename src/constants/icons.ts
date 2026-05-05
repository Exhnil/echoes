import { axiosInstance } from "@/lib/axios";

const BASE_URL = axiosInstance.defaults.baseURL;

export const attributeIcons: Record<string, string> = {
  Fusion: BASE_URL + "/assets/attributes/fusion/icon",
  Glacio: BASE_URL + "/assets/attributes/glacio/icon",
  Aero: BASE_URL + "/assets/attributes/aero/icon",
  Electro: BASE_URL + "/assets/attributes/electro/icon",
  Spectro: BASE_URL + "/assets/attributes/spectro/icon",
  Havoc: BASE_URL + "/assets/attributes/havoc/icon",
};

export const weaponIcons: Record<string, string> = {
  Broadblades: BASE_URL + "/assets/ui/weapon-type/broadblade",
  Swords: BASE_URL + "/assets/ui/weapon-type/sword",
  Gauntlets: BASE_URL + "/assets/ui/weapon-type/gauntlet",
  Pistols: BASE_URL + "/assets/ui/weapon-type/pistol",
  Rectifiers: BASE_URL + "/assets/ui/weapon-type/rectifier",
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
  Characters: BASE_URL + "/assets/ui/sidebar/character",
  Weapons: BASE_URL + "/assets/ui/sidebar/weapons",
  Inventory: BASE_URL + "/assets/ui/sidebar/inventory",
  Planner: BASE_URL + "/assets/ui/sidebar/planner",
  Settings: BASE_URL + "/assets/ui/sidebar/settings",
};
