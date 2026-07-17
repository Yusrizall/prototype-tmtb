# TMTB State and Data Model v2.5

**Project:** TMTB / BeCan Prototype  
**Handoff Version:** v2.5  
**Document Type:** Runtime State and Data Model Snapshot  
**Milestone:** Full Game Loop Core  
**Purpose:** Mendokumentasikan bentuk state, definition data, mutation ownership, persistence boundary, dan transisi state utama pada checkpoint v2.5.  
**Last Updated:** 17 July 2026

---

# 1. Scope

Dokumen ini menjelaskan state dan data yang benar-benar digunakan oleh prototype v2.5.

Fokus utama:

- application-level state;
- `profileState`;
- `runState`;
- generated run node;
- reward option;
- `battleState`;
- runtime battle unit;
- unit/map/encounter definition JSON;
- permanent upgrade data;
- Crystal conversion state;
- persistence behavior;
- mutation ownership;
- transisi state penting.

Dokumen ini adalah snapshot implementasi aktual, bukan schema final untuk full game.

---

# 2. State Layers

Prototype saat ini memiliki beberapa layer state utama:

```text
Application State
├─ currentScene
├─ appData
├─ profileState
├─ runState
├─ battleIntroNodeId
├─ battleState
└─ enemyPhaseTimerId
```

Secara konseptual:

```text
Definition Data
→ loaded into appData

Persistent Profile State
→ profileState

Active Run State
→ runState

Active Battle State
→ battleState

Application Navigation State
→ currentScene
```

---

# 3. Persistence Boundary

## Persistent

Disimpan ke browser `localStorage`:

```text
profileState
```

Storage key:

```text
tmtb_profile_v1
```

Persistent fields:

```text
version
tutorialCompleted
metaCrystal
permanentUpgrades
```

---

## Memory Only

Tidak disimpan ke `localStorage`:

```text
currentScene
runState
battleState
battleIntroNodeId
enemyPhaseTimerId
```

Konsekuensi:

```text
browser refresh
→ active run hilang
→ active battle hilang
→ app kembali start dari Title
→ profile progression tetap ada
```

---

# 4. Application-Level State

Application-level state saat ini disimpan sebagai variable module-level di `src/main.js`.

---

## 4.1 `appData`

### Purpose

Menyimpan definition data awal yang sudah dimuat.

### Current shape

```js
{
  playerUnits,
  enemyUnits,
  stage1Map,
  stage1Encounter
}
```

### Source

Dibuat oleh:

```text
loadInitialPrototypeData()
```

### Persistence

```text
memory only
```

### Mutation

Tidak dimutasi sebagai progression state.

---

## 4.2 `profileState`

### Purpose

Menyimpan progression permanen pemain.

### Persistence

```text
localStorage
```

Dijelaskan lebih detail pada Section 5.

---

## 4.3 `runState`

### Purpose

Menyimpan active journey / active Region 1 run.

### Persistence

```text
memory only
```

Dijelaskan lebih detail pada Section 7.

---

## 4.4 `battleIntroNodeId`

### Purpose

Menyimpan node yang sedang dibuka pada Battle Intro.

### Typical values

```text
null
r1_s1_fixed
r1_s2_a
r1_s2_b
r1_s2_c
r1_s3_a
r1_s3_b
r1_s3_c
r1_s4_fixed
```

Hanya node yang benar-benar tergenerate dalam run yang dapat dipakai.

### Persistence

```text
memory only
```

---

## 4.5 `battleState`

### Purpose

Menyimpan seluruh state runtime battle aktif.

### Persistence

```text
memory only
```

Dijelaskan lebih detail pada Section 13.

---

## 4.6 `enemyPhaseTimerId`

### Purpose

Menjaga satu scheduled Enemy Phase resolution.

### Typical values

```text
null
browser timeout ID
```

### Persistence

```text
memory only
```

Timer dibersihkan ketika meninggalkan battle atau bila Enemy Phase tidak lagi aktif.

---

## 4.7 `currentScene`

### Purpose

Menentukan renderer dan input routing aktif.

### Current valid values

```text
title
main_menu
map_selection
battle_intro
battle
reward_selection
run_completion
run_defeat
post_run_shop
```

### Persistence

```text
memory only
```

---

# 5. `profileState`

Default profile dibuat di:

```text
src/logic/profile/profileStorage.js
```

Current shape:

```js
{
  version: 1,

  tutorialCompleted: false,

  metaCrystal: 0,

  permanentUpgrades: {
    guard: {
      maxHP: 0,
      atk: 0,
      def: 0
    },

    archer: {
      maxHP: 0,
      atk: 0,
      def: 0
    }
  }
}
```

---

# 6. `profileState` Field Reference

## `version`

```text
Type: number
Current value: 1
```

Purpose:

- basic save version marker.

Current implementation belum memiliki full save migration system.

---

## `tutorialCompleted`

```text
Type: boolean
Default: false
```

Meaning:

```text
false
→ Start Journey opens tutorial battle

true
→ Start Journey creates a run
```

Mutation owner:

```text
markTutorialCompleted()
```

Persistence:

```text
saved immediately
```

---

## `metaCrystal`

```text
Type: non-negative integer
Default: 0
```

Purpose:

- permanent currency;
- used in Post-Run Shop.

Mutation owners:

```text
addMetaCrystal()
purchasePermanentUpgrade()
resetProfileState()
```

---

## `permanentUpgrades`

Shape:

```js
{
  guard: {
    maxHP: number,
    atk: number,
    def: number
  },

  archer: {
    maxHP: number,
    atk: number,
    def: number
  }
}
```

Each field stores an **upgrade level**, not the final stat bonus.

Current expected range:

```text
0–4
```

---

# 7. Permanent Upgrade Data Model

Valid units:

```text
guard
archer
```

Valid stats:

```text
maxHP
atk
def
```

Maximum level:

```text
4
```

Upgrade costs by current level:

```text
Level 0 → 1 = 30 Meta Crystal
Level 1 → 2 = 60 Meta Crystal
Level 2 → 3 = 100 Meta Crystal
Level 3 → 4 = 150 Meta Crystal
```

Applied battle effects:

```text
Max HP bonus = level × 2
ATK bonus    = level × 1
DEF bonus    = level × 1
```

Move and ATR are not affected.

---

# 8. Profile Load Normalization

`loadProfileState()`:

```text
read localStorage
→ JSON parse
→ merge with default profile
→ merge nested Guard upgrades
→ merge nested Archer upgrades
→ save normalized profile
```

If no saved profile exists:

```text
create default
→ save
→ return default
```

If saved JSON is invalid:

```text
warn
→ create default
→ save
→ return default
```

Current normalization mainly protects against missing fields.

It is not yet a full versioned migration system.

---

# 9. `runState`

Created by:

```text
createInitialRunState()
```

Current initial shape:

```js
{
  version: 1,

  runId: string,

  regionId: "region_1",

  runStatus: "active",
  runResult: null,

  defeatedNodeId: null,

  runCrystal: 0,

  crystalConversionCompleted: false,
  convertedRunCrystal: 0,

  metaCrystalBeforeConversion: null,
  metaCrystalAfterConversion: null,

  generatedNodes: [],
  nodeConnections: [],

  selectedNodeId: string,
  currentNodeId: null,

  completedNodeIds: [],
  blockedNodeIds: [],

  chosenRewardIds: [],
  rewardGrantedNodeIds: [],

  pendingRewardSourceNodeId: null,
  pendingRewardOptions: [],

  activeRunBuffs: []
}
```

---

# 10. `runState` Status Fields

## `runStatus`

Current values:

```text
active
completed
defeated
```

Initial:

```text
active
```

---

## `runResult`

Current values:

```text
null
completed
defeat
```

Initial:

```text
null
```

On completion:

```text
completed
```

On defeat:

```text
defeat
```

---

## `defeatedNodeId`

Current values:

```text
null
nodeId
```

Set only when a run is defeated.

---

# 11. Crystal Fields in `runState`

## `runCrystal`

```text
Type: number
Initial: 0
```

Represents temporary Crystal earned during the active run.

Current mutation:

```text
stage victory reward preparation
→ runCrystal += stageNode.crystalReward
```

After settlement conversion:

```text
runCrystal = 0
```

---

## `crystalConversionCompleted`

```text
Type: boolean
Initial: false
```

Purpose:

- protect conversion from being processed more than once in normal flow.

After conversion:

```text
true
```

---

## `convertedRunCrystal`

```text
Type: number
Initial: 0
```

Stores how much Run Crystal was converted during settlement.

---

## `metaCrystalBeforeConversion`

```text
Type: number | null
Initial: null
```

Snapshot of profile Meta Crystal immediately before conversion.

---

## `metaCrystalAfterConversion`

```text
Type: number | null
Initial: null
```

Snapshot of profile Meta Crystal immediately after conversion.

---

# 12. Run Crystal Conversion Transition

Completion or defeat settlement:

```text
runStatus = completed OR defeated
↓
crystalConversionCompleted = false
↓
conversionAmount = floor(max(0, runCrystal))
↓
profile.metaCrystal += conversionAmount
↓
runCrystal = 0
↓
convertedRunCrystal = conversionAmount
↓
metaCrystalBeforeConversion = previous profile total
↓
metaCrystalAfterConversion = updated profile total
↓
crystalConversionCompleted = true
```

Current conversion rate:

```text
100%
```

Conversion orchestration currently lives in `src/main.js`, not inside `runState.js`.

---

# 13. Generated Run Node Model

Generated nodes are based on definitions in `runState.js`.

Typical shape:

```js
{
  nodeId: "r1_s2_a",

  stageSlot: 2,
  variantId: "A",

  shortLabel: "Stage 2A",
  name: "Village Outskirts",

  nodeType: "stage",
  objectiveType: "eliminate_all",

  routeDifficulty: "easy",
  difficultyTag: "easy-normal",

  crystalReward: 25,

  pathRole: "safe_route",

  status: "future",

  graphPosition: {
    column: 2,
    row: 1
  }
}
```

---

# 14. Generated Node Status Values

Current status values:

```text
future
available
current
completed
blocked
failed
```

Meaning:

## `future`

Node exists but is not yet reachable.

## `available`

Node may be entered.

## `current`

Node battle has been committed and is active.

## `completed`

Node battle was won and reward was chosen.

## `blocked`

Sibling route was blocked because another branch was committed.

## `failed`

Player was defeated at this node.

---

# 15. Node Selection vs Progression

Important distinction:

```text
selectedNodeId
```

is UI selection / preview focus.

It is not the same as:

```text
currentNodeId
```

which represents an actively committed stage.

This allows:

- future nodes to be previewed;
- blocked nodes to be previewed;
- completed nodes to be previewed;

while only:

```text
status = available
```

can enter Battle Intro.

---

# 16. `nodeConnections`

Shape:

```js
{
  fromNodeId: string,
  toNodeId: string
}
```

Current graph construction:

```text
Stage 1
→ every generated Stage 2 node

every generated Stage 2 node
→ every generated Stage 3 node

every generated Stage 3 node
→ Stage 4
```

Current UI graph rendering does not dynamically derive line layout from this data.

---

# 17. Run Progress Collections

## `completedNodeIds`

```text
Type: string[]
```

Tracks node IDs that have been completed.

---

## `blockedNodeIds`

```text
Type: string[]
```

Tracks sibling nodes blocked by branch commitment.

---

## `rewardGrantedNodeIds`

```text
Type: string[]
```

Tracks stage nodes whose victory reward preparation has already occurred.

Purpose:

- prevent the same node from granting Run Crystal/reward options again.

---

## `chosenRewardIds`

```text
Type: string[]
```

Stores reward IDs chosen during the run.

Current reward effects are inactive.

This collection currently serves as run history/summary data only.

---

## `activeRunBuffs`

```text
Type: array
Initial: []
```

Currently unused.

Reserved conceptual space for future active run effects.

---

# 18. Pending Reward State

## `pendingRewardSourceNodeId`

```text
Type: string | null
```

Points to the current stage whose reward must be selected.

---

## `pendingRewardOptions`

