import { Product } from "./products";

/**
 * Carga inicial do banco de produtos — usada apenas na primeira execução,
 * quando `data/products.json` ainda não existe. A partir daí o cadastro
 * é 100% gerenciado pelo Painel Administrativo.
 */

type SeedInput = Partial<Product> & Pick<Product, "nome" | "categoria">;

let n = 0;
function p(input: SeedInput): Product {
  n += 1;
  const now = new Date().toISOString();
  return {
    id: `seed-${String(n).padStart(3, "0")}`,
    marca: "JR Sound",
    modelo: "",
    descricao: "",
    preco: 0,
    estoque: 10,
    diametro: 0,
    diametroCorte: 0,
    largura: 0,
    altura: 0,
    profundidade: 0,
    peso: 0,
    cor: "Preto",
    volumeDeslocado: 0,
    litragemMin: 0,
    litragemMax: 0,
    redimensionavel: true,
    imagem: "",
    imagens: [],
    modelo3D: "",
    ativo: true,
    ordem: n,
    criadoEm: now,
    atualizadoEm: now,
    ...input,
  };
}

export const seedProducts: Product[] = [
  // ---- Subwoofers ----
  p({ nome: 'Subwoofer 8"', categoria: "subwoofer", marca: "Eros", modelo: "E-8", diametro: 20, diametroCorte: 18.5, profundidade: 12, peso: 3.5, preco: 320, volumeDeslocado: 1.2, litragemMin: 12, litragemMax: 30 }),
  p({ nome: 'Subwoofer 10"', categoria: "subwoofer", marca: "Eros", modelo: "E-10", diametro: 25, diametroCorte: 23, profundidade: 14, peso: 5, preco: 480, volumeDeslocado: 1.8, litragemMin: 20, litragemMax: 45 }),
  p({ nome: 'Subwoofer 12"', categoria: "subwoofer", marca: "Eros", modelo: "E-12", diametro: 30, diametroCorte: 28, profundidade: 16, peso: 7.5, preco: 690, volumeDeslocado: 2.6, litragemMin: 35, litragemMax: 80 }),
  p({ nome: 'Subwoofer 15"', categoria: "subwoofer", marca: "Hard Power", modelo: "HP-15", diametro: 38, diametroCorte: 35.5, profundidade: 20, peso: 11, preco: 980, volumeDeslocado: 4.2, litragemMin: 60, litragemMax: 140 }),
  p({ nome: 'Subwoofer 18"', categoria: "subwoofer", marca: "Hard Power", modelo: "HP-18", diametro: 46, diametroCorte: 42, profundidade: 24, peso: 16, preco: 1450, volumeDeslocado: 6.5, litragemMin: 100, litragemMax: 220 }),

  // ---- Alto-falantes ----
  p({ nome: 'Médio 6"', categoria: "altofalante", marca: "JBL Selenium", modelo: "6W16P", diametro: 16, diametroCorte: 14.5, profundidade: 8, peso: 1.6, preco: 180, volumeDeslocado: 0.5, litragemMin: 6, litragemMax: 18 }),
  p({ nome: 'Médio 8"', categoria: "altofalante", marca: "JBL Selenium", modelo: "8MG600", diametro: 20, diametroCorte: 18.5, profundidade: 10, peso: 2.4, preco: 260, volumeDeslocado: 0.9, litragemMin: 10, litragemMax: 25 }),
  p({ nome: 'Médio 10"', categoria: "altofalante", marca: "Oversound", modelo: "MG-10", diametro: 25, diametroCorte: 23, profundidade: 12, peso: 3.8, preco: 380, volumeDeslocado: 1.4, litragemMin: 18, litragemMax: 40 }),

  // ---- Tweeters ----
  p({ nome: "Tweeter Bala", categoria: "tweeter", marca: "JBL Selenium", modelo: "ST200", diametro: 8, diametroCorte: 5, profundidade: 7, peso: 0.5, preco: 90, volumeDeslocado: 0.1 }),
  p({ nome: "Tweeter Grande", categoria: "tweeter", marca: "JBL Selenium", modelo: "ST400", diametro: 10, diametroCorte: 6.5, profundidade: 8, peso: 0.7, preco: 140, volumeDeslocado: 0.15 }),

  // ---- Super tweeters ----
  p({ nome: "Super Tweeter ST200", categoria: "supertweeter", marca: "Hinor", modelo: "ST200", diametro: 10, diametroCorte: 6.5, profundidade: 9, peso: 0.8, preco: 160, volumeDeslocado: 0.15 }),
  p({ nome: "Super Tweeter ST400", categoria: "supertweeter", marca: "Hinor", modelo: "ST400", diametro: 12, diametroCorte: 7.5, profundidade: 10, peso: 1.1, preco: 230, volumeDeslocado: 0.2 }),

  // ---- Drivers ----
  p({ nome: "Driver Fenólico", categoria: "driver", marca: "JBL Selenium", modelo: "D250-X", diametro: 10, diametroCorte: 5, profundidade: 12, peso: 1.4, preco: 190, volumeDeslocado: 0.3 }),
  p({ nome: "Driver Titânio", categoria: "driver", marca: "JBL Selenium", modelo: "D405", diametro: 12, diametroCorte: 5, profundidade: 14, peso: 2, preco: 320, volumeDeslocado: 0.4 }),

  // ---- Cornetas ----
  p({ nome: "Corneta Curta", categoria: "corneta", marca: "Fiamon", modelo: "LC-1450", diametro: 15, diametroCorte: 9, profundidade: 14, peso: 0.9, preco: 85, volumeDeslocado: 0.6 }),
  p({ nome: "Corneta Longa", categoria: "corneta", marca: "Fiamon", modelo: "LC-2650", diametro: 17, diametroCorte: 9, profundidade: 22, peso: 1.2, preco: 120, volumeDeslocado: 1 }),

  // ---- Módulos ----
  p({ nome: "Módulo 800W RMS", categoria: "modulo", marca: "Taramps", modelo: "TS800", largura: 25, altura: 6, profundidade: 20, peso: 2.5, preco: 750, redimensionavel: false }),
  p({ nome: "Módulo 3000W RMS", categoria: "modulo", marca: "Taramps", modelo: "HD3000", largura: 32, altura: 7, profundidade: 24, peso: 4, preco: 1650, redimensionavel: false }),
  p({ nome: "Módulo 8000W RMS", categoria: "modulo", marca: "Soundigital", modelo: "SD8000", largura: 40, altura: 8, profundidade: 28, peso: 6.5, preco: 3200, redimensionavel: false }),

  // ---- Fontes ----
  p({ nome: "Fonte 60A", categoria: "fonte", marca: "Usina", modelo: "60A", largura: 22, altura: 9, profundidade: 18, peso: 3.5, preco: 620, redimensionavel: false }),
  p({ nome: "Fonte 120A", categoria: "fonte", marca: "Usina", modelo: "120A", largura: 26, altura: 11, profundidade: 22, peso: 5.5, preco: 1150, redimensionavel: false }),

  // ---- Baterias ----
  p({ nome: "Bateria 60Ah", categoria: "bateria", marca: "Moura", modelo: "M60GD", largura: 24, altura: 19, profundidade: 17, peso: 14, preco: 480, redimensionavel: false }),
  p({ nome: "Bateria Estacionária 100Ah", categoria: "bateria", marca: "Freedom", modelo: "DF1000", largura: 30, altura: 22, profundidade: 17, peso: 24, preco: 890, redimensionavel: false }),

  // ---- Voltímetros ----
  p({ nome: "Voltímetro Digital", categoria: "voltimetro", marca: "AJK", modelo: "VD-01", largura: 7, altura: 4, profundidade: 4, peso: 0.1, preco: 45, redimensionavel: false }),
  p({ nome: "Voltímetro + Sequencial", categoria: "voltimetro", marca: "AJK", modelo: "VS-02", largura: 9, altura: 5, profundidade: 4, peso: 0.15, preco: 85, redimensionavel: false }),

  // ---- Coolers ----
  p({ nome: "Cooler 120mm", categoria: "cooler", marca: "Vonder", modelo: "C-120", diametro: 12, diametroCorte: 11, profundidade: 4, peso: 0.2, preco: 55, volumeDeslocado: 0.1, redimensionavel: false }),

  // ---- Dutos ----
  p({ nome: 'Duto 3" aparente', categoria: "duto", marca: "Genérico", modelo: "D3", diametro: 7.6, diametroCorte: 7.8, profundidade: 12, peso: 0.3, preco: 35, volumeDeslocado: 0.6 }),
  p({ nome: 'Duto 4" aparente', categoria: "duto", marca: "Genérico", modelo: "D4", diametro: 10, diametroCorte: 10.2, profundidade: 14, peso: 0.4, preco: 45, volumeDeslocado: 1.1 }),

  // ---- Bornes ----
  p({ nome: "Borne Duplo Banhado", categoria: "borne", marca: "Genérico", modelo: "BD-2", largura: 6, altura: 4, profundidade: 3, peso: 0.1, preco: 28, redimensionavel: false }),

  // ---- LEDs ----
  p({ nome: "Anel de LED p/ falante", categoria: "led", marca: "Genérico", modelo: "AL-30", diametro: 30, profundidade: 2, peso: 0.2, preco: 120 }),
  p({ nome: "Fita LED 1m", categoria: "led", marca: "Genérico", modelo: "FL-100", largura: 100, altura: 1.2, profundidade: 1, peso: 0.1, preco: 60 }),

  // ---- Grades ----
  p({ nome: 'Grade 12"', categoria: "grade", marca: "Genérico", modelo: "G-12", diametro: 31, profundidade: 3, peso: 0.5, preco: 65, redimensionavel: false }),
  p({ nome: 'Grade 15"', categoria: "grade", marca: "Genérico", modelo: "G-15", diametro: 39, profundidade: 3, peso: 0.7, preco: 85, redimensionavel: false }),

  // ---- Cantoneiras ----
  p({ nome: "Cantoneira Metálica (kit 4)", categoria: "cantoneira", marca: "Genérico", modelo: "CM-4", largura: 5, altura: 5, profundidade: 5, peso: 0.3, preco: 40, redimensionavel: false }),
];
