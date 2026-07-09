"use client";

import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { Product, Category, Face, faceOf, renderDims, sizeOf } from "@/lib/products";

/**
 * Representação visual dos produtos na cena.
 *
 * Prioridade: modelo 3D (.glb/.gltf) cadastrado no painel → imagem do produto
 * (plano 3D) → modelo procedural por categoria. Modelos e texturas são
 * carregados sob demanda, apenas quando o produto entra na cena.
 *
 * Unidade do mundo: 1 = 10cm (decímetro). `s(cm)` converte.
 * Convenção: modelos construídos apontando para +Y; a cena rotaciona os
 * itens de face frontal para que +Y aponte para fora da caixa.
 */
export const s = (cm: number) => cm / 10;

interface Spec {
  size: number;
  dims: [number, number, number];
  round: boolean;
  category: Category;
}

const gold = "#c9a542";
const selGold = "#ff9500";

/* ---------------- modelo 3D enviado pelo painel ---------------- */

function GltfModel({ url, spec, face }: { url: string; spec: Spec; face: Face }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const { scale, position } = useMemo(() => {
    const bb = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bb.getSize(size);
    bb.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const target = Math.max(...spec.dims.map(s));
    const k = target / maxDim;
    // topo: apoiado na superfície; frente: centralizado na face
    const pos: [number, number, number] =
      face === "top"
        ? [-center.x * k, -bb.min.y * k, -center.z * k]
        : [-center.x * k, -center.y * k, -center.z * k];
    return { scale: k, position: pos };
  }, [cloned, spec.dims, face]);
  return (
    <group scale={scale} position={position}>
      <primitive object={cloned} />
    </group>
  );
}

/* ---------------- imagem do produto como plano 3D ---------------- */

function ImagePlane({ url, spec, face }: { url: string; spec: Spec; face: Face }) {
  const texture = useTexture(url);
  const w = s(spec.dims[0]);
  const h = s(spec.dims[1]) || w;
  if (face === "top") {
    // em pé sobre a caixa, virada para o observador
    return (
      <mesh position={[0, h / 2, 0]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={texture} transparent alphaTest={0.05} side={2} />
      </mesh>
    );
  }
  // deitada sobre a face frontal (normal local = +Y)
  return (
    <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.05} side={2} />
    </mesh>
  );
}

function Placeholder({ spec }: { spec: Spec }) {
  return (
    <mesh position={[0, s(spec.dims[2]) / 4, 0]}>
      <boxGeometry args={[s(spec.dims[0]), s(spec.dims[2]) / 2, s(spec.dims[1])]} />
      <meshStandardMaterial color="#222" wireframe />
    </mesh>
  );
}

/* ---------------- modelos procedurais por categoria ---------------- */

function SpeakerModel({ item, sel }: { item: Spec; sel: boolean }) {
  const r = s(item.size) / 2;
  const depth = s(item.dims[2]);
  return (
    <group>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[r * 1.08, r * 1.08, 0.04, 48]} />
        <meshStandardMaterial color={sel ? selGold : gold} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.88, r * 0.09, 16, 48]} />
        <meshStandardMaterial color="#111" roughness={0.85} />
      </mesh>
      <mesh position={[0, -depth * 0.14, 0]}>
        <cylinderGeometry args={[r * 0.82, r * 0.24, depth * 0.3, 48, 1, true]} />
        <meshStandardMaterial color="#161616" roughness={0.5} metalness={0.35} side={2} />
      </mesh>
      <mesh position={[0, -depth * 0.2, 0]}>
        <sphereGeometry args={[r * 0.26, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.3} metalness={0.55} />
      </mesh>
      <mesh position={[0, -depth * 0.62, 0]}>
        <cylinderGeometry args={[r * 0.45, r * 0.45, depth * 0.5, 32]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.4} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * r * 0.99, 0.046, Math.sin(a) * r * 0.99]}>
            <cylinderGeometry args={[0.018, 0.018, 0.02, 8]} />
            <meshStandardMaterial color="#ddd" metalness={1} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

function TweeterModel({ item, sel }: { item: Spec; sel: boolean }) {
  const r = s(item.size) / 2;
  const d = s(item.dims[2]);
  return (
    <group>
      <mesh position={[0, -d * 0.1, 0]}>
        <cylinderGeometry args={[r, r * 1.08, d * 0.5, 32]} />
        <meshStandardMaterial color={sel ? "#5a3a10" : "#1a1a1a"} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, d * 0.14, 0]}>
        <sphereGeometry args={[r * 0.52, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={sel ? selGold : gold} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.75, 0.025, 8, 32]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
    </group>
  );
}

