# 🔥 Tutorial — Hospedar o site JR Sound no Firebase (100% GRÁTIS)

Este guia usa apenas o **plano Spark** do Firebase — gratuito, **sem cartão de
crédito**:

| Serviço | Para quê | Custo |
| --- | --- | --- |
| **Firebase Hosting** | Hospeda o site (páginas, configurador 3D, painel) | Grátis |
| **Firestore** | Banco de dados dos produtos (tempo real) | Grátis |
| **Authentication** | Login do administrador | Grátis |

As fotos dos produtos são comprimidas no navegador e guardadas dentro do
próprio banco, então não precisamos do Firebase Storage (que exigiria plano
pago). O código já está pronto — é só seguir os passos.

---

## Passo 1 — Criar o projeto no Firebase

1. Acesse **https://console.firebase.google.com** e entre com sua conta Google
2. Clique em **"Criar um projeto"**
3. Nome: `jr-sound` (ou o que preferir) → **Continuar**
4. Google Analytics: pode **desativar** → **Criar projeto**
5. Aguarde e clique em **Continuar**

> Não faça upgrade de plano. Tudo aqui funciona no plano **Spark (gratuito)**.

## Passo 2 — Ativar o Firestore (banco de dados)

1. Menu lateral → **Criação** → **Firestore Database**
2. **Criar banco de dados**
3. Local: **southamerica-east1 (São Paulo)**
4. Modo: **Produção** → **Criar**

Agora as regras de segurança (quem pode ler/escrever):

5. Abra a aba **Regras** do Firestore
6. Apague tudo e cole o conteúdo do arquivo **`firestore.rules`** do projeto
   (leitura pública, escrita só para o administrador logado)
7. Clique em **Publicar**

## Passo 3 — Ativar o login do administrador

1. Menu lateral → **Criação** → **Authentication** → **Começar**
2. Em **Método de login**, ative **E-mail/senha** → **Salvar**
3. Aba **Usuários** → **Adicionar usuário**:
   - E-mail: o seu (ex.: `jrsound@gmail.com`)
   - Senha: **forte** — será a senha do painel `/admin`
4. **Adicionar usuário**

## Passo 4 — Registrar o site (app da Web)

1. ⚙️ → **Configurações do projeto** → aba **Geral**
2. Em "Seus aplicativos", clique no ícone **`</>`** (Web)
3. Apelido: `jr-sound-web` → **NÃO** marque Firebase Hosting aqui → **Registrar app**
4. Vai aparecer um código com `firebaseConfig = { apiKey: "...", ... }`.
   **Deixe essa tela aberta** — vamos copiar 4 valores dela no próximo passo.

## Passo 5 — Configurar o projeto na sua máquina

1. Na pasta do projeto, copie o arquivo `.env.example` e renomeie a cópia para
   **`.env.local`**
2. Preencha com os valores da tela do Passo 4:

```env
NEXT_PUBLIC_FB_API_KEY=AIzaSy...            (apiKey)
NEXT_PUBLIC_FB_AUTH_DOMAIN=jr-sound-xxx.firebaseapp.com   (authDomain)
NEXT_PUBLIC_FB_PROJECT_ID=jr-sound-xxx      (projectId)
NEXT_PUBLIC_FB_APP_ID=1:1234:web:abcd       (appId)
```

3. Teste localmente: `npm run dev` → abra `http://localhost:3000/admin`,
   entre com o **e-mail e senha do Passo 3**
4. Como o banco está vazio, o painel mostra o botão
   **"Carregar catálogo inicial de exemplo"** — clique nele
5. Abra o configurador: os produtos agora vêm do Firestore. Edite algo no
   painel e veja mudar **em tempo real** 🎉

> Esses valores `NEXT_PUBLIC_*` não são segredos — eles identificam o projeto
> e vão junto com o site. A segurança vem das regras (Passo 2) e do login
> (Passo 3).

## Passo 6 — Publicar o site

1. Instale o Firebase CLI (uma vez só) e faça login:

```bash
npm install -g firebase-tools
firebase login
```

2. Vincule a pasta ao seu projeto (uma vez só):

```bash
firebase use --add
```

Escolha o projeto `jr-sound-xxx` na lista e dê um apelido (ex.: `default`).

3. Gere o site e publique:

```bash
npm run build
firebase deploy --only hosting
```

Ao final aparece o endereço do seu site:

```
Hosting URL: https://jr-sound-xxx.web.app
```

Abra no celular e no computador — site, configurador 3D e painel no ar. 🚀

**Para publicar qualquer atualização futura**, repita apenas o item 3
(`npm run build` + `firebase deploy --only hosting`).

## Passo 7 — Domínio próprio (opcional)

1. Console → **Hosting** → **Adicionar domínio personalizado**
2. Digite seu domínio (ex.: `www.jrsound.com.br`)
3. Cadastre os registros DNS que o Firebase mostrar no site onde você comprou
   o domínio (Registro.br, GoDaddy…)
4. Aguarde a verificação — o certificado HTTPS é automático e gratuito

---

## Como funciona no dia a dia

- **Cadastrar/editar produtos**: `https://SEU-SITE.web.app/admin` — login com o
  e-mail/senha do Passo 3. Fotos são comprimidas sozinhas; mudanças aparecem
  no configurador **na hora**, sem republicar o site
- **Mudar textos/visual do site**: edite o código → `npm run build` →
  `firebase deploy --only hosting`
- **Ver os dados**: console do Firebase → Firestore → coleção `produtos`
- **Trocar a senha do admin**: Authentication → Usuários → ⋮ → Redefinir senha

## Limites do plano gratuito (tranquilos para uma loja)

| Recurso | Cota grátis/dia | Na prática |
| --- | --- | --- |
| Leituras do banco | 50.000 | ~1.500 visitas/dia no configurador |
| Escritas do banco | 20.000 | Milhares de edições de produto |
| Hospedagem | 10 GB armazenados, 360 MB/dia de tráfego | Site + modelos 3D leves |
| Foto por produto | — | Comprimida p/ ~30–60KB, várias por produto |
| Modelo 3D por produto | ~700KB embutido | Acima disso, use um link externo |

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| `firebase: comando não encontrado` | Feche e reabra o terminal após o `npm install -g firebase-tools` |
| Painel diz "E-mail ou senha incorretos" | Confira o usuário no Authentication (Passo 3) e se o método E-mail/senha está ativado |
| Salvar produto dá erro de permissão | As regras do Passo 2 foram publicadas? Você está logado no painel? |
| Produtos não aparecem no site publicado | O `.env.local` estava preenchido **antes** do `npm run build`? Rode o build de novo |
| Configurador vazio no primeiro acesso | Entre no `/admin` e clique em "Carregar catálogo inicial" |
| Foto recusada ao salvar | Produto passou de ~950KB — remova imagens extras ou use link para o modelo 3D |
