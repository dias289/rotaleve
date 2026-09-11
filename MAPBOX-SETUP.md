# Como ligar o trânsito real (Mapbox) — sua parte (~5 min)

O código do app já está pronto para usar o Mapbox. Falta só você criar uma conta gratuita e me passar a **chave (token)**. Só você pode fazer, porque usa a sua conta.

## Passo 1 — Criar a conta (grátis)
1. Acesse [account.mapbox.com/auth/signup](https://account.mapbox.com/auth/signup).
2. Cadastre-se (e-mail e senha).
3. Pode pedir um **cartão** — é para o caso de você passar da cota grátis (100.000 consultas/mês). **Dentro da cota, não cobra nada.**

## Passo 2 — Pegar o token público
1. Entre em [account.mapbox.com](https://account.mapbox.com/).
2. Na página inicial há o **"Default public token"** — é um texto que começa com **`pk.`**
3. É esse token que eu preciso.

## Passo 3 (importante) — Proteger o token
Como o app é público, vamos **restringir** o token para só funcionar no seu site:
1. Em [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens/), clique no token (ou crie um novo).
2. Na parte **"URL restrictions"**, adicione:
   - `https://dias289.github.io/*`
3. Salve.

> Assim, mesmo sendo público, o token só funciona a partir do seu site — ninguém consegue usar sua cota em outro lugar.

## Passo 4 — Me enviar o token
Cole aqui no chat o token (começa com `pk.`). Eu ligo o trânsito real no app, publico e a gente testa.

---

## O que muda quando ligar
- O tempo das rotas passa a refletir o **trânsito ao vivo** (não mais a simulação).
- O seletor "Trânsito no horário" some e aparece o selo **"🚦 Trânsito real (ao vivo)"**.
- Aparece a atribuição **© Mapbox** (exigência de uso deles).

## Sobre custo (lembrete)
- **100.000 consultas/mês são grátis.** Isso cobre a fase de teste com tranquilidade.
- Você pode acompanhar o uso em [account.mapbox.com/statistics](https://account.mapbox.com/statistics/).
- Se um dia passar disso, cobra ~US$ 2 por mil consultas extras.
