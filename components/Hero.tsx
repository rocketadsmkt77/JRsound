"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Particles from "./Particles";
import Equalizer from "./Equalizer";
import { site, whatsappLink } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden speaker-grid-bg"
    >
      {/* ambient lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,122,0,0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_85%_80%,rgba(245,196,83,0.10),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_10%_75%,rgba(255,60,0,0.10),transparent_70%)]" />
      <Particles className="absolute inset-0 w-full h-full" />

      {/* giant speaker ring backdrop */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-brand/10 floaty" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full border border-gold/15" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-brand/15 neon-pulse" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-36 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <Image
            src="/logo.png"
            alt="JR Sound — Som e Acessórios"
            width={420}
            height={280}
            priority
            className="w-[280px] sm:w-[380px] h-auto drop-shadow-[0_0_45px_rgba(255,122,0,0.55)]"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="font-[family-name:var(--font-orbitron)] text-4xl sm:text-6xl font-800 font-extrabold leading-tight tracking-tight"
        >
          Seu projeto de <span className="text-gradient-brand">som automotivo</span>
          <br className="hidden sm:block" /> começa aqui.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted font-medium"
        >
          Monte sua caixa personalizada em 3D, visualize o resultado em tempo real e
          solicite seu orçamento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            href="/configurador"
            className="btn-brand rounded-full px-10 py-4 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.2em] text-black"
          >
            Montar Caixa
          </Link>
          <a
            href={whatsappLink(`Olá, ${site.name}! Quero um orçamento de som automotivo.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost rounded-full px-10 py-4 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.2em] text-brand-bright"
          >
            Falar no WhatsApp
          </a>
        </motion.div>
      </div>

      {/* bottom equalizer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 inset-x-0 flex justify-center gap-1 h-24 px-4 overflow-hidden"
      >
        <Equalizer bars={64} className="h-full w-full max-w-6xl justify-between opacity-40" barClassName="w-1 sm:w-2" />
      </motion.div>
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
