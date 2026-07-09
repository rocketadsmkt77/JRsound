import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/server/store";

export const dynamic = "force-dynamic";

/** GET /api/produtos?ativos=1 — lista produtos (opcionalmente só os ativos) */
export async function GET(req: NextRequest) {
  const onlyActive = req.nextUrl.searchParams.get("ativos") === "1";
  let items = await listProducts();
  if (onlyActive) items = items.filter((p) => p.ativo);
  return NextResponse.json(items);
}

/** POST /api/produtos — cria produto */
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.nome || !body?.categoria) {
    return NextResponse.json({ error: "nome e categoria são obrigatórios" }, { status: 400 });
  }
  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
