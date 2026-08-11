# TMTB Game Design Context

**Document Type:** Canonical Living Game Design Context
**Project / Game Code:** TMTB
**Development Group:** BeCan
**Primary Game:** 3D Turn-Based Tactics
**Target Production Environment:** Unity
**Version:** 3.1
**Last Updated:** 11 August 2026
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
- explicit Game Designer decisions made after those documents;
- the six-batch Game Design Migration Audit completed on 9 August 2026;
- the Tutorial T1–T3 / Prototype Validation Scope correction pass completed on 11 August 2026.

This v3.1 document carries forward the v3.0 migration and deliberately migrates the later corrected tutorial/prototype-flow direction while preserving older design details that were not superseded.

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

## 28B. Ranged Attack, Line of Sight, and Cover

All **ranged attacks** in TMTB require Line of Sight.

`LOS ≠ Cover`

LOS answers whether the attack line is legally available.

Cover modifies the result/effectiveness of an otherwise targetable interaction.

A target behind Cover may remain targetable.

Clear path
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

- All ranged attacks require LOS: **LATEST DESIGN DECISION**
- Cover does not automatically cancel targetability: **LOCKED / RECONFIRMED**
- Full Cover may produce 0 baseline damage while target remains targetable: **LOCKED CURRENT DESIGN**
- Exact LOS implementation: **OPEN IMPLEMENTATION DETAIL**

---

## 28C. Range-Limited Non-Attack Abilities

The universal LOS rule applies to **ranged attacks**, not automatically to every action with a range.

Each non-attack ability defines its own:

- range requirement;
- LOS requirement;
- Cover interaction;
- target type;
- effect.

Confirmed special-enemy examples:

Orange Buff
→ range-limited
→ LOS not required
→ Cover ignored

Purple Vulnerable Curse
→ range-limited
→ LOS not required
→ Cover ignored

### Status

**LATEST DESIGN DECISION / ACTION-GRAMMAR PRINCIPLE**

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

1. find a valid/effective firing position;
2. prefer a position closest to maximum effective ATR;
3. prefer less movement when otherwise tied;
4. use deterministic stable ordering if still tied.

**Action**

Maximum one Basic Ranged Attack.

Ranged Attack requires LOS.

If current attack would produce no relevant effect and a better effective firing position is unavailable:

- do not waste the action;
- End Activation.

**Pattern**
None.

### Status

- Basic ranged identity: **PLANNED / CURRENT ROSTER DIRECTION**
- Behaviour package: **CURRENT DESIGN DIRECTION**
- Historical removal from old Stage 1 onboarding: **CARRIED, TUTORIAL PLACEMENT REQUIRES NEW CURRICULUM DECISION**
- Exact numerical stats: **TENTATIVE / OPEN**

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
- exact LOS implementation;
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

### Core / Currently Intended

#### Eliminate All

Defeat all required enemies.

Status: **LOCKED CORE OBJECTIVE / VALIDATED**

#### Protect Target

Keep a designated protected target alive while satisfying encounter requirements.

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

Tutorial and onboarding should introduce systems progressively.

Preferred learning progression:

```text
Introduce
→ Demonstrate
→ Require Player Use
→ Confirm Understanding Through Gameplay
→ Add Pressure
→ Combine With Earlier Knowledge
```

The tutorial should increasingly resemble normal TMTB play rather than remain a sequence of isolated button prompts.

Important principles:

- teach observable player rules rather than internal designer/programmer grammar;
- one mechanic explanation/button press is not automatically evidence of understanding;
- earlier knowledge should persist and be reinforced instead of repeatedly reset;
- good/legal tactical play should not be treated as tutorial failure;
- when observable learning evidence has already occurred, retroactive credit is preferable to forcing meaningless repetition;
- instructional flow may adapt, but normal combat rules must not secretly change to make the tutorial script work.

### Status

**STRONG CURRENT TUTORIAL PRINCIPLE**

---

## 97. Tutorial Structure Vocabulary

Tutorial authoring should distinguish:

**Tutorial Flow Step**
An intended onboarding action/beat. A Flow Step may represent either a real prototype mechanic or a simulated Unity-facing step.

**Learning Block**
A mental-model / knowledge cluster that the tutorial wants the player to build.

**Stage**
The complete tutorial encounter/level.

**Phase**
A major authored section of tutorial progression.

**Tutorial Task**
The current instructional requirement.

**Objective**
The gameplay goal.

**Wave**
A triggered group of enemies/threats.

These concepts are not interchangeable.

A Tutorial Flow Step can occur inside a Learning Block and Phase. A Tutorial Task may cause a Phase transition or content trigger. A Wave is encounter content, not a synonym for Phase or Objective.

### Status

**CURRENT DESIGN FRAMEWORK**

---

## 98. Control Knowledge vs Tactical Knowledge

Main-game onboarding contains two broad knowledge families.

### Control Knowledge

Examples:

- camera navigation;
- unit selection;
- switching controlled unit;
- character movement;
- action-interface access;
- confirm/cancel interaction.

Exact control mapping belongs to UI/UX and implementation.

### Tactical Knowledge

Examples:

- Player Turn / Enemy Turn;
- Shared AP;
- StartGrid;
- movement commitment/refund;
- Attack/Skill position commitment;
- End Turn;
- ATR;
- LOS;
- Cover;
- Intent;
- Status;
- Charge / multi-activation threat;
- Wave Telegraph.

The 2D prototype can validate systemic tactical teaching more directly than final 3D control feel.

However, required Control Knowledge must still remain visible in the intended prototype flow when it is important for Unity onboarding.

### Status

**CURRENT TUTORIAL DESIGN DISTINCTION**

---

## 98A. Prototype Representation Types

Every important tutorial knowledge/flow item should declare how the prototype represents it.

### REAL SYSTEM VALIDATION

The prototype actually runs the gameplay rule.

Use when incorrect implementation would invalidate the design test.

Examples:

- Unit Selection / Switching;
- tactical Movement;
- Player/Enemy Turn;
- Shared AP;
- StartGrid/refund;
- End Turn;
- Attack / Position Commitment;
- ATR;
- LOS;
- Cover;
- Intent / Current Target / Dynamic Intent;
- Status;
- Charge;
- Wave Telegraph.

Learning evidence may progress through:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

### FLOW SIMULATION

The intended Unity step remains present in the prototype flow, but the final mechanic is not reproduced.

Current examples:

- camera navigation;
- final 3D camera orientation/control beats;
- continuous Unity locomotion-control introduction.

Prototype representation may be:

```text
instruction
→ simulated input / confirmation
→ completion feedback
→ next flow step
```

Flow Simulation validates intended sequence/reference, not final control feel or mechanic mastery.

By default, Flow Simulation must not silently mutate authoritative combat state such as:

- Team AP;
- StartGrid;
- tactical position;
- HP;
- Status;
- enemy state;
- Combat Turn;
- Wave state.

### DEFERRED / NOT READY

The rule/content is not sufficiently designed to teach accurately.

Current examples:

- detailed Hold lesson;
- detailed individual Skill lesson.

Do not invent a fake mechanic merely to fill a tutorial slot.

### Status

**CURRENT PROTOTYPE TUTORIAL / VALIDATION PRINCIPLE**

---

## 98B. Required Foundation Topics

Current required onboarding foundation includes:

```text
Camera / Control
→ Unit Selection
→ Unit Switching
→ Movement
```

followed by the tactical turn foundation.

Camera/navigation and final 3D locomotion may use **FLOW SIMULATION** in the web prototype.

Unit Selection / Switching and tactical rules should use real-system behaviour where they are being validated.

Important mental model:

> **The Player Turn belongs to the whole party, not one unit activation.**

### Status

**REQUIRED ONBOARDING FOUNDATION**

---

## 98C. Shared AP and Movement Commitment Tutorial

Core topics:

1. living Player Units contribute to one Team AP pool;
2. current baseline contribution = 2 AP per living unit;
3. AP is shared rather than owned by individual units;
4. tactical movement uses the unit's movement allowance;
5. leaving StartGrid spends movement commitment AP;
6. returning to StartGrid before Attack/Skill and before movement lock can refund that movement AP;
7. End Turn discards remaining AP.

The tutorial should visually demonstrate actual AP changes rather than rely only on explanation.

Example:

```text
Guard + Archer
→ 4 AP
→ Guard leaves StartGrid
→ 3 AP
→ Guard returns before commitment
→ 4 AP
```

Do not teach unresolved edge cases such as mid-turn death AP handling as tutorial rules.

### Status

**CORE TUTORIAL TOPIC**

---

## 98D. Attack, Position Commitment, and Repeated Action

Attack tutorial should communicate:

- target selection;
- AP consumption;
- damage resolution;
- Attack/Skill locks further Movement for the acting unit;
- the unit is **not** Exhausted merely because it attacked;
- the unit remains selectable;
- if AP and action-specific legality remain, repeated actions may still be possible;
- another party member may use the same remaining Shared AP pool.

Repeated Action may be demonstrated through gameplay rather than a dedicated explanatory popup.

Example:

```text
Guard attacks
→ Movement becomes unavailable
→ Guard remains selectable
→ Guard may Attack again if AP/rules allow
```

### Status

**CORE TUTORIAL TOPIC**

---

## 98E. End Turn and First Enemy Turn

End Turn must be explicitly taught because the Player Turn no longer ends through unit Exhaustion.

```text
END TURN
→ discard remaining AP
→ Enemy Turn
```

A simple readable Enemy Turn should be experienced before advanced enemy systems are combined.

Sword remains the strongest current candidate for the first basic enemy lesson because its normal behaviour is simpler than the special-enemy candidates.

Current tutorial-stage working direction:

- the first Sword may arrive as scripted/tutorial content;
- this first arrival is **not** automatically the Wave Telegraph lesson;
- it should receive readable Intent;
- it should receive at least one normal readable activation before the first Attack lesson where practical.

### Status

- End Turn: **CORE TUTORIAL TOPIC**
- Sword as first basic enemy lesson: **TENTATIVE — STRONG WORKING DIRECTION / NOT ROSTER LOCK**

---

## 98F. ATR, Melee, Ranged, LOS, and Cover

The tutorial should establish:

```text
Movement Range ≠ ATR
```

ATR is Attack Range.

Current learning dependency:

```text
Melee / ATR basics
→ Archer / ranged combat
→ ranged ATR
→ LOS
→ Cover
```

LOS and Cover must not be taught as the same concept.

Player-facing understanding:

- a target may be inside ATR but fail ranged LOS;
- a target behind Cover may remain targetable;
- Cover modifies effectiveness rather than automatically removing targetability;
- Full Cover may reduce baseline damage to 0.

Internal terms such as `Action Validity` and `Action Effectiveness` do not need to be player-facing tutorial vocabulary.

### Practice Target Candidate

A stationary training object is a strong current tutorial/prototype candidate for controlled ATR/LOS/Cover teaching.

Desired characteristics:

- clearly identified as a training object;
- stationary by identity rather than a frozen normal enemy;
- no normal AI/Intent;
- uses the real ATR / LOS / Cover / damage rules;
- not counted as a normal hostile Victory requirement.

Its purpose is to preserve normal enemy grammar while allowing stable tactical-geometry teaching.

### Status

- ATR / Ranged / LOS / Cover onboarding: **CORE / REQUIRED**
- Practice Target: **PROTOTYPE ONLY / TUTORIAL TRAINING OBJECT CANDIDATE**

---

## 98G. Enemy Intent, Current Target, and Dynamic Intent

Enemy Intent is a required core tutorial topic.

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

Intent must represent actual enemy behaviour state/rules rather than tutorial-only text.

Current Target should come from the enemy's real Target Rule.

The tutorial should teach Intent before Dynamic Intent.

### Dynamic Intent

Later:

```text
relevant player position/state changes
→ enemy Current Target / Intent changes when its normal rules require it
```

The player should learn:

> Intent is the enemy's current readable plan, not a permanent target lock.

The tutorial should not teach exact future path/destination or hidden Pattern as normal Intent information.

### Status

- Intent: **CORE TUTORIAL TOPIC**
- Current Target: **CORE TUTORIAL TOPIC**
- Dynamic Intent: **INTERMEDIATE / ADVANCED CORE TOPIC**

---

## 98H. Status Onboarding

The tutorial should communicate that a **Status** can change a unit's capability or interaction.

A Status lesson should use a concrete Status that genuinely belongs to the chosen content.

Current strongest candidate:

```text
STUN
```

Current Player Stun rules provide useful party-resource learning because the Stunned unit:

- cannot Move;
- cannot Normal Attack;
- cannot Skill;
- cannot Hold;
- remains selectable;
- continues contributing to Shared Team AP.

This can teach that Shared AP remains a party resource even when one unit temporarily cannot use its normal actions.

### Current blocker

```text
Exact first Status teaching source = OPEN
```

Blue remains a possible source/application vehicle, but Blue itself is not locked tutorial/Region 1 roster content.

### Status

- Status concept: **REQUIRED ADVANCED CONCEPT**
- Stun as first concrete example: **TENTATIVE STRONG CANDIDATE**
- Exact first Status source: **OPEN**
- Blue as first source: **TENTATIVE / OPEN ALTERNATIVE**

---

## 98I. Charge / Multi-Activation Threat Onboarding

The corrected curriculum baseline teaches Status before Charge.

Current dependency:

```text
Status
→ Charge / temporal threat
→ special-enemy application if selected
```

Player-facing Charge knowledge:

- `CHARGE X/Y` shows progress of the **current** behaviour;
- progress advances only when relevant Charge activations succeed;
- `CHARGE X/X` remains Charge and does not automatically preview the next payoff;
- payoff becomes visible when it becomes Current Intent;
- Charge creates a preparation/planning horizon.

The tutorial does not need to teach internal terms such as `Pattern Advance Rule`.

### Blue candidate routes

**Route A — Current Working Baseline**

```text
Status known
→ Charge known
→ Blue combines them as competence application
```

**Route B — OPEN Alternative**

```text
Blue introduces Charge
→ payoff introduces first Stun
```

Route B is content-efficient but risks combining too many new concepts and may fail to demonstrate Stun consequence when good play avoids the payoff.

### Status

- Charge: **ADVANCED CORE ENEMY LESSON**
- Status → Charge ordering: **TENTATIVE — CURRENT CORRECTED CURRICULUM BASELINE**
- Blue combined application: **TENTATIVE CANDIDATE**
- Blue Charge-first → first Stun: **OPEN ALTERNATIVE**

---

## 98J. Wave Telegraph Onboarding

Wave Telegraph is an advanced culmination of readable current pressure plus incoming pressure.

Player-facing knowledge:

- an enemy will arrive from the telegraphed position;
- the reserved spawn position may be traversed;
- neither side may end movement on the reserved position;
- telegraph provides a preparation opportunity;
- after spawning, the enemy returns to the normal Intent language.

Current canonical direction:

```text
Telegraph
→ one Player preparation window
→ Spawn
```

Spawn itself is not an attached immediate offensive Move/Attack event.

Exact time from Spawn to first normal activation remains **OPEN**.

### Prototype timing experiments

Potential validation variants include:

**W1 — Safe**

```text
Telegraph
→ preparation
→ Spawn
→ no early first activation
→ later activation
```

**W2 — Tight**

```text
Telegraph
→ preparation
→ Spawn
→ earlier normal activation eligibility
```

These are **PROTOTYPE VALIDATION VARIANTS**, not canonical lifecycle rules.

For a first tutorial Wave, a known enemy such as Sword is the preferred working hypothesis so the new lesson is incoming-pressure planning rather than a new enemy grammar.

### Status

- Wave Telegraph: **ADVANCED TUTORIAL TOPIC**
- Reserved-position rule: **CURRENT DESIGN**
- Exact spawn-to-first-activation lifecycle: **OPEN**
- W1 / W2: **PROTOTYPE VALIDATION VARIANTS**
- Known Sword as first tutorial Wave content: **STRONG WORKING HYPOTHESIS / NOT LOCKED**

---

## 98K. Hold and Skill Onboarding

### Hold

Hold remains part of current combat direction, but its exact effect, terminal behaviour, movement-lock interaction, duration, and repeatability are not finalized.

Therefore:

```text
Hold detailed tutorial
→ DEFERRED / NOT READY
```

### Skill

Skill is a planned action category, but individual player Skills are not sufficiently finalized for a canonical detailed tutorial task.

Therefore:

```text
Skill detailed tutorial
→ PLANNED SLOT / CONTENT OPEN
```

Do not create fake Hold/Skill rules merely to complete the tutorial sequence.

---

## 98L. Combat Onboarding vs Run Onboarding

The tutorial should not force all roguelite/meta systems into the first combat lesson.

### Combat Onboarding

Focus:

- controls / orientation;
- party selection/switching;
- Player/Enemy Turn;
- Shared AP;
- StartGrid / tactical movement commitment;
- actions;
- positioning;
- ATR / LOS / Cover;
- Intent / Dynamic Intent;
- Status;
- Charge / temporal threat;
- later Wave pressure.

### Run Onboarding

Can be introduced after basic combat is understood:

- battle result;
- HP carry / attrition;
- reward selection;
- route preview;
- route commitment;
- risk–reward;
- Run Crystal;
- later settlement/meta progression.

