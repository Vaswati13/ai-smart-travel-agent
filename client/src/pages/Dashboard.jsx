import Sidebar from "../components/Sidebar";
import { useContext, useState, useEffect } from "react";
import { TripContext } from "../context/TripContext";

import DashboardHome from "../sections/DashboardHome";
import CurrencyCard from "../components/CurrencyCard";
import FestivalCard from "../components/FestivalCard";
import EmergencyCard from "../components/EmergencyCard";
import PhotoSpotCard from "../components/PhotoSpotCard";
import PackingList from "../components/PackingList";
import AIOverview from "../sections/AIOverview";
import Itinerary from "../sections/Itinerary";
import BudgetSection from "../sections/BudgetSection";
import HotelsSection from "../sections/HotelsSection";
import RestaurantsSection from "../sections/RestaurantsSection";

function Dashboard() {
  const { tripData, setTripPlan } = useContext(TripContext);

  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function generateTrip() {
      try {
        setLoading(true);

        const response = await fetch("https://ai-smart-travel-agent-3.onrender.com/plan-trip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        });

        const data = await response.json();

        if (response.ok) {
  setAiResult(data.result || "");
  setTripPlan(data.structured || {});
} else {
  setAiResult(data.error || "Something went wrong");
  setTripPlan({});
}
      } catch (error) {
        setAiResult(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (tripData.destination) {
      generateTrip();
    }
  }, [tripData.destination]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_22%),linear-gradient(135deg,_#06101f_0%,_#0a1730_40%,_#071122_100%)] text-slate-900">
      <div className="flex min-h-screen flex-col md:flex-row">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
          />
        )}

        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-12 right-10 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />
          </div>
          <div className="relative z-10 mb-4 md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="bg-blue-600 text-white p-3 rounded-xl shadow-lg"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
          <div className="relative z-10 mb-8 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_18px_60px_rgba(3,7,18,0.45)] p-6 md:p-8">
            <h1 className="dashboard-title text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              ✈ AI Travel Dashboard
            </h1>
            <p className="dashboard-subtitle text-slate-200 text-base md:text-lg mt-2 tracking-wide">
              AI-Powered Travel Companion
            </p>
          </div>

          <div className="relative z-10">
            {activeSection === "dashboard" && (
              <DashboardHome tripData={tripData} />
            )}
            {activeSection === "overview" && (
              <AIOverview loading={loading} aiResult={aiResult} />
            )}
            {activeSection === "itinerary" && (
              <Itinerary loading={loading} aiResult={aiResult} />
            )}

            {activeSection === "currency" && <CurrencyCard />}
            {activeSection === "festivals" && <FestivalCard />}
            {activeSection === "photos" && <PhotoSpotCard />}
            {activeSection === "budget" && <BudgetSection />}
            {activeSection === "packing" && <PackingList />}
            {activeSection === "emergency" && <EmergencyCard />}
            {activeSection === "hotels" && <HotelsSection />}
            {activeSection === "restaurants" && <RestaurantsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;