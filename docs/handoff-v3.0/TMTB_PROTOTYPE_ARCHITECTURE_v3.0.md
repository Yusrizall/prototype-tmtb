# TMTB Prototype Architecture — Handoff v3.0

**Project:** TMTB / BeCan Prototype
**Document Type:** Handoff Snapshot — Prototype Architecture
**Handoff Package Version:** 3.0
**Game Design Reference:** `TMTB_GAME_DESIGN_CONTEXT.md` v3.1 / `TMTB_GAME_DESIGN_DECISIONS_v3.1.md`
**Prototype Implementation Baseline:** **Post-v2.5 / Pre-v3 Combat Migration**
**Architecture Audit Date:** 11 August 2026
**Project Root:** `C:\Datas\prototype-tmtb`
**Status:** **CURRENT ARCHITECTURE SNAPSHOT — EVIDENCE-AWARE**

---

# 1. Scope

Dokumen ini menjelaskan **arsitektur prototype aktual yang telah diaudit**, bukan arsitektur ideal untuk Unity production dan bukan proposal refactor final.

Prinsip utama:

> **Actual repository first.**

Dokumen ini memetakan:

- tracked repository structure;
- application entry / central orchestration;
- battle rule modules;
- run/profile modules;
- UI modules;
- data definitions;
- deployment;
- persistence;
- current dependency flow;
- known architectural limitations;
- known migration-pressure points menuju current Game Design v3.1.

Jika dokumen ini bertentangan dengan actual repository/source terbaru:

```text
actual repository/source wins
```

---

# 2. Evidence Labels

Dokumen ini menggunakan label berikut.

## AUDITED CURRENT SOURCE — 11 AUG 2026

Actual current file telah dibaca saat recovery audit.

## AUDITED CURRENT GIT / TREE

File/path diverifikasi melalui actual `git ls-files`, Git history, atau diff audit.

## RUNTIME CONFIRMED — 11 AUG 2026

Behaviour terkait dikonfirmasi melalui runtime smoke test.

## CARRIED FROM v2.5 — NO RELEVANT GIT DELTA FOUND

Tanggung jawab module berasal dari architecture snapshot v2.5 dan tidak ditemukan relevant committed modification setelah tag `v2.5-full-loop-core`.

Ini tidak berarti seluruh file dibaca ulang line-by-line pada audit 11 August.

## UNCOMMITTED CURRENT WORK

Perubahan ada di local working tree, telah diaudit, dan pada bagian yang diuji juga runtime-confirmed, tetapi belum committed.

## MIGRATION PRESSURE

Area current architecture yang akan terdampak oleh current design target.

Ini **bukan** berarti refactor tersebut sudah dilakukan atau sudah diputuskan secara teknis.

---

# 3. Technology Stack

Current prototype uses:

- Vite;
- Vanilla JavaScript;
- ES Modules;
- HTML;
- CSS;
- JSON;
- browser `fetch`;
- browser `localStorage`;
- Git;
- GitHub;
- GitHub Pages.

Carried development commands:

```text
npm run dev
npm run build
npm run preview
```

Vite remains the current bundler/development server.

---

# 4. Current High-Level Architecture

Current architecture can be summarized as:

```text
index.html
    ↓
src/main.js
    ↓
┌──────────────────────────────────────────────────┐
│            Central Application Controller         │
│ scene routing / app state / input / orchestration│
└──────────────────────────────────────────────────┘
    ↓
┌──────────────────────┬───────────────────────────┐
│ Battle Logic         │ Run / Profile Logic       │
│                      │                           │
│ battleSetup          │ runState                  │
│ movementLogic        │ profileStorage            │
│ atrLogic             │                           │
│ pathLogic            │                           │
│ damageLogic          │                           │
│ enemyMovementLogic   │                           │
│ enemyAttackLogic     │                           │
│ objectiveLogic       │                           │
└──────────────────────┴───────────────────────────┘
    ↓
┌──────────────────────────────────────────────────┐
│                      UI                           │
│ battleHud / basicFlowScreens / mapRenderer       │
└──────────────────────────────────────────────────┘
    ↓
src/style.css
```

Definition data:

```text
public/data/
```

Persistent profile:

```text
browser localStorage
```

Active run / battle / scene:

```text
module-level in-memory state owned primarily by src/main.js
```

Deployment:

```text
Vite build
→ dist/
→ GitHub Pages workflow
```

---

# 5. Current Tracked Repository Structure

## AUDITED CURRENT GIT / TREE — 11 AUG 2026

Relevant tracked structure:

```text
prototype-tmtb/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
│
├─ .gitignore
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
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
   ├─ TMTB_GAME_DESIGN_CONTEXT.md
   ├─ TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
   └─ handoff-v2.5/
      ├─ README.md
      ├─ TMTB_CHAT_HANDOFF_v2.5.md
      ├─ TMTB_CURRENT_STATE_v2.5.md
      ├─ TMTB_GAME_DESIGN_DECISIONS_v2.5.md
      ├─ TMTB_PROGRESS_AND_BACKLOG_v2.5.md
      ├─ TMTB_PROJECT_CONTEXT_v2.5.md
      ├─ TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
      └─ TMTB_STATE_AND_DATA_MODEL_v2.5.md
```

## Handoff v3.0 target documentation structure

The current documentation package uses the following target structure after local placement:

```text
docs/
├─ TMTB_GAME_DESIGN_CONTEXT.md
├─ TMTB_GAME_DESIGN_DECISIONS_v3.1.md
├─ TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
├─ supporting/
│  └─ ...
├─ handoff-v3.0/
│  └─ ...
└─ handoff-v2.5/
   └─ historical snapshot
```

This planned docs organization is documentation governance, not gameplay architecture.

---

# 6. Git Delta Since v2.5 Milestone

## AUDITED CURRENT GIT

Known milestone tag:

```text
v2.5-full-loop-core
```

Commits after tag:

```text
4de8acd Adding Game Design Context
4417dc6 Fix data loading for production deployment
cbd33ac Add GitHub Pages deployment
```

Committed file delta:

```text
A  .github/workflows/deploy.yml
A  docs/TMTB_GAME_DESIGN_CONTEXT.md
M  src/logic/shared/dataLoader.js
A  vite.config.js
```

Therefore:

```text
no committed combat-module migration after v2.5 tag was found
```

Relevant local uncommitted changes at audit:

```text
src/main.js
src/style.css
src/ui/flow/basicFlowScreens.js
```

These implement Run Overview / Shop-flow work, not current combat v3 migration.

---

# 7. Browser Entry Point

## `index.html`

### Evidence

**CARRIED FROM v2.5 — NO RELEVANT GIT DELTA FOUND**

### Responsibility

Browser entry document.

Current role:

```text
browser
→ index.html
→ #app mount
→ src/main.js ES module
```

It should not own:

- game rules;
- runtime domain state;
- persistence rules;
- battle logic.

---

# 8. Central Application Controller

## `src/main.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**
**UNCOMMITTED CURRENT WORK**
Run Overview-related behaviour: **RUNTIME CONFIRMED**

### Current responsibility

`main.js` remains the central orchestration/controller module.

It currently owns or coordinates:

- startup;
- initial JSON loading;
- profile loading;
- active scene;
- active run;
- active battle;
- battle-intro node state;
- keyboard input;
- DOM event binding;
- battle player-action orchestration;
- old Enemy Phase scheduling;
- battle-result routing;
- reward routing;
- run completion / defeat settlement flow;
- Crystal conversion orchestration;
- Shop navigation;
- Run Overview navigation;
- reset flow.

### Current imports

Battle:

```text
createInitialBattleState
movement helpers
ATR targeting
resolveBasicAttack
resolveEnemyMovementPhase
resolveEnemyAttackPhase
evaluateEliminateAllObjective
```

Profile:

```text
loadProfileState
markTutorialCompleted
resetProfileState
addMetaCrystal
purchasePermanentUpgrade
```

Run:

```text
createInitialRunState
getRunNodeById
markRunNodeCurrent
prepareRunStageVictoryReward
chooseRunReward
completeRunIfFinalStageCompleted
markRunDefeated
```

UI:

```text
renderBattleHud

renderTitleScreen
renderMainMenuScreen
renderRunOverviewScreen
renderMapSelectionScreen
renderBattleIntroScreen
renderRewardSelectionScreen
renderRunCompletionScreen
renderRunDefeatScreen
renderPostRunShopScreen
```

### Important module-level state

Current source contains module-level state equivalent to:

```text
appData
profileState
runState
battleIntroNodeId
battleState
enemyPhaseTimerId
currentScene
```

### Current scenes

Current audited scene vocabulary includes:

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

### Current action options

```text
attack
skill
wait
```

`Skill` remains UI/action vocabulary without active normal resolution in the audited controller.

### Current enemy-turn orchestration

`main.js` currently calls:

```text
resolveEnemyMovementPhase(...)
↓
resolveEnemyAttackPhase(...)
```

This establishes current batch-style enemy execution:

```text
all movement
→ all attacks
```

not v3.1 sequential full activation.

### Architecture limitation

`main.js` remains highly centralized.

It currently combines:

```text
routing
UI events
keyboard input
battle controller
enemy phase scheduler
run/result routing
Shop/meta flow
```

### Migration pressure

Current design v3.1 will create pressure around this module for:

- party-wide Player Turn;
- Shared Team AP lifecycle;
- global End Turn;
- player action commitment without Exhaustion;
- sequential enemy activation;
- Intent refresh timing;
- Wave timing;
- Tutorial flow orchestration.

This does **not** yet determine the final refactor.

---

# 9. Shared Data Loader

## `src/logic/shared/dataLoader.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**
**POST-v2.5 COMMITTED CHANGE**

### Responsibility

Loads initial JSON definition data.

Current API:

```text
loadJson(relativePath)
loadInitialPrototypeData()
```

### Current path architecture

Current source uses:

```text
import.meta.env.BASE_URL
```

then normalizes and appends the requested relative path.

Conceptually:

```text
BASE_URL
+
data/...
→ fetch
→ JSON
```

Current loaded datasets:

```text
playerUnits
enemyUnits
stage1Map
stage1Encounter
```

### Current data paths

```text
data/units/player_units.json
data/units/enemy_units.json
data/maps/r1_stage1_fixed.json
data/encounters/r1_stage1_baseline_eval_encounter.json
```

### Architecture boundary

This module loads definitions.

It does not own:

- derived runtime battle units;
- run state;
- profile persistence;
- gameplay resolution.

### Current limitation

Initial data loader is still hard-coded to one baseline map/encounter set.

---

# 10. Deployment Configuration

## `vite.config.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

Current config:

```text
base = "/prototype-tmtb/"
```

Purpose:

- make Vite build asset/data paths compatible with the GitHub Pages repository subpath.

---

# 11. GitHub Pages Workflow

## `.github/workflows/deploy.yml`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

Current deployment flow:

```text
push main
or manual workflow_dispatch
→ checkout
→ setup Node LTS
→ npm ci
→ npm run build
→ configure Pages
→ upload ./dist
→ deploy Pages
```

Permissions include Pages and ID-token requirements.

### Architecture role

This adds a production-hosting path to the prototype repository.

It is infrastructure, not gameplay state.

---

# 12. Profile Persistence Layer

## `src/logic/profile/profileStorage.js`

### Evidence

**CARRIED FROM v2.5 — NO RELEVANT GIT DELTA FOUND**

### Responsibility

Owns persistent player/profile state in browser `localStorage`.

Carried responsibilities:

- load/sanitize profile;
- save profile;
- mark Tutorial completed;
- reset profile;
- add Meta Crystal;
- permanent-upgrade purchase;
- permanent-upgrade validation/cost/state.

Historical storage key:

```text
tmtb_profile_v1
```

Persistent domains include:

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

### Architecture boundary

Profile persistence should own durable profile data.

It should not own active battle rules or route/battle UI.

### Current integration

Run Overview reads current profile data such as:

```text
tutorialCompleted
metaCrystal
```

through controller/UI flow.

---

# 13. Run State / Region Progression Layer

## `src/logic/run/runState.js`

### Evidence

**CARRIED FROM v2.5 — NO RELEVANT GIT DELTA FOUND**

### Responsibility

Owns current in-memory Run state and route progression logic.

Carried responsibilities:

- create initial run graph/state;
- lookup nodes;
- mark current node;
- branch commitment;
- prepare stage reward;
- select reward;
- mark node complete;
- determine final completion;
- mark run defeated.

### Carried current graph

Historical current Region 1 prototype flow:

```text
Stage 1 fixed
→ 2 unique Stage 2 variants chosen from A/B/C
→ 2 unique Stage 3 variants chosen from A/B/C
→ Stage 4 fixed
```

Node-state vocabulary:

```text
future
available
current
completed
blocked
failed
```

### Architecture boundary

`runState.js` owns run topology/progression state.

It does not currently own unique battle-data lookup per route node.

### Current limitation

Run node identity and battle content remain disconnected.

Different route nodes can still launch the same `stage1Map` / `stage1Encounter`.

---

# 14. Battle Setup Layer

## `src/logic/battle/battleSetup.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

### Responsibility

Constructs runtime battle state from loaded definition data and optional permanent upgrades.

Current responsibilities include:

- find map spawn position;
- resolve unit definition by `unitId`;
- sanitize permanent-upgrade level;
- create derived stats;
- construct runtime battle units;
- create initial Player Unit array;
- create initial Enemy Unit array;
- create initial battle state.

### Runtime construction

Conceptually:

```text
definition unit
+
spawn label
+
map position
+
permanent upgrades
→ runtime battle unit
```

### Current player-upgrade effects

Carried/current code supports:

```text
Max HP +2 per level
ATK    +1 per level
DEF    +1 per level
```

Move and ATR remain unchanged by permanent upgrade level.

### Current battle-unit fields created here

Includes:

```text
battleUnitId
unitDefId
name
side
role
tileX / tileY
originTile
currentHP / maxHP
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

### Current initial action state

```text
turnState = "ready"
hasActed = false
```

### Current limitation

Battle setup reads:

```text
data.stage1Encounter
data.stage1Map
```

directly.

This reinforces current Stage 1 battle-content hard-coding.

### Migration pressure

Future current-design migration may require battle setup to initialize fields/state for:

- Team AP at battle/Player Turn level;
- canonical StartGrid semantics;
- player Movement Lock;
- explicit enemy Spawn Order;
- Intent-related state;
- Status;
- Charge;
- Wave reservation;
- Tutorial flow/evidence state.

Exact ownership is not yet technically locked.

---

# 15. Movement Rule Layer

## `src/logic/battle/movementLogic.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

### Responsibility

Owns prototype grid movement reachability and selected-player reposition helpers.

Current exported operations include:

```text
getReachableTilesForUnit
getSelectedPlayerUnit
getMovementTiles
isValidMovementTile
moveSelectedUnitToTile
selectNextReadyPlayerUnit
moveSelectedUnitByDirection
```

### Current algorithm

Movement uses BFS/grid reachability.

Current traversal/destination evaluation considers:

- map bounds;
- obstacle tiles;
- living-unit occupancy;
- destination legality;
- unit movement allowance.

### Current movement anchor

Movement uses:

```text
originTile
```

as the per-turn reference anchor.

### Current action-state coupling

Movement is blocked when the selected unit is Exhausted.

Current movement does **not**:

- spend Shared AP;
- implement leave-StartGrid AP commitment;
- implement return refund;
- implement post-Attack Movement Lock independent of Exhaustion.

### Reusable seed

BFS movement and `originTile` are likely useful migration foundations.

They are not yet v3.1 StartGrid/Shared AP semantics.

---

# 16. ATR / Target Validation Layer

## `src/logic/battle/atrLogic.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

### Responsibility

Computes basic attack target candidates for a unit.

Current exports:

```text
getTileDistance
getValidBasicAttackTargetsForUnit
getValidBasicAttackTargets
```

### Current distance metric

```text
Euclidean tile-center distance
=
hypot(deltaX, deltaY)
```

### Current validation dependencies

Targeting checks current unit state, including old Exhaustion gating.

It also uses attack-path evaluation from `pathLogic.js`.

### Shared use

This layer is reused by:

- player basic attack targeting;
- enemy attack target selection.

### Architecture implication

Changes to attack validity here can affect both sides.

### Current limitation

The current layer does not model distinct v3.1 ranged LOS validity separately from Cover with sufficient fidelity.

---

# 17. Attack Path / Cover Layer

## `src/logic/battle/pathLogic.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

### Responsibility

Evaluates obstacles crossed by the attack segment and classifies attack-path/Cover result.

### Current obstacle codes

```text
O30
O70
OF
```

Current intended values:

```text
30%
70%
100% / Full
```

### Geometry

Current code evaluates whether the line segment crosses the interior of obstacle tiles.

Touching only a tile edge/corner is treated differently from crossing its interior.

### Current result vocabulary

Current logic produces concepts equivalent to:

```text
clear
partial_cover
full_cover
melee_blocked
```

### Current ranged behaviour

Ranged target can remain targetable through Cover, including Full Cover, while effectiveness may become zero.

### Current limitation

There is no separate authoritative result equivalent to:

```text
No LOS
```

for the current design distinction:

```text
LOS
≠
Cover
```

### Migration pressure

Future Tactical Space work needs an explicit separation between:

```text
Target Validity
Action Validity / LOS
Action Effectiveness / Cover
```

without discarding the useful existing obstacle geometry blindly.

---

# 18. Damage Layer

## `src/logic/battle/damageLogic.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

### Responsibility

Calculates and resolves basic attack damage.

Current public operations include:

```text
calculateBasicAttackDamage
resolveBasicAttackBetweenUnits
resolveBasicAttack
```

### Current damage relation

Current formula is effectively:

```text
floor(max(0, ATK × (1 - Cover) - DEF))
```

### Shared use

This attack resolver is used by both Player and Enemy basic attacks.

### Current side effect

After attack resolution, current old action-state logic marks the attacker:

```text
turnState = "exhausted"
hasActed = true
```

This is a major coupling.

### Architecture warning

Attack resolution currently owns both:

```text
combat effect
+
old activation-completion side effect
```

Future player action migration cannot simply remove Exhaustion without checking Enemy behaviour because the resolver is shared.

### Migration pressure

Current v3.1 design needs attack effect resolution to coexist with different actor availability semantics:

- Player Attack → no Exhaustion; Movement lock/action legality;
- Enemy activation completion → sequential activation lifecycle.

Exact technical separation is not yet chosen.

---

# 19. Enemy Movement Layer

## `src/logic/battle/enemyMovementLogic.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

### Responsibility

Resolves the current enemy movement pass.

### Current target selection

Movement chooses nearest living player.

Current tie-break:

```text
nearest distance
→ battleUnitId
```

### Destination choice

Current deterministic priority approximately:

```text
closest resulting target distance
→ shorter movement distance
→ lower Y
→ lower X
```

### Current pass architecture

Enemy IDs are processed sequentially inside the movement pass.

Therefore later enemies can read board state after earlier enemy movement.

### Current limitation

Movement chooses/uses a procedural target but does not produce a canonical explicit `Current Target` / `Intent` state.

Current movement also uses simple range considerations that are not yet equivalent to future Action Validity / LOS-aware enemy planning.

---

# 20. Enemy Attack Layer

## `src/logic/battle/enemyAttackLogic.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

### Responsibility

Resolves the current enemy attack pass.

### Current target selection

Valid attack targets are ranked by:

```text
nearest
→ lower HP
→ battleUnitId
```

### Current pass architecture

Enemy attacks are processed sequentially inside the attack pass.

Later enemies read the updated battle state after previous attacks.

### Important mismatch

Enemy movement and enemy attack select targets in separate modules/passes.

Therefore:

```text
movement target
may differ from
attack target
```

There is no single explicit Current Target / Intent state binding them.

### Current old completion behaviour

Enemy that cannot attack can still be exhausted/completed under the old enemy-phase model.

### Migration pressure

Current design needs:

```text
Target Rule
Movement Rule
Action Rule
Intent
Fallback
```

with sequential:

```text
Enemy A Move + Action
→ Enemy B Move + Action
```

rather than independent global movement and attack passes.

---

# 21. Objective Resolver Layer

## `src/logic/battle/objectiveLogic.js`

### Evidence

**CARRIED FROM v2.5 — NO RELEVANT GIT DELTA FOUND**

### Responsibility

Evaluates current battle objective/result condition.

Current supported objective:

```text
eliminate_all
```

Current result architecture feeds battle completion/victory/defeat routing.

### Limitation

No objective variety is currently implemented in the baseline content.

---

# 22. Flow Screen UI Layer

## `src/ui/flow/basicFlowScreens.js`

### Evidence

**UNCOMMITTED CURRENT WORK**
Diff audited. Run Overview behaviour: **RUNTIME CONFIRMED**

### Responsibility

Renders non-battle screens / flow UI.

Current rendered screens include:

```text
Title
Main Menu
Run Overview
Map Selection
Battle Intro
Reward Selection
Run Completion
Run Defeat
Post-Run Shop
```

### Current Run Overview addition

The uncommitted work adds a Run Overview that presents:

- Region 1 Village;
- Region 2 Town;
- Region 3 Castle;
- Meta Crystal;
- Tutorial status;
- Start Journey;
- Shop;
- navigation back toward Main Menu.

### Architecture boundary

This module should render flow state passed from controller.

It does not own canonical gameplay rules.

### Current limitation

Some UI copy in the broader flow/HUD remains stale relative to current routing.

---

# 23. Battle HUD Layer

## `src/ui/battle/battleHud.js`

### Evidence

**AUDITED CURRENT SOURCE — 11 AUG 2026**

### Responsibility

Renders the current battle HUD and battle-result overlay.

Current UI concepts include:

```text
roster
selected unit details
HP/stats
Origin
Current tile
Turn State
target preview
command band
input hints
result overlay
```

Current action band:

```text
Attack
Skill
Wait
```

### Current old-model coupling

HUD displays:

```text
ready
exhausted
Origin
Turn State
```

and has no proper current implementation for:

```text
Team AP
global End Turn
Movement Lock
Intent
Current Target
Wave Telegraph
```

### Known stale copy

Some text still reflects older implementation assumptions, including obsolete Enemy Phase wording and old Tutorial Victory navigation wording.

### Architecture boundary

HUD should render state.

It must not become the authority for current game rules.

---

# 24. Battlefield Renderer

## `src/ui/mapRenderer.js`

### Evidence

**CARRIED FROM v2.5 — NO RELEVANT GIT DELTA FOUND**

### Responsibility

Renders tactical map/grid, units, movement/target highlights, and battlefield visual state.

Current rendering inputs are derived from:

- map data;
- player units;
- enemy units;
- movement tiles;
- attack-targeting state;
- selected units.

### Boundary

Renderer should visualize authoritative battle state/rule results.

It should not independently define movement/attack legality.

### Limitation

Current visual assumptions remain prototype-specific and tied to direct grid presentation.

---

# 25. Global Stylesheet

## `src/style.css`

### Evidence

**UNCOMMITTED CURRENT WORK** for Run Overview additions
Base stylesheet: **CARRIED FROM v2.5**

### Responsibility

Owns prototype presentation styling.

Current local additions include Run Overview presentation.

### Architecture state

Still monolithic.

No component/module-specific CSS architecture exists.

This is a presentation limitation, not currently a design blocker.

---

# 26. Player Unit Definition Data

## `public/data/units/player_units.json`

### Evidence

**AUDITED CURRENT DATA — 11 AUG 2026**

Current players:

```text
Guard
Archer
```

Current baseline data includes:

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

### Architecture role

Definition data should remain distinct from mutable battle state.

---

# 27. Enemy Unit Definition Data

## `public/data/units/enemy_units.json`

### Evidence

**AUDITED CURRENT DATA — 11 AUG 2026**

Current audited baseline enemy definition:

```text
Sword Enemy
```

Current stats:

| Unit | HP | ATK | DEF | Move | ATR |
|---|---:|---:|---:|---:|---:|
| Sword | 16 | 6 | 2 | 3 | 1.5 |

Current enemy JSON does not yet encode the full canonical v3.1 enemy grammar such as:

```text
Target Rule
Movement Rule
Action Set/Rule
Fallback
Intent state
Status
Charge
Pattern
Spawn Order
```

Do not infer those systems from existing generic fields alone.

---

# 28. Map Definition Data

## `public/data/maps/r1_stage1_fixed.json`

### Evidence

**AUDITED CURRENT DATA — 11 AUG 2026**

Current map:

```text
7 × 5
```

Contains:

- player spawn labels;
- enemy spawn labels;
- obstacle/Cover tiles;
- normal traversable tiles.

Current relevant obstacle codes:

```text
O30
O70
OF
```

### Limitation

This baseline map is reused broadly by current battle setup.

It is not the corrected Tutorial Offset Courtyard design.

---

# 29. Encounter Definition Data

## `public/data/encounters/r1_stage1_baseline_eval_encounter.json`

### Evidence

**AUDITED CURRENT DATA — 11 AUG 2026**

Current encounter references:

```text
r1_stage1_fixed map
Guard
Archer
2 × Sword
```

Current objective:

```text
eliminate_all
```

Current reward:

```text
20 Crystal
```

### Current spawn-array role

`enemySpawns[]` ordering currently feeds Enemy Unit construction order.

This is a practical seed for future explicit Spawn Order.

It is not yet a formal Spawn Order system.

---

# 30. Definition Data vs Runtime State

Current architecture still follows an important principle:

```text
Definition Data
→ Runtime Construction
→ Runtime State
→ Rule Logic
→ UI Rendering
```

Examples:

```text
player_units.json
→ battleSetup derived stats
→ player battle unit
→ movement/damage rules
→ HUD/map rendering
```

and:

```text
encounter JSON
→ battleSetup enemy array
→ enemy movement/attack
→ battle renderer
```

This separation should be preserved during migration.

Do not mutate JSON definition objects as if they are the authoritative live battle units.

---

# 31. Current Primary Application Data Flow

Startup:

```text
index.html
→ main.js
→ loadInitialPrototypeData()
→ profileStorage load
→ appData + profileState
→ Title / Main Menu
```

Tutorial gate:

```text
Main Menu
→ tutorialCompleted?
   ├─ false → Tutorial placeholder battle
   └─ true  → Run Overview
```

Run Overview:

```text
Run Overview
├─ Start Journey
│  → createInitialRunState()
│  → Map Selection
├─ Shop
│  → Post-Run Shop
└─ Main Menu
```

Run battle:

```text
Map Selection
→ select node
→ Battle Intro
→ createInitialBattleState()
→ Battle
```

Player old turn:

```text
movementLogic
→ action menu
→ atr/path targeting
→ damageLogic or Wait
→ unit Exhausted
→ all living Players Exhausted?
→ Enemy Phase
```

Enemy old turn:

```text
enemyMovementLogic
→ all enemy movement resolved

enemyAttackLogic
→ all enemy attacks resolved

objective evaluation
→ next Player Phase or battle result
```

Run result:

```text
battle victory
→ reward selection
→ node completion
→ Map Selection / Run Completion

battle defeat
→ Run Defeat
```

Settlement/meta:

```text
Run Completion / Defeat
→ Crystal conversion
→ Run Overview
or
→ Shop
→ Run Overview
```

---

# 32. Current Input Architecture

## CARRIED + AUDITED THROUGH `main.js`

Keyboard input is centrally routed by `main.js`.

Current contexts include:

```text
movement
action menu
attack targeting
flow-screen interaction
```

Conceptually:

```text
window keydown
→ current scene / battle control state
→ context handler
→ state change
→ renderApp()
```

### Limitation

Input routing remains coupled to central controller and old battle action-state vocabulary.

Future Unity controls are not represented by this web input architecture.

Tutorial Flow Simulation for Unity controls will be an authored prototype-flow feature, not evidence that browser keyboard architecture equals final Unity control architecture.

---

# 33. Current Rendering Architecture

Current rendering remains state-driven but centralized.

Conceptually:

```text
state changes
→ main.js renderApp()
→ currentScene branch
→ flow screen or battle rendering
```

Battle:

```text
battle state
→ mapRenderer
→ battleHud
```

Flow:

```text
profile/run/result state
→ basicFlowScreens
```

### Principle to preserve

UI should reflect rule/state results.

UI should not silently define gameplay rules.

---

# 34. Current Persistence Architecture

## Persistent

```text
profileState
→ profileStorage.js
→ localStorage
```

Includes carried:

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

## Non-persistent

Current active flow remains memory-based:

```text
currentScene
runState
battleState
battleIntroNodeId
enemyPhaseTimerId
```

Therefore active Run persistence / Continue Run is absent.

### Run Overview note

Opening Run Overview currently clears active:

```text
runState
battleState
battleIntroNodeId
```

in current local flow.

---

# 35. Current Shared Battle-Rule Architecture

Some battle rules are already shared between Player and Enemy.

Examples:

```text
ATR target validation
attack-path/Cover evaluation
damage resolution
```

This is beneficial for consistency.

However current shared logic also carries old action-state assumptions.

Example:

```text
damage resolver
→ attacker Exhausted
```

Therefore migration must distinguish:

```text
shared combat effect
from
side-specific activation/action availability
```

rather than assuming all shared current side effects remain valid.

---

# 36. Current Enemy Execution Architecture

Current architecture is:

```text
main.js
→ resolveEnemyMovementPhase()
→ resolveEnemyAttackPhase()
```

Inside movement pass:

```text
Enemy A movement
→ updated state
→ Enemy B movement
```

Inside attack pass:

```text
Enemy A attack
→ updated state
→ Enemy B attack
```

Therefore current system has partial sequential state awareness.

But it does not implement canonical:

```text
Enemy A:
Movement + Action

→ Enemy B:
Movement + Action
```

### Migration pressure

Current v3.1 design requires orchestration to support:

```text
Spawn Order
Target Rule
Movement Rule
Action Rule
Fallback
Current Intent
Dynamic Intent
```

The existing deterministic helpers may be reusable, but the orchestration grammar is not current.

---

# 37. Current Targeting Architecture

Current targeting can be viewed as:

```text
ATR range test
→ path/Cover evaluation
→ valid target list
→ damage resolution
```

Useful current strengths:

- one shared target-validation path;
- Cover geometry;
- Full Cover can preserve targetability while effect becomes 0.

Current gaps:

- distinct LOS validity;
- explicit Target Validity / Action Validity / Action Effectiveness separation in code/state;
- current enemy Target Rule state;
- readable Intent;
- future special-enemy targeting grammar.

---

# 38. Current Tutorial Architecture

Current implementation does not yet have a dedicated authored tutorial-state architecture.

Current tutorial is effectively:

```text
special route/gate
→ normal old battle
→ tutorial result handling
```

No current dedicated authoritative systems were found for:

```text
Tutorial Phase
Tutorial Task
Learning Evidence
FLOW SIMULATION completion
Practice Target
Wave tutorial state
```

### Migration pressure

Corrected Tutorial design will eventually require a flow layer conceptually separate from authoritative combat state.

Current design target distinguishes:

```text
Tutorial Flow State
from
Combat State
```

This is a functional requirement, not yet a fixed JavaScript module design.

---

# 39. Current Run Overview Architecture

## UNCOMMITTED CURRENT WORK — RUNTIME CONFIRMED

Run Overview is implemented through coordination between:

```text
main.js
basicFlowScreens.js
style.css
profileState
```

`main.js` owns routing/state transitions.

`basicFlowScreens.js` owns presentation.

`style.css` owns visual layout.

Current architecture correctly keeps this flow outside battle-rule modules.

### Current limitation

Because the changes are uncommitted, repository portability is incomplete until they are deliberately saved/tested/committed/pushed.

---

# 40. Current Deployment Architecture

Current hosting path:

```text
GitHub repository
→ GitHub Actions
→ npm ci
→ Vite build
→ dist/
→ GitHub Pages
```

Data path compatibility:

```text
vite base
+
import.meta.env.BASE_URL
+
relative data path
```

This deployment/data-loader relation should be preserved when future data files are added.

---

# 41. Legacy / Likely Unused Files

## `src/counter.js`

### Evidence

**CARRIED FROM v2.5**

Likely Vite starter residue.

No active prototype responsibility is documented.

Do not delete solely from this handoff; verify imports before cleanup.

---

## `src/assets/hero.png`
## `src/assets/javascript.svg`
## `src/assets/vite.svg`

### Evidence

**CARRIED FROM v2.5**

Some assets may be starter/template residue or limited presentation assets.

Verify actual imports before removal.

---

# 42. Current Dependency Graph

Simplified current graph:

```text
index.html
   │
   ▼
src/main.js
   │
   ├──────────────► logic/shared/dataLoader.js
   │
   ├──────────────► logic/profile/profileStorage.js
   │
   ├──────────────► logic/run/runState.js
   │
   ├──────────────► logic/battle/battleSetup.js
   │
   ├──────────────► logic/battle/movementLogic.js
   │
   ├──────────────► logic/battle/atrLogic.js
   │                 │
   │                 └──────────► logic/battle/pathLogic.js
   │
   ├──────────────► logic/battle/damageLogic.js
   │
   ├──────────────► logic/battle/enemyMovementLogic.js
   │                 │
   │                 └──────────► movement/path-related helpers
   │
   ├──────────────► logic/battle/enemyAttackLogic.js
   │                 │
   │                 ├──────────► atrLogic.js
   │                 └──────────► damageLogic.js
   │
   ├──────────────► logic/battle/objectiveLogic.js
   │
   ├──────────────► ui/battle/battleHud.js
   │
   ├──────────────► ui/mapRenderer.js
   │
   └──────────────► ui/flow/basicFlowScreens.js
```

Presentation:

```text
main.js
→ render current scene
→ DOM
→ style.css
```

Data:

```text
public/data/*.json
→ dataLoader
→ appData
→ battleSetup/run flow
```

Persistence:

```text
profileStorage
↔ localStorage
```

Deployment:

```text
vite.config.js
+
deploy.yml
→ production build / Pages
```

---

# 43. File Responsibility Summary

| Path | Current Responsibility | Evidence |
|---|---|---|
| `index.html` | Browser entry / app mount | Carried |
| `src/main.js` | Central controller / routing / input / battle & run orchestration | Audited |
| `src/logic/shared/dataLoader.js` | BASE_URL-aware JSON loading | Audited |
| `src/logic/profile/profileStorage.js` | Persistent profile/meta upgrades | Carried |
| `src/logic/run/runState.js` | In-memory run graph/progression/rewards | Carried |
| `src/logic/battle/battleSetup.js` | Runtime battle construction | Audited |
| `movementLogic.js` | BFS movement / selected-unit reposition | Audited |
| `atrLogic.js` | Basic attack range/target validation | Audited |
| `pathLogic.js` | Obstacle/Cover attack-path geometry | Audited |
| `damageLogic.js` | Damage + current old action completion | Audited |
| `enemyMovementLogic.js` | Current enemy movement pass | Audited |
| `enemyAttackLogic.js` | Current enemy attack pass | Audited |
| `objectiveLogic.js` | `eliminate_all` evaluation | Carried |
| `ui/flow/basicFlowScreens.js` | Non-battle flow screens / Run Overview | Diff audited |
| `ui/battle/battleHud.js` | Battle HUD / command band / result overlay | Audited |
| `ui/mapRenderer.js` | Tactical battlefield rendering | Carried |
| `src/style.css` | Global UI styles / Run Overview additions | Diff audited |
| `public/data/units/*` | Unit definitions | Audited |
| `public/data/maps/*` | Map definitions | Audited |
| `public/data/encounters/*` | Encounter definitions | Audited |
| `vite.config.js` | Vite deployment base | Audited |
| `.github/workflows/deploy.yml` | GitHub Pages CI deployment | Audited |

---

# 44. Architecture Strengths Worth Preserving

Current prototype has several useful architecture properties.

## 44.1 Definition Data vs Runtime State separation

JSON definitions are distinct from mutable battle units.

Preserve this.

## 44.2 Rule reuse between sides

ATR/path/damage helpers are shared.

Preserve consistency while removing old side-effect coupling where necessary.

## 44.3 Deterministic grid movement

BFS and deterministic enemy movement provide useful validation reproducibility.

## 44.4 Modular battle logic exists

Although `main.js` is overloaded, major battle concerns already have separate files.

Migration should evaluate reuse before replacing them.

## 44.5 Profile persistence is isolated

Permanent profile state has a dedicated layer.

## 44.6 Run graph logic is isolated

Route/progression logic is not embedded entirely in UI.

## 44.7 Deployment is explicit

GitHub Pages build/deploy infrastructure is now part of the repository rather than an undocumented manual step.

---

# 45. Current Architecture Limitations

## 45.1 `main.js` remains overloaded

It owns too many application concerns:

```text
routing
input
battle orchestration
enemy scheduling
run settlement
Shop routing
Run Overview routing
DOM event attachment
```

This is a maintenance pressure, not an automatic refactor mandate.

---

## 45.2 Battle content remains Stage 1 hard-coded

Current battle setup and loader revolve around:

```text
stage1Map
stage1Encounter
```

Different run nodes do not yet select distinct battle definitions.

---

## 45.3 Run node and battle content remain disconnected

Route choices primarily alter run state/reward/difficulty labels rather than unique tactical encounters.

---

## 45.4 Player action lifecycle is coupled to `Exhausted`

Movement, targeting, damage, selection, and phase transition all reference the old Ready/Exhausted model.

Shared AP migration therefore crosses multiple modules.

---

## 45.5 Attack resolution owns action-completion side effects

`damageLogic.js` currently changes attacker availability.

This coupling matters because the resolver is shared by Player and Enemy.

---

## 45.6 Enemy turn is split by global phase, not activation

Current architecture:

```text
all Move
→ all Attack
```

Current design:

```text
Enemy A Move + Action
→ Enemy B Move + Action
```

This is an orchestration-level migration.

---

## 45.7 Enemy target selection is duplicated across movement and attack

Movement and attack can select different targets.

There is no explicit Current Target / Intent state.

---

## 45.8 LOS is not a separate rule layer

Current `pathLogic` combines obstacle/Cover relationships without an authoritative distinct ranged LOS validity state.

---

## 45.9 No dedicated Tutorial flow/state architecture

Current Tutorial is a placeholder battle gate.

Corrected tutorial needs Flow Simulation + real-system evidence without letting instructional state redefine combat rules.

---

## 45.10 Active run is not persisted

Run/battle state is in-memory.

Refresh can lose active progression.

---

## 45.11 CSS remains monolithic

Presentation scaling may become harder as Tutorial/Intent/Wave UI grows.

Not yet a priority unless it blocks implementation/readability.

---

## 45.12 No automated test layer

Current validation relies on manual runtime testing.

This remains a technical-quality limitation.

---

# 46. Current Design v3.1 Migration-Pressure Map

This section identifies which current modules are likely to be involved when each **migration domain** is eventually planned.

It is not a final implementation plan.

| Migration Domain | Current Modules Likely Involved | Why |
|---|---|---|
| V1 Player Turn Economy | `battleSetup`, `main`, `movementLogic`, `battleHud` | Team AP, StartGrid, End Turn |
| V2 Action Commitment | `damageLogic`, `atrLogic`, `movementLogic`, `main`, `battleHud` | remove player Exhaustion semantics, movement lock, repeated action |
| V3 Tactical Space | `atrLogic`, `pathLogic`, data/map, renderer/HUD | distinct LOS vs Cover |
| V4 Enemy Readability & Execution | `main`, enemy movement/attack, ATR/path, HUD/renderer | sequential activation, Target Rule, Intent |
| V5 Core Tutorial Flow | `main`, flow/HUD, battle setup/data | Tutorial Phase/Task/evidence + Flow Simulation |
| V6 Status / Temporal Threat | battle state/data/rules/UI | Status, Stun, Charge |
| V7 Wave | encounter/spawn state, main/controller, renderer/UI, enemy system | Telegraph, reservation, Spawn, Intent |
| V8 Full Tutorial Integration | all validated tutorial-facing domains | continuous Stage / evidence / final flow |

Exact file changes must still be chosen from fresh source audit when implementation begins.

---

# 47. Architecture Constraints for Future Migration

Current design/recovery establishes several functional constraints the future architecture must support.

## Player Turn

```text
party-wide turn
Shared Team AP
StartGrid
movement refund
global End Turn
Attack/Skill movement lock
repeated actions
```

## Enemy Turn

```text
Spawn Order
sequential activation
max 1 Movement + 1 Action baseline
actual Target Rule
Current Intent
Dynamic Intent
Fallback
```

## Tactical Space

```text
ATR
LOS
Cover
Target Validity
Action Validity
Action Effectiveness
```

## Tutorial

```text
Tutorial Flow State
≠
Combat State

REAL SYSTEM VALIDATION
FLOW SIMULATION
DEFERRED
```

## Wave

```text
Telegraph
reserved position
preparation
Spawn
normal Intent
```

These are requirements to support.

They do not prescribe a class/object/module layout yet.

---

# 48. What Must NOT Be Inferred

Do not infer from this document that:

- Shared AP is implemented;
- `originTile` is already canonical StartGrid;
- current Enemy array order is already a formal Spawn Order field;
- current enemy target selection already equals the v3.1 Target Rule;
- Cover currently includes proper distinct LOS;
- Tutorial Flow Simulation exists;
- Blue/Orange/Purple are implemented;
- Wave exists;
- V0–V8 are one-patch implementation checkpoints;
- `main.js` must definitely be split in one specific way;
- Unity production architecture should copy this web architecture.

---

# 49. Architecture Status Summary

```text
ENTRY / APP
index.html                 CARRIED
main.js                    AUDITED / central controller / uncommitted Run Overview delta

DEPLOYMENT
vite.config.js             AUDITED
deploy.yml                 AUDITED
dataLoader BASE_URL        AUDITED / committed post-v2.5

PROFILE / RUN
profileStorage             CARRIED / no relevant Git delta
runState                   CARRIED / no relevant Git delta

BATTLE
battleSetup                AUDITED
movementLogic              AUDITED
atrLogic                   AUDITED
pathLogic                  AUDITED
damageLogic                AUDITED
enemyMovementLogic         AUDITED
enemyAttackLogic           AUDITED
objectiveLogic             CARRIED

UI
battleHud                  AUDITED
basicFlowScreens           UNCOMMITTED delta audited
mapRenderer                CARRIED
style.css                  UNCOMMITTED presentation delta audited

DATA
player units               AUDITED
enemy units                AUDITED
map                        AUDITED
encounter                  AUDITED

CURRENT LARGE GAPS
Shared AP                  NOT IMPLEMENTED
StartGrid semantics        NOT IMPLEMENTED
global End Turn            NOT IMPLEMENTED
distinct LOS               NOT IMPLEMENTED
Intent / Dynamic Intent    NOT IMPLEMENTED
sequential full activation NOT IMPLEMENTED
Status / Charge            NOT IMPLEMENTED
Wave                       NOT IMPLEMENTED
corrected Tutorial flow    NOT IMPLEMENTED
```

---

# 50. Durable Resume Reference

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

# 51. Architecture Principle to Preserve

> **Definition Data → Runtime State → Shared Rule Logic → UI Rendering**

And for future work:

> **Audit the actual module first, then choose the smallest coherent migration change.**

The prototype architecture is allowed to evolve substantially, but current source/data/runtime remain the implementation truth until a tested migration changes them.

---

**End of Prototype Architecture**
