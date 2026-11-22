# FourceLang & Isomorphic Constraint Mapping

## 1. Core Paradigm: Declarative Reactive Graph Execution
**FourceLang** is a declarative reactive graph language designed to unify theoretical constraint modeling with deterministic software execution. Instead of imperative control flow that can drift into unbounded loops, FourceLang models computation as a **constraint-backed dependency graph**:

- **Nodes (State Variables):** Hold typed state values, phase angles, and local coherence scores ($C_{\text{local}}$).
- **Edges (Constraint Channels):** Enforce mathematical invariants ($K$) and coupling rules ($F_{ij}$) between connected nodes.
- **Deterministic Propagation:** When an input node updates, changes propagate deterministically through dependent nodes until the graph settles into a valid fixed point ($R_K$).

## 2. Kernel–UI Separation Principle
Following **Isomorphic Constraint Mapping**, every Lumen subsystem enforces a strict boundary between its deterministic kernel and its presentation or cognitive layer:

| Layer | Responsibility | Rule |
| :--- | :--- | :--- |
| **Deterministic Kernel** | Enforces CUC math ($C = O \times E \times H \times X$), budget caps, and state transitions. | Never bypassed by LLM generation or UI events. |
| **Cognitive / UI Surface** | Renders human-readable explanations, visualizations, or natural language responses. | Acts strictly as a projection of verified kernel state. |

## 3. Shared Constraint Architecture
Isomorphic Constraint Mapping allows Lumen to compare mathematical structures across distinct domains (e.g., coupled oscillators, relational databases, and symbolic graphs) by matching shared constraint topologies **without claiming physical equivalence**.
