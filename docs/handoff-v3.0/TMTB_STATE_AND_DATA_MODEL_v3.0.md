# TMTB State & Data Model — Handoff v3.0

**Project:** TMTB / BeCan Prototype
**Document Type:** Handoff Snapshot — State & Data Model
**Handoff Package Version:** 3.0
**Game Design Reference:** `TMTB_GAME_DESIGN_CONTEXT.md` v3.1 / `TMTB_GAME_DESIGN_DECISIONS_v3.1.md`
**Prototype Implementation Baseline:** **Post-v2.5 / Pre-v3 Combat Migration**
**Audit / Verification Date:** 11 August 2026
**Project Root:** `C:\Datas\prototype-tmtb`
**Status:** **CURRENT STATE/DATA SNAPSHOT — EVIDENCE-AWARE**

---

# 1. Purpose

Dokumen ini menjelaskan:

- current runtime state;
- ownership state;
- mutation flow;
- JSON definition data;
- derived runtime data;
- profile persistence;
- run state;
- battle state;
- battle-unit state;
- scene / flow state;
- current old action state;
- current limitations;
- future design-target state yang **belum implemented**.

Dokumen ini implementation-facing.

Canonical game-design intent tetap berada di:

```text
TMTB_GAME_DESIGN_CONTEXT.md
TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

Jika actual source/data terbaru bertentangan dengan dokumen ini:

```text
actual source/data wins
```

---

# 2. Core State/Data Principle

Current architecture broadly follows:

```text
Definition Data
→ Runtime Construction
→ Runtime State
→ Rule Mutation
→ UI Rendering
```

Example:

```text
player_units.json
→ battleSetup.js
→ runtime player battle unit
→ movement / attack / damage mutation
→ mapRenderer / battleHud
```

Important:

```text
definition object
≠
mutable runtime battle unit
```

Future migration should preserve this distinction.

---

# 3. Evidence Labels

## AUDITED CURRENT SOURCE / DATA — 11 AUG 2026

Actual current source/data was inspected directly.

## RUNTIME CONFIRMED — 11 AUG 2026

Relevant behaviour was observed during current prototype runtime smoke test.

## CARRIED FROM v2.5 — NO RELEVANT GIT DELTA FOUND

State/domain is carried from v2.5 documentation because no relevant committed module delta was found after tag `v2.5-full-loop-core`.

Not every path was retested on 11 August.

## HISTORICALLY TESTED v2.5

Behaviour was previously confirmed at v2.5 checkpoint.

## NOT IMPLEMENTED

The design-target state/system is not currently authoritative in source.

## UNCOMMITTED CURRENT WORK

State/flow exists in local working tree but has not yet been committed.

---

# 4. State Domains

Current prototype has several major state domains:

```text
Application / Scene State
Profile State
Run State
Battle State
Battle Unit State
Battle Control State
Battle Result State
Definition Data
Deployment / Configuration Data
```

No dedicated authored Tutorial Flow State exists yet.

---

# 5. Application / Scene State

## AUDITED CURRENT SOURCE

Primary ownership:

```text
src/main.js
```

Current module-level state includes values equivalent to:

```text
appData
profileState
runState
battleIntroNodeId
battleState
enemyPhaseTimerId
currentScene
```

These values drive routing and active runtime flow.

---

# 6. `currentScene`

## AUDITED CURRENT SOURCE

Current known scene values:

```text
title
main_menu
run_overview
map_selection
battle_intro
battle
reward_selection
run_completion
run_defeat
post_run_shop
```

`run_overview` is local post-v2.5 work.

### Ownership

```text
main.js
```

### Mutation role

Scene transitions change which UI renderer is called.

### Persistence

```text
NOT persisted
```

Refreshing browser can lose current active-flow position.

---

# 7. `appData`

## AUDITED CURRENT SOURCE

`appData` stores definition data loaded during startup.

Current known keys:

```text
playerUnits
enemyUnits
stage1Map
stage1Encounter
```

Conceptual source:

```text
loadInitialPrototypeData()
→ appData
```

This is loaded definition data, not live battle state.

---

# 8. `profileState`

## CARRIED + CURRENT FLOW USAGE CONFIRMED

Persistent profile state is loaded through:

```text
src/logic/profile/profileStorage.js
```

Current profile concepts include:

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

Local Run Overview reads at least:

```text
tutorialCompleted
metaCrystal
```

### Persistence

```text
browser localStorage
```

Historical storage key:

```text
tmtb_profile_v1
```

### Authority

`profileStorage.js` owns sanitization/save/reset/purchase-related profile mutations.

---

# 9. Tutorial Completion State

Current persistent field:

```text
tutorialCompleted
```

## CURRENT BEHAVIOUR

If false:

```text
Main Menu
→ Start Journey
→ Tutorial placeholder battle
```

If Tutorial victory occurs:

```text
tutorialCompleted = true
→ save
→ Run Overview
```

If true:

```text
Main Menu
→ Start Journey
→ Run Overview
```

### Important distinction

This field only records whether current prototype Tutorial gate is completed.

It does **not** record corrected T1–T3 learning evidence.

---

# 10. Meta Crystal State

Persistent field:

```text
metaCrystal
```

Used by:

- Run Overview presentation;
- post-run settlement;
- permanent Shop upgrade purchase.

### Current role

Persistent between runs.

### Design note

Exact final main-game economy/presentation remains a separate game-design concern.

---

# 11. Permanent Upgrade State

## CARRIED FROM v2.5

Persistent upgrade model includes Guard and Archer permanent upgrades.

Current categories:

```text
maxHP
atk
def
```

Current maximum level:

```text
4
```

Current prototype effect per level:

```text
Max HP +2
ATK    +1
DEF    +1
```

Move and ATR remain unchanged.

### Runtime application

Run-stage battle construction applies permanent upgrades.

Tutorial battle uses base stats.

---

# 12. Run State

## CARRIED — NO RELEVANT GIT DELTA FOUND

Primary ownership:

```text
src/logic/run/runState.js
```

Primary active variable:

```text
runState
```

Current run state is in-memory.

### Persistence

```text
NOT persisted
```

No Continue Run / active-run recovery exists.

---

# 13. Current Run Graph Concepts

Historical/current carried graph contains:

```text
Stage 1 fixed
Stage 2 branch variants
Stage 3 branch variants
Stage 4 fixed
```

Node state vocabulary:

```text
future
available
current
completed
blocked
failed
```

Run state contains enough information to:

- know current/available node;
- block sibling branch;
- record chosen route;
- store run Crystal;
- store reward choices;
- track completion/defeat state.

Exact current field names beyond audited source should be checked directly before editing `runState.js`.

---

# 14. Run Crystal

## CARRIED / HISTORICALLY TESTED

Current run state includes:

```text
runCrystal
```

Run-stage rewards increase Run Crystal.

Settlement converts remaining Run Crystal to Meta Crystal in the current prototype.

Current historical conversion baseline:

```text
100%
```

This is prototype implementation truth, not necessarily final economy lock.

---

# 15. Run Settlement Protection State

## CARRIED / HISTORICALLY TESTED

Historical current state contains settlement guard fields such as:

```text
crystalConversionCompleted
convertedRunCrystal
metaCrystalBeforeConversion
metaCrystalAfterConversion
```

Purpose:

- prevent double conversion;
- preserve result presentation/evidence.

These fields should be re-audited directly if settlement logic is modified later.

---

# 16. Reward State

## CARRIED

Current run flow supports:

```text
reward options generated
→ one option selected
→ selected reward ID stored
```

Reward selection influences progression state.

Current reward gameplay effects remain inactive according to carried implementation baseline.

Therefore:

```text
reward selection state
exists

reward combat modifier state
not active
```

---

# 17. Battle Intro State

Current controller keeps:

```text
battleIntroNodeId
```

## AUDITED CURRENT SOURCE

Purpose:

- remember which run node is entering battle;
- render Battle Intro context;
- bridge Map Selection to battle creation.

### Persistence

```text
in-memory only
```

Opening Run Overview clears it.

---

# 18. Battle State

## AUDITED CURRENT SOURCE

Primary ownership:

```text
src/main.js
+
src/logic/battle/battleSetup.js
```

Initial battle state currently includes values equivalent to:

```text
phase
turnCount
selectedUnitId
battleControlState
actionMenuIndex
selectedAction
playerUnits
enemyUnits
resultState
```

Current initial values include:

```text
phase = "player_phase"
turnCount = 1
battleControlState = "unit_selected_movement"
actionMenuIndex = 0
selectedAction = null
resultState = "ongoing"
```

No Shared Team AP state currently exists.

---

# 19. `phase`

## AUDITED CURRENT SOURCE

Current high-level battle phase vocabulary includes at least:

```text
player_phase
enemy_phase
```

### Current transition

```text
all living Player Units exhausted
→ enemy_phase
```

After enemy resolution:

```text
turnCount + 1
→ player units reset
→ player_phase
```

### Important distinction

This is current old implementation.

It is not canonical v3.1 party-wide turn semantics.

---

# 20. `turnCount`

## AUDITED CURRENT SOURCE

Current numeric battle turn counter.

Initial:

```text
1
```

Incremented after current Enemy Phase resolution before next Player Phase.

### Design relationship

Future design may continue using a turn counter, but current value does not itself encode Shared AP or StartGrid semantics.

---

# 21. `selectedUnitId`

## AUDITED CURRENT SOURCE

Tracks selected runtime battle unit.

Current selection system is tied to:

- ready/exhausted status;
- movement state;
- attack targeting;
- automatic next-ready-unit selection.

### Future pressure

v3.1 allows selection of Stunned units and continued selection after Attack.

Therefore future selection legality must not remain equivalent to "ready unit only".

---

# 22. `battleControlState`

## AUDITED CURRENT SOURCE

Current controller uses a battle input/control state.

Known current states include movement/action-targeting contexts such as:

```text
unit_selected_movement
action menu context
attack targeting context
```

Exact full vocabulary should be re-read from `main.js` before implementation edits.

### Current role

Determines how keyboard input is interpreted and what HUD/action UI is rendered.

### Future pressure

Current design will require states for:

- party-wide action flow;
- global End Turn;
- Movement Lock;
- possibly tutorial flow/evidence interaction.

Do not assume the existing control-state vocabulary is sufficient.

---

# 23. `actionMenuIndex`

## AUDITED CURRENT SOURCE

Stores current action-menu cursor/index.

Current action vocabulary:

```text
attack
skill
wait
```

UI uses this for selection/highlight.

---

# 24. `selectedAction`

## AUDITED CURRENT SOURCE

Stores current selected action/context.

Current active action resolution:

```text
Attack
Wait
```

`Skill` remains present but inactive in normal resolver.

---

# 25. `resultState`

## AUDITED CURRENT SOURCE

Current battle result state begins:

```text
ongoing
```

and transitions according to objective/player-survival evaluation.

Conceptual result values include:

```text
ongoing
victory
defeat
```

Result drives:

- Tutorial result;
- reward flow;
- run completion/defeat path.

---

# 26. Player Units Array

Battle state contains:

```text
playerUnits[]
```

## AUDITED CURRENT SOURCE

Each entry is mutable runtime state built from definition data + spawn + optional permanent upgrades.

This array is authoritative for current player battle-unit state.

---

# 27. Enemy Units Array

Battle state contains:

```text
enemyUnits[]
```

## AUDITED CURRENT SOURCE

Each entry is mutable runtime enemy battle-unit state.

Initial order follows encounter `enemySpawns[]` construction order.

Current enemy movement/attack passes iterate through this array order.

This is a useful Spawn Order seed, but no explicit `spawnOrder` field exists.

---

# 28. Runtime Battle Unit Schema

## AUDITED CURRENT SOURCE

Current battle units contain fields equivalent to:

```text
battleUnitId
unitDefId
name
side
role

