import { Skeleton } from "@/components/ui/skeleton"

const CharacterSkeleton = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center justify-between w-32 h-44 p-2 bg-zinc-900/60 border border-neutral-800 rounded-none">
                <Skeleton className="w-24 h-24 bg-zinc-700" />

                <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <Skeleton className="w-4 h-4 bg-zinc-600 rounded-full" />
                </div>

                <Skeleton className="w-20 h-3 mt-3 bg-zinc-700" />
            </div>
        </div>
    )
}

export default CharacterSkeleton
