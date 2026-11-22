from __future__ import annotations
import json
import sqlite3
from pathlib import Path
from typing import List, Optional
from core.schema import CUCVitals, DeltaFragment


class LumenLedger:
    """Append-only SQLite ledger preserving Historical Continuity (H)."""

    def __init__(self, db_path: str | Path = "lumen_ledger.sqlite") -> None:
        self.db_path = str(db_path)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS delta_fragments (
                    seq INTEGER PRIMARY KEY AUTOINCREMENT,
                    delta_id TEXT UNIQUE NOT NULL,
                    parent_id TEXT,
                    timestamp TEXT NOT NULL,
                    coherence_score REAL NOT NULL,
                    phase_cost REAL NOT NULL,
                    return_path TEXT NOT NULL,
                    payload_json TEXT NOT NULL
                )
                """
            )

    def append(self, fragment: DeltaFragment) -> DeltaFragment:
        """Commit a verified Delta Fragment to the ledger."""
        payload = fragment.to_dict()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO delta_fragments (
                    delta_id, parent_id, timestamp,
                    coherence_score, phase_cost, return_path, payload_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    fragment.delta_id,
                    fragment.parent_id,
                    fragment.timestamp,
                    fragment.vitals.coherence_score,
                    fragment.vitals.phase_cost,
                    fragment.return_path,
                    json.dumps(payload),
                ),
            )
        return fragment

    def latest(self) -> Optional[DeltaFragment]:
        """Retrieve the most recent Delta Fragment to anchor cycle t."""
        with self._connect() as conn:
            row = conn.execute(
                "SELECT payload_json FROM delta_fragments ORDER BY seq DESC LIMIT 1"
            ).fetchone()
        if not row:
            return None
        return self._deserialize(json.loads(row[0]))

    def recent(self, limit: int = 5) -> List[DeltaFragment]:
        """Fetch the last N Delta Fragments in chronological order."""
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT payload_json FROM delta_fragments ORDER BY seq DESC LIMIT ?",
                (limit,),
            ).fetchall()
        return [self._deserialize(json.loads(r[0])) for r in reversed(rows)]

    @staticmethod
    def _deserialize(data: dict) -> DeltaFragment:
        v = data["vitals"]
        vitals = CUCVitals(
            origin_integrity=v["O"],
            expression_fidelity=v["E"],
            historical_continuity=v["H"],
            resonance_stability=v["X"],
            phase_cost=v["lambda"],
        )
        return DeltaFragment(
            delta_id=data["delta_id"],
            parent_id=data["parent_id"],
            timestamp=data["timestamp"],
            vitals=vitals,
            invariants_added=data.get("invariants_added", []),
            corrections=data.get("corrections", []),
            artifacts_modified=data.get("artifacts_modified", []),
            return_path=data.get("return_path", "IDLE"),
        )
