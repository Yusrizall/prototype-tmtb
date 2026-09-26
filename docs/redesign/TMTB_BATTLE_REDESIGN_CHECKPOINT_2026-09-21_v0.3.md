# TMTB Battle Redesign Checkpoint

**Project:** TMTB / BeCan  
**Document Type:** Supporting Design Handoff / Active Redesign Checkpoint  
**Checkpoint Version:** 0.3  
**Date:** 21 September 2026  
**Canonical Status:** **NON-CANONICAL WORKING CHECKPOINT**  
**Design Scope:** Post-lecturer-feedback battle redesign, Stage 1–2; selected playtest slice and implementation brief  
**Prototype Implementation Baseline:** Git commit `81259555cd961a9ddfba9e7aa21bdd32abbe5848`, as reported by the Game Designer  
**Implementation Status of This Redesign:** **SPECIFIED FOR IMPLEMENTATION / NOT YET IMPLEMENTED / NOT RUNTIME-TESTED**

---

# 1. Purpose

This document preserves the active TMTB battle-redesign discussion after the previous rigid Tutorial design was rejected during lecturer guidance.

It exists to:

- prevent loss of design reasoning across long chat threads;
- separate accepted direction from test candidates and open questions;
- preserve why each mechanic is being changed;
- identify conflicts between the old canonical design, the current web prototype, and the new redesign;
- provide a reliable resume point before further Stage 2, Stage 3, implementation, and playtesting work.

This checkpoint does **not** silently replace:

- `TMTB_GAME_DESIGN_CONTEXT.md`;
- `TMTB_GAME_DESIGN_DECISIONS_v3.4.md`;
- the Handoff v3.2 implementation package;
- actual prototype source code and runtime behaviour.

Its intended lifecycle is:

```text
active discussion
→ supporting redesign checkpoint
→ paper-test refinement
→ Game Designer review
→ deliberate canonical migration
→ prototype implementation and validation
```

---

# 2. Authority and Status Language

## 2.1 Source-of-truth order used here

For design intent:

```text
1. Latest explicit Game Designer decision in the active redesign discussion
2. TMTB_GAME_DESIGN_CONTEXT.md v3.4
3. TMTB_GAME_DESIGN_DECISIONS_v3.4.md
4. This supporting redesign checkpoint
5. Handoff v3.2 and older supporting/historical material
```

For implementation truth:

```text
1. Actual current repository source/data
2. Confirmed runtime tests
3. TMTB_CURRENT_STATE_v3.2.md
4. Architecture / State & Data / other implementation handoffs
```

The active discussion may supersede older design direction, but it does not prove that the prototype already behaves that way.

## 2.2 Status vocabulary

This document follows the project maintenance protocol:

- **LOCKED** — current canonical direction.
- **PLANNED** — intended, but incomplete or not sufficiently validated.
- **TENTATIVE** — working rule/value that may change.
- **OPEN** — not yet decided.
- **SUPERSEDED** — intentionally replaced.
- **PROTOTYPE ONLY** — used only for validation/evaluation.
- **DEVELOPMENT EXCEPTION** — temporary divergence accepted because of scope.
- **HISTORICAL DESIGN SEED** — old idea preserved only as input/reference.

Within this checkpoint, wording such as **TENTATIVE — accepted for paper testing** means the Game Designer agreed that the candidate is worth testing; it does not automatically promote it to production canon.

---

# 3. Verification Boundary

## 3.1 Verified in this checkpoint

The document was checked against:

- `TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md`;
- `TMTB_GAME_DESIGN_CONTEXT.md` v3.4;
- `TMTB_GAME_DESIGN_DECISIONS_v3.4.md`;
- `TMTB_CURRENT_STATE_v3.2.md`;
- `TMTB_STATE_AND_DATA_MODEL_v3.2.md`;
- `TMTB_PROGRESS_AND_BACKLOG_v3.2.md`;
- explicit decisions and corrections made by the Game Designer in the active redesign discussion.

Targeted source inspection was also performed against the uploaded prototype snapshot to verify the existence and responsibility of the current integration points, including:

- `src/main.js`;
- `src/logic/run/runState.js`;
- `src/logic/run/buffSystem.js`;
- `src/logic/battle/battleSetup.js`;
- `src/logic/battle/skillLogic.js`;
- `src/logic/battle/waveLogic.js`;
- `src/logic/profile/profileStorage.js`;
- `src/ui/flow/basicFlowScreens.js`;
- `src/ui/flow/shopScreen.js`;
- existing automated-test folders and `package.json` scripts.

This was a focused implementation-surface check, not a new full repository audit.

## 3.2 Not verified yet

This checkpoint does not claim:

- live inspection of the Game Designer's local `C:\Datas\prototype-tmtb` checkout after commit `81259555...`;
- implementation of the redesign;
- runtime or automated testing of the redesign;
- exact Unity behaviour;
- external academic validation of the proposed playtest method;
- final production balancing.

Paper-test outcomes in this document are discussion calculations, not player-test or runtime evidence.

---

# 4. Why the Redesign Exists

## 4.1 Lecturer feedback

The Game Designer reported the following guidance from:

- Bu Dea, Pembimbing 2, around 7 September 2026;
- Bu Tia, Pembimbing 1, around 14 September 2026.

Both lecturers aligned on the need to revisit the battle and onboarding foundation.

The main problems identified were:

1. The existing Tutorial was too rigid and steered each movement/action.
2. It was too long; external students spent more than ten minutes and still became confused.
3. Two playable units were introduced too early.
4. Guard and Archer did not yet create sufficiently distinct tactical decisions.
5. Baseline enemies felt differentiated mainly as melee versus ranged stat packages.
6. The battle relied too heavily on positioning and aggro manipulation without enough readable tactical patterns.
7. The Tutorial taught a curriculum first, then forced map shape, unit placement, stats, and encounters to fit it.
8. Tutorial-only enemy stats weakened transfer to real stages.
9. Character and enemy **intent** needed to be clearer: why the unit exists, what problem it creates or solves, and how the player adapts.
10. Progress should be tested with five non-team players and documented even when results are negative.

## 4.2 Resulting design mission

**PLANNED — STRONG ACTIVE DIRECTION**

Replace reliance on the rejected rigid Tutorial with real Stage 1–4 progression that teaches through encounter design.

The desired early-player experience is:

```text
observe a readable threat or pattern
→ form a prediction
→ choose between meaningful alternatives
→ see a clear consequence
→ carry the mental model into a later stage
```

The old Unity Tutorial may remain accessible with a Skip option as a development compromise because it was already implemented, but it is no longer trusted as the primary onboarding direction. Exact shipping policy remains **TENTATIVE**.

## 4.3 Production constraints

- Existing player and enemy characters should not be removed merely because their old mechanics are weak; 3D models, rigs, and animations already exist.
- Mechanics, targeting, patterns, skills, objectives, layouts, and progression may be redesigned to give those assets clearer tactical roles.
- The web/Vite prototype is the current design-validation environment.
- The Unity game is a separate repository and implementation track handled primarily by the programmer team.
- No redesign feature should be implemented before its intended decision and test question are sufficiently clear.

---

# 5. Agreed Redesign Workflow

## 5.1 Current sequence

**PLANNED — ACTIVE WORKFLOW**

```text
1. Reframe battle-design problem from lecturer feedback
2. Establish Guard and baseline melee enemy tactical loop
3. Build Stage 1 as seamless real-stage onboarding
4. Introduce Protect Objective and Spear pressure in Stage 2
5. Paper-test map, wave, targeting, trajectory, and trade-offs
6. Identify the recurring tactical problem produced by Stage 1–2
7. Design Archer as a solution to that problem in Stage 3
8. Design Stage 3 progression and Archer learning sequence
9. Design Stage 4 as combined-pressure / mastery test
10. Define variants and playtest questions
11. Implement selected prototype slice
12. Test with five non-team players
13. Compare predicted, observed, and perceived results
14. Revise and migrate confirmed decisions into canonical documents
```

## 5.2 Guardrail against tangents

Ideas may be explored when they affect the current dependency, but they should not reorder the workflow without an explicit reason.

Examples:

- Fortify must be understood before final Stage 1 choreography.
- Spear and objective pressure must be understood before Archer is redesigned.
- Buffs, Shop prices, rarity, and full economy remain relevant later, but are not the present blocker.

## 5.3 Current resume point

The active discussion is currently at:

```text
Stage 1 and Stage 2 selected playtest scenario specified
→ normal Battle Result and frozen progression flow specified
→ minimum telemetry and participant/session identity specified
→ next: implement the selected slice in the web prototype
→ then run automated and manual validation before five-player testing
```

Archer redesign should remain paused until the Stage 2 problem is sufficiently concrete.

---

# 6. Redesign Principles

## 6.1 Tactical identity

**PLANNED — STRONG ACTIVE DIRECTION**

Every unit should answer at least one of these questions:

- What tactical problem does it create?
- What tactical problem does it solve?
- What decision becomes different because this unit exists?
- What readable cue lets the player reason about it?
- What trade-off prevents one answer from always being dominant?

## 6.2 Seamless onboarding

**PLANNED — STRONG ACTIVE DIRECTION**

Early stages teach by controlled encounter conditions rather than forcing exact inputs.

Use:

- gradual enemy introduction;
- safe exploration space;
- readable intent and threat previews;
- contextual UI emphasis;
- outcome-based learning evidence;
- later recombination of earlier lessons.

Avoid:

- repeated stop-game explanation boxes;
- exact movement scripts;
- Tutorial-only combat rules;
- showing the solution before the player can reason about the threat;
- introducing several new tactical concepts at once.

## 6.3 Multiple valid approaches

A stage may have a more efficient line, but it should preserve understandable alternatives such as:

- conservative HP-preserving play;
- aggressive faster resolution;
- positional interception;
- objective-risk trade-off.

The player is not required to leave every early stage at full HP. HP carry creates value for preservation, while fast offense remains valid when it prevents more future damage.

## 6.4 Information principle

Preserved from canonical design:

> Informasikan ancamannya, bukan jawabannya.

The player should normally see current Intent, target, status, threat area, and activation order when relevant, but not an exact recommended response.

---

# 7. Relationship to the Previous Canonical Tutorial

| Topic | Previous canonical/prototype state | Active redesign direction | Current classification |
|---|---|---|---|
| Tutorial structure | One continuous eight-Phase Tutorial | Real Stage 1–4 progression as primary onboarding | **TENTATIVE redesign; canonical migration required** |
| Initial party | Guard and Archer present from early Tutorial | Stage 1 begins with Guard; Archer joins around Stage 3 | **PLANNED / strong direction** |
| Guidance | Input Gates, prompts, phased choreography | Contextual hints plus encounter evidence | **PLANNED / strong direction** |
| Fortify | 1 AP, Shield 4, self/ally range 2, cooldown 2 | Guard self skill, 2 AP, Shield 6, no playtest cooldown, Fortified/Repelled loop | **TENTATIVE — accepted for testing** |
| Hold | Separate 1 AP preparation action; effect open | Remains conceptually separate from Fortify | **LOCKED separation; Hold details OPEN** |
| Baseline melee enemy | Documented as Sword; nearest Hero; no Pattern | Discussed as Dagger; nearest Hero; Repelled response | **Naming OPEN; behaviour partially redesigned** |
| Spear | Nearest Hero; move and basic ranged attack in one activation | Preferred Objective Structure; Aim → Throw + Reposition | **TENTATIVE redesign** |
| Wave spawn | Spawn displays Intent and does not immediately attack/move | Telegraph, one full preparation turn, spawn, then immediate first activation | **TENTATIVE — selected for this prototype playtest** |
| Stage 2 objective | Previous Tutorial used destroy-Hut content later | Protect Hut + Eliminate All | **TENTATIVE — active Stage 2 direction** |

The table records intentional divergence. It does not claim that the old prototype has already been updated.

---

# 8. Preserved Combat Foundation

Unless deliberately revised later, the redesign currently assumes these existing foundations:

- party-wide Shared Team AP;
- current baseline contribution of 2 AP per living Player Unit;
- global End Turn;
- Attack and Skill use AP;
- attacks/skills may be repeated while legal and affordable;
- movement commitment through StartGrid and refund before commitment;
- Attack/Skill Movement Lock;
- sequential enemy activation;
- Spawn Order as baseline enemy execution order;
- dynamic current target where the Target Rule permits it;
- intent communicates the current plan, not an exact path;
- Cover modifies damage;
- DEF is absent from current combat design;
- HP carries between stages as the planned run direction.

Any future redesign that changes these assumptions must state the conflict explicitly.

---

# 9. Stage 1 — Guard and Dagger Foundation

## 9.1 Stage purpose

**PLANNED — STRONG ACTIVE DIRECTION**

Stage 1 should make the player feel that TMTB requires observation and timing even with only one playable unit and one basic enemy.

Primary mental model:

```text
read the enemy's immediate threat
→ decide whether to attack or prepare
→ exploit the consequence of a successful defensive read
→ preserve HP without making aggression invalid
```

## 9.2 Opening structure

**TENTATIVE — SELECTED FOR PROTOTYPE PLAYTEST**

- Use the full old Tutorial map shape as the available Stage 1 environment rather than revealing it in rigid subareas.
- Copy it into a new redesign map; do not overwrite the old Tutorial data.
- Use the verified `16×16` grid from `tutorial_offset_courtyard.json` as the geometric source.
- Simplify or neutralize lower-area Cover/obstacle content that would introduce Stage 2 terrain concepts too early.
- Begin with Guard only at `(2,10)`.
- Begin with Dagger 1 at `(8,11)`, far enough away to allow movement, camera, selection, and End Turn discovery.
- Telegraph and spawn Dagger 2 at `(12,8)` only after Dagger 1 is defeated.
- A simultaneous two-Dagger setup remains useful as an internal stress test, not as the selected Stage 1 opening.

Objective:

```text
Eliminate All Required Enemies
```

Victory occurs after Dagger 2 is defeated and no required Wave remains pending. Defeat occurs when Guard HP reaches zero.

## 9.3 Contextual learning ledger

**PLANNED**

The UI may highlight existing controls or combat information when it becomes relevant.

Candidate sequence:

| Situation | Player can learn | Candidate UI support |
|---|---|---|
| Stage entry | camera and movement | emphasize mouse/WASD control hints |
| Unit selected | movement range and reachable tiles | emphasize movement hint/range |
| End Turn becomes relevant | turn progression | emphasize End Turn control |
| Enemy threat becomes relevant | Intent, target, threat range | emphasize enemy information panel/world cue |
| Guard can attack | attack selection and ATR | emphasize Attack action and valid target feedback |
| Fortify becomes useful | preparation and Shield | emphasize Skill/Fortify affordance without forcing it |
| Dagger becomes Repelled | cause-and-effect of timed defense | status icon plus concise feedback |

The ledger records what the player has been exposed to; it should not become a new rigid step gate.

## 9.4 Baseline numerical assumptions

All numbers remain **TENTATIVE**.

| Entity | HP | ATK | Move | ATR | Source/status |
|---|---:|---:|---:|---:|---|
| Guard | 25 | 5 | 3 | 1.5 | carried from v3.4 baseline |
| Dagger / old Sword | 16 | 6 | 3 | 1.5 | carried from v3.4 baseline melee enemy |

The term `Dagger` is used in the active discussion. Older canonical documents call the baseline enemy `Sword`. Whether these are the same production unit name must be confirmed.

## 9.5 Dagger tactical identity

**TENTATIVE — STRONG ACTIVE DIRECTION**

Role:

```text
basic direct melee pressure
```

Target Rule:

```text
nearest living Player Hero
```

Current consequences:

- Structures such as the Hut are not valid baseline Dagger targets.
- If Guard and Hut are both adjacent, Dagger attacks Guard.
- Current Target may change when Hero positions change.
- Dagger normally approaches and attacks at most once per activation.
- Dagger does not require a complex universal Pattern merely to appear tactical.
- Its first distinctive reaction is interaction with Repelled.

## 9.6 Fortify — Guard core Skill redesign

**TENTATIVE — EXPLICITLY ACCEPTED FOR PAPER TESTING**

Fortify is a Skill, not Hold/Brace.

Candidate specification:

| Field | Current redesign candidate |
|---|---|
| User | Guard |
| Target | Self only |
| AP cost | 2 AP |
| Shield | 6 |
| Activation | Immediately on cast |
| Duration | Through the next Enemy Turn |
| Expiry | Any remaining Shield expires when the next Player Turn begins |
| Stacking | Non-stacking candidate |
| Movement/Attack in same turn | Not possible under the 2 AP opening baseline; treat as full-turn commitment in Stage 1 |
| Cooldown | None for the selected initial playtest |

Rationale:

- Shield 6 fully absorbs one baseline Dagger attack of 6.
- Cost 2 AP forces a real choice between preparation and two normal attacks.
- Self-only targeting strengthens Guard's identity and prevents Fortify from becoming a generic ranged Shield spell.
- Later buffs or permanent progression may improve Shield value, but the upgrade route is still **OPEN**.

## 9.7 Fortified

**TENTATIVE**

`Fortified` is a Guard-specific combat condition derived from active Fortify Shield:

```text
Guard has Fortify Shield > 0
→ Guard is Fortified
```

When Shield reaches zero or expires:

```text
Fortified ends
```

Fortified is not automatically granted to another character merely because that character receives generic Shield from a future source.

For hit resolution, the relevant candidate check is whether Guard was Fortified at the start of the melee hit. Therefore, a Dagger attack that removes the last Shield may still trigger Repelled from that hit. This timing is necessary for the current Stage 1 interaction but remains to be implementation-tested.

## 9.8 Repelled

**TENTATIVE**

Repelled is a status produced when a melee-contact attacker hits a Fortified Guard.

```text
melee-contact hit against Fortified Guard
→ attacker receives Repelled
```

Repelled is conceptually universal, while the behavioural response is defined by the affected unit.

Non-trigger examples:

- Spear projectile hitting Fortified Guard;
- damage that is not a melee-contact attack;
- attack against Guard after Fortified has already ended.

## 9.9 Dagger response to Repelled

**TENTATIVE**

On its next activation, a Repelled Dagger uses:

```text
Disengage
```

Candidate behaviour:

- move away from Guard;
- minimum goal: end outside Guard's current ATR;
- move exactly 1 legal tile farther from the current Guard position;
- do not attack during that activation;
- clear Repelled after resolving the response.

If no legal tile increases distance from Guard, Dagger remains on its current tile, does not attack, and Repelled clears.

`Disengage` belongs to Dagger's response grammar, not to the universal definition of Repelled. Another enemy may respond to Repelled differently.

## 9.10 Stage 1 decision loop

The intended decision is not simply “always Fortify.”

Candidate alternatives:

### Conservative line

```text
Fortify
→ absorb Dagger attack
→ Dagger becomes Repelled
→ use the safer response window to attack or reposition
```

### Aggressive line

```text
spend 2 AP on attacks
→ reduce Dagger HP faster
→ accept incoming damage if Dagger survives
```

Aggression may become optimal when Dagger is already within two-hit execution range. Defense remains valuable because HP carries into later stages.

## 9.11 Discussion paper-test result

The sequential two-Dagger thought experiment produced the following working outcomes:

| Approach against Dagger 1 | Approach against Dagger 2 | Guard HP after Stage | Interpretation |
|---|---|---:|---|
| Defensive | Defensive | 25 | maximum preservation, slower |
| Defensive | Aggressive | 13 | mixed line |
| Aggressive | Defensive | 13 | mixed line |
| Aggressive | Aggressive | 1 | fastest/high-risk survival |

These values show opposite attrition profiles while keeping stage completion possible. They must be recalculated under actual pathfinding, exact turn timing, and the selected no-cooldown Fortify implementation.

## 9.12 Stage 1 open questions

- Whether Dagger/Sword naming is a rename or a separate unit identity.
- Final visual simplification of old lower-map obstacles.
- Exact contextual cue styling and retirement timing after each first relevant interaction.
- Runtime confirmation that the four predicted HP-outcome lines remain reachable under actual pathfinding and action timing.

---

# 10. Stage 2 — Protect Hut and Spear Pressure

## 10.1 Stage purpose

**TENTATIVE — STRONG ACTIVE DIRECTION**

Stage 2 expands the player's problem from self-preservation to divided responsibility:

```text
protect Guard's HP
+ protect a fixed objective
+ answer delayed ranged pressure
+ manage enemy composition and activation order
```

Guard is allowed to take damage or lose during Stage 2. The stage should not be tuned around guaranteed full-HP completion for an unupgraded baseline Guard.

## 10.2 Objective, victory, and defeat

**TENTATIVE**

Objective:

```text
Protect Hut
```

Victory:

```text
all required enemies defeated
+ Hut remains alive
```

Defeat:

```text
Guard defeated
or
Hut destroyed
```

This preserves the canonical distinction between Objective, Victory Condition, and Defeat Condition.

## 10.3 Hut assumptions

**TENTATIVE**

| Property | Candidate |
|---|---|
| HP | 28 |
| Footprint | 3×3 |
| Role | Player-side Objective Structure |

The HP and footprint are working assumptions from the discussion and must be checked against current source/data before implementation.

For Spear targeting, the `3×3` footprint is one entity with one shared HP pool. Aim chooses one footprint tile, but a projectile collision with that footprint applies only one damage instance.

Candidate deterministic target-tile priority:

1. tile is within Spear ATR;
2. tile has a clear legal trajectory;
3. nearest valid footprint tile;
4. most centre-aligned tile;
5. avoid an ally-blocked lane when a clean alternative exists;
6. stable coordinate tie-breaker.

## 10.4 Stage 2 layout v0.3

Stage 2 uses a new map/layout rather than the old Tutorial Hut placement.

**TENTATIVE — ACCEPTED FOR PROTOTYPE/PAPER TESTING**

- Maximum arena: approximately `16×16`.
- Build outward from the Hut as the central tactical object.
- Use one directional Cover tile and one Projectile Blocker so their functions can be learned without filling the arena with terrain.

Coordinate assumptions:

| Element | Candidate coordinate/footprint | Function |
|---|---|---|
| Hut | `x=7..9, y=7..9` | Player-side Objective Structure |
| Guard initial tile | `(10,11)` | Allows a short preparation route to Cover |
| Directional Cover O30 | `(10,8)`, facing east | Reduces east-origin projectile damage; occupiable/traversable in the paper model |
| Projectile Blocker | `(10,6)` | Impassable and stops projectiles |
| Wave 1 Spear | `(12,8)` | Opens with the east/centre lane |
| Wave 2 Spear | `(12,8)` | Reuses the readable first Spear origin |
| Wave 2 Dagger | `(11,5)` | Can enter the locked centre lane after spawning |

Key lanes:

| Lane | Path | Result |
|---|---|---|
| East/centre | `(12,8) → (11,8) → (10,8) → Hut (9,8)` | Valid; passes through Cover tile |
| North-east | `(11,5) → (10,6) → Hut (9,7)` | Invalidated by Projectile Blocker |
| South-east | `(11,11) → (10,10) → Hut (9,9)` | Valid |

The earlier blocker candidate at `(11,7)` is **REJECTED** because it slowed the Guard's flank route and made the flank option comparatively dominated. Moving the blocker to `(10,6)` preserves the meaningful routes while naturally removing the north-east Spear perch.

The surviving firing positions are geometry candidates, not hardcoded Spear waypoints. Under the current role scorer, the blocker removes the north-east lane and makes the south-east position the deterministic valid reposition after the first Throw.

## 10.5 Spear tactical identity

**TENTATIVE — STRONG ACTIVE DIRECTION**

Role:

```text
telegraphed ranged pressure
+ lane control
+ objective pressure
```

Preferred Target Rule:

```text
valid Player-side Objective Structure
```

Fallback Target Rule:

```text
nearest valid Player Hero
```

Therefore, Spear is not restricted to Protect stages. It prefers the Hut when one exists, but remains usable in ordinary battles through its Hero fallback.

Working baseline stats are **TENTATIVE — ACCEPTED FOR PROTOTYPE/PAPER TESTING**:

| HP | ATK | Move | ATR |
|---:|---:|---:|---:|
| 10 | 8 | 4 | 3 |

Rationale:

- `HP 10` makes Spear a fragile, telegraphed ranged threat rather than another durable melee body. Guard needs two baseline attacks to defeat it.
- `ATK 8` makes the Stage 2 defensive tools materially distinct: O30 Cover reduces the hit to `5`, Shield 6 alone leaks `2`, while Cover plus Fortify can absorb the hit fully.
- The former `HP 15 / ATK 6` candidate made Shield 6 sufficient on its own and therefore weakened the purpose of Cover.

## 10.6 Spear action cycle

**TENTATIVE**

```text
Aim
→ later Throw
→ Reposition
→ Aim again
```

### Aim activation

- Select target according to preferred/fallback rule.
- Validate range and a legal projectile lane.
- Lock the target **grid tile and lane**, not the target entity.
- Display the locked threat to the player.
- Deal no damage.
- End activation.

### Throw activation

- Attack the previously locked lane.
- Do not retarget if the original entity moved or was destroyed.
- If no valid collidable target remains in the lane, the Throw may miss.
- Resolve collision and damage.
- Reposition after Throw.

### Reposition

Spear seeks a legal tile that best supports its next ranged cycle.

**TENTATIVE — SELECTED FOR THE FIRST PROTOTYPE PLAYTEST**

Evaluate legal, reachable, unoccupied tiles within Move 4 in this order:

1. tile enables a legal future firing lane to the preferred target;
2. prefer a clean lane over a lane whose current first collider is an ally;
3. maximize safety distance from all living Heroes;
4. maximize distance from the preferred target while remaining within ATR 3;
5. minimize movement-step cost;
6. deterministic tie-break: lowest `y`, then lowest `x`.

The coordinate tie-break is a technical determinism rule, not part of Spear's fictional intent.

If no reachable tile enables a firing lane, Spear does not abandon a living preferred Objective Structure merely because the lane is blocked. It moves toward the nearest future firing position for that Objective. If no future firing position exists anywhere on the map, it selects the safest reachable tile, exposes `No Valid Aim Lane`, and creates no fake Aim. The nearest-Hero fallback is used only when no valid preferred Objective Structure exists.

If Guard approaches during the Aim window, Spear still resolves the locked Throw before repositioning. It does not cancel the telegraphed action merely to flee.

## 10.7 Projectile and collision rules

**TENTATIVE — ACCEPTED DIRECTION FOR PAPER TESTING**

- The telegraphed lane is one tile wide.
- The displayed lane is authoritative for the Throw.
- Range is validated when Aim is created.
- The projectile is non-piercing.
- It stops on the first valid collision.
- A Player Hero may intercept.
- A Player Structure may be hit.
- An Enemy unit may be hit through friendly fire.
- A damageable Enemy Structure may be hit.
- Projectile-blocking terrain stops the projectile.
- Cover alone does not automatically block the projectile; it modifies damage using the applicable Cover rule.
- Decorative/non-gameplay objects are ignored.
- Fortify Shield may absorb projectile damage.
- A projectile does not cause Repelled because it is not melee contact.

### Centre-to-centre collision geometry

**TENTATIVE — SELECTED FOR THE FIRST PROTOTYPE PLAYTEST**

The projectile follows a continuous line segment from the centre of Spear's tile to the centre of the locked target tile.

- entering a blocker's interior stops the projectile;
- overlapping a blocker's edge for a positive distance stops the projectile;
- touching exactly one blocker's corner at one point does not stop the projectile;
- when two blocking tiles occupy both side cells around the same crossed grid vertex, they form a closed diagonal pinch and stop the projectile at that shared corner;
- when several blockers are intersected, the earliest collision measured from Spear wins;
- a diagonal-pinch result is reported as terrain collision rather than arbitrarily assigning the hit to only one of the two tiles.

Recommended diagnostic representation:

```text
collisionType: terrain_corner_pair
colliderIds: [obstacleA, obstacleB]
impactPoint: sharedCorner
```

This is intentionally stricter than the old prototype helper, which checks obstacle interiors but does not yet treat positive-length edge overlap or a two-obstacle diagonal pinch as blocking.

This is an action-specific trajectory rule. It does not yet establish a universal LOS system for every ranged attack.

## 10.8 Friendly-fire role

**TENTATIVE**

Spear should avoid deliberately choosing an allied-body-blocked lane at Aim time when a better valid lane exists.

Friendly fire is primarily intended to emerge when battlefield state changes after Aim:

```text
Spear locks lane
→ player and/or other enemies move
→ another enemy occupies the lane
→ Throw hits first collision
```

This creates a tactical manipulation opportunity rather than making Spear routinely attack its allies through poor initial targeting.

## 10.9 Full Stage 2 paper-test baseline

**TENTATIVE — ACCEPTED FOR PROTOTYPE/PAPER TESTING**

Shared numerical assumptions:

| Object | HP | ATK | Move | ATR |
|---|---:|---:|---:|---:|
| Guard | 25 | 5 | 3 | 1.5 |
| Dagger | 16 | 6 | 3 | 1.5 |
| Spear | 10 | 8 | 4 | 3 |
| Hut | 28 | — | — | — |

Other assumptions:

- Move costs 1 AP.
- Attack costs 1 AP.
- Fortify costs 2 AP and grants Shield 6.
- Cover O30 uses `floor(incoming damage × 0.7)`.
- Guard prepares from `(10,11)` toward the east-facing Cover at `(10,8)`.
- Spear starts at `(12,8)` and Aims at the Hut through the centre lane.

Wave 1 results:

| Line | Key response | Response turns to kill Spear | Guard HP | Hut HP |
|---|---|---:|---:|---:|
| Fortify | Guard occupies Cover and Fortifies; Throw 8 → Cover 5 → Shield 6, leaving Shield 1 | 3 | 25 | 28 |
| Direct | Guard moves to `(11,8)` and attacks; takes the Throw directly | 2 | 17 | 28 |
| South flank | Guard attacks from outside the lane; Hut accepts the Throw | 2 | 25 | 20 |

All three approaches win but preserve different resources:

- Fortify preserves both HP pools but costs one extra response turn.
- Direct preserves Hut HP at the cost of Guard HP.
- South flank preserves Guard HP at the cost of Hut HP.

This is the desired shape: none of the three options is strictly better on time, Guard HP, and Hut HP simultaneously.

After the first Throw, Spear repositions to south-east `(11,11)` because the north-east corridor is blocked. The Guard then closes and defeats it in either two or three response turns depending on the chosen line.

## 10.10 Wave Telegraph

Preserved canonical direction:

```text
Telegraph
→ one Player preparation window
→ Spawn
```

Candidate information shown during Telegraph:

- enemy type;
- spawn tile;
- countdown;
- activation-order position;
- preferred target;
- projected first Intent;
- inspectable threat envelope.

Do not show before Aim:

- exact future movement path;
- exact destination;
- a locked projectile lane that does not yet exist.

The projected target may update if the relevant battlefield state changes before spawn.

A reserved spawn tile is passable during preparation but may not be used as a final occupied tile.

**TENTATIVE — SELECTED UNIVERSAL LIFECYCLE FOR THIS PLAYTEST**

```text
Telegraph appears
→ one full Player preparation turn
→ player ends that turn
→ enemies spawn
→ enemies immediately execute their first activation in visible order
```

If Telegraph appears partway through an already-active Player Turn—for example because Dagger 1 was defeated—the remaining partial turn does not consume the preparation window. The countdown decreases only after one complete Player phase that began with the Telegraph already active.

Different enemies still produce different first outcomes under the same lifecycle:

- Dagger moves and attacks if legal;
- Spear creates Aim and deals no immediate damage.

### Terminology note

The active discussion once used the word `telemetri` when referring to information before enemy spawn. The mechanic described is **Wave Telegraph**. `Telemetry` remains the analytics/evaluation concept from canonical documents. This wording should be confirmed during review.

## 10.11 Activation order

Preserved canonical baseline:

```text
sequential activation
→ Spawn Order
→ earlier-spawned living enemy acts first
```

Activation order should be readable through:

- an ordered HUD queue;
- numbered world markers/badges where needed.

Exact movement paths remain hidden.

## 10.12 Candidate Stage 2 Wave sequence

**TENTATIVE — ACCEPTED FOR PROTOTYPE/PAPER TESTING**

### Stage entry / Wave 1

```text
Stage entry Telegraph
→ Wave 1: one Spear at (12,8)
→ one Player preparation turn
→ Spear enters its Aim cycle
→ player reads and answers the locked lane
→ Spear defeated
```

### Intermission

Guard's actual final position is preserved. No teleport or artificial reset is assumed.

The accepted Wave 1 paper routes end around `(10,10)` for the Fortify line or `(11,10)` for the Direct/South-flank lines. One preparation window lets all routes reach the shared Wave 2 preparation tile `(11,9)`.

### Wave 2 Telegraph

Candidate roster and order:

| Order | Enemy | Candidate spawn |
|---:|---|---|
| 1 | Spear | `(12,8)` |
| 2 | Dagger | `(11,5)` |

The player receives one preparation turn and may prepare at `(11,9)`.

### Wave 2 interaction hypothesis

Candidate sequence:

```text
Spear acts first and Aims the centre lane
→ Dagger moves (11,5) → (11,8)
→ Dagger attacks Guard at (11,9) for 6
→ Dagger ends inside the locked lane
→ next Player Turn exposes the combined threat and visible order
```

Possible player answers:

1. **Aggressive Dagger line — paper-test best tempo**

   ```text
   Guard attacks Dagger twice: 16 → 11 → 6 HP
   → Spear Throw 8 resolves first and kills Dagger
   → dead Dagger activation is skipped
   → Spear repositions south-east
   → Guard closes and kills Spear with two attacks across the next response
   ```

2. **Fortify fallback — safe but slower**

   ```text
   Guard Fortifies after the Dagger's first hit
   → Spear Throw 8 hits Dagger: 16 → 8 HP
   → Dagger attacks Shield 6 and becomes Repelled
   → encounter remains completable, but costs about two additional Player Turns
   ```

Approximate final results after the complete two-Wave paper test:

| Wave 1 line | Aggressive Wave 2 final | Fortify-fallback final |
|---|---|---|
| Fortify | Guard 19 / Hut 28 | Guard approximately 13 / Hut 28 |
| Direct | Guard 11 / Hut 28 | Guard approximately 5 / Hut 28 |
| South flank | Guard 19 / Hut 20 | Guard approximately 13 / Hut 20 |

The Fortify-fallback values remain approximate until Repelled Disengage destination and tie-break rules are fixed. The aggressive line is the stable paper-test baseline.

This is intended to teach that activation order and locked lanes can be manipulated, not merely observed.

### Variant record

Two Wave 2 directions were retained during discussion:

- **Variant A — Readable Crossfire:** longer and more explicit, with an estimated `9–12` Player Turns; preserved as a paper-tested fallback.
- **Variant B — Immediate Combined Pressure:** Spear Aims, Dagger enters the locked lane, and the player may prepare the friendly-fire resolution; selected for the first five-player prototype test.

Only Variant B is implemented in the first playtest build. Variant A remains documented for later comparison if the selected scenario proves too compressed or difficult to read. No A/B player study is planned for the first test because five participants, limited attention span, and the current academic schedule favour one coherent scenario.

## 10.13 Spawn-to-first-activation decision

The old canonical rule states:

```text
spawn
→ display Intent
→ no immediate offensive Movement/Attack at that same spawn moment
```

The selected playtest rule is:

```text
Telegraph is created
→ one full Player preparation turn
→ enemies spawn
→ enemies immediately take their first activation in visible order
```

Rationale for the candidate:

- Telegraph already supplies a full preparation window.
- Spear's first action is Aim, giving another readable window before damage.
- Immediate activation prevents excessive dead time.

The Game Designer explicitly accepted the newer lifecycle for the selected prototype playtest. It remains **TENTATIVE** rather than production canon because runtime and player validation have not yet occurred. The conflict with the older canonical rule is deliberate and must be recorded during later canonical migration.

## 10.14 Stage 2 open questions

- Exact implementation tolerance for the already-LOCKED centre-to-centre ATR rule.
- Final validation that the Cover and blocker visuals communicate different functions.
- Final Hut destruction visuals and whether the destroyed footprint remains non-traversable during the defeat presentation.
- Runtime confirmation that every required pending Wave blocks victory.
- Runtime confirmation that the selected Wave 2 friendly-fire line remains reachable.

---

# 11. Cover and Projectile Blockers — Paper-Test Result

## 11.1 Result

The minimum terrain candidate is now one east-facing O30 Cover tile at `(10,8)` plus one Projectile Blocker at `(10,6)`.

**TENTATIVE — ACCEPTED FOR PROTOTYPE/PAPER TESTING**

## 11.2 Required distinction

```text
Cover
→ modifies damage
→ does not automatically stop a projectile
```

```text
Projectile Blocker
→ stops the projectile lane
```

This distinction must remain readable in both visuals and UI feedback.

### Directional Edge Cover

**TENTATIVE — SELECTED FOR THE FIRST PROTOTYPE PLAYTEST**

The Stage 2 O30 is not the old impassable obstacle tile. It is an occupiable tile with Cover attached to one protected edge.

Selected Stage 2 data concept:

```text
tile: (10,8)
coverPercentage: 0.30
protectedEdge: east
occupiable: true
protectsOccupantOnly: true
```

Draw the line from attacker centre to occupant centre and determine which edge of the occupied tile the line enters. East-facing Cover applies when the attack enters through the east edge. An exact 45-degree corner entry counts as protected when east is one of the two touched edges.

Equivalent east-facing test:

```text
dx > 0
and
abs(dx) >= abs(dy)
```

Therefore east, north-east/east-dominant, south-east/east-dominant, and exact 45-degree east diagonals receive O30. North-, south-, or west-entry attacks do not.

For the first playtest, this Cover protects only the unit occupying its tile. It does not project protection across several tiles behind it.

Damage order:

```text
locked trajectory and first collision
→ Directional Cover check at reached target
→ Cover damage reduction
→ Shield absorption
→ HP damage
```

The existing prototype treats O30/O70/OF as non-directional, impassable obstacles crossed by an attack path. Implementing Directional Edge Cover is therefore a deliberate redesign and requires a distinct representation or an explicit Playtest Mode data contract rather than silently reusing the old obstacle semantics.

## 11.3 Paper-test findings

1. Guard retains three distinct Wave 1 answers: Fortify, Direct interception, and South flank.
2. Cover matters numerically because Spear ATK 8 exceeds Shield 6.
3. The blocker removes the north-east Spear lane without slowing the useful flank route.
4. Spear still has clear east and south-east lanes.
5. Wave 2 permits planned friendly-fire manipulation through activation order.
6. Replacing the earlier blocker at `(11,7)` with `(10,6)` prevents the terrain itself from making one route obviously inferior.

## 11.4 Remaining validation

The layout still needs prototype/player validation for:

- whether players visually distinguish Cover from a true blocker;
- whether the threat lane and activation order are readable without explanation;
- whether the occupiable Cover tile is believable in the final art representation;
- whether players discover the Dagger-friendly-fire solution rather than merely stumbling into it.

---

# 12. Archer and Stage 3 Boundary

## 12.1 Why Archer remains paused

**PLANNED — STRONG ACTIVE DIRECTION**

Archer should not be added merely as:

```text
another unit
+ more damage
+ ranged attack
```

Before Archer is redesigned, Stage 1–2 must establish a recurring problem that Guard cannot solve efficiently alone.

Candidate problem space:

- remote pressure while Guard anchors another responsibility;
- enemies or lanes that punish constant close pursuit;
- simultaneous threats that force AP allocation across distance;
- a need to influence a threat without abandoning the protected area.

The exact Archer identity, core Skill, and Stage 3 lesson remain **OPEN**. Existing `Pinning Shot` is implementation truth and an old tentative baseline, not automatically the final redesigned answer.

## 12.2 Stage 3 intended role

**PLANNED**

```text
Stage 1 teaches Guard timing and direct melee pressure
→ Stage 2 exposes objective/ranged-space limitation
→ Stage 3 introduces Archer as a systemic answer
```

Archer should broaden choices, not invalidate Guard or become mandatory hard-counter logic for every Spear.

---

# 13. Stage 4 and Later Systems

## 13.1 Stage 4

**OPEN / PLANNED**

Stage 4 is expected to test combined mastery and may contain a Mini-Boss, but its objective, roster, layout, and tactical thesis are not yet decided.

## 13.2 Systems deliberately deferred

- final Archer and Guard full Skill kits;
- Buff catalogue and rarity;
- Skill-enhancing Buffs;
- permanent-upgrade values;
- final production Run Crystal rewards beyond the selected test slice;
- Shop prices;
- recovery/rest rules;
- final Region 1 composition;
- full LOS system;
- Stage 4 Mini-Boss mechanics;
- Stage 3–4 questionnaire extensions and production analytics.

These systems should be revisited when they become dependencies of the selected test slice.

---

# 14. Variant and Playtest Direction

## 14.1 Variant testing

**DEFERRED — PRESERVED FOR LATER**

The redesign produced multiple useful branches, particularly the two Stage 2 Wave 2 variants. Controlled comparison remains methodologically interesting, but the first test will use one selected scenario only.

Reason:

- only five non-team participants are currently required;
- asking each participant to repeat a long prototype slice risks fatigue and shallow answers;
- the immediate academic need is evidence that the redesigned baseline can be understood, not proof that one variant statistically outperforms another.

Later variant testing may reuse the same core questions after the first build and procedure are stable. Academic sources for any formal A/B-method claim still need to be selected and cited.

## 14.2 Required participants

The lecturer requested testing with:

```text
5 non-team players
```

## 14.3 Evaluation framework

Preserve the canonical comparison:

```text
Predicted
vs
Observed
vs
Perceived
```

Selected first-test metrics:

- completion/failure;
- completion time;
- turn count;
- Guard HP remaining;
- Hut HP remaining;
- number of Fortify uses;
- number of enemy Intent inspections;
- response to Aim lane;
- successful/accidental friendly fire;
- damage prevented by Shield/Cover;
- chosen AP allocation;
- moments of hesitation/confusion;
- whether the player can explain the enemy pattern afterward.

Candidate perception themes:

- clarity;
- fairness;
- tactical choice;
- pressure;
- enjoyment;
- understanding of cause and effect.

The first test starts at Stage 1 and continues through Stage 2 in the web prototype. It does not begin at Stage 2 and it does not use the Unity build.

Questionnaire preparation may later be transferred into Google Forms. Telemetry supports the observation record but does not replace direct questions about player understanding.

---

# 15. Reference and Adaptation Ledger

This ledger records inspiration discussed so far. It is not yet a formal bibliography.

| Reference | Observed/recalled design idea | TMTB adaptation under discussion | Status |
|---|---|---|---|
| *Into the Breach* | highly readable future enemy actions and tile-based consequence planning | Spear locks a visible lane/tile before Throw; player can alter what occupies that lane | Conceptual reference; exact comparison needs source capture |
| *Slay the Spire* | visible enemy intent; offensive versus defensive trade-off under persistent HP attrition | readable enemy plan plus Guard choice between Fortify and faster damage | Conceptual reference; not a direct mechanical copy |
| *Persona 5 Tactica* | turn-based tactical grid reference used by the original team | broader grid-combat framing | Historical project reference |
| *Clash of Clans* | units may prioritize a favourite target and use a fallback when none exists | Spear prefers Objective Structure, otherwise targets nearest Hero | Conceptual targeting analogy |

Rules for future reference entries:

- record the exact source/game;
- record the specific mechanic, not merely the genre;
- state what TMTB changes or combines;
- avoid claiming academic validation from a commercial-game example;
- add journal/research citations separately for formal methodology claims.

---

# 16. Design-to-Implementation Conflict Register

| ID | Topic | Current prototype / old document | Redesign target | Required action |
|---|---|---|---|---|
| R-01 | Tutorial structure | continuous eight-Phase rigid Tutorial implemented | real Stage 1–4 onboarding | decide migration scope before coding |
| R-02 | Initial roster | Guard and Archer available from start in prototype | Guard Stage 1; Archer around Stage 3 | define unlock and fielding rules |
| R-03 | Fortify cost/value | 1 AP, Shield 4 | 2 AP, Shield 6 candidate | implement only after balance approval |
| R-04 | Fortify targeting | self/ally within range 2 | self-only candidate | update skill data/UI/tests if accepted |
| R-05 | Fortify interaction | generic Shield; no Repelled loop | Guard Fortified + melee Repelled | define status/effect timing |
| R-06 | Baseline enemy name | Sword in canonical docs | Dagger in active discussion | confirm production naming/entity mapping |
| R-07 | Spear target | nearest Player Hero | preferred Objective Structure, Hero fallback | redesign Target Rule |
| R-08 | Spear action | reposition/attack in one activation | Aim → Throw + Reposition | implement state/lock/lane model |
| R-09 | Friendly fire | not established as universal Spear rule | first-collision Spear friendly fire | define damage ownership and UI |
| R-10 | Wave spawn | no immediate offensive activation | Telegraph + full preparation turn + immediate first activation | implement as playtest-only divergence and validate |
| R-11 | Stage 2 Hut | old Tutorial destroy-object content | player-side Protect Objective | create new encounter/objective configuration |
| R-12 | Archer | Pinning Shot/Volley prototype baseline | problem-driven identity not yet designed | pause implementation changes |
| R-13 | Spear baseline stats | HP 15 / ATK 6 discussion candidate | HP 10 / ATK 8 paper-test candidate | validate before canonicalization |
| R-14 | Stage 2 terrain | no accepted coordinates | Cover `(10,8)` and blocker `(10,6)` candidate | validate readability and grid implementation |
| R-15 | Progression effects | Buffs, Shop, and permanent progression are active | screens remain visible but effects are frozen | add explicit playtest-mode gates and tests |
| R-16 | Playtest identity | no dedicated participant/session model | participant, session, attempt, version, local queue | add isolated telemetry/playtest state |
| R-17 | Stage 2 routes | three different reward/difficulty node definitions | route shells point to one identical Stage 2 encounter/reward | preserve selection UI; disable gameplay divergence |

---

# 17. Decision Register

## 17.1 Preserved / already canonical

- Shared Team AP foundation.
- Sequential enemy activation.
- Spawn Order baseline.
- Dynamic current target under a stable Target Rule.
- Intent should show threat rather than exact solution/path.
- Objective, Victory, Defeat, Wave, Phase, and Tutorial Task are distinct concepts.
- Enemy composition should express pressure composition.
- Predicted, Observed, and Perceived results should be compared.
- Playtesting is required; balancing calculations do not replace it.

## 17.2 Latest active redesign direction

- Real Stage 1–4 progression becomes the primary onboarding target.
- Stage 1 begins with Guard and one distant Dagger.
- Second Dagger is introduced only after the first is defeated.
- Contextual UI cues replace most rigid step gating.
- Fortify remains in Skill space, separate from Hold.
- Fortify candidate is self-only, 2 AP, Shield 6, next-Enemy-Turn duration.
- Fortify has no cooldown in the selected initial playtest.
- Melee contact against Fortified Guard causes Repelled.
- Repelled Dagger responds with Disengage.
- Disengage moves exactly one legal tile farther from Guard, skips attack, then clears Repelled.
- Dagger targets Heroes, not Structures.
- Stage 2 centres on Protect Hut plus Eliminate All.
- Spear prefers Objective Structures and falls back to nearest Hero.
- Spear uses Aim → locked tile/lane → Throw → Reposition.
- Spear projectile is non-piercing and can friendly-fire the first collided enemy.
- Stage 2 layout v0.3 uses east-facing O30 Cover at `(10,8)` and a Projectile Blocker at `(10,6)`.
- Stage 2 Spear uses the HP 10 / ATK 8 / Move 4 / ATR 3 testing candidate.
- Wave 2 testing uses Spear `(12,8)`, Dagger `(11,5)`, and order `Spear → Dagger`.
- Every Wave uses the same Telegraph lifecycle: one full Player preparation turn, spawn, then immediate first activation.
- The complete paper test preserves three non-dominated Wave 1 lines and a stable aggressive Wave 2 friendly-fire solution.
- The first five-player test uses only the selected Stage 1→Stage 2 scenario; A/B testing is deferred.
- Battle Result remains in the flow; Buff Selection and Shop remain visible but mechanically frozen.
- Stage 1 HP carries into Stage 2, while temporary Shield/status/AP state resets.
- Playtest telemetry uses participant, session, attempt, and prototype-version identifiers.
- Archer design waits until Stage 2 establishes the problem it must solve.

These items remain subject to the individual status labels in earlier sections.

## 17.3 Explicitly superseded within the active redesign

- Treating Fortify as the old Hold/Brace action.
- Assuming projectile contact causes Repelled.
- Keeping Fortified after Fortify Shield is depleted.
- Making Dagger retreat the universal meaning of Repelled.
- Reusing the old Tutorial Hut placement for the new Stage 2 Protect layout.
- Using the Projectile Blocker candidate at `(11,7)`.
- Using Spear HP 15 / ATK 6 as the active Stage 2 paper-test baseline.
- Requiring Guard to finish Stage 2 at full HP.
- Designing Archer first and inventing a problem afterward.
- Introducing two Dagger enemies simultaneously at the start of Stage 1.

## 17.4 Open decisions that must not be guessed

- final canonical status of the Stage 1–4 replacement;
- complete late-game Fortify scaling and whether cooldown returns in production;
- exact implementation tolerance for centre-to-centre ATR;
- final art/readability treatment for the selected Directional Edge Cover and blocker;
- final production status of the playtest Wave lifecycle;
- final production Spear stats and whether the selected playtest scorer generalizes beyond Stage 2;
- Archer identity and Skills;
- Stage 3–4 encounter design;
- final Google Form wording and facilitator procedure;
- academic references for comparative/variant testing.

---

# 18. Selected Playtest Flow

## 18.1 End-to-end flow

**TENTATIVE — SELECTED FOR FIRST PROTOTYPE PLAYTEST**

```text
Playtest Profile Input
→ Stage 1
→ normal Battle Result
→ frozen Buff Selection
→ Stage 2 route selection
→ Stage 2
→ normal Battle Result
→ Playtest Complete
```

The latest accepted flow omits a second Buff Selection after Stage 2 because the selected slice ends there and no Stage 3 consumes the choice. This supersedes the earlier provisional chain that placed another frozen Buff Selection after Stage 2.

Shop remains accessible from the relevant Region/Run overview navigation, but progression purchases are disabled for this playtest.

## 18.2 Battle Result

Reuse the normal existing Battle Result presentation and data contract rather than creating a special redesign-only result screen.

Required visible information:

- victory/defeat state;
- stage name and node type;
- enemies defeated;
- total turns;
- Run Crystal reward;
- party status with stage-start HP, current HP, maximum HP, and HP lost;
- Continue action after result presentation.

Selected rewards:

| Stage | Run Crystal reward | Note |
|---|---:|---|
| Stage 1 | 20 | preserves current baseline |
| Stage 2 | 30 | identical for every temporary route shell |

## 18.3 Frozen Buff Selection

After Stage 1, the existing two-card selection remains visible so the broader run flow is represented.

In Playtest Mode:

- two Buff cards may still be generated and displayed;
- the player may select, change selection, confirm, or skip;
- selected Buff is recorded as `selectedInactiveBuffId`;
- selected Buff is not added to `activeRunBuffs`;
- selected Buff is not removed from its pool;
- no stat, AP, Skill, Shield, or battle-state modifier is applied;
- Active Buff List remains `0/10`.

Required notice:

> PLAYTEST MODE — Buff choices are recorded, but their battle effects are temporarily inactive.

## 18.4 Frozen Shop

In Playtest Mode:

- purchase and unlock buttons are disabled;
- Run/Meta Crystal is not spent;
- permanent profile values are not modified;
- old permanent upgrades are ignored when building the Stage 1–2 battle state;
- Fortify remains available as the Guard's selected core Skill;
- Intercept and additional Skills remain unavailable.

Required notice:

> PLAYTEST MODE — Shop progression is temporarily frozen so this test measures baseline battle design.

## 18.5 Stage 2 route shells

The current code contains three Stage 2 route definitions with different names, difficulty labels, and rewards. For this test:

- Easy, Normal, and Hard route shells may remain visible;
- every offered Stage 2 route points to the same redesign encounter;
- every route uses the same map, roster, stats, Wave order, objective, and reward `30`;
- route selection is recorded but has no gameplay effect;
- UI must disclose that all routes currently use the same test encounter.

Route selection must not later be interpreted as evidence of preferred challenge because the choices are mechanically identical.

---

# 19. Stage 1–2 Implementation Brief

## 19.1 Purpose and authorization boundary

This brief prepares implementation in the web/Vite prototype. It does not authorize implementation merely by existing; the Game Designer must deliberately start the Codex implementation task.

The implementation goal is:

> Build one observable Stage 1→Stage 2 playtest slice that tests basic tactical comprehension, Guard identity, Dagger pattern, Spear Aim readability, objective pressure, and activation-order manipulation.

## 19.2 Explicit non-goals

Do not include in this implementation slice:

- Unity changes;
- Stage 3 or Stage 4;
- Archer redesign or Archer deployment;
- final Buff balance or rarity;
- functional Shop purchases;
- permanent-upgrade balance;
- production economy tuning;
- A/B assignment or multiple player-test variants;
- rewriting or deleting the old Tutorial;
- claiming the paper-test outcomes as validated results.

## 19.3 Recommended data assets

Create new redesign assets rather than overwriting old Tutorial assets.

Recommended identifiers/paths:

| Purpose | Recommended asset |
|---|---|
| Stage 1 map | `public/data/maps/r1_stage1_redesign_v0_1.json` |
| Stage 1 encounter | `public/data/encounters/r1_stage1_redesign_v0_1.json` |
| Stage 2 map | `public/data/maps/r1_stage2_protect_hut_v0_1.json` |
| Stage 2 encounter | `public/data/encounters/r1_stage2_battle_redesign_v0_1.json` |

Names are implementation recommendations, not existing-file claims. The implementer should adapt them only if the repository's current loader contract requires another naming pattern.

## 19.4 Required Stage 1 runtime behaviour

1. Load the copied/simplified `16×16` old Tutorial map shape.
2. Spawn Guard at `(2,10)` with baseline HP 25, ATK 5, Move 3, ATR 1.5.
3. Spawn Dagger 1 at `(8,11)` with HP 16, ATK 6, Move 3, ATR 1.5.
4. Use Shared Team AP 2.
5. Dagger targets nearest living Player Hero only.
6. Expose contextual non-modal cues for camera, selection, movement, End Turn, Intent, Attack, Fortify, Repelled, and Wave Telegraph.
7. After Dagger 1 dies, create Dagger 2 Telegraph at `(12,8)`.
8. Give one full preparation turn under the universal Telegraph lifecycle.
9. Spawn and immediately activate Dagger 2 after that preparation turn ends.
10. Complete the stage only after Dagger 2 dies and no required Wave remains.

Expected Move 3 example from the selected spawn is:

```text
(12,8) → (11,8) → (10,8) → (9,8)
```

Movement points count tile transitions; intermediate tiles are not additional destinations.

## 19.5 Required Fortify and Repelled behaviour

Fortify:

- Guard-only core Skill;
- self-target only;
- cost 2 Team AP;
- grant Shield 6;
- no cooldown in this playtest;
- non-stacking;
- immediately active;
- remaining Shield expires when the next Player Turn begins.

Fortified:

- derived only while Guard's Fortify Shield is greater than zero;
- ends when Shield becomes zero or expires;
- not automatically granted by generic Shield on another unit.

Repelled trigger:

- evaluate whether Guard was Fortified at the start of the melee hit;
- a melee hit may trigger Repelled even when it consumes the final Shield point;
- ranged/projectile damage never triggers Repelled.

Dagger Disengage:

- on its next activation, choose one legal adjacent tile that increases distance from current Guard position;
- move exactly one tile;
- perform no attack;
- clear Repelled after resolution;
- if no farther legal tile exists, remain in place, skip attack, and clear Repelled.

## 19.6 Required Stage 2 runtime behaviour

1. Carry Guard's current HP from Stage 1.
2. Reset temporary Shield, Fortified, Repelled, movement/action flags, battle-only cooldowns, and Team AP.
3. Place Guard at `(10,11)`.
4. Create one Hut entity with HP 28 and footprint `x=7..9, y=7..9`.
5. Place east-facing O30 Cover at `(10,8)`.
6. Place Projectile Blocker at `(10,6)`.
7. Wave 1 Spear spawns at `(12,8)`.
8. Wave 2 uses Spear `(12,8)` then Dagger `(11,5)` in visible order.
9. Victory requires all required enemies defeated and Hut alive.
10. Defeat occurs if Guard or Hut reaches zero HP.

Stage 2 baseline:

| Entity | HP | ATK | Move | ATR |
|---|---:|---:|---:|---:|
| Guard | carried / 25 max | 5 | 3 | 1.5 |
| Dagger | 16 | 6 | 3 | 1.5 |
| Spear | 10 | 8 | 4 | 3 |
| Hut | 28 | — | — | — |

## 19.7 Required Spear behaviour

Targeting:

```text
valid Player Objective Structure
→ otherwise nearest valid Player Hero
```

Cycle:

```text
Aim
→ later Throw on locked trajectory
→ Reposition
→ Aim again
```

Aim must store at least:

- `targetEntityId` for explanation/debugging;
- `lockedTargetTile` for resolution;
- `lockedTrajectory` as the ordered collision cells;
- activation/order metadata needed by the UI.

Throw must:

- use the stored trajectory without retargeting;
- collide with the first valid object;
- be non-piercing;
- permit Guard/Hut interception, enemy friendly fire, and blocker collision;
- apply only one damage instance to the Hut entity;
- allow a miss if the lane becomes empty;
- reposition only after the locked Throw resolves.

Trajectory collision must use the selected centre-to-centre rule:

- interior crossing blocks;
- positive-length edge overlap blocks;
- one-point single-corner contact passes;
- two side obstacles at the same crossed vertex create a blocking diagonal pinch;
- nearest collision from Spear resolves first.

Cover reduces Spear damage with the selected O30 rule:

```text
floor(8 × 0.7) = 5
```

Projectile Blocker stops the projectile and applies no damage beyond it.

Directional O30 Cover on `(10,8)` is occupiable, protects only its occupant, and faces east. It applies when the incoming segment enters through the east edge, including an exact 45-degree east corner. It modifies damage but does not stop the projectile.

For implementation safety, rendering, inspection preview, and damage resolution must consume the same `lockedTrajectory` and collision result. Do not allow UI and resolver to calculate different cells.

After Throw, evaluate reachable Reposition candidates in the locked order: future preferred-target firing lane, clean lane, Hero safety, maximum effective target distance, minimum movement, then `y/x` tie-break. Preserve the Objective Structure as preferred target while it remains valid. If no future firing position exists, move to the safest reachable tile, expose `No Valid Aim Lane`, and do not create Aim.

## 19.8 Contextual UI requirements

The prototype may emphasize relevant existing UI, but must not gate the player's exact action.

Wave Telegraph shows:

- spawn tile and enemy type;
- countdown/preparation status;
- activation-order position;
- preferred target;
- projected first behaviour/threat envelope.

Spear Aim shows:

- exact locked target tile;
- exact lane/trajectory;
- current first collider;
- predicted damage after Cover/Shield where inspectable.

Generic Intent continues to hide exact future movement paths. Locked Aim is the explicit exception because the fixed lane is the mechanic the player must reason about.

Cover and Projectile Blocker require visibly different icons, tile treatment, tooltip wording, and hit feedback.

## 19.9 Retry and stage-entry snapshots

Identity rules:

- one `sessionId` per Stage 1→2 playthrough;
- a new `attemptId` for every stage retry.

Retry rules:

- Stage 1 retry restores baseline Guard HP 25 and the initial Stage 1 state;
- Stage 2 retry restores the immutable Stage 2 entry snapshot, including HP carried from Stage 1;
- Stage 2 retry does not heal Guard to 25 unless the carried entry HP was 25;
- failure grants no duplicate reward;
- completed-stage reward cannot be granted twice.

If an unusually low carried HP state makes Stage 2 impractical, the facilitator may stop the session and record the outcome. The game must not silently heal to protect completion rates.

## 19.10 Recommended source boundaries

Verified existing integration surfaces:

| Responsibility | Existing area to inspect/extend |
|---|---|
| application scene flow | `src/main.js` |
| run nodes, rewards, route generation | `src/logic/run/runState.js` |
| Buff generation/application | `src/logic/run/buffSystem.js` |
| battle-state construction | `src/logic/battle/battleSetup.js` |
| Fortify and Skill rules | `src/logic/battle/skillLogic.js` |
| Wave Telegraph/spawn | `src/logic/battle/waveLogic.js` |
| enemy target and Intent | `src/logic/battle/enemyTargetLogic.js`, `enemyIntentLogic.js` |
| enemy movement/attack | `src/logic/battle/enemyMovementLogic.js`, `enemyAttackLogic.js` |
| objective/structure | `src/logic/battle/objectiveLogic.js`, `structureLogic.js` |
| battle HUD | `src/ui/battle/battleHud.js` |
| flow screens | `src/ui/flow/basicFlowScreens.js` |
| Shop | `src/ui/flow/shopScreen.js` |
| profile persistence | `src/logic/profile/profileStorage.js` |

Recommended new isolated modules:

| Responsibility | Recommended module |
|---|---|
| participant/session/attempt state | `src/logic/playtest/playtestSession.js` |
| local event queue and upload adapter | `src/logic/playtest/telemetryClient.js` |
| event constructors/schema validation | `src/logic/playtest/telemetryEvents.js` |
| profile-input screen | `src/ui/flow/playtestProfileScreen.js` |
| completion/export screen | `src/ui/flow/playtestCompleteScreen.js` |

These new paths are recommendations. Keep playtest instrumentation separate from combat rules so later removal or migration does not destabilize battle logic.

---

# 20. Minimum Telemetry Specification

## 20.1 Identity envelope

Every event should include:

```text
eventId
eventName
participantCode
sessionId
attemptId when stage-specific
prototypeVersion or build commit
stageId when stage-specific
clientTimestamp
elapsedMs from session or attempt start
payload
```

Use a tester code such as `T01` as the research identifier. A nickname may be shown locally, but a real full name is not required in telemetry.

## 20.2 Required events

Session and attempt lifecycle:

- `session_started`;
- `stage_attempt_started`;
- `stage_completed`;
- `stage_failed`;
- `stage_retried`;
- `session_completed`;
- `session_abandoned` when determinable.

First-learning milestones may share one event name, `learning_milestone`, with a `milestoneType`:

- `camera_used`;
- `guard_selected`;
- `first_move`;
- `first_end_turn`;
- `intent_inspected`;
- `first_attack`;
- `first_fortify`;
- `first_repelled_observed`.

Combat events:

