from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Dict, Any
from core.schema import CUCVitals, ConstraintSet, DeltaFragment
from core.regulator import evaluate_fource, RegulatorDirective
from core.ledger import LumenLedger


CognitiveFn = Callable[[Dict[str, Any], RegulatorDirective], Dict[str, Any]]


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
    ) -> None:
        self.ledger = ledger
        self.constraints = constraints or ConstraintSet()
        self.cognitive_fn = cognitive_fn or self._default_noop_cognizer
        self.canon_text = self._load_canon_dir(canon_dir)

    @staticmethod
    def _load_canon_dir(canon_dir: str | Path) -> str:
        directory = Path(canon_dir)
        if not directory.exists() or not directory.is_dir():
            return ""
        sections = []
        for md_file in sorted(directory.glob("*.md")):
            content = md_file.read_text(encoding="utf-8").strip()
            if content:
                sections.append(f"--- CANON: {md_file.name} ---\n{content}")
        return "\n\n".join(sections)

    def step(
        self,
        sensory_input: str,
        vitals: CUCVitals,
        tokens_used_ratio: float = 0.0,
    ) -> CycleReport:
        # 1. COMPOSE (x (x) y): Anchor with Foundational Canon + recent ledger continuity
        history = self.ledger.recent(limit=5)
        parent_id = history[-1].delta_id if history else None
        context_packet = {
            "foundational_canon": self.canon_text,
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
