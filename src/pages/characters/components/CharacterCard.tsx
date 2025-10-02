import type { Character } from '@/types'

interface CharacterCardProps {
    character: Character;
    characterIcon: string;
    attributeIcon: string;
    setSelectedCharacter: (character: Character) => void;
}

const CharacterCard = ({ character, characterIcon, attributeIcon, setSelectedCharacter }: CharacterCardProps) => {
    return (
        <div
            key={character.id}
            className='flex flex-col items-center cursor-pointer'
            onClick={() => setSelectedCharacter(character)}>
            <div className='relative bg-gradient-to-b rounded-xl justify-between items-center from-gray-600 to-gray-800'>
                <img
                    src={characterIcon}
                    alt={character.name}
                    className='object-contain' />
                <div className='absolute top-1 right-1 w-7 h-7 rounded-full bg-gray-900/80 flex items-center justify-center shadow-md'>
                    <img
                        src={attributeIcon}
                        className='w-5 h-5'
                    />
                </div>
                <div className='text-center font-medium'>{character.name}</div>
            </div>
        </div>
    )
}

export default CharacterCard