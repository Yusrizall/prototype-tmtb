# TMTB Prototype Architecture v2.5

**Project:** TMTB / BeCan Prototype  
**Handoff Version:** v2.5  
**Document Type:** Prototype Architecture Snapshot  
**Milestone:** Full Game Loop Core  
**Purpose:** Mendokumentasikan struktur repository, tanggung jawab module, dependency utama, data flow, UI flow, storage, serta limitation arsitektur pada checkpoint v2.5.  
**Last Updated:** 17 July 2026

---

# 1. Scope

Dokumen ini menjelaskan **arsitektur aktual prototype v2.5**, bukan arsitektur ideal untuk versi produksi.

Prinsip utama:

> Actual repository first.

Struktur di bawah dibuat berdasarkan audit file repository yang benar-benar ada pada checkpoint v2.5.

Dokumen ini tidak berarti semua file sudah final atau sudah terorganisasi secara optimal.

---

# 2. Technology Stack

Prototype menggunakan:

- Vite
- Vanilla JavaScript
- ES Modules
- HTML
- CSS
- JSON
- browser `fetch`
- browser `localStorage`

`package.json` mendefinisikan project sebagai ES module:

```json
{
  "type": "module"
}
```

Scripts aktif:

```text
npm run dev
npm run build
npm run preview
```

Vite menjadi satu-satunya direct development dependency utama pada checkpoint ini.

---

# 3. High-Level Architecture

Arsitektur prototype saat ini dapat dibaca sebagai:

```text
index.html
    ↓
src/main.js
    ↓
┌───────────────────────────────────────────┐
│                Application Flow           │
│ scene state, input, transitions, routing  │
└───────────────────────────────────────────┘
    ↓
┌─────────────────┬─────────────────────────┐
│ Battle Logic    │ Run / Profile Logic     │
│                 │                         │
│ battleSetup     │ runState                │
│ movement        │ profileStorage          │
│ ATR             │                         │
│ path            │                         │
│ damage          │                         │
│ enemy movement  │                         │
│ enemy attack    │                         │
│ objective       │                         │
└─────────────────┴─────────────────────────┘
    ↓
┌───────────────────────────────────────────┐
│                    UI                     │
│ basicFlowScreens / battleHud / mapRenderer│
└───────────────────────────────────────────┘
    ↓
src/style.css
```

Data definition berada di:

```text
public/data/
```

Profile persistence berada di:

```text
browser localStorage
```

Active run dan active battle masih berada di memory melalui variable di `main.js`.

---

# 4. Repository Structure at v2.5

Tracked structure yang relevan:

```text
prototype-tmtb/
├─ .gitignore
├─ index.html
├─ package.json
├─ package-lock.json
│
├─ TMTB_CURRENT_STATE.md
├─ TMTB_PROJECT_CONTEXT_v1.0.md
├─ TMTB_PROTOTYPE_V2_5_TODO_AND_DEFERRED_BACKLOG.md
│
├─ public/
│  ├─ favicon.svg
│  ├─ icons.svg
│  └─ data/
│     ├─ units/
│     │  ├─ player_units.json
│     │  └─ enemy_units.json
│     ├─ maps/
│     │  └─ r1_stage1_fixed.json
│     └─ encounters/
│        └─ r1_stage1_baseline_eval_encounter.json
│
├─ src/
│  ├─ main.js
│  ├─ style.css
│  ├─ counter.js
│  │
│  ├─ assets/
│  │  ├─ hero.png
│  │  ├─ javascript.svg
│  │  └─ vite.svg
│  │
│  ├─ logic/
│  │  ├─ shared/
│  │  │  └─ dataLoader.js
│  │  │
│  │  ├─ profile/
│  │  │  └─ profileStorage.js
│  │  │
│  │  ├─ run/
│  │  │  └─ runState.js
│  │  │
│  │  └─ battle/
│  │     ├─ battleSetup.js
│  │     ├─ movementLogic.js
│  │     ├─ atrLogic.js
│  │     ├─ pathLogic.js
│  │     ├─ damageLogic.js
│  │     ├─ enemyMovementLogic.js
│  │     ├─ enemyAttackLogic.js
│  │     └─ objectiveLogic.js
│  │
│  └─ ui/
│     ├─ mapRenderer.js
│     ├─ battle/
│     │  └─ battleHud.js
│     └─ flow/
│        └─ basicFlowScreens.js
│
└─ docs/
   ├─ TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
   └─ handoff-v2.5/
      └─ ...
```

Catatan:

Folder `docs/` dan handoff v2.5 dibuat pada fase dokumentasi setelah checkpoint Full Game Loop Core.

---

# 5. Application Entry Point

## `index.html`

### Responsibility

Entry document browser.

### Current responsibilities

- menyediakan `<div id="app"></div>`;
- memuat favicon;
- memuat `/src/main.js` sebagai ES module.

Flow:

```text
browser loads index.html
→ #app created
→ /src/main.js loaded
→ startApp()
```

### Does not handle

- gameplay rules;
- state;
- persistence;
- rendering logic selain mount point.

---

# 6. Central Application Controller

## `src/main.js`

### Responsibility

`main.js` saat ini berfungsi sebagai **central application controller**.

File ini menghubungkan:

- app startup;
- initial data loading;
- profile loading;
- scene state;
- active run state;
- active battle state;
- keyboard input;
- DOM event attachment;
- battle action orchestration;
- enemy phase scheduling;
- result routing;
- reward routing;
- Crystal conversion;
- Shop routing;
- reset flow.

### Important module-level state

```text
appData
profileState
runState
battleIntroNodeId
battleState
enemyPhaseTimerId
currentScene
```

### Current scene values

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

### Imports

`main.js` imports:

```text
dataLoader
battleSetup
movementLogic
atrLogic
damageLogic
enemyMovementLogic
enemyAttackLogic
objectiveLogic
profileStorage
runState
battleHud
basicFlowScreens
```

### Architecture role

Current architecture places significant orchestration responsibility in `main.js`.

It acts as:

```text
bootstrap
+ scene controller
+ input controller
+ battle controller
+ settlement controller
+ shop controller
```

This works for the prototype but is a known candidate for future separation.

### Important limitation

Battle operations repeatedly use:

```text
appData.stage1Map
```

This means current application orchestration still assumes every battle uses the Stage 1 map.

---

# 7. Shared Data Loader

## `src/logic/shared/dataLoader.js`

### Responsibility

Load initial JSON definitions using `fetch`.

### Loads

```text
player_units.json
enemy_units.json
r1_stage1_fixed.json
r1_stage1_baseline_eval_encounter.json
```

### Returns

```text
{
  playerUnits,
  enemyUnits,
  stage1Map,
  stage1Encounter
}
```

### Current fetch paths

Current implementation uses:

```text
/public/data/units/player_units.json
/public/data/units/enemy_units.json
/public/data/maps/r1_stage1_fixed.json
/public/data/encounters/r1_stage1_baseline_eval_encounter.json
```

Historical documentation previously referenced `/data/...`.

Do not change this implementation based only on old documentation.

Any path cleanup must be tested against the actual Vite development and production behavior.

### Limitation

The loader is currently fixed to one map and one encounter.

It does not yet load content dynamically by node ID.

---

# 8. Profile Persistence Layer

## `src/logic/profile/profileStorage.js`

### Responsibility

Own persistent profile progression stored in browser `localStorage`.

### Storage key

```text
tmtb_profile_v1
```

### Main responsibilities

- create default profile;
- normalize loaded profile;
- load profile;
- save profile;
- mark tutorial completed;
- reset profile;
- add Meta Crystal;
- validate permanent upgrade cost;
- purchase permanent upgrade.

### Persistent profile domains

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

### Permanent upgrade constants

```text
costs:
30 / 60 / 100 / 150

maximum level:
4
```

### Purchase validation

Purchase checks:

- profile exists;
- unit ID valid;
- stat ID valid;
- current level valid;
- optional expected current level matches;
- level below maximum;
- enough Meta Crystal.

### Architecture boundary

This module owns **profile persistence**.

It does not:

- create battle units;
- apply upgrade effects to battle stats;
- manage run progression;
- render Shop UI.

---

# 9. Run State / Region Progression Layer

## `src/logic/run/runState.js`

### Responsibility

Own Region 1 run generation and run progression mutations.

### Defines

- Stage 1 fixed node;
- Stage 2 variant pool;
- Stage 3 variant pool;
- Stage 4 fixed node;
- reward placeholder pool.

### Main exported operations

```text
createInitialRunState
getRunNodeById
markRunNodeCurrent
prepareRunStageVictoryReward
chooseRunReward
completeRunIfFinalStageCompleted
markRunDefeated
```

### Current generated graph

```text
Stage 1
↓
two random Stage 2 nodes
↓
two random Stage 3 nodes
↓
Stage 4
```

Connections between generated Stage 2 and Stage 3 nodes are currently full cross-connections.

### Branch commitment

`markRunNodeCurrent()`:

```text
available node
→ current
```

and blocks available sibling nodes in the same `stageSlot`.

### Reward flow

`prepareRunStageVictoryReward()`:

```text
current stage victory
→ add Crystal
→ generate 4 unique placeholder rewards
→ set pending reward
```

`chooseRunReward()`:

```text
choose one pending reward
→ source node completed
→ next connected future nodes available
→ selected reward ID stored
→ pending reward cleared
```

### Completion

`completeRunIfFinalStageCompleted()` marks the run completed only after:

- Stage 4 is completed;
- there is no current node;
- no pending reward remains.

### Defeat

`markRunDefeated()`:

```text
current node
→ failed

runStatus
→ defeated
```

### Architecture boundary

This module owns **run progression state mutation**.

It does not:

- persist active run;
- render map UI;
- perform Crystal-to-Meta conversion;
- apply reward effects;
- start battles.

Crystal conversion is currently orchestrated in `main.js`.

---

# 10. Battle Setup Layer

## `src/logic/battle/battleSetup.js`

### Responsibility

Transform JSON definitions into runtime battle state.

### Main responsibilities

- find spawn coordinates from map labels;
- resolve unit definitions by unit ID;
- calculate derived player stats;
- apply permanent upgrade levels;
- create runtime player battle units;
- create runtime enemy battle units;
- create initial battle state.

### Runtime construction flow

```text
Unit Definition JSON
+ Encounter Spawn Definition
+ Map Spawn Label
+ optional Permanent Upgrade Levels
↓
Runtime Battle Unit
```

### Permanent upgrade effects

```text
Max HP +2 per level
ATK    +1 per level
DEF    +1 per level
```

Move and ATR remain unchanged.

### Important architecture behavior

Player units can receive:

```text
profileState.permanentUpgrades
```

Enemy units do not receive those upgrades.

### Important limitation

Current implementation directly reads:

```text
data.stage1Encounter
data.stage1Map
```

Therefore battle setup is not yet generic for arbitrary map/encounter pairs.

---

# 11. Movement Rule Layer

## `src/logic/battle/movementLogic.js`

### Responsibility

Own reusable movement reachability and runtime movement mutations.

### Main exported operations

```text
getReachableTilesForUnit
getSelectedPlayerUnit
getMovementTiles
isValidMovementTile
moveSelectedUnitToTile
selectNextReadyPlayerUnit
moveSelectedUnitByDirection
```

### Algorithm

Reachability uses BFS over four orthogonal directions.

### Traversal rules

```text
outside map
→ blocked

obstacle
→ blocked

same-side occupied tile
→ traversal allowed

opponent occupied tile
→ traversal blocked
```

### Destination rules

A unit cannot end movement on:

- obstacle;
- ally;
- opponent.

### Shared use

This module is used by:

- player movement;
- enemy movement AI.

This is an important shared-rule architecture property.

---

# 12. ATR / Target Validation Layer

## `src/logic/battle/atrLogic.js`

### Responsibility

Determine valid basic attack targets.

### Imports

```text
pathLogic.js
```

### Distance rule

Uses:

```text
Math.hypot(deltaX, deltaY)
```

between unit tile positions.

### Validation

Target must:

- be alive;
- be on opposing side;
- be inside attacker ATR;
- pass `pathResult.targetValid`.

### Shared use

Used by:

- player targeting;
- enemy attack AI.

---

# 13. Attack Path / Cover Layer

## `src/logic/battle/pathLogic.js`

### Responsibility

Evaluate obstacle interaction between attacker and target.

### Obstacle codes

```text
O30 → 30% partial cover
O70 → 70% partial cover
OF  → 100% full cover
```

### Geometry

Uses center-to-center line segment.

The implementation checks whether the segment crosses the **interior** of an obstacle tile.

Touching only an edge or corner does not count as crossing the interior.

### Melee behavior

Obstacle crossed:

```text
targetValid = false
outcome = melee_blocked
```

### Ranged behavior

Partial cover:

```text
target remains valid
damage reduced
```

Full cover:

```text
target remains valid
damageBlocked = true
coverPercentage = 1
```

The attack can still be confirmed and can produce 0 damage.

---

# 14. Damage Layer

## `src/logic/battle/damageLogic.js`

### Responsibility

Calculate and resolve basic attacks between runtime units.

### Damage formula

```text
floor(
  max(
    0,
    ATK * (1 - coverPercentage) - DEF
  )
)
```

### Main exported operations

```text
calculateBasicAttackDamage
resolveBasicAttackBetweenUnits
resolveBasicAttack
```

### Shared behavior

`resolveBasicAttackBetweenUnits()` works for either side.

This allows the same damage resolver to be used by:

- player attack;
- enemy attack.

### Side effects on runtime state

On successful resolution:

- attacker becomes exhausted;
- attacker `hasActed = true`;
- target HP is reduced;
- HP is clamped at 0.

---

# 15. Enemy Movement Layer

## `src/logic/battle/enemyMovementLogic.js`

### Responsibility

Resolve enemy movement during Enemy Phase.

### Imports

```text
movementLogic.js
```

### Current AI behavior

For each living enemy:

1. choose nearest living player;
2. if already inside ATR, remain in place;
3. otherwise calculate reachable tiles using shared movement rules;
4. rank reachable tiles by distance to target;
5. move to best tile.

Tie-breaking uses deterministic sorting.

### Architecture benefit

Enemy movement does not duplicate the movement traversal rules.

It reuses:

```text
getReachableTilesForUnit()
```

from `movementLogic.js`.

---

# 16. Enemy Attack Layer

## `src/logic/battle/enemyAttackLogic.js`

### Responsibility

Resolve enemy attacks after enemy movement.

### Imports

```text
atrLogic.js
damageLogic.js
```

### Current target selection

Priorities:

```text
1. nearest valid target
2. lower current HP
3. battleUnitId tie-breaker
```

### Shared rule use

Enemy attacks use:

```text
getValidBasicAttackTargetsForUnit()
resolveBasicAttackBetweenUnits()
```

Therefore player and enemy attacks share:

- ATR validation;
- path evaluation;
- cover logic;
- damage calculation.

This is one of the stronger parts of the current architecture.

---

# 17. Objective Resolver Layer

## `src/logic/battle/objectiveLogic.js`

### Responsibility

Evaluate battle objective resolution.

### Current supported objective

```text
eliminate_all
```

### Result

Victory is resolved when no living enemy remains.

### Limitation

Other objectives are not supported.

The module returns:

```text
reason: unsupported_objective
```

for unsupported objective types.

---

# 18. Flow Screen UI Layer

## `src/ui/flow/basicFlowScreens.js`

### Responsibility

Return HTML strings for non-battle screens.

### Current screens

```text
Title
Main Menu
Map Selection
Battle Intro
Reward Selection
Run Completion
Run Defeat
Post-Run Shop
```

### Also contains

- Main Menu item definitions;
- Post-Run Shop upgrade group definitions;
- hard-coded Region Graph layout;
- region node rendering;
- selected node preview;
- reward card rendering;
- completion/defeat summary rendering.

### Architecture boundary

This file primarily renders UI.

State mutations and routing occur in `main.js` and logic modules.

### Known limitation

Region graph coordinates and connection lines are hard-coded.

The graph is not yet dynamically laid out from `nodeConnections`.

### Known stale copy

Some Shop text still says permanent upgrade effects are not active.

The implementation now applies those effects in run battles.

This is stale UI copy, not architecture truth.

---

# 19. Battle HUD UI Layer

## `src/ui/battle/battleHud.js`

### Responsibility

Render the battle-level UI shell.

### Renders

- top bar;
- roster;
- battlefield;
- unit detail;
- target preview;
- command band;
- input hints;
- result overlay.

### Imports

```text
mapRenderer.js
```

### Architecture boundary

This file does not calculate:

- movement;
- ATR;
- path;
- damage;
- enemy AI.

Those values are passed in or read from battle state.

### Important limitation

Battle HUD still renders:

```text
data.stage1Map
```

directly.

This contributes to the current Stage 1 map dependency.

### Known stale copy

Some input-hint text still describes Enemy Phase as not implemented.

Enemy Phase is already active.

This should be treated as UI cleanup.

---

# 20. Battlefield Renderer

## `src/ui/mapRenderer.js`

### Responsibility

Render:

- map grid;
- tile type;
- runtime unit token;
- movement highlight;
- attack target highlight;
- selected target;
- attack line;
- map legend.

### Inputs

```text
mapData
battleState
movementTiles
validAttackTargets
```

### Rendering boundary

The renderer uses rule results calculated elsewhere.

It does not decide movement validity or attack validity.

### Hard-coded visual assumptions

Attack-line and grid rendering currently assume:

```text
tile size = 80 px
tile gap  = 8 px
```

These values are also reflected in CSS.

This is a presentation coupling that may need cleanup if grid sizing becomes configurable.

---

# 21. Global Stylesheet

## `src/style.css`

### Responsibility

Contains nearly all visual styling for the prototype.

Current styling domains include:

- loading;
- error state;
- map grid;
- battle HUD;
- targeting;
- attack line;
- battle result;
- Title;
- Main Menu;
- Map Selection;
- Battle Intro;
- Reward Selection;
- Completion;
- Defeat;
- Post-Run Shop;
- responsive rules.

### Architecture state

There is currently one large global stylesheet.

No component-level CSS modules are used.

This is acceptable for the current prototype size but is a potential cleanup area.

---

# 22. Data Definition Layer

Data definitions live under:

```text
public/data/
```

The current data layer is partially data-driven.

---

## 22.1 `public/data/units/player_units.json`

Defines:

```text
Guard
Archer
```

Fields include:

- unit ID;
- name;
- side;
- role;
- Max HP;
- base ATK;
- base DEF;
- Move;
- ATR;
- attack type;
- target pattern;
- target category;
- projectile metadata;
- path-check metadata.

These are base definitions.

Runtime state is created later by `battleSetup.js`.

---

## 22.2 `public/data/units/enemy_units.json`

Currently defines only:

```text
Sword Enemy
```

Also contains:

```text
aiTags
```

Current enemy AI does not yet branch behavior based on those tags.

---

## 22.3 `public/data/maps/r1_stage1_fixed.json`

Defines:

```text
mapId
name
width
height
tiles
legend
```

Current map size:

```text
7 × 5
```

Tile codes include:

```text
.
P1
P2
E1
E2
O30
O70
OF
```

Spawn markers are definition-time markers.

At runtime, units are placed using these labels and rendered instead of the spawn marker.

---

## 22.4 `public/data/encounters/r1_stage1_baseline_eval_encounter.json`

Defines:

```text
encounterId
name
stageSlot
mapId
objectiveType
victoryCondition
defeatCondition
playerSpawns
enemySpawns
crystalReward
difficultyTag
notes
```

Player spawn mapping:

```text
Guard  → P1
Archer → P2
```

Enemy spawn mapping:

```text
Sword Enemy → E1
Sword Enemy → E2
```

### Important implementation detail

Not all encounter fields are currently consumed dynamically.

For example, run node Crystal reward is currently defined in `runState.js`, not taken dynamically from encounter JSON.

---

# 23. Definition Data vs Runtime State

Current architecture already separates definition data from runtime state.

Example:

```text
player_units.json
↓
unit definition

r1_stage1_baseline_eval_encounter.json
↓
which units spawn where

r1_stage1_fixed.json
↓
where spawn labels exist

battleSetup.js
↓
runtime battle units

battleState
↓
mutable battle data
```

This separation should be preserved during future expansion.

---

# 24. Primary Runtime Data Flow

Application startup:

```text
index.html
→ main.js
→ loadInitialPrototypeData()
→ loadProfileState()
→ currentScene = title
→ renderApp()
```

Start Journey for new player:

```text
Main Menu
→ startJourney()
→ tutorialCompleted = false
→ createInitialBattleState(appData)
→ Battle
```

Start Journey for returning player:

```text
Main Menu
→ startJourney()
→ tutorialCompleted = true
→ createInitialRunState()
→ Map Selection
```

Run stage:

```text
Map node
→ Battle Intro
→ markRunNodeCurrent()
→ createInitialBattleState(
     appData,
     profileState.permanentUpgrades
   )
→ Battle
```

Victory:

```text
Battle victory
→ prepareRunStageVictoryReward()
→ Reward Selection
→ chooseRunReward()
→ unlock next nodes
→ Map Selection
```

Final victory:

```text
Stage 4 victory
→ Reward Selection
→ chooseRunReward()
→ completeRunIfFinalStageCompleted()
→ Crystal conversion in main.js
→ Run Completion
```

Defeat:

```text
Battle defeat
→ markRunDefeated()
→ Crystal conversion in main.js
→ Run Defeat
```

Post-run:

```text
Completion / Defeat
→ Post-Run Shop
→ purchasePermanentUpgrade()
→ localStorage
→ Main Menu
```

---

# 25. Input Architecture

Keyboard input is centralized in:

```text
src/main.js
```

`handleKeyboardInput()` routes input based on:

```text
currentScene
```

Battle input is further routed based on:

```text
battleState.battleControlState
```

Current battle control states include:

```text
unit_selected_movement
action_menu_open
attack_targeting
enemy_phase
battle_result
```

Mouse/click event handlers are attached after rendering through:

```text
attachFlowEvents()
attachBattleEvents()
```

Current UI uses full `innerHTML` rerenders followed by event reattachment.

---

# 26. Rendering Architecture

Current rendering style:

```text
state changes
→ renderApp()
→ generate HTML string
→ assign innerHTML
→ reattach DOM events
```

This is a simple imperative rendering model suitable for the current prototype.

It is not using a UI framework or virtual DOM.

---

# 27. Persistence Architecture

## Persistent

Stored in `localStorage`:

```text
profileState
```

Including:

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

## Non-persistent

Memory only:

```text
currentScene
runState
battleState
battleIntroNodeId
enemyPhaseTimerId
```

Refresh therefore loses the active run and battle.

Git version control also does not synchronize browser `localStorage`.

---

# 28. Shared Battle Rule Architecture

A strong current design pattern is reuse of core battle rules.

```text
movementLogic
├─ player movement
└─ enemy movement

atrLogic
├─ player attack validation
└─ enemy attack validation

pathLogic
├─ player attack path
└─ enemy attack path

damageLogic
├─ player attack
└─ enemy attack
```

This reduces duplicated combat rules.

Future auto-simulation should ideally continue to use these shared rule modules rather than reimplementing combat separately.

---

# 29. Current Architecture Limitations

## 29.1 `main.js` is overloaded

It currently owns too many responsibilities:

```text
scene controller
input controller
battle orchestration
enemy phase timing
settlement
Crystal conversion
Shop routing
```

Future cleanup may split these concerns.

---

## 29.2 Battle content is hard-coded to Stage 1

Dependencies appear in multiple places:

```text
dataLoader.js
battleSetup.js
main.js
battleHud.js
```

All stage battles currently resolve using:

```text
stage1Map
stage1Encounter
```

Unique stage content requires refactoring this chain.

---

## 29.3 Run node data and battle content are disconnected

Run nodes define:

```text
nodeId
name
difficulty
Crystal reward
objective
```

But they do not currently select unique:

```text
map data
encounter data
enemy composition
```

---

## 29.4 Crystal conversion lives in `main.js`

The conversion process is orchestrated directly inside completion and defeat routing.

A future settlement module may make this responsibility clearer.

---

## 29.5 Reward definitions live in `runState.js`

Reward pool definitions and run progression mutations currently share one file.

This is acceptable for placeholders, but active reward effects may justify a dedicated reward module/data layer later.

---

## 29.6 Map graph layout is hard-coded

Node connections exist in `runState`.

However UI connection lines and node positions are manually defined in `basicFlowScreens.js`.

The graph renderer does not yet derive layout directly from connection data.

---

## 29.7 CSS is monolithic

All screens currently share:

```text
src/style.css
```

This may become harder to maintain as UI grows.

---

## 29.8 No automated test layer

Core rules currently rely on manual testing.

Candidate automated test targets include:

- BFS movement;
- ATR;
- path/cover;
- damage formula;
- node progression;
- Crystal conversion idempotency;
- permanent upgrade purchase;
- permanent upgrade application.

---

# 30. Legacy / Likely Unused Files

The following files are present in the repository but were not found in the audited active import/render path:

```text
src/counter.js
src/assets/hero.png
src/assets/javascript.svg
src/assets/vite.svg
public/icons.svg
```

### `src/counter.js`

Contains a basic Vite-style counter helper.

No active import was found in the audited `main.js`.

Status:

```text
LEGACY / LIKELY UNUSED
```

### Assets

The audited files do not reference:

```text
hero.png
javascript.svg
vite.svg
icons.svg
```

Status:

```text
LIKELY UNUSED
NEEDS CONFIRMATION BEFORE DELETION
```

