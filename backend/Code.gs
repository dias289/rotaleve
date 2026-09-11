/**
 * RotaLeve — Servidor de licença (Google Apps Script)
 * ---------------------------------------------------
 * Controla quais chaves e aparelhos podem usar o app.
 * O "painel de controle" é a própria planilha (abas "chaves" e "aparelhos").
 *
 * COMO USAR:
 *  1. Crie uma planilha no Google Sheets.
 *  2. Menu Extensões > Apps Script. Cole este código.
 *  3. Rode a função "primeiroUso" uma vez (cria as abas e uma chave de exemplo).
 *  4. Implante como "App da Web" (Executar como: eu / Quem tem acesso: qualquer pessoa).
 *  5. Copie a URL do app da web e envie para configurar no app.
 *
 * Abas criadas:
 *  - "chaves":    chave | status(ativa/bloqueada) | max_aparelhos | motorista
 *  - "aparelhos": device_id | chave | status(ativo/bloqueado) | token | ativado_em | ultimo_acesso | aparelho
 */

// Token do Mapbox (trânsito real). Fica AQUI no servidor (não no código público do app).
// Só é entregue a aparelhos já ativados por uma chave válida.
// >>> Substitua o texto abaixo pelo seu token do Mapbox (começa com "pk."). <<<
var MAPBOX_TOKEN = 'COLE_SEU_TOKEN_DO_MAPBOX_AQUI';

function primeiroUso() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var chaves = ss.getSheetByName('chaves') || ss.insertSheet('chaves');
  if (chaves.getLastRow() === 0) {
    chaves.appendRow(['chave', 'status', 'max_aparelhos', 'motorista']);
    chaves.appendRow(['TESTE-1234', 'ativa', 1, 'Chave de exemplo']);
  }
  var aps = ss.getSheetByName('aparelhos') || ss.insertSheet('aparelhos');
  if (aps.getLastRow() === 0) {
    aps.appendRow(['device_id', 'chave', 'status', 'token', 'ativado_em', 'ultimo_acesso', 'aparelho']);
  }
}

function doGet(e) {
  return responder(e && e.parameter ? e.parameter : {});
}
function doPost(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  if (e && e.postData && e.postData.contents) {
    try { var b = JSON.parse(e.postData.contents); for (var k in b) p[k] = b[k]; } catch (_) {}
  }
  return responder(p);
}

function responder(p) {
  var out;
  try { out = processar(p); }
  catch (err) { out = { ok: false, reason: 'erro no servidor: ' + err }; }
  var json = JSON.stringify(out);
  if (p.callback) {
    // JSONP (evita problemas de CORS no navegador)
    return ContentService.createTextOutput(p.callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function processar(p) {
  var acao = p.action || '';
  if (acao === 'activate') return ativar(p.key, p.device, p.ua);
  if (acao === 'check') return verificar(p.device, p.token);
  if (acao === 'mapbox') return darMapbox(p.device, p.token);
  if (acao === 'ping') return { ok: true, msg: 'servidor RotaLeve no ar' };
  return { ok: false, reason: 'ação desconhecida' };
}

function ativar(chave, device, ua) {
  chave = (chave || '').trim();
  device = (device || '').trim();
  if (!chave || !device) return { ok: false, reason: 'faltam dados' };

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var shChaves = ss.getSheetByName('chaves');
    var shAps = ss.getSheetByName('aparelhos');

    // procura a chave
    var linhas = shChaves.getDataRange().getValues();
    var reg = null;
    for (var i = 1; i < linhas.length; i++) {
      if (String(linhas[i][0]).trim() === chave) { reg = { row: i, status: String(linhas[i][1]).trim(), max: Number(linhas[i][2]) || 1 }; break; }
    }
    if (!reg) return { ok: false, reason: 'chave inválida' };
    if (reg.status.toLowerCase() !== 'ativa') return { ok: false, reason: 'chave bloqueada' };

    // já existe este aparelho para esta chave?
    var aps = shAps.getDataRange().getValues();
    var usados = 0;
    for (var j = 1; j < aps.length; j++) {
      var d = String(aps[j][0]).trim(), k = String(aps[j][1]).trim(), st = String(aps[j][2]).trim().toLowerCase();
      if (k === chave && st === 'ativo') {
        usados++;
        if (d === device) {
          // reativação no mesmo aparelho: devolve o token existente
          shAps.getRange(j + 1, 6).setValue(new Date());
          return { ok: true, token: String(aps[j][3]) };
        }
      }
    }
    if (usados >= reg.max) return { ok: false, reason: 'limite de aparelhos atingido para esta chave' };

    var token = Utilities.getUuid();
    shAps.appendRow([device, chave, 'ativo', token, new Date(), new Date(), (ua || '').substring(0, 160)]);
    return { ok: true, token: token };
  } finally {
    lock.releaseLock();
  }
}

// Entrega o token do Mapbox apenas se o aparelho estiver autorizado.
function darMapbox(device, token) {
  var v = verificar(device, token);
  if (v && v.ok) return { ok: true, mb: MAPBOX_TOKEN };
  return v; // repassa o motivo (aparelho bloqueado / não ativado)
}

function verificar(device, token) {
  device = (device || '').trim();
  token = (token || '').trim();
  if (!device) return { ok: false, reason: 'faltam dados' };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shChaves = ss.getSheetByName('chaves');
  var shAps = ss.getSheetByName('aparelhos');
  var aps = shAps.getDataRange().getValues();

  for (var j = 1; j < aps.length; j++) {
    if (String(aps[j][0]).trim() === device) {
      var chave = String(aps[j][1]).trim();
      var st = String(aps[j][2]).trim().toLowerCase();
      var tk = String(aps[j][3]);
      if (st !== 'ativo') return { ok: false, blocked: true, reason: 'aparelho bloqueado' };
      if (token && tk !== token) return { ok: false, blocked: true, reason: 'token inválido' };

      // a chave associada ainda está ativa?
      var chaves = shChaves.getDataRange().getValues();
      for (var i = 1; i < chaves.length; i++) {
        if (String(chaves[i][0]).trim() === chave) {
          if (String(chaves[i][1]).trim().toLowerCase() !== 'ativa') return { ok: false, blocked: true, reason: 'chave bloqueada' };
          break;
        }
      }
      shAps.getRange(j + 1, 6).setValue(new Date()); // ultimo_acesso
      return { ok: true };
    }
  }
  return { ok: false, reason: 'aparelho não ativado' };
}