```text
Type: RewardOption[]
Initial: []
```

Expected length during Reward Selection:

```text
4
```

After reward is chosen:

```text
pendingRewardSourceNodeId = null
pendingRewardOptions = []
```

---

# 19. Reward Option Model

Current reward option shape:

```js
{
  rewardId: "reward_guard_max_hp",
  name: "Guard Max HP",
  category: "Guard",
  description: "Placeholder reward. Effect belum aktif."
}
```

Current reward pool IDs:

```text
reward_guard_max_hp
reward_guard_atk
reward_guard_def

reward_archer_max_hp
reward_archer_atk
reward_archer_def

reward_party_recovery
reward_bonus_crystal
```

Current behavior:

```text
reward selected
→ rewardId stored in chosenRewardIds
```

No active stat/effect mutation occurs yet.

---

# 20. Run Progression Transition

Initial run:

```text
Stage 1 = available
Stage 2 = future
Stage 3 = future
Stage 4 = future
```

Entering a stage:

```text
available
→ current
```

At branch stage:

```text
selected available sibling
→ current

other available sibling
→ blocked
```

Victory:

```text
current stage
→ reward prepared
→ Reward Selection
```

Reward chosen:

```text
source current node
→ completed

connected future nodes
→ available

currentNodeId
→ null
```

Final Stage 4 reward chosen:

```text
Stage 4 = completed
pending reward = none
currentNodeId = null
↓
runStatus = completed
runResult = completed
```

Defeat:

```text
current node
→ failed

runStatus
→ defeated

runResult
→ defeat

defeatedNodeId
→ node ID

currentNodeId
→ null

pending reward cleared
```

---

# 21. `battleState`

Created initially by:

```text
createInitialBattleState()
```

Base shape:

```js
{
  encounterId: string,
  encounterName: string,
  mapId: string,
  objectiveType: string,

  phase: "player_phase",
  turnCount: 1,

  selectedUnitId: string | null,

  battleControlState:
    "unit_selected_movement",

  actionMenuIndex: 0,
  selectedAction: null,

  playerUnits: [],
  enemyUnits: [],

  resultState: "ongoing"
}
```

During runtime, additional fields may be added or updated:

```text
stageId
flowContext
routeDifficulty
crystalReward
nodeType

targetIndex
targetUnitId

feedbackMessage
```

---

# 22. Battle Context Fields

## `stageId`

Typical values:

```text
tutorial_stage
r1_s1_fixed
generated Stage 2 node ID
generated Stage 3 node ID
r1_s4_fixed
```

---

## `flowContext`

Current values:

```text
tutorial
run_stage
```

Purpose:

- determine result routing.

Tutorial and run-stage defeat do not use the same settlement flow.

---

## `routeDifficulty`

Added for run-stage battles.

Current values:

```text
easy
normal
hard
```

Currently metadata only.

It does not yet scale battle content.

---

## `crystalReward`

Added from run node.

Used as stage metadata.

Actual run Crystal granting occurs through run reward preparation.

---

## `nodeType`

Typical values:

```text
stage
mini_boss
```

Currently metadata.

Stage 4 does not yet use unique mini-boss content.

---

# 23. Battle Phase Model

## `phase`

Current values:

```text
player_phase
enemy_phase
battle_end
```

Initial:

```text
player_phase
```

Transition:

```text
all living player units exhausted
→ enemy_phase
```

After Enemy Phase if at least one player survives:

```text
enemy_phase
→ player_phase
→ turnCount + 1
```

Battle resolved:

```text
battle_end
```

---

# 24. Battle Control State Model

## `battleControlState`

Current values:

```text
unit_selected_movement
action_menu_open
attack_targeting
enemy_phase
battle_result
```

Purpose:

- route keyboard input;
- control interaction mode;
- control battle UI.

Typical transition:

```text
unit_selected_movement
→ action_menu_open
→ attack_targeting
→ unit_selected_movement
```

or:

```text
action_menu_open
→ Wait
→ next unit / enemy phase
```

Result:

```text
battle_result
```

disables normal battle input.

---

# 25. Battle Result Model

## `resultState`

Current values:

