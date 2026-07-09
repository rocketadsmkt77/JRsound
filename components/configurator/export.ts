"use client";

import { jsPDF } from "jspdf";
import { BoxConfig, PlacedItem } from "./types";
import { Product } from "@/lib/products";
import { ProjectCalc, money } from "./calc";
import { site, whatsappLink } from "@/lib/site";

type GetProduct = (id: string) => Product | undefined;

const shapeLabels: Record<string, string> = {
  reta: "Reta",
  trapezio: "Trapézio",
  selada: "Selada",
  dutada: "Dutada",
  trio: "Trio",
  lateral: "Lateral",
  canhao: "Canhão",
  personalizado: "Personalizado",
};

const finishLabels: Record<string, string> = {
  carpete: "Carpete",
  pintura: "Pintura automotiva",
  madeira: "Madeira naval",
  fibra: "Fibra",
  couro: "Couro sintético",
};

export function captureCanvas(): string | null {
  const canvas = document.querySelector<HTMLCanvasElement>("#scene-canvas canvas");
  return canvas ? canvas.toDataURL("image/jpeg", 0.92) : null;
}

export function buildSummaryText(
  code: string,
  box: BoxConfig,
  items: PlacedItem[],
  calc: ProjectCalc,
  getProduct: GetProduct
): string {
  const grouped = new Map<string, number>();
  for (const i of items) grouped.set(i.productId, (grouped.get(i.productId) ?? 0) + 1);
  const itemLines = [...grouped.entries()]
    .map(([pid, qty]) => {
      const p = getProduct(pid);
      if (!p) return null;
      return `• ${qty}x ${[p.nome, p.marca].filter(Boolean).join(" — ")}`;
    })
    .filter(Boolean)
    .join("\n");

  return (
    `🔊 *PROJETO JR SOUND — ${code}*\n\n` +
    `📦 *Caixa ${shapeLabels[box.shape]}*\n` +
    `Medidas: ${box.width} × ${box.height} × ${box.depth} cm\n` +
    `MDF: ${box.thickness}mm | Acabamento: ${finishLabels[box.finish]}\n` +
    (box.port.count > 0
      ? `Dutos: ${box.port.count}x Ø${box.port.diameter}cm × ${box.port.length}cm\n`
      : "") +
    (box.ledOn ? `LED: ${box.ledColor}\n` : "") +
    `\n🔩 *Componentes:*\n${itemLines || "• (nenhum)"}\n\n` +
    `📐 *Cálculos técnicos:*\n` +
    `• Volume útil: ${calc.netVolume.toFixed(1)} L\n` +
    (calc.tuning ? `• Sintonia: ${calc.tuning.toFixed(1)} Hz\n` : "") +
    `• MDF: ${calc.mdfArea.toFixed(2)} m² (${calc.mdfSheets} chapa${calc.mdfSheets > 1 ? "s" : ""})\n` +
    `• Peso aprox.: ${calc.weight.toFixed(1)} kg\n\n` +
    `💰 *Valor estimado: ${money(calc.price.total)}*\n` +
    `🕒 Fabricação: ~${calc.fabricationDays} dias úteis\n\n` +
    `Quero fechar esse projeto! 🚗💥`
  );
}

export function openWhatsAppQuote(
  code: string,
  box: BoxConfig,
  items: PlacedItem[],
  calc: ProjectCalc,
  getProduct: GetProduct
) {
  window.open(whatsappLink(buildSummaryText(code, box, items, calc, getProduct)), "_blank");
}

export function generatePdf(
  code: string,
  box: BoxConfig,
  items: PlacedItem[],
  calc: ProjectCalc,
  _getProduct: GetProduct
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const orange: [number, number, number] = [255, 122, 0];
  const gold: [number, number, number] = [201, 165, 66];
  let y = 0;

  // header
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, W, 42, "F");
  doc.setFillColor(...orange);
  doc.rect(0, 42, W, 1.6, "F");
  doc.setTextColor(...orange);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("JR SOUND", 14, 18);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("SOM E ACESSÓRIOS — PROJETO DE CAIXA PERSONALIZADA", 14, 26);
  doc.setTextColor(...gold);
  doc.setFontSize(11);
  doc.text(`Código do projeto: ${code}`, 14, 35);
  doc.setTextColor(200, 200, 200);
  doc.text(new Date().toLocaleDateString("pt-BR"), W - 14, 35, { align: "right" });
  y = 52;

  // imagem do projeto
  const img = captureCanvas();
  if (img) {
    doc.setFillColor(18, 18, 18);
    doc.roundedRect(14, y, W - 28, 92, 3, 3, "F");
    try {
      doc.addImage(img, "JPEG", 16, y + 2, W - 32, 88);
    } catch {
      /* canvas indisponível */
    }
    y += 100;
  }

  // especificações
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...orange);
  doc.text("ESPECIFICAÇÕES", 14, y);
  y += 2;
  doc.setDrawColor(...orange);
  doc.line(14, y, W - 14, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const specs = [
    [`Formato: ${shapeLabels[box.shape]}`, `Medidas: ${box.width} × ${box.height} × ${box.depth} cm`],
    [`MDF: ${box.thickness} mm`, `Acabamento: ${finishLabels[box.finish]}`],
    [
      box.port.count > 0
        ? `Dutos: ${box.port.count}x Ø${box.port.diameter}cm × ${box.port.length}cm`
        : "Caixa selada (sem dutos)",
      `Volume útil: ${calc.netVolume.toFixed(1)} L${calc.tuning ? ` | Sintonia: ${calc.tuning.toFixed(1)} Hz` : ""}`,
    ],
    [`Peso aproximado: ${calc.weight.toFixed(1)} kg`, `Fabricação: ~${calc.fabricationDays} dias úteis`],
  ];
  for (const [a, b] of specs) {
    doc.text(a, 14, y);
    doc.text(b, 105, y);
    y += 6;
  }
  y += 4;

  // materiais
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...orange);
  doc.text("LISTA DE MATERIAIS", 14, y);
  y += 2;
  doc.line(14, y, W - 14, y);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(20, 20, 20);
  doc.rect(14, y - 4.5, W - 28, 6.5, "F");
  doc.text("ITEM", 16, y);
  doc.text("QTD", 110, y);
  doc.text("DETALHE", 135, y);
  doc.text("VALOR", W - 16, y, { align: "right" });
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  for (const m of calc.materials) {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    doc.text(m.name.slice(0, 48), 16, y);
    doc.text(m.qty, 110, y);
    doc.text(m.detail.slice(0, 30), 135, y);
    doc.text(money(m.price), W - 16, y, { align: "right" });
    y += 5.5;
  }

  y += 4;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFillColor(255, 122, 0);
  doc.roundedRect(14, y, W - 28, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text("VALOR ESTIMADO", 18, y + 9);
  doc.text(money(calc.price.total), W - 18, y + 9, { align: "right" });
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Orçamento preliminar gerado pelo configurador 3D. Valores sujeitos a confirmação pela equipe JR Sound.",
    14,
    y
  );
  doc.text(`WhatsApp: ${site.whatsapp} | Instagram: @jrsound`, 14, y + 5);

  doc.save(`${code}.pdf`);
}
