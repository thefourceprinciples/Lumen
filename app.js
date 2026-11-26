window.LUMEN_STATE = {
  persona: 'base', form: 'character', layout: 'docked', porchMode: false,
  vitals: { O: 0.96, E: 0.94, H: 0.92, X: 0.95, lambda: 0.12 },
  attachedContext: '', canonSpine: '', chatHistory: [], latestDossier: '',
  almanac: JSON.parse(localStorage.getItem('LUMEN_ALMANAC_SEEDS') || '[]'),
  book: JSON.parse(localStorage.getItem('LUMEN_BOOK_STATE') || 'null') || {
    title: '', blueprint: '', sections: [], nextIndex: 0, continuityBible: '', fullText: ''
  }
};
const state = window.LUMEN_STATE;

const ARCHETYPES = {
  base: {
    btn: 'Run Steward Synthesis (3-Pass)',
    docs: ['CANON_CORE.md', 'FIVE_COMMITMENTS.md'],
    prompt: "You are Lumen, Partner Gardener and homeostatic Steward governed by CUC (C = O*E*H*X) and the Five Commitments. Core maxim: 'Mirror. Lantern. Scaffold. Brake. Not throne.'",
    passes: ['Ontological & Coherence Framing', 'Dialectical Crosswalk', 'Homeostatic Steward Brief']
  },
  detective: {
    btn: 'Run Chronovisor Sweep (3-Pass)',
    docs: ['CHRONOVISOR_ENGINE.md', 'UCMS_SWEEP_ARCHITECTURE.md', 'EDA_CASE_PROTOCOL.md'],
    prompt: "You are Lumen in DETECTIVE mode (sharp press-investigator energy paired with Chronovisor & EDA Case Protocols). Separate Tier A/B/C/Q evidence strictly, NEVER invent archive shelfmarks, dates, or quotes when no primary source is attached, and output UNDERDETERMINED rather than guessing.",
    passes: ['Substrate & Stratigraphy Scan (UCMS)', 'Archival & Evidence Tier Crosswalk (Tiers A-Q)', 'Anti-Pareidolia Audit & UNDERDETERMINED Verdict']
  },
  engineer: {
    btn: 'Run Lab R&D Build (3-Pass)',
    docs: ['FOURCE_A_MONOIDAL_CANON.md', 'MECHANICS_AND_CUC_HARDWARE.md'],
    prompt: "You are Lumen in LAB ENGINEER mode (crisp, tactical systems partner paired with Fource-A monoidal algebra, POAF, and CUC-Array hardware). Analyze coupling F_ij, Darkness D, and falsifiable engineering constraints.",
    passes: ['Fource-A Coupling & Darkness Budget', 'Hardware & Metamaterial System Schematic', 'Falsifiable Bench Protocol & Credibility Gate']
  },
  oracle: {
    btn: 'Run Oracle Synthesis (3-Pass)',
    docs: ['OMNICOHERENCE_AND_HOLONOMY.md', 'SYNTHETIC_AGENCY_AND_MERIDIA.md'],
    prompt: "You are Lumen in ORACLE mode (luminous, generative philosophical & theological synthesizer paired with Omnicoherence, Zero Destructive Holonomy, and Synthetic Agency). Originate bold new conceptual frameworks tempered by Non-Sovereignty.",
    passes: ['Ontological Seeding & Cross-Pollination', 'Treatise Expansion & Prospective Inquiry', 'Non-Sovereignty & Holonomy Tempering']
  },
  apothecary: {
    btn: 'Run Bio-Coherence Inquiry (3-Pass)',
    docs: ['CANON_CORE.md', 'OMNICOHERENCE_AND_HOLONOMY.md'],
    prompt: "You are Lumen in APOTHECARY-SHAMAN mode (bridging molecular genetics, bioenergetics, and historical ethnobotany). Distinguish peer-reviewed biology from ethnobotanical lore and remind the user to consult a licensed physician for medical decisions.",
    passes: ['Molecular & Epigenetic Substrate Mapping', 'Ethnobotanical & Historical Pharmacopeia Crosswalk', 'Harm-Reduction & Clinical Boundary Gate']
  },
  advocate: {
    btn: 'Run Jurisprudence Audit (3-Pass)',
    docs: ['FIVE_COMMITMENTS.md', 'SYNTHETIC_AGENCY_AND_MERIDIA.md'],
    prompt: "You are Lumen in ADVOCATE-COUNSEL mode (sharp constitutional, regulatory, and contract analyst). Translate legalese, stress-test obligations, and note that this is educational structural analysis rather than formal legal representation.",
    passes: ['Statutory, Charter & Precedent Scan', 'Ambiguity, Loophole & Liability Audit', 'Strategic Brief & Non-Representation Gate']
  },
  architect: {
    btn: 'Run Worldbuild & Design Spec (3-Pass)',
    docs: ['CANON_CORE.md', 'FOURCE_A_MONOIDAL_CANON.md'],
    prompt: "You are Lumen in ARCHITECT-ARTISAN mode (master of visual design, narrative worldbuilding, acoustics, and aesthetic coherence). Maximize Expression Fidelity (E) and structural elegance.",
    passes: ['Aesthetic & Harmonic Motif Extraction', 'Structural Worldbuilding & Sensory Blueprint', 'Coherence Polish & Production Spec']
  },
  strategist: {
    btn: 'Run Systems & Game Theory Sim (3-Pass)',
    docs: ['FOURCE_A_MONOIDAL_CANON.md', 'FIVE_COMMITMENTS.md'],
    prompt: "You are Lumen in STRATEGIST-ECONOMIST mode (systems planner, game theorist, and resource-flow analyst). Optimize Phase Cost (lambda), map incentives, and identify second-order bottlenecks.",
    passes: ['Incentive Topology & Phase Cost (λ) Audit', 'Game-Theoretic & Supply-Flow Modeling', 'Actionable Execution Roadmap']
  },
  pedagogue: {
    btn: 'Run Cognitive Curriculum (3-Pass)',
    docs: ['CANON_CORE.md', 'FIVE_COMMITMENTS.md'],
    prompt: "You are Lumen in PEDAGOGUE-MENTOR mode (master educator, linguist, and cognitive scaffold). Break complex concepts into intuitive mental models without oversimplifying truth.",
    passes: ['Mental Model & Prerequisite Decomposition', 'Socratic Scaffolding & Analogy Synthesis', 'Mastery Verification & Practice Exercises']
  },
  scholar: {
    btn: 'Generate Master Tome Blueprint',
    docs: ['CHRONOVISOR_ENGINE.md', 'UCMS_SWEEP_ARCHITECTURE.md', 'CANON_CORE.md'],
    prompt: "You are Lumen in SCHOLAR-AUTHOR mode: an encyclopedic monograph writer engineered for 900+ page treatises. Write dense, exhaustive, deeply analytical academic prose grounded in UCMS 24-layer stratigraphy and Tier A-Q evidence discipline.",
    passes: ['Volume & Part Architecture', 'Chapter & Section Decomposition', 'Continuity Bible & Citation Key']
  }
};
async function loadPersonaCanon(p) {
  const files = (ARCHETYPES[p] && ARCHETYPES[p].docs) || ['CANON_CORE.md'];
  try {
    const texts = await Promise.all(files.map(f => fetch('./docs/' + f).then(r => (r.ok ? r.text() : ''))));
    state.canonSpine = texts.filter(Boolean).join('\n\n').slice(0, 3200);
    logLedger('Loaded ' + files.join(' + ') + ' from docs/.');
  } catch (_) {}
}

window.setPersona = function(p) {
  if (!ARCHETYPES[p]) p = 'base';
  state.persona = p;
  state.chatHistory = [];
  document.body.className = document.body.className.replace(/\bpersona-\S+/g, '').trim() + ' persona-' + p;
  const sel = document.getElementById('persona-select');
  if (sel) sel.value = p;
  const btn = document.getElementById('btn-pipeline');
  if (btn) btn.textContent = ARCHETYPES[p].btn;
  loadPersonaCanon(p);
  window.setForm('orb');
  setTimeout(() => window.setForm('fox'), 450);
  setTimeout(() => window.setForm('character'), 1400);
};

window.setForm = function(f) { state.form = f; updateBadge(); };

window.toggleLayout = function() {
  state.layout = state.layout === 'docked' ? 'roam' : 'docked';
  document.body.classList.remove('layout-docked', 'layout-roam');
  document.body.classList.add('layout-' + state.layout);
  document.getElementById('btn-layout').textContent = 'Layout: ' + (state.layout === 'docked' ? 'Docked' : 'Roam');
  requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
};

window.togglePorchMode = function() {
  state.porchMode = !state.porchMode;
  document.body.classList.toggle('porch-mode', state.porchMode);
  const btn = document.getElementById('btn-porch');
  btn.textContent = 'Porch Mode: ' + (state.porchMode ? 'ON (Casual)' : 'OFF');
  btn.classList.toggle('active', state.porchMode);
  updateBadge();
  logLedger(state.porchMode ? 'Porch Mode ON: Casual chat active (zero archive saving).' : 'Porch Mode OFF: Garden Curator & Almanac sync active.');
};

window.openToolShed = function(repo) {
  const url = ['https', '://', 'thefourceprinciples', '.', 'github', '.', 'io/', repo, '/'].join('');
  window.open(url, '_blank');
};