```text
ongoing
victory
defeat
```

Initial:

```text
ongoing
```

Victory:

```text
objective resolver confirms all enemies defeated
→ resultState = victory
```

Defeat:

```text
no living player units after Enemy Phase
→ resultState = defeat
```

---

# 26. Runtime Battle Unit Model

Typical runtime unit shape:

```js
{
  battleUnitId: "player_guard_1",

  unitDefId: "guard",

  name: "Guard",
  side: "player",
  role: "frontline",

  tileX: 1,
  tileY: 1,

  originTile: {
    x: 1,
    y: 1
  },

  currentHP: 25,
  maxHP: 25,

  turnState: "ready",
  hasActed: false,

  derivedStats: {
    maxHP: 25,
    atk: 5,
    def: 4,
    move: 3,
    atr: 1.5
  },

  attackType: "melee",
  targetPattern: "single",
  targetCategory: "enemy",

  usesProjectile: false,
  requiresPathCheck: true,

  spawnLabel: "P1"
}
```

---

# 27. Runtime Battle Unit Identity

## `battleUnitId`

Generated as:

```text
{side}_{unitDefinition.unitId}_{index}
```

Examples:

```text
player_guard_1
player_archer_2
enemy_sword_enemy_1
enemy_sword_enemy_2
```

Used for runtime targeting and selection.

---

## `unitDefId`

References definition identity:

```text
guard
archer
sword_enemy
```

---

# 28. Battle Unit Position Model

Position is stored as:

```text
tileX
tileY
```

Activation origin is stored separately:

```js
originTile: {
  x,
  y
}
```

Movement reachability for player units is calculated from `originTile`.

At a new Player Turn:

```text
originTile
→ current tile position
```

For enemy units, origin is also reset before Enemy Phase movement.

---

# 29. Battle Unit Turn State

Current values:

```text
ready
positioned
exhausted
```

## `ready`

Unit has not taken an action.

## `positioned`

Unit has moved/repositioned but has not taken its action.

## `exhausted`

Unit has completed Attack or Wait, or is otherwise finished for the phase.

`hasActed` is also stored separately.

Current action resolvers set:

```text
turnState = exhausted
hasActed = true
```

---

# 30. Battle Unit HP Model

Runtime unit stores:

```text
currentHP
maxHP
```

At battle creation:

```text
currentHP = derivedStats.maxHP
maxHP = derivedStats.maxHP
```

Current implementation therefore starts every battle at full HP.

HP carry between run stages is not implemented.

Defeated unit:

```text
currentHP = 0
```

Dead units remain in runtime arrays but are excluded by living-unit filters and rendering logic.

---

# 31. Derived Stats Model

Shape:

```js
{
  maxHP,
  atk,
  def,
  move,
  atr
}
```

For player run-stage units:

```text
base unit definition
+ permanent upgrade levels
→ derivedStats
```

For tutorial units:

```text
base definition only
```

For enemies:

```text
base definition only
```

---

# 32. Targeting State

During Attack targeting:

```text
selectedAction = "attack"
targetIndex = number
targetUnitId = battleUnitId
```

Valid target list itself is not stored permanently in `battleState`.

It is recalculated from:

```text
mapData
+ battleState
```

using ATR/path logic.

---

# 33. Feedback State

## `feedbackMessage`

Optional runtime field.

Used for:

- no valid attack target;
- attack result;
- phase transition;
- enemy phase summary;
- battle result details.

This is presentation feedback stored inside battle state.

---

# 34. Unit Definition JSON Model

Source:

```text
public/data/units/player_units.json
public/data/units/enemy_units.json
```

Typical shape:

```js
{
  unitId: string,
  name: string,
  side: "player" | "enemy",
  role: string,

  maxHP: number,
  baseATK: number,
  baseDEF: number,
  move: number,
  atr: number,

  attackType: "melee" | "ranged",
  targetPattern: "single",
  targetCategory: string,

  usesProjectile: boolean,
  requiresPathCheck: boolean
}
```

Enemy definitions may also contain:

```text
aiTags
```

Current AI does not yet use `aiTags` to select different behaviors.

---

