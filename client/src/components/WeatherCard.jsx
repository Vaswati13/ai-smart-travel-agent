import { useEffect, useState } from "react";
import { FaCloudSun, FaWind, FaTint } from "react-icons/fa";

const getWeatherEmoji = (status) => {
  switch (status) {
    case "Clear": return "☀️";
    case "Clouds": return "☁️";
    case "Rain": return "🌧️";
    case "Drizzle": return "🌦️";
    case "Thunderstorm": return "⛈️";
    case "Snow": return "❄️";
    case "Mist":
    case "Haze":
    case "Fog":
      return "🌫️";
    default: return "🌤️";
  }
};

const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

function WeatherCard({ city, days }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    setLoading(true);

    async function fetchWeatherData() {
      try {
        // Fetch current weather
        const currentRes = await fetch(`https://ai-smart-travel-agent-3.onrender.com/weather/${city}`);
        const currentData = await currentRes.json();
        if (currentRes.ok) {
          setWeather(currentData);
        }

        // Fetch forecast
        const forecastRes = await fetch(`https://ai-smart-travel-agent-3.onrender.com/weather-forecast/${city}`);
        const forecastData = await forecastRes.json();
        
        if (forecastRes.ok && forecastData && forecastData.list) {
          const daily = [];
          const seenDates = new Set();
          const tripDaysCount = parseInt(days) || 5;

          for (const item of forecastData.list) {
            const dateStr = item.dt_txt.split(" ")[0]; // YYYY-MM-DD
            
            const todayStr = new Date().toISOString().split("T")[0];
            if (dateStr === todayStr) continue;

            if (!seenDates.has(dateStr)) {
              seenDates.add(dateStr);
              daily.push(item);
            }
            if (daily.length >= tripDaysCount) break;
          }
          setForecast(daily);
        }
      } catch (err) {
        console.error("Failed to load weather data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, [city, days]);

  if (!city) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        Enter destination first.
      </div>
    );
  }

  if (loading || !weather) {
    return (
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-3xl p-6 shadow-lg flex items-center justify-center min-h-[220px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-3 text-sm font-medium">Gathering weather data...</p>
        </div>
      </div>
    );
  }

  // Handle case where API response has an error message
  if (weather.error) {
    return (
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-3xl p-6 shadow-lg flex items-center justify-center min-h-[220px]">
        <p className="text-sm font-semibold">Weather service temporarily unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-sky-300/20">
      
      {/* Current Weather Block */}
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaCloudSun /> Weather Forecast
          </h2>
          <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            Current
          </span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <h3 className="text-lg font-bold">📍 {weather.name}</h3>
            <p className="text-4xl font-extrabold mt-1">{Math.round(weather.main?.temp || 0)}°C</p>
            <p className="capitalize text-xs font-semibold mt-1 text-sky-100">
              {weather.weather?.[0]?.description || "clear sky"}
            </p>
          </div>
          <span className="text-5xl shrink-0">
            {getWeatherEmoji(weather.weather?.[0]?.main)}
          </span>
        </div>

        <div className="flex gap-4 mt-4 text-xs font-semibold text-sky-100">
          <p className="flex items-center gap-1"><FaTint /> Humidity: {weather.main?.humidity || 0}%</p>
          <p className="flex items-center gap-1"><FaWind /> Wind: {Math.round((weather.wind?.speed || 0) * 3.6)} km/h</p>
        </div>
      </div>

      {/* Upcoming Days Forecast Block */}
      {forecast.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/20">
          <h4 className="text-[10px] font-bold text-sky-100 uppercase tracking-widest mb-3">
            Upcoming Forecast
          </h4>
          <div className="grid grid-cols-5 gap-2 overflow-x-auto">
            {forecast.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center text-center shrink-0 min-w-[55px]"
              >
                <span className="text-[10px] font-bold text-sky-100">
                  {getDayName(item.dt_txt)}
                </span>
                <span className="text-xl my-1">
                  {getWeatherEmoji(item.weather?.[0]?.main)}
                </span>
                <span className="text-xs font-extrabold">
                  {Math.round(item.main?.temp || 0)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default WeatherCard;
