"use client";

import { Reveal, SectionTitle } from "./Reveal";
import { site } from "@/lib/site";

/**
 * Galeria de projetos.
 * As fotos reais serão adicionadas em breve — enquanto isso, a seção
 * convida o visitante a acompanhar os projetos no Instagram.
 */
export default function Gallery() {
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
          subtitle="Em breve, fotos e vídeos dos projetos que saem da nossa bancada."
        />

        <Reveal>
          <div className="card-premium rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 speaker-grid-bg opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.10),transparent_65%)]" />
            <div className="relative">
              <svg viewBox="0 0 120 120" className="w-28 h-28 mx-auto mb-8 opacity-80">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f5c453" strokeWidth="2" opacity="0.7" />
                <circle cx="60" cy="60" r="44" fill="#111" stroke="#333" />
                <circle cx="60" cy="60" r="30" fill="none" stroke="#ff7a00" strokeWidth="1.5" opacity="0.8" />
                <circle cx="60" cy="60" r="16" fill="#1a1a1a" stroke="#ff9500" strokeWidth="2" />
                <circle cx="60" cy="60" r="6" fill="#ff7a00" opacity="0.9" />
              </svg>
              <h3 className="font-[family-name:var(--font-orbitron)] text-xl sm:text-2xl font-bold mb-4">
                Fotos dos projetos <span className="text-gradient-brand">chegando em breve</span>
              </h3>
              <p className="text-muted font-medium max-w-xl mx-auto mb-8">
                Estamos preparando a galeria com os melhores trabalhos da JR Sound. Enquanto
                isso, acompanhe os projetos saindo do forno no nosso Instagram.
              </p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand inline-block rounded-full px-10 py-4 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.2em] text-black"
              >
                Ver no Instagram
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
