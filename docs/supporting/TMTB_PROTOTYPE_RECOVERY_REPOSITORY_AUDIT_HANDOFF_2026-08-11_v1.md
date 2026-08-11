# TMTB Prototype Recovery / Repository Audit Handoff

**Project:** TMTB / BeCan
**Document Type:** Supporting Prototype Recovery / Implementation Audit Handoff
**Created:** 11 August 2026
**Version:** v1
**Status:** **WORKING SUPPORTING HANDOFF — NON-CANONICAL**
**Purpose:** Preserve the verified prototype repository/source/runtime audit completed after Tutorial T1–T3 recovery, before the core project documentation package is refreshed.

---

# 1. Why This Audit Handoff Exists

The TMTB game-design recovery has reached a point where the latest combat direction, Enemy Intent direction, and corrected Tutorial T1–T3 / Prototype Validation Scope are available again.

However, the prototype implementation was known to lag behind the latest v3.0 design.

A repository/source/runtime audit was therefore performed before any new implementation work.

This document preserves the results so that:

- the audit does not need to be reconstructed from chat;
- future documentation can distinguish current implementation truth from design intent;
- the next documentation refresh can be evidence-based;
- future implementation work can begin from a verified baseline;
- loss of chat/project context does not require repeating the entire recovery process.

This document is supporting evidence, not canonical game-design authority.

---

# 2. Source-of-Truth Rule Used During Audit

## Game-Design Intent

```text
1. Latest explicit Game Designer decision
2. Latest canonical TMTB_GAME_DESIGN_CONTEXT
3. Latest canonical TMTB_GAME_DESIGN_DECISIONS
4. Latest relevant supporting domain handoff
5. Historical / legacy design docs
```

## Prototype Implementation Truth

```text
1. Actual source code / data
2. Confirmed runtime testing
3. Latest CURRENT_STATE
4. Latest Architecture / State & Data implementation handoff
5. Historical implementation docs
```

Important:

```text
v2.5 implementation docs
≠
automatic current implementation truth
```

The correct framing after audit is:

```text
Current prototype
=
post-v2.5 repository state
that must be verified from actual source/runtime.
```

---

# 3. Audit Scope

The audit covered:

```text
Git / repository state
repository tracked-file structure
post-v2.5 commit history
uncommitted working-tree changes
main battle/controller orchestration
battle setup / initial state
player movement
damage / action commitment
ATR / attack-space logic
path / obstacle / Cover logic
enemy movement
enemy attack
map data
encounter data
player unit data
enemy unit data
battle HUD
confirmed runtime baseline
Run Overview / Shop navigation
```

The audit intentionally did NOT attempt to:

- migrate combat to v3.0;
- redesign the tutorial;
- fix stale UI;
- refactor modules;
- implement Shared AP;
- implement Intent;
- implement Wave;
- implement LOS;
- modify any source file.

---

# 4. Git / Repository Baseline

Audit commands used:

```bash
git status
git log -1 --oneline
git branch --show-current
git tag --list
git ls-files
git log --oneline --decorate v2.5-full-loop-core..HEAD
git diff --name-status v2.5-full-loop-core..HEAD
git diff --stat v2.5-full-loop-core..HEAD
git diff --name-status
git diff --stat
```

Observed branch:

```text
main
```

Observed HEAD:

```text
cbd33ac Add GitHub Pages deployment
```

Observed tag:

```text
v2.5-full-loop-core
```

Repository was up to date with:

```text
origin/main
```

but the local working tree was not clean.

---

# 5. Committed Delta After v2.5 Tag

Commits after `v2.5-full-loop-core`:

```text
4de8acd Adding Game Design Context
4417dc6 Fix data loading for production deployment
cbd33ac Add GitHub Pages deployment
```

Tracked-file delta from the tag:

```text
A  .github/workflows/deploy.yml
A  docs/TMTB_GAME_DESIGN_CONTEXT.md
M  src/logic/shared/dataLoader.js
A  vite.config.js
```

Interpretation:

```text
[High confidence]

The committed post-v2.5 delta is primarily:
- documentation;
- deployment;
- production data loading.

No committed combat-system migration to v3.0 was found in this delta.
```

---

# 6. Uncommitted Working-Tree Changes

Modified files:

```text
src/main.js
src/style.css
src/ui/flow/basicFlowScreens.js
```

