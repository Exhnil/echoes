import { Skeleton } from '@/components/ui/skeleton'

const CharacterSkeleton = () => {
    return (
        <div className='flex flex-col items-center'>
            <div className='relative bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-xl flex flex-col items-center justify-between w-32 h-44 p-2'>
                <Skeleton className='w-24 h-24 rounded-xl bg-zinc-600' />
                <div className='absolute top-1 right-1 w-7 h-7 rounded-full bg-zinc-900/80 flex items-center justify-center shadow-md'>
                    <Skeleton className='w-5 h-5 rounded-full bg-zinc-600' />
                </div>
                <div className='absolute top-1 left-1 w-6 h-6 bg-zinc-50/70 rounded-full flex items-center justify-center shadow-md border-white'>
                    <Skeleton className='w-4 h-4 rounded-full bg-zinc-600' />
                </div>
                <Skeleton className='mt-2 h-4 w-20 rounded bg-zinc-600' />
            </div>
        </div>
    )
}

export default CharacterSkeleton