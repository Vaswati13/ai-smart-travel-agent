import { useContext } from "react";
import { TripContext } from "../context/TripContext";
import ChatBot from "./ChatBot";
import {
  FaHome,
  FaRobot,
  FaMapMarkedAlt,
  FaHotel,
  FaUtensils,
  FaWallet,
  FaSuitcase,
  FaMapMarkerAlt,
  FaCamera,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaDownload,
} from "react-icons/fa";

function Sidebar({ activeSection, setActiveSection, isOpen, onClose }) {
  const { tripData, tripPlan } = useContext(TripContext);

  const menuItems = [
    { id: "dashboard", icon: <FaHome />, label: "Dashboard" },
    { id: "overview", icon: <FaRobot />, label: "AI Overview" },
    { id: "itinerary", icon: <FaMapMarkedAlt />, label: "Itinerary" },
    { id: "hotels", icon: <FaHotel />, label: "Hotels" },
    { id: "restaurants", icon: <FaUtensils />, label: "Restaurants" },
    { id: "currency", icon: <FaMoneyBillWave />, label: "Currency Converter" },
    { id: "festivals", icon: <FaCalendarAlt />, label: "Local Festivals" },
    { id: "photos", icon: <FaCamera />, label: "Best Photo Spots" },
    { id: "budget", icon: <FaWallet />, label: "Budget" },
    { id: "packing", icon: <FaSuitcase />, label: "Packing" },
    { id: "emergency", icon: <FaMapMarkerAlt />, label: "Emergency" },
  ];

  const handleDownload = () => {
    if (!tripPlan) {
      alert("Please generate a travel plan first!");
      return;
    }

    let md = "";
    md += `# ✈️ VoyageAI Travel Plan: ${tripData.destination || "Destination"}\n\n`;
    
    md += `## 📋 Trip Metadata\n`;
    md += `- **Destination**: ${tripData.destination}\n`;
    md += `- **Duration**: ${tripData.days} Days\n`;
    md += `- **Budget Limit**: ₹${tripData.budget}\n`;
    md += `- **Travel Style**: ${tripData.travelStyle}\n`;
    md += `- **Experience Preference**: ${tripData.experience}\n\n`;

    md += `## 🌍 Trip Overview\n${tripPlan.overview || ""}\n\n`;

    md += `## 🌤️ Best Time to Visit\n${tripPlan.bestTimeToVisit || ""}\n\n`;

    md += `## 📅 Day-Wise Itinerary\n`;
    if (Array.isArray(tripPlan.itinerary)) {
      tripPlan.itinerary.forEach((d) => {
        md += `### Day ${d.day}: ${d.theme || "Daily Plan"}\n`;
        md += `- **🌅 Morning**: ${d.morning || "N/A"}\n`;
        md += `- **☀️ Afternoon**: ${d.afternoon || "N/A"}\n`;
        md += `- **🌙 Evening**: ${d.evening || "N/A"}\n\n`;
      });
    }

    md += `## 🏨 Recommended Hotels\n`;
    if (Array.isArray(tripPlan.hotels)) {
      tripPlan.hotels.forEach((h) => {
        md += `- **${h.name}** (${h.area}) - *${h.price}*\n  *Reason*: ${h.reason}\n`;
      });
    }
    md += `\n`;

    md += `## 🍽️ Best Restaurants\n`;
    if (Array.isArray(tripPlan.restaurants)) {
      tripPlan.restaurants.forEach((r) => {
        md += `- **${r.name}** (${r.area}) - *${r.cost} for two*\n  *Cuisine*: ${r.cuisine}\n`;
      });
    }
    md += `\n`;

    md += `## 🎉 Local Festivals\n`;
    if (Array.isArray(tripPlan.festivals)) {
      tripPlan.festivals.forEach((f) => {
        md += `- **${f.name}** (${f.date}): ${f.description}\n`;
      });
    }
    md += `\n`;

    md += `## 📸 Best Photo Spots\n`;
    if (Array.isArray(tripPlan.photoSpots)) {
      tripPlan.photoSpots.forEach((p) => {
        md += `- **${p.name}** (Best Time: ${p.bestTime}): ${p.tip}\n`;
      });
    }
    md += `\n`;

    md += `## 🎒 Packing Checklist\n`;
    if (tripPlan.packingInstructions) {
      md += `*AI Advice*: ${tripPlan.packingInstructions}\n\n`;
    }
    if (Array.isArray(tripPlan.packingList)) {
      tripPlan.packingList.forEach((item) => {
        const name = typeof item === "object" ? item.item : item;
        const cat = typeof item === "object" ? ` [${item.category}]` : "";
        md += `- [ ] ${name}${cat}\n`;
      });
    }
    md += `\n`;

    md += `## 🛡️ Safety & Helplines\n`;
    if (tripPlan.emergencyContacts) {
      md += `- **Police**: ${tripPlan.emergencyContacts.police}\n`;
      md += `- **Ambulance**: ${tripPlan.emergencyContacts.ambulance}\n`;
      md += `- **Fire**: ${tripPlan.emergencyContacts.fire}\n`;
      if (tripPlan.emergencyContacts.tourist) {
        md += `- **Tourist Support**: ${tripPlan.emergencyContacts.tourist}\n`;
      }
      md += `- **Safety Note**: ${tripPlan.emergencyContacts.localHelpline}\n`;
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tripData.destination.replace(/\s+/g, "_").toLowerCase()}_voyage_plan.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`
        fixed md:relative
        left-0 top-0
        w-[85vw] max-w-[280px] md:w-72
        h-screen
        bg-gradient-to-b
        from-blue-700
        to-blue-900
        text-white
        p-6
        shadow-2xl
        flex
        flex-col
        justify-between
        z-50
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">✈ VoyageAI</h1>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden rounded-full bg-white/15 px-3 py-1 text-lg"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <ul className="space-y-1.5 max-h-[80vh] overflow-y-auto pr-1">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                onClose();
              }}
              className={`flex items-center gap-4 p-2.5 rounded-xl cursor-pointer transition-all duration-300
              ${
                activeSection === item.id
                  ? "bg-white text-blue-700 shadow-lg font-semibold"
                  : "hover:bg-blue-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 space-y-3">
        <ChatBot />

        {tripPlan && (
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-emerald-500 animate-bounce"
          >
            <FaDownload /> Download Travel Plan
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;