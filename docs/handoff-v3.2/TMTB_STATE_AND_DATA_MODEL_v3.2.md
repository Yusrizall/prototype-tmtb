# TMTB State and Data Model, Handoff v3.2

**Project:** TMTB / BeCan Prototype  
**Handoff Package Version:** 3.2  
**Game Design Reference:** v3.4  
**Audit Date:** 6 September 2026  
**Status:** **CURRENT SOURCE-BASED RUNTIME AND PERSISTENCE SNAPSHOT**

---

## 1. Core Flow

```text
JSON definitions
→ runtime construction
→ profile/run/battle state
→ focused logic mutations
→ UI rendering
```

Desired future fields must not be documented as current runtime state.

## 2. Definition Data

Player baselines:

```text
Guard:  HP25, ATK5, Move3, ATR1.5
Archer: HP18, ATK7, Move4, ATR3
```

Enemy examples:

```text
Sword: HP16, ATK6, Move3, ATR1.5
Spear: HP15, ATK6, Move4, ATR3
Blue candidate: HP33, ATK0, Move0
```

DEF is absent from active Player, Enemy, and Structure definitions. Tutorial encounter data continues to carry Phase 6/7/8 authored PVS configuration.

## 3. Profile State, Version 2

Storage key:

```text
tmtb_profile_v1
```

Normalized payload:

```text
profile {
  version: 2
  tutorialCompleted
  metaCrystal
  permanentUpgrades {
    guard  { maxHP, atk }
    archer { maxHP, atk }
  }
  unlockedSkills {
    guard:  [intercept?]
    archer: [volley?]
  }
}
```

Core Skills are definition-owned and do not need an ownership array entry. Profile migration preserves valid older data, caps stat levels at 4, drops legacy `def`, validates only the supported Skill ID per character, and never refunds removed DEF levels.

Shop mutation returns a new normalized profile only after requirement, expected-level, cost, ownership, and storage checks succeed.

## 4. Run State

Important current fields include:

```text
version
status
currentNodeId
nodes[]
route/path state
runCrystal
availableRewards[]
activeRunBuffs[]
lastBattleResult
battleResultHistory[]
crystalConversionCompleted
metaCrystalBeforeConversion
metaCrystalAfterConversion
```

`battleResultHistory[]` stores matching stage result snapshots for settlement aggregation. `lastBattleResult` preserves the final party/location snapshot. Conversion flags prevent double settlement awards.

## 5. Battle Result Snapshot

Snapshot fields include battle identity, run node identity, result, enemies defeated, total turns, Crystal reward, and per-unit start/final HP status. The snapshot is isolated from future battle-state mutation.

## 6. Buff Data and Run Ownership

Buff definitions carry stable IDs, rarity, effect description, eligibility, and runtime effect data. Offer generation rolls each of two slots independently and prevents duplicate cards in one offer.

On confirm:

```text
selected Buff
→ append to activeRunBuffs
→ remove from available pool
→ apply on next battle construction
```

Active Buffs are run-only. The former DEF Buff `layered_plates` retains its ID but currently grants +2 Max HP as a compatibility migration.

Current prototype pool:

```text
Common: Iron Resolve, Keen String, Marching Drill, Layered Plates
Rare:   Rallying Rhythm, Eagle Eye, Unyielding Line
Epic:   Vanguard Oath, Limit Break
```

Current rarity weights:

| Node type | Common | Rare | Epic |
|---|---:|---:|---:|
| stage | 70 | 20 | 10 |
| mini_boss | 20 | 50 | 30 |
| boss | 10 | 45 | 45 |
| special | 35 | 45 | 20 |

These values are implementation baselines, not production-final balance.

## 7. Core Battle State

Important fields include:

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
flowContext
tutorialState
objectiveState
waveState
feedbackMessage
```

Result/Skill UI adds transient selection and presentation state in orchestration rather than profile persistence.

## 8. Battle Unit State

Common fields:

```text
battleUnitId
unitDefId
name
side
role
tileX / tileY
originTile
currentHP / maxHP
statuses[]
derivedStats
movementLocked
startGrid
movementApCommitted
spawnOrder
currentTargetId
currentIntent
```

Current Skill-related Player fields:

```text
temporaryShield
interceptBy
skillCooldowns { skillId: remainingTurns }
```

Current immobilization is stored on affected Enemy runtime state and checked by movement resolution. Multiple Wave-spawned enemies must be identified by `battleUnitId` or `spawnOrder`, not definition ID alone.

## 9. Skill Definition and Resolution

`SKILLS` currently defines:

```text
id
unit
name
icon
core or price
ap
cooldown
range where relevant
description
```

Resolution order:

```text
ownership/capability/AP/cooldown check
→ legal target list
→ target confirmation
→ spend Team AP
→ lock caster movement
→ set cooldown
→ apply Skill-specific effect
```

Invalid or canceled casts do not mutate AP/state.

Enemy Turn completion clears temporary Shield and Intercept, advances cooldowns, and ends the current Pinning Shot immobilization window.

## 10. Damage State

Current unit damage uses ATK and Cover. Shield absorbs damage before HP. Intercept may substitute Guard as the damage receiver while preserving the original attack's Cover calculation.

`targetDefense: 0` remains in returned damage metadata only for compatibility. It is not an active DEF system.

Volley calculates each affected enemy independently and applies Cover before flooring damage. Allies and Structures are excluded.

## 11. Tutorial, Status, Wave, Structure, and Checkpoint State

Carried v3.1 state remains valid:

1. `tutorialState` stores Phase, Task, prompt, evidence, region activation, and Phase 8 configuration;
2. Stun uses `statuses[]` with `remainingPlayerTurns`;
3. `waveState.waves[]` stores scheduled, telegraphed, spawned, and resolved entries;
4. objective state separates Objective from Victory/Defeat;
5. Structures are entities with footprint, HP, targetability, and blocking state;
6. CP6/CP7/CP8 are deep tactical snapshots;
7. Phase Jump recipes are deterministic validation recipes, not checkpoint saves.

## 12. Screen Transitions Affecting State

```text
Tutorial complete → mark profile Tutorial completion → Region Overview
Normal victory → persist result/reward → Battle Result → Buff Selection
Buff confirm/skip → Map Selection or terminal Settlement
Normal defeat → result history → Settlement Failed
Stage 4 complete → Settlement Complete
Settlement → idempotent conversion → Main Menu
Region Overview → Shop → purchase/profile save → Region Overview
```

## 13. Design-Target State Not Implemented

1. Archer `hasEnteredStage3` unlock/fielding gate;
2. Support/Trickster unlocks, stats, upgrades, and Skills;
3. global Shop products;
4. Buff-pool permanent unlocks;
5. Skill-enhancement Buff state;
6. respec/refund;
7. main-game run persistence/recovery and defeated-unit policy;
8. production-final Status, Wave, Structure, LOS, and Skill schemas.

These are migration targets or open design, not current fields.
