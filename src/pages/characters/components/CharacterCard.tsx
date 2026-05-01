import { attributeIcons } from "@/constants/icons";
import { axiosInstance } from "@/lib/axios";
import type { Character } from "@/types";
import { AlertCircle } from "lucide-react";
import { useCallback } from "react";

interface CharacterCardProps {
  character: Character;
  setSelectedCharacter: (character: Character) => void;
}

const rarityColors: Record<number, string> = {
  4: "bg-violet-600",
  5: "bg-equator-700",
};

const getRarityColor = (rarity: number) => {
  return rarityColors[rarity] ?? "from-transparent";
};

//Changer la couleur pour de bas vers haut, en vers tranparent ou zinc
const CharacterCard = ({
  character,
  setSelectedCharacter,
}: CharacterCardProps) => {
  const hasObjective = () => {
    /*const saved = localStorage.getItem("characterState");
    const parsed: Record<string, CharacterState> = saved
      ? JSON.parse(saved)
      : {};

    const characterState = parsed[character.id];
    if (!characterState) return false;

    const level = characterState.level;
    if (
      level.currentAscensionLevel !== level.targetAscensionLevel ||
      level.currentLevel !== level.targetLevel
    ) {
      return true;
    }

    for (const skillId in characterState.skills) {
      const skill = characterState.skills[skillId];
      if (skill.currentSkillLevel !== skill.targetSkillLevel) return true;
    }

    if (characterState.bonusStats.some((b) => b.state === "planned"))
      return true;

    if (characterState.inherentSkills.some((s) => s.state === "planned"))
      return true;*/

    return false;
  };

  const getCharacterIcon = useCallback((id: string) => {
    const url = `${axiosInstance.defaults.baseURL}/characters/${id.toLowerCase()}/icon.png`;
    return url;
  }, []);

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => setSelectedCharacter(character)}
    >
      <div
        className={`relative rounded-none justify-between items-center bg-iron-900`}
      >
        <div className="relative">
          <img
            src={getCharacterIcon(character.id)}
            alt={character.name}
            className="object-contain w-full"
          />

          <div
            className={`absolute bottom-0 left-0 w-full h-1 ${getRarityColor(character.rarity)}`}
          />

          <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-iron-900/80 flex items-center justify-center shadow-md">
            <img
              src={attributeIcons[character.attribute]}
              className="w-5 h-5"
            />
          </div>
          {hasObjective() && (
            <div className="absolute top-1 left-1 w-6 h-6 bg-amber-600/90 rounded-full flex items-center justify-center shadow-md border-white">
              <AlertCircle className="w-4 h-4 text-zinc-300" />
            </div>
          )}
        </div>
        <div className="bg-zinc-700 text-center font-medium">
          {character.name}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
