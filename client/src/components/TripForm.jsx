import { useState, useContext } from "react";
import { TripContext } from "../context/TripContext";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaMapMarkerAlt, FaWallet, FaCalendarAlt, FaCompass, FaUsers } from "react-icons/fa";

function TripForm() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [experience, setExperience] = useState("");

  const { setTripData } = useContext(TripContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !budget || !days) {
      alert("Please fill in destination, budget, and trip duration.");
      return;
    }
    
    setTripData({
      destination,
      budget,
      days,
      travelStyle: travelStyle || "General",
      experience: experience || "Adventure",
    });

    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-950/40 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] rounded-3xl p-6 md:p-8 transition-all duration-500">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-6 tracking-wide drop-shadow-md">
        Plan Your Voyage
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Destination */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-400">
            <FaMapMarkerAlt />
          </span>
          <input
            type="text"
            placeholder="Where to?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-black/25 text-white placeholder-white/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Budget & Days Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-400">
              <FaWallet />
            </span>
            <input
              type="number"
              placeholder="Budget (₹)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-black/25 text-white placeholder-white/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-400">
              <FaCalendarAlt />
            </span>
            <input
              type="number"
              placeholder="Days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full bg-black/25 text-white placeholder-white/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Style & Experience Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-400">
              <FaUsers />
            </span>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full bg-black/40 text-white border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="" className="bg-slate-900 text-gray-400">Travel Style</option>
              <option value="Solo" className="bg-slate-900 text-white">Solo</option>
              <option value="Family" className="bg-slate-900 text-white">Family</option>
              <option value="Friends" className="bg-slate-900 text-white">Friends</option>
              <option value="Couple" className="bg-slate-900 text-white">Couple</option>
            </select>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-400">
              <FaCompass />
            </span>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-black/40 text-white border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="" className="bg-slate-900 text-gray-400">Experience</option>
              <option value="Luxury" className="bg-slate-900 text-white">Luxury</option>
              <option value="Adventure" className="bg-slate-900 text-white">Adventure</option>
              <option value="Nature" className="bg-slate-900 text-white">Nature</option>
              <option value="Spiritual" className="bg-slate-900 text-white">Spiritual</option>
              <option value="Food Tour" className="bg-slate-900 text-white">Food Tour</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer border border-blue-500/20"
        >
          <FaPlane className="animate-pulse" /> Create Itinerary
        </button>
      </form>
    </div>
  );
}

export default TripForm;