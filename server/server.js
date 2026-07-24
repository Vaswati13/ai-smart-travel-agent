import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {GoogleGenerativeAI} from "@google/generative-ai";
import axios from "axios";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: "./server/.env",
});dotenv.config();
console.log(process.env.OPENWEATHER_API_KEY);
console.log(process.env.GEMINI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

const apiKey = (process.env.GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(apiKey);

// Prefer the currently stable Gemini model first. The free-tier quota for gemini-3.5-flash can exhaust quickly,
// so the server should try the 3.6 model first and only fall back to older variants when needed.
const primaryModelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const fallbackModels = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];

async function generateContentWithFallback(prompt) {
  const modelsToTry = [...new Set([primaryModelName, ...fallbackModels.filter((m) => m !== primaryModelName)])];

  let lastError;
  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting content generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        console.log(`Successfully generated content using: ${modelName}`);
        return text;
      }
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;

      // If the API is quota-limited on a specific model, keep moving rather than retrying the same exhausted model again.
      if (error?.message?.includes("429") || error?.message?.includes("quota")) {
        continue;
      }
    }
  }
  throw lastError || new Error("All generative models failed");
}

let cachedRates = null;
let lastFetchTime = 0;
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours cache

async function getInrRates() {
  const now = Date.now();
  if (cachedRates && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedRates;
  }
  try {
    const response = await axios.get("https://open.er-api.com/v6/latest/INR");
    if (response.data && response.data.rates) {
      cachedRates = response.data;
      lastFetchTime = now;
      return cachedRates;
    }
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error.message);
    if (cachedRates) return cachedRates; // Fallback to stale cache
  }
  return { rates: { INR: 1 } }; // Default fallback
}

async function getCurrencyCode(destination) {
  try {
    const prompt = `What is the ISO 4217 currency code of the country/place: "${destination}"? Respond with ONLY the 3-letter currency code (e.g., USD, EUR, INR, GBP, JPY, CAD, AUD). If the currency is Indian Rupee, respond with INR. Do not include any punctuation, formatting, or explanation.`;
    const result = await generateContentWithFallback(prompt);
    const cleanCode = result.trim().toUpperCase().substring(0, 3);
    if (/^[A-Z]{3}$/.test(cleanCode)) {
      return cleanCode;
    }
  } catch (e) {
    console.error("Failed to resolve currency code via Gemini:", e.message);
  }
  return "INR"; // Default fallback
}

