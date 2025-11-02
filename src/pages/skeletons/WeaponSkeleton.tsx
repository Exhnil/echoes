import { Skeleton } from '@/components/ui/skeleton'

const WeaponSkeleton = () => {
    return (
        <div className='flex flex-col items-center'>
            <div className='relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl flex flex-col items-center justify-between w-32 h-44 p-2'>
                <Skeleton className='w-24 h-24 rounded-xl bg-zinc-600'/>
             
                <Skeleton className='mt-2 h-4 w-20 rounded bg-zinc-700'/>
            </div>
        </div>
    )
}

export default WeaponSkeleton