# Physical Sensing, Environmental Coherence & Machine Protection

When Lumen interfaces with physical hardware, telemetry streams, or real-world actuators, three specialized subsystems govern signal integrity and physical safety:

## 1. GardenCore Sensor Audit Protocol
**GardenCore** audits physical vibration and telemetry sensing pipelines before data enters Lumen's cognitive layer:
- **Channel Verification:** Validates sampling rates, baseline noise floors, and sensor calibration before computing coherence metrics.
- **Anti-Artifact Filtering:** Rejects clipped, saturated, or disconnected channel readings so hardware noise is never misinterpreted as a meaningful state shift ($O \rightarrow 0$ on unverified sensor channels).

## 2. Bonsai Protocol Ledger & Tree Signature Protocol (BSP-SIG)
The **Bonsai Protocol Ledger** catalogs environmental coherence nodes and physical anchor points:
- **Environmental Nodes:** Treats biological and environmental systems as long-horizon coherence sensors tracked across seasonal and diurnal cycles.
- **Signature Glyph Imprints:** Encodes node placements, field mesh topologies, and state transitions into compact, verifiable ledger records.

## 3. FSM-02 Engine Guardian (Hardware Circuit Breaker)
For any physical or power-bearing equipment controlled or monitored by Lumen, the **FSM-02 Engine Guardian** principle applies:
- **Hardware-First Interruption:** Protective shutdown circuits operate independently of software or LLM latency, cleanly interrupting energy paths when physical thresholds are exceeded.
- **Fail-Safe Default:** Loss of heartbeat, telemetry timeout, or `mode == "HALT"` transitions physical actuators into a zero-energy safe state immediately.
