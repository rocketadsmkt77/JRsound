"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; hue: number };

export default function Particles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let ps: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = rect.width * devicePixelRatio;
      h = canvas.height = rect.height * devicePixelRatio;
      const count = Math.min(90, Math.floor(rect.width / 14));
      ps = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (-0.2 - Math.random() * 0.45) * devicePixelRatio,
        r: (0.8 + Math.random() * 2.2) * devicePixelRatio,
        a: 0.15 + Math.random() * 0.55,
        hue: 25 + Math.random() * 22, // orange → gold
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.a})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={`pointer-events-none ${className}`} aria-hidden />;
}
