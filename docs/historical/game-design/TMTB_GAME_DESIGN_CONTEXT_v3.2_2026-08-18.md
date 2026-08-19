# TMTB Game Design Context

**Document Type:** Canonical Living Game Design Context
**Project / Game Code:** TMTB
**Development Group:** BeCan
**Primary Game:** 3D Turn-Based Tactics
**Target Production Environment:** Unity
**Version:** 3.2
**Last Updated:** 18 August 2026
**Status:** **CANONICAL LIVING GAME DESIGN DOCUMENT**

---

## 1. Purpose of This Document

`TMTB_GAME_DESIGN_CONTEXT.md` is the canonical living game-design document for TMTB from the Game Designer's perspective.

Its purpose is to preserve and consolidate the intended design of the main TMTB game, including game identity, macro progression, tactical combat, unit and enemy design, encounter design, run progression, rewards, economy, balancing, evaluation, onboarding, and unresolved design space.

This document is **not** a technical design document, prototype architecture document, implementation tracker, or source-code reference.

The main TMTB game is a **3D Turn-Based Tactics game intended for production in Unity**.

The current 2D/simulative prototype has two parallel roles:

1. **Game Designer Validation Tool** — it helps test combat rules, progression, balancing assumptions, difficulty, run flow, risk–reward relationships, enemy behaviour, tutorial requirements, and other design questions.
2. **Unity Functional Flow Reference** — it preserves important intended game/tutorial flow so a future Unity implementer can understand what should happen even when the web prototype does not reproduce the final 3D mechanic itself.

Prototype behavior must not automatically be interpreted as final main-game design. A prototype step may be a real systemic validation, a deliberate flow simulation, a prototype-only evaluation device, or a temporary development exception.

---

## 2. Game Design Scope

This document distinguishes three layers.

### 2.1 Main Game Design

The intended design of TMTB as a full game.

### 2.2 Prototype Validation Scope

A simplified representation used to test selected game-design questions and preserve important intended Unity flow.

The prototype does not need to reproduce every final 3D interaction mechanically. However, an important final-game onboarding or flow step must not disappear merely because the web prototype cannot reproduce the real Unity mechanic.

Current tutorial/prototype representation classes are:

```text
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

- **REAL SYSTEM VALIDATION** — the prototype must actually execute the relevant gameplay rule because incorrect implementation would invalidate the design test.
- **FLOW SIMULATION** — an important Unity-facing step remains present in the prototype flow through instruction/simulated confirmation even though the final mechanic is not reproduced.
- **DEFERRED / NOT READY** — the rule/content is not sufficiently decided to teach accurately and should not be faked merely to complete the flow.

Examples of prototype simplification include Region 1 functioning as a temporary validation loop, direct grid/BFS movement replacing free 3D locomotion, simplified presentation, and simulated camera/control onboarding.

Prototype behavior is evidence or validation material, not automatic game-design canon.

### 2.3 Technical Implementation

How Unity or the current web prototype stores, calculates, or renders the design.

Algorithms, source files, runtime state objects, storage systems, serialization formats, pathfinding, and UI implementation belong in technical documentation rather than this file.

---

## 3. Source and Design History

This document consolidates design context from:

- the legacy **Master Design Note Prototype V0**;
- the legacy design-model revision patch;
- previous architecture, state/data, UI-flow, control, progress, and chat-summary documents where they contain relevant game-design intent;
- `TMTB_GAME_DESIGN_DECISIONS_v2.5.md`;
- `TMTB_PROJECT_CONTEXT_v2.5.md`;
- `TMTB_GAME_DESIGN_AND_IMPLEMENTATION_HANDOFF_2026-07-30.md`;
- `TMTB_ENEMY_DESIGN_DISCUSSION_HANDOFF_2026-08-09_v4.md`;
- `TMTB_TUTORIAL_DESIGN_CORRECTED_HANDOFF_2026-08-11_v1.md`;
- `TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md`;
- `TMTB_CANONICAL_MIGRATION_MATRIX_2026-08-16_v1.md`;
- explicit Game Designer decisions made after those documents through 18 August 2026;
- the six-batch Game Design Migration Audit completed on 9 August 2026;
- the Tutorial T1–T3 / Prototype Validation Scope correction pass completed on 11 August 2026;
- the reviewed Tutorial Phase 6–8 / Objective / progressive-battlefield design consolidation completed on 16 August 2026.

This v3.2 document carries forward v3.1 and performs the targeted canonical migration defined by the reviewed Canonical Migration Matrix. It updates Tutorial architecture, Structure/Objective direction, Spear Tutorial placement, controlled Status/Charge onboarding, Wave/graduation direction, and Tutorial casualty/orchestration policy while preserving detailed choreography, coordinates, PVS numbers, and implementation truth in supporting/implementation-facing documentation.

Migration rules:

1. A newer explicit Game Designer decision overrides an older conflicting design.
2. A newer domain-specific handoff is used to migrate details that had not yet reached the canonical context.
3. A legacy design that was never superseded is carried forward.
4. A prototype implementation does not automatically become full-game canon.
5. An unfinished or uncertain design remains marked as `PLANNED`, `TENTATIVE`, or `OPEN`.
6. A replaced design is preserved where useful as `SUPERSEDED` or `HISTORICAL DESIGN SEED`.
7. Main-game design and prototype implementation truth remain separate.

After this migration, working handoffs remain historical/supporting references. The latest explicit Game Designer decision remains the highest design source of truth.

## 4. Design Status Language

### LOCKED
Current canonical design direction.

### PLANNED
Intended design that remains part of the current direction but is not yet fully implemented or validated.

### TENTATIVE
A working design, value, formula, or interpretation that may change through balancing, playtesting, research, or development.

### OPEN
Not yet decided.

### DEFERRED
A known design topic intentionally postponed or excluded from the current design/tutorial scope. `DEFERRED` does not mean removed; it means no current decision or implementation should be invented merely to fill the gap.

### SUPERSEDED
An older design intentionally replaced.

### PROTOTYPE ONLY
A design or feature intended specifically for the prototype or evaluation workflow, not confirmed for the main game.

### DEVELOPMENT EXCEPTION
A temporary rule or boundary caused by the current development scope rather than the intended full-game structure.

### HISTORICAL DESIGN SEED
An older idea preserved for reference but no longer treated as the current plan.

---

# Part I — Game Identity and Vision

## 5. Game Identity

**Game / Project Code:** TMTB
**Development Group:** BeCan
**Genre:** 3D Turn-Based Tactics
**Target Production Environment:** Unity
**Progression Structure:** Semi-Roguelite / Light Roguelite
**Meta Progression:** Permanent progression across runs

### Status

- TMTB project/game code: **LOCKED**
- BeCan as development group: **LOCKED**
- 3D Turn-Based Tactics: **LOCKED**
- Unity production context: **LOCKED**
- Semi-roguelite / light roguelite progression: **LOCKED**
- Permanent meta progression: **LOCKED**

---

## 6. Relationship Between the Main Game and the Prototype

TMTB is fundamentally a 3D Unity game.

The prototype is intentionally a simplified 2D/simulative tool. It serves both as:

```text
Game Designer Validation Tool
+
Unity Functional Flow Reference
```

The prototype is not expected to reproduce every final-game interaction mechanically.

A central example is movement.

**Main game**
- units move freely through the 3D tactical environment using direct controls such as WASD;
- movement is not restricted to tile-by-tile traversal;
- when the player enters an Action State, the unit snaps to the center of the tactical grid cell it currently occupies;
- combat resolution is evaluated from that discrete tactical position.

**Prototype**
- continuous 3D locomotion may be mechanically replaced by direct grid/BFS repositioning;
- final 3D camera/control feel is not validated by the web build;
- important Unity onboarding beats such as camera/control instructions may still appear through **FLOW SIMULATION**;
- tactical rules that are the object of validation must use **REAL SYSTEM VALIDATION** rather than tutorial-only text.

Therefore:

```text
not mechanically implemented in the web prototype
≠
allowed to disappear from intended Unity flow
```

The prototype remains relevant because it can validate tactical rules and decision flow while also acting as a readable functional reference for future Unity implementation.

Prototype-specific mechanics, shortcuts, evaluation devices, or navigation remain non-canonical unless explicitly adopted into the main-game design.

---

## 7. Core Player Experience

TMTB is a tactical roguelite about:

- reading enemy goals, intent, and learnable behaviour;
- arranging party position in a tactical environment;
- allocating a shared pool of Action Points across the party;
- deciding when to keep positional flexibility and when to commit a unit's position through action;
- adapting the party through temporary run growth, route decisions, resources, and persistent progression;
- preserving party condition across the run.

The intended depth comes primarily from the interaction between readable enemy pressure, shared tactical resources, positional commitment, and party development across a run.

### Status

**TENTATIVE CANONICAL DIRECTION**

The formulation may still be refined after prototype validation, but it is now sufficiently strong to guide tutorial, encounter, enemy, and progression design.

---

## 8. Core Design Pillars

### 8.1 Readable Threats

Enemy pressure should be readable enough for the player to make informed decisions.

Player-facing information may include:

- Current Intent;
- Current Target when relevant;
- important State / Status information;
- multi-activation progress such as `CHARGE X/Y`;
- spatial threat areas when an action requires them;
- incoming spawn telegraphs.

The game should not normally reveal:

- exact enemy path;
- exact enemy destination;
- exact ending grid;
- the complete future Pattern;
- the optimal solution for the player.

Principle:

> **Informasikan ancamannya, bukan jawabannya.**

Status: **TENTATIVE CANONICAL DIRECTION / STRONG**

### 8.2 Shared Tactical Economy

Action Points are a party resource rather than isolated per-unit turns.

The player decides which unit is currently the most valuable user of the shared resource.

The design does **not** require every unit to act every Player Turn. Instead, encounter pressure should create situations where the best AP user changes according to position, enemy behaviour, Status, objective, range, party role, and other tactical conditions.

Status: **TENTATIVE CANONICAL DIRECTION / STRONG**

### 8.3 Position Commitment

Positioning is not only about reaching the best tile or tactical area.

The player also decides:

- whether to reposition;
- whether to preserve the ability to return to the turn's StartGrid;
- when to commit a unit's position by using Attack or Skill;
- whether movement AP is worth spending to answer current/future pressure.

Status: **TENTATIVE CANONICAL DIRECTION / STRONG**

### 8.4 Adaptive Party Development

Combat outcomes, HP condition, temporary rewards, route decisions, resources, and permanent progression change the party's future options.

The tactical layer and roguelite layer should reinforce each other:

Combat Result
→ Party Condition / Reward
→ Route / Build Adaptation
→ Future Encounter Capability
→ Run Settlement
→ Permanent Growth
→ Future Run Capability

Status: **TENTATIVE CANONICAL DIRECTION**

### 8.5 Migration of Earlier Pillar Candidates

Earlier candidate themes remain represented, but are consolidated:

| Earlier Theme | Current Home |
|---|---|
| Tactical Positioning | Position Commitment |
| Meaningful Unit Activation | Shared Tactical Economy + Position Commitment |
| Risk–Reward Route Choice | Adaptive Party Development |
| Adaptation During a Run | Adaptive Party Development |
| Attrition Management | Adaptive Party Development |
| Permanent Progression | Adaptive Party Development |
| Readable Difficulty | Readable Threats + Difficulty/Balance Framework |

The earlier list is therefore not treated as a second competing pillar set.

# Part II — Macro Progression and Run Structure

## 9. Full Run Structure

A full run is intended to continue across multiple regions.

Village
→ Town
→ Castle
→ Final Run Resolution
→ Run Settlement
→ Meta Progression

Completing Village does **not** represent the intended end of a full run.

### Status

- One full run spans Village → Town → Castle: **LOCKED**
- Final structure inside Town and Castle: **OPEN**

---

## 10. Current Development Scope

Current development focuses on **Region 1 — Village**.

Region 2 — Town and Region 3 — Castle remain locked while core systems are developed and validated.

The current prototype therefore uses:

Region 1 Clear / Defeat
→ Temporary Development Settlement
→ Meta Progression
→ New Journey

This is a **DEVELOPMENT EXCEPTION**.

In the intended full game:

Village Clear
→ Town

Town Clear
→ Castle

Castle / Final Resolution
→ Full Run Settlement

The prototype term `Run Completion` after Village should not be interpreted as the canonical full-game run boundary.

---

## 11. Region Design

Regions use a branching node structure that allows route planning and risk–reward decisions.

A region may eventually contain:

### Combat
- normal stage;
- mini-boss;
- boss.

### Progression / Utility
- reward;
- treasure;
- rest;
- shop.

### Event
- choice;
- risk–reward event;
- story event.

### Structural
- region start;
- region clear / transition.

### Status

- Branching region structure: **LOCKED DIRECTION**
- Full node taxonomy: **PLANNED / OPEN**
- Non-combat node behavior: **OPEN**

---

## 12. Region 1 — Village Structure

Stage 1 — Fixed
→ 2 unique nodes generated from Stage 2 A/B/C
→ 2 unique nodes generated from Stage 3 A/B/C
→ Stage 4 — Fixed Mini-Boss climax

### Status

- Region 1 Stage 1 → Stage 4 structure: **LOCKED FOR REGION 1**
- Universal reuse of the same topology in later regions: **OPEN**

Town and Castle do not need to use the same structure.

---

## 13. Branching and Route Commitment

Players may inspect available routes before committing.

Previewing or inspecting a node does not commit the route.

Beginning the selected node encounter commits the choice.

Once committed, alternative sibling routes may become blocked.

### Status

- Route preview without commitment: **LOCKED**
- Commitment when encounter begins: **LOCKED**
- Sibling branch blocking: **LOCKED CURRENT DESIGN**
- Reopening blocked routes through special future effects: **OPEN / DEFERRED**

A legacy item concept such as `Trackback` is only a historical example, not a confirmed item.

---

## 14. Region Generation and Route Visibility

Current Region 1 design:

- route composition is generated when entering the region;
- generated routes are visible for planning;
- only reachable nodes may be entered.

### Status

- Generate route at region entry: **LOCKED CURRENT REGION DESIGN**
- Visible route planning: **LOCKED**
- Exact generation logic for future regions: **OPEN**

---

## 15. Controlled Randomization

Future randomization may use weighted pools, controlled selection, conditional rules, run seeds, or progression-dependent pools.

### Status

**PLANNED / DEFERRED DESIGN DIRECTION**

---

# Part III — Tactical Combat

## 16. Combat Turn Structure

Baseline battle flow:

Player Turn
→ Enemy Turn
→ Next Player Turn
→ repeat until victory or defeat

The **Player Turn belongs to the party**, not to one isolated unit activation.

The player may freely select and reselect usable player units, spend the shared AP pool, and decide when to end the Player Turn.

The Player Turn ends through the global **END TURN** command.

On End Turn:

- remaining Team AP is discarded;
- Enemy Turn begins.

The Player Turn does not require every living player unit to act and does not require AP to reach zero.

### Status

- Player Turn → Enemy Turn structure: **LOCKED / CARRIED FORWARD**
- Exhaustion-based Player Turn ending: **SUPERSEDED**
- Global End Turn: **CURRENT DESIGN DECISION**

---

## 17. Shared Action Point Economy

At the start of each Player Turn:

`Team AP = Living Player Units × 2`

Example:

Guard + Archer alive
→ Team AP = 4

AP belongs to the party pool, not to individual units.

A single unit may use several or all available AP if its actions remain legal and the player considers that the best tactical decision.

The design does not enforce equal AP distribution across party members.

### Status

- Shared party AP: **CURRENT DESIGN DECISION**
- 2 AP contribution per living Player Unit: **CURRENT DESIGN DECISION**
- Forced equal AP distribution: **NOT PART OF CURRENT DESIGN**

---

## 18. AP Refresh and Carry-Over

Team AP is a per-Player-Turn resource.

At End Turn:

`Remaining AP → discarded`

At the next Player Turn:

`Team AP → recalculated from living Player Units`

AP does not carry between turns.

### Status

**CURRENT DESIGN DECISION**

---

## 19. Unit Selection and Switching

Selection is not ownership of a one-time activation.

The player may switch between usable units throughout the Player Turn.

Example:

Guard Move
→ switch Archer
→ Archer Attack
→ switch Guard
→ Guard Attack or Hold if legal
→ switch Archer again

A unit that has already attacked is not automatically "done"; only the actions prohibited by current rules become unavailable.

### Status

**CARRIED FORWARD / EXPANDED BY SHARED AP SYSTEM**

---

## 20. StartGrid and Movement Commitment

At the start of each Player Turn, every living Player Unit records its tactical reference position for that turn:

`StartGrid`

StartGrid is not the permanent spawn position. It is refreshed each Player Turn based on the unit's current tactical position.

Leaving StartGrid creates a movement commitment:

`Leave StartGrid → spend 1 Team AP`

Movement is **not** paid per tile.

After the 1 AP movement commitment has been paid, the unit may continue repositioning within its movement allowance, subject to movement and occupancy rules.

### Status

- StartGrid: **CURRENT DESIGN DECISION**
- Leaving StartGrid costs 1 AP: **CURRENT DESIGN DECISION**
- Per-tile AP movement cost: **NOT CURRENT DESIGN**

---

## 21. Movement Refund and Scouting

If a unit leaves StartGrid and later returns to StartGrid **before using Attack or Skill and before movement becomes locked**, the movement AP is refunded.

Example:

Team AP = 4
→ Guard leaves StartGrid
→ AP = 3
→ Guard returns to StartGrid
→ AP = 4

A consequence of this rule is that a player may temporarily reposition, observe readable battlefield changes such as Dynamic Intent, and return to StartGrid for a refund.

This movement-scouting consequence is currently allowed and should be tested rather than pre-emptively removed.

### Status

- Return-to-StartGrid refund: **CURRENT DESIGN DECISION**
- Movement scouting: **CURRENTLY ALLOWED CONSEQUENCE / NEEDS PLAYTEST**

---

## 22. Attack / Skill Position Commitment

Using **Attack** or **Skill** commits the acting unit's current position for the remainder of that Player Turn.

After Attack or Skill:

- Movement becomes unavailable for that unit for the remainder of the Player Turn;
- Attack may still be used again if AP and action requirements allow;
- Skill may still be used again if AP and skill requirements allow.

This also applies when the unit attacks without first leaving StartGrid.

Working conceptual terminology:

`Movement Locked After Action`

Avoid treating this as the same thing as the gameplay Status `Stun` or a future `Immobilize` Status.

### Status

- Attack/Skill locks further movement: **CURRENT DESIGN DECISION**
- Final player-facing/code terminology: **OPEN**

---

## 23. Repeated Attack and Skill

The old rule:

`one baseline action → Exhausted`

is **SUPERSEDED**.

Current core rule:

- Attack may be repeated while AP and action requirements allow.
- Skill may be repeated while AP and skill-specific requirements allow.
- There is no universal `one Attack per unit per turn` rule.
- There is no universal `one Skill use per turn` rule.

Individual Skills may later define explicit restrictions such as cooldown, once-per-turn use, resources, or other conditions.

### Status

- Repeated Attack/Skill allowed by the core system: **CURRENT DESIGN DECISION**
- Per-skill restrictions: **OPEN DESIGN SPACE**

---

## 24. Player Action Categories

Current conceptual action space includes:

- Move / Reposition
- Attack
- Skill
- Hold
- End Turn

### Attack

Attack is an AP-consuming action.

Exact universal AP cost remains a balancing/design parameter unless explicitly defined for a specific implementation or action.

Historical/current candidate baseline:

`Normal Attack = 1 AP`

Status: **TENTATIVE BALANCING DIRECTION**

### Skill

Skill is an AP-consuming action category.

Exact Skill costs, cooldowns, resources, and individual restrictions remain skill-specific and **OPEN** until those skills are designed.

### Hold

Hold is an active preparation action, not an automatic reward for standing still.

Current eligibility:

- unit remains at StartGrid;
- unit has not used Attack;
- unit has not used Skill.

Current cost:

`Hold = 1 AP`

Leaving StartGrid makes Hold unavailable. Returning to StartGrid before Attack/Skill restores eligibility.

Still OPEN:

- exact Hold effect;
- whether Hold ends further actions;
- whether Hold itself locks movement;
- repeatability;
- once-per-turn restriction;
- duration/timing;
- unit-specific Hold results.

### Wait

The old individual `Wait → Exhausted` behaviour is **SUPERSEDED** by the new action economy.

Whether a separate player-facing Wait command survives in another form remains **OPEN / LIKELY REMOVED**.

### End Turn

Global system action:

`END TURN → discard remaining AP → Enemy Turn`

End Turn is valid even when AP remains.

Exact warning/confirmation presentation is UI/UX-specific and remains **OPEN**.

---

## 25. Player Turn Conceptual Flow

START PLAYER TURN
→ determine living Player Units
→ generate Team AP (`living units × 2`)
→ store each unit StartGrid
→ reset relevant per-turn movement/action state

PLAYER DECISION LOOP
→ select any usable Player Unit
→ Move / Attack / Skill / Hold as legal
→ resolve AP cost and action consequences
→ switch/reselect units freely
→ repeat as desired

END TURN
→ discard remaining Team AP
→ begin Enemy Turn

This is a **game-design flow**, not a required technical state-machine implementation.

---

## 26. Continuous 3D Movement and Tactical Grid Resolution

The full Unity game uses free movement.

Players move the active character continuously through the 3D tactical space using direct controls such as WASD.

Movement is not restricted to discrete tile-by-tile steps.

When the player enters the Action Menu / Action State:

Current World Position
→ determine occupied tactical grid cell
→ snap unit to grid center
→ resolve tactical position from that point

The grid-resolved position is used for targeting, ATR, path interaction, cover, occupancy, and action resolution.

The Shared AP / StartGrid system does not replace movement allowance.

- **Movement allowance** = how far a unit may reposition.
- **Movement AP commitment** = resource cost for choosing to leave StartGrid.

Exact Unity detection for when continuous movement counts as leaving StartGrid remains implementation-dependent.

### Status

- Continuous direct movement: **LOCKED**
- Tactical grid reference: **LOCKED**
- Snap to grid center on Action State: **LOCKED CURRENT DESIGN**
- Exact Unity movement measurement / StartGrid boundary detection: **OPEN IMPLEMENTATION DETAIL**

---

## 27. Movement and Occupancy Rules

At the tactical resolution layer:

- obstacles block invalid tactical positions;
- opposing units block traversal;
- allied units may be traversed;
- units may not end on an occupied tactical position;
- two units may not occupy the same final tactical position;
- a reserved Wave Telegraph spawn tile may be traversed but may not be used as a final position.

The prototype's BFS pathfinding and four-direction traversal remain implementation simplifications and are not main-game canon.

### Status

**LOCKED / CURRENT DESIGN**, except exact pathfinding implementation.

---

## 28. ATR — Attack Range

`ATR` means **Attack Range**.

ATR describes the attackable radius from the attacker's tactical position.

Distance is evaluated center-to-center between tactical positions on the combat plane.

ATR should not be interpreted as movement-step distance.

### Status

- ATR terminology: **LOCKED**
- Center-to-center tactical distance principle: **LOCKED**
- Exact future Unity combat-distance implementation where still unresolved: **OPEN IMPLEMENTATION DETAIL**

---

## 28A. Melee Path Interaction

A melee attack requires:

- target within ATR;
- attack path not crossing the interior of a blocking obstacle.

Touching only an obstacle edge or corner does not invalidate the attack under the current design.

### Status

**LOCKED CARRIED-FORWARD RULE**

---

## 28B. Ranged Attack, LOS Review, and Cover

### Current LOS status

The final role of **Line of Sight (LOS)** in main-game ranged combat is intentionally **not being re-decided in v3.2**.

Canonical v3.1 previously stated a universal rule that all ranged attacks require LOS. The latest Game Designer direction is to **hold further LOS discussion** because the mechanic has not been designed deeply enough for the current priority and is not expected to become relevant in the near-term Tutorial/implementation work.

Therefore:

```text
Main-game LOS design review
= PLANNED / DEFERRED

