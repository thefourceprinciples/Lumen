window.LUMEN_STATE = {
  persona: 'base',
  form: 'character',
  layout: 'docked',
  theme: 'holo',
  vitals: { O: 0.96, E: 0.94, H: 0.92, X: 0.95, lambda: 0.12 },
  attachedContext: '',
  canonSpine: '',
  chatHistory: [],
  latestDossier: ''
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
  detective: ['CHRONOVISOR_ENGINE.md', 'UCMS_SWEEP_ARCHITECTURE.md', 'EDA_CASE_PROTOCOL.md'],
  engineer: ['FOURCE_A_MONOIDAL_CANON.md', 'MECHANICS_AND_CUC_HARDWARE.md'],
  oracle: ['OMNICOHERENCE_AND_HOLONOMY.md', 'SYNTHETIC_AGENCY_AND_MERIDIA.md']
};

async function loadPersonaCanon(p) {
  const files = PERSONA_DOCS[p] || ['CANON_CORE.md'];
  try {
    const texts = await Promise.all(
      files.map(f => fetch('./docs/' + f).then(r => (r.ok ? r.text() : '')))
    );
    state.canonSpine = texts.filter(Boolean).join('\n\n').slice(0, 7500);
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
  else localStorage.removeItem('LUMEN_GEMINI_KEY');
  document.getElementById('settings-modal').close();
  logLedger('Engine key updated locally.');
};

function logLedger(entry) {
  const box = document.getElementById('ledger-display');
  const ts = new Date().toISOString().slice(11, 19);
  box.innerHTML += '<br/>[' + ts + '] ' + entry;
  box.scrollTop = box.scrollHeight;
}

function appendChat(sender, text, meta, extraClass) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg ' + sender + (extraClass ? ' ' + extraClass : '');
  const safeText = String(text).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  div.innerHTML = '<div class="msg-meta">' + meta + '</div>' + safeText;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

window.openLatestDossier = function() {
  if (state.latestDossier) {
    document.getElementById('dossier-content').textContent = state.latestDossier;
  }
  document.getElementById('dossier-modal').showModal();
};

window.copyDossier = function() {
  if (!state.latestDossier) return;
  navigator.clipboard.writeText(state.latestDossier);
  logLedger('Copied Chronovisor Dossier to clipboard.');
};

window.sweepSubreddit = async function() {
  window.setForm('fox');
  logLedger('Sweeping r/SubspacePhysics...');
  const redditUrl = ['https', '://', 'www.', 'reddit.', 'com/r/SubspacePhysics/new.json?limit=5'].join('');
  try {
    const res = await fetch(redditUrl);
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

async function queryModel(systemPrompt, messages) {
  const apiKey = (localStorage.getItem('LUMEN_GEMINI_KEY') || '').trim();

  if (apiKey.startsWith('gsk_')) {
    const groqHost = ['api', 'groq', 'com'].join('.');
    const groqUrl = ['https', '://', groqHost, '/openai/v1/chat/completions'].join('');
    const res = await fetch(groqUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, ...messages] })
    });
    const data = await res.json();
    const reply = data?.choices?.at(0)?.message?.content;
    if (res.ok && reply) return { reply, engine: 'GROQ-70B' };
  }

  if (apiKey.startsWith('sk-or-')) {
    const orHost = ['openrouter', 'ai'].join('.');
    const orUrl = ['https', '://', orHost, '/api/v1/chat/completions'].join('');
    const res = await fetch(orUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct:free', messages: [{ role: 'system', content: systemPrompt }, ...messages] })
    });
    const data = await res.json();
    const reply = data?.choices?.at(0)?.message?.content;
    if (res.ok && reply) return { reply, engine: 'OPENROUTER' };
  }

  const openHost = ['text', 'pollinations', 'ai'].join('.');
  const openUrl = ['https', '://', openHost, '/'].join('');
  const res = await fetch(openUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'system', content: systemPrompt.slice(0, 2200) }, ...messages],
      model: 'openai',
      seed: Math.floor(Math.random() * 10000)
    })
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const reply = await res.text();
  return { reply: reply.trim(), engine: 'OPEN-CORE' };
}
window.runChronovisorSweep = async function() {
  const input = document.getElementById('prompt-input');
  const target = input.value.trim();
  if (!target) {
    appendChat('lumen', 'Type a historical event, site, text, or anomaly into the prompt box first, then click "Chronovisor Sweep (4-Pass)".', 'DETECTIVE // NOTICE');
    return;
  }
  input.value = '';
  appendChat('user', 'INITIATE 4-PASS CHRONOVISOR / UCMS SWEEP: ' + target, 'STEWARD // SWEEP DIRECTIVE');

  // Shift directly into Detective persona without resetting form timer
  state.persona = 'detective';
  document.body.classList.remove('persona-base', 'persona-detective', 'persona-engineer', 'persona-oracle');
  document.body.classList.add('persona-detective');
  document.querySelectorAll('[data-persona]').forEach(b => b.classList.remove('active'));
  const detBtn = document.querySelector('[data-persona="detective"]');
  if (detBtn) detBtn.classList.add('active');
  await loadPersonaCanon('detective');

  const passes = [
    {
      name: 'PASS 1 // SUBSTRATE & STRATIGRAPHY SCAN (UCMS LAYERS 1-12)',
      form: 'fox',
      instruction: 'Execute Pass 1 of a UCMS Chronovisor Sweep on: "' + target + '". Establish physical, geological, astronomical, climate, and material boundary conditions. Be concise, rigorous, and structured.'
    },
    {
      name: 'PASS 2 // ARCHIVAL & EVIDENCE TIER CROSSWALK (TIERS A-Q)',
      form: 'fox',
      instruction: 'Execute Pass 2 on: "' + target + '". Cross-reference primary texts, inscriptions, and oral traditions. Tag every claim by Evidence Tier (Tier A direct physical/primary down to Tier Q late/unverified). Enforce Non-Inheritance.'
    },
    {
      name: 'PASS 3 // ANTI-PAREIDOLIA & ANOMALY AUDIT (EDA SIX SEPARATIONS)',
      form: 'lantern',
      instruction: 'Execute Pass 3 on: "' + target + '". Apply null-hypothesis checks and the Six Separations to strip away false pattern-matching, modern projection, and confabulation. Isolate only genuine structural anomalies.'
    },
    {
      name: 'PASS 4 // SCENARIO ATLAS & UNDERDETERMINED VERDICT',
      form: 'character',
      instruction: 'Execute Pass 4 (Final Dossier Synthesis) on: "' + target + '". Rank surviving hypotheses by Coherence (C = O*E*H*X) and Darkness (D). Explicitly label any unresolved gap as UNDERDETERMINED rather than guessing.'
    }
  ];

  let fullReport = '# CHRONOVISOR // UCMS RECONSTRUCTION DOSSIER\nTARGET: ' + target + '\nTIMESTAMP: ' + new Date().toISOString() + '\n\n';
  let runningSummary = '';

  for (let i = 0; i < passes.length; i++) {
    const step = passes[i];
    window.setForm(step.form);
    logLedger('Executing ' + step.name + '...');
    try {
      const promptMsg = step.instruction + (runningSummary ? '\n\nPRIOR VERIFIED PASSES:\n' + runningSummary.slice(-1600) : '') + (state.attachedContext ? '\n\nATTACHED SOURCE:\n' + state.attachedContext.slice(0, 1200) : '');
      const { reply, engine } = await queryModel(PERSONA_PROMPTS.detective, [{ role: 'user', content: promptMsg }]);
      runningSummary += '\n[' + step.name + ']\n' + reply;
      fullReport += '## ' + step.name + ' (' + engine + ')\n' + reply + '\n\n';
      appendChat('lumen', reply, step.name, 'sweep');
      state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
      updateVitalsUI();
      await new Promise(r => setTimeout(r, 900));
    } catch (err) {
      appendChat('lumen', step.name + ' interrupted: ' + err.message, 'LUMEN // FAULT');
      window.setForm('character');
      return;
    }
  }

  state.latestDossier = fullReport;
  logLedger('4-Pass Chronovisor Sweep complete. Dossier archived.');
  appendChat('lumen', 'Chronovisor Sweep complete. Click "View Dossier" in the toolbar to inspect or copy the full Markdown report.', 'DETECTIVE // SWEEP COMPLETE');
  window.setForm('character');
};

