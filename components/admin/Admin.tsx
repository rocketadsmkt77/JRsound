"use client";

/**
 * Painel administrativo JR Sound.
 *
 * Versão demo: os dados são persistidos no localStorage do navegador.
 * Para produção, conecte às rotas REST (Next.js API + Prisma/PostgreSQL)
 * substituindo o hook useCollection por chamadas fetch.
 */

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { money } from "../configurator/calc";
import ProductsAdmin from "./ProductsAdmin";
import { isCloud, loginAdmin, logoutAdmin, onAdminAuth } from "@/lib/client/repo";

// Autenticação: com Firebase configurado, login por e-mail/senha
// (Firebase Authentication — as regras do Firestore só permitem escrita
// para usuários logados). Sem Firebase (desenvolvimento local), senha
// fixa "jrsound2026".

type Section =
  | "dashboard"
  | "clientes"
  | "produtos"
  | "projetos"
  | "pedidos"
  | "orcamentos"
  | "galeria"
  | "banners"
  | "relatorios";

interface Row {
  id: string;
  [k: string]: string | number;
}

interface Field {
  key: string;
  label: string;
  type?: "text" | "number" | "select";
  options?: string[];
}

const collections: Record<
  string,
  { label: string; fields: Field[]; seed: Row[] }
> = {
  clientes: {
    label: "Clientes",
    fields: [
      { key: "nome", label: "Nome" },
      { key: "telefone", label: "WhatsApp" },
      { key: "carro", label: "Carro" },
      { key: "status", label: "Status", type: "select", options: ["Novo", "Em negociação", "Cliente", "Inativo"] },
    ],
    seed: [
      { id: "c1", nome: "Carlos Mendes", telefone: "(99) 98888-1111", carro: "Gol G5", status: "Cliente" },
      { id: "c2", nome: "Fernanda Lima", telefone: "(99) 97777-2222", carro: "HB20", status: "Em negociação" },
    ],
  },
  projetos: {
    label: "Projetos",
    fields: [
      { key: "codigo", label: "Código" },
      { key: "cliente", label: "Cliente" },
      { key: "descricao", label: "Descrição" },
      { key: "status", label: "Status", type: "select", options: ["Orçamento", "Aprovado", "Em produção", "Entregue"] },
      { key: "valor", label: "Valor (R$)", type: "number" },
    ],
    seed: [
      { id: "j1", codigo: "JR-DEMO1", cliente: "Carlos Mendes", descricao: 'Dutada 2x12" carpete + LED', status: "Em produção", valor: 3450 },
    ],
  },
  pedidos: {
    label: "Pedidos",
    fields: [
      { key: "numero", label: "Nº" },
      { key: "cliente", label: "Cliente" },
      { key: "itens", label: "Itens" },
      { key: "status", label: "Status", type: "select", options: ["Aguardando pagamento", "Pago", "Enviado", "Concluído", "Cancelado"] },
      { key: "total", label: "Total (R$)", type: "number" },
    ],
    seed: [
      { id: "o1", numero: "1042", cliente: "Fernanda Lima", itens: "2x Tweeter Bala, 1x Módulo 800W", status: "Pago", total: 930 },
    ],
  },
  orcamentos: {
    label: "Orçamentos",
    fields: [
      { key: "codigo", label: "Código" },
      { key: "cliente", label: "Cliente" },
      { key: "origem", label: "Origem", type: "select", options: ["Configurador 3D", "WhatsApp", "Loja", "Instagram"] },
      { key: "status", label: "Status", type: "select", options: ["Novo", "Respondido", "Aprovado", "Perdido"] },
      { key: "valor", label: "Valor (R$)", type: "number" },
    ],
    seed: [
      { id: "q1", codigo: "JR-DEMO2", cliente: "João Pedro", origem: "Configurador 3D", status: "Novo", valor: 2780 },
    ],
  },
  galeria: {
    label: "Galeria",
    fields: [
      { key: "titulo", label: "Título" },
      { key: "categoria", label: "Categoria", type: "select", options: ["Som Interno", "Som Externo", "Trio", "Porta-malas", "Pickups", "SUV", "Sedan", "Antes e Depois", "Vídeos"] },
      { key: "url", label: "URL da imagem/vídeo" },
    ],
    seed: [
      { id: "g1", titulo: "Trio completo — Gol quadrado", categoria: "Trio", url: "" },
    ],
  },
  banners: {
    label: "Banners",
    fields: [
      { key: "titulo", label: "Título" },
      { key: "url", label: "URL da imagem" },
      { key: "link", label: "Link de destino" },
      { key: "ativo", label: "Ativo", type: "select", options: ["Sim", "Não"] },
    ],
    seed: [{ id: "b1", titulo: "Promoção módulos", url: "", link: "/#servicos", ativo: "Sim" }],
  },
};

