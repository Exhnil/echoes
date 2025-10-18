import { menuIcons } from "@/constants/icons"
import { Link, useLocation } from "react-router-dom"

const LeftSideBar = () => {

    const location = useLocation()

    const menuItems = [
        { name: "Characters", href: "/characters" },
        { name: "Weapons", href: "/weapons" },
        { name: "Planner", href: "/planner" },
        { name: "Inventory", href: "/inventory" },
        { name: "Settings", href: "/settings" }
    ]

    return (
        <div className="bg-zinc-800 h-screen flex flex-col p-4">
            <div className="mb-2 text-center">
                <Link to="/" className="block">
                    <img
                    src="/echoes.png"
                    alt="Echoes"
                    className="mx-auto w-auto h-24 object-contain"/>
                </Link>
            </div>
            <div className="flex flex-col gap-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`mx-6 flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-zinc-700 text-zinc-300 transition-colors duration-200
                                ${isActive ? "bg-zinc-900 text-white" : "hover:bg-zinc-700/50 hover:text-zinc-300"}`}>
                            <img
                                src={menuIcons[item.name]}
                                alt={item.name}
                                className="w-10 h-10"
                            />
                            <span className="">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default LeftSideBar