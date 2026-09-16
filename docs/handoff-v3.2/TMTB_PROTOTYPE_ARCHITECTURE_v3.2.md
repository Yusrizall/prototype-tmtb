# TMTB Prototype Architecture, Handoff v3.2

**Project:** TMTB / BeCan Prototype  
**Handoff Package Version:** 3.2  
**Game Design Reference:** v3.4  
**Audit Date:** 6 September 2026  
**Status:** **ACTUAL SOURCE-BASED ARCHITECTURE SNAPSHOT**

---

## 1. Architecture Character

The prototype remains Vite, Vanilla JavaScript, CSS, and JSON. `src/main.js` is the central application and battle orchestrator. Focused modules own calculations and renderers, but the repository is not a Unity architecture blueprint.

Do not start a broad refactor without a concrete validation need.

## 2. Current Relevant Layout

```text
src/
├─ main.js
├─ style.css
├─ logic/
│  ├─ battle/
│  │  ├─ battleSetup.js
│  │  ├─ battleResultState.js
│  │  ├─ damageLogic.js
│  │  ├─ skillLogic.js
│  │  ├─ movementLogic.js
│  │  ├─ pathLogic.js
│  │  ├─ tacticalPositionLogic.js
│  │  ├─ atrLogic.js
│  │  ├─ playerAttackTargetLogic.js
│  │  ├─ enemyTargetLogic.js
│  │  ├─ enemyIntentLogic.js
│  │  ├─ enemyMovementLogic.js
│  │  ├─ enemyAttackLogic.js
│  │  ├─ objectiveLogic.js
│  │  ├─ structureLogic.js
│  │  ├─ statusLogic.js
│  │  ├─ blueShockwaveLogic.js
│  │  └─ waveLogic.js
│  ├─ tutorial/
│  │  ├─ tutorialFlow.js
│  │  ├─ tutorialCheckpointLogic.js
│  │  ├─ tutorialPhase6Logic.js
│  │  ├─ tutorialPhase7Logic.js
│  │  ├─ tutorialPhase8Logic.js
│  │  └─ tutorialPhaseJumpLogic.js
│  ├─ run/
│  │  ├─ runState.js
│  │  └─ buffSystem.js
│  ├─ profile/profileStorage.js
│  └─ shared/dataLoader.js
└─ ui/
   ├─ battle/
   │  ├─ battleCameraLogic.js
   │  ├─ battleHud.js
   │  └─ skillPanel.js
   ├─ flow/
   │  ├─ basicFlowScreens.js
   │  ├─ runSettlementScreen.js
   │  └─ shopScreen.js
   └─ mapRenderer.js

tests/
├─ tutorialDamage/
├─ phase6/
├─ phase7/
├─ phase8/
├─ phaseJump/
├─ battleResult/
├─ buffSelection/
├─ runSettlement/
└─ shopSkills/
```

## 3. `src/main.js`

Owns integration across:

1. data/profile/run initialization;
2. screen routing;
3. Region Overview, Shop, Map Selection, Battle, Battle Result, Buff Selection, and Settlement transitions;
4. Player input and action execution;
5. Skill selection/cancellation/casting orchestration;
6. Player Turn to sequential Enemy Turn;
7. Tutorial hooks, briefs, checkpoints, retry, Wave spawning, and victory;
8. result capture, reward, Buff, and terminal-run routing.

It does not own the core calculations extracted to battle/run/profile modules. It remains the largest integration hotspot.

## 4. Battle Modules

### `battleSetup.js`

Constructs runtime units and battle state, applies permanent Max HP/ATK upgrades and active Run Buffs, and computes Shared Team AP.

### `battleResultState.js`

Creates stable result snapshots and validates their relation to run node/result state. Snapshots feed Battle Result and Settlement history.

### `damageLogic.js`

Resolves Cover-reduced damage, Shield consumption, and Intercept redirection. DEF is globally inactive. A zero `targetDefense` output key remains only for compatibility.

### `skillLogic.js`

Owns current Skill definitions, ownership checks, block reasons, target selection, Volley affected-target calculation, Skill resolution, temporary Shield/Intercept/Immobilize state, and Enemy Turn expiry/cooldown ticking.

It is a compact prototype Skill layer, not a production-generic ability engine.

### Movement, AI, Status, Structure, and Wave modules

Carried responsibilities remain:

1. BFS-style prototype reachability and StartGrid commitment;
2. Player/Enemy final-position legality;
3. Current Target, Current Intent, role-consistent movement, and sequential attack resolution;
4. generic current Stun status support;
5. Tutorial Hut entity/footprint/damage;
6. Blue Charge/Shockwave/Stun pattern;
7. scheduled, telegraphed, spawned, and resolved Wave lifecycle.

Wave logic does not define a universal production lifecycle. Authored W3 fallback pairs remain Tutorial PVS.

## 5. Run and Profile Modules

### `runState.js`

Owns Region 1 run topology, node progression, reward preparation, Buff selection result, battle-result history, defeat/completion state, and terminal conversion bookkeeping.

### `buffSystem.js`

Owns Buff definitions, rarity roll, two-slot offer generation, no-duplicate offers, removal from pool, and application of active Buffs to the next battle.

### `profileStorage.js`

Owns localStorage normalization, profile v2 migration, Meta Crystal, Max HP/ATK purchase validation, Skill ownership purchase, Tutorial completion, and reset.

Persistence-before-memory replacement protects Shop transactions from storage failure.

## 6. UI Modules

### `battleHud.js`

Renders core HUD, Tutorial information, Battle Result, Tutorial end states, Active Buff List, status badges, and Battle action entry.

### `skillPanel.js`

Renders available/blocked Skills and target choices. It does not mutate battle state.

### `basicFlowScreens.js`

Retains shared flow rendering, Region Overview, Map Selection, and Buff Selection. Some older run/shop renderer code remains but the current routes use focused modules where stated.

### `runSettlementScreen.js`

Renders shared Run Failed/Run Complete settlement composition from run state and battle-result history.

### `shopScreen.js`

Renders character rail, Upgrades/Skills tabs, catalog/detail panels, locked pages, balance, prices, and feedback states. Transaction mutation remains in profile logic/main orchestration.

### `mapRenderer.js`

Renders map, units, targeting, Structures, Shockwave threat, Wave Telegraph, and current status feedback.

## 7. Data Files

Current authored definitions remain under `public/data/`. Active player, enemy, and Structure data no longer contain DEF. Tutorial encounter/map data retain Phase 6/7/8 PVS content and exact authored Wave positions.

## 8. Test Architecture

`npm test` runs all 185 tests through domain scripts. Shop/Skill tests cover migration, purchase atomicity, caps, ownership, Shield, Intercept, Immobilize, Volley, Cover, cooldown, AP, targeting, Tutorial Phase eligibility, and storage failure.

`npm run build` validates production compilation.

## 9. Architecture Risks and Watches

1. `main.js` remains integration-heavy.
2. `tutorialFlow.js` remains a large legacy core.
3. current Skill logic is deliberately specific rather than data-driven production architecture.
4. current status timing may not fit every future Status.
5. UI uses placeholder icons/art.
6. legacy text highlighting still recognizes the string `DEF`, although active game data/rules do not expose the stat.
7. no Playwright/browser automation is currently available in the audited environment.

## 10. Non-Goals

Do not infer a need for:

1. ECS or global state rewrite;
2. generic Skill/Effect engine;
3. universal Wave scheduler;
4. Unity architecture mimicry;
5. broad renderer rewrite;
6. automatic finalization of deferred LOS, Hold, Status, Structure, or roster rules.

Audit the next validation target and change the smallest coherent domain.