Do not delete them solely based on this document.

`public/favicon.svg` is actively referenced by `index.html`.

---

# 31. Current Dependency Graph

Simplified dependency graph:

```text
index.html
└─ src/main.js
   ├─ src/style.css
   ├─ logic/shared/dataLoader.js
   ├─ logic/battle/battleSetup.js
   ├─ logic/battle/movementLogic.js
   ├─ logic/battle/atrLogic.js
   │  └─ logic/battle/pathLogic.js
   ├─ logic/battle/damageLogic.js
   ├─ logic/battle/enemyMovementLogic.js
   │  └─ logic/battle/movementLogic.js
   ├─ logic/battle/enemyAttackLogic.js
   │  ├─ logic/battle/atrLogic.js
   │  └─ logic/battle/damageLogic.js
   ├─ logic/battle/objectiveLogic.js
   ├─ logic/profile/profileStorage.js
   ├─ logic/run/runState.js
   ├─ ui/battle/battleHud.js
   │  └─ ui/mapRenderer.js
   └─ ui/flow/basicFlowScreens.js
      └─ logic/profile/profileStorage.js
         (upgrade constants)
```

Data flow:

```text
public/data JSON
→ dataLoader
→ appData
→ battleSetup
→ battleState
→ logic modules
→ UI renderer
```

Profile flow:

```text
localStorage
↔ profileStorage
↔ profileState
→ battleSetup permanent upgrades
```

Run flow:

```text
runState.js
↔ runState in main.js
→ basicFlowScreens
```

---

# 32. File Responsibility Summary

| File | Primary Responsibility |
|---|---|
| `index.html` | Browser entry and app mount |
| `src/main.js` | Central app, scene, input, orchestration |
| `src/style.css` | Global prototype styling |
| `dataLoader.js` | Fetch initial JSON data |
| `profileStorage.js` | Persistent profile and permanent upgrade purchases |
| `runState.js` | Run generation and progression mutations |
| `battleSetup.js` | Build initial runtime battle state |
| `movementLogic.js` | Shared movement and BFS reachability |
| `atrLogic.js` | Shared ATR target validation |
| `pathLogic.js` | Attack path and cover evaluation |
| `damageLogic.js` | Shared basic attack damage resolution |
| `enemyMovementLogic.js` | Enemy movement AI |
| `enemyAttackLogic.js` | Enemy attack AI |
| `objectiveLogic.js` | Objective resolution |
| `basicFlowScreens.js` | Non-battle screen rendering |
| `battleHud.js` | Battle HUD rendering |
| `mapRenderer.js` | Battlefield/grid rendering |

---

# 33. Recommended Architecture Direction After v2.5

Do not perform this refactor automatically.

Recommended sequence after stabilization:

```text
1. Make battle startup accept explicit mapData + encounterData
2. Connect run nodes to unique content definitions
3. Remove stage1Map / stage1Encounter assumptions
4. Separate scene routing from main.js
5. Separate input controller
6. Separate run settlement / Crystal conversion
7. Separate Shop controller if needed
8. Add automated tests for core rule modules
```

The current architecture should be evolved incrementally rather than replaced wholesale.

---

# 34. Architecture Status Summary

```text
Data definitions separated from runtime state     YES
Core battle rules separated from UI               MOSTLY YES
Player/enemy shared movement rules                 YES
Player/enemy shared attack validation              YES
Player/enemy shared damage resolver                YES
Profile persistence separated                      YES
Run progression logic separated                    YES

Scene controller separated from main.js            NO
Input controller separated                         NO
Settlement controller separated                    NO
Shop controller separated                          NO

Unique map/encounter per node                      NO
Dynamic content loading by node                    NO
Dynamic graph layout                               NO
Active run persistence                             NO
Automated tests                                    NO
```

---

# 35. Architecture Principle to Preserve

The strongest architectural principle already visible in v2.5 is:

```text
Definition Data
→ Runtime State
→ Shared Rule Logic
→ UI Rendering
```

Future development should preserve this separation.

Especially:

> Do not move combat calculations into UI renderers.

> Do not create separate player and enemy damage formulas unless the design intentionally requires different rules.

> Do not duplicate movement rules for AI when shared movement logic can be reused.

> Do not treat historical folder plans as more authoritative than the actual repository.

This document represents the architecture snapshot of **TMTB Prototype v2.5 — Full Game Loop Core**.