function DriverModel({ item, sel }: { item: Spec; sel: boolean }) {
  const r = s(item.size) / 2;
  const d = s(item.dims[2]);
  return (
    <group>
      <mesh position={[0, -d * 0.35, 0]}>
        <cylinderGeometry args={[r * 0.78, r * 0.78, d * 0.6, 32]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[r, r * 0.4, d * 0.35, 32, 1, true]} />
        <meshStandardMaterial color={sel ? selGold : gold} metalness={0.85} roughness={0.25} side={2} />
      </mesh>
    </group>
  );
}

function HornModel({ item, sel }: { item: Spec; sel: boolean }) {
  const r = s(item.size) / 2;
  const d = s(item.dims[2]);
  return (
    <group>
      <mesh position={[0, -d * 0.1, 0]}>
        <cylinderGeometry args={[r, r * 0.22, d * 0.65, 32, 1, true]} />
        <meshStandardMaterial color={sel ? "#5a3a10" : "#111"} roughness={0.4} metalness={0.4} side={2} />
      </mesh>
      <mesh position={[0, -d * 0.55, 0]}>
        <cylinderGeometry args={[r * 0.26, r * 0.26, d * 0.3, 24]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      <mesh position={[0, d * 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.98, r * 0.05, 12, 40]} />
        <meshStandardMaterial color={sel ? selGold : gold} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function AmpModel({ item, sel }: { item: Spec; sel: boolean }) {
  const [w, h, d] = item.dims.map(s);
  return (
    <group position={[0, h / 2, 0]}>
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={sel ? "#3a2a12" : "#181818"} roughness={0.35} metalness={0.7} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-w / 2 + (i + 1) * (w / 8), h / 2 + 0.02, 0]}>
          <boxGeometry args={[0.035, 0.04, d * 0.88]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 0, d / 2 + 0.006]}>
        <boxGeometry args={[w * 0.85, h * 0.28, 0.012]} />
        <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function BatteryModel({ item, sel }: { item: Spec; sel: boolean }) {
  const [w, h, d] = item.dims.map(s);
  return (
    <group position={[0, h / 2, 0]}>
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={sel ? "#3a2a12" : "#141414"} roughness={0.6} />
      </mesh>
      <mesh position={[0, h * 0.36, 0]}>
        <boxGeometry args={[w * 1.002, h * 0.28, d * 1.002]} />
        <meshStandardMaterial color="#ff7a00" roughness={0.5} />
      </mesh>
      <mesh position={[-w * 0.3, h / 2 + 0.06, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.12, 16]} />
        <meshStandardMaterial color={gold} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[w * 0.3, h / 2 + 0.06, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.12, 16]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function VoltmeterModel({ item, sel }: { item: Spec; sel: boolean }) {
  const [w, h, d] = item.dims.map(s);
  return (
    <group>
      <mesh position={[0, d / 2, 0]}>
        <boxGeometry args={[w, d, h]} />
        <meshStandardMaterial color={sel ? "#333" : "#0f0f0f"} roughness={0.4} />
      </mesh>
      <mesh position={[0, d + 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.8, h * 0.6]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff6a00" emissiveIntensity={2.2} />
      </mesh>
    </group>
  );
}

function CoolerModel({ item, sel }: { item: Spec; sel: boolean }) {
  const r = s(item.size) / 2;
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[r * 2.15, 0.2, r * 2.15]} />
        <meshStandardMaterial color={sel ? "#333" : "#101010"} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.85, 0.03, 8, 32]} />
        <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={0.9} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, 0.22, 0]} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <boxGeometry args={[r * 1.5, 0.03, r * 0.3]} />
          <meshStandardMaterial color="#1c1c1c" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function DuctModel({ item, sel }: { item: Spec; sel: boolean }) {
  const r = s(item.size) / 2;
  const d = s(item.dims[2]);
  return (
    <group>
      <mesh position={[0, -d * 0.35, 0]}>
        <cylinderGeometry args={[r, r, d, 32, 1, true]} />
        <meshStandardMaterial color="#151515" roughness={0.4} side={2} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 1.02, r * 0.16, 12, 40]} />
        <meshStandardMaterial color={sel ? selGold : "#222"} roughness={0.35} metalness={0.5} />
      </mesh>
    </group>
  );
}

