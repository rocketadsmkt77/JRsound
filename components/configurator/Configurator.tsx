"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useConfigurator } from "./store";
import { subscribeProducts } from "@/lib/client/repo";
import { Category, Product, categoryLabels } from "@/lib/products";
import { calcProject, money } from "./calc";
import { generatePdf, openWhatsAppQuote } from "./export";
import { BoxShape, FinishType, PlacedFace } from "./types";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto rounded-full border-2 border-brand border-t-transparent animate-spin" />
        <p className="mt-4 text-muted font-medium">Carregando estúdio 3D…</p>
      </div>
    </div>
  ),
});

type Tab = "formato" | "medidas" | "pecas" | "visual" | "resumo";

const shapes: { id: BoxShape; label: string; desc: string }[] = [
  { id: "reta", label: "Reta", desc: "Clássica, versátil" },
  { id: "trapezio", label: "Trapézio", desc: "Encaixe no porta-malas" },
  { id: "selada", label: "Selada", desc: "Grave seco e preciso" },
  { id: "dutada", label: "Dutada", desc: "Mais pressão sonora" },
  { id: "trio", label: "Trio", desc: "Grave + voz + agudo" },
  { id: "lateral", label: "Lateral", desc: "Vertical, canto do porta-malas" },
  { id: "canhao", label: "Canhão", desc: "Cilíndrica, visual agressivo" },
  { id: "personalizado", label: "Personalizado", desc: "Liberdade total" },
];

const finishes: { id: FinishType; label: string }[] = [
  { id: "carpete", label: "Carpete" },
  { id: "pintura", label: "Pintura" },
  { id: "madeira", label: "Madeira Naval" },
  { id: "fibra", label: "Fibra" },
  { id: "couro", label: "Couro" },
];

const boxColors = ["#1a1a1a", "#2b2b2b", "#4a4a4a", "#ff7a00", "#8b0000", "#0a2a4a", "#1e3a1e", "#f5f5f5", "#6b4a2b"];
const ledColors = ["#ff7a00", "#ff0000", "#00a2ff", "#00ff66", "#b400ff", "#ffffff", "#f5c453"];

