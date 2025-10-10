import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { axiosInstance } from '@/lib/axios'
import { updateCharacterLevel, updateSkillLevel } from '@/lib/statesUpdate'
import { ranks, skillNames } from '@/lib/constants'
import type { BonusStat, Character, CharacterState, InherentSkill, SkillState, UnlockState } from '@/types'
import { Check, ChevronRight, Flag } from 'lucide-react'
import { useEffect, useState } from 'react'
import SkillLevelInput from './SkillLevelInput'
import LevelSelector from './LevelSelector'
import { Button } from '@/components/ui/button'

interface CharacterModalProps {
    character: Character | null
    open: boolean
    onClose: () => void
}

const getCharacterIcon = (id: string) => {
    return `${axiosInstance.defaults.baseURL}/characters/${id}/icon.png`
}

const generateBonusStats = (): BonusStat[] =>
    ranks.flatMap(rank =>
        Array.from({ length: 4 }).map((_, i) => ({
            id: `R${rank}-${i + 1}`,
            rank,
            index: i,
            state: 'none' as UnlockState
        }))
    )

const generateIhnerentSills = (): InherentSkill[] =>
    ranks.map(rank => ({
        id: `IS${rank}`,
        rank,
        state: 'none' as UnlockState
    }))

const CharacterModal = ({ open, character, onClose }: CharacterModalProps) => {

    const [characterState, setCharacterState] = useState<Record<string, CharacterState>>({})

    useEffect(() => {
        if (!character) return

        const saved = localStorage.getItem("characterState")
        const parsed: Record<string, CharacterState> = saved ? JSON.parse(saved) : {}

        if (!parsed[character.id]) {
            parsed[character.id] = {
                id: character.id,
                level: { currentLevel: 1, targetLevel: 1, currentAscensionLevel: 0, targetAscensionLevel: 0 },
                skills: skillNames.reduce((acc, skill) => {
                    acc[skill] = { currentSkillLevel: 1, targetSkillLevel: 1 } as SkillState
                    return acc
                }, {} as Record<string, SkillState>),
                bonusStats: generateBonusStats(),
                inherentSkills: generateIhnerentSills()
            }
        }

        setCharacterState(parsed)
    }, [character])

    const updateLevel = (currentOrTarget: "current" | "target", lvl: number, ascension: number) => {
        if (!character) return

        setCharacterState(prev => {
            const updated = updateCharacterLevel(prev, character.id, currentOrTarget, lvl, ascension)
            const char = updated?.[character.id]

            if (!char) return prev

            const currentAscension = char.level.currentAscensionLevel;
            const targetAscension = char.level.targetAscensionLevel;
            const currentLvl = char.level.currentLevel;
            const targetLvl = char.level.targetLevel;

            if (currentAscension > targetAscension || (currentAscension === targetAscension && currentLvl > targetLvl)) {
                char.level.targetAscensionLevel = currentAscension;
                char.level.targetLevel = currentLvl;
            }

            localStorage.setItem("characterState", JSON.stringify(updated))
            return updated ?? prev
        })
    }

    const updateSkills = (currentOrTarget: "currentSkillLevel" | "targetSkillLevel", skillName: string, lvl: number) => {
        if (lvl < 1 || lvl > 10 || !character) return

        setCharacterState(prev => {
            const updated = updateSkillLevel(prev, character.id, skillName, currentOrTarget, lvl)
            localStorage.setItem("characterState", JSON.stringify(updated))
            return updated ?? prev
        })
    }

    const updateTalents = (type: 'bonusStats' | 'inherentSkills', id: string, newState: UnlockState) => {
        if (!character) return

        setCharacterState(prev => {
            const updated = { ...prev }
            const char = updated[character.id]

            if (!char) return prev

            const list = char[type]
            const index = list.findIndex(i => i.id === id)
            if (index >= 0) {
                list[index] = { ...list[index], state: newState }
                localStorage.setItem("characterState", JSON.stringify(updated))
            }

            return updated
        })
    }

    const resetCharacter = (id: string) => {
        setCharacterState(prev => {
            const updated = { ...prev }
            const char = updated[id]
            if (!char) return prev

            char.level.currentAscensionLevel = 0
            char.level.targetAscensionLevel = 0
            char.level.currentLevel = 1
            char.level.targetLevel = 1

            Object.keys(char.skills).forEach(skill => {
                char.skills[skill].currentSkillLevel = 1
                char.skills[skill].targetSkillLevel = 1
            })

            char.bonusStats.forEach(stat => (stat.state = "none"))
            char.inherentSkills.forEach(stat => (stat.state = "none"))

            localStorage.setItem("characterState", JSON.stringify(updated))
            return updated
        })
    }

    if (!character) return null
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='w-[650px] !max-w-none mt-6 p-0 overflow-hidden bg-zinc-900 shadow-lg'
                style={{ top: "1rem", transform: "translateY(50%)" }}>
                <DialogHeader className='flex flex-row items-center gap-4 p-4 bg-gradient-to-br from-zinc-800 to-zinc-700 border-b border-zinc-700'>
                    <div className='w-16 h-16 rounded-full overflow-hidden bg-zinc-600 justify-center'>
                        <img
                            src={getCharacterIcon(character.id)}
                            alt={character.name}
                            className='object-cover w-full h-full' />
                    </div>
                    <DialogTitle className='text-2xl font-bold'>
                        {character.name}
                    </DialogTitle>
                    <div>
                        <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => resetCharacter(character.id)}
                        >Reset
                        </Button>
                    </div>
                </DialogHeader>
                <div className='p-2'>
                    <Tabs defaultValue='level' className='w-full'>
                        <TabsList className='flex w-full justify-center gap-2 mb-4 bg-zinc-800 p-1 rounded-lg'>
                            <TabsTrigger
                                value='level'
                                className='data-[state-active]:bg-zinc-700 data-[state-active]:text-white'
                            >Level</TabsTrigger>
                            <TabsTrigger
                                value='forte'
                                className='data-[state-active]:bg-zinc-700 data-[state-active]:text-white'
                            >Forte</TabsTrigger>
                        </TabsList>

                        <TabsContent value='level' className='space-y-4'>
                            <div className='bg-zinc-800 text-center p-2 rounded-md font-medium'>
                                Level
                            </div>

                            <div className='flex items-center justify-center space-x-4'>
                                <LevelSelector
                                    ascension={characterState[character.id]?.level.currentAscensionLevel}
                                    level={characterState[character.id]?.level.currentLevel}
                                    onSelect={(lvl, ascension) => updateLevel("current", lvl, ascension)}
                                />
                                <ChevronRight className='h-6 w-6' />
                                <LevelSelector
                                    ascension={characterState[character.id]?.level.targetAscensionLevel}
                                    level={characterState[character.id]?.level.targetLevel}
                                    onSelect={(lvl, ascension) => updateLevel("target", lvl, ascension)}
                                    minValue={characterState[character.id]?.level.currentLevel ?? 1}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value='forte' className='space-y-4'>
                            <div className='bg-zinc-800 text-center p-2 rounded-md font-medium'>
                                Forte
                            </div>

                            <div className='grid grid-cols-2 gap-6'>
                                <div className='space-y-2'>
                                    {skillNames.map((skill) => (
                                        <div className='flex flex-col items-center' key={skill}>
                                            <div className='rounded px-2 py-0.5 text-sm font-medium bg-zinc-600 mb-2'>{skill}</div>

                                            <div className='flex items-center justify-center space-x-2'>
                                                <SkillLevelInput
                                                    value={characterState[character.id]?.skills[skill].currentSkillLevel ?? 1}
                                                    onChange={(val) => updateSkills("currentSkillLevel", skill, val)} />

                                                <ChevronRight className='h-5 w-5 text-zinc-400' />

                                                <SkillLevelInput
                                                    value={characterState[character.id]?.skills[skill].targetSkillLevel ?? 1}
                                                    onChange={(val) => updateSkills("targetSkillLevel", skill, val)} />
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                <div className='space-y-4'>
                                    <div className='flex flex-col gap-4'>
                                        {ranks.map(rank => (
                                            <div key={rank}>
                                                <h4 className='text-sm font-medium mb-2 bg-zinc-600 py-1 px-0.5 rounded text-center'>Stat bonus Rank {rank}</h4>
                                                <div className='flex items-center justify-center gap-2'>
                                                    {characterState[character.id]?.bonusStats
                                                        .filter(b => b.rank === rank)
                                                        .map(bonus => (
                                                            <ToggleGroup
                                                                className='flex flex-row'
                                                                type='single'
                                                                key={bonus.id}
                                                                value={bonus.state}
                                                                onValueChange={val => updateTalents('bonusStats', bonus.id, val as UnlockState)}>
                                                                <ToggleGroupItem
                                                                    value='planned'
                                                                    className='bg-zinc-600 hover:bg-zinc-500'>
                                                                    <Flag />
                                                                </ToggleGroupItem>
                                                                <ToggleGroupItem
                                                                    value='done'
                                                                    className='bg-zinc-600 hover:bg-zinc-500'>
                                                                    <Check />
                                                                </ToggleGroupItem>
                                                            </ToggleGroup>
                                                        ))}
                                                </div>
                                            </div>
                                        ))
                                        }

                                        <div>
                                            <h4 className='text-sm font-medium mb-2 bg-zinc-600 py-1 px-0.5 rounded text-center'>Inherent Skills</h4>
                                            <div className='flex items-center justify-center gap-2'>
                                                {characterState[character.id]?.inherentSkills.map(skill => (
                                                    <ToggleGroup
                                                        key={skill.id}
                                                        className='flex flex-row'
                                                        type="single"
                                                        value={skill.state}
                                                        onValueChange={val => updateTalents('inherentSkills', skill.id, val as UnlockState)}
                                                    >
                                                        <ToggleGroupItem className='bg-zinc-600 hover:bg-zinc-500' value='planned'>
                                                            <Flag />
                                                        </ToggleGroupItem>
                                                        <ToggleGroupItem className='bg-zinc-600 hover:bg-zinc-500' value='done'>
                                                            <Check />
                                                        </ToggleGroupItem>
                                                    </ToggleGroup>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CharacterModal