"use client";

import { Reveal } from "./Reveal";

const features = [
  {
    title: "Projetos Personalizados",
    desc: "Cada caixa é projetada sob medida para o seu carro e o seu grave, do rascunho ao render 3D.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </svg>
    ),
  },
  {
    title: "Instalação Profissional",
    desc: "Cabeamento dimensionado, aterramento correto e regulagem fina de módulos e crossovers.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.5 4.5l5 5-9.5 9.5H5v-5l9.5-9.5z" />
        <path d="M13 6l5 5M3 21h18" />
      </svg>
    ),
  },
  {
    title: "Equipamentos Premium",
    desc: "Trabalhamos com as marcas mais respeitadas do som automotivo nacional e importado.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Acabamento de Alto Padrão",
    desc: "Carpete, pintura, fibra e iluminação LED com acabamento de vitrine em cada detalhe.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l2.6 6.2L21 9l-5 4.4L17.2 20 12 16.6 6.8 20 8 13.4 3 9l6.4-.8L12 2z" />
      </svg>
    ),
  },
];

export default function FeatureCards() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.12}>
            <div className="card-premium rounded-2xl p-8 h-full">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand/25 to-transparent text-brand-bright ring-gold shadow-[0_0_24px_rgba(255,122,0,0.25)]">
                {f.icon}
              </div>
              <h3 className="font-[family-name:var(--font-orbitron)] text-lg font-bold mb-3">
                {f.title}
              </h3>
              <p className="text-muted font-medium leading-relaxed">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
