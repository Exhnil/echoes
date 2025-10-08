import { Button } from "@/components/ui/button"
import { LEVELS } from "@/lib/constants"
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useState } from "react"
import { Star } from "lucide-react"

interface LevelSelectorProps {
    value: number
    onSelect: (lvl: number) => void
    minValue?: number
}

const LevelSelector = ({ value, onSelect, minValue = 1 }: LevelSelectorProps) => {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="lg" className="w-20">
                    {value}
                    <Star
                        className="w-4 h-4"
                        stroke="white"
                        fill="white"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-gray-800">
                <div className="grid grid-cols-4 gap-2">
                    {LEVELS.map((lvl) => {
                        const disabled = lvl < minValue
                        return (
                            <Button
                                key={lvl}
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                disabled={disabled}
                                onClick={() => {
                                    onSelect(lvl)
                                    setOpen(false)
                                }}
                            >
                                {lvl}
                                <Star
                                    className="w-4 h-4"
                                    stroke="white"
                                    fill="white"
                                />
                            </Button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default LevelSelector