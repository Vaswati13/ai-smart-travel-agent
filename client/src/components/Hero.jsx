function Hero() {
  return (
    <div className="text-center space-y-4 px-4 z-10 select-none relative max-w-2xl mx-auto">
      <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent tracking-wider font-sans drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] animate-pulse">
        VoyageAI
      </h1>

      <p className="text-white/90 text-lg md:text-xl font-extrabold tracking-widest uppercase font-sans">
        Your AI Travel Companion is Here
      </p>

      <p className="text-white/50 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
        Orchestrate optimal itineraries, hotels, currencies, safety channels, and packing lists with our fallback generative model architecture.
      </p>
    </div>
  );
}

export default Hero;