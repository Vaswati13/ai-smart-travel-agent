import { useContext, useState, useEffect } from "react";
import { TripContext } from "../context/TripContext";
import { FaHotel, FaMapMarkerAlt, FaLocationArrow, FaStar } from "react-icons/fa";

function HotelsSection() {
  const { tripPlan, tripData } = useContext(TripContext);
  
  // Geolocation States
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locError, setLocError] = useState(null);
  
  // Nearby Hotels State
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  // Request browser geolocation
  const requestLocation = () => {
    setLoadingLoc(true);
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      setLoadingLoc(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        setLoadingLoc(false);
      },
      (err) => {
        console.error("Location error:", err);
        setLocError("Permission denied or location lookup failed.");
        setLoadingLoc(false);
      }
    );
  };

  // Fetch nearby hotels
  useEffect(() => {
    if (!lat || !lon) return;

    async function fetchNearbyHotels() {
      setLoadingNearby(true);
      try {
        const res = await fetch(`http://localhost:3000/nearby-services?lat=${lat}&lon=${lon}&type=hotel`);
        const data = await res.json();
        setNearbyHotels(data);
      } catch (err) {
        console.error("Error fetching nearby hotels:", err);
      } finally {
        setLoadingNearby(false);
      }
    }

    fetchNearbyHotels();
  }, [lat, lon]);

  if (!tripPlan) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[350px] mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <h3 className="mt-6 text-xl font-bold text-gray-700 animate-pulse">
          Finding accommodation deals...
        </h3>
      </div>
    );
  }

  const aiHotels = tripPlan.hotels || [];

  return (
    <div className="mt-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-3xl font-extrabold flex items-center gap-3">
          🏨 Accommodation Planner
        </h2>
        <p className="mt-2 text-blue-100 text-sm">
          Browse custom AI-suggested stays for {tripData.destination || "your destination"} and find real nearby hotels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Recommendations Panel (Left/Mid) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
            🤖 AI Recommended Stays
          </h3>

          {aiHotels.length === 0 ? (
            <p className="text-gray-500 text-sm">No recommended hotels found for this trip.</p>
          ) : (
            <div className="space-y-4">
              {aiHotels.map((hotel, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-gray-800">{hotel.name}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                        AI Pick
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-blue-500 shrink-0" />
                      {hotel.area}
                    </p>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {hotel.reason}
                    </p>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end shrink-0 min-w-[120px]">
                    <span className="text-xl font-extrabold text-blue-600">
                      {hotel.price}
                    </span>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + " " + hotel.area)}`, "_blank")}
                      className="mt-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Map View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nearby Hotels Panel (Right) */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md flex flex-col h-fit space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              📍 Live Nearby
            </h3>
            
            {lat && lon && (
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                Active
              </span>
            )}
          </div>

          {!lat || !lon ? (
            <div className="py-6 text-center space-y-4">
              <p className="text-gray-500 text-xs leading-relaxed">
                Allow access to your live coordinates to see real hotels around you.
              </p>
              <button
                onClick={requestLocation}
                disabled={loadingLoc}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                <FaLocationArrow className={loadingLoc ? "animate-pulse" : ""} />
                {loadingLoc ? "Locating..." : "Use Live Location"}
              </button>
              {locError && (
                <p className="text-red-500 text-[10px] font-semibold">{locError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {loadingNearby ? (
                <div className="py-8 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {nearbyHotels.length === 0 ? (
                    <p className="text-gray-500 text-xs text-center py-4">
                      No nearby hotels resolved within 3km.
                    </p>
                  ) : (
                    nearbyHotels.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-colors space-y-2"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-gray-800 text-xs leading-tight">{item.name}</h4>
                          <span className="flex items-center text-[10px] text-yellow-500 shrink-0 font-bold">
                            <FaStar className="mr-0.5" /> {item.stars || "3*"}
                          </span>
                        </div>
                        <p className="text-gray-500 text-[10px] truncate">
                          {item.address}
                        </p>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + item.address)}`, "_blank")}
                          className="w-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-1 rounded-lg text-[10px] transition-colors cursor-pointer"
                        >
                          Directions
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HotelsSection;
