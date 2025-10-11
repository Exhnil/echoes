import { attributeIcons } from '@/constants/icons'
import { axiosInstance } from '@/lib/axios'
import { useCharactersStore } from '@/store/CharactersStore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CharacterModal from './CharacterModal'
import type { Character } from '@/types'
import CharacterCard from './CharacterCard'
import React from 'react'
import CharacterGridSkeleton from '@/pages/skeletons/CharacterGridSkeleton'

interface CharactersGridProps {
    rarity: string
    attribute: string
    weapon: string
}

const CharactersGrid = ({ rarity, attribute, weapon }: CharactersGridProps) => {
    const { characters, fetchCharacters, isLoading } = useCharactersStore()

    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [imagesLoaded, setImagesLoaded] = useState(false)


    useEffect(() => {
        if (characters.length === 0) fetchCharacters()
    }, [characters.length, fetchCharacters])

    const getCharacterIcon = useCallback((id: string) => {
        const url = `${axiosInstance.defaults.baseURL}/characters/${id.toLowerCase()}/icon.png`
        return url;
    }, [])

    const filteredCharacters = useMemo(() => {
        return characters.filter((character) => (
            (!rarity || character.rarity.toString() === rarity) &&
            (!attribute || character.attribute === attribute) &&
            (!weapon || character.weapon === weapon)
        ));
    }, [attribute, characters, rarity, weapon]);

    useEffect(() => {
        if (characters.length === 0) return

        let loadedCount = 0
        const total = filteredCharacters.length

        filteredCharacters.forEach((character) => {
            const img = new Image()
            img.src = getCharacterIcon(character.id)
            img.onload = () => {
                loadedCount += 1
                if (loadedCount === total) setImagesLoaded(true)
            }
        })

        // Réinitialiser quand les filtres changent
        return () => setImagesLoaded(false)
    }, [characters, filteredCharacters, getCharacterIcon])

    return (
        <>
            <div className='mt-6'>
                {isLoading || !imagesLoaded ?
                    (
                        <CharacterGridSkeleton count={filteredCharacters.length || 38} />
                    ) :
                    (
                        <div className='grid grid-cols-8 gap-x-4 gap-y-8'>
                            {filteredCharacters
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((character) =>
                                (
                                    <CharacterCard
                                        key={character.id}
                                        setSelectedCharacter={(character) => setSelectedCharacter(character)}
                                        attributeIcon={attributeIcons[character.attribute]}
                                        characterIcon={getCharacterIcon(character.id)}
                                        character={character} />
                                ))}
                        </div>
                    )}
            </div>
            <CharacterModal
                open={!!selectedCharacter}
                character={selectedCharacter}
                onClose={() => setSelectedCharacter(null)} />
        </>
    )
}

export default React.memo(CharactersGrid)