Current Tutorial LOS lesson
= DEFERRED

v3.2
= makes no new universal LOS rule
```

This is **not** a decision that LOS has been removed from TMTB. It is also not permission to silently treat the older universal requirement as newly reaffirmed final design. When Tactical Space / ranged-combat design becomes a priority, LOS should receive a dedicated Game Design review.

### Cover remains a separate current mechanic

Cover continues to modify the result/effectiveness of otherwise legal interactions under the current Cover rules.

A target behind Cover may remain targetable.

Clear relationship
→ normal baseline effectiveness

Partial Cover
→ reduced baseline effectiveness

Full Cover
→ target may remain targetable
→ a baseline damaging attack may legally be selected
→ final damage may resolve as 0
→ if the player executes that attack, its action/AP cost is consumed

This preserves design space for abilities that:

- ignore Cover;
- penetrate Cover;
- reduce/remove Cover;
- apply non-damage effects;
- interact with the environment.

### Status

- Main-game LOS role / exact rule: **PLANNED FUTURE DESIGN REVIEW / DEFERRED CURRENT PRIORITY**
- Current Tutorial LOS requirement: **DEFERRED**
- Cover does not automatically cancel targetability: **LOCKED / RECONFIRMED**
- Full Cover may produce 0 baseline damage while target remains targetable: **LOCKED CURRENT DESIGN**

---

## 28C. Range-Limited Non-Attack Abilities

A range-limited non-attack ability defines its own spatial requirements.

Each ability may define:

- range requirement;
- LOS requirement if that mechanic is later relevant/defined;
- Cover interaction;
- target type;
- effect.

The deferred main-game LOS review does not create an automatic LOS requirement for every ranged or range-limited ability.

Confirmed special-enemy examples from the current candidate designs:

Orange Buff
→ range-limited
→ LOS not required under the current candidate rule
→ Cover ignored

Purple Vulnerable Curse
→ range-limited
→ LOS not required under the current candidate rule
→ Cover ignored

### Status

**CURRENT ACTION-GRAMMAR PRINCIPLE**

---

## 28D. Target Validity, Action Validity, and Action Effectiveness

These are separate design concepts.

**Target Validity**
Is this entity still a legal target under the relevant Target Rule?

**Action Validity**
Can this action legally be performed on that target from the current state/position?

**Action Effectiveness**
Would the action produce a relevant result?

A target may be valid while a particular action is ineffective.

This distinction is especially important for enemy AI. For example, a Basic Spear should not intentionally spend its one action on a Full-Cover target when its basic damaging attack would produce no relevant effect.

The player may still be allowed to select and execute a legal but ineffective attack when the rules intentionally permit it.

### Status

**LOCKED / CURRENT DESIGN PRINCIPLE**

---

## 28E. Cover Model and Damage Model

Current Cover categories:

- partial cover;
- stronger partial cover;
- full cover.

Current working values:

- O30 = 30%
- O70 = 70%
- Full Cover = 100%

Current working damage formula:

`Final Damage = floor(max(0, ATK × (1 - Cover Percentage) - DEF))`

Conceptually:

Attack Power
→ modified by Cover
→ reduced by Defense
→ final non-negative damage

### Status

- Cover mechanic: **LOCKED**
- Multiple partial-cover strengths: **LOCKED**
- O30 / O70 values: **TENTATIVE**
- Full Cover baseline model: **LOCKED CURRENT DESIGN**
- Damage formula: **TENTATIVE WORKING BALANCE FORMULA**

---

## 28F. Player Stun

Current Player `STUN` behaviour:

- Movement: disabled
- Normal Attack: disabled
- Skill: disabled
- Hold: disabled
- Unit selection / switch control: allowed
- Shared AP contribution: unchanged
- AP may still be used by other non-Stunned units

A Stunned unit is therefore an **unit-action denial**, not automatic party-resource denial.

Example:

Guard = Stunned
Archer = Normal
Living Units = 2
→ Team AP = 4
→ Archer may use the shared pool

If all Player Units are Stunned:

- Team AP may still exist;
- units may still be selected;
- no unit can Move / Attack / Skill / Hold;
- practically, End Turn is the remaining progression action.

### Status

**LATEST DESIGN DECISION**

Exact Stun duration depends on the source/effect and remains separately defined.

---

## 28G. Player Combat Edge Cases Still Open

The following should **not** be silently decided by implementation:

- AP handling when a unit that contributed AP dies during the same Player Turn;
- behaviour if Team AP reaches zero while a unit is already in an active reposition state;
- exact final terminology for movement lock after Attack/Skill;
- exact individual Skill costs/restrictions;
- final Hold behaviour;
- final presence or removal of a separate Wait command;
- exact status-duration tick convention.

These remain **OPEN** until explicitly decided.

# Part IV — Units and Enemies

## 29. Planned Playable Roster

- Guard
- Archer
- Trickster
- Support

### Status

- Guard: **PLANNED PLAYABLE / VALIDATED BASELINE**
- Archer: **PLANNED PLAYABLE / VALIDATED BASELINE**
- Trickster: **PLANNED PLAYABLE / DEFERRED**
- Support: **PLANNED PLAYABLE / DEFERRED**

Trickster and Support role identity, stats, and skills remain open unless defined later.

---

## 30. Guard

Current baseline:

- HP: 25
- ATK: 5
- DEF: 4
- Move: 3
- ATR: 1.5

### Status

- Playable identity: **LOCKED DIRECTION**
- Numerical stats: **TENTATIVE BALANCE BASELINE**

---

## 31. Archer

Current baseline:

- HP: 18
- ATK: 7
- DEF: 1
- Move: 4
- ATR: 3.0

### Status

- Playable identity: **LOCKED DIRECTION**
- Numerical stats: **TENTATIVE BALANCE BASELINE**

---

## 32. Trickster

Planned playable unit.

Detailed identity, stats, skills, and tactical role remain open.

### Status

**PLANNED / DEFERRED**

---

## 33. Support

Planned playable unit.

Detailed identity, stats, skills, and tactical role remain open.

### Status

**PLANNED / DEFERRED**

---

## 34. Unit Design Extensibility

Unit design should remain extensible enough to support role-specific mechanics such as skills, traits, status interactions, utility effects, special movement behavior, resource systems, and controlled exceptions to baseline rules.

These are design spaces, not guaranteed production features.

### Status

**DESIGN PRINCIPLE**

---

## 35. Enemy Design Philosophy

Enemy difficulty should not be defined only by raw stats.

Enemy or enemy composition should act as a **source of tactical pressure** that forces meaningful decisions.

Relevant questions include:

- Which target should be prioritized?
- Should the player approach or retreat?
- Which party member should receive Shared AP?
- Is a setup/payoff threat worth interrupting?
- Should a unit keep its current position or reposition?
- Is an enemy worth bursting now, or should it be left alone temporarily?
- Is a Status or special condition changing the best response?

Enemy depth may emerge from:

- quantity;
- archetype combination;
- offensive capability;
- survivability;
- mobility;
- ATR / threat reach;
- Target Rule;
- Movement Rule;
- Action;
- Intent;
- State;
- Status;
- Pattern;
- Conditional Override;
- synergy;
- spatial placement;
- Wave timing.

### Systemic Counterplay

Counterplay should generally be systemic rather than a hard character lock.

Less preferred:

`Enemy X can only be solved by Guard.`

Preferred direction:

`Enemy X creates a condition for which Guard may be a natural answer, while other answers may still exist through position, skill, Status, environment, resource commitment, or another system.`

### Anti-AP-Funnel Goal

Shared AP intentionally allows AP funneling.

The design goal is **not** to force every party member to act every turn.

Instead, encounters should create situations where one unit is not always the best AP sink.

### Status

**CORE ENEMY / ENCOUNTER DESIGN PRINCIPLE**

---

## 36. Enemy Complexity Principle

Not every enemy should use the complete enemy grammar.

Basic enemies remain intentionally simple.

Complexity such as State changes, Status interactions, Conditional Override, Pattern, or special Action rules should only be added when it creates a useful tactical decision.

### Status

**CURRENT DESIGN DIRECTION**

---

## 37. Universal Enemy Design Grammar

Conceptual enemy definition:

- Target Rule
- Movement Rule
- Action Set / Action Rule
- Intent
- Fallback Rule
- State Set [optional]
- Status Interaction
- Conditional Override [optional]
- Pattern [optional]

This is a **game-design grammar**, not a required Unity class structure.

### Role-Consistent AI

Enemy behaviour may use deterministic/mathematical evaluation, but what counts as a "good" position/action is defined by the enemy's role.

Examples:

- Sword values melee engagement.
- Spear values effective ranged engagement at preferred distance.
- A future Support enemy may value ally support rather than global damage optimization.

The baseline does not require a squad-level tactical mastermind.

Status: **TENTATIVE / STRONG DESIGN DIRECTION**

---

## 38. Dynamic Enemy Intent

Intent is the enemy's current readable plan based on the latest relevant battle state.

Intent is **not** an exact path lock or destination reservation.

Conceptually:

`Intent Rule = Attack Nearest Player Unit`

`Current Target = Guard`

If battle state changes and Archer becomes the nearest valid target:

`Intent Rule remains Attack Nearest Player Unit`

`Current Target may change to Archer`

Intent is dynamic in gameplay and should update after relevant battle-state changes. Technical implementation may be event-driven rather than recalculated every render frame.

Relevant state changes may include:

- player movement completion / tactical position changes;
- action resolution;
- HP changes;
- Status changes;
- unit death;
- objective changes;
- Wave/phase changes.

### Player-Facing Communication

Normally show:

- Action / Behaviour icon;
- Current Target icon if the action has a target;
- important State / Status;
- current multi-activation progress;
- relevant threat area.

Normally hide:

- exact path;
- exact destination;
- exact ending grid;
- full future Pattern.

Principle:

> **Informasikan ancamannya, bukan jawabannya.**

### Status

**LATEST / CURRENT DESIGN DIRECTION**

---

## 39. Baseline Sword Enemy

Role: **Basic Melee Enemy**

Current numerical baseline:

- HP: 16
- ATK: 6
- DEF: 2
- Move: 3
- ATR: 1.5

Behaviour:

**Target Rule**
`Nearest Valid Player Unit`

**Movement Rule**
Seek a valid melee engagement position against Current Target.

If the ideal engagement tile cannot be reached this activation:

- approach the valid melee engagement area;
- keep Current Target if it remains valid;
- Stay if no useful/legal movement exists.

Temporary occupancy does not automatically invalidate Current Target.

**Action**
Maximum one Basic Melee Attack in its activation.

**Pattern**
None.

### Status

- Basic melee identity: **LOCKED CURRENT DESIGN**
- Behaviour package: **CURRENT DESIGN DIRECTION**
- Numerical stats: **TENTATIVE BALANCE BASELINE**

---

## 39A. Baseline Spear Enemy

Role: **Basic Ranged Enemy**

Spear remains part of the intended enemy roster.

Historical ATR reference: approximately 3.0, subject to balancing.

Behaviour:

**Target Rule**
`Nearest Valid Player Unit`

**Preferred Engagement Distance**
`Maximum Effective ATR`

**Movement Rule**

Spear seeks an effective ranged engagement position against Current Target.

- If too close, it prefers to move farther away.
- If too far, it approaches.
- If it can already attack but a reachable position better matches preferred maximum effective ATR, it may still reposition.
- Cover-seeking is **not** a default baseline preference.

Movement priority concept:

1. find a valid/effective ranged engagement position;
2. prefer a position closest to maximum effective ATR;
3. prefer less movement when otherwise tied;
4. use deterministic stable ordering if still tied.

**Action**

Maximum one Basic Ranged Attack.

The final main-game relationship between ranged Attack and LOS is deferred to the planned Tactical Space / LOS review. The current Tutorial Phase 6 does **not** teach LOS.

If current attack would produce no relevant effect and a better effective firing position is unavailable:

- do not waste the action;
- End Activation.

**Pattern**
None.

### Current Tutorial Placement

The stale v3.1 note that Spear Tutorial placement still required a new curriculum decision is replaced.

Current authored Tutorial direction:

```text
Phase 6
→ introduce basic ranged enemy pressure
→ demonstrate Spear role-consistent spacing
→ teach defensive Cover through real incoming ranged pressure
```

Exact prototype stats, scorer implementation, geometry, and tuning remain validation-dependent and belong in supporting/implementation-facing documentation.

### Status

- Basic ranged identity: **PLANNED / CURRENT ROSTER DIRECTION**
- Behaviour package: **CURRENT DESIGN DIRECTION**
- Current Tutorial placement in Phase 6: **CURRENT AUTHORED TUTORIAL DIRECTION**
- Exact numerical stats / scorer implementation: **TENTATIVE / OPEN**

---

## 39B. Target Selection and Nearest Rule

Baseline conceptual selection:

All candidate Player Units
→ Validity Filter
→ Nearest Evaluation
→ Tie-Break
→ Current Target

Candidate target validity includes:

- alive;
- still in the encounter;
- targetable under the relevant rule;
- structurally engageable by that enemy's capability.

Temporary blocking does not make a target invalid.

`Cannot reach target this activation ≠ structurally unreachable target`

For baseline Sword and Spear:

`Nearest = combat-distance metric consistent with ATR/range`

not automatically path distance or easiest engagement.

Tie direction:

1. minimum combat distance;
2. if Current Target remains tied, keep it;
3. if still tied/no Current Target, use deterministic stable ordering.

### Status

- Principle: **CURRENT DESIGN DIRECTION**
- Exact final Unity combat-distance/tie implementation: **OPEN**

---

## 39C. Sequential Enemy Resolution

The old model:

`all living enemies move → all living enemies attack`

is **SUPERSEDED**.

Current direction:

Enemies resolve one activation at a time.

Enemy A
→ Movement
→ Action
→ resolve battle state

Enemy B
→ reads the updated battle state
→ Movement
→ Action

and so on.

Current execution order:

`Spawn Order`

Earlier-spawned living enemies act earlier.

### Status

- Sequential activation: **LATEST DESIGN DIRECTION**
- Spawn Order execution: **CURRENT DESIGN DIRECTION**
- Initiative/speed-based ordering: **NOT CURRENT BASELINE / FUTURE DESIGN SPACE**

---

## 39D. Enemy Activation Economy

Baseline:

`1 Enemy Activation = maximum 1 Movement Resolution + maximum 1 Action Resolution`

Movement may be 0.

Action may be 0.

There is no baseline:

- Move → Attack → Move;
- multiple Action resolutions;
- enemy Shared AP system.

Special enemies or bosses may create explicit exceptions later.

### Status

**CURRENT DESIGN DIRECTION**

---

## 39E. Retarget, Fallback, and Execution-Time Revalidation

Three situations are distinct:

**Target Invalid**
→ Retarget using Target Rule.

**Target Valid, ideal position unavailable**
→ Movement Fallback while keeping Current Target.

**Target Valid, Action unavailable/ineffective after movement**
→ End Activation without Action.

Conceptual activation flow:

Activation Start
→ revalidate State / Conditional Override
→ revalidate Intent / Target
→ determine movement from latest board
→ resolve maximum one Movement
→ revalidate Action Validity / Effectiveness
→ commit maximum one Action
→ resolve
→ update State / Status / Pattern
→ next enemy

Enemy destination is not reserved during Player Turn.

### Status

**CURRENT DESIGN DIRECTION**

---

## 39F. State, Status, and Conditional Override

### State

Primary behaviour mode.

Examples for grammar only:

- Normal
- Charging
- Recovering
- Fleeing
- Guarding
- Enraged

Current direction:

`maximum one Primary Behaviour State at a time`

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**

### Status

Attached effect/modifier that may change capability, stat, targetability, or interaction without necessarily replacing the enemy's overall behaviour mode.

Multiple Status effects may coexist.

Examples for grammar only:

- Concealed
- Rooted
- Marked
- Weakened
- Exposed
- Guarded

Not every named example is a confirmed production Status.

Status system: **STRONG DIRECTION**

### Conditional Override

Decision rule activated by battle conditions.

Examples:

`IF HP <= threshold → enter Fleeing`

`IF ally critical → Heal ally`

An override may:

- change Intent;
- change target;
- choose an Action;
- change State;
- apply/remove Status.

Not every override requires a new State.

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**

---

## 39G. Enemy Pattern

Pattern is a temporal sequence of behaviour steps across activations.

Example grammar:

Attack
→ Charge
→ Heavy Attack
→ Recover
→ loop

Pattern does **not** normally lock:

- exact target;
- exact path;
- exact destination.

Dynamic Intent and Current Target remain active unless a mechanic explicitly creates Target Lock.

Basic Sword and Spear have no Pattern.

Pattern is mainly intended for:

- special enemies;
- Mini-Boss;
- Boss;
- enemies requiring setup/payoff or learnable rhythm.

### Deterministic Default

Current direction prefers deterministic Patterns by default rather than random action selection.

Random branches remain possible as explicit special mechanics.

Status: **TENTATIVE / CURRENT DESIGN DIRECTION**

---

## 39H. Pattern Communication

Full future Pattern is not shown by default.

Current Intent is the main player-facing information.

Example:

`[HEAVY ATTACK] [Guard]`

Multi-activation behaviour may show progress:

`CHARGE 1/3`
`CHARGE 2/3`
`CHARGE 3/3`

Important rule:

`CHARGE 3/3` still means Charge is the Current Intent for that upcoming enemy activation.

Do **not** automatically show:

`NEXT: HEAVY ATTACK`

The payoff becomes visible only when it becomes the Current Intent on a later Player Turn.

Future target is not shown before payoff Intent unless a mechanic explicitly creates Target Lock.

Threat area may be shown when the current action requires spatial telegraphing.

### Status

**LATEST DESIGN DECISION**

---

## 39I. Pattern Progression, Override, and Status Interaction

Pattern Step may define its own Advance Rule.

Candidate families:

- On Activation End
- On Action Resolved
- On Condition Complete

For important payoff actions, `On Action Resolved` may keep the step pending if the action could not successfully happen.

### Conditional Override

Temporary decision override default:

`PAUSE current Pattern Step`

`Consume` is not default.

`Reset` is an explicit Pattern interaction.

A major State/Phase transition may `SWITCH` the active Pattern.

Override priority is defined per enemy/archetype, not by one universal hierarchy.

### Status Interaction

Status restrictions normally change capability first; they do not automatically edit Pattern.

Example:

`ROOTED → movement disabled`

A stationary Charge may still continue.

If activation is fully denied:

`STUNNED → no normal activation → Pattern progress pauses`

`CHARGE X/Y` counts **successful Charge activations**, not global world turns.

An explicit effect such as `BREAK CHARGE` may reset/cancel/redirect Pattern only if the mechanic says so.

### Status

**CURRENT DESIGN DIRECTION**

---

## 39J. Special Enemy Design Template

Reusable Game Designer template:

- Enemy Name
- Enemy Identity
- Encounter Purpose
- Archetype / Role
- Target Rule
- Movement Rule
- Action Set
- Primary Behaviour State
- Status Interaction
- Conditional Override
- Pattern
- Pattern Advance Rule
- Intent / Telegraph
- Fallback
- Special Interaction
- Counterplay
- Failure Case

Principle:

`Pressure / Decision → Role → Behaviour → Action / Status / Pattern → Numbers`

Special enemy is only justified if it adds meaningful decision pressure, not merely higher HP/damage.

### Status

**CURRENT DESIGN TOOL / FRAMEWORK**

---

## 39K. Special Enemy Candidate — ORANGE Charger Buffer

**Status:** **TENTATIVE SPECIAL ENEMY CANDIDATE / STRONG DESIGN DIRECTION**

**Role:** Support / Temporal Threat

**Encounter Purpose:** create target-priority and kill-commitment pressure.

Core question:

> **Can the player kill Orange now, or is careless chip damage making the situation worse?**

### Pattern Candidate

`CHARGE 1/3 → CHARGE 2/3 → CHARGE 3/3 → BUFF ALLY → RESET`

Charge count remains **TENTATIVE**.

### Charging Behaviour

Normally stationary.

No baseline player-damaging Basic Attack.

### Terrified

During Charging:

First successful damaging hit in the Player Turn
→ Fear Source = first damaging Player Unit
→ Terrified

Fear Source is locked to that first successful damaging attacker for the Player Turn.

Further attackers do not replace it.

On Orange activation while Terrified:

- move to a legal reachable position that maximizes distance from Fear Source;
- then still perform Charge;
- Charge progress advances;
- Terrified expires after that activation;
- Fear Source clears;
- Orange returns to stationary Charging.

If it cannot move farther, it chooses the best legal available distance; if it cannot move, it Stays and still Charges.

Terrified only applies while Charging. When Buff is the active payoff, taking damage does not trigger Terrified.

### Buff Payoff

Action: Damage Buff
Target: Nearest Valid Ally
Range: Orange Buff ATR
LOS: not required
Cover: ignored

If nearest valid ally is outside Buff ATR:

- Orange approaches that ally;
- if the target enters Buff ATR after Movement, Buff in the same activation;
- otherwise Buff remains pending.

Already-buffed allies remain valid targets.

Buff stacking is currently allowed for prototype simplicity.

After successful Buff:

- reset Charge;
- Orange becomes stationary at its **current** position.

Current candidate Buff duration:

`3 turns`

### Open / Tentative

- HP;
- Movement;
- Buff ATR;
- exact Buff strength;
- exact stacking formula/timer;
- exact Charge count;
- balance of Terrified flee distance.

---

## 39L. Special Enemy Candidate — PURPLE Charger Debuffer

**Status:** **TENTATIVE SPECIAL ENEMY CANDIDATE / STRONG DESIGN DIRECTION**

Old melee/ranged adaptive immunity concept: **SUPERSEDED**

**Role:** Debuff / AP Commitment Pressure

Core question:

> **Which Player Unit should make the first damaging hit, and is funneling AP into that unit worth it this turn?**

### Attunement

First successful damaging hit during Player Turn
→ Purple becomes Attuned to that Player Unit.

For the remainder of that Player Turn:

- only that exact Player Unit can deal damage to Purple;
- Purple remains targetable by other units;
- damaging actions from other units resolve 0 damage;
- source does not switch.

Attunement clears at End Player Turn.

Working mechanic name `Attuned` / `Focused` remains **OPEN**.

### Charging

Purple is stationary while Charging.

Attunement does not stop Charge.

Exact Charge count remains **OPEN / TENTATIVE**.

### Vulnerable Payoff

Intent:

`[VULNERABLE] [Nearest Player Unit]`

Target Rule:

`Nearest Valid Player Unit`

Candidate Debuff ATR:

`2 ATR`

Vulnerable is a Curse:

- LOS not required;
- Cover ignored;
- obstacle does not block the Curse when target remains within Debuff ATR.

When payoff is ready:

- if Current Target is in Debuff ATR, Stay and apply Vulnerable;
- otherwise approach Current Target;
- if movement reaches Debuff ATR, apply in the same activation;
- if still out of range, keep payoff pending.

After successful Vulnerable:

- reset Charge;
- Purple becomes stationary at current position.

### Vulnerable Prototype Rule

Current tentative baseline:

- duration: 2 turns;
- stacking allowed;
- reapplication: `+1 stack`;
- reapplication refreshes shared duration to 2;
- effect strength intended to scale additively/linearly;
- target already Vulnerable remains valid.

Exact `+X% incoming damage`, tick timing, max stack, and final duration remain **TENTATIVE / OPEN**.

---

## 39M. Special Enemy Candidate — BLUE Shockwave Charger

**Status:** **TENTATIVE SPECIAL ENEMY CANDIDATE / STRONG DESIGN DIRECTION**

**Role:** Timed Spatial Hazard

Interpretation:

> **Blue functions like a readable living mine whose detonation timing is visible to the player.**

### Baseline Behaviour

- permanently stationary;
- no Basic Attack;
- no reactive movement/state when damaged;
- taking damage only reduces HP unless another system says otherwise.

### Pattern Candidate

`CHARGE 1/2 → CHARGE 2/2 → SHOCKWAVE → RESET`

Charge count remains **TENTATIVE**.

### Shockwave

Intent:

`[SHOCKWAVE] [SELF]`

Area:

`Blue ATR`

Shockwave:

- always executes when its payoff activation occurs;
- executes even if no Player Unit is in the area;
- resets afterward;
- is not blocked by LOS;
- ignores Cover;
- penetrates obstacles for area resolution.

Affected Player Units inside Blue ATR receive:

`STUN`

Old Knockback concept: **SUPERSEDED**

Candidate fallback if Stun is too oppressive:

`IMMOBILIZE`

Exact Stun duration remains **OPEN / TENTATIVE BALANCING PARAMETER**.

Blue therefore tests whether the player spends movement/AP to leave the future danger area or accepts action denial.

---

## 39N. Charger Trio Pressure Comparison

| Candidate | Primary Pressure |
|---|---|
| Orange | Kill commitment / punishment for careless chip damage |
| Purple | Temporary AP funnel / first-attacker commitment |
| Blue | Position commitment / timed spatial hazard |

The three candidates are pressure-test designs, not confirmed Region 1 roster.

### Status

**TENTATIVE ROSTER / ENCOUNTER CANDIDATES**

---

## 39O. Mini-Boss Design

Region 1 Stage 4 remains intended as a fixed Mini-Boss climax.

Intended objective direction:

`Defeat Mini-Boss`

Current prototype Stage 4 battle content is a development placeholder and is not the canonical Mini-Boss design.

### Status

- Stage 4 as Mini-Boss climax: **LOCKED DIRECTION**
- Mini-Boss identity: **OPEN**
- Mini-Boss abilities/pattern: **OPEN**
- Exact stats: **TENTATIVE / OPEN**
- Exact map: **OPEN**

---

## 39P. Future Enemy Archetype Design Space

Preserved historical/future directions:

- Bruiser / Heavy Melee
- Fast Harasser
- Support Enemy
- Cover-seeking ranged variants
- other role-specific enemies

These are not confirmed active roster entries.

### Status

**DEFERRED / HISTORICAL DESIGN SPACE**

---

## 39Q. Enemy Design Open Items

Still unresolved:

- exact combat-distance metric;
- deterministic final target/tile ordering;
- main-game LOS role / exact rule is deferred to the planned future Tactical Space / LOS review;
- final Status vocabulary;
- exact Status duration tick convention;
- `Concealed` reveal rules;
- final `Attuned`/`Focused` naming;
- Orange numerical parameters;
- Purple numerical parameters;
- Blue ATR / Charge count / Stun duration;
- which special enemies actually enter Region 1;
- Mini-Boss design;
- Boss Pattern design;
- future enemy variants.

# Part V — Encounter Design

## 40. Encounter Design Philosophy

A tactical encounter may combine:

Map
+ Enemy Composition
+ Spawn Configuration
+ Objective
+ Victory / Defeat Conditions
+ Encounter Phase
+ Wave / Pacing
+ Trigger
+ Player / Enemy Condition
= Encounter Experience

Difficulty is not defined by enemy stats alone.

Encounter design should intentionally combine pressure sources to create tactical decisions.

Pressure may come from:

- enemy behaviour;
- composition/synergy;
- spatial layout;
- objective;
- Wave timing;
- telegraph;
- Shared AP opportunity cost;
- party condition;
- route context.

### Status

**CORE ENCOUNTER DESIGN PRINCIPLE**

---

## 41. Objective System

Objectives are intended to create tactical priorities beyond simply defeating every enemy as quickly as possible.

Tactical environment structures may have functional gameplay roles beyond decorative geometry or Cover. Current intended design space includes structures that may become stage Objectives, including **destroy** and **protect** use cases.

The existence of Structure/Objective gameplay does not mean every environmental object is attackable or objective-relevant.

### Core / Currently Intended

#### Eliminate All

Defeat all required enemies.

Status: **LOCKED CORE OBJECTIVE / VALIDATED**

#### Protect Target

Keep a designated protected target alive while satisfying encounter requirements.

The protected target may eventually include a tactical Structure where appropriate, but exact enemy-vs-Structure Target Rules remain unresolved.

Status: **PLANNED CORE OBJECTIVE**

#### Destroy Structure / Destroy Target

Destroy a designated target entity/Structure as the encounter Objective or as part of Objective progression.

Current direction establishes this as intended core Objective space. Exact Structure targetability, durability, multi-tile interaction, damage model, and enemy-vs-Structure rules remain **OPEN**.

Status: **PLANNED CORE OBJECTIVE**

#### Defeat Mini-Boss

Defeat a designated Mini-Boss or target enemy.

Status: **PLANNED CORE OBJECTIVE**

### Planned Objective Design Space

- Survive Turns
- Reach Exit
- Activate Points
- Escort Target
- Hold Position

Status: **PLANNED / DEFERRED**

### Objective Progression

An Objective may change during a continuous Stage when authored battle-state conditions are met.

This can be used to teach or create changing tactical priority without treating every Objective change as a new Stage/battle.

Exact Objective progression, UI treatment, and trigger conditions remain per-encounter design.

---

## 42. Objective, Victory, and Defeat

`Objective ≠ Victory Condition ≠ Defeat Condition`

Objective tells the player what they are trying to accomplish.

Victory Condition defines a successful encounter resolution state.

Defeat Condition defines an unsuccessful encounter resolution state.

Wave completion, Tutorial Task completion, and Phase transitions are not automatically equivalent to encounter victory.

### Status

**CORE DESIGN PRINCIPLE**

---

## 43. Baseline and Objective-Specific Defeat Conditions

Baseline:

- All Player Units Defeated

Planned objective-specific conditions may include:

- Protected Target Destroyed
- Turn Limit Exceeded
- Enemy Reached Exit
- Objective Point Lost
- Escort Target Destroyed

### Status

- All Player Units Defeated: **LOCKED BASELINE**
- Objective-specific defeat conditions: **LOCKED DESIGN PRINCIPLE**
- Exact future conditions: **PLANNED / DEFERRED**

---

## 44. Stage, Phase, Tutorial Task, Objective, and Wave

These concepts should remain separate.

**Stage**
One complete encounter/level.

**Phase**
A large authored section or state of the encounter.

**Tutorial Task**
The current instructional objective used for onboarding.

**Objective**
The gameplay goal the player is trying to accomplish.

**Victory Condition**
The state that ends the encounter successfully.

**Wave**
A group of enemies/threats entering the encounter according to a trigger.

A Phase may trigger one or more Waves.

A Tutorial Task may use a Wave as teaching content.

A Wave is not automatically a Phase, Objective, or Victory Condition.

### Status

**CURRENT DESIGN FRAMEWORK**

---

## 45. Trigger-Based Encounter Design

Encounters may react to authored battle-state conditions.

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

Possible outcomes include:

- Wave spawn;
- reinforcement;
- ambush;
- objective change;
- area hazard;
- Phase change.

The trigger library may expand according to encounter needs.

### Status

**PLANNED / CURRENT ENCOUNTER FRAMEWORK**

---

## 46. Wave System

A Stage may contain multiple Waves.

Wave design may define:

- Wave ID;
- Role;
- Trigger;
- Timing;
- Enemy Composition;
- Spawn Position;
- Telegraph;
- Initial Intent;
- Victory Relevance.

Wave is a pressure/pacing tool, not merely an enemy container.

A Wave can create new difficulty even with an existing enemy archetype because direction, timing, existing party state, and AP/positioning context change.

### Status

**CURRENT DESIGN DIRECTION**

---

## 47. Wave Roles

Working taxonomy:

### Required Wave

Main encounter pressure expected as part of the authored encounter.

### Conditional Wave

Exists/spawns only when a condition occurs.

### Punishment Wave

Appears because of a consequence such as delay, failed interruption, alarm, mistake, or deliberately accepted trade-off.

Role and Trigger are separate dimensions.

Example:

Role: Punishment
Trigger: Enemy successfully resolves Alarm

### Status

**TENTATIVE DESIGN/AUTHORING TAXONOMY**

Do not assume a universal rule that every Required Wave always blocks Victory or every Punishment Wave does not.

---

## 48. Wave Victory Relevance

Wave Victory Relevance must be authored according to the Stage's Objective and Victory Condition.

Examples:

- an Eliminate All stage may require all active required enemies to be defeated;
- a Mini-Boss stage may potentially end when the Mini-Boss dies even if reinforcement remains;
- an untriggered Conditional/Punishment Wave may not exist as a victory blocker.

No universal final rule has been selected.

### Status

**OPEN / PER-ENCOUNTER DESIGN**

---

## 48A. Wave Telegraph

Current direction:

`Telegraph → one Player preparation window → Spawn`

Telegraph gives the player readable future pressure and a chance to reposition or allocate resources before the Wave arrives.

### Reserved Spawn Tile

A telegraphed spawn tile is:

- passable for traversal;
- invalid as a final occupied position;
- reserved against both Player and Enemy final occupancy.

This replaces the older gameplay solution based on Primary Spawn → Alternative Spawn → local 3×3 fallback.

Old fallback approach:

**SUPERSEDED AS PRIMARY GAMEPLAY SOLUTION**

A purely technical emergency fallback may still be required by implementation and remains outside game-design canon.

### Telegraph Timing

Current direction:

- Telegraph reservation is created before existing enemy movement during the preparation Enemy Turn;
- an enemy that begins on the future spawn tile must end its movement elsewhere if possible because the tile is now reserved;
- player receives the readable telegraph before spawn.

### Status

- One-turn pre-spawn telegraph: **CURRENT DESIGN DIRECTION**
- Reserved passable/non-occupiable tile: **LATEST TEAM DECISION**
- Exact technical fallback: **OPEN IMPLEMENTATION DETAIL**

---

## 48B. Spawned Enemy Behaviour

When an enemy Wave spawns:

- the enemy appears;
- its Current Intent is calculated/displayed;
- it does not immediately Move/Attack on that same spawn moment under the current direction.

This creates a readable response window.

However, exact phase boundaries between:

- Telegraph creation;
- Player response;
- Spawn;
- post-spawn Player response;
- first enemy activation

remain **OPEN** because the current candidate flow may provide too much response time.

### Status

- Spawn with readable Intent: **CURRENT DIRECTION**
- No immediate offensive Move/Attack on spawn: **CURRENT DIRECTION**
- Exact spawn-to-first-activation lifecycle: **OPEN / NEEDS PLAYTEST**

---

## 48C. Multi-Step and Phased Encounters

Future encounters may include:

- multiple Objective steps;
- Mini-Boss phases;
- Boss phases;
- Objective transitions;
- changing encounter requirements;
- Phase-specific Waves.

### Status

**OPEN / DEFERRED DESIGN SPACE**

---

## 48D. Enemy Composition as Pressure Composition

Composition should be authored by the pressure/decision created by the combination, not merely by enemy counts.

Current examples of enemy pressure identity:

- Sword → close-distance melee pressure;
- Spear → ranged-distance / effective firing pressure;
- Orange → kill-commitment pressure;
- Purple → AP / first-attacker commitment;
- Blue → timed spatial pressure.

Example hypothesis:

`Spear + Blue`

may create pressure where the player wants to leave Blue's future Shockwave area but must reconsider exposure to Spear.

Such combinations are hypotheses to test, not automatically good encounters.

### Status

**CURRENT ENCOUNTER DESIGN METHOD**

---

## 48E. Region 1 Encounter Direction

Historical/simple Stage 1 baseline:

- Region: Village
- Player: Guard + Archer
- Enemy: 2 Sword Enemies
- Objective: Eliminate All

This remains useful as a **simple combat baseline**, but its old tutorial purpose is no longer fully current because the old Wait/Exhaustion action economy has been superseded.

Old specific Stage 2–3 encounter drafts remain **HISTORICAL DESIGN SEEDS**.

Their underlying intention remains:

Stage 2–3 should progressively introduce variation through:

- enemy composition;
- map pressure;
- objectives;
- Waves/pacing;
- triggers;
- risk–reward differences.

Region 1 Stage 4 remains a fixed Mini-Boss climax direction.

### Status

- Guard + Archer vs 2 Sword as simple baseline: **CARRIED / HISTORICAL VALID BASELINE**
- Old Stage 1 tutorial sequence: **SUPERSEDED AS CURRENT TUTORIAL SEQUENCE / HISTORICAL SIMPLE-COMBAT BASELINE**
- Old Stage 2–3 specific layouts/content: **HISTORICAL DESIGN SEEDS**
- Stage 4 Mini-Boss climax: **LOCKED DIRECTION**

# Part VI — Run Progression and Attrition

## 49. Within-Run Progression

During a run, the player's situation may evolve through:

- route choices;
- temporary rewards;
- Run Crystal;
- HP / party condition;
- encounter results;
- region progression.

---

## 50. Route Risk–Reward

Higher-risk nodes should generally create better opportunities for higher-quality rewards.

Higher Risk
→ Greater Encounter Pressure
→ Greater Attrition Risk
→ Potentially Better Reward Opportunity

### Status

- Risk–reward relationship: **LOCKED DIRECTION**
- Exact probability model: **OPEN / BALANCING**

---

## 51. HP Carry and Attrition

Current HP is intended to persist between encounters within the same run.

Damage taken in one encounter should affect party capability later.

### Status

**PLANNED / LOCKED DESIGN DIRECTION**

The current prototype's full heal at each stage is not main-game canon.

---

## 52. Recovery Design

Recovery may eventually involve healing, rest nodes, recovery rewards, services, or between-region rules.

### Status

**OPEN / DEFERRED**

---

## 53. Unit Defeat Across a Run

The consequence of unit defeat is not fully defined.

Open possibilities include revival, temporary unavailability, persistent injury, recovery requirements, or other penalties.

### Status

**OPEN**

---

# Part VII — Reward System

## 54. Reward Philosophy

Rewards support **within-run adaptation**.

They should allow players to respond to route choice, encounter difficulty, party weaknesses, future threats, HP condition, and emerging run strategy.

Rewards are not limited to simple stat increases.

---

## 55. Reward Opportunity and Node Difficulty

Nodes may have a chance to generate reward opportunities.

Harder nodes are intended to have a higher chance of offering higher-rarity or higher-quality rewards than easier nodes.

### Status

- Reward chance per node: **PLANNED CORE DIRECTION**
- Higher difficulty biases higher-quality reward opportunity: **PLANNED CORE DIRECTION**
- Exact probability table: **OPEN**
- Exact rarity model: **OPEN**

Unique Event, Rest, Shop, Treasure, or Story nodes may use different reward/consequence structures.

The current prototype rule of exactly four reward cards is not full-game canon.

---

## 56. Temporary Run Rewards

### `run_long`
Default temporary buff duration. Active until the run ends or fails.

### `one_stage`
Applies to a specific encounter or stage.

### `instant`
Resolves immediately.

### Status

- `run_long`: **PLANNED DEFAULT**
- `one_stage`: **PLANNED**
- `instant`: **PLANNED**

---

## 57. Reward Design Space

Rewards may affect:

- offense;
- survivability;
- mobility;
- range control;
- utility;
- HP condition;
- action availability;
- resources;
- progression.

These are categories, not a final reward list.

---

## 58. Reward Impact

Preserved Game Designer tools:

- Impact Rating
- Capability Bonus Estimate
- Reward Pool Tier
- Affected Capability Aspect

### Status

**WORKING BALANCING TOOLS**

---

## 59. Reward Repetition and Stacking

Open questions:

- Can the same reward reappear?
- Can identical rewards stack?
- Are there stacking caps?
- Does rarity affect stacking?
- Are some effects unique?

### Status

**OPEN**

---

# Part VIII — Economy and Meta Progression

## 60. Run Crystal

Run Crystal is a temporary run resource/currency accumulated during an active run.

### Status

**LOCKED CONCEPT**

---

## 61. Meta Crystal

Meta Crystal is persistent currency used for permanent progression between runs.

### Status

**LOCKED CONCEPT**

---

## 62. Run Settlement and Crystal Conversion

Canonical:

Active Run
→ Full Run Completion or Defeat
→ Run Settlement
→ Run Crystal converts into Meta Crystal

The current prototype converts after Region 1 because Region 1 acts as a temporary development settlement point.

### Status

- Conversion at full run settlement: **LOCKED CONCEPT**
- Conversion after Region 1 in prototype: **DEVELOPMENT EXCEPTION**
- 100% conversion rate: **TENTATIVE BALANCE VALUE**

---

## 63. Region 1 Working Crystal Values

- Stage 1: 20
- Stage 2A: 25
- Stage 2B: 30
- Stage 2C: 40
- Stage 3A: 35
- Stage 3B: 45
- Stage 3C: 55
- Stage 4: 70

### Status

**TENTATIVE BALANCE BASELINE**

---

## 64. Permanent Progression Shop / Access Point

Permanent progression remains part of the full-game loop.

Conceptually:

Full Run Resolution
→ Settlement
→ Run Crystal / Meta Crystal resolution
→ Permanent Progression access
→ Future Run

The older milestone-unlocked **Main Menu Shop** remains **SUPERSEDED**.

The exact full-game presentation/access point for the permanent progression shop is not fully locked.

The current prototype may expose the Shop from the Run Overview / post-run flow for practical validation and navigation. That prototype access point does **not** automatically redefine full-game canon.

### Status

- Permanent progression shop/service: **CURRENT FULL-GAME DIRECTION**
- Old milestone Main Menu Shop: **SUPERSEDED**
- Exact full-game access/presentation: **OPEN / UIUX**
- Current Run Overview access in prototype: **PROTOTYPE CURRENT FLOW**

## 65. In-Run Shop

An In-Run Shop may exist as a node or service.

Purpose, currency, inventory, and relation to Meta Crystal remain undefined.

### Status

**OPEN / DEFERRED DESIGN SPACE**

---

## 66. Permanent Progression

Current foundational permanent stat categories:

- Max HP
- ATK
- DEF

### Status

- Permanent progression: **LOCKED**
- Max HP / ATK / DEF as foundation: **LOCKED DIRECTION**
- Exact growth values: **TENTATIVE**
- Additional categories: **OPEN / EXPANDABLE**

Current prototype values:

- Max HP: +2 per level
- ATK: +1 per level
- DEF: +1 per level
- Costs: 30 / 60 / 100 / 150

These are **TENTATIVE BALANCE VALUES**.

---

# Part IX — Difficulty and Balancing Framework

## 67. Difficulty Philosophy

Difficulty in TMTB is contextual rather than entirely static.

Experienced difficulty emerges from the relationship between player capability and encounter pressure.

A node's difficulty tag should be interpreted relative to an expected player state.

### Status

**CORE BALANCING PRINCIPLE**

---

## 68. Expected Player State

Possible inputs:

- expected run;
- permanent upgrade state;
- temporary reward/buff state;
- HP / party condition;
- expected current player capability.

### Design Principle

**"Hard" must mean hard for an expected player state, not hard in isolation.**

---

## 69. Current Player Capability

Initial working concept:

Current Player Capability is informed by:

- Base Party Capability
- Permanent Upgrade Bonus
- Temporary Run Buff Bonus
- HP / Party Condition
- Tactical Mastery

The older plus-sign formula is conceptual, not proof that all factors already share a validated numerical scale.

### Status

**PRESERVED WORKING FRAMEWORK**

---

## 70. Base Party Capability Dimensions

Candidate dimensions:

- Survivability
- Offense
- Mobility
- Range Control
- Utility
- Action Availability

### Status

**CARRIED FORWARD**

---

## 71. Range Control

Range Control may involve:

- ATR;
- mobility;
- safe attack positioning;
- cover/path interaction;
- threat exposure;
- space control.

### Status

**CARRIED FORWARD INTERPRETATION**

---

## 72. Permanent Growth

Legacy **Permanent Upgrade Growth Rating 1–5** is preserved as a working Game Designer tool.

### Status

**WORKING BALANCING TOOL**

---

## 73. Temporary Run Growth

Legacy **Temporary Buff Impact Rating 1–5** is preserved.

Historical interpretation:

1. Minor
2. Light
3. Meaningful
4. Strong
5. Build-Defining / potentially dangerous to balance

### Status

**WORKING BALANCING MODEL**

A reward that changes action economy may have much greater impact than a small stat bonus.

---

## 74. HP / Party Condition

HP carries between encounters, so party condition affects current capability.

A heavily damaged role-critical unit can reduce practical party strength even when average HP remains moderate.

### Status

- HP condition affects capability: **LOCKED DESIGN PRINCIPLE**
- Exact thresholds/modifiers: **TENTATIVE**

---

## 75. Tactical Mastery

Tactical mastery may involve:

- using cover;
- target prioritization;
- threat-zone understanding;
- protecting vulnerable units;
- route choice;
- reward choice;
- aggressive vs defensive decision-making.

### Status

**OPEN AS A MEASUREMENT MODEL**

Its numerical modifier, measurement method, and exact position inside/outside Current Player Capability may change.

---

## 76. Stage Pressure

Stage Pressure represents total encounter pressure.

It is not equivalent to enemy raw strength alone.

Initial conceptual structure:

Stage Pressure
= Enemy Pressure
+ Map Pressure
+ Wave / Pacing Pressure
+ Objective / Phase Pressure

### Status

**CORE BALANCING PRINCIPLE**

---

## 77. Enemy Pressure

May be influenced by:

- enemy stats;
- quantity;
- archetype composition;
- mobility;
- ATR / threat reach;
- behavior;
- target priority;
- synergy;
- spatial placement.

### Status

**CARRIED FORWARD**

---

## 78. Map Pressure

May be influenced by:

- arena size;
- initial distance;
- obstacles;
- cover;
- chokepoints;
- special tactical spaces;
- spawn direction;
- positional constraints.

### Status

**CARRIED FORWARD**

---

## 79. Wave / Pacing Pressure

May be influenced by:

- number of waves;
- timing;
- wave role;
- triggers;
- spawn position;
- composition;
- recovery windows;
- tactical disruption.

### Status

**CARRIED FORWARD**

---

## 80. Objective / Phase Pressure

May come from:

- protecting a target;
- defeating a Mini-Boss;
- boss phases;
- HP-threshold phases;
- objective steps;
- special stage rules.

### Status

**CARRIED FORWARD**

---

## 81. Weighted Stage Pressure

Historical working examples:

### Simple Stage
- Enemy Pressure: 45%
- Map Pressure: 35%
- Wave Pressure: 20%

### Objective / Mini-Boss Stage
- Enemy Pressure: 35%
- Map Pressure: 25%
- Wave Pressure: 20%
- Objective Pressure: 20%

### Status

**TENTATIVE WORKING WEIGHTS**

---

## 82. Difficulty Gap

Initial working concept:

`Difficulty Gap = Stage Pressure - Current Player Capability`

Purpose:

Estimate the **predicted tendency** of difficulty under an expected player state.

It is not an objective measurement of actual player experience.

### Status

**PRESERVED INITIAL / WORKING CONCEPT**

Its meaning, inputs, scales, and interpretation may evolve.

---

## 83. Working Difficulty Scale

Historical interpretation:

- ≤ -3: Trivial
- -2: Too Easy
- -1: Easy
- 0: Normal
- +1: Hard
- +2: Too Hard
- ≥ +3: Unfair

### Status

**PRESERVED WORKING SCALE**

`Unfair` should not be interpreted as scientifically proven from a numerical gap alone.

---

## 84. Stage Node Difficulty Template

The Stage Node Difficulty Template is preserved as a canonical Game Designer balancing/authoring tool.

### 1. Node Identity
- Node ID
- Stage Slot
- Node Name
- Region
- Node Type
- Objective Type
- Difficulty Tag
- Path Role

### 2. Intended Experience
- Intended Pressure
- Expected Decision / Trade-off
- Predicted Player Behaviour
- Success Signal
- Failure Signal

### 3. Expected Player State
- Expected Run
- Expected Permanent Upgrade
- Expected Temporary Buff Count
- Expected HP Condition
- Expected Current Player Capability

### 4. Enemy Pressure
- Enemy Composition
- Enemy behaviour/status/pattern considerations
- Enemy Pressure Rating

### 5. Map Pressure
- Map Pressure Rating
- relevant spatial constraints

### 6. Wave / Pacing Pressure
- Wave structure
- telegraph/reinforcement timing
- recovery windows
- Wave Pressure Rating

### 7. Objective / Phase Pressure
- Objective / Phase Pressure Rating

### 8. Stage Pressure Result
- Overall pressure estimate

### 9. Difficulty Result
- Difficulty Gap
- Target Difficulty

### 10. Reward & Progression
- Crystal Reward
- Reward Pool Tier
- Temporary Buff Impact Range
- Reward Choice Count / Opportunity

### 11. Evaluation Notes
- Expected Turn Count
- Expected HP Remaining
- Expected Unit Death
- Telemetry Notes
- Player Feedback Target
- Observed Behaviour
- Perceived Difficulty/Fairness

This is a **design authoring template**, not a mandatory technical schema.

The newer pressure-first fields do not invalidate the older numerical balancing framework; they provide the qualitative design intent that the numerical estimates are supposed to support.

## 85. Risk–Reward and Difficulty Relationship

Expected Player State
→ Estimate Node Pressure
→ Estimate Difficulty / Risk
→ Assign Appropriate Reward Opportunity

Greater expected risk should generally provide greater potential reward opportunity.

No final mathematical mapping exists between Difficulty Gap and reward rarity.

### Status

**LOCKED DIRECTION / OPEN FORMULA**

---

## 86. Historical Region 1 Numerical Balancing Drafts

Older Region 1 capability and pressure values are preserved only as:

**HISTORICAL BALANCING HYPOTHESES**

They are not current canonical targets because major systems and content remain incomplete or changed.

---

# Part X — Game Design Evaluation Framework

## 87. Purpose of Evaluation

Evaluation asks:

- Did the design produce intended difficulty?
- Did players behave as expected?
- Did players perceive the experience as intended?
- Were tactical decisions meaningful?
- Was pressure readable?
- Was failure understandable and fair?

The prototype may support this process, but the evaluation framework belongs to the Game Designer.

---

## 88. Predicted, Observed, and Perceived

### Predicted
What design and balancing models expect.

### Observed
What actually happens during play.

### Perceived
What the player reports or feels.

### Status

**PRESERVED WORKING EVALUATION FRAMEWORK**

---

## 89. Candidate Battle Evaluation Metrics

Potential metrics:

- win / loss;
- turn count;
- HP remaining;
- unit death count;
- damage taken;
- damage dealt;
- enemies defeated per turn;
- first unit death turn;
- cover usage;
- skill usage;
- threat exposure;
- AP spent per Player Unit;
- unused AP at End Turn;
- movement AP commitments;
- movement AP refunds;
- repeated Attack/Skill usage;
- Intent target changes caused by Player movement/state changes;
- response to Charge / multi-activation threats;
- Status applications and duration;
- special-enemy target priority;
- turn/time until special enemy is defeated.

### Status

**CANDIDATE EVALUATION METRICS**

Not every metric is mandatory.

Metrics should only be implemented when they support an explicit validation question.

## 90. Candidate Run Evaluation Metrics

### Progression
- furthest region / node reached;
- run result;
- encounters completed.

### Route
- path chosen;
- risk level selected;
- branch decisions.

### Growth
- temporary rewards obtained;
- permanent upgrade state;
- Run Crystal gained.

### Attrition
- HP condition;
- unit defeats;
- failure node.

### Context
- run number;
- starting capability;
- ending capability.

### Risk–Reward
- node difficulty selected;
- reward opportunity generated;
- reward rarity offered;
- reward chosen.

### Status

**CANDIDATE EVALUATION METRICS**

---

## 91. Player Perception Dimensions

Preserved candidates:

- Perceived Difficulty
- Fairness
- Tactical Choice
- Pressure
- Enjoyment
- Clarity of Cause

### Status

**PRESERVED CURRENT EVALUATION CANDIDATES**

---

## 92. Scenario Variant Testing

Scenario variants may isolate and compare design variables.

Examples:

- same party vs different enemy composition;
- same enemies on different maps;
- same stage with different wave timing;
- same player state with different objectives.

### Status

**CARRIED FORWARD AS EVALUATION METHOD**

---

## 93. Playtesting

Suggested cycle:

Design Prediction
→ Gameplay Scenario
→ Playtest
→ Observed Performance
+ Player Perception
→ Compare
→ Revise Design / Balancing Model

A balancing model does not replace playtesting.

---

## 94. Telemetry

Telemetry may support internal design evaluation.

It is:

- internal;
- non-player-facing;
- an evaluation tool.

It is not a main-game feature.

Technical details such as JSON, CSV, runtime state objects, or storage systems are outside this document.

---

## 95. Auto-Simulation

Auto-simulation is an optional future Game Designer evaluation tool.

Potential uses:

- repeated scenario testing;
- parameter comparison;
- balancing support.

It is:

- not a player-facing feature;
- not required for the main game design;
- not the primary contribution of the PA;
- not required for the current prototype milestone.

### Status

**OPTIONAL FUTURE EVALUATION TOOL**

---

# Part XI — Tutorial and Onboarding

## 96. Tutorial Design Philosophy

The Tutorial should teach transferable tactical mental models rather than a sequence of arbitrary button checks.

Preferred design rhythm:

```text
Intended decision
→ real pressure/system
→ Player action
→ actual system evidence
→ concise explanation
→ later application with less guidance
```

Tutorial authoring should preserve the distinction between teaching a mechanic and giving the player the answer to a tactical problem.

Core principles:

- real mechanics should be taught through **REAL SYSTEM VALIDATION**;
- Unity-only or presentation-specific onboarding may use **FLOW SIMULATION** in the web prototype;
- rules not ready to teach accurately remain **DEFERRED / NOT READY**;
- early lessons isolate concepts;
- later lessons compose previously learned pressure;
- good/legal play should not break Tutorial progression;
- exact Tutorial choreography must not become a second combat ruleset.

### Status

**CURRENT TUTORIAL DESIGN DIRECTION / STRONG**

---

## 97. Tutorial Structure Vocabulary

Keep these concepts distinct:

```text
Learning Block
Tutorial Phase
Tutorial Task
Learning Evidence
Objective
Victory Condition
Wave
```

A Tutorial Task is an instructional step.

An Objective is an encounter-level tactical goal.

A Victory Condition determines when the encounter/Tutorial is successfully resolved.

A Tutorial Phase is an authored learning-state section inside the continuous Tutorial Stage.

A Wave is an incoming enemy/content system and is not synonymous with a Tutorial Phase.

### Status

**CURRENT FRAMEWORK**

---

## 98. Control Knowledge vs Tactical Knowledge

### Control Knowledge

Control Knowledge teaches how to operate the game/interface.

Examples:

- look/camera;
- unit switching;
- movement controls;
- Action Selection;
- target selection;
- End Turn control;
- contextual combat button hints.

Some Unity control knowledge may be represented through **FLOW SIMULATION** in the web prototype.

### Tactical Knowledge

Tactical Knowledge teaches how TMTB rules create decisions.

Current Tutorial curriculum includes:

- Shared Team AP;
- Start-position/StartGrid movement commitment and refund;
- Movement Range;
- Global End Turn;
- Attack and Movement Lock;
- repeated Attack under Shared AP;
- ATR;
- offensive and defensive Cover;
- Enemy Intent / Current Target;
- Dynamic Intent and pressure redirection;
- basic Sword and Spear behaviour;
- Objective / Structure literacy;
- Stun and capability restriction;
- Charge / temporal threat;
- Wave Telegraph and incoming pressure;
- late combined-pressure free play.

**LOS is not part of the current Tutorial curriculum.** A future main-game LOS/Tactical Space review is planned but deferred from current priority.

### Status

**CURRENT TUTORIAL KNOWLEDGE MAP**

---

## 98A. Prototype Representation Types

### REAL SYSTEM VALIDATION

Use when the mechanic itself is being validated.

Examples include:

- Shared AP;
- StartGrid/movement commitment;
- Attack Movement Lock;
- ATR/Cover relationships used by the lesson;
- Enemy Target/Intent behaviour;
- Spear pressure when Phase 6 is implemented;
- Stun/Charge when Phase 7 is implemented;
- Wave reservation/spawn behaviour when Phase 8 is implemented.

The Tutorial may choreograph exposure, but the actual combat result must come from the real system.

### FLOW SIMULATION

Use when an important Unity onboarding beat must remain visible in the functional flow even though the web prototype cannot reproduce the final 3D implementation faithfully.

Example:

- camera/look onboarding.

### DEFERRED / NOT READY

Use when a system is not sufficiently decided to teach accurately.

Current example:

- LOS as a player-facing Tutorial lesson.

### Status

**CURRENT PROTOTYPE/TUTORIAL REPRESENTATION FRAMEWORK**

---

## 98B. Learning Evidence Model

For real mechanics, the broad progression is:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

Not every mechanic requires all four beats inside one Phase. A later Phase may provide transfer evidence for knowledge introduced earlier.

Learning Evidence should validate the intended mental model, not require one brittle exact input timing when the correct tactical outcome has already occurred.

### Status

**CURRENT TUTORIAL AUTHORING FRAMEWORK**

---

## 98C. Tutorial Input Gate

A **Tutorial Input Gate** is Tutorial orchestration used to preserve mandatory learning evidence.

It may temporarily limit which otherwise normal inputs are available during a controlled teaching window.

It is **not** a combat rule and must not be presented as if the underlying game considers a legal action invalid.

Examples of false rules the Tutorial must not teach:

- `Charging enemies cannot be attacked.`
- `Spear cannot be attacked while learning Cover.`
- `Structures are only attackable because the Tutorial prompt allows it.`
- `Shockwave always Stuns Guard.`

The combat system still evaluates real legality/effects. The Tutorial gate only controls the authored exercise window.

By the final Phase 8 free-play section, tactical Tutorial Input Gates are removed.

### Status

**LOCKED CURRENT TUTORIAL FLOW PRINCIPLE**

---

## 98D. One Continuous Tutorial Stage

The current Tutorial is authored as **one continuous Stage**.

Tutorial Phase transitions are learning-state transitions, not separate battles that automatically reset tactical state.

By default:

```text
Phase transition
≠ Player Turn reset
≠ AP refresh
≠ HP heal
≠ Status clear
≠ StartGrid reset
≠ teleport
```

Any reset/restore effect must be deliberately authored for a specific reason.

Later Tutorial space progressively reveals/unlocks while earlier space remains part of the same battlefield.

This supports a learning curve where:

```text
early Tutorial
= controlled spatial scope

later Tutorial
= expanded battlefield + composed pressure
```

Future locked Tutorial regions must be systemically inactive until unlocked. They must not influence Movement/pathfinding, targeting, Intent, Objectives, or spawns merely because they exist invisibly in map data.

Exact map dimensions, coordinates, and region boundaries remain in the supporting Tutorial baseline rather than core canon.

### Status

- One continuous Tutorial Stage: **LOCKED CURRENT TUTORIAL DIRECTION**
- Progressive battlefield reveal/unlock: **CURRENT AUTHORED DIRECTION**
- Exact production map dimensions / coordinates: **TENTATIVE / SUPPORTING**

---

## 98E. Current Tutorial Curriculum — 8-Phase Authored Baseline

The older seven-Phase current mapping is **SUPERSEDED**.

Current authored Tutorial map:

```text
Phase 1 — Control & Party Orientation
Phase 2 — Shared AP & Tactical Movement
Phase 3 — Turn / Intent / Basic Combat
Phase 4 — Tactical Range & Offensive Cover
Phase 5 — Dynamic Threat & Shared AP Application
Phase 6 — Spear / Defensive Cover / Objective Introduction
Phase 7 — Status & Temporal Threat
Phase 8 — Wave & Combined Pressure / Graduation
```

The eight-Phase architecture is the current authored baseline, but the **final production Phase count remains TENTATIVE**. Phase boundaries may change if playtesting reveals a cognitive-load or pacing problem.

### Status

- Current authored architecture: **8 PHASES — CURRENT WORKING BASELINE**
- Final production Phase count: **TENTATIVE**
- Old seven-Phase current mapping: **SUPERSEDED**

---

## 98F. Phase 1 — Control & Party Orientation

Purpose:

- establish party/control orientation;
- make active unit readable;
- introduce Guard ↔ Archer switching;
- preserve important Unity camera/control onboarding through FLOW SIMULATION where needed.

This Phase should not consume tactical Movement/AP before those concepts are introduced in Phase 2.

### Status

**CURRENT AUTHORED TUTORIAL DIRECTION**

---

## 98G. Phase 2 — Shared AP & Tactical Movement

Purpose:

- introduce Action Points (AP);
- show Shared Team AP as a party resource;
- show first movement commitment when leaving the turn-start position;
- show refund when returning before commitment is locked;
- show that different units spend from the same Team AP pool;
- distinguish Movement Range from AP cost.

Player-facing wording should use understandable terms such as `starting position`; internal state terminology like `StartGrid` need not be exposed directly.

### Status

**CURRENT AUTHORED TUTORIAL DIRECTION**

---

## 98H. Phase 3 — Turn / Intent / Basic Combat

Purpose:

- introduce Global End Turn and unused-AP discard;
- distinguish Player Turn and Enemy Turn;
- introduce basic Sword role/nearest-target behaviour;
- introduce persistent Enemy Intent / Current Target readability;
- show AP/new starting-position refresh on a new Player Turn;
- introduce Action Selection and Basic Attack;
- teach Attack as Movement Lock, not Exhaustion.

The first Sword behaviour must be produced by the real Target/Movement/Action system rather than hardcoded target choreography.

### Status

**CURRENT AUTHORED TUTORIAL DIRECTION**

---

## 98I. Phase 4 — Tactical Range & Offensive Cover

Purpose:

- introduce Archer as ranged pressure;
- distinguish Movement Range and Attack Range (ATR);
- demonstrate Outside ATR;
- demonstrate Full / Partial / clear Cover relationships from the attacker perspective;
- resolve a real ranged Attack.

Current Tutorial teaching target:

```text
ATR
+
Cover
```

LOS terminology/mechanics are **DEFERRED from current Tutorial curriculum** pending the future Tactical Space / LOS design review.

The old Practice Target is no longer part of the current authored Tutorial baseline. It remains only a **PROTOTYPE ONLY / HISTORICAL OPTION** if a future validation problem requires a controlled training object.

### Status

- ATR onboarding: **CURRENT / REQUIRED**
- Offensive Cover onboarding: **CURRENT / REQUIRED**
- LOS Tutorial lesson: **DEFERRED**
- Practice Target: **PROTOTYPE ONLY / NOT CURRENT AUTHORED BASELINE**

---

## 98J. Phase 5 — Dynamic Threat & Shared AP Application

Purpose:

- demonstrate that Intent can update when battlefield state changes;
- teach nearest-target relationship through actual board state;
- show positioning as a way to redirect pressure;
- demonstrate concentrated/repeated use of Shared AP;
- reinforce that Movement Lock is not Exhaustion;
- show a real consequence when a vulnerable unit becomes the target;
- use recovery positioning/durability to redirect pressure again;
- finish the known Sword through coordinated use of remaining party AP before entering advanced content.

The lesson must not teach a hidden `Guard = tank/taunt` rule. The transferable model is:

> Target Rule + positioning + relative durability can be used to manage pressure.

The older broad ending `Respond to the threat.` is **SUPERSEDED**.

Exact HP/AP choreography and prototype implementation state remain outside game-design canon.

### Status

**CURRENT AUTHORED TUTORIAL DIRECTION**

---

## 98K. Phase 6 — Spear, Defensive Cover, and Objective Introduction

Phase 6 introduces three competencies in dependency order:

```text
Basic Spear pressure
→ Defensive Cover
→ Objective / Structure literacy
```

### Spear

The Player observes the basic ranged enemy role through real Spear behaviour:

- nearest valid Player target;
- seeks effective ranged engagement;
- prefers distance near maximum effective ATR;
- may reposition even when an attack is already possible if a better role-consistent position is available.

The Tutorial must not move Spear to authored waypoints merely to satisfy the lesson. Required positional relationships must emerge from real AI plus encounter geometry.

### Defensive Cover

Phase 4 taught how Cover affects the Player's ranged attack.

Phase 6 teaches the complementary mental model:

> Cover can reduce incoming ranged pressure.

The current evidence requirement uses two real Spear attacks at a high level:

```text
clear/uncovered incoming attack
→ guided move into a defensive Cover relationship
→ covered incoming attack
→ readable reduced result
```

Exact damage values and geometry remain supporting/PVS detail.

### Objective / Structure literacy

After defensive-Cover evidence, the first meaningful Tutorial Objective is introduced through a destroy-Structure lesson.

Current lesson direction:

```text
Objective: Destroy the Structure/Hut
→ first Structure Attack guided
→ normal Attack targeting resolves real Structure damage
→ Tutorial Input Gate released
→ Player may prioritize Structure, Spear, repositioning, or a mixture
```

The learning target is:

> Some tactical-environment Structures can become combat targets and Objectives; combat priority is not always equivalent to eliminating enemies first.

The Tutorial does not need a separate Protect-Structure lesson now.

Phase 6 is complete only after the required Structure is destroyed and the Spear is defeated. After the first guided Structure interaction, the order of those remaining priorities is intentionally not prescribed.

### Status

**CURRENT AUTHORED TUTORIAL DIRECTION**

---

## 98L. Structure / Objective Tutorial Boundary

The Tutorial Structure lesson does not canonize one universal Structure implementation.

Main-game Structure design still needs decisions on:

- when a Structure is targetable;
- how multi-tile Structures resolve targeting;
- durability / DEF / damage model;
- destruction and walkability;
- enemy-vs-Structure Target Rules;
- protect/destroy encounter-specific behaviour.

A Hut used in supporting Tutorial paper design is an authored validation object, not the universal template for all Structures.

### Status

- Structures having tactical/objective roles: **CURRENT INTENDED DIRECTION**
- Destroy Structure / Destroy Target: **PLANNED CORE OBJECTIVE**
- Exact Structure rules: **OPEN**

---

## 98M. Phase 7 — Status & Temporal Threat

Purpose:

- teach that a threat can develop over multiple Enemy activations;
- teach Stun as capability denial while Shared AP remains a party resource;
- guarantee real evidence of the Status consequence without creating a fake combat rule.

### Current Tutorial vehicle

Current authored Tutorial uses the **Blue candidate** as the validation vehicle:

```text
Charge
→ Shockwave
→ Stun
```

This does **not** promote Blue into a locked Region 1 roster member. Blue remains a **TENTATIVE SPECIAL ENEMY CANDIDATE / Tutorial PVS vehicle**.

### Charge readability

Charge progress is shown as current multi-activation behaviour.

```text
CHARGE X/Y
```

remains Charge until the Charge action/progress is actually complete. The payoff is not prematurely previewed as the next Intent.

When Shockwave becomes Current Intent, its threat/effect becomes readable.

### Controlled first Stun evidence

The first Shockwave lesson intentionally produces exactly one Stunned Player unit through transparent instruction/geometry.

The combat effect itself must still evaluate the actual area normally; there is no hidden rule such as `Tutorial => Stun Guard`.

The intended evidence is:

- Stunned unit remains selectable;
- Move/Attack/Skill/Hold are unavailable;
- Stunned unit still contributes normal Shared Team AP;
- one required real AP-spending action through the other usable unit is sufficient to prove Shared AP adaptation;
- a later Stunned Player Turn is used as duration evidence rather than requiring a second mandatory attack;
- Stun duration is visibly experienced before recovery.

The controlled Phase 7 drill remains active until the required Stun-duration evidence is complete and the Stunned actor has recovered. Phase 8 then begins from that live combat state rather than from a reset.

The current `2 full Player Turns` Stun duration is a **TENTATIVE Tutorial/PVS value**, not a universal main-game Stun duration.

### Status

- Phase 7 learning contract: **CURRENT AUTHORED TUTORIAL DIRECTION**
- Blue Tutorial vehicle: **CURRENT TUTORIAL PVS / BLUE ROSTER STILL TENTATIVE**
- Exact Tutorial Stun duration: **TENTATIVE PVS**

---

## 98N. Phase 8 — Wave, Combined Pressure, and Graduation

Phase 8 introduces the final new Tutorial mechanic:

> **Wave Telegraph / incoming pressure.**

Everything else is transfer/composition of previously learned systems.

### Wave exposure

Current direction uses:

```text
first required Wave
→ guided exposure to Telegraph/reservation/preparation

