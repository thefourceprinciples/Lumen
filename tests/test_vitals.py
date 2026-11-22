from core.schema import CUCVitals, DeltaFragment
from core.vitals_evaluator import compute_vitals


def test_vitals_cold_start_and_chain_continuity():
    cold = compute_vitals(recent_deltas=[])
    assert cold.historical_continuity == 0.80
    assert cold.coherence_score > 0.70

    d1 = DeltaFragment(delta_id="d1", parent_id=None)
    d2 = DeltaFragment(delta_id="d2", parent_id="d1")
    warm = compute_vitals(recent_deltas=[d1, d2])
    assert warm.historical_continuity == 1.0


def test_vitals_degrade_on_errors_and_broken_chain():
    d1 = DeltaFragment(delta_id="d1", parent_id=None, corrections=["err1", "err2"])
    d2 = DeltaFragment(delta_id="d2", parent_id="wrong_parent")
    degraded = compute_vitals(
        recent_deltas=[d1, d2],
        tokens_used_ratio=0.80,
        consecutive_errors=2,
    )
    assert degraded.historical_continuity == 0.40
    assert degraded.resonance_stability == 0.60
    assert degraded.phase_cost >= 0.70
