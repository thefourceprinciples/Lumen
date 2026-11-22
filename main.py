from __future__ import annotations
import json
import os
import sys
from core.schema import CUCVitals, ConstraintSet
from core.ledger import LumenLedger
from core.kernel import LumenKernel
from core.cognizer import build_gemini_cognizer


def run_heartbeat(sensory_input: str) -> None:
    ledger = LumenLedger("lumen_ledger.sqlite")
    use_live_llm = bool(os.environ.get("GEMINI_API_KEY"))
    cognizer = build_gemini_cognizer() if use_live_llm else None

    kernel = LumenKernel(
        ledger=ledger,
        constraints=ConstraintSet(),
        cognitive_fn=cognizer,
    )

    # Baseline vitals (H=1.0 if anchored by prior ledger fragment, else 0.85)
    prior = ledger.latest()
    vitals = CUCVitals(
        origin_integrity=0.95,
        expression_fidelity=0.95,
        historical_continuity=1.0 if prior else 0.85,
        resonance_stability=0.95,
        phase_cost=0.10,
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
