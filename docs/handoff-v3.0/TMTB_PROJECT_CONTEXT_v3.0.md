# TMTB Project Context — Handoff v3.0

**Project:** TMTB / BeCan
**Context Owner:** Game Designer
**Document Type:** Handoff Snapshot — Project Context
**Handoff Package Version:** 3.0
**Canonical Game Design Version:** 3.1
**Prototype Implementation Baseline:** **Post-v2.5 / Pre-v3 Combat Migration**
**Verified Baseline Date:** 11 August 2026
**Project Root:** `C:\Datas\prototype-tmtb`
**Status:** **CURRENT PROJECT-LEVEL CONTEXT**

---

# 1. Purpose of This Document

Dokumen ini menjawab:

> **Apa itu project TMTB, mengapa prototype ini ada, siapa yang mengambil keputusan apa, bagaimana design dan implementation dibedakan, dan bagaimana project ini seharusnya dikerjakan?**

Dokumen ini sengaja berada di level project.

Ia tidak menggantikan:

```text
Game Design Context
→ full canonical design intent

Current State
→ actual prototype behaviour

Architecture
→ current module/file responsibilities

State & Data Model
→ current runtime/data state

Progress & Backlog
→ current checkpoint / next work

Chat Handoff
→ how to collaborate/resume
```

---

# 2. Project Identity

TMTB / BeCan adalah game:

```text
3D Turn-Based Tactics
+
semi/light roguelite progression
+
permanent meta progression
```

Target production utama adalah Unity.

Prototype repository saat ini adalah:

```text
2D
simulative
bare-bones
functional
web-based
```

Prototype tidak otomatis merepresentasikan final visual, final controls, final production architecture, atau full content game.

---

# 3. Main Game vs Prototype

## Main Game

Target utama:

```text
Unity
3D tactical environment
continuous / free movement
tactical grid resolution
turn-based tactical combat
run progression
meta progression
```

Main-game movement is conceptually:

```text
free/continuous 3D movement
→ tactical position resolved through grid logic when relevant
```

The final production game is not intended to feel like tile-by-tile browser locomotion.

---

## Prototype

The web prototype may represent movement directly through:

```text
grid / BFS
```

when that is sufficient for testing tactical rules.

Therefore:

```text
prototype representation
≠
automatic final production representation
```

The prototype may simplify:

- locomotion;
- presentation;
- animation;
- camera;
- content quantity;
- route scope;
- AI complexity;
- UI polish.

But simplification must not make the validation result misleading.

---

# 4. Two Parallel Roles of the Prototype

The current prototype has two explicit roles.

## 4.1 Game Designer Validation Tool

Used to test questions such as:

- combat rules;
- Shared AP;
- StartGrid;
- action commitment;
- ATR;
- LOS;
- Cover;
- enemy readability;
- enemy execution;
- Status;
- Charge;
- Wave;
- tutorial learning order;
- run flow;
- branching;
- reward flow;
- progression;
- economy;
- difficulty;
- balancing assumptions;
- encounter pressure.

The prototype should generate evidence useful for Game Design decisions.

---

## 4.2 Unity Functional Flow Reference

The prototype also preserves important intended game/tutorial flow for future Unity implementation.

An important final-game flow step should not automatically disappear because the browser prototype cannot reproduce the actual 3D mechanic.

Example:

```text
Unity tutorial:
move camera left/right

Browser prototype:
instruction
→ simulated confirmation
→ feedback
→ continue
```

This is:

```text
FLOW SIMULATION
```

It communicates intended onboarding flow.

It does not claim that final camera-control feel was validated.

---

# 5. Prototype Representation Types

Current prototype/tutorial work distinguishes:

```text
REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED / NOT READY
```

## REAL SYSTEM VALIDATION

Use when the gameplay rule itself is being validated.

The prototype must run the real intended prototype rule accurately enough for the test.

Examples include, when implemented for validation:

- Shared AP;
- StartGrid/refund;
- Attack position commitment;
- ATR;
- LOS;
- Cover;
- Intent;
- sequential enemy activation;
- Status;
- Charge;
- Wave.

---

## FLOW SIMULATION

Use for an important intended Unity flow step that the web prototype should represent without reproducing the final mechanic.

Flow Simulation should not silently mutate authoritative combat state unless the authored flow explicitly invokes a real gameplay system.

---

## DEFERRED / NOT READY

Use when the design is not sufficiently resolved to teach or validate accurately.

Examples currently include:

- detailed Hold lesson;
- detailed individual Skill lesson.

Do not invent a fake final rule merely to make the prototype look complete.

---

# 6. What the Prototype Is For

The prototype is intended to help the Game Designer:

- formulate hypotheses;
- test system interactions;
- expose edge cases;
- compare alternatives;
- test tutorial learning flow;
- evaluate readability;
- observe dominant options/exploits;
- test risk–reward assumptions;
- test run/progression flow;
- gather playtest evidence;
- support academic analysis;
- provide a functional reference for collaborators.

A useful prototype result may be:

```text
this design works
this design fails
this design is unclear
this parameter is too strong
this rule creates an exploit
this tutorial order causes overload
this system needs another test
```

Prototype success is not defined only by adding features.

---

# 7. What the Prototype Is Not

The prototype is not:

- final Unity implementation;
- final 3D architecture;
- final visual direction;
- final UI/UX;
- production-quality save system;
- production content build;
- final balance;
- final character/environment art;
- final performance architecture;
- complete commercial game;
- automatic proof that a design works;
- substitute for human playtesting;
- a technical project that overrides Game Design priorities.

Technical complexity should be added only when it improves:

```text
validation fidelity
reliability
portability
or
future implementation clarity
```

---

# 8. Full Main-Game Run Structure

Current canonical full-run direction:

```text
Village
→ Town
→ Castle
→ Final Resolution
→ Settlement
→ Meta Progression
```

This is main-game design intent.

Current web prototype ending around Region 1 is:

```text
DEVELOPMENT EXCEPTION
```

Therefore:

```text
Region 1 prototype ending
≠
final full-run structure
```

Town/Castle being visible but not playable in current Run Overview is compatible with the current prototype development scope.

---

# 9. Current Prototype Implementation Baseline

Current verified prototype baseline is:

```text
Post-v2.5 / Pre-v3 Combat Migration
Verified 11 August 2026
```

This wording is intentional.

It means:

- v2.5 full-loop foundation exists;
- post-v2.5 deployment work exists;
- local Run Overview / Shop relocation work exists;
- current Game Design has advanced to v3.1;
- combat implementation has not yet migrated to the current design.

Do not call the prototype itself:

```text
Prototype v3.0
```

merely because the handoff package is v3.0.

---

# 10. Current Handoff / Design / Implementation Version Separation

Three version concepts are separate.

```text
Game Design Version
≠
Handoff Package Version
≠
Prototype Implementation Baseline
```

Current documentation cycle:

```text
Canonical Game Design:
v3.1

Handoff Package:
v3.0

Prototype Implementation:
Post-v2.5 / Pre-v3 Combat Migration
```

This separation prevents documentation version numbers from implying implementation completeness.

---

# 11. Current Game Design Direction — High-Level

This Project Context does not reproduce full gameplay rules.

The canonical design references are:

```text
docs/TMTB_GAME_DESIGN_CONTEXT.md
docs/TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

Important current high-level directions include:

- Player Turn belongs to the whole party;
- Shared Team AP;
- StartGrid movement commitment/refund;
- Attack/Skill locks Movement rather than Exhausting the unit;
- repeated actions may occur when AP/rules allow;
- global End Turn;
- ranged LOS distinct from Cover;
- readable enemy Intent / Current Target / Dynamic Intent;
- sequential enemy activation;
- Spawn Order baseline;
- Status / Charge / Wave as advanced tactical concepts;
- tutorial as one continuous evolving Stage working direction;
- prototype Flow Simulation for important Unity-only onboarding.

These are design targets.

Current prototype does not yet implement all of them.

---

# 12. Current Prototype Reality — High-Level

Current audited combat still uses the old implementation model:

```text
Ready / Exhausted
free reposition before action
Attack / Wait → Exhausted
all living player units Exhausted
→ Enemy Phase

