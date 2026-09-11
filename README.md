# RotaLeve 🚗⛽

**GPS que escolhe a rota mais econômica de combustível, levando em conta as ladeiras da cidade.**

> Protótipo (maquete) funcional. Roda no navegador do computador e do celular.
> Arquivo principal: [`index.html`](index.html).

---

## 1. O conceito

A maioria dos aplicativos de GPS te leva pela rota **mais rápida** ou **mais curta**. Nenhum deles pergunta uma coisa simples que todo motorista sente no bolso:

> **"Qual caminho gasta menos combustível?"**

E a resposta nem sempre é a rota mais curta. Em cidades com **muitas subidas**, uma rota um pouco mais longa, mas plana, pode gastar **menos gasolina** do que uma rota curta cheia de ladeiras pesadas — porque subir morro faz o motor trabalhar (e beber) muito mais.

O **RotaLeve** é um GPS que, além de distância e tempo, analisa a **altitude do trajeto** e o **trânsito**, e recomenda a rota que **custa menos no fim do mês**.

---

## 2. O problema que ele resolve

- Combustível é caro e o preço sobe.
- Cidades com relevo acidentado (ladeiras, serras) têm rotas com consumo muito diferente entre si.
- Os apps atuais **ignoram completamente** o fator altitude na hora de sugerir o caminho.
- O motorista não tem como saber, na prática, qual rota economiza — ele só sente o tanque esvaziando.

O RotaLeve transforma isso em um **número claro**: quanto cada rota custa em **reais** e quanto dá pra **economizar por mês**.

---

## 3. Para quem é (público-alvo)

### 👤 Motorista comum
Quem faz trajetos repetidos (casa ↔ trabalho, levar filhos à escola) numa cidade de ladeiras economiza de forma consistente escolhendo a rota mais leve.

### 🚕 Motoristas de aplicativo (Uber, 99, InDrive) — **o público onde a ideia mais brilha**
Para quem dirige o dia inteiro, **combustível é o maior custo do negócio** — muitas vezes 30% a 40% do que se ganha. Alguns centavos de economia por corrida, multiplicados por **dezenas de corridas por dia** e centenas por mês, viram um valor grande no fim do mês.

Um GPS que reduz o consumo é, na prática, um **aumento direto do lucro** do motorista — sem correr mais, sem trabalhar mais horas, só escolhendo caminhos mais inteligentes.

### 🛵 Entregadores (iFood, Rappi, motoboys)
Mesmo raciocínio: muitas viagens curtas por dia, onde evitar ladeiras desnecessárias reduz gasto e desgaste do veículo.

### 🚚 Pequenas transportadoras e frotas
Empresas com vários veículos podem usar a lógica para **reduzir o custo de combustível da frota inteira** e ainda ter um argumento ambiental (menos CO₂).

---

## 4. Como funciona (a lógica, passo a passo)

Quando você digita **origem** e **destino**, o app faz o seguinte:

1. **Encontra os endereços no mapa** (geocodificação) — transforma o texto ("Praça Central") em coordenadas.
2. **Calcula as rotas possíveis** — pede ao motor de rotas 2 ou 3 caminhos alternativos entre os dois pontos.
3. **Mede a altitude de cada rota** — pega ~100 pontos ao longo de cada caminho e consulta a altitude de cada um.
4. **Calcula o esforço das subidas** — soma toda a subida acumulada e a converte em combustível extra.
5. **Aplica o trânsito** — penaliza tempo e consumo conforme o horário e o quanto a rota é urbana.
6. **Compara e recomenda** — mostra o custo em R$ de cada rota, a economia por mês e destaca a **mais econômica**.

### As contas por trás (explicadas de forma simples)

**a) Subida total (o "termômetro" das ladeiras)**
Somamos apenas os trechos em que a rota **ganha** altitude. Se um caminho sobe 300 m no total e outro sobe 50 m, o primeiro claramente exige mais do motor.

**b) Combustível estimado**
O gasto de cada rota é a soma de duas partes:

- **Parte plana:** `distância ÷ consumo do carro (km/litro)` — o cálculo tradicional.
- **Parte das subidas:** a energia física necessária para "erguer" o carro morro acima — `peso do carro × gravidade × altura subida` — convertida em litros de gasolina (descontando as perdas naturais do motor).

> Em fórmula simplificada:
> **litros = (distância ÷ consumo) + (peso × 9,81 × subida_total ÷ energia_útil_por_litro)**

**c) Custo e CO₂**
- **Custo (R$)** = litros × preço do litro.
- **CO₂ (kg)** = litros × 2,31 (cada litro de gasolina queimado emite ~2,31 kg de CO₂).

**d) Trânsito**
O app estima quão **urbana** é cada rota pela velocidade média do trajeto. No horário de pico, rotas de cidade recebem uma **penalidade maior** (mais tempo parado + mais consumo no "para-e-anda") do que rotas de rodovia. Assim, o trânsito pode **mudar qual rota compensa**.

**e) Projeção mensal**
Com base em "quantas vezes você faz essa rota por semana", a economia de uma viagem é multiplicada para mostrar o impacto **no mês** — que é o número que realmente importa pro bolso.

### O destaque visual das ladeiras
No mapa, a rota selecionada é **pintada pela inclinação**:

| Cor | Significado |
|-----|-------------|
| 🟢 Verde | Descida |
| 🔵 Azul | Plano |
| 🟡 Amarelo | Subida leve |
| 🟠 Laranja | Subida forte |
| 🔴 Vermelho | Subida íngreme |

Assim o motorista **vê** onde estão os morros, não só um número.

---

## 5. Tecnologias usadas (nesta maquete)

Todos os serviços abaixo são **gratuitos** e foram "encaixados" como peças — o app não reinventa o GPS, ele combina ferramentas prontas e adiciona a inteligência da economia:

| Função | Serviço usado |
|--------|---------------|
| Mapa | OpenStreetMap + biblioteca Leaflet |
| Busca de endereços | Nominatim (OpenStreetMap) |
| Cálculo de rotas | OSRM (com rotas alternativas) |
| Altitude / elevação | Open-Meteo Elevation |

O diferencial (medir subidas, estimar combustível, aplicar trânsito e comparar) é a lógica própria do RotaLeve.

---

## 6. Limitações honestas (é uma maquete de validação)

- **Não é um app de celular ainda** — é uma página web que já se adapta ao formato de celular.
- A estimativa de combustível é um **bom termômetro**, não um número exato de bomba — depende do carro, do motor e do jeito de dirigir.
- Usa servidores gratuitos de demonstração, que podem ficar lentos ou fora do ar.
- O **trânsito é simulado** de forma inteligente. Trânsito real, ao vivo, exige um serviço **pago** (Google, Mapbox, TomTom, HERE).
- A navegação passo a passo por voz ("vire à direita") ainda não existe.

Nada disso atrapalha o objetivo atual: **provar o conceito e validar a ideia** com pessoas reais.

---

## 7. Objetivo e próximos passos

**Objetivo do produto:** ajudar motoristas a gastar menos combustível (e emitir menos CO₂) escolhendo rotas mais inteligentes, com foco especial em quem dirige muito e para quem cada economia conta — os **motoristas de aplicativo**.

**Roadmap possível (da maquete ao app de verdade):**

1. ✅ **Maquete funcional** — prova o conceito.
2. ✅ **PWA (app instalável)** — o app já pode ser instalado na tela do celular por um link (manifesto, ícone, service worker). **← onde estamos**
3. 🔜 **Hospedagem gratuita** — publicar o link (GitHub Pages / Netlify) para instalar em celulares reais.
4. 🔜 **Validação** — colocar na mão de motoristas e motoristas de app, ouvir a reação.
5. ⏳ **Dados reais de trânsito** — integração com serviço pago.
6. ⏳ **Perfil por veículo** — cada motorista cadastra seu carro/moto para cálculos mais precisos.
7. ⏳ **Navegação por voz** passo a passo.
8. ⏳ **App nativo + publicação** na Play Store e App Store (se a validação for positiva).

## Como instalar no celular (quando estiver hospedado)

1. Abrir o link do app no navegador do celular (Chrome no Android, Safari no iPhone).
2. **Android:** aparece um aviso "Instalar app" (ou menu ⋮ → "Instalar aplicativo").
3. **iPhone:** botão de compartilhar → "Adicionar à Tela de Início".
4. O ícone do RotaLeve aparece na tela, e abre como um app normal.

---

*Documento gerado como parte do planejamento do projeto RotaLeve.*