function useCollection(name: string) {
  const key = `jr-admin-${name}`;
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem(key);
    setRows(raw ? JSON.parse(raw) : collections[name].seed);
  }, [key, name]);
  const save = (next: Row[]) => {
    setRows(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return { rows, save };
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAdminAuth((ok) => {
      setAuthed(ok);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) return null;
  if (!authed) return <Login onOk={() => setAuthed(true)} />;
  return <Panel />;
}

function Login({ onOk }: { onOk: () => void }) {
  const cloud = isCloud();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputCls =
    "w-full rounded-xl bg-surface-2 border border-line px-5 py-3.5 font-medium focus:outline-none focus:border-brand transition-all mb-3";
  return (
    <div className="min-h-screen flex items-center justify-center px-6 speaker-grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,rgba(255,122,0,0.15),transparent_70%)]" />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const ok = await loginAdmin(email, pass);
            if (ok) onOk();
            else setErr(true);
          } finally {
            setBusy(false);
          }
        }}
        className="relative card-premium rounded-3xl p-10 w-full max-w-sm text-center"
      >
        <Image src="/logo.png" alt="JR Sound" width={180} height={120} className="h-20 w-auto mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,122,0,0.5)]" />
        <h1 className="font-[family-name:var(--font-orbitron)] font-bold text-lg mb-1">Painel Administrativo</h1>
        <p className="text-muted text-sm font-medium mb-6">Acesso restrito à equipe JR Sound</p>
        {cloud && (
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(false);
            }}
            placeholder="E-mail do administrador"
            className={inputCls}
          />
        )}
        <input
          type="password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setErr(false);
          }}
          placeholder="Senha de acesso"
          className={inputCls}
        />
        {err && (
          <p className="text-red-400 text-xs font-semibold mb-3">
            {cloud ? "E-mail ou senha incorretos." : "Senha incorreta."}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn-brand w-full rounded-xl py-3.5 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-widest text-black disabled:opacity-60"
        >
          {busy ? "Verificando…" : "Entrar"}
        </button>
        <Link href="/" className="block mt-5 text-xs text-muted hover:text-brand-bright font-semibold">
          ← Voltar ao site
        </Link>
      </form>
    </div>
  );
}

