import { NextRequest, NextResponse } from "next/server";
import { listProducts, updateProduct, deleteProduct } from "@/lib/server/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const item = (await listProducts()).find((p) => p.id === id);
  if (!item) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const patch = await req.json();
  const updated = await updateProduct(id, patch);
  if (!updated) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
