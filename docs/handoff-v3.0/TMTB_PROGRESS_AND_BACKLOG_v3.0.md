# TMTB Progress & Backlog — Handoff v3.0

**Project:** TMTB / BeCan Prototype
**Document Type:** Handoff Snapshot — Progress, Roadmap, Migration Domains, and Deferred Backlog
**Handoff Package Version:** 3.0
**Game Design Reference:** `TMTB_GAME_DESIGN_CONTEXT.md` v3.1 / `TMTB_GAME_DESIGN_DECISIONS_v3.1.md`
**Prototype Implementation Baseline:** **Post-v2.5 / Pre-v3 Combat Migration**
**Verified Baseline Date:** 11 August 2026
**Last Updated:** 11 August 2026
**Status:** **CURRENT PROGRESS / BACKLOG SNAPSHOT — RECOVERY SIMULATION PASSED / LOCAL PLACEMENT NEXT**

---

# 1. Purpose

Dokumen ini menjawab:

- apa yang sudah selesai;
- apa yang benar-benar sudah diuji / dikonfirmasi;
- apa yang sedang dikerjakan;
- apa yang menjadi next project work;
- apa yang sudah disupersede;
- apa yang masih planned / deferred;
- apa yang merupakan current design blocker;
- bagaimana historical v2.5 backlog dimigrasikan;
- bagaimana V0–V8 digunakan sebagai migration / validation domains.

Dokumen ini tidak boleh dipakai untuk mengklaim bahwa design v3.1 sudah implemented.

Implementation truth tetap mengikuti:

```text
actual source/data
→ confirmed runtime
→ Current State
→ Architecture / State & Data
```

---

# 2. Status Vocabulary

Progress/backlog menggunakan:

```text
DONE
IN PROGRESS
NEXT
PLANNED
DEFERRED
OPTIONAL
OPEN
BLOCKED
SUPERSEDED
HISTORICAL
REFRAMED
```

## DONE

Pekerjaan telah cukup selesai untuk checkpoint yang dimaksud dan evidence-nya tersedia.

## IN PROGRESS

Sedang aktif dikerjakan.

## NEXT

Pekerjaan berikutnya setelah current work selesai.

## PLANNED

Intended, tetapi belum menjadi current implementation task.

## DEFERRED

Sengaja ditunda.

## OPTIONAL

Tidak wajib untuk current validation scope.

## OPEN

Belum diputuskan.

## BLOCKED

Tidak boleh lanjut sebelum dependency tertentu resolved.

## SUPERSEDED

Pekerjaan/rule lama tidak lagi sesuai current direction.

## HISTORICAL

Milestone/backlog lama yang dipertahankan sebagai provenance.

## REFRAMED

Intent lama masih berguna, tetapi bentuk/tujuan/urutan pengerjaan telah berubah.

---

# 3. Current Project Position

Current project position:

```text
Game-design recovery / migration
DONE

Enemy design recovery
DONE enough for current canon + supporting handoff

Tutorial T1–T3 recovery / correction
DONE as working design

Prototype Validation Scope correction
DONE as working scope

Repository / source / runtime recovery audit
DONE

Documentation inventory
DONE

Detailed documentation migration matrix
DONE

Core documentation refresh
IN PROGRESS

Prototype combat migration
NOT STARTED
```

Current prototype implementation remains:

```text
Post-v2.5 / Pre-v3 Combat Migration
```

---

# 4. Current Macro Work Sequence

Current approved macro sequence:

```text
Recover current design
→ audit actual repository/source/runtime
→ preserve supporting audit evidence
→ inventory/migrate documentation
→ refresh core project-source package
→ cross-document consistency audit
→ new-chat recovery simulation
→ save/review
→ commit/push
→ prototype migration planning
→ smallest verified implementation checkpoints
```

Important:

```text
documentation refresh
precedes
combat migration coding
```

for the current recovery cycle.

---

# 5. Completed Design Recovery

## 5.1 Game Design Migration to v3.0

Status:

```text
DONE
```

Recovered/migrated systems include:

- party-wide Player Turn;
- Shared Team AP;
- StartGrid;
- movement commitment/refund;
- Attack/Skill position commitment;
- repeated action;
- global End Turn;
- Hold direction;
- Player Stun;
- ATR;
- LOS vs Cover distinction;
- enemy Intent grammar;
- Dynamic Intent;
- sequential enemy activation;
- Spawn Order baseline;
- Wave / Telegraph;
- run/progression/economy framework;
- difficulty/balancing framework.

---

## 5.2 Enemy Design Recovery

Status:

```text
DONE ENOUGH FOR CURRENT CANON / SUPPORTING HANDOFF
```

Preserved in:

```text
TMTB_ENEMY_DESIGN_DISCUSSION_HANDOFF_2026-08-09_v4.md
```

Important current state:

- baseline enemy activation is sequential;
- maximum baseline activation = 1 Movement + 1 Action;
- Current Intent must reflect actual readable plan;
- Current Target comes from actual enemy Target Rule;
- next enemy reads updated board;
- baseline internal order = Spawn Order;
- Orange/Purple/Blue remain **TENTATIVE SPECIAL ENEMY CANDIDATES**;
- they are not locked Region 1 roster.

---

# 6. Completed Tutorial Recovery

## 6.1 T1 — Learning Curriculum

Status:

```text
DONE AS CORRECTED WORKING CURRICULUM
```

Current dependency includes:

```text
Camera / Control
→ Selection
→ Switching
→ Movement

Player / Enemy Turn
→ Shared AP
→ StartGrid
→ Movement Commitment
→ Refund
→ End Turn

Attack
→ Position Commitment
→ Repeated Action
→ Targeting
→ Damage
→ ATR

Archer / Ranged
→ LOS
→ Cover

Intent
→ Current Target
→ Dynamic Intent
→ threat response

Status
→ Charge
→ special-enemy interaction
→ Wave Telegraph
```

Hold detailed lesson remains deferred.

Skill detailed lesson remains planned/content-open.

---

## 6.2 T2 — Learning Blocks / Phase Architecture

Status:

```text
DONE AS CORRECTED WORKING ARCHITECTURE
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

Current evidence model:

```text
REAL SYSTEM:
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER

FLOW SIMULATION:
FLOW EXPOSURE
→ SIMULATED COMPLETION
```

---

## 6.3 T3 — Tutorial Stage Design

Status:

```text
WORKING DESIGN COMPLETE ENOUGH FOR PROTOTYPE VALIDATION PLANNING
```

Current strong working direction:

```text
one continuous Tutorial Stage
```

Seven-Phase candidate remains:

```text
TENTATIVE
```

Current layout family:

```text
Offset Courtyard
```

Status:

```text
PRIMARY WORKING LAYOUT FAMILY
NOT LOCKED
```

Practice Target:

```text
PROTOTYPE ONLY / TUTORIAL TRAINING OBJECT CANDIDATE
```

---

## 6.4 Prototype Representation Types

Status:

```text
DONE AS CURRENT WORKING PRINCIPLE
```

Current classes:

```text
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

Important Unity onboarding steps such as camera/control may remain in the web prototype through Flow Simulation.

Flow Simulation must not silently mutate authoritative combat state.

---

# 7. Completed Prototype Recovery Audit

Status:

```text
V0 COMPLETE
```

Supporting evidence:

```text
TMTB_PROTOTYPE_RECOVERY_REPOSITORY_AUDIT_HANDOFF_2026-08-11_v1.md
```

Completed audit domains:

```text
V0.1A Repository structure
V0.1B Git/history
V0.1C Uncommitted working-tree classification

V0.2 Controller/source
V0.2 Battle state
V0.2 Movement/action
V0.2 Targeting/Cover
V0.2 Enemy logic
V0.2 Data
V0.2 HUD

V0.3 Runtime baseline
```

No further broad source audit is required before documentation refresh.

Future source inspection should be driven by a specific implementation/documentation question.

---

# 8. Verified Current Prototype Baseline

## Current implementation

Status:

```text
IMPLEMENTED / VERIFIED BASELINE
```

Current combat still uses:

```text
per-unit Ready / Exhausted
originTile
free reposition before action
Attack / Wait → Exhausted
all living players Exhausted → Enemy Phase
all enemies Move
→ all enemies Attack
```

Current tactical systems include:

```text
BFS movement
ATR
Cover/path geometry
basic damage
Sword enemy
battle objective/result
```

Current implementation does NOT yet contain:

```text
Shared Team AP
canonical StartGrid semantics
movement AP refund
Attack/Skill Movement Lock without Exhaustion
repeated actions
global End Turn
distinct LOS validity
Intent
Dynamic Intent
sequential full activation
explicit Spawn Order state
Status
Charge
Wave Telegraph
corrected Tutorial flow
```

---

# 9. Post-v2.5 Current Flow Work

## Run Overview / Shop relocation

Status:

```text
IMPLEMENTED
RUNTIME CONFIRMED
UNCOMMITTED
```

Current local working tree adds:

```text
Run Overview
Shop access from Run Overview
Tutorial Victory → Run Overview
Run settlement → Run Overview
future Village / Town / Castle presentation
Meta Crystal display
Tutorial Status display
```

Relevant local files:

```text
src/main.js
src/style.css
src/ui/flow/basicFlowScreens.js
```

Priority:

```text
PRESERVE
```

Do not discard these changes during future combat migration.

---

# 10. Deployment Progress

Status:

```text
DONE / CURRENT COMMITTED REPOSITORY STATE
```

Implemented after v2.5 tag:

- Vite deployment base;
- `BASE_URL`-aware data loading;
- GitHub Pages workflow.

Current committed HEAD at recovery audit:

```text
cbd33ac Add GitHub Pages deployment
```

---

# 11. Documentation Refresh Progress

Current Handoff Package target:

```text
v3.0
```

Canonical Game Design:

```text
v3.1
```

Prototype implementation baseline:

```text
Post-v2.5 / Pre-v3 Combat Migration
```

All 10 active core files have now been authored.

## Core File Status

```text
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
AUTHORED / AUDIT-FIXED
pending new-chat recovery simulation

TMTB_GAME_DESIGN_CONTEXT.md v3.1
AUTHORED / AUDIT-FIXED
pending new-chat recovery simulation / local replacement

TMTB_GAME_DESIGN_DECISIONS_v3.1.md
AUTHORED / AUDIT-FIXED
pending new-chat recovery simulation

TMTB_CURRENT_STATE_v3.0.md
AUTHORED / AUDIT-FIXED

TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
AUTHORED / AUDIT-FIXED

TMTB_STATE_AND_DATA_MODEL_v3.0.md
AUTHORED / AUDIT-FIXED

TMTB_PROGRESS_AND_BACKLOG_v3.0.md
AUTHORED / AUDIT-FIXED

TMTB_PROJECT_CONTEXT_v3.0.md
AUTHORED / AUDIT-FIXED

TMTB_CHAT_HANDOFF_v3.0.md
AUTHORED / AUDIT-FIXED

README.md
AUTHORED / AUDIT-FIXED
```

First cross-document consistency audit:

```text
DONE
```

Cross-document fix pass:

```text
DONE
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

---

# 12. Current Immediate Work

## IN PROGRESS

```text
Close the documentation recovery cycle
```

Ordered next work:

```text
1. Run new-chat recovery simulation
2. Fix any recovery failure
3. Game Designer review
4. Save/replace final files at exact local project paths
5. Verify Git status / diff
6. Run relevant repository/app sanity test
7. Commit deliberately
8. Push
9. Begin prototype migration planning
```

Do not call the package final or Git-safe before the user confirms local placement/review and Git state.

---

# 13. Exact Next Work After Documentation

After the documentation package is secure:

```text
Prototype migration planning
```

Not:

```text
blindly implement all v3.1 systems at once
```

Workflow:

```text
choose one migration domain
→ audit exact relevant current source
→ identify smallest coherent checkpoint
→ edit
→ run/test
→ compare expected vs actual
→ regression test
→ wait for confirmation
→ continue
```

---

# 14. V0–V8 Migration / Validation Domains

V0–V8 are **domains**, not automatic one-patch coding checkpoints.

---

## V0 — Recovery / Baseline Audit

Status:

```text
DONE
```

Covered:

- repository;
- Git;
- uncommitted work;
- current battle;
- current UI;
- current data;
- runtime baseline;
- design-vs-implementation gap.

---

## V1 — Player Turn Economy

Status:

```text
PLANNED
```

Design targets:

```text
party-wide Player Turn
Shared Team AP
Team AP = Living Player Units × 2
StartGrid
movement AP commitment
movement refund
global End Turn
```

Likely current modules:

```text
main.js
battleSetup.js
movementLogic.js
battleHud.js
```

Actual implementation checkpoints must be split after fresh source audit.

---

## V2 — Player Action Commitment

Status:

```text
PLANNED
```

Design targets:

```text
Attack/Skill no longer Exhaust player
Attack/Skill locks Movement
repeated actions if AP/legal
cross-unit Shared AP use
old Wait removed/replaced from active model
Hold not implemented until rule sufficiently ready
```

Likely current pressure:

```text
damageLogic.js
main.js
movementLogic.js
atrLogic.js
battleHud.js
```

---

## V3 — Tactical Space

Status:

```text
PLANNED
```

Design targets:

```text
ATR
distinct LOS
Cover
Target Validity
Action Validity
Action Effectiveness
```

Current reusable seeds:

```text
Euclidean ATR
path geometry
O30/O70/Full Cover
Full Cover targetable + 0 damage
```

Current blocker:

```text
distinct LOS missing
```

---

## V4 — Enemy Readability & Execution

Status:

```text
PLANNED
```

Design targets:

```text
Target Rule
Movement Rule
Action Rule
Fallback
Current Target
Current Intent
Dynamic Intent
Spawn Order
sequential full activation
max 1 Movement + 1 Action baseline
```

Current implementation mismatch:

```text
all enemies Move
→ all enemies Attack
```

---

## V5 — Core Tutorial Flow

Status:

```text
PLANNED
```

Expected scope:

- Control / Party Orientation;
- Flow Simulation for important Unity-only controls;
- real Selection/Switching;
- Shared AP / StartGrid lesson;
- Attack / position commitment;
- basic enemy / static Intent;
- ATR/ranged foundation.

Implementation should not proceed before V1–V4 rules used by the lesson are accurate enough.

---

## V6 — Status & Temporal Threat

Status:

```text
PLANNED
```

Design targets:

```text
Status concept
Stun candidate
Charge
multi-activation temporal threat
```

Material design blocker:

```text
Exact first Status teaching source = OPEN
```

This does not block V1–V5.

---

## V7 — Wave

Status:

```text
PLANNED
```

Design targets:

```text
Wave Telegraph
reserved spawn position
preparation window
Spawn
new enemy normal Intent
```

Open:

```text
exact spawn-to-first-normal-activation lifecycle
```

W1/W2 remain prototype validation variants.

---

## V8 — Full Tutorial Integration

Status:

```text
PLANNED
```

Integrates:

```text
continuous Tutorial Stage
learning evidence
Flow Simulation
real combat systems
Status/Charge
Wave
combined pressure
Tutorial Victory
```

Not a requirement to implement all remaining main-game systems.

---

# 15. Historical v2.5 Roadmap Status

The old roadmap sequence:

```text
Phase 2.6 Stabilization
→ Phase 3.1 Content Differentiation
→ Phase 3.2 Gameplay Depth
→ Phase 3.3 Roguelite Expansion
→ Phase 3.4 Balance and Polish
```

Status:

```text
HISTORICAL / SUPERSEDED AS CURRENT MACRO ROADMAP
```

Reason:

- major combat design changed after v2.5;
- Enemy Intent architecture changed;
- Tutorial design was recovered/redesigned;
- prototype audit revealed a large design-vs-implementation migration gap;
- current work must migrate core validation systems before treating generic content expansion as next priority.

Useful items from that roadmap are preserved below with updated classification.

---

# 16. Historical Phase 2.6 — Stabilization

Old status:

```text
NEXT
```

Current status:

```text
REFRAMED / PLANNED SUPPORTING QUALITY WORK
NOT CURRENT MACRO-NEXT
```

Still useful items:

- full-loop regression;
- scene-state validation;
- double-input protection;
- reward double-apply protection;
- Crystal conversion idempotency;
- purchase idempotency;
- timer cleanup;
- profile fallback;
- data-load error handling;
- stale copy cleanup.

Current rule:

> Perform hardening/regression when relevant to a migration checkpoint or before a milestone/demo, rather than delaying all design migration behind one large generic stabilization phase.

---

# 17. Full-Loop Regression Backlog

Status:

```text
PLANNED / MILESTONE REGRESSION
```

Useful regression suite retained:

- Reset Data;
- Tutorial gate;
- Tutorial victory/defeat;
- returning-player flow;
- branch preview/commitment;
- sibling blocking;
- Stage progression;
- reward selection;
- completion settlement;
- defeat settlement;
- conversion idempotency;
- Shop access;
- affordable purchase;
- insufficient Meta Crystal;
- maximum level;
- double purchase input;
- permanent-upgrade persistence;
- upgrade applied to next run-stage battle;
- Tutorial ignores permanent upgrades where intended;
- Reset Data clears persistent progression.

### Current audit note

The 11 August recovery run was a smoke/baseline test, not this complete regression suite.

---

# 18. State / Flow Hardening Backlog

Status:

```text
PLANNED
```

Retain:

- validate scene transitions;
- prevent duplicate reward selection;
- prevent duplicate settlement/conversion;
- prevent duplicate Shop purchase;
- validate `runState` cleanup;
- validate `battleState` cleanup;
- validate `battleIntroNodeId` cleanup;
- ensure enemy timers are cancelled safely;
- audit fast keyboard input;
- audit fast mouse input;
- audit mixed mouse/keyboard duplicate input;
- validate data-action selectors;
- profile normalization/fallback;
- invalid/missing data error presentation.

Current Run Overview adds new transition paths that should be included in future regression.

---

# 19. Stale UI / Copy Cleanup

Status:

```text
PLANNED — SMALL SAFE CLEANUP
```

Known current stale items:

```text
Battle HUD:
old text says Enemy Phase not implemented

