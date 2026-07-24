import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TripForm from "../components/TripForm";
import ChatBot from "../components/ChatBot";
import SplashScreen from "../components/SplashScreen";

function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    // Start splash screen fade-out at 2.4s
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 2400);

    // Completely unmount splash screen at 2.9s
    const destroyTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(destroyTimer);
    };
  }, []);

  return (
    <>
      {showSplash && <SplashScreen fade={fadeSplash} />}

      <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden flex flex-col justify-center items-center py-24">
        
        {/* Custom Animation Keyframes Injection */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* Cinematic Looping Travel Video Background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter blur-[8px] scale-105 opacity-40"
            src="https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-a-shoreline-and-waves-42171-large.mp4"
          />
          {/* Dark Glass Overlay */}
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]" />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <div className="relative z-10 w-full flex flex-col items-center gap-8 px-4 mt-8 animate-fade-in-up">
          <Hero />
          <TripForm />
        </div>

        {/* AI assistant ChatBot */}
        <ChatBot />

      </div>
    </>
  );
}

export default Home;
