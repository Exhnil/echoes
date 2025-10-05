import { attributeIcons } from '@/constants/icons'
import { axiosInstance } from '@/lib/axios'
import { useCharactersStore } from '@/store/CharactersStore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CharacterModal from './CharacterModal'
import type { Character } from '@/types'
import CharacterCard from './CharacterCard'
import React from 'react'

interface CharactersGridProps {
    rarity: string
    attribute: string
    weapon: string
}

const CharactersGrid = ({ rarity, attribute, weapon }: CharactersGridProps) => {
    const { characters, fetchCharacters } = useCharactersStore()

    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

    useEffect(() => {
        fetchCharacters()
    }, [fetchCharacters])

    const getCharacterIcon = useCallback((name: string) => {
        const url = `${axiosInstance.defaults.baseURL}/characters/${name.toLowerCase()}/icon.png`
        return url;
    }, [])

    const filteredCharacters = useMemo(() => {
        return characters.filter((character) => (
            (!rarity || character.rarity.toString() === rarity) &&
            (!attribute || character.attribute === attribute) &&
            (!weapon || character.weapon === weapon)
        ));
    }, [attribute, characters, rarity, weapon]);

    return (
        <>
            <div className='mt-6'>
                <div className='grid grid-cols-8 gap-x-4 gap-y-8'>
                    {filteredCharacters.map((character) =>
                    (
                        <CharacterCard
                            key={character.id}
                            setSelectedCharacter={(character) => setSelectedCharacter(character)}
                            attributeIcon={attributeIcons[character.attribute]}
                            characterIcon={getCharacterIcon(character.name)}
                            character={character} />
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

export default React.memo(CharactersGrid)