tileX
tileY
originTile

currentHP
maxHP

turnState
hasActed

derivedStats

attackType
targetPattern
targetCategory
usesProjectile
requiresPathCheck

spawnLabel
```

Some fields originate from definition data and are copied into runtime state.

---

# 29. `battleUnitId`

Runtime-unique unit identifier.

Used for:

- selection;
- targeting;
- enemy tie-breaks;
- array/state lookup.

Current tie-break logic may use lexical/comparable `battleUnitId`.

Future explicit Spawn Order should not be assumed identical to battleUnitId ordering.

---

# 30. `unitDefId`

Reference back to definition unit ID.

Example:

```text
guard
archer
sword_enemy
```

Purpose:

- preserve identity to source definition;
- allow runtime unit to remain distinct from definition object.

---

# 31. `side`

Current values include:

```text
player
enemy
```

Used by battle logic to distinguish actor/target sides.

Current damage resolver is shared across sides.

---

# 32. `role`

Current definition/runtime role includes concepts such as:

```text
melee
ranged
```

or unit-specific role labels depending on definition.

Role should not automatically substitute for final enemy grammar.

---

# 33. Position State

Current runtime position uses:

```text
tileX
tileY
```

These are authoritative prototype tactical grid coordinates.

The web prototype directly manipulates tile coordinates.

This is prototype implementation, not final Unity free-movement representation.

---

# 34. `originTile`

## AUDITED CURRENT SOURCE

Current structure conceptually stores:

```text
originTile = {
  x,
  y
}
```

Purpose:

- per-turn movement reference;
- movement reachability origin;
- debug/HUD display.

At battle setup:

```text
originTile = initial tile
```

At new Player Turn:

```text
originTile refreshed to current tile
```

### Important status

`originTile` is **not** yet full v3.1 StartGrid semantics.

Missing:

```text
Team AP commitment
leave StartGrid cost
return refund
movement-lock refund conditions
```

---

# 35. HP State

Runtime battle unit uses:

```text
currentHP
maxHP
```

`maxHP` is derived from:

```text
base definition
+
permanent upgrades if applicable
```

Current battle damage mutates:

```text
currentHP
```

Living/dead checks use HP state.

No cross-battle HP carry is currently implemented.

---

# 36. `derivedStats`

## AUDITED CURRENT SOURCE

Runtime derived stats include combat values such as:

```text
atk
def
move
atr
```

Max HP is also derived/applied in runtime construction.

Permanent upgrades modify:

```text
maxHP
atk
def
```

Current Move/ATR remain base definition values.

---

# 37. `turnState`

## AUDITED CURRENT SOURCE + RUNTIME CONFIRMED

Current old action-availability field.

Known values:

```text
ready
exhausted
```

Current player flow:

```text
ready
→ Attack or Wait
→ exhausted
```

At new Player Turn:

```text
living player units
→ ready
```

Enemy resolver also uses Exhausted-style completion state in current old implementation.

### Critical migration note

Current design v3.1 supersedes per-unit Exhaustion as the normal player-turn ownership model.

Do not document `turnState` as future canonical player action state.

---

# 38. `hasActed`

## AUDITED CURRENT SOURCE

Boolean old action-completion marker.

Current initial:

```text
false
```

After Attack / Wait:

```text
true
```

This field overlaps semantically with `turnState`.

Its future relevance should be re-evaluated during player-action migration.

---

# 39. Attack Definition Fields

Runtime copied fields include:

```text
attackType
targetPattern
targetCategory
usesProjectile
requiresPathCheck
```

These support current generic attack behaviour.

### Important warning

Do not treat these current fields as the complete canonical v3.1 action/enemy grammar.

Current design needs explicit concepts such as:

```text
Target Rule
Movement Rule
Action Set/Rule
Fallback
Intent
Status
Override
Pattern
```

which are not represented completely by the existing fields.

---

# 40. `spawnLabel`

Current runtime unit retains the map spawn label used during setup.

Examples:

```text
P1
P2
E1
E2
```

Current use:

- map-position resolution;
- runtime provenance/debug.

Future dynamic Wave spawn order may require additional state.

---

# 41. Current Action Availability Model

Current player action legality is distributed across:

```text
turnState
battleControlState
ATR targeting
movement legality
action menu selection
```

There is no current centralized v3.1 action-legality state.

Current practical model:

```text
ready
→ can reposition
→ can choose Attack / Wait
→ Exhausted
```

`Skill` is not active.

---

# 42. Current Movement State

Movement is not stored as a separate movement transaction object.

Current position mutation is immediate:

```text
selected unit
→ legal destination
→ tileX/tileY change
```

Movement reachability is recalculated from:

```text
originTile
```

There is no current authoritative:

```text
movementAPSpent
movementCommitted
movementRefundEligible
movementLocked
```

state.

---

# 43. Current Attack Targeting State

Current target candidates are derived from runtime battle state.

Targeting uses:

```text
attacker position
target position
ATR
old Exhaustion state
path/Cover evaluation
living state
```

Target-list state is not persisted as a long-lived canonical target object.

Enemy target decisions are recalculated procedurally.

---

# 44. Current Cover Data

Map obstacle codes:

```text
O30
O70
OF
```

Current meaning:

```text
O30 → 30% Cover
O70 → 70% Cover
OF  → 100% Cover
```

Cover result is derived from attack path.

Cover is not stored as a permanent mutable unit status.

---

# 45. Current LOS State

## NOT IMPLEMENTED AS DISTINCT AUTHORITATIVE STATE

There is no current runtime field such as:

```text
hasLineOfSight
losBlocked
```

that implements canonical ranged LOS independently from Cover.

Current path evaluation combines obstacle relationships primarily into:

```text
clear
partial_cover
full_cover
melee_blocked
```

Future Tactical Space migration must add/derive explicit LOS validity where required.

---

# 46. Current Enemy Target State

## NOT IMPLEMENTED AS EXPLICIT AUTHORITATIVE STATE

There is no current persistent field equivalent to:

```text
currentTargetId
```

that unifies movement and action planning.

Current movement chooses a target procedurally.

Current attack chooses valid targets again procedurally.

Therefore:

```text
movement target
may differ from
attack target
```

---

# 47. Current Intent State

## NOT IMPLEMENTED

No current authoritative runtime fields were found for:

```text
intent
currentIntent
intentTarget
intentAction
dynamicIntent
```

No current UI state exposes actual Intent.

---

# 48. Current Spawn Order State

## NOT IMPLEMENTED AS EXPLICIT FIELD

Practical current order:

```text
encounter.enemySpawns array order
→ enemyUnits insertion order
→ current processing order
```

No explicit:

```text
spawnOrder
```

field was found.

This is a reusable seed, not a formal current system.

---

# 49. Current Status State

## NOT IMPLEMENTED FOR v3.1 VALIDATION

No current audited authoritative state model for:

```text
Stun
Status duration
Status source
Status capability overrides
```

was found in the current baseline.

---

# 50. Current Charge State

## NOT IMPLEMENTED

No current state fields equivalent to:

```text
chargeCurrent
chargeMax
chargeProgress
```

exist in the audited current baseline.

---

# 51. Current Wave State

## NOT IMPLEMENTED

No current authoritative fields for:

```text
waveTelegraph
reservedSpawnTile
pendingWave
spawnWindow
waveVariant
```

exist in the audited current baseline.

Current enemies are initial encounter setup content.

---

# 52. Current Tutorial Flow State

## NOT IMPLEMENTED AS DEDICATED SYSTEM

Current Tutorial uses:

```text
tutorialCompleted
+
normal battle
+
special result routing
```

There is no current dedicated runtime schema for:

```text
currentTutorialPhase
currentTutorialTask
learningEvidence
flowSimulationStep
phaseEntryState
phaseExitState
```

Corrected tutorial design requires this conceptually, but technical schema is not locked yet.

---

# 53. Current Enemy Phase Timer State

`main.js` keeps:

```text
enemyPhaseTimerId
```

## AUDITED CURRENT SOURCE

Purpose:

- schedule/delay current Enemy Phase resolution;
- avoid immediate synchronous transition in UI.

This is controller timing state, not enemy gameplay state.

Future sequential activation/Intent readability may require a different timing/orchestration model.

---

# 54. Definition Data — Player Units

## AUDITED CURRENT DATA

File:

```text
public/data/units/player_units.json
```

Current definitions:

```text
Guard
Archer
```

Current fields include concepts equivalent to:

```text
unitId
name
side
role
maxHP
baseATK
baseDEF
move
atr
attackType
targetPattern
targetCategory
usesProjectile
requiresPathCheck
```

Current stats:

| Unit | HP | ATK | DEF | Move | ATR |
|---|---:|---:|---:|---:|---:|
| Guard | 25 | 5 | 4 | 3 | 1.5 |
| Archer | 18 | 7 | 1 | 4 | 3.0 |

---

# 55. Definition Data — Enemy Units

## AUDITED CURRENT DATA

File:

```text
public/data/units/enemy_units.json
```

Current baseline definition:

```text
Sword Enemy
```

Current stats:

| Unit | HP | ATK | DEF | Move | ATR |
|---|---:|---:|---:|---:|---:|
| Sword | 16 | 6 | 2 | 3 | 1.5 |

Current JSON does not encode full current design enemy grammar.

---

# 56. Definition Data — Map

## AUDITED CURRENT DATA

File:

```text
public/data/maps/r1_stage1_fixed.json
```

Current map dimensions:

```text
7 × 5
```

Approximate current layout:

```text
      x0   x1   x2   x3   x4   x5   x6
y0    .    .    .   O30   .    E1   .
y1    .    P1   .    .    .    .    .
y2    .    .   O70   .    OF   .    .
y3    .    P2   .    .    .    .    .
y4    .    .    .   O30   .    E2   .
```

Current special tile/marker concepts include:

```text
P1 / P2 player spawns
E1 / E2 enemy spawns
O30
O70
OF
```

---

# 57. Definition Data — Encounter

## AUDITED CURRENT DATA

File:

```text
public/data/encounters/r1_stage1_baseline_eval_encounter.json
```

Current encounter includes:

```text
mapId
playerSpawns
enemySpawns
objective
victory condition
defeat condition
Crystal reward
```

Current content:

```text
Guard + Archer
vs
2 Sword Enemy
```

Objective:

```text
eliminate_all
```

Reward:

```text
20 Crystal
```

---

# 58. Encounter Spawn Array

Current:

```text
enemySpawns[]
```

is used by battle setup to construct runtime `enemyUnits[]`.

This means ordering currently propagates:

```text
definition array order
→ runtime enemy array order
```

Future explicit Spawn Order may derive from this, but should become deliberate state/rule rather than an undocumented incidental array property.

---

# 59. Data Loader State

## AUDITED CURRENT SOURCE

`loadInitialPrototypeData()` loads only:

```text
player unit definitions
enemy unit definitions
Stage 1 map
Stage 1 encounter
```

Current app-data model therefore remains narrow and hard-coded around baseline Stage 1 content.

Future unique stages/encounters will require broader data selection/loading architecture or indexed data references.

---

# 60. Data Path Configuration

Current deployment-aware loader uses:

```text
import.meta.env.BASE_URL
```

with relative paths.

Current Vite config:

```text
base = "/prototype-tmtb/"
```

This is configuration state, not gameplay runtime state.

It is important for production data resolution.

---

# 61. Current Persistence Boundary

## Persistent

```text
profileState
```

via:

```text
localStorage
```

## In-memory only

```text
currentScene
runState
battleState
battleIntroNodeId
enemyPhaseTimerId
```

Therefore:

```text
browser refresh
→ active run/battle can be lost
```

unless current scene/profile route reconstructs a safe default.

---

# 62. Current Run Overview Reset Boundary

## AUDITED CURRENT SOURCE / UNCOMMITTED WORK

Opening Run Overview clears active values equivalent to:

```text
runState = null
battleState = null
battleIntroNodeId = null
```

then sets:

```text
currentScene = "run_overview"
```

This makes Run Overview a between-run hub in the local current flow.

---

# 63. Current Battle Creation Boundary

Battle runtime state is created when entering a battle.

Conceptually:

```text
definition data
+
profile permanent upgrades
+
Tutorial/run context
→ createInitialBattleState()
→ mutable battleState
```

Current setup still references baseline Stage 1 map/encounter data.

---

# 64. Current Player Turn Reset Boundary

After current Enemy Phase:

```text
turnCount increments
living player units reset to ready
hasActed reset
originTile refreshed to current position
selected unit becomes next ready unit
phase returns to player_phase
```

This is the key old per-unit lifecycle that future Shared AP migration must replace/decouple.

---

# 65. Current Enemy Mutation Boundary

Current enemy processing occurs in two global passes.

Movement pass mutates:

```text
enemy tileX / tileY
possibly turn/completion state
```

Attack pass mutates:

```text
player HP
enemy action completion state
```

Later enemies read updated board state within each pass.

---

# 66. Current Damage Mutation

Current basic attack mutation includes:

```text
target.currentHP
```

and old attacker completion:

```text
attacker.turnState = "exhausted"
attacker.hasActed = true
```

This means current attack-effect and activation state are coupled in one resolution path.

---

# 67. Current Objective / Result Mutation

Objective evaluation checks current battle state after actions/enemy phase.

Result can transition:

```text
ongoing
→ victory
```

or:

```text
ongoing
→ defeat
```

Result then drives controller flow.

---

# 68. State Ownership Summary

| State / Data | Current Owner | Persistence |
|---|---|---|
| `currentScene` | `main.js` | In-memory |
| `appData` | `main.js` after `dataLoader` | In-memory |
| `profileState` | `profileStorage` + controller reference | `localStorage` |
| `runState` | `runState.js` + controller reference | In-memory |
| `battleIntroNodeId` | `main.js` | In-memory |
| `battleState` | `battleSetup` creation + rule/controller mutations | In-memory |
| `enemyPhaseTimerId` | `main.js` | In-memory |
| player unit definitions | JSON | Static definition |
| enemy unit definitions | JSON | Static definition |
| map definition | JSON | Static definition |
| encounter definition | JSON | Static definition |
| permanent upgrades | `profileState` | Persistent |
| Run Crystal | `runState` | In-memory |
| Meta Crystal | `profileState` | Persistent |
| Tutorial completion | `profileState` | Persistent |

---

# 69. Current Battle Unit Ownership Summary

| Field | Current Meaning | Future Migration Risk |
|---|---|---|
| `tileX/tileY` | prototype tactical position | low |
| `originTile` | current turn movement anchor | likely evolves into StartGrid semantics |
| `currentHP/maxHP` | current survivability | low |
| `derivedStats` | runtime combat stats | low/moderate |
| `turnState` | Ready/Exhausted | high — player model superseded |
| `hasActed` | old action completion | high |
| attack config fields | generic current attack metadata | moderate |
| `spawnLabel` | setup provenance | low |
| no explicit Intent fields | missing | future addition |
| no explicit Status fields | missing | future addition |
| no explicit Spawn Order field | missing | future addition |

---

# 70. Current vs Design-Target State Separation

This section is intentionally explicit.

## CURRENT IMPLEMENTED STATE

Includes:

```text
originTile
turnState
hasActed
phase
turnCount
selectedUnitId
battleControlState
actionMenuIndex
selectedAction
playerUnits[]
enemyUnits[]
resultState
profileState
runState
```

## DESIGN-TARGET / NOT YET IMPLEMENTED

Includes concepts such as:

```text
Shared Team AP
StartGrid commitment/refund semantics
Movement Lock after Attack/Skill
global End Turn
explicit Current Target
Intent
Dynamic Intent
explicit Spawn Order
Status
Stun
Charge
Wave Telegraph
reserved spawn position
Tutorial Flow State
Tutorial Task
Learning Evidence
FLOW SIMULATION completion
```

Do not write these future concepts into current runtime schema as if they already exist.

---

# 71. Design-Target Team AP State

## NOT IMPLEMENTED

Current design v3.1 requires a party-wide resource:

```text
Team AP = Living Player Units × 2
```

Potential implementation will need authoritative state representing at minimum:

```text
current Team AP
turn-start Team AP capacity
```

Exact field names and ownership are **not yet technically locked**.

Do not pre-decide:

```text
teamAPCurrent
teamAPMax
```

solely because those names are convenient.

---

# 72. Design-Target StartGrid State

## NOT IMPLEMENTED AS FULL SEMANTICS

Current `originTile` is a likely migration seed.

Future behaviour needs:

```text
recorded at start of Player Turn
leave StartGrid → spend AP
return before commitment → refund
Attack/Skill prevents movement refund path
```

Exact decision whether to:

```text
rename originTile
extend originTile semantics
introduce StartGrid field
```

remains a technical migration decision after fresh source audit.

---

# 73. Design-Target Movement Lock State

## NOT IMPLEMENTED

Current Movement is blocked via Exhausted.

Future design needs a separate concept:

```text
Attack/Skill
→ Movement locked for remainder of Player Turn
```

while the unit remains selectable/action-capable if rules/AP allow.

Future state may need explicit Movement Lock representation.

Exact schema remains open.

---

# 74. Design-Target End Turn State

## NOT IMPLEMENTED

Future Player Turn should end through:

```text
global End Turn
```

not all-player Exhaustion.

This requires Player Turn ownership and transition state independent of per-unit completion.

Exact controller/state implementation remains open.

---

# 75. Design-Target Current Target / Intent State

## NOT IMPLEMENTED

Future enemy readability requires authoritative representation sufficient to derive/show:

```text
Current Target
Current Intent
```

Intent should come from actual enemy rules/state.

Potential future state must support Dynamic Intent changes.

Exact object shape is not yet technically locked.

---

# 76. Design-Target Enemy Activation State

## NOT IMPLEMENTED

Current enemy state does not explicitly encode canonical:

```text
Spawn Order
activation lifecycle
Movement resolution complete
Action resolution complete
Fallback
```

Future sequential activation requires explicit orchestration semantics.

Do not assume current `enemyUnits[]` array order alone is sufficient long-term.

---

# 77. Design-Target Status State

## NOT IMPLEMENTED

Future Status system may need:

```text
status type
source
duration
capability restrictions
expiry rule
```

Current first tutorial Status source remains OPEN in design.

Therefore do not invent a permanent Status schema solely for documentation.

---

# 78. Design-Target Charge State

## NOT IMPLEMENTED

Future Charge behaviour needs readable progress such as:

```text
CHARGE X/Y
```

with current behaviour progress separated from future payoff Intent.

Potential state may need:

```text
current progress
required progress
current behaviour
payoff transition
```

Exact schema remains open.

---

# 79. Design-Target Wave State

## NOT IMPLEMENTED

Future Wave system needs sufficient state for:

```text
Telegraph
reserved spawn position
preparation window
Spawn
new enemy normal Intent
```

Potential state concepts include:

```text
pending wave
reserved tiles
spawn content
telegraph visibility
spawn timing
```

Exact spawn-to-first-activation lifecycle remains OPEN in design.

Do not encode W1/W2 experiment as canonical state contract.

---

# 80. Design-Target Tutorial Flow State

## NOT IMPLEMENTED

Corrected tutorial requires a flow layer conceptually separate from Combat State.

Potential responsibilities:

```text
current Phase
current Task
Flow Simulation completion
Learning Evidence
queued content transition
entry/exit contract
tutorial completion state
```

Important invariant:

```text
Tutorial Flow State
must not silently become authority
for normal combat rules
```

Example:

```text
camera_left_simulated = complete
```

must not spend Team AP or move a tactical unit unless the authored step explicitly calls a real mechanic.

Exact module/object ownership remains open.

---

# 81. Proposed Future Evidence Event Categories

## DESIGN / PROTOTYPE VALIDATION TARGET — NOT IMPLEMENTED

Corrected Tutorial/PVS recommends lightweight tracking.

Potential FLOW events:

```text
camera_left_simulated
camera_right_simulated
movement_control_simulated
```

Potential SYSTEM events:

```text
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
```

This is prototype evaluation support, not production analytics.

No such event-log system is current implementation truth.

---

# 82. Current Data Integrity Observations

## AUDITED CURRENT DATA

Current references are internally consistent:

```text
encounter mapId
→ existing map

