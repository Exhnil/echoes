import { Card, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { axiosInstance } from '@/lib/axios'
import type { Domain, Item, ItemState } from '@/types'

interface DomainCardProps {
    domain: Domain
    itemsState: ItemState[]
    items?: Item[]
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
    console.log(rarity)
    return rarityColors[rarity] ?? "from-transparent"
}

const getDomainsRuns = (domain: Domain, itemsState: ItemState[]) => {

    if (domain.type === "Forgery Challenge" && domain.materials.length === 4) {
        const ratios = [1, 3, 9, 27]

        let totalRequiredBase = 0
        let totalOwnedBase = 0
        let totalNeededBase = 0

        domain.materials.forEach((mat, i) => {
            const item = itemsState.find(it => it.id === mat.id)
            const owned = item?.owned ?? 0
            const required = item?.required ?? 0
            totalOwnedBase += owned * ratios[i]
            totalRequiredBase += required * ratios[i]
        })

        totalNeededBase = Math.max(totalRequiredBase - totalOwnedBase, 0)
        const dropValues = domain.materials.map(m => m.value)
        const totalDropPerRun = dropValues.reduce((a, b, i) => a + b * ratios[i], 0)

        const runs = Math.ceil(totalNeededBase / totalDropPerRun)
        return runs
    }

    let maxRuns = 0
    for (const mat of domain.materials) {
        const item = itemsState.find(i => i.id === mat.id)
        const needed = item ? Math.max(item.required - item.owned, 0) : mat.value
        const runs = Math.ceil(needed / mat.value)
        if (runs > maxRuns) maxRuns = runs
    }
    return maxRuns
}

const DomainCard = ({ domain, itemsState, items }: DomainCardProps) => {

    const getItemRarity = (id: string) => {
        return items?.find(i => i.id === id)?.rarity ?? 1
    }

    const runs = getDomainsRuns(domain, itemsState)

    return (
        <Card
            key={domain.id}
            className="bg-zinc-900/60 p-4 flex flex-col items-center gap-3 rounded-none border-neutral-800">
            <CardTitle className="text-lg sm:text-xl font-bold text-center">
                {domain.name}
            </CardTitle>
            <p className="text-sm text-center w-full bg-gradient-to-r from-equator to-transparent px-2 py-1 font-semibold text-white">
                <span>
                    x{runs} | {runs * domain.cost} waveplates
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
                            <div className={`absolute bottom-0 w-full h-1 ${getRarityColor(getItemRarity(mat.id))}`} />
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default DomainCard