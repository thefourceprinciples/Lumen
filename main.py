from __future__ import annotations

import json
import math
import os
import sys

from core.cognizer import build_gemini_cognizer
from core.kernel import LumenKernel
from core.ledger import LumenLedger
from core.schema import ConstraintSet
from core.vitals_evaluator import compute_vitals


def _compute_cuc_v02_telemetry(vitals: object) -> dict[str, float]:
    """Derive CUC v0.2 Darkness D(t) and propensity Q_CUC from Lumen vitals."""
    o_val = float(getattr(vitals, "O", 0.96))
    e_val = float(getattr(vitals, "E", 0.94))
    h_val = float(getattr(vitals, "H", 0.92))
    x_val = float(getattr(vitals, "X", 0.95))
    lam = float(getattr(vitals, "lambda_cost", getattr(vitals, "lambda_", 0.12)))

    coherence = max(0.0, min(1.0, o_val * e_val * h_val * x_val))
    darkness = max(0.0, 0.25 * (1.0 - coherence) + 0.25 * max(0.0, lam))
    propensity = (coherence * math.exp(-darkness)) / (1.0 + max(0.0, lam))

    return {
        "coherence_C": round(coherence, 4),
        "darkness_D": round(darkness, 4),
        "propensity_Q_CUC": round(propensity, 4),
    }


def run_heartbeat(sensory_input: str) -> None:
    ledger = LumenLedger("lumen_ledger.sqlite")
    use_live_llm = bool(os.environ.get("GEMINI_API_KEY"))

    recent_deltas = ledger.recent(limit=5)
    vitals = compute_vitals(
        recent_deltas=recent_deltas,
        has_verified_input=bool(sensory_input.strip()),
        tokens_used_ratio=0.15,
        consecutive_errors=0,
    )

    fallback_used = False
    report = None

    if use_live_llm:
        try:
            cognizer = build_gemini_cognizer()
            kernel = LumenKernel(
                ledger=ledger,
                constraints=ConstraintSet(),
                cognitive_fn=cognizer,
            )
            report = kernel.step(sensory_input=sensory_input, vitals=vitals)
        except Exception as exc:
            fallback_used = True
            print(f"[HEARTBEAT NOTICE] Live cognizer fallback ({exc}); running local equilibrium.", file=sys.stderr)

    if report is None:
        kernel = LumenKernel(
            ledger=ledger,
            constraints=ConstraintSet(),
            cognitive_fn=None,
        )
        report = kernel.step(sensory_input=sensory_input, vitals=vitals)

    telemetry = _compute_cuc_v02_telemetry(vitals)

    print(
        json.dumps(
            {
                "mode": report.directive.mode,
                "persistence": report.directive.persistence_score,
                "cuc_v02": telemetry,
                "fallback_used": fallback_used,
                "delta_fragment": report.fragment.to_dict(),
                "output": report.output,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    prompt = " ".join(sys.argv[1:]) or "Heartbeat check: audit system coherence."
    run_heartbeat(prompt)
