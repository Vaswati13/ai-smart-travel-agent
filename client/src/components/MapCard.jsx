import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import { TripContext } from "../context/TripContext";
import "leaflet/dist/leaflet.css";

function MapCard() {
  const { tripData } = useContext(TripContext);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!tripData.destination) return;

    async function fetchLocation() {
      const res = await fetch(
        `http://localhost:3000/location/${tripData.destination}`
      );

      const data = await res.json();

      setLocation(data);
    }

    fetchLocation();
  }, [tripData.destination]);

  if (location === null) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          🗺️ Destination Map
        </h2>
        <div className="p-8 bg-gray-50 rounded-xl text-center text-sm font-semibold text-gray-500 animate-pulse border border-gray-100">
          Loading Map...
        </div>
      </div>
    );
  }

  const latVal = parseFloat(location?.lat);
  const lonVal = parseFloat(location?.lon);

  if (isNaN(latVal) || isNaN(lonVal)) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          🗺️ Destination Map
        </h2>
        <div className="p-8 bg-gray-50 rounded-xl text-center text-sm font-semibold text-gray-500 border border-gray-100">
          🗺️ Map coordinates unavailable for "{tripData.destination}"
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        🗺️ Destination Map
      </h2>

      <MapContainer
        center={[latVal, lonVal]}
        zoom={13}
        style={{ height: "400px", width: "100%", borderRadius: "15px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latVal, lonVal]}>
          <Popup>{tripData.destination}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapCard;