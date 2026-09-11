# Como ligar a trava de segurança do RotaLeve (sua parte, ~5 min)

Esta é a configuração do **servidor de licença** no seu Google. Só você pode fazer, porque usa a sua conta. É rápido e não precisa programar.

## Passo 1 — Criar a planilha (o seu painel de controle)
1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma **planilha em branco**.
2. Dê um nome, por exemplo: **RotaLeve — Licenças**.

## Passo 2 — Colar o código do servidor
1. Na planilha, menu **Extensões → Apps Script**.
2. Apague qualquer código que estiver lá.
3. Abra o arquivo [`Code.gs`](Code.gs) (que eu criei) e **copie todo o conteúdo**.
4. **Cole** no Apps Script e clique no ícone de **salvar** (💾).

## Passo 3 — Preparar as abas
1. Ainda no Apps Script, no topo, selecione a função **`primeiroUso`** na lista.
2. Clique em **▶ Executar**.
3. Vai pedir autorização (é normal — é o seu próprio script): **Revisar permissões → escolher sua conta → Avançado → Acessar (não seguro) → Permitir**.
4. Volte para a planilha: agora ela tem duas abas — **chaves** e **aparelhos** — com uma chave de exemplo `TESTE-1234`.

## Passo 4 — Publicar o servidor
1. No Apps Script, canto superior direito: **Implantar → Nova implantação**.
2. Em "Selecionar tipo" (engrenagem ⚙️), escolha **App da Web**.
3. Configure:
   - **Executar como:** Eu (você)
   - **Quem pode acessar:** **Qualquer pessoa**
4. Clique **Implantar** e **copie a URL do app da Web** (algo como `https://script.google.com/macros/s/.../exec`).

## Passo 5 — Me enviar a URL
Cole aqui no chat a URL que você copiou. Eu conecto no app, ligo a trava e a gente testa juntos com a chave `TESTE-1234`.

---

## Depois: como você controla tudo (na planilha)

### Aba `chaves`
| chave | status | max_aparelhos | motorista |
|-------|--------|---------------|-----------|
| TESTE-1234 | ativa | 1 | Chave de exemplo |
| JOAO-2025 | ativa | 2 | João (moto + carro) |

- **Liberar alguém:** adicione uma linha com uma chave nova (invente o nome), status `ativa`, e quantos aparelhos ela pode usar.
- **Bloquear:** mude o status para `bloqueada`. Na próxima vez que a pessoa abrir o app, trava.

### Aba `aparelhos` (preenchida automaticamente)
Cada aparelho que ativar aparece aqui. Para **revogar um aparelho específico**, mude o status dele para `bloqueado`.

> Dica: dê uma chave diferente para cada motorista. Assim você sabe quem é quem e pode bloquear individualmente.
