import type { Character, CharacterState } from '@/types'
import { AlertCircle } from 'lucide-react';

interface CharacterCardProps {
    character: Character;
    characterIcon: string;
    attributeIcon: string;
    setSelectedCharacter: (character: Character) => void;
}

const rarityColors: Record<number, string> = {
    4: "from-violet-600",
    5: "from-yellow-500",
}

const getRarityColor = (rarity: number) => {
    return rarityColors[rarity] ?? "from-transparent"
}

//Changer la couleur pour de bas vers haut, en vers tranparent ou zinc
const CharacterCard = ({ character, characterIcon, attributeIcon, setSelectedCharacter }: CharacterCardProps) => {

    const hasObjective = () => {
        const saved = localStorage.getItem("characterState")
        const parsed: Record<string, CharacterState> = saved ? JSON.parse(saved) : {}

        const characterState = parsed[character.id]
        if (!characterState) return false

        const level = characterState.level
        if (level.currentAscensionLevel !== level.targetAscensionLevel || level.currentLevel !== level.targetLevel) {
            return true
        }

        for (const skillId in characterState.skills) {
            const skill = characterState.skills[skillId]
            if (skill.currentSkillLevel !== skill.targetSkillLevel) return true
        }

        if (characterState.bonusStats.some(b => b.state === "planned")) return true

        if (characterState.inherentSkills.some(s => s.state === "planned")) return true

        return false
    }

    return (
        <div
            className='flex flex-col items-center cursor-pointer'
            onClick={() => setSelectedCharacter(character)}>
            <div className={`relative bg-gradient-to-b rounded-xl justify-between items-center ${getRarityColor(character.rarity)} to-zinc-800`}>
                <img
                    src={characterIcon}
                    alt={character.name}
                    className='object-contain' />
                <div className='absolute top-1 right-1 w-7 h-7 rounded-full bg-zinc-900/80 flex items-center justify-center shadow-md'>
                    <img
                        src={attributeIcon}
                        className='w-5 h-5'
                    />
                </div>
                {
                    hasObjective() && (
                        <div
                            className='absolute top-1 left-1 w-6 h-6 bg-amber-600/90 rounded-full flex items-center justify-center shadow-md border-white'>
                            <AlertCircle
                                className='w-4 h-4 text-zinc-300' />
                        </div>
                    )
                }
                <div className='text-center font-medium'>{character.name}</div>
            </div>
        </div>
    )
}

export default CharacterCard