import CharacterSkeleton from './CharacterSkeleton'

const CharacterGridSkeleton = ({ count = 8 }: { count?: number }) => {
    return (
        <div className='mt-6 grid grid-cols-8 gap-x-4 gap-y-8'>
            {Array.from({ length: count }).map((_, i) => (
                <CharacterSkeleton key={i} />
            ))}
        </div>
    )
}

export default CharacterGridSkeleton