player spawn unit IDs
→ existing player definitions

enemy spawn unit IDs
→ existing enemy definitions

spawn labels
→ map spawn markers
```

Current audited baseline data resolves correctly.

---

# 83. Current Data Hard-Coding Limitation

Current loader/setup uses one baseline data set:

```text
stage1Map
stage1Encounter
```

Therefore current run-stage identity does not select distinct tactical data.

Future route/content differentiation will require:

```text
run node / stage identity
→ encounter/map reference
→ data lookup
→ battle setup
```

Exact data indexing format is not yet defined here.

---

# 84. Current Map/Encounter vs Tutorial Design

The current 7×5 baseline map is implementation data.

The corrected Tutorial working design uses a different conceptual map family:

```text
Offset Courtyard
```

The Tutorial paper-layout candidate is not current JSON data.

Do not overwrite current map data merely because design handoff contains a tentative layout.

It should become implementation only through a deliberate validated migration checkpoint.

---

# 85. Current Player/Enemy Definitions vs Future Special Enemies

Current audited enemy definitions include Sword baseline only.

Orange / Purple / Blue are:

```text
TENTATIVE SPECIAL ENEMY CANDIDATES
```

in current design, not current runtime data.

Do not add them to `enemy_units.json` merely to make documentation look aligned.

---

# 86. Current Save / Reset Model

Current persistence supports profile reset.

Reset clears durable profile progression.

Current in-memory active state is also cleared through controller flow.

No versioned migration framework for localStorage schema is currently documented as an implemented system.

If persistent schema changes later, add explicit migration/sanitization handling before documenting it as safe.

---

# 87. State Mutation Principles to Preserve

Future migration should preserve:

## Single authority per domain where practical

Example:

```text
profileStorage
→ persistent profile mutations
```

## UI does not own gameplay state

Example:

```text
battleHud
renders turnState
```

but should not decide Attack legality independently.

## Definition data is immutable input

Runtime mutation belongs to runtime state.

## Derived values should be traceable

Permanent upgrades should derive runtime stats from profile + definition data.

## Tutorial flow must not override normal combat rules secretly

Tutorial authoring should trigger normal systems, not invent hidden alternate mechanics.

---

# 88. Current State/Data Migration Risks

## 88.1 Player action migration crosses multiple fields

Current:

```text
turnState
hasActed
phase transition
selection
movement legality
targeting legality
damage resolver
```

all participate in old Exhaustion behaviour.

Shared AP migration cannot be treated as one isolated new field.

---

## 88.2 `originTile` semantic expansion can create regressions

Current movement range already depends on it.

Changing it into StartGrid semantics must preserve movement allowance while adding AP commitment/refund.

---

## 88.3 Shared attack resolver couples player/enemy action completion

Current damage resolver marks attacker Exhausted.

Future player/enemy activation semantics differ.

Action effect and activation completion likely need deliberate decoupling.

---

## 88.4 Enemy movement/attack target decisions are separate

Introducing explicit Current Target/Intent requires defining when target selection occurs and when it refreshes.

---

## 88.5 Tutorial Flow State can accidentally become a second combat authority

Avoid authoring flags such as:

```text
tutorialAllowsAttack = true
```

if normal combat Action Validity should be the authority.

Tutorial should gate instruction/progression, not redefine rules.

---

# 89. State/Data Documentation Confidence Summary

## Re-audited directly 11 August

```text
main application state
battle initial state
battle unit runtime state
originTile
Ready/Exhausted
movement behaviour
attack completion
ATR/path/Cover behaviour
enemy movement/attack targeting
map data
encounter data
player unit data
enemy unit data
Run Overview current flow
data loader
Vite base
deployment workflow
battle HUD concepts
```

## Carried from unchanged v2.5 domains

```text
profile persistence internals
run graph internals
reward state details
settlement guard details
permanent-upgrade storage internals
objective resolver details
map renderer internals
```

These should be re-audited from actual files before a technical change in those domains.

---

# 90. Current State/Data Gap Matrix

| Domain | Current Runtime | Design Target |
|---|---|---|
| Player action ownership | `turnState` Ready/Exhausted | party-wide Shared AP turn |
| action completion | `hasActed` + Exhausted | action legality + Movement Lock |
| movement anchor | `originTile` | StartGrid semantics |
| movement resource | none | Team AP movement commitment |
| movement refund | none | refund before commitment |
| Player Turn end | all living exhausted | global End Turn |
| target state | derived on demand | explicit/derivable Current Target |
| enemy plan | procedural | Intent |
| enemy update | movement and attack passes | sequential activation |
| enemy order | incidental array order | explicit Spawn Order baseline |
| LOS | no distinct state | distinct LOS validity |
| Status | absent | Status system |
| Charge | absent | Charge progress |
| Wave | absent | Telegraph/reservation/spawn state |
| Tutorial flow | only completion gate | Phase/Task/evidence/Flow Simulation |
| active-run persistence | absent | future design/technical option |
| unique stage content mapping | absent | stage/node → encounter data |

---

# 91. What Must NOT Be Inferred

Do not infer that:

- `originTile` is already StartGrid;
- `turnState` should survive the v3.1 player-turn migration;
- `hasActed` is definitely removed;
- Team AP field names are already chosen;
- Intent object schema is finalized;
- Spawn Order requires one particular field shape;
- Status duration schema is decided;
- Charge state shape is decided;
- Wave timing schema is decided;
- Tutorial Flow State must live in one specific file;
- current run state is safe across refresh;
- current JSON fields equal final Unity data model.

---

# 92. Durable Resume Reference

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

# 93. State/Data Summary

```text
PERSISTENT PROFILE
tutorialCompleted
metaCrystal
permanentUpgrades

ACTIVE APP
currentScene
appData
runState
battleIntroNodeId
battleState
enemyPhaseTimerId

ACTIVE BATTLE
phase
turnCount
selectedUnitId
battleControlState
actionMenuIndex
selectedAction
playerUnits[]
enemyUnits[]
resultState

BATTLE UNIT
identity
side/role
tile position
originTile
HP
derived stats
turnState
hasActed
attack metadata
spawnLabel

CURRENT OLD TURN MODEL
Ready
→ reposition
→ Attack / Wait
→ Exhausted
→ all living players Exhausted
→ Enemy Phase

CURRENT DATA
player definitions
enemy definitions
Stage 1 map
Stage 1 encounter

PERSISTENCE
profile only
active run/battle in memory

NOT IMPLEMENTED
Team AP
full StartGrid semantics
Movement Lock
global End Turn
Current Target state
Intent
Dynamic Intent
explicit Spawn Order
Status
Charge
Wave
Tutorial Flow State
```

Primary rule:

> **Document current fields as current, and future design state as migration targets only.**

---

**End of State & Data Model**
