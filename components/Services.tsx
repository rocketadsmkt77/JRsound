"use client";

import { Reveal, SectionTitle } from "./Reveal";
import { site, whatsappLink } from "@/lib/site";

const services = [
  {
    title: "Projetos Personalizados",
    desc: "Projeto acústico completo com desenho 3D, cálculo de volume, sintonia e litragem ideal para o seu falante.",
    icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  },
  {
    title: "Montagem de Caixas",
    desc: "Marcenaria de precisão em MDF, dutadas, seladas, trios e canhões com reforços internos e vedação total.",
    icon: "M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9zM9 21V12h6v9",
  },
  {
    title: "Instalação Profissional",
    desc: "Instalação de módulos, fontes, baterias e chicotes com dimensionamento correto e proteção elétrica.",
    icon: "M13 2L4.5 12.5H11L10 22l8.5-10.5H12L13 2z",
  },
  {
    title: "Regulagem de Módulos",
    desc: "Ajuste fino de ganho, corte de frequência e alinhamento para extrair o máximo sem queimar equipamento.",
    icon: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  },
  {
    title: "Venda de Equipamentos",
    desc: "Falantes, módulos, tweeters, drivers, baterias e acessórios das melhores marcas do mercado.",
    icon: "M6 6h15l-1.5 9h-12L6 6zM6 6L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zM18 20a1 1 0 100-2 1 1 0 000 2z",
  },
  {
    title: "Upgrade de Som",
    desc: "Evolução do seu sistema atual: mais potência, mais definição e mais pressão sonora com segurança.",
    icon: "M13 7h8v8M21 7l-9 9-4-4-5 5",
  },
  {
    title: "Iluminação Automotiva",
    desc: "LED, strobo e iluminação ambiente sincronizada com o grave para um visual de outro nível.",
    icon: "M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1.2 2.1h4.6c.2-.9.6-1.6 1.2-2.1A6 6 0 0012 3z",
  },
  {
    title: "Acabamento Premium",
    desc: "Carpete, pintura automotiva, fibra, madeira naval e detalhes em LED com acabamento impecável.",
    icon: "M12 2l2.6 6.2L21 9l-5 4.4L17.2 20 12 16.6 6.8 20 8 13.4 3 9l6.4-.8L12 2z",
  },
];

export default function Services() {
  return (
    <section id="servicos" className="relative py-28 px-6">
      <div className="absolute inset-0 speaker-grid-bg opacity-60" />
      <div className="mx-auto max-w-7xl relative">
        <SectionTitle
          kicker="O que fazemos"
          title={
            <>
              Serviços de <span className="text-gradient-brand">alto padrão</span>
            </>
          }
          subtitle="Do projeto à regulagem final, tudo é feito dentro da JR Sound com garantia e acompanhamento."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) * 0.1}>
              <div className="card-premium rounded-2xl p-7 h-full group">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-brand-bright mb-5 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(255,122,0,0.6)]"
                >
                  <path d={s.icon} />
                </svg>
                <h3 className="font-[family-name:var(--font-orbitron)] text-base font-bold mb-3">
                  {s.title}
                </h3>
                <p className="text-muted text-[15px] font-medium leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="text-center mt-14">
          <a
            href={whatsappLink(`Olá, ${site.name}! Gostaria de saber mais sobre os serviços.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand inline-block rounded-full px-10 py-4 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.2em] text-black"
          >
            Solicitar Orçamento
          </a>
        </Reveal>
      </div>
    </section>
  );
}
