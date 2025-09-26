import { BackpackIcon, BookOpenIcon, HomeIcon, SwordIcon, UserIcon } from "lucide-react"
import { Link } from "react-router-dom"

const LeftSideBar = () => {
    const menuItems = [
        { name: "Home", href: "/", icon: <HomeIcon /> },
        { name: "Characters", href: "/characters", icon: <UserIcon /> },
        { name: "Weapons", href: "/weapons", icon: <SwordIcon /> },
        { name: "Planner", href: "/planner", icon: <BookOpenIcon /> },
        { name: "Inventory", href: "/inventory", icon: <BackpackIcon /> },
    ]

    return (
        <div className="bg-slate-800 h-full flex flex-col gap-2 p-2">
            {menuItems.map((item) => (
                <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-2 text-blue-300 p-2 rounded-lg hover:bg-purple-500">
                    {item.icon}
                    <span className="hidden md:inline">{item.name}</span>
                </Link>
            ))}
        </div>
    )
}

export default LeftSideBar