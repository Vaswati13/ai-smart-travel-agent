import { useContext, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaClock, FaBus, FaWallet, FaMapMarkerAlt, FaSun, FaMoon, FaUtensils, FaCompass } from "react-icons/fa";
import { TripContext } from "../context/TripContext";

function Itinerary() {
  const { tripPlan, tripData } = useContext(TripContext);
  const carouselRef = useRef(null);

  if (!tripPlan) {
    return (
      <div className="bg-white/10 border border-white/15 backdrop-blur-xl p-8 rounded-[28px] shadow-[0_18px_60px_rgba(3,7,18,0.45)] flex flex-col items-center justify-center min-h-[350px] mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-300"></div>
        <h3 className="mt-6 text-xl font-bold text-white animate-pulse">
          Crafting your day-wise itinerary...
        </h3>
        <p className="mt-2 text-slate-300 text-sm text-center max-w-sm">
          Please wait. VoyageAI is designing a personalized daily guide tailored to your budget and travel style.
        </p>
      </div>
    );
  }

  const itinerary = tripPlan.itinerary || [];

  if (itinerary.length === 0) {
    return (
      <div className="bg-white/10 border border-white/15 backdrop-blur-xl p-8 rounded-[28px] shadow-[0_18px_60px_rgba(3,7,18,0.45)] min-h-[350px] mt-8 flex flex-col items-center justify-center text-slate-300">
        <span className="text-4xl mb-4">📅</span>
        <h3 className="text-xl font-bold text-white">No itinerary compiled</h3>
        <p className="mt-2 text-sm">Please generate a travel plan first to see your day-wise schedule.</p>
      </div>
    );
  }

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = 390;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const destinationName = tripData?.destination || "your destination";

  return (
    <div className="mt-8 mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80 mb-2">AI trip planner</p>
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-cyan-200 to-sky-400 bg-clip-text text-transparent">
            Day Wise Itinerary
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:scale-105 hover:bg-white/20"
            aria-label="Scroll itinerary left"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:scale-105 hover:bg-white/20"
            aria-label="Scroll itinerary right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="itinerary-scroll flex gap-5 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
      >
        {itinerary.map((dayPlan, index) => {
          const visualIndex = index + 1;
          const travelTime = dayPlan.travelTime || "Flexible pace";
          const transportation = dayPlan.transportation || "Local transit";
          const budget = dayPlan.budget || "Balanced";
          const nightPlan = dayPlan.night || dayPlan.evening || "Unwind with a relaxed dinner and a quiet evening stroll before a restful night.";
          const theme = dayPlan.theme || `Exploring ${destinationName}`;

          return (
            <article
              key={dayPlan.day || index}
              className="group relative w-[320px] sm:w-[360px] md:w-[390px] snap-start shrink-0 overflow-hidden rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_18px_55px_rgba(2,6,23,0.45)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_65px_rgba(14,165,233,0.25)]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.22),rgba(99,102,241,0.10),transparent_70%)] opacity-90" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400" />

              <div className="relative h-44 overflow-hidden rounded-b-[24px] border-b border-white/10 bg-[linear-gradient(135deg,#0f172a,#1d4ed8_45%,#7c3aed_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.65),transparent_35%)]" />
                <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-slate-950/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur-md">
                  {destinationName}
                </div>
                <div className="absolute left-5 bottom-5">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-100/80">Day plan</div>
                  <div className="mt-1 text-3xl font-black text-white">Day {visualIndex}</div>
                </div>
              </div>

              <div className="relative p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/70">Highlights</div>
                    <h3 className="mt-2 text-xl font-bold text-white">{theme}</h3>
                  </div>
                  <div className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
                    AI curated
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/40 px-3 py-1 text-[11px] text-slate-100">
                    <FaClock className="text-cyan-300" /> {travelTime}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/40 px-3 py-1 text-[11px] text-slate-100">
                    <FaBus className="text-sky-300" /> {transportation}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/40 px-3 py-1 text-[11px] text-slate-100">
                    <FaWallet className="text-violet-300" /> {budget}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: <FaSun className="text-orange-300" />,
                      label: "Morning",
                      color: "from-orange-400/15 to-amber-300/5",
                      text: dayPlan.morning,
                    },
                    {
                      icon: <FaCompass className="text-yellow-300" />,
                      label: "Afternoon",
                      color: "from-yellow-400/15 to-amber-300/5",
                      text: dayPlan.afternoon,
                    },
                    {
                      icon: <FaUtensils className="text-indigo-300" />,
                      label: "Evening",
                      color: "from-indigo-400/15 to-sky-300/5",
                      text: dayPlan.evening,
                    },
                    {
                      icon: <FaMoon className="text-violet-300" />,
                      label: "Night",
                      color: "from-violet-400/15 to-fuchsia-300/5",
                      text: nightPlan,
                    },
                  ].map((slot) => (
                    <div
                      key={slot.label}
                      className={`rounded-[20px] border border-white/10 bg-gradient-to-r ${slot.color} p-3.5`}
                    >
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-100">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/40">{slot.icon}</span>
                        {slot.label}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{slot.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Itinerary;