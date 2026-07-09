/**
 * Modelo de produto compartilhado entre o Painel Administrativo,
 * a API REST e o Configurador 3D.
 */

export type Category =
  | "subwoofer"
  | "altofalante"
  | "tweeter"
  | "supertweeter"
  | "driver"
  | "corneta"
  | "modulo"
  | "fonte"
  | "bateria"
  | "voltimetro"
  | "cooler"
  | "duto"
  | "borne"
  | "led"
  | "grade"
  | "cantoneira";

export type Face = "front" | "top";

export interface Product {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  categoria: Category;
  descricao: string;
  preco: number; // R$
  estoque: number;
  /** diâmetro nominal externo (cm) — 0 quando não se aplica */
  diametro: number;
  /** diâmetro de corte no MDF (cm) — 0 quando não se aplica */
  diametroCorte: number;
  /** medidas para itens retangulares (cm) */
  largura: number;
  altura: number;
  profundidade: number;
  peso: number; // kg
  cor: string;
  /** litros deslocados dentro da caixa — 0 quando não se aplica */
  volumeDeslocado: number;
  /** litragem recomendada por unidade (L) — 0 = não se aplica (usado nos alertas) */
  litragemMin: number;
  litragemMax: number;
  /** permite redimensionar na cena 3D */
  redimensionavel: boolean;
  /** URL da imagem principal */
  imagem: string;
  /** galeria de imagens */
  imagens: string[];
  /** URL do modelo 3D (.glb/.gltf) */
  modelo3D: string;
  ativo: boolean;
  ordem: number;
  criadoEm: string;
  atualizadoEm: string;
}

export const categoryLabels: Record<Category, string> = {
  subwoofer: "Subwoofers",
  altofalante: "Alto-falantes",
  tweeter: "Tweeters",
  supertweeter: "Super Tweeters",
  driver: "Drivers",
  corneta: "Cornetas",
  modulo: "Módulos",
  fonte: "Fontes",
  bateria: "Baterias",
  voltimetro: "Voltímetros",
  cooler: "Coolers",
  duto: "Dutos",
  borne: "Bornes",
  led: "LEDs",
  grade: "Grades",
  cantoneira: "Cantoneiras",
};

export const categorySingular: Record<Category, string> = {
  subwoofer: "Subwoofer",
  altofalante: "Alto-falante",
  tweeter: "Tweeter",
  supertweeter: "Super Tweeter",
  driver: "Driver",
  corneta: "Corneta",
  modulo: "Módulo amplificador",
  fonte: "Fonte automotiva",
  bateria: "Bateria",
  voltimetro: "Voltímetro",
  cooler: "Cooler",
  duto: "Duto",
  borne: "Borne",
  led: "Iluminação LED",
  grade: "Grade de proteção",
  cantoneira: "Cantoneira",
};

/** módulos, fontes e baterias ficam sobre a caixa; o resto na frente */
export function faceOf(cat: Category): Face {
  return cat === "modulo" || cat === "fonte" || cat === "bateria" ? "top" : "front";
}

export function isRound(p: Pick<Product, "categoria" | "diametro">): boolean {
  return p.diametro > 0;
}

/** dimensões [largura, altura, profundidade] em cm usadas para render/colisão */
export function renderDims(p: Product): [number, number, number] {
  if (p.diametro > 0) {
    return [p.diametro * 1.07, p.diametro * 1.07, p.profundidade || p.diametro * 0.5];
  }
  return [p.largura || 10, p.altura || 10, p.profundidade || 5];
}

/** tamanho de referência (cm) — diâmetro para redondos, largura para o resto */
export function sizeOf(p: Product): number {
  return p.diametro > 0 ? p.diametro : p.largura || 10;
}

export function emptyProduct(): Product {
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
    ordem: 1,
    criadoEm: "",
    atualizadoEm: "",
  };
}
