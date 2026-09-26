# TMTB Battle Redesign Checkpoint

**Project:** TMTB / BeCan  
**Document Type:** Supporting Design Handoff / Active Redesign Checkpoint  
**Checkpoint Version:** 0.1  
**Date:** 21 September 2026  
**Canonical Status:** **NON-CANONICAL WORKING CHECKPOINT**  
**Design Scope:** Post-lecturer-feedback battle redesign, Stage 1–2  
**Prototype Implementation Baseline:** Git commit `81259555cd961a9ddfba9e7aa21bdd32abbe5848`, as reported by the Game Designer  
**Implementation Status of This Redesign:** **NOT IMPLEMENTED / NOT RUNTIME-TESTED**

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

## 3.2 Not verified yet

This checkpoint does not claim:

- current repository inspection after commit `81259555...`;
- implementation of the redesign;
- runtime or automated testing of the redesign;
- exact Unity behaviour;
- exact Stage 1 map dimensions or coordinates;
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
Stage 2 objective and Spear loop
→ activation order and Wave transition drafted
→ next: minimal Cover and Projectile Blocker placement
→ repeat paper test
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
| Fortify | 1 AP, Shield 4, self/ally range 2, cooldown 2 | Guard self skill, 2 AP, Shield 6, Fortified/Repelled loop | **TENTATIVE — accepted for testing** |
| Hold | Separate 1 AP preparation action; effect open | Remains conceptually separate from Fortify | **LOCKED separation; Hold details OPEN** |
| Baseline melee enemy | Documented as Sword; nearest Hero; no Pattern | Discussed as Dagger; nearest Hero; Repelled response | **Naming OPEN; behaviour partially redesigned** |
| Spear | Nearest Hero; move and basic ranged attack in one activation | Preferred Objective Structure; Aim → Throw + Reposition | **TENTATIVE redesign** |
| Wave spawn | Spawn displays Intent and does not immediately attack/move | Candidate: telegraph, preparation, spawn, then immediate first activation | **OPEN conflict requiring explicit decision** |
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

**TENTATIVE**

- Use the full old Tutorial map as the available Stage 1 environment rather than revealing it in rigid subareas.
- Exact dimensions and coordinates still require repository/map verification; approximately `16×16` has been discussed but is not confirmed here.
- Begin with Guard only.
- Begin with one Dagger positioned far enough away to allow movement, camera, selection, and End Turn discovery.
- Spawn the second Dagger only after the first is defeated.
- A simultaneous two-Dagger setup remains useful as a stress test, not as the intended Stage 1 opening.

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
| Cooldown | 2 remains a carried prototype candidate, not reconfirmed final design |

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
- candidate maximum displacement: 2 tiles;
- do not attack during that activation;
- clear Repelled after resolving the response.

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

These values show opposite attrition profiles while keeping stage completion possible. They must be recalculated after exact positions, turn counts, cooldown handling, and movement distances are locked.

## 9.12 Stage 1 open questions

- Exact map dimensions and coordinates.
- Exact Guard and Dagger start positions.
- Exact first-Dagger approach distance.
- Exact second-Dagger spawn timing and tile.
- Whether Fortify cooldown remains 2.
- Whether Disengage uses a fixed distance, “outside ATR,” or a tile scorer.
- Whether Dagger/Sword naming is a rename or a separate unit identity.
- Whether Stage 1 needs an explicit reward/clear condition beyond Eliminate All.
- Exact contextual UI cues and when each cue retires.

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

## 10.4 Stage 2 layout v0.1

Stage 2 may use a new map/layout rather than the old Tutorial Hut placement.

**TENTATIVE PAPER-TEST LAYOUT**

- Maximum arena: approximately `16×16`.
- Build outward from the Hut as the central tactical object.
- No obstacle is used in the first baseline paper test so the Spear loop can be isolated.

Coordinate assumptions:

| Element | Candidate coordinate/footprint |
|---|---|
| Hut | `x=7..9, y=7..9` |
| Guard initial tile | `(10,11)` |
| Spear initial east tile | `(12,8)` |
| First aimed Hut tile | `(9,8)` |
| Initial lane | `(11,8) → (10,8) → (9,8)` |

Candidate firing-ring positions:

| Direction | Tile |
|---|---|
| North | `(8,4)` |
| North-east | `(11,5)` |
| East | `(12,8)` |
| South-east | `(11,11)` |
| South | `(8,12)` |
| South-west | `(5,11)` |
| West | `(4,8)` |
| North-west | `(5,5)` |

These are geometry candidates, not hardcoded Spear waypoints. The intended future AI should score legal positions according to its role.

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

Working baseline stats remain **TENTATIVE**:

| HP | ATK | Move | ATR |
|---:|---:|---:|---:|
| 15 | 6 | 4 | 3 |

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

Candidate scoring priorities:

1. legal future firing lane to preferred target;
2. safety relative to all living Heroes;
3. distance near maximum effective ATR;
4. least movement;
5. stable deterministic tie-breaker.

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

## 10.9 One-Spear paper test

Starting assumptions:

- Guard begins around `(10,11)`.
- Spear begins around `(12,8)`.
- Spear aims east-side lane into the Hut.
- Guard can pre-position around `(10,8)`.

Discussion outcomes:

| Line | Player response | Result | Guard HP | Hut HP |
|---|---|---|---:|---:|
| A | Fortify in lane | Guard absorbs Throw and closes | 25 | 28 |
| B | Move to `(11,8)` and attack/intercept | Guard accepts one hit | 19 | 28 |
| C | Flank off lane through `(11,9)` and attack | Hut accepts one hit | 25 | 22 |

All three lines defeated the Spear around Player Turn 4 in the discussion model.

Interpretation:

- Fortify is the cleanest isolated answer.
- Direct interception preserves Hut at Guard's expense.
- Flanking preserves Guard at Hut's expense.
- This is acceptable as a first Spear lesson, but later mixed pressure is needed so Fortify does not remain an automatic universal answer.

These results require recalculation after exact path distances and obstacle rules are set.

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

**TENTATIVE — NEEDS EXPLICIT REVIEW**

### Stage entry / Wave 1

```text
Stage entry Telegraph
→ Wave 1: one Spear at approximately (12,8)
→ one Player preparation turn
→ Spear enters its Aim cycle
→ player reads and answers the locked lane
→ Spear defeated
```

### Intermission

Guard's actual final position is preserved. No teleport or artificial reset is assumed.

Likely end locations from the paper route include approximately `(10,6)` or `(11,6)`, but these remain route-dependent.

### Wave 2 Telegraph

Candidate roster and order:

| Order | Enemy | Candidate spawn |
|---:|---|---|
| 1 | Spear | `(12,8)` |
| 2 | Dagger | `(10,5)` |

The player receives one preparation turn. From the likely intermission positions, candidate bait/interception tiles include approximately `(10,9)` or `(11,9)`.

### Wave 2 interaction hypothesis

Candidate sequence:

```text
Spear acts first and Aims a clean lane
→ Dagger acts second and approaches Guard
→ Dagger may enter the locked lane
→ next Player Turn exposes the combined threat
```

Possible player answers:

1. **Fortify line**

   ```text
   Spear Throw hits Dagger for 6
   → Dagger continues if alive
   → Dagger attacks Fortified Guard
   → Shield absorbs 6
   → Dagger becomes Repelled
   ```

2. **Aggressive Dagger line**

   ```text
   Guard attacks Dagger twice
   → Dagger falls into 6 HP range
   → Spear Throw kills Dagger before Dagger activation
   → Hut remains safe
   ```

3. **Alternative positioning**

   If the player does not prepare the bait/interception relationship, friendly fire is not forced. The player instead accepts a different Guard-HP versus Hut-HP trade-off.

This is intended to teach that activation order and locked lanes can be manipulated, not merely observed.

## 10.13 Spawn-to-first-activation conflict

The old canonical rule states:

```text
spawn
→ display Intent
→ no immediate offensive Movement/Attack at that same spawn moment
```

The newest redesign candidate considered:

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

However, this directly conflicts with a previously **LOCKED** canonical direction. It must remain **OPEN / TENTATIVE** until the Game Designer explicitly selects one lifecycle and paper testing confirms the timing.

## 10.14 Stage 2 open questions

- Exact spawn-to-first-activation lifecycle.
- Whether Wave 2 ordering is definitively `Spear → Dagger`.
- Exact coordinates after adding terrain.
- Exact projectile-blocking terrain rule.
- Exact Cover placements and values.
- Whether the candidate firing ring provides too many equivalent positions.
- Spear deterministic tile-scoring tie-breakers.
- Spear response when no valid preferred-target lane exists.
- Hut target tile selection across a 3×3 footprint.
- Hut HP and destruction/walkability behaviour.
- Whether every required Wave blocks victory in this stage.
- Exact Stage 2 rewards, retry state, and progression consequence.

---

# 11. Cover and Projectile Blockers — Next Design Task

## 11.1 Goal

Add the minimum terrain needed to create richer route and interception choices without obscuring the Spear's readable firing-ring identity.

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

## 11.3 Next paper-test questions

1. Does the player understand why one tile reduces damage while another blocks the shot?
2. Can Guard still choose among Fortify, interception, and flanking?
3. Does terrain create a real route choice rather than one obvious safe tile?
4. Can Spear still obtain at least one understandable Aim lane?
5. Does Wave 2 still allow, but not force, friendly-fire manipulation?
6. Does the layout remain readable without a long explanation box?

