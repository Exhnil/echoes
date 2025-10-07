import { Skeleton } from '@/components/ui/skeleton'

const CharacterGridSkeleton = () => {
    return (
        <div className='grid grid-cols-8 gap-4'>
            {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className='h-40 w-full rounded-lg'/>
            ))}
        </div>
    )
}

export default CharacterGridSkeleton