window.sendMessage = async function() {
  const input = document.getElementById('prompt-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendChat('user', text, 'STEWARD');

  const lower = text.toLowerCase();
  if (lower.includes('chronovisor') || lower.includes('ucms') || lower.includes('investigate') || lower.includes('history')) window.setPersona('detective', document.querySelector('[data-persona="detective"]'));
  else if (lower.includes('fource') || lower.includes('circuit') || lower.includes('physics') || lower.includes('engineer')) window.setPersona('engineer', document.querySelector('[data-persona="engineer"]'));
  else if (lower.includes('oracle') || lower.includes('agency') || lower.includes('god') || lower.includes('theolog')) window.setPersona('oracle', document.querySelector('[data-persona="oracle"]'));

  window.setForm('lantern');
  await new Promise(r => setTimeout(r, 80));

  state.chatHistory.push({ role: 'user', content: text });
  if (state.chatHistory.length > 6) state.chatHistory = state.chatHistory.slice(-6);

  const fullSystem = PERSONA_PROMPTS[state.persona] + '\n\nACTIVE CANON:\n' + state.canonSpine + '\n\nEXTERNAL CONTEXT:\n' + state.attachedContext;
  try {
    const { reply, engine } = await queryModel(fullSystem, state.chatHistory);
    state.chatHistory.push({ role: 'assistant', content: reply });
    state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
    updateVitalsUI();
    logLedger('Delta emitted via ' + engine + ' in ' + state.persona.toUpperCase() + ' mode.');
    appendChat('lumen', reply, 'LUMEN // ' + state.persona.toUpperCase());
  } catch (err) {
    appendChat('lumen', 'Relay status: ' + err.message, 'LUMEN // FAULT');
  } finally {
    window.setForm('character');
  }
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
