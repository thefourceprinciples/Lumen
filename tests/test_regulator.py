import pytest
from core.schema import CUCVitals, ConstraintSet, DeltaFragment
from core.regulator import evaluate_fource, compute_coupling_efficiency


def test_nominal_explore_mode():
    vitals = CUCVitals(
        origin_integrity=0.95,
        expression_fidelity=0.95,
        historical_continuity=0.95,
        resonance_stability=0.95,
        phase_cost=0.10,
    )
    directive = evaluate_fource(vitals, ConstraintSet())
    assert directive.mode == "EXPLORE"
    assert directive.temperature == 0.6


def test_stabilize_mode_when_coherence_dips():
    vitals = CUCVitals(
        origin_integrity=0.80,
        expression_fidelity=0.80,
        historical_continuity=0.80,
        resonance_stability=0.90,  # C = 0.4608 (< 0.65 threshold)
        phase_cost=0.20,
    )
    directive = evaluate_fource(vitals, ConstraintSet())
    assert directive.mode == "STABILIZE"
    assert directive.temperature == 0.2


def test_compress_mode_on_context_saturation():
    vitals = CUCVitals(phase_cost=0.10)
    directive = evaluate_fource(vitals, ConstraintSet(), tokens_used_ratio=0.85)
    assert directive.mode == "COMPRESS"
    assert directive.temperature == 0.1


def test_halt_circuit_breaker_on_collapse_or_high_cost():
    low_coherence = CUCVitals(origin_integrity=0.20, phase_cost=0.10)
    assert evaluate_fource(low_coherence, ConstraintSet()).mode == "HALT"

    high_cost = CUCVitals(phase_cost=0.85)
    assert evaluate_fource(high_cost, ConstraintSet()).mode == "HALT"


def test_coupling_efficiency_and_delta_serialization():
    f_ij = compute_coupling_efficiency(amp_i=0.9, amp_j=0.8, phase_error=0.05)
    assert f_ij == pytest.approx(14.3712, rel=1e-3)

    delta = DeltaFragment(invariants_added=["CUC_ACTIVE"], return_path="VERIFY")
    payload = delta.to_dict()
    assert payload["vitals"]["C"] == 1.0
    assert payload["return_path"] == "VERIFY"
