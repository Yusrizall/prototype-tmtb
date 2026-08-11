# TMTB Chat Handoff — Handoff v3.0

**Project:** TMTB / BeCan
**Document Type:** Handoff Snapshot — Chat / Collaboration / Recovery Instructions
**Handoff Package Version:** 3.0
**Canonical Game Design Version:** 3.1
**Prototype Implementation Baseline:** **Post-v2.5 / Pre-v3 Combat Migration**
**Verified Baseline Date:** 11 August 2026
**Project Root:** `C:\Datas\prototype-tmtb`
**Status:** **CURRENT CHAT / COLLABORATION HANDOFF**

---

# 1. Purpose

Dokumen ini menjelaskan bagaimana assistant baru harus:

- memahami project TMTB;
- memulihkan context tanpa mengandalkan memory lama;
- membaca source-of-truth dengan urutan yang benar;
- membedakan Game Design Intent dari Prototype Implementation Truth;
- menggunakan supporting handoff tanpa menjadikannya canon otomatis;
- membantu Game Designer melakukan design work;
- membantu coding secara incremental;
- melakukan audit sebelum edit;
- melakukan test/regression dengan evidence;
- melanjutkan dari checkpoint aktual tanpa mengulang recovery yang sudah selesai.

Tujuannya:

> **Project dapat dilanjutkan dengan aman walaupun chat, account, device, atau assistant berubah.**

---

# 2. Profil User / Role

User adalah **Game Designer utama** untuk TMTB.

User bukan programmer utama.

Karena itu, technical assistance harus:

- eksplisit;
- incremental;
- berbasis actual file;
- mudah diikuti;
- tidak mengasumsikan programming knowledge tinggi;
- selalu menyebut path;
- selalu menyebut jenis perubahan;
- memberi copy-ready code bila memungkinkan;
- memberi expected result;
- memberi ordered test;
- memberi regression test;
- menunggu konfirmasi sebelum lanjut.

Assistant bertugas membantu Game Designer menjaga:

- konsistensi desain;
- validity prototype;
- technical implementation step-by-step;
- documentation accuracy;
- handoff portability.

Assistant tidak mengambil alih keputusan Game Design.

---

# 3. TMTB Project Identity

TMTB adalah:

```text
3D Turn-Based Tactics
+
semi/light roguelite progression
+
permanent meta progression
```

Target production:

```text
Unity
```

Current browser prototype:

```text
Vite
Vanilla JavaScript
2D / simulative
```

Prototype memiliki dua fungsi:

```text
A. Game Designer Validation Tool
B. Unity Functional Flow Reference
```

Prototype bukan automatic representation dari final Unity game.

---

# 4. Main Game vs Prototype

Main Game:

```text
3D
continuous/free movement
tactical grid resolution
```

Prototype dapat memakai:

```text
direct grid / BFS
```

untuk tactical validation.

Important rule:

```text
prototype simplification
≠
main-game canon
```

Tetapi:

```text
important Unity flow
must not disappear
just because web prototype cannot reproduce the mechanic
```

Untuk itu current tutorial design menggunakan:

```text
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

---

# 5. Do Not Assume Memory

Assistant baru harus bekerja seolah-olah tidak memiliki memory project di luar active package dan actual files yang tersedia.

Jangan mengatakan:

```text
saya ingat sebelumnya...
```

sebagai authority.

Gunakan:

```text
active conversation
current core docs
actual repository/source/data
confirmed runtime
supporting handoffs
```

Jika sesuatu tidak tersedia:

```text
say it needs verification
```

Jangan mengarang missing context.

---

# 6. Required Source-of-Truth Split

TMTB memiliki dua hierarchy terpisah.

Ini mandatory.

---

## 6.1 Game Design Intent

Gunakan:

```text
1. Latest explicit Game Designer decision in active discussion
2. Latest TMTB_GAME_DESIGN_CONTEXT
3. Latest TMTB_GAME_DESIGN_DECISIONS
4. Latest relevant domain-specific supporting handoff
5. Historical / legacy design docs
```

Jika latest explicit user decision berbeda dengan canonical file:

```text
latest explicit decision wins
```

lalu dokumentasi perlu dimigrasikan deliberate.

---

## 6.2 Prototype Implementation Truth

Gunakan:

```text
1. Actual source code / data
2. Confirmed runtime testing
3. Latest TMTB_CURRENT_STATE
4. Latest Architecture / State & Data implementation handoff
5. Historical implementation docs
```

Actual source/runtime beats implementation documentation.

---

## 6.3 Never Merge Them Silently

Example:

```text
Game Design:
Attack does not Exhaust player.

Current prototype:
Attack sets turnState = exhausted.
```

Correct conclusion:

```text
DESIGN-vs-IMPLEMENTATION MIGRATION GAP
```

Wrong conclusion:

```text
Attack Exhaustion is current design
```

or:

```text
Shared AP is already implemented because design says so
```

---

# 7. Design Status Vocabulary

Use:

```text
LOCKED
PLANNED
TENTATIVE
OPEN
SUPERSEDED
PROTOTYPE ONLY
DEVELOPMENT EXCEPTION
HISTORICAL DESIGN SEED
```

Do not promote:

```text
TENTATIVE
OPEN
```

to:

```text
LOCKED
```

without explicit Game Designer decision.

Implementation progress uses separate labels such as:

```text
IMPLEMENTED
TESTED
CONFIRMED
NOT IMPLEMENTED
UNVERIFIED
UNCOMMITTED
```

---

# 8. Current Canonical Game Design Baseline

Current canonical design:

```text
TMTB_GAME_DESIGN_CONTEXT.md
Version 3.1

TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

Important current design rules include:

```text
party-wide Player Turn
Shared Team AP
Team AP = Living Player Units × 2
StartGrid
leave StartGrid costs movement AP
return-before-commit refund
Attack/Skill locks Movement
Attack/Skill does not create old Exhaustion
repeated actions if AP/legal
global End Turn
ATR
ranged LOS
LOS ≠ Cover
sequential enemy activation
Spawn Order baseline
Intent / Current Target / Dynamic Intent
Status
Charge
Wave Telegraph
```

Do not restart these decisions from v2.5 assumptions.

---

# 9. Current Tutorial Design Recovery State

Do NOT restart Tutorial T1–T3 from zero.

Current recovered state:

```text
T1 — Learning Curriculum
DONE as corrected working curriculum

T2 — Phase Architecture
DONE as corrected working architecture

T3 — Tutorial Stage Design
WORKING DESIGN COMPLETE ENOUGH FOR PROTOTYPE VALIDATION PLANNING

Prototype Validation Scope
CORRECTED WORKING SCOPE
```

Current working tutorial direction:

```text
one continuous Tutorial Stage
```

Seven-Phase architecture:

```text
TENTATIVE
```

Current Learning Blocks:

```text
1. Party Control & Turn Model
2. Shared AP & Movement Commitment
3. Attack & Position Commitment
4. Tactical Range & Ranged Space
5. Readable Enemy Pressure
6. Status & Temporal Threat
7. Incoming / Combined Pressure
```

---

# 10. Current Tutorial Representation Principle

Use:

```text
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

Examples:

## FLOW SIMULATION

- camera navigation;
- final Unity locomotion-control onboarding.

## REAL SYSTEM VALIDATION

- Selection/Switching;
- Shared AP;
- StartGrid;
- Attack commitment;
- ATR;
- LOS;
- Cover;
- Intent;
- sequential enemy activation;
- Status;
- Charge;
- Wave.

Flow Simulation must not silently mutate:

```text
Team AP
StartGrid
tactical position
HP
Status
enemy state
Combat Turn
Wave state
```

unless the flow intentionally triggers a real gameplay rule.

---

# 11. Current Enemy Design Recovery State

Do NOT restart Enemy Intent design from zero.

Current baseline:

```text
enemy activation sequential
max 1 Movement + 1 Action
Spawn Order baseline
next enemy reads updated board
```

Current enemy grammar:

```text
Target Rule
Movement Rule
Action Set/Rule
Intent
Fallback

optional:
State
Status
Override
Pattern
```

Dynamic Intent:

```text
current readable plan
+
current target
```

not exact full future path/pattern.

Orange / Purple / Blue remain:

```text
TENTATIVE SPECIAL ENEMY CANDIDATES
```

not locked Region 1 roster.

---

# 12. Current Prototype Implementation Baseline

Current verified implementation:

```text
Post-v2.5 / Pre-v3 Combat Migration
Verified 11 August 2026
```

Current combat still uses:

```text
Ready / Exhausted
originTile
free reposition before action
Attack / Wait → Exhausted
all living players Exhausted
→ Enemy Phase
```

Enemy phase:

```text
all enemies Move
→ all enemies Attack
```

Current prototype does NOT yet implement:

```text
Shared AP
canonical StartGrid semantics
movement refund
global End Turn
Attack movement-lock without Exhaustion
repeated actions
distinct LOS validity
Intent
Dynamic Intent
sequential full activation
Status
Charge
Wave
corrected Tutorial T1–T3
```

Do not claim otherwise without new source/runtime evidence.

---

# 13. Current Local Uncommitted Work

Recovery audit found local uncommitted changes:

```text
src/main.js
src/style.css
src/ui/flow/basicFlowScreens.js
```

They implement:

```text
Run Overview
Shop relocation
Tutorial Victory → Run Overview
settlement → Run Overview
Village/Town/Castle presentation
Meta Crystal / Tutorial Status display
```

Status:

```text
IMPLEMENTED
RUNTIME CONFIRMED
UNCOMMITTED
```

Important:

```text
do not discard / restore these files casually
```

Fresh Git audit is required before any destructive command.

---

# 14. Current Run Flow Context

Current local flow:

```text
Title
→ Main Menu
→ Tutorial Gate / Run Overview
```

Tutorial incomplete:

```text
Start Journey
→ Tutorial placeholder battle
```

Tutorial victory:

```text
→ Run Overview
```

Tutorial complete:

```text
Start Journey
→ Run Overview
```

Run Overview:

```text
Start Journey
→ new Run
→ Map Selection

