"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Product,
  Category,
  categoryLabels,
  emptyProduct,
} from "@/lib/products";
import { money } from "../configurator/calc";

/**
 * Cadastro de produtos do Configurador 3D.
 * CRUD via API REST (/api/produtos) + upload de imagens e modelos 3D
 * (/api/upload). Tudo que é salvo aqui aparece automaticamente no
 * configurador — inclusive edições e exclusões.
 */

const input =
  "w-full rounded-xl bg-surface-2 border border-line px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-brand transition-all";
const label = "block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5";

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Category | "todas">("todas");

  const load = useCallback(async () => {
    const res = await fetch("/api/produtos", { cache: "no-store" });
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (cat !== "todas" && p.categoria !== cat) return false;
        const hay = `${p.nome} ${p.marca} ${p.modelo} ${p.categoria}`.toLowerCase();
        return hay.includes(search.toLowerCase());
      }),
    [products, search, cat]
  );

  const save = async (p: Product) => {
    const isNew = !p.id;
    const res = await fetch(isNew ? "/api/produtos" : `/api/produtos/${p.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (res.ok) {
      setEditing(null);
      await load();
    } else {
      alert("Erro ao salvar produto.");
    }
  };

  const remove = async (p: Product) => {
    if (!confirm(`Excluir "${p.nome}"? Ele sumirá do configurador.`)) return;
    await fetch(`/api/produtos/${p.id}`, { method: "DELETE" });
    await load();
  };

  const toggleActive = async (p: Product) => {
    await fetch(`/api/produtos/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !p.ativo }),
    });
    await load();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-orbitron)] text-2xl font-extrabold">Produtos</h1>
          <p className="text-muted text-sm font-medium mt-1">
            {products.length} produto{products.length !== 1 ? "s" : ""} — tudo aqui aparece
            automaticamente no Configurador 3D
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyProduct(), ordem: products.length + 1 })}
          className="btn-brand rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black"
        >
          + Novo produto
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, marca, modelo…"
          className={`${input} flex-1 min-w-52`}
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as Category | "todas")}
          className={`${input} w-auto`}
        >
          <option value="todas">Todas as categorias</option>
          {(Object.keys(categoryLabels) as Category[]).map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-brand border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="card-premium rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                {["Produto", "Categoria", "Medidas", "Preço", "Estoque", "3D", "Ativo", ""].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-muted whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-line/50 hover:bg-surface-2/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-52">
                      {p.imagem ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imagem} alt="" loading="lazy" className="w-11 h-11 rounded-lg object-cover border border-line bg-black shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-lg border border-line bg-black shrink-0 flex items-center justify-center text-muted text-lg">
                          ◎
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold truncate">{p.nome}</p>
                        <p className="text-xs text-muted truncate">
                          {[p.marca, p.modelo].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{categoryLabels[p.categoria]}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted font-medium">
                    {p.diametro > 0 ? `Ø${p.diametro}cm` : `${p.largura}×${p.altura}×${p.profundidade}cm`}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-gold">{money(p.preco)}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{p.estoque}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.modelo3D ? (
                      <span className="text-[10px] font-bold bg-emerald-900/50 text-emerald-300 rounded-full px-2 py-0.5">GLB</span>
                    ) : p.imagem ? (
                      <span className="text-[10px] font-bold bg-sky-900/50 text-sky-300 rounded-full px-2 py-0.5">FOTO</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-surface-2 text-muted rounded-full px-2 py-0.5">AUTO</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`relative w-10 h-5.5 rounded-full transition-colors ${
                        p.ativo ? "bg-brand" : "bg-surface-2 border border-line"
                      }`}
                      title={p.ativo ? "Desativar (some do configurador)" : "Ativar"}
                    >
                      <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all ${p.ativo ? "left-5" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => setEditing(p)} className="text-gold hover:text-brand-bright text-xs font-bold uppercase">
                        Editar
                      </button>
                      <button onClick={() => remove(p)} className="text-red-400/80 hover:text-red-300 text-xs font-bold uppercase">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted font-medium">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && <ProductForm product={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

/* ---------------- formulário ---------------- */

function ProductForm({
  product,
  onSave,
  onClose,
}: {
  product: Product;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const [p, setP] = useState<Product>(product);
  const [uploading, setUploading] = useState<"imagem" | "modelo" | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const glbRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<Product>) => setP((prev) => ({ ...prev, ...patch }));

  const upload = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error ?? "Falha no upload.");
      return null;
    }
    return (await res.json()).url as string;
  };

  const onImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading("imagem");
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const url = await upload(f);
      if (url) urls.push(url);
    }
    if (urls.length) {
      set({
        imagens: [...p.imagens, ...urls],
        imagem: p.imagem || urls[0],
      });
    }
    setUploading(null);
  };

  const onModel = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading("modelo");
    const url = await upload(files[0]);
    if (url) set({ modelo3D: url });
    setUploading(null);
  };

  const num = (v: string) => (v === "" ? 0 : Math.max(0, +v));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-start justify-center p-4 sm:p-8 overflow-y-auto" onClick={onClose}>
      <div
        className="card-premium rounded-3xl p-6 sm:p-8 w-full max-w-3xl my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-[family-name:var(--font-orbitron)] font-bold text-lg mb-6">
          {p.id ? "Editar produto" : "Novo produto"}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={label}>Nome do produto *</label>
            <input className={input} value={p.nome} onChange={(e) => set({ nome: e.target.value })} placeholder='Ex.: Subwoofer 12" 800W' />
          </div>
          <div>
            <label className={label}>Marca</label>
            <input className={input} value={p.marca} onChange={(e) => set({ marca: e.target.value })} />
          </div>
          <div>
            <label className={label}>Modelo</label>
            <input className={input} value={p.modelo} onChange={(e) => set({ modelo: e.target.value })} />
          </div>
          <div>
            <label className={label}>Categoria *</label>
            <select className={input} value={p.categoria} onChange={(e) => set({ categoria: e.target.value as Category })}>
              {(Object.keys(categoryLabels) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Cor</label>
            <input className={input} value={p.cor} onChange={(e) => set({ cor: e.target.value })} placeholder="Ex.: Preto" />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Descrição</label>
            <textarea rows={2} className={input} value={p.descricao} onChange={(e) => set({ descricao: e.target.value })} />
          </div>

          <div>
            <label className={label}>Valor (R$)</label>
            <input type="number" min={0} step="0.01" className={input} value={p.preco || ""} onChange={(e) => set({ preco: num(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Estoque</label>
            <input type="number" min={0} className={input} value={p.estoque || ""} onChange={(e) => set({ estoque: num(e.target.value) })} />
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={label}>Diâmetro (cm)</label>
              <input type="number" min={0} step="0.1" className={input} value={p.diametro || ""} onChange={(e) => set({ diametro: num(e.target.value) })} placeholder="0 = n/a" />
            </div>
            <div>
              <label className={label}>Diâm. de corte (cm)</label>
              <input type="number" min={0} step="0.1" className={input} value={p.diametroCorte || ""} onChange={(e) => set({ diametroCorte: num(e.target.value) })} />
            </div>
            <div>
              <label className={label}>Profundidade (cm)</label>
              <input type="number" min={0} step="0.1" className={input} value={p.profundidade || ""} onChange={(e) => set({ profundidade: num(e.target.value) })} />
            </div>
            <div>
              <label className={label}>Peso (kg)</label>
              <input type="number" min={0} step="0.1" className={input} value={p.peso || ""} onChange={(e) => set({ peso: num(e.target.value) })} />
            </div>
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={label}>Largura (cm)</label>
              <input type="number" min={0} step="0.1" className={input} value={p.largura || ""} onChange={(e) => set({ largura: num(e.target.value) })} placeholder="itens retangulares" />
            </div>
            <div>
              <label className={label}>Altura (cm)</label>
              <input type="number" min={0} step="0.1" className={input} value={p.altura || ""} onChange={(e) => set({ altura: num(e.target.value) })} />
            </div>
            <div>
              <label className={label}>Vol. deslocado (L)</label>
              <input type="number" min={0} step="0.1" className={input} value={p.volumeDeslocado || ""} onChange={(e) => set({ volumeDeslocado: num(e.target.value) })} />
            </div>
            <div>
              <label className={label}>Ordem</label>
              <input type="number" min={1} className={input} value={p.ordem || ""} onChange={(e) => set({ ordem: num(e.target.value) })} />
            </div>
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Litragem mín. recomendada (L)</label>
              <input type="number" min={0} className={input} value={p.litragemMin || ""} onChange={(e) => set({ litragemMin: num(e.target.value) })} placeholder="p/ alertas do projeto" />
            </div>
            <div>
              <label className={label}>Litragem máx. recomendada (L)</label>
              <input type="number" min={0} className={input} value={p.litragemMax || ""} onChange={(e) => set({ litragemMax: num(e.target.value) })} />
            </div>
          </div>

          {/* uploads */}
          <div className="sm:col-span-2 border-t border-line pt-5 grid sm:grid-cols-2 gap-5">
            <div>
              <label className={label}>Imagens do produto (.png .jpg .webp)</label>
              <input ref={imgRef} type="file" accept=".png,.jpg,.jpeg,.webp" multiple className="hidden" onChange={(e) => onImages(e.target.files)} />
              <button
                type="button"
                onClick={() => imgRef.current?.click()}
                disabled={uploading !== null}
                className="btn-ghost w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-brand-bright disabled:opacity-50"
              >
                {uploading === "imagem" ? "Enviando…" : "+ Enviar imagens"}
              </button>
              {p.imagens.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {p.imagens.map((url) => (
                    <div key={url} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className={`w-16 h-16 rounded-lg object-cover border-2 cursor-pointer ${
                          p.imagem === url ? "border-brand" : "border-line"
                        }`}
                        onClick={() => set({ imagem: url })}
                        title="Clique para definir como principal"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          set({
                            imagens: p.imagens.filter((u) => u !== url),
                            imagem: p.imagem === url ? (p.imagens.find((u) => u !== url) ?? "") : p.imagem,
                          })
                        }
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {p.imagens.length > 0 && (
                <p className="text-[10px] text-muted mt-1.5">Clique numa imagem para defini-la como principal.</p>
              )}
            </div>
            <div>
              <label className={label}>Modelo 3D (.glb .gltf) — opcional</label>
              <input ref={glbRef} type="file" accept=".glb,.gltf" className="hidden" onChange={(e) => onModel(e.target.files)} />
              <button
                type="button"
                onClick={() => glbRef.current?.click()}
                disabled={uploading !== null}
                className="btn-ghost w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-brand-bright disabled:opacity-50"
              >
                {uploading === "modelo" ? "Enviando…" : p.modelo3D ? "Substituir modelo 3D" : "+ Enviar modelo 3D"}
              </button>
              {p.modelo3D && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-surface-2 border border-line px-3 py-2">
                  <span className="text-xs font-semibold text-emerald-300 truncate">{p.modelo3D.split("/").pop()}</span>
                  <button type="button" onClick={() => set({ modelo3D: "" })} className="text-red-400 text-xs font-bold shrink-0">
                    remover
                  </button>
                </div>
              )}
              <p className="text-[10px] text-muted mt-2">
                Com modelo 3D, ele é usado na cena. Sem modelo, a imagem vira a representação
                visual. Sem os dois, o sistema gera um modelo automático pela categoria.
              </p>
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-6 border-t border-line pt-5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={p.ativo} onChange={(e) => set({ ativo: e.target.checked })} className="w-4 h-4 accent-[#ff7a00]" />
              <span className="text-sm font-semibold">Ativo (visível no configurador)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={p.redimensionavel} onChange={(e) => set({ redimensionavel: e.target.checked })} className="w-4 h-4 accent-[#ff7a00]" />
              <span className="text-sm font-semibold">Permitir redimensionar na cena</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 rounded-xl border border-line py-3 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground">
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!p.nome.trim()) return alert("Informe o nome do produto.");
              onSave(p);
            }}
            disabled={uploading !== null}
            className="flex-1 btn-brand rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-black disabled:opacity-60"
          >
            Salvar produto
          </button>
        </div>
      </div>
    </div>
  );
}
