# TMTB Tutorial Design Corrected Handoff

**Project:** TMTB / BeCan
**Document Type:** Supporting Game Design / Prototype Validation Handoff
**Created:** 11 August 2026
**Version:** v1
**Status:** **WORKING SUPPORTING HANDOFF — NON-CANONICAL**
**Purpose:** Preserve corrected Tutorial Design T1–T3 and Prototype Validation Scope after a source-of-truth re-audit.

## Primary Canonical Sources

- `TMTB_GAME_DESIGN_CONTEXT.md` — v3.0, 9 August 2026
- `TMTB_GAME_DESIGN_DECISIONS_v3.0.md` — v3.0, 9 August 2026

## Supporting Sources

- `TMTB_ENEMY_DESIGN_DISCUSSION_HANDOFF_2026-08-09_v4.md`
- `TMTB_TUTORIAL_DESIGN_DISCUSSION_RECOVERY_HANDOFF_2026-08-11.md`
- `TMTB-CHAT ARCHIVE VERBATIM 1.txt`

## Historical / Implementation References

- `TMTB_PROJECT_CONTEXT_v2.5.md`
- `TMTB_CHAT_HANDOFF_v2.5.md`
- `TMTB_CURRENT_STATE_v2.5.md`
- `TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md`
- `TMTB_STATE_AND_DATA_MODEL_v2.5.md`
- `TMTB_PROGRESS_AND_BACKLOG_v2.5.md`
- `TMTB_GAME_DESIGN_DECISIONS_v2.5.md`
- `TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md`

---

# 1. Why This Corrected Handoff Exists

Sebagian pembahasan tutorial T1–T3 sempat berlangsung ketika chat tidak berada di dalam Project TMTB dan project sources tidak aktif secara penuh.

Setelah pembahasan kembali berada di Project TMTB, dilakukan source-of-truth re-audit terhadap canonical v3.0, Enemy Design Handoff v4, implementation handoff v2.5, serta verbatim tutorial archive.

Hasil audit:

```text
Mayoritas T1–T3 tetap valid dan reusable.
```

Tidak diperlukan redesign dari nol.

Namun beberapa correction diperlukan:

1. Camera / Unity-control onboarding tidak boleh hilang hanya karena web prototype tidak mengimplementasikan final 3D controls.
2. Prototype membutuhkan distinction antara mechanic yang benar-benar divalidasi dan Unity-flow step yang hanya disimulasikan.
3. Phase 1 perlu dikoreksi dari Selection/Switching-only menjadi Control & Party Orientation.
4. `Status → Charge` dikembalikan sebagai current corrected curriculum baseline.
5. `Blue Charge → first Stun lesson` direklasifikasi menjadi OPEN alternative, bukan resolved baseline.
6. W1/W2 Wave lifecycle adalah prototype validation variants, bukan canonical Wave lifecycle.
7. Enemy validation harus memasukkan Sequential Activation + Spawn Order + max 1 Movement/1 Action.
8. V0–V8 adalah migration/validation domains, bukan final coding checkpoints.

Dokumen ini menyimpan corrected working state tersebut.

---

# 2. Source-of-Truth Rules

## Game-Design Intent

```text
1. Latest explicit Game Designer decision
2. TMTB_GAME_DESIGN_CONTEXT latest
3. TMTB_GAME_DESIGN_DECISIONS latest
4. Latest relevant domain-specific handoff
5. Historical / legacy design docs
```

## Prototype Implementation Truth

```text
1. Actual source code / data
2. Confirmed runtime testing
3. Latest TMTB_CURRENT_STATE
4. Latest Architecture / State & Data / implementation handoff
5. Historical implementation docs
```

Never silently merge design intent and implementation truth.

---

# 3. Design Status Language

Use:

- **LOCKED** — current canonical direction.
- **PLANNED** — intended but unfinished/unvalidated.
- **TENTATIVE** — working direction/value that may change.
- **OPEN** — undecided.
- **SUPERSEDED** — intentionally replaced rule.
- **PROTOTYPE ONLY** — validation-prototype-specific.
- **DEVELOPMENT EXCEPTION** — temporary scope deviation.
- **HISTORICAL DESIGN SEED** — old idea retained for reference.

Do not promote TENTATIVE or OPEN content to LOCKED without explicit Game Designer decision.

---

# 4. Latest Explicit Prototype Tutorial Flow Decision

New explicit Game Designer decision from 11 August 2026:

> Important tutorial/onboarding steps that belong to the intended Unity 3D game must remain represented in the web prototype flow even when the web prototype does not implement the real mechanic.

Example:

```text
Unity intended flow:
"Move camera left."

Prototype representation:
Instruction: Move camera left.
→ player performs simulated confirm/input
→ feedback: "Player moved camera left."
```

Purpose:

- preserve intended Unity onboarding order;
- allow Unity programmers to play the prototype and understand expected flow;
- keep prototype useful as a functional flow reference;
- avoid implementing unnecessary 3D-specific systems in the web prototype.

Important distinction:

```text
Not implemented mechanically in web prototype
≠
allowed to disappear from intended Unity flow
```

---

# 5. Prototype Representation Types

Every important tutorial knowledge/flow item should now declare one of three prototype representation classes.

## 5.1 REAL SYSTEM VALIDATION

The prototype actually runs the gameplay rule.

Use when wrong implementation would invalidate the design test.

Examples:

```text
Unit Selection
Unit Switching
Shared AP
StartGrid
Movement Commitment / Refund
End Turn
Attack / Position Commitment
ATR
LOS
Cover
Intent
Current Target
Dynamic Intent
Status
Charge
Wave reservation
```

Evidence may progress through:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

## 5.2 FLOW SIMULATION

The step remains in intended Unity flow but its final mechanic is not replicated.

Examples:

```text
Camera navigation
3D camera orientation
continuous-character-control introduction
Unity-specific control/presentation beats
```

Prototype behaviour:

```text
instruction
→ simulated input / confirmation
→ completion feedback
→ next flow step
```

Flow Simulation may mutate:

```text
tutorial flow state
instruction state
simulated-step completion flag
presentation text
```

By default it must NOT silently mutate:

```text
Team AP
StartGrid
tactical position
HP
Status
enemy state
Combat Turn
Objective
Wave state
```

Evidence language:

```text
FLOW EXPOSURE
→ SIMULATED COMPLETION
```

Do not claim mechanic mastery from simulated completion.

## 5.3 DEFERRED / NOT READY

The content/rule is not sufficiently designed to teach accurately.

Current examples:

```text
Hold detailed lesson
individual Skill detailed lesson
```

Do not create fake rules merely to complete the tutorial flow.

---

# 6. Corrected T1 — Learning Curriculum

T1 remains **COMPLETE AS WORKING CURRICULUM**.

The correction is representation mapping, not a redesign of the knowledge dependency.

Canonical dependency remains:

```text
Camera / Control
→ Unit Selection
→ Unit Switching
→ Movement

Player Turn / Enemy Turn
→ Shared AP
→ StartGrid / Movement Commitment
→ Movement Refund
→ End Turn

Attack
→ Position Commitment
→ Repeated Action
→ Target Selection
→ Damage
→ ATR

Archer / Ranged Combat
→ LOS
→ Cover

Enemy Intent
→ Current Target
→ Dynamic Intent
→ threat response

Status
→ Charge / multi-activation threat
→ special-enemy interaction
→ Wave Telegraph
```

This is a knowledge dependency map, not the final number of tutorial phases.

---

# 7. T1 Prototype Representation Map

| Topic | Representation | Current Status |
|---|---|---|
| Camera Navigation | FLOW SIMULATION | Required Unity onboarding topic |
| Final 3D camera feel | Not validated by web prototype | Unity implementation concern |
| Unit Selection | REAL SYSTEM | Required |
| Unit Switching | REAL SYSTEM | Required |
| Continuous 3D locomotion control | FLOW SIMULATION | Required flow reference |
| Tactical grid movement consequence | REAL SYSTEM | Required |
| Player / Enemy Turn | REAL SYSTEM | Required |
| Shared AP | REAL SYSTEM | LOCKED design |
| StartGrid | REAL SYSTEM | LOCKED design |
| Movement Commitment | REAL SYSTEM | LOCKED design |
| Movement Refund | REAL SYSTEM | LOCKED design |
| End Turn | REAL SYSTEM | LOCKED design |
| Attack | REAL SYSTEM | Required |
| Position Commitment | REAL SYSTEM | LOCKED design |
| Repeated Action | REAL SYSTEM | LOCKED design |
| Target Selection | REAL SYSTEM | Required |
| Damage | REAL SYSTEM | Required |
| ATR | REAL SYSTEM | LOCKED concept |
| Archer / Ranged Combat | REAL SYSTEM | Required |
| LOS | REAL SYSTEM | LOCKED for ranged attacks |
| Cover | REAL SYSTEM | Required distinction from LOS |
| Enemy Intent | REAL SYSTEM | Required |
| Current Target | REAL SYSTEM | Required |
| Dynamic Intent | REAL SYSTEM | Required |
| Threat Response | REAL SYSTEM | Required decision competence |
| Status | REAL SYSTEM | Required advanced concept; exact source OPEN |
| Charge | REAL SYSTEM | Advanced core lesson |
| Special Enemy Application | REAL if selected | TENTATIVE content |
| Wave Telegraph | REAL SYSTEM | Advanced topic |
| Hold | DEFERRED | Rules incomplete |
| Skill detailed lesson | DEFERRED / PLANNED SLOT | Content incomplete |

---

# 8. Corrected T2 — Learning Blocks

Seven Learning Blocks remain useful:

```text
1. Party Control & Turn Model
2. Shared AP & Movement Commitment
3. Attack & Position Commitment
4. Tactical Range & Ranged Space
5. Readable Enemy Pressure
6. Status & Temporal Threat
7. Incoming / Combined Pressure
```

Camera / Unity control flow is a foundation surrounding Block 1, not necessarily a separate eighth Learning Block.

Important taxonomy:

```text
Tutorial Flow Step
≠
Learning Block
≠
Tutorial Phase
```

- Tutorial Flow Step = intended onboarding action/beat.
- Learning Block = mental model/knowledge cluster.
- Phase = authored section of the continuous tutorial Stage.

---

# 9. Corrected T2 — Evidence Rules

For REAL SYSTEM VALIDATION:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

For FLOW SIMULATION:

```text
FLOW EXPOSURE
→ SIMULATED COMPLETION
```

Therefore:

```text
Tutorial Flow Completion
≠
Learning Confirmation
```

Example:

```text
"Move camera left" simulated successfully
```

means:

```text
intended camera onboarding step represented
```

not:

```text
camera-control mastery validated
```

---

# 10. Corrected T2 — Working Phase Architecture

Current seven-Phase candidate:

```text
Phase 1 — Control & Party Orientation
Phase 2 — Shared AP, Tactical Movement & Turn Foundation
Phase 3 — Basic Combat & Static Intent
Phase 4 — Tactical Range
Phase 5 — Dynamic Threat Reading
Phase 6 — Status & Temporal Threat
Phase 7 — Incoming / Combined Pressure
→ Tutorial Victory
```

Status:

```text
TENTATIVE WORKING STRUCTURE
```

Seven is not locked.

Phase 6 may later split if Status + Charge creates excessive cognitive load.

---

# 11. Corrected T2 — State Continuity Rules

1. Phase transition does not refresh AP.
2. Phase transition does not refresh StartGrid.
3. Phase transition does not auto-heal.
4. Phase transition does not auto-clear Status.
5. Tactical position persists by default.
6. Avoid teleport/reset.
7. Early pressure may clear naturally.
8. Late pressure increasingly persists/composes.
9. Reinforcement is preferred over battlefield reset.
10. Instructional transition may occur mid-turn.
11. Major battlefield/content transition prefers natural combat boundary.
12. Every Phase needs an Entry/Exit State Contract.
13. Phase exit should create next-phase-compatible state.
14. Tutorial rules must not contradict normal combat rules.
15. FLOW SIMULATION must not silently mutate authoritative combat state.
16. Simulated flow completion must not be stored as mechanic-mastery evidence.

---

# 12. Corrected T3 — Overall Stage Direction

Latest explicit direction:

```text
ONE continuous Tutorial Stage / Level
```

The stage should feel like one evolving tactical battlefield, not seven isolated tutorial rooms.

Desired experiential progression:

```text
Orientation
→ Resource / Movement
→ Basic Combat
→ Tactical Space
→ Dynamic Enemy Pressure
→ Temporal Pressure
→ Incoming / Combined Pressure
```

Current classification:

```text
T3 = WORKING DESIGN COMPLETE ENOUGH FOR PROTOTYPE VALIDATION PLANNING
```

Not:

```text
FINAL
LOCKED
PRODUCTION READY
```

---

# 13. T3 Stage Geometry Requirements

The stage should function as a compact evolving tactical sandbox.

Required capabilities:

- two readable player start anchors;
- safe orientation/staging area;
- central maneuver space;
- melee engagement space;
- at least one clear LOS-blocked relationship;
- at least one LOS-valid + Cover relationship;
- multiple legal reposition choices;
- a Dynamic Intent target-switch opportunity;
- advanced threat-response space;
- one actual Wave reserved spawn area;
- at least two useful enemy-entry directions/regions;
- final combined pressure without teleport/reset.

Geometry reuse principle:

```text
same obstacle / space
→ movement meaning
→ attack-space meaning
→ LOS meaning
→ Cover meaning
→ threat-manipulation meaning
→ Wave-preparation meaning
```

---

# 14. Selected Working Map Family

Three abstract map families were compared:

```text
A. Offset Courtyard
B. L Geometry / Two-Lane Arena
C. Open Tactical Field
```

Current selected working family:

```text
OFFSET COURTYARD
```

Status:

```text
PRIMARY WORKING LAYOUT FAMILY
not final map lock
```

L Geometry remains fallback if actual LOS/Cover validation shows the Offset Courtyard cannot produce clear enough contrasts.

---

# 15. Concrete Paper Grid Candidate v0.1

```text
          A   B   C   D   E   F   G   H   I   J
      ┌─────────────────────────────────────────┐
  8   │   .   .   .   .   .   .   R   .   .   . │
  7   │   .   .   .   .   .   .   .   .   .   . │
  6   │   .   .   .   X   T   .   .   .   .   . │
  5   │   .   .   .   X   X   c   K   .   .   . │
  4   │   .   .   .   .   .   .   .   .   W   . │
  3   │   .   .   .   .   .   .   .   .   .   . │
  2   │   .   .   .   G   .   A   .   .   .   . │
  1   │   .   .   .   .   .   .   .   .   .   . │
      └─────────────────────────────────────────┘
```

Legend:

```text
G = Guard initial tactical anchor
A = Archer initial tactical anchor
X = major blocking obstacle
c = Cover relationship candidate
R = regular tutorial enemy-entry region
W = actual Wave reserved-spawn candidate
K = basic-combat teaching anchor candidate
T = tactical-range teaching anchor candidate
```

Exact dimensions/coordinates remain TENTATIVE paper-design values.

---

# 16. Corrected Tutorial Stage Flow v0.4

## Phase 1 — Control & Party Orientation

Entry:

```text
Guard + Archer present
No enemies
No Team AP active
No StartGrid recorded
Combat Player Turn not formally started
```

Flow Simulation examples:

```text
Camera Left
Camera Right
relevant Unity camera/orientation beats
continuous-character-control introduction
```

Real-system beats:

```text
Select Guard
Select Archer
Switch between units
```

Critical rule:

```text
Simulated camera / locomotion beats
DO NOT change tactical position or AP state.
```

Exit:

```text
positions unchanged
no AP/HP/Status mutation
clean start for Player Turn 1
```

---

## Phase 2 — Shared AP, Tactical Movement & Turn Foundation

Start actual Player Turn 1.

```text
Living Player Units = 2
Team AP = 4
StartGrid recorded for Guard and Archer
```

Real evidence:

```text
leave StartGrid
→ AP decreases once

continue movement
→ no additional movement AP

return to StartGrid before commitment
→ AP refunded

perform real reposition
→ End Turn with AP remaining
→ remaining AP discarded
```

Actual tactical Movement begins here, not in Phase 1.

---

## First Sword Arrival — Not the Wave Lesson

After the natural End Turn boundary:

```text
regular tutorial Sword arrival
→ Intent becomes readable
→ one normal readable Enemy Activation
```

This is not the full Wave Telegraph mechanic.

Do not teach reserved-spawn Wave rules here.

Purpose:

- establish Enemy Turn;
- confirm readable Intent before first Attack lesson;
- avoid hidden invulnerability if player would otherwise kill the Sword too early.

---

## Phase 3 — Basic Combat & Static Intent

Teach/validate:

- Attack;
- AP consumption;
- damage;
- Position Commitment;
- Attack locks Movement;
- Attack does not Exhaust the unit;
- unit remains selectable;
- repeated action when legal;
- cross-unit Shared AP use.

Important:

Exact choreography is balance-sensitive.

Do not permanently author one sequence such as:

```text
Move → Attack → Attack → Archer Attack
```

until AP costs and enemy durability are sufficiently stable.

Learning evidence matters more than exact action arithmetic.

---

## Phase 4 — Tactical Range

Paper audit found a normal Sword too brittle for controlled ATR/LOS/Cover teaching because an unexpected End Turn causes normal enemy movement and can destroy the intended geometry relationship.

Preferred candidate:

```text
PRACTICE TARGET / TRAINING TARGET
```

Status:

```text
PROTOTYPE ONLY / TUTORIAL TRAINING OBJECT CANDIDATE
STRONGLY JUSTIFIED BY PAPER AUDIT
```

It is not a new normal enemy archetype.

Minimum behaviour:

- stationary by identity;
- clearly a training object;
- no normal AI;
- no Intent;
- real ATR validation;
- real ranged LOS validation;
- real Cover calculation;
- repeatable hit/damage registration as needed;
- not counted as a normal hostile Victory requirement.

Desired tactical sequence:

```text
Outside ATR
→ In ATR / No LOS
→ LOS + Cover
→ alternative clearer shot
→ independent ranged confirmation
```

---

## Phase 5 — Dynamic Threat Reading

Use a known Sword.

Current Target must come from the actual Target Rule.

Do not hardcode:

```text
Target = Guard
```

Preferred learning sequence:

```text
Current Target = Unit A
→ player changes relevant battlefield relationship
→ Current Target / Intent changes to Unit B if normal rule requires it
→ player responds tactically
```

Entry setup should guarantee at least one reasonable legal reposition capable of producing a meaningful target/Intent change.

A small adaptive authored entry region is acceptable if the enemy Target Rule itself remains real.

---

## Phase 6 — Status & Temporal Threat

This is the major corrected area.

### Current corrected baseline

```text
Status
→ Charge
→ optional special-enemy combined application
```

Not automatically:

```text
Blue Charge
→ Shockwave
→ first Stun lesson
```

### Phase 6A — Status

Status is a required advanced concept.

Current strongest concrete candidate:

```text
STUN
```

Player Stun rule:

```text
Movement      disabled
Normal Attack disabled
Skill         disabled
Hold          disabled
Unit Selection allowed
Shared AP contribution unchanged
```

If actually Stunned, useful evidence includes:

```text
player recognizes capability loss
→ unit remains selectable
→ Team AP remains party resource
→ player reallocates actions through another usable unit
```

Major blocker:

```text
Exact first Status teaching source = OPEN
```

Do not invent a permanent enemy or fake mechanic solely to close this diagram.

### Phase 6B — Charge / Temporal Threat

Teach:

```text
CHARGE X/Y = current behaviour progress
```

Progress advances only through successful relevant Charge activations.

Critical readability rule:

```text
CHARGE X/X
≠
payoff preview
```

Payoff becomes visible when it becomes Current Intent.

Learning target:

```text
Player makes meaningful preparation before payoff
```

not necessarily:

```text
kill the Charger
```

### Blue Candidate

Two possible routes remain:

**Route A — Current Working Baseline**

```text
Status known
→ Charge known
→ Blue combines both as competence application
```

**Route B — OPEN Alternative**

```text
Blue introduces Charge
→ payoff introduces first Stun
```

Route B is more content-efficient but has higher cognitive-load risk and may fail to demonstrate actual Stun consequence when the player correctly avoids the payoff.

Blue remains:

```text
TENTATIVE SPECIAL ENEMY / VALIDATION CANDIDATE
```

not locked Region 1/tutorial roster content.

---

## Phase 7 — Incoming / Combined Pressure

Core requirement:

```text
Current Pressure
+
Incoming Pressure
```

Wave Telegraph appears while the battlefield remains continuous.

Player should receive a meaningful preparation opportunity before spawn.

Wave Telegraph teaches:

- incoming spawn location;
- reserved spawn position;
- pass-through traversal allowed;
- final occupancy forbidden;
- future pressure should influence current AP/position decisions.

First tutorial Wave should preferably use a known enemy such as Sword so the new lesson is Wave pressure, not a new enemy rule.

After spawn:

```text
new enemy receives Current Intent
```

and re-enters the already learned Intent language.

---

# 17. Wave Lifecycle Status

Canonical current direction:

```text
Telegraph
→ one Player preparation window
→ Spawn
```

Also current direction:

```text
Spawn itself
≠
immediate attached offensive Move/Attack
```

Exact timing from Spawn to first normal activation remains OPEN.

Therefore prototype should treat lifecycle alternatives as experiments.

## W1 — Safe Variant

```text
Telegraph
→ preparation
→ Spawn
→ no immediate first activation
→ another response opportunity
→ later first activation
```

Predicted risk:

```text
too forgiving / Wave pressure becomes trivial
```

## W2 — Tight Validation Variant

```text
Telegraph
→ one preparation opportunity
→ Spawn resolution
→ earlier normal activation eligibility
```

W2 must still preserve:

```text
Spawn event itself is not an automatic attack
```

Predicted risk:

```text
too abrupt / perceived unfairness
```

Status:

```text
W1/W2 = PROTOTYPE VALIDATION VARIANTS
Exact canonical lifecycle = OPEN
```

---

# 18. Wave Telegraph Information Density

Candidate comparison:

```text
T1 — Location only
T2 — Location + known enemy identity
```

Preferred first tutorial hypothesis:

```text
Location + known Sword identity
```

because Sword is already known and the new problem should be incoming-pressure planning.

Do not reveal:

- exact future path;
- exact future destination;
- full Pattern;
- optimal solution.

Status:

```text
PROTOTYPE VALIDATION QUESTION
```

---

# 19. Trigger Architecture

Preferred trigger categories:

```text
Learning Evidence Trigger
Combat-Boundary Trigger
Content Trigger
Completion Trigger
Flow-Simulation Completion Trigger
```

Preferred real-content transition:

```text
learning evidence achieved
→ Phase may be marked complete
→ next content queued
→ natural combat boundary
→ content transition
```

Avoid arbitrary exact-tile triggers unless position itself is the lesson.

Flow Simulation completion only advances tutorial flow and does not imply mechanic mastery.

---

# 20. Good Play Must Not Break the Tutorial

Important authoring rule:

> Good play must not be treated as tutorial failure.

Examples:

- player kills an enemy earlier than expected;
- player triggers an Intent target change before the prompt;
- player finds a valid firing position immediately;
- player avoids a Status threat;
- player eliminates current pressure before a Wave arrives.

When observable learning evidence already occurred, the tutorial should support retroactive credit where appropriate.

Do not force repetition solely because the script had not displayed the instruction yet.

Legal but suboptimal play is also not automatically failure.

Example:

```text
legal Full-Cover shot with 0 damage
```

may be allowed and used as teaching consequence while still requiring a later meaningful ranged confirmation.

---

# 21. Objective / Task / Wave / Victory Separation

Keep the systems distinct:

```text
Stage
≠ Phase
≠ Tutorial Task
≠ Objective
≠ Victory Condition
≠ Wave
```

Working stage-level framing:

```text
Tutorial Goal:
Complete Combat Training
```

Working final combat objective:

```text
Resolve remaining hostile threats
```

Suggested Tutorial Victory architecture:

```text
Required tutorial learning evidence complete
AND
required final hostile threats resolved
AND
no required Wave remains pending
```

Exact player-facing wording remains OPEN.

---

# 22. Retry / Checkpoint Status

Current carried-forward direction:

```text
Tutorial Defeat
→ Retry Tutorial
```

Tutorial defeat should not:

- start normal run settlement;
- convert Crystal;
- trigger permanent progression.

Still OPEN:

```text
retry entire Tutorial Stage
vs
retry current Phase/checkpoint
```

---

# 23. Corrected Prototype Validation Scope v0.2

The prototype tutorial now has two explicit functions.

## Function A — Game Design Validation Tool

Validate mechanics, tactical decisions, mental models, and observed behaviour.

## Function B — Unity Functional Flow Reference

Preserve all important intended Unity onboarding steps in sequence, even when some are represented only by simulation/notification.

A Unity programmer should be able to play the prototype and reconstruct the intended tutorial flow without needing the lost historical chats.

---

# 24. PVS v0.2 — Required Real-System Fidelity

The following systems must be represented as real prototype rules when they become part of the validation build.

## Shared Team AP

```text
Team AP = Living Player Units × 2
```

Requirements:

- one party pool;
- no forced equal distribution;
- no carry;
- End Turn discards unused AP.

## StartGrid / Movement Commitment

Real:

```text
leave StartGrid
→ spend 1 Team AP

continue movement
→ no additional movement AP

return before Attack/Skill and lock
→ refund
```

## Attack / Position Commitment

Real:

```text
Attack
→ consume AP
→ Movement locked
→ unit remains selectable
→ repeated action may remain legal
```

Old Exhaustion model must not remain as a hidden underlying rule.

## ATR / LOS / Cover

Must remain distinguishable systemically.

Practice Target, if used, must consume the same tactical validation rules.

## Intent / Current Target / Dynamic Intent

Must derive from actual enemy behaviour state/rules, not tutorial-only text.

## Sequential Enemy Resolution

Target design:

```text
enemies resolve one by one
next enemy reads updated board
```

Baseline execution order:

```text
Spawn Order
```

Baseline activation:

```text
maximum 1 Movement Resolution
+
maximum 1 Action Resolution
```

`Spawn Order` is an internal/system rule and does not need explicit player-facing tutorial terminology.

## Status

Real capability-changing Status behaviour is required if Status is being validated.

Exact first teaching source remains OPEN.

## Charge

Real Charge progress/state is required.

## Wave Telegraph

Real:

```text
reserved position
traversable
not legal final occupancy
preparation opportunity
Spawn
new Current Intent
```

Exact first-activation timing remains a prototype validation question.

---

# 25. PVS v0.2 — Flow Simulation Scope

Current likely FLOW SIMULATION items:

- camera left/right/orientation;
- final 3D camera-control introduction;
- continuous Unity locomotion-control introduction;
- other future Unity-specific onboarding beats that are important to flow but inappropriate to reproduce mechanically in the web build.

These must be visibly recognizable as simulated/reference steps so a programmer does not confuse them with completed mechanic validation.

---

# 26. PVS v0.2 — Deferred Tutorial Content

Current examples:

```text
Hold detailed lesson
individual player Skill detailed lesson
```

These are deferred because rules/content are unfinished, not because the web prototype cannot reproduce them.

This distinction is important.

---

# 27. Flow State vs Combat State — Functional Requirement

Prototype design should conceptually distinguish:

```text
Tutorial Flow State
```

from:

```text
Authoritative Combat State
```

Tutorial Flow State may contain:

- current Phase;
- current Task;
- simulated flow completion flags;
- learning-evidence flags;
- instruction/confirmation state.

Combat State contains authoritative gameplay such as:

- Team AP;
- StartGrid;
- tactical position;
- HP;
- Status;
- enemy state;
- Intent;
- Turn;
- Wave reservation.

This is a functional requirement, not yet a mandate for specific JavaScript object/module architecture.

---

# 28. Lightweight Evidence Tracking Recommendation

Prototype should eventually log enough evidence for Game Designer analysis.

Suggested FLOW events:

```text
camera_left_simulated
camera_right_simulated
movement_control_simulated
```

Suggested SYSTEM events:

```text
phase_entered
team_ap_generated
left_start_grid
movement_refunded
attack_committed
movement_locked
repeated_action
cross_unit_ap_use
no_los_encountered
cover_interaction
current_target_changed
charge_advanced
status_applied_or_avoided
wave_telegraph_activated
player_repositioned_after_telegraph
wave_variant_used
```

This is prototype evaluation support, not production analytics.

---

# 29. Evaluation Framework

Use:

```text
Predicted
→ Observed
→ Perceived
```

Do not equate:

```text
player won
```

with:

```text
player understood
```

Separate:

```text
Completion
Understanding
Performance
```

For tutorial validation:

```text
Understanding > raw optimization
```

---

# 30. Corrected Validation Questions

## System Validation Questions

1. Does Shared AP produce the intended party-resource mental model?
2. Is StartGrid/refund understandable, and does movement scouting become useful or exploitable?
3. Is Attack position commitment readable without old Exhaustion?
4. Can compact geometry cleanly distinguish ATR, LOS, and Cover?
5. Does actual Dynamic Intent improve planning without feeling unstable?
6. Can Status capability changes be understood clearly?
7. Does Charge create meaningful temporal planning?
8. Does Wave Telegraph create meaningful preparation?
9. What spawn-to-first-activation timing feels fair and threatening?
10. Does late combined pressure create actual TMTB decisions?

## Unity Flow Reference Questions

11. Are important Unity onboarding steps present in the correct order even when only simulated?
12. Is it obvious which steps are simulations versus actual tactical systems?
13. Can a Unity programmer play the prototype and reconstruct intended tutorial flow without historical chat context?
14. Does tutorial guidance reduce naturally until the player is essentially playing normal TMTB?

---

# 31. Migration / Validation Domains

V0–V8 are **domains**, not guaranteed one-patch coding checkpoints.

Exact code checkpoints must be chosen only after repository audit.

## V0 — Prototype Recovery / Baseline Audit

```text
NO CODE CHANGE
```

Required:

- actual tracked file list;
- current source audit;
- runtime test;
- docs vs source comparison;
- design-vs-implementation gap matrix.

## V1 — Player Turn Economy Domain

Target systems:

- Shared AP;
- StartGrid;
- movement commitment/refund;
- global End Turn;
- removal/replacement of old Exhaustion dependencies.

Potential sub-checkpoints only after audit.

## V2 — Player Action Commitment Domain

- Attack AP;
- Movement lock;
- repeated action;
- cross-unit AP.

## V3 — Tactical Space Domain

- ATR;
- LOS;
- Cover separation;
- Practice Target candidate.

## V4 — Enemy Readability & Execution Domain

- sequential activation;
- Spawn Order;
- max 1 Move + 1 Action;
- Target Rule;
- Current Target;
- Intent;
- Dynamic Intent.

Sword first.

## V5 — Core Tutorial Flow Domain

Integrate corrected Phase 1–5, including FLOW SIMULATION + REAL systems.

## V6 — Status & Temporal Threat Domain

- Status validation;
- Charge validation;
- combined special-enemy application if selected.

Do not assume Blue until design decision.

## V7 — Wave Domain

- Telegraph;
- reservation;
- Spawn;
- Intent transition;
- W1/W2 timing experiment.

## V8 — Full Tutorial Integration Domain

- one continuous Stage;
- simulated Unity-only beats;
- real combat validation;
- evidence tracking;
- final guidance reduction.

---

# 32. Current Implementation Gap Reminder

Known v2.5 documentation says the prototype historically used:

```text
reposition
→ one action
→ Exhausted
```

and:

```text
all Player Units Exhausted
→ Enemy Phase
```

It also describes the tutorial as a placeholder battle and historical enemy execution as all movement followed by attacks.

Current v3.0 design requires Shared AP, global End Turn, repeated actions, position commitment, Dynamic Intent, sequential enemy activation, Wave Telegraph, and redesigned tutorial flow.

Therefore a material design-vs-implementation gap is expected.

However:

```text
This needs verification.
```

Actual repository/source/runtime may have changed after the v2.5 handoff.

Do not claim any v3.0 system is already implemented until audited.

---

# 33. Required V0 Audit Output

For each domain, record:

```text
Domain

Documented v2.5:
what handoff says existed

Actual Source:
what repository currently implements

Confirmed Runtime:
what actually happens when tested

Design Target:
what v3.0 / corrected tutorial requires

Migration Gap:
what must change
```

Minimum audit domains:

- battle controller / turn flow;
- AP / Exhausted/player action state;
- movement;
- Attack;
- ATR / LOS / Cover;
- enemy AI;
- enemy execution order;
- Intent / Current Target;
- spawn / Wave;
- tutorial flow/state;
- map/encounter data;
- battle/run/profile state;
- persistence;
- stage/tutorial hardcoding.

---

# 34. Exact Coding Workflow After V0

After audit:

```text
choose smallest coherent migration problem
→ inspect exact files
→ one code change
→ run
→ test
→ compare expected vs actual
→ user confirms
→ next checkpoint
```

Do not implement an entire V-domain in one large patch unless actual audited architecture proves that is genuinely the smallest safe unit.

---

# 35. Current Status Summary

```text
T1 — Learning Curriculum
COMPLETE as corrected working curriculum

T2 — Curriculum → Phase Architecture
COMPLETE as corrected working architecture

T3 — Actual Tutorial Stage Design
WORKING DESIGN COMPLETE ENOUGH FOR PROTOTYPE VALIDATION PLANNING

Prototype Validation Scope
CORRECTED v0.2 WORKING SCOPE
```

Not yet:

```text
Tutorial final/locked
Tutorial implemented
Tutorial runtime tested
Prototype migrated to v3.0 combat rules
```

---

# 36. Material Open / Validation Items

## Design Blocker

```text
Exact first Status teaching source
```

Current candidate Status:

```text
Stun
```

but source remains OPEN.

## Other Open / Validation Items

- final Phase count;
- exact map dimensions/coordinates;
- exact LOS/Cover geometry result;
- Practice Target final feel/identity;
- Stun duration/timing;
- Blue final inclusion/placement;
- W1 vs W2 Wave lifecycle;
- Telegraph information density;
- exact AP-sensitive task choreography;
- exact Tutorial Objective/UI wording;
- retry whole Stage vs Phase checkpoint;
- how much Flow Simulation is necessary for Unity control onboarding;
- movement-scouting/refund exploit/value;
- final combined-pressure tuning.

---

# 37. What Is Strong Enough to Carry Forward

The following are strong working directions and should not be casually reopened without new evidence or an explicit new decision:

- one continuous Tutorial Stage;
- important Unity control/onboarding steps remain represented in prototype flow;
- Flow Simulation is distinct from mechanic validation;
- tactical Movement starts with real Shared AP/StartGrid, not temporary free movement;
- first Sword gets readable Intent/normal activation before the first Attack lesson;
- old Exhaustion mental model is not taught;
- Practice Target is justified as a prototype-only ranged-geometry teaching candidate;
- Dynamic Intent uses actual Target Rule instead of hardcoded Guard targeting;
- Status remains conceptually before Charge in the corrected baseline;
- Blue is tentative, not locked roster content;
- Wave is an advanced culmination of current + incoming pressure;
- first full Wave preferably uses a known enemy;
- good/legal play should not break the tutorial;
- Tutorial Task, Phase, Objective, Wave, and Victory remain separate;
- prototype should become progressively less instructional and more like normal tactical play.

---

# 38. Documentation / Handoff Maintenance Note

The v2.5 Maintenance Protocol does not explicitly define a lightweight artifact category for long discussion recovery/design checkpoint summaries.

Future v3.0 handoff/protocol work should intentionally add guidance such as:

```text
.md = preferred structured supporting handoff
.txt = acceptable verbatim historical evidence
```

A supporting discussion/recovery handoff should ideally record:

- source/date/status;
- scope;
- explicit Game Designer decisions;
- working recommendations;
- superseded/corrected items;
- open questions;
- exact resume point.

Do not rewrite historical v2.5 protocol only to retrofit this rule.

---

# 39. Exact Resume Point

The next macro task is:

```text
V0 — PROTOTYPE RECOVERY / REPOSITORY AUDIT
```

Do not continue inventing tutorial detail before checking actual prototype state unless a remaining Game Design blocker explicitly needs resolution first.

First repository work should be:

```text
1. Inspect Git/repository actual state.
2. Get actual tracked file list.
3. Inspect relevant current source/data.
4. Run the current prototype.
5. Record confirmed runtime behaviour.
6. Compare v2.5 docs vs actual source/runtime vs v3.0 corrected design.
7. Build migration-gap matrix.
8. Choose one smallest verified migration checkpoint.
```

No implementation should be assumed successful until user confirms runtime testing.

---

# 40. Resume Instructions for a New Chat / Assistant

If resuming from this document:

1. Treat canonical v3.0 Context/Decisions as design baseline, overridden only by later explicit Game Designer decisions.
2. Do not restart T1–T3 from scratch.
3. Preserve the new Prototype Representation Types: REAL SYSTEM VALIDATION, FLOW SIMULATION, DEFERRED.
4. Keep Camera/Unity control onboarding represented in Phase 1 via simulation if not mechanically implemented.
5. Keep tactical Movement starting only when Shared AP/StartGrid are active.
6. Use Offset Courtyard as primary working map family, not final map lock.
7. Treat Practice Target as PROTOTYPE ONLY candidate.
8. Keep `Status → Charge` as current corrected baseline.
9. Treat exact Status source as OPEN.
10. Treat Blue as tentative combined-application/validation candidate.
11. Treat W1/W2 as prototype Wave timing experiments, not canonical lifecycle rules.
12. Enemy implementation target includes sequential activation, Spawn Order, and max 1 Movement + 1 Action.
13. Begin technical work with V0 repository/runtime audit.
14. Do not trust v2.5 implementation docs over actual current source/runtime.
15. Make one small tested migration change at a time.

---

# 41. Core Corrected Handoff Summary

```text
CANONICAL v3.0
Camera / Control
→ Selection / Switching
→ Movement / Shared AP foundation
→ Combat
→ Ranged Space
→ Intent
→ Status
→ Charge
→ Wave

        ↓

T1 CORRECTION
Every topic mapped as:
REAL SYSTEM
FLOW SIMULATION
or DEFERRED

        ↓

T2 CORRECTION
Phase 1 = Control & Party Orientation
Camera/3D control simulated
Selection/Switching real
Tactical Movement starts Phase 2

        ↓

T3 CORRECTION
Offset Courtyard retained
Practice Target retained as prototype-only candidate
Dynamic Intent uses actual Target Rule
Status → Charge restored as baseline
Blue Charge-first reclassified OPEN
Wave W1/W2 reclassified as validation experiments

        ↓

PVS v0.2
Prototype =
Game Design Validation Tool
+
Unity Functional Flow Reference

        ↓

NEXT
V0 Repository / Runtime Audit
→ migration-gap matrix
→ smallest verified code checkpoint
```

Primary working principle:

> The TMTB prototype should preserve enough real tactical fidelity to produce trustworthy Game Designer evidence, while also simulating important Unity-only onboarding beats so the full intended flow remains readable to future implementers.

---

**End of Handoff**
