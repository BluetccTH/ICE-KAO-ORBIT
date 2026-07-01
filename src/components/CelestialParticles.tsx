import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  type: "star" | "heart";
  angle?: number;
  angleSpeed?: number;
}

export default function CelestialParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    }

    function createParticles() {
      particles = [];
      const density = Math.floor((canvas.width * canvas.height) / 10000);
      const count = Math.max(40, Math.min(120, density));

      const colors = [
        "rgba(255, 182, 193, ", // Light pink
        "rgba(255, 105, 180, ", // Hot pink
        "rgba(135, 206, 250, ", // Sky blue
        "rgba(224, 255, 255, ", // Light cyan
        "rgba(255, 255, 255, ", // White
      ];

      for (let i = 0; i < count; i++) {
        const type = Math.random() > 0.85 ? "heart" : "star";
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: type === "heart" ? Math.random() * 6 + 4 : Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.7 + 0.2,
          type,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    }

    function drawHeart(c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) {
      c.save();
      c.translate(x, y);
      c.beginPath();
      // Simple canvas heart path
      const d = size;
      c.moveTo(0, d / 4);
      c.quadraticCurveTo(0, 0, d / 2, 0);
      c.quadraticCurveTo(d, 0, d, d / 2);
      c.quadraticCurveTo(d, (d * 3) / 4, (d * 3) / 4, d);
      c.lineTo(0, d * 1.5);
      c.lineTo(-((d * 3) / 4), d);
      c.quadraticCurveTo(-d, (d * 3) / 4, -d, d / 2);
      c.quadraticCurveTo(-d, 0, -(d / 2), 0);
      c.quadraticCurveTo(0, 0, 0, d / 4);
      c.closePath();
      c.fillStyle = `${color}${opacity})`;
      c.shadowColor = "rgba(244, 63, 94, 0.5)";
      c.shadowBlur = 10;
      c.fill();
      c.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Interactive mouse gravity / repeller
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Boundary wrap
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Twinkle effect
        p.opacity += (Math.random() - 0.5) * 0.04;
        if (p.opacity < 0.15) p.opacity = 0.15;
        if (p.opacity > 0.85) p.opacity = 0.85;

        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          // Glowing stars
          if (p.size > 1.5) {
            ctx.shadowColor = "rgba(255,255,255,0.8)";
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function handleMouseLeave() {
      mouseX = -1000;
      mouseY = -1000;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-5"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
