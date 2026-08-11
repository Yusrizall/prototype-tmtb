# TMTB Handoff v3.0 — Cross-Document Consistency Audit

**Project:** TMTB / BeCan
**Document Type:** Supporting Audit Handoff
**Audit Date:** 11 August 2026
**Scope:** 10-file active portable package + spot-check against currently available audited source/supporting evidence
**Status:** **AUDIT COMPLETE — FIX PASS REQUIRED BEFORE RECOVERY SIMULATION**
**Authority:** Supporting audit only. This document does not replace canonical design or implementation truth.

---

# 1. Audit Goal

Audit the newly authored Handoff Package v3.0 as one recovery package and determine whether a future assistant could read it without:

- confusing Game Design with implementation;
- resuming from a stale authoring checkpoint;
- promoting tentative tutorial content to locked design;
- reading historical files as current;
- inheriting contradictions between core documents.

---

# 2. Core Files Audited

Canonical / evergreen:

```text
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
TMTB_GAME_DESIGN_CONTEXT.md v3.1
TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

Handoff v3.0:

```text
README.md
TMTB_PROJECT_CONTEXT_v3.0.md
TMTB_CHAT_HANDOFF_v3.0.md
TMTB_CURRENT_STATE_v3.0.md
TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
TMTB_STATE_AND_DATA_MODEL_v3.0.md
TMTB_PROGRESS_AND_BACKLOG_v3.0.md
```

Supporting/source spot-check:

```text
TMTB_TUTORIAL_DESIGN_CORRECTED_HANDOFF_2026-08-11_v1.md
current audited main.js and battle/data files where relevant
```

---

# 3. Executive Result

Overall package quality:

```text
STRUCTURAL CONSISTENCY:
GOOD

DESIGN-vs-IMPLEMENTATION SEPARATION:
GOOD

VERSIONING:
GOOD

READ ORDER:
CONSISTENT

RECOVERY PORTABILITY:
NEAR-READY

FINAL PACKAGE STATUS:
NOT READY YET
```

No major case was found where the package falsely claims that Shared AP, Intent, Wave, redesigned Tutorial, or other v3.1 combat systems are already implemented.

However, several **authoring-residue and canonical-status issues** must be fixed before the new-chat recovery simulation.

Highest-priority findings:

```text
1. Canonical Context contains one stale tutorial-status statement.
2. Several handoff docs still point to the next document in the old authoring sequence.
3. Documentation status sections still say README/other files are not authored.
4. Offset Courtyard working-family decision is present in handoff/supporting docs but missing from canonical Context/Decisions.
5. Newly migrated tutorial working directions need safer official status labels.
```

---

# 4. PASS — Version Separation

Across the package, the intended separation is consistent:

```text
Canonical Game Design:
v3.1

Handoff Package:
v3.0

Prototype Implementation:
Post-v2.5 / Pre-v3 Combat Migration
```

No audited core document treats:

```text
Handoff v3.0
```

as proof that combat implementation is v3.0/v3.1.

Status:

```text
PASS
```

---

# 5. PASS — Source-of-Truth Split

Maintenance Protocol, README, Project Context, and Chat Handoff consistently separate:

```text
GAME DESIGN INTENT
```

from:

```text
PROTOTYPE IMPLEMENTATION TRUTH
```

Design hierarchy consistently prioritizes:

```text
latest explicit Game Designer decision
→ canonical Context
→ Decisions
→ supporting handoff
→ historical design
```

Implementation hierarchy consistently prioritizes:

```text
actual source/data
→ confirmed runtime
→ Current State
→ Architecture / State & Data
→ historical implementation docs
```

Status:

```text
PASS
```

---

# 6. PASS — Shared AP vs Old Exhaustion Gap

Canonical design consistently describes:

```text
party-wide Player Turn
Shared Team AP
StartGrid
Attack/Skill movement lock
global End Turn
```

Implementation-facing docs consistently describe current prototype as:

```text
Ready / Exhausted
originTile
Attack / Wait → Exhausted
all living players Exhausted → Enemy Phase
```

Current source spot-check found no current `teamAP`, `StartGrid`, Intent, Wave, Charge, or Stun implementation in the audited battle files.

Status:

```text
PASS
```

---

# 7. PASS — Enemy Design vs Current Enemy Implementation

Canonical design consistently says:

```text
sequential full enemy activation
Spawn Order baseline
Current Target
Intent
Dynamic Intent
max 1 Movement + 1 Action baseline
```

Implementation docs consistently say current source is:

```text
all enemies Move
→ all enemies Attack
```

with procedural target selection and no explicit Intent state.

Status:

```text
PASS
```

---

# 8. PASS — ATR / LOS / Cover Separation

Canonical design consistently requires:

```text
ATR
LOS
Cover

LOS ≠ Cover
```

Implementation docs consistently state:

```text
ATR exists
Cover/path geometry exists
distinct authoritative LOS does not yet exist
```

Full Cover targetability / 0-damage effectiveness is consistently preserved as a useful current seed.

Status:

```text
PASS
```

---

# 9. PASS — Full Run vs Prototype Region Scope

Core docs consistently use:

```text
Village
→ Town
→ Castle
→ Final Resolution
→ Settlement
→ Meta Progression
```

as main-game canon.

Region 1-only prototype completion is consistently classified as:

```text
DEVELOPMENT EXCEPTION
```

Status:

```text
PASS
```

---

# 10. PASS — Run Overview / Shop Work

Current State, Architecture, Progress & Backlog, Project Context, Chat Handoff, and README consistently classify current local flow work as:

```text
IMPLEMENTED
RUNTIME CONFIRMED
UNCOMMITTED
```

Relevant files are consistently identified as:

```text
src/main.js
src/style.css
src/ui/flow/basicFlowScreens.js
```

Status:

```text
PASS
```

---

# 11. PASS — V0–V8 Meaning

Core docs consistently treat:

```text
V0–V8
```

as:

```text
migration / validation domains
```

rather than one-patch coding checkpoints.

V0 is consistently marked complete.

V1 is consistently the first planned migration domain after documentation finalization.

Status:

```text
PASS
```

---

# 12. PASS — Read Order

Maintenance Protocol, Chat Handoff, and README agree on the default recovery order:

```text
1. README
2. Maintenance Protocol
3. Project Context
4. Game Design Context
5. Game Design Decisions
6. Current State
7. Prototype Architecture
8. State & Data Model
9. Progress & Backlog
10. Chat Handoff
```

Status:

```text
PASS
```

---

# 13. HIGH FINDING — Stale Tutorial Status Inside Canonical Context

`TMTB_GAME_DESIGN_CONTEXT.md` v3.1 still contains the carried statement:

```text
Old Stage 1 tutorial sequence:
NEEDS NEW TUTORIAL CURRICULUM
```

Elsewhere in the same canonical document, and throughout the package, current state is:

```text
T1 Learning Curriculum
COMPLETE as corrected working curriculum

T2
COMPLETE as corrected working architecture

T3
working design complete enough for prototype validation planning
```

This is a direct stale-status contradiction.

Recommended replacement:

```text
Old Stage 1 tutorial sequence:
SUPERSEDED AS CURRENT TUTORIAL SEQUENCE
historical/simple combat baseline remains reusable
```

or equivalent wording that recognizes that the new curriculum now exists.

Severity:

```text
HIGH
```

Must fix before recovery simulation.

---

# 14. HIGH FINDING — Sequential Authoring Resume Points Are Now Stale

Several docs were authored one-by-one and still contain instructions such as:

```text
After this Current State file:
next Architecture

After Architecture:
next State & Data

After State & Data:
next Progress & Backlog

After Progress:
next Project Context

After Project Context:
next Chat Handoff
```

These statements were correct during authoring but are wrong for the finished portable package.

Affected docs include:

```text
TMTB_CURRENT_STATE_v3.0.md
TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
TMTB_STATE_AND_DATA_MODEL_v3.0.md
TMTB_PROGRESS_AND_BACKLOG_v3.0.md
TMTB_PROJECT_CONTEXT_v3.0.md
```

Risk:

A future assistant reading a single document could resume documentation authoring that has already finished.

Recommended fix:

Replace sequential authoring resume instructions with a durable cross-reference:

```text
For current project resume point:
see README + Progress & Backlog + Chat Handoff.

After Handoff Package v3.0 finalization:
Prototype migration planning begins from V1,
after fresh relevant source audit.
```

Severity:

```text
HIGH
```

---

# 15. HIGH FINDING — Documentation Progress Sections Are Out of Date

`TMTB_PROGRESS_AND_BACKLOG_v3.0.md` still says:

```text
Progress & Backlog
IN PROGRESS

Remaining:
Project Context
Chat Handoff
README
```

`TMTB_CHAT_HANDOFF_v3.0.md` still says:

```text
Still to author:
README.md
```

README itself now exists.

These are expected authoring residues, but they must not survive final package activation.

Recommended fix after this audit:

```text
all 10 core files
AUTHORED

cross-document fix pass
IN PROGRESS

new-chat recovery simulation
NEXT
```

After recovery simulation succeeds:

```text
core package
AUDITED / RECOVERY-TESTED

local placement / Git verification
NEXT
```

Severity:

```text
HIGH
```

for portability, although not a design-rule conflict.

---

# 16. MEDIUM FINDING — Offset Courtyard Missing From Canonical Design Docs

The corrected Tutorial supporting handoff explicitly records:

```text
OFFSET COURTYARD
PRIMARY WORKING LAYOUT FAMILY
not final map lock
```

Progress, Chat Handoff, and README refer to Offset Courtyard as the current working tutorial layout family.

However:

```text
TMTB_GAME_DESIGN_CONTEXT.md v3.1
```

and:

```text
TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

do not contain the `Offset Courtyard` decision.

This creates an authority gap:

```text
non-canonical docs preserve a later design decision
while canonical docs omit it
```

Recommended canonical migration:

```text
Offset Courtyard
= TENTATIVE — primary working Tutorial layout family

Exact grid dimensions / coordinates
= TENTATIVE / not locked

L Geometry
= fallback if actual LOS/Cover validation requires it
```

Detailed ASCII coordinates should remain in the supporting Tutorial handoff.

Severity:

```text
MEDIUM
```

---

# 17. MEDIUM FINDING — Tutorial Working-Direction Status Needs Normalization

Newly migrated tutorial material sometimes uses descriptors such as:

```text
STRONG WORKING DIRECTION
CURRENT WORKING DIRECTION
PRIMARY WORKING LAYOUT FAMILY
```

These are useful descriptions, but the project now has an explicit formal status vocabulary.

Important items are not explicitly LOCKED.

To prevent future status inflation, recommended canonical wording is:

```text
One continuous Tutorial Stage
= TENTATIVE — strong working direction

Seven-Phase structure
= TENTATIVE

Phase 1 Control & Party Orientation
= TENTATIVE — current working direction

Practice Target
= PROTOTYPE ONLY + TENTATIVE candidate

Offset Courtyard
= TENTATIVE — primary working layout family

Status → Charge ordering
= TENTATIVE — current corrected curriculum baseline
```

This does not weaken the working direction.

It only prevents a future reader from interpreting “strong” as `LOCKED`.

Severity:

```text
MEDIUM
```

---

# 18. MEDIUM FINDING — Canonical Metadata Missing Explicit Status

The new Maintenance Protocol says canonical Game Design docs should clearly state:

```text
Game Design Version
Date
Canonical Status
```

`TMTB_GAME_DESIGN_CONTEXT.md` v3.1 has version/date/document type but no explicit metadata `Status:` line.

`TMTB_GAME_DESIGN_DECISIONS_v3.1.md` likewise has document type/version/date but no explicit status line.

Recommended additions:

Context:

```text
**Status:** **CANONICAL LIVING GAME DESIGN DOCUMENT**
```

Decisions:

```text
**Status:** **CANONICAL GAME DESIGN SNAPSHOT**
```

Severity:

```text
MEDIUM
```

---

# 19. MEDIUM-LOW FINDING — Historical Root Project Context Not Explicitly Classified

Actual tracked repository audit includes:

```text
TMTB_PROJECT_CONTEXT_v1.0.md
```

at repository root.

The new README / Chat Handoff explicitly classify:

```text
TMTB_CURRENT_STATE.md
TMTB_PROTOTYPE_V2_5_TODO_AND_DEFERRED_BACKLOG.md
docs/handoff-v2.5/*
```

as historical, but do not explicitly mention:

```text
TMTB_PROJECT_CONTEXT_v1.0.md
```

Risk is limited because the active read order is clear, but a future reader browsing root may still open it.

Recommended fix:

Add to historical lists:

```text
TMTB_PROJECT_CONTEXT_v1.0.md
= HISTORICAL / SUPERSEDED AS CURRENT PROJECT CONTEXT
```

Severity:

```text
MEDIUM-LOW
```

---

# 20. LOW FINDING — Stale Undefined Main-Menu Handler Reference

Current audited `main.js` still contains an event callback calling:

```text
finishDefeatedRunToMainMenu()
```

but no current definition for that function was found in the available audited `main.js`.

The uncommitted UI diff appears to remove the corresponding `run-defeat-main-menu` button, so this path is likely currently unreachable.

This did not produce an error in the baseline runtime test.

Classification:

```text
KNOWN STALE / LIKELY UNREACHABLE CODE REFERENCE
This needs verification before cleanup.
```

The core Current State / Architecture docs do not currently mention it.

Recommended documentation addition:

```text
known low-risk stale code reference
→ verify after final docs / before or during a small cleanup checkpoint
```

Do not fix it inside the documentation pass unless source/runtime verification is performed.

Severity:

```text
LOW
```

---

# 21. LOW FINDING — Maintenance Governance Example Still Uses “Target” Wording

Maintenance Protocol currently says:

```text
Canonical Game Design:
v3.1 target update

Handoff Package:
v3.0 target package
```

That wording was correct while planning.

After package finalization it should become an example/current checkpoint such as:

```text
Canonical Game Design:
v3.1

Handoff Package:
v3.0

Verified Prototype Baseline:
Post-v2.5 / Pre-v3 Combat Migration
```

Severity:

```text
LOW
```

---

# 22. LOW FINDING — Architecture Documentation Structure Uses Future Tense

Architecture currently says:

```text
The documentation refresh will add...
```

and labels the docs tree as planned.

After local placement/finalization, use:

```text
Active documentation structure
```

or:

```text
Handoff v3.0 target structure
```

depending on whether the files have actually been placed in the repository.

Severity:

```text
LOW
```

---

# 23. Package Status / Draft Naming

Current generated artifacts include temporary download names such as:

```text
TMTB_GAME_DESIGN_CONTEXT_v3.1_DRAFT.md
TMTB_HANDOFF_MAINTENANCE_PROTOCOL_UPDATED_2026-08-11.md
README_TMTB_HANDOFF_v3.0.md
```

This is not a package-content conflict because all core docs consistently state the final intended local paths.

Final local names should remain:

```text
docs/TMTB_GAME_DESIGN_CONTEXT.md
docs/TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
docs/handoff-v3.0/README.md
```

Status:

```text
PASS — PACKAGING ACTION STILL REQUIRED
```

---

# 24. No Major Implementation Overclaim Found

The audit specifically checked for the most dangerous recovery failure:

```text
design rule documented
→ implementation-facing doc accidentally says it is implemented
```

No major overclaim was found for:

- Shared AP;
- StartGrid/refund;
- Attack no-Exhaustion;
- global End Turn;
- distinct LOS;
- Intent;
- Dynamic Intent;
- sequential full activation;
- Status;
- Charge;
- Wave;
- corrected Tutorial T1–T3.

Status:

```text
PASS
```

---

# 25. Required Fix Pass

Before new-chat recovery simulation, fix in this order:

```text
1. Game Design Context
   - stale Stage 1 tutorial-status line
   - explicit canonical Status metadata
   - add Offset Courtyard compact canonical entry
   - normalize new tutorial status wording

2. Game Design Decisions
   - explicit canonical Status metadata
   - add Offset Courtyard compact decision
   - normalize tutorial working statuses

3. Current State
   - remove stale next-document authoring resume
   - optionally add stale finishDefeatedRunToMainMenu reference

4. Architecture
   - remove stale next-document authoring resume
   - update docs-tree future wording

5. State & Data
   - remove stale next-document authoring resume

6. Progress & Backlog
   - mark all 10 core files authored
   - set cross-document fix pass current
   - remove stale next-document sequence
   - classify old root Project Context v1.0 as historical

7. Project Context
   - remove stale next-document authoring resume
   - add root Project Context v1.0 historical note if useful

8. Chat Handoff
   - remove “README still to author”
   - update current documentation state
   - add Project Context v1.0 to historical list

9. Maintenance Protocol
   - update current governance example after fix pass

10. README
    - update package status after fix pass
    - add Project Context v1.0 to historical list
```

Then run:

```text
NEW-CHAT RECOVERY SIMULATION
```

---

# 26. Audit Conclusion

The package is structurally strong and the most important safety boundary is working:

```text
current design
≠
current implementation
```

The remaining issues are mostly:

```text
authoring-sequence residue
+
canonical migration completeness
+
status normalization
+
final packaging metadata
```

There is no need to restart the repository recovery or redesign Shared AP / Enemy Intent / Tutorial T1–T3.

Current next step:

```text
CROSS-DOCUMENT FIX PASS
```

After fixes:

```text
NEW-CHAT RECOVERY SIMULATION
```

---

**End of Cross-Document Consistency Audit**
