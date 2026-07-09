"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 32,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <Reveal className="text-center mb-16">
      <p className="font-[family-name:var(--font-orbitron)] text-xs font-bold uppercase tracking-[0.4em] text-gradient-gold mb-4">
        {kicker}
      </p>
      <h2 className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-5xl font-extrabold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted font-medium">{subtitle}</p>
      )}
      <div className="glow-line mx-auto mt-8 w-40" />
    </Reveal>
  );
}
