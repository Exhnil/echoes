import { useCharactersStore } from '@/store/CharactersStore'
import { useEffect } from 'react'

interface CharactersGridProps {
    rarity: string | null
    attribute: string | null
    weapon: string | null
}

const CharactersGrid = ({ rarity, attribute, weapon }: CharactersGridProps) => {
    const { characters, fetchCharacters } = useCharactersStore()

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
        <div className='mt-6'>
            <div className='grid grid-cols-8 gap-x-4 gap-y-8'>
                {filteredCharacters.map((character) =>
                (
                    <div key={character.id} className='border flex flex-col items-center rounded-lg'>
                        <div className='w-24 h-24 bg-gray-300 rounded-md mb-2' />
                        <span className='text-center font-medium'>{character.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CharactersGrid