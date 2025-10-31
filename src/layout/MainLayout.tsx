
import { Outlet } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar"
import Footer from "./components/Footer"

const MainLayout = () => {
    return (
        <div className="h-screen flex bg-zinc-800 text-white">
            <div className="flex-shrink-0 w-20 sm:w-64 bg-iron-900">
                <LeftSideBar />
            </div>

            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-scroll">
                    <Outlet />

                    <Footer />
                </div>
            </main>
        </div>
    )
}

export default MainLayout