app.get("/currency-info", async (req, res) => {
  try {
    const destination = req.query.destination;
    if (!destination) {
      return res.status(400).json({ error: "Destination parameter is required" });
    }
    const code = await getCurrencyCode(destination);
    const ratesData = await getInrRates();
    const rate = ratesData.rates[code] || 1;

    res.json({
      currencyCode: code,
      rate: rate,
      rates: ratesData.rates,
      success: true
    });
  } catch (error) {
    console.error("Currency Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/currency/:code", async (req, res) => {
  try {
    const ratesData = await getInrRates();
    res.json(ratesData);
  } catch (error) {
    console.error("Currency Code Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function getLocalFestivals(destination) {
  try {
    const prompt = `Identify 4 major local festivals or cultural events celebrated in: "${destination}".
Return a JSON array of objects. Each object MUST have:
1. "name": The name of the festival with a relevant emoji prefix (e.g. "🌸 Cherry Blossom Festival").
2. "date": The typical date or month of celebration (e.g. "Late March to April").
3. "description": A brief 1-line description of its significance.

Return ONLY the raw JSON array. Do not include markdown code block formatting like \`\`\`json or \`\`\`. Just return the raw JSON text.`;

    const result = await generateContentWithFallback(prompt);
    
    // Clean up response just in case markdown block formatting was returned
    let cleanText = result.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    
    const festivals = JSON.parse(cleanText);
    if (Array.isArray(festivals)) {
      return festivals;
    }
  } catch (e) {
    console.error("Failed to resolve festivals via Gemini:", e.message);
  }
  // Safe static fallback
  return [
    { name: "🎉 Local Cultural Event", date: "Year-round", description: "Local cultural celebration showcasing regional traditions." },
    { name: "🎉 Seasonal Celebration", date: "Seasonal", description: "Traditional event marking seasonal changes or local heritage." }
  ];
}

app.get("/festivals", async (req, res) => {
  try {
    const destination = req.query.destination;
    if (!destination) {
      return res.status(400).json({ error: "Destination parameter is required" });
    }
    const data = await getLocalFestivals(destination);
    res.json(data);
  } catch (error) {
    console.error("Festivals Route Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function getPhotoSpots(destination) {
  try {
    const prompt = `Identify 4 best photography spots in: "${destination}".
Return a JSON array of objects. Each object MUST have:
1. "name": The name of the spot with a relevant emoji prefix (e.g. "🌅 Shibuya Crossing").
2. "bestTime": The best time of day or conditions for photography (e.g. "Dusk / Blue Hour").
3. "tip": A useful photography tip or advice for getting the best shot at this location (e.g. "Head to the second floor of the Starbucks for an elevated view").

Return ONLY the raw JSON array. Do not include markdown code block formatting like \`\`\`json or \`\`\`. Just return the raw JSON text.`;

    const result = await generateContentWithFallback(prompt);
    
    // Clean up response just in case markdown block formatting was returned
    let cleanText = result.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    
    const spots = JSON.parse(cleanText);
    if (Array.isArray(spots)) {
      return spots;
    }
  } catch (e) {
    console.error("Failed to resolve photo spots via Gemini:", e.message);
  }
  // Safe static fallback
  return [
    { name: "📸 Panoramic Viewpoint", bestTime: "Golden Hour", tip: "Use a tripod to capture the sunset gradients." },
    { name: "📸 Historic Quarter", bestTime: "Morning", tip: "Explore early before the streets get crowded." }
  ];
}

app.get("/photo-spots", async (req, res) => {
  try {
    const destination = req.query.destination;
    if (!destination) {
      return res.status(400).json({ error: "Destination parameter is required" });
    }
    const data = await getPhotoSpots(destination);
    res.json(data);
  } catch (error) {
    console.error("Photo Spots Route Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function getItineraryData(destination, budget, days, travelStyle, experience) {
  try {
    const prompt = `Create a detailed day-wise itinerary for a ${days}-day trip to ${destination} with a budget of ₹${budget}.
Travel Style: ${travelStyle}
Experience: ${experience}

Return the response as a JSON array of objects, one for each day. Each object MUST have the following structure:
{
  "day": number,
  "theme": "Short theme/title for the day",
  "morning": "Morning activity details",
  "afternoon": "Afternoon activity details",
  "evening": "Evening activity details"
}

Return ONLY the raw JSON array. Do not include markdown code block formatting like \`\`\`json or \`\`\`. Just return the raw JSON text.`;

    const result = await generateContentWithFallback(prompt);
    
    let cleanText = result.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    
    const itinerary = JSON.parse(cleanText);
    if (Array.isArray(itinerary)) {
      return itinerary;
    }
  } catch (e) {
    console.error("Failed to generate structured itinerary via Gemini:", e.message);
  }
  
  // Safe fallback
  const fallback = [];
  for (let i = 1; i <= days; i++) {
    fallback.push({
      day: i,
      theme: `Exploring ${destination} - Day ${i}`,
      morning: "Start your morning by visiting iconic local landmarks and enjoying regional breakfast specialties.",
      afternoon: "Spend the afternoon exploring local markets, museums, and historical streets.",
      evening: "Relax in the evening at a local cafe or viewpoint to watch the sunset, followed by a local dinner."
    });
  }
  return fallback;
}

app.post("/itinerary", async (req, res) => {
  try {
    const {
      destination,
      budget,
      days,
      travelStyle,
      experience,
    } = req.body;

    if (!destination || !days) {
      return res.status(400).json({ error: "Destination and days parameters are required" });
    }

    const data = await getItineraryData(destination, budget, days, travelStyle, experience);
    res.json(data);
  } catch (error) {
    console.error("Itinerary Route Error:", error);
    res.status(500).json({ error: error.message });
  }
});

function formatTripPlanToMarkdown(plan) {
  let md = "";
  
  // Overview
  md += `# 🌍 Trip Overview\n\n${plan.overview || ""}\n\n`;
  
  // Itinerary
  md += `# 📅 Day Wise Itinerary\n\n`;
  if (Array.isArray(plan.itinerary)) {
    plan.itinerary.forEach((d) => {
      md += `## Day ${d.day}: ${d.theme || ""}\n`;
      md += `### Morning\n- ${d.morning || ""}\n\n`;
      md += `### Afternoon\n- ${d.afternoon || ""}\n\n`;
      md += `### Evening\n- ${d.evening || ""}\n\n`;
    });
  }
  
  // Hotels
  md += `# 🏨 Recommended Hotels\n\n`;
  md += `| Hotel | Price | Area | Why Recommended |\n`;
  md += `|-------|-------|------|-----------------|\n`;
  if (Array.isArray(plan.hotels)) {
    plan.hotels.forEach((h) => {
      md += `| ${h.name || ""} | ${h.price || ""} | ${h.area || ""} | ${h.reason || ""} |\n`;
    });
  }
  md += `\n`;
  
  // Restaurants
  md += `# 🍽️ Best Restaurants\n\n`;
  md += `| Restaurant | Cuisine | Cost for Two | Area |\n`;
  md += `|------------|----------|--------------|------|\n`;
  if (Array.isArray(plan.restaurants)) {
    plan.restaurants.forEach((r) => {
      md += `| ${r.name || ""} | ${r.cuisine || ""} | ${r.cost || ""} | ${r.area || ""} |\n`;
    });
  }
  md += `\n`;
  
  // Attractions
  md += `# 📸 Top Tourist Attractions\n\n`;
  if (Array.isArray(plan.attractions)) {
    plan.attractions.forEach((a) => {
      md += `- **${a.name || ""}**: ${a.description || ""}\n`;
    });
  }
  md += `\n`;
  
  // Budget Breakdown
  md += `# 💰 Budget Breakdown\n\n`;
  md += `| Category | Cost |\n`;
  md += `|----------|------|\n`;
  if (plan.budgetBreakdown) {
    Object.entries(plan.budgetBreakdown).forEach(([cat, val]) => {
      md += `| ${cat.charAt(0).toUpperCase() + cat.slice(1)} | ${val} |\n`;
    });
  }
  md += `\n`;
  
  // Packing List
  md += `# 🎒 Packing List\n\n`;
  if (plan.packingInstructions) {
    md += `${plan.packingInstructions}\n\n`;
  }
  if (Array.isArray(plan.packingList)) {
    plan.packingList.forEach((item) => {
      const itemName = typeof item === "object" ? item.item : item;
      const cat = typeof item === "object" && item.category ? ` (${item.category})` : "";
      md += `- ${itemName}${cat}\n`;
    });
  }
  md += `\n`;
  
  // Safety Tips
  md += `# 🛡️ Safety Tips\n\n`;
  if (Array.isArray(plan.safetyTips)) {
    plan.safetyTips.forEach((tip) => {
      md += `- ${tip}\n`;
    });
  }
  md += `\n`;
  
  // Best Time to Visit
  md += `# 🌤️ Best Time to Visit\n\n${plan.bestTimeToVisit || ""}\n`;
  
  return md;
}

app.post("/plan-trip", async (req, res) => {
  try {
    const {
      destination,
      budget,
      days,
      travelStyle,
      experience,
    } = req.body;

    const prompt = `You are an expert AI Travel Planner.

Create a complete travel plan for a ${days}-day trip to ${destination} with a budget of ₹${budget}.
Travel Style: ${travelStyle}
Experience: ${experience}

You must return the response as a single valid JSON object. Do not wrap the JSON in markdown code blocks, do not write explanations. Just return the raw JSON text.

The JSON object MUST have the following structure:
{
  "overview": "A rich markdown overview of the trip including highlights.",
  "currencyCode": "3-letter ISO currency code of the destination",
  "packingInstructions": "A 2-3 sentence guide on what type of clothes, layers, and essential gear to pack for the weather/destination.",
  "packingList": [
    { "item": "Light Jacket", "category": "Clothing" },
    { "item": "Power Bank", "category": "Electronics" },
    { "item": "Passport", "category": "Essentials" }
  ],
  "emergencyContacts": {
    "police": "Police emergency number in this location",
    "ambulance": "Ambulance emergency number in this location",
    "fire": "Fire department emergency number in this location",
    "tourist": "Tourist helpline or safety assistance number in this location",
    "localHelpline": "A helpful safety or travel support note for visitors"
  },
  "itinerary": [
    {
      "day": number,
      "theme": "Theme/Title for Day",
      "morning": "Morning activity details",
      "afternoon": "Afternoon activity details",
      "evening": "Evening activity details"
    }
  ],
  "festivals": [
    {
      "name": "🎉 Festival Name",
      "date": "Typical Date/Month range",
      "description": "Short description of significance",
      "imageUrl": "Unsplash image URL for this festival (use a real high-quality Unsplash image URL with a valid photo ID, e.g. 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=600' or similar)",
      "videoQuery": "Search query for YouTube to find festival videos (e.g. 'Oktoberfest Munich Parade')"
    }
  ],
  "photoSpots": [
    {
      "name": "📸 Spot Name",
      "bestTime": "Best photography time (e.g. Sunrise, Golden Hour)",
      "tip": "Composition/framing tip",
      "imageUrl": "Unsplash image URL for this spot (use a real high-quality Unsplash image URL with a valid photo ID, e.g. 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' or similar)",
      "videoQuery": "Search query for YouTube to find videos of this spot (e.g. 'Shibuya Crossing Tokyo POV')"
    }
  ],
  "hotels": [
    {
      "name": "Hotel Name",
      "area": "Area/Location",
      "price": "Approx price/night in INR",
      "reason": "Why recommended"
    }
  ],
  "restaurants": [
    {
      "name": "Restaurant Name",
      "cuisine": "Cuisine style",
      "cost": "Approx cost for two in INR",
      "area": "Area/Location"
    }
  ],
  "attractions": [
    {
      "name": "Attraction Name",
      "description": "Short one-line description"
    }
  ],
  "budgetBreakdown": {
    "accommodation": "Estimated cost in INR for accommodation",
    "food": "Estimated cost in INR for food",
    "transport": "Estimated cost in INR for transport",
    "activities": "Estimated cost in INR for activities",
    "shopping": "Estimated cost in INR for shopping"
  },
  "safetyTips": [
    "Safety tip 1",
    "Safety tip 2"
  ],
  "bestTimeToVisit": "Best month/season to visit with brief reason."
}
`;

    const result = await generateContentWithFallback(prompt);
    
    let planData;
    try {
      let cleanText = result.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }
      planData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", parseError.message);
      planData = {
        overview: "AI travel plan compilation completed, but structured format could not be verified.",
        currencyCode: "INR",
        packingInstructions: "Pack according to general regional weather.",
        packingList: [{ item: "Passport", category: "Essentials" }, { item: "Clothes", category: "Clothing" }],
        emergencyContacts: { police: "112", ambulance: "108", fire: "101", tourist: "1363", localHelpline: "Emergency center" },
        itinerary: [],
        festivals: [],
        photoSpots: [],
        hotels: [],
        restaurants: [],
        attractions: [],
        budgetBreakdown: { accommodation: budget, food: "0", transport: "0", activities: "0", shopping: "0" },
        safetyTips: ["Stay safe"],
        bestTimeToVisit: "Year-round"
      };
    }

    // Resolve and inject currency rate relative to INR
    const ratesData = await getInrRates();
    const resolvedCode = planData.currencyCode || "INR";
    const rate = ratesData.rates[resolvedCode] || 1;
    planData.currencyRate = rate;

    // Compile markdown for overview and backwards compatibility
    const markdownText = formatTripPlanToMarkdown(planData);

    res.json({
      result: markdownText,
      structured: planData
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/assistant-chat", async (req, res) => {
  try {
    const { message, tripData = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A text message is required" });
    }

    const destination = tripData.destination || "your destination";
    const budget = tripData.budget || "your budget";
    const days = tripData.days || "your trip duration";

    const prompt = `You are VoyageAI, a friendly travel assistant.

Context:
- Destination: ${destination}
- Budget: ${budget}
- Trip length: ${days}
- Travel style: ${tripData.travelStyle || "General"}
- Experience preference: ${tripData.experience || "Flexible"}

User request: ${message}

Respond helpfully in a concise, practical way. If the user is asking for translation, provide a direct translation or useful phrase in the local language with a short English meaning. If they are asking for travel tips, give a short answer tailored to the destination and travel style. Do not use markdown headings. Keep the answer short and conversational.
`;

    const result = await generateContentWithFallback(prompt);
    res.json({ message: result.trim() });
  } catch (error) {
    console.error("Assistant chat error:", error);
    res.status(500).json({
      message: "I’m having trouble answering right now. Try rephrasing your question or check the destination details.",
    });
  }
});

app.get("/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

app.get("/weather-forecast/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Forecast Error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

app.get("/nearby-services", async (req, res) => {
  try {
    const { lat, lon, type } = req.query;
    if (!lat || !lon || !type) {
      return res.status(400).json({ error: "lat, lon, and type parameters are required" });
    }

    let osmType = "";
    if (type === "hospital") {
      osmType = 'node["amenity"="hospital"]';
    } else if (type === "police") {
      osmType = 'node["amenity"="police"]';
    } else if (type === "toilets") {
      osmType = 'node["amenity"="toilets"]';
    } else if (type === "hotel") {
      osmType = 'node["tourism"="hotel"]';
    } else if (type === "restaurant") {
      osmType = 'node["amenity"="restaurant"]';
    } else {
      return res.status(400).json({ error: "Invalid service type requested" });
    }

    const query = `
      [out:json];
      (
        ${osmType}(around:3000,${lat},${lon});
        way${osmType.substring(4)}(around:3000,${lat},${lon});
      );
      out center 10;
    `;

    const response = await axios.get(
      "https://overpass-api.de/api/interpreter",
      {
        params: {
          data: query,
        },
        headers: {
          "User-Agent": "VoyageAI/1.0",
        },
      }
    );

    // Map response elements to simplified structure
    const services = response.data.elements.map((el) => {
      const name = el.tags.name || el.tags.operator || `Unnamed ${type}`;
      const elementLat = el.lat || el.center?.lat;
      const elementLon = el.lon || el.center?.lon;
      const address = el.tags["addr:street"] 
        ? `${el.tags["addr:street"]} ${el.tags["addr:housenumber"] || ""}`.trim()
        : el.tags["addr:suburb"] || el.tags["addr:neighbourhood"] || "Nearby area";
      return {
        name,
        lat: elementLat,
        lon: elementLon,
        address,
        cuisine: el.tags.cuisine || null,
        stars: el.tags["stars"] || null
      };
    });

    res.json(services);
  } catch (error) {
    console.error("Nearby Services Route Error:", error.response?.data || error.message);
    
    // Fallback: Generate realistic local places near the user's coordinates in case of OSM rate limits
    const mockServices = [];
    const count = 5;
    for (let i = 1; i <= count; i++) {
      let name = "";
      let address = "";
      const deltaLat = (Math.random() - 0.5) * 0.01;
      const deltaLon = (Math.random() - 0.5) * 0.01;
      
      if (type === "hospital") {
        name = `Metro Health General Hospital #${i}`;
        address = `${i * 12} Clinic Boulevard, Central District`;
      } else if (type === "police") {
        name = `District Safety Police Precinct #${i}`;
        address = `${i * 8} Guardian Station, Safety District`;
      } else if (type === "toilets") {
        name = `Public Restroom Center #${i}`;
        address = `Near block ${i * 4}, Civic Plaza`;
      } else if (type === "hotel") {
        name = `Voyage Cozy Stay Hotel #${i}`;
        address = `${i * 15} Hospitality Street, Tourism District`;
      } else if (type === "restaurant") {
        name = `Local Flavors Diner #${i}`;
        address = `Food Court Lane ${i * 3}, Dining District`;
      }
      
      mockServices.push({
        name,
        lat: parseFloat(lat) + deltaLat,
        lon: parseFloat(lon) + deltaLon,
        address,
        cuisine: type === "restaurant" ? "Local Cuisines" : null,
        stars: type === "hotel" ? `${Math.floor(Math.random() * 2) + 3}*` : null
      });
    }
    
    res.json(mockServices);
  }
});
app.get("/hotels/:city", async (req, res) => {
  try {
    const city = req.params.city;

    // Get coordinates
    const location = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "VoyageAI/1.0",
        },
      }
    );

    if (location.data.length === 0) {
      return res.status(404).json({
        error: "City not found",
      });
    }

    const lat = location.data[0].lat;
    const lon = location.data[0].lon;

    const query = `
      [out:json];
      (
        node["tourism"="hotel"](around:5000,${lat},${lon});
        way["tourism"="hotel"](around:5000,${lat},${lon});
      );
      out center;
    `;

    const response = await axios.get(
      "https://overpass-api.de/api/interpreter",
      {
        params: {
          data: query,
        },
        headers: {
          "User-Agent": "VoyageAI/1.0",
        },
      }
    );

    res.json(response.data.elements);

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});
app.get("/location/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "VoyageAI/1.0",
        },
      }
    );

    if (response.data.length === 0) {
      return res.status(404).json({
        error: "City not found",
      });
    }

    res.json(response.data[0]);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});
// app.get("/restaurants/:city", async (req, res) => {
//   try {
//     const city = req.params.city;

//     const response = await axios.get(
//       "https://api.foursquare.com/v3/places/search",
//       {
//         headers: {
//           Authorization: process.env.FOURSQUARE_API_KEY,
//         },
//         params: {
//           near: city,
//           categories: "13065", // Restaurants
//           limit: 10,
//         },
//       }
//     );

//     res.json(response.data.results);
//   } catch (error) {
//     console.error(error.response?.data || error.message);

//     res.status(500).json({
//       error: error.response?.data || error.message,
//     });
//   }
// });
app.get("/currency/:code", async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();

    const response = await axios.get(
      `https://api.frankfurter.app/latest?from=INR&to=${code}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    let contextPrompt = `You are VoyageAI Assistant, a friendly, concise, and helpful AI travel companion. 
Answer the user's travel queries with professional travel guidance. Keep responses brief (1-3 sentences) and highly relevant.

Conversation History:
`;

    messages.forEach((msg) => {
      const roleName = msg.sender === "user" ? "User" : "Assistant";
      contextPrompt += `${roleName}: ${msg.text}\n`;
    });

    contextPrompt += `Assistant:`;

    const reply = await generateContentWithFallback(contextPrompt);
    res.json({ text: reply.trim() });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// const distPath = path.join(__dirname, "../client/dist");

// app.use(express.static(distPath));

// app.use((req, res) => {
//   res.sendFile(path.join(distPath, "index.html"));
// });
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });