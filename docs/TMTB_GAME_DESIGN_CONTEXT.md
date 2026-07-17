# TMTB Game Design Context

**Document Type:** Canonical Living Game Design Context  
**Project / Game Code:** TMTB  
**Development Group:** BeCan  
**Primary Game:** 3D Turn-Based Tactics  
**Target Production Environment:** Unity  
**Last Updated:** 17 July 2026

---

## 1. Purpose of This Document

`TMTB_GAME_DESIGN_CONTEXT.md` is the canonical living game-design document for TMTB from the Game Designer's perspective.

Its purpose is to preserve and consolidate the intended design of the main TMTB game, including game identity, macro progression, tactical combat, unit and enemy design, encounter design, run progression, rewards, economy, balancing, evaluation, onboarding, and unresolved design space.

This document is **not** a technical design document, prototype architecture document, implementation tracker, or source-code reference.

The main TMTB game is a **3D Turn-Based Tactics game intended for production in Unity**.

The current 2D/simulative prototype exists as a **Game Designer validation tool**. It helps test combat rules, progression, balancing assumptions, risk–reward relationships, and other design questions. Prototype behavior must not automatically be interpreted as final main-game design.

---

## 2. Game Design Scope

This document distinguishes three layers.

### 2.1 Main Game Design

The intended design of TMTB as a full game.

### 2.2 Prototype Validation Scope

A simplified representation used to test selected game-design questions.

Examples include Region 1 functioning as a temporary validation loop, grid-based movement replacing free 3D locomotion, duplicated Stage 1 battle content, simplified enemy AI, and placeholder tutorial flow.

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
- decisions clarified during development of Prototype v2.5;
- the six-batch Game Design Migration Audit completed before this document was written.

Migration rules:

1. A newer explicit Game Designer decision overrides an older conflicting design.
2. A legacy design that was never superseded may be carried forward.
3. A prototype implementation does not automatically become full-game canon.
4. An unfinished or uncertain design remains marked as planned, tentative, or open.
5. Historical drafts may be preserved as design seeds without being treated as current plans.

---

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

The prototype is a simplified Game Designer tool used to validate tactical positioning, attack range and cover, action commitment, encounter pressure, branching progression, risk and reward, temporary and permanent growth, difficulty assumptions, and player behavior.

The prototype is not expected to reproduce every final-game interaction.

A central example is movement.

**Main game**
- units move freely through the 3D tactical environment using direct controls such as WASD;
- movement is not restricted to tile-by-tile traversal;
- when the player enters an action state, the unit snaps to the center of the tactical grid cell it currently occupies;
- combat resolution is evaluated from that discrete tactical position.

**Prototype**
- continuous locomotion is omitted;
- tactical positions are represented directly as grid positions.

The prototype therefore remains relevant for validating positional combat even though its locomotion model is simplified.

---

## 7. Core Player Experience

**Status: OPEN**

The project has strong mechanical themes, but the canonical Core Player Experience statement has not yet been finalized.

Candidate themes include tactical positioning, meaningful action commitment, route risk–reward decisions, adaptation during a run, attrition management, permanent growth, and readable/fair difficulty.

These remain candidate interpretations until formally defined.

---

## 8. Core Design Pillars

**Status: OPEN**

Possible pillar directions include:

- Tactical Positioning
- Meaningful Unit Activation
- Risk–Reward Route Choice
- Adaptation During a Run
- Attrition Management
- Permanent Progression
- Readable Difficulty

These remain unconfirmed and should be revisited alongside academic/game-design discussion.

---

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

## 16. Combat Phase Structure

Player Phase  
→ Enemy Phase  
→ Next Player Phase  
→ repeat until victory or defeat

During the Player Phase, the player may select any living player unit that has not become exhausted.

The Player Phase ends when all living player units are exhausted.

### Status

**LOCKED**

---

## 17. Unit Activation

Baseline unit activation:

1. reposition within movement allowance;
2. perform one action.

Baseline actions:

- Attack
- Skill
- Wait

After resolving the baseline action, the unit becomes exhausted.

### Status

- Reposition + one baseline action: **LOCKED**
- Attack: **LOCKED**
- Wait: **LOCKED**
- Skill action category: **PLANNED**
- Individual skill mechanics: **OPEN**

---

## 18. Action Economy

Baseline:

One activation  
→ one action  
→ exhausted

The system should allow controlled exceptions.

Possible future effects may grant additional actions, refund actions, modify exhaustion, or alter activation flow.

A kill-triggered additional action is only an example of possible design space.

### Status

- One baseline action: **LOCKED**
- Additional action mechanics: **OPEN DESIGN SPACE**

### Design Principle

**Core rules define default behavior. Skills, traits, buffs, and special effects may create controlled exceptions.**

---

## 19. Repositioning and Unit Switching

Repositioning alone does not exhaust the unit.

A player may reposition a unit, switch to another non-exhausted unit, and later return to the first unit before committing its action.

Movement allowance remains constrained by the activation starting position. Temporary repositioning should not reset or extend that allowance.

### Status

- Move-only does not exhaust: **LOCKED**
- Switching between available units before committing actions: **LOCKED**
- Movement allowance does not reset from temporary positions: **LOCKED CURRENT DESIGN**

---

## 20. Continuous Movement and Tactical Grid Resolution

The full Unity game uses free movement.

Players move the active character continuously through the 3D tactical space using direct controls such as WASD.

Movement is not restricted to discrete grid steps.

When the player enters the Action Menu / Action State:

Current World Position  
→ determine occupied tactical grid cell  
→ snap unit to grid center  
→ resolve combat position from that point

This grid-resolved position is used for targeting, ATR, path interaction, cover, and action resolution.

### Status

- Continuous WASD movement: **LOCKED**
- Tactical grid reference: **LOCKED**
- Snap to grid center on Action State: **LOCKED**
- Exact movement measurement implementation in Unity: **OPEN / IMPLEMENTATION-DEPENDENT**

---

## 21. Movement and Occupancy Rules

At the tactical resolution layer:

- obstacles block invalid tactical positions;
- opposing units block traversal;
- allied units may be traversed;
- units may not end on an occupied tactical position;
- two units may not occupy the same final tactical position.

### Status

**LOCKED CURRENT DESIGN**

The prototype's BFS pathfinding and four-direction traversal are implementation simplifications and are not main-game canon.

---

## 22. ATR — Attack Range

`Range` terminology has been replaced by **ATR — Attack Range**.

ATR describes the attackable radius from the attacker's tactical position.

Distance is evaluated center-to-center between tactical positions on the combat plane.

ATR should not be interpreted as movement-step distance.

### Status

- ATR terminology: **LOCKED**
- Center-to-center tactical distance: **LOCKED**

---

## 23. Melee Path Interaction

A melee attack requires the target to be within ATR and the attack path not to cross the interior of a blocking obstacle.

Touching only an obstacle edge or corner does not invalidate the attack.

### Status

**LOCKED**

---

## 24. Ranged Targeting and Cover

A ranged target may remain valid even when cover lies between attacker and target.

Cover modifies effectiveness rather than automatically invalidating target selection.

Clear path  
→ normal attack effectiveness

Partial Cover  
→ reduced attack effectiveness

Full Cover  
→ target remains valid  
→ baseline damaging attack resolves as 0 damage  
→ action is still consumed

### Status

- Ranged targeting through cover: **LOCKED**
- Full Cover target remains targetable: **LOCKED**
- Baseline attack into Full Cover = 0 damage: **LOCKED**
- Action consumed: **LOCKED**

---

## 25. Target Validity vs Action Effectiveness

**Target Validity ≠ Action Effectiveness**

A unit may be a valid target even when a particular action is ineffective.

This preserves design space for future skills that may ignore cover, reduce cover, apply non-damage effects, mark targets, displace targets, or interact with the environment.

These are possibilities, not confirmed features.

### Status

**LOCKED DESIGN PRINCIPLE**

---

## 26. Cover Model

Current cover categories:

- partial cover;
- stronger partial cover;
- full cover.

Current working values:

- O30 = 30%
- O70 = 70%
- Full Cover = 100%

### Status

- Cover mechanic: **LOCKED**
- Multiple partial-cover strengths: **LOCKED**
- O30 / O70 numerical values: **TENTATIVE**
- Full Cover baseline model: **LOCKED CURRENT DESIGN**

---

## 27. Damage Model

Current working formula:

`Final Damage = floor(max(0, ATK × (1 - Cover Percentage) - DEF))`

Conceptually:

Attack Power  
→ modified by Cover  
→ reduced by Defense  
→ final non-negative damage

### Status

**TENTATIVE WORKING BALANCE FORMULA**

---

## 28. Combat State Terminology

### Ready
Unit remains available to reposition and act.

### Positioned
Unit has repositioned but has not yet committed its action.

### Exhausted
Unit has resolved its action and cannot perform another normal activation during the current Player Phase.

### Status

**CARRIED FORWARD AS COMBAT TERMINOLOGY**

---

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

Enemy pressure may emerge from quantity, archetype combination, offensive capability, survivability, mobility, ATR/threat reach, behavior, target priority, and spatial placement.

Enemy archetypes should contribute distinct tactical pressure rather than functioning only as alternative stat blocks.

### Status

**CORE ENCOUNTER DESIGN PRINCIPLE**

---

## 36. Sword Enemy

Role: **Basic Melee Enemy**

Current baseline:

- HP: 16
- ATK: 6
- DEF: 2
- Move: 3
- ATR: 1.5

### Status

- Basic melee role: **LOCKED CURRENT DESIGN**
- Current stats: **TENTATIVE BALANCE BASELINE**

---

## 37. Spear Enemy

Role: **Basic Ranged Enemy**

Spear Enemy remains part of the intended enemy roster.

It was intentionally removed from the Stage 1 baseline to keep early onboarding simpler, not removed from the overall design.

### Status

**PLANNED / DEFERRED FROM CURRENT PROTOTYPE**

Historical ATR reference: approximately 3.0, subject to balancing.

---

## 38. Mini-Boss Design

Region 1 Stage 4 is intended as a fixed Mini-Boss climax.

Intended objective direction: **Defeat Mini-Boss**

Current prototype Stage 4 battle content is a development placeholder and is not the canonical Mini-Boss design.

### Status

- Stage 4 as Mini-Boss climax: **LOCKED DIRECTION**
- Mini-Boss identity: **OPEN**
- Mini-Boss abilities: **OPEN**
- Exact stats: **TENTATIVE / OPEN**
- Exact map: **OPEN**

---

## 39. Future Enemy Archetype Design Space

Preserved directions:

- Bruiser / Heavy Melee
- Fast Harasser
- Support Enemy

### Status

**DEFERRED DESIGN SPACE**

---

# Part V — Encounter Design

## 40. Encounter Design Philosophy

A tactical scenario may combine:

Map  
+ Enemy Composition  
+ Spawn Configuration  
+ Objective  
+ Victory / Defeat Conditions  
+ Waves / Pacing  
+ Triggers  
= Encounter Experience

Difficulty is not defined by enemy stats alone.

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

**Objective ≠ Victory Condition ≠ Defeat Condition**

The objective tells the player what they are trying to accomplish.

Victory conditions define successful resolution states.

Defeat conditions define unsuccessful resolution states.

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

- All player units defeated: **LOCKED BASELINE**
- Objective-specific defeat conditions: **LOCKED DESIGN PRINCIPLE**
- Exact future conditions: **PLANNED / DEFERRED**

---

## 44. Trigger-Based Encounter Design

Encounters may react to:

- turn timing;
- previous wave completion;
- unit position / entering an area;
- enemy HP thresholds;
- objective progression.

Possible outcomes:

- wave spawn;
- reinforcement;
- ambush;
- objective change;
- area hazard;
- phase change.

### Status

**PLANNED ENCOUNTER FRAMEWORK**

---

## 45. Wave System

A wave is not an objective.

Objective:
- defines what the player must accomplish.

Wave:
- modifies encounter pressure, spawn timing, and pacing.

Wave design may consider role, trigger, timing, spawn position, composition, recovery window, and victory relevance.

### Status

**PLANNED / DEFERRED**

---

## 46. Wave Roles

### Required Wave
Mandatory encounter component that may need to be resolved before victory.

### Conditional Wave
Appears only when a condition occurs.

### Punishment Wave
Appears as a consequence of a specific action, mistake, trigger, or condition.

### Status

**PLANNED CONCEPTUAL MODEL**

A working rule is that unresolved required waves may block victory, while untriggered optional conditional/punishment waves do not necessarily block victory.

This remains **TENTATIVE** until validated.

---

## 47. Multi-Step and Phased Encounters

Future encounters may include:

- multiple objective steps;
- Mini-Boss phases;
- boss phases;
- objective transitions;
- changing encounter requirements.

### Status

**OPEN / DEFERRED DESIGN SPACE**

---

## 48. Region 1 Encounter Direction

### Stage 1 Baseline

- Region: Village
- Player: Guard + Archer
- Enemy: 2 Sword Enemies
- Objective: Eliminate All

Purpose:
- simple baseline before ranged enemy pressure;
- validate positioning, targeting, obstacles, cover, Attack, and Wait.

### Status

**CURRENT REGION 1 BASELINE**

Old specific Stage 2–3 encounter drafts are **HISTORICAL DESIGN SEEDS**.

Their underlying intention remains:

Stage 2–3 should progressively introduce variation through enemy composition, map pressure, objectives, waves/pacing, triggers, and risk–reward differences.

Future content should be redesigned using the balancing framework rather than copied directly from old drafts.

---

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

## 64. Post-Run Shop

Full Run Ends  
→ Settlement  
→ Crystal Conversion  
→ Post-Run Shop  
→ Permanent Progression  
→ Future Run

### Status

**CURRENT FULL-GAME DIRECTION**

The older milestone-unlocked Main Menu Shop is **SUPERSEDED**.

---

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

The Stage Node Difficulty Template is preserved as a canonical Game Designer balancing tool.

### 1. Node Identity
- Node ID
- Stage Slot
- Node Name
- Region
- Node Type
- Objective Type
- Difficulty Tag
- Path Role

### 2. Expected Player State
- Expected Run
- Expected Permanent Upgrade
- Expected Temporary Buff Count
- Expected HP Condition
- Expected Current Player Capability

### 3. Enemy Pressure
- Enemy Composition
- Enemy Pressure Rating

### 4. Map Pressure
- Map Pressure Rating

### 5. Wave Pressure
- Wave Pressure Rating

### 6. Objective / Phase Pressure
- Objective / Phase Pressure Rating

### 7. Stage Pressure Result
- Overall pressure estimate

### 8. Difficulty Result
- Difficulty Gap
- Target Difficulty

### 9. Reward & Progression
- Crystal Reward
- Reward Pool Tier
- Temporary Buff Impact Range
- Reward Choice Count / Opportunity

### 10. Evaluation Notes
- Expected Turn Count
- Expected HP Remaining
- Expected Unit Death
- Telemetry Notes
- Player Feedback Target

This is a **design authoring template**, not a mandatory technical schema.

---

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
- threat exposure.

### Status

**CANDIDATE EVALUATION METRICS**

Not every metric is mandatory.

---

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

Tutorial and onboarding should introduce tactical systems progressively.

Players should understand and apply a mechanic before additional pressure or complexity is introduced.

### Status

**CARRIED FORWARD**

---

## 97. Progressive Mechanic Introduction

Historical direction includes:

- camera control;
- unit selection;
- movement;
- Action Menu;
- Wait;
- phase structure;
- Attack;
- damage;
- target switching;
- receiving damage;
- ranged enemy interaction;
- cover;
- unit switching;
- Archer;
- ranged attack;
- final objective.

The exact order is not fully re-audited here.

### Status

**PLANNED DIRECTION**

---

## 98. Existing Planned Tutorial Scenario

A more detailed tutorial scenario was previously discussed and summarized in older chat/design-summary documentation.

The Game Designer still intends to implement that scenario in the prototype approximately according to the previous plan.

Before tutorial development:

1. request the original tutorial summary/document;
2. audit the detailed sequence;
3. do not reconstruct the scenario from memory alone;
4. only then update canonical tutorial design or begin implementation.

### Status

**PLANNED FOR PROTOTYPE IMPLEMENTATION**

The current v2.5 placeholder tutorial battle is not main-game tutorial canon.

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
- Core Player Experience
- Core Design Pillars

## Combat
- exact Skill system;
- skill resources;
- skill cooldowns;
- action-economy exceptions;
- exact Unity movement-allowance measurement.

## Units
- Trickster identity;
- Support identity;
- future playable units;
- future enemy roles.

## Encounter
- exact Protect Target design;
- exact Mini-Boss design;
- wave validation;
- multi-step objectives;
- future objective library.

## Run
- recovery rules;
- rest-node behavior;
- unit defeat persistence;
- between-region recovery;
- resume unfinished active run.

## Rewards
- reward occurrence probability;
- rarity model;
- reward repetition;
- reward stacking;
- stacking caps;
- unique-node reward behavior.

## Economy
- final Crystal conversion rate;
- defeat penalty or completion bonus;
- In-Run Shop design;
- future permanent upgrade categories.

## Balancing
- exact definition of Current Player Capability;
- exact Stage Pressure scale;
- Difficulty Gap interpretation;
- Tactical Mastery measurement;
- pressure weights;
- final difficulty scale.

## Main Game UI/UX Candidates
- Death Marker;
- Run History / Run Notes.

---

# Part XIV — Superseded and Revised Legacy Design

## 101. TMTB / BeCan

**Old ambiguity:** `TMTB / BeCan` appeared as if both could be alternative game names.

**Current clarification:**
- TMTB = project/game code.
- BeCan = development group.

**Status:** CLARIFIED

---

## 102. `1 Unit = 1 Action = End Turn`

**Old wording:** one unit = one action = end turn.

**Current design:**
- unit activation;
- optional reposition;
- one baseline action;
- unit exhausted;
- Player Phase continues with other non-exhausted units;
- Enemy Phase begins after all living player units are exhausted.

**Status:** REVISED

---

## 103. Range Terminology

**Old:** Range

**Current:** ATR — Attack Range

**Status:** SUPERSEDED

---

## 104. Tile-by-Tile Movement as Full-Game Interpretation

**Old/prototype interpretation:** discrete grid movement.

**Current full-game design:** continuous free movement with tactical grid snap when entering Action State.

**Status:** CLARIFIED / PROTOTYPE SIMPLIFICATION

---

## 105. Main Menu Shop

**Old:** hidden or milestone-unlocked Main Menu Shop.

**Current:** Post-Run Shop after run settlement.

**Status:** SUPERSEDED

---

## 106. Region 1 as Run Boundary

**Prototype behavior:** Village completion currently ends the validation loop.

**Current full-game design:** one run continues Village → Town → Castle.

**Status:** CLARIFIED / DEVELOPMENT EXCEPTION

---

## 107. Spear Enemy Removal from Stage 1

**Current interpretation:** Spear Enemy remains the planned basic ranged enemy. It was removed only from Stage 1 onboarding.

**Status:** CARRIED FORWARD

---

## 108. Old Specific Stage 2–3 Encounter Drafts

Old detailed encounter drafts are no longer current Region 1 content plans.

Their underlying principles remain relevant:

- encounter diversity;
- enemy composition;
- objectives;
- waves;
- map pressure;
- risk–reward.

**Status:** HISTORICAL DESIGN SEEDS

---

# Part XV — Design Carryover Registry

| Legacy Concept | Current Status | Migration |
|---|---|---|
| TMTB project identity | Locked | Carried |
| BeCan | Clarified as group | Carried |
| 3D Turn-Based Tactics | Locked | Carried |
| Semi-Roguelite progression | Locked | Carried |
| Permanent Meta Progression | Locked | Carried |
| Village → Town → Castle | Locked | Carried |
| One full run spans all three regions | Locked | Clarified |
| Region 1 Stage 1–4 structure | Locked for Region 1 | Carried |
| Branching node graph | Locked direction | Carried |
| Controlled randomization | Planned | Carried |
| `Trackback` item | Not canon | Historical example |
| 1 unit = 1 action = end turn | Superseded wording | Revised |
| One baseline action | Locked | Carried/revised |
| Additional action mechanics | Open | Preserved design space |
| Free WASD movement | Locked | Clarified |
| Tactical grid snap | Locked | Carried/clarified |
| BFS | Prototype implementation | Excluded |
| Four-direction movement | Prototype implementation | Excluded |
| Range terminology | Superseded | Replaced by ATR |
| ATR | Locked | Carried |
| Cover system | Locked | Carried |
| O30 / O70 values | Tentative | Carried |
| Current damage formula | Tentative | Carried |
| Target validity vs effectiveness | Locked principle | Clarified |
| Guard | Planned playable | Carried |
| Archer | Planned playable | Carried |
| Trickster | Planned playable | Carried |
| Support | Planned playable | Carried |
| Sword Enemy | Basic melee | Carried |
| Spear Enemy | Basic ranged | Carried |
| Heavy / Fast / Support enemy roles | Deferred | Carried as design space |
| Eliminate All | Core objective | Carried |
| Protect Target | Planned core objective | Carried |
| Defeat Mini-Boss | Planned core objective | Carried |
| Survive Turns | Planned | Carried |
| Reach Exit | Planned | Carried |
| Activate Points | Planned | Carried |
| Escort Target | Planned | Carried |
| Hold Position | Planned | Carried |
| Trigger framework | Planned | Carried |
| Wave system | Planned | Carried |
| Required / Conditional / Punishment waves | Planned | Carried |
| Multi-step objective | Open/deferred | Carried |
| Old Stage 2–3 specific drafts | Historical | Demoted |
| Temporary reward durations | Planned | Carried |
| Reward impact model | Working | Carried |
| Reward stacking | Open | Carried |
| Run Crystal | Locked | Carried |
| Meta Crystal | Locked | Carried |
| 100% conversion | Tentative | Carried as current baseline |
| Main Menu Shop | Superseded | Replaced |
| Post-Run Shop | Current direction | Carried |
| Permanent upgrades | Locked concept | Carried |
| HP / ATK / DEF upgrade foundation | Locked direction | Carried |
| HP Carry | Locked direction | Restored |
| Recovery | Open/deferred | Carried |
| Death Marker | Prototype planned | Reclassified |
| Run History | Prototype planned | Reclassified |
| Current Player Capability | Working framework | Carried |
| Stage Pressure | Core balancing principle | Carried |
| Enemy Pressure | Working framework | Carried |
| Map Pressure | Working framework | Carried |
| Wave Pressure | Working framework | Carried |
| Objective / Phase Pressure | Working framework | Carried |
| Difficulty Gap | Initial working concept | Carried |
| Difficulty Scale | Working | Carried |
| Stage Node Difficulty Template | Canonical design tool | Carried |
| Temporary Buff Impact Rating | Working model | Carried |
| Permanent Upgrade Growth Rating | Working model | Carried |
| Tactical Mastery | Open measurement model | Carried |
| Predicted / Observed / Perceived | Working evaluation framework | Carried |
| Battle metrics | Candidate evaluation metrics | Carried |
| Run metrics | Candidate evaluation metrics | Carried |
| Player feedback dimensions | Candidate evaluation dimensions | Carried |
| Telemetry | Evaluation tool | Reclassified |
| Debug Balancing UI | Prototype tool | Excluded from game canon |
| Auto-simulation | Optional evaluation tool | Carried/reclassified |
| Progressive tutorial philosophy | Planned | Carried |
| Detailed tutorial scenario | Planned for prototype | Source review required |

---

# Part XVI — Source-of-Truth Use

For **game-design intent**:

1. Latest explicit Game Designer decision.
2. `TMTB_GAME_DESIGN_CONTEXT.md`.
3. Latest `TMTB_GAME_DESIGN_DECISIONS_vX.X.md`.
4. Historical game-design documents.

For **prototype implementation truth**:

1. Actual source code and data.
2. Confirmed runtime testing.
3. Latest `TMTB_CURRENT_STATE_vX.X.md`.

A prototype implementation that conflicts with the Game Design Context should be treated as a development limitation, validation simplification, implementation bug, or undocumented design change.

The conflict should be explicit rather than silently merged.

---

# Part XVII — Maintenance Rule

This is a living document.

Update it when:

- the Game Designer explicitly changes a canonical game rule;
- an open design question becomes decided;
- a planned feature is intentionally abandoned;
- a prototype experiment produces a main-game design decision;
- full-game progression changes;
- balancing or evaluation frameworks materially evolve;
- a legacy design is rediscovered and confirmed as relevant.

Do **not** update it merely because:

- a prototype function is refactored;
- a file path changes;
- an implementation algorithm changes;
- a temporary prototype shortcut is introduced.

---

## Final Principle

**TMTB is the game.**

**The prototype is a Game Designer validation tool.**

The purpose of this document is to ensure that the design of the main game remains visible, coherent, and portable even when the prototype, implementation, research method, or development scope changes.
