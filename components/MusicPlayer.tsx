"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Player flutuante da música do site (public/musica.mp3).
 *
 * - Toca em loop; tenta iniciar sozinho e, se o navegador bloquear
 *   autoplay, começa no primeiro clique/toque do visitante.
 * - Botão de pausar/despausar e controle de volume (expande ao passar
 *   o mouse). Preferências ficam salvas no navegador.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [open, setOpen] = useState(false);
  const userPausedRef = useRef(false);

  // restaura preferências e tenta iniciar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const savedVol = localStorage.getItem("jr-music-vol");
    const vol = savedVol !== null ? Math.min(1, Math.max(0, +savedVol)) : 0.4;
    setVolume(vol);
    audio.volume = vol;

    userPausedRef.current = localStorage.getItem("jr-music-paused") === "1";

    const tryPlay = () => {
      if (userPausedRef.current) return;
      audio.play().then(() => setPlaying(true)).catch(() => {
        /* autoplay bloqueado — aguarda interação */
      });
    };

    tryPlay();

    // navegadores bloqueiam autoplay com som: inicia na primeira interação
    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      userPausedRef.current = true;
      localStorage.setItem("jr-music-paused", "1");
    } else {
      userPausedRef.current = false;
      localStorage.setItem("jr-music-paused", "0");
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    localStorage.setItem("jr-music-vol", String(v));
  };

  return (
    <div
      className="fixed bottom-5 left-5 z-[60] flex items-center gap-3"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <audio ref={audioRef} src="/musica.mp3" loop preload="auto" />

      {/* botão play/pause */}
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        title={playing ? "Pausar música" : "Tocar música"}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          playing
            ? "btn-brand text-black"
            : "bg-black/80 backdrop-blur border border-brand/50 text-brand-bright hover:border-brand"
        }`}
      >
        {playing ? (
          <span className="flex items-end gap-[3px] h-4" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[3px] rounded-sm bg-black eq-bar"
                style={{ height: "100%", animationDelay: `${i * 0.18}s`, background: "#000" }}
              />
            ))}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current ml-0.5">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        )}
      </button>

      {/* volume — expande no hover ou quando pausado o mouse passa */}
      <div
        className={`flex items-center gap-2 rounded-full bg-black/85 backdrop-blur border border-line px-4 h-11 transition-all duration-300 origin-left ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <button
          onClick={() => changeVolume(volume === 0 ? 0.4 : 0)}
          aria-label={volume === 0 ? "Ativar som" : "Silenciar"}
          className="text-brand-bright"
        >
          {volume === 0 ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M4 9v6h4l5 5V4L8 9H4zm12.6 3l3.2 3.2-1.4 1.4-3.2-3.2-3.2 3.2-1.4-1.4 3.2-3.2-3.2-3.2 1.4-1.4 3.2 3.2 3.2-3.2 1.4 1.4L16.6 12z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M4 9v6h4l5 5V4L8 9H4zm11.5 3a3.5 3.5 0 00-2.5-3.35v6.69A3.5 3.5 0 0015.5 12zM13 3.23v2.06a7 7 0 010 13.42v2.06a9 9 0 000-17.54z" />
            </svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => changeVolume(+e.target.value)}
          aria-label="Volume da música"
          className="w-24"
          style={{ ["--fill" as string]: `${volume * 100}%` }}
        />
      </div>
    </div>
  );
}
