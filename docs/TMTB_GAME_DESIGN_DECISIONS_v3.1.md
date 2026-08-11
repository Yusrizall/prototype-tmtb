# TMTB Game Design Decisions

**Document Type:** Canonical Game Design Decision Snapshot
**Project / Game Code:** TMTB
**Development Group:** BeCan
**Primary Game:** 3D Turn-Based Tactics
**Target Production Environment:** Unity
**Decision Snapshot Version:** 3.1
**Last Updated:** 11 August 2026
**Status:** **CANONICAL GAME DESIGN SNAPSHOT**
**Primary Design Reference:** `TMTB_GAME_DESIGN_CONTEXT.md` Version 3.1

---

# 1. Purpose of This Document

This document is the compact decision snapshot for current TMTB game-design intent.

It answers:

> **What design rules currently apply, which directions are still tentative, what remains open, and which older rules have been replaced?**

This document is intentionally narrower than `TMTB_GAME_DESIGN_CONTEXT.md`.

`TMTB_GAME_DESIGN_CONTEXT.md` preserves the full design context, rationale, frameworks, historical carryover, and wider design space.

`TMTB_GAME_DESIGN_DECISIONS.md` records the currently relevant decisions in a form that can be read quickly by Game Designer, programmer, UI/UX, artist, or a new assistant.

This document is **not** a statement that the current JavaScript prototype already implements every decision listed here.

---

# 2. Source-of-Truth Priority

For **game-design intent**:

```text
1. Latest explicit Game Designer decision
2. TMTB_GAME_DESIGN_CONTEXT.md — latest version
3. TMTB_GAME_DESIGN_DECISIONS.md — latest version
4. Latest domain-specific design handoff where detail has not yet been migrated
5. Historical / legacy design documents
```

For **prototype implementation truth**:

```text
1. Actual source code and data
2. Confirmed runtime testing
3. Latest TMTB_CURRENT_STATE
4. Latest Architecture / State & Data / implementation handoff
```

If implementation and design intent differ:

```text
Do not silently merge them.
→ state the conflict
→ treat this document as intended design
→ audit actual source/runtime
→ decide the implementation migration explicitly
```

---

# 3. Decision Status Legend

## LOCKED

Current canonical design direction. It remains active until explicitly changed.

## PLANNED

Intended design that remains part of the current direction but is not yet fully implemented, authored, or validated.

## TENTATIVE

Working design, rule, value, formula, or interpretation that may change after prototype testing, balancing, research, or team review.

## OPEN

Not yet decided.

## SUPERSEDED

Older design intentionally replaced by a newer decision.

## PROTOTYPE ONLY

Feature, rule, flow, or simplification intended for the validation prototype and not automatically part of the main game.

## DEVELOPMENT EXCEPTION

Temporary development boundary that differs from intended full-game structure.

## HISTORICAL DESIGN SEED

Older concept preserved for reference but not treated as the current plan.

---

# Part I — Game Identity and Design Direction

# 4. Game Identity

## LOCKED

```text
Game / Project Code: TMTB
Development Group: BeCan
Genre: 3D Turn-Based Tactics
Production Target: Unity
Progression Structure: Semi-Roguelite / Light Roguelite
Meta Progression: Permanent progression across runs
```

TMTB is the game.

The Vite + Vanilla JavaScript prototype is a 2D/simulative:

```text
Game Designer Validation Tool
+
Unity Functional Flow Reference
```

It may mechanically simplify final 3D systems while preserving important intended Unity flow.

Prototype implementation or prototype-only evaluation content does not automatically become main-game canon.

---

# 5. Core Player Experience

## TENTATIVE — STRONG CANONICAL DIRECTION

TMTB is a tactical roguelite about:

- reading enemy goals, Intent, and learnable behaviour;
- arranging party position in a tactical environment;
- allocating a shared pool of Action Points across the party;
- deciding when to preserve positional flexibility and when to commit a unit's position;
- adapting the party through temporary run growth, route decisions, resources, and persistent progression;
- preserving party condition across the run.

---

# 6. Core Design Pillars

## TENTATIVE — STRONG DIRECTION

Current pillar set:

```text
Readable Threats
Shared Tactical Economy
Position Commitment
Adaptive Party Development
```

### Readable Threats

Enemies should communicate enough information for informed tactical decisions without exposing the optimal solution.

### Shared Tactical Economy

Action Points belong to the party, creating opportunity cost between units and actions.

### Position Commitment

The player chooses when to preserve movement flexibility and when an action makes the current position a commitment.

### Adaptive Party Development

Combat result, HP condition, route, reward, resource, and permanent progression should influence later decisions in the run.

---

# Part II — Macro Progression and Region Structure

# 7. Full Run Structure

## LOCKED

A full intended run spans:

```text
Village
→ Town
→ Castle
→ Final Run Resolution
→ Run Settlement
→ Meta Progression
```

Completing Village alone is **not** the intended full-game run boundary.

## OPEN

- final internal structure of Town;
- final internal structure of Castle.

---

# 8. Current Prototype Run Boundary

## DEVELOPMENT EXCEPTION

The current prototype may treat Region 1 — Village completion or defeat as a temporary settlement point.

This does not redefine the intended full-game run boundary.

---

# 9. Region 1 Structure

## LOCKED FOR REGION 1 DIRECTION

```text
Stage 1 — Fixed
→ 2 unique Stage 2 nodes generated from A/B/C
→ 2 unique Stage 3 nodes generated from A/B/C
→ Stage 4 — Fixed Mini-Boss climax
```

This topology is not automatically required for later regions.

---

# 10. Route Preview and Commitment

## LOCKED

- Generated route information is visible for planning.
- Previewing a node does not commit the route.
- Opening encounter information does not by itself commit the route.
- Beginning the selected encounter commits the choice.
- Alternative sibling routes may become blocked after commitment.

## OPEN / DEFERRED

Special mechanics that can reopen blocked routes are not currently defined.

---

# 11. Controlled Randomization

## PLANNED / DEFERRED

Future route/content randomization may use:

- weighted pools;
- controlled selection;
- conditional rules;
- run seeds;
- progression-dependent pools.

Exact method remains open.

---

# Part III — Player Turn and Action Economy

# 12. Combat Turn Structure

## LOCKED

Baseline battle flow:

```text
Player Turn
→ Enemy Turn
→ Player Turn
→ repeat until battle resolution
```

The Player Turn belongs to the **party**, not to isolated one-time unit activations.

---

# 13. Shared Action Points

## LOCKED

At the start of each Player Turn:

```text
Team AP = Living Player Units × 2
```

AP belongs to the party pool.

A single unit may consume several or all available AP when its actions remain legal.

The system does not force equal AP distribution between units.

---

# 14. AP Refresh and Carry-Over

## LOCKED

```text
End Player Turn
→ remaining Team AP discarded

Next Player Turn
→ Team AP recalculated from living Player Units
```

AP does not carry between Player Turns.

---

# 15. Unit Selection and Reselection

## LOCKED

The player may switch between usable party members throughout the Player Turn.

Using one action does not automatically remove a unit from the remainder of the Player Turn.

---

# 16. StartGrid

## LOCKED

At the start of each Player Turn, every living Player Unit records its current tactical position as:

```text
StartGrid
```

StartGrid is refreshed every Player Turn.

It is not the permanent spawn position.

---

# 17. Movement AP Commitment

## LOCKED

Leaving StartGrid costs:

```text
1 Team AP
```

Movement is not paid per tile.

Movement allowance still determines how far a unit may reposition.

Therefore:

```text
Movement Allowance
≠
Movement AP Commitment
```

---

# 18. Movement Refund

## LOCKED

If a unit returns to StartGrid before using Attack or Skill and before its movement becomes locked:

```text
Movement AP is refunded
```

Example:

```text
Team AP 4
→ Guard leaves StartGrid
→ Team AP 3
→ Guard returns before Attack/Skill
→ Team AP 4
```

---

# 19. Movement Scouting

## TENTATIVE / NEEDS PLAYTEST

Because Enemy Intent may update dynamically, the player can potentially:

```text
Move
→ observe Intent / target changes
→ return to StartGrid
→ receive movement AP refund
```

This consequence is currently allowed.

Do not pre-emptively remove it before testing whether it creates useful tactical scouting or an undesirable exploit.

---

# 20. Attack / Skill Position Commitment

## LOCKED

Using Attack or Skill locks further Movement for that unit for the remainder of the current Player Turn.

After Attack/Skill:

- Movement is unavailable for that unit;
- Attack may still be used again if legal and AP remains;
- Skill may still be used again if legal and AP remains.

This movement lock also applies if the action was performed from StartGrid.

## OPEN

Final player-facing and implementation terminology for this movement-lock condition.

---

# 21. Repeated Attack and Skill

## LOCKED

There is no universal rule of:

```text
one Attack per unit per turn
```

or:

```text
one Skill per unit per turn
```

Attack and Skill may be repeated while:

- Team AP is available;
- the action remains legal;
- action-specific rules allow it.

Individual Skills may later define their own cooldowns, resources, or once-per-turn restrictions.

---

# 22. Player Action Categories

Current conceptual action space:

```text
Move / Reposition
Attack
Skill
Hold
End Turn
```

---

# 23. Normal Attack AP Cost

## TENTATIVE

Current balancing candidate:

```text
Normal Attack = 1 AP
```

This remains a balancing value rather than a permanently locked universal constant.

---

# 24. Skill

## PLANNED / OPEN

Skill is an AP-consuming action category.

Still unresolved:

- individual player Skills;
- AP costs;
- cooldowns;
- secondary resources;
- targeting;
- range;
- LOS / Cover rules;
- repeat restrictions.

---

# 25. Hold

## LOCKED — BASE ELIGIBILITY AND COST

Hold is an active paid preparation action.

Eligibility:

- unit is still at StartGrid;
- unit has not used Attack;
- unit has not used Skill.

Cost:

```text
Hold = 1 AP
```

Leaving StartGrid temporarily makes Hold unavailable.

Returning to StartGrid before Attack/Skill restores Hold eligibility.

## OPEN

- exact Hold effect;
- whether Hold is terminal;
- whether Hold locks movement;
- whether it can repeat;
- once-per-turn rule;
- duration;
- unit-specific Hold outcomes.

---

# 26. Wait

## SUPERSEDED

The old rule:

```text
Wait
→ Exhaust unit
```

is no longer the current action-economy model.

Whether a different player-facing Wait command exists in the future remains open, but the old Wait/Exhaustion function is superseded.

---

# 27. End Turn

## LOCKED

Global End Turn is the normal way to finish the Player Turn.

```text
END TURN
→ discard remaining Team AP
→ Enemy Turn
```

End Turn is legal even when AP remains.

## OPEN / UIUX

Exact warning or confirmation behaviour when ending with unused AP.

---

# 28. Old Exhaustion Model

## SUPERSEDED

The following are no longer current design:

```text
reposition
→ one action
→ Exhausted
```

```text
all living Player Units Exhausted
→ Enemy Phase
```

```text
1 Unit = 1 Action = End of that unit's participation
```

The current model is Shared AP + free unit switching + global End Turn.

---

# Part IV — Position, Range, LOS, Cover, and Status

# 29. Full-Game Movement Model

## LOCKED

The main Unity game uses continuous/free 3D movement with direct control.

When entering tactical Action State:

```text
Current World Position
→ determine tactical grid cell
→ snap to grid center
→ resolve combat from discrete tactical position
```

The web prototype may represent tactical positions directly as grid cells.

## PROTOTYPE ONLY

Discrete tile-by-tile locomotion is a prototype simplification and not the main-game locomotion canon.

---

# 30. Tactical Occupancy

## LOCKED / CURRENT DESIGN

At tactical resolution:

- obstacle positions are invalid;
- opponent units block traversal;
- allied units may be traversed;
- no unit may end on an occupied tactical position;
- two units may not share the same final tactical position;
- a reserved Wave Telegraph spawn position may be traversed but may not be used as a final position.

Exact pathfinding algorithm is implementation-specific.

---

# 31. ATR

## LOCKED

`ATR` means:

```text
Attack Range
```

ATR represents attackable radius from the attacker's tactical position.

Distance is conceptually measured center-to-center on the tactical combat plane.

ATR is not movement-step distance.

---

# 32. Melee Obstacle Interaction

## LOCKED

A melee attack requires:

- target inside ATR;
- attack path does not cross the interior of a blocking obstacle.

Touching only an obstacle edge or corner does not invalidate the attack under the current rule.

---

# 33. Ranged Attack LOS

## LOCKED

All **ranged attacks** require Line of Sight.

```text
LOS
≠
Cover
```

LOS determines whether the ranged attack line is legally available.

Cover modifies effectiveness of an otherwise targetable interaction.

---

# 34. Cover and Targetability

## LOCKED

A target behind Cover may remain targetable.

Baseline interpretation:

```text
Clear
→ normal effectiveness

Partial Cover
→ reduced effectiveness

Full Cover
→ target may remain selectable
→ baseline damage may resolve to 0
→ action/AP is still consumed when player confirms the legal attack
```

This preserves future abilities that ignore, penetrate, remove, or otherwise interact with Cover.

---

# 35. Non-Attack Ranged Abilities

## LOCKED DESIGN PRINCIPLE

The universal LOS rule applies to **ranged attacks**, not automatically to every range-limited non-attack ability.

Each non-attack ability defines its own:

- range;
- LOS rule;
- Cover rule;
- target category;
- effect.

Confirmed examples:

```text
Orange Buff
→ range-limited
→ no LOS requirement
→ ignores Cover

Purple Vulnerable Curse
→ range-limited
→ no LOS requirement
→ ignores Cover
```

---

# 36. Target Validity, Action Validity, and Action Effectiveness

## LOCKED DESIGN PRINCIPLE

These are separate concepts.

```text
Target Validity
= Is the entity a legal candidate under the Target Rule?

Action Validity
= Can this action legally be performed now?

Action Effectiveness
= Would the action produce a relevant result?
```

A target can be valid while a specific action would be ineffective.

Enemy AI should not intentionally spend its one Action on a result that has no relevant effect when a role-consistent alternative exists.

---

# 37. Cover Values and Damage Formula

## TENTATIVE BALANCE BASELINE

Working Cover values:

```text
O30 = 30%
O70 = 70%
Full Cover = 100%
```

Working damage formula:

```text
Final Damage = floor(max(0, ATK × (1 - Cover Percentage) - DEF))
```

The Cover system itself is part of current design, while these exact numbers/formula remain balance-sensitive.

---

# 38. Player Stun

## LOCKED

A Stunned Player Unit:

```text
Movement      disabled
Normal Attack disabled
Skill         disabled
Hold          disabled
Unit Selection allowed
Shared AP contribution unchanged
```

AP remains available to other non-Stunned party members.

If all Player Units are Stunned, the party may still technically possess Team AP, but practical progression is limited to End Turn.

Exact Stun duration depends on the source.

---

# 39. Combat Edge Cases Still Open

## OPEN

- AP handling if a contributing unit dies during the same Player Turn;
- behaviour when Team AP reaches 0 during an already-paid reposition state;
- final movement-lock terminology;
- individual Skill costs/restrictions;
- final Hold rules;
- whether any separate Wait command survives;
- universal Status duration/tick convention;
- exact Unity movement allowance measurement;
- exact continuous-movement StartGrid boundary detection;
- exact LOS implementation.

---

# Part V — Playable Units

# 40. Planned Playable Roster

## PLANNED

```text
Guard
Archer
Trickster
Support
```

Guard and Archer have validated baseline identities.

Trickster and Support remain deferred for detailed design.

---

# 41. Guard Baseline

## LOCKED IDENTITY / TENTATIVE NUMBERS

```text
HP   25
ATK  5
DEF  4
Move 3
ATR  1.5
```

Guard remains a planned playable unit.

Exact numbers remain balancing baselines.

---

# 42. Archer Baseline

## LOCKED IDENTITY / TENTATIVE NUMBERS

```text
HP   18
ATK  7
DEF  1
Move 4
ATR  3.0
```

Archer remains a planned playable unit.

Exact numbers remain balancing baselines.

---

# 43. Trickster and Support

## PLANNED / DEFERRED

Detailed role, stats, Skills, and unique tactical loops remain open.

---

# Part VI — Enemy Design

# 44. Enemy Design Goal

## LOCKED DESIGN PRINCIPLE

Enemies should be designed as sources of tactical pressure, not merely stat packages.

Enemy design should ask what decision or trade-off the enemy creates.

Potential pressure sources include:

- target priority;
- distance pressure;
- setup/payoff timing;
- AP allocation;
- positional commitment;
- Status interaction;
- delayed threat;
- synergy;
- Wave timing.

---

# 45. Systemic Counterplay

## LOCKED / STRONG DIRECTION

Counterplay should generally be systemic rather than a hard character lock.

Preferred:

```text
Enemy creates a condition
→ one party member may be a natural answer
→ alternative answers may still exist through position, Skill, Status, environment, or resource commitment
```

Avoid designing enemies that are solvable only by one required character unless that restriction is intentionally authored.

---

# 46. Anti-AP-Funnel Goal

## LOCKED DESIGN GOAL

Shared AP intentionally permits AP funneling.

The design does **not** require every party member to act every Player Turn.

The encounter-design goal is instead:

> One unit should not be the universally best AP sink in every situation.

Different pressure should make different AP allocations situationally valuable.

---

# 47. Enemy Complexity

## LOCKED DIRECTION

Not every enemy needs State, Status, Conditional Override, and Pattern.

Basic enemies should remain simple when added complexity does not create a meaningful decision.

---

# 48. Universal Enemy Design Grammar

## CURRENT DESIGN FRAMEWORK

Conceptual fields:

```text
Target Rule
Movement Rule
Action Set / Action Rule
Intent
Fallback Rule
State Set [optional]
Status Interaction
Conditional Override [optional]
Pattern [optional]
```

This is a Game Designer grammar, not a required Unity class structure.

---

# 49. Role-Consistent Enemy AI

## TENTATIVE — STRONG DIRECTION

Enemy AI may evaluate positions/actions deterministically, but the enemy's role defines what counts as a good result.

Examples:

```text
Sword
→ values melee engagement

Spear
→ values effective ranged engagement near preferred maximum ATR

Support enemy
→ may value ally support rather than globally maximizing damage
```

A squad-level omniscient optimizer is not required as the baseline.

---

# 50. Dynamic Enemy Intent

## LOCKED CURRENT DIRECTION

Intent is the enemy's **current readable plan** based on the latest relevant battle state.

Intent is not an exact path or destination lock.

Example:

```text
Intent Rule = Attack Nearest Player Unit
Current Target = Guard
```

If battle state changes and Archer becomes nearest:

```text
Intent Rule remains Attack Nearest Player Unit
Current Target may change to Archer
```

Intent should update when relevant game state changes, not necessarily every render frame.

---

# 51. Intent Communication

## LOCKED CURRENT DIRECTION

Normally show:

- Action / Behaviour icon;
- Current Target icon when relevant;
- important State / Status;
- current multi-activation progress;
- relevant threat area.

Normally hide:

- exact path;
- exact destination;
- exact ending grid;
- full future Pattern.

Core principle:

> **Informasikan ancamannya, bukan jawabannya.**

---

# 52. Baseline Sword Enemy

## LOCKED IDENTITY / CURRENT BEHAVIOUR DIRECTION

Role:

```text
Basic Melee Enemy
```

Target Rule:

```text
Nearest Valid Player Unit
```

Movement Rule:

- seek a valid melee engagement position against Current Target;
- if ideal engagement cannot be reached this activation, approach the engagement area;
- temporary blocking does not automatically cause retarget;
- Stay if no useful/legal movement exists.

Action:

```text
maximum 1 Basic Melee Attack per Enemy Activation
```

Pattern:

```text
None
```

### TENTATIVE NUMERICAL BASELINE

```text
HP   16
ATK  6
DEF  2
Move 3
ATR  1.5
```

---

# 53. Baseline Spear Enemy

## PLANNED BASIC RANGED ENEMY / CURRENT BEHAVIOUR DIRECTION

Target Rule:

```text
Nearest Valid Player Unit
```

Preferred Engagement Distance:

```text
Maximum Effective ATR
```

Movement direction:

- seek an effective firing position;
- if too close, prefer to move farther away;
- if too far, approach;
- if already able to attack but a reachable tile better matches preferred maximum effective ATR, Spear may reposition;
- baseline Spear does not automatically seek Cover.

Action:

```text
maximum 1 Basic Ranged Attack
```

Ranged Attack requires LOS.

If its basic damage action would produce no relevant effect and no better firing position exists, it may End Activation without wasting the Action.

Pattern:

```text
None
```

### TENTATIVE / OPEN

Exact stats, including final ATR.

Historical working ATR reference:

```text
approximately 3.0
```

---

# 54. Nearest Target Rule

## CURRENT DESIGN DIRECTION

Baseline selection:

```text
Candidate Player Units
→ validity filter
→ nearest evaluation
→ tie-break
→ Current Target
```

A candidate should be:

- alive;
- still in the encounter;
- targetable under the relevant rule;
- structurally engageable by the relevant enemy capability.

Temporary occupancy does not automatically make a target invalid.

For baseline Sword and Spear:

```text
Nearest = combat-distance metric consistent with ATR/range
```

not automatically path distance or easiest engagement.

Tie direction:

1. minimum combat distance;
2. preserve Current Target if still tied;
3. deterministic stable ordering if still unresolved.

## OPEN

Exact final Unity metric and final deterministic ordering.

---

# 55. Sequential Enemy Resolution

## LOCKED CURRENT DIRECTION

Enemies resolve one activation at a time.

```text
Enemy A
→ Movement
→ Action
→ resolve state

Enemy B
→ reads updated state
→ Movement
→ Action
```

The previous all-move-then-all-attack structure is superseded.

---

# 56. Enemy Execution Order

## CURRENT DESIGN DIRECTION

Baseline execution order:

```text
Spawn Order
```

Earlier-spawned living enemies act before later-spawned living enemies.

Initiative/speed ordering is not the current baseline.

---

# 57. Enemy Activation Economy

## LOCKED CURRENT DIRECTION

Baseline:

```text
1 Enemy Activation
= maximum 1 Movement Resolution
+ maximum 1 Action Resolution
```

Movement may be 0.

Action may be 0.

No baseline:

- Move → Action → Move;
- multiple Action resolutions;
- enemy Shared AP.

Explicit special/boss exceptions may be designed later.

---

# 58. Retarget and Fallback

## LOCKED CURRENT DIRECTION

Distinguish:

```text
Target invalid
→ Retarget

Target valid, ideal position unavailable
→ Movement Fallback while keeping target

Target valid, action unavailable/ineffective after movement
→ End Activation without action
```

An enemy should not automatically retarget merely because it cannot reach the target this activation.

Execution-time state is revalidated before action resolution.

---

# 59. Enemy State

## TENTATIVE CURRENT DIRECTION

State is the enemy's primary behaviour mode.

Current conceptual rule:

```text
maximum 1 Primary Behaviour State at a time
```

Examples such as Normal, Charging, Recovering, Fleeing, Guarding, or Enraged are grammar examples, not automatically confirmed roster states.

---

# 60. Enemy Status

## STRONG CURRENT DIRECTION

Status is an attached modifier/effect that may change capability, stats, targetability, or interaction without replacing the primary behaviour mode.

Multiple Status effects may coexist.

Example vocabulary remains partly open.

---

# 61. Conditional Override

## TENTATIVE CURRENT DIRECTION

A Conditional Override is a decision rule triggered by battle state.

It may:

- change Intent;
- change target;
- choose an Action;
- change State;
- apply/remove Status.

Not every override requires a separate State.

Override priority is defined per enemy/archetype rather than by one universal global priority hierarchy.

---

# 62. Enemy Pattern

## TENTATIVE CURRENT DIRECTION

Pattern is a temporal sequence across enemy activations.

Pattern does not normally lock:

- target;
- path;
- destination.

Dynamic Intent and Current Target remain active unless an explicit mechanic creates Target Lock.

Basic Sword and Spear have no Pattern.

Patterns are mainly for special enemies, Mini-Bosses, Bosses, or other setup/payoff threats.

---

# 63. Pattern Determinism

## TENTATIVE

Patterns should currently be deterministic by default rather than random action selection.

Random branches remain possible as explicit special mechanics.

---

# 64. Pattern Communication

## LOCKED CURRENT DIRECTION

The full future Pattern is not shown by default.

Current Intent is the primary communication.

Multi-activation progress may be shown:

```text
CHARGE 1/3
CHARGE 2/3
CHARGE 3/3
```

Important:

```text
CHARGE 3/3
```

still means Charge is the Current Intent for that activation.

Do not automatically show:

```text
NEXT: HEAVY ATTACK
```

The payoff is shown when it actually becomes Current Intent on a later Player Turn.

Future target is not displayed before payoff Intent unless an explicit Target Lock mechanic exists.

---

# 65. Pattern Advance Rules

## CURRENT DESIGN DIRECTION

A Pattern Step may define its own advance rule.

Candidate families:

```text
On Activation End
On Action Resolved
On Condition Complete
```

For important payoff actions, `On Action Resolved` may keep the step pending when the action did not successfully occur.

---

# 66. Pattern vs Conditional Override

## LOCKED CURRENT DIRECTION

Temporary decision override default:

```text
PAUSE current Pattern Step
```

`Consume` is not the default.

`Reset` must be an explicit Pattern interaction.

A major State/Phase transition may explicitly switch the active Pattern.

---

# 67. Pattern vs Status

## LOCKED CURRENT DIRECTION

Status restrictions normally alter capability first; they do not automatically rewrite Pattern.

Example:

```text
ROOTED
→ Movement disabled
→ stationary Charge may still continue
```

If an activation is fully denied:

```text
STUNNED
→ no normal activation
→ Pattern progress pauses
```

`CHARGE X/Y` counts successful Charge activations, not global world turns.

An explicit effect such as `BREAK CHARGE` may reset/cancel/redirect Pattern only when that interaction is explicitly designed.

---

# 68. Special Enemy Design Method

## CURRENT DESIGN TOOL

Special enemy design should proceed in this order:

```text
Pressure / Decision
→ Role
→ Behaviour
→ Action / Status / Pattern
→ Numbers
```

A special enemy should add a meaningful tactical decision, not merely higher HP or damage.

Reusable design fields include:

- Enemy Identity;
- Encounter Purpose;
- Archetype / Role;
- Target Rule;
- Movement Rule;
- Action Set;
- State;
- Status Interaction;
- Conditional Override;
- Pattern;
- Pattern Advance Rule;
- Intent / Telegraph;
- Fallback;
- Special Interaction;
- Counterplay;
- Failure Case.

---

# 69. ORANGE Charger Buffer

## TENTATIVE SPECIAL ENEMY CANDIDATE — STRONG DIRECTION

Role:

```text
Support / Temporal Threat
```

Primary pressure:

```text
Kill commitment
+ punishment for careless chip damage
```

Core question:

> Can the player kill Orange now, or is damaging it without enough commitment making the situation worse?

### Candidate Pattern

```text
CHARGE 1/3
→ CHARGE 2/3
→ CHARGE 3/3
→ BUFF ALLY
→ RESET
```

Exact Charge count remains tentative.

### Charging

Normally stationary.

No baseline player-damaging Basic Attack.

### Terrified

During Charging:

```text
First successful damaging hit in Player Turn
→ Fear Source = first damaging Player Unit
→ Terrified
```

Further attackers do not replace Fear Source.

On Orange activation while Terrified:

- move to a legal reachable position maximizing distance from Fear Source;
- still perform Charge;
- Charge progress advances;
- Terrified expires after that activation;
- Fear Source clears;
- return to stationary Charging.

Terrified applies only during Charging, not during Buff payoff.

### Buff Payoff

```text
Action: Damage Buff
Target: Nearest Valid Ally
Range: Orange Buff ATR
LOS: not required
Cover: ignored
```

If target is outside Buff ATR:

- approach nearest valid ally;
- Buff in same activation if range is reached;
- otherwise keep Buff step pending.

Already-buffed allies remain valid.

Current prototype-facing simplification allows stacking.

After successful Buff:

```text
reset Charge
→ stationary at current position
```

### TENTATIVE / OPEN

- HP;
- Move;
- Buff ATR;
- Buff strength;
- stacking math/timer;
- exact Charge count;
- Terrified flee balance;
- candidate Buff duration currently around 3 turns.

---

# 70. PURPLE Charger Debuffer

## TENTATIVE SPECIAL ENEMY CANDIDATE — STRONG DIRECTION

Old melee/ranged adaptive immunity concept:

```text
SUPERSEDED
```

Role:

```text
Debuff / AP Commitment Pressure
```

Primary pressure:

```text
Temporary AP funnel
+ first-attacker commitment
```

Core question:

> Which Player Unit should make the first damaging hit, and is committing more AP to that unit worth it this turn?

### Attunement

```text
First successful damaging hit during Player Turn
→ Purple becomes Attuned to that Player Unit
```

For the remainder of the same Player Turn:

- only that exact Player Unit can deal damage to Purple;
- other units may still target/interact with Purple;
- damaging actions from other units resolve 0 damage;
- Attunement source does not switch.

Attunement clears at End Player Turn.

Final mechanic name `Attuned` / `Focused` remains open.

### Charging

Purple is stationary while Charging.

Attunement does not stop Charge.

Exact Charge count remains tentative/open.

### Vulnerable Payoff

```text
Intent: [VULNERABLE] [Nearest Player Unit]
Target Rule: Nearest Valid Player Unit
Candidate Range: 2 ATR
Type: Curse
LOS: not required
Cover: ignored
```

When payoff is ready:

- if target is in range, Stay and apply Vulnerable;
- if out of range, approach Current Target;
- if movement reaches range, apply Vulnerable in same activation;
- otherwise keep payoff pending.

After successful Vulnerable:

```text
reset Charge
→ stationary at current position
```

### Vulnerable Prototype Rule

## TENTATIVE

```text
Base duration: 2 turns
Reapplication: +1 stack
Reapplication: refresh shared duration to 2
Stack effect: additive / linear direction
Already Vulnerable target: remains valid
```

### OPEN

- exact incoming-damage increase per stack;
- exact duration tick timing;
- maximum stacks;
- final duration after playtest;
- final Attunement name.

---

# 71. BLUE Shockwave Charger

## TENTATIVE SPECIAL ENEMY CANDIDATE — STRONG DIRECTION

Role:

```text
Timed Spatial Hazard
```

Interpretation:

> Blue acts as a readable living mine with a known detonation rhythm.

### Baseline Behaviour

- permanently stationary;
- no Basic Attack;
- no reactive movement/state when damaged;
- damage only reduces HP unless another system says otherwise.

### Candidate Pattern

```text
CHARGE 1/2
→ CHARGE 2/2
→ SHOCKWAVE
→ RESET
```

Exact Charge count remains tentative.

### Shockwave

```text
Intent: [SHOCKWAVE] [SELF]
Area: Blue ATR
```

Shockwave:

- always executes on payoff activation;
- executes even when no Player Unit is inside the area;
- resets afterward;
- ignores LOS;
- ignores Cover;
- penetrates obstacles for area resolution;
- applies Stun to affected Player Units.

Old Knockback design:

```text
SUPERSEDED
```

Fallback candidate if Stun is too oppressive:

```text
IMMOBILIZE
```

### OPEN / TENTATIVE

- Blue ATR;
- Charge count;
- Stun duration;
- whether fallback Immobilize is needed after playtest.

---

# 72. Charger Trio Test Roles

## TENTATIVE ROSTER / PROTOTYPE TEST CANDIDATES

| Enemy | Primary Pressure |
|---|---|
| Orange | Kill commitment / careless chip punishment |
| Purple | Temporary AP funnel / first-attacker commitment |
| Blue | Position commitment / timed spatial hazard |

These are not yet confirmed Region 1 production roster entries.

---

# 73. Stage 4 Mini-Boss

## LOCKED DIRECTION

Region 1 Stage 4 is intended as a Mini-Boss climax.

## OPEN

- Mini-Boss identity;
- ability set;
- Pattern;
- exact stats;
- exact map;
- final encounter structure.

---

# 74. Future Enemy Archetypes

## DEFERRED / HISTORICAL DESIGN SPACE

Possible future directions include:

- Bruiser / Heavy Melee;
- Fast Harasser;
- Support Enemy;
- Cover-seeking ranged variants;
- other role-specific enemies.

None are confirmed active roster entries simply by appearing here.

---

# Part VII — Encounter, Objective, Wave, and Trigger Design

# 75. Encounter Design Philosophy

## LOCKED DESIGN PRINCIPLE

Encounter difficulty and tactical identity emerge from combinations of:

```text
Map
+ Enemy Composition
+ Spawn Configuration
+ Objective
+ Victory / Defeat Conditions
+ Phase
+ Wave / Pacing
+ Trigger
+ Player / Enemy Condition
```

Encounter design should begin from intended pressure and player decision rather than enemy stats alone.

---

# 76. Objective System

## LOCKED CORE OBJECTIVE

```text
Eliminate All
```

## PLANNED CORE OBJECTIVES

```text
Protect Target
Defeat Mini-Boss
```

## PLANNED / DEFERRED DESIGN SPACE

```text
Survive Turns
Reach Exit
Activate Points
Escort Target
Hold Position
```

---

# 77. Objective, Victory, and Defeat Are Separate

## LOCKED DESIGN PRINCIPLE

```text
Objective
≠ Victory Condition
≠ Defeat Condition
```

Wave completion, Tutorial Task completion, and Phase transitions do not automatically mean encounter victory.

---

# 78. Baseline Defeat Condition

## LOCKED

```text
All Player Units Defeated
```

Objective-specific defeat conditions are a locked design principle but their exact future rules remain planned/deferred.

---

# 79. Stage / Phase / Tutorial Task / Objective / Wave

## LOCKED DESIGN FRAMEWORK

```text
Stage
= complete encounter / level

Phase
= major authored section/state of the encounter

Tutorial Task
= current instructional requirement

Objective
= gameplay goal

Victory Condition
= successful encounter-resolution condition

Wave
= triggered group of enemies/threats entering the encounter
```

These concepts should not be collapsed into one another.

---

# 80. Trigger-Based Encounter Design

## PLANNED / CURRENT FRAMEWORK

Candidate triggers include:

- Stage Start;
- Round / Turn timing;
- Previous Wave Cleared;
- unit entering an area;
- HP threshold;
- Objective progression;
- Enemy Action;
- Alarm;
- Building State;
- Phase Transition.

Triggers may cause:

- Wave spawn;
- reinforcement;
- ambush;
- objective change;
- hazard;
- Phase change.

---

# 81. Wave System

## LOCKED CURRENT DIRECTION

One Stage may contain multiple Waves.

A Wave may define:

- Wave ID;
- Role;
- Trigger;
- Timing;
- Enemy Composition;
- Spawn Position;
- Telegraph;
- Initial Intent;
- Victory Relevance.

Wave is a pressure/pacing tool, not just an enemy container.

---

# 82. Wave Roles

## TENTATIVE AUTHORING TAXONOMY

Current working roles:

```text
Required Wave
Conditional Wave
Punishment Wave
```

Wave Role and Trigger are separate dimensions.

No universal rule says that every Required Wave must block victory or every Punishment Wave must not.

---

# 83. Wave Victory Relevance

## OPEN / PER-ENCOUNTER

Whether a Wave blocks victory must be authored according to the Stage's Objective and Victory Condition.

No universal final rule has been selected.

---

# 84. Wave Telegraph Timing

## LOCKED CURRENT DIRECTION

Current intended structure:

```text
Telegraph
→ one Player preparation window
→ Spawn
```

Telegraph exists to create readable future pressure and a preparation decision.

---

# 85. Reserved Telegraph Spawn Position

## LOCKED CURRENT DIRECTION

A telegraphed spawn tile/position is:

- passable for traversal;
- invalid as a final occupied position;
- reserved against both Player and Enemy final occupancy.

This replaces the old Primary → Alternative → local 3×3 gameplay fallback solution.

## SUPERSEDED

Primary/Alternative/3×3 fallback as the intended player-facing spawn-resolution rule.

## OPEN IMPLEMENTATION DETAIL

A purely technical emergency fallback may still be needed.

---

# 86. Telegraph Creation Before Enemy Movement

## LOCKED CURRENT DIRECTION

Telegraph reservation is created before existing enemies resolve movement during the preparation Enemy Turn.

An enemy starting on a future reserved spawn position should not finish its movement there if a legal alternative exists.

---

# 87. Spawned Enemy Initial Behaviour

## LOCKED CURRENT DIRECTION

When a Wave enemy spawns:

- the enemy appears;
- Current Intent is calculated/displayed;
- it does not immediately perform offensive Movement/Attack at that same spawn moment.

## OPEN / NEEDS PLAYTEST

Exact lifecycle between:

```text
Telegraph
Player response
Spawn
post-spawn Player response
first enemy activation
```

The current candidate lifecycle may give too much response time.

---

# 88. Enemy Composition as Pressure Composition

## LOCKED CURRENT METHOD

Enemy combinations should be selected according to the pressure and decision created by the combination, not merely enemy count.

Current pressure identities include:

```text
Sword  → close-distance melee pressure
Spear  → ranged-distance / firing-position pressure
Orange → kill-commitment pressure
Purple → AP / first-attacker commitment
Blue   → timed spatial pressure
```

Combinations remain hypotheses until playtested.

---

# 89. Region 1 Encounter Direction

## LOCKED / CARRIED DIRECTION

Region 1 should progressively introduce variation through:

- enemy composition;
- map pressure;
- objectives;
- Waves/pacing;
- triggers;
- risk–reward differences.

Guard + Archer vs 2 Sword remains a useful simple combat baseline.

It is no longer automatically the canonical tutorial sequence.

## HISTORICAL DESIGN SEED

Older specific Stage 2–3 encounter drafts.

---

# Part VIII — Run Progression, Attrition, Rewards, and Economy

# 90. Route Risk–Reward

## LOCKED DIRECTION

Higher-risk nodes should generally create better opportunities for better rewards.

```text
Higher Risk
→ Greater Encounter Pressure
→ Greater Attrition Risk
→ Potentially Better Reward Opportunity
```

Exact probability/mathematical mapping remains open.

---

# 91. HP Carry

## PLANNED / LOCKED DESIGN DIRECTION

Current HP is intended to persist between encounters within the same run.

Damage in one encounter should influence later party capability.

The prototype behaviour where every stage begins fully healed is not main-game canon.

---

# 92. Recovery

## OPEN / DEFERRED

Potential recovery sources:

- healing;
- Rest nodes;
- recovery rewards;
- services;
- between-region recovery.

Exact rules remain undefined.

---

# 93. Unit Defeat Across a Run

## OPEN

Possible outcomes include:

- revival;
- temporary unavailability;
- persistent injury;
- recovery requirement;
- another penalty model.

No final rule exists.

---

# 94. Reward Philosophy

## LOCKED DIRECTION

Rewards support within-run adaptation.

They should help the player respond to:

- route choice;
- encounter difficulty;
- party weaknesses;
- future threats;
- HP condition;
- emerging run strategy.

Rewards are not limited to simple stat increases.

---

# 95. Reward Opportunity by Difficulty

## PLANNED CORE DIRECTION

Harder nodes should generally have better opportunity for higher-quality/higher-rarity rewards.

## OPEN

- exact node reward probability;
- exact rarity model;
- exact mapping from risk/difficulty to reward opportunity.

The current prototype rule of always presenting exactly four reward cards is not full-game canon.

---

# 96. Temporary Reward Duration Families

## PLANNED

```text
run_long
→ default temporary buff duration until run ends/fails

one_stage
→ applies to a specific encounter/stage

instant
→ resolves immediately
```

---

# 97. Reward Repetition and Stacking

## OPEN

- same reward reappearance;
- identical reward stacking;
- stacking caps;
- rarity interactions;
- unique effects.

---

# 98. Run Crystal

## LOCKED CONCEPT

Run Crystal is a temporary currency/resource accumulated during an active run.

---

# 99. Meta Crystal

## LOCKED CONCEPT

Meta Crystal is persistent currency used for permanent progression between runs.

---

# 100. Crystal Conversion

## LOCKED CONCEPT

Canonical full-game flow:

```text
Active Run
→ Full Run Completion or Defeat
→ Run Settlement
→ Run Crystal converts to Meta Crystal
```

## DEVELOPMENT EXCEPTION

Current prototype may settle after Region 1.

## TENTATIVE

Current working conversion rate:

```text
100%
```

Possible defeat penalty/completion bonus remains open.

---

# 101. Region 1 Working Crystal Values

## TENTATIVE BALANCE BASELINE

```text
Stage 1  = 20
Stage 2A = 25
Stage 2B = 30
Stage 2C = 40
Stage 3A = 35
Stage 3B = 45
Stage 3C = 55
Stage 4  = 70
```

---

# 102. Permanent Progression Shop / Access Point

## LOCKED DIRECTION

Permanent progression remains part of the full-game loop.

Conceptually:

```text
Full Run Resolution
→ Settlement
→ permanent progression access
→ future Run
```

## SUPERSEDED

Old milestone-unlocked Main Menu Shop as canonical design.

## OPEN / UIUX

Exact full-game access and presentation.

## PROTOTYPE ONLY / CURRENT VALIDATION FLOW

The prototype may expose Shop access from Run Overview / post-run flow for practical testing and navigation.

---

# 103. In-Run Shop

## OPEN / DEFERRED

An In-Run Shop may exist as a node or service.

Currency, inventory, purpose, and relation to Meta Crystal are not yet defined.

---

# 104. Permanent Progression Stats

## LOCKED DIRECTION

Foundational categories:

```text
Max HP
ATK
DEF
```

Additional permanent categories remain expandable/open.

## TENTATIVE BALANCE VALUES

Current prototype-facing baseline:

```text
Max HP +2 per level
ATK    +1 per level
DEF    +1 per level

Costs: 30 / 60 / 100 / 150
```

Exact final values remain balance-sensitive.

---

# Part IX — Difficulty, Balancing, and Evaluation

# 105. Difficulty Philosophy

## LOCKED DESIGN PRINCIPLE

Difficulty is contextual.

Experienced difficulty emerges from the relationship between:

```text
Expected Player State
and
Encounter / Stage Pressure
```

A difficulty tag should be interpreted relative to an expected player state rather than as an isolated absolute property.

---

# 106. Current Player Capability

## PRESERVED WORKING FRAMEWORK

Current Player Capability may consider:

- Base Party Capability;
- Permanent Upgrade Bonus;
- Temporary Run Buff Bonus;
- HP / Party Condition;
- Tactical Mastery.

The framework is conceptual; not all dimensions are proven to share one validated numerical scale.

---

# 107. Base Party Capability Dimensions

## WORKING / CARRIED FORWARD

```text
Survivability
Offense
Mobility
Range Control
Utility
Action Availability
```

---

# 108. Stage Pressure

## LOCKED BALANCING PRINCIPLE

Conceptual structure:

```text
Stage Pressure
= Enemy Pressure
+ Map Pressure
+ Wave / Pacing Pressure
+ Objective / Phase Pressure
```

Stage Pressure is not equivalent to enemy stats alone.

---

# 109. Stage Pressure Components

## CURRENT WORKING FRAMEWORK

### Enemy Pressure

May include:

- stats;
- quantity;
- archetype composition;
- mobility;
- ATR / threat reach;
- behaviour;
- target priority;
- synergy;
- placement.

### Map Pressure

May include:

- arena size;
- distance;
- obstacles;
- Cover;
- chokepoints;
- special spaces;
- spawn direction;
- positional constraints.

### Wave / Pacing Pressure

May include:

- number of Waves;
- timing;
- roles;
- triggers;
- spawn position;
- composition;
- recovery windows;
- disruption.

### Objective / Phase Pressure

May include:

- Protect Target;
- Mini-Boss;
- boss phases;
- HP-threshold phases;
- objective steps;
- special rules.

---

# 110. Weighted Stage Pressure

## TENTATIVE WORKING WEIGHTS

Historical working examples:

```text
Simple Stage
Enemy Pressure 45%
Map Pressure   35%
Wave Pressure  20%
```

```text
Objective / Mini-Boss Stage
Enemy Pressure     35%
Map Pressure       25%
Wave Pressure      20%
Objective Pressure 20%
```

These are working hypotheses, not universal formulas.

---

# 111. Difficulty Gap

## PRESERVED WORKING CONCEPT

```text
Difficulty Gap = Stage Pressure - Current Player Capability
```

Purpose:

Estimate predicted tendency of difficulty under an expected player state.

It is not an objective measurement of actual experience.

---

# 112. Working Difficulty Scale

## PRESERVED WORKING SCALE

```text
<= -3  Trivial
-2     Too Easy
-1     Easy
0      Normal
+1     Hard
+2     Too Hard
>= +3  Unfair
```

`Unfair` is not scientifically proven solely from the numerical gap.

---

# 113. Stage Node Difficulty Template

## LOCKED AS GAME DESIGN AUTHORING TOOL

The Stage Node Difficulty Template remains a canonical Game Designer tool.

It should capture:

```text
Node Identity
Intended Pressure
Expected Decision / Trade-off
Predicted Player Behaviour
Success / Failure Signal
Expected Player State
Enemy Pressure
Map Pressure
Wave / Pacing Pressure
Objective / Phase Pressure
Overall Stage Pressure
Difficulty Gap / Target Difficulty
Reward & Progression
Evaluation Notes
```

It is not a required technical data schema.

---

# 114. Predicted / Observed / Perceived

## LOCKED WORKING EVALUATION FRAMEWORK

```text
Predicted
= what design/balancing expects

Observed
= what actually happens during play

Perceived
= what the player reports/feels
```

The three should be compared during evaluation.

---

# 115. Evaluation Questions

## LOCKED DIRECTION

Evaluation should ask questions such as:

- Did the design produce intended difficulty?
- Did players behave as predicted?
- Did players perceive the pressure as intended?
- Were tactical decisions meaningful?
- Was pressure readable?
- Was failure understandable and fair?

---

# 116. Battle Metrics

## CANDIDATE METRICS

Potential measurements include:

- win/loss;
- turn count;
- HP remaining;
- unit deaths;
- damage taken/dealt;
- enemies defeated per turn;
- cover usage;
- Skill usage;
- threat exposure;
- AP spent per Player Unit;
- unused AP at End Turn;
- movement AP commitments/refunds;
- repeated Attack/Skill usage;
- Intent target changes;
- response to Charge;
- Status applications/duration;
- special-enemy target priority;
- time/turn until special enemy defeat.

Metrics should only be implemented when tied to an explicit validation question.

---

# 117. Player Perception Dimensions

## CURRENT EVALUATION CANDIDATES

```text
Perceived Difficulty
Fairness
Tactical Choice
Pressure
Enjoyment
Clarity of Cause
```

---

# 118. Playtesting

## LOCKED METHOD DIRECTION

```text
Design Prediction
→ Gameplay Scenario
→ Playtest
→ Observed Performance + Player Perception
→ Compare
→ Revise Design / Balancing Model
```

A balancing model does not replace playtesting.

---

# 119. Telemetry

## PROTOTYPE / EVALUATION TOOL

Telemetry may support internal Game Designer evaluation.

It is not a player-facing core game feature.

Exact technical export/storage format belongs to implementation documentation.

---

# 120. Auto-Simulation

## OPTIONAL FUTURE EVALUATION TOOL

Auto-simulation may support repeated scenario testing and parameter comparison.

It is not required for main-game design and is not the primary PA contribution.

---

# Part X — Tutorial and Onboarding

# 121. Tutorial Design Philosophy

## STRONG CURRENT DIRECTION

Teach progressively:

```text
Introduce
→ Demonstrate
→ Require Player Use
→ Confirm Through Gameplay
→ Add Pressure
→ Combine With Earlier Knowledge
```

The tutorial should increasingly resemble normal TMTB play.

Good/legal tactical play should not be treated as tutorial failure merely because it occurs earlier or differently from a scripted prompt.

---

# 122. Tutorial Structure Vocabulary

## CURRENT FRAMEWORK

Tutorial authoring distinguishes:

```text
Tutorial Flow Step
Learning Block
Stage
Phase
Tutorial Task
Objective
Wave
```

These concepts are not interchangeable.

A Tutorial Flow Step may represent a real mechanic or a simulated Unity-facing step.

A Learning Block is a mental-model / knowledge cluster.

A Tutorial Task may trigger a Phase transition or content event, but Phase, Objective, and Wave remain separate concepts.

---

# 123. Control Knowledge vs Tactical Knowledge

## CURRENT TUTORIAL DISTINCTION

### Control Knowledge

Examples:

- camera navigation;
- unit selection;
- unit switching;
- character movement;
- action-interface access;
- confirm/cancel.

### Tactical Knowledge

Examples:

- Player Turn / Enemy Turn;
- Shared AP;
- StartGrid;
- movement commitment/refund;
- position commitment after action;
- End Turn;
- ATR;
- LOS;
- Cover;
- Intent;
- Status;
- Charge;
- Wave Telegraph.

The web prototype can validate tactical rules directly while still preserving important Unity-only onboarding flow.

---

# 123A. Prototype Representation Types

## CURRENT PROTOTYPE TUTORIAL / VALIDATION PRINCIPLE

Every important tutorial knowledge/flow item should use one of:

```text
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

### REAL SYSTEM VALIDATION

The prototype actually runs the gameplay rule.

Use when incorrect implementation would invalidate the design test.

### FLOW SIMULATION

An important Unity-facing onboarding/flow step remains present even though the final 3D mechanic is not reproduced.

Example:

```text
Move camera left
→ simulated confirmation
→ flow continues
```

Flow Simulation validates intended order/reference, not final control feel or mechanic mastery.

By default it must not silently mutate authoritative combat state.

### DEFERRED / NOT READY

The rule/content is not sufficiently decided to teach accurately.

Do not invent fake rules merely to complete the tutorial flow.

---

# 124. Required Tutorial Foundation

## REQUIRED

Current dependency begins:

```text
Camera / Control
→ Unit Selection
→ Unit Switching
→ Movement
```

Camera/final 3D control beats may use **FLOW SIMULATION** in the web prototype.

Unit Selection/Switching and tactical rules should use real-system behaviour where they are under validation.

Critical mental model:

> **The Player Turn belongs to the whole party, not one unit activation.**

---

# 125. Shared AP / StartGrid Tutorial

## CORE TOPIC

Teach:

- living units contribute to one Team AP pool;
- current baseline is 2 AP per living Player Unit;
- AP is shared;
- tactical movement uses Movement Allowance;
- leaving StartGrid spends movement commitment AP;
- returning before Attack/Skill and before movement lock can refund that AP;
- End Turn discards unused AP.

Actual AP changes should be demonstrated rather than explained only through text.

---

# 126. Attack and Position Commitment Tutorial

## CORE TOPIC

Teach:

- target selection;
- AP consumption;
- damage resolution;
- Attack/Skill locks further Movement for that unit;
- using Attack does not Exhaust the unit;
- the unit remains selectable;
- repeated actions remain possible when AP/rules allow;
- another party member may use the same Team AP pool.

---

# 127. End Turn / First Enemy Turn Tutorial

## CORE TOPIC

End Turn must be explicitly taught because the Player Turn no longer ends through unit Exhaustion.

A simple readable Enemy Turn should occur before advanced enemy concepts are combined.

## TENTATIVE — STRONG WORKING DIRECTION

Sword remains the strongest candidate for the first basic enemy lesson.

The first tutorial Sword may arrive as scripted/tutorial content rather than the full Wave Telegraph lesson.

It should receive readable Intent and, where practical, at least one normal readable activation before the first Attack lesson.

---

# 128. ATR, Ranged Combat, LOS, and Cover Tutorial

## CORE / REQUIRED TOPICS

Teach:

```text
Movement Range ≠ ATR
```

Current dependency:

```text
Melee / ATR basics
→ Archer / ranged combat
→ ranged ATR
→ LOS
→ Cover
```

LOS and Cover must not be taught as the same system.

A target may be:

```text
inside ATR
+
No LOS
```

or:

```text
inside ATR
+
LOS valid
+
Cover modifies effectiveness
```

## PROTOTYPE ONLY / TUTORIAL CANDIDATE

A stationary **Practice Target** is a strong current candidate for stable ATR/LOS/Cover teaching.

It should use the real targeting/damage rules while remaining clearly a training object rather than a frozen normal enemy.

---

# 129. Enemy Intent Tutorial

## CORE TOPIC

Player should understand:

```text
Intent
=
what the enemy currently plans to do on its next activation
```

Typical presentation may combine:

```text
[ACTION / BEHAVIOUR] + [CURRENT TARGET]
```

Intent must derive from actual enemy behaviour state/rules.

Teach Current Intent before Dynamic Intent.

---

# 130. Dynamic Intent Tutorial

## INTERMEDIATE / ADVANCED CORE TOPIC

Demonstrate that relevant player movement/state changes can cause Current Target or Intent to change when normal enemy rules require it.

The player should understand:

> Intent is the enemy's current readable plan, not a permanent target lock.

Do not teach exact path/destination or hidden future Pattern as normal Intent information.

---

# 131. Status Tutorial

## REQUIRED ADVANCED CONCEPT

The tutorial should teach that a Status changes a unit's capability or interaction.

Current strongest concrete Status candidate:

```text
STUN
```

Current Player Stun is useful because the unit:

- cannot Move;
- cannot Normal Attack;
- cannot Skill;
- cannot Hold;
- remains selectable;
- continues contributing to Shared Team AP.

## OPEN

```text
Exact first Status teaching source
```

## TENTATIVE / OPEN ALTERNATIVE

Using Blue as the first Status teaching source.

Blue is not locked tutorial/Region 1 roster content.

---

# 132. Charge / Multi-Activation Threat Tutorial

## ADVANCED CORE LESSON

**TENTATIVE — CURRENT CORRECTED CURRICULUM BASELINE**

```text
Status
→ Charge / temporal threat
→ special-enemy application if selected
```

Teach:

- `CHARGE X/Y` is current behaviour progress;
- progress advances only through successful relevant Charge activations;
- `CHARGE X/X` does not automatically preview the payoff;
- payoff becomes visible when it becomes Current Intent;
- Charge creates a preparation/planning horizon.

## TENTATIVE CANDIDATE

```text
Status known
→ Charge known
→ Blue combines both as competence application
```

## OPEN ALTERNATIVE

```text
Blue introduces Charge
→ payoff introduces first Stun
```

The alternative is more content-efficient but carries higher cognitive-load and evidence risk.

---

# 133. Wave Telegraph Tutorial

## ADVANCED TOPIC

Teach:

- incoming spawn position is telegraphed;
- reserved position is traversable;
- neither side may end movement on the reserved position;
- telegraph creates a preparation opportunity;
- after Spawn, the enemy returns to the normal Intent language.

Current canonical direction:

```text
Telegraph
→ one Player preparation window
→ Spawn
```

Spawn itself is not an attached immediate offensive Move/Attack event.

## OPEN

Exact timing from Spawn to first normal enemy activation.

## PROTOTYPE VALIDATION VARIANTS

Potential experiments:

```text
W1 — Safe
W2 — Tight
```

These are not canonical lifecycle rules.

## STRONG WORKING HYPOTHESIS

The first full tutorial Wave should preferably use a known enemy such as Sword so the new lesson is incoming-pressure planning rather than new enemy grammar.

---

# 134. Hold Tutorial

## DEFERRED / NOT READY

Do not author a final Hold lesson until Hold effect, terminal behaviour, movement lock, duration, and repeatability are sufficiently decided.

---

# 135. Skill Tutorial

## PLANNED SLOT / CONTENT OPEN

Do not create a canonical detailed Skill lesson before individual player Skills are defined.

---

# 136. Combat Onboarding vs Run Onboarding

## STRONG CURRENT STRUCTURE DIRECTION

Combat onboarding focuses first on:

- controls/orientation;
- party control;
- Shared AP / StartGrid;
- actions / position commitment;
- ATR / LOS / Cover;
- Intent / Dynamic Intent;
- Status;
- Charge / temporal threat;
- Wave pressure.

Run onboarding later introduces:

- battle result;
- HP carry / attrition;
- reward selection;
- route preview / commitment;
- risk–reward;
- Run Crystal;
- settlement / meta progression.

Do not force all roguelite/meta concepts into the first combat tutorial.

---

# 137. Tutorial Knowledge Dependency

## CURRENT WORKING CURRICULUM MAP

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

Separate run-onboarding layer:

```text
Battle Result
→ HP Carry
→ Reward
→ Route Preview / Commitment
→ Risk–Reward
→ Run Resources
```

This is a knowledge dependency map, not the final Phase count.

---

# 138. Tutorial Defeat / Retry

## CARRIED-FORWARD DIRECTION

Tutorial defeat should not:

- start normal Run settlement;
- convert Crystal;
- trigger permanent progression.

The tutorial should retry instead.

## OPEN

Whether retry means:

- entire Tutorial Stage;
- current Phase/checkpoint.

---

# 139. Old Tutorial Sequence

## SUPERSEDED / HISTORICAL DESIGN SEED

The older tutorial sequence built around Wait and Exhaustion cannot be reused unchanged.

Still-useful lessons may be carried forward only when consistent with Shared AP, global End Turn, position commitment, repeated actions, Intent, Status, and newer encounter systems.

The current old/placeholder prototype tutorial is implementation history, not tutorial canon.

---

# 140. Current Tutorial Stage Working Architecture

## TENTATIVE — STRONG WORKING DIRECTION

Current tutorial direction:

```text
ONE continuous Tutorial Stage / Level
```

The battlefield should evolve rather than reset into isolated tutorial rooms.

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

### Phase 1 correction

Important Unity camera/control/orientation beats remain present through **FLOW SIMULATION**.

Unit Selection/Switching use real interaction.

Actual tactical Movement consequences begin only once Shared AP and StartGrid are active in Phase 2.

### Status

- one continuous Tutorial Stage: **TENTATIVE — STRONG WORKING DIRECTION**
- seven-Phase structure: **TENTATIVE WORKING STRUCTURE**
- exact Phase count: **OPEN / VALIDATION-DEPENDENT**

---

# 140A. Tutorial Learning Evidence

## CURRENT EVALUATION FRAMEWORK

For **REAL SYSTEM VALIDATION**:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

For **FLOW SIMULATION**:

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

Good/legal tactical play should receive retroactive learning credit where the required evidence has already occurred.

---

# 140B. Tutorial Prototype Validation Scope

## CURRENT WORKING SCOPE

The tutorial prototype has two functions:

```text
Game Design Validation Tool
+
Unity Functional Flow Reference
```

Systems that require real fidelity when under validation include:

- Shared AP;
- StartGrid/refund;
- Attack movement lock without Exhaustion;
- repeated/cross-unit AP use;
- ATR / LOS / Cover distinction;
- actual Intent / Current Target;
- Dynamic Intent;
- sequential enemy activation;
- Spawn Order as baseline internal order;
- maximum 1 Movement + 1 Action per baseline enemy activation;
- Status;
- Charge;
- Wave Telegraph reservation / Spawn / Intent transition.

Important Unity-only control beats may be Flow Simulated.

Hold/Skill detailed lessons remain deferred until ready.

Seven tutorial Phases are not a permanent technical requirement.

---

# 140C. Current Tutorial Design Status

## WORKING DESIGN RECOVERED — NOT FINAL PRODUCTION LOCK

```text
T1 — Learning Curriculum
COMPLETE as corrected working curriculum

T2 — Curriculum → Phase Architecture
COMPLETE as corrected working architecture

T3 — Actual Tutorial Stage Design
WORKING DESIGN COMPLETE ENOUGH FOR PROTOTYPE VALIDATION PLANNING

