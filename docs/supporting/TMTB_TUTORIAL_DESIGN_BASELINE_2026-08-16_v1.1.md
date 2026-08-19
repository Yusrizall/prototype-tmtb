# TMTB / BeCan — Consolidated Tutorial Design Baseline

**Document Type:** Consolidated Tutorial Game Design / Prototype Validation Baseline  
**Project / Game Code:** TMTB / BeCan  
**Primary Game:** Unity 3D Turn-Based Tactics  
**Prototype:** Vite + Vanilla JS 2D/simulative validation tool  
**Version:** 1.1  
**Date:** 16 August 2026  
**Status:** **PASS-4 REVIEWED CONSOLIDATED TUTORIAL BASELINE — PRE-IMPLEMENTATION CHECKPOINT**  
**Authority:** Supporting current-design baseline derived from latest explicit Game Designer decisions. It does **not** silently replace the broader canonical v3.1 game-design documents. Where this document contains a later explicit Tutorial decision, that later decision takes priority for Tutorial design.

---

## 1. Purpose

This document consolidates the current Tutorial design after the long-form curriculum, phase-structure, map, adversarial, casualty, and numerical discussions completed on 16 August 2026.

Its goals are to:

1. preserve the latest Tutorial learning contract without relying on chat memory;
2. separate **Main Game Design**, **Prototype Validation Scope**, and **Technical Implementation**;
3. distinguish `LOCKED`, `TENTATIVE`, `OPEN`, `PROTOTYPE ONLY`, and superseded Tutorial decisions;
4. preserve the relationship between Tutorial choreography and real combat rules;
5. provide a reliable design checkpoint before repository re-audit and implementation migration;
6. prevent older seven-Phase / LOS / Status-source / map / Wave assumptions from being accidentally revived.

This is **not** a claim that the current browser prototype already implements Phase 6–8, the expanded map, Spear, Blue, Stun, Wave, structure Objectives, or checkpoint/casualty flow.

---

## 2. Source Basis and Authority

### 2.1 Game-design source priority

```text
1. Latest explicit Game Designer decision in the active design discussion
2. TMTB_GAME_DESIGN_CONTEXT.md v3.1
3. TMTB_GAME_DESIGN_DECISIONS_v3.1.md
4. Latest relevant supporting handoff
5. Historical / verbatim recovery evidence
```

### 2.2 Prototype implementation truth

```text
1. Actual source code / data
2. Confirmed runtime testing
3. Latest implementation/current-work checkpoint
4. Older implementation handoffs
```

### 2.3 Primary materials audited for this baseline

- `TMTB_GAME_DESIGN_CONTEXT.md` v3.1 — 11 Aug 2026
- `TMTB_GAME_DESIGN_DECISIONS_v3.1.md` — 11 Aug 2026
- `TMTB_TUTORIAL_DESIGN_CORRECTED_HANDOFF_2026-08-11_v1.md`
- `TMTB_CURRENT_WORK_PROGRESS_2026-08-16.md`
- post-handoff recovery/checkpoint files
- actual latest prototype ZIP previously audited in this thread
- `[4] Prototype Verbatim Chat.txt` — long-form provenance for the Phase 6–8 redesign, map passes, full-run audit, casualty policy, and numerical PVS
- latest explicit decisions in the active conversation after the verbatim archive

Historical proposals are not automatically current merely because they appear in verbatim evidence.

---

# 3. Status Legend

## LOCKED
Current decision within the scope explicitly named by the section. A `LOCKED Tutorial Flow` decision does **not** automatically become a locked main-game rule.

## PLANNED
Intended direction that remains part of the design but is not yet fully authored, implemented, or validated.

## TENTATIVE
Current working value/rule/hypothesis that must remain changeable after testing.

## OPEN
Not yet decided.

## PROTOTYPE ONLY
A validation or onboarding device specific to the prototype/Tutorial and not a general main-game rule.

## DEFERRED
Known design topic intentionally excluded from current Tutorial scope.

## SUPERSEDED
Older Tutorial direction replaced by a later explicit decision.

## IMPLEMENTED / RUNTIME CONFIRMED
Prototype implementation truth, not automatically main-game canon.

---

# 4. Main Game vs Prototype vs Tutorial

## 4.1 Main game

TMTB is intended as a Unity 3D Turn-Based Tactics game with continuous/free 3D movement and tactical-grid resolution. The full run remains:

```text
Village → Town → Castle → Final Resolution → Settlement → Meta Progression
```

The browser prototype is not a literal final-game representation.

## 4.2 Prototype representation classes

```text
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

A mechanic being validated must execute through the real prototype system. Tutorial choreography may control when and how the Player is exposed to a rule, but must not create a second fake combat ruleset.

## 4.3 Tutorial Stage structure

**LOCKED current direction:** the Tutorial is one continuous Stage. Phase transitions are authored learning-state transitions, not separate rooms/battles that reset tactical state by default.

```text
Phase transition ≠ Player Turn reset
Phase transition ≠ AP refresh
Phase transition ≠ HP heal
Phase transition ≠ Status clear
Phase transition ≠ teleport
```

Any reset/transition effect must be deliberately authored.

---

# 5. Core Tutorial Design Principles

## 5.1 Decision-first

```text
Intended decision → pressure → behaviour/system → numbers
```

Numbers exist to support decisions, not to create a script that only works at one exact damage value.

## 5.2 Real evidence before explanation

Preferred rhythm:

```text
Player acts
→ actual system responds
→ consequence becomes readable
→ one short explanation
→ Player applies knowledge again
```

## 5.3 Good play must not break the Tutorial

Tutorial scripting must not require the Player to make a hidden mistake. Controlled exercises are allowed when they are transparent and explicitly Tutorial-driven.

## 5.4 Early lessons isolate; late lessons compose

Phase 1–7 may use controlled windows to guarantee essential evidence. Phase 8 deliberately removes tactical guidance and becomes a normal-combat graduation test.

## 5.5 No fake combat rules

Examples of rules the Tutorial must **not** falsely teach:

- “Charging enemies cannot be attacked.”
- “Spear cannot be attacked while you are learning Cover.”
- “Buildings can only be attacked after this Tutorial prompt.”
- “Shockwave always Stuns Guard.”

If an action is temporarily unavailable because a controlled teaching beat is active, that is a **Tutorial Input Gate**, not combat invalidity.

---

# 6. Tutorial Taxonomy and Evidence Model

These concepts remain separate:

```text
Learning Block
Tutorial Phase
Tutorial Task
Learning Evidence
Objective
Victory Condition
Wave
```

A Tutorial Task is not an Objective. An Objective is not a Victory Condition. A Phase is not automatically a Wave.

For real mechanics, the broad learning progression is:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

Not every mechanic requires all four beats inside one Phase; later Phases can provide transfer evidence for mechanics introduced earlier.

---

# 7. Current Tutorial Curriculum — 8-Phase Working Architecture

The older seven-Phase authored mapping is **SUPERSEDED for the current Tutorial design**.

The current architecture is:

| Phase | Current Learning Contract | Status |
|---|---|---|
| 1 | Control & Party Orientation | Implemented + runtime-confirmed |
| 2 | Shared AP & Tactical Movement | Implemented + runtime-confirmed |
| 3 | Turn / Intent / Basic Combat | Implemented + runtime-confirmed |
| 4 | Tactical Range & Offensive Cover | Implemented + runtime-confirmed |
| 5 | Dynamic Threat & Shared AP Application | Core implemented + runtime-confirmed |
| 6 | Spear, Defensive Cover & Objective Introduction | Current paper design |
| 7 | Status & Temporal Threat | Current paper design |
| 8 | Wave & Combined Pressure / Graduation | Current paper design |

**Status clarification:** the **eight-Phase authored architecture is TENTATIVE as a production-final count**, but it is the current working baseline for continuation. The curriculum/dependency mapping is much more established than the exact number of Phase boundaries.

The exact production-final number of authored Tutorial Phases remains changeable if future testing reveals a cognitive-load problem.

---

# 8. Phase 1–5 Established Baseline

## Phase 1 — Control & Party Orientation

**Purpose:** orient the Player to party control and switching.

Current prototype includes camera/look as a **FLOW SIMULATION** for Unity onboarding, plus Guard/Archer switching and active-unit readability.

## Phase 2 — Shared AP & Tactical Movement

**Purpose:** establish party-wide Action Point economy and Movement commitment.

Key rules already validated in runtime:

- Team AP = Living Player Units × 2.
- AP does not carry.
- Leaving the unit's starting position commits 1 Team AP.
- Continued repositioning does not repeatedly spend AP.
- Returning to the starting position before movement lock refunds the committed movement AP.
- AP belongs to the party, not the selected unit.
- Movement Range is distinct from AP cost.

## Phase 3 — Turn / Intent / Basic Combat

**Purpose:** establish turn rhythm, first Sword readability, basic Attack, and Movement Lock.

Key learning:

- Global End Turn.
- Unused AP may be discarded.
- Player Turn vs Enemy Turn.
- Sword attacks nearest valid Player and seeks melee engagement.
- Intent shows current plan/current target.
- AP and starting positions refresh on a new Player Turn.
- Attack spends AP and locks that unit's Movement for the remainder of the Player Turn.
- Attack does **not** Exhaust the unit.

A continuity adjustment already implemented moved the Phase 3 guided Guard position to local `(4,1)` to support the later Phase 5 geometry.

## Phase 4 — Tactical Range & Offensive Cover

**Purpose:** teach Archer ranged positioning, Attack Range (ATR), and Cover from the attacker's perspective.

Player experiences:

```text
Outside ATR
→ reposition
→ Full Cover relationship
→ Partial Cover relationship
→ clear/no-Cover relationship
→ actual Archer Attack
```

### LOS status

**DEFERRED from current Tutorial curriculum.**

The prototype may still contain a LOS validation instrument and canonical v3.1 contains historical/current LOS assumptions, but the Tutorial must not teach LOS until the main-game rule has been deliberately designed/reviewed.

This does **not** mean LOS has been formally removed from the overall main game.

## Phase 5 — Dynamic Threat & Shared AP Application

**Core status:** **IMPLEMENTED + RUNTIME CONFIRMED.**

Current confirmed prototype endpoint:

```text
Guard   19 HP @ local (5,3)
Archer   9 HP @ local (6,4)
Sword    8 HP @ local (4,3)
Team AP  2/4
Sword Intent → Guard
```

The revised core proves:

- actual Dynamic Intent Guard → Archer after Guard reposition;
- Sword nearest-target behaviour, not hidden Taunt;
- Shared AP can be concentrated into repeated Archer attacks;
- Attack Movement Lock does not equal Exhaustion;
- real Enemy consequence against Archer;
- recovery positioning;
- actual Intent redirects back to Guard through board state.

The old broad prompt `Respond to the threat.` is **SUPERSEDED**.

### Intended Phase 5 exit — NOT YET IMPLEMENTED

Current design continuation:

```text
Guard Attack Sword
8 → 5
AP 2 → 1

Archer Attack Sword
5 → 0
AP 1 → 0
```

This is intended as the final confirmation that remaining Shared AP can be used coordinatively across units.

**Implementation gap:** current `eliminate_all` handling may produce immediate Victory on the last Sword death. Tutorial progression must be migrated so this death advances content instead of ending the full Tutorial.

---

# 9. Phase 6 — Spear, Defensive Cover & Objective Introduction

## 9.1 Learning contract

Phase 6 introduces three related competencies in sequence rather than simultaneously:

1. **Basic ranged enemy pressure** — Spear.
2. **Defensive Cover** — Cover can reduce incoming ranged damage.
3. **Objective / Structure literacy** — some structures can become combat targets and Objectives.

LOS is not part of this lesson.

## 9.2 Phase entry

Working transition:

```text
Phase 5 Sword defeated with Team AP reaching 0
→ Region B becomes active
→ expanded battlefield is revealed
→ Spear becomes the new isolated threat
→ Player ends the current Player Turn naturally
→ first Spear behaviour is observed on the following Enemy Turn
```

There is no magical AP refresh merely because the Phase changed. This preserves the existing rule that Phase transition and combat-turn transition are different things.

No Wave Telegraph is used. A new Tutorial enemy/content arrival is not automatically a gameplay Wave.

## 9.3 Spear baseline role

Current design direction:

- Target Rule: nearest valid Player.
- Ranged role.
- Seeks an effective ranged engagement.
- Prefers to operate near the maximum effective ATR when possible.
- If too close, it can back away.
- If too far, it approaches.
- It may reposition even when an Attack is technically valid if the current range is suboptimal.

Player-facing language should remain simple, e.g. Spear attacks from range and prefers to keep distance. Internal scorer terminology does not belong in Tutorial copy.

Actual Spear scorer/implementation is **not yet prototype implementation truth**.

## 9.4 Defensive Cover teaching sequence

The lesson deliberately uses **two real Spear attacks**.

### Exposure 1 — clear/uncovered

Spear naturally reaches a valid firing relationship and attacks Guard without defensive Cover.

This establishes the baseline incoming damage.

### Controlled defensive-Cover drill

After the clear hit:

```text
Tutorial Input Gate ON
→ guide Guard into designated Partial Cover relationship
→ ask Player to End Turn
→ normal Spear AI resolves the next activation
→ second real Attack receives actual Partial Cover effect
→ Cover consequence becomes readable
```

Player choreography may be controlled; Spear combat behaviour must remain normal. Spear must not be sent to a Tutorial-only waypoint.

### Current paper micro-geometry v0.7

```text
Spear initial S0      = (10,8)
First firing P1       ≈ (8,10)
Guard Cover G1        = (7,11)
Partial Cover O30     = (9,11)
Second firing P2      ≈ (10,11)
```

`P1` and `P2` are expected normal-AI outcomes, not authored movement destinations.

Current paper also predicts Guard as the initial Spear target from the Phase 5 exit geometry, without a Tutorial-only retarget.

Candidate paper routes used during geometry analysis were:

```text
S0 (10,8)
→ (10,9)
→ (10,10)
→ (9,10)
→ P1 (8,10)

