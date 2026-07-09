"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/configurador", label: "Configurador 3D", highlight: true },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#contato", label: "Contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const left = links.slice(0, 3);
  const right = links.slice(3);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/85 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="glow-line absolute bottom-0 inset-x-0 opacity-60" />
      <nav className="mx-auto max-w-7xl px-4">
        {/* desktop: links left — logo center — links right */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-24">
          <ul className="flex items-center justify-end gap-10 pr-12">
            {left.map((l) => (
              <li key={l.href}>
                <NavLink {...l} />
              </li>
            ))}
          </ul>
          <Link href="/#home" className="relative block">
            <div className="absolute -inset-4 rounded-full bg-brand/20 blur-2xl neon-pulse" />
            <Image
              src="/logo.png"
              alt="JR Sound — Som e Acessórios"
              width={150}
              height={100}
              priority
              className="relative h-20 w-auto drop-shadow-[0_0_18px_rgba(255,122,0,0.55)]"
            />
          </Link>
          <ul className="flex items-center justify-start gap-10 pl-12">
            {right.map((l) => (
              <li key={l.href}>
                <NavLink {...l} />
              </li>
            ))}
          </ul>
        </div>

        {/* mobile */}
        <div className="lg:hidden flex items-center justify-between h-20">
          <Link href="/#home">
            <Image
              src="/logo.png"
              alt="JR Sound"
              width={110}
              height={74}
              priority
              className="h-14 w-auto drop-shadow-[0_0_14px_rgba(255,122,0,0.5)]"
            />
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1.5 p-2"
          >
            <span className={`h-0.5 w-7 bg-brand transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-7 bg-brand transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-7 bg-brand transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-t border-line"
          >
            <ul className="px-6 py-6 space-y-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block text-lg font-semibold tracking-widest uppercase ${
                      l.highlight ? "text-gradient-brand" : "text-foreground/90 hover:text-brand"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, label, highlight }: { href: string; label: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative text-sm font-semibold tracking-[0.2em] uppercase transition-colors ${
        highlight ? "text-gradient-brand" : "text-foreground/80 hover:text-white"
      }`}
    >
      {label}
      <span className="absolute -bottom-2 left-0 h-px w-0 bg-gradient-to-r from-brand to-gold transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(255,122,0,0.9)]" />
    </Link>
  );
}
