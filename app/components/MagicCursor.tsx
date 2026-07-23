"use client";

import { useEffect, useRef } from "react";

type Particle = {
  alpha: number;
  life: number;
  radius: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

export function MagicCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!canvasRef.current) return;

    const drawingCanvas = canvasRef.current;
    const maybeContext = drawingCanvas.getContext("2d");
    if (!maybeContext) return;

    const context = maybeContext;

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      drawingCanvas.width = Math.floor(window.innerWidth * ratio);
      drawingCanvas.height = Math.floor(window.innerHeight * ratio);
      drawingCanvas.style.width = `${window.innerWidth}px`;
      drawingCanvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function addParticles(event: PointerEvent) {
      if (event.pointerType === "touch") return;

      for (let index = 0; index < 4; index += 1) {
        particlesRef.current.push({
          alpha: 1,
          life: 42 + Math.random() * 28,
          radius: 1.5 + Math.random() * 3.2,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -0.3 - Math.random() * 1.4,
          x: event.clientX + (Math.random() - 0.5) * 12,
          y: event.clientY + (Math.random() - 0.5) * 12,
        });
      }

      if (particlesRef.current.length > 180) {
        particlesRef.current.splice(0, particlesRef.current.length - 180);
      }
    }

    function draw() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          alpha: particle.alpha * 0.965,
          life: particle.life - 1,
          radius: particle.radius * 0.992,
          vx: particle.vx * 0.985,
          vy: particle.vy + 0.006,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
        }))
        .filter((particle) => particle.life > 0 && particle.alpha > 0.05);

      particlesRef.current.forEach((particle) => {
        const glow = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 5,
        );
        glow.addColorStop(0, `rgba(255, 236, 129, ${particle.alpha})`);
        glow.addColorStop(0.38, `rgba(74, 222, 255, ${particle.alpha * 0.42})`);
        glow.addColorStop(1, "rgba(255, 236, 129, 0)");

        context.fillStyle = glow;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = `rgba(255, 255, 255, ${particle.alpha * 0.7})`;
        context.fillRect(particle.x - 0.5, particle.y - particle.radius * 2, 1, particle.radius * 4);
        context.fillRect(particle.x - particle.radius * 2, particle.y - 0.5, particle.radius * 4, 1);
      });

      frameRef.current = window.requestAnimationFrame(draw);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", addParticles, { passive: true });
    frameRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", addParticles);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[65] hidden mix-blend-screen md:block print:hidden"
      aria-hidden="true"
    />
  );
}
