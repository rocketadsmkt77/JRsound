"use client";

import Link from "next/link";
import { Reveal, SectionTitle } from "./Reveal";

const points = [
  { t: "Câmera livre 360°", d: "Gire, aproxime e explore a caixa por todos os ângulos." },
  { t: "Biblioteca completa", d: "Subwoofers, tweeters, drivers, cornetas, módulos, LEDs e mais." },
  { t: "Cálculos em tempo real", d: "Volume, sintonia, dutos, MDF e peso calculados enquanto você monta." },
  { t: "Orçamento no WhatsApp", d: "Lista de materiais, medidas e valor estimado enviados em um clique." },
];

export default function ConfiguratorTeaser() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(255,122,0,0.12),transparent_70%)]" />
      <div className="mx-auto max-w-7xl relative">
        <SectionTitle
          kicker="Exclusividade JR Sound"
          title={
            <>
              Configurador <span className="text-gradient-brand">3D</span>
            </>
          }
          subtitle="Uma experiência de configuração no nível das marcas esportivas premium — feita para o som automotivo."
        />
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <Link href="/configurador" className="group block relative">
              <div className="card-premium rounded-3xl aspect-[16/10] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 speaker-grid-bg" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.16),transparent_60%)]" />
                {/* stylized 3D box preview */}
                <svg viewBox="0 0 400 260" className="w-4/5 h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                  <defs>
                    <linearGradient id="boxTop" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#3a3a3a" />
                      <stop offset="1" stopColor="#1c1c1c" />
                    </linearGradient>
                    <linearGradient id="boxFront" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#262626" />
                      <stop offset="1" stopColor="#0f0f0f" />
                    </linearGradient>
                    <radialGradient id="cone" cx="0.4" cy="0.4" r="0.8">
                      <stop offset="0" stopColor="#333" />
                      <stop offset="0.7" stopColor="#111" />
                      <stop offset="1" stopColor="#000" />
                    </radialGradient>
                  </defs>
                  <polygon points="60,80 250,60 340,95 150,120" fill="url(#boxTop)" stroke="#444" />
                  <polygon points="60,80 150,120 150,240 60,195" fill="#161616" stroke="#333" />
                  <polygon points="150,120 340,95 340,215 150,240" fill="url(#boxFront)" stroke="#333" />
                  <ellipse cx="215" cy="165" rx="42" ry="46" fill="none" stroke="#f5c453" strokeWidth="3" />
                  <ellipse cx="215" cy="165" rx="36" ry="40" fill="url(#cone)" />
                  <ellipse cx="215" cy="165" rx="14" ry="16" fill="#1a1a1a" stroke="#ff7a00" strokeWidth="2" />
                  <ellipse cx="296" cy="150" rx="16" ry="18" fill="none" stroke="#f5c453" strokeWidth="2" />
                  <ellipse cx="296" cy="150" rx="12" ry="14" fill="url(#cone)" />
                  <rect x="150" y="228" width="190" height="4" fill="#ff7a00" opacity="0.85">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                  </rect>
                </svg>
                <div className="absolute bottom-5 right-6 font-[family-name:var(--font-orbitron)] text-xs font-bold uppercase tracking-[0.3em] text-brand-bright opacity-0 group-hover:opacity-100 transition-opacity">
                  Abrir configurador →
                </div>
              </div>
            </Link>
          </Reveal>
          <div className="space-y-6">
            {points.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.12}>
                <div className="flex gap-5 items-start">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-deep flex items-center justify-center font-[family-name:var(--font-orbitron)] font-extrabold text-black shadow-[0_0_18px_rgba(255,122,0,0.5)]">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-orbitron)] font-bold text-lg mb-1">{p.t}</h3>
                    <p className="text-muted font-medium">{p.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.5}>
              <Link
                href="/configurador"
                className="btn-brand inline-block mt-4 rounded-full px-10 py-4 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.2em] text-black"
              >
                Montar minha caixa
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
