from __future__ import annotations
from dataclasses import dataclass
from core.schema import CUCVitals, ConstraintSet


@dataclass
class RegulatorDirective:
    """Deterministic control outputs modulating the LLM cognitive layer."""
    mode: str                 # "EXPLORE", "STABILIZE", "COMPRESS", or "HALT"
    temperature: float        # Modulated LLM sampling temperature
    max_output_tokens: int    # Modulated token allowance
    persistence_score: float  # (C * compatibility) - lambda
    reason: str


def compute_coupling_efficiency(
    amp_i: float, amp_j: float, phase_error: float, epsilon: float = 1e-4
) -> float:
    """Relational coupling metric: F_ij = (A_i * A_j) / (|delta_phi_ij| + eps)."""
    return (amp_i * amp_j) / (abs(phase_error) + epsilon)


def evaluate_fource(
    vitals: CUCVitals,
    constraints: ConstraintSet,
    constraint_compatibility: float = 1.0,
    tokens_used_ratio: float = 0.0,
) -> RegulatorDirective:
    """
    Deterministic homeostatic regulator running before and after LLM calls.
    Enforces hard circuit breakers outside model control.
    """
    c_score = vitals.coherence_score
    lam = vitals.phase_cost
    persistence = (c_score * constraint_compatibility) - lam

    # 1. Hard Circuit Breaker: Critical coherence collapse or excessive phase cost
    if c_score < 0.30 or lam > constraints.max_phase_cost:
        return RegulatorDirective(
            mode="HALT",
            temperature=0.0,
            max_output_tokens=256,
            persistence_score=round(persistence, 4),
            reason=f"Circuit breaker triggered (C={c_score:.2f}, lambda={lam:.2f}).",
        )

    # 2. Context Saturation Guard: Force memory compression into Delta Fragments
    if tokens_used_ratio >= 0.80:
        return RegulatorDirective(
            mode="COMPRESS",
            temperature=0.1,
            max_output_tokens=1024,
            persistence_score=round(persistence, 4),
            reason="Context saturation >= 80%; compressing state into Delta Fragment.",
        )

    # 3. Homeostatic Stabilization: Coherence below target threshold
    if c_score < constraints.min_coherence_threshold:
        return RegulatorDirective(
            mode="STABILIZE",
            temperature=0.2,
            max_output_tokens=min(2048, constraints.max_tokens_per_cycle),
            persistence_score=round(persistence, 4),
            reason=f"Coherence below target ({c_score:.2f} < {constraints.min_coherence_threshold}).",
        )

    # 4. Nominal Equilibrium: Allow full reasoning & exploration
    return RegulatorDirective(
        mode="EXPLORE",
        temperature=0.6,
        max_output_tokens=constraints.max_tokens_per_cycle,
        persistence_score=round(persistence, 4),
        reason="System within nominal CUC equilibrium.",
    )
