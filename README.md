# Lumen

**Homeostatic AI agent runtime and Coherence-Under-Constraint (CUC) engine for self-correcting autonomous systems.**

[![License](https://shields.io)](LICENSE)
[![Python](https://shields.io)](https://python.org)
[![Architecture](https://shields.io)](#core-architecture)

---

## Overview

**Lumen** wraps stateless Large Language Models (LLMs) inside a deterministic Python homeostatic control loop governed by **the Fource**—an intrinsic mathematical regulator that monitors system coherence, enforces resource constraints, and prevents runaway execution loops.

Rather than relying on fragile prompt engineering or unbounded context replay, Lumen maintains continuity across wake cycles through verifiable **Delta Fragments (\(\Delta_i\))** and deterministic circuit breakers that run outside the model's control.

---

## Core Architecture

Every execution cycle follows the **Compose → Constrain → Stabilize** operational kernel:

1. **Compose (\(x \otimes y\)):** Gathers incoming signals, active constraints (K), and historical **Delta Fragments** from the state ledger.
2. **Constrain (\(\Pi_K\)):** Evaluates real-time **Coherence-Under-Constraint (CUC)** vitals and dynamically modulates LLM generation parameters (`temperature`, `max_output_tokens`, allowed actions) before invoking the model.
3. **Stabilize (\(R_K\)):** Validates model outputs against invariants, executes bounded tool calls, and emits a compact **Delta Fragment (\(\Delta_t\))** recording state transitions.
4. **Run the Ledger:** Persists \(\Delta_t\), composite vitals, and metabolic **Phase Cost (λ)** to an append-only ledger.

---

## Regulator Mathematics

Lumen evaluates system health before and after every model call using four normalized pillars scored in \([0.0, 1.0]\):

\[C = O \times E \times H \times X\]

| Pillar | Symbol | Operational Role |
| :--- | :---: | :--- |
| **Origin Integrity** | O | Anchors reasoning in verified inputs and grounded sources. |
| **Expression Fidelity** | E | Enforces schema compliance, signal clarity, and low contradiction. |
| **Historical Continuity** | H | Preserves an unbroken chain of state transitions across cycles. |
| **Resonance Stability** | X | Measures error recovery and equilibrium under perturbation. |

### Persistence & Circuit Breakers
* **Persistence Law:** \(\text{Persistence} \propto (C \times \text{Constraint Compatibility}) - \lambda\)
* **Deterministic Modes:** Based on real-time C, Phase Cost (λ), and context saturation, the regulator transitions the agent between `EXPLORE`, `STABILIZE`, `COMPRESS`, and `HALT`—ensuring hard safety and budget limits cannot be bypassed by the LLM.

---

## Repository Structure

```text
Lumen/
├── SPEC.md                  # Canonical mathematical & architectural specification
├── core/
│   ├── __init__.py
│   ├── schema.py            # Data models for CUCVitals, Constraints (K), and DeltaFragments
│   ├── regulator.py         # Deterministic Fource regulator & circuit breakers
│   ├── kernel.py            # Compose -> Constrain -> Stabilize execution loop
│   └── ledger.py            # Append-only state persistence layer
├── tools/
│   └── bounded_tools.py     # Schema-validated action executors
├── tests/
│   └── test_regulator.py    # Unit tests for homeostatic bounds & failure recovery
├── .gitignore
├── LICENSE                  # Apache License 2.0
└── README.md
```

---

## Quickstart

### 1. Clone the Repository
```bash
git clone https://github.com
cd Lumen
```

### 2. Evaluate Homeostatic State
```python
from core.schema import CUCVitals, ConstraintSet
from core.regulator import evaluate_fource

vitals = CUCVitals(
    origin_integrity=0.95,
    expression_fidelity=0.90,
    historical_continuity=0.88,
    resonance_stability=0.92,
    phase_cost=0.15,
)

directive = evaluate_fource(vitals, ConstraintSet())
print(directive.mode, directive.temperature, directive.persistence_score)
```

---

## Roadmap

- [x] **v0.1 — Core Schema & Deterministic Regulator:** Pure Python implementation of CUC vitals, Delta Fragments, and circuit breakers (`core/schema.py`, `core/regulator.py`).
- [ ] **v0.2 — Ledger & Kernel Loop:** SQLite/JSON Delta Fragment persistence and `Compose -> Constrain -> Stabilize` execution harness (`core/ledger.py`, `core/kernel.py`).
- [ ] **v0.3 — Cognitive & Retrieval Connectors:** Bounded LLM provider adapters and external retrieval tools.
- [ ] **v0.4 — Automated Heartbeat & CI:** GitHub Actions test suite and scheduled autonomous execution workflows.

---

## License

Licensed under the **Apache License 2.0**. See [LICENSE](LICENSE) for full terms.
