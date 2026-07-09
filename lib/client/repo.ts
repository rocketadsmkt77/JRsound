"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { Product } from "../products";
import { seedProducts } from "../seed-products";
import { getDb, getFbAuth, isCloud } from "./firebase";

/**
 * Repositório de produtos com dois backends escolhidos automaticamente:
 *
 * - Firebase Firestore (plano gratuito) — quando as variáveis
 *   NEXT_PUBLIC_FB_* estão configuradas. Leitura pública, escrita apenas
 *   para o administrador logado (Firebase Authentication + regras).
 * - localStorage — desenvolvimento sem Firebase.
 *
 * O Configurador assina `subscribeProducts` e recebe as mudanças em tempo
 * real (Firestore) ou via sondagem local.
 */

export { isCloud };

const COLLECTION = "produtos";
const LOCAL_KEY = "jr-products-db";
// senha do modo local (desenvolvimento sem Firebase)
const LOCAL_PASS = "jrsound2026";

function sorted(items: Product[]): Product[] {
  return [...items].sort((a, b) => a.ordem - b.ordem || a.nome.localeCompare(b.nome));
}

/* ================= backend localStorage ================= */

function localList(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {
    /* dados corrompidos — recomeça do seed */
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(seedProducts));
  return [...seedProducts];
}

function localWrite(items: Product[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  // avisa outras abas e os assinantes desta aba
  window.dispatchEvent(new CustomEvent("jr-products-changed"));
}

/* ================= API pública ================= */

export async function listAllProducts(): Promise<Product[]> {
  if (!isCloud()) return sorted(localList());
  const snap = await getDocs(collection(getDb(), COLLECTION));
  return sorted(snap.docs.map((d) => ({ ...(d.data() as Product), id: d.id })));
}

/**
 * Assina o catálogo (todos os produtos). Devolve função para cancelar.
 * No Firestore a atualização é em tempo real; no modo local, reage a
 * mudanças da própria aba, de outras abas e sonda a cada 20s.
 */
export function subscribeProducts(cb: (items: Product[]) => void): () => void {
  if (isCloud()) {
    return onSnapshot(
      collection(getDb(), COLLECTION),
      (snap) => cb(sorted(snap.docs.map((d) => ({ ...(d.data() as Product), id: d.id })))),
      () => cb([]) // sem permissão/offline — catálogo vazio em vez de erro
    );
  }
  const push = () => cb(sorted(localList()));
  push();
  const interval = setInterval(push, 20000);
  window.addEventListener("jr-products-changed", push);
  window.addEventListener("storage", push);
  return () => {
    clearInterval(interval);
    window.removeEventListener("jr-products-changed", push);
    window.removeEventListener("storage", push);
  };
}

export async function createProduct(input: Partial<Product>): Promise<Product> {
  const now = new Date().toISOString();
  const product: Product = {
    ...input,
    id: `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    criadoEm: now,
    atualizadoEm: now,
  } as Product;
  if (isCloud()) {
    await setDoc(doc(getDb(), COLLECTION, product.id), product);
  } else {
    localWrite([...localList(), product]);
  }
  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<void> {
  const clean = { ...patch, atualizadoEm: new Date().toISOString() };
  delete (clean as Record<string, unknown>).id;
  delete (clean as Record<string, unknown>).criadoEm;
  if (isCloud()) {
    await updateDoc(doc(getDb(), COLLECTION, id), clean);
  } else {
    localWrite(localList().map((p) => (p.id === id ? { ...p, ...clean, id } : p)));
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (isCloud()) {
    await deleteDoc(doc(getDb(), COLLECTION, id));
  } else {
    localWrite(localList().filter((p) => p.id !== id));
  }
}

/** Carga inicial do catálogo (botão no painel quando o banco está vazio). */
export async function seedCatalog(): Promise<number> {
  if (isCloud()) {
    const db = getDb();
    const batch = writeBatch(db);
    for (const p of seedProducts) batch.set(doc(db, COLLECTION, p.id), p);
    await batch.commit();
  } else {
    localWrite([...seedProducts]);
  }
  return seedProducts.length;
}

/* ================= autenticação do painel ================= */

export async function loginAdmin(email: string, password: string): Promise<boolean> {
  if (!isCloud()) {
    if (password === LOCAL_PASS) {
      sessionStorage.setItem("jr-admin-local", "1");
      return true;
    }
    return false;
  }
  try {
    await signInWithEmailAndPassword(getFbAuth(), email, password);
    return true;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  if (isCloud()) await signOut(getFbAuth());
  else sessionStorage.removeItem("jr-admin-local");
}

/** Observa o estado de login. Devolve função para cancelar. */
export function onAdminAuth(cb: (authed: boolean) => void): () => void {
  if (isCloud()) {
    return onAuthStateChanged(getFbAuth(), (user: User | null) => cb(!!user));
  }
  cb(sessionStorage.getItem("jr-admin-local") === "1");
  return () => {};
}