next required Wave
→ unassisted confirmation
```

The first Wave should use already-known enemy pressure so the new lesson remains the Wave system rather than a new enemy archetype.

Exact current paper composition/timing remains supporting/PVS detail rather than universal canon.

### Free-play release

When the later Wave Telegraph is presented, tactical Tutorial guidance is removed.

The Player continues with normal combat information:

- Team AP;
- turn state;
- Objective;
- roster;
- normal control hints;
- Enemy Intent / Current Target;
- Charge/Status;
- Cover/range feedback;
- Wave Telegraph.

Principle:

```text
No Tutorial guidance
≠ No combat information
```

No tactical Tutorial Input Gate remains in final free play.

Current final free-play Objective direction:

```text
Eliminate all remaining threats
```

This Objective is a high-level combat goal, not a replacement for Tutorial-Victory gating or pending-Wave logic.

The final section should allow legal tactical branches rather than requiring the maximum intended enemy composition or one hidden optimal sequence.

### Tutorial Victory contract

Tutorial Victory should require the authored Tutorial learning/content obligations to be complete, required hostile pressure to be resolved, and no required Wave to remain pending.

Therefore `enemyCount == 0` alone is not a sufficient universal Tutorial-Victory condition while required future content remains pending.

### Status

**CURRENT AUTHORED TUTORIAL DIRECTION**

---

## 98O. Tutorial Casualty and Checkpoint Boundary

### Required Tutorial Actors before final free play

Until the two-unit curriculum is complete at the end of Phase 7, Guard and Archer are **Required Tutorial Actors**.

If a required actor is defeated before that learning contract is complete:

```text
Training Failed
→ restore latest safe Tutorial checkpoint
```

This is Tutorial curriculum orchestration, **not** a main-game casualty/permadeath rule.

No mid-combat revive or arbitrary checkpoint healing bonus is implied.

### Phase 8 onward

Once the two-unit curriculum is complete and final free play begins:

- a single-unit casualty is valid play;
- normal Living Player Unit AP rules apply;
- the Tutorial may continue with one survivor;
- full-party defeat remains defeat.

### Checkpoint principle

A Tutorial checkpoint restores a captured tactical state rather than inventing a separate HP preset.

Exact checkpoint count/granularity is not production-final and remains implementation/validation-dependent.

### Status

**LOCKED CURRENT TUTORIAL POLICY WITH TUTORIAL-ONLY SCOPE**

---

## 98P. Objective Visibility and Tutorial Text Roles

Tutorial instruction and encounter Objective are separate information roles.

Current UI/UX reference direction:

- when an encounter Objective is active and meaningful, Mission/Objective is the persistent encounter-goal information layer;
- Tutorial instructional/explanatory text is a separate onboarding layer;
- combat button hints show currently available controls rather than carrying the full Tutorial explanation.

Exact Unity screen placement, animation, styling, and timing remain UI/UX implementation detail and should not be treated as universal game-design canon.

During Tutorial Phases 1–5, Objective UI may remain dormant/non-meaningful rather than exposing a fake goal merely to fill the Objective area. Objective literacy becomes relevant when the authored Objective lesson begins in Phase 6. After an Objective is completed, subsequent traversal/instruction such as `Proceed to the next area` remains a Tutorial Task rather than a new Objective unless explicitly authored otherwise.

### Status

**CURRENT INFORMATION-ROLE DIRECTION / PRESENTATION DETAILS OPEN**

---

## 98Q. Tutorial Text Principles

Tutorial copy should generally be:

- English in the current prototype/reference flow;
- short;
- simple;
- informative;
- actionable when an action is required;
- one active instruction at a time;
- player-facing rather than implementation-facing;
- consistent with actual combat rules.

Introduce terminology before relying on abbreviations such as AP or ATR.

Prefer cause/evidence/explanation over large explanatory paragraphs.

A brief success cue may confirm learning evidence before the next instruction replaces/fades. A large `PHASE COMPLETE` modal is not the default direction.

Exact presentation timing is prototype/UIUX reference, not locked Unity timing.

### Status

**CURRENT TUTORIAL COPY DIRECTION**

---

## 98R. Combat Onboarding vs Run Onboarding

Combat onboarding and run onboarding remain separate curriculum layers.

### Combat Onboarding

Current continuous Tutorial Stage focuses on tactical combat literacy:

- control/party orientation;
- Shared AP/movement commitment;
- turn/Intent/basic combat;
- ATR/Cover;
- Dynamic Intent/pressure management;
- Spear/defensive Cover/Objectives;
- Status/Charge;
- Wave/combined-pressure graduation.

### Run Onboarding

Run onboarding may separately teach:

- route/node choice;
- rewards;
- run resources;
- settlement;
- meta progression;
- region progression.

The exact boundary and timing remain design/production decisions.

### Status

**CURRENT CURRICULUM SEPARATION**

---

## 98S. Current Tutorial Design Status

Current design frontier:

```text
Tutorial learning curriculum
→ consolidated

