import { createContext, useState } from "react";

export const TripContext = createContext();

export function TripProvider({ children }) {
  const [tripData, setTripData] = useState({
    destination: "",
    budget: "",
    days: "",
    travelStyle: "",
    experience: "",
    itinerary: "",
    weather: null,
    hotels: [],
    restaurants: [],
  });

  const [tripPlan, setTripPlan] = useState(null);

  return (
    <TripContext.Provider value={{ tripData, setTripData, tripPlan, setTripPlan }}>
      {children}
    </TripContext.Provider>
  );
}