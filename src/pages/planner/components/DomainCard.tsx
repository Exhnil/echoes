import { Card, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { axiosInstance } from '@/lib/axios'
import type { Domain, ItemState } from '@/types'

interface DomainCardProps {
    domain: Domain
    itemsState: ItemState[]
}

const getMaterialIcon = (id: string) => {
    return `${axiosInstance.defaults.baseURL}/materials/${id.toLowerCase()}/${id.toLowerCase()}.png`
}

const rarityColors: Record<number, string> = {
    2: "bg-green-400",
    3: "bg-blue-400",
    4: "bg-purple-600",
    5: "bg-equator-700",
}

const getRarityColor = (rarity: number) => {
    return rarityColors[rarity] ?? "from-transparent"
}

const getDomainsRuns = (domain: Domain, itemsState: ItemState[]) => {
    let maxRuns = 0
    for (const mat of domain.materials) {
        const item = itemsState.find(i => i.id === mat.id)
        const needed = item ? Math.max(item.required - item.owned, 0) : mat.value
        const runs = Math.ceil(needed / mat.value)
        console.log((mat.value))
        if (runs > maxRuns) maxRuns = runs
    }
    return maxRuns
}

const DomainCard = ({ domain, itemsState }: DomainCardProps) => {
    return (
        <Card
            key={domain.id}
            className="bg-zinc-900/60 p-4 flex flex-col items-center gap-3 rounded-none border-neutral-800">
            <CardTitle className="text-lg sm:text-xl font-bold text-center">
                {domain.name}
            </CardTitle>
            <p className="text-sm text-center w-full bg-gradient-to-r from-equator to-transparent px-2 py-1 font-semibold text-white">
                <span>
                    x{getDomainsRuns(domain, itemsState)} | {getDomainsRuns(domain, itemsState) * domain.cost} waveplates
                </span>
            </p>
            <div className="flex gap-2 mt-2">
                {domain.materials.map((mat, idx) => {
                    const item = itemsState.find(i => i.id === mat.id)
                    return (
                        <div className="relative bg-zinc-900/80 shadow-inner w-16 h-16">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <img
                                        key={idx}
                                        src={getMaterialIcon(mat.id.replace(/[' -]/g, "_"))}
                                        alt={mat.name}
                                        className="w-16 h-16 object-cover" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{mat.name}</p>
                                </TooltipContent>
                            </Tooltip>
                            <span className="absolute top-0 right-0 text-white text-xs px-1 font-semibold">{Math.max((item?.required ?? 0) - (item?.owned ?? 0), 0)}</span>
                            <div className={`absolute bottom-0 w-full h-1 ${getRarityColor(4)}`} />
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default DomainCard