function TerminalModel({ item, sel }: { item: Spec; sel: boolean }) {
  const [w, h, d] = item.dims.map(s);
  return (
    <group>
      <mesh position={[0, d / 2, 0]}>
        <boxGeometry args={[w, d, h]} />
        <meshStandardMaterial color={sel ? "#333" : "#111"} roughness={0.5} />
      </mesh>
      <mesh position={[-w * 0.22, d + 0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
        <meshStandardMaterial color="#c0392b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[w * 0.22, d + 0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function LedModel({ item, sel, color }: { item: Spec; sel: boolean; color: string }) {
  if (!item.round) {
    const [w, h] = item.dims.map(s);
    return (
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[w, 0.07, h]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={sel ? 3 : 2} toneMapped={false} />
      </mesh>
    );
  }
  const r = s(item.size) / 2;
  return (
    <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[r, 0.05, 12, 48]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={sel ? 3 : 2} toneMapped={false} />
    </mesh>
  );
}

function GrilleModel({ item, sel }: { item: Spec; sel: boolean }) {
  const r = s(item.size) / 2;
  return (
    <group position={[0, 0.08, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.06, 12, 48]} />
        <meshStandardMaterial color={sel ? selGold : "#2a2a2a"} metalness={0.8} roughness={0.3} />
      </mesh>
      {[0.72, 0.45].map((f) => (
        <mesh key={f} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r * f, 0.035, 8, 40]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {[0, Math.PI / 3, (2 * Math.PI) / 3].map((a) => (
        <mesh key={a} rotation={[0, a, 0]}>
          <boxGeometry args={[r * 2, 0.04, 0.05]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function BracketModel({ item, sel }: { item: Spec; sel: boolean }) {
  const w = s(item.size);
  return (
    <group>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[w, 0.08, w]} />
        <meshStandardMaterial color={sel ? selGold : gold} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, w / 2, -w / 2 + 0.04]}>
        <boxGeometry args={[w, w, 0.08]} />
        <meshStandardMaterial color={sel ? selGold : gold} metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

function ProceduralModel({ spec, sel, ledColor }: { spec: Spec; sel: boolean; ledColor: string }) {
  switch (spec.category) {
    case "subwoofer":
    case "altofalante":
      return <SpeakerModel item={spec} sel={sel} />;
    case "tweeter":
    case "supertweeter":
      return <TweeterModel item={spec} sel={sel} />;
    case "driver":
      return <DriverModel item={spec} sel={sel} />;
    case "corneta":
      return <HornModel item={spec} sel={sel} />;
    case "modulo":
    case "fonte":
      return <AmpModel item={spec} sel={sel} />;
    case "bateria":
      return <BatteryModel item={spec} sel={sel} />;
    case "voltimetro":
      return <VoltmeterModel item={spec} sel={sel} />;
    case "cooler":
      return <CoolerModel item={spec} sel={sel} />;
    case "duto":
      return <DuctModel item={spec} sel={sel} />;
    case "borne":
      return <TerminalModel item={spec} sel={sel} />;
    case "led":
      return <LedModel item={spec} sel={sel} color={ledColor} />;
    case "grade":
      return <GrilleModel item={spec} sel={sel} />;
    case "cantoneira":
      return <BracketModel item={spec} sel={sel} />;
    default:
      return <Placeholder spec={spec} />;
  }
}

/* ---------------- componente principal ---------------- */

export function ComponentModel({
  product,
  sel,
  ledColor,
}: {
  product: Product;
  sel: boolean;
  ledColor: string;
}) {
  const spec: Spec = {
    size: sizeOf(product),
    dims: renderDims(product),
    round: product.diametro > 0,
    category: product.categoria,
  };
  const face = faceOf(product.categoria);

  if (product.modelo3D) {
    return (
      <Suspense fallback={<Placeholder spec={spec} />}>
        <GltfModel url={product.modelo3D} spec={spec} face={face} />
      </Suspense>
    );
  }
  if (product.imagem) {
    return (
      <Suspense fallback={<Placeholder spec={spec} />}>
        <ImagePlane url={product.imagem} spec={spec} face={face} />
      </Suspense>
    );
  }
  return <ProceduralModel spec={spec} sel={sel} ledColor={ledColor} />;
}
