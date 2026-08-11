# TMTB / BeCan — Handoff Package v3.0

**Project:** TMTB / BeCan
**Document Type:** Handoff Package Entry Point / Read Guide
**Handoff Package Version:** 3.0
**Canonical Game Design Version:** 3.1
**Prototype Implementation Baseline:** **Post-v2.5 / Pre-v3 Combat Migration**
**Verified Baseline Date:** 11 August 2026
**Project Root:** `C:\Datas\prototype-tmtb`
**Package Status:** **AUTHORED + CROSS-DOCUMENT AUDITED + RECOVERY-SIMULATION PASSED — LOCAL PLACEMENT / GIT REVIEW NEXT**

---

# 1. Start Here

This package exists so TMTB can be resumed without reconstructing months of project discussion manually.

The most important distinction is:

```text
GAME DESIGN INTENT
≠
PROTOTYPE IMPLEMENTATION TRUTH
```

Current canonical Game Design is:

```text
v3.1
```

Current handoff/documentation package is:

```text
v3.0
```

Current prototype implementation baseline is:

```text
Post-v2.5 / Pre-v3 Combat Migration
Verified 11 August 2026
```

Therefore:

```text
Handoff v3.0
does NOT mean
Prototype Combat v3.0
```

---

# 2. What TMTB Is

TMTB / BeCan is a:

```text
3D Turn-Based Tactics game
+
semi/light roguelite run progression
+
permanent meta progression
```

Target production environment:

```text
Unity
```

The current browser prototype is:

```text
2D
simulative
Vite + Vanilla JavaScript
```

It serves two parallel roles:

```text
A. Game Designer Validation Tool
B. Unity Functional Flow Reference
```

Prototype behaviour must not automatically be interpreted as final main-game design.

---

# 3. Main Game vs Prototype

Main Game direction includes:

```text
3D tactical environment
continuous/free movement
tactical grid resolution
```

The prototype may use:

```text
direct grid / BFS
```

when that is sufficient for validation.

Important Unity-only onboarding steps may remain represented through:

```text
FLOW SIMULATION
```

rather than being omitted.

---

# 4. Current Full-Run Canon

Current main-game full-run direction:

```text
Village
→ Town
→ Castle
→ Final Resolution
→ Settlement
→ Meta Progression
```

Current prototype ending around Region 1 is a:

```text
DEVELOPMENT EXCEPTION
```

It is not the final full-run structure.

---

# 5. Current Project Snapshot

## Canonical Design

Current design includes, among other systems:

```text
party-wide Player Turn
Shared Team AP
Team AP = Living Player Units × 2
StartGrid
movement commitment/refund
Attack/Skill Movement Lock
repeated actions when AP/rules allow
global End Turn

ATR
ranged LOS
LOS ≠ Cover

Enemy Target Rule
Current Target
Intent
Dynamic Intent
sequential enemy activation
Spawn Order baseline

Status
Charge
Wave Telegraph

corrected Tutorial T1–T3
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

For full rules/statuses, read the canonical Game Design documents.

---

## Actual Prototype

Current audited combat still uses:

```text
per-unit Ready / Exhausted
originTile
free reposition before action
Attack / Wait → Exhausted
all living Player Units Exhausted
→ Enemy Phase

