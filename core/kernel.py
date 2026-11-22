from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
import re
from typing import Callable, Dict, Any, List
from core.schema import CUCVitals, ConstraintSet, DeltaFragment
from core.regulator import evaluate_fource, RegulatorDirective
from core.ledger import LumenLedger


CognitiveFn = Callable[[Dict[str, Any], RegulatorDirective], Dict[str, Any]]

CORE_SPINE_FILES = (
    "CANON_CORE.md",
    "GOVERNANCE_MLP.md",
    "FIVE_COMMITMENTS.md",
    "LUMEN_IDENTITY_DELTA.md",
)


@dataclass
class CycleReport:
    directive: RegulatorDirective
    fragment: DeltaFragment
    output: Dict[str, Any]


class LumenKernel:
    """Executes the Compose -> Constrain -> Stabilize -> Ledger heartbeat."""

    def __init__(
        self,
        ledger: LumenLedger,
        constraints: ConstraintSet | None = None,
        cognitive_fn: CognitiveFn | None = None,
        canon_dir: str | Path = "docs",
        max_retrieved_docs: int = 3,
    ) -> None:
        self.ledger = ledger
        self.constraints = constraints or ConstraintSet()
        self.cognitive_fn = cognitive_fn or self._default_noop_cognizer
        self.canon_dir = Path(canon_dir)
        self.max_retrieved_docs = max_retrieved_docs
        self._canon_cache = self._index_canon_dir(self.canon_dir)

    @staticmethod
    def _index_canon_dir(directory: Path) -> Dict[str, str]:
        if not directory.exists() or not directory.is_dir():
            return {}
        docs: Dict[str, str] = {}
        for md_file in sorted(directory.glob("*.md")):
            if md_file.name == "INDEX.md":
                continue
            content = md_file.read_text(encoding="utf-8").strip()
            if content:
                docs[md_file.name] = content
        return docs

    def _select_relevant_canon(self, query: str) -> str:
        """Loads Core Spine files plus top-K domain docs matching sensory_input."""
        if not self._canon_cache:
            return ""

        selected_names: List[str] = [
            name for name in CORE_SPINE_FILES if name in self._canon_cache
        ]

        tokens = {
            t for t in re.findall(r"[a-z0-9]{3,}", query.lower())
            if t not in {"the", "and", "for", "with", "that", "this", "from", "into"}
        }

        scored: List[tuple[int, str]] = []
        for name, content in self._canon_cache.items():
            if name in selected_names:
                continue
            haystack = f"{name.lower()} {content[:1500].lower()}"
            hits = sum(1 for tok in tokens if tok in haystack)
            if hits > 0:
                scored.append((hits, name))

        scored.sort(key=lambda item: (-item[0], item[1]))
        for _, name in scored[: self.max_retrieved_docs]:
            selected_names.append(name)

        sections = [
            f"--- CANON: {name} ---\n{self._canon_cache[name]}"
            for name in selected_names
        ]
        return "\n\n".join(sections)

    def step(
        self,
        sensory_input: str,
        vitals: CUCVitals,
        tokens_used_ratio: float = 0.0,
    ) -> CycleReport:
        # 1. COMPOSE (x (x) y): Anchor with Core Spine + Relevant Canon + Ledger
        history = self.ledger.recent(limit=5)
        parent_id = history[-1].delta_id if history else None
        context_packet = {
            "foundational_canon": self._select_relevant_canon(sensory_input),
            "input": sensory_input,
            "recent_deltas": [d.to_dict() for d in history],
            "active_invariants": self.constraints.active_invariants,
        }

        # 2. CONSTRAIN (Pi_K): Evaluate Fource vitals & enforce circuit breakers
        directive = evaluate_fource(
            vitals=vitals,
            constraints=self.constraints,
            tokens_used_ratio=tokens_used_ratio,
        )

        # 3. STABILIZE (R_K): Execute bounded cognitive step unless HALTED
        if directive.mode == "HALT":
            raw_output = {
                "status": "HALTED",
                "summary": directive.reason,
                "invariants_added": [],
                "corrections": ["Execution halted by Fource circuit breaker."],
                "artifacts_modified": [],
                "return_path": "AWAIT_STEWARD",
            }
        else:
            raw_output = self.cognitive_fn(context_packet, directive)

        # 4. RUN THE LEDGER: Emit & persist compact Delta Fragment
        fragment = DeltaFragment(
            parent_id=parent_id,
            vitals=vitals,
            invariants_added=raw_output.get("invariants_added", []),
            corrections=raw_output.get("corrections", []),
            artifacts_modified=raw_output.get("artifacts_modified", []),
            return_path=raw_output.get("return_path", "CONTINUE"),
        )
        self.ledger.append(fragment)

        return CycleReport(
            directive=directive,
            fragment=fragment,
            output=raw_output,
        )

    @staticmethod
    def _default_noop_cognizer(
        context: Dict[str, Any], directive: RegulatorDirective
    ) -> Dict[str, Any]:
        return {
            "status": "OK",
            "summary": f"Processed input in {directive.mode} mode.",
            "invariants_added": [],
            "corrections": [],
            "artifacts_modified": [],
            "return_path": "IDLE",
        }
