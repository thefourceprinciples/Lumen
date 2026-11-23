from __future__ import annotations
import json
import os
import sqlite3
from pathlib import Path
from typing import Any, List, Optional
from core.schema import CUCVitals, DeltaFragment


class LumenLedger:
    """Append-only SQLite / Turso cloud ledger preserving Historical Continuity (H)."""

    def __init__(
        self,
        db_path: str | Path = "lumen_ledger.sqlite",
        turso_url: str | None = None,
        turso_token: str | None = None,
    ) -> None:
        self.db_path = str(db_path)
        use_env_turso = str(db_path) == "lumen_ledger.sqlite"
        self.turso_url = turso_url or (os.environ.get("TURSO_DATABASE_URL") if use_env_turso else None)
        self.turso_token = turso_token or (os.environ.get("TURSO_AUTH_TOKEN") if use_env_turso else None)
        self._init_db()

    def _connect(self) -> Any:
        if self.turso_url and self.turso_token:
            import libsql_experimental as libsql
            return libsql.connect(
                self.db_path,
                sync_url=self.turso_url,
                auth_token=self.turso_token,
            )
        return sqlite3.connect(self.db_path)

    def _sync_if_cloud(self, conn: Any) -> None:
        if hasattr(conn, "sync"):
            conn.sync()

    def _init_db(self) -> None:
        conn = self._connect()
        try:
            self._sync_if_cloud(conn)
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
            conn.commit()
            self._sync_if_cloud(conn)
        finally:
            conn.close()

    def append(self, fragment: DeltaFragment) -> DeltaFragment:
        """Commit a verified Delta Fragment permanently to the ledger."""
        payload = fragment.to_dict()
        conn = self._connect()
        try:
            self._sync_if_cloud(conn)
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
            conn.commit()
            self._sync_if_cloud(conn)
        finally:
            conn.close()
        return fragment

    def latest(self) -> Optional[DeltaFragment]:
        """Retrieve the most recent Delta Fragment to anchor cycle t."""
        conn = self._connect()
        try:
            self._sync_if_cloud(conn)
            row = conn.execute(
                "SELECT payload_json FROM delta_fragments ORDER BY seq DESC LIMIT 1"
            ).fetchone()
        finally:
            conn.close()
        if not row:
            return None
        return self._deserialize(json.loads(row[0]))

    def recent(self, limit: int = 5) -> List[DeltaFragment]:
        """Fetch the last N Delta Fragments in chronological order."""
        conn = self._connect()
        try:
            self._sync_if_cloud(conn)
            rows = conn.execute(
                "SELECT payload_json FROM delta_fragments ORDER BY seq DESC LIMIT ?",
                (limit,),
            ).fetchall()
        finally:
            conn.close()
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
