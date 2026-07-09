import { BoxConfig, PlacedItem } from "./types";
import { Product, categorySingular, faceOf, sizeOf } from "@/lib/products";

export interface Alert {
  level: "warn" | "error" | "info";
  text: string;
}

export interface ProjectCalc {
  grossVolume: number; // L (interno bruto)
  speakerDisplacement: number; // L
  portDisplacement: number; // L
  structureDisplacement: number; // L (divisórias + reforços)
  netVolume: number; // L útil
  tuning: number | null; // Hz
  portArea: number; // cm² total
  portLength: number; // cm
  mdfArea: number; // m²
  mdfSheets: number; // chapas 2,75 x 1,85
  screws: number;
  glueGrams: number;
  carpetArea: number; // m²
  weight: number; // kg
  price: {
    mdf: number;
    finish: number;
    hardware: number;
    components: number;
    labor: number;
    total: number;
  };
  fabricationDays: number;
  alerts: Alert[];
  materials: { name: string; qty: string; detail: string; price: number }[];
}

const MDF_SHEET_W = 275; // cm
const MDF_SHEET_H = 185; // cm
const MDF_DENSITY = 720; // kg/m³
const MDF_SHEET_PRICE: Record<number, number> = { 9: 190, 12: 240, 15: 290, 18: 350, 25: 520 };
const FINISH_PRICE_M2: Record<string, number> = {
  carpete: 45,
  pintura: 120,
  madeira: 160,
  fibra: 210,
  couro: 260,
};
const FINISH_LABEL: Record<string, string> = {
  carpete: "Carpete automotivo",
  pintura: "Pintura automotiva",
  madeira: "Madeira naval",
  fibra: "Fibra de vidro",
  couro: "Couro sintético",
};

const SPEAKER_CATS = ["subwoofer", "altofalante", "tweeter", "supertweeter", "driver", "corneta"];

export function calcProject(
  box: BoxConfig,
  items: PlacedItem[],
  getProduct: (id: string) => Product | undefined
): ProjectCalc {
  const t = box.thickness / 10; // cm
  const { width: W, height: H, depth: D } = box;
  const alerts: Alert[] = [];

  const placed = items
    .map((i) => ({ item: i, product: getProduct(i.productId) }))
    .filter((x): x is { item: PlacedItem; product: Product } => !!x.product);

  // volume interno bruto
  const iw = Math.max(W - 2 * t, 1);
  const ih = Math.max(H - 2 * t, 1);
  const id = Math.max(D - 2 * t, 1);
  let grossVolume: number;
  if (box.shape === "canhao") {
    const r = Math.min(H, W) / 2 - t;
    grossVolume = (Math.PI * r * r * Math.max(D - 2 * t, 1)) / 1000;
  } else if (box.shape === "trapezio" || box.shape === "lateral") {
    grossVolume = (iw * ih * id * 0.82) / 1000; // perfil trapezoidal ~82%
  } else {
    grossVolume = (iw * ih * id) / 1000;
  }

  // deslocamentos
  const speakers = placed.filter((x) => SPEAKER_CATS.includes(x.product.categoria));
  const speakerDisplacement = placed.reduce(
    (acc, x) => acc + x.product.volumeDeslocado * Math.pow(x.item.scale, 3),
    0
  );

  const portR = box.port.diameter / 2;
  const portAreaOne = Math.PI * portR * portR;
  const portArea = portAreaOne * box.port.count;
  const portDisplacement = (portArea * box.port.length) / 1000;

  const dividerVol = (box.dividers * (ih * id * t)) / 1000;
  const braceVol = (box.braces * (iw * t * 8)) / 1000; // réguas de 8cm
  const structureDisplacement = dividerVol + braceVol;

  const netVolume = Math.max(grossVolume - speakerDisplacement - portDisplacement - structureDisplacement, 0);

  // sintonia (Helmholtz) — dutos cilíndricos
  let tuning: number | null = null;
  if (box.port.count > 0 && netVolume > 0) {
    const Vb = netVolume * 1000; // cm³
    const Lef = box.port.length + 1.463 * portR; // correção de extremidade
    tuning = (34300 / (2 * Math.PI)) * Math.sqrt(portArea / (Vb * Lef));
  }

  // MDF
  const panelArea =
    2 * (W * H) + 2 * (W * D) + 2 * (H * D) + box.dividers * (ih * id) + box.braces * (iw * 8);
  const mdfArea = (panelArea / 10000) * 1.12; // 12% de perda de corte
  const mdfSheets = Math.max(1, Math.ceil((mdfArea * 10000) / (MDF_SHEET_W * MDF_SHEET_H)));

  // ferragens e consumíveis
  const edgeLength = 4 * (W + H + D) + box.dividers * 2 * (ih + id);
  const screws = Math.ceil(edgeLength / 12);
  const glueGrams = Math.ceil(edgeLength * 3.2);
  const externalArea = (2 * (W * H) + 2 * (W * D) + 2 * (H * D)) / 10000;
  const carpetArea = box.finish === "carpete" ? externalArea * 1.15 : 0;

  // peso
  const mdfWeight = mdfArea * (box.thickness / 1000) * MDF_DENSITY;
  const compWeight = placed.reduce((a, x) => a + x.product.peso * Math.pow(x.item.scale, 3), 0);
  const weight = mdfWeight + compWeight;

  // preço
  const sheetPrice = MDF_SHEET_PRICE[box.thickness] ?? 290;
  const mdfPrice = mdfSheets * sheetPrice;
  const finishPrice = externalArea * (FINISH_PRICE_M2[box.finish] ?? 45);
  const hardware = screws * 0.35 + glueGrams * 0.04 + box.port.count * 25 + (box.ledOn ? 90 : 0);
  const components = placed.reduce((a, x) => a + x.product.preco, 0);
  const labor = Math.max(180, externalArea * 220 + speakers.length * 60);
  const total = mdfPrice + finishPrice + hardware + components + labor;

  const fabricationDays = Math.max(2, Math.ceil(externalArea * 1.6 + placed.length * 0.3));

  // ---- alertas ----
  const subs = placed.filter((x) => x.product.categoria === "subwoofer");
  const minVol = subs.reduce((a, x) => a + x.product.litragemMin, 0);
  const maxVol = subs.reduce((a, x) => a + x.product.litragemMax, 0);
  if (subs.length > 0 && minVol > 0 && netVolume < minVol) {
    alerts.push({
      level: "error",
      text: `Volume útil (${netVolume.toFixed(1)}L) abaixo do recomendado (${minVol}L) para os subwoofers escolhidos. Aumente as dimensões da caixa.`,
    });
  }
  if (subs.length > 0 && maxVol > 0 && netVolume > maxVol * 1.35) {
    alerts.push({
      level: "warn",
      text: `Volume útil (${netVolume.toFixed(1)}L) muito acima do ideal (~${maxVol}L). O grave pode ficar solto; considere reduzir a caixa ou adicionar divisórias.`,
    });
  }
  if (tuning !== null) {
    if (tuning < 28)
      alerts.push({ level: "warn", text: `Sintonia em ${tuning.toFixed(1)} Hz está muito grave. Encurte os dutos ou aumente o diâmetro.` });
    if (tuning > 60)
      alerts.push({ level: "warn", text: `Sintonia em ${tuning.toFixed(1)} Hz está alta demais para uso musical. Alongue os dutos ou reduza a área.` });
    if (box.port.length > D - 2 * t - 5)
      alerts.push({ level: "error", text: "O duto é mais comprido que a profundidade interna da caixa. Reduza o comprimento ou use duto em L." });
  }
  if (box.shape === "dutada" && box.port.count === 0) {
    alerts.push({ level: "warn", text: "Caixa dutada sem dutos configurados. Adicione ao menos 1 duto." });
  }
  const bigSub = subs.some((x) => sizeOf(x.product) >= 38);
  if (bigSub && box.thickness < 15) {
    alerts.push({ level: "warn", text: 'Para subwoofers de 15" ou mais, recomendamos MDF de 15mm ou 18mm.' });
  }
  if (Math.max(W, H, D) > MDF_SHEET_W) {
    alerts.push({ level: "error", text: "Uma das dimensões excede a chapa de MDF (275cm). Será necessário emendar painéis." });
  }
  const frontArea = W * H;
  const speakerFrontArea = speakers
    .filter((x) => faceOf(x.product.categoria) === "front")
    .reduce((a, x) => a + Math.PI * Math.pow((sizeOf(x.product) / 2) * x.item.scale, 2), 0);
  if (speakerFrontArea > frontArea * 0.72) {
    alerts.push({ level: "error", text: "Os falantes não cabem na frente da caixa. Aumente largura/altura ou remova componentes." });
  }
  if (alerts.length === 0) {
    alerts.push({ level: "info", text: "Projeto dentro dos parâmetros recomendados. ✔" });
  }

  // ---- lista de materiais ----
  const grouped = new Map<string, { product: Product; qty: number }>();
  for (const x of placed) {
    const g = grouped.get(x.product.id);
    if (g) g.qty += 1;
    else grouped.set(x.product.id, { product: x.product, qty: 1 });
  }
  const materials = [
    {
      name: `Chapa MDF ${box.thickness}mm`,
      qty: `${mdfSheets} un (${mdfArea.toFixed(2)} m²)`,
      detail: `Painéis p/ caixa ${W}×${H}×${D}cm`,
      price: mdfPrice,
    },
    ...(box.finish === "carpete"
      ? [{ name: "Carpete automotivo", qty: `${carpetArea.toFixed(2)} m²`, detail: "Revestimento externo", price: finishPrice }]
      : [{ name: FINISH_LABEL[box.finish], qty: `${externalArea.toFixed(2)} m²`, detail: "Acabamento externo", price: finishPrice }]),
    { name: "Parafusos p/ MDF", qty: `${screws} un`, detail: "4,0 × 40mm", price: Math.ceil(screws * 0.35) },
    { name: "Cola PVA", qty: `${glueGrams} g`, detail: "Vedação e colagem", price: Math.ceil(glueGrams * 0.04) },
    ...(box.port.count > 0
      ? [{
          name: "Dutos de sintonia",
          qty: `${box.port.count} un`,
          detail: `Ø${box.port.diameter}cm × ${box.port.length}cm`,
          price: box.port.count * 25,
        }]
      : []),
    ...(box.ledOn ? [{ name: "Kit LED + fonte", qty: "1 kit", detail: `Cor ${box.ledColor}`, price: 90 }] : []),
    ...[...grouped.values()].map(({ product, qty }) => ({
      name: [product.nome, product.marca].filter(Boolean).join(" — "),
      qty: `${qty} un`,
      detail: categorySingular[product.categoria],
      price: product.preco * qty,
    })),
    { name: "Mão de obra especializada", qty: "1 projeto", detail: "Corte, montagem, vedação e acabamento", price: Math.ceil(labor) },
  ];

  return {
    grossVolume,
    speakerDisplacement,
    portDisplacement,
    structureDisplacement,
    netVolume,
    tuning,
    portArea,
    portLength: box.port.length,
    mdfArea,
    mdfSheets,
    screws,
    glueGrams,
    carpetArea,
    weight,
    price: {
      mdf: mdfPrice,
      finish: finishPrice,
      hardware,
      components,
      labor,
      total,
    },
    fabricationDays,
    alerts,
    materials,
  };
}

export const money = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
