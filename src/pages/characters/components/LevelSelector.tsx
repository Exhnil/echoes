import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ChevronUp } from "lucide-react"
import { useState } from "react"

interface LevelSelectorProps {
    ascension: number
    level: number
    onSelect: (lvl: number, ascension: number) => void
    minValue?: number
}


const LEVEL_BUTTONS: { level: number; asc: number; label: string, isTier?: boolean }[] = [
    { level: 1, asc: 0, label: '1' },
    { level: 20, asc: 0, label: '20' },
    { level: 20, asc: 1, label: '20', isTier: true },
    { level: 40, asc: 1, label: '40' },
    { level: 40, asc: 2, label: '40', isTier: true },
    { level: 50, asc: 2, label: '50' },
    { level: 50, asc: 3, label: '50', isTier: true },
    { level: 60, asc: 3, label: '60' },
    { level: 60, asc: 4, label: '60', isTier: true },
    { level: 70, asc: 4, label: '70' },
    { level: 70, asc: 5, label: '70', isTier: true },
    { level: 80, asc: 5, label: '80' },
    { level: 80, asc: 6, label: '80', isTier: true },
    { level: 90, asc: 6, label: '90' },
]

const LevelSelector = ({ ascension, level, onSelect, minValue = 1 }: LevelSelectorProps) => {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="lg" className="w-20">
                    {LEVEL_BUTTONS.find(btn => btn.level === level && btn.asc === ascension)?.label ?? level}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-zinc-800">
                <div className="grid grid-cols-4 gap-2">
                    {LEVEL_BUTTONS.map((btn) => {
                        const disabled = btn.level < minValue
                        return (
                            <Button
                                key={`${btn.level}-${btn.asc}`}
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                disabled={disabled}
                                onClick={() => {
                                    onSelect(btn.level, btn.asc)
                                    setOpen(false)
                                }}
                            >
                                {btn.label}
                                {btn.isTier && <ChevronUp className="w-3 h-3 text-yellow-400" />}

                            </Button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default LevelSelector