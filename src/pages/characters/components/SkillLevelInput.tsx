interface SkillLevelInputProps {
    value: number
    onChange: (val: number) => void
}

const SkillLevelInput = ({ value, onChange }: SkillLevelInputProps) => (
    <div className="flex">
        <div className="flex bg-zinc-500 rounded-l-lg overflow-hidden">
            <input
                min={1}
                max={10}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="p-0 text-center border-none w-12 h-12 no-spinner"
            />
        </div>
        <div className="flex flex-col">
            <button
                className="bg-zinc-600 rounded-tr-lg w-8 h-6 cursor-pointer"
                onClick={() => value < 10 && onChange(value + 1)}
            >
                +
            </button>
            <button
                className="bg-zinc-600 rounded-br-lg w-8 h-6 cursor-pointer"
                onClick={() => value > 1 && onChange(value - 1)}
            >
                -
            </button>
        </div>
    </div>
)


export default SkillLevelInput