
import { Outlet } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import Footer from "./components/Footer"

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-black text-white">
            {/*Side bar*/}

            <ResizablePanelGroup direction="horizontal" className="flex h-full overflow-hidden">
                <ResizablePanel defaultSize={20} maxSize={20} minSize={20}>
                    <LeftSideBar />
                </ResizablePanel>
                <ResizablePanel className="flex-1 flex flex-col p-6 bg-gradient-to-br from-gray-900 to-gray-800 overflow-auto">
                    <div className="flex-1">
                        <Outlet />
                    </div>
                    <Footer />
                </ResizablePanel>
            </ResizablePanelGroup>

        </div>
    )
}

export default MainLayout