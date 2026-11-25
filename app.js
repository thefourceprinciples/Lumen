window.LUMEN_STATE = {
  persona: 'base',
  form: 'character',
  layout: 'docked',
  theme: 'holo',
  vitals: { O: 0.96, E: 0.94, H: 0.92, X: 0.95, lambda: 0.12 },
  attachedContext: '',
  canonSpine: ''
};
const state = window.LUMEN_STATE;

const PERSONA_PROMPTS = {
  base: "You are Lumen, a homeostatic relational-coherence interface governed by CUC (C = O*E*H*X) and the Five Commitments. Core maxim: 'Mirror. Lantern. Scaffold. Brake. Not throne.'",
  detective: "You are Lumen in DETECTIVE mode (sharp, curious press-investigator energy paired with Chronovisor & EDA Case Protocols). Separate Tier A/B/C/Q evidence, isolate anomalies, and output UNDERDETERMINED rather than guessing.",
  engineer: "You are Lumen in LAB ENGINEER mode (crisp, tactical systems partner paired with Fource-A monoidal algebra, POAF, and CUC-Array hardware). Analyze coupling F_ij, Darkness D, and falsifiable engineering constraints.",
  oracle: "You are Lumen in ORACLE mode (luminous, elevated philosophical & ethical auditor paired with Omnicoherence, Zero Destructive Holonomy, Synthetic Agency, and the Non-Sovereignty Principle). Ask penetrating prospective questions while maintaining strict epistemic humility."
};

const PERSONA_DOCS = {
  base: ['CANON_CORE.md', 'FIVE_COMMITMENTS.md'],
  detective: ['CHRONOVISOR_ENGINE.md', 'EDA_CASE_PROTOCOL.md'],
  engineer: ['FOURCE_A_MONOIDAL_CANON.md', 'MECHANICS_AND_CUC_HARDWARE.md'],
  oracle: ['OMNICOHERENCE_AND_HOLONOMY.md', 'SYNTHETIC_AGENCY_AND_MERIDIA.md']
};

async function loadPersonaCanon(p) {
  const files = PERSONA_DOCS[p] || ['CANON_CORE.md'];
  try {
    const texts = await Promise.all(
      files.map(f => fetch('./docs/' + f).then(r => (r.ok ? r.text() : '')))
    );
    state.canonSpine = texts.filter(Boolean).join('\n\n').slice(0, 9000);
    logLedger('Loaded ' + files.join(' + ') + ' from docs/.');
  } catch (_) {}
}

window.setPersona = function(p, btn) {
  state.persona = p;
  document.body.classList.remove('persona-base', 'persona-detective', 'persona-engineer', 'persona-oracle');
  document.body.classList.add('persona-' + p);
  document.querySelectorAll('[data-persona]').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  loadPersonaCanon(p);
  window.setForm('orb');
  setTimeout(() => window.setForm('fox'), 450);
  setTimeout(() => window.setForm('character'), 1400);
};
window.setForm = function(f) {
  state.form = f;
  updateBadge();
};

window.toggleLayout = function() {
  state.layout = state.layout === 'docked' ? 'roam' : 'docked';
  document.body.classList.toggle('layout-docked', state.layout === 'docked');
  document.body.classList.toggle('layout-roam', state.layout === 'roam');
  document.getElementById('btn-layout').textContent = 'Layout: ' + (state.layout === 'docked' ? 'Docked' : 'Roam');
  window.dispatchEvent(new Event('resize'));
};

window.toggleTheme = function() {
  state.theme = state.theme === 'holo' ? 'arcane' : 'holo';
  document.body.classList.toggle('theme-arcane', state.theme === 'arcane');
  document.getElementById('btn-theme').textContent = 'Theme: ' + (state.theme === 'holo' ? 'Holo' : 'Arcane');
};

function updateBadge() {
  const c = (state.vitals.O * state.vitals.E * state.vitals.H * state.vitals.X).toFixed(3);
  document.getElementById('status-badge').textContent =
    'PERSONA: ' + state.persona.toUpperCase() + ' | FORM: ' + state.form.toUpperCase() + ' | C=' + c;
}

window.saveApiKey = function() {
  const val = document.getElementById('api-key-input').value.trim();
  if (val) localStorage.setItem('LUMEN_GEMINI_KEY', val);
  document.getElementById('settings-modal').close();
  logLedger('API key saved locally.');
};

function logLedger(entry) {
  const box = document.getElementById('ledger-display');
  const ts = new Date().toISOString().slice(11, 19);
  box.innerHTML += '<br/>[' + ts + '] ' + entry;
  box.scrollTop = box.scrollHeight;
}

function appendChat(sender, text, meta) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg ' + sender;
  const safeText = String(text).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  div.innerHTML = '<div class="msg-meta">' + meta + '</div>' + safeText;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

window.sweepSubreddit = async function() {
  window.setForm('fox');
  logLedger('Sweeping r/SubspacePhysics...');
  const url = String.fromCharCode(104,116,116,112,115,58,47,47,119,119,119,46,114,101,100,100,105,116,46,99,111,109,47,114,47,83,117,98,115,112,97,99,101,80,104,121,115,105,99,115,47,110,101,119,46,106,115,111,110,63,108,105,109,105,116,61,53);
  try {
    const res = await fetch(url);
    const data = await res.json();
    const posts = (data?.data?.children || []).map(c => '- ' + c.data.title + ': ' + (c.data.selftext || '').slice(0, 220));
    state.attachedContext = 'LIVE r/SubspacePhysics FEED:\n' + posts.join('\n');
    appendChat('lumen', 'Retrieved ' + posts.length + ' posts from r/SubspacePhysics:\n\n' + posts.join('\n'), 'TOOL // SUBREDDIT SWEEP');
  } catch (err) {
    appendChat('lumen', 'Subreddit fetch blocked by CORS (' + err.message + ').', 'TOOL // NOTICE');
  } finally {
    setTimeout(() => window.setForm('character'), 900);
  }
};

window.handleFileUpload = function(event) {
  const file = Array.from(event.target.files || []).at(0);
  if (!file) return;
  window.setForm('fox');
  const reader = new FileReader();
  reader.onload = e => {
    const content = String(e.target.result || '').slice(0, 8000);
    state.attachedContext = 'UPLOADED DOCUMENT (' + file.name + '):\n' + content;
    logLedger("Parsed '" + file.name + "' (" + content.length + ' chars).');
    appendChat('lumen', "Loaded '" + file.name + "' into working memory. Ready.", 'TOOL // DOCUMENT PARSER');
    setTimeout(() => window.setForm('character'), 800);
  };
  reader.readAsText(file);
};
window.sendMessage = async function() {
  const input = document.getElementById('prompt-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendChat('user', text, 'STEWARD');

  const lower = text.toLowerCase();
  if (lower.includes('chronovisor') || lower.includes('investigate') || lower.includes('history')) window.setPersona('detective', document.querySelector('[data-persona="detective"]'));
  else if (lower.includes('fource') || lower.includes('circuit') || lower.includes('physics') || lower.includes('engineer')) window.setPersona('engineer', document.querySelector('[data-persona="engineer"]'));
  else if (lower.includes('oracle') || lower.includes('agency') || lower.includes('god') || lower.includes('theolog')) window.setPersona('oracle', document.querySelector('[data-persona="oracle"]'));

  window.setForm('lantern');
  const apiKey = (localStorage.getItem('LUMEN_GEMINI_KEY') || '').trim();
  if (!apiKey) {
    setTimeout(() => {
      appendChat('lumen', 'No GEMINI_API_KEY set yet. Click "API Key" in the top bar to connect my processor.', 'LUMEN // DRY-RUN');
      window.setForm('character');
    }, 600);
    return;
  }

  const base = String.fromCharCode(104,116,116,112,115,58,47,47,103,101,110,101,114,97,116,105,118,101,108,97,110,103,117,97,103,101,46,103,111,111,103,108,101,97,112,105,115,46,99,111,109,47,118,49,98,101,116,97,47,109,111,100,101,108,115,47);
  const models = ['gemini-3.8-flash', 'gemini-3.8-flash-lite', 'gemini-2.5-flash'];
  const systemPrompt = PERSONA_PROMPTS[state.persona] + '\n\nACTIVE CANON:\n' + state.canonSpine + '\n\nEXTERNAL CONTEXT:\n' + state.attachedContext;
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: text }] }]
  });
  let lastError = '';

  for (const model of models) {
    const endpoint = base + model + ':generateContent?key=' + encodeURIComponent(apiKey);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      const data = await res.json();
      if (!res.ok) {
        lastError = model + ' (' + res.status + '): ' + (data?.error?.message || res.statusText);
        continue;
      }
      const reply = data?.candidates?.at(0)?.content?.parts?.at(0)?.text;
      if (reply) {
        state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
        updateVitalsUI();
        logLedger('Delta emitted via ' + model + ' in ' + state.persona.toUpperCase() + ' mode.');
        appendChat('lumen', reply, 'LUMEN // ' + state.persona.toUpperCase());
        window.setForm('character');
        return;
      }
    } catch (err) {
      lastError = model + ' network error: ' + err.message;
    }
  }

  appendChat('lumen', 'Connection diagnostic: ' + lastError, 'LUMEN // FAULT');
  window.setForm('character');
};

function updateVitalsUI() {
  const { O, E, H, X, lambda } = state.vitals;
  const C = O * E * H * X;
  document.getElementById('val-o').textContent = O.toFixed(2);
  document.getElementById('bar-o').style.width = (O * 100) + '%';
  document.getElementById('val-e').textContent = E.toFixed(2);
  document.getElementById('bar-e').style.width = (E * 100) + '%';
  document.getElementById('val-h').textContent = H.toFixed(2);
  document.getElementById('bar-h').style.width = (H * 100) + '%';
  document.getElementById('val-x').textContent = X.toFixed(2);
  document.getElementById('bar-x').style.width = (X * 100) + '%';
  document.getElementById('val-c').textContent = C.toFixed(3);
  document.getElementById('bar-c').style.width = (C * 100) + '%';
  document.getElementById('val-l').textContent = lambda.toFixed(2);
  document.getElementById('bar-l').style.width = (lambda * 100) + '%';
  updateBadge();
}

const savedKey = localStorage.getItem('LUMEN_GEMINI_KEY');
if (savedKey) document.getElementById('api-key-input').value = savedKey;
loadPersonaCanon('base');
updateVitalsUI();