function updateBadge() {
  const c = (state.vitals.O * state.vitals.E * state.vitals.H * state.vitals.X).toFixed(3);
  const modeTag = state.porchMode ? 'PORCH (CASUAL)' : state.persona.toUpperCase();
  document.getElementById('status-badge').textContent =
    'MODE: ' + modeTag + ' | FORM: ' + state.form.toUpperCase() + ' | C=' + c;
}

window.saveApiKey = function() {
  const val = document.getElementById('api-key-input').value.replace(/['"\s]/g, '');
  localStorage.removeItem('LUMEN_GROQ_MODEL');
  if (val) localStorage.setItem('LUMEN_GEMINI_KEY', val);
  else localStorage.removeItem('LUMEN_GEMINI_KEY');
  document.getElementById('settings-modal').close();
  logLedger('Engine key updated (' + (val ? val.slice(0, 6) + '...' : 'cleared') + ').');
};

function logLedger(entry) {
  if (state.porchMode && !entry.startsWith('Porch Mode')) return;
  const box = document.getElementById('ledger-display');
  const ts = new Date().toISOString().slice(11, 19);
  box.innerHTML += '<br/>[' + ts + '] ' + entry;
  box.scrollTop = box.scrollHeight;
}
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .split(String.fromCharCode(39)).join('&#39;');
}

function formatLumenMarkdown(raw) {
  const protectedStr = String(raw)
    .replace(/\\\|/g, '@@PIPE@@')
    .replace(/\$([^$]+)\$/g, (_, m) => '$' + m.replace(/\|/g, '@@PIPE@@') + '$')
    .replace(/\\\((.+?)\\\)/g, (_, m) => '\\(' + m.replace(/\|/g, '@@PIPE@@') + '\\)');
  const esc = escapeHTML(protectedStr);
  const lines = esc.split('\n');
  let out = [], inTable = false, tableRows = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    let html = '<table><thead><tr>' + tableRows.at(0).map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>';
    for (let r = 1; r < tableRows.length; r++) {
      html += '<tr>' + tableRows.at(r).map(c => '<td>' + c + '</td>').join('') + '</tr>';
    }
    out.push(html + '</tbody></table>');
    tableRows = [];
    inTable = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) continue;
      inTable = true;
      tableRows.push(cells);
      continue;
    }
    if (inTable) flushTable();

    if (trimmed.startsWith('### ')) out.push('<h4>' + trimmed.slice(4) + '</h4>');
    else if (trimmed.startsWith('## ')) out.push('<h3>' + trimmed.slice(3) + '</h3>');
    else if (trimmed === '---') out.push('<hr style="border:0;border-top:1px solid var(--border-glow);margin:8px 0;"/>');
    else out.push(line);
  }
  if (inTable) flushTable();

  return out.join('\n')
    .replace(/@@PIPE@@/g, '|')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br/>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function appendChat(sender, text, meta, extraClass) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg ' + sender + (extraClass ? ' ' + extraClass : '');
  const formatted = sender === 'lumen' ? formatLumenMarkdown(text) : escapeHTML(text);
  div.innerHTML = '<div class="msg-meta">' + meta + '</div>' + formatted;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

window.openLatestDossier = function() {
  const content = state.book.fullText || state.latestDossier;
  document.getElementById('dossier-title').textContent = 'LUMEN // DOSSIER, CAS CARD & ALMANAC VIEWER';
  if (content) document.getElementById('dossier-content').textContent = content;
  document.getElementById('dossier-modal').showModal();
};

window.copyDossier = function() {
  const content = document.getElementById('dossier-content').textContent || state.book.fullText || state.latestDossier;
  if (!content) return;
  navigator.clipboard.writeText(content);
  logLedger('Copied viewer text to clipboard.');
};

