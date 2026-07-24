import { useContext, useState, useEffect } from "react";
import { TripContext } from "../context/TripContext";
import { FaUtensils, FaMapMarkerAlt, FaLocationArrow, FaDollarSign } from "react-icons/fa";

function RestaurantsSection() {
  const { tripPlan, tripData } = useContext(TripContext);
  
  // Geolocation States
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locError, setLocError] = useState(null);
  
  // Nearby Restaurants State
  const [nearbyRest, setNearbyRest] = useState([]);
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

  // Fetch nearby restaurants
  useEffect(() => {
    if (!lat || !lon) return;

    async function fetchNearbyRest() {
      setLoadingNearby(true);
      try {
        const res = await fetch(`http://localhost:3000/nearby-services?lat=${lat}&lon=${lon}&type=restaurant`);
        const data = await res.json();
        setNearbyRest(data);
      } catch (err) {
        console.error("Error fetching nearby restaurants:", err);
      } finally {
        setLoadingNearby(false);
      }
    }

    fetchNearbyRest();
  }, [lat, lon]);

  if (!tripPlan) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[350px] mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <h3 className="mt-6 text-xl font-bold text-gray-700 animate-pulse">
          Finding culinary hotspots...
        </h3>
      </div>
    );
  }

  const aiRest = tripPlan.restaurants || [];

  return (
    <div className="mt-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-3xl font-extrabold flex items-center gap-3">
          🍽️ Culinary Recommendations
        </h2>
        <p className="mt-2 text-orange-100 text-sm">
          Discover customized AI-curated dining and search for live nearby restaurants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Recommendations Panel (Left/Mid) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
            🤖 AI Recommended Restaurants
          </h3>

          {aiRest.length === 0 ? (
            <p className="text-gray-500 text-sm">No recommended restaurants found for this trip.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiRest.map((rest, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-bold text-gray-800 text-base leading-snug">{rest.name}</h4>
                      <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        {rest.cuisine}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <FaMapMarkerAlt className="text-orange-500 shrink-0" />
                      {rest.area}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-sm font-extrabold text-orange-600">
                      Cost: {rest.cost}
                    </span>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rest.name + " " + rest.area)}`, "_blank")}
                      className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nearby Restaurants Panel (Right) */}
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
                Allow access to your live coordinates to see real restaurants around you.
              </p>
              <button
                onClick={requestLocation}
                disabled={loadingLoc}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-xs disabled:opacity-50 transition-colors cursor-pointer"
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {nearbyRest.length === 0 ? (
                    <p className="text-gray-500 text-xs text-center py-4">
                      No nearby restaurants resolved within 3km.
                    </p>
                  ) : (
                    nearbyRest.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-colors space-y-1.5"
                      >
                        <h4 className="font-bold text-gray-800 text-xs leading-tight">{item.name}</h4>
                        {item.cuisine && (
                          <span className="inline-block bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {item.cuisine}
                          </span>
                        )}
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

export default RestaurantsSection;
