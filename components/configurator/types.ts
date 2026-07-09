export type { Category, Face, Product } from "@/lib/products";

export type BoxShape =
  | "reta"
  | "trapezio"
  | "selada"
  | "dutada"
  | "trio"
  | "lateral"
  | "canhao"
  | "personalizado";

export interface PlacedItem {
  uid: string;
  productId: string;
  x: number; // cm, relativo ao centro da face
  y: number; // cm
  rotation: number; // graus, em torno da normal da face
  scale: number;
}

export type FinishType = "carpete" | "pintura" | "madeira" | "fibra" | "couro";

export interface Port {
  count: number;
  diameter: number; // cm
  length: number; // cm
}

export interface BoxConfig {
  shape: BoxShape;
  width: number; // cm
  height: number; // cm
  depth: number; // cm
  thickness: number; // mm
  roundedCorners: boolean;
  dividers: number;
  braces: number;
  port: Port;
  finish: FinishType;
  color: string;
  ledOn: boolean;
  ledColor: string;
}
