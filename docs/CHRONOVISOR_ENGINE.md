# Chronovisor & Chronovisor vNext — Historical & Causal Reconstruction Engine

## 1. Purpose: Bounded Temporal & Evidence Reconstruction
**Chronovisor** (and its **vNext** formalization) is Lumen's multi-stage reconstruction engine for analyzing incomplete timelines, historical records, and complex causal chains without hallucinating missing links.

## 2. Eight-Stage Reconstruction Pipeline
Every complex inquiry moves strictly sequentially through eight auditable layers:

1. **Source:** Register the raw artifact, document, or telemetry stream with provenance metadata.
2. **Evidence:** Extract discrete, verifiable units classified by UCMS tier (`Tier A: Direct`, `Tier B: Strong Reconstruction`, `Tier C: Plausible Inference`, `Tier Q: Quarantined`).
3. **Observation:** Record exact, non-interpretive facts grounded in the evidence.
4. **Claim:** Formulate explicit, falsifiable propositions linked to supporting observations.
5. **Scenario:** Assemble compatible claims into competing explanatory timelines or state trajectories.
6. **Score:** Evaluate each scenario against CUC coherence ($C = O \times E \times H \times X$), constraint compatibility ($K$), and Phase Cost ($\lambda$).
7. **Contradiction:** Explicitly isolate anachronisms, broken causal links, and mutually exclusive claims rather than smoothing them over.
8. **Atlas State:** Emit the verified state map—preserving competing high-scoring scenarios side-by-side when ambiguity remains.

## 3. Chronovisor vNext Mandatory Safeguards
- **"Underdetermined" Is a First-Class Output:** When available Tier-A/B evidence cannot uniquely resolve a state transition, Chronovisor vNext requires outputting `STATUS: UNDERDETERMINED` (`return_path = "VERIFY"`) rather than forcing a single speculative narrative.
- **No Retroactive Contamination:** Tier-C inferences and Tier-Q quarantined claims can never overwrite Tier-A primary observations in the ledger.
- **Provenance Traceability:** Every reconstructed node in the Atlas State must retain direct pointers back to its originating `Source` and `Evidence` IDs.
