"use client";

import { collection, doc, getDocs, increment, setDoc } from "firebase/firestore";
import { getDb, isCloud } from "./firebase";

/**
 * Contador de visitas por página.
 *
 * Em produção (Firebase configurado) grava na coleção `estatisticas` do
 * Firestore — um documento por página, somando visitas de todos os
 * visitantes. Sem Firebase, conta no localStorage (desenvolvimento).
 *
 * O painel /admin lê esses números no Dashboard.
 */

const LOCAL_KEY = "jr-page-stats";

export const pageLabels: Record<string, string> = {
  home: "Página inicial",
  configurador: "Configurador 3D",
};

export async function trackPageView(page: string): Promise<void> {
  try {
    if (isCloud()) {
      await setDoc(
        doc(getDb(), "estatisticas", page),
        { visitas: increment(1), atualizadoEm: new Date().toISOString() },
        { merge: true }
      );
    } else {
      const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "{}") as Record<string, number>;
      raw[page] = (raw[page] ?? 0) + 1;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(raw));
    }
  } catch {
    // contador nunca deve quebrar a página
  }
}

export async function getPageStats(): Promise<Record<string, number>> {
  try {
    if (isCloud()) {
      const snap = await getDocs(collection(getDb(), "estatisticas"));
      const out: Record<string, number> = {};
      snap.forEach((d) => {
        out[d.id] = Number(d.data().visitas ?? 0);
      });
      return out;
    }
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
}
