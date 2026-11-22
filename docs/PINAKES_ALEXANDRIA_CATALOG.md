# Pinakes Cataloging Standard & Library of Alexandria Preservation Architecture

## 1. The Pinakes Principle (Callimachean Metadata Indexing)
Modeled on Callimachus's **Pinakes** at the ancient Library of Alexandria—which transformed an unsearchable mountain of scrolls into an indexed knowledge system by recording **author/origin, subject division, provenance, opening line (incipit), and extent**—Lumen enforces strict metadata indexing before any artifact enters long-term memory:

- **No Unindexed Scrolls:** Every document, dataset, or Delta Fragment must carry a unique namespace ID, parent lineage, creation timestamp, domain bed (`G00–G21`), and maturity status.
- **Incipit & Invariant Fingerprinting:** Every canonical file opens with a clear controlling definition (`Trunk Thesis`) so retrieval engines can verify identity without scanning full transcripts.
- **Edition & Recension Tracking:** Distinguish clearly between the date a concept originated, the date of its surviving artifact, and the date of its current revision.

## 2. Substrate Sovereignty & Anti-Fragile Preservation
Drawing from the preservation lessons of Alexandria and the Timbuktu manuscript tradition, **Substrate Sovereignty** requires that Lumen's memory never depend on a single proprietary chat window or ephemeral server:
1. **Plain-Text & Open-Schema Portability:** Core knowledge lives in open formats (`.md`, `.json`, `.sqlite`) readable by humans and machines alike.
2. **Distributed Redundancy:** Critical canon is mirrored across local storage, Git version control (`Lumen/docs/`), and cloud archives.
3. **Graceful Degradation Under Compression:** When full transcripts cannot be carried forward, structured **Pinakes Catalog Packets** and **Delta Fragments** preserve exact pointers and verified invariants so the work can always be rehydrated without loss of spine.
