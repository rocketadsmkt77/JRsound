import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import MusicPlayer from "@/components/MusicPlayer";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JR Sound — Som e Acessórios | Projetos de Som Automotivo",
  description:
    "Monte sua caixa de som personalizada em 3D, visualize em tempo real e solicite seu orçamento. Projetos, montagem e instalação de som automotivo de alto padrão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${orbitron.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <MusicPlayer />
        <PageTracker />
      </body>
    </html>
  );
}
