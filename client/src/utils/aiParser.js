export function getSection(text, startTitle, endTitle) {
  if (!text) return "";

  const start = text.indexOf(startTitle);

  if (start === -1) return "";

  const end = endTitle ? text.indexOf(endTitle, start) : -1;

  if (end === -1) {
    return text.substring(start).trim();
  }

  return text.substring(start, end).trim();
}

export const getOverview = (text) =>
  getSection(text, "🌍 Trip Overview", "📅 Day Wise Itinerary");

export const getItinerary = (text) =>
  getSection(text, "📅 Day Wise Itinerary", "🏨 Recommended Hotels");

export const getHotels = (text) =>
  getSection(text, "🏨 Recommended Hotels", "🍽️ Best Restaurants");

export const getRestaurants = (text) =>
  getSection(text, "🍽️ Best Restaurants", "📸 Top Tourist Attractions");

export const getPhotos = (text) =>
  getSection(text, "📸 Top Tourist Attractions", "💰 Budget Breakdown");

export const getBudget = (text) =>
  getSection(text, "💰 Budget Breakdown", "🎒 Packing List");

export const getPacking = (text) =>
  getSection(text, "🎒 Packing List", "🛡️ Safety Tips");

export const getSafety = (text) =>
  getSection(text, "🛡️ Safety Tips", "🌤️ Best Time to Visit");

export const getBestTime = (text) =>
  getSection(text, "🌤️ Best Time to Visit");