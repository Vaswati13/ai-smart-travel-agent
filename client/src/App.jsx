import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Transition from "./pages/Transition";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/transition" element={<Transition />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;