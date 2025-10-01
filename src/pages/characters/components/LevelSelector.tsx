import { Button } from "@/components/ui/button"
import { LEVELS } from "@/lib/constants"
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useState } from "react"

interface LevelSelectorProps {
    value: number
    onSelect: (lvl: number) => void
}

const LevelSelector = ({ value, onSelect }: LevelSelectorProps) => {

    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="lg" className="w-20">
                    {value}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-gray-800">
                <div className="grid grid-cols-4 gap-2">
                    {LEVELS.map((lvl) => (
                        <Button
                            key={lvl}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => {
                                onSelect(lvl)
                                setOpen(false)
                            }}
                        >
                            {lvl}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default LevelSelector