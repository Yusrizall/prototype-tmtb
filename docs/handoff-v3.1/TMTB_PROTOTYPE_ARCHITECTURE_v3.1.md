# TMTB Prototype Architecture — Handoff v3.1

**Project:** TMTB / BeCan Prototype  
**Document Type:** Handoff Snapshot — Prototype Architecture  
**Handoff Package Version:** 3.1  
**Game Design Reference:** v3.3  
**Implementation Baseline:** Git `cc7690e`  
**Architecture Audit Date:** 19 August 2026  
**Status:** **CURRENT ARCHITECTURE SNAPSHOT — ACTUAL REPOSITORY BASED**

---

## 1. Architecture Character

Current prototype remains Vite + Vanilla JavaScript + JSON with `src/main.js` as the central application/battle orchestration layer.

The codebase has increasingly extracted combat and Tutorial domains into focused modules. It is **not** a Unity architecture blueprint and should not be broadly refactored without a concrete validation need.

---

## 2. Audited Source Layout

```text
src/
├─ main.js
├─ style.css
├─ logic/
│  ├─ battle/
│  │  ├─ battleSetup.js
│  │  ├─ movementLogic.js
│  │  ├─ pathLogic.js
│  │  ├─ tacticalPositionLogic.js
│  │  ├─ atrLogic.js
│  │  ├─ damageLogic.js
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
│  ├─ run/runState.js
│  ├─ profile/profileStorage.js
│  └─ shared/dataLoader.js
└─ ui/
   ├─ battle/battleCameraLogic.js
   ├─ battle/battleHud.js
   ├─ flow/basicFlowScreens.js
   └─ mapRenderer.js
```

Tests are organized by migration domain:

```text
tests/tutorialDamage/
tests/phase6/
tests/phase7/
tests/phase8/
tests/phaseJump/
```

---

## 3. Central Runtime — `src/main.js`

`main.js` currently owns integration/orchestration across:

- app data/profile/run initialization;
- screen/flow transitions;
- battle start/end;
- Player input and action execution;
- Player Turn → Enemy Turn transition;
- sequential enemy-resolution loop;
- Tutorial hooks/brief timing;
- checkpoint storage/retry routing;
- Wave spawn hook after existing enemy resolution;
- final result handling and rendering.

Important current Phase 8 seams:

```text
Phase 7 task phase_7_complete_transition
→ initializeTutorialPhase8RuntimeIfNeeded()
→ initializeTutorialPhase8Content()
→ capture CP8
```

Enemy Turn:

```text
snapshot living enemyOrder by spawnOrder
→ sequential existing enemy resolution
→ required-actor failure check
→ spawnTelegraphedWaves()
→ refresh enemy readability
→ next Player Turn
```

Because Wave spawning occurs **after** the existing enemy loop, newly spawned enemies receive no attached action in the current Safe lifecycle.

Architecture watch: `main.js` remains integration-heavy. Do not convert this into a broad refactor task unless the next feature creates a real maintenance/validation problem.

---

## 4. Battle Rule Modules

### `battleSetup.js`

Owns runtime battle-unit construction, encounter stat overrides, enemy spawn construction, Team AP capacity calculation, and initial battle state.

Wave logic reuses `createEnemyBattleUnitFromSpawn()` so Wave enemies follow normal enemy definition/override construction.

### `movementLogic.js`

Owns BFS-style prototype movement/reachability and final-position legality.

Important separation:

```text
canTraverseTile
≠
canEndMovementAtTile
```

Wave reservation is enforced only in final-position legality; therefore reserved tiles remain traversable.

The same reachability path is used by Player/Enemy movement, making reservation final-occupancy consistent across sides.

### Enemy modules

- `enemyTargetLogic.js` — Current Target selection/readability;
- `enemyIntentLogic.js` — Current Intent calculation;
- `enemyMovementLogic.js` — movement scoring/rule execution;
- `enemyAttackLogic.js` — attack/effect resolution.

Current Sword and Spear use these systemic paths. Tutorial must not create fake targeting/waypoints to satisfy a lesson.

### `statusLogic.js`

Small generic status layer currently supporting:

- status lookup;
- Stun capability checks;
- applying status with `remainingPlayerTurns`;
- Player-turn tick/removal.

It is generic enough for current Stun PVS, not a final universal Status architecture.

### `blueShockwaveLogic.js`

Focused Blue pattern implementation:

- readable Charge state/Intent;
- Shockwave threat tiles;
- Charge progress;
- real area-based Stun application;
- cycle reset after Shockwave.

It deliberately avoids a generic Pattern Engine.

### `structureLogic.js`

Owns Structure runtime entities/footprints, blocking, targetability and Structure damage support used by Phase 6.

### `waveLogic.js`

Minimal real Wave mechanic introduced for Phase 8.

Exports current lifecycle/status concepts:

```text
SCHEDULED
TELEGRAPHED
SPAWNED
RESOLVED
```

Responsibilities:

- initialize authored Wave entries;
- Telegraph a Wave;
- query active reservations;
- block reserved final occupancy;
- reassign a still-SCHEDULED Wave to an authored fallback spawn;
- spawn all currently TELEGRAPHED Waves;
- assign real next Spawn Order;
- track spawned enemy ID/order;
- refresh RESOLVED state from spawned-enemy death;
- query pending/all-resolved required Waves.

`waveLogic.js` does **not** own Tutorial phase timing or decide universal production Wave rules.

---

## 5. Tutorial Modules

### `tutorialFlow.js`

Legacy/core Tutorial state machine for Phases 1–5 plus shared Tutorial input/victory/readability integration.

This file remains large. Later phases are deliberately separated rather than extending one monolithic file further.

### `tutorialPhase6Logic.js`

Owns Phase 6 authored orchestration around Spear/Cover/Structure evidence, input gates, completion and required-actor failure boundary.

### `tutorialPhase7Logic.js`

Owns Phase 6→7 travel/staging, controlled Charge/Shockwave/Stun learning sequence, required-actor boundary, and Phase 7 completion transition.

Blue combat behaviour itself remains in battle-layer `blueShockwaveLogic.js`.

### `tutorialPhase8Logic.js`

Owns Tutorial-specific Wave graduation orchestration:

- initializes W1/W2/W3 configuration;
- W1 explanation beats;
- W2 free-play release / Objective;
- W3 authored fallback pair selection after W2 spawn;
- persistent high-level free-play prompt;
- single-casualty feedback;
- Phase 8 completion readiness.

It does **not** own pathfinding, enemy AI, Stun, damage, or Wave final-position legality.

### `tutorialCheckpointLogic.js`

Deep capture/restore of tactical Tutorial state.

### `tutorialPhaseJumpLogic.js`

PROTOTYPE ONLY deterministic phase-entry validation tool for phases 1–8, plus fingerprints used to compare relevant phase-entry state while excluding UI/timer/camera transients.

Jump states are validation recipes, not natural checkpoint snapshots.

---

## 6. UI Architecture

### `battleHud.js`

Renders current battle/Tutorial information including Team AP, Objective, Status/Intent/State, End Turn availability, and Phase Jump UI.

Phase 8 keeps normal combat readability during free play.

### `mapRenderer.js`

Renders tactical map, units, movement/attack feedback, Structures, Shockwave threat area, and Wave Telegraph reservation markers.

Wave marker source is runtime Wave state, not static `E#` map labels.

### `battleCameraLogic.js`

Prototype camera/focus support including Region C / Phase 8 focus.

---

## 7. Data Architecture

Key authored Tutorial data:

```text
public/data/encounters/tutorial_phase_1_5.json
public/data/maps/tutorial_offset_courtyard.json
public/data/units/player_units.json
public/data/units/enemy_units.json
```

The encounter file now contains Phase 6/7/8 content sections. Exact coordinates/stats there are PVS data unless separately canonicalized.

---

## 8. Current Architecture Risks / Watches

- `main.js` is still a central integration hotspot.
- `tutorialFlow.js` is large because it predates phase-specific extraction.
- Wave logic is intentionally minimal and Tutorial-driven in current usage; do not treat it as production-final Wave framework.
- authored W3 fallback pairs solve a Tutorial robustness problem, not universal spawn search.
- Status duration ticking is currently one generic Player-turn model.
- duplicate archetypes from Waves require `battleUnitId`/`spawnOrder` rather than `unitDefId` for unambiguous validation.
- run/profile systems are older and largely outside the Phase 6–8 test coverage.

---

## 9. Architectural Non-Goals

Do not start from this handoff by building:

- a generic production Pattern Engine;
- universal Wave scheduler;
- broad ECS/state-management rewrite;
- Unity architecture mimicry inside the web prototype;
- global Structure framework rewrite;
- generic objective overhaul;
- global DEF removal.

Audit the next task first and change only the domains that the validation target actually requires.