Enemy Phase:
all enemies Move
→ all enemies Attack
```

Current prototype already has useful foundations such as:

- BFS/grid movement;
- `originTile`;
- ATR;
- Cover/path geometry;
- basic damage;
- Sword enemy behaviour;
- battle result;
- run graph;
- reward flow;
- Crystal settlement;
- permanent upgrades;
- profile persistence.

The gap between current implementation and Game Design v3.1 is intentional project work to be migrated incrementally.

---

# 13. Current Meta / Run Flow

Current local prototype flow includes:

```text
Title
→ Main Menu
→ Tutorial Gate / Run Overview
```

New profile:

```text
Start Journey
→ Tutorial placeholder battle
```

Tutorial victory:

```text
tutorialCompleted
→ Run Overview
```

Returning player:

```text
Start Journey
→ Run Overview
```

Run Overview currently provides:

```text
Village / Town / Castle framing
Meta Crystal
Tutorial Status
Start Journey
Shop
```

Start Journey:

```text
Run Overview
→ create new Run
→ Map Selection
```

Settlement:

```text
Completion / Defeat
→ Run Overview
```

or:

```text
Completion / Defeat
→ Shop
→ Run Overview
```

Run Overview / Shop-relocation work is current local **uncommitted** work as of the recovery audit.

---

# 14. Current Content Scope

Current playable battle content remains limited.

Baseline party:

```text
Guard
Archer
```

Baseline enemy:

```text
Sword
```

Current fixed baseline encounter:

```text
Guard + Archer
vs
2 Sword
```

Current stages still broadly reuse the same Stage 1 battle data.

Current content limitation is acceptable as a development state, but it must not be mistaken for final region/encounter design.

---

# 15. Game Designer Role

The user is the primary Game Designer.

Game Designer authority includes:

- mechanic intent;
- tactical rule;
- Player Turn model;
- enemy behaviour intent;
- encounter design;
- tutorial learning design;
- run structure;
- branching;
- reward intent;
- progression;
- economy;
- difficulty intent;
- balancing hypotheses;
- objective design;
- prototype validation scope;
- functional-screen requirements;
- playtest interpretation;
- design status decisions.

The assistant should help test:

- internal consistency;
- systemic consequence;
- edge cases;
- ambiguity;
- exploit potential;
- dominant options;
- readability;
- validation strategy;
- balancing assumptions.

The assistant should not silently make design decisions on the Game Designer's behalf.

---

# 16. Programmer Role

The production programmer is responsible for:

- Unity production implementation;
- engine-specific architecture;
- technical integration;
- production code quality;
- optimization;
- production save architecture;
- platform-specific implementation;
- build/deployment concerns;
- implementation details needed to realize the intended behaviour.

The JavaScript prototype is not a literal Unity architecture blueprint.

The important handoff is:

```text
intended behaviour
state meaning
rule interaction
flow
expected result
validation evidence
```

not one-to-one JavaScript structure.

---

# 17. UI/UX Designer Role

UI/UX responsibilities include:

- final information hierarchy;
- final screen composition;
- interaction design;
- readability;
- accessibility;
- final icon/language system;
- user feedback;
- final control discoverability.

The prototype UI exists primarily to make state and decisions readable enough for validation.

A bare-bones prototype UI does not define final visual direction.

Some prototype UI concepts may later become functional references, but they remain subject to UI/UX design.

---

# 18. Art / 3D Production Role

3D production responsibilities include:

- characters;
- environments;
- tactical-space visual communication;
- animation;
- production assets;
- world-building.

The prototype may use:

- grid cells;
- tokens;
- labels;
- CSS shapes;
- simple color/value coding.

These are functional abstractions.

They do not define final art direction.

---

# 19. Academic Context

The prototype exists in the context of the Game Designer's academic/PA work.

Current academic value is primarily connected to:

- balancing parameters;
- difficulty evaluation;
- player capability vs encounter pressure;
- system validation;
- playtest;
- observed behaviour;
- perceived difficulty/readability;
- interpretation of evidence for design decisions.

Useful evaluation structure:

```text
Predicted
→ Observed
→ Perceived
```

Older conceptual models such as:

```text
Current Player Capability
Stage Pressure
Difficulty Gap
```

may remain useful as analysis tools.

They must not become hard implementation dependencies merely because they appeared in older documents.

---

# 20. Balancing Philosophy

Numbers should follow the design question.

Preferred reasoning order:

```text
intended decision
→ pressure
→ player/enemy behaviour
→ system requirement
→ numbers
```

Not:

```text
pick numbers
→ justify them afterward
```

Prototype simulation/model output is evidence for hypotheses.

It does not replace playtesting.

A useful balancing conclusion should distinguish:

```text
Predicted
Observed
Perceived
```

---

# 21. Game-Design Status Language

Current project design status vocabulary:

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

Implementation progress labels such as:

```text
IMPLEMENTED
TESTED
CONFIRMED
NOT IMPLEMENTED
```

are separate from Game Design status.

---

# 22. Source-of-Truth — Game Design Intent

For design questions use:

```text
1. Latest explicit Game Designer decision in active discussion
2. Latest TMTB_GAME_DESIGN_CONTEXT
3. Latest TMTB_GAME_DESIGN_DECISIONS
4. Latest relevant domain-specific supporting handoff
5. Historical / legacy design documents
```

Example question:

> Should Attack Exhaust the player unit?

Answer from current design authority:

```text
No.
Attack/Skill locks Movement but does not create old Exhaustion.
```

The current prototype doing otherwise is an implementation gap.

---

# 23. Source-of-Truth — Prototype Implementation Truth

For implementation questions use:

```text
1. Actual source code / data
2. Confirmed runtime testing
3. Latest TMTB_CURRENT_STATE
4. Latest Architecture / State & Data implementation handoff
5. Historical implementation docs
```

Example question:

> Does current prototype already have Shared AP?

Current answer:

```text
No.
```

Even though Shared AP is canonical Game Design.

---

# 24. Design vs Implementation Conflict Rule

If:

```text
Design = A
Prototype = B
```

do not silently reconcile them.

Record the difference explicitly.

Potential classifications:

```text
migration gap
old implementation
prototype simplification
development exception
deferred feature
bug
unverified
```

Only an explicit Game Designer decision changes design intent.

Only actual code/data/runtime changes implementation truth.

---

# 25. Canonical / Supporting / Historical Documents

Current documentation governance distinguishes:

```text
CANONICAL
SUPPORTING
HISTORICAL
```

## Canonical

Examples:

```text
TMTB_GAME_DESIGN_CONTEXT.md
TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

## Supporting

Examples:

```text
Enemy Design Discussion Handoff
Tutorial Design Corrected Handoff
Prototype Recovery / Repository Audit Handoff
```

Supporting handoffs preserve detail/reasoning/evidence.

They do not automatically override canon.

## Historical

Examples:

```text
docs/handoff-v2.5/*
old TMTB_CURRENT_STATE.md
old v2.5 TODO/backlog
```

Historical documents remain useful for provenance but do not override current truth.

---

# 26. Current Portable Project-Source Goal

The project is deliberately building a compact active documentation set so future recovery does not require re-explaining months of discussion.

Target portable active set:

```text
README.md
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
TMTB_PROJECT_CONTEXT_v3.0.md
TMTB_CHAT_HANDOFF_v3.0.md
TMTB_CURRENT_STATE_v3.0.md
TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
TMTB_STATE_AND_DATA_MODEL_v3.0.md
TMTB_PROGRESS_AND_BACKLOG_v3.0.md
TMTB_GAME_DESIGN_CONTEXT.md
TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

Supporting handoffs can be added when a task needs detailed domain reasoning.

---

# 27. Recommended Documentation Layout

Current target repository organization:

```text
docs/
├─ TMTB_GAME_DESIGN_CONTEXT.md
├─ TMTB_GAME_DESIGN_DECISIONS_v3.1.md
├─ TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
│
├─ supporting/
│  └─ domain / audit supporting handoffs
│
├─ handoff-v3.0/
│  ├─ README.md
│  ├─ TMTB_PROJECT_CONTEXT_v3.0.md
│  ├─ TMTB_CHAT_HANDOFF_v3.0.md
│  ├─ TMTB_CURRENT_STATE_v3.0.md
│  ├─ TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
│  ├─ TMTB_STATE_AND_DATA_MODEL_v3.0.md
│  └─ TMTB_PROGRESS_AND_BACKLOG_v3.0.md
│
└─ handoff-v2.5/
   └─ historical snapshot
```

Exact supporting-folder organization may evolve.

The authority classes must remain clear.

---

# 28. Working Method — Game Design

When discussing design:

```text
understand intended decision
→ identify pressure
→ identify behaviour/system consequence
→ test edge cases
→ compare valid options
→ expose trade-offs
→ decide only when Game Designer chooses
```

The assistant should distinguish:

```text
fact
interpretation
recommendation
```

when ambiguity matters.

Avoid adding complexity if a simpler mechanic can produce the intended decision.

---

# 29. Working Method — Prototype / Coding

The user is the Game Designer, not the primary programmer.

Default technical workflow:

```text
Understand target
→ audit current relevant files
→ identify one small coherent change
→ provide exact edit
→ run
→ compare expected vs actual
→ regression test
→ wait for confirmation
→ continue
```

Before coding assistance, use actual current files.

Do not rely on remembered/historical code when a source audit is possible.

---

# 30. Technical Edit Guidance

For technical edits, provide when possible:

```text
exact path
exact block/function to find
add / replace / delete instruction
copy-ready code
expected result
ordered test
regression test
```

Do not assume:

```text
saved
runs
works
```

until the user confirms.

If an error appears:

```text
actual error
+ current relevant files
→ isolate smallest cause
→ fix one thing
→ retest
```

Avoid broad speculative refactors.

---

# 31. Documentation Workflow

Current documentation principle:

```text
AUDIT FIRST
DOCUMENT SECOND
```

For a major refresh:

```text
Git/repository audit
→ actual source/data audit
→ runtime confirmation
→ design recovery audit
→ supporting handoff if useful
→ documentation inventory
→ migration matrix
→ core-doc authoring
→ cross-document audit
→ recovery simulation
```

Do not copy old handoffs and simply bump their version.

---

# 32. Git Workflow

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

A local commit is not a remote backup until pushed.

Git tags are useful for deliberate milestones.

ZIP is optional for:

- academic submission;
- presentation;
- offline archive;
- release bundle.

---

# 33. Current Repository / Deployment Context

Project root:

```text
C:\Datas\prototype-tmtb
```

Current technologies:

- Vite;
- Vanilla JavaScript;
- ES Modules;
- HTML;
- CSS;
- JSON;
- browser `fetch`;
- browser `localStorage`;
- Git / GitHub;
- GitHub Pages.

Current deployment-related repository state includes:

```text
vite.config.js
.github/workflows/deploy.yml
BASE_URL-aware dataLoader
```

The prototype is therefore usable as both local development app and hosted GitHub Pages build.

---

# 34. Current Architecture Philosophy

Useful principles to preserve:

## Data-Driven Direction

Static gameplay definitions should be data-driven where useful.

---

## Definition vs Runtime State

```text
definition data
≠
runtime mutable state
```

---

## UI Does Not Define Rules

UI reads authoritative state/rule output.

---

## Shared Rule Logic

Player/enemy/manual test/future simulation should reuse core rule logic where that preserves consistency.

---

## Incremental Architecture

Refactor only when current evidence/pressure justifies it.

Do not force a historical folder/module scheme onto current source.

---

# 35. Current Prototype Architecture — High-Level

Current broad flow:

```text
Definition Data
→ Application Data
→ Runtime State
→ Rule Logic
→ UI Rendering
→ Input
```

Profile:

```text
localStorage
↔ profileStorage
↔ profileState
```

Run:

```text
runState.js
↔ runState
```

Battle:

```text
battleSetup
→ battleState
→ battle logic
→ renderer/HUD
```

Central application orchestration remains primarily in:

```text
src/main.js
```

Detailed current architecture belongs in:

```text
TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
```

---

# 36. Current Persistence Context

Persistent current profile includes:

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

Stored through:

```text
browser localStorage
```

Active:

```text
runState
battleState
currentScene
```

remain in-memory.

Therefore active-run persistence / Continue Run is currently unavailable.

Local browser profile state is also separate per machine/browser unless manually transferred.

---

# 37. Tutorial Project Context

Current canonical tutorial work has progressed substantially beyond the old placeholder/tutorial-backlog stage.

Current design status:

```text
T1 Learning Curriculum
DONE as corrected working curriculum

T2 Phase Architecture
DONE as corrected working architecture

T3 Tutorial Stage Design
WORKING DESIGN COMPLETE ENOUGH FOR PROTOTYPE VALIDATION PLANNING
```

This does not mean production Tutorial is locked.

Current implementation remains a placeholder battle.

That design-vs-implementation gap is expected.

---

# 38. Enemy Project Context

Current enemy design uses explicit concepts such as:

```text
Target Rule
Movement Rule
Action Rule
Fallback
Intent
Current Target
Dynamic Intent
State / Status / Override / Pattern when relevant
```

Baseline enemy execution target:

```text
sequential
max 1 Movement + 1 Action
Spawn Order baseline
```

Current implementation is still older procedural:

```text
all enemies Move
→ all enemies Attack
```

Do not treat current procedural AI as final enemy design.

---

# 39. Tactical Space Context

Current design distinguishes:

```text
ATR
LOS
Cover
```

and:

```text
Target Validity
Action Validity
Action Effectiveness
```

Current prototype already contains useful ATR/Cover foundations.

Distinct ranged LOS is not yet implemented.

The current Cover implementation may be reused, but it does not erase the need for explicit LOS validation.

---

# 40. Progression / Economy Context

Current prototype already contains:

- Run Crystal;
- Meta Crystal;
- permanent upgrades;
- run settlement;
- reward selection.

Some current values remain prototype/balance assumptions rather than final design locks.

Examples:

```text
100% Run Crystal conversion
upgrade costs
exact permanent upgrade values
```

Do not elevate current numeric implementation to final balance without current design confirmation.

---

# 41. Current Development Scope Philosophy

The prototype should not chase feature quantity.

Priority should be:

```text
validation need
→ required fidelity
→ smallest useful system
```

Examples:

A dedicated Tutorial Practice Target may be worth implementing before generic Stage 2 content if it is needed to validate ATR/LOS/Cover learning.

A broad settings menu may remain deferred because it does not currently answer a high-priority design question.

---

# 42. Current Migration Domains

After documentation refresh, prototype work is organized conceptually into:

```text
V0 Recovery / Baseline Audit
V1 Player Turn Economy
V2 Player Action Commitment
V3 Tactical Space
V4 Enemy Readability & Execution
V5 Core Tutorial Flow
V6 Status & Temporal Threat
V7 Wave
V8 Full Tutorial Integration
```

These are:

```text
migration / validation domains
```

not guaranteed one-patch implementation checkpoints.

Each domain must later be split into the smallest verifiable technical changes.

---

# 43. Current Project Checkpoint

Completed:

```text
Game Design v3.0 migration
Enemy design recovery
Tutorial T1–T3 recovery/correction
Prototype Validation Scope correction
repository/source/runtime recovery audit
documentation inventory
documentation migration matrix
```

Current:

```text
Handoff Package v3.0 documentation refresh
```

Next:

```text
finish core docs
→ cross-document consistency audit
→ new-chat recovery simulation
→ Game Designer review
→ local save / Git review
→ commit / push
→ prototype migration planning
```

No current combat migration should be claimed as started.

---

# 44. Current Uncommitted Work Context

The recovery audit found local uncommitted work in:

```text
src/main.js
src/style.css
src/ui/flow/basicFlowScreens.js
```

This work includes:

```text
Run Overview
Shop relocation
future-region presentation
Meta Crystal / Tutorial Status presentation
routing cleanup
```

It was runtime-confirmed.

It should be preserved deliberately.

Documentation authoring in this chat does not automatically mean those generated docs or local source changes are already committed.

---

# 45. Historical v2.5 Context

`v2.5-full-loop-core` remains an important implementation milestone.

It demonstrated the first integrated prototype loop including:

- Tutorial gate;
- battle;
- run branching;
- rewards;
- settlement;
- Meta Crystal;
- permanent upgrades.

However its old Project Context contains rules and roadmaps that are no longer current.

Therefore v2.5 docs are:

```text
HISTORICAL IMPLEMENTATION SNAPSHOT
```

not current project authority.

The tracked repository-root file:

```text
TMTB_PROJECT_CONTEXT_v1.0.md
```

is likewise:

```text
HISTORICAL / SUPERSEDED AS CURRENT PROJECT CONTEXT
```

The current project-level handoff is `TMTB_PROJECT_CONTEXT_v3.0.md`.

---

# 46. Historical Roadmap Context

The older sequence:

```text
Phase 2.6 Stabilization
→ Content Differentiation
→ Gameplay Depth
→ Roguelite Expansion
→ Balance and Polish
```

is no longer the current macro roadmap.

It has been superseded by current design recovery/migration needs.

Useful technical tasks from that roadmap remain in the new Progress & Backlog with updated classifications.

---

# 47. Current Non-Goals

Current prototype work should not automatically expand into:

- production Unity architecture;
- final asset pipeline;
- full audio system;
- networking;
- advanced production save/cloud systems;
- complete all-region content;
- final procedural generation;
- full analytics platform;
- final accessibility implementation;
- large auto-simulation framework;
- large speculative refactor.

These may become relevant later.

They are not current requirements unless a specific validation/academic/production handoff need emerges.

---

# 48. Telemetry Direction

Telemetry remains a possible prototype/academic evaluation tool.

Preferred principle:

```text
define what decision the data should support
→ record only meaningful evidence
→ analyze
```

Do not accumulate events because telemetry seems sophisticated.

Corrected Tutorial/PVS introduces the possibility of lightweight:

```text
FLOW events
SYSTEM events
```

to separate simulated onboarding completion from real mechanic evidence.

This is not currently implemented.

---

# 49. Auto-Simulation Direction

Auto-simulation remains optional future Game Designer tooling.

If created, it should preferably reuse the same combat rule logic as manual prototype play where practical.

Simulation can support:

- hypothesis comparison;
- regression;
- parameter exploration.

It cannot validate:

- readability;
- cognitive load;
- perceived fairness;
- learning;
- enjoyment

without human evidence.

---

# 50. Functional Handoff to Unity

The prototype should help a future Unity programmer answer:

```text
What is the intended flow?
What state matters?
What rule fires?
What is the expected result?
Which parts are prototype simplifications?
Which parts must be faithfully reproduced?
Which design items are still OPEN?
```

The programmer should not have to reverse-engineer design intent from old prototype behaviour.

Example:

```text
current JS Attack exhausts unit
```

must not be mistaken for final design because canonical docs say the current rule is movement lock without old Exhaustion.

---

# 51. Functional Handoff to UI/UX

The prototype should help UI/UX understand:

- which information is tactically important;
- which state changes need feedback;
- what the player must learn;
- how Intent/Target/Status/Wave differ;
- what is tutorial instruction vs gameplay objective;
- which prototype UI is only debugging/validation.

Prototype HUD structure is not final layout authority.

---

# 52. Functional Handoff to Game Design

The prototype should allow the Game Designer to ask:

```text
Did the player understand the decision?
Did the rule create the intended pressure?
Could the player exploit it?
Was the enemy readable?
Did the tutorial prove understanding or only completion?
Did the numbers create the intended difficulty?
```

Validation should focus on design evidence rather than implementation volume.

---

# 53. Current Documentation Read Relationship

This Project Context should be read with:

```text
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
TMTB_GAME_DESIGN_CONTEXT.md
TMTB_GAME_DESIGN_DECISIONS_v3.1.md
TMTB_CURRENT_STATE_v3.0.md
TMTB_PROTOTYPE_ARCHITECTURE_v3.0.md
TMTB_STATE_AND_DATA_MODEL_v3.0.md
TMTB_PROGRESS_AND_BACKLOG_v3.0.md
TMTB_CHAT_HANDOFF_v3.0.md
README.md
```

Document roles:

```text
Maintenance Protocol
→ how documentation authority/recovery works

Project Context
→ why the project exists / how domains relate

Game Design Context
→ intended game design

Game Design Decisions
→ compact current design snapshot

Current State
→ actual prototype behaviour

Architecture
→ where implementation lives

State & Data Model
→ current runtime/data model

Progress & Backlog
→ current progress and future work

Chat Handoff
→ how to resume/collaborate

README
→ package entry point
```

---

# 54. Current Supporting References

Detailed domain evidence may live in supporting handoffs.

Current important examples:

```text
TMTB_ENEMY_DESIGN_DISCUSSION_HANDOFF_2026-08-09_v4.md

TMTB_TUTORIAL_DESIGN_CORRECTED_HANDOFF_2026-08-11_v1.md

TMTB_PROTOTYPE_RECOVERY_REPOSITORY_AUDIT_HANDOFF_2026-08-11_v1.md
```

Read them when the task requires their detail.

Do not require every future chat to load all supporting handoffs if the active 10-file set already answers the task.

---

# 55. Current Core Principles

> **TMTB is the game. The prototype is a validation/reference tool.**

> **Main Game Design and Prototype Implementation Truth are separate domains.**

> **Latest explicit Game Designer decision has highest design authority.**

> **Actual current source/data/runtime has highest implementation authority.**

> **Prototype simplification is allowed; misleading validation is not.**

> **Important Unity-only flow may be simulated rather than omitted.**

> **Definition data and runtime state should remain separate.**

> **UI should display rules, not secretly define them.**

> **One verified change is more useful than a broad untested refactor.**

> **Predicted → Observed → Perceived.**

> **Audit first. Document second.**

---

# 56. Durable Resume Reference

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

# 57. Final Project Context Statement

TMTB is being developed as a 3D tactical game with roguelite run structure and permanent progression.

The current browser prototype is deliberately narrower and more abstract.

Its value is not that it perfectly resembles the final Unity game.

Its value is that it can preserve and test the decisions that matter:

```text
what the player can do
what resources matter
what the enemy communicates
what pressure the encounter creates
what the tutorial teaches
what progression means
what evidence the Game Designer needs
```

The project should evolve only as fast as those decisions can remain understandable, testable, and recoverable.

---

**End of Project Context**
