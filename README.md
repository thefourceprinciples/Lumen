# Lumen — Garden Curator & 10-Archetype Observatory

thefourceprinciples.github.io/Lumen

**A browser-based 3D WebGL spatial console, multi-pass research workbench, and front-end Knowledge Operating System (`KOS`) interface governed by Coherence Under Constraint (`C = O · E · H · X`).**

Lumen solves two core failure modes of standard AI interfaces: **context-window amnesia** (losing structured insights across sessions) and **epistemic drift** (mixing casual brainstorming with verified facts). It pairs a Three.js spatial observatory and calm Botanical Garden interface with structured multi-pass reasoning, progressive data compression (**CAS Pocket Field Cards**), and two-way synchronization with **`hoshi-engine`** (*The Farmer's Almanac*).

```text
+-----------------------------------------------------------------------------------+

|                        LUMEN OBSERVATORY (Browser Front-End)                      |
|  [Porch Mode: Casual Chat]  <--->  [10 Archetype 3-Pass Pipelines & Book Engine]  |
|             |                                            |                        |
|      (Zero Logging)                             (CAS Field Card)                  |
|                                                          v                        |
|  [4-Tool Shed: HTE · Fource-MD · Fource-CUC · Aero-Diag] <---> [Farmer's Almanac] |
+----------------------------------------------------------|------------------------+
                                                           | REST / JSON (Port 5001)
                                                           v
+-----------------------------------------------------------------------------------+

|                     HOSHI IDENTITY ENGINE (Python + SQLite Vault)                 |
|  [Contamination Gate] -> [Subspace State Router] -> [Almanac Shelfmarks & Memory] |
+-----------------------------------------------------------------------------------+
```

---

## How Lumen Works Under the Hood

### 1. Homeostatic Vitals (`C = O · E · H · X`)
Lumen tracks session health and structural integrity in real time across four core variables and one metabolic cost metric:
* **O · Origin Integrity:** Grounding to primary sources, canon documents, and explicit user-attached files.
* **E · Expression Fidelity:** Structural clarity, clean tabular formatting, and non-bloated output.
* **H · Historical Continuity:** Preservation of valid state deltas across multi-pass pipelines and manuscript sections.
* **X · Resonance Stability:** Internal consistency across constraints without contradiction.
* **C · Composite Coherence (`O × E × H × X`):** Overall system coherence score displayed in the header badge and left vitals panel.
* **λ · Phase Cost:** Computational, structural, or uncertainty friction accumulated during complex reasoning.

### 2. Epistemic Hygiene: Porch Mode vs. Garden Curator Mode
Standard chatbots treat every stray thought and every verified research finding identically, polluting long-term memory with noise. Lumen enforces a strict two-room boundary:
* **Porch Mode (`FR-030` Sanctuary):** Toggles a warm hearth-amber visual environment (`porch.jpg`) with drifting fireflies. In Porch Mode, Lumen speaks naturally without doctrine pressure or jargon, and **all ledger and archive logging is paused**. Nothing enters your permanent record by accident.
* **Garden Curator Mode (Default):** Lumen acts as your partner gardener and research analyst—loading persona-specific canon files from `./docs/`, tracking continuity deltas, and formatting findings for **The Farmer's Almanac**.

### 3. Multi-Pass Archetype Pipelines
Rather than relying on a single-shot prompt, clicking the primary synthesis button runs a **sequential 3-stage pipeline** tailored to the active archetype. Each pass feeds its verified output into the next stage while morphing the 3D hologram (`Seed` → `Lantern` → `Hearth`) to reflect the active cognitive phase:

| # | Archetype | Primary Domain | 3-Pass Pipeline Stages |
| :--- | :--- | :--- | :--- |
| **0** | **Garden Curator** | General Stewardship & Synthesis | `Ontological Framing` → `Dialectical Crosswalk` → `Homeostatic Steward Brief` |
| **1** | **Detective** | Historical & Archival Forensics | `UCMS Stratigraphy Scan` → `Evidence Tier Crosswalk (A–Q)` → `Anti-Pareidolia & UNDERDETERMINED Audit` |
| **2** | **Lab Engineer** | Systems, Hardware & R&D | `Coupling & Darkness Budget` → `System Schematic` → `Falsifiable Bench Protocol` |
| **3** | **Oracle** | Philosophy & Prospective Theory | `Ontological Seeding` → `Treatise Expansion` → `Non-Sovereignty Tempering` |
| **4** | **Apothecary-Shaman** | Bioenergetics & Ethnobotany | `Molecular Substrate Mapping` → `Pharmacopeia Crosswalk` → `Harm-Reduction & Clinical Boundary Gate` |
| **5** | **Advocate-Counsel** | Contracts, Law & Governance | `Statutory & Precedent Scan` → `Ambiguity & Liability Audit` → `Strategic Brief & Non-Representation Gate` |
| **6** | **Architect-Artisan** | Design, Acoustics & Worldbuilding | `Harmonic Motif Extraction` → `Sensory Blueprint` → `Production Spec` |
| **7** | **Strategist-Economist** | Game Theory & Resource Flows | `Incentive & Phase Cost (λ) Audit` → `Supply-Flow Modeling` → `Execution Roadmap` |
| **8** | **Pedagogue-Mentor** | Curriculum & Cognitive Scaffolding | `Prerequisite Decomposition` → `Socratic Analogy Synthesis` → `Mastery Verification` |
| **9** | **Scholar-Author** | Long-Form Monograph Engine | `Volume Architecture` → `Chapter Decomposition` → `Continuity Bible & Citation Key` |

### 4. CAS Pocket Field Cards & The Farmer's Almanac
Long-form AI reports are difficult for a human steward to review quickly. Lumen pairs with **`hoshi-engine`** using two compression and indexing layers:
* **CAS Pocket Field Card (`Compact Artifact Sheet`):** Distills any multi-pass dossier, contract audit, or manuscript chapter into a **5-line executive datasheet** (`Almanac Silo`, `One-Line Invariant`, `Top 3 Verified Fruit`, `Quarantine/Gate Status`, `Return Phrase`).
* **The Farmer's Almanac (Dewey-Style Registry):** Assigns permanent shelfmarks (`ALMANAC::ZONE-xxx::BED::FR-xxx`) and lifecycle stages (`seed`, `sprout`, `rooted`, `branching`, `tree`, `fruiting`, `composted`, `quarantined`, `market`) to every serious framework. Commands sync live to `hoshi-engine` (`127.0.0.1:5001`) when running locally and persist in browser `localStorage` when offline.

### 5. Sovereign Inference Router (Offline-First Capable)
Lumen's `queryModel()` router automatically cascades through four inference tiers in order of sovereignty and speed:
1. **Local Ollama (`ollama:<model>` at `127.0.0.1:11434`):** 100% offline, private local GPU/CPU execution with zero internet dependency.
2. **Groq Cloud (`gsk_...`):** Ultra-fast LPU inference with automatic model discovery and `HTTP 429` cooldown retry handling.
3. **OpenRouter (`sk-or-...`):** Multi-model cloud fallback routing.
4. **Open-Core (Keyless):** Built-in zero-configuration fallback engine so Lumen works immediately out of the box with no API key required.
---

## User Guide

### 1. Interface Tour
* **Top Header Bar:**
  * **Left:** Brand indicator and live status readout (`MODE`, `FORM`, and composite coherence `C`).
  * **Archetype Dropdown:** Switch between the 10 specialized personas (`0. Garden Curator` through `9. Scholar-Author`).
  * **4-Tool Shed:** One-click launchers for companion scientific and engineering workbenches (`HTE Lab`, `Fource-MD`, `Fource-CUC`, `Aero-Diag`).
  * **Form Controls (`Hearth`, `Seed`, `Lantern`):** Manually morph the 3D wireframe hologram.
  * **Layout & Mode Controls:** Toggle `Layout: Docked` (3-column) vs. `Layout: Roam` (full-screen stage with floating glass panels), toggle `Porch Mode: ON/OFF`, or configure an optional API key / local Ollama model.
* **Left Panel (`CUC Homeostatic Vitals` & `Garden Gate Log`):** Displays live coherence bars (`O, E, H, X, C, λ`) and a timestamped audit log of active canon loads, file attachments, and Almanac sync events.
* **Center Stage:** Interactive Three.js WebGL hologram (drag to orbit, scroll to zoom) surrounded by drifting fireflies—or the untinted pixel-art Hearth Sanctuary (`porch.jpg`) when **Porch Mode** is active.
* **Right Panel (`Gardener & Steward Console`):** Action toolbar, Scholar Manuscript bar (visible in Persona 9), formatted Markdown/table chat log, and prompt input.

---

### 2. Everyday Workflows

#### A. Stepping Onto the Porch (Casual Brainstorming)
1. Click **`Porch Mode: OFF`** in the top right so it switches to **`Porch Mode: ON (Casual)`**.
2. The stage transitions to the hearth scene with warm amber fireflies, and archive logging pauses.
3. Chat freely about any topic without cluttering your `Δ-Ledger` or Hoshi database. Click **`Porch Mode: ON (Casual)`** again whenever you are ready to return to structured work.

#### B. Running a 3-Pass Synthesis & Generating a CAS Field Card
1. Select an archetype from the top dropdown (for example, **`2. Lab Engineer`** or **`1. Detective`**).
2. Type your target or question into the bottom prompt box and click the primary green button (e.g., **`Run Lab R&D Build (3-Pass)`**).
3. Wait as Lumen executes all three sequential stages and renders structured Markdown tables in the chat log.
4. Click **`CAS Field Card`** in the toolbar to compress the full multi-pass output into a 5-line **CAS Pocket Field Card** inside the reader modal, then click **`Copy Text`** or **`Download .md`**.

#### C. Auditing Documents & Contracts (`Parse File` & `Demo Ops Audit`)
* **To test immediately:** Click **`Demo Ops Audit`** to load a sample commercial vendor service agreement into working memory and switch to **`5. Advocate-Counsel`**, then click **`Run Jurisprudence Audit (3-Pass)`**.
* **To analyze your own files:** Click **`Parse File`**, select any `.txt`, `.md`, `.json`, or `.csv` file (up to 6,000 characters), and run any archetype pipeline—Lumen will anchor its analysis strictly to your uploaded text.

#### D. Writing Long-Form Monographs (`9. Scholar-Author`)
1. Select **`9. Scholar-Author (900-Page Monograph Engine)`** from the dropdown to reveal the **Manuscript Engine** bar.
2. Enter your book title or thesis in the prompt box and click **`1. Master Blueprint`** to generate a 16-section treatise outline.
3. Click **`2. Draft Next Section`** (or **`3. Draft 3-Section Batch`**) to generate 1,500+ word sections sequentially while automatically updating the Continuity Bible and word/page counter.
4. Click **`Download Book (.md)`** at any time to export the compiled manuscript.

---

### 3. Farmer's Almanac & Hoshi SQLite Commands
Type any of these commands directly into Lumen's prompt box to manage your framework registry:

* **Plant a New Seed:**
  ```text
  Plant FR-001 | Hoshi Core | KERNEL | Local-first SQLite state router and truth archive.
  ```
* **Water a Framework (Progressive Retrieval Levels 1–3):**
  ```text
  Water FR-001 at Level 1
  Water FR-001 at Level 2
  Restore FR-001 at Level 3
  ```
* **Update Lifecycle Stage (`Promote`, `Quarantine`, `Compost`, `Market`):**
  ```text
  Promote FR-001
  Quarantine FR-001 | Needs experimental validation before external release.
  Compost FR-001
  Market FR-001
  ```
* **Harvest & Inspect the Almanac:**
  * Type **`Garden Harvest`** in chat, or click the **`Farmer's Almanac`** button in the toolbar to view all planted seeds and live SQLite `Δ-Fragments`.

---

### 4. Connecting Local Services (`hoshi-engine` & `Ollama`)

#### Syncing With `hoshi-engine` (Persistent SQLite Backend)
1. In your `hoshi-engine` directory, start the local web server:
   ```bash
   HOSHI_WEB=1 python app_identity.py
   ```
2. Hoshi listens on `http://127.0.0.1:5001` with strict CORS allowlisting for `https://github.io`. All Almanac commands and lookups in Lumen will automatically mirror to `hoshi_identity.db`.

#### Running 100% Offline With Ollama
1. Start Ollama locally with browser origin permission enabled:
   ```bash
   OLLAMA_ORIGINS="https://github.io" ollama serve
   ```
2. Click **`API Key`** in Lumen's top-right header, enter `ollama:llama3.2` (or any model installed in your local Ollama instance), and click **`Save Key`**.

---

### 5. Companion 4-Tool Shed
* **HTE Lab (`hte-resonance-observatory/web`):** 119-element harmonic coordinate wheel, 7-state discovery ledger, and WebAudio sonification workbench.
* **Fource-MD (`fource-md-kernel`):** 18-domain mechanical engineering verification kernel and CAD/tolerance validator.
* **Fource-CUC (`fource-cuc-core`):** Algebraic Virtual Machine for Coherence Under Constraint (`Compose → Project → Stabilize`).
* **Aero-Diag (`aero-scale-diag`):** Interactive CFD Reynolds-scale, Kolmogorov dissipation (`η`), and boundary-layer separation diagnostic.

---

## Repository Structure

```text
Lumen/
├── index.html      # Botanical Garden UI, modals, Tool Shed header & copy-proof loader
├── app.js          # 10-archetype engine, Porch Mode, CAS compressor, Almanac sync & model router
├── avatar3d.js     # Three.js WebGL wireframe hologram, 10 persona rigs & firefly particle system
├── porch.jpg       # Porch Mode hearth sanctuary artwork
├── docs/           # Markdown canon & protocol reference files
└── README.md       # System architecture & user guide
```

## License
GNU AGPLv3