Prototype Validation Scope
CORRECTED WORKING SCOPE
```

Material blocker:

```text
Exact first Status teaching source
```

Other important validation/open items are listed in the Tutorial Open Questions section.

---

# 140D. Current Tutorial Layout Family

## TENTATIVE — PRIMARY WORKING LAYOUT FAMILY

```text
Offset Courtyard
```

Current decision:

- use Offset Courtyard as the primary working family for Tutorial paper/prototype validation;
- keep exact grid dimensions / coordinates TENTATIVE;
- keep exact ATR / LOS / Cover teaching geometry validation-dependent;
- allow an alternative geometry if actual validation shows the current family does not produce the intended learning evidence.

Detailed coordinate candidates remain in the supporting Tutorial Design Corrected Handoff.

# Part XI — Prototype-Originated Candidates

# 141. Death Marker

## PLANNED FOR PROTOTYPE

A Death Marker may visualize or record previous player failure locations.

## OPEN FOR MAIN GAME

Main-game inclusion requires later UI/UX discussion.

---

# 142. Run History / Run Notes

## PLANNED FOR PROTOTYPE

Potential player-facing data:

- run number;
- path;
- stages completed;
- rewards/buffs;
- Crystal gained;
- furthest progress;
- failure location;
- run result.

This is distinct from internal telemetry.

## OPEN FOR MAIN GAME

Main-game inclusion remains a UI/UX review candidate.

---

# Part XII — Explicitly Superseded Design

# 143. Superseded Combat Rules

## SUPERSEDED

```text
reposition → one action → Exhausted
```

```text
Player Turn ends when all living Player Units are Exhausted
```

```text
Attack/Wait makes the unit inactive for the remainder of Player Turn
```

```text
one baseline Attack or Skill per unit per turn
```

Replaced by:

```text
Shared AP
+ free unit switching/reselection
+ repeated legal actions
+ Attack/Skill movement lock
+ global End Turn
```

---

# 144. Superseded Enemy Phase Model

## SUPERSEDED

```text
all enemies move
→ all enemies attack
```

Replaced by sequential Enemy Activation.

---

# 145. Superseded Intent Preview

## SUPERSEDED AS DEFAULT

Exact enemy path/destination preview is not part of current player-facing Intent design.

---

# 146. Superseded Range Terminology

## SUPERSEDED

Generic `Range` terminology as the primary combat-range term.

Use:

```text
ATR — Attack Range
```

---

# 147. Superseded Spawn Fallback Design

## SUPERSEDED AS PRIMARY GAMEPLAY RULE

```text
Primary Spawn
→ Alternative Spawn
→ local 3×3 search
```

Replaced by reserved telegraphed spawn position.

Technical emergency fallback remains an implementation question.

---

# 148. Superseded Purple Design

## SUPERSEDED

Old Purple melee/ranged adaptive-immunity design.

Replaced by first-attacker Attunement / temporary AP-commitment design.

---

# 149. Superseded Blue Knockback

## SUPERSEDED

Shockwave Knockback.

Current candidate payoff applies Stun, with Immobilize retained only as a possible fallback if Stun proves too oppressive.

---

# 150. Superseded Orange Post-Buff Mobility

## SUPERSEDED

Old direction where Orange could become generally mobile after Buff cycle.

Current direction:

```text
successful Buff
→ reset Charge
→ stationary Charging at current position
```

---

# 151. Superseded Main Menu Shop Direction

## SUPERSEDED

Old milestone-unlocked Main Menu Shop as the canonical full-game access rule.

Permanent progression remains tied conceptually to run settlement; exact presentation remains open.

---

# 152. Superseded Region 1 Full-Run Interpretation

## SUPERSEDED / DEVELOPMENT EXCEPTION CLARIFIED

Region 1 completion is not canonical full-run completion.

The full intended run continues Village → Town → Castle.

---

# Part XIII — Current Open Design Questions

# 153. Combat Open Questions

## OPEN

- final Normal Attack AP cost if 1 AP changes after balancing;
- Skill system and costs;
- Hold final effect and restrictions;
- final movement-lock terminology;
- AP handling on mid-turn unit death;
- AP=0 during active reposition;
- exact continuous-movement measurement;
- exact StartGrid boundary detection;
- exact LOS implementation;
- final universal Status timing convention.

---

# 154. Unit Open Questions

## OPEN

- Trickster identity;
- Support identity;
- player Skills;
- future playable units.

---

# 155. Enemy Open Questions

## OPEN

- final combat-distance metric;
- deterministic final target/tile ordering;
- final Status vocabulary;
- Concealed reveal behaviour;
- final `Attuned` / `Focused` name;
- Orange numbers;
- Purple numbers;
- Blue ATR / Charge / Stun duration;
- which special enemies enter Region 1;
- Mini-Boss design;
- Boss Pattern design;
- future enemy variants.

---

# 156. Encounter Open Questions

## OPEN

- Protect Target exact rule;
- Mini-Boss encounter;
- Wave Victory Relevance;
- exact telegraph/spawn/first-activation lifecycle;
- technical emergency spawn fallback;
- multi-step objectives;
- future objective library;
- final Region 1 enemy compositions.

---

# 157. Run and Reward Open Questions

## OPEN

- recovery rules;
- Rest node behaviour;
- defeated-unit persistence;
- between-region recovery;
- resume unfinished run;
- Town/Castle internal structure;
- reward occurrence probability;
- rarity model;
- reward repetition;
- stacking;
- stacking caps;
- unique-node reward behaviour.

---

# 158. Economy Open Questions

## OPEN

- final Crystal conversion rate;
- defeat penalty;
- completion bonus;
- In-Run Shop;
- final full-game permanent-progression access/presentation;
- future permanent-upgrade categories.

---

# 159. Balancing Open Questions

## OPEN

- exact Current Player Capability measurement;
- Stage Pressure scale;
- final Difficulty Gap interpretation;
- Tactical Mastery measurement;
- final pressure weights;
- final difficulty scale;
- rebalance of Region 1 values after new combat/enemy implementation.

---

# 160. Tutorial Open Questions

## OPEN / VALIDATION-DEPENDENT

- final production Tutorial Phase count;
- exact tutorial map dimensions/coordinates;
- exact LOS/Cover teaching geometry;
- exact first Status teaching source;
- Practice Target final identity/presentation;
- Stun duration/timing for chosen tutorial content;
- final use/non-use and placement of Orange/Purple/Blue;
- exact Wave spawn-to-first-activation lifecycle;
- Wave Telegraph information density;
- exact AP-sensitive task choreography;
- final Tutorial Objective / UI wording;
- retry whole Stage vs Phase/checkpoint granularity;
- exact amount of Unity-control Flow Simulation required;
- movement-scouting/refund exploit/value;
- final combined-pressure tuning;
- main-game skip/replay/access policy.

---

# Part XIV — Prototype Implementation Conflict Register

# 161. Current Prototype Conflict Warning

## VERIFIED IMPLEMENTATION GAP — 11 AUGUST 2026

Repository/source/runtime audit confirms that the current prototype still uses a post-v2.5 / pre-v3 combat implementation.

Verified current combat includes:

```text
per-unit Ready / Exhausted
Attack / Wait → Exhausted
all living Player Units Exhausted → Enemy Phase
originTile-based repositioning
all enemies Move
→ all enemies Attack
ATR + Cover
no distinct LOS validity system
no Intent / Dynamic Intent
old/placeholder tutorial
```

The local working tree also contains implemented/runtime-confirmed Run Overview + Shop-relocation flow that is newer than the v2.5 handoff.

This Decision Snapshot does **not** claim that the prototype already implements the current design.

Before combat migration:

```text
use actual current source/runtime
→ compare against this design snapshot
→ plan the migration
→ implement one verified checkpoint at a time
```

---

# 162. Implementation Truth Rule

## LOCKED WORKFLOW PRINCIPLE

Do not update implementation documentation merely because the design changed.

Implementation documents should change only after:

- actual code/data changes;
- runtime behaviour is tested;
- the result is confirmed.

Likewise, do not downgrade a current Game Design decision merely because the old prototype still implements an earlier rule.

---

# Part XV — Immediate Next Project Work

# 163. Current Work Checkpoint

## CURRENT WORK ORDER

Completed:

```text
Game Design v3.0 migration
→ Enemy design recovery / handoff
→ Tutorial T1 Learning Curriculum
→ Tutorial T2 Phase Architecture
→ Tutorial T3 Stage / Paper Design
→ corrected Prototype Validation Scope
→ repository/source/runtime audit
→ documentation inventory
→ documentation migration matrix
```

Current:

```text
core documentation refresh
```

Next after documentation refresh:

```text
cross-document consistency audit
→ new-chat recovery simulation
→ save / review / commit / push
→ prototype migration planning
→ smallest verified implementation checkpoints
```

V0–V8 should be treated as **migration / validation domains**, not automatic one-patch coding checkpoints.

Repository implementation work must use actual current files rather than assumptions from historical v2.5 documentation.


# 164. Maintenance Rule

Update this document when:

- a canonical gameplay rule changes;
- a material tutorial/prototype-validation direction changes;
- an OPEN item becomes decided;
- a TENTATIVE direction is promoted/revised/abandoned;
- a feature is intentionally deferred or removed;
- prototype testing produces a new Game Designer decision;
- enemy/encounter/tutorial design materially changes;
- progression/economy/balancing intent changes.

When updating:

```text
preserve status
→ do not promote Tentative values silently
→ preserve still-valid older decisions
→ mark replaced rules as Superseded
→ separate main-game design from prototype implementation
```

---

# 165. Final Decision Principle

**Latest explicit Game Designer decision overrides this document when a later conflict exists.**

**`TMTB_GAME_DESIGN_CONTEXT.md` remains the fuller canonical design context.**

**This file is the compact current decision snapshot.**

**Actual source code and confirmed runtime remain the prototype implementation truth.**