const menu: { id: Section; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "M4 13h6V4H4v9zm10 7h6v-9h-6v9zM4 20h6v-5H4v5zm10-16v5h6V4h-6z" },
  { id: "clientes", label: "Clientes", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" },
  { id: "produtos", label: "Produtos", icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 4L7 9.8v4.4l5 2.8 5-2.8V9.8L12 7z" },
  { id: "projetos", label: "Projetos", icon: "M4 4h16v4H4V4zm0 6h10v4H4v-4zm0 6h16v4H4v-4z" },
  { id: "pedidos", label: "Pedidos", icon: "M6 6h15l-1.5 9h-12L6 6zM6 6L5 3H2m7 17a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" },
  { id: "orcamentos", label: "Orçamentos", icon: "M7 3h10a2 2 0 012 2v16l-7-3-7 3V5a2 2 0 012-2z" },
  { id: "galeria", label: "Galeria", icon: "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm3 9l3-3 2 2 4-5 4 6H5l2 0z" },
  { id: "banners", label: "Banners", icon: "M3 5h18v10H3V5zm4 13h10v2H7v-2z" },
  { id: "relatorios", label: "Relatórios", icon: "M5 21V9m7 12V3m7 18v-8" },
];

function Panel() {
  const [section, setSection] = useState<Section>("dashboard");
  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <aside className="w-16 sm:w-60 bg-surface border-r border-line flex flex-col shrink-0">
        <div className="p-4 flex items-center gap-3 border-b border-line">
          <Image src="/logo.png" alt="JR Sound" width={64} height={44} className="h-9 w-auto" />
          <span className="hidden sm:block font-[family-name:var(--font-orbitron)] text-xs font-bold uppercase tracking-wider text-gradient-brand">
            Admin
          </span>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {menu.map((m) => (
            <button
              key={m.id}
              onClick={() => setSection(m.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                section === m.id
                  ? "bg-brand/15 text-brand-bright shadow-[inset_0_0_16px_rgba(255,122,0,0.1)]"
                  : "text-muted hover:text-foreground hover:bg-surface-2"
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d={m.icon} />
              </svg>
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-line space-y-1">
          <Link href="/" className="block text-center text-xs text-muted hover:text-brand-bright font-semibold py-1">
            ← Site
          </Link>
          <button
            onClick={async () => {
              await logoutAdmin();
              location.reload();
            }}
            className="w-full text-center text-xs text-red-400/80 hover:text-red-300 font-semibold py-1"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* conteúdo */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {section === "dashboard" && <Dashboard />}
        {section === "produtos" && <ProductsAdmin />}
        {section === "relatorios" && <Reports />}
        {section !== "dashboard" && section !== "produtos" && section !== "relatorios" && (
          <Crud name={section} />
        )}
      </main>
    </div>
  );
}

function Dashboard() {
  const { rows: orcamentos } = useCollection("orcamentos");
  const { rows: pedidos } = useCollection("pedidos");
  const { rows: clientes } = useCollection("clientes");
  const { rows: projetos } = useCollection("projetos");

  const faturamento =
    pedidos.reduce((a, r) => a + Number(r.total || 0), 0) +
    projetos.filter((p) => p.status !== "Orçamento").reduce((a, r) => a + Number(r.valor || 0), 0);

  const stats = [
    { l: "Clientes", v: String(clientes.length) },
    { l: "Projetos ativos", v: String(projetos.filter((p) => p.status === "Em produção" || p.status === "Aprovado").length) },
    { l: "Orçamentos novos", v: String(orcamentos.filter((o) => o.status === "Novo").length) },
    { l: "Faturamento", v: money(faturamento) },
  ];

  const monthly = [42, 55, 38, 70, 62, 88, 95, 74, 82, 100, 91, 97];

  return (
    <div>
      <Header title="Dashboard" sub="Visão geral da operação" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.l} className="card-premium rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">{s.l}</p>
            <p className="font-[family-name:var(--font-orbitron)] text-2xl font-extrabold text-gradient-brand">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="card-premium rounded-2xl p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-6">Movimento mensal (exemplo)</p>
        <div className="flex items-end gap-2">
          {monthly.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-brand-deep via-brand to-gold transition-all hover:brightness-125"
                style={{ height: `${v * 1.6}px` }}
              />
              <span className="text-[10px] text-muted font-semibold">
                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Reports() {
  const { rows: pedidos } = useCollection("pedidos");
  const { rows: projetos } = useCollection("projetos");
  const { rows: orcamentos } = useCollection("orcamentos");

  const totalPedidos = pedidos.reduce((a, r) => a + Number(r.total || 0), 0);
  const totalProjetos = projetos.reduce((a, r) => a + Number(r.valor || 0), 0);
  const aprovados = orcamentos.filter((o) => o.status === "Aprovado").length;
  const conversao = orcamentos.length ? Math.round((aprovados / orcamentos.length) * 100) : 0;

  return (
    <div>
      <Header title="Relatórios" sub="Indicadores consolidados" />
      <div className="grid sm:grid-cols-3 gap-5">
        <ReportCard title="Total em pedidos" value={money(totalPedidos)} />
        <ReportCard title="Total em projetos" value={money(totalProjetos)} />
        <ReportCard title="Conversão de orçamentos" value={`${conversao}%`} />
      </div>
      <p className="text-muted text-sm font-medium mt-8">
        Relatórios completos (por período, por categoria, por origem) são habilitados ao conectar o
        banco de dados PostgreSQL — o painel demo consolida os dados locais.
      </p>
    </div>
  );
}

function ReportCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card-premium rounded-2xl p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">{title}</p>
      <p className="font-[family-name:var(--font-orbitron)] text-2xl font-extrabold text-gradient-gold">{value}</p>
    </div>
  );
}

function Crud({ name }: { name: string }) {
  const col = collections[name];
  const { rows, save } = useCollection(name);
  const [editing, setEditing] = useState<Row | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase())
      ),
    [rows, search]
  );

  const blank = () =>
    Object.fromEntries([["id", `${name}-${Date.now()}`], ...col.fields.map((f) => [f.key, f.type === "number" ? 0 : ""])]) as Row;

  return (
    <div>
      <Header title={col.label} sub={`${rows.length} registro${rows.length !== 1 ? "s" : ""}`} />
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar…"
          className="flex-1 min-w-40 rounded-xl bg-surface-2 border border-line px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-brand"
        />
        <button
          onClick={() => setEditing(blank())}
          className="btn-brand rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black"
        >
          + Adicionar
        </button>
      </div>

      <div className="card-premium rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {col.fields.map((f) => (
                <th key={f.key} className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-muted whitespace-nowrap">
                  {f.label}
                </th>
              ))}
              <th className="px-5 py-3.5 w-24" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-line/50 hover:bg-surface-2/60 transition-colors">
                {col.fields.map((f) => (
                  <td key={f.key} className="px-5 py-3.5 font-medium whitespace-nowrap">
                    {f.key.match(/preco|valor|total/) ? money(Number(r[f.key] || 0)) : String(r[f.key] ?? "")}
                  </td>
                ))}
                <td className="px-5 py-3.5">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(r)} className="text-gold hover:text-brand-bright text-xs font-bold uppercase">
                      Editar
                    </button>
                    <button
                      onClick={() => save(rows.filter((x) => x.id !== r.id))}
                      className="text-red-400/80 hover:text-red-300 text-xs font-bold uppercase"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={col.fields.length + 1} className="px-5 py-10 text-center text-muted font-medium">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-6" onClick={() => setEditing(null)}>
          <div className="card-premium rounded-3xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-[family-name:var(--font-orbitron)] font-bold mb-6">
              {rows.some((r) => r.id === editing.id) ? "Editar" : "Novo"} — {col.label}
            </h3>
            <div className="space-y-4">
              {col.fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                    {f.label}
                  </label>
                  {f.type === "select" ? (
                    <select
                      value={String(editing[f.key] ?? "")}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="w-full rounded-xl bg-surface-2 border border-line px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-brand"
                    >
                      <option value="" disabled>Selecione…</option>
                      {f.options!.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={String(editing[f.key] ?? "")}
                      onChange={(e) =>
                        setEditing({ ...editing, [f.key]: f.type === "number" ? +e.target.value : e.target.value })
                      }
                      className="w-full rounded-xl bg-surface-2 border border-line px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-brand"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border border-line py-3 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const exists = rows.some((r) => r.id === editing.id);
                  save(exists ? rows.map((r) => (r.id === editing.id ? editing : r)) : [...rows, editing]);
                  setEditing(null);
                }}
                className="flex-1 btn-brand rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-black"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-[family-name:var(--font-orbitron)] text-2xl font-extrabold">{title}</h1>
      <p className="text-muted text-sm font-medium mt-1">{sub}</p>
    </div>
  );
}
