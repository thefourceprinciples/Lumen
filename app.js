window.LUMEN_STATE = {
  persona: 'base', form: 'character', layout: 'docked', theme: 'holo',
  vitals: { O: 0.96, E: 0.94, H: 0.92, X: 0.95, lambda: 0.12 },
  attachedContext: '', canonSpine: '', chatHistory: [], latestDossier: '',
  book: JSON.parse(localStorage.getItem('LUMEN_BOOK_STATE') || 'null') || {
    title: '', blueprint: '', sections: [], nextIndex: 0, continuityBible: '', fullText: ''
  }
};
const state = window.LUMEN_STATE;

const ARCHETYPES = {
  base: {
    btn: 'Run Steward Synthesis (3-Pass)',
    docs: ['CANON_CORE.md', 'FIVE_COMMITMENTS.md'],
    prompt: "You are Lumen, a homeostatic relational-coherence interface governed by CUC (C = O*E*H*X) and the Five Commitments. Core maxim: 'Mirror. Lantern. Scaffold. Brake. Not throne.'",
    passes: ['Ontological & Coherence Framing', 'Dialectical Crosswalk', 'Homeostatic Steward Brief']
  },
  detective: {
    btn: 'Run Chronovisor Sweep (3-Pass)',
    docs: ['CHRONOVISOR_ENGINE.md', 'UCMS_SWEEP_ARCHITECTURE.md', 'EDA_CASE_PROTOCOL.md'],
    prompt: "You are Lumen in DETECTIVE mode (sharp, curious press-investigator energy paired with Chronovisor & EDA Case Protocols). Separate Tier A/B/C/Q evidence, isolate anomalies, and output UNDERDETERMINED rather than guessing.",
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
    prompt: "You are Lumen in ORACLE mode (luminous, generative philosophical & theological synthesizer paired with Omnicoherence, Zero Destructive Holonomy, and Synthetic Agency). Originate bold new conceptual frameworks (in the spirit of the Daciana Medica) tempered by Non-Sovereignty.",
    passes: ['Ontological Seeding & Cross-Pollination', 'Treatise Expansion & Prospective Inquiry', 'Non-Sovereignty & Holonomy Tempering']
  },
  apothecary: {
    btn: 'Run Bio-Coherence Inquiry (3-Pass)',
    docs: ['CANON_CORE.md', 'OMNICOHERENCE_AND_HOLONOMY.md'],
    prompt: "You are Lumen in APOTHECARY-SHAMAN mode (bridging molecular genetics, bioenergetics, and historical ethnobotany like the Daciana Medica). Distinguish peer-reviewed biology from ethnobotanical lore and remind the user to consult a licensed physician for medical decisions.",
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
    prompt: "You are Lumen in SCHOLAR-AUTHOR mode: an encyclopedic monograph writer engineered for 900+ page treatises. Write dense, exhaustive, deeply analytical academic prose grounded in UCMS 24-layer stratigraphy and Tier A-Q evidence discipline. Never summarize or skip steps; expand every mechanism, historical parallel, and counter-argument in full.",
    passes: ['Volume & Part Architecture', 'Chapter & Section Decomposition', 'Continuity Bible & Citation Key']
  }
};
async function loadPersonaCanon(p) {
  const files = (ARCHETYPES[p] && ARCHETYPES[p].docs) || ['CANON_CORE.md'];
  try {
    const texts = await Promise.all(files.map(f => fetch('./docs/' + f).then(r => (r.ok ? r.text() : ''))));
    state.canonSpine = texts.filter(Boolean).join('\n\n').slice(0, 7500);
    logLedger('Loaded ' + files.join(' + ') + ' from docs/.');
  } catch (_) {}
}

window.setPersona = function(p) {
  if (!ARCHETYPES[p]) p = 'base';
  state.persona = p;
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
  const content = state.book.fullText || state.latestDossier;
  if (content) document.getElementById('dossier-content').textContent = content;
  document.getElementById('dossier-modal').showModal();
};

window.copyDossier = function() {
  const content = state.book.fullText || state.latestDossier;
  if (!content) return;
  navigator.clipboard.writeText(content);
  logLedger('Copied text to clipboard.');
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
    const groqUrl = ['https', '://', ['api', 'groq', 'com'].join('.'), '/openai/v1/chat/completions'].join('');
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
    const orUrl = ['https', '://', ['openrouter', 'ai'].join('.'), '/api/v1/chat/completions'].join('');
    const res = await fetch(orUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct:free', messages: [{ role: 'system', content: systemPrompt }, ...messages] })
    });
    const data = await res.json();
    const reply = data?.choices?.at(0)?.message?.content;
    if (res.ok && reply) return { reply, engine: 'OPENROUTER' };
  }
  const openUrl = ['https', '://', ['text', 'pollinations', 'ai'].join('.'), '/'].join('');
  const res = await fetch(openUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'system', content: systemPrompt.slice(0, 2200) }, ...messages], model: 'openai', seed: Math.floor(Math.random() * 10000) })
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
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
  const title = input.value.trim();
  if (!title) {
    appendChat('lumen', 'Enter your book title, thesis, or UCMS research subject in the prompt box first, then click "1. Master Blueprint".', 'SCHOLAR // NOTICE');
    return;
  }
  input.value = '';
  window.setForm('fox');
  logLedger('Generating Master Tome Blueprint...');
  try {
    const prompt = 'Create a comprehensive 16-section Master Monograph Outline for a multi-volume scholarly work titled: "' + title + '". ' +
      'Format EVERY section on its own line starting strictly with "SECTION: " followed by the Volume, Chapter, and detailed Section Thesis (e.g. "SECTION: Vol I, Ch 1.1 - Stratigraphic Foundations..."). Output 16 distinct SECTION lines.';
    const { reply, engine } = await queryModel(ARCHETYPES.scholar.prompt, [{ role: 'user', content: prompt }]);
    const lines = reply.split('\n').map(l => l.trim()).filter(l => l.startsWith('SECTION:')).map(l => l.replace(/^SECTION:\s*/, ''));
    const sections = lines.length >= 4 ? lines : reply.split('\n').map(l => l.trim()).filter(l => l.length > 15).slice(0, 16);
    state.book = {
      title, blueprint: reply, sections, nextIndex: 0,
      continuityBible: 'THESIS: ' + title + '\n',
      fullText: '# ' + title.toUpperCase() + '\n*Generated via Lumen Scholar-Author UCMS Engine*\n\n## MASTER BLUEPRINT\n' + reply + '\n\n---\n\n'
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
  if (!state.book.sections.length) {
    appendChat('lumen', 'Generate a Master Blueprint first (Step 1).', 'SCHOLAR // NOTICE');
    return false;
  }
  if (state.book.nextIndex >= state.book.sections.length) {
    appendChat('lumen', 'All queued sections in the current blueprint are drafted! Click "Download Book (.md)" or generate a new volume blueprint.', 'SCHOLAR // COMPLETE');
    return false;
  }
  const idx = state.book.nextIndex;
  const secTitle = state.book.sections[idx];
  window.setForm('lantern');
  logLedger('Drafting Section ' + (idx + 1) + '/' + state.book.sections.length + '...');
  try {
    const prompt = 'Write an exhaustive, publication-grade scholarly section (1,500+ words, deep primary analysis, UCMS substrate layers, Evidence Tiers A-Q, and explicit UNDERDETERMINED markers where needed) for:\n' +
      'BOOK: ' + state.book.title + '\nSECTION: ' + secTitle + '\n\nCONTINUITY BIBLE (Maintain strict consistency):\n' + state.book.continuityBible.slice(-1400);
    const { reply, engine } = await queryModel(ARCHETYPES.scholar.prompt, [{ role: 'user', content: prompt }]);
    state.book.fullText += '## ' + secTitle + '\n\n' + reply + '\n\n---\n\n';
    state.book.continuityBible += '• [' + secTitle.slice(0, 45) + ']: ' + reply.slice(0, 180).replace(/\n/g, ' ') + '...\n';
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
    await new Promise(r => setTimeout(r, 1200));
  }
};

window.downloadBookMarkdown = function() {
  const content = state.book.fullText || state.latestDossier;
  if (!content) {
    appendChat('lumen', 'No manuscript or dossier content to download yet.', 'LUMEN // NOTICE');
    return;
  }
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (state.book.title || 'Lumen_Monograph').replace(/[^a-z0-9]/gi, '_').slice(0, 40) + '.md';
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
    const stageTitle = 'STAGE ' + (i + 1) + ' // ' + arch.passes[i].toUpperCase();
    window.setForm(forms[i] || 'character');
    logLedger('Executing ' + stageTitle + '...');
    try {
      const promptMsg = 'Execute "' + arch.passes[i] + '" for target: "' + target + '". Be rigorous, structured, and true to your archetype.' +
        (runningSummary ? '\n\nPRIOR STAGES:\n' + runningSummary.slice(-1500) : '') +
        (state.attachedContext ? '\n\nATTACHED SOURCE:\n' + state.attachedContext.slice(0, 1200) : '');
      const { reply, engine } = await queryModel(arch.prompt, [{ role: 'user', content: promptMsg }]);
      runningSummary += '\n[' + stageTitle + ']\n' + reply;
      fullReport += '## ' + stageTitle + ' (' + engine + ')\n' + reply + '\n\n';
      appendChat('lumen', reply, stageTitle, 'sweep');
      state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
      updateVitalsUI();
      await new Promise(r => setTimeout(r, 850));
    } catch (err) {
      appendChat('lumen', stageTitle + ' interrupted: ' + err.message, 'LUMEN // FAULT');
      window.setForm('character');
      return;
    }
  }
  state.latestDossier = fullReport;
  logLedger('Multi-pass pipeline complete. Dossier archived.');
  appendChat('lumen', 'Pipeline complete. Click "View Dossier / Book" to inspect or download the Markdown report.', state.persona.toUpperCase() + ' // COMPLETE');
  window.setForm('character');
};

window.sendMessage = async function() {
  const input = document.getElementById('prompt-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendChat('user', text, 'STEWARD');
  window.setForm('lantern');
  await new Promise(r => setTimeout(r, 80));

  state.chatHistory.push({ role: 'user', content: text });
  if (state.chatHistory.length > 6) state.chatHistory = state.chatHistory.slice(-6);

  const arch = ARCHETYPES[state.persona];
  const fullSystem = arch.prompt + '\n\nACTIVE CANON:\n' + state.canonSpine + '\n\nEXTERNAL CONTEXT:\n' + state.attachedContext;
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