Current authored 8-Phase baseline
→ consolidated / final production count still TENTATIVE

Continuous Stage + progressive battlefield
→ current direction

Phase 6 Spear / Defensive Cover / Objective
→ current authored design

Phase 7 Blue Charge / controlled Stun
→ current authored design / Blue roster still TENTATIVE

Phase 8 Wave / free-play graduation
→ current authored design

Detailed geometry / PVS numbers / exact copy / runtime choreography
→ supporting baseline

Main-game LOS role
→ PLANNED FUTURE REVIEW / DEFERRED CURRENT PRIORITY
```

The detailed authoritative supporting reference for current Tutorial choreography/validation assumptions remains:

`TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md`

### Status

**CURRENT CANONICAL TUTORIAL CONTEXT — v3.2**

---

# Part XII — Prototype-Originated Design Candidates

## 99. Death Marker

A Death Marker was planned as a relatively simple prototype feature that could visualize or record where the player previously died.

It is expected to be implemented in the prototype.

Whether it becomes part of the main Unity game depends on later discussion with UI/UX design.

### Status

- Prototype: **PLANNED**
- Main game: **OPEN / UIUX REVIEW CANDIDATE**

---

## 100. Run History / Run Notes

A player-facing run summary/history was planned for the prototype.

Potential information:

- run number;
- path taken;
- stages completed;
- rewards/buffs taken;
- Crystal gained;
- furthest progress;
- failure location;
- run result.

This is distinct from full internal telemetry.

Whether it becomes part of the main Unity game depends on later UI/UX discussion.

### Status

- Prototype: **PLANNED**
- Main game: **OPEN / UIUX REVIEW CANDIDATE**

---

# Part XIII — Open Design Questions

## Game Vision
- final wording/validation of Core Player Experience;
- final confirmation of the four Core Design Pillars after playtest.

## Combat
- exact Normal Attack AP cost if not retained at candidate 1 AP;
- exact Skill system;
- Skill resources/cooldowns/repeat restrictions;
- exact Hold effect;
- whether Hold is terminal or repeatable;
- whether Hold locks movement;
- final presence/removal of individual Wait;
- exact terminology for movement lock after Attack/Skill;
- AP handling when a contributing unit dies mid-Player-Turn;
- AP=0 behaviour during an already-paid reposition state;
- exact Unity movement-allowance measurement;
- exact StartGrid boundary detection in continuous movement;
- **planned future Tactical Space / LOS review** — final main-game role and exact LOS rule intentionally deferred from current priority;
- exact Status duration/tick convention.

## Units
- Trickster identity;
- Support identity;
- individual playable Skills;
- future playable units.

## Enemy
- exact combat-distance metric;
- deterministic final target/tile ordering;
- final Status vocabulary;
- Concealed reveal rule;
- final Attuned/Focused naming;
- Orange parameters;
- Purple parameters;
- Blue ATR / Charge / Stun duration;
- which special enemies enter Region 1;
- Mini-Boss design;
- Boss Pattern design;
- future enemy roles/variants.

## Encounter
- exact Protect Target design;
- exact Destroy Structure / Destroy Target targetability, durability, and destruction semantics;
- exact enemy-vs-Structure Target Rules / Objective overrides;
- exact multi-tile Structure targeting model;
- exact Mini-Boss encounter;
- exact Wave Victory Relevance rules;
- exact telegraph/spawn/first-activation lifecycle;
- emergency technical spawn fallback;
- multi-step/objective-progression authoring rules;
- future objective library;
- final Region 1 enemy compositions.

## Tutorial
- final production Tutorial Phase count;
- exact expanded Tutorial map dimensions/coordinates and progressive-region implementation shape;
- exact Phase 6 Spear scorer/geometry/tuning required for defensive Cover readability;
- exact Structure targetability/durability semantics used by the Tutorial Objective;
- exact Tutorial Stun duration after prototype validation;
- exact Blue Shockwave radius/metric and Blue durability/tuning;
- final use/non-use of Orange/Purple in later Tutorial/main-game onboarding;
- exact Wave spawn-to-first-activation lifecycle;
- Wave Telegraph information density;
- exact AP-sensitive task choreography;
- final Objective UI treatment across Objective completion / traversal / Phase transitions;
- final checkpoint/retry granularity;
- exact amount of Unity-control Flow Simulation required;
- movement-scouting/refund exploit/value;
- final combined-pressure/free-play tuning;
- main-game tutorial skip/replay/access policy;
- future LOS Tutorial treatment only after the planned main-game LOS review, if LOS remains relevant.

## Run
- recovery rules;
- rest-node behavior;
- unit defeat persistence;
- between-region recovery;
- resume unfinished active run;
- Town/Castle internal structure.

## Rewards
- reward occurrence probability;
- rarity model;
- reward repetition;
- reward stacking;
- stacking caps;
- unique-node reward behavior;
- reward content interacting with Shared AP / Status / Hold / positioning.

## Economy
- final Crystal conversion rate;
- defeat penalty or completion bonus;
- In-Run Shop design;
- exact full-game permanent-shop access/presentation;
- future permanent upgrade categories.

## Balancing
- exact definition/measurement of Current Player Capability;
- exact Stage Pressure scale;
- Difficulty Gap interpretation;
- Tactical Mastery measurement;
- pressure weights;
- final difficulty scale;
- rebalance of old Region 1 numerical values after new combat/enemy rules.

## Main Game UI/UX Candidates
- Death Marker;
- Run History / Run Notes;
- exact Intent icon language;
- target/status/state visual treatment;
- End Turn warning/confirmation;
- camera/control mapping.

# Part XIV — Superseded and Revised Legacy Design

## 101. TMTB / BeCan

**Old ambiguity:** `TMTB / BeCan` appeared as if both could be alternative game names.

**Current clarification:**
- TMTB = project/game code.
- BeCan = development group.

**Status:** CLARIFIED

---

## 102. Old Unit Activation / Exhaustion Model

**Old design:**

Reposition
→ one baseline action
→ unit Exhausted
→ all living units Exhausted
→ Enemy Phase

**Current design:**

Shared Player Turn
→ living units contribute Team AP
→ free switching/reselection
→ repeated Attack/Skill allowed if legal/AP sufficient
→ Attack/Skill locks further movement for that unit
→ global End Turn
→ Enemy Turn

**Status:** **SUPERSEDED**

---

## 103. Individual Wait as Turn-Completion Action

**Old:** Wait consumes the unit's baseline action and Exhausts the unit.

**Current:** Player Turn is ended globally through End Turn. Hold is a separate paid preparation action.

Final existence of an individual Wait command in another form remains open.

**Status:** **SUPERSEDED / LIKELY REMOVED**

---

## 104. Inactive / Exhausted Combat State

**Old:** acted units became Inactive/Exhausted for the remainder of Player Phase.

**Current:** acting does not remove the unit from the Player Turn. Attack/Skill only locks further movement under the core rule; other legal actions may remain possible.

**Status:** **SUPERSEDED**

---

## 105. `1 Unit = 1 Action = End Turn`

**Old wording:** one unit = one action = end turn.

**Current:** party-wide Shared AP with global End Turn.

**Status:** **SUPERSEDED**

---

## 106. Enemy Phase `All Move → All Attack`

**Old:** all living enemies moved, then all living enemies attempted attacks.

**Current:** enemies resolve sequentially by current Spawn Order, each with maximum one Movement Resolution and one Action Resolution.

**Status:** **SUPERSEDED**

---

## 107. Exact Enemy Path / Destination Preview

**Old direction/implementation possibility:** communicate exact movement outcome.

**Current:** show Current Intent / Target / relevant State/Status/threat area, but normally hide exact path and destination.

**Status:** **SUPERSEDED AS PLAYER-FACING DEFAULT**

---

## 108. Range Terminology

**Old:** Range

**Current:** ATR — Attack Range

**Status:** **SUPERSEDED**

---

## 109. Tile-by-Tile Movement as Full-Game Interpretation

**Old/prototype interpretation:** discrete grid movement.

**Current full-game design:** continuous free movement with tactical grid resolution/snap for combat.

**Status:** **CLARIFIED / PROTOTYPE SIMPLIFICATION**

---

## 110. Main Menu Shop

**Old:** hidden or milestone-unlocked Main Menu Shop.

**Current:** permanent progression remains tied to post-run/meta flow; exact final access presentation remains UI/UX open.

**Status:** **SUPERSEDED**

---

## 111. Region 1 as Full Run Boundary

**Prototype behavior:** Village completion currently may end the validation loop.

**Current full-game design:** one full run continues Village → Town → Castle.

**Status:** **CLARIFIED / DEVELOPMENT EXCEPTION**

---

## 112. Spear Enemy Removal from Stage 1

**Current interpretation:** Spear remains the intended basic ranged enemy. It was removed from the old Stage 1 onboarding baseline to reduce early complexity.

Its current authored Tutorial placement is now Phase 6, where it introduces basic ranged pressure and defensive Cover before Objective / Structure literacy. Exact stats, scorer, geometry, and tuning remain validation-dependent.

**Status:** **CARRIED / TUTORIAL PLACEMENT UPDATED**

---

## 113. Old Specific Stage 2–3 Encounter Drafts

Old detailed encounter drafts are no longer current Region 1 content plans.

Their underlying principles remain relevant:

- encounter diversity;
- enemy composition;
- objectives;
- Waves;
- map pressure;
- risk–reward.

**Status:** **HISTORICAL DESIGN SEEDS**

---

## 114. Primary / Alternative / 3×3 Spawn Fallback as Gameplay Rule

**Old candidate:** when spawn was blocked, search Primary → Alternative → local fallback area.

**Current:** telegraphed spawn position is reserved, passable, and non-occupiable as a final tile.

A technical emergency fallback may still exist, but it is not the intended player-facing solution.

**Status:** **SUPERSEDED AS PRIMARY GAMEPLAY DESIGN**

---

## 115. Purple Melee/Ranged Adaptive Immunity

**Old candidate:** first melee/ranged hit creates immunity to that attack category.

**Current:** first successful damaging Player Unit becomes the only unit able to damage Purple for the remainder of that Player Turn.

**Status:** **SUPERSEDED**

---

## 116. Blue Shockwave Knockback

**Old candidate:** Blue Shockwave displaces/knocks units back.

**Current:** Shockwave applies Stun; Immobilize is retained only as a fallback candidate if Stun proves too oppressive.

**Status:** **SUPERSEDED**

---

## 117. Old Tutorial Wait / Exhaustion Curriculum

**Old tutorial mental model:** use Wait / complete unit activation / Exhaust unit.

**Current:** teach Shared AP, party-wide Player Turn, position commitment, repeated actions, and global End Turn.

**Status:** **SUPERSEDED**

---

## 118. Old Orange Permanent Mobility After Buff

**Old candidate:** Orange could become generally mobile after completing its first Buff cycle.

**Current:** after Buff succeeds, Orange resets Charge and returns to stationary Charging at its current position.

**Status:** **SUPERSEDED**

## 119. Old Seven-Phase Current Tutorial Mapping

The previous current authored mapping that ended with Phase 6 Status/Temporal Threat and Phase 7 Incoming/Combined Pressure is no longer the active Tutorial baseline.

Current authored design uses an eight-Phase map so Spear/defensive Cover/Objective literacy has a dedicated dependency slot before Status/Charge and Wave graduation.

Status: **SUPERSEDED AS CURRENT TUTORIAL MAPPING**

---

## 120. Status-First / Exact First-Status-Source Current Tutorial Plan

The previous current Tutorial direction that required a separate Status-first lesson with the first Status source still OPEN is replaced for the current authored Tutorial.

Current Tutorial uses Blue candidate as the controlled validation vehicle:

```text
Charge
→ Shockwave
→ controlled Stun evidence
```

This supersession applies to Tutorial authoring only. It does not make Blue a locked Region 1 roster member or establish universal Stun timing.

Status: **SUPERSEDED FOR CURRENT TUTORIAL AUTHORING**

---

## 121. Whole-Stage Offset Courtyard Interpretation

The Offset Courtyard remains the preserved early Tutorial arena/Region for Phase 1–5, but it is no longer the intended whole-stage layout family for the complete Tutorial.

Current authored direction expands/reveals later battlefield regions while preserving the initial courtyard inside one continuous Stage.

Status: **SUPERSEDED AS WHOLE-TUTORIAL LAYOUT INTERPRETATION / CARRIED AS EARLY REGION**

---

## 122. Practice Target as Active Current Tutorial Candidate

A Practice Target remains a possible **PROTOTYPE ONLY** tool if a future validation problem requires a controlled target.

It is no longer part of the current authored Tutorial baseline and should not be treated as required Phase content.

Status: **SUPERSEDED AS ACTIVE CURRENT TUTORIAL CANDIDATE / HISTORICAL PROTOTYPE OPTION**

---

# Part XV — Design Carryover Registry

This registry exists to make preservation explicit. Older details that were not contradicted are intentionally retained.

| Design Concept | Current Status | Migration |
|---|---|---|
| TMTB project identity | LOCKED | Carried |
| BeCan as development group | LOCKED / clarified | Carried |
| 3D Turn-Based Tactics | LOCKED | Carried |
| Unity production context | LOCKED | Carried |
| Semi-Roguelite / Light Roguelite | LOCKED | Carried |
| Permanent meta progression | LOCKED | Carried |
| Main game ≠ 2D prototype | LOCKED distinction | Carried |
| Continuous 3D movement | LOCKED | Carried |
| Tactical grid combat resolution | LOCKED | Carried |
| Prototype direct grid movement | PROTOTYPE simplification | Carried |
| Core Player Experience | TENTATIVE canonical direction | Updated |
| Readable Threats | TENTATIVE pillar | Added |
| Shared Tactical Economy | TENTATIVE pillar | Added |
| Position Commitment | TENTATIVE pillar | Added |
| Adaptive Party Development | TENTATIVE pillar | Added |
| Village → Town → Castle | LOCKED | Carried |
| One full run spans all three regions | LOCKED | Carried |
| Region 1 temporary prototype settlement | DEVELOPMENT EXCEPTION | Carried |
| Region 1 Stage 1–4 branching structure | LOCKED direction | Carried |
| Route preview before commitment | LOCKED | Carried |
| Commit route on encounter start | LOCKED | Carried |
| Controlled randomization | PLANNED | Carried |
| `Trackback` item | Not canon | Historical example |
| Old one-action Exhaustion model | SUPERSEDED | Replaced by Shared AP |
| Shared Team AP | CURRENT DESIGN | Added |
| 2 AP contribution per living Player Unit | CURRENT DESIGN | Added |
| AP no carry | CURRENT DESIGN | Added |
| StartGrid | CURRENT DESIGN | Added |
| Leave StartGrid = movement AP commitment | CURRENT DESIGN | Added |
| Return-to-StartGrid refund | CURRENT DESIGN | Added |
| Movement scouting consequence | NEEDS PLAYTEST | Added |
| Attack/Skill movement lock | CURRENT DESIGN | Added |
| Repeated Attack/Skill | CURRENT DESIGN | Added |
| Global End Turn | CURRENT DESIGN | Added |
| Individual Wait → Exhaustion | SUPERSEDED | Replaced |
| Hold | CURRENT direction, details OPEN | Added |
| ATR terminology | LOCKED | Carried |
| Melee path obstacle interaction | LOCKED | Carried |
| Main-game LOS role / universal ranged LOS rule | PLANNED FUTURE REVIEW / DEFERRED CURRENT PRIORITY | v3.1 universal rule placed on hold pending dedicated review |
| LOS / Cover conceptual separation | CARRIED CONCEPTUALLY; LOS final role deferred | Cover remains independently current |
| Cover system | LOCKED | Carried/clarified |
| O30 / O70 values | TENTATIVE | Carried |
| Full Cover targetability | LOCKED current design | Carried/clarified |
| Target Validity vs Effectiveness | LOCKED principle | Expanded |
| Current damage formula | TENTATIVE | Carried |
| Player Stun definition | CURRENT DESIGN | Added |
| Guard | PLANNED playable / validated baseline | Carried |
| Archer | PLANNED playable / validated baseline | Carried |
| Trickster | PLANNED / deferred | Carried |
| Support | PLANNED / deferred | Carried |
| Guard numerical stats | TENTATIVE | Carried |
| Archer numerical stats | TENTATIVE | Carried |
| Enemy as pressure source | CORE PRINCIPLE | Expanded |
| Systemic counterplay | STRONG direction | Added |
| Role-consistent enemy AI | TENTATIVE strong direction | Added |
| Sword Enemy | Basic melee | Carried/expanded |
| Spear Enemy | Basic ranged; current Tutorial placement Phase 6 | Updated |
| Dynamic Intent | CURRENT DESIGN | Added |
| Current Target | CURRENT DESIGN | Added |
| Exact enemy path/destination preview | SUPERSEDED default | Replaced |
| Sequential enemy activation | CURRENT DESIGN | Added |
| Spawn Order execution | CURRENT DESIGN | Added |
| Enemy max 1 Move + 1 Action | CURRENT DESIGN | Added |
| Enemy State grammar | TENTATIVE | Added |
| Enemy Status system | STRONG direction | Added |
| Conditional Override | TENTATIVE/current framework | Added |
| Enemy Pattern | CURRENT direction | Added |
| Deterministic Pattern default | TENTATIVE | Added |
| Pattern hidden by default | CURRENT DESIGN | Added |
| Charge countdown as current behaviour progress | CURRENT DESIGN | Added |
| Orange Charger Buffer | TENTATIVE candidate | Added |
| Purple Charger Debuffer | TENTATIVE candidate | Added |
| Blue Shockwave Charger | TENTATIVE candidate | Added |
| Old Purple melee/ranged immunity | SUPERSEDED | Replaced |
| Old Blue knockback | SUPERSEDED | Replaced |
| Heavy / Fast / Support enemy roles | Deferred design space | Carried |
| Region 1 Mini-Boss climax | LOCKED direction | Carried |
| Eliminate All | Core objective | Carried |
| Protect Target | PLANNED CORE | Carried |
| Destroy Structure / Destroy Target | PLANNED CORE | Added from 16 Aug structure-objective direction |
| Structures with tactical/objective roles beyond Cover | CURRENT INTENDED DIRECTION | Added |
| Defeat Mini-Boss | PLANNED | Carried |
| Survive Turns | PLANNED design space | Carried |
| Reach Exit | PLANNED design space | Carried |
| Activate Points | PLANNED design space | Carried |
| Escort Target | PLANNED design space | Carried |
| Hold Position | PLANNED design space | Carried |
| Trigger framework | PLANNED/current framework | Expanded |
| Stage / Phase / Task / Objective / Wave distinction | CURRENT framework | Added/clarified |
| Multiple Waves per Stage | CURRENT direction | Added |
| Required / Conditional / Punishment Wave roles | TENTATIVE taxonomy | Carried/updated |
| One-turn Wave Telegraph | CURRENT direction | Added |
| Reserved passable/non-occupiable spawn tile | CURRENT DESIGN | Added |
| Old spawn fallback gameplay system | SUPERSEDED | Replaced |
| Spawn with readable Intent | CURRENT direction | Added |
| Immediate attack on spawn | NOT current direction | Clarified |
| Exact spawn lifecycle | OPEN | Preserved |
| Multi-step encounter | OPEN/deferred | Carried |
| Old Stage 2–3 specific drafts | Historical | Carried as seeds |
| HP Carry | LOCKED direction | Carried |
| Recovery | OPEN/deferred | Carried |
| Unit defeat persistence | OPEN | Carried |
| Temporary reward durations | PLANNED | Carried |
| Reward impact model | Working | Carried |
| Reward stacking | OPEN | Carried |
| Run Crystal | LOCKED concept | Carried |
| Meta Crystal | LOCKED concept | Carried |
| 100% Crystal conversion | TENTATIVE | Carried |
| Old Main Menu Shop | SUPERSEDED | Carried as history |
| Permanent progression shop/service | Current direction | Clarified |
| Prototype Run Overview Shop access | PROTOTYPE CURRENT FLOW | Reclassified |
| In-Run Shop | OPEN | Carried |
| Permanent upgrades | LOCKED concept | Carried |
| HP / ATK / DEF upgrade foundation | LOCKED direction | Carried |
| Current Player Capability | Working framework | Carried |
| Stage Pressure | Core balancing principle | Carried |
| Enemy Pressure | Working framework | Expanded |
| Map Pressure | Working framework | Carried |
| Wave Pressure | Working framework | Expanded |
| Objective / Phase Pressure | Working framework | Carried |
| Difficulty Gap | Working model | Carried |
| Difficulty Scale | TENTATIVE working | Carried |
| Stage Node Difficulty Template | Canonical design tool | Updated |
| Temporary Buff Impact Rating | Working model | Carried |
| Permanent Upgrade Growth Rating | Working model | Carried |
| Tactical Mastery | Open measurement model | Expanded conceptually |
| Predicted / Observed / Perceived | Working evaluation framework | Carried |
| Battle metrics | Candidate metrics | Expanded |
| Run metrics | Candidate metrics | Carried |
| Player feedback dimensions | Candidate dimensions | Carried |
| Telemetry | Evaluation tool | Carried/reclassified |
| Debug Balancing UI | PROTOTYPE tool | Excluded from game canon |
| Auto-simulation | Optional evaluation tool | Carried |
| Progressive tutorial philosophy | Current strong direction | Updated |
| Old Wait/Exhaustion tutorial | SUPERSEDED | Replaced |
| Tutorial Flow Step / Learning Block / Phase distinction | CURRENT framework | Added |
| Prototype representation types | CURRENT direction | Added |
| Camera / Unity-control Flow Simulation | CURRENT prototype-flow direction | Added |
| Unit Selection / Switching onboarding | Required topic | Carried/expanded |
| Shared AP tutorial | Required topic | Carried |
| StartGrid/refund tutorial | Required topic | Carried |
| Attack position-commitment tutorial | Required topic | Carried |
| Intent / Current Target tutorial | Required topic | Carried/expanded |
| Dynamic Intent tutorial | Required topic | Carried |
| Practice Target | PROTOTYPE ONLY historical option; not current authored baseline | Reclassified |
| Status tutorial concept | Required advanced concept; current Phase 7 vehicle Blue candidate | Updated |
| Stun as current Tutorial Status example | CURRENT TUTORIAL DIRECTION; exact duration PVS TENTATIVE | Updated |
| Exact first Status source | SUPERSEDED as current Tutorial blocker; Blue candidate is current vehicle | Updated |
| Status-first → Charge current Tutorial order | SUPERSEDED | Replaced by Blue Charge → Shockwave → controlled Stun evidence |
| Blue Charge → Shockwave → controlled Stun Tutorial vehicle | CURRENT TUTORIAL PVS; Blue roster TENTATIVE | Updated |
| Wave Telegraph tutorial | Advanced topic | Updated |
| Tutorial Wave lifecycle/composition specifics | TENTATIVE PVS / SUPPORTING | Reclassified |
| One continuous Tutorial Stage | LOCKED CURRENT TUTORIAL DIRECTION | Strengthened |
| Offset Courtyard | Preserved early Phase 1–5 region; whole-stage interpretation superseded | Updated |
| Progressive Tutorial battlefield reveal/unlock | CURRENT AUTHORED DIRECTION | Added |
| Eight-Phase current authored Tutorial baseline | CURRENT WORKING BASELINE; final count TENTATIVE | Replaces seven-Phase map |
| Seven-Phase current Tutorial mapping | SUPERSEDED | Replaced |
| Hold tutorial | Deferred pending rules | Carried |
| Run onboarding | Separate curriculum layer | Carried |
| Death Marker | Prototype planned / main game open | Carried |
| Run History | Prototype planned / main game open | Carried |

# Part XVI — Source-of-Truth Use

For **game-design intent**:

1. Latest explicit Game Designer decision.
2. This latest `TMTB_GAME_DESIGN_CONTEXT`.
3. Latest `TMTB_GAME_DESIGN_DECISIONS`.
4. Domain handoffs / historical game-design documents when they contain detail not yet migrated.

For **prototype implementation truth**:

1. Actual source code and data.
2. Confirmed runtime testing.
3. Latest `TMTB_CURRENT_STATE`.
4. Architecture/state/handoff documents describing the implemented prototype.

If design and implementation conflict:

- do not silently choose one;
- state the conflict;
- treat this document as design intent;
- audit actual source/runtime before making implementation claims;
- update implementation documents only after the prototype actually changes.

A prototype implementation that conflicts with Game Design Context may represent:

- a development limitation;
- a validation simplification;
- an implementation bug;
- an intentionally deferred feature;
- or an undocumented design change that needs explicit Game Designer confirmation.

---

# Part XVII — Maintenance Rule

This is a living canonical game-design document.

Version 3.2 performs the targeted migration of the reviewed 16 August Tutorial/Objectives baseline into canonical context. It updates current Tutorial architecture and orchestration, Structure/Objective direction, Spear placement, Blue/Status/Charge Tutorial role, Wave/graduation direction, and Tutorial casualty policy while intentionally leaving exact choreography, map coordinates, PVS values, and implementation truth in supporting/implementation-facing documentation. The 18 August LOS decision is deliberately a hold: a future Tactical Space / LOS review is planned, while no new universal LOS rule is made in this revision.

Update it when:

- the Game Designer explicitly changes a canonical game rule;
- an `OPEN` design question becomes decided;
- a `TENTATIVE` direction is promoted, revised, or abandoned;
- a planned feature is intentionally removed;
- a prototype experiment produces a main-game design decision;
- enemy/encounter/tutorial design materially evolves;
- full-game progression changes;
- balancing/evaluation frameworks materially evolve;
- a legacy design is rediscovered and confirmed as relevant.

Do **not** update it merely because:

- a prototype function is refactored;
- a file path changes;
- an implementation algorithm changes;
- a temporary prototype shortcut is introduced;
- a feature exists in prototype code without explicit design adoption.

When migrating from a working handoff:

1. preserve the status of each decision;
2. do not promote `TENTATIVE` values to `LOCKED`;
3. preserve still-valid older details;
4. explicitly record important superseded rules;
5. keep prototype-only navigation/technical behaviour out of full-game canon unless adopted.

---

# Part XVIII — Post-Migration Documentation Boundary

Version 3.2 completes the targeted canonical migration of the reviewed 16 August Tutorial/Objectives baseline.

Canonical recovery should now be able to identify:

```text
current Shared AP / StartGrid / position-commitment combat direction
current enemy readability / sequential-activation direction
current 8-Phase authored Tutorial baseline
Tutorial LOS deferral + future main-game LOS review
Structure / Destroy Objective direction
Phase 6 Spear / Defensive Cover / Objective role
Phase 7 Blue Charge / controlled Stun Tutorial role
Phase 8 Wave / graduation / free-play direction
Tutorial casualty boundary
```

Detailed Tutorial choreography, coordinates, PVS values, candidate Wave composition/timing, and validation-specific state remain owned by:

`TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md`

Prototype implementation truth and implementation resume planning must be recovered from actual source/runtime and implementation-facing documentation, not from this Game Design Context.

LOS/Tactical Space review remains **planned for a future design checkpoint** and is not a current blocker for Tutorial Phase 6–8 design/implementation work.


## Final Principle

**TMTB is the game.**

**The prototype is a Game Designer validation tool and a functional Unity flow reference.**

The purpose of this document is to keep the full-game design visible, coherent, and portable even while prototype implementation, simulated Unity-only flow, research methods, balancing assumptions, and development scope continue to evolve.

**Latest explicit Game Designer decisions override this document when a later conflict exists.**
