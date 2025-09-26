import { attributeIcons } from '@/constants/icons'
import { axiosInstance } from '@/lib/axios'
import { useCharactersStore } from '@/store/CharactersStore'
import { useEffect, useState } from 'react'
import CharacterModal from './CharacterModal'
import type { Character } from '@/types'

interface CharactersGridProps {
    rarity: string | null
    attribute: string | null
    weapon: string | null
}

const getCharacterIcon = (name: string) => {
    const url = `${axiosInstance.defaults.baseURL}/characters/${name}/icon.png`
    console.log(url)
    return url;
}


const CharactersGrid = ({ rarity, attribute, weapon }: CharactersGridProps) => {
    const { characters, fetchCharacters } = useCharactersStore()

    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

    useEffect(() => {
        fetchCharacters()
    }, [fetchCharacters])

    const filteredCharacters = characters.filter((character) => {
        return (
            (!rarity || character.rarity.toString() === rarity) &&
            (!attribute || character.attribute === attribute) &&
            (!weapon || character.weapon === weapon)
        )
    })

    return (
        <>
            <div className='mt-6'>
                <div className='grid grid-cols-8 gap-x-4 gap-y-8'>
                    {filteredCharacters.map((character) =>
                    (
                        <div
                            key={character.id}
                            className='flex flex-col items-center cursor-pointer'
                            onClick={() => setSelectedCharacter(character)}>
                            <div className='relative bg-gradient-to-b rounded-xl justify-between items-center from-gray-600 to-gray-800'>
                                <img
                                    src={getCharacterIcon(character.id)}
                                    alt={character.name}
                                    className='object-contain' />
                                <div className='absolute top-1 right-1 w-7 h-7 rounded-full bg-gray-900/80 flex items-center justify-center shadow-md'>
                                    <img
                                        src={attributeIcons[character.attribute]}
                                        className='w-5 h-5'
                                    />
                                </div>
                                <div className='text-center font-medium'>{character.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <CharacterModal
                open={!!selectedCharacter}
                character={selectedCharacter}
                onClose={() => setSelectedCharacter(null)} />
        </>
    )
}

export default CharactersGrid