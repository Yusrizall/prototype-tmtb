# TMTB State & Data Model — Handoff v3.1

**Project:** TMTB / BeCan Prototype  
**Document Type:** Handoff Snapshot — State & Data Model  
**Handoff Package Version:** 3.1  
**Game Design Reference:** v3.3  
**Implementation Baseline:** Git `cc7690e`  
**Audit Date:** 19 August 2026  
**Status:** **CURRENT RUNTIME/DATA SNAPSHOT — SOURCE BASED**

---

## 1. Core Principle

Current architecture broadly follows:

```text
JSON definition/authored data
→ runtime construction
→ battle/run/profile state
→ focused rule mutation
→ UI rendering
```

Do not document future desired fields as if they already exist.

---

## 2. Definition Data

### Player units

`public/data/units/player_units.json`

Current base definitions include:

```text
Guard  HP25 ATK5 DEF4 Move3 ATR1.5
Archer HP18 ATK7 DEF1 Move4 ATR3
```

These DEF values still exist in definition/runtime stats even though Tutorial damage currently ignores DEF.

### Enemy units

`public/data/units/enemy_units.json`

Current definitions include:

```text
Sword HP16 ATK6 DEF2 Move3 ATR1.5
Spear HP15 ATK6 DEF2 Move4 ATR3
Blue Charger Candidate HP33 ATK0 DEF0 Move0
```

Tutorial encounter data may override stats, e.g. Spear ATK5.

### Tutorial encounter

`public/data/encounters/tutorial_phase_1_5.json` contains later authored content sections:

```text
phase6Content
phase7Content
phase8Content
```

Phase 6:

- Spear spawn + ATK5 override;
- 3×3 Hut placement.

Phase 7:

- Blue spawn/battle ID;
- Guard/Archer staging;
- Archer safe position;
- Shockwave radius2;
- Stun2.

Phase 8:

- four required Wave entries representing W1 Sword, W2 Spear, W3 Sword A, W3 Sword B;
- W2 Spear ATK5 override;
- authored W3 fallback pair labels.

### Tutorial map

`public/data/maps/tutorial_offset_courtyard.json` is a 16×16 progressive Tutorial map. Wave spawn labels currently include E4–E13.

Important final positions:

```text
E4  (12,5) W1 Sword
E5  (15,2) W2 Spear
E8  (9,1)  preferred W3 north Sword
E7  (14,5) preferred W3 south Sword
```

Other E-labels support deterministic W3 fallback pairs.

---

## 3. Battle State — Current Important Fields

Core initial battle state includes fields such as:

```text
encounterId
encounterName
mapId
objectiveType
phase
turnCount
teamApCurrent
teamApCapacity
selectedUnitId
battleControlState
actionMenuIndex
selectedAction
playerUnits[]
enemyUnits[]
structures[]
targetIndex
targetType
targetId
resultState
```

Tutorial/runtime integration adds state such as:

```text
flowContext
tutorialState
objectiveState
waveState
feedbackMessage
```

Not every field is created in `createInitialBattleState()`; Tutorial/run setup layers extend the state.

---

## 4. Battle Unit State

Battle units are runtime instances with identity distinct from their definition ID.

Important fields include:

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
statuses[]
derivedStats
attackType / targetPattern / targetCategory
usesProjectile / requiresPathCheck
movementRule / actionRule
spawnLabel
```

Player units additionally use current action-economy state such as:

```text
startGrid
movementApCommitted
movementLocked
```

Enemy units use:

```text
spawnOrder
currentTargetId
currentIntent
```

Blue additionally uses focused `patternState` fields initialized by Tutorial Phase 7, including Charge progress/goal and Shockwave/Stun parameters.

Do not identify Wave-spawned enemies only by `unitDefId`; several Swords can exist simultaneously. Use `battleUnitId` and/or `spawnOrder`.

---

## 5. Tutorial State

Initial `tutorialState` begins with:

```text
phaseId
taskId
prompt
status
activeRegionIds
targetTile
intentPulseEnemyId
evidence { ... }
```

The evidence object is intentionally explicit and grows with the authored curriculum.

Later phases add phase-specific configuration/evidence rather than replacing the whole Tutorial state.

Important Phase 7 evidence includes the required-two-unit curriculum completion boundary.

Important Phase 8 state:

```text
phaseId = phase_8_wave_graduation
phase8Config {
  wave1Id
  wave2Id
  wave3Ids[]
}

evidence {
  phase8Initialized
  phase8Wave1Telegraphed / Spawned
  phase8Wave2Telegraphed / Spawned
  phase8Wave3Telegraphed / Spawned
  phase8Wave3SelectedSpawnPair
  phase8GuidanceReleased
  phase8SingleCasualtyExplained
  phase8Complete
  ...
}
```

Tutorial status becomes `complete` only after Phase 8 completion logic is satisfied.

---

## 6. Status State

Player statuses are currently an array on the unit:

```text
statuses: [
  {
    statusId: "stun",
    remainingPlayerTurns: N
  }
]
```

Current Stun capability queries deny:

```text
Move
Attack
Skill
Hold
```

but do not remove the unit from living-unit AP capacity.

At the relevant Player-turn boundary, generic status ticking decrements `remainingPlayerTurns` and removes expired entries.

---

## 7. Wave State

Phase 8 adds:

```text
waveState: {
  waves: [ ... ]
}
```

Each Wave runtime entry currently stores:

```text
waveId
required
unitId
battleUnitId
spawnLabel
spawnPosition {x,y}
telegraphLabel
statOverrides
status
spawnedEnemyId
spawnOrder
```

Current status enum:

```text
scheduled
telegraphed
spawned
resolved
```

Active reservation derives from `telegraphed` entries.

A scheduled Wave may have its spawn reassigned to an authored fallback **before** Telegraph. Once telegraphed, that runtime spawn is fixed.

Required-Wave queries are independent from `enemyUnits.length`.

---

## 8. Objective State

Tutorial objective state can be dormant or active and stores current presentation/target fields such as:

```text
status
objectiveType
targetType
targetId
label
```

Phase 8 activates:

```text
objectiveType = eliminate_all
label = ELIMINATE ALL REMAINING THREATS
```

Normal `eliminate_all` board-empty evaluation is not sufficient by itself for Tutorial Victory; Tutorial readiness must also be complete.

---

## 9. Structure State

Structures are separate entities from units.

Current Tutorial Hut uses one Structure record and a rectangular footprint. Structure logic derives footprint tiles for blocking/targeting.

Current observed implementation after destruction:

```text
Structure record remains
→ currentHP <= 0
→ not targetable
→ footprint remains blocking
```

Do not interpret the final blocking behaviour as a universal main-game destruction rule.

---

## 10. Checkpoint State

Tutorial checkpoints are deep tactical snapshots captured/restored by `tutorialCheckpointLogic.js`.

The checkpoint object contains a checkpoint ID plus battle-state snapshot; restore must not recursively retain prior checkpoint state.

CP8 captures live tactical Phase 8 entry, preserving HP/AP/position/Blue/Wave state rather than applying a heal/reset preset.

Phase Jump recipes are **not checkpoint state**.

---

## 11. Profile / Run Persistence

Profile storage remains local-storage based and includes Tutorial completion, Meta Crystal and permanent-upgrade state from the earlier full-loop prototype.

Run state remains a separate runtime domain for Region 1 routing/reward/settlement behaviour.

These systems are carried current source but were not the focus of the 132-test Tutorial regression suite.

---

## 12. Important Design-vs-State Boundaries

```text
Tutorial no-DEF runtime context
≠ global removal of DEF from definitions/main-game design

Wave Safe lifecycle state
≠ universal production Wave timing decision

W3 fallback pairs
≠ general main-game dynamic spawn algorithm

Blue patternState
≠ generic production Pattern Engine

CP8 tactical snapshot
≠ main-game save/checkpoint model
```
