# TMTB Run Settlement Implementation Checkpoint v1.0

**Date:** 6 September 2026  
**Status:** Implemented and regression-tested  
**Scope:** Closing implementation checkpoint for the End Screen and Buff Selection domain

## Terminal Flow

```text
Normal Stage Defeat
→ Run Settlement: RUN FAILED
→ Main Menu

Prototype Stage 4 Victory
→ Buff Selection
→ Run Settlement: RUN COMPLETE
→ Main Menu
```

Tutorial victory and Tutorial defeat remain outside this settlement flow.

## Shared Settlement Contract

`RUN FAILED` and `RUN COMPLETE` use one horizontal settlement container. The result state changes the heading, supporting copy, and accent treatment only.

The settlement contains:

- Run Summary: final location, encounter count, enemy-defeat total, total turns, and visited node-type counts;
- Final Party Status: current and maximum HP bars plus defeated status from the final battle snapshot;
- always-visible scrollable Active Buffs list;
- Run Crystal total only;
- Main Menu as the sole primary action.

The settlement does not show Meta Crystal balance, conversion before and after values, or a Shop button. Meta progression remains a separate Shop concern even though the existing prototype conversion remains internally idempotent.

## State Additions

`runState.battleResultHistory[]` records matching normal-stage victory and defeat snapshots. Settlement aggregates enemy defeats and turns from this history while preserving `lastBattleResult` for final party and location presentation.

## Verification

- Complete and failed runs share the same renderer.
- Run Crystal is presented without Meta Crystal wording.
- Final party and Active Buffs are always represented.
- Pointer and keyboard settlement completion routes to Main Menu.
- Full test suite and production build pass at the implementation checkpoint.
