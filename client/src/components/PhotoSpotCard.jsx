import { useContext } from "react";
import { TripContext } from "../context/TripContext";

function PhotoSpotCard() {
  const { tripPlan } = useContext(TripContext);

  if (!tripPlan) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[220px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Finding best photo spots...</p>
      </div>
    );
  }

  const spots = tripPlan.photoSpots || [];

  if (spots.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[220px] flex items-center justify-center text-gray-500 font-medium">
        📸 No photography spots resolved for this destination.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-pink-600 mb-5 flex items-center gap-2">
        📸 Best Photo Spots
      </h2>

      <div className="space-y-6">
        {spots.map((spot, index) => {
          const fallbackImg = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600";
          const imgUrl = spot.imageUrl || fallbackImg;

          return (
            <div
              key={index}
              className="bg-pink-50 rounded-2xl p-4 border border-pink-100 hover:bg-pink-50/70 transition-colors duration-200"
            >
              {/* Spot Image */}
              <div className="h-40 w-full overflow-hidden rounded-xl mb-3 shadow-inner bg-gray-100">
                <img
                  src={imgUrl}
                  alt={spot.name}
                  onError={(e) => { e.target.src = fallbackImg; }}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Best Time */}
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-gray-800 text-base">
                  {spot.name}
                </h3>
                <span className="bg-pink-200 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                  ⏰ {spot.bestTime}
                </span>
              </div>

              {/* Tip */}
              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                <strong>Tip:</strong> {spot.tip}
              </p>

              {/* Video Thumbnail Action */}
              <div 
                className="relative h-24 w-full bg-gray-900 rounded-xl overflow-hidden cursor-pointer group shadow-inner border border-gray-800"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(spot.videoQuery || (spot.name + " travel spots"))}`, "_blank")}
              >
                <img 
                  src={imgUrl} 
                  alt="Video Preview" 
                  onError={(e) => { e.target.src = fallbackImg; }}
                  className="absolute inset-0 w-full h-full object-cover opacity-45 blur-[1px] group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-5 h-5 text-red-600 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white mt-1.5 drop-shadow-sm">
                    Watch Photo Walk
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhotoSpotCard;