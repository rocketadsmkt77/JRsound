"use client";

import Image from "next/image";
import { Reveal, SectionTitle } from "./Reveal";
import Equalizer from "./Equalizer";

const stats = [
  { n: "10+", l: "Anos de experiência" },
  { n: "1.500+", l: "Projetos entregues" },
  { n: "100%", l: "Sob medida" },
  { n: "3D", l: "Visualização em tempo real" },
];

export default function About() {
  return (
    <section id="sobre" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_50%,rgba(255,122,0,0.08),transparent_70%)]" />
      <div className="mx-auto max-w-7xl relative">
        <SectionTitle
          kicker="Quem somos"
          title={
            <>
              Potência com <span className="text-gradient-brand">assinatura JR Sound</span>
            </>
          }
        />
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden card-premium p-10 flex flex-col items-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.12),transparent_65%)]" />
              <Image
                src="/logo.png"
                alt="JR Sound"
                width={480}
                height={320}
                className="relative w-full max-w-md h-auto drop-shadow-[0_0_40px_rgba(255,122,0,0.45)] floaty"
              />
              <Equalizer bars={32} className="relative h-10 w-full max-w-md mt-8 opacity-60 justify-between" barClassName="w-1.5" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="space-y-6 text-lg text-foreground/85 font-medium leading-relaxed">
              <p>
                A <strong className="text-brand-bright">JR Sound Som e Acessórios</strong> é
                especializada em projetos e montagem de som automotivo de alto padrão. Do grave
                encorpado do dia a dia aos trios de competição, cada projeto nasce de um desenho
                técnico e termina em um acabamento de vitrine.
              </p>
              <p>
                Unimos engenharia acústica, marcenaria de precisão e instalação elétrica
                profissional. Com o nosso <strong className="text-gradient-gold">configurador 3D</strong>,
                você participa do projeto do início ao fim: escolhe o formato da caixa, os
                falantes, o acabamento e recebe os cálculos técnicos na hora.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                {stats.map((s) => (
                  <div key={s.l} className="text-center">
                    <div className="font-[family-name:var(--font-orbitron)] text-3xl font-extrabold text-gradient-brand">
                      {s.n}
                    </div>
                    <div className="text-sm text-muted mt-1 uppercase tracking-wider">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