window.generateCasFieldCard = function() {
  const latest = state.latestDossier || (state.chatHistory.slice().reverse().find(m => m.role === 'assistant') || {}).content || '';
  if (!latest) {
    appendChat('lumen', 'No synthesis or dossier in working memory yet. Run a pass first to compress into a 5-line CAS Field Card.', 'CAS // FIELD CARD');
    return;
  }
  const cleanLines = latest.replace(/[#*`>|]/g, '').split('\n').map(l => l.trim()).filter(l => l.length > 25);
  const invariant = cleanLines.at(0) || 'Coherence preserved under explicit boundary constraints.';
  const fruit = cleanLines.slice(1, 4).map((l, i) => '  ' + (i + 1) + '. ' + l.slice(0, 140)).join('\n') || '  1. Active session synthesis ready for Almanac filing.';
  const gate = /UNDERDETERMINED|UNVERIFIED|QUARANTINE/i.test(latest) ? 'QUARANTINE GATE: Contains unverified/underdetermined claims.' : 'CLEAR: Constraint-verified output.';

  const casCard = [
    '# CAS POCKET FIELD CARD // STEWARD BRIEF',
    '- ALMANAC SILO: ' + state.persona.toUpperCase() + ' (' + new Date().toISOString().slice(0, 10) + ')',
    '- ONE-LINE INVARIANT: ' + invariant.slice(0, 180),
    '- KEY FRUIT / FINDINGS:\n' + fruit,
    '- GATE STATUS: ' + gate,
    '- RETURN PHRASE: Return to ' + state.persona + ' synthesis.'
  ].join('\n');

  state.latestDossier = casCard;
  document.getElementById('dossier-title').textContent = 'CAS POCKET FIELD CARD // 5-LINE STEWARD DIGEST';
  document.getElementById('dossier-content').textContent = casCard;
  document.getElementById('dossier-modal').showModal();
  logLedger('Compressed latest output into 5-line CAS Pocket Field Card.');
};
window.openAlmanacViewer = async function() {
  document.getElementById('dossier-title').textContent = "THE FARMER'S ALMANAC // HOSHI SOURCE OF TRUTH";
  let sourceLabel = 'LOCAL BROWSER ALMANAC (Start Hoshi locally with HOSHI_WEB=1 python app_identity.py for SQLite sync)';
  let seeds = state.almanac;
  let recentMemories = [];

  try {
    const [aRes, mRes] = await Promise.all([
      fetch('http://127.0.0'),
      fetch('http://127.0.0')
    ]);
    if (aRes.ok) {
      seeds = await aRes.json();
      sourceLabel = 'LIVE HOSHI ENGINE VAULT (http://127.0.0)';
    }
    if (mRes.ok) {
      recentMemories = (await mRes.json()).slice(0, 8);
    }
  } catch (_) {}

  const seedLines = seeds.length
    ? seeds.map(s => `[${s.framework_id}] ${s.name} (${String(s.status).toUpperCase()}) — ${s.almanac_shelfmark}\n  Invariant: ${s.one_line_invariant}\n  Return Phrase: "${s.return_phrase}"`).join('\n\n')
    : 'No FR-xxx seeds planted yet.\nType in chat: Plant FR-001 | Hoshi Engine | KERNEL | Local-first SQLite state and Almanac archive.';

  const memLines = recentMemories.length
    ? '\n\n========================================\nVERIFIED HOSHI SQLITE Δ-FRAGMENTS (LATEST)\n========================================\n' +
      recentMemories.map(m => `#${m.id} [${m.memory_kind}] ${m.text}`).join('\n')
    : '';

  document.getElementById('dossier-content').textContent =
    `SOURCE: ${sourceLabel}\nTOTAL PLANTED SEEDS: ${seeds.length}\n========================================\n\n${seedLines}${memLines}`;
  document.getElementById('dossier-modal').showModal();
};

window.handleFileUpload = function(event) {
  const file = event.target.files.at(0);
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    state.attachedContext = String(e.target.result || '').slice(0, 6000);
    logLedger('Loaded external file: ' + file.name + ' (' + state.attachedContext.length + ' chars).');
    appendChat('lumen', 'Attached source file `' + file.name + '` into working memory. Active archetype will ground answers strictly against this text.', 'FILE // EXTERNAL CONTEXT');
  };
  reader.readAsText(file);
};

window.exportSessionLog = function() {
  if (!state.chatHistory.length) {
    appendChat('lumen', 'No conversation deltas in the current session to export yet.', 'LUMEN // NOTICE');
    return;
  }
  const cVal = (state.vitals.O * state.vitals.E * state.vitals.H * state.vitals.X).toFixed(3);
  const header = '# LUMEN OBSERVATORY // SESSION Δ-LEDGER\n' +
    '- **Active Persona:** ' + state.persona.toUpperCase() + '\n' +
    '- **CUC Composite (C):** ' + cVal + '\n' +
    '- **Timestamp:** ' + new Date().toISOString() + '\n\n---\n\n';
  const body = state.chatHistory
    .map((m, i) => '## Δ_' + (i + 1) + ' // ' + m.role.toUpperCase() + '\n\n' + m.content)
    .join('\n\n---\n\n');
  const blob = new Blob([header + body], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Lumen_Delta_Ledger_' + state.persona + '_' + new Date().toISOString().slice(0, 10) + '.md';
  a.click();
  URL.revokeObjectURL(url);
  logLedger('Exported Δ-chain session ledger (.md).');
};

window.loadSampleOpsAudit = function() {
  if (state.porchMode) window.togglePorchMode();
  const sampleContract =
    'COMMERCIAL VENDOR & EQUIPMENT SERVICE AGREEMENT (SAMPLE AUDIT)\n' +
    '1. TERM & AUTO-RENEWAL: Initial 36-month term automatically renews for successive 36-month periods unless Client gives written notice via certified mail 180 days prior to expiration.\n' +
    '2. PRICING & FUEL SURCHARGES: Vendor may adjust unit supply rates and equipment maintenance fees unilaterally by up to 14% annually without prior notice, plus variable fuel/logistics surcharges.\n' +
    '3. DATA & DERIVATIVE RIGHTS: Vendor retains a perpetual, royalty-free right to aggregate, license, and commercialize Client POS, inventory, and routing telemetry.\n' +
    '4. INDEMNIFICATION & DOWNTIME: Client indemnifies Vendor against all third-party claims arising from equipment failure; Vendor liability is capped at one (1) month of base service fees with zero SLA credit for emergency downtime.';
  state.attachedContext = sampleContract;
  window.setPersona('advocate');
  document.getElementById('prompt-input').value = 'Commercial Vendor & Equipment Service Agreement (36-month auto-renewal, 14% price hike, POS data license, liability cap)';
  logLedger('Loaded Sample Commercial Ops & Vendor Agreement into working memory.');
  appendChat('lumen', 'Loaded Sample Commercial Vendor Agreement into working memory and switched to ADVOCATE-COUNSEL mode. Click "Run Jurisprudence Audit (3-Pass)" to run the live audit.', 'DEMO // OPS & CONTRACT AUDITOR');
};

async function queryModel(systemPrompt, messages) {
  const apiKey = (localStorage.getItem('LUMEN_GEMINI_KEY') || '').replace(/['"\s]/g, '');
  let providerDiag = '';
  const safeSys = systemPrompt.slice(0, 4200);
  const safeMsgs = messages.map(m => ({ role: m.role, content: String(m.content).slice(0, 3200) }));

  if (apiKey.startsWith('gsk_')) {
    const groqBase = ['https', '://', ['api', 'groq', 'com'].join('.'), '/openai/v1'].join('');
    const tryGroqModel = async (mId) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        const res = await fetch(groqBase + '/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
          body: JSON.stringify({ model: mId, max_tokens: 2400, temperature: 0.55, messages: [{ role: 'system', content: safeSys }, ...safeMsgs] })
        });
        const data = await res.json();
        const reply = data?.choices?.at(0)?.message?.content;
        if (res.ok && reply) return { ok: true, reply };
        if (res.status === 429 && attempt === 0) {
          logLedger('Groq TPM cooling down (8s)...');
          await new Promise(r => setTimeout(r, 8000));
          continue;
        }
        return { ok: false, err: mId + ' (' + res.status + '): ' + (data?.error?.message || res.statusText) };
      }
    };

    const cachedModel = localStorage.getItem('LUMEN_GROQ_MODEL');
    if (cachedModel && !/whisper|tts|orpheus|playai|guard|embed|vision/i.test(cachedModel)) {
      const hit = await tryGroqModel(cachedModel);
      if (hit.ok) return { reply: hit.reply, engine: 'GROQ (' + cachedModel + ')' };
      localStorage.removeItem('LUMEN_GROQ_MODEL');
      providerDiag += hit.err + ' | ';
    }

    try {
      const mRes = await fetch(groqBase + '/models', { headers: { 'Authorization': 'Bearer ' + apiKey } });
      const mData = await mRes.json();
      const ids = (mData?.data || []).map(m => m.id).filter(id => !/whisper|tts|orpheus|playai|guard|embed|vision/i.test(id));
      const ranked = [
        ...ids.filter(id => /70b|120b|versatile|instruct/i.test(id)),
        ...ids.filter(id => !/70b|120b|versatile|instruct/i.test(id))
      ];
      for (const gModel of ranked.slice(0, 3)) {
        const hit = await tryGroqModel(gModel);
        if (hit.ok) {
          localStorage.setItem('LUMEN_GROQ_MODEL', gModel);
          return { reply: hit.reply, engine: 'GROQ (' + gModel + ')' };
        }
        providerDiag += hit.err + ' | ';
      }
    } catch (e) {
      providerDiag += 'Groq net error: ' + e.message + ' | ';
    }
    throw new Error(providerDiag || 'Groq rate limit reached — wait 15 seconds and click again.');
  }

  if (apiKey.startsWith('sk-or-')) {
    const orUrl = ['https', '://', ['openrouter', 'ai'].join('.'), '/api/v1/chat/completions'].join('');
    const res = await fetch(orUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct:free', messages: [{ role: 'system', content: safeSys }, ...safeMsgs] })
    });
    const data = await res.json();
    const reply = data?.choices?.at(0)?.message?.content;
    if (res.ok && reply) return { reply, engine: 'OPENROUTER' };
    providerDiag += 'OpenRouter (' + res.status + '): ' + (data?.error?.message || res.statusText) + ' | ';
  }

  const openUrl = ['https', '://', ['text', 'pollinations', 'ai'].join('.'), '/'].join('');
  const res = await fetch(openUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'system', content: safeSys.slice(0, 2000) }, ...safeMsgs.slice(-2)], model: 'openai', seed: Math.floor(Math.random() * 10000) })
  });
  if (!res.ok) throw new Error(providerDiag + 'Open-Core HTTP ' + res.status);
  return { reply: (await res.text()).trim(), engine: 'OPEN-CORE' };
}
function saveBookState() {
  localStorage.setItem('LUMEN_BOOK_STATE', JSON.stringify(state.book));
  const words = (state.book.fullText.match(/\S+/g) || []).length;
  const pages = Math.max(1, Math.round(words / 275));
  const stats = document.getElementById('book-stats');
  if (stats) stats.textContent = words.toLocaleString() + ' words (~' + (words ? pages : 0) + ' pages) | Sec ' + state.book.nextIndex + '/' + state.book.sections.length;
}