export default function Configurator() {
  const state = useConfigurator();
  const { box, items, selected, projectCode, products, getProduct, setProducts } = state;
  const [tab, setTab] = useState<Tab>("formato");
  const [panelOpen, setPanelOpen] = useState(true);
  const calc = useMemo(() => calcProject(box, items, getProduct), [box, items, products]); // eslint-disable-line react-hooks/exhaustive-deps
  const sel = items.find((i) => i.uid === selected);
  const selProduct = sel ? getProduct(sel.productId) : undefined;

  // catálogo dinâmico: assina o repositório (tempo real no Firestore)
  useEffect(() => subscribeProducts(setProducts), [setProducts]);

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* ------- topo ------- */}
      <header className="relative z-30 flex items-center justify-between gap-3 px-4 sm:px-6 h-16 bg-black/90 backdrop-blur border-b border-line">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/"
            className="text-muted hover:text-brand-bright transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <Image src="/logo.png" alt="JR Sound" width={92} height={60} className="h-11 w-auto drop-shadow-[0_0_12px_rgba(255,122,0,0.5)]" />
          <div className="hidden md:block min-w-0">
            <p className="font-[family-name:var(--font-orbitron)] text-sm font-bold truncate">Configurador 3D</p>
            <p className="text-xs text-gold font-semibold tracking-widest">{projectCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => generatePdf(projectCode, box, items, calc, getProduct)}
            className="btn-ghost rounded-full px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider text-brand-bright"
          >
            <span className="hidden sm:inline">Baixar </span>PDF
          </button>
          <button
            onClick={() => openWhatsAppQuote(projectCode, box, items, calc, getProduct)}
            className="btn-brand rounded-full px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-wider text-black"
          >
            Solicitar Orçamento
          </button>
        </div>
      </header>

      <div className="relative flex-1 flex overflow-hidden">
        {/* ------- painel lateral ------- */}
        <aside
          className={`absolute lg:relative z-30 h-full overflow-hidden bg-surface/95 backdrop-blur-xl flex flex-col transition-[width] duration-300 ease-out ${
            panelOpen ? "w-[330px] sm:w-[360px] border-r border-line" : "w-0"
          }`}
        >
          {/* largura interna fixa: o conteúdo não encolhe durante a animação */}
          <div className="w-[330px] sm:w-[360px] h-full flex flex-col shrink-0">
            <nav className="flex border-b border-line">
              {(
                [
                  ["formato", "Formato"],
                  ["medidas", "Medidas"],
                  ["pecas", "Peças"],
                  ["visual", "Visual"],
                  ["resumo", "Resumo"],
                ] as [Tab, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex-1 py-3.5 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    tab === id
                      ? "text-brand-bright border-brand"
                      : "text-muted border-transparent hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {tab === "formato" && <ShapeTab />}
              {tab === "medidas" && <DimensionsTab />}
              {tab === "pecas" && <LibraryTab />}
              {tab === "visual" && <AppearanceTab />}
              {tab === "resumo" && <SummaryTab calc={calc} />}
            </div>
          </div>
        </aside>

        {/* toggle painel */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className={`absolute z-30 top-4 transition-all duration-300 ${panelOpen ? "left-[334px] sm:left-[364px]" : "left-4"} w-9 h-9 rounded-full bg-surface-2 border border-line flex items-center justify-center text-brand hover:border-brand`}
          aria-label="Alternar painel"
        >
          <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-transform ${panelOpen ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* ------- viewport 3D ------- */}
        <div id="scene-canvas" className="flex-1 relative">
          <Scene />

          {/* controles de cena */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <SceneToggle
                active={state.showGrid}
                onClick={() => state.setShowGrid(!state.showGrid)}
                label="Grade"
              />
              <SceneToggle
                active={state.snap}
                onClick={() => state.setSnap(!state.snap)}
                label="Snap"
              />
            </div>
            <div className="bg-black/70 backdrop-blur rounded-full px-4 py-2 flex items-center gap-3 border border-line">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold" fill="currentColor">
                <path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <input
                type="range"
                min={0.2}
                max={2}
                step={0.05}
                value={state.lightIntensity}
                onChange={(e) => state.setLightIntensity(+e.target.value)}
                className="w-24"
                style={{ ["--fill" as string]: `${((state.lightIntensity - 0.2) / 1.8) * 100}%` }}
              />
            </div>
          </div>

          {/* cálculos ao vivo */}
          <div className="absolute bottom-4 right-4 z-20 hidden sm:block w-64 bg-black/75 backdrop-blur-xl rounded-2xl border border-line p-4 space-y-2">
            <p className="font-[family-name:var(--font-orbitron)] text-[10px] font-bold uppercase tracking-[0.25em] text-gradient-gold">
              Projeto ao vivo
            </p>
            <LiveRow label="Volume útil" value={`${calc.netVolume.toFixed(1)} L`} />
            {calc.tuning !== null && <LiveRow label="Sintonia" value={`${calc.tuning.toFixed(1)} Hz`} />}
            <LiveRow label="MDF" value={`${calc.mdfArea.toFixed(2)} m²`} />
            <LiveRow label="Peso" value={`${calc.weight.toFixed(1)} kg`} />
            <div className="pt-2 border-t border-line flex justify-between items-baseline">
              <span className="text-xs text-muted font-semibold uppercase">Estimado</span>
              <span className="font-[family-name:var(--font-orbitron)] font-extrabold text-gradient-brand text-lg">
                {money(calc.price.total)}
              </span>
            </div>
          </div>

          {/* alertas */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-lg space-y-2 pointer-events-none">
            {calc.alerts
              .filter((a) => a.level !== "info")
              .slice(0, 2)
              .map((a, i) => (
                <div
                  key={i}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur border ${
                    a.level === "error"
                      ? "bg-red-950/80 border-red-500/50 text-red-200"
                      : "bg-amber-950/80 border-amber-500/50 text-amber-200"
                  }`}
                >
                  {a.level === "error" ? "⛔ " : "⚠️ "}
                  {a.text}
                </div>
              ))}
          </div>

          {/* barra do item selecionado */}
          <AnimatePresence>
            {sel && (
              <motion.div
                initial={{ y: 90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 90, opacity: 0 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/85 backdrop-blur-xl rounded-2xl border border-brand/40 shadow-[0_0_30px_rgba(255,122,0,0.2)] px-5 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 max-w-[94%]"
              >
                <span className="font-[family-name:var(--font-orbitron)] text-xs font-bold text-brand-bright whitespace-nowrap">
                  {selProduct?.nome ?? "Peça"}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted font-semibold">Face</span>
                  {(
                    [
                      ["front", "Frente"],
                      ["back", "Trás"],
                      ["left", "Esq."],
                      ["right", "Dir."],
                      ["top", "Topo"],
                    ] as [PlacedFace, string][]
                  ).map(([f, l]) => (
                    <button
                      key={f}
                      onClick={() => state.updateItem(sel.uid, { face: f, x: 0, y: 0 })}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                        (sel.face ?? "front") === f
                          ? "bg-brand text-black shadow-[0_0_10px_rgba(255,122,0,0.5)]"
                          : "bg-surface-2 border border-line text-muted hover:text-foreground hover:border-brand/40"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs text-muted font-semibold">
                  Girar
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={sel.rotation}
                    onChange={(e) => state.updateItem(sel.uid, { rotation: +e.target.value })}
                    className="w-20"
                    style={{ ["--fill" as string]: `${(sel.rotation / 360) * 100}%` }}
                  />
                </label>
                {(selProduct?.redimensionavel ?? true) && (
                  <label className="flex items-center gap-2 text-xs text-muted font-semibold">
                    Tamanho
                    <input
                      type="range"
                      min={0.5}
                      max={1.8}
                      step={0.05}
                      value={sel.scale}
                      onChange={(e) => state.updateItem(sel.uid, { scale: +e.target.value })}
                      className="w-20"
                      style={{ ["--fill" as string]: `${((sel.scale - 0.5) / 1.3) * 100}%` }}
                    />
                  </label>
                )}
                <div className="flex items-center gap-2">
                  <ToolBtn onClick={() => state.duplicateItem(sel.uid)} title="Duplicar">
                    <path d="M8 8h12v12H8zM4 16V4h12" />
                  </ToolBtn>
                  <ToolBtn onClick={() => state.removeItem(sel.uid)} title="Excluir" danger>
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
                  </ToolBtn>
                  <ToolBtn onClick={() => state.select(null)} title="Fechar">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </ToolBtn>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* dica */}
          {!sel && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center text-xs text-muted/80 font-medium bg-black/50 backdrop-blur rounded-full px-5 py-2 pointer-events-none hidden sm:block">
              Arraste para girar a câmera • Scroll para zoom • Arraste uma peça por qualquer face da caixa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- abas ---------------- */

function ShapeTab() {
  const { box, setShape } = useConfigurator();
  return (
    <div>
      <PanelTitle title="Formato da caixa" sub="Escolha o ponto de partida do seu projeto" />
      <div className="grid grid-cols-2 gap-3">
        {shapes.map((sh) => (
          <button
            key={sh.id}
            onClick={() => setShape(sh.id)}
            className={`rounded-xl p-4 text-left border transition-all ${
              box.shape === sh.id
                ? "border-brand bg-brand/10 shadow-[0_0_18px_rgba(255,122,0,0.25)]"
                : "border-line bg-surface-2 hover:border-brand/40"
            }`}
          >
            <ShapeIcon shape={sh.id} active={box.shape === sh.id} />
            <p className="font-[family-name:var(--font-orbitron)] text-xs font-bold mt-2">{sh.label}</p>
            <p className="text-[11px] text-muted font-medium mt-0.5">{sh.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DimensionsTab() {
  const { box, setBox } = useConfigurator();
  return (
    <div className="space-y-6">
      <PanelTitle title="Medidas" sub="Dimensões externas da caixa" />
      <Slider label="Largura" unit="cm" min={30} max={200} value={box.width} onChange={(v) => setBox({ width: v })} />
      <Slider label="Altura" unit="cm" min={20} max={150} value={box.height} onChange={(v) => setBox({ height: v })} />
      <Slider label="Profundidade" unit="cm" min={20} max={120} value={box.depth} onChange={(v) => setBox({ depth: v })} />

      <PanelTitle title="Estrutura" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Espessura do MDF</p>
        <div className="flex flex-wrap gap-2">
          {[9, 12, 15, 18, 25].map((t) => (
            <Chip key={t} active={box.thickness === t} onClick={() => setBox({ thickness: t })}>
              {t}mm
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Cantos arredondados</span>
        <Toggle checked={box.roundedCorners} onChange={(v) => setBox({ roundedCorners: v })} />
      </div>
      <Slider label="Divisórias internas" unit="" min={0} max={4} value={box.dividers} onChange={(v) => setBox({ dividers: v })} />
      <Slider label="Reforços internos" unit="" min={0} max={6} value={box.braces} onChange={(v) => setBox({ braces: v })} />

      <PanelTitle title="Dutos" sub="Sintonia calculada em tempo real" />
      <Slider label="Quantidade" unit="" min={0} max={6} value={box.port.count} onChange={(v) => setBox({ port: { ...box.port, count: v } })} />
      <Slider label="Diâmetro" unit="cm" min={5} max={30} value={box.port.diameter} onChange={(v) => setBox({ port: { ...box.port, diameter: v } })} />
      <Slider label="Comprimento" unit="cm" min={10} max={100} value={box.port.length} onChange={(v) => setBox({ port: { ...box.port, length: v } })} />
    </div>
  );
}

function LibraryTab() {
  const { addItem, items, products, productsLoaded } = useConfigurator();
  const [cat, setCat] = useState<Category | "todos">("todos");
  // só mostra categorias que possuem produtos cadastrados e ativos
  const cats = useMemo(() => {
    const present = new Set(products.map((p) => p.categoria));
    return (Object.keys(categoryLabels) as Category[]).filter((c) => present.has(c));
  }, [products]);
  const list = cat === "todos" ? products : products.filter((p) => p.categoria === cat);

  if (!productsLoaded) {
    return (
      <div className="py-16 text-center">
        <div className="w-10 h-10 mx-auto rounded-full border-2 border-brand border-t-transparent animate-spin" />
        <p className="mt-4 text-muted text-sm font-medium">Carregando catálogo…</p>
      </div>
    );
  }

  return (
    <div>
      <PanelTitle title="Biblioteca de peças" sub="Clique para adicionar à caixa — depois arraste no 3D" />
      <div className="flex flex-wrap gap-1.5 mb-4">
        <Chip active={cat === "todos"} onClick={() => setCat("todos")} small>
          Todos
        </Chip>
        {cats.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)} small>
            {categoryLabels[c]}
          </Chip>
        ))}
      </div>
      {list.length === 0 && (
        <p className="text-muted text-sm font-medium py-8 text-center">
          Nenhum produto ativo nesta categoria. Cadastre no painel administrativo.
        </p>
      )}
      <div className="space-y-2">
        {list.map((p) => {
          const count = items.filter((i) => i.productId === p.id).length;
          return (
            <button
              key={p.id}
              onClick={() => addItem(p.id)}
              className="w-full flex items-center gap-3 rounded-xl border border-line bg-surface-2 hover:border-brand/50 hover:bg-brand/5 transition-all px-3 py-2.5 text-left group"
            >
              <ProductThumb product={p} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.nome}</p>
                <p className="text-[11px] text-muted font-medium truncate">
                  {[p.marca, p.modelo].filter(Boolean).join(" ")} •{" "}
                  {p.diametro > 0
                    ? `Ø${p.diametro}cm`
                    : `${p.largura}×${p.altura}×${p.profundidade}cm`}
                </p>
                <p className="text-[11px] text-gold font-bold">{money(p.preco)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {count > 0 && (
                  <span className="text-[10px] font-bold bg-brand/20 text-brand-bright rounded-full px-2 py-0.5">
                    {count}x
                  </span>
                )}
                <span className="w-7 h-7 rounded-full bg-brand/15 text-brand-bright flex items-center justify-center font-bold group-hover:bg-brand group-hover:text-black transition-all">
                  +
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductThumb({ product }: { product: Product }) {
  if (product.imagem) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.imagem}
        alt={product.nome}
        loading="lazy"
        className="w-12 h-12 rounded-lg object-cover border border-line shrink-0 bg-black"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-lg border border-line shrink-0 bg-black flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-brand/70" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>
    </div>
  );
}

function AppearanceTab() {
  const { box, setBox } = useConfigurator();
  return (
    <div className="space-y-6">
      <PanelTitle title="Acabamento" sub="Revestimento externo da caixa" />
      <div className="flex flex-wrap gap-2">
        {finishes.map((f) => (
          <Chip key={f.id} active={box.finish === f.id} onClick={() => setBox({ finish: f.id })}>
            {f.label}
          </Chip>
        ))}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Cor da caixa</p>
        <div className="flex flex-wrap gap-2">
          {boxColors.map((c) => (
            <ColorDot key={c} color={c} active={box.color === c} onClick={() => setBox({ color: c })} />
          ))}
          <label className="w-9 h-9 rounded-full border border-dashed border-muted/50 flex items-center justify-center cursor-pointer text-muted text-lg hover:border-brand">
            +
            <input
              type="color"
              className="sr-only"
              value={box.color}
              onChange={(e) => setBox({ color: e.target.value })}
            />
          </label>
        </div>
      </div>

      <PanelTitle title="Iluminação LED" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">LED ativo</span>
        <Toggle checked={box.ledOn} onChange={(v) => setBox({ ledOn: v })} />
      </div>
      {box.ledOn && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Cor do LED</p>
          <div className="flex flex-wrap gap-2">
            {ledColors.map((c) => (
              <ColorDot key={c} color={c} active={box.ledColor === c} onClick={() => setBox({ ledColor: c })} glow />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryTab({ calc }: { calc: ReturnType<typeof calcProject> }) {
  const { box, items, projectCode, reset } = useConfigurator();
  return (
    <div className="space-y-6">
      <PanelTitle title="Resumo do projeto" sub={`Código ${projectCode}`} />

      <div className="rounded-xl border border-line bg-surface-2 p-4 space-y-1.5">
        <SummaryRow k="Volume interno bruto" v={`${calc.grossVolume.toFixed(1)} L`} />
        <SummaryRow k="Deslocado (falantes)" v={`− ${calc.speakerDisplacement.toFixed(1)} L`} />
        <SummaryRow k="Deslocado (dutos)" v={`− ${calc.portDisplacement.toFixed(1)} L`} />
        <SummaryRow k="Deslocado (estrutura)" v={`− ${calc.structureDisplacement.toFixed(1)} L`} />
        <div className="border-t border-line pt-1.5">
          <SummaryRow k="Volume útil" v={`${calc.netVolume.toFixed(1)} L`} strong />
        </div>
        {calc.tuning !== null && <SummaryRow k="Sintonia da caixa" v={`${calc.tuning.toFixed(1)} Hz`} strong />}
        {box.port.count > 0 && (
          <>
            <SummaryRow k="Área dos dutos" v={`${calc.portArea.toFixed(0)} cm²`} />
            <SummaryRow k="Comprimento dos dutos" v={`${calc.portLength} cm`} />
          </>
        )}
        <SummaryRow k="MDF necessário" v={`${calc.mdfArea.toFixed(2)} m² (${calc.mdfSheets} chapa${calc.mdfSheets > 1 ? "s" : ""})`} />
        <SummaryRow k="Parafusos" v={`${calc.screws} un`} />
        <SummaryRow k="Cola" v={`${calc.glueGrams} g`} />
        {calc.carpetArea > 0 && <SummaryRow k="Carpete" v={`${calc.carpetArea.toFixed(2)} m²`} />}
        <SummaryRow k="Peso aproximado" v={`${calc.weight.toFixed(1)} kg`} />
        <SummaryRow k="Tempo de fabricação" v={`~${calc.fabricationDays} dias úteis`} />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Alertas do projeto</p>
        <div className="space-y-2">
          {calc.alerts.map((a, i) => (
            <div
              key={i}
              className={`text-xs font-semibold rounded-lg px-3 py-2 border ${
                a.level === "error"
                  ? "bg-red-950/50 border-red-500/40 text-red-200"
                  : a.level === "warn"
                  ? "bg-amber-950/50 border-amber-500/40 text-amber-200"
                  : "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              }`}
            >
              {a.text}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Lista de materiais</p>
        <div className="rounded-xl border border-line overflow-hidden">
          {calc.materials.map((m, i) => (
            <div
              key={i}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 text-xs ${i % 2 ? "bg-surface-2" : "bg-surface"}`}
            >
              <div className="min-w-0">
                <p className="font-bold truncate">{m.name}</p>
                <p className="text-muted font-medium">{m.qty} — {m.detail}</p>
              </div>
              <span className="font-bold text-gold whitespace-nowrap">{money(m.price)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-3 bg-brand/15 border-t border-brand/30">
            <span className="font-[family-name:var(--font-orbitron)] text-xs font-bold uppercase">Total estimado</span>
            <span className="font-[family-name:var(--font-orbitron)] font-extrabold text-gradient-brand">
              {money(calc.price.total)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted font-medium">
        {items.length} componente{items.length !== 1 ? "s" : ""} no projeto. Valores preliminares —
        a equipe JR Sound confirma tudo antes de fechar.
      </p>

      <button
        onClick={reset}
        className="w-full rounded-xl border border-red-500/40 text-red-300 hover:bg-red-950/40 transition-colors py-3 text-xs font-bold uppercase tracking-wider"
      >
        Recomeçar projeto
      </button>
    </div>
  );
}

/* ---------------- átomos ---------------- */

function PanelTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-wider text-gradient-brand">
        {title}
      </h3>
      {sub && <p className="text-xs text-muted font-medium mt-1">{sub}</p>}
    </div>
  );
}

function Slider({
  label,
  unit,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
        <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold text-brand-bright">
          {value}
          <span className="text-[10px] text-muted ml-0.5">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full"
        style={{ ["--fill" as string]: `${((value - min) / (max - min)) * 100}%` }}
      />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full font-bold uppercase tracking-wider transition-all ${
        small ? "px-3 py-1 text-[10px]" : "px-4 py-1.5 text-xs"
      } ${
        active
          ? "bg-brand text-black shadow-[0_0_14px_rgba(255,122,0,0.5)]"
          : "bg-surface-2 border border-line text-muted hover:text-foreground hover:border-brand/40"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6.5 rounded-full transition-colors ${
        checked ? "bg-brand shadow-[0_0_12px_rgba(255,122,0,0.6)]" : "bg-surface-2 border border-line"
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white transition-all ${
          checked ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  );
}

function ColorDot({
  color,
  active,
  onClick,
  glow,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
  glow?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={color}
      className={`w-9 h-9 rounded-full border-2 transition-all ${
        active ? "border-brand scale-110" : "border-line hover:scale-105"
      }`}
      style={{
        background: color,
        boxShadow: glow ? `0 0 14px ${color}` : active ? `0 0 12px ${color}88` : undefined,
      }}
    />
  );
}

function SceneToggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider backdrop-blur border transition-all ${
        active
          ? "bg-brand/20 border-brand/60 text-brand-bright shadow-[0_0_14px_rgba(255,122,0,0.3)]"
          : "bg-black/60 border-line text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function ToolBtn({
  onClick,
  title,
  danger,
  children,
}: {
  onClick: () => void;
  title: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
        danger
          ? "border-red-500/40 text-red-300 hover:bg-red-950/50"
          : "border-line text-muted hover:text-brand-bright hover:border-brand/50"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        {children}
      </svg>
    </button>
  );
}

function LiveRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs text-muted font-semibold">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function SummaryRow({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-2 text-xs">
      <span className={`font-semibold ${strong ? "text-foreground" : "text-muted"}`}>{k}</span>
      <span className={`font-bold whitespace-nowrap ${strong ? "text-gradient-brand font-[family-name:var(--font-orbitron)]" : ""}`}>
        {v}
      </span>
    </div>
  );
}

function ShapeIcon({ shape, active }: { shape: BoxShape; active: boolean }) {
  const c = active ? "#ff9500" : "#666";
  const paths: Record<BoxShape, React.ReactNode> = {
    reta: <rect x="4" y="12" width="32" height="18" rx="1" />,
    trapezio: <path d="M4 30V16l8-4h24v18H4z" />,
    selada: (
      <>
        <rect x="6" y="12" width="28" height="18" rx="1" />
        <circle cx="20" cy="21" r="6" />
      </>
    ),
    dutada: (
      <>
        <rect x="4" y="12" width="32" height="18" rx="1" />
        <circle cx="14" cy="21" r="6" />
        <circle cx="28" cy="21" r="3.5" />
      </>
    ),
    trio: (
      <>
        <rect x="4" y="8" width="32" height="24" rx="1" />
        <line x1="15" y1="8" x2="15" y2="32" />
        <line x1="26" y1="8" x2="26" y2="32" />
      </>
    ),
    lateral: <path d="M10 32V12l14-6v26H10z" />,
    canhao: (
      <>
        <ellipse cx="10" cy="21" rx="5" ry="9" />
        <path d="M10 12h22M10 30h22" />
        <ellipse cx="32" cy="21" rx="4" ry="9" />
      </>
    ),
    personalizado: (
      <path d="M6 26l6-10 8 4 6-8 8 6v10H6z" strokeDasharray="3 2" />
    ),
  };
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" stroke={c} strokeWidth="1.8">
      {paths[shape]}
    </svg>
  );
}
