import WeaponSkeleton from "./WeaponSkeleton";

const WeaponGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="mt-6 grid grid-cols-8 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <WeaponSkeleton key={i} />
      ))}
    </div>
  );
};

export default WeaponGridSkeleton;
