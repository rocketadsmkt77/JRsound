# JR Sound — Som e Acessórios

Site premium com **configurador 3D de caixas de som automotivo**, construído com
Next.js, React Three Fiber, Tailwind CSS e Framer Motion.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento — http://localhost:3000
npm run build    # gera o site estático na pasta out/ (para publicar)
```

## Páginas

| Rota | Descrição |
| --- | --- |
| `/` | Home: hero com partículas e equalizadores, sobre, serviços, galeria e contato |
| `/configurador` | **Configurador 3D** — a principal funcionalidade |
| `/admin` | Painel administrativo (local: senha `jrsound2026`; produção: e-mail/senha do Firebase) |

## Configurador 3D

- **8 formatos de caixa**: reta, trapézio, selada, dutada, trio, lateral, canhão e personalizado
- **Medidas livres**: largura, altura, profundidade, espessura do MDF (9–25mm), cantos arredondados, divisórias, reforços e dutos
- **Biblioteca 100% dinâmica**: os produtos vêm do cadastro feito no painel `/admin`. Nada de peças fixas no código — cadastrou, apareceu; desativou/excluiu, sumiu. Com Firebase, a atualização é **em tempo real**
- **Manipulação direta**: clique para selecionar, arraste sobre a caixa (com snap de 2,5cm e grade), gire, redimensione, duplique e exclua
- **Câmera livre 360°** com zoom e controle de iluminação
- **Aparência**: carpete, pintura, madeira naval, fibra ou couro; cor livre; LED com 7 cores
- **Cálculos em tempo real**: volume interno bruto/útil, deslocamento de falantes/dutos/estrutura, sintonia (Helmholtz), área e comprimento de dutos, chapas de MDF, parafusos, cola, carpete, peso e prazo
- **Alertas inteligentes**: litragem fora do recomendado, sintonia inadequada, duto maior que a caixa, MDF fino demais, falantes que não cabem na frente
- **Saídas**: lista de materiais com preço estimado, PDF do projeto com imagem renderizada e código único, e envio do orçamento completo pelo WhatsApp

## Produtos dinâmicos (Admin ⇄ Configurador)

O cadastro de produtos do painel `/admin` alimenta o Configurador 3D em tempo real:

- **Repositório com dois backends automáticos** ([lib/client/repo.ts](lib/client/repo.ts)):
  - **Firebase Firestore** (plano gratuito) quando as variáveis
    `NEXT_PUBLIC_FB_*` estão no `.env.local` — produção, com atualização
    **em tempo real** no configurador
  - `localStorage` do navegador — desenvolvimento sem Firebase
- **Segurança**: leitura pública; escrita só para o administrador logado
  (Firebase Authentication + [firestore.rules](firestore.rules))
- **Imagens**: comprimidas no navegador (~30–60KB) e salvas embutidas no
  banco — dispensa o Firebase Storage (que exigiria plano pago)
- **Modelos 3D**: arquivo `.glb` até ~700KB embutido, ou link externo
- **Cadastro completo**: nome, marca, modelo, categoria, descrição, preço,
  estoque, diâmetro, diâmetro de corte, medidas, profundidade, peso, cor,
  volume deslocado, litragem recomendada (alertas), ordem, ativo e
  redimensionável
- **Representação na cena**: modelo 3D (.glb) quando cadastrado → senão a
  imagem do produto como plano 3D → senão um modelo automático gerado pela
  categoria. Modelos e texturas carregam sob demanda (lazy), somente quando o
  produto entra na cena
- **Somente ativos**: o configurador exibe apenas produtos com `ativo = true`;
  desativados ou excluídos somem (inclusive das cenas em andamento)

## Personalização rápida

- **WhatsApp / redes / horários**: edite [lib/site.ts](lib/site.ts)
- **Produtos, preços, fotos e modelos 3D**: painel `/admin` → Produtos
- **Preços de MDF/acabamento/mão de obra**: edite as constantes em [components/configurator/calc.ts](components/configurator/calc.ts)
- **Catálogo inicial (primeira execução)**: [lib/seed-products.ts](lib/seed-products.ts)
- **Fotos da galeria**: substitua os itens em [components/Gallery.tsx](components/Gallery.tsx)
- **Logo**: `public/logo.png` (o arquivo original em alta está em `logo-original.png`)

## Hospedagem no Firebase (gratuita, sem cartão)

O site é exportado estático (`output: "export"`) e roda no **Firebase Hosting**
gratuito, com **Firestore** (produtos) e **Authentication** (login do painel) —
tudo no plano **Spark**. Passo a passo completo em
**[TUTORIAL-FIREBASE.md](TUTORIAL-FIREBASE.md)**.

- [.env.example](.env.example) — variáveis `NEXT_PUBLIC_FB_*` do seu projeto
- [firebase.json](firebase.json) — configuração do Hosting (`out/`)
- [firestore.rules](firestore.rules) — regras de segurança do banco
- Publicação: `npm run build` + `firebase deploy --only hosting`

## Painel administrativo

Gerencia clientes, **produtos (integrado ao configurador)**, projetos,
pedidos, orçamentos, galeria, banners e relatórios, com dashboard.

As demais seções (clientes, pedidos…) ainda são demo em `localStorage` do
navegador. Próximo passo natural: migrá-las para o mesmo padrão do
repositório de produtos (coleções no Firestore).
