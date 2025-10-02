import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/home/Home";
import Characters from "./pages/characters/Characters";
import Inventory from "./pages/inventory/Inventory";
import Planner from "./pages/planner/Planner";
import Weapons from "./pages/weapons/Weapons";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/weapons" element={<Weapons />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