- `turn_ended`;
- `fortify_used`;
- `fortified_hit`;
- `repelled_applied`;
- `disengage_resolved`;
- `wave_telegraph_shown`;
- `wave_spawned`;
- `aim_created`;
- `aim_inspected`;
- `aim_resolved`.

Progression-shell events:

- `inactive_buff_offered`;
- `inactive_buff_selected` or `inactive_buff_skipped`;
- `route_selected`.

## 20.3 Turn snapshot

`turn_ended` should record only the state needed to reconstruct major decisions:

- stage, attempt, and Player Turn number;
- Team AP remaining;
- Guard position, current/max HP, Shield, and relevant statuses;
- Hut current/max HP when present;
- living enemies with position, HP, Intent, target, status, and activation order;
- pending Wave countdown;
- current locked Aim target tile, trajectory identifier/cells, and current first collider.

Do not record continuous mouse movement or every hover. The goal is interpretable research evidence, not exhaustive surveillance.

## 20.4 Meaning limits

- `aim_inspected` means the player opened or focused Aim information; it does not prove understanding.
- `intent_inspected` means the information was viewed; it does not prove correct prediction.
- a friendly-fire result does not by itself prove it was intentional.
- route choice does not indicate difficulty preference because all Stage 2 route shells are identical.

Understanding must be checked through observation and the player's own explanation.

## 20.5 Storage and failure behaviour

Selected direction:

- maintain a local browser queue so GitHub Pages can run without its own server;
- allow upload to an external database such as Supabase when configured;
- use only a public/anonymous client key with insert-only Row Level Security;
- never place a service-role key in browser code;
- prevent public read access to collected rows;
- telemetry upload failure must never block gameplay;
- preserve unsent events locally and offer JSON export on the completion screen.

The completion screen should show participant/session code, attempts, total time, upload state, Google Form link, and JSON export fallback.

---

# 21. Verification and Acceptance Plan

## 21.1 Automated tests required

Add or extend tests for:

1. Fortify costs 2 AP, targets self only, grants Shield 6, and has no playtest cooldown.
2. Shield expires at the next Player Turn boundary.
3. Final-Shield melee hit still applies Repelled.
4. Projectile damage does not apply Repelled.
5. Repelled Dagger performs one-tile Disengage, no attack, then clears status.
6. Dagger never selects Hut as its target.
7. Telegraph requires one full Player preparation turn, including the mid-turn creation edge case.
8. Spawned enemies immediately activate in visible Spawn Order.
9. Spear Aim locks tile and trajectory and does not retarget before Throw.
10. First-collision resolution supports Guard, Hut, enemy friendly fire, blocker, and miss.
11. Interior crossing and positive-length edge overlap block, while a single-point corner graze passes.
12. Two-obstacle diagonal pinch blocks at the shared corner and resolves before later collisions.
13. Hut footprint receives one damage instance per projectile.
14. Directional Edge Cover applies only to its occupant and correct protected entry sector, including exact 45-degree east diagonals.
15. Cover, Shield, and HP apply in the defined damage order.
16. Reposition scorer follows firing lane, clean lane, Hero safety, effective range, movement, and coordinate tie-break order.
17. No-lane fallback preserves a living Objective as preferred target and creates no fake Aim.
18. Pending required Waves prevent early victory.
19. Stage 1 HP carries into Stage 2 while temporary state resets.
20. Stage 1 and Stage 2 retry snapshots restore the correct different HP baselines.
21. Buff selections never enter `activeRunBuffs` in Playtest Mode.
22. Shop actions cannot spend currency or mutate profile progression in Playtest Mode.
23. All Stage 2 route shells resolve to the same encounter and reward 30.
24. Rewards cannot be duplicated through retry/navigation.
25. Telemetry queue failure does not interrupt scene or combat progression.

Existing regression suite must remain green.

## 21.2 Manual scenario checks

Manually verify at minimum:

- Stage 1 can be completed through defensive and aggressive approaches;
- Dagger 2 Telegraph is readable and obeys the same universal lifecycle;
- Fortify/Repelled cause-and-effect is visible without a modal explanation;
- Stage 2 Wave 1 preserves Fortify, Direct, and South-flank choices;
- Stage 2 Wave 2 can produce the predicted Spear-to-Dagger friendly fire;
- exact Aim lane, collider, activation order, Cover, and blocker remain visually distinguishable;
- Stage 2 retry restores carried entry HP;
- offline/failed telemetry upload still allows completion and JSON export.

## 21.3 Completion gate

The implementation is not considered ready for five-player testing until:

- automated tests pass;
- production build succeeds;
- one complete local Stage 1→2 run succeeds;
- one retry is tested in each stage;
- one offline telemetry/export test succeeds;
- no old Tutorial file was overwritten;
- repository diff contains only intended redesign/playtest changes.

On Windows PowerShell, prefer:

```text
npm.cmd test
npm.cmd run build
```

This avoids the earlier `npm.ps1` execution-policy blocker without changing machine policy.

---

# 22. Recommended Implementation Order

1. Confirm clean Git branch/status and create a dedicated implementation branch if desired.
2. Add Playtest Mode/session state without changing battle behaviour.
3. Add new Stage 1–2 map and encounter data.
4. Implement Fortify/Fortified/Repelled/Disengage with unit tests.
5. Implement universal Wave lifecycle with tests.
6. Implement Spear Aim/trajectory/collision/reposition with tests.
7. Implement Hut objective, Cover, blocker, victory/defeat, and Stage 2 Wave sequence.
8. Wire HP carry, retry snapshots, rewards, and frozen progression flow.
9. Add contextual cues and Playtest Complete screen.
10. Add local telemetry queue, optional upload adapter, and JSON export.
11. Run the complete automated suite and build.
12. Run the manual acceptance scenarios.
13. Review diff, update implementation handoff, commit, and push only after Game Designer approval.

After runtime validation, return to design work:

```text
Stage 2 produces verified problem X while Guard maintains responsibility Y
→ redesign Archer to provide systemic answer Z
```

---

# 23. New-Chat Recovery Summary

If work resumes in a new thread, provide this document together with the latest canonical design context and latest implementation state.

The minimum resume instruction is:

```text
Continue TMTB from Battle Redesign Checkpoint v0.3.
Treat it as a non-canonical working checkpoint and implementation brief.
The selected first playtest is one web-prototype Stage 1→2 scenario, not an A/B test and not Unity.
Preserve its status labels and do not silently promote paper-test results to runtime truth.
Before coding, verify live Git status and current repository source against commit 81259555.
Do not redesign Archer until Stage 2 is implemented and its tactical problem is observed.
```

---

# 24. Change Log

## v0.3 — 21 September 2026

- Added the selected centre-to-centre collision rule: edge overlap blocks, single-corner graze passes, and a two-obstacle diagonal pinch blocks.
- Replaced old non-directional obstacle Cover semantics for the Stage 2 test with occupiable Directional Edge O30 Cover.
- Locked the first-test Spear Reposition scorer, deterministic tie-break, preferred-target preservation, and no-lane fallback.
- Verified the relevant prototype integration surfaces without repeating the full prior audit.
- Locked the selected Stage 1 coordinates and sequential Dagger introduction for prototype testing.
- Recorded Fortify with no cooldown and exact one-tile Dagger Disengage for the initial test.
- Selected one universal Wave Telegraph lifecycle, including the mid-turn Telegraph edge case.
- Preserved Stage 2 Variant A as fallback and selected Variant B for the first five-player test.
- Recorded normal Battle Result, frozen Buff Selection/Shop, identical Stage 2 route shells, rewards, HP carry, and retry snapshots.
- Added participant/session/attempt identity and the minimum telemetry event specification.
- Added implementation boundaries, source-area mapping, recommended new modules, automated tests, manual checks, and completion gates.
- Moved the project from paper-design refinement to implementation preparation while retaining non-canonical status.

## v0.2 — 21 September 2026

- Replaced the Stage 2 layout v0.1 candidate with layout v0.3.
- Recorded east-facing O30 Cover at `(10,8)` and Projectile Blocker at `(10,6)`.
- Rejected the blocker at `(11,7)` because it made the flank route dominated.
- Revised the Spear paper-test baseline from HP 15 / ATK 6 to HP 10 / ATK 8.
- Recorded full Wave 1 outcomes for Fortify, Direct, and South-flank lines.
- Recorded the Wave 2 Spear/Dagger activation-order and friendly-fire paper test.
- Preserved the spawn-lifecycle conflict and geometry rules as unresolved dependencies.
- Moved the resume point from terrain placement to geometry and spawn-lifecycle decisions.

## v0.1 — 21 September 2026

- Captured lecturer-driven redesign rationale.
- Preserved agreed workflow and anti-tangent dependency order.
- Recorded Stage 1 Guard/Dagger/Fortify/Repelled working design.
- Recorded Stage 2 Protect Hut/Spear/Aim/trajectory/friendly-fire working design.
- Recorded paper-test outcomes and Wave 1–2 transition candidate.
- Identified conflicts with v3.4 canonical design and Handoff v3.2 implementation.
- Preserved open questions and immediate next work.

---

# Final Checkpoint Principle

> This document preserves reasoning and current redesign direction. It must help the next discussion continue accurately, but it must not turn an untested idea into a final rule merely because it has been written down.
