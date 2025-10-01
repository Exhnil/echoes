
import { Outlet } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar"
import Footer from "./components/Footer"

const MainLayout = () => {
    return (
        <div className="h-screen flex bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="w-64 flex-shrink-0">
                <LeftSideBar />
            </div>

            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-scroll">
                    <Outlet />

                    <Footer />
                </div>
            </main>

            {/*<ResizablePanelGroup direction="horizontal" className="flex h-full">
                <ResizablePanel defaultSize={20} maxSize={20} minSize={20}>
                    <LeftSideBar />
                </ResizablePanel>
                <ResizablePanel className="flex overflow-y-scroll flex-col p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="flex-1">
                        <Outlet /></div>
                    <Footer />
                </ResizablePanel>
            </ResizablePanelGroup>*/}

        </div>
    )
}

export default MainLayout