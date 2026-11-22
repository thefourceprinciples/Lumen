from __future__ import annotations
import json
import os
import sys
from core.schema import ConstraintSet
from core.ledger import LumenLedger
from core.kernel import LumenKernel
from core.cognizer import build_gemini_cognizer
from core.vitals_evaluator import compute_vitals


def run_heartbeat(sensory_input: str) -> None:
    ledger = LumenLedger("lumen_ledger.sqlite")
    use_live_llm = bool(os.environ.get("GEMINI_API_KEY"))
    cognizer = build_gemini_cognizer() if use_live_llm else None

    kernel = LumenKernel(
        ledger=ledger,
        constraints=ConstraintSet(),
        cognitive_fn=cognizer,
    )

    recent_deltas = ledger.recent(limit=5)
    vitals = compute_vitals(
        recent_deltas=recent_deltas,
        has_verified_input=bool(sensory_input.strip()),
        tokens_used_ratio=0.15,
        consecutive_errors=0,
    )

    report = kernel.step(sensory_input=sensory_input, vitals=vitals)
    print(json.dumps(
        {
            "mode": report.directive.mode,
            "persistence": report.directive.persistence_score,
            "delta_fragment": report.fragment.to_dict(),
            "output": report.output,
        },
        indent=2,
    ))


if __name__ == "__main__":
    prompt = " ".join(sys.argv[1:]) or "Heartbeat check: audit system coherence."
    run_heartbeat(prompt)
