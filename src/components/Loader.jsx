import React, { useEffect, useRef } from "react";
import { cn } from "../lib/utils";

const Loader = ({ size = 200, className = "", dark = false }) => {
  const canvasRef = useRef(null);
  const labelRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cx = 80;
    const cy = 80;
    const radius = 65;
    const DURATION = 2400;

    // Animate the "Artist..." dots
    const artistLabel = labelRef.current;
    const dotStates = ['', '.', '..', '...'];
    let dotIndex = 0;
    const dotInterval = setInterval(() => {
      dotIndex = (dotIndex + 1) % dotStates.length;
      if (artistLabel) artistLabel.textContent = 'Artist' + dotStates[dotIndex];
    }, DURATION / 4);

    // Easing: ease-in-out cubic
    function easeInOut(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Draw the pencil at a given position + angle (tip pointing in travel direction)
    function drawPencil(x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Graphite tip
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-6, 4);
      ctx.closePath();
      ctx.fillStyle = '#333';
      ctx.fill();

      // Wood cone
      ctx.beginPath();
      ctx.moveTo(-6, -5);
      ctx.lineTo(-6, 5);
      ctx.lineTo(-18, 0);
      ctx.closePath();
      ctx.fillStyle = '#d4a574';
      ctx.fill();

      // Wood highlight
      ctx.beginPath();
      ctx.moveTo(-6, -5);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-18, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(224,192,144,0.5)';
      ctx.fill();

      // Body (red)
      ctx.fillStyle = '#e8272d';
      ctx.beginPath();
      ctx.roundRect(-42, -6, 24, 12, 1);
      ctx.fill();

      // Body highlight
      ctx.fillStyle = 'rgba(240,80,80,0.4)';
      ctx.fillRect(-42, -6, 7, 12);

      // Body shadow
      ctx.fillStyle = 'rgba(176,26,30,0.5)';
      ctx.fillRect(-21, -6, 5, 12);

      // Ferrule (silver bands)
      ctx.fillStyle = '#c8c8c8';
      ctx.fillRect(-49, -6, 7, 12);
      ctx.fillStyle = '#a0a0a0';
      ctx.fillRect(-49, -2, 7, 2);
      ctx.fillRect(-49, 0.5, 7, 2);

      // Eraser (pink)
      ctx.fillStyle = '#e8a0a0';
      ctx.beginPath();
      ctx.roundRect(-55, -5, 6, 10, 2);
      ctx.fill();

      ctx.restore();
    }

    // Main animation loop
    function animate(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = timestamp % DURATION;
      const t = elapsed / DURATION;

      // Background ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#f5dede';
      ctx.lineWidth = 7;
      ctx.stroke();

      // Progress arc
      const growPhase = 0.70;
      const fadePhase = 0.85;

      let arcProgress = 0;
      let arcAlpha = 1;

      if (t <= growPhase) {
        arcProgress = easeInOut(t / growPhase);
        arcAlpha = 1;
      } else if (t <= fadePhase) {
        arcProgress = 1;
        arcAlpha = 1 - (t - growPhase) / (fadePhase - growPhase);
      } else {
        arcProgress = 0;
        arcAlpha = 0;
      }

      if (arcProgress > 0) {
        ctx.globalAlpha = arcAlpha;
        ctx.beginPath();
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + arcProgress * Math.PI * 2;
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.strokeStyle = '#e8272d';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Pencil position along the ring
      const pencilAngle = -Math.PI / 2 + t * Math.PI * 2;
      const px = cx + radius * Math.cos(pencilAngle);
      const py = cy + radius * Math.sin(pencilAngle);

      const travelAngle = pencilAngle + Math.PI / 2;

      drawPencil(px, py, travelAngle);

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      clearInterval(dotInterval);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const scale = size / 200;

  return (
    <div className={cn("flex flex-col items-center justify-center", className)} style={{ width: size, height: size }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <canvas ref={canvasRef} width="160" height="160" style={{ display: 'block' }} />
      </div>
      <div className="text-center" style={{ marginTop: 8 * scale }}>
        <div style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400, fontSize: 13 * scale, letterSpacing: 6 * scale, textTransform: 'uppercase', color: dark ? '#fff' : '#1a1a1a', marginBottom: 2 * scale }}>
          Art
        </div>
        <div ref={labelRef} style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 34 * scale, color: '#e8272d', letterSpacing: 1 * scale }}>
          Artist
        </div>
      </div>
    </div>
  );
};

export default Loader;

