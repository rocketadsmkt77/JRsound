import Image from "next/image";
import Link from "next/link";
import Equalizer from "./Equalizer";
import { site, whatsappLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-black/60 overflow-hidden">
      <div className="glow-line absolute top-0 inset-x-0" />
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-[0.07]">
        <Equalizer bars={48} className="h-40 w-full max-w-5xl justify-between" barClassName="w-2" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-3 items-start">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Image src="/logo.png" alt="JR Sound" width={190} height={126} className="h-24 w-auto drop-shadow-[0_0_20px_rgba(255,122,0,0.4)]" />
          <p className="text-muted text-sm font-medium text-center md:text-left max-w-xs">
            Projetos e montagem de som automotivo de alto padrão. Potência, tecnologia e
            acabamento premium.
          </p>
        </div>
        <div className="text-center">
          <h4 className="font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.3em] text-gradient-gold mb-5">
            Navegação
          </h4>
          <ul className="space-y-3 text-foreground/75 font-medium">
            <li><Link href="/#home" className="hover:text-brand-bright transition-colors">Home</Link></li>
            <li><Link href="/#sobre" className="hover:text-brand-bright transition-colors">Sobre</Link></li>
            <li><Link href="/#servicos" className="hover:text-brand-bright transition-colors">Serviços</Link></li>
            <li><Link href="/configurador" className="hover:text-brand-bright transition-colors">Configurador 3D</Link></li>
            <li><Link href="/#galeria" className="hover:text-brand-bright transition-colors">Galeria</Link></li>
            <li><Link href="/#contato" className="hover:text-brand-bright transition-colors">Contato</Link></li>
          </ul>
        </div>
        <div className="text-center md:text-right">
          <h4 className="font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.3em] text-gradient-gold mb-5">
            Contato
          </h4>
          <ul className="space-y-3 text-foreground/75 font-medium">
            <li>
              <a href={whatsappLink(`Olá, ${site.name}!`)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-bright transition-colors">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-bright transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <Link href="/admin" className="text-muted/60 hover:text-brand-bright transition-colors text-sm">
                Área administrativa
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-line py-6 text-center text-sm text-muted font-medium">
        © {new Date().getFullYear()} {site.fullName}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
