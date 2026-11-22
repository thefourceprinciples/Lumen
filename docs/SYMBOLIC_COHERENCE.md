# Bidirectional Symbolic Coherence & Anti-Drift Engineering

## 1. Bidirectional Symbolic Coherence (BSC)
**Bidirectional Symbolic Coherence** models interpretation and memory retrieval as a **time-symmetric constraint-satisfaction system**:

- **Forward Constraint ($t \rightarrow t+1$):** Past invariants ($K$) and Delta Fragments ($\Delta_0 \dots \Delta_t$) restrict what actions and claims are admissible in the present cycle.
- **Backward Pruning ($t+1 \rightarrow t$):** When new verified evidence or higher-order coherence stabilizes at cycle $t+1$, ambiguous or contradictory interpretations from earlier cycles are explicitly invalidated and logged in `DeltaFragment.corrections`.
- **Result:** Invalid historical branches are pruned rather than allowed to compound into long-term hallucination.

## 2. Canonical Engineering Against Doctrinal Drift
Drawing from historical studies of intentional canonical engineering (multi-layer textual anchoring, visual atlases, and structured redaction rules), Lumen prevents long-horizon drift through three structural mechanisms:

1. **Multi-Modal Redundancy:** Core invariants are stored simultaneously as human-readable Markdown (`docs/*.md`), executable Python rules (`core/regulator.py`), and structured JSON/SQLite ledgers (`DeltaFragment`).
2. **Explicit Falsification Tracking:** Corrections never silently overwrite history; every superseded assumption is appended as an explicit correction record so the system remembers *why* an old path failed.
3. **Immutable Root Anchors:** Layer-0 canonical files can only be modified via explicit steward commits, preventing gradual self-modification drift during autonomous cycles.
