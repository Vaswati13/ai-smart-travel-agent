import { useEffect, useRef, useState } from "react";

function SplashScreen() {
  const canvasRef = useRef(null);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    // Responsive Canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Starfield Generator
    const stars = [];
    const numStars = 120;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    // Rotating Earth Dot-Grid Generator
    const earthDots = [];
    const isLand = (lon, lat) => {
      // Rough continental layout boundaries
      // Asia / Europe
      if (lat > -0.25 && lat < 1.1 && lon > 0.1 && lon < 2.4) return true;
      // Africa
      if (lat > -0.75 && lat < 0.6 && lon > -0.3 && lon < 0.7) return true;
      // North America
      if (lat > 0.25 && lat < 1.2 && lon > -2.3 && lon < -0.7) return true;
      // South America
      if (lat > -0.9 && lat < 0.25 && lon > -1.7 && lon < -0.5) return true;
      // Australia
      if (lat > -0.75 && lat < -0.2 && lon > 1.8 && lon < 2.6) return true;
      // Antarctica
      if (lat < -1.1) return true;
      return false;
    };

    // Generate globe particles
    const latCount = 45;
    const lonCount = 90;
    for (let i = 0; i < latCount; i++) {
      const lat = (i / latCount) * Math.PI - Math.PI / 2; // -90 to 90 degrees
      for (let j = 0; j < lonCount; j++) {
        const lon = (j / lonCount) * Math.PI * 2 - Math.PI; // -180 to 180 degrees
        if (isLand(lon, lat)) {
          earthDots.push({ lon, lat });
        }
      }
    }

    // Animation Config
    let rotation = 0;
    let t = 0;
    const speed = 0.025;
    const trail = [];
    const maxTrailLen = 60;
    let zoomScale = 1;
    let textAlpha = 0;
    let pulseRadius = 0;

    // Destination Coordinate (Paris, France area)
    const destLon = 0.05; 
    const destLat = 0.85; 

    // Trigger Fade-out at 2.5s
    const fadeTimeout = setTimeout(() => {
      setFade(true);
    }, 2500);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Space Radial Background
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      bgGrad.addColorStop(0, "#081026");
      bgGrad.addColorStop(0.5, "#030612");
      bgGrad.addColorStop(1, "#010206");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Nebula effects
      ctx.fillStyle = "rgba(59, 130, 246, 0.03)";
      ctx.beginPath();
      ctx.arc(canvas.width * 0.2, canvas.height * 0.3, 300, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(147, 51, 234, 0.03)";
      ctx.beginPath();
      ctx.arc(canvas.width * 0.8, canvas.height * 0.7, 400, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw blinking Starfield
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Globe Positioning
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      let baseRadius = Math.min(canvas.width, canvas.height) * 0.22;
      
      // Camera Zoom effect after 2s
      if (t > 4.5) {
        zoomScale += 0.06;
      }
      const radius = baseRadius * zoomScale;

      // 4. Atmospheric Glow behind Earth
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.3);
      glowGrad.addColorStop(0, "rgba(59, 130, 246, 0.35)");
      glowGrad.addColorStop(0.4, "rgba(59, 130, 246, 0.15)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 5. Draw 3D Earth Dot-Grid
      rotation += 0.007; // Rotate speed
      earthDots.forEach((dot) => {
        // Project rotating coordinates
        const rotatedLon = dot.lon + rotation;
        
        // 3D Orthographic Projection Math
        const cosLon = Math.cos(rotatedLon);
        // Only draw dots facing the camera (cosLon > 0)
        if (cosLon > 0) {
          const sinLon = Math.sin(rotatedLon);
          const sinLat = Math.sin(dot.lat);
          const cosLat = Math.cos(dot.lat);

          const x = cx + radius * sinLon * cosLat;
          const y = cy - radius * sinLat;

          // Shading intensity based on 3D depth (facing direction)
          const shade = cosLon;
          ctx.fillStyle = `rgba(147, 197, 253, ${shade * 0.75})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.2 * shade, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 6. Pulse Destination Location Marker (Paris coordinates)
      const rotatedDestLon = destLon + rotation;
      const cosDestLon = Math.cos(rotatedDestLon);
      let destX = 0;
      let destY = 0;

      if (cosDestLon > 0) {
        const sinDestLon = Math.sin(rotatedDestLon);
        const sinDestLat = Math.sin(destLat);
        const cosDestLat = Math.cos(destLat);

        destX = cx + radius * sinDestLon * cosDestLat;
        destY = cy - radius * sinDestLat;

        // Concentric pulsing rings
        pulseRadius += 0.5;
        if (pulseRadius > 30) pulseRadius = 0;
        const pulseAlpha = 1 - (pulseRadius / 30);

        ctx.strokeStyle = `rgba(59, 130, 246, ${pulseAlpha * cosDestLon})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(destX, destY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(239, 68, 68, ${cosDestLon * 0.9})`;
        ctx.beginPath();
        ctx.arc(destX, destY, 4, 0, Math.PI * 2);
        ctx.fill();

        // 7. Dynamic Beam of Light rising from Marker
        if (t > 3) {
          const beamGrad = ctx.createLinearGradient(destX, destY, destX, destY - 140);
          beamGrad.addColorStop(0, "rgba(59, 130, 246, 0.7)");
          beamGrad.addColorStop(1, "rgba(59, 130, 246, 0)");
          ctx.fillStyle = beamGrad;
          ctx.fillRect(destX - 1.5, destY - 140, 3, 140);
        }
      }

      // 8. Orbiting Airplane and Trail
      t += speed;
      
      // Airplane stops near destination after 1.5 orbits
      let planeT = t;
      let isStopped = false;
      if (t > 4.2) {
        planeT = 4.2;
        isStopped = true;
      }

      // Inclined elliptical orbit coordinate calculation
      const planeX = cx + (radius * 1.35) * Math.cos(planeT);
      const planeY = cy + (radius * 0.45) * Math.sin(planeT) - (radius * 0.25) * Math.cos(planeT);

      // Record trail points
      if (!isStopped || trail.length > 0) {
        trail.push({ x: planeX, y: planeY });
        if (trail.length > maxTrailLen) trail.shift();
      }

      // Render glowing trail
      if (trail.length > 1) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(59, 130, 246, 0.8)";
        
        for (let i = 1; i < trail.length; i++) {
          const opacity = (i / trail.length) * 0.6;
          ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
          ctx.lineWidth = (i / trail.length) * 3;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
        ctx.shadowBlur = 0; // Reset shadow effects
      }

      // Render Airplane Icon
      if (!isStopped) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ffffff";
        ctx.beginPath();
        // Simple triangular airplane shape facing the vector
        const angle = planeT + Math.PI / 2;
        ctx.save();
        ctx.translate(planeX, planeY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-4, 6);
        ctx.lineTo(0, 3);
        ctx.lineTo(4, 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.shadowBlur = 0;
      }

      // 9. Destination Callout Text
      if (t > 3 && cosDestLon > 0) {
        textAlpha = Math.min(1, textAlpha + 0.05);
        ctx.save();
        ctx.globalAlpha = textAlpha;
        ctx.font = "bold 24px 'Outfit', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        
        // Add text glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(59, 130, 246, 0.8)";
        
        ctx.fillText("PARIS", destX, destY - 50);
        ctx.font = "bold 14px 'Outfit', sans-serif";
        ctx.fillStyle = "rgba(147, 197, 253, 0.9)";
        ctx.fillText("FRANCE", destX, destY - 32);
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(fadeTimeout);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ease-out select-none pointer-events-none bg-black
      ${fade ? "opacity-0" : "opacity-100"}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default SplashScreen;
