import { Skeleton } from '@/components/ui/skeleton'

interface FilterProps {
    size: number
}

const FilterSkeleton = ({ size }: FilterProps) => {
    return (
        <div className='flex items-center gap-6'>
            <div className='flex gap-2 p-2 rounded'>
                {Array.from({ length: size }).map((_, i) => (
                    <Skeleton key={i} className='w-8 h-8 rounded bg-zinc-700' />
                ))}
            </div>
        </div>

    )
}

export default FilterSkeleton