from __future__ import annotations
import os
from typing import Any, Dict, List
from fastapi import FastAPI
from pydantic import BaseModel, Field

from core.schema import ConstraintSet
from core.ledger import LumenLedger
from core.kernel import LumenKernel
from core.cognizer import build_gemini_cognizer
from core.vitals_evaluator import compute_vitals

app = FastAPI(
    title="Lumen Homeostatic Runtime API",
    version="0.2.0",
    description="Coherence-Under-Constraint (CUC) autonomous agent service.",
)

DB_PATH = os.environ.get("LUMEN_DB_PATH", "lumen_ledger.sqlite")


class CycleRequest(BaseModel):
    sensory_input: str = Field(..., min_length=1)
    tokens_used_ratio: float = Field(default=0.10, ge=0.0, le=1.0)
    consecutive_errors: int = Field(default=0, ge=0)


def _get_kernel() -> tuple[LumenLedger, LumenKernel]:
    ledger = LumenLedger(DB_PATH)
    use_live_llm = bool(os.environ.get("GEMINI_API_KEY"))
    cognizer = build_gemini_cognizer() if use_live_llm else None
    kernel = LumenKernel(
        ledger=ledger,
        constraints=ConstraintSet(),
        cognitive_fn=cognizer,
    )
    return ledger, kernel


@app.get("/health")
def health_check() -> Dict[str, Any]:
    ledger = LumenLedger(DB_PATH)
    latest = ledger.latest()
    return {
        "status": "OK",
        "latest_delta_id": latest.delta_id if latest else None,
        "latest_coherence": round(latest.vitals.coherence_score, 4) if latest else None,
    }


@app.get("/ledger")
def get_recent_ledger(limit: int = 10) -> List[Dict[str, Any]]:
    ledger = LumenLedger(DB_PATH)
    return [d.to_dict() for d in ledger.recent(limit=limit)]


@app.post("/cycle")
def execute_cycle(req: CycleRequest) -> Dict[str, Any]:
    ledger, kernel = _get_kernel()
    vitals = compute_vitals(
        recent_deltas=ledger.recent(limit=5),
        has_verified_input=True,
        tokens_used_ratio=req.tokens_used_ratio,
        consecutive_errors=req.consecutive_errors,
    )
    report = kernel.step(
        sensory_input=req.sensory_input,
        vitals=vitals,
        tokens_used_ratio=req.tokens_used_ratio,
    )
    return {
        "mode": report.directive.mode,
        "persistence": report.directive.persistence_score,
        "delta_fragment": report.fragment.to_dict(),
        "output": report.output,
    }
