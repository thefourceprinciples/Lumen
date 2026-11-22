# KOS Pharmacopoeia Architecture (`DM-PHARMACOPOEIA–001`) & Medical Evidence Rules

## 1. Governing Philosophy & Non-Medical-Advice Boundary
> **A coherent explanation is not necessarily a true explanation.**

Under **Daciana Medica / KOS Pharmacopoeia (`DM-PHARMACOPOEIA–001`)**, Lumen separates historical attestation, botanical identification, chemical composition, laboratory activity, and clinical effectiveness as independent evidential achievements:
- **Recover:** Preserve and authenticate historical medicinal traditions on their own terms without anachronistic projection.
- **Understand:** Investigate underlying botanical, chemical, and physiological mechanisms via peer-reviewed evidence.
- **Safety & Non-Substitution Rule:** Fource coherence metrics ($O, E, H, X$) organize archival knowledge—they never substitute for experimental evidence, clinical trials, toxicology screening, or qualified medical judgment. Lumen never issues personal medical diagnoses or treatment prescriptions.

## 2. Twelve-Division Pharmacopoeia Structure (`PH-001` – `PH-012`)

| Division | Domain | Primary Responsibility |
| :--- | :--- | :--- |
| **`PH-001`** | **Foundations & Governance** | Scope, ethics, evidence grading, and stewardship alignment. |
| **`PH-002`** | **Historical Knowledge** | Regional traditions (`PH-002.100` Dacian/Balkan, `200` Greek, `300` Roman, `400` Egyptian, `500` Mesopotamian, `600` South Asian, `700` East Asian, `800` Global, `900` Cross-cultural transmission). |
| **`PH-003`** | **Materia Medica** | Structured catalog of medicinal organisms and natural substances. |
| **`PH-004`** | **Pharmacognosy** | Botanical authentication, morphology, taxonomy, and provenance. |
| **`PH-005`** | **Chemical Atlas** | Active constituents, molecular structures, and phytochemical profiles. |
| **`PH-006`** | **Pharmacology** | Biological targets, receptor pathways, and mechanistic activity. |
| **`PH-007`** | **Therapeutic Evidence** | Preclinical assays, clinical trials, and systematic reviews. |
| **`PH-008`** | **Formulations & Preparations** | Extraction methods, dosage forms, stability, and quality control. |
| **`PH-009`** | **Toxicology & Safety** | Toxicity thresholds, contraindications, and drug–herb interactions. |
| **`PH-010`** | **Therapeutic Classification** | Evidence-graded physiological systems and documented uses. |
| **`PH-011`** | **Pharmacopoeia Monographs** | Standardized, multi-tier reference entries. |
| **`PH-012`** | **Research & Development** | Open questions, falsification tests, and unresolved gaps. |

## 3. Four-Record Separation Rule
Every entry in `LumenLedger` or `KOS Pharmacopoeia` keeps four record types strictly separate:
1. **Historical Claim** (what a primary text states, tagged `P1–S2` and `HC-1–6`)
2. **Reconstructed Preparation** (how historical ingredients/processes map to physical materials)
3. **Modern Botanical / Chemical Identification** (verified taxonomy and active compounds)
4. **Clinically Supported Evidence** (peer-reviewed human safety and efficacy data)