Diff size at audit time:

```text
src/main.js                     | 257 lines changed
src/style.css                   | 208 lines changed
src/ui/flow/basicFlowScreens.js | 405 lines changed

Total:
679 insertions
191 deletions
```

The working-tree patch was audited before continuing.

## Classification

The local changes primarily implement:

```text
Run Overview scene
Run Overview navigation
Shop relocation / access
post-Tutorial routing changes
post-run routing changes
Region 1 / Town / Castle presentation
Meta Crystal display
Tutorial completion status
stale Shop copy cleanup
Run Overview styling
```

They do NOT represent a Shared AP / Intent / Wave / Tutorial v3.0 combat migration.

Status after runtime test:

```text
IMPLEMENTED
RUNTIME CONFIRMED
UNCOMMITTED
```

Do not discard or restore these changes without deliberate review.

---

# 7. Run Overview Working-Tree Behaviour

The local flow now includes:

```text
Main Menu
→ Play
→ if Tutorial incomplete:
     Tutorial
→ if Tutorial complete:
     Run Overview
```

After Tutorial Victory:

```text
Tutorial Victory
→ Run Overview
```

From Run Overview:

```text
Start Journey
→ createNewRun()
→ Map Selection
```

Run Overview presents:

```text
Region 1 — Village
Unlocked / current prototype region

Region 2 — Town
Locked

Region 3 — Castle
Locked

Meta Crystal
Tutorial Status
Start Journey
Shop
Back to Main Menu
```

Runtime testing confirmed that Run Overview appears and functions.

Game Designer recalled that this work was intentionally created because Shop access was intended to move to this page.

---

# 8. Current Battle State Model

Actual `battleSetup.js` / controller audit showed that player units are initialized with state equivalent to:

```text
originTile
turnState: "ready"
hasActed: false
```

Current authoritative battle state does NOT contain a Shared Team AP model.

No confirmed current state was found for:

```text
Team AP
Team AP Max
StartGrid semantics
Movement AP commitment
Movement AP refund
global End Turn
```

---

# 9. `originTile` Finding

The current prototype already records a positional anchor:

```text
originTile
```

and refreshes it when a new Player Turn begins.

Current behavioural role:

```text
Player Turn begins
→ originTile recorded/refreshed
→ movement reachability is calculated relative to originTile
```

This is NOT yet canonical `StartGrid`.

However:

```text
[High confidence]

originTile is a strong implementation seed for future StartGrid migration.
```

Important distinction:

```text
CURRENT originTile
=
movement/reference anchor in old implementation

v3.0 StartGrid
=
turn-start tactical anchor
with Shared AP commitment/refund semantics
```

Do not silently rename it without auditing all dependencies.

---

# 10. Current Player Movement Behaviour

Movement logic currently:

- uses BFS / grid reachability;
- uses `originTile` as the movement reference;
- does not consume Team AP;
- permits repositioning before action;
- does not mark the player as acted merely by repositioning;
- prevents movement once the unit becomes Exhausted.

Current high-level loop:

```text
Player Turn
→ select ready unit
→ reposition relative to originTile
→ Attack or Wait
→ unit Exhausted
```

This means the prototype already separates:

```text
reposition
vs
action commitment
```

but does not yet implement v3.0 resource semantics.

---

# 11. Current Player Action / Exhaustion Model

Actual source confirms the old per-unit model.

Basic Attack resolution sets the attacker to a state equivalent to:

```text
turnState: "exhausted"
hasActed: true
```

Wait also Exhausts the unit.

The controller checks whether all living player units are Exhausted.

Current Player Turn ending logic:

```text
Attack / Wait
→ unit becomes Exhausted

when all living players are Exhausted
→ Enemy Phase begins automatically
```

Confirmed by runtime testing.

Therefore:

```text
[High confidence]

The old Exhaustion model remains authoritative in the current prototype.
```

---

# 12. Current v3.0 Player-Turn Gap

Current implementation:

```text
per-unit Ready / Exhausted
free reposition before action
Attack / Wait commits unit
all living units Exhausted
→ Enemy Phase
```

Current v3.0 design target:

```text
party-wide Player Turn
Shared Team AP = Living Player Units × 2
StartGrid per Player Turn
leave StartGrid spends 1 Team AP
return before Attack/Skill can refund
Attack/Skill locks Movement
Attack/Skill does NOT Exhaust unit
repeated actions may remain legal
global End Turn ends Player Turn
unused AP does not carry
```

