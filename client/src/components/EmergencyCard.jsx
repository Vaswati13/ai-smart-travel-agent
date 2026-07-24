import { useContext, useState, useEffect } from "react";
import { TripContext } from "../context/TripContext";
import { FaPhoneAlt, FaHospital, FaShieldAlt, FaRestroom, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

function EmergencyCard() {
  const { tripPlan, tripData } = useContext(TripContext);
  
  // Geolocation States
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locError, setLocError] = useState(null);
  
  // Nearby Services States
  const [nearbyType, setNearbyType] = useState("hospital"); // hospital | police | toilets
  const [nearbyItems, setNearbyItems] = useState([]);
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

  // Fetch nearby services when coordinates or tab changes
  useEffect(() => {
    if (!lat || !lon) return;

    async function fetchNearby() {
      setLoadingNearby(true);
      try {
        const res = await fetch(`http://localhost:3000/nearby-services?lat=${lat}&lon=${lon}&type=${nearbyType}`);
        const data = await res.json();
        setNearbyItems(data);
      } catch (err) {
        console.error("Error fetching nearby services:", err);
      } finally {
        setLoadingNearby(false);
      }
    }

    fetchNearby();
  }, [lat, lon, nearbyType]);

  if (!tripPlan) {
    return (
      <div className="bg-red-50 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[220px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading emergency dashboard...</p>
      </div>
    );
  }

  const contacts = tripPlan.emergencyContacts || {
    police: "112",
    ambulance: "108",
    fire: "101",
    tourist: "1363",
    localHelpline: "Emergency center"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-8">
      
      {/* Helpline Numbers Panel */}
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-3xl p-6 md:p-8 shadow-md">
        <h2 className="text-3xl font-extrabold text-red-700 flex items-center gap-3">
          🚨 Emergency Contacts
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Local helplines compiled for your trip to <strong>{tripData.destination || "your destination"}</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4">
            <span className="text-2xl p-3 bg-red-50 rounded-xl text-red-600 shrink-0">🚓</span>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Police</div>
              <a href={`tel:${contacts.police}`} className="text-xl font-extrabold text-gray-800 hover:text-red-600 transition-colors">
                {contacts.police}
              </a>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4">
            <span className="text-2xl p-3 bg-red-50 rounded-xl text-red-600 shrink-0">🚑</span>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ambulance</div>
              <a href={`tel:${contacts.ambulance}`} className="text-xl font-extrabold text-gray-800 hover:text-red-600 transition-colors">
                {contacts.ambulance}
              </a>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4">
            <span className="text-2xl p-3 bg-red-50 rounded-xl text-red-600 shrink-0">🚒</span>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fire Department</div>
              <a href={`tel:${contacts.fire}`} className="text-xl font-extrabold text-gray-800 hover:text-red-600 transition-colors">
                {contacts.fire}
              </a>
            </div>
          </div>

          {contacts.tourist && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4">
              <span className="text-2xl p-3 bg-red-50 rounded-xl text-red-600 shrink-0">🧳</span>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tourist Helpline</div>
                <a href={`tel:${contacts.tourist}`} className="text-xl font-extrabold text-gray-800 hover:text-red-600 transition-colors">
                  {contacts.tourist}
                </a>
              </div>
            </div>
          )}

          {contacts.localHelpline && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4 md:col-span-2 lg:col-span-2">
              <span className="text-2xl p-3 bg-red-50 rounded-xl text-red-600 shrink-0">ℹ️</span>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Local Support Note</div>
                <p className="text-xs text-gray-700 font-semibold mt-1">
                  {contacts.localHelpline}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Geolocation Nearby Services Panel */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              📍 Live Nearby Services
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              Find emergency points based on your current physical location.
            </p>
          </div>

          {!lat || !lon ? (
            <button
              onClick={requestLocation}
              disabled={loadingLoc}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FaLocationArrow className={loadingLoc ? "animate-pulse" : ""} />
              {loadingLoc ? "Locating..." : "Locate Nearby Services"}
            </button>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
              🟢 Location Active ({lat.toFixed(4)}, {lon.toFixed(4)})
            </span>
          )}
        </div>

        {locError && (
          <div className="p-4 bg-red-50 text-red-800 rounded-2xl text-xs font-semibold border border-red-100">
            ⚠️ {locError}
          </div>
        )}

        {lat && lon && (
          <div className="space-y-6">
            {/* Tab Selector */}
            <div className="flex gap-2 border-b border-gray-100 pb-2">
              <button
                onClick={() => setNearbyType("hospital")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer
                ${nearbyType === "hospital" ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <FaHospital /> Hospitals
              </button>
              <button
                onClick={() => setNearbyType("police")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer
                ${nearbyType === "police" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <FaShieldAlt /> Police Stations
              </button>
              <button
                onClick={() => setNearbyType("toilets")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer
                ${nearbyType === "toilets" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <FaRestroom /> Restrooms
              </button>
            </div>

            {/* List Results */}
            {loadingNearby ? (
              <div className="py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyItems.length === 0 ? (
                  <div className="py-6 text-center text-gray-500 text-sm md:col-span-2">
                    No results found in a 3km radius.
                  </div>
                ) : (
                  nearbyItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-150"
                    >
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-gray-500 text-[11px] mt-1 flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-red-500 shrink-0" />
                          {item.address}
                        </p>
                      </div>

                      <button
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + item.address)}`, "_blank")}
                        className="mt-4 w-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Get Directions
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
  );
}

export default EmergencyCard;