P1 (8,10)
→ (9,10)
→ (10,10)
→ P2 (10,11)
```

These routes illustrate reachability under the current Move4 hypothesis; the eventual AI may choose an equivalent legal path.

The older candidate:

```text
Guard Cover (8,12)
P2 (10,10)
```

is **SUPERSEDED** because a normal max-range Spear could select a clear preferred shot and bypass the intended defensive-Cover evidence.

Current paper analysis indicates `(10,11)` is the unique strongest max-effective-range candidate from the designed state and yields an explicit line through O30 `(9,11)` toward Guard `(7,11)`. This still requires runtime verification against the eventual Spear scorer.

## 9.5 Objective introduction

After the covered hit, Objective UI becomes meaningful for the first time.

Working Objective:

> **Destroy the Hut**

Candidate Tutorial explanation:

> `Some structures can become combat objectives.`

The Hut is attacked through the normal combat Attack-targeting interaction, not a special `Destroy Objective` button.

Current paper candidate for the first Structure interaction:

```text
Archer (7,13)
→ (8,13)
→ (9,13)
→ (9,12)

Movement commitment: 1 Team AP
First Hut Attack:      1 Team AP
Expected AP:           4 → 3 → 2
```

This position also creates a plausible real Dynamic Intent transfer toward Archer, because advancing to attack the Objective may make Archer the nearest Player to Spear. That transfer is desirable reuse of Phase 5 knowledge, not a new Tutorial rule.

### First Structure Attack

The first actual Hut Attack is mandatory Tutorial evidence.

```text
Objective activates
→ guide first valid Attack on Hut
→ Attack resolves against Hut
→ Structure evidence complete
→ Tutorial Input Gate OFF
```

Only after this first actual Attack does full tactical-priority freedom begin.

This gate does **not** establish the general rule that structures are only targetable while an Objective is active. General Structure targetability remains OPEN.

## 9.6 Free priority after first Hut Attack

After the mandatory first Structure Attack, Player can choose:

- focus Hut;
- focus Spear;
- mix both;
- reposition / use Cover;
- allocate Shared AP across Guard and Archer.

No hidden correct order.

**Hard fairness constraint:** the guided Archer approach/first Hut Attack must not place Archer into an unavoidable one-shot/death state. If Spear retargets Archer, normal turn structure must still provide a meaningful response window before another lethal consequence. This is a tuning/geometry requirement, not a Tutorial immunity rule.

State-driven completion:

```text
Hut destroyed
AND
Spear defeated
```

If Hut dies first:

> Objective changes immediately to `Eliminate the remaining threat.`

If Spear dies first:

> Objective remains `Destroy the Hut.`

Objective changes may occur mid-turn.

## 9.7 Phase 6 exit

Once both required Phase 6 hostile/objective entities are resolved:

```text
Phase 6 complete
→ Region C opens
→ Tutorial Task: Proceed to the next area.
```

This transition task is not a new Objective or Phase. It normalizes variable Phase 6 exit positions before the controlled Blue exercise.

Blue must not start Charge while the Player is still walking from Region B.

**Pacing watch:** variable Phase-6 exit positions may create one or more low-pressure traversal turns before Region C staging. Do not solve this pre-emptively with teleport/reset; verify whether the `Proceed to the next area.` transition feels too empty in runtime.

---

# 10. Structure / Objective Design Contract

## 10.1 Current design direction

Structures/environment are intended to have functional tactical roles in TMTB, not merely decorative or Cover roles. The latest explicit Game Designer direction is that structures such as Huts may serve as important stage Objectives, including both destroy and protect use cases.

**Canonical migration note:** v3.1 currently lists `Eliminate All` as locked core and `Protect Target` / `Defeat Mini-Boss` as planned core; it does not yet carry `Destroy Structure` as a named Objective family. The 16 Aug structure direction is therefore **newer design intent that still needs deliberate canonical migration**, not something that should be retroactively claimed to have already existed in v3.1.

**User-confirmed Unity implementation fact:** the Unity project has already supported selecting a building as an Attack target. This baseline has not independently audited the Unity source, so treat that as confirmed user evidence rather than repository-audited implementation truth.

The Tutorial only needs one first literacy lesson: **Destroy Structure**.

Protect Structure does not need a separate Tutorial Phase now.

## 10.2 Hut paper representation

Current paper baseline:

```text
Hut footprint = 3×3
x11–13 / y9–11
one structure entity
one HP pool
```

It must **not** accidentally become nine independent targets.

## 10.3 Current OPEN Structure semantics

- Is a Structure always attackable when present, or only targetable in specific Objective/state contexts?
- How does a 3×3 Structure resolve Attack targeting: center, nearest footprint, authored attack points, or another model?
- Does destruction make the footprint walkable?
- What exact DEF/damage model should Structures use in Unity/main game?

The Tutorial flow must not depend on the destroyed 3×3 footprint becoming walkable.

---

# 11. Phase 7 — Status & Temporal Threat

## 11.1 Learning contract

Phase 7 must prove two mental models:

### Temporal threat

A threat may develop over multiple Enemy Turns and should influence decisions before its payoff occurs.

### Stun / capability restriction

A Stunned unit:

- remains selectable;
- cannot Move;
- cannot Attack;
- cannot Skill;
- cannot Hold;
- still counts as a Living Player Unit;
- therefore still contributes to Shared Team AP.

Stun is unit-capability denial, not party-resource denial.

## 11.2 Tutorial vehicle

Current Tutorial vehicle: **Blue candidate**.

Blue is still a **TENTATIVE SPECIAL ENEMY / PROTOTYPE VALIDATION VEHICLE**, not a locked Region-1 roster member.

Working behaviour:

```text
stationary
Charge
→ Shockwave
→ Stun
```

## 11.3 Region C activation

Phase 7 must not begin immediately when Phase 6 completes.

Working staging:

```text
Guard staging   = (12,4)
Archer staging  = (11,3)
Blue anchor     = (12,2)
```

Flow:

```text
Region C opens
→ Proceed to the next area
→ both required living Player Units reach staging
→ Blue is still inactive
→ End your turn to begin the exercise
```

Then, on the Enemy Turn, Blue becomes active and performs its first Charge.

This avoids a hidden Charge timer while the party is still travelling.

## 11.4 Charge presentation

Working PVS sequence:

```text
Enemy Turn: CHARGE 1/2
Player Turn: Intent = CHARGE 2/2
Enemy Turn: Charge 2 resolves
Player Turn: Intent = SHOCKWAVE
```

Important readability rule:

> `CHARGE 2/2` is still Charge. Do not prematurely show `NEXT: SHOCKWAVE`.

The payoff becomes Current Intent only when it is the actual current plan.

## 11.5 Controlled first Shockwave

When `SHOCKWAVE` becomes Current Intent, the threat area becomes readable.

Candidate instruction sequence:

> `Shockwave applies Stun to units inside its area.`

> `Move Archer out of the Shockwave area.`

> `Leave Guard in position for this exercise.`

Current paper safe position:

```text
Archer safe = (9,2)
```

Working Shockwave PVS geometry assumption:

```text
radial effective radius ≈ 2 tactical grids
```

This radius/metric is **TENTATIVE PVS**, not a final Blue size/range rule.

**Carried Blue-candidate behaviour from canonical v3.1:** the current Blue concept resolves Shockwave as an area effect that is not blocked by LOS, ignores Cover, and penetrates obstacles for area resolution. Blue itself remains a `TENTATIVE SPECIAL ENEMY CANDIDATE`; carrying this behaviour does not lock Blue into the Region-1 roster.

Expected geometry:

```text
Blue  (12,2)
Guard (12,4)   → inside
Archer (9,2)   → outside
```

Actual Shockwave must evaluate all units normally. There must be no `tutorial => stun Guard` combat special case.

## 11.6 Stun duration

Current prototype-validation candidate:

> **2 full Player Turns**

Player-facing result:

```text
Shockwave applies Stun
→ STUN 2 Player Turn
→ STUN 1 Player Turn
→ recovered before following Player Turn
```

This value is **TENTATIVE PVS**, not main-game-locked.

## 11.7 First Stunned Player Turn — Shared AP evidence

Expected state:

```text
Guard = STUN 2
Archer = normal
Living Player Units = 2
Team AP = 4/4
```

Required evidence:

```text
Select Guard
→ Guard remains selectable
→ Move/Attack/Skill/Hold unavailable
→ Team AP still reflects 2 living units
→ Switch Archer
→ Archer performs exactly ONE actual valid Attack on Blue
→ Shared AP visibly decreases
→ End Turn
```

Exactly one required Archer Attack is enough. The older idea of a second mandatory Blue Attack is **SUPERSEDED**.

## 11.8 Second Stunned Player Turn — duration evidence

After Blue begins a new Charge cycle:

```text
Guard = STUN 1
Blue  = CHARGE 2/2
```

Required lesson:

> Guard is still Stunned.

No second mandatory Blue Attack is required. This turn exists to prove duration, not repeat damage evidence.

## 11.9 Phase 7 release point

After the second Stunned turn:

```text
Enemy Turn: Blue completes Charge 2
→ new Player Turn
Guard recovered
Blue Current Intent = SHOCKWAVE
```

At this moment:

> **Phase 7 learning contract is complete.**

Controlled tactical restrictions end. Phase 8 starts from this live combat state.

---

# 12. Tutorial Input Gate

## 12.1 Definition

**LOCKED current Tutorial Flow principle:** `Tutorial Input Gate` is Tutorial orchestration used to guarantee mandatory learning evidence without changing normal combat rules.

It must be distinguishable conceptually and, where useful, visually from:

- Stun;
- Movement Lock;
- insufficient AP;
- invalid target/action;
- normal unit disable state.

## 12.2 Current controlled windows

### Phase 6 — defensive Cover

```text
first clear Spear hit
→ gate ON
→ Move Guard to required Cover relationship
→ End Turn
→ real Spear covered Attack
```

### Phase 6 — first Structure interaction

```text
Objective appears
→ guide first Hut Attack
→ actual Hut Attack resolves
→ gate OFF
→ free tactical priority
```

### Phase 7 — Blue first-cycle drill

The first Charge/Shockwave/Stun exercise remains controlled until Phase 7's Stun-duration learning contract is complete.

## 12.3 Phase 8

No tactical Tutorial Input Gate remains in the final free-play portion.

---

# 13. Phase 8 — Wave & Combined Pressure / Graduation

## 13.1 Learning contract

Phase 8 introduces one final new mechanic:

> **Wave Telegraph / incoming pressure.**

Everything else is transfer and composition.

Player must use normal information and previously learned systems with progressively reduced guidance.

## 13.2 Phase 8 entry

Expected working state:

```text
Archer ≈ (9,2)
Guard  ≈ (12,4)
Blue   = (12,2)
Guard recovered
Blue Current Intent = SHOCKWAVE
```

Blue is now a normal combat threat. Player may avoid, burst, accept risk, or use another legal solution.

## 13.3 Wave count and enemy composition

Current Tutorial paper baseline:

```text
Wave 1 = 1 Sword
Wave 2 = 1 Spear
Blue   = carried from Phase 7 if still alive
```

Maximum possible simultaneous hostiles:

> **Blue + Sword + Spear = 3**

No Wave 3 / fourth enemy is currently justified for the first Tutorial prototype.

Pressure roles:

- Blue → temporal/spatial pressure.
- Sword → melee/current-target pressure.
- Spear → ranged/spacing/Cover pressure.

## 13.4 Wave reservation rule

**CARRIED / LOCKED broader Wave direction from v3.1:** while a Wave Telegraph reservation is active, the reserved spawn position:

- is passable for traversal;
- is invalid as a final occupied position;
- is reserved against both Player and Enemy final occupancy.

Reservation is not a wall/obstacle. A purely technical emergency fallback remains an implementation detail, not a player-facing rule.

The reservation must exist before existing enemies resolve movement during the preparation Enemy Turn, so those enemies cannot legally finish on the future spawn position when an alternative exists.

## 13.5 Wave timing — locked framework vs Tutorial candidate

The following pieces are already **LOCKED CURRENT DIRECTION** at the broader Wave-design level:

```text
Telegraph
→ one Player preparation window
→ Spawn
```

At the spawn moment:

- the enemy appears;
- Current Intent becomes readable;
- the spawn does not carry an immediate offensive Movement/Attack.

What remains open at the broader-system level is the exact post-spawn response / first-normal-activation lifecycle.

### Current Tutorial PVS lifecycle candidate

```text
Player Turn
Wave Telegraph visible
→ one preparation window

Enemy Turn
existing enemies activate normally
→ Wave enemy spawns at END of Enemy Turn
→ no attached offensive Movement/Attack

New Player Turn
Player receives response opportunity

Following Enemy Turn
spawned enemy receives first normal activation
```

Only the **exact spawn placement in the Enemy Turn and the delayed first-normal-activation timing** are Tutorial PVS candidates here; they are not universal main-game locks.

## 13.6 Wave 1 — guided exposure

Reserved Sword spawn:

```text
(12,5)
```

Candidate first-wave copy:

> `An enemy is about to enter the battlefield.`

> `You can move through the marked area, but you cannot end your movement there.`

> `Prepare for the incoming enemy.`

This occurs while Blue already threatens `SHOCKWAVE`.

The Player is no longer given the answer to Shockwave; they must transfer Phase 7 knowledge.

Good play may include:

- repositioning out of Shockwave;
- bursting Blue before payoff;
- intentionally accepting risk for another priority.

Blue is not Tutorial-immortal in Phase 8.

## 13.7 Wave 2 — unassisted confirmation and free-play release

Reserved Spear spawn:

```text
(15,2)
```

When Wave 2 Telegraph appears:

> **Tutorial Prompt disappears.**

Top-right Objective becomes the high-level instruction:

> **ELIMINATE ALL REMAINING THREATS**

This is the start of true free play, even though Spear has not spawned yet.

No more tactical Tutorial instructions such as:

- Move here.
- Attack this.
- Take Cover.
- Switch unit.
- Avoid Shockwave.

Normal combat readability remains active:

- Team AP;
- Turn;
- Objective;
- roster;
- normal control hints;
- Enemy Intent / Current Target;
- Charge;
- Status;
- Cover/range feedback;
- Wave Telegraph.

`No guidance` does not mean `no information`.

## 13.8 Candidate Phase 8 timeline

```text
P8-T1
Blue = SHOCKWAVE
Wave 1 Sword Telegraph
first Wave explanation
Player prepares

E8-T1
Blue resolves if alive
Sword spawns at (12,5)
no attached action

P8-T2
Blue = CHARGE 1/2 if alive
Sword normal Intent
Wave 2 Spear Telegraph at (15,2)
Tutorial Prompt OFF
Objective = ELIMINATE ALL REMAINING THREATS
FREE PLAY begins

E8-T2
existing enemies activate sequentially using normal Spawn Order
Spear spawns at end of Enemy Turn
no attached action

P8-T3
possible maximum:
Blue = CHARGE 2/2
Sword active
Spear active

E8-T3
normal sequential activations

P8-T4
if Blue survives:
Blue may return to SHOCKWAVE
```

This is a working timeline, not a hard turn script.

## 13.9 Final difficulty / duration target

Current predicted target:

> approximately **2–4 Player Turns after guidance disappears**, with ~3–4 Player Turns a healthy current numerical prediction.

This is not a timer.

Design intent:

- typical run should experience at least one meaningful combined Enemy Turn;
- exceptional optimized play may resolve threats earlier;
- if default play always deletes all pressure before it acts, tuning/geometry is too bursty;
- if the final section routinely lasts 5+ turns without new decisions, it is becoming too long/spongy.

## 13.10 Valid branches

The Tutorial must remain valid if:

- Blue is killed early in Phase 8;
- Sword is killed before Spear spawns;
- Spear is eliminated before its first activation due to strong telegraph-based positioning;
- Guard is Stunned again;
- both Player units are Stunned by a later real Shockwave;
- a Player unit is defeated after Phase 8 begins;
- the Player retreats toward Region B, subject to normal tactical consequences.

If all living Player Units are Stunned, normal combat rules still leave **Global End Turn** available. Tutorial flow must not softlock merely because Team AP exists but no unit can spend it.

Good play must not fail the Tutorial merely because the exact maximum three-enemy composition never materializes.

---

# 14. Victory Contract

Tutorial Victory must **not** be equivalent to `enemyCount == 0`.

Current working contract:

```text
required Tutorial evidence complete
AND
all required hostile entities resolved
AND
no required Wave pending
```

Example:

```text
Blue dead
Sword dead
Spear Wave pending
```

→ **No Victory yet.**

When Wave 2 resolves and all required hostiles are defeated, Tutorial Victory is valid.

---

# 15. Consolidated 16×16 Paper Battlefield

## 15.1 Status

**PAPER BASELINE / TENTATIVE IMPLEMENTATION TARGET.**

This is not automatically the final Unity level scale. It is a prototype/tutorial coordinate envelope that keeps the existing Phase 1–5 arena intact while providing enough space for Phase 6–8 validation.

## 15.2 Region model

```text
A = Region A — Phase 1–5 existing courtyard
B = Region B — Phase 6
C = Region C — Phase 7–8
X = permanent non-playable / void
```

`X` means permanent non-tactical space. It is **not** a wall, obstacle, Full Cover, or future locked floor.

A future playable Region that has not yet opened is in a separate **locked/inactive state**. Future locked regions must be truly inactive to pathfinding, Movement, targeting, Intent, Objectives, and spawns until unlocked. They must not be merely invisible but systemically active.

Once unlocked, old regions remain active. Battlefield area expands rather than replacing/closing earlier space.

## 15.3 Full paper blockout

Legend:

```text
X = non-playable/void
A/B/C = region floor
P = Partial Cover / O30
F = Full Cover
H = Hut footprint
U = Blue anchor
1 = Wave 1 Sword reservation
2 = Wave 2 Spear reservation
```

```text
       x00 x01 x02 x03 x04 x05 x06 x07 x08 x09 x10 x11 x12 x13 x14 x15
     ┌─────────────────────────────────────────────────────────────────────┐
y00  │ X   X   X   X   X   X   X   X   X   X   C   C   C   C   C   X  │
y01  │ X   X   X   X   X   X   X   X   X   C   C   C   C   C   C   C  │
y02  │ X   X   X   X   X   X   X   X   X   C   C   C   U   C   C   2  │
y03  │ X   X   X   X   X   X   X   X   X   C   C   C   C   C   P   C  │
y04  │ X   X   X   X   X   X   X   X   X   C   C   C   C   C   C   C  │
y05  │ X   X   X   X   X   X   X   X   X   X   C   C   1   C   C   X  │
y06  │ X   X   X   X   X   X   X   X   X   X   X   B   B   B   X   X  │
y07  │ X   X   X   X   X   X   X   X   X   X   B   B   B   B   B   X  │
y08  │ X   X   X   X   X   X   X   X   X   X   B   B   B   B   B   X  │
y09  │ X   A   A   A   A   A   A   A   A   X   B   H   H   H   B   X  │
y10  │ X   A   A   A   A   A   A   A   A   B   B   H   H   H   B   X  │
y11  │ X   A   A   A   P   A   A   A   A   P   B   H   H   H   B   X  │
y12  │ X   A   A   A   F   A   A   A   A   B   B   B   B   B   B   X  │
y13  │ X   A   A   A   A   A   A   A   A   B   B   B   B   B   X   X  │
y14  │ X   A   A   A   A   A   A   A   A   X   X   X   X   X   X   X  │
y15  │ X   X   X   X   X   X   X   X   X   X   X   X   X   X   X   X  │
     └─────────────────────────────────────────────────────────────────────┘
```

## 15.4 Region A preservation

Region A remains exact existing 8×6 Tutorial content embedded globally at:

```text
x1–8
y9–14
```

Paper transform:

```text
globalX = localX + 1
globalY = localY + 9
```

Examples:

| Existing/local content | A-local | Global paper |
|---|---:|---:|
| Existing O30 | `(3,2)` | `(4,11)` |
| Existing Full Cover | `(3,3)` | `(4,12)` |
| Phase 5 Guard endpoint | `(5,3)` | `(6,12)` |
| Phase 5 Archer endpoint | `(6,4)` | `(7,13)` |
| Phase 5 Sword endpoint | `(4,3)` | `(5,12)` |

The global relocation does not change Phase 1–5 design intent, but implementation migration will require consistent coordinate transformation and full regression testing.

## 15.5 Region B key content

```text
Spear S0          (10,8)
Spear P1 ≈        (8,10)
Guard Cover G1    (7,11)
O30               (9,11)
Spear P2 ≈        (10,11)
Archer Hut attack (9,12)
Hut footprint     x11–13 / y9–11
```

## 15.6 Region C key content

```text
Blue anchor       (12,2)
Guard staging     (12,4)
Archer staging    (11,3)
Archer safe       (9,2)
Wave 1 Sword      (12,5)
Wave 2 Spear      (15,2)
Final O30         (14,3)
```

The final O30 provides a possible defensive relationship against the Spear without being required for the solution.

The Phase 7/8 layout must not depend on Cover blocking Shockwave. Under the current canonical Blue-candidate behaviour, Shockwave **ignores Cover, is not blocked by LOS, and penetrates obstacles for area resolution**. The paper layout remains intentionally robust to that rule.

**Pass-4 correction:** an earlier paper-audit remark described `Shockwave vs Cover` as OPEN. That remark was not an explicit Game Designer decision and conflicts with the current v3.1 Blue-candidate definition, so it must not be carried forward as current design intent.

---

# 16. Casualty and Checkpoint Policy

## 16.1 Required Tutorial Actors

**LOCKED current Tutorial policy:** until the two-unit curriculum is complete at the end of Phase 7, Guard and Archer are Required Tutorial Actors.

```text
requiredTwoUnitCurriculumComplete == false
AND
Guard or Archer defeated
→ TRAINING FAILED
```

This is a Tutorial curriculum rule, **not** a general main-game casualty/permadeath rule.

## 16.2 Before Phase 8

If either required actor is defeated:

- Training Failed triggers immediately after the defeat event resolves;
- Tutorial restores the latest safe checkpoint;
- no mid-combat revive;
- no checkpoint heal/reset bonus.

Underlying Shared AP rules do not change; Tutorial simply does not continue an invalid curriculum state.

## 16.3 Phase 8 onward

Once Phase 7 completes:

> required-two-unit protection ends.

Single-unit casualty is valid play.

Example:

```text
Archer defeated
Guard alive
Living Units = 1
Team AP next Player Turn = 2
```

The Player may continue and achieve Tutorial Victory with one survivor.

Only full-party defeat stops the final encounter.

## 16.4 Late Tutorial checkpoints

**Current accepted working checkpoint candidates** (not production-final checkpoint granularity):

### CP6 — Phase 6 entry

Captured after Phase 5 learning completion / Sword resolution and before Phase 6 teaching content proceeds.

### CP7 — Phase 7 exercise entry

Captured after Phase 6 is complete and both living required actors have reached Phase 7 staging, before Blue first activates.

### CP8 — Phase 8 / final encounter entry

Captured after Phase 7's learning contract completes, at the live state where Guard has recovered and Blue is ready with `SHOCKWAVE` before/with Wave 1 introduction.

Checkpoint restore must be a tactical snapshot, not an HP preset. Relevant state includes, at minimum:

- unit positions;
- HP/alive state;
- Status;
- movement/action state;
- Team AP;
- Turn owner/state;
- StartGrid where relevant;
- enemy HP/position/state/status;
- Current Target / Intent;
- Charge progress;
- active regions;
- Tutorial Phase/Task/evidence;
- Objective state;
- Wave pending/reservation state.

Exact earlier Phase 1–5 checkpoint/retry granularity should be audited against current implementation before migration.

---

# 17. Numerical PVS Baseline

## 17.1 Status

All values in this section are **TENTATIVE PVS** unless explicitly identified as existing implementation values. They are hypotheses for prototype validation, not locked main-game balance.

## 17.2 Current recommended numerical candidate

| Entity | HP | ATK | DEF | Move | ATR | Notes |
|---|---:|---:|---:|---:|---:|---|
| Guard | 25 | 5 | 4 | 3 | 1.5 | existing player baseline |
| Archer | 18 | 7 | 1 | 4 | 3 | existing player baseline |
| Phase 5 Tutorial Sword | **31** | **8** | 2 | 3 | 1.5 | proposed retune; implementation currently differs |
| Phase 6/8 Spear | **15** | **6** | **2** | **4** | **3** | PVS candidate |
| Hut | **28 effective HP** | — | **0 candidate** | — | — | structure semantics still open |
| Blue | **25** | — | **2** | stationary | — | Shockwave = Stun; no damage current PVS |
| Wave 1 Sword | 16 | 6 | 2 | 3 | 1.5 | normal known Sword |

Other current PVS parameters:

```text
Partial Cover O30 = 30%
Stun = 2 full Player Turns
Blue Charge = 2 activations
Shockwave ≈ radial radius 2
```

Charge count, Stun duration, and Shockwave shape/radius remain independently changeable.

## 17.3 Phase 5 design ↔ implementation conflict

### Current confirmed prototype implementation

```text
Tutorial Sword HP 31
Tutorial Sword ATK 10

confirmed Phase 5 endpoint:
Guard 19
Archer 9
```

### Current numerical PVS recommendation

```text
Tutorial Sword HP 31
Tutorial Sword ATK 8

predicted Phase 5 carry:
Guard 21
Archer 11
```

The ATK8 retune was proposed to preserve late-Tutorial attrition without requiring hidden healing or artificially weak later enemies.

Therefore:

> downstream predictions using Guard21 / Archer11 are **not runtime-confirmed** until the prototype is migrated and retested.

This conflict must remain explicit in implementation planning.

## 17.4 Phase 6 predicted damage relationship

Candidate Spear ATK6 / Player DEF gives:

```text
Spear → Guard clear   = 2
Spear → Guard O30     = 0
Spear → Archer clear  = 5
Spear → Archer O30    = 3
```

The defensive-Cover lesson therefore predicts a `2 → 0` comparison on Guard.

Systemically this is safe, but **Perceived readability must be tested**: Player must not incorrectly infer that Partial Cover always nullifies damage.

## 17.5 Hut durability hypothesis

Hut effective HP28 with Archer ATK7 gives:

```text
4 Archer-equivalent hits to destroy
```

After the mandatory movement + first guided structure Attack, a full-focus first Objective turn can reach about three Archer hits total, leaving the Hut alive for at least one Enemy response opportunity.

Target experience:

> meaningful effort, not one-hit trivial, not HP sponge.

## 17.6 Spear durability hypothesis

Spear HP15 / DEF2:

```text
Archer damage = 5
Guard damage  = 3
```

This allows Hut-first, Spear-first, and mixed priority branches to complete on similar rough pacing without a hard-coded correct order.

## 17.7 Predicted HP trajectory with ATK8 retune

Expected reasonable path:

```text
START
Guard 25
Archer 18

After retuned Phase 5
Guard 21
Archer 11

After mandatory P6 Cover lesson
Guard 19
Archer 11

After one clear Objective-phase Spear hit
Guard 19
Archer 6

Phase 7
no HP damage in current PVS
Stun only

Phase 8 entry
Guard ~19
Archer ~6
```

Two Spear clear hits to Archer before Phase 7 would leave Archer critical but alive; a third clear hit would cause Training Failure under the current casualty policy.

## 17.8 Blue durability / Phase 8 trade-off

Blue candidate:

```text
HP25 / DEF2
Archer damage = 5
```

Exactly one required Archer Attack in Phase 7 predicts:

```text
Blue 25 → 20
```

At Phase 8 entry, a useful candidate decision appears:

### Avoid

```text
Move Guard out of Shockwave = 1 AP
Archer attacks Blue ×3 = 3 AP
Blue 20 → 5
Blue survives
```

### Burst

```text
Archer attacks Blue ×4
Blue 20 → 0
```

Player trades spatial preparation for full damage commitment.

This relationship is a PVS hypothesis, not a scripted requirement.

## 17.9 Final free-play prediction

Current health/damage envelope predicts roughly **3–4 Player Turns** for a typical clean final resolution, inside the target ~2–4 range.

Single-survivor Guard remains numerically viable with 2 Team AP under current enemy ATK6 candidates.

### Numerical WATCH items

- Archer AP funnel / repeated Attack becoming a universal dominant answer.
- `2 → 0` Partial Cover perception.
- Region-B retreat serializing the final encounter.
- full-party second Stun becoming practically unrecoverable.
- expected number of Spear activations before death.
- final free-play TTK after actual movement/targeting constraints.

---

# 18. UI / UX and Tutorial Copy Requirements

## 18.1 Unity HUD reference hierarchy

Current working information roles:

```text
Top-left     = Team AP
Top-center   = Turn counter / Turn information
Top-right    = Mission / Objective
Bottom-left  = roster
Bottom-right = currently available combat control hints
Center       = Tutorial instructional/explanatory text when needed
```

Bottom-right combat hints are for controls such as `WASD`, `Space`, `Q`, not Tutorial sentences.

Prototype web may continue using its dedicated Tutorial Prompt area rather than copying Unity presentation literally.

## 18.2 Objective visibility

Objective UI can remain dormant/non-meaningful through Phase 1–5.

Phase 6 is the first time Objective literacy becomes a Tutorial learning target.

After Phase 6 completes, `Proceed to the next area.` is a **Tutorial Task**, not an Objective. Exact top-right presentation while Phase 7 runs (clear/hide/completed Objective treatment) remains UI/UX OPEN; do not leave a stale Phase-6 Objective implying it is still active.

In Phase 8, when Tutorial Prompt disappears, Objective remains as the high-level goal.

## 18.3 Tutorial text rules

Prototype Tutorial copy should be:

- English;
- short;
- simple;
- informative;
- actionable;
- one active instruction at a time;
- written with player-facing terms rather than implementation terms;
- truthful to actual combat rules;
- progressively less prescriptive.

Introduce an acronym before using it repeatedly:

> `Action Point (AP)`

> `Attack Range (ATR)`

Use:

> `starting position`

rather than internal `StartGrid` in player-facing text.

Use:

> `Movement Range`

rather than implementation terminology.

Avoid fake rules, over-explanation, permanent checklists, and long paragraphs.

Instruction transition should normally be:

```text
instruction
→ valid evidence
→ subtle success confirmation
→ brief fade/replace
→ next instruction
```

Do not use a large `Phase Complete` modal by default. The existing prototype convention of roughly `~2 sec` for short explanatory beats is a **prototype presentation reference**, not a locked Unity timing.

## 18.4 Candidate late-Tutorial copy

Examples, not final UI/UX lock:

### Phase 6

> `Ranged attacks can be reduced by Cover.`

> `Move Guard into Cover.`

> `Some structures can become combat objectives.`

> `Destroy the Hut.`

### Phase 7

> `This enemy is charging.`

> `Charge builds over multiple Enemy Turns.`

> `Shockwave applies Stun to units inside its area.`

> `Move Archer out of the Shockwave area.`

> `Leave Guard in position for this exercise.`

> `Guard is Stunned.`

> `Stunned units cannot act, but they still contribute Team AP.`

> `Guard is still Stunned.`

> `Guard has recovered.`

### Phase 8 first Wave

> `An enemy is about to enter the battlefield.`

> `You can move through the marked area, but you cannot end your movement there.`

> `Prepare for the incoming enemy.`

After Wave 2 Telegraph, no tactical Tutorial copy remains.

---

# 19. Current Prototype Implementation Truth — 16 Aug 2026

Known confirmed state before this new design migration:

```text
V1 Shared AP / Player Turn Economy       CLOSED / runtime-confirmed
V2 Player Action Commitment              CLOSED / runtime-confirmed
V3 Tactical Space                        CLOSED for current PVS / runtime-confirmed
V4 Enemy Readability & Execution         CLOSED for Sword-only PVS / runtime-confirmed

Tutorial dedicated architecture          implemented
Tutorial Phase 1                         implemented + runtime-confirmed
Tutorial Phase 2                         implemented + runtime-confirmed
Tutorial Phase 3                         implemented + runtime-confirmed
Tutorial Phase 4                         implemented + runtime-confirmed
Tutorial Phase 5 Core                    implemented + runtime-confirmed
```

Current source/confirmed runtime still reflects Tutorial Sword HP31 / ATK10 and the Phase 5 endpoint Guard19 / Archer9.

---

# 20. Design Documentation and Implementation Gaps

## 20.1 Canonical design-document migration gap

This supporting baseline now contains Tutorial decisions newer than canonical v3.1, especially:

- the current eight-Phase authored mapping;
- LOS deferred from current Tutorial curriculum and broader main-game LOS requiring later review;
- Phase 6 Spear + defensive Cover + Destroy Structure literacy;
- the newer structure/objective direction, including Destroy Structure;
- Tutorial Input Gate semantics;
- controlled one-unit Stun Tutorial flow;
- Tutorial casualty/checkpoint policy;
- current 16×16 paper battlefield and late-Tutorial composition.

These should be migrated deliberately into the appropriate next canonical Game Design Context / Decisions snapshot after this supporting baseline is approved. Do not silently treat this supporting document as having already replaced all v3.1 sections.

## 20.2 Prototype implementation gap

The following expanded Tutorial systems must **not** be claimed as implemented without a fresh repository/runtime audit:

- final Phase 5 Sword kill without ending Tutorial;
- progression beyond current `eliminate_all` Victory handling;
- expanded 16×16 Tutorial battlefield;
- Region A/B/C lock/unlock system;
- Phase 6 Spear implementation;
- Spear effective-range movement scorer;
- Structure combat target/entity representation;
- 3×3 Hut target semantics;
- Destroy Structure Objective;
- mid-turn Objective changes;
- Phase 6 Tutorial Input Gate extensions;
- Stun runtime/status system;
- Blue enemy / state machine;
- Charge;
- Shockwave area/effect;
- two-Player-Turn Stun duration;
- Phase 7 controlled drill;
- Wave Telegraph;
- reserved Wave spawn occupancy rules;
- Wave spawn lifecycle;
- pending-Wave-aware Victory logic;
- Required Tutorial Actor casualty flow;
- CP6/CP7/CP8 tactical checkpoint snapshots;
- Phase 8 single-survivor continuation;
- current numerical retuning candidates.

**This needs verification against actual source/runtime before implementation work begins.**

---

# 21. Recommended Implementation Migration Order

This is a planning aid, not a coding instruction. Actual implementation work must begin from a fresh repository audit.

Given the preferred workflow of coherent larger batches rather than tiny edit/test loops, the design naturally groups into:

## Batch A — Continuous Tutorial Stage Expansion Foundation

- resolve Phase 5 final Sword kill without Tutorial Victory;
- expand/relocate Tutorial map while preserving Region A content;
- introduce region active/locked semantics;
- establish Phase progression / Objective progression architecture needed beyond `eliminate_all`.

## Batch B — Phase 6

- Spear;
- effective ranged movement/scorer;
- revised defensive-Cover geometry;
- Tutorial Input Gate extension;
- Structure target entity / Hut;
- Destroy Structure Objective;
- free priority + Phase 6 completion;
- CP6/CP7 relevant transition state.

## Batch C — Phase 7

- Stun;
- Blue;
- Charge;
- Shockwave;
- controlled one-unit Stun exercise;
- two-turn Status timing;
- one required Archer Attack;
- Phase 7 release;
- casualty prerequisite / CP7.

## Batch D — Phase 8 / Graduation

- Wave Telegraph/reservation;
- Wave spawn lifecycle;
- Sword/Spear Wave content;
- pending-Wave-aware Victory;
- Tutorial guidance release;
- Phase 8 casualty rules / CP8;
- final free-play integration.

Each batch should be followed by one integrated main-path runtime test plus relevant regression coverage before advancing.

---

# 22. OPEN / TENTATIVE / Validation Questions

The following should remain explicitly unresolved rather than silently inferred:

## Main-game / broader system

- final main-game LOS rule and whether/how it exists in Unity combat;
- Hold final effect;
- Skill onboarding / final Skill systems;
- final main-game Stun duration;
- final Blue/Charger roster status;
- final universal Wave lifecycle;
- long-term Structure Objective taxonomy and enemy-vs-Structure targeting rules.

## Tutorial / prototype validation

- exact Spear movement scorer outcome in real runtime;
- whether Spear Move4 / ATR3 remains correct after testing;
- whether Spear ATK6 makes defensive Cover sufficiently readable;
- Hut exact HP/DEF/damage model after perceived testing;
- Structure targetability timing;
- 3×3 Hut attack-point semantics;
- destroyed Hut walkability;
- Blue exact HP/DEF after testing;
- Charge count beyond current 2-activation PVS;
- exact Shockwave footprint / distance metric;
- final Stun display/tick presentation;
- Wave Telegraph archetype information level;
- reserved-spawn fallback handling if authored tile unexpectedly cannot be reserved;
- Region B retreat/funnel exploit in Phase 8;
- Phase 6 → Region C traversal pacing / empty-turn risk;
- full-party second-Stun difficulty;
- Archer repeated-Attack/AP-funnel dominance;
- exact early Tutorial checkpoint/retry structure;
- exact UI treatment of Tutorial Input Gate.

---

# 23. Superseded / Corrected Tutorial Decisions and Proposals

Do not revive these without a new explicit decision. `CORRECTED` items below may be paper-audit mistakes rather than former Game Designer decisions:

1. **Seven authored Tutorial Phases** as the current continuation map.
2. **LOS as a required current Tutorial lesson.** LOS is deferred from Tutorial scope.
3. **Old Phase 6 = Status & Temporal Threat** before Spear/Objective curriculum was added.
4. **First Status source remains unresolved** for current Tutorial flow. Blue now fills the current Tutorial validation role.
5. **Completely natural first Stun avoidance** as sufficient coverage. Current Tutorial guarantees one-unit Stun through a transparent controlled drill.
6. **`Respond to the threat.`** as Phase 5 ending.
7. **Phase 6 Guard Cover `(8,12)` / Spear P2 `(10,10)`.** This geometry failed adversarial analysis.
8. **Forcing Spear to a Tutorial waypoint.** Enemy behaviour must remain real.
9. **Two mandatory Archer attacks on Blue during the Stun lesson.** Current required evidence is exactly one.
10. **Blue becoming fully free immediately after the first Shockwave.** Current controlled drill remains active until Phase 7 completes.
11. **Wave reservation only preventing Player final occupancy.** Current rule applies to any blocking combat unit.
12. **Tight/attached-activation Wave timing as the current Tutorial baseline.** Current paper baseline spawns at end of Enemy Turn with no attached action.
13. **Immediate Victory on board-empty state** without considering pending required Waves.
14. **Any single Player casualty always ending the entire Tutorial.** After Phase 8 begins, single-survivor continuation is valid.
15. **Checkpoint retry as healing/reset reward.** Checkpoints restore actual captured tactical state.
16. **CORRECTED: `Shockwave vs Cover is OPEN` as the current Blue-candidate rule.** Canonical v3.1 defines Blue Shockwave as ignoring Cover/LOS and penetrating obstacles; the later paper remark was not an explicit Game Designer override.

---

# 24. Current Confidence Assessment

## High confidence

- overall current curriculum progression from Phase 1 through graduation (while the exact final Phase count remains TENTATIVE);
- Phase 1–5 established learning arc;
- Phase 6 needs Spear + defensive Cover + Structure Objective literacy;
- Phase 7 controlled Charge/Stun learning contract;
- Phase 8 Wave → free-play graduation structure;
- one continuous Stage with progressive battlefield reveal;
- Tutorial Input Gate semantics;
- casualty boundary at Phase 8;
- macro A/B/C map topology;
- final free play should not be hard-scripted.

## Medium to medium-high confidence

- Region B/C paper coordinates;
- Phase 6 v0.7 Spear/Cover micro-geometry;
- Blue `(12,2)` / staging / Wave spawn coordinates;
- two-Wave Sword→Spear final composition;
- safe Tutorial Wave lifecycle;
- numerical PVS envelope.

## Requires runtime verification

- actual Spear scorer;
- defensive Cover perceived readability;
- HP/damage carry after Tutorial Sword ATK8 retune;
- Blue durability and burst-vs-avoid choice;
- Shockwave radius/shape;
- final free-play duration;
- retreat/funnel behaviour;
- full-party Stun recoverability;
- repeated Archer Attack dominance.

---

# 25. Current Resume Point

The Tutorial design checkpoint is now sufficiently consolidated to stop expanding the Tutorial on paper unless a new design problem is found.

Because this document is a **supporting baseline rather than a silent canonical replacement**, the next project sequence should be:

```text
Game Designer review/approval of this reviewed baseline
→ migrate appropriate current decisions into next Game Design Context / Decisions
→ cross-document consistency audit
→ preserve this detailed baseline as supporting provenance/handoff
→ fresh actual repository audit
→ compare source against approved design
→ confirm implementation gaps
→ choose first coherent migration batch
→ implement
→ integrated runtime test + regression test
→ user confirmation before next batch
```

Do not jump directly from this paper baseline into coding while the portable canonical package still describes an older Tutorial architecture.

Do not assume the repository already contains the Phase 6–8 systems merely because they are now well designed on paper.

---

# 26. One-Page Tutorial Flow Summary

```text
PHASE 1
Control & Party Orientation

↓

PHASE 2
Shared AP + Start-position Movement commitment/refund

↓

PHASE 3
Turn + Sword + Intent + Basic Attack + Movement Lock

↓

PHASE 4
ATR + Offensive Full/Partial/Clear Cover
(LOS lesson deferred)

↓

PHASE 5
Dynamic Intent
→ redirect Sword Guard→Archer
→ repeated Archer attacks via Shared AP
→ real punishment
→ recovery positioning
→ redirect pressure back to Guard
→ coordinated Sword finish

↓ battlefield expands

PHASE 6
Spear introduced
→ clear ranged hit
→ controlled defensive Cover drill
→ covered ranged hit
→ Objective: Destroy the Hut
→ first Structure Attack guided
→ free Hut/Spear priority
→ Hut + Spear resolved

↓ proceed into Region C

PHASE 7
Blue controlled drill
→ CHARGE 1/2
→ CHARGE 2/2
→ SHOCKWAVE revealed
→ Archer exits area, Guard remains for exercise
→ actual Shockwave → Guard STUN 2
→ Team AP remains 4
→ exactly one Archer Attack proves Shared AP adaptation
→ Guard STUN 1
→ duration evidence
→ Guard recovers
→ Blue SHOCKWAVE again

↓ all tactical Tutorial gates released

PHASE 8
Wave 1 Sword Telegraph + known Blue Shockwave
→ first Wave reservation explanation
→ Sword spawns with no attached action
→ Wave 2 Spear Telegraph
→ TUTORIAL PROMPT OFF
→ Objective: ELIMINATE ALL REMAINING THREATS
→ free play
→ normal Blue/Sword/Spear pressure
→ all required hostiles resolved
→ no Wave pending
→ TUTORIAL VICTORY
```

---

**End of Consolidated Tutorial Design Baseline v1.1 — Pass-4 Reviewed — 16 August 2026**
