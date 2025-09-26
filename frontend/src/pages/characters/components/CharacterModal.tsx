import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import type { Character } from '@/types'

interface CharacterModalProps {
    character: Character | null
    open: boolean
    onClose: () => void
}

const CharacterModal = ({ open, character, onClose }: CharacterModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='bg-gray-800 max-w-full p-6'>
                <DialogHeader>
                </DialogHeader>
                {character ? <p>{character.name}</p> : <></>}
            </DialogContent>
        </Dialog>
    )
}

export default CharacterModal