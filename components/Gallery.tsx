"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionTitle } from "./Reveal";

const categories = [
  "Todos",
  "Som Interno",
  "Som Externo",
  "Trio",
  "Porta-malas",
  "Pickups",
  "SUV",
  "Sedan",
  "Antes e Depois",
  "Vídeos",
] as const;

type Item = {
  id: number;
  title: string;
  cat: (typeof categories)[number];
  video?: boolean;
};

// Substitua pelas fotos reais dos projetos (galeria gerenciada no painel /admin)
const items: Item[] = [
  { id: 1, title: "Trio completo — Gol quadrado", cat: "Trio" },
  { id: 2, title: "Porta-malas sob medida — Civic", cat: "Porta-malas" },
  { id: 3, title: "Som interno high-end — Corolla", cat: "Som Interno" },
  { id: 4, title: "Paredão dutado — Saveiro", cat: "Pickups" },
  { id: 5, title: "SUV com grave escondido", cat: "SUV" },
  { id: 6, title: "Sedan sound quality", cat: "Sedan" },
  { id: 7, title: "Som externo para eventos", cat: "Som Externo" },
  { id: 8, title: "Antes e depois — porta-malas", cat: "Antes e Depois" },
  { id: 9, title: "Demo de pressão sonora", cat: "Vídeos", video: true },
  { id: 10, title: "Caixa trio com LED", cat: "Trio" },
  { id: 11, title: "Strada com canhão", cat: "Pickups" },
  { id: 12, title: "Regulagem no porta-malas", cat: "Vídeos", video: true },
];

export default function Gallery() {
  const [active, setActive] = useState<(typeof categories)[number]>("Todos");
  const filtered = active === "Todos" ? items : items.filter((i) => i.cat === active);

  return (
    <section id="galeria" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          kicker="Nossos projetos"
          title={
            <>
              Galeria <span className="text-gradient-brand">JR Sound</span>
            </>
          }
          subtitle="Uma amostra do que sai da nossa bancada. Cada projeto com identidade própria."
        />

        <Reveal className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-all ${
                active === c
                  ? "btn-brand text-black"
                  : "btn-ghost text-foreground/70 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}
                className="card-premium group relative aspect-[4/3] rounded-2xl cursor-pointer"
              >
                {/* placeholder visual — substitua por <Image /> com a foto real */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,rgba(255,122,0,0.20),transparent_65%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <SpeakerArt video={item.video} />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gradient-gold mb-1">
                    {item.cat}
                  </p>
                  <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-bold">
                    {item.title}
                  </h3>
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-brand/50 transition-all" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function SpeakerArt({ video }: { video?: boolean }) {
  if (video) {
    return (
      <div className="w-20 h-20 rounded-full bg-brand/15 border border-brand/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,122,0,0.35)]">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand-bright fill-current ml-1">
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </div>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className="w-36 h-36 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
      <circle cx="60" cy="60" r="52" fill="none" stroke="#f5c453" strokeWidth="2" opacity="0.7" />
      <circle cx="60" cy="60" r="44" fill="#111" stroke="#333" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="#ff7a00" strokeWidth="1.5" opacity="0.8" />
      <circle cx="60" cy="60" r="16" fill="#1a1a1a" stroke="#ff9500" strokeWidth="2" />
      <circle cx="60" cy="60" r="6" fill="#ff7a00" opacity="0.9" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <circle
            key={i}
            cx={60 + Math.cos(a) * 48}
            cy={60 + Math.sin(a) * 48}
            r="2"
            fill="#f5c453"
          />
        );
      })}
    </svg>
  );
}