This is a real state-model migration, not a UI-only change.

---

# 13. Shared Damage / Action Resolver Coupling

The current damage/action resolver is shared between player and enemy attack handling.

This creates an implementation warning:

```text
Do NOT simply remove Exhaustion from the shared attack resolver
without first accounting for enemy activation behaviour.
```

A player-only fix could unintentionally alter old enemy execution.

Future migration should separate:

```text
attack resolution
from
player action availability
from
enemy activation completion
```

as needed by the audited architecture.

---

# 14. Current ATR System

Current attack range uses an Euclidean distance calculation equivalent to:

```text
distance = hypot(deltaX, deltaY)
```

Current unit ATR data:

```text
Guard  = 1.5
Archer = 3.0
Sword  = 1.5
```

Exact future prototype ATR distance metric has not been locked by this audit.

Classification:

```text
CURRENT IMPLEMENTATION
Needs later validation against intended design.
```

---

# 15. Current Cover / Obstacle Model

Current map/path data supports:

```text
O30 = 30% Cover
O70 = 70% Cover
OF  = 100% / Full Cover
```

Current damage relationship uses the working formula:

```text
floor(max(0, ATK × (1 - Cover) - DEF))
```

Current ranged targeting can keep a target targetable through Full Cover while producing zero damage.

This already supports part of the design distinction:

```text
Target Validity
≠
Action Effectiveness
```

This is a useful reusable implementation seed.

---

# 16. LOS Gap

A distinct ranged LOS validity rule was NOT found.

Current obstacle/path evaluation primarily yields relationships such as:

```text
clear
partial cover
full cover
melee blocked
```

but not a separate authoritative state such as:

```text
No LOS
hasLineOfSight = false
LOS blocked
```

Therefore the corrected tutorial requirement:

```text
Inside ATR + No LOS
≠
Inside ATR + LOS + Cover
```

cannot currently be validated with sufficient fidelity.

Classification:

```text
LOS = MISSING AS DISTINCT SYSTEM
```

This is a real future Tactical Space migration domain.

---

# 17. Current Targeting / Exhaustion Coupling

Current attack-target queries reject an attacker that is Exhausted.

Therefore targeting/action validity is still coupled to the old per-unit action model.

This conflicts with the v3.0 target where:

```text
Attack
→ Movement locked
→ unit remains selectable
→ repeated Attack/Skill may remain legal if AP/rules allow
```

Future action-validity migration must remove old Exhaustion assumptions deliberately.

---

# 18. Current Enemy Movement Targeting

Enemy movement currently selects a nearest player.

Observed priority logic:

```text
1. nearest distance
2. battleUnitId tie-break
```

Destination selection is deterministic and considers priorities equivalent to:

```text
1. closest resulting distance to target
2. shorter movement distance
3. lower Y
4. lower X
```

This deterministic behaviour is potentially useful for future readable AI.

However, it is procedural targeting, not yet the canonical Intent grammar.

---

# 19. Current Enemy Attack Targeting

Enemy attack selects valid targets again during the attack pass.

Observed priority:

```text
1. nearest valid attack target
2. lower HP
3. battleUnitId
```

Important consequence:

```text
Movement target
may differ from
Attack target
```

Conceptual example:

```text
Sword moves toward Guard
→ board changes
→ later attack pass recalculates
→ Archer may become preferred valid target
```

This is not automatically a bug in the old implementation.

However, it is insufficient for the current readable grammar:

```text
Target Rule
Movement Rule
Action Rule
Intent
Fallback
```

and requires redesign for coherent Current Target / Dynamic Intent behaviour.

---

# 20. Current Enemy Phase Orchestration

Source audit confirms the current internal enemy turn is:

```text
Enemy A moves
Enemy B moves
Enemy C moves

↓

Enemy A attacks
Enemy B attacks
Enemy C attacks
```

Within each pass, later enemies read the updated board.

Therefore current behaviour has partial sequential state awareness.

But it is NOT the v3.0 sequential activation model:

```text
Enemy A
→ Movement
→ Action

Enemy B reads resulting board
→ Movement
→ Action

Enemy C
→ Movement
→ Action
```

Classification:

```text
Current:
sequential within movement pass
+
sequential within attack pass

Target:
sequential full activation
```

---

# 21. Runtime Readability of Enemy Phase

The player does not see separate player-facing phases such as:

```text
Enemy Movement Phase
Enemy Attack Phase
```

During runtime testing the player simply observes:

```text
Enemy Phase
→ resolution delay
→ enemies have moved and attacked
```

This matches the current old prototype state.

No readable Intent / Current Target layer is present.

Game Designer confirmed that Intent and the revised enemy-phase discussion happened later in game design and had not yet reached this prototype.

---

# 22. Spawn Order Seed

Current encounter enemy units are created from the encounter spawn array.

Current encounter spawn order:

```text
1. E1 Sword
2. E2 Sword
```

Current enemy processing uses the enemy-unit array order.

Therefore:

```text
enemySpawns array order
→ enemyUnits insertion order
→ current processing order
```

This is a useful seed for future canonical `Spawn Order`.

However:

```text
Explicit Spawn Order state/property
=
not currently implemented.
```

Dynamic Wave spawning also does not yet exist in the audited prototype.

---

# 23. Intent / Current Target / Dynamic Intent Status

No authoritative current system was found for:

```text
Intent
Current Target UI/readability
Dynamic Intent
enemy Pattern
Wave-linked incoming Intent
```

Current enemy decisions are procedural and split across movement/attack logic.

Classification:

```text
Intent system = MISSING
Dynamic Intent = MISSING
```

---

# 24. Current Map / Encounter Baseline

Current fixed map:

```text
7 × 5
```

Approximate layout:

```text
      x0   x1   x2   x3   x4   x5   x6
y0    .    .    .   O30   .    E1   .
y1    .    P1   .    .    .    .    .
y2    .    .   O70   .    OF   .    .
y3    .    P2   .    .    .    .    .
y4    .    .    .   O30   .    E2   .
```

Where:

```text
P1 = Guard
P2 = Archer
E1 = Sword Enemy
E2 = Sword Enemy
```

This is NOT the new tutorial `Offset Courtyard` design.

It is the current old implementation baseline.

---

# 25. Current Encounter Rules

Current encounter:

```text
Players:
Guard
Archer

Enemies:
2 × Sword Enemy

Objective:
eliminate_all

Victory:
all_required_enemies_defeated

Defeat:
all_players_defeated

Reward:
20 Crystal
```

All audited IDs/references resolved consistently between encounter/map/unit data.

---

# 26. Current Unit Stats

| Unit | HP | ATK | DEF | Move | ATR | Type |
|---|---:|---:|---:|---:|---:|---|
| Guard | 25 | 5 | 4 | 3 | 1.5 | melee |
| Archer | 18 | 7 | 1 | 4 | 3.0 | ranged |
| Sword | 16 | 6 | 2 | 3 | 1.5 | melee |

Current data also includes path-related flags such as:

```text
Guard:
requiresPathCheck = true

Archer:
requiresPathCheck = false

Sword:
requiresPathCheck = true
```

The exact future meaning/naming of these flags should be reviewed during LOS/targeting migration.

Do not reinterpret them without source audit.

---

# 27. Cover Teaching Observation

Using current Archer vs Sword stats:

```text
Archer ATK = 7
Sword DEF = 2
```

Approximate current damage outcomes:

```text
Clear:
7 - 2
= 5

O30:
floor(7 × 0.7 - 2)
= 2

O70:
floor(7 × 0.3 - 2)
= 0

Full Cover:
0
```

Therefore:

```text
O70
and
Full Cover
```

can both produce 0 damage in this matchup.

This is not necessarily a bug.

However, it is a tutorial-design readability concern because the player may perceive O70 and Full Cover as functionally identical in that example.

This supports the decision not to treat the current Stage 1 layout as the final ATR/LOS/Cover teaching environment.

---

# 28. Current Tutorial Status

Runtime test confirmed that the current Tutorial battle is still the old/placeholder implementation.

It does NOT yet contain the corrected T1–T3 flow.

Missing from current implementation include:

```text
Control & Party Orientation flow
Camera Flow Simulation
Shared AP lesson
StartGrid/refund lesson
global End Turn lesson
Attack position-commitment v3.0 lesson
Practice Target lesson
distinct LOS lesson
Current Target / Dynamic Intent lesson
Status lesson
Charge lesson
Wave Telegraph lesson
combined-pressure culmination
```

This is expected.

The corrected tutorial is design intent / validation planning, not implementation truth.

---

# 29. Current Battle HUD

Current HUD remains tied to the old model.

Observed HUD concepts include:

```text
ready / exhausted
Origin
Current position
Turn State
```

Current command band includes:

```text
Attack
Skill
Wait
```

Not currently represented:

```text
Team AP
StartGrid terminology
global End Turn
Movement Lock state
Intent
Current Target
Wave Telegraph
```

The visible `originTile` information may be useful as a debugging seed when StartGrid is eventually migrated.

---

# 30. Known Stale HUD / UI Copy

Audit found stale UI copy that no longer matches actual runtime flow.

Examples include old messaging equivalent to:

```text
all player units exhausted
enemy phase not implemented
refresh browser
```

despite Enemy Phase now functioning.

Tutorial Victory UI also contains wording that points toward:

```text
Continue to Map Selection
```

while the confirmed working-tree routing now goes:

```text
Tutorial Victory
→ Run Overview
```

Classification:

```text
KNOWN STALE UI COPY
```

Do not treat these strings as implementation truth.

---

# 31. Runtime Baseline Test

Confirmed by Game Designer on 11 August 2026.

## Startup

```text
Prototype launches normally.
Main Menu opens.
No console error observed.
```

## Run Overview

```text
Run Overview appears.
Navigation works.
Shop relocation flow works.
```

Game Designer recalled this as intentional previous prototype work.

## Tutorial Battle

```text
Tutorial battle can be entered.
```

## Player Turn

Confirmed:

```text
movement/reposition does not use Shared AP
no Shared AP model is present
Attack / Wait commit the unit through old model
all living player units completed/exhausted
→ Enemy Phase
```

## Enemy Phase

Player-facing behaviour:

```text
single Enemy Phase
→ resolution
→ enemies have moved and attacked
```

No readable enemy sub-phases / Intent presentation are present.

## Post-Battle / Flow

Runtime remained safe and functional through tested navigation.

---

# 32. Verified Current Implementation Snapshot

```text
CURRENT PROTOTYPE — VERIFIED 11 AUGUST 2026

META / FLOW
- post-v2.5 Run Overview exists
- Shop moved to Run Overview
- runtime confirmed
- these changes remain uncommitted

PLAYER TURN
- per-unit Ready / Exhausted
- originTile refreshed at Player Turn
- Movement costs no Shared AP
- Attack / Wait Exhaust unit
- all living player units Exhausted → Enemy Phase

MOVEMENT
- BFS/grid movement
- originTile-based movement anchor
- reposition before action
- no Shared AP commitment/refund

ATTACK
- Attack uses old Exhaustion commitment
- repeated Attack is not available after Exhaustion
- targeting still checks Exhaustion

ENEMY TURN
- one player-visible Enemy Phase
- internally all enemy Movement first
- then all enemy Attack
- later enemies read updated state inside each pass
- no full sequential Move+Action activation
- no Intent layer

TARGETING / SPACE
- ATR exists
- Cover exists
- Full Cover may stay targetable with 0 damage
- distinct LOS validity system is missing

ENCOUNTER
- fixed 7×5 map
- Guard + Archer
- 2 Sword enemies
- static encounter

TUTORIAL
- old/placeholder battle
- corrected T1–T3 not implemented

HUD
- ready/exhausted language
- Attack / Skill / Wait
- no Team AP / End Turn / Intent
- some stale copy

RUNTIME
- current working tree launches and tested baseline works
```

---

# 33. Current Design-vs-Implementation Gap Matrix

| Domain | Actual Prototype | Current Design Target | Gap |
|---|---|---|---|
| Player Turn ownership | per-unit Ready/Exhausted | party-wide Player Turn | Material |
| Shared resource | none | Team AP = Living Players × 2 | Missing |
| Turn positional anchor | `originTile` | StartGrid | Reusable seed; semantics incomplete |
| Movement AP | free | leave StartGrid spends 1 AP | Missing |
| Movement refund | none | return before commitment refunds AP | Missing |
| Attack commitment | Exhaust unit | Movement lock only | Incompatible |
| Repeated action | blocked by Exhaustion | allowed if AP/legal | Missing |
| Wait | Exhaust unit | old Wait superseded | Obsolete implementation |
| Hold | not current real lesson | direction exists; exact effect OPEN | Not ready |
| Player Turn end | automatic all Exhausted | global End Turn | Incompatible |
| ATR | implemented | required | Reusable; metric needs later validation |
| Cover | implemented | required | Strong reusable seed |
| Full Cover | targetable / 0 damage possible | targetability/effectiveness separated | Good alignment |
| LOS | not distinct | ranged requires LOS; LOS ≠ Cover | Missing |
| Enemy movement targeting | procedural nearest target | explicit readable grammar | Partial seed |
| Enemy attack targeting | independently recalculated | coherent Target/Action/Intent logic | Needs redesign |
| Enemy execution | all Move then all Attack | sequential Move+Action | Incompatible orchestration |
| Enemy order | array/spawn-list order | Spawn Order | Reusable seed; not explicit |
| Current Target | not player-readable system | actual Target Rule output | Missing |
| Intent | absent | required readable plan | Missing |
| Dynamic Intent | absent | required | Missing |
| Status | absent from tutorial/system target examined | required advanced lesson | Missing |
| Charge | absent | required advanced lesson | Missing |
| Wave Telegraph | absent | required advanced lesson | Missing |
| Tutorial flow | placeholder | corrected T1–T3 continuous Stage | Missing |
| Unity-only onboarding flow | absent | Flow Simulation where needed | Missing |
| Run Overview | implemented locally | compatible prototype meta-flow | Implemented / confirmed |
| Shop relocation | implemented locally | intentional prototype flow | Implemented / confirmed |

---

# 34. Reusable Migration Seeds

The audit found several parts worth preserving rather than rebuilding blindly.

## Strong Seeds

```text
originTile
→ candidate basis for StartGrid

BFS movement
→ likely reusable for prototype tactical movement

existing attack/damage pipeline
→ reusable after action-state decoupling

existing Cover/path geometry
→ reusable foundation for Tactical Space

Full Cover targetable + 0 damage behaviour
→ already aligned with target-validity/effectiveness separation

deterministic enemy movement
→ useful foundation for readable enemy behaviour

enemy array / spawn-list order
→ candidate basis for explicit Spawn Order

existing fixed JSON data loading
→ reusable for migration/testing
```

## Important Warning

Reusable does NOT mean:

```text
already canonical
```

Each seed must be migrated deliberately.

---

# 35. Systems That Need Real Migration

The following should not be treated as simple UI additions:

```text
Shared Team AP
StartGrid commitment/refund semantics
global End Turn
removal of per-unit Exhaustion player model
Attack movement lock without Exhaustion
repeated action legality
distinct LOS
enemy sequential activation
Target Rule / Current Target coherence
Intent
Dynamic Intent
Status
Charge
Wave Telegraph
corrected Tutorial flow/state
```

---

# 36. V0 Audit Status

The recovery audit is considered sufficient for documentation refresh and migration planning.

Completed:

```text
V0.1A Repository structure audit
V0.1B Git/history audit
V0.1C Uncommitted worktree classification

V0.2 Controller/source audit
V0.2 Battle-state audit
V0.2 Movement/action audit
V0.2 Targeting/Cover audit
V0.2 Enemy logic audit
V0.2 Data audit
V0.2 HUD audit

V0.3 Confirmed runtime baseline
```

The audit intentionally stops here.

Further source inspection should be driven by a specific documentation or migration question, not performed indiscriminately.

---

# 37. Important Documentation Consequence

The audit confirms that the project currently has a real split:

```text
CURRENT DESIGN INTENT
≈ v3.0 + later tutorial correction

CURRENT PROTOTYPE IMPLEMENTATION
≈ post-v2.5 implementation
with some later meta-flow work
```

Therefore the next project-source refresh must NOT imply:

```text
prototype already implements v3.0 combat
```

Documentation must distinguish:

```text
Implemented
Tested
Confirmed
Planned
Design Target
Migration Gap
```

---

# 38. Documentation Refresh Goal

The next task is NOT coding.

The next task is to create a refreshed portable project-source package so that future recovery does not require:

- reconstructing old chats;
- manually re-briefing Shared AP;
- manually re-briefing Enemy Intent;
- manually re-briefing Tutorial T1–T3;
- uploading individual source files merely to establish the known baseline.

The target is a compact current set of core project files plus supporting handoffs.

---

# 39. Planned Core Documentation Package

Current proposed portable core:

```text
1. README.md

2. TMTB_PROJECT_CONTEXT_[latest].md

3. TMTB_CHAT_HANDOFF_[latest].md

4. TMTB_CURRENT_STATE_[latest].md

5. TMTB_PROTOTYPE_ARCHITECTURE_[latest].md

6. TMTB_STATE_AND_DATA_MODEL_[latest].md

7. TMTB_PROGRESS_AND_BACKLOG_[latest].md

8. TMTB_GAME_DESIGN_CONTEXT.md

9. TMTB_GAME_DESIGN_DECISIONS_[latest].md

10. TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
```

Supporting handoffs currently expected to remain separate include:

```text
TMTB_ENEMY_DESIGN_DISCUSSION_HANDOFF_2026-08-09_v4.md

TMTB_TUTORIAL_DESIGN_CORRECTED_HANDOFF_2026-08-11_v1.md

this Prototype Recovery / Repository Audit Handoff
```

Exact naming/versioning must be decided during the documentation inventory pass.

---

# 40. Versioning Warning

Do not mechanically rename all v2.5 implementation documents to:

```text
v3.0
```

if that implies the prototype implementation itself has reached v3.0.

The new documentation package must distinguish:

```text
Game Design version
Documentation/handoff version
Prototype implementation state
```

A date-based or explicit pre-migration handoff label may be safer for implementation-facing docs.

Exact scheme remains to be decided.

---

# 41. Exact Resume Point

Next task:

```text
DOCUMENTATION INVENTORY
+
MIGRATION MATRIX
```

Do NOT begin implementation migration yet.

The next discussion should:

1. inventory the current core/supporting project files;
2. determine which files are canonical vs supporting vs historical;
3. classify each as `KEEP / UPDATE / REPLACE / SUPPORTING-ONLY / HISTORICAL`;
4. map which recovered decisions/audit findings belong in each file;
5. decide naming/version strategy;
6. define safe authoring order;
7. update one document domain at a time;
8. perform a cross-document consistency audit;
9. test whether the refreshed package is sufficient for a new-chat recovery scenario;
10. only after documentation is secure, resume prototype migration planning.

---

# 42. Resume Instructions for a Future Chat / Assistant

If resuming from this audit handoff:

1. Do not assume current prototype equals v2.5 exactly.
2. Do not assume current prototype implements v3.0.
3. Treat actual source/runtime as implementation truth.
4. Preserve confirmed local Run Overview / Shop relocation work.
5. Current combat still uses old per-unit Exhaustion.
6. `originTile` exists and is a likely StartGrid migration seed.
7. Current movement is BFS/grid-based and free before action.
8. Attack/Wait currently Exhaust units.
9. Enemy Phase is internally all Move then all Attack.
10. Distinct LOS is missing.
11. Cover and Full-Cover-zero-damage behaviour already exist.
12. Intent / Dynamic Intent / Wave are not implemented.
13. Corrected Tutorial T1–T3 is not implemented.
14. The next task is documentation inventory/migration, not coding.
15. Do not rewrite implementation docs as v3.0 without preserving the design-vs-implementation gap.

---

# 43. Core Audit Summary

```text
RECOVERED DESIGN
Shared AP / StartGrid / End Turn
Enemy Intent / sequential activation
Tutorial T1–T3 / PVS
        ↓

REPOSITORY AUDIT
post-v2.5 repo confirmed
deployment/docs commits
uncommitted Run Overview work
        ↓

SOURCE AUDIT
old Exhaustion combat confirmed
originTile seed found
BFS movement reusable
Cover exists
LOS missing
old enemy Move-all / Attack-all confirmed
Intent absent
        ↓

RUNTIME AUDIT
prototype launches safely
Run Overview confirmed
old combat model confirmed
Enemy Phase behaviour confirmed
        ↓

CONCLUSION
Enough implementation truth recovered
to refresh project documentation safely
        ↓

NEXT
Documentation Inventory
+
Migration Matrix
```

Primary principle:

> Audit first. Document second. Implement only after the refreshed documentation package accurately preserves both the current design intent and the verified prototype implementation truth.

---

**End of Handoff**
