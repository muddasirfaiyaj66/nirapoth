"use client";

import { useEffect, useRef } from "react";

export function DottedWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation parameters
    const dotSpacing = 30;
    const waveAmplitude = 40;
    const waveFrequency = 0.003;
    const dotRadius = 2;
    const dotColor = "#94a3b8"; // slate-400
    let animationFrame = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / dotSpacing);
      const rows = Math.ceil(canvas.height / dotSpacing);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * dotSpacing;
          const baseY = row * dotSpacing;

          // Create wave effect with multiple sine waves
          const wave1 =
            Math.sin((x + animationFrame) * waveFrequency) * waveAmplitude;
          const wave2 =
            Math.sin((x - animationFrame * 0.5) * waveFrequency * 1.5) *
            (waveAmplitude * 0.5);
          const y = baseY + wave1 + wave2;

          // Calculate opacity based on wave position
          const opacity =
            0.3 +
            Math.abs(Math.sin((x + animationFrame) * waveFrequency)) * 0.4;

          ctx.fillStyle = dotColor;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrame += 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-white"
      aria-hidden="true"
    />
  );
}
