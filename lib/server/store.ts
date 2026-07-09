import { promises as fs } from "fs";
import path from "path";
import { Product } from "../products";
import { seedProducts } from "../seed-products";

/**
 * Banco de produtos em arquivo JSON (`data/products.json`).
 *
 * Simples de rodar em qualquer máquina, sem serviços externos.
 * Para migrar para PostgreSQL/Firebase depois, basta reimplementar
 * estas quatro funções mantendo as assinaturas.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "products.json");

let writing: Promise<void> = Promise.resolve();

async function ensureDb(): Promise<void> {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(seedProducts, null, 2), "utf8");
  }
}

export async function listProducts(): Promise<Product[]> {
  await ensureDb();
  const raw = await fs.readFile(DB_FILE, "utf8");
  const items: Product[] = JSON.parse(raw);
  return items.sort((a, b) => a.ordem - b.ordem || a.nome.localeCompare(b.nome));
}

async function writeAll(items: Product[]): Promise<void> {
  // serializa escritas para evitar corrupção em salvamentos simultâneos
  writing = writing.then(() =>
    fs.writeFile(DB_FILE, JSON.stringify(items, null, 2), "utf8")
  );
  await writing;
}

export async function createProduct(input: Partial<Product>): Promise<Product> {
  const items = await listProducts();
  const now = new Date().toISOString();
  const product: Product = {
    ...emptyDefaults(),
    ...input,
    id: `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    criadoEm: now,
    atualizadoEm: now,
  };
  items.push(product);
  await writeAll(items);
  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | null> {
  const items = await listProducts();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  items[idx] = {
    ...items[idx],
    ...patch,
    id,
    criadoEm: items[idx].criadoEm,
    atualizadoEm: new Date().toISOString(),
  };
  await writeAll(items);
  return items[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const items = await listProducts();
  const next = items.filter((p) => p.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}

function emptyDefaults(): Product {
  return {
    id: "",
    nome: "",
    marca: "",
    modelo: "",
    categoria: "subwoofer",
    descricao: "",
    preco: 0,
    estoque: 0,
    diametro: 0,
    diametroCorte: 0,
    largura: 0,
    altura: 0,
    profundidade: 0,
    peso: 0,
    cor: "",
    volumeDeslocado: 0,
    litragemMin: 0,
    litragemMax: 0,
    redimensionavel: true,
    imagem: "",
    imagens: [],
    modelo3D: "",
    ativo: true,
    ordem: 999,
    criadoEm: "",
    atualizadoEm: "",
  };
}
