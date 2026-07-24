import { useContext } from "react";
import { TripContext } from "../context/TripContext";
import WeatherCard from "../components/WeatherCard";
import MapCard from "../components/MapCard";
import { FaCalendarAlt, FaWallet, FaCompass, FaUsers, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

function DashboardHome({ tripData }) {
  const { tripPlan } = useContext(TripContext);

  const destName = tripData.destination || "your destination";
  
  // Extract info if structured plan is available
  const hotelsCount = tripPlan?.hotels?.length || 0;
  const currencyCode = tripPlan?.currencyCode || "INR";
  const policeNum = tripPlan?.emergencyContacts?.police || "112";
  const bestSeason = tripPlan?.bestTimeToVisit || "Not resolved";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Hero Welcome Banner */}
      <div className="relative h-64 md:h-72 w-full rounded-3xl overflow-hidden shadow-xl group">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"
          alt="Travel Hero"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
          <div className="space-y-2">
            <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500">
              Personalized Trip Board
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              Explore {destName}
            </h1>
            <p className="text-gray-200 text-sm md:text-base font-medium max-w-xl drop-shadow-sm">
              Your customized itinerary is ready. Browse sections in the sidebar to review weather, conversions, local events, and travel spots.
            </p>
          </div>
        </div>
      </div>

      {/* Metadata Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-xl text-lg"><FaCalendarAlt /></span>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Duration</div>
            <div className="text-sm font-extrabold text-gray-700">{tripData.days} Days</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
          <span className="p-3 bg-green-50 text-green-600 rounded-xl text-lg"><FaWallet /></span>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Budget</div>
            <div className="text-sm font-extrabold text-gray-700">₹{tripData.budget}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
          <span className="p-3 bg-purple-50 text-purple-600 rounded-xl text-lg"><FaUsers /></span>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Travel Style</div>
            <div className="text-sm font-extrabold text-gray-700 capitalize">{tripData.travelStyle || "General"}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
          <span className="p-3 bg-orange-50 text-orange-600 rounded-xl text-lg"><FaCompass /></span>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Experience</div>
            <div className="text-sm font-extrabold text-gray-700 capitalize">{tripData.experience || "Adventure"}</div>
          </div>
        </div>
      </div>

      {/* Added Info Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider border-b border-gray-50 pb-2">
            🌤️ Best Season Peak
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            {bestSeason}
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider border-b border-gray-50 pb-2">
            💱 Local Exchange
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Destination Currency Code</span>
            <span className="bg-green-100 text-green-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              {currencyCode}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider border-b border-gray-50 pb-2">
            🛡️ Local Safety
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center gap-1"><FaShieldAlt className="text-red-500" /> Police Contact</span>
            <span className="text-sm font-extrabold text-red-600">
              {policeNum}
            </span>
          </div>
        </div>
      </div>

      {/* Weather + Map Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherCard city={tripData.destination} days={tripData.days} />
        <MapCard />
      </div>
    </div>
  );
}

export default DashboardHome;