from core.schema import CUCVitals, ConstraintSet
from core.ledger import LumenLedger
from core.kernel import LumenKernel


def test_kernel_compose_constrain_stabilize_chain(tmp_path):
    db_file = tmp_path / "test_lumen.sqlite"
    ledger = LumenLedger(db_path=db_file)
    kernel = LumenKernel(ledger=ledger, constraints=ConstraintSet())

    # Cycle 1: Nominal execution
    r1 = kernel.step("Initialize system", CUCVitals(phase_cost=0.1))
    assert r1.directive.mode == "EXPLORE"
    assert r1.fragment.parent_id is None

    # Cycle 2: Verify parent_id links to Cycle 1's Delta Fragment
    r2 = kernel.step("Verify continuity", CUCVitals(phase_cost=0.1))
    assert r2.fragment.parent_id == r1.fragment.delta_id

    # Cycle 3: Trigger HALT circuit breaker on phase cost spike
    r3 = kernel.step("Overload test", CUCVitals(phase_cost=0.95))
    assert r3.directive.mode == "HALT"
    assert r3.fragment.return_path == "AWAIT_STEWARD"
    assert len(ledger.recent(limit=10)) == 3
