import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Transition() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background:
          "radial-gradient(circle at center, #0b1f44 0%, #050b1f 60%, #000 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.08), transparent 40%, rgba(0,0,0,0.42))",
          animation: "transitionFade 4.8s ease-in-out forwards",
        }}
      />

      {Array.from({ length: 150 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "white",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random(),
            boxShadow: "0 0 8px rgba(255,255,255,0.7)",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(96,165,250,0.18), transparent 30%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #7dd3fc 0%, #2f80ed 28%, #114fbd 58%, #0d1f59 100%)",
          boxShadow:
            "0 0 80px rgba(56,189,248,0.45), 0 0 140px rgba(59,130,246,0.18)",
          border: "1px solid rgba(173, 216, 255, 0.35)",
          animation: "earthZoom 4.8s cubic-bezier(0.2,0.8,0.2,1) forwards",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.42), transparent 35%, rgba(12,27,79,0.32) 62%, rgba(10,17,40,0.75)), repeating-linear-gradient(90deg, rgba(24, 193, 98, 0.65) 0 18%, rgba(24, 136, 72, 0.88) 18% 30%, rgba(25, 95, 146, 0.92) 30% 42%, rgba(17, 38, 97, 0.68) 42% 58%, rgba(30, 89, 145, 0.85) 58% 70%, rgba(22, 58, 113, 0.95) 70% 82%, rgba(28, 181, 109, 0.72) 82% 100%)",
            backgroundSize: "140% 100%, 120% 100%",
            mixBlendMode: "screen",
            opacity: 0.9,
            animation: "earthSurface 8s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 16,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "inset 0 0 20px rgba(255,255,255,0.15)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "-80px",
          transformOrigin: "center center",
          filter: "drop-shadow(0 0 18px rgba(96,165,250,0.86))",
          fontSize: "58px",
          animation: "planeWave 4.8s cubic-bezier(0.38, 0.04, 0.22, 1) forwards",
        }}
      >
        ✈
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "82px",
          width: "100%",
          textAlign: "center",
          color: "white",
          fontSize: "28px",
          fontWeight: "bold",
          letterSpacing: "0.02em",
          opacity: 0,
          animation: "textReveal 1.6s ease forwards 0.8s",
        }}
      >
        Generating your AI Trip...
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "45px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "320px",
          height: "8px",
          background: "#1f2937",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)",
            animation: "loading 3s linear forwards",
          }}
        />
      </div>
    </div>
  );
}