Enemy Phase:
all enemies Move
→ all enemies Attack
```

Current prototype does **not** yet implement the major v3.1 combat migration.

For actual current behaviour, read:

```text
TMTB_CURRENT_STATE_v3.0.md
```

---

# 6. Current Post-v2.5 Local Work

The recovery audit found important local uncommitted work in:

```text
src/main.js
src/style.css
src/ui/flow/basicFlowScreens.js
```

This work includes:

```text
Run Overview
Shop relocation
Tutorial Victory → Run Overview
run settlement → Run Overview
Village / Town / Castle presentation
Meta Crystal display
Tutorial Status display
```

Status:

```text
IMPLEMENTED
RUNTIME CONFIRMED
UNCOMMITTED
```

Do not discard this work casually.

---

# 7. Source-of-Truth — Game Design

For Game Design questions use:

```text
1. Latest explicit Game Designer decision in active discussion
2. Latest TMTB_GAME_DESIGN_CONTEXT
3. Latest TMTB_GAME_DESIGN_DECISIONS
4. Latest relevant domain-specific supporting handoff
5. Historical / legacy design docs
```

Do not let current old prototype behaviour override current design intent.

---

# 8. Source-of-Truth — Prototype Implementation

For prototype implementation questions use:

```text
1. Actual source code / data
2. Confirmed runtime testing
3. Latest TMTB_CURRENT_STATE
4. Latest Architecture / State & Data handoff
5. Historical implementation docs
```

Do not let design intent create a false claim that a feature already exists in source.

---

# 9. Active Core Documentation Set

The current portable active set consists of approximately 10 files.

## Canonical / Evergreen — `docs/`

```text
docs/
├─ TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
├─ TMTB_GAME_DESIGN_CONTEXT.md
└─ TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

## Handoff Snapshot — `docs/handoff-v3.0/`

```text
docs/handoff-v3.0/
├─ README.md
├─ TMTB_PROJECT_CONTEXT_v3.0.md
├─ TMTB_CHAT_HANDOFF_v3.0.md
├─ TMTB_CURRENT_STATE_v3.0.md
├─ TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
├─ TMTB_STATE_AND_DATA_MODEL_v3.0.md
└─ TMTB_PROGRESS_AND_BACKLOG_v3.0.md
```

Together:

```text
3 docs-level authority files
+
7 handoff-v3.0 files
=
10-file active portable set
```

---

# 10. Recommended Read Order

For a new chat / assistant:

```text
1. README.md
2. TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
3. TMTB_PROJECT_CONTEXT_v3.0.md
4. TMTB_GAME_DESIGN_CONTEXT.md
5. TMTB_GAME_DESIGN_DECISIONS_v3.1.md
6. TMTB_CURRENT_STATE_v3.0.md
7. TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
8. TMTB_STATE_AND_DATA_MODEL_v3.0.md
9. TMTB_PROGRESS_AND_BACKLOG_v3.0.md
10. TMTB_CHAT_HANDOFF_v3.0.md
```

Reason:

```text
package entry
→ governance
→ project identity
→ intended design
→ actual implementation
→ implementation structure/state
→ current progress
→ exact collaboration/resume instructions
```

Supporting handoffs should be read only when their detailed reasoning is needed.

---

# 11. Document Responsibilities

## `TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md`

Role:

```text
documentation / recovery governance
```

Defines:

- version semantics;
- canonical/supporting/historical classes;
- source-of-truth split;
- audit-first workflow;
- migration matrix workflow;
- portable project-source rules;
- recovery testing.

---

## `TMTB_PROJECT_CONTEXT_v3.0.md`

Role:

```text
project-level context
```

Explains:

- what TMTB is;
- why the prototype exists;
- Game Designer / programmer / UIUX / art roles;
- Main Game vs Prototype;
- academic/validation context;
- current high-level project checkpoint.

---

## `TMTB_GAME_DESIGN_CONTEXT.md`

Role:

```text
full canonical living Game Design
```

Use for:

- gameplay intent;
- system interaction;
- tutorial design;
- run/progression;
- enemy rules;
- balancing framework;
- current design statuses/open space.

Current version:

```text
3.1
```

---

## `TMTB_GAME_DESIGN_DECISIONS_v3.1.md`

Role:

```text
compact canonical design snapshot
```

Use for quick lookup of:

- current rules;
- LOCKED / TENTATIVE / OPEN;
- superseded rules;
- prototype-only candidates;
- current design checkpoint.

---

## `TMTB_CURRENT_STATE_v3.0.md`

Role:

```text
actual prototype behaviour
```

Answers:

> What does the prototype really do now?

This is the primary implementation snapshot.

---

## `TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md`

Role:

```text
actual repository/module architecture
```

Use for:

- tracked tree;
- file responsibilities;
- dependency relationships;
- deployment architecture;
- current implementation pressure points.

---

## `TMTB_STATE_AND_DATA_MODEL_v3.0.md`

Role:

```text
actual current runtime/data model
```

Use for:

- application state;
- profile/run/battle state;
- battle unit state;
- persistence;
- JSON definitions;
- current vs future state separation.

---

## `TMTB_PROGRESS_AND_BACKLOG_v3.0.md`

Role:

```text
current checkpoint / roadmap / backlog
```

Use for:

- DONE / IN PROGRESS / NEXT;
- migration domains;
- reclassified v2.5 backlog;
- design blockers;
- technical/deferred work.

---

## `TMTB_CHAT_HANDOFF_v3.0.md`

Role:

```text
assistant collaboration / resume manual
```

Use for:

- exact working method;
- coding workflow;
- test/regression expectations;
- file-upload expectations;
- supporting handoff usage;
- exact resume point.

---

# 12. Supporting Handoffs

Recommended supporting folder:

```text
docs/supporting/
```

Current important supporting files:

```text
TMTB_ENEMY_DESIGN_DISCUSSION_HANDOFF_2026-08-09_v4.md

TMTB_TUTORIAL_DESIGN_CORRECTED_HANDOFF_2026-08-11_v1.md

TMTB_PROTOTYPE_RECOVERY_REPOSITORY_AUDIT_HANDOFF_2026-08-11_v1.md
```

They are:

```text
SUPPORTING
NON-CANONICAL
```

unless an explicit current decision has already been migrated into canonical docs.

---

# 13. When to Load Supporting Files

## Enemy Handoff

Load when working deeply on:

- Target Rule;
- Movement Rule;
- enemy candidates;
- Intent reasoning;
- special-enemy alternatives;
- enemy grammar trade-offs.

---

## Tutorial Handoff

Load when working deeply on:

- T1/T2/T3 reasoning;
- exact Phase candidate;
- Offset Courtyard;
- Practice Target;
- Status/Charge alternatives;
- Wave tutorial variants;
- Prototype Validation Scope details.

---

## Repository Audit Handoff

Load when needing:

- V0 audit provenance;
- Git delta;
- source findings;
- runtime confirmation;
- exact old-vs-new implementation evidence.

---

# 14. Historical Documentation

Preserve:

```text
docs/handoff-v2.5/
```

as:

```text
HISTORICAL SNAPSHOT
```

Do not retroactively rewrite it.

Also historical:

```text
root TMTB_CURRENT_STATE.md
root TMTB_PROJECT_CONTEXT_v1.0.md
TMTB_PROTOTYPE_V2_5_TODO_AND_DEFERRED_BACKLOG.md
older tutorial recovery/verbatim archives
```

Important:

```text
historical
≠
current authority
```

---

# 15. Current Tutorial Recovery State

Do not restart Tutorial design from zero.

Current status:

```text
T1 — Learning Curriculum
DONE as corrected working curriculum

T2 — Phase Architecture
DONE as corrected working architecture

T3 — Tutorial Stage Design
WORKING DESIGN COMPLETE ENOUGH FOR PROTOTYPE VALIDATION PLANNING
```

Current strong working direction:

```text
one continuous Tutorial Stage
```

Seven-Phase structure remains:

```text
TENTATIVE
```

Exact first Status teaching source remains:

```text
OPEN
```

---

# 16. Current Enemy Recovery State

Do not restart Enemy Intent design from zero.

Current baseline:

```text
sequential enemy activation
max 1 Movement + 1 Action
Spawn Order baseline
next enemy reads updated board
Current Target / Intent from actual enemy rules
Dynamic Intent when battle state changes
```

Orange / Purple / Blue remain:

```text
TENTATIVE SPECIAL ENEMY CANDIDATES
```

not locked Region 1 roster.

---

# 17. Current Tutorial / Prototype Representation

Current representation classes:

```text
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

Important distinction:

```text
FLOW SIMULATION completion
≠
mechanic mastery
```

For real systems, learning evidence may use:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

For Flow Simulation:

```text
FLOW EXPOSURE
→ SIMULATED COMPLETION
```

---

# 18. Current Migration / Validation Domains

After documentation recovery closes:

```text
V0 — Recovery / Baseline Audit
DONE

V1 — Player Turn Economy
PLANNED

V2 — Player Action Commitment
PLANNED

V3 — Tactical Space
PLANNED

V4 — Enemy Readability & Execution
PLANNED

V5 — Core Tutorial Flow
PLANNED

V6 — Status & Temporal Threat
PLANNED

V7 — Wave
PLANNED

V8 — Full Tutorial Integration
PLANNED
```

Important:

```text
V1–V8
=
migration / validation domains
```

not one-patch coding checkpoints.

---

# 19. Current First Migration Domain

The first planned migration domain is:

```text
V1 — Player Turn Economy
```

But the first exact coding checkpoint is deliberately **not yet locked**.

Before coding:

```text
audit actual current relevant source
→ choose smallest coherent checkpoint
→ implement
→ test
→ regression test
→ wait for Game Designer confirmation
```

---

# 20. Coding Workflow

The user is the Game Designer, not the primary programmer.

Technical assistance must be incremental.

Use:

```text
Understand target
→ audit current files
→ identify smallest change
→ give exact path/edit
→ run
→ expected vs actual
→ regression
→ wait for confirmation
```

For edits, provide:

```text
TARGET LOCAL PATH
FIND
CHANGE TYPE
COPY-READY CODE
EXPECTED RESULT
TEST
REGRESSION TEST
```

Do not assume success until user confirms.

---

# 21. Important Current Regression Risks

When migration begins, remember:

## Player action model is cross-coupled

Current old model uses:

```text
turnState
hasActed
movement
targeting
damage
selection
automatic Enemy Phase transition
HUD
```

---

## `damageLogic.js` is shared

Current attack resolver applies old Exhaustion side effects to attacker.

Changing player semantics may affect Enemy attacks.

---

## Enemy phase has partial sequential state-awareness

Current:

```text
Move-all
→ Attack-all
```

but later enemies do read updated board state within each pass.

Preserve useful determinism when migrating to full sequential activation.

---

## Current Cover implementation is reusable

Do not destroy:

```text
Cover geometry
Full Cover targetability
0-damage effect
edge/corner behaviour
```

while adding distinct LOS.

---

# 22. Current Git / Repository Context

Project root:

```text
C:\Datas\prototype-tmtb
```

Current known audit baseline:

```text
branch: main
HEAD: cbd33ac Add GitHub Pages deployment
tag: v2.5-full-loop-core
origin/main aligned at audit
```

Post-v2.5 committed work includes:

- canonical Game Design Context;
- production data-loading fix;
- GitHub Pages deployment.

Local source working tree also contains confirmed uncommitted Run Overview work.

Before destructive Git commands:

```text
audit git status + diff first
```

---

# 23. Documentation Save Locations

## Canonical / Evergreen

```text
C:\Datas\prototype-tmtb\docs\TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md

C:\Datas\prototype-tmtb\docs\TMTB_GAME_DESIGN_CONTEXT.md

C:\Datas\prototype-tmtb\docs\TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

## Handoff v3.0

```text
C:\Datas\prototype-tmtb\docs\handoff-v3.0\README.md

C:\Datas\prototype-tmtb\docs\handoff-v3.0\TMTB_PROJECT_CONTEXT_v3.0.md

C:\Datas\prototype-tmtb\docs\handoff-v3.0\TMTB_CHAT_HANDOFF_v3.0.md

C:\Datas\prototype-tmtb\docs\handoff-v3.0\TMTB_CURRENT_STATE_v3.0.md

C:\Datas\prototype-tmtb\docs\handoff-v3.0\TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md

C:\Datas\prototype-tmtb\docs\handoff-v3.0\TMTB_STATE_AND_DATA_MODEL_v3.0.md

C:\Datas\prototype-tmtb\docs\handoff-v3.0\TMTB_PROGRESS_AND_BACKLOG_v3.0.md
```

## Supporting

Recommended:

```text
C:\Datas\prototype-tmtb\docs\supporting\
```

---

# 24. Current Documentation Package Status

All 10 core files are authored.

First cross-document consistency audit:

```text
DONE
```

Cross-document fix pass:

```text
DONE for the generated package
```

New-chat recovery simulation:

```text
PASSED
```

Current next:

```text
Game Designer review
→ local repository placement
→ Git status / diff verification
```

Package is not yet considered fully finalized because local repository placement, Game Designer review, Git verification, and commit/push remain unconfirmed.

---

# 25. Next Documentation Steps

```text
1. Run new-chat recovery simulation
2. Fix any recovery ambiguity
3. Game Designer review
4. Verify all target local paths
5. Save/replace final files in local repository
6. Check Git status / diff
7. Run relevant repository/app sanity test
8. Commit deliberately
9. Push
```

Do not claim commit/push until user confirms.

---

# 26. Exact Project Resume Point After Package Finalization

After documentation package finalization:

```text
Prototype migration planning
```

Start conceptually from:

```text
V1 — Player Turn Economy
```

Then:

```text
audit exact relevant current source
→ select smallest technical checkpoint
```

Do **not** start by implementing all of Shared AP / StartGrid / End Turn in one broad patch without source-driven sequencing.

---

# 27. New-Chat Recovery Prompt

A useful short prompt for a new chat:

```text
Ini adalah active project-source package terbaru TMTB.

Saya adalah Game Designer utama dan bukan programmer utama.

Baca file sesuai authority/read-order di README dan Maintenance Protocol.

Penting:
- bedakan Game Design Intent dari Prototype Implementation Truth;
- latest explicit decision saya memiliki design authority tertinggi;
- actual source/data/runtime memiliki implementation authority tertinggi;
- jangan menganggap Game Design v3.1 sudah implemented;
- jangan mengulang Shared AP, Enemy Intent, atau Tutorial T1–T3 dari nol;
- gunakan supporting handoff hanya bila detail domain diperlukan;
- sebelum coding, audit actual relevant source files;
- lakukan satu perubahan kecil dan terverifikasi;
- beri exact path, exact edit, expected result, test, dan regression test;
- tunggu konfirmasi saya sebelum lanjut.
```

---

# 28. Recovery Success Criteria

This package succeeds if a new assistant can recover:

```text
what TMTB is
what the prototype is for
current Game Design v3.1
current prototype baseline
design-vs-implementation gaps
Shared AP direction
Enemy Intent direction
Tutorial T1–T3
Flow Simulation
Run Overview uncommitted work
current migration domains
document authority
supporting/historical roles
exact resume point
```

without requiring the Game Designer to manually reconstruct the old conversations.

---

# 29. Important Final Rules

> **Game Design documents show what should exist.**

> **Actual source/data/runtime show what currently exists.**

> **Do not silently reconcile conflicts between them.**

> **Prototype simplification is allowed; misleading validation is not.**

> **Supporting handoffs preserve detail but do not automatically become canon.**

> **Historical documents remain preserved but do not override current truth.**

> **Audit first. Document second.**

> **Before coding: actual files first.**

> **One small verified change is better than one large unverified change.**

---

# 30. Current Package Summary

```text
GAME
TMTB / BeCan

TARGET
Unity 3D Turn-Based Tactics

CANONICAL GAME DESIGN
v3.1

HANDOFF PACKAGE
v3.0

PROTOTYPE IMPLEMENTATION
Post-v2.5 / Pre-v3 Combat Migration
Verified 11 August 2026

CURRENT DOCUMENTATION WORK
Core package authored
Cross-document audit DONE
Cross-document fix pass DONE
New-chat recovery simulation PASSED
Local placement / Git review NEXT

CURRENT SOURCE HIGHLIGHT
Run Overview / Shop relocation
implemented + runtime confirmed + uncommitted

NEXT AFTER DOCUMENTATION
Prototype migration planning

FIRST PLANNED DOMAIN
V1 — Player Turn Economy
```

---

**End of README**
