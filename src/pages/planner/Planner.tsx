import { useItemStore } from "@/store/ItemStore"
import { useEffect, useState } from "react"
import type { Domain, Item, ItemState } from "@/types"
import DomainCard from "./components/DomainCard"
import SectionLayout from "./components/SectionLayout"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardTitle } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"

const getMaterialIcon = (id: string) => {
  return `${axiosInstance.defaults.baseURL}/materials/${id.toLowerCase()}/${id.toLowerCase()}.png`
}

const Planner = () => {
  const { domains, items, fetchAllMaterials, fetchAllDomains } = useItemStore()

  const [itemsState, setItemsState] = useState<ItemState[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])

  useEffect(() => {
    fetchAllDomains()
    fetchAllMaterials()
  }, [fetchAllDomains, fetchAllMaterials])

  useEffect(() => {
    if (!domains) return

    const savedJson = localStorage.getItem("inventoryState");
    const savedItems: ItemState[] = savedJson ? JSON.parse(savedJson) : [];
    setItemsState(savedItems);

    const filterNeeded = domains.filter((domain) =>
      domain.materials.some((mat) => {
        const item = savedItems.find((i: ItemState) => i.id === mat.id)
        return item ? item.owned < item.required : true
      }))
    setFilteredDomains(filterNeeded)
  }, [domains])

  const forgeryMaterials = filteredDomains.filter((d) => d.type === "Forgery Challenge")
  const overlordClasses = filteredDomains.filter((d) => d.type === "Overlord Class")
  const weeklyDomains = filteredDomains.filter((d) => d.type === "Weekly Challenge")
  const localItems = items.filter((i) => i.source.toLowerCase().includes("local")) || []
  const enemyDrops = items.filter((i) => i.source.toLowerCase().includes("enemies")) || []

  const groupedEnemiesDrop = enemyDrops.reduce((acc, item) => {
    const groupkey = item.group || item.id
    if (!acc[groupkey]) acc[groupkey] = []
    acc[groupkey].push(item)
    return acc
  }, {} as Record<string, Item[]>)

  const localItemsStates = localItems
    .map((item) => itemsState.find((s) => s.id === item.id))
    .filter((item): item is ItemState => !!item && (item.owned ?? 0) < (item.required ?? 0))

  return (
    <div className="p-6 space-y-6">
      <div className="items-center mb-4">
        <h1 className="text-2xl mb-2 font-bold">Planner</h1>
      </div>

      <div className='my-4 h-1 w-full bg-iron-700' />

      <SectionLayout
        title="Ennemy Drops"
      >
        {Object.entries(groupedEnemiesDrop).map(([group, groupItems]) => {
          const neededItems = groupItems
            .map(item => {
              const state = itemsState.find(s => s.id === item.id)
              const needed = Math.max((state?.required ?? 0) - (state?.owned ?? 0), 0)
              return { ...item, needed }
            })
            .filter(item => item.needed > 0)

          if (neededItems.length === 0) return null
          neededItems.sort((a, b) => b.rarity - a.rarity)

          const highest = neededItems[0].name
          const title = highest

          return (
            <Card
              key={group}
              className="bg-zinc-900/60 p-4 flex flex-col items-center gap-3 rounded-none border-neutral-800">
              <CardTitle className="text-lg sm:text-xl font-bold text-center">
                {title}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                {groupItems.map(mat => {
                  const state = itemsState.find(s => s.id === mat.id)
                  const needed = Math.max((state?.required ?? 0) - (state?.owned ?? 0), 0)
                  return (
                    <div key={mat.id} className="relative w-16 h-16 shadow-inner bg-zinc-900/80">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <img
                            src={getMaterialIcon(mat.id.replace(/[' -]/g, "_"))}
                            alt={mat.name}
                            className="w-16 h-16 object-cover"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{mat.name}</p>
                        </TooltipContent>
                      </Tooltip>
                      <span className="absolute top-0 right-0 text-white text-xs px-1 font-semibold">{needed}</span>
                      <div className={`absolute bottom-0 w-full h-1 ${["bg-green-400", "bg-blue-400", "bg-purple-600", "bg-equator-700"][mat.rarity - 2] ?? "from-transparent"}`} />
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}

      </SectionLayout>

      <SectionLayout
        title="Forgery Challenge">
        {forgeryMaterials.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            itemsState={itemsState}
            items={items} />
        ))}
      </SectionLayout>

      <SectionLayout
        title="Weekly Challenge">
        {weeklyDomains.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            itemsState={itemsState}
            items={items} />
        ))}
      </SectionLayout>

      <SectionLayout
        title="Overlord Class">
        {overlordClasses.map(domain => (
          <DomainCard
            key={domain.id}
            domain={domain}
            itemsState={itemsState}
            items={items} />
        ))}
      </SectionLayout>

      <SectionLayout
        title="Exploration">
        {localItemsStates.map((mat) => (
          <Card
            key={mat?.id}
            className="bg-zinc-900/60 p-4 flex flex-col items-center gap-3 rounded-none border-neutral-800">
            <CardTitle className="text-lg sm:text-xl font-bold text-center">
              {mat?.name}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <div className="relative bg-zinc-900/80 shadow-inner w-16 h-16">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img
                      src={getMaterialIcon((mat?.id ?? "").replace(/[' -]/g, "_"))}
                      alt={mat?.name}
                      className="w-16 h-16 object-cover" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{mat?.name}</p>
                  </TooltipContent>
                </Tooltip>
                <span className="absolute top-0 right-0 text-white text-xs px-1 font-semibold">{Math.max((mat?.required ?? 0) - (mat?.owned ?? 0), 0)}</span>
              </div>
            </div>
          </Card>
        ))}
      </SectionLayout>

    </div>
  )
}

export default Planner