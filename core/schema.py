from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List, Dict, Any
import uuid


@dataclass
class CUCVitals:
    """Coherence-Under-Constraint (CUC) normalized vitals in [0.0, 1.0]."""
    origin_integrity: float = 1.0       # O: Valid anchoring & verified inputs
    expression_fidelity: float = 1.0    # E: Schema compliance & low contradiction
    historical_continuity: float = 1.0  # H: Unbroken Delta Fragment chain
    resonance_stability: float = 1.0    # X: Error recovery & equilibrium stability
    phase_cost: float = 0.0             # lambda: Metabolic/token friction >= 0.0

    @property
    def coherence_score(self) -> float:
        """Multiplicative Coherence Score: C = O * E * H * X."""
        return (
            self.origin_integrity
            * self.expression_fidelity
            * self.historical_continuity
            * self.resonance_stability
        )


@dataclass
class ConstraintSet:
    """Active constraint set (K) and hard circuit breakers (R)."""
    max_tokens_per_cycle: int = 4096
    max_steps_per_cycle: int = 5
    min_coherence_threshold: float = 0.65
    max_phase_cost: float = 0.75
    active_invariants: List[str] = field(default_factory=list)


@dataclass
class DeltaFragment:
    """Compact state transition record emitted at the end of cycle t."""
    delta_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    parent_id: str | None = None
    timestamp: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    vitals: CUCVitals = field(default_factory=CUCVitals)
    invariants_added: List[str] = field(default_factory=list)
    corrections: List[str] = field(default_factory=list)
    artifacts_modified: List[str] = field(default_factory=list)
    return_path: str = "IDLE"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "delta_id": self.delta_id,
            "parent_id": self.parent_id,
            "timestamp": self.timestamp,
            "vitals": {
                "O": self.vitals.origin_integrity,
                "E": self.vitals.expression_fidelity,
                "H": self.vitals.historical_continuity,
                "X": self.vitals.resonance_stability,
                "C": round(self.vitals.coherence_score, 4),
                "lambda": self.vitals.phase_cost,
            },
            "invariants_added": self.invariants_added,
            "corrections": self.corrections,
            "artifacts_modified": self.artifacts_modified,
            "return_path": self.return_path,
        }
