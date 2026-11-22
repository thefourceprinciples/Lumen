from __future__ import annotations
from typing import List
from core.schema import CUCVitals, DeltaFragment


def compute_vitals(
    recent_deltas: List[DeltaFragment],
    has_verified_input: bool = True,
    tokens_used_ratio: float = 0.0,
    consecutive_errors: int = 0,
) -> CUCVitals:
    """
    Deterministically evaluates CUC pillars (O, E, H, X) and Phase Cost (lambda)
    from ledger continuity, error history, and resource pressure.
    """
    # O (Origin Integrity): Penalize ungrounded or unverified inputs
    origin = 0.98 if has_verified_input else 0.55

    # H (Historical Continuity): Anchored by unbroken parent_id chain in ledger
    if not recent_deltas:
        continuity = 0.80  # Cold-start baseline
    else:
        chain_valid = True
        for i in range(1, len(recent_deltas)):
            if recent_deltas[i].parent_id != recent_deltas[i - 1].delta_id:
                chain_valid = False
                break
        continuity = 1.0 if chain_valid else 0.40

    # E (Expression Fidelity): Degrades if recent cycles required error corrections
    recent_corrections = sum(len(d.corrections) for d in recent_deltas[-3:])
    expression = max(0.30, round(1.0 - (0.08 * recent_corrections), 4))

    # X (Resonance Stability): Penalize consecutive failures or oscillatory retries
    resonance = max(0.25, round(1.0 - (0.20 * consecutive_errors), 4))

    # Phase Cost (lambda): Driven by token saturation and recent correction friction
    lam = min(
        1.0,
        round((0.50 * tokens_used_ratio) + (0.10 * recent_corrections) + (0.15 * consecutive_errors), 4),
    )

    return CUCVitals(
        origin_integrity=origin,
        expression_fidelity=expression,
        historical_continuity=continuity,
        resonance_stability=resonance,
        phase_cost=lam,
    )