# 35. Current Player Unit Definitions

## Guard

```text
unitId: guard
side: player
role: frontline

Max HP: 25
ATK: 5
DEF: 4
Move: 3
ATR: 1.5

attackType: melee
```

## Archer

```text
unitId: archer
side: player
role: ranged

Max HP: 18
ATK: 7
DEF: 1
Move: 4
ATR: 3.0

attackType: ranged
```

---

# 36. Current Enemy Unit Definition

## Sword Enemy

```text
unitId: sword_enemy
side: enemy
role: basic_melee_pressure

Max HP: 16
ATK: 6
DEF: 2
Move: 3
ATR: 1.5

attackType: melee
```

Current enemy variety:

```text
1 definition
```

---

# 37. Map Definition Model

Source:

```text
public/data/maps/r1_stage1_fixed.json
```

Shape:

```js
{
  mapId: string,
  name: string,
  width: number,
  height: number,
  tiles: string[][],
  legend: object
}
```

Current map:

```text
width = 7
height = 5
```

---

# 38. Map Tile Codes

Current relevant codes:

```text
.    = empty
P1   = player spawn 1
P2   = player spawn 2
E1   = enemy spawn 1
E2   = enemy spawn 2

O30  = partial cover 30%
O70  = partial cover 70%
OF   = full cover
```

Spawn codes are definition-time markers.

Runtime unit position is stored separately in battle units.

---

# 39. Encounter Definition Model

Source:

```text
public/data/encounters/
r1_stage1_baseline_eval_encounter.json
```

Shape:

```js
{
  encounterId: string,
  name: string,
  stageSlot: string,

  mapId: string,

  objectiveType: string,
  victoryCondition: string,
  defeatCondition: string,

  playerSpawns: [
    {
      unitId,
      spawnLabel
    }
  ],

  enemySpawns: [
    {
      unitId,
      spawnLabel
    }
  ],

  crystalReward: number,
  difficultyTag: string,
  notes: string
}
```

---

# 40. Current Encounter Spawn Model

Player:

```text
guard  → P1
archer → P2
```

Enemy:

```text
sword_enemy → E1
sword_enemy → E2
```

`battleSetup.js` uses:

```text
encounter spawnLabel
→ search map tiles
→ runtime tileX/tileY
```

---

# 41. Definition Data vs Runtime State

Important distinction:

```text
Definition Data
```

is static content configuration.

Examples:

```text
player_units.json
enemy_units.json
map JSON
encounter JSON
```

Runtime state is mutable.

Examples:

```text
profileState
runState
battleState
runtime battle units
```

Flow:

```text
Unit Definition
+ Encounter Spawn
+ Map Spawn Label
+ Permanent Upgrade
↓
Runtime Battle Unit
```

Do not write runtime HP or turn state back into unit definition JSON.

---

# 42. State Mutation Ownership

| State / Field | Primary Mutation Owner |
|---|---|
| `profileState.tutorialCompleted` | `profileStorage.js` |
| `profileState.metaCrystal` | `profileStorage.js` |
| `profileState.permanentUpgrades` | `profileStorage.js` |
| Run generation | `runState.js` |
| Node progression | `runState.js` |
| Reward pending/chosen state | `runState.js` |
| Run completion flag | `runState.js` |
| Run defeat state | `runState.js` |
| Crystal conversion settlement fields | currently `main.js` |
| Initial battle state | `battleSetup.js` |
| Player movement | `movementLogic.js` |
| Damage / exhaustion from attack | `damageLogic.js` |
| Enemy movement | `enemyMovementLogic.js` |
| Enemy attacks | `enemyAttackLogic.js` |
| Objective victory evaluation | `objectiveLogic.js` |
| Scene routing | `main.js` |

---

# 43. Important Idempotency / Duplicate-Action Guards

## Reward grant

`rewardGrantedNodeIds` prevents the same stage reward preparation from being applied again.

---

## Crystal conversion

```text
crystalConversionCompleted
```

prevents repeated conversion in normal settlement flow.

---

## Shop purchase

Purchase may receive:

```text
expectedCurrentLevel
```

If the expected level does not match current saved level:

```text
purchase rejected
```

This protects against stale/double-click purchase input.

---

## Run defeat

`markRunDefeated()` only operates when:

```text
runStatus = active
```

and the defeated node is the valid current node.

---

# 44. Important Current Data Limitations

## 44.1 Active run is not persistent

`runState` disappears on refresh.

---

## 44.2 Battle state is not persistent

Mid-battle refresh restarts the application.

---

## 44.3 Reward effects are not represented as active runtime modifiers

`chosenRewardIds` exists.

`activeRunBuffs` exists.

But no active reward-effect pipeline is implemented.

---

## 44.4 HP carry is absent

Each battle reconstructs player units with:

```text
currentHP = maxHP
```

---

## 44.5 Difficulty is metadata

`routeDifficulty` exists in node/battle metadata.

It does not yet change:

- unit stats;
- enemy count;
- map;
- encounter;
- AI.

---

## 44.6 Run node and encounter data are not fully connected

Run nodes define progression metadata.

Battle setup still uses:

```text
stage1Map
stage1Encounter
```

for all battles.

---

## 44.7 Save version migration is minimal

Profile has:

```text
version: 1
```

but no generalized migration pipeline exists yet.

---

# 45. State Transition Summary

## New Player Journey

```text
profile.tutorialCompleted = false
↓
Tutorial Battle
↓
Victory
↓
tutorialCompleted = true
↓
save profile
↓
create runState
↓
Map Selection
```

---

## Returning Player Journey

```text
profile.tutorialCompleted = true
↓
create runState
↓
Map Selection
```

---

## Stage Victory

```text
battleState.resultState = victory
↓
prepareRunStageVictoryReward
↓
runCrystal increases
↓
4 pendingRewardOptions
↓
choose reward
↓
source node completed
↓
next nodes available
```

---

## Final Stage Victory

```text
Stage 4 completed
↓
reward chosen
↓
runStatus = completed
↓
Run Crystal conversion
↓
run_completion scene
```

---

## Run Defeat

```text
battleState.resultState = defeat
↓
markRunDefeated
↓
node = failed
↓
runStatus = defeated
↓
Run Crystal conversion
↓
run_defeat scene
```

---

## Post-Run Upgrade

```text
settled run
↓
post_run_shop
↓
purchasePermanentUpgrade
↓
profile.metaCrystal decreases
↓
permanent upgrade level increases
↓
profile saved
↓
future run battleSetup applies upgrade
```

---

# 46. Data Model Principles to Preserve

The current implementation already follows several useful principles:

> Definition data should remain separate from mutable runtime state.

> Profile progression should remain separate from active run progression.

> Active run state should remain separate from active battle state.

> UI should read state rather than become the source of gameplay truth.

> Shared combat rules should mutate or return battle state consistently.

> Persistent state changes should be explicit.

Future expansion should preserve these boundaries even if files are reorganized.

---

# 47. Model Status Summary

```text
Profile persistence                    IMPLEMENTED
Tutorial completion persistence        IMPLEMENTED
Meta Crystal persistence               IMPLEMENTED
Permanent upgrade persistence          IMPLEMENTED
Permanent upgrade battle application   IMPLEMENTED

Run state                              IMPLEMENTED
Branch node status                     IMPLEMENTED
Reward selection state                 IMPLEMENTED
Run Crystal                            IMPLEMENTED
Completion state                       IMPLEMENTED
Defeat state                           IMPLEMENTED
Conversion state                       IMPLEMENTED

Battle state                           IMPLEMENTED
Runtime battle units                   IMPLEMENTED
Turn/phase state                       IMPLEMENTED
Targeting state                        IMPLEMENTED
Result state                           IMPLEMENTED

Active reward effects                  NOT IMPLEMENTED
HP carry                               NOT IMPLEMENTED
Active run persistence                 NOT IMPLEMENTED
Battle persistence                     NOT IMPLEMENTED
Run history                            NOT IMPLEMENTED
General save migration                 NOT IMPLEMENTED
```

This document represents the state and data model snapshot of **TMTB Prototype v2.5 — Full Game Loop Core**.
