"use client";

import { useState } from "react";
import { Reveal, SectionTitle } from "./Reveal";
import { site, whatsappLink } from "@/lib/site";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Olá, ${site.name}! Me chamo ${form.name}.\nAssunto: ${form.subject}\nTelefone: ${form.phone}\n\n${form.message}`;
    window.open(whatsappLink(msg), "_blank");
  };

  const input =
    "w-full rounded-xl bg-surface-2 border border-line px-5 py-3.5 text-foreground font-medium placeholder:text-muted/60 focus:outline-none focus:border-brand focus:shadow-[0_0_16px_rgba(255,122,0,0.25)] transition-all";

  return (
    <section id="contato" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_80%_30%,rgba(255,122,0,0.10),transparent_70%)]" />
      <div className="mx-auto max-w-7xl relative">
        <SectionTitle
          kicker="Fale conosco"
          title={
            <>
              Vamos <span className="text-gradient-brand">projetar seu som</span>
            </>
          }
          subtitle="Chame no WhatsApp, mande sua ideia pelo formulário ou venha nos visitar."
        />

        <div className="grid lg:grid-cols-2 gap-10">
          <Reveal>
            <form onSubmit={submit} className="card-premium rounded-3xl p-8 sm:p-10 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  required
                  className={input}
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  className={input}
                  placeholder="Seu WhatsApp"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <select
                required
                className={input}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                <option value="" disabled>
                  Assunto
                </option>
                <option>Projeto de caixa personalizada</option>
                <option>Instalação de som</option>
                <option>Compra de equipamentos</option>
                <option>Upgrade do sistema atual</option>
                <option>Iluminação automotiva</option>
                <option>Outro</option>
              </select>
              <textarea
                required
                rows={5}
                className={input}
                placeholder="Conte sobre o seu projeto: carro, falantes que já possui, o que procura..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button
                type="submit"
                className="btn-brand w-full rounded-xl py-4 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.2em] text-black"
              >
                Enviar pelo WhatsApp
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.15} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <a
                href={whatsappLink(`Olá, ${site.name}!`)}
                target="_blank"
                rel="noopener noreferrer"
                className="card-premium rounded-2xl p-7 block"
              >
                <ContactIcon path="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2zM8.5 7.5c.3-.7.7-.7 1-.7h.8c.3 0 .6.1.8.6l1 2.3c.1.3 0 .6-.2.8l-.7.8c-.2.2-.2.5-.1.7a8.7 8.7 0 003.6 3.5c.3.1.6.1.8-.1l.8-.8c.2-.2.5-.3.8-.1l2.3 1c.4.2.6.4.6.7v.9c0 .3 0 .7-.7 1-.7.4-2 .8-3.5.3a13.6 13.6 0 01-6.8-5.5c-1-1.6-1.2-3-1-3.9.1-.6.3-1.1.5-1.5z" />
                <h3 className="font-[family-name:var(--font-orbitron)] font-bold mb-1">WhatsApp</h3>
                <p className="text-muted text-sm font-medium">Resposta rápida em horário comercial</p>
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="card-premium rounded-2xl p-7 block"
              >
                <ContactIcon path="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.8A4.2 4.2 0 1016.2 12 4.2 4.2 0 0012 7.8zm5.5-2.3a1 1 0 11-1 1 1 1 0 011-1z" />
                <h3 className="font-[family-name:var(--font-orbitron)] font-bold mb-1">Instagram</h3>
                <p className="text-muted text-sm font-medium">Projetos novos toda semana</p>
              </a>
              <div className="card-premium rounded-2xl p-7">
                <ContactIcon path="M12 2a8 8 0 00-8 8c0 5.4 7 11.5 7.3 11.8a1 1 0 001.4 0C13 21.5 20 15.4 20 10a8 8 0 00-8-8zm0 11a3 3 0 113-3 3 3 0 01-3 3z" />
                <h3 className="font-[family-name:var(--font-orbitron)] font-bold mb-1">Onde estamos</h3>
                <p className="text-muted text-sm font-medium">Veja o mapa abaixo e venha nos visitar</p>
              </div>
              <div className="card-premium rounded-2xl p-7">
                <ContactIcon path="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 10.6l4.2 2.4-1 1.7L11 13.5V6h2v6.6z" />
                <h3 className="font-[family-name:var(--font-orbitron)] font-bold mb-1">Horários</h3>
                <ul className="text-muted text-sm font-medium space-y-1 mt-2">
                  {site.hours.map((h) => (
                    <li key={h.d} className="flex justify-between gap-3">
                      <span>{h.d}</span>
                      <span className="text-foreground/80">{h.h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-premium rounded-2xl overflow-hidden h-72">
              <iframe
                title="Localização JR Sound"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`}
                className="w-full h-full grayscale-[0.4] contrast-[1.05] opacity-90"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-9 h-9 mb-4 text-brand-bright fill-current drop-shadow-[0_0_10px_rgba(255,122,0,0.6)]">
      <path d={path} />
    </svg>
  );
}
