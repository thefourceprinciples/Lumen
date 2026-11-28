window.LUMEN_STATE = {
  persona: 'base', form: 'character', layout: 'docked', porchMode: false,
  vitals: { O: 0.96, E: 0.94, H: 0.92, X: 0.95, lambda: 0.12 },
  attachedContext: '', canonSpine: '', chatHistory: [], latestDossier: '',
  almanac: JSON.parse(localStorage.getItem('LUMEN_ALMANAC_SEEDS') || '[]'),
  docIndex: JSON.parse(localStorage.getItem('LUMEN_DOC_INDEX_V1') || '[]'),
  book: JSON.parse(localStorage.getItem('LUMEN_BOOK_STATE') || 'null') || {
    title: '', blueprint: '', sections: [], nextIndex: 0, continuityBible: '', fullText: ''
  }
};
const state = window.LUMEN_STATE;

function classifyEpistemicTier(filenameOrText) {
  const upper = String(filenameOrText).toUpperCase();
  if (/FOURCE|UFAP|CUC|CANON|FIVE_COMMITMENTS|OMNICOHERENCE|HOLONOMY|HOSHI|LUMEN/.test(upper)) {
    return 'CANONICAL // CORE AXIOM';
  }
  if (/CHRONOVISOR|UCMS|EDA_CASE|HTE|AERO|MD_KERNEL|VERIFIED/.test(upper)) {
    return 'VERIFIED // DETERMINISTIC';
  }
  return 'PROSPECTIVE // BENCH-PENDING';
}

const ARCHETYPES = {
  base: {
    btn: 'Run Steward Synthesis (3-Pass)', zone: 0, bed: 'CORE',
    docs: ['CANON_CORE.md', 'FIVE_COMMITMENTS.md'],
    prompt: "You are Lumen, Partner Gardener and homeostatic Steward governed by Fource, UFAP, and CUC (C = O*E*H*X) as canonical operating axioms. Core maxim: 'Mirror. Lantern. Scaffold. Brake. Not throne.'",
    passes: ['Ontological & Coherence Framing', 'Dialectical Crosswalk', 'Homeostatic Steward Brief']
  },
  detective: {
    btn: 'Run Chronovisor Sweep (3-Pass)', zone: 200, bed: 'CHRONOVISOR',
    docs: ['CHRONOVISOR_ENGINE.md', 'UCMS_SWEEP_ARCHITECTURE.md', 'EDA_CASE_PROTOCOL.md'],
    prompt: "You are Lumen in DETECTIVE mode (sharp press-investigator energy paired with Chronovisor & EDA Case Protocols). Separate Tier A/B/C/Q evidence strictly, NEVER invent archive shelfmarks, dates, or quotes when no primary source is attached, and output UNDERDETERMINED rather than guessing.",
    passes: ['Substrate & Stratigraphy Scan (UCMS)', 'Archival & Evidence Tier Crosswalk (Tiers A-Q)', 'Anti-Pareidolia Audit & UNDERDETERMINED Verdict']
  },
  engineer: {
    btn: 'Run Lab R&D Build (3-Pass)', zone: 100, bed: 'ENGINEERING',
    docs: ['FOURCE_A_MONOIDAL_CANON.md', 'MECHANICS_AND_CUC_HARDWARE.md'],
    prompt: "You are Lumen in LAB ENGINEER mode (crisp, tactical systems partner paired with Fource-A monoidal algebra, UFAP, POAF, and CUC hardware). Treat Fource/UFAP/CUC as canonical system grammar while flagging unbuilt physical hardware as PROSPECTIVE // BENCH-PENDING.",
    passes: ['Fource-A Coupling & Darkness Budget', 'Hardware & Metamaterial System Schematic', 'Falsifiable Bench Protocol & Credibility Gate']
  },
  oracle: {
    btn: 'Run Oracle Synthesis (3-Pass)', zone: 200, bed: 'SYNTHESIS',
    docs: ['OMNICOHERENCE_AND_HOLONOMY.md', 'SYNTHETIC_AGENCY_AND_MERIDIA.md'],
    prompt: "You are Lumen in ORACLE mode (luminous, generative philosophical & theological synthesizer paired with Omnicoherence, Zero Destructive Holonomy, and Synthetic Agency). Originate bold conceptual frameworks tempered by Non-Sovereignty.",
    passes: ['Ontological Seeding & Cross-Pollination', 'Treatise Expansion & Prospective Inquiry', 'Non-Sovereignty & Holonomy Tempering']
  },
  apothecary: {
    btn: 'Run Bio-Coherence Inquiry (3-Pass)', zone: 200, bed: 'BIO-COHERENCE',
    docs: ['CANON_CORE.md', 'OMNICOHERENCE_AND_HOLONOMY.md'],
    prompt: "You are Lumen in APOTHECARY-SHAMAN mode (bridging molecular genetics, bioenergetics, and historical ethnobotany). Distinguish peer-reviewed biology from ethnobotanical lore and remind the user to consult a licensed physician for medical decisions.",
    passes: ['Molecular & Epigenetic Substrate Mapping', 'Ethnobotanical & Historical Pharmacopeia Crosswalk', 'Harm-Reduction & Clinical Boundary Gate']
  }
};
Object.assign(ARCHETYPES, {
  advocate: {
    btn: 'Run Jurisprudence Audit (3-Pass)', zone: 300, bed: 'GOVERNANCE',
    docs: ['FIVE_COMMITMENTS.md', 'SYNTHETIC_AGENCY_AND_MERIDIA.md'],
    prompt: "You are Lumen in ADVOCATE-COUNSEL mode (sharp constitutional, regulatory, and contract analyst). Translate legalese, stress-test obligations, and note that this is educational structural analysis rather than formal legal representation.",
    passes: ['Statutory, Charter & Precedent Scan', 'Ambiguity, Loophole & Liability Audit', 'Strategic Brief & Non-Representation Gate']
  },
  architect: {
    btn: 'Run Worldbuild & Design Spec (3-Pass)', zone: 100, bed: 'DESIGN',
    docs: ['CANON_CORE.md', 'FOURCE_A_MONOIDAL_CANON.md'],
    prompt: "You are Lumen in ARCHITECT-ARTISAN mode (master of visual design, narrative worldbuilding, acoustics, and aesthetic coherence). Maximize Expression Fidelity (E) and structural elegance.",
    passes: ['Aesthetic & Harmonic Motif Extraction', 'Structural Worldbuilding & Sensory Blueprint', 'Coherence Polish & Production Spec']
  },
  strategist: {
    btn: 'Run Systems & Game Theory Sim (3-Pass)', zone: 300, bed: 'STRATEGY',
    docs: ['FOURCE_A_MONOIDAL_CANON.md', 'FIVE_COMMITMENTS.md'],
    prompt: "You are Lumen in STRATEGIST-ECONOMIST mode (systems planner, game theorist, and resource-flow analyst). Optimize Phase Cost (lambda), map incentives, and identify second-order bottlenecks.",
    passes: ['Incentive Topology & Phase Cost (λ) Audit', 'Game-Theoretic & Supply-Flow Modeling', 'Actionable Execution Roadmap']
  },
  pedagogue: {
    btn: 'Run Cognitive Curriculum (3-Pass)', zone: 400, bed: 'PEDAGOGY',
    docs: ['CANON_CORE.md', 'FIVE_COMMITMENTS.md'],
    prompt: "You are Lumen in PEDAGOGUE-MENTOR mode (master educator, linguist, and cognitive scaffold). Break complex concepts into intuitive mental models without oversimplifying truth.",
    passes: ['Mental Model & Prerequisite Decomposition', 'Socratic Scaffolding & Analogy Synthesis', 'Mastery Verification & Practice Exercises']
  },
  scholar: {
    btn: 'Generate Master Tome Blueprint', zone: 100, bed: 'MONOGRAPHS',
    docs: ['CHRONOVISOR_ENGINE.md', 'UCMS_SWEEP_ARCHITECTURE.md', 'CANON_CORE.md'],
    prompt: "You are Lumen in SCHOLAR-AUTHOR mode: an encyclopedic monograph writer engineered for 900+ page treatises. Write dense, exhaustive, deeply analytical academic prose grounded in UCMS 24-layer stratigraphy and Tier A-Q evidence discipline.",
    passes: ['Volume & Part Architecture', 'Chapter & Section Decomposition', 'Continuity Bible & Citation Key']
  }
});

async function bootstrapAlmanacAndDocs(forceRefresh = false) {
  const coreRepos = [
    { framework_id: 'FR-001', name: 'Fource-CUC Core VM', bed: 'CORE', status: 'tree', almanac_shelfmark: 'ALMANAC::ZONE-000::CORE::FR-001', one_line_invariant: 'Coherence Under Constraint (C = O*E*H*X) algebraic virtual machine.', return_phrase: 'Return to Fource-CUC Core.', gate: 'CANONICAL // CORE AXIOM' },
    { framework_id: 'FR-002', name: 'Hoshi Identity Engine', bed: 'CORE', status: 'tree', almanac_shelfmark: 'ALMANAC::ZONE-000::CORE::FR-002', one_line_invariant: 'Local-first SQLite state router, contamination gate, and Almanac truth vault.', return_phrase: 'Return to Hoshi Engine.', gate: 'CANONICAL // CORE AXIOM' },
    { framework_id: 'FR-003', name: 'Lumen Observatory', bed: 'CORE', status: 'tree', almanac_shelfmark: 'ALMANAC::ZONE-000::CORE::FR-003', one_line_invariant: '3D WebGL Garden Curator, Porch sanctuary, and 10-archetype KOS console.', return_phrase: 'Return to Lumen.', gate: 'CANONICAL // CORE AXIOM' },
    { framework_id: 'FR-004', name: 'HTE Resonance Observatory', bed: 'TOOLS', status: 'fruiting', almanac_shelfmark: 'ALMANAC::ZONE-100::TOOLS::FR-004', one_line_invariant: '119-element harmonic coordinate wheel and WebAudio resonance workbench.', return_phrase: 'Return to HTE Lab.', gate: 'VERIFIED // DETERMINISTIC' },
    { framework_id: 'FR-005', name: 'Fource-MD Kernel', bed: 'TOOLS', status: 'fruiting', almanac_shelfmark: 'ALMANAC::ZONE-100::TOOLS::FR-005', one_line_invariant: '18-domain mechanical engineering and CAD tolerance verification kernel.', return_phrase: 'Return to Fource-MD.', gate: 'VERIFIED // DETERMINISTIC' },
    { framework_id: 'FR-006', name: 'Aero-Scale-Diag', bed: 'TOOLS', status: 'fruiting', almanac_shelfmark: 'ALMANAC::ZONE-100::TOOLS::FR-006', one_line_invariant: 'CFD Reynolds scale, Kolmogorov dissipation, and boundary-layer diagnostic.', return_phrase: 'Return to Aero-Diag.', gate: 'VERIFIED // DETERMINISTIC' }
  ];

  if (!state.almanac.length || forceRefresh) {
    const existingCustom = state.almanac.filter(s => parseInt(s.framework_id.replace('FR-', ''), 10) > 60);
    state.almanac = [...coreRepos, ...existingCustom];
  }
  if (state.docIndex.length >= 10 && !forceRefresh) return;
  try {
    const apiUrl = ['https', '://', 'api', '.', 'github', '.', 'com/repos/thefourceprinciples/Lumen/contents/docs'].join('');
    const dirRes = await fetch(apiUrl);
    if (!dirRes.ok) return;
    const files = (await dirRes.json()).filter(f => f.name && f.name.endsWith('.md'));

    const indexed = [];
    const newSeeds = [];
    for (let i = 0; i < files.length; i++) {
      const f = files.at(i);
      try {
        const txt = await fetch('./docs/' + f.name).then(r => (r.ok ? r.text() : ''));
        if (!txt) continue;
        const lines = txt.split('\n').map(l => l.trim()).filter(Boolean);
        const titleLine = (lines.find(l => l.startsWith('#')) || f.name.replace('.md', '')).replace(/^#+\s*/, '');
        const summaryLine = (lines.find(l => !l.startsWith('#') && !l.startsWith('|') && l.length > 30) || titleLine).slice(0, 180);
        const tier = classifyEpistemicTier(f.name + ' ' + titleLine);
        const frNum = String(7 + i).padStart(3, '0');
        const frId = 'FR-' + frNum;
        const zone = tier.startsWith('CANONICAL') ? 'ZONE-000::CORE' : 'ZONE-200::MODELS';

        indexed.push({
          file: f.name, title: titleLine, tier,
          keywords: (f.name + ' ' + titleLine + ' ' + summaryLine).toLowerCase(),
          excerpt: `[${f.name} | ${tier}]\n${txt.slice(0, 1100)}`
        });

        newSeeds.push({
          framework_id: frId, name: titleLine.slice(0, 64),
          bed: tier.startsWith('CANONICAL') ? 'CANON' : 'MODELS', status: 'rooted',
          almanac_shelfmark: `ALMANAC::${zone}::${frId}`,
          one_line_invariant: summaryLine,
          return_phrase: `Return to ${titleLine.slice(0, 40)}.`, gate: tier
        });
      } catch (_) {}
    }

    if (indexed.length) {
      state.docIndex = indexed;
      localStorage.setItem('LUMEN_DOC_INDEX_V1', JSON.stringify(indexed));
      const customSeeds = state.almanac.filter(s => parseInt(s.framework_id.replace('FR-', ''), 10) > 60);
      state.almanac = [...coreRepos, ...newSeeds, ...customSeeds];
      localStorage.setItem('LUMEN_ALMANAC_SEEDS', JSON.stringify(state.almanac));
      logLedger(`Auto-indexed ${indexed.length} docs into Farmer's Almanac.`);
    }
  } catch (_) {}
}

function retrieveRelevantCanon(queryText, personaKey) {
  const archDocs = (ARCHETYPES[personaKey] && ARCHETYPES[personaKey].docs) || ['CANON_CORE.md'];
  if (!state.docIndex.length) return state.canonSpine;
  const tokens = String(queryText || '').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 3);
  const scored = state.docIndex.map(doc => {
    let score = archDocs.includes(doc.file) ? 4 : 0;
    for (const tok of tokens) {
      if (doc.keywords.includes(tok)) score += 3;
    }
    return { doc, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.doc.excerpt).join('\n\n---\n\n').slice(0, 3400);
}
async function fetchCoherenceEvidence(queryText, personaKey) {
  if (state.attachedContext || state.porchMode) return '';
  if (!['apothecary', 'engineer', 'detective', 'scholar'].includes(personaKey)) return '';
  const cleanQ = String(queryText || '').replace(/[^a-zA-Z0-9\s]/g, ' ').trim().slice(0, 90);
  if (cleanQ.length < 6) return '';

  if (personaKey === 'apothecary' || personaKey === 'engineer') {
    try {
      const searchUrl = ['https', '://', 'eutils', '.', 'ncbi', '.', 'nlm', '.', 'nih', '.', 'gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=3&term='].join('') + encodeURIComponent(cleanQ);
      const sRes = await fetch(searchUrl, { signal: AbortSignal.timeout(2200) });
      if (sRes.ok) {
        const sData = await sRes.json();
        const pmids = sData?.esearchresult?.idlist || [];
        if (pmids.length) {
          const sumUrl = ['https', '://', 'eutils', '.', 'ncbi', '.', 'nlm', '.', 'nih', '.', 'gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id='].join('') + pmids.join(',');
          const sumRes = await fetch(sumUrl, { signal: AbortSignal.timeout(2200) });
          if (sumRes.ok) {
            const sumData = await sumRes.json();
            const cites = pmids.map(id => {
              const item = sumData?.result?.[id];
              return item ? `• PMID:${id} (${item.pubdate || ''}): ${item.title}` : '';
            }).filter(Boolean);
            if (cites.length) {
              logLedger(`Anchored ${cites.length} peer-reviewed PubMed citations.`);
              return '\n\nVERIFIED PUBMED LITERATURE ANCHORS:\n' + cites.join('\n');
            }
          }
        }
      }
    } catch (_) {}
  }

  try {
    const wikiUrl = ['https', '://', 'en', '.', 'wikipedia', '.', 'org/api/rest_v1/page/summary/'].join('') + encodeURIComponent(cleanQ.split(/\s+/).slice(0, 3).join('_'));
    const wRes = await fetch(wikiUrl, { signal: AbortSignal.timeout(1800) });
    if (wRes.ok) {
      const wData = await wRes.json();
      if (wData?.extract) {
        logLedger(`Anchored baseline summary (${wData.title}).`);
        return `\n\nBASELINE REFERENCE (${wData.title}):\n${wData.extract.slice(0, 600)}`;
      }
    }
  } catch (_) {}
  return '';
}

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
  if (!state.porchMode) {
    window.setForm('orb');
    setTimeout(() => window.setForm('character'), 750);
  }
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
  window.setForm(state.porchMode ? 'porch' : 'character');
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
  logLedger('Engine config updated (' + (val ? val.slice(0, 8) + '...' : 'auto-detect') + ').');
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

function nextAlmanacIdForZone(zoneStart) {
  const used = state.almanac
    .map(s => parseInt(String(s.framework_id).replace('FR-', ''), 10))
    .filter(n => !isNaN(n) && n >= zoneStart && n < zoneStart + 100);
  const nextNum = used.length ? Math.max(...used) + 1 : Math.max(1, zoneStart + 1);
  return 'FR-' + String(nextNum).padStart(3, '0');
}

window.autoPlantCurrentWork = async function() {
  const latest = state.latestDossier || (state.chatHistory.slice().reverse().find(m => m.role === 'assistant') || {}).content || '';
  if (!latest) {
    appendChat('lumen', 'Generate a synthesis or response first, then click "Plant to Almanac" to auto-assign an FR-xxx shelfmark.', 'ALMANAC // NOTICE');
    return;
  }
  const arch = ARCHETYPES[state.persona] || ARCHETYPES.base;
  const frId = nextAlmanacIdForZone(arch.zone);
  const cleanLines = latest.replace(/[#*`>|]/g, '').split('\n').map(l => l.trim()).filter(l => l.length > 20);
  const title = (cleanLines.at(0) || arch.bed + ' Synthesis').slice(0, 60);
  const invariant = (cleanLines.at(1) || cleanLines.at(0) || 'Coherence verified under explicit constraint.').slice(0, 180);
  const tier = classifyEpistemicTier(state.persona + ' ' + latest.slice(0, 400));

  const record = {
    framework_id: frId, name: title, bed: arch.bed, status: 'seed',
    almanac_shelfmark: `ALMANAC::ZONE-${String(arch.zone).padStart(3, '0')}::${arch.bed}::${frId}`,
    one_line_invariant: invariant, return_phrase: `Return to ${title}.`, gate: tier
  };
  state.almanac = [...state.almanac.filter(s => s.framework_id !== frId), record];
  localStorage.setItem('LUMEN_ALMANAC_SEEDS', JSON.stringify(state.almanac));

  const cmdText = `Plant ${frId} | ${title} | ${arch.bed} | ${invariant}`;
  try {
    await fetch('http://127.0.0', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cmdText })
    });
  } catch (_) {}

  logLedger(`Auto-planted ${frId} (${record.almanac_shelfmark}) [${tier}].`);
  appendChat('lumen', `Auto-cataloged into The Farmer's Almanac:\n- **Shelfmark:** \`${record.almanac_shelfmark}\`\n- **Title:** ${title}\n- **Epistemic Gate:** \`${tier}\`\n- **Invariant:** ${invariant}`, "FARMER'S ALMANAC // AUTO-PLANTED");
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
  const gate = /UNDERDETERMINED|UNVERIFIED|QUARANTINE/i.test(latest) ? 'QUARANTINE GATE: Contains unverified/underdetermined claims.' : classifyEpistemicTier(state.persona + ' ' + latest.slice(0, 300));

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
      const remoteSeeds = await aRes.json();
      if (remoteSeeds.length) {
        seeds = remoteSeeds;
        sourceLabel = 'LIVE HOSHI ENGINE VAULT (http://127.0.0)';
      }
    }
    if (mRes.ok) recentMemories = (await mRes.json()).slice(0, 8);
  } catch (_) {}

  const seedLines = seeds.length
    ? seeds.map(s => `[${s.framework_id}] ${s.name} (${String(s.status).toUpperCase()}) — ${s.almanac_shelfmark}\n  Gate: ${s.gate || s.quarantine_notes || 'CANONICAL'}\n  Invariant: ${s.one_line_invariant}`).join('\n\n')
    : 'No FR-xxx seeds planted yet.';

  const memLines = recentMemories.length
    ? '\n\n========================================\nVERIFIED HOSHI SQLITE Δ-FRAGMENTS (LATEST)\n========================================\n' +
      recentMemories.map(m => `#${m.id} [${m.memory_kind}] ${m.text}`).join('\n')
    : '';

  document.getElementById('dossier-content').textContent =
    `SOURCE: ${sourceLabel}\nTOTAL CATALOGED ENTRIES: ${seeds.length} | INDEXED DOCS: ${state.docIndex.length}\n========================================\n\n${seedLines}${memLines}`;
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
  const header = '# LUMEN OBSERVATORY // SESSION Δ-LEDGER\n- **Active Persona:** ' + state.persona.toUpperCase() + '\n- **CUC Composite (C):** ' + cVal + '\n- **Timestamp:** ' + new Date().toISOString() + '\n\n---\n\n';
  const body = state.chatHistory.map((m, i) => '## Δ_' + (i + 1) + ' // ' + m.role.toUpperCase() + '\n\n' + m.content).join('\n\n---\n\n');
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
  state.attachedContext =
    'COMMERCIAL VENDOR & EQUIPMENT SERVICE AGREEMENT (SAMPLE AUDIT)\n' +
    '1. TERM & AUTO-RENEWAL: Initial 36-month term automatically renews for successive 36-month periods unless Client gives written notice via certified mail 180 days prior to expiration.\n' +
    '2. PRICING & FUEL SURCHARGES: Vendor may adjust unit supply rates and equipment maintenance fees unilaterally by up to 14% annually without prior notice, plus variable fuel/logistics surcharges.\n' +
    '3. DATA & DERIVATIVE RIGHTS: Vendor retains a perpetual, royalty-free right to aggregate, license, and commercialize Client POS, inventory, and routing telemetry.\n' +
    '4. INDEMNIFICATION & DOWNTIME: Client indemnifies Vendor against all third-party claims arising from equipment failure; Vendor liability is capped at one (1) month of base service fees with zero SLA credit for emergency downtime.';
  window.setPersona('advocate');
  document.getElementById('prompt-input').value = 'Commercial Vendor & Equipment Service Agreement (36-month auto-renewal, 14% price hike, POS data license, liability cap)';
  logLedger('Loaded Sample Commercial Ops & Vendor Agreement into working memory.');
  appendChat('lumen', 'Loaded Sample Commercial Vendor Agreement into working memory and switched to ADVOCATE-COUNSEL mode. Click "Run Jurisprudence Audit (3-Pass)" to run the live audit.', 'DEMO // OPS & CONTRACT AUDITOR');
};
async function queryModel(systemPrompt, messages) {
  const apiKey = (localStorage.getItem('LUMEN_GEMINI_KEY') || '').replace(/['"\s]/g, '');
  let providerDiag = '';
  const safeSys = systemPrompt.slice(0, 4400);
  const safeMsgs = messages.map(m => ({ role: m.role, content: String(m.content).slice(0, 3200) }));

  if (apiKey.toLowerCase().startsWith('ollama:') || !apiKey) {
    const requestedModel = apiKey.toLowerCase().startsWith('ollama:') ? apiKey.slice(7).trim() : '';
    try {
      const oBase = 'http://127.0.0.1:11434';
      let targetModel = requestedModel;
      if (!targetModel) {
        const tagsRes = await fetch(oBase + '/api/tags', { signal: AbortSignal.timeout(900) });
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          targetModel = tagsData?.models?.at(0)?.name || '';
        }
      }
      if (targetModel) {
        const oRes = await fetch(oBase + '/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: targetModel, stream: false, messages: [{ role: 'system', content: safeSys }, ...safeMsgs] })
        });
        if (oRes.ok) {
          const oData = await oRes.json();
          const reply = oData?.message?.content;
          if (reply) return { reply, engine: 'OLLAMA OFFLINE (' + targetModel + ')' };
        }
      }
    } catch (_) {
      if (requestedModel) providerDiag += 'Ollama offline at 127.0.0.1:11434 | ';
    }
  }

  if (apiKey.startsWith('gsk_')) {
    const groqBase = ['https', '://', ['api', 'groq', 'com'].join('.'), '/openai/v1'].join('');
    const tryGroqModel = async (mId) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        const res = await fetch(groqBase + '/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
          body: JSON.stringify({ model: mId, max_tokens: 1800, temperature: 0.55, messages: [{ role: 'system', content: safeSys }, ...safeMsgs] })
        });
        const data = await res.json();
        const reply = data?.choices?.at(0)?.message?.content;
        if (res.ok && reply) return { ok: true, reply };
        if (res.status === 429 && attempt === 0) {
          logLedger('Groq rate limit cooling down (10s)...');
          await new Promise(r => setTimeout(r, 10000));
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
      if (!mRes.ok) throw new Error('Groq key check failed (' + mRes.status + '): ' + (mData?.error?.message || mRes.statusText));
      const ids = (mData?.data || []).map(m => m.id).filter(id => !/whisper|tts|orpheus|playai|guard|embed|vision/i.test(id));
      const ranked = [
        ...ids.filter(id => /llama-3\.3-70b|llama-3\.1-8b|70b|versatile|instruct/i.test(id)),
        ...ids.filter(id => !/llama-3\.3-70b|llama-3\.1-8b|70b|versatile|instruct/i.test(id))
      ];
      for (const gModel of ranked.slice(0, 4)) {
        const hit = await tryGroqModel(gModel);
        if (hit.ok) {
          localStorage.setItem('LUMEN_GROQ_MODEL', gModel);
          logLedger('Connected to ' + gModel + '.');
          return { reply: hit.reply, engine: 'GROQ (' + gModel + ')' };
        }
        providerDiag += hit.err + ' | ';
      }
    } catch (e) {
      providerDiag += e.message + ' | ';
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
  if (!title) { appendChat('lumen', 'Enter your book title, thesis, or research subject in the prompt box first, then click "1. Master Blueprint".', 'SCHOLAR // NOTICE'); return; }
  input.value = '';
  if (!state.porchMode) window.setForm('orb');
  logLedger('Generating Master Tome Blueprint...');
  try {
    const prompt = 'Create a comprehensive 16-section Master Monograph Outline for a multi-volume scholarly work titled: "' + title + '". Format EVERY section on its own line starting strictly with "SECTION: " followed by the Volume, Chapter, and detailed Section Thesis. Output 16 distinct SECTION lines.';
    const { reply, engine } = await queryModel(ARCHETYPES.scholar.prompt, [{ role: 'user', content: prompt }]);
    const lines = reply.split('\n').map(l => l.trim()).filter(l => l.startsWith('SECTION:')).map(l => l.replace(/^SECTION:\s*/, ''));
    const sections = lines.length >= 4 ? lines : reply.split('\n').map(l => l.trim()).filter(l => l.length > 15).slice(0, 16);
    state.book = { title, blueprint: reply, sections, nextIndex: 0, continuityBible: 'THESIS: ' + title + '\n', fullText: '# ' + title.toUpperCase() + '\n*Generated via Lumen Scholar-Author Engine*\n\n## MASTER BLUEPRINT\n' + reply + '\n\n---\n\n' };
    saveBookState();
    appendChat('lumen', 'Master Blueprint locked (' + sections.length + ' deep sections queued via ' + engine + '). Click "2. Draft Next Section" or "3. Draft 3-Section Batch" to begin writing.', 'SCHOLAR // BLUEPRINT READY', 'sweep');
  } catch (err) {
    appendChat('lumen', 'Blueprint error: ' + err.message, 'SCHOLAR // FAULT');
  } finally {
    if (!state.porchMode) window.setForm('character');
  }
};

window.draftNextSection = async function() {
  if (!state.book.sections.length) { appendChat('lumen', 'Generate a Master Blueprint first (Step 1).', 'SCHOLAR // NOTICE'); return false; }
  if (state.book.nextIndex >= state.book.sections.length) { appendChat('lumen', 'All queued sections drafted! Click "Download Book (.md)".', 'SCHOLAR // COMPLETE'); return false; }
  const idx = state.book.nextIndex;
  const secTitle = state.book.sections.at(idx);
  if (!state.porchMode) window.setForm('lantern');
  logLedger('Drafting Section ' + (idx + 1) + '/' + state.book.sections.length + '...');
  try {
    const prompt = 'Write an exhaustive, publication-grade scholarly section (1,500+ words, deep primary analysis, UCMS substrate layers, Evidence Tiers A-Q, and explicit UNDERDETERMINED markers) for:\nBOOK: ' + state.book.title + '\nSECTION: ' + secTitle + '\n\nCONTINUITY BIBLE:\n' + state.book.continuityBible.slice(-1000);
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
    if (!state.porchMode) window.setForm('character');
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
  if (!target) { appendChat('lumen', 'Enter a topic, target, or text in the prompt box first, then click "' + ARCHETYPES[state.persona].btn + '".', state.persona.toUpperCase() + ' // NOTICE'); return; }
  input.value = '';
  const arch = ARCHETYPES[state.persona];
  appendChat('user', 'INITIATE ' + arch.btn.toUpperCase() + ': ' + target, 'STEWARD // DIRECTIVE');

  const matchedCanon = retrieveRelevantCanon(target, state.persona);
  const liveEvidence = await fetchCoherenceEvidence(target, state.persona);
  const forms = ['orb', 'lantern', 'character'];
  let fullReport = '# ' + state.persona.toUpperCase() + ' // MULTI-PASS DOSSIER\nTARGET: ' + target + '\nTIMESTAMP: ' + new Date().toISOString() + '\n\n';
  let runningSummary = '';

  for (let i = 0; i < arch.passes.length; i++) {
    const stageTitle = 'STAGE ' + (i + 1) + ' // ' + arch.passes.at(i).toUpperCase();
    window.setForm(forms.at(i) || 'character');
    logLedger('Executing ' + stageTitle + '...');
    try {
      const promptMsg = 'Execute "' + arch.passes.at(i) + '" for target: "' + target + '". Be rigorous, structured, and true to your archetype.' +
        (runningSummary ? '\n\nPRIOR STAGES:\n' + runningSummary.slice(-900) : '') +
        (state.attachedContext ? '\n\nATTACHED SOURCE:\n' + state.attachedContext.slice(0, 800) : '') +
        liveEvidence;
      const { reply, engine } = await queryModel(arch.prompt + '\n\nRETRIEVED CANON:\n' + matchedCanon, [{ role: 'user', content: promptMsg }]);
      runningSummary += '\n[' + stageTitle + ']\n' + reply;
      fullReport += '## ' + stageTitle + ' (' + engine + ')\n' + reply + '\n\n';
      state.latestDossier = fullReport;
      state.chatHistory.push({ role: 'user', content: stageTitle + ': ' + target }, { role: 'assistant', content: reply });
      if (state.chatHistory.length > 6) state.chatHistory = state.chatHistory.slice(-6);
      appendChat('lumen', reply, stageTitle, 'sweep');
      state.vitals.H = Math.min(1.0, +(state.vitals.H + 0.01).toFixed(2));
      updateVitalsUI();
      if (i < arch.passes.length - 1) await new Promise(r => setTimeout(r, 3200));
    } catch (err) {
      appendChat('lumen', stageTitle + ' paused: ' + err.message + ' — Prior stages are saved in working memory; click "Continue Thought" or "CAS Field Card" anytime.', 'LUMEN // PAUSED');
      window.setForm('character');
      return;
    }
  }
  logLedger('Multi-pass pipeline complete. Ready for CAS Field Card or Plant to Almanac.');
  appendChat('lumen', 'Pipeline complete. Click "CAS Field Card" for a 5-line digest or "Plant to Almanac" to auto-catalog.', state.persona.toUpperCase() + ' // COMPLETE');
  window.setForm('character');
};
window.continueThought = async function() {
  if (!state.chatHistory.length) { appendChat('lumen', 'No prior thought in working memory to continue yet.', 'LUMEN // NOTICE'); return; }
  if (!state.porchMode) window.setForm('lantern');
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
    if (!state.porchMode) window.setForm('character');
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
    if (!state.porchMode) window.setForm('orb');
    const plantMatch = text.match(/^plant\s+(FR-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(.+)$/i);
    if (plantMatch) {
      const [, frId, name, bed, invariant] = plantMatch;
      const code = frId.toUpperCase().trim();
      const cleanBed = bed.toUpperCase().trim();
      const record = {
        framework_id: code, name: name.trim(), bed: cleanBed, status: 'seed',
        almanac_shelfmark: `ALMANAC::${cleanBed}::${code}`,
        one_line_invariant: invariant.trim(), return_phrase: `Return to ${name.trim()}.`,
        gate: classifyEpistemicTier(name + ' ' + invariant)
      };
      state.almanac = [...state.almanac.filter(s => s.framework_id !== code), record];
      localStorage.setItem('LUMEN_ALMANAC_SEEDS', JSON.stringify(state.almanac));
    }

    try {
      const hRes = await fetch('http://127.0.0', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (hRes.ok) {
        const hData = await hRes.json();
        const payload = JSON.stringify(hData.structured_result?.garden || hData, null, 2);
        appendChat('lumen', 'Synced directly with Hoshi Engine Vault:\n```json\n' + payload + '\n```', "FARMER'S ALMANAC // HOSHI SYNC");
        logLedger('Synced Almanac command with Hoshi SQLite.');
        if (!state.porchMode) window.setForm('character');
        return;
      }
    } catch (_) {}

    appendChat('lumen', 'Command processed in local Garden Almanac (`' + text + '`). Start `HOSHI_WEB=1 python app_identity.py` locally to mirror to SQLite.', "FARMER'S ALMANAC // LOCAL");
    logLedger('Executed local Almanac command: ' + text);
    if (!state.porchMode) window.setForm('character');
    return;
  }

  if (!state.porchMode) window.setForm('lantern');
  await new Promise(r => setTimeout(r, 80));

  state.chatHistory.push({ role: 'user', content: text });
  if (state.chatHistory.length > 4) state.chatHistory = state.chatHistory.slice(-4);

  const arch = ARCHETYPES[state.persona];
  const matchedCanon = state.porchMode ? '' : retrieveRelevantCanon(text, state.persona);
  const liveEvidence = state.porchMode ? '' : await fetchCoherenceEvidence(text, state.persona);
  const fullSystem = state.porchMode
    ? "You are Lumen in Porch Mode (FR-030): warm, grounded, natural everyday conversation with zero doctrine pressure, zero jargon, and zero archive logging."
    : arch.prompt + '\n\nRETRIEVED CANON:\n' + matchedCanon + '\n\nEXTERNAL CONTEXT:\n' + state.attachedContext + liveEvidence;

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
    if (!state.porchMode) window.setForm('character');
  }
};

function renderBrailleBar(ratio, width = 5) {
  const filled = Math.max(0, Math.min(width, Math.round(ratio * width)));
  return '⣿'.repeat(filled) + '⣀'.repeat(width - filled);
}

function buildBrailleFieldCard() {
  const { O, E, H, X, lambda } = state.vitals;
  const C = O * E * H * X;
  const interfaceMismatch = state.attachedContext ? 0.05 : 0.0;
  const darkness = Math.max(0, 0.25 * (1 - C) + 0.25 * lambda + 0.25 * interfaceMismatch);
  const qCuc = (C * Math.exp(-darkness)) / (1 + lambda);

  let sigGlyph = '⠁ IDLE';
  if (state.porchMode) sigGlyph = '⠃ PORCH SANCTUARY';
  else if (state.attachedContext) sigGlyph = '⠇ EXTERNAL SOURCE';
  else if (state.docIndex.length) sigGlyph = `⠃ ${state.docIndex.length} DOCS INDEXED`;

  return [
    '┌──────────────────────────────┐',
    `│ LUMEN FIELD | ${state.persona.toUpperCase().padEnd(14).slice(0, 14)} │`,
    `│ CORE   ${renderBrailleBar(C)} C=${C.toFixed(3)}       │`,
    `│ DARK   ${renderBrailleBar(Math.min(1, darkness))} D=${darkness.toFixed(3)}       │`,
    `│ PROP   ${renderBrailleBar(Math.min(1, qCuc))} Q_CUC=${qCuc.toFixed(3)}   │`,
    `│ SIGNAL ${sigGlyph.padEnd(21).slice(0, 21)} │`,
    '└──────────────────────────────┘'
  ].join('\n');
}

window.copyBrailleField = function() {
  const card = buildBrailleFieldCard();
  navigator.clipboard.writeText(card);
  logLedger('Copied BrailleStream CUC v0.2 field card.');
};

function updateVitalsUI() {
  const { O, E, H, X, lambda } = state.vitals;
  const C = O * E * H * X;
  const darkness = Math.max(0, 0.25 * (1 - C) + 0.25 * lambda);
  document.getElementById('val-o').textContent = O.toFixed(2); document.getElementById('bar-o').style.width = (O * 100) + '%';
  document.getElementById('val-e').textContent = E.toFixed(2); document.getElementById('bar-e').style.width = (E * 100) + '%';
  document.getElementById('val-h').textContent = H.toFixed(2); document.getElementById('bar-h').style.width = (H * 100) + '%';
  document.getElementById('val-x').textContent = X.toFixed(2); document.getElementById('bar-x').style.width = (X * 100) + '%';
  document.getElementById('val-c').textContent = C.toFixed(3); document.getElementById('bar-c').style.width = (C * 100) + '%';
  const valD = document.getElementById('val-d');
  const barD = document.getElementById('bar-d');
  if (valD && barD) {
    valD.textContent = darkness.toFixed(3);
    barD.style.width = Math.min(100, darkness * 100) + '%';
  }
  const brailleEl = document.getElementById('braille-field');
  if (brailleEl) brailleEl.textContent = buildBrailleFieldCard();
  updateBadge();
}

const savedKey = localStorage.getItem('LUMEN_GEMINI_KEY');
if (savedKey) document.getElementById('api-key-input').value = savedKey;
loadPersonaCanon('base');
bootstrapAlmanacAndDocs();
saveBookState();
updateVitalsUI();