Meta Crystal and permanent progression may be introduced when the player reaches the relevant run-resolution context.

### Status

**STRONG CURRENT TUTORIAL STRUCTURE DIRECTION**

---

## 98M. Tutorial Learning Blocks

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

Camera / Unity control flow is a foundation around the first block rather than necessarily an eighth Learning Block.

Current mental-model progression:

1. **I control a party during one shared Player Turn.**
2. **The party shares AP and movement is a reversible commitment until I commit position.**
3. **Attacking commits position, not the entire unit.**
4. **Attack space depends on ATR, LOS, and Cover.**
5. **Enemy threats are readable and can change with battle state.**
6. **Conditions and delayed threats change how I allocate party resources.**
7. **I can plan around current pressure and incoming pressure together.**

### Status

**CURRENT WORKING CURRICULUM ARCHITECTURE**

---

## 98N. Tutorial Knowledge Dependency Map

Current conceptual dependency map:

```text
Camera / Control
→ Unit Selection
→ Unit Switching
→ Movement
```

then:

```text
Player Turn / Enemy Turn
→ Shared AP
→ StartGrid / Movement Commitment
→ Movement Refund
→ End Turn
```

then:

```text
Attack
→ Position Commitment
→ Repeated Action
→ Target Selection
→ Damage
→ ATR
```

then:

```text
Archer / Ranged Combat
→ LOS
→ Cover
```

then:

```text
Enemy Intent
→ Current Target
→ Dynamic Intent
→ threat response
```

then:

```text
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

This is a **knowledge dependency map**, not the final count/order of tutorial Phases.

---

## 98O. Current Tutorial Stage Working Direction

Current working direction is:

```text
ONE continuous Tutorial Stage / Level
```

The intended experience is one evolving tactical battlefield rather than isolated tutorial rooms.

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

### Important Phase 1 correction

Phase 1 now includes important Unity-facing control/orientation beats through **FLOW SIMULATION**, while Unit Selection/Switching use real prototype interaction.

Actual tactical Movement consequences begin only when Shared AP and StartGrid are active in Phase 2.

Flow-simulated movement/control beats in Phase 1 must not silently spend AP or change authoritative tactical position.

### Phase count

Seven is a working candidate, not a locked architecture.

Phase 6 may split if Status + Charge creates excessive cognitive load.

### Status

- One continuous Tutorial Stage: **TENTATIVE — STRONG WORKING DIRECTION**
- Seven-Phase structure: **TENTATIVE WORKING STRUCTURE**
- Phase 1 Control & Party Orientation: **TENTATIVE — CURRENT WORKING DIRECTION**
- Exact Phase count: **OPEN / VALIDATION-DEPENDENT**

### Current Tutorial Layout Family

Current primary working layout family:

```text
Offset Courtyard
```

Its purpose is to support one continuous Tutorial Stage with evolving tactical geometry rather than isolated tutorial rooms.

Current status:

- Offset Courtyard: **TENTATIVE — PRIMARY WORKING LAYOUT FAMILY**
- Exact grid dimensions / coordinates: **TENTATIVE / NOT LOCKED**
- Exact ATR / LOS / Cover teaching geometry: **OPEN / VALIDATION-DEPENDENT**
- Alternative layout geometry may be used if actual prototype validation shows the working family does not produce the intended learning evidence.

Detailed candidate coordinates and paper-layout reasoning remain in the supporting Tutorial Design Corrected Handoff rather than this canonical context.

---

## 98P. Tutorial State Continuity and Trigger Principles

Current state-continuity direction:

1. Phase transition does not automatically refresh AP.
2. Phase transition does not automatically refresh StartGrid.
3. Phase transition does not auto-heal.
4. Phase transition does not auto-clear Status.
5. Tactical position persists by default.
6. Avoid teleport/reset unless the design explicitly requires it.
7. Early pressure may clear naturally.
8. Late pressure should increasingly compose rather than reset.
9. Reinforcement is preferred over battlefield reset.
10. Instructional transition may occur mid-turn.
11. Major battlefield/content transitions should prefer natural combat boundaries.
12. Every Phase should have an Entry/Exit State Contract.
13. Phase exit should create a state compatible with the next Phase.
14. Tutorial rules must not contradict normal combat rules.
15. Flow Simulation must not silently mutate authoritative combat state.
16. Simulated flow completion must not be recorded as mechanic mastery.

Preferred trigger categories:

```text
Learning Evidence Trigger
Combat-Boundary Trigger
Content Trigger
Completion Trigger
Flow-Simulation Completion Trigger
```

Exact-tile triggers should be used only when position itself is the learning objective.

### Status

**CURRENT TUTORIAL AUTHORING DIRECTION**

---

## 98Q. Tutorial Learning Evidence

For **REAL SYSTEM VALIDATION**:

```text
EXPOSE
→ GUIDED USE
→ UNASSISTED CONFIRMATION
→ COMBINED TRANSFER
```

The minimum desired exit evidence for an important taught mechanic is generally an unassisted confirmation, with later combined transfer used where practical.

For **FLOW SIMULATION**:

```text
FLOW EXPOSURE
→ SIMULATED COMPLETION
```

Example:

```text
"Move camera left"
→ simulated completion
```

means:

```text
the intended Unity onboarding step was represented
```

not:

```text
camera-control mastery was validated
```

For authoring:

```text
Tutorial Flow Completion
≠
Learning Confirmation
```

### Status

**CURRENT PROTOTYPE TUTORIAL EVALUATION FRAMEWORK**

---

## 98R. Good Play Must Not Break the Tutorial

A correct or strong tactical response should not be treated as tutorial failure merely because it occurs earlier or differently from the script.

Examples:

- player kills an enemy earlier than expected;
- player changes Dynamic Intent before the prompt;
- player finds a legal firing position immediately;
- player avoids a Status threat;
- player eliminates current pressure before a Wave arrives.

Where learning evidence is already observable, retroactive credit is preferred.

Likewise, legal but suboptimal play can be used as consequence-based teaching rather than hard failure where appropriate.

Example:

```text
legal Full-Cover shot
→ 0 damage
→ AP still consumed
```

may teach Cover consequence while the tutorial later still requires a meaningful ranged confirmation.

### Status

**CURRENT TUTORIAL AUTHORING PRINCIPLE**

---

## 98S. Prototype Validation Scope for Tutorial

The corrected tutorial prototype has two explicit functions:

```text
A. Game Design Validation Tool
B. Unity Functional Flow Reference
```

The prototype should model the following categories accurately when they are under validation:

- Shared AP;
- StartGrid/refund;
- Attack movement lock without Exhaustion;
- repeated/cross-unit AP usage;
- ATR / LOS / Cover distinction;
- actual Intent / Current Target;
- Dynamic Intent;
- sequential enemy activation;
- Spawn Order as the baseline internal execution order;
- maximum 1 Movement + 1 Action per baseline enemy activation;
- Status when selected for validation;
- Charge when selected for validation;
- Wave Telegraph reservation/Spawn/Intent transition.

Important Unity-specific control steps may be Flow Simulated.

Hold/Skill detailed lessons remain deferred until their rules/content are ready.

The prototype validation scope should not assume that a single tutorial Phase count is permanently fixed.

### Status

**CURRENT PROTOTYPE VALIDATION DIRECTION**

---

## 98T. Tutorial Failure / Retry

Current prototype direction:

```text
Tutorial Defeat
→ Retry Tutorial
```

Tutorial defeat should not automatically:

- start normal Run settlement;
- convert Crystal;
- trigger permanent progression.

For a longer tutorial, whether retry means:

- retry entire Tutorial Stage;
- retry current Phase/checkpoint

remains **OPEN**.

### Status

- Separate tutorial retry flow: **CARRIED FORWARD**
- Exact checkpoint/retry granularity: **OPEN**

---

## 98U. Existing Historical Tutorial Scenario

Older tutorial material contained directions such as:

- camera;
- movement;
- Action Menu;
- Wait;
- Attack;
- Cover;
- Archer;
- final encounter.

The old sequence is not adopted directly because its Wait/Exhaustion mental model is outdated under Shared AP.

Useful unchanged ideas may still be reused when consistent with the corrected curriculum.

### Status

**HISTORICAL DESIGN SEED**

The current old/placeholder prototype tutorial remains **PROTOTYPE IMPLEMENTATION HISTORY**, not main-game tutorial canon.

---

## 98V. Current Tutorial Design Status

The tutorial design is no longer in the same state as the broad v3.0 “curriculum still to be recovered” checkpoint.

Current status:

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

This does NOT mean the production tutorial is final or locked.

Material design blocker:

```text
Exact first Status teaching source
```

Other OPEN / validation-dependent items include:

- final Phase count;
- exact map dimensions/coordinates;
- exact tactical LOS/Cover geometry;
- Practice Target final identity/presentation;
- Stun duration/timing;
- final Blue inclusion/placement;
- exact Wave spawn-to-first-activation lifecycle;
- Wave Telegraph information density;
- exact AP-sensitive task choreography;
- exact Tutorial Objective / UI wording;
- retry whole Stage vs Phase checkpoint;
- exact amount of Flow Simulation needed for Unity control onboarding;
- movement-scouting/refund exploit/value;
- final combined-pressure tuning;
- main-game tutorial skip/replay/access policy.

### Status

**WORKING DESIGN RECOVERED / NOT FINAL PRODUCTION LOCK**


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
- exact LOS implementation;
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
- exact Mini-Boss encounter;
- exact Wave Victory Relevance rules;
- exact telegraph/spawn/first-activation lifecycle;
- emergency technical spawn fallback;
- multi-step objectives;
- future objective library;
- final Region 1 enemy compositions.

## Tutorial
- final production Tutorial Phase count;
- exact tutorial map dimensions/coordinates;
- exact LOS/Cover teaching geometry;
- exact first Status teaching source;
- Practice Target final identity/presentation;
- Stun duration/timing for the chosen tutorial content;
- final use/non-use and placement of Orange/Purple/Blue;
- exact Wave spawn-to-first-activation lifecycle;
- Wave Telegraph information density;
- exact AP-sensitive task choreography;
- final Tutorial Objective / UI wording;
- retry whole Stage vs Phase/checkpoint granularity;
- exact amount of Unity-control Flow Simulation required;
- movement-scouting/refund exploit/value;
- final combined-pressure tuning;
- main-game tutorial skip/replay/access policy.

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

Its placement in the redesigned tutorial is not yet final.

**Status:** **CARRIED / TUTORIAL PLACEMENT REOPENED**

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
| All ranged attacks require LOS | CURRENT DESIGN | Added |
| LOS ≠ Cover | CURRENT DESIGN | Added |
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
| Spear Enemy | Basic ranged | Carried/expanded |
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
| Protect Target | PLANNED | Carried |
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
| Practice Target | PROTOTYPE ONLY candidate | Added |
| Status tutorial concept | Required advanced concept | Carried |
| Stun as first Status example | TENTATIVE strong candidate | Clarified |
| Exact first Status source | OPEN | Clarified |
| Status → Charge curriculum order | TENTATIVE — current corrected baseline | Updated |
| Blue Charge-first → first Stun | OPEN alternative | Reclassified |
| Wave Telegraph tutorial | Advanced topic | Updated |
| W1 / W2 Wave timing variants | PROTOTYPE validation variants | Added |
| One continuous Tutorial Stage | TENTATIVE — strong working direction | Added |
| Offset Courtyard layout family | TENTATIVE — primary working layout family | Added |
| Seven-Phase tutorial structure | TENTATIVE working | Added |
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

Version 3.1 specifically migrates the corrected Tutorial T1–T3 / Prototype Validation Scope direction established on 11 August 2026. The detailed tutorial handoff remains a supporting reference rather than replacing this canonical context.

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

# Part XVIII — Immediate Design Work After v3.1

The tutorial recovery/design checkpoint that followed v3.0 has now been completed far enough for prototype validation planning.

Completed working-design sequence:

```text
Game Design Context v3.0
→ Game Design Decisions v3.0
→ Tutorial Learning Curriculum
→ Tutorial Phase / Stage Design
→ Prototype Validation Scope
→ repository/source/runtime audit
```

Current project-level next work is:

```text
documentation refresh / portability package
→ prototype migration planning
→ smallest verified implementation checkpoints
```

This document does not prescribe the technical migration structure.

Implementation work must use actual current repository/source/runtime truth and should proceed one tested checkpoint at a time.

Remaining tutorial design questions should be resolved when they materially block the next prototype validation domain, rather than reopening the entire T1–T3 curriculum from zero.


## Final Principle

**TMTB is the game.**

**The prototype is a Game Designer validation tool and a functional Unity flow reference.**

The purpose of this document is to keep the full-game design visible, coherent, and portable even while prototype implementation, simulated Unity-only flow, research methods, balancing assumptions, and development scope continue to evolve.

**Latest explicit Game Designer decisions override this document when a later conflict exists.**