No exact terrain coordinates have been accepted yet.

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
- Run Crystal rewards;
- Shop prices;
- recovery/rest rules;
- final Region 1 composition;
- full LOS system;
- Stage 4 Mini-Boss mechanics;
- final questionnaire and telemetry schema.

These systems should be revisited when they become dependencies of the selected test slice.

---

# 14. Variant and Playtest Direction

## 14.1 Variant testing

**PLANNED**

The redesign may produce one or two mechanically distinct variants of:

- a unit mechanic;
- a Stage 1–4 progression;
- a map/wave arrangement;
- a tutorial-support presentation.

Both variants may be tested with the same core questions when the comparison is controlled. This is a working methodological direction; the academic method and supporting journal references still need to be selected and cited before formal reporting.

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

Candidate metrics:

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

Formal questions should be written only after the test variant and intended hypothesis are defined.

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
| R-10 | Wave spawn | no immediate offensive activation | immediate first activation candidate | explicit design decision required |
| R-11 | Stage 2 Hut | old Tutorial destroy-object content | player-side Protect Objective | create new encounter/objective configuration |
| R-12 | Archer | Pinning Shot/Volley prototype baseline | problem-driven identity not yet designed | pause implementation changes |

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
- Melee contact against Fortified Guard causes Repelled.
- Repelled Dagger responds with Disengage.
- Dagger targets Heroes, not Structures.
- Stage 2 centres on Protect Hut plus Eliminate All.
- Spear prefers Objective Structures and falls back to nearest Hero.
- Spear uses Aim → locked tile/lane → Throw → Reposition.
- Spear projectile is non-piercing and can friendly-fire the first collided enemy.
- Archer design waits until Stage 2 establishes the problem it must solve.

These items remain subject to the individual status labels in earlier sections.

## 17.3 Explicitly superseded within the active redesign

- Treating Fortify as the old Hold/Brace action.
- Assuming projectile contact causes Repelled.
- Keeping Fortified after Fortify Shield is depleted.
- Making Dagger retreat the universal meaning of Repelled.
- Reusing the old Tutorial Hut placement for the new Stage 2 Protect layout.
- Requiring Guard to finish Stage 2 at full HP.
- Designing Archer first and inventing a problem afterward.
- Introducing two Dagger enemies simultaneously at the start of Stage 1.

## 17.4 Open decisions that must not be guessed

- final canonical status of the Stage 1–4 replacement;
- Fortify cooldown and complete late-game scaling;
- exact Repelled duration and Dagger Disengage scorer;
- exact Stage 1 coordinates;
- exact Stage 2 terrain;
- wave spawn-to-first-activation lifecycle;
- Hut footprint/HP confirmation and target-tile semantics;
- final Spear stats and AI scorer;
- Archer identity and Skills;
- Stage 3–4 encounter design;
- playtest variants and questionnaire;
- academic references for comparative/variant testing.

---

# 18. Immediate Next Work

## Step 1 — Review this checkpoint

Confirm whether it correctly separates:

- old canonical design;
- active redesign direction;
- tentative numerical candidates;
- unresolved conflicts;
- prototype implementation truth.

## Step 2 — Resolve the Stage 2 terrain dependency

Create the smallest candidate set of:

- Cover tiles;
- Projectile Blocker tiles;
- approach routes;
- Spear firing positions.

## Step 3 — Repeat paper tests

Test:

- one Spear baseline;
- Spear + Dagger Wave 2;
- Guard Fortify line;
- aggressive line;
- interception line;
- Hut-risk line;
- friendly-fire manipulation;
- failure/readability cases.

## Step 4 — Lock or revise the lifecycle

Explicitly decide:

- spawn timing;
- first activation timing;
- Wave 2 execution order;
- information shown during Telegraph.

## Step 5 — Derive Archer's problem statement

Only after Stage 2 pressure is coherent, write:

```text
Guard cannot efficiently solve X while maintaining Y
→ Archer exists to provide Z
```

## Step 6 — Continue Stage 3–4 and testing design

Then define variants, hypotheses, participant tasks, questions, metrics, and implementation scope.

---

# 19. New-Chat Recovery Summary

If work resumes in a new thread, provide this document together with the latest canonical design context and latest implementation state.

The minimum resume instruction is:

```text
Continue TMTB battle redesign from the Stage 2 Cover / Projectile Blocker task.
Treat this file as a non-canonical supporting checkpoint.
Preserve its status labels.
Do not implement yet.
Do not redesign Archer until Stage 2 establishes the tactical problem Archer must solve.
Flag any conflict with later explicit Game Designer decisions or current repository truth.
```

---

# 20. Change Log

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