Tutorial Victory:
old text may say Continue to Map Selection
while current local route is Run Overview
```

Old Post-Run Shop stale permanent-upgrade copy appears partly addressed by current uncommitted flow patch.

Rule:

```text
verify actual string/source before editing
```

Do not combine copy cleanup with a large combat refactor unless necessary.

---

# 20. Historical Presentation Checklist

Status:

```text
HISTORICAL / CONDITIONAL
```

The v2.5 presentation-preparation checklist remains useful if another academic demo/presentation occurs.

It is no longer the current macro development phase.

Do not assume:

```text
presentation still pending
```

without current user confirmation.

---

# 21. Unique Map / Encounter Content

Status:

```text
PLANNED / DEFERRED UNTIL VALIDATION NEEDS REQUIRE IT
```

Current implementation limitation:

```text
all run stages still rely on baseline Stage 1 map/encounter
```

Still-useful backlog:

- stage/node-specific map data;
- stage/node-specific encounter data;
- route-specific obstacle/Cover/spawn composition;
- Stage 4 unique Mini-Boss encounter;
- link run node → encounter/map;
- remove Stage 1 hard-coding.

### Current design nuance

Do not build generic unique maps merely for content quantity.

Prioritize map/encounter content that answers a current validation question.

Example:

```text
Tutorial Tactical Space geometry
```

may deserve a specialized map before generic Stage 2/3 variety.

---

# 22. Stage 4 Mini-Boss

Main-game design status:

```text
LOCKED DIRECTION:
Region 1 Stage 4 is a Mini-Boss climax
```

Implementation status:

```text
NOT IMPLEMENTED AS UNIQUE MINI-BOSS CONTENT
```

Open:

```text
Mini-Boss identity
Mini-Boss abilities/pattern
exact Mini-Boss encounter
```

Historical task “make Stage 4 feel like a mini-boss” is therefore:

```text
PLANNED
```

but content is design-blocked until identity/grammar is sufficiently resolved.

---

# 23. Enemy Variety

Old backlog included generic:

```text
ranged enemy
tank/defensive enemy
fast enemy
mini-boss
```

Current classification:

```text
REFRAMED
```

Why:

Current enemy design now emphasizes behaviour grammar/pressure before role labels.

Current tentative special candidates:

```text
Orange
Purple
Blue
```

Status:

```text
TENTATIVE
NOT LOCKED REGION 1 ROSTER
```

Sword remains baseline simple enemy.

Generic old ranged/tank/fast ideas remain:

```text
HISTORICAL DESIGN SEEDS
```

unless later explicitly adopted.

---

# 24. Difficulty Implementation

Old v2.5 implementation:

```text
easy / normal / hard
primarily presentation labels
```

Current status:

```text
PLANNED / DESIGN FRAMEWORK EXISTS / IMPLEMENTATION DEFERRED
```

Current design does **not** reduce difficulty to:

```text
Easy = weaker enemies
Hard = stronger enemies
```

Difficulty is contextual and can come from:

- composition;
- position;
- timing;
- terrain;
- Wave timing;
- enemy grammar;
- party state;
- attrition;
- resource pressure.

Current balancing framework uses:

```text
Predicted
→ Observed
→ Perceived
```

and working concepts such as Stage Pressure / Current Player Capability.

---

# 25. Objective Variety

Current implementation:

```text
eliminate_all only
```

Status:

```text
PLANNED / DEFERRED
```

Main-game design supports broader objective space including candidates such as:

- survive;
- defend/protect;
- reach/escape;
- priority target;
- Mini-Boss defeat.

Exact objective library remains open.

Tutorial Task / Objective / Wave must remain separate concepts.

---

# 26. Active Reward Effects

Current implementation:

```text
reward selection exists
reward effects inactive
```

Status:

```text
PLANNED
```

Historical v2.5 stat-reward list is not automatically final reward design.

Current main-game reward system is broader and supports within-run adaptation.

Open:

- reward occurrence;
- rarity;
- repetition;
- stacking;
- caps;
- interaction with Shared AP / Status / Hold / positioning.

Do not activate old reward effects blindly before combat migration stabilizes the systems those rewards modify.

---

# 27. Skill System

Current implementation:

```text
Skill menu option exists
normal resolver inactive
```

Design status:

```text
PLANNED
exact Skills / cost / cooldown / repeat restrictions = OPEN
```

Historical backlog item:

```text
"Skill harus membuat unit exhausted"
```

Status:

```text
SUPERSEDED
```

Current design:

```text
Attack/Skill
→ Movement locked
→ does not automatically Exhaust unit
```

Detailed Skill tutorial remains deferred until individual Skills are defined.

---

# 28. Scripted Tutorial Backlog

Old backlog:

```text
movement
select unit
action menu
basic attack
ATR/Cover
Wait/Exhaustion
Player Phase/Enemy Phase
restrict input
```

Current status:

```text
REFRAMED INTO T1–T3 + V5–V8
```

Carried concepts:

- progressive onboarding;
- selection;
- movement;
- Attack;
- ATR;
- Cover;
- Player/Enemy Turn.

Superseded:

```text
Wait lesson
Exhaustion mental model
old one-unit activation model
```

Added current requirements:

- Shared AP;
- StartGrid/refund;
- global End Turn;
- position commitment;
- repeated action;
- LOS;
- Intent;
- Current Target;
- Dynamic Intent;
- Status;
- Charge;
- Wave Telegraph;
- Flow Simulation for Unity-only control steps;
- learning evidence.

---

# 29. HP Carry / Attrition

Main-game design status:

```text
PLANNED / LOCKED DESIGN DIRECTION
```

Current intent:

```text
current HP persists between encounters within a run
```

Current implementation:

```text
full heal / fresh HP each battle
```

Status:

```text
PLANNED MIGRATION / NOT CURRENT PRIORITY
```

Open:

- recovery rules;
- defeated-unit consequence;
- rest/healing;
- between-region recovery;
- Max HP change interactions.

---

# 30. Branch Consequences

Current implementation:

```text
branch selection / blocking exists
```

Deeper consequences:

```text
PLANNED
```

Potential future differentiation:

- encounter pressure;
- reward opportunity;
- event consequences;
- route modifiers;
- later node influence.

Current design principle:

```text
higher risk
→ greater potential reward opportunity
```

Exact mapping remains open.

---

# 31. Event / Non-Battle Nodes

Status:

```text
PLANNED / DEFERRED
```

Possible design space:

- Rest;
- Treasure;
- risk/reward Event;
- In-Run Shop;
- Story/dialogue.

Exact node taxonomy/composition is not locked.

Do not confuse permanent progression Shop with future In-Run Shop.

---

# 32. Active Run Persistence

Current implementation:

```text
NOT IMPLEMENTED
```

Status:

```text
PLANNED TECHNICAL / UX WORK
```

Useful historical tasks:

- persist runState;
- persist route status;
- persist Run Crystal;
- persist rewards;
- add Continue Run;
- add Abandon Run;
- save-version migration;
- corrupt-save fallback.

Open:

```text
whether active Battle State should also be persisted
```

This should be scheduled after current core migration priorities unless project requirements change.

---

# 33. Run History / Run Notes

Prototype design status:

```text
PLANNED
```

Main-game status:

```text
OPEN / UIUX REVIEW CANDIDATE
```

Potential information:

- run result;
- route;
- rewards;
- Crystal;
- furthest progress;
- failure location;
- duration/date where relevant.

Separate from internal telemetry.

---

# 34. Death Marker

Prototype design status:

```text
PLANNED
```

Main-game status:

```text
OPEN / UIUX REVIEW CANDIDATE
```

This item was not prominent in the old v2.5 backlog but is preserved in current canonical design.

---

# 35. Battle Feedback / Readability

Status:

```text
PLANNED
```

Still-useful backlog:

- clearer damage feedback;
- defeated indicator;
- movement/attack visual feedback;
- attacker/target highlight;
- Cover icon;
- damage prediction;
- invalid-target reason.

Historical item:

```text
"Enemy intent bila diperlukan"
```

Status:

```text
SUPERSEDED
```

Current:

```text
Enemy Intent / Current Target
= REQUIRED CORE READABILITY SYSTEM
```

Intent UI becomes part of V4, not optional polish.

---

# 36. Map / Flow UI

Status:

```text
PLANNED
```

Still-useful items:

- clearer node status;
- legend;
- party summary;
- reward history;
- transition feedback;
- narrow-screen layout.

Current local work already adds:

```text
Run Overview
```

Future changes should preserve its confirmed navigation unless deliberately redesigned.

---

# 37. Accessibility / Input

Status:

```text
PLANNED QUALITY WORK
```

Historical backlog remains useful:

- keyboard navigation/focus audit;
- ARIA labels;
- non-color-only status cues;
- mouse support;
- touch support where useful.

Final Unity input/accessibility work remains separate from browser-prototype mechanics.

---

# 38. Secondary Menu Items

Current prototype has limited/disabled menu items such as:

```text
Settings
Credits
Quit / equivalent
Run Notes
```

Status:

```text
DEFERRED / CONDITIONAL
```

Settings/audio should wait until relevant systems exist.

Credits may become important for academic/release presentation.

Browser Quit remains low priority.

---

# 39. Battle Balancing

Status:

```text
ONGOING VALIDATION DOMAIN
```

Current numbers are hypotheses.

Evaluate with:

```text
Predicted
→ Observed
→ Perceived
```

Current known teaching concern:

```text
Archer vs Sword:
O70 and Full Cover can both produce 0 damage
```

This can reduce Cover readability in current content.

Future balancing should include:

- Shared AP economy;
- player action frequency;
- StartGrid/refund value;
- enemy sequential activation;
- Dynamic Intent;
- LOS/Cover readability;
- Status/Charge pressure;
- Wave timing;
- tutorial cognitive load.

---

# 40. Progression Economy

Status:

```text
PLANNED / BALANCING
```

Current prototype historical values:

```text
upgrade costs:
30 / 60 / 100 / 150

Run Crystal conversion:
100%

per-level:
Max HP +2
ATK +1
DEF +1
```

Current design classifications:

```text
Run Crystal → Meta Crystal at full settlement
LOCKED CONCEPT

Region 1 settlement in prototype
DEVELOPMENT EXCEPTION

100% conversion
TENTATIVE BALANCE VALUE
```

Open:

- defeat penalty;
- completion bonus;
- final conversion rate;
- permanent-shop presentation;
- permanent upgrade categories;
- economy pacing.

---

# 41. Data-Driven Battle Setup

Status:

```text
PLANNED / IMPORTANT TECHNICAL FOUNDATION
```

Current limitation:

```text
battle setup uses stage1Map / stage1Encounter broadly
```

Useful tasks:

- node/stage selects map/encounter;
- battle setup accepts explicit battle definitions;
- validate unit IDs;
- validate spawn labels;
- remove Stage 1 assumptions.

Priority should be chosen based on upcoming validation needs.

For example, Tutorial map data may be the first justified new encounter data rather than generic Stage 2 content.

---

# 42. `main.js` Organization

Historical backlog:

```text
split main.js
scene controller
input controller
settlement controller
Shop controller
constants
remove magic strings
```

Current status:

```text
DEFERRED / REFACTOR ONLY WHEN MIGRATION PRESSURE JUSTIFIES IT
```

Recovery audit confirms `main.js` is overloaded.

However:

```text
broad refactor from assumptions
= NOT recommended
```

Use incremental extraction only when a concrete migration checkpoint benefits.

---

# 43. CSS Organization

Current:

```text
global / monolithic style.css
```

Status:

```text
DEFERRED
```

Run Overview styles currently live there.

Reorganization is not a design blocker.

---

# 44. Legacy / Likely Unused Files

Potential starter residue includes:

```text
src/counter.js
some Vite starter assets
```

Status:

```text
DEFERRED CLEANUP
```

Rule:

```text
verify imports first
```

Do not delete based only on documentation.

---

# 45. Automated Tests

Status:

```text
DEFERRED BUT RECOMMENDED
```

Historical useful targets:

- damage formula;
- ATR;
- Cover/path;
- BFS movement;
- node progression/branch blocking;
- reward selection;
- conversion idempotency;
- purchase validation;
- permanent-upgrade application;
- profile normalization;
- objective resolver.

New high-value tests after migration may include:

- Team AP generation;
- StartGrid spend/refund;
- action Movement Lock;
- repeated actions;
- global End Turn;
- LOS validity;
- sequential enemy activation;
- Intent target refresh;
- Spawn Order;
- Wave reservation.

Do not build a large test suite before the rule under test is sufficiently defined/implemented.

---

# 46. Telemetry

Current design status:

```text
EVALUATION TOOL / DEFERRED
```

Potential lightweight tutorial/system events can support validation.

Do not confuse:

```text
internal telemetry
```

with:

```text
Run History / player-facing notes
```

Current prototype has no required full analytics stack.

---

# 47. Auto-Simulation

Status:

```text
OPTIONAL FUTURE GAME DESIGNER EVALUATION TOOL
```

Purpose:

- hypothesis testing;
- comparative balance exploration;
- regression support.

It must not replace human playtesting/perceived difficulty evaluation.

---

# 48. Historical Optional Long-Term List — Reclassification

The old v2.5 backlog grouped several items as optional long-term.

That classification is no longer uniformly valid.

| Old Item | Current Classification |
|---|---|
| Audio / music | OPTIONAL / LATER |
| Portrait/dialogue | OPTIONAL / CONTENT/UI dependent |
| Story progression | PLANNED main-game content, low prototype priority |
| Multiple regions | **CORE MAIN-GAME STRUCTURE**; prototype Region 1-only is DEVELOPMENT EXCEPTION |
| More playable units | PLANNED / content-open |
| Equipment system | OPEN / optional unless later adopted |
| Status effects | **NO LONGER OPTIONAL** — required advanced combat/tutorial concept |
| Area-of-effect attacks | OPEN / Skill content space |
| Height/elevation | OPEN / Unity/tactical future design |
| Destructible Cover | OPEN / optional future |
| Procedural map generation | OPTIONAL / not current priority |
| Boss mechanics | PLANNED design space; Region 1 Mini-Boss climax locked direction |
| Achievement | OPTIONAL |
| Save slot/export-import | OPTIONAL / UX/technical future |
| Playtest analytics | DEFERRED evaluation tooling |

This prevents historical “optional” labels from overriding current canon.

---

# 49. Current Design Blockers Relevant to Migration

The following OPEN items should be resolved only when they materially block their validation domain.

## Combat

- exact Normal Attack AP cost if candidate 1 AP changes;
- exact Skill system;
- exact Hold effect;
- Hold terminal/repeatability;
- Hold movement-lock interaction;
- AP handling when contributing unit dies mid-turn;
- AP=0 edge cases;
- movement-scouting/refund exploit/value;
- exact Status duration/tick convention.

## Enemy

- exact deterministic final targeting/tile tie-break rules;
- exact Status vocabulary;
- Orange/Purple/Blue parameters;
- final Region 1 special-enemy inclusion;
- Mini-Boss design.

## Tactical Space

- exact LOS implementation;
- exact combat-distance metric if current Euclidean implementation is reconsidered.

## Wave

- exact spawn-to-first-normal-activation lifecycle;
- emergency spawn fallback;
- Wave Victory Relevance details.

## Tutorial

- final Phase count;
- exact map/geometry;
- first Status source;
- Practice Target final identity;
- Stun timing;
- final Blue inclusion;
- Wave information density;
- AP-sensitive choreography;
- retry granularity;
- final Objective/UI wording;
- Flow Simulation amount.

These do not all need resolution before V1 starts.

---

# 50. Current Run / Progression Open Questions

Preserve:

- recovery rules;
- rest-node behaviour;
- defeated-unit persistence;
- between-region recovery;
- resume unfinished run;
- Town/Castle internal structure;
- reward occurrence;
- reward rarity;
- reward repetition;
- reward stacking;
- stacking caps;
- In-Run Shop design;
- final permanent-shop access/presentation;
- final conversion rate;
- defeat penalty/completion bonus.

Do not inherit old answers from prototype behaviour automatically.

---

# 51. Current UI/UX Open Questions

Preserve for later collaboration:

- Death Marker;
- Run History;
- final Intent icon language;
- target/status/state visual language;
- End Turn warning/confirmation;
- final camera/control mapping;
- Tutorial skip/replay/access policy.

---

# 52. Deferred Full-Run Main-Game Scope

Canonical full run:

```text
Village
→ Town
→ Castle
→ Final Resolution
→ Settlement
→ Meta Progression
```

Current prototype ending after Region 1:

```text
DEVELOPMENT EXCEPTION
```

Therefore future Town/Castle work is not an “optional multiple regions feature”.

It is main-game scope, but can remain outside current web-prototype validation scope until needed.

---

# 53. Current Definition of Done — Design Recovery Checkpoint

A design-recovery checkpoint is complete when:

- latest explicit Game Designer decisions are captured;
- status is explicit;
- conflicts with older design are identified;
- important reasoning is preserved in supporting handoff where necessary;
- canonical docs are deliberately migrated;
- tentative/open items are not promoted silently.

T1–T3 recovery currently satisfies this enough for prototype validation planning.

---

# 54. Current Definition of Done — Documentation Refresh

The Handoff Package v3.0 is complete when:

- Maintenance Protocol is finalized;
- Game Design Context v3.1 is finalized;
- Game Design Decisions v3.1 is finalized;
- Current State v3.0 is finalized;
- Architecture v3.0 is finalized;
- State & Data v3.0 is finalized;
- Progress & Backlog v3.0 is finalized;
- Project Context v3.0 is finalized;
- Chat Handoff v3.0 is finalized;
- README is finalized;
- cross-document consistency audit passes;
- new-chat recovery simulation succeeds;
- Game Designer reviews;
- files are placed in correct repository paths;
- Git status is understood;
- relevant runtime sanity test is performed if repository content changed materially;
- commit is created;
- commit is pushed.

Do not claim these final Git steps until user confirms them.

---

# 55. Current Definition of Done — Implementation Checkpoint

A future coding checkpoint is complete when:

- target behaviour is clear;
- relevant actual source files were audited;
- smallest coherent change was selected;
- code/data saved;
- prototype runs;
- expected primary behaviour passes;
- relevant regression tests pass;
- user confirms actual result;
- documentation is updated if state/architecture/backlog changed;
- Git commit/push occur at deliberate checkpoint.

Do not mark `DONE` from code existence alone.

---

# 56. Current Documentation Portability Goal

After Handoff Package v3.0:

A future new chat should be able to recover the project from approximately:

```text
README
Maintenance Protocol
Project Context
Chat Handoff
Current State
Architecture
State & Data
Progress & Backlog
Game Design Context
Game Design Decisions
```

Supporting handoffs should only be needed for detailed reasoning/provenance.

Goal:

```text
no manual re-briefing of:
Shared AP
Enemy Intent
Tutorial T1–T3
prototype audit baseline
```

---

# 57. Supporting Handoff Status

## Enemy Design Discussion v4

```text
KEEP
SUPPORTING
NON-CANONICAL DETAIL
```

## Tutorial Design Corrected Handoff 2026-08-11 v1

```text
KEEP
SUPPORTING CURRENT DETAIL
NON-CANONICAL
```

## Prototype Recovery / Repository Audit Handoff 2026-08-11 v1

```text
KEEP
SUPPORTING CURRENT IMPLEMENTATION EVIDENCE
NON-CANONICAL
```

## Tutorial Recovery Handoff / Verbatim archive

```text
HISTORICAL / RECOVERY EVIDENCE
```

---

# 58. Historical Documentation Status

## `docs/handoff-v2.5/`

Status:

```text
HISTORICAL SNAPSHOT
DO NOT RETROACTIVELY EDIT
```

## root `TMTB_CURRENT_STATE.md`

Status:

```text
HISTORICAL / SUPERSEDED AS CURRENT STATE
```

It describes a much older movement-only checkpoint.

## root `TMTB_PROJECT_CONTEXT_v1.0.md`

Status:

```text
HISTORICAL / SUPERSEDED AS CURRENT PROJECT CONTEXT
```

Its project-level assumptions are replaced by `TMTB_PROJECT_CONTEXT_v3.0.md`.

## `TMTB_PROTOTYPE_V2_5_TODO_AND_DEFERRED_BACKLOG.md`

Status:

```text
HISTORICAL BACKLOG / DESIGN-TECHNICAL SEED
```

Its items have been reclassified in this document.

---

# 59. Git / Save Status

At repository recovery audit:

```text
branch = main
HEAD = cbd33ac
origin/main aligned
```

Current local source working tree includes uncommitted Run Overview work.

Documentation artifacts created during this chat are **not automatically considered saved into the user's local repository** until the user places/replaces them there.

Therefore current safe status is:

```text
documentation authored in recovery workflow
→ local repository placement / final review still needs confirmation
```

Do not claim commit/push has happened.

---

# 60. Recommended Work After Package Finalization

Once documentation is secure:

```text
1. Re-check Git working tree
2. Preserve/commit the confirmed Run Overview work deliberately
3. Establish exact migration checkpoint from V1
4. Audit only relevant current source
5. Implement one small change
6. Runtime test
7. Regression test
8. Update docs if needed
9. Commit/push
10. Continue
```

Whether Run Overview work and documentation refresh are committed together or separately should be decided deliberately from actual Git diff at that time.

Do not automatically bundle unrelated changes.

---

# 61. Likely First Migration Planning Domain

Current planned first design domain:

```text
V1 — Player Turn Economy
```

However:

```text
V1
≠
one patch
```

Before coding, split it into the smallest verifiable checkpoints after auditing current files.

Candidate areas that may need sequencing:

```text
Team AP state
Player Turn initialization
StartGrid semantics
movement AP commitment
refund
global End Turn
old automatic all-Exhausted transition removal
HUD visibility
```

Exact sequence is not locked by this backlog document.

---

# 62. Regression Risks to Watch During V1/V2

Known current couplings:

```text
turnState
hasActed
movement eligibility
attack targeting
damage resolver
auto Enemy Phase transition
HUD
enemy attack shared resolver
```

Therefore changing Exhaustion can regress:

- Player selection;
- Enemy completion;
- battle phase transitions;
- targeting;
- movement;
- result flow.

Migration must isolate these carefully.

---

# 63. Regression Risks to Watch During V3

Current path/Cover implementation is useful.

Do not destroy:

```text
Cover geometry
Full Cover targetability
0-damage effectiveness
edge/corner handling
```

when adding distinct LOS.

Need specifically test:

```text
inside ATR + No LOS
inside ATR + LOS + clear
inside ATR + LOS + O30
inside ATR + LOS + O70
inside ATR + LOS + Full Cover
```

---

# 64. Regression Risks to Watch During V4

Current enemy system has deterministic behaviour and partial sequential state awareness.

Preserve useful determinism while replacing:

```text
Move-all
→ Attack-all
```

with full sequential activation.

Test:

- activation order;
- updated board reads;
- target changes after previous enemy action;
- fallback;
- no illegal destination overlap;
- correct Intent display.

---

# 65. Regression Risks to Watch During Tutorial Migration

Tutorial must not become an alternate combat ruleset.

Key invariant:

```text
REAL SYSTEM VALIDATION
uses real combat rules

FLOW SIMULATION
does not mutate combat state unless explicitly intended
```

Good play must not break tutorial progression.

Learning evidence should support retroactive completion where appropriate.

---

# 66. Backlog Priority Philosophy

Priority should follow:

```text
intended decision
→ validation pressure
→ required behaviour/system
→ smallest implementation
→ numbers/content
```

Do not add complexity merely because an old backlog item exists.

A backlog item should survive only when it still supports:

- current design validation;
- current main-game direction;
- technical reliability;
- academic/presentation need;
- future portability.

---

# 67. Current Priority Summary

```text
DOCUMENTATION
10-file Handoff Package authored      DONE
First cross-document audit            DONE
Cross-document fix pass               DONE
New-chat recovery test                DONE
Local save/review                     NEXT
Commit / Push                         NEXT AFTER REVIEW

PROTOTYPE MIGRATION
V0 Recovery Audit                     DONE
V1 Player Turn Economy                PLANNED — FIRST MIGRATION DOMAIN
V2 Player Action Commitment           PLANNED
V3 Tactical Space                     PLANNED
V4 Enemy Readability & Execution      PLANNED
V5 Core Tutorial Flow                 PLANNED
V6 Status / Temporal Threat           PLANNED
V7 Wave                               PLANNED
V8 Full Tutorial Integration          PLANNED

CURRENT SOURCE
Run Overview                          IMPLEMENTED / CONFIRMED / UNCOMMITTED
Shop relocation                       IMPLEMENTED / CONFIRMED / UNCOMMITTED
Shared AP                             NOT IMPLEMENTED
Intent                                NOT IMPLEMENTED
Dynamic Intent                        NOT IMPLEMENTED
distinct LOS                          NOT IMPLEMENTED
sequential full enemy activation      NOT IMPLEMENTED
Status                                NOT IMPLEMENTED
Charge                                NOT IMPLEMENTED
Wave                                  NOT IMPLEMENTED
corrected Tutorial                    NOT IMPLEMENTED

OTHER MAJOR BACKLOG
Data-driven stage battles             PLANNED
Unique Region 1 content               PLANNED
Stage 4 Mini-Boss content             PLANNED / DESIGN DETAILS OPEN
Reward effects                        PLANNED
Skill system                          PLANNED / DESIGN OPEN
HP carry                              PLANNED / LOCKED DESIGN DIRECTION
Active Run persistence                PLANNED / DEFERRED
Run History                           PLANNED prototype candidate
Death Marker                          PLANNED prototype candidate
Accessibility                         PLANNED
Automated tests                       DEFERRED / RECOMMENDED
Telemetry                             DEFERRED evaluation tool
Auto-simulation                       OPTIONAL evaluation tool
```

---

# 68. Durable Resume Reference

For the current project resume point, use:

```text
README.md
+
TMTB_PROGRESS_AND_BACKLOG_v3.0.md
+
TMTB_CHAT_HANDOFF_v3.0.md
```

Current post-package direction:

```text
new-chat recovery simulation
→ Game Designer review / local placement / Git verification
→ Prototype migration planning
→ V1 Player Turn Economy
→ fresh relevant source audit
→ choose the smallest coherent technical checkpoint
```

Do not infer that combat migration has started merely because the migration target is documented.
---

# 69. Final Backlog Principle

The v2.5 backlog remains valuable as historical design/technical evidence, but it is no longer the current roadmap.

Current roadmap is driven by:

```text
latest Game Design
+
verified prototype state
+
validation needs
+
smallest testable migration
```

not by old phase numbering.

> **Preserve useful backlog intent, supersede stale rules, and migrate only what still serves the current TMTB design and validation goals.**

---

**End of Progress & Backlog**