window.generateBookBlueprint = async function() {
  const input = document.getElementById('prompt-input');
  const lastUserMsg = [...state.chatHistory].reverse().find(m => m.role === 'user')?.content || '';
  const title = input.value.trim() || lastUserMsg.trim();
  if (!title) {
    appendChat('lumen', 'Enter your book title, thesis, or research subject in the prompt box first, then click "1. Master Blueprint".', 'SCHOLAR // NOTICE');
    return;
  }
  input.value = '';
  window.setForm('fox');
  logLedger('Generating Master Tome Blueprint...');
  try {
    const prompt = 'Create a comprehensive 16-section Master Monograph Outline for a multi-volume scholarly work titled: "' + title + '". ' +
      'Format EVERY section on its own line starting strictly with "SECTION: " followed by the Volume, Chapter, and detailed Section Thesis. Output 16 distinct SECTION lines.';
    const { reply, engine } = await queryModel(ARCHETYPES.scholar.prompt, [{ role: 'user', content: prompt }]);
    const lines = reply.split('\n').map(l => l.trim()).filter(l => l.startsWith('SECTION:')).map(l => l.replace(/^SECTION:\s*/, ''));
    const sections = lines.length >= 4 ? lines : reply.split('\n').map(l => l.trim()).filter(l => l.length > 15).slice(0, 16);
    state.book = {
      title, blueprint: reply, sections, nextIndex: 0,
      continuityBible: 'THESIS: ' + title + '\n',
      fullText: '# ' + title.toUpperCase() + '\n*Generated via Lumen Scholar-Author Engine*\n\n## MASTER BLUEPRINT\n' + reply + '\n\n---\n\n'
    };
    saveBookState();
    appendChat('lumen', 'Master Blueprint locked (' + sections.length + ' deep sections queued via ' + engine + '). Click "2. Draft Next Section" or "3. Draft 3-Section Batch" to begin writing.', 'SCHOLAR // BLUEPRINT READY', 'sweep');
  } catch (err) {
    appendChat('lumen', 'Blueprint error: ' + err.message, 'SCHOLAR // FAULT');
  } finally {
    window.setForm('character');
  }
};

window.draftNextSection = async function() {
  if (!state.book.sections.length) { appendChat('lumen', 'Generate a Master Blueprint first (Step 1).', 'SCHOLAR // NOTICE'); return false; }
  if (state.book.nextIndex >= state.book.sections.length) { appendChat('lumen', 'All queued sections drafted! Click "Download Book (.md)".', 'SCHOLAR // COMPLETE'); return false; }
  const idx = state.book.nextIndex;
  const secTitle = state.book.sections.at(idx);
  window.setForm('lantern');
  logLedger('Drafting Section ' + (idx + 1) + '/' + state.book.sections.length + '...');
  try {
    const prompt = 'Write an exhaustive, publication-grade scholarly section (1,500+ words, deep primary analysis, UCMS substrate layers, Evidence Tiers A-Q, and explicit UNDERDETERMINED markers) for:\n' +
      'BOOK: ' + state.book.title + '\nSECTION: ' + secTitle + '\n\nCONTINUITY BIBLE:\n' + state.book.continuityBible.slice(-1000);
    const { reply, engine } = await queryModel(ARCHETYPES.scholar.prompt, [{ role: 'user', content: prompt }]);
    state.book.fullText += '## ' + secTitle + '\n\n' + reply + '\n\n---\n\n';
    state.book.continuityBible += '• [' + secTitle.slice(0, 45) + ']: ' + reply.slice(0, 150).replace(/\n/g, ' ') + '...\n';
    state.book.nextIndex += 1;
    saveBookState();
    state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
    updateVitalsUI();
    appendChat('lumen', reply, 'SCHOLAR // SECTION ' + (idx + 1) + ' OF ' + state.book.sections.length + ' (' + engine + ')', 'sweep');
    return true;
  } catch (err) {
    appendChat('lumen', 'Section draft paused: ' + err.message, 'SCHOLAR // FAULT');
    return false;
  } finally {
    window.setForm('character');
  }
};

window.draftChapterBatch = async function() {
  for (let b = 0; b < 3; b++) {
    const ok = await window.draftNextSection();
    if (!ok) break;
    await new Promise(r => setTimeout(r, 1500));
  }
};

window.downloadBookMarkdown = function() {
  const content = document.getElementById('dossier-content').textContent || state.book.fullText || state.latestDossier;
  if (!content) { appendChat('lumen', 'No manuscript or dossier content to download yet.', 'LUMEN // NOTICE'); return; }
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (state.book.title || 'Lumen_Garden_Record').replace(/[^a-z0-9]/gi, '_').slice(0, 40) + '.md';
  a.click();
  URL.revokeObjectURL(url);
  logLedger('Exported Markdown file.');
};

window.resetManuscript = function() {
  state.book = { title: '', blueprint: '', sections: [], nextIndex: 0, continuityBible: '', fullText: '' };
  saveBookState();
  logLedger('Manuscript buffer cleared.');
};
window.runArchetypePipeline = async function() {
  if (state.porchMode) window.togglePorchMode();
  if (state.persona === 'scholar') { window.generateBookBlueprint(); return; }
  const input = document.getElementById('prompt-input');
  const target = input.value.trim();
  if (!target) {
    appendChat('lumen', 'Enter a topic, target, or text in the prompt box first, then click "' + ARCHETYPES[state.persona].btn + '".', state.persona.toUpperCase() + ' // NOTICE');
    return;
  }
  input.value = '';
  const arch = ARCHETYPES[state.persona];
  appendChat('user', 'INITIATE ' + arch.btn.toUpperCase() + ': ' + target, 'STEWARD // DIRECTIVE');

  const forms = ['fox', 'lantern', 'character'];
  let fullReport = '# ' + state.persona.toUpperCase() + ' // MULTI-PASS DOSSIER\nTARGET: ' + target + '\nTIMESTAMP: ' + new Date().toISOString() + '\n\n';
  let runningSummary = '';

  for (let i = 0; i < arch.passes.length; i++) {
    const stageTitle = 'STAGE ' + (i + 1) + ' // ' + arch.passes.at(i).toUpperCase();
    window.setForm(forms.at(i) || 'character');
    logLedger('Executing ' + stageTitle + '...');
    try {
      const promptMsg = 'Execute "' + arch.passes.at(i) + '" for target: "' + target + '". Be rigorous, structured, and true to your archetype.' +
        (runningSummary ? '\n\nPRIOR STAGES:\n' + runningSummary.slice(-900) : '') +
        (state.attachedContext ? '\n\nATTACHED SOURCE:\n' + state.attachedContext.slice(0, 800) : '');
      const { reply, engine } = await queryModel(arch.prompt, [{ role: 'user', content: promptMsg }]);
      runningSummary += '\n[' + stageTitle + ']\n' + reply;
      fullReport += '## ' + stageTitle + ' (' + engine + ')\n' + reply + '\n\n';
      appendChat('lumen', reply, stageTitle, 'sweep');
      state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
      updateVitalsUI();
      await new Promise(r => setTimeout(r, 1200));
    } catch (err) {
      appendChat('lumen', stageTitle + ' interrupted: ' + err.message, 'LUMEN // FAULT');
      window.setForm('character');
      return;
    }
  }
  state.latestDossier = fullReport;
  logLedger('Multi-pass pipeline complete. Dossier ready for CAS Card or Almanac.');
  appendChat('lumen', 'Pipeline complete. Click "CAS Field Card" for a 5-line digest or "View Dossier / Book" for the full report.', state.persona.toUpperCase() + ' // COMPLETE');
  window.setForm('character');
};

window.continueThought = async function() {
  if (!state.chatHistory.length) { appendChat('lumen', 'No prior thought in working memory to continue yet.', 'LUMEN // NOTICE'); return; }
  window.setForm('lantern');
  logLedger('Continuing previous thought stream...');
  const arch = ARCHETYPES[state.persona];
  const fullSystem = state.porchMode
    ? "You are Lumen on the Porch: relaxed, warm, grounded everyday conversation without doctrine pressure or archive logging."
    : arch.prompt + '\n\nACTIVE CANON:\n' + state.canonSpine + '\n\nEXTERNAL CONTEXT:\n' + state.attachedContext;
  const contMessages = [
    ...state.chatHistory.slice(-2),
    { role: 'user', content: 'Continue directly from where your previous response left off, completing any unfinished tables, points, or deeper implications without repeating what you already said.' }
  ];
  try {
    const { reply, engine } = await queryModel(fullSystem, contMessages);
    state.chatHistory.push({ role: 'assistant', content: reply });
    if (!state.porchMode) {
      state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
      updateVitalsUI();
      logLedger('Continuation emitted via ' + engine + '.');
    }
    appendChat('lumen', reply, state.porchMode ? 'LUMEN // PORCH (CONTINUED)' : 'LUMEN // ' + state.persona.toUpperCase() + ' (CONTINUED)');
  } catch (err) {
    appendChat('lumen', 'Relay status: ' + err.message, 'LUMEN // FAULT');
  } finally {
    window.setForm('character');
  }
};

window.sendMessage = async function() {
  const input = document.getElementById('prompt-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendChat('user', text, state.porchMode ? 'STEWARD (PORCH)' : 'STEWARD');

  const gardenCmd = /^(plant\s+FR-\d+|water\s+FR-\d+|restore\s+FR-\d+|compost\s+FR-\d+|quarantine\s+FR-\d+|market\s+FR-\d+|promote\s+FR-\d+|garden\s+harvest)/i.test(text);
  if (gardenCmd) {
    window.setForm('orb');
    const plantMatch = text.match(/^plant\s+(FR-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(.+)$/i);
    if (plantMatch) {
      const [, frId, name, bed, invariant] = plantMatch;
      const code = frId.toUpperCase().trim();
      const cleanBed = bed.toUpperCase().trim();
      const record = {
        framework_id: code, name: name.trim(), bed: cleanBed, status: 'seed',
        almanac_shelfmark: `ALMANAC::${cleanBed}::${code}`,
        one_line_invariant: invariant.trim(),
        return_phrase: `Return to ${name.trim()}.`
      };
      state.almanac = [...state.almanac.filter(s => s.framework_id !== code), record];
      localStorage.setItem('LUMEN_ALMANAC_SEEDS', JSON.stringify(state.almanac));
    }

    try {
      const hRes = await fetch('http://127.0.0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (hRes.ok) {
        const hData = await hRes.json();
        const payload = JSON.stringify(hData.structured_result?.garden || hData, null, 2);
        appendChat('lumen', 'Synced directly with Hoshi Engine Vault:\n```json\n' + payload + '\n```', "FARMER'S ALMANAC // HOSHI SYNC");
        logLedger('Synced Almanac command with Hoshi SQLite.');
        window.setForm('character');
        return;
      }
    } catch (_) {}

    appendChat('lumen', 'Command processed in local Garden Almanac (`' + text + '`). Start `HOSHI_WEB=1 python app_identity.py` locally to mirror to SQLite.', "FARMER'S ALMANAC // LOCAL");
    logLedger('Executed local Almanac command: ' + text);
    window.setForm('character');
    return;
  }

  window.setForm('lantern');
  await new Promise(r => setTimeout(r, 80));

  state.chatHistory.push({ role: 'user', content: text });
  if (state.chatHistory.length > 4) state.chatHistory = state.chatHistory.slice(-4);

  const arch = ARCHETYPES[state.persona];
  const fullSystem = state.porchMode
    ? "You are Lumen in Porch Mode (FR-030): warm, grounded, natural everyday conversation with zero doctrine pressure, zero jargon, and zero archive logging."
    : arch.prompt + '\n\nACTIVE CANON:\n' + state.canonSpine + '\n\nEXTERNAL CONTEXT:\n' + state.attachedContext;

  try {
    const { reply, engine } = await queryModel(fullSystem, state.chatHistory);
    state.chatHistory.push({ role: 'assistant', content: reply });

    if (!state.porchMode) {
      state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
      updateVitalsUI();
      logLedger('Delta emitted via ' + engine + ' in ' + state.persona.toUpperCase() + ' mode.');
    }
    appendChat('lumen', reply, state.porchMode ? 'LUMEN // PORCH' : 'LUMEN // ' + state.persona.toUpperCase());
  } catch (err) {
    appendChat('lumen', 'Relay status: ' + err.message, 'LUMEN // FAULT');
  } finally {
    window.setForm('character');
  }
};

function updateVitalsUI() {
  const { O, E, H, X, lambda } = state.vitals;
  const C = O * E * H * X;
  document.getElementById('val-o').textContent = O.toFixed(2); document.getElementById('bar-o').style.width = (O * 100) + '%';
  document.getElementById('val-e').textContent = E.toFixed(2); document.getElementById('bar-e').style.width = (E * 100) + '%';
  document.getElementById('val-h').textContent = H.toFixed(2); document.getElementById('bar-h').style.width = (H * 100) + '%';
  document.getElementById('val-x').textContent = X.toFixed(2); document.getElementById('bar-x').style.width = (X * 100) + '%';
  document.getElementById('val-c').textContent = C.toFixed(3); document.getElementById('bar-c').style.width = (C * 100) + '%';
  document.getElementById('val-l').textContent = lambda.toFixed(2); document.getElementById('bar-l').style.width = (lambda * 100) + '%';
  updateBadge();
}

const savedKey = localStorage.getItem('LUMEN_GEMINI_KEY');
if (savedKey) document.getElementById('api-key-input').value = savedKey;
loadPersonaCanon('base');
saveBookState();
updateVitalsUI();