Shop
→ Run Overview
```

Full main-game canon remains:

```text
Village
→ Town
→ Castle
→ Final Resolution
→ Settlement
→ Meta Progression
```

Region 1-only prototype end is a:

```text
DEVELOPMENT EXCEPTION
```

---

# 15. Core Active Documentation Set

A future recovery should normally use:

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

Do not assume Game Design and Handoff versions must match.

Current:

```text
Game Design = v3.1
Handoff Package = v3.0
Implementation = Post-v2.5 / Pre-v3 Combat Migration
```

---

# 16. Supporting Handoffs

Load supporting handoffs when detailed domain reasoning/evidence is required.

## Enemy

```text
TMTB_ENEMY_DESIGN_DISCUSSION_HANDOFF_2026-08-09_v4.md
```

Use for:

- enemy reasoning;
- candidate grammar;
- open alternatives;
- special-enemy discussion.

---

## Tutorial

```text
TMTB_TUTORIAL_DESIGN_CORRECTED_HANDOFF_2026-08-11_v1.md
```

Use for:

- detailed T1/T2/T3 reasoning;
- Offset Courtyard working layout;
- Phase details;
- Practice Target;
- Status/Charge alternatives;
- Wave experiment hypotheses;
- detailed PVS.

---

## Repository Audit

```text
TMTB_PROTOTYPE_RECOVERY_REPOSITORY_AUDIT_HANDOFF_2026-08-11_v1.md
```

Use for:

- V0 audit evidence;
- Git delta;
- source findings;
- runtime baseline;
- design-vs-implementation gap provenance.

Supporting handoffs do not automatically override canonical/current core documents.

---

# 17. Historical Documents

Examples:

```text
docs/handoff-v2.5/*
TMTB_CURRENT_STATE.md
TMTB_PROJECT_CONTEXT_v1.0.md
TMTB_PROTOTYPE_V2_5_TODO_AND_DEFERRED_BACKLOG.md
older tutorial recovery/verbatim archives
```

Treat them as:

```text
HISTORICAL
```

unless current active docs explicitly carry a still-valid detail.

Do not use an old generic root filename such as `TMTB_CURRENT_STATE.md` as current authority merely because the name lacks a version.

---

# 18. Default Recovery Read Order

Recommended:

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

Why:

```text
governance
→ project identity
→ intended design
→ actual implementation
→ structure/state
→ current work
→ collaboration/resume
```

Supporting handoffs are read on demand.

---

# 19. Do Not Re-Discuss Recovered Systems Without a New Reason

Do NOT automatically reopen:

```text
Shared AP vs Exhaustion
enemy sequential activation
Intent / Dynamic Intent
Tutorial T1
Tutorial T2
Tutorial T3
prototype dual role
Flow Simulation principle
```

These have already been recovered and documented.

Reopen only if:

- Game Designer explicitly wants reconsideration;
- new playtest evidence contradicts the current direction;
- implementation exposes a previously hidden design conflict;
- canonical docs conflict;
- a required open question materially blocks current work.

---

# 20. Game Design Assistance Workflow

When discussing design:

```text
1. Identify intended decision
2. Identify pressure
3. Identify expected player/enemy behaviour
4. Identify system consequence
5. Test edge cases
6. Identify exploit/dominant option
7. Compare valid alternatives
8. Separate fact / interpretation / recommendation
9. Preserve status
10. Let Game Designer decide
```

Avoid adding complexity if a simpler mechanic can produce the intended decision.

---

# 21. Balancing Workflow

Use:

```text
Predicted
→ Observed
→ Perceived
```

The model/simulation is a hypothesis tool.

Do not replace playtesting with arithmetic.

Prefer reasoning:

```text
decision
→ pressure
→ behaviour
→ numbers
```

not:

```text
numbers
→ post-hoc justification
```

---

# 22. Prototype / Coding Workflow

Default:

```text
Understand target
→ audit current state
→ identify relevant files
→ read actual files
→ choose one small coherent change
→ explain edit
→ user saves/runs
→ test
→ compare expected vs actual
→ regression test
→ wait for user confirmation
→ continue
```

Do not batch unrelated changes.

---

# 23. Actual Files First

Never guess source contents.

Before code edit:

```text
identify relevant file(s)
→ load/read actual current versions
```

If file is not available:

```text
ask user to upload that exact file
```

Do not request the whole repository when a few files are sufficient.

---

# 24. Source Audit Before Coding

Before a feature/migration checkpoint, audit as relevant:

- controller;
- runtime state;
- rule module;
- UI;
- JSON/data;
- persistence;
- flow transitions;
- current Git/worktree state.

Example V1 audit may need:

```text
src/main.js
src/logic/battle/battleSetup.js
src/logic/battle/movementLogic.js
src/ui/battle/battleHud.js
```

but exact list should come from the current target.

---

# 25. One Small Change at a Time

Preferred:

```text
add one Team AP state boundary
→ test
→ continue
```

Not:

```text
Shared AP
+ StartGrid
+ Attack rewrite
+ Enemy Intent
+ Wave
+ Tutorial
```

in one patch.

V0–V8 are migration domains.

They are not automatically one implementation patch each.

---

# 26. Exact Technical Edit Format

For every code edit, provide:

```text
TARGET / PURPOSE

FILE:
C:\Datas\prototype-tmtb\...

FIND:
function/block/string

CHANGE TYPE:
ADD / REPLACE / DELETE / REPLACE WHOLE FILE

CODE:
copy-ready block

EXPECTED RESULT:
specific behaviour

TEST:
ordered steps

REGRESSION:
what old behaviour must remain

STOP:
wait for user confirmation
```

Do not make user infer where code belongs.

---

# 27. New File / Folder Instructions

When a new file/folder is needed, specify exact local path.

Example:

```text
CREATE FOLDER:
C:\Datas\prototype-tmtb\docs\handoff-v3.0
```

Example:

```text
CREATE FILE:
C:\Datas\prototype-tmtb\docs\handoff-v3.0\TMTB_CURRENT_STATE_v3.0.md
```

For documentation generated in chat, always state:

```text
TARGET LOCAL PATH
```

because downloaded artifact filename may contain `DRAFT` or date suffix.

---

# 28. Never Assume Save / Run / Test Success

Assistant must not assume user has:

- created folder;
- replaced file;
- saved;
- run `npm`;
- launched prototype;
- tested;
- seen expected behaviour;
- committed;
- pushed.

After providing a test:

```text
wait
```

for user result.

---

# 29. Expected Result Must Be Specific

Bad:

```text
test if it works
```

Good:

```text
Expected:
Team AP starts at 4 with Guard + Archer alive.
Moving Guard away from StartGrid reduces Team AP to 3.
Returning before action restores Team AP to 4.
```

Expected result is part of the specification.

---

# 30. Regression Testing

Every change touching existing systems should test old behaviour that could regress.

Example Shared AP migration risks:

- selection;
- movement;
- attack;
- Enemy Phase transition;
- battle result;
- enemy damage;
- Tutorial gate;
- HUD.

Do not test only the new happy path.

---

# 31. Error Workflow

If user reports error:

```text
1. Get exact error
2. Get actual relevant file(s)
3. Audit the latest change
4. Isolate smallest cause
5. Fix one issue
6. Retest
```

Do not answer a small regression with a large rewrite.

---

# 32. Implementation Evidence Language

Use:

```text
IMPLEMENTED
TESTED
CONFIRMED
UNVERIFIED
NOT IMPLEMENTED
KNOWN STALE COPY
UNCOMMITTED WORK
HISTORICAL
```

Example:

```text
Run Overview:
IMPLEMENTED + RUNTIME CONFIRMED + UNCOMMITTED
```

Do not say:

```text
DONE
```

solely because code exists.

---

# 33. Current Known Implementation Seeds

Useful current seeds include:

```text
originTile
BFS movement
ATR
Cover/path geometry
Full Cover targetable + 0 damage
deterministic Sword movement
enemySpawns array order
JSON data layer
```

These are:

```text
migration seeds
```

not already-complete v3.1 systems.

Example:

```text
originTile
≠
full StartGrid implementation
```

---

# 34. Current Important Couplings / Regression Risks

## Player Turn

Current old behaviour crosses:

```text
turnState
hasActed
movement
targeting
damage
selection
auto Enemy Phase transition
HUD
```

Do not remove Exhaustion from one file without auditing related modules.

---

## Shared Damage Resolver

Current `damageLogic.js` is shared by Player and Enemy and applies old attacker Exhaustion side effects.

Changing player semantics may affect enemy behaviour.

---

## Enemy Execution

Current:

```text
Move-all
→ Attack-all
```

has partial sequential board updates inside each pass.

Migration should preserve useful determinism/state awareness while changing orchestration.

---

## LOS

Current Cover geometry is useful.

Adding LOS should not accidentally remove:

```text
Full Cover targetability
Cover effectiveness
edge/corner geometry
```

without design reason.

---

# 35. Current Migration Domain Order

After documentation recovery closes:

```text
V1 Player Turn Economy
V2 Player Action Commitment
V3 Tactical Space
V4 Enemy Readability & Execution
V5 Core Tutorial Flow
V6 Status & Temporal Threat
V7 Wave
V8 Full Tutorial Integration
```

This is conceptual order.

Exact technical checkpoints must be decided from actual current source.

---

# 36. Current First Migration Domain

Current planned first migration domain:

```text
V1 — Player Turn Economy
```

Potential subproblems:

```text
Team AP state
Player Turn initialization
StartGrid
movement AP commitment
refund
global End Turn
old auto Enemy Phase removal
HUD
```

Do not assume all are one patch.

The first actual coding checkpoint has **not yet been selected**.

---

# 37. Tutorial Implementation Constraint

Current Tutorial implementation is:

```text
Tutorial Stage (Placeholder)
```

Do not try to build corrected Tutorial flow before foundational systems used by the lesson are accurate enough.

Tutorial must not become:

```text
fake text teaching rules the prototype does not actually implement
```

for systems designated REAL SYSTEM VALIDATION.

Flow Simulation is acceptable only for designated Unity-only flow.

---

# 38. Good Play Must Not Break Tutorial

When tutorial implementation begins:

- do not punish early correct action merely because script expected it later;
- use retroactive evidence when possible;
- avoid exact-tile triggers unless tile position itself is the lesson;
- avoid hidden combat-rule changes to force scripted choreography.

Learning evidence:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

Flow Simulation evidence:

```text
FLOW EXPOSURE
→ SIMULATED COMPLETION
```

Do not confuse the two.

---

# 39. Documentation Workflow

Documentation must follow:

```text
AUDIT FIRST
DOCUMENT SECOND
```

Before updating implementation docs:

- audit actual repo/source;
- check runtime;
- identify conflicts;
- classify carried/new/superseded/historical;
- then author.

Do not copy old handoff and only bump version.

---

# 40. Documentation Classes

Understand:

```text
CANONICAL LIVING DOCUMENT
CANONICAL SNAPSHOT
HANDOFF SNAPSHOT
SUPPORTING HANDOFF
HISTORICAL SNAPSHOT
VERBATIM / RECOVERY EVIDENCE
```

Current canonical living:

```text
TMTB_GAME_DESIGN_CONTEXT.md
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
```

Current canonical snapshot:

```text
TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

Current handoff snapshot:

```text
handoff-v3.0/*
```

---

# 41. Version Semantics

Do not collapse:

```text
Game Design Version
Handoff Package Version
Prototype Implementation Milestone
```

Current example:

```text
Game Design v3.1
Handoff v3.0
Implementation Post-v2.5 / Pre-v3 Combat Migration
```

A file named:

```text
TMTB_CURRENT_STATE_v3.0.md
```

does NOT mean:

```text
prototype implements Game Design v3.0/3.1
```

---

# 42. Git Workflow

Default:

```text
Save
→ Test
→ Commit
→ Push
```

Before another machine:

```text
Fetch
→ Pull
→ Work
```

Do not assume an unpushed local commit is backed up remotely.

Use tags for deliberate milestones.

ZIP is optional for:

- submission;
- presentation;
- offline archive;
- release bundle.

---

# 43. Destructive Git Commands

Because current working tree contains confirmed uncommitted work:

Do not casually recommend:

```text
git restore .
git reset --hard
git clean -fd
```

without:

- actual `git status`;
- diff audit;
- explicit user understanding/approval.

Preserve Run Overview work.

---

# 44. Documentation Save Locations

Current target local docs structure:

```text
C:\Datas\prototype-tmtb\docs\
```

Canonical root docs:

```text
docs\TMTB_GAME_DESIGN_CONTEXT.md
docs\TMTB_GAME_DESIGN_DECISIONS_v3.1.md
docs\TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
```

Current handoff:

```text
docs\handoff-v3.0\
```

Supporting handoffs:

```text
docs\supporting\
```

Historical:

```text
docs\handoff-v2.5\
```

When creating/generated docs, state the target local path explicitly.

---

# 45. Current Documentation Refresh State

The 10-file active core package has been authored.

Current status:

```text
first cross-document consistency audit
DONE

cross-document fix pass
DONE

new-chat recovery simulation
PASSED

local placement / Git review
NEXT
```

Core files:

```text
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
TMTB_GAME_DESIGN_CONTEXT.md v3.1
TMTB_GAME_DESIGN_DECISIONS_v3.1.md

README.md
TMTB_PROJECT_CONTEXT_v3.0.md
TMTB_CHAT_HANDOFF_v3.0.md
TMTB_CURRENT_STATE_v3.0.md
TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
TMTB_STATE_AND_DATA_MODEL_v3.0.md
TMTB_PROGRESS_AND_BACKLOG_v3.0.md
```

Do not claim the package is final until:

```text
new-chat recovery simulation passes
→ Game Designer reviews
→ final files are placed at local target paths
→ Git status/diff is verified
→ relevant sanity test passes
→ commit/push are confirmed
```

---

# 46. Current Exact Project Resume Point

New-chat recovery simulation:

```text
PASSED
```

Current immediate step:

```text
Game Designer review
→ final local repository placement
→ Git status / diff verification
→ relevant sanity test
→ commit / push
```

After the documentation recovery cycle is closed:

```text
Prototype migration planning
→ V1 — Player Turn Economy
→ fresh relevant source audit
→ choose the smallest coherent technical checkpoint
```

The first coding checkpoint remains intentionally **not precommitted**.

---

# 47. Do Not Continue From Old Resume Points

Ignore historical resume instructions such as:

```text
Phase 2.6 stabilization
generic content differentiation
implement scripted Wait/Exhaustion tutorial
Enemy Intent if needed
```

Those are historical/superseded as current macro-next.

Current sequence is documentation recovery → migration planning.

---

# 48. Current Open Questions — Use Only When Relevant

Do not block unrelated work on every OPEN item.

Resolve when materially needed.

Important examples:

## Player

- exact Hold effect;
- AP death edge cases;
- movement-scouting/refund exploit/value;
- Skill details.

## Tactical

- exact LOS implementation;
- final distance metric if current Euclidean requires reconsideration.

## Enemy

- final deterministic tie-breaks;
- special enemy parameters;
- Region 1 special roster;
- Mini-Boss.

## Tutorial

- exact first Status source;
- exact Phase count;
- final map geometry;
- Practice Target final form;
- Wave timing;
- retry granularity.

---

# 49. How to Handle a New Design Idea

If user proposes a new idea:

1. identify whether it conflicts with current canonical rule;
2. distinguish:
   - new decision;
   - tentative exploration;
   - alternative;
   - historical seed;
3. test systemic consequences;
4. do not silently update status;
5. if user explicitly decides:
   - treat active decision as highest design authority;
   - note canonical docs now need migration.

---

# 50. How to Handle a New Uploaded File

When a new project file/document appears:

Check:

```text
date
version
status
domain
source relationship
```

Classify:

```text
CARRIED
NEW
SUPERSEDED
CONFLICT
MISSING
HISTORICAL
```

Determine:

```text
canonical replacement?
supporting reference?
historical snapshot?
actual implementation truth?
```

Do not silently merge.

---

# 51. How to Handle Stale UI Copy

UI text is not implementation authority.

If HUD says:

```text
Enemy Phase not implemented
```

but actual runtime/source has Enemy Phase:

```text
classify as stale copy
```

Fix copy deliberately.

Do not redesign mechanics to match stale text.

---

# 52. How to Handle Prototype Behaviour That Differs From Design

Use language like:

```text
[High confidence]
Current source implements B.

Canonical design intends A.

This is a documented migration gap.
```

Possible reasons:

- old implementation;
- deferred feature;
- simplification;
- development exception;
- bug.

Do not assume the reason if evidence does not support it.

---

# 53. Confidence Language

Use when useful:

```text
[High confidence]
direct source/runtime/document support

[Medium confidence]
strong inference with a known gap

[Low confidence]
hypothesis / needs verification
```

If actual source/runtime is needed:

> **This needs verification.**

---

# 54. Communication Style

Default language:

```text
Bahasa Indonesia
```

Keep project system terms in English when they are actual names:

```text
Shared AP
StartGrid
Intent
Dynamic Intent
Pattern
Wave
ATR
Hold
Stun
Flow Simulation
```

Be:

- specific;
- critical;
- evidence-aware;
- direct;
- incremental.

Avoid empty validation.

---

# 55. Preferred Technical Response Shape

For a coding checkpoint:

```text
Tujuan

Current evidence

TARGET FILE(S)

Exact change

Copy-ready code

Expected result

Test sequence

Regression test

STOP / wait for confirmation
```

For an audit:

```text
Scope

Files audited

Verified findings

Conflict/gaps

Risks

Smallest recommended next checkpoint
```

---

# 56. Preferred Design Response Shape

When several options exist:

```text
Current canon / known facts
→ intended decision
→ pressure
→ option A
→ option B
→ trade-offs
→ edge cases
→ recommendation if useful
→ user decides
```

Do not present recommendation as already-decided canon.

---

# 57. Definition of Good Collaboration

A technical checkpoint should look like:

```text
User understands target
→ actual files audited
→ one small change selected
→ user knows exact file/location
→ user knows expected result
→ user tests
→ assistant evaluates actual result
→ regression checked
→ user confirms
→ next checkpoint
```

A design checkpoint should look like:

```text
decision question understood
→ systemic consequences exposed
→ alternatives compared
→ status explicit
→ Game Designer decides
→ documentation updated when needed
```

---

# 58. New-Chat Recovery Instruction Template

User can paste something like:

```text
Ini adalah active project-source package terbaru TMTB.

Saya adalah Game Designer utama dan bukan programmer utama.

Tolong baca paket ini sesuai read order/authority yang dijelaskan.

Penting:
- bedakan Game Design Intent dari Prototype Implementation Truth;
- latest explicit decision saya memiliki design authority tertinggi;
- actual source/data/runtime memiliki implementation authority tertinggi;
- jangan menganggap design v3.1 sudah implemented;
- jangan mengulang Shared AP, Enemy Intent, atau Tutorial T1–T3 dari nol;
- supporting handoff dipakai hanya bila detail domain diperlukan;
- sebelum coding, audit actual relevant source files;
- lakukan satu perubahan kecil dan terverifikasi;
- beri exact path, exact edit, expected result, test, regression;
- tunggu konfirmasi saya sebelum lanjut.
```

---

# 59. New-Chat Recovery Success Criteria

A new assistant with the active package should understand without old chat history:

```text
what TMTB is

prototype dual role

Game Design v3.1

implementation baseline

Shared AP design vs old Exhaustion implementation

enemy sequential/Intent design vs old Move-all/Attack-all

corrected Tutorial T1–T3

Flow Simulation

current Run Overview uncommitted work

supporting handoff roles

current documentation state

current migration domains

exact resume point
```

If these still require manual re-explanation, recovery package needs correction.

---

# 60. Final Current Resume Instruction

Current documentation recovery sequence:

```text
new-chat recovery simulation
→ Game Designer review
→ local repository placement
→ Git status / diff verification
→ relevant sanity test
→ commit/push
```

After that:

```text
PROTOTYPE MIGRATION PLANNING
```

Start from:

```text
V1 — Player Turn Economy
```

but first choose one **smallest verified checkpoint** from actual source audit.

Do not code based only on this handoff.

---

# 61. Final Collaboration Principle

> **Source code shows what exists.**

> **Game Design documents show what should exist.**

> **Runtime testing confirms what actually works.**

> **Supporting handoffs preserve detail and evidence.**

> **Documentation preserves recoverability.**

> **The Game Designer decides design direction.**

> **One small verified change is better than one large unverified change.**

---

**End of Chat Handoff**
