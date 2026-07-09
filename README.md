# JR Sound — Som e Acessórios

Site premium com **configurador 3D de caixas de som automotivo**, construído com
Next.js, React Three Fiber, Tailwind CSS e Framer Motion.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento — http://localhost:3000
npm run build    # build de produção
npm start        # servir build de produção
```

## Páginas

| Rota | Descrição |
| --- | --- |
| `/` | Home: hero com partículas e equalizadores, sobre, serviços, galeria e contato |
| `/configurador` | **Configurador 3D** — a principal funcionalidade |
| `/admin` | Painel administrativo (senha demo: `jrsound2026`) |

## Configurador 3D

- **8 formatos de caixa**: reta, trapézio, selada, dutada, trio, lateral, canhão e personalizado
- **Medidas livres**: largura, altura, profundidade, espessura do MDF (9–25mm), cantos arredondados, divisórias, reforços e dutos
- **Biblioteca 100% dinâmica**: os produtos vêm do cadastro feito no painel `/admin` (API REST). Nada de peças fixas no código — cadastrou, apareceu; desativou/excluiu, sumiu. O configurador se atualiza sozinho (ao focar a aba e a cada 20s)
- **Manipulação direta**: clique para selecionar, arraste sobre a caixa (com snap de 2,5cm e grade), gire, redimensione, duplique e exclua
- **Câmera livre 360°** com zoom e controle de iluminação
- **Aparência**: carpete, pintura, madeira naval, fibra ou couro; cor livre; LED com 7 cores
- **Cálculos em tempo real**: volume interno bruto/útil, deslocamento de falantes/dutos/estrutura, sintonia (Helmholtz), área e comprimento de dutos, chapas de MDF, parafusos, cola, carpete, peso e prazo
- **Alertas inteligentes**: litragem fora do recomendado, sintonia inadequada, duto maior que a caixa, MDF fino demais, falantes que não cabem na frente
- **Saídas**: lista de materiais com preço estimado, PDF do projeto com imagem renderizada e código único, e envio do orçamento completo pelo WhatsApp

## Produtos dinâmicos (Admin ⇄ Configurador)

O cadastro de produtos do painel `/admin` alimenta o Configurador 3D em tempo real:

- **API REST**: `GET/POST /api/produtos`, `GET/PUT/DELETE /api/produtos/[id]`,
  `POST /api/upload` (multipart)
- **Banco**: arquivo `data/products.json` no servidor, criado automaticamente na
  primeira execução com um catálogo inicial. Toda a lógica de acesso está em
  [lib/server/store.ts](lib/server/store.ts) — para migrar para
  PostgreSQL/Firestore basta reimplementar essas 4 funções
- **Uploads**: imagens (`.png .jpg .webp`) e modelos 3D (`.glb .gltf`) vão para
  `public/uploads/` e o banco guarda só a URL. Para usar Firebase Storage/S3,
  troque apenas [app/api/upload/route.ts](app/api/upload/route.ts)
- **Cadastro completo**: nome, marca, modelo, categoria, descrição, preço,
  estoque, diâmetro, diâmetro de corte, medidas, profundidade, peso, cor,
  volume deslocado, litragem recomendada (alertas), ordem, ativo e
  redimensionável
- **Representação na cena**: modelo 3D (.glb) quando cadastrado → senão a
  imagem do produto como plano 3D → senão um modelo automático gerado pela
  categoria. Modelos e texturas carregam sob demanda (lazy), somente quando o
  produto entra na cena
- **Somente ativos**: o configurador consulta `/api/produtos?ativos=1`;
  produtos desativados ou excluídos somem (inclusive das cenas em andamento)

## Personalização rápida

- **WhatsApp / redes / horários**: edite [lib/site.ts](lib/site.ts)
- **Produtos, preços, fotos e modelos 3D**: painel `/admin` → Produtos
- **Preços de MDF/acabamento/mão de obra**: edite as constantes em [components/configurator/calc.ts](components/configurator/calc.ts)
- **Catálogo inicial (primeira execução)**: [lib/seed-products.ts](lib/seed-products.ts)
- **Fotos da galeria**: substitua os itens em [components/Gallery.tsx](components/Gallery.tsx)
- **Logo**: `public/logo.png` (o arquivo original em alta está em `logo-original.png`)

## Painel administrativo

Gerencia clientes, **produtos (integrado ao configurador via API)**, projetos,
pedidos, orçamentos, galeria, banners e relatórios, com dashboard.

As demais seções (clientes, pedidos…) ainda são demo em `localStorage`, e a
senha é fixa (`ADMIN_PASS` em [components/admin/Admin.tsx](components/admin/Admin.tsx)).
Próximos passos para produção:

1. Migrar as demais coleções para a API (mesmo padrão de `/api/produtos`)
2. Autenticação JWT no lugar da senha fixa (e proteger as rotas de escrita)
3. Trocar o armazenamento local por PostgreSQL/Firebase quando for hospedar
