import { createContext, useState, useEffect } from "react";

export const TripContext = createContext();

export function TripProvider({ children }) {
  const [tripData, setTripData] = useState(() => {
    const saved = localStorage.getItem("tripData");

    return saved
      ? JSON.parse(saved)
      : {
          destination: "",
          budget: "",
          days: "",
          travelStyle: "",
          experience: "",
          itinerary: "",
          weather: null,
          hotels: [],
          restaurants: [],
        };
  });

  const [tripPlan, setTripPlan] = useState(() => {
    const saved = localStorage.getItem("tripPlan");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("tripData", JSON.stringify(tripData));
  }, [tripData]);

  useEffect(() => {
    localStorage.setItem("tripPlan", JSON.stringify(tripPlan));
  }, [tripPlan]);

  return (
    <TripContext.Provider
      value={{ tripData, setTripData, tripPlan, setTripPlan }}
    >
      {children}
    </TripContext.Provider>
  );
}