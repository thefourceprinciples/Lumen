# Hoshi Archival Manifest & Delta Fragment Protocol

## 1. Purpose: Preventing Memory Pollution
In long-running autonomous systems, replaying raw conversational transcripts causes context saturation, rising Phase Cost ($\lambda$), and epistemic drift. Following the **Hoshi Archive Architecture** and **Canonical Index File (CIF)** standard, Lumen separates **canonical reference documents** from **episodic Delta Fragments**.

## 2. Layered Storage Hierarchy
1. **Layer 0 — Immutable Canon (`docs/*.md`):** Foundational definitions, mathematical laws, and governance protocols loaded as read-only anchors.
2. **Layer 1 — Canonical Index File (CIF):** Structured manifest mapping active invariants, verified artifacts, and authoritative document paths.
3. **Layer 2 — Append-Only Delta Ledger (`LumenLedger`):** Chronological chain of compact state transitions ($\Delta_0 \dots \Delta_t$).

## 3. Delta Fragment Emission Rules
At the close of every cycle $t$, Lumen emits exactly one `DeltaFragment` containing only what changed after the crossing:
- **`invariants_added`:** New verified facts or rules promoted to active memory.
- **`corrections`:** Prior assumptions falsified or superseded during cycle $t$.
- **`artifacts_modified`:** Exact file paths, database records, or external resources touched.
- **`return_path`:** Deterministic next state (`IDLE`, `VERIFY`, `COMPRESS`, `CONTINUE`, or `AWAIT_STEWARD`).
