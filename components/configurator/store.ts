"use client";

import { create } from "zustand";
import { BoxConfig, BoxShape, PlacedItem } from "./types";
import { Product, faceOf } from "@/lib/products";

export interface ConfiguratorState {
  /** catálogo dinâmico carregado da API (somente produtos ativos) */
  products: Product[];
  productsLoaded: boolean;
  box: BoxConfig;
  items: PlacedItem[];
  selected: string | null;
  snap: boolean;
  showGrid: boolean;
  lightIntensity: number; // 0..2
  projectCode: string;
  loadProducts: () => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  setBox: (patch: Partial<BoxConfig>) => void;
  setShape: (shape: BoxShape) => void;
  addItem: (productId: string) => void;
  updateItem: (uid: string, patch: Partial<PlacedItem>) => void;
  duplicateItem: (uid: string) => void;
  removeItem: (uid: string) => void;
  select: (uid: string | null) => void;
  setSnap: (v: boolean) => void;
  setShowGrid: (v: boolean) => void;
  setLightIntensity: (v: number) => void;
  reset: () => void;
}

const shapeDefaults: Record<BoxShape, Partial<BoxConfig>> = {
  reta: { width: 80, height: 40, depth: 40 },
  trapezio: { width: 85, height: 40, depth: 45 },
  selada: { width: 80, height: 40, depth: 40, port: { count: 0, diameter: 10, length: 30 } },
  dutada: { width: 70, height: 40, depth: 40, port: { count: 2, diameter: 10, length: 28 } },
  trio: { width: 120, height: 100, depth: 55 },
  lateral: { width: 60, height: 90, depth: 45 },
  canhao: { width: 100, height: 50, depth: 50 },
  personalizado: {},
};

function newCode() {
  return `JR-${Date.now().toString(36).toUpperCase()}`;
}

const initialBox: BoxConfig = {
  shape: "dutada",
  width: 70,
  height: 40,
  depth: 40,
  thickness: 15,
  roundedCorners: false,
  dividers: 0,
  braces: 1,
  port: { count: 2, diameter: 10, length: 28 },
  finish: "carpete",
  color: "#1a1a1a",
  ledOn: true,
  ledColor: "#ff7a00",
};

export const useConfigurator = create<ConfiguratorState>((set, get) => ({
  products: [],
  productsLoaded: false,
  box: initialBox,
  items: [],
  selected: null,
  snap: true,
  showGrid: true,
  lightIntensity: 1,
  projectCode: newCode(),

  loadProducts: async () => {
    try {
      const res = await fetch("/api/produtos?ativos=1", { cache: "no-store" });
      if (!res.ok) return;
      const products: Product[] = await res.json();
      // remove da cena itens cujo produto foi desativado/excluído no painel
      const valid = new Set(products.map((p) => p.id));
      set((s) => ({
        products,
        productsLoaded: true,
        items: s.items.filter((i) => valid.has(i.productId)),
      }));
    } catch {
      // servidor indisponível — mantém o catálogo atual
    }
  },

  getProduct: (id) => get().products.find((p) => p.id === id),

  setBox: (patch) => set((s) => ({ box: { ...s.box, ...patch } })),

  setShape: (shape) =>
    set((s) => ({
      box: { ...s.box, ...shapeDefaults[shape], shape },
    })),

  addItem: (productId) => {
    const product = get().getProduct(productId);
    if (!product) return;
    const uid = `${productId}-${Math.random().toString(36).slice(2, 8)}`;
    const face = faceOf(product.categoria);
    const count = get().items.filter((i) => {
      const p = get().getProduct(i.productId);
      return p && faceOf(p.categoria) === face;
    }).length;
    set((s) => ({
      items: [
        ...s.items,
        { uid, productId, x: (count % 3) * 20 - 20, y: 0, rotation: 0, scale: 1 },
      ],
      selected: uid,
    }));
  },

  updateItem: (uid, patch) =>
    set((s) => ({
      items: s.items.map((i) => (i.uid === uid ? { ...i, ...patch } : i)),
    })),

  duplicateItem: (uid) => {
    const src = get().items.find((i) => i.uid === uid);
    if (!src) return;
    const nuid = `${src.productId}-${Math.random().toString(36).slice(2, 8)}`;
    set((s) => ({
      items: [...s.items, { ...src, uid: nuid, x: src.x + 12, y: src.y - 6 }],
      selected: nuid,
    }));
  },

  removeItem: (uid) =>
    set((s) => ({
      items: s.items.filter((i) => i.uid !== uid),
      selected: s.selected === uid ? null : s.selected,
    })),

  select: (uid) => set({ selected: uid }),
  setSnap: (v) => set({ snap: v }),
  setShowGrid: (v) => set({ showGrid: v }),
  setLightIntensity: (v) => set({ lightIntensity: v }),

  reset: () =>
    set({
      box: initialBox,
      items: [],
      selected: null,
      projectCode: newCode(),
    }),
}));
