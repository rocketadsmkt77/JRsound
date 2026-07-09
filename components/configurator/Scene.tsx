"use client";

import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Grid, ContactShadows } from "@react-three/drei";
import { useConfigurator } from "./store";
import { faceOf, renderDims, sizeOf } from "@/lib/products";
import { ComponentModel, s } from "./models";
import { FinishType } from "./types";

const SNAP_CM = 2.5;

function finishMaterialProps(finish: FinishType, color: string) {
  switch (finish) {
    case "pintura":
      return { color, roughness: 0.18, metalness: 0.35 };
    case "madeira":
      return { color: color === "#1a1a1a" ? "#6b4a2b" : color, roughness: 0.55, metalness: 0.05 };
    case "fibra":
      return { color, roughness: 0.3, metalness: 0.55 };
    case "couro":
      return { color, roughness: 0.75, metalness: 0.05 };
    default: // carpete
      return { color, roughness: 0.95, metalness: 0 };
  }
}

function BoxShell() {
  const { box } = useConfigurator();
  const W = s(box.width);
  const H = s(box.height);
  const D = s(box.depth);
  const mat = finishMaterialProps(box.finish, box.color);

  if (box.shape === "canhao") {
    const r = Math.min(W, H) / 2;
    return (
      <group>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, r, 0]}>
          <cylinderGeometry args={[r, r, D, 48]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        {[D / 2, -D / 2].map((z) => (
          <mesh key={z} position={[0, r, z]}>
            <torusGeometry args={[r * 0.99, 0.05, 12, 48]} />
            <meshStandardMaterial color="#c9a542" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>
    );
  }

  if (box.shape === "trapezio" || box.shape === "lateral") {
    const slope = box.shape === "trapezio" ? 0.42 : 0.28;
    const shape = new THREE.Shape();
    // perfil lateral (profundidade × altura): frente vertical, traseira inclinada
    shape.moveTo(-D / 2, 0);
    shape.lineTo(D / 2, 0);
    shape.lineTo(D / 2, H);
    shape.lineTo(-D / 2 + D * slope, H);
    shape.lineTo(-D / 2, H * 0.35);
    shape.closePath();
    return (
      <group rotation={[0, -Math.PI / 2, 0]} position={[0, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, -W / 2]}>
          <extrudeGeometry args={[shape, { depth: W, bevelEnabled: false }]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      </group>
    );
  }

  // reta / selada / dutada / trio / personalizado
  const radius = box.roundedCorners ? Math.min(W, H, D) * 0.06 : 0.015;
  return (
    <group>
      <RoundedBox
        args={[W, H, D]}
        radius={radius}
        smoothness={4}
        castShadow
        receiveShadow
        position={[0, H / 2, 0]}
      >
        <meshStandardMaterial {...mat} />
      </RoundedBox>
      {/* frisos de divisórias (trio / divisórias) */}
      {Array.from({ length: box.shape === "trio" ? Math.max(box.dividers, 2) : box.dividers }).map(
        (_, i, arr) => {
          const n = arr.length + 1;
          const x = -W / 2 + ((i + 1) * W) / n;
          return (
            <mesh key={i} position={[x, H / 2, D / 2 + 0.004]}>
              <boxGeometry args={[0.03, H * 0.96, 0.012]} />
              <meshStandardMaterial color="#000" roughness={0.9} />
            </mesh>
          );
        }
      )}
    </group>
  );
}

function Ports() {
  const { box } = useConfigurator();
  if (box.port.count <= 0) return null;
  const W = s(box.width);
  const H = s(box.height);
  const D = s(box.depth);
  const r = s(box.port.diameter) / 2;
  const y = Math.max(r + 0.15, H * 0.24);
  return (
    <group>
      {Array.from({ length: box.port.count }).map((_, i) => {
        const n = box.port.count;
        const x = n === 1 ? 0 : -W / 2 + ((i + 1) * W) / (n + 1) + (i - (n - 1) / 2) * r * 0.4;
        return (
          <group key={i} position={[x, y, D / 2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -s(box.port.length) / 2]}>
              <cylinderGeometry args={[r * 0.92, r * 0.92, s(box.port.length), 32, 1, true]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.5} side={2} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <torusGeometry args={[r, r * 0.14, 12, 40]} />
              <meshStandardMaterial color="#c9a542" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function LedStrip() {
  const { box } = useConfigurator();
  if (!box.ledOn) return null;
  const W = s(box.width);
  const H = s(box.height);
  const D = s(box.depth);
  return (
    <group>
      <mesh position={[0, 0.06, D / 2 + 0.02]}>
        <boxGeometry args={[W * 0.96, 0.05, 0.03]} />
        <meshStandardMaterial
          color={box.ledColor}
          emissive={box.ledColor}
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, H - 0.06, D / 2 + 0.02]}>
        <boxGeometry args={[W * 0.96, 0.05, 0.03]} />
        <meshStandardMaterial
          color={box.ledColor}
          emissive={box.ledColor}
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 0.3, D / 2 + 1]} intensity={6} distance={6} color={box.ledColor} />
    </group>
  );
}

function PlacedItems({ dragging, setDragging }: { dragging: string | null; setDragging: (v: string | null) => void }) {
  const { box, items, selected, select, updateItem, snap, getProduct } = useConfigurator();
  const W = s(box.width);
  const H = s(box.height);
  const D = s(box.depth);

  return (
    <group>
      {items.map((it) => {
        const product = getProduct(it.productId);
        if (!product) return null;
        const dims = renderDims(product);
        const isSel = selected === it.uid;
        const front = faceOf(product.categoria) === "front";
        const pos: [number, number, number] = front
          ? [s(it.x), H / 2 + s(it.y), D / 2 + 0.02]
          : [s(it.x), H + 0.01, s(it.y)];
        return (
          <group
            key={it.uid}
            position={pos}
            rotation={front ? [Math.PI / 2, 0, 0] : [0, 0, 0]}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              select(it.uid);
              setDragging(it.uid);
            }}
            onPointerUp={() => setDragging(null)}
          >
            <group rotation={[0, (it.rotation * Math.PI) / 180, 0]} scale={it.scale}>
              <ComponentModel product={product} sel={isSel} ledColor={box.ledColor} />
            </group>
            {isSel && (
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <torusGeometry args={[(s(Math.max(dims[0], sizeOf(product))) / 2) * it.scale + 0.25, 0.03, 8, 48]} />
                <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={2} toneMapped={false} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* plano invisível de arraste */}
      {dragging && (() => {
        const it = items.find((i) => i.uid === dragging);
        if (!it) return null;
        const product = getProduct(it.productId);
        if (!product) return null;
        const dims = renderDims(product);
        const front = faceOf(product.categoria) === "front";
        const halfW = (s(dims[0]) * it.scale) / 2;
        return (
          <mesh
            position={front ? [0, H / 2, D / 2 + 0.02] : [0, H + 0.01, 0]}
            rotation={front ? [0, 0, 0] : [-Math.PI / 2, 0, 0]}
            visible={false}
            onPointerMove={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              const p = e.point;
              let xCm: number;
              let yCm: number;
              if (front) {
                xCm = p.x * 10;
                yCm = (p.y - H / 2) * 10;
              } else {
                xCm = p.x * 10;
                yCm = p.z * 10;
              }
              if (snap) {
                xCm = Math.round(xCm / SNAP_CM) * SNAP_CM;
                yCm = Math.round(yCm / SNAP_CM) * SNAP_CM;
              }
              const maxX = box.width / 2 - halfW * 10;
              const maxY = front
                ? box.height / 2 - halfW * 10
                : box.depth / 2 - (s(dims[2]) * it.scale * 10) / 2;
              xCm = THREE.MathUtils.clamp(xCm, -Math.max(maxX, 0), Math.max(maxX, 0));
              yCm = THREE.MathUtils.clamp(yCm, -Math.max(maxY, 0), Math.max(maxY, 0));
              updateItem(it.uid, { x: xCm, y: yCm });
            }}
            onPointerUp={() => setDragging(null)}
          >
            <planeGeometry args={[60, 60]} />
          </mesh>
        );
      })()}
    </group>
  );
}

export default function Scene() {
  const { box, showGrid, lightIntensity, select } = useConfigurator();
  const [dragging, setDragging] = useState<string | null>(null);
  const controlsRef = useRef(null);
  const H = s(box.height);

  const target = useMemo(() => new THREE.Vector3(0, H / 2, 0), [H]);

  return (
    <Canvas
      shadows
      camera={{ position: [11, 7, 14], fov: 42 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      onPointerMissed={() => select(null)}
      className="!touch-none"
    >
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 30, 70]} />

      {/* iluminação */}
      <ambientLight intensity={0.45 * lightIntensity} />
      <hemisphereLight intensity={0.35 * lightIntensity} color="#fff5e8" groundColor="#1a0d00" />
      <spotLight
        position={[8, 14, 10]}
        angle={0.5}
        penumbra={0.6}
        intensity={260 * lightIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#fff2e0"
      />
      <pointLight position={[-10, 6, -6]} intensity={60 * lightIntensity} color="#ff7a00" />
      <pointLight position={[12, 4, -10]} intensity={40 * lightIntensity} color="#f5c453" />
      <pointLight position={[0, 5, 14]} intensity={90 * lightIntensity} color="#fff0dd" />

      {/* piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.85} metalness={0.2} />
      </mesh>
      {showGrid && (
        <Grid
          position={[0, 0.001, 0]}
          args={[44, 44]}
          cellSize={0.5}
          cellColor="#1f1f1f"
          sectionSize={2.5}
          sectionColor="#3a2410"
          fadeDistance={34}
          infiniteGrid={false}
        />
      )}
      <ContactShadows position={[0, 0.002, 0]} opacity={0.7} scale={30} blur={2.2} far={8} />

      <BoxShell />
      <Ports />
      <LedStrip />
      <PlacedItems dragging={dragging} setDragging={setDragging} />

      <OrbitControls
        ref={controlsRef}
        target={target}
        enabled={!dragging}
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2 - 0.02}
      />
    </Canvas>
  );
}
