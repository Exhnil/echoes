import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { axiosInstance } from '@/lib/axios'
import { updateCharacterLevel, updateSkillLevel } from '@/lib/characterState'
import { ranks, skillNames, stats } from '@/lib/constants'
import type { Character, CharacterState, SkillState, UnlockState } from '@/types'
import { ToggleGroup } from '@radix-ui/react-toggle-group'
import { Check, ChevronRight, Flag } from 'lucide-react'
import { useEffect, useState } from 'react'
import SkillLevelInput from './SkillLevelInput'
import LevelSelector from './LevelSelector'

interface CharacterModalProps {
    character: Character | null
    open: boolean
    onClose: () => void
}

const getCharacterIcon = (id: string) => {
    return `${axiosInstance.defaults.baseURL}/characters/${id}/icon.png`
}

const bonusStats = ranks.flatMap(rank =>
    stats.map(stat => ({
        id: `R${rank}-${stat}`,
        state: "none" as UnlockState
    }))
)
const inherentSkills: { id: string; state: UnlockState }[] = [{ id: "IS1", state: "none" as UnlockState }, { id: "IS2", state: "none" as UnlockState }]

const CharacterModal = ({ open, character, onClose }: CharacterModalProps) => {

    const [characterState, setCharacterState] = useState<Record<string, CharacterState>>({})

    useEffect(() => {
        if (!character) return

        const saved = localStorage.getItem("characterState")
        const parsed: Record<string, CharacterState> = saved ? JSON.parse(saved) : {}

        if (!parsed[character.id]) {
            parsed[character.id] = {
                id: character.id,
                level: { ascensionLevel: 1, currentCharacterLevel: 1, targetCharacterLevel: 1 },
                skills: skillNames.reduce((acc, skill) => {
                    acc[skill] = { currentSkillLevel: 1, targetSkillLevel: 1 } as SkillState
                    return acc
                }, {} as Record<string, SkillState>),
                bonusStats: bonusStats, // Example: 8 booleans for 2 ranks of 4 stats each
                inherentSkills: inherentSkills // Example: 2 booleans for inherent skills
            }
        }

        setCharacterState(parsed)
    }, [character])

    const updateLevel = (currentOrTarget: "currentCharacterLevel" | "targetCharacterLevel", lvl: number) => {
        if (!character) return

        setCharacterState(prev => {
            const updated = updateCharacterLevel(prev, character.id, currentOrTarget, lvl)
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

    if (!character) return null
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='w-[650px] !max-w-none mt-6 p-0 overflow-hidden bg-gray-900 shadow-lg'
                style={{ top: "1rem", transform: "translateY(50%)" }}>
                <DialogHeader className='flex flex-row items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-700 border-b border-gray-700'>
                    <div className='w-16 h-16 rounded-full overflow-hidden bg-gray-600 justify-center'>
                        <img
                            src={getCharacterIcon(character?.id)}
                            alt={character.name}
                            className='object-cover w-full h-full' />
                    </div>
                    <DialogTitle className='text-2xl font-bold'>
                        {character.name}
                    </DialogTitle>
                </DialogHeader>
                <div className='p-2'>
                    <Tabs defaultValue='level' className='w-full'>
                        <TabsList className='flex w-full justify-center gap-2 mb-4 bg-gray-800 p-1 rounded-lg'>
                            <TabsTrigger
                                value='level'
                                className='data-[state-active]:bg-gray-700 data-[state-active]:text-white'
                            >Level</TabsTrigger>
                            <TabsTrigger
                                value='forte'
                                className='data-[state-active]:bg-gray-700 data-[state-active]:text-white'
                            >Forte</TabsTrigger>
                            <TabsTrigger
                                value='weapon'
                                className='data-[state-active]:bg-gray-700 data-[state-active]:text-white'
                            >Weapon</TabsTrigger>
                        </TabsList>

                        <TabsContent value='level' className='space-y-4'>
                            <div className='bg-gray-800 text-center p-2 rounded-md font-medium'>
                                Level
                            </div>

                            <div className='flex items-center justify-center space-x-4'>
                                <LevelSelector
                                    value={characterState[character.id]?.level.currentCharacterLevel}
                                    onSelect={(lvl) => updateLevel("currentCharacterLevel", lvl)}
                                />
                                <ChevronRight className='h-6 w-6' />
                                <LevelSelector
                                    value={characterState[character.id]?.level.targetCharacterLevel}
                                    onSelect={(lvl) => updateLevel("targetCharacterLevel", lvl)}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value='forte' className='space-y-4'>
                            <div className='bg-gray-800 text-center p-2 rounded-md font-medium'>
                                Forte
                            </div>

                            <div className='grid grid-cols-2 gap-6'>
                                <div className='space-y-2'>
                                    {skillNames.map((skill) => (
                                        <div className='flex flex-col items-center' key={skill}>
                                            <div className='rounded px-2 py-0.5 text-sm font-medium bg-gray-600 mb-2'>{skill}</div>

                                            <div className='flex items-center justify-center space-x-2'>
                                                <SkillLevelInput
                                                    value={characterState[character.id]?.skills[skill].currentSkillLevel ?? 1}
                                                    onChange={(val) => updateSkills("currentSkillLevel", skill, val)} />

                                                <ChevronRight className='h-5 w-5 text-gray-400' />

                                                <SkillLevelInput
                                                    value={characterState[character.id]?.skills[skill].targetSkillLevel ?? 1}
                                                    onChange={(val) => updateSkills("targetSkillLevel", skill, val)} />
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                <div className='space-y-4'>
                                    <div className='flex flex-col gap-4'>
                                        <div>
                                            <h4 className='text-sm font-medium mb-2 bg-gray-600 py-1 px-0.5 rounded text-center'>Stat bonus Rank 1</h4>
                                            <div className='flex items-center justify-center gap-2'>
                                                {[...Array(4)].map(() => (
                                                    <ToggleGroup
                                                        className='flex flex-row'
                                                        type='single'>
                                                        <ToggleGroupItem
                                                            className='bg-gray-600 hover:bg-gray-500'
                                                            value='planned'>
                                                            <Flag />
                                                        </ToggleGroupItem>
                                                        <ToggleGroupItem
                                                            className='bg-gray-600 hover:bg-gray-500'
                                                            value='done'>
                                                            <Check />
                                                        </ToggleGroupItem>
                                                    </ToggleGroup>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className='text-sm font-medium mb-2 bg-gray-600 py-1 px-0.5 rounded text-center'>Stat bonus Rank 2</h4>
                                            <div className='flex items-center justify-center gap-2'>
                                                {[...Array(4)].map(() => (
                                                    <ToggleGroup
                                                        className='flex flex-row'
                                                        type='multiple'>
                                                        <ToggleGroupItem
                                                            className='bg-gray-600 hover:bg-gray-500'
                                                            value='planned'>
                                                            <Flag />
                                                        </ToggleGroupItem>
                                                        <ToggleGroupItem
                                                            className='bg-gray-600 hover:bg-gray-500'
                                                            value='done'>
                                                            <Check />
                                                        </ToggleGroupItem>
                                                    </ToggleGroup>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className='text-sm font-medium mb-2 bg-gray-600 py-1 px-0.5 rounded text-center'>Inherent Skills</h4>
                                            <div className='flex items-center justify-center gap-2'>
                                                {[...Array(2)].map(() => (
                                                    <ToggleGroup
                                                        className='flex flex-row'
                                                        type='multiple'>
                                                        <ToggleGroupItem
                                                            className='bg-gray-600 hover:bg-gray-500'
                                                            value='planned'>
                                                            <Flag />
                                                        </ToggleGroupItem>
                                                        <ToggleGroupItem
                                                            className='bg-gray-600 hover:bg-gray-500'
                                                            value='done'>
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
                        <TabsContent value='weapon' className='space-y-4'>
                            <div className='bg-gray-800 text-center p-2 rounded-md font-medium'>
                                Weapon
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CharacterModal