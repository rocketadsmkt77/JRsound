import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];
const MODEL_EXT = [".glb", ".gltf"];
const MAX_SIZE = 30 * 1024 * 1024; // 30MB

/**
 * POST /api/upload — multipart com campo `file`.
 * Aceita imagens (.png/.jpg/.jpeg/.webp) e modelos 3D (.glb/.gltf).
 * Salva em public/uploads e devolve { url, tipo }.
 *
 * Para migrar para Firebase Storage/S3 depois, troque apenas esta rota:
 * o resto do sistema só conhece a URL devolvida.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "arquivo ausente" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "arquivo maior que 30MB" }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const isImage = IMAGE_EXT.includes(ext);
  const isModel = MODEL_EXT.includes(ext);
  if (!isImage && !isModel) {
    return NextResponse.json(
      { error: `extensao nao permitida (${IMAGE_EXT.join(", ")}, ${MODEL_EXT.join(", ")})` },
      { status: 415 }
    );
  }

  const safeBase = path
    .basename(file.name, ext)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .slice(0, 40);
  const name = `${Date.now().toString(36)}-${safeBase}${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${name}`, tipo: isModel ? "modelo3D" : "imagem" });
}
