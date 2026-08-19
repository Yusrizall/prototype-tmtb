# TMTB Prototype Current State — Handoff v3.1

**Project:** TMTB / BeCan Prototype  
**Document Type:** Handoff Snapshot — Current Prototype Implementation State  
**Handoff Package Version:** 3.1  
**Game Design Reference:** `TMTB_GAME_DESIGN_CONTEXT.md` v3.3 / `TMTB_GAME_DESIGN_DECISIONS_v3.3.md`  
**Prototype Implementation Baseline:** **Tutorial Phase 8 Wave Graduation + Final W3 Regression Alignment**  
**Authoritative Git Baseline:** `cc7690e0f19f4c50f2f77ff42b1e825c4e7be2d9`  
**Verified Date:** 19 August 2026  
**Project Root:** `C:\Datas\prototype-tmtb`  
**Status:** **CURRENT IMPLEMENTATION SNAPSHOT — SOURCE/RUNTIME/TEST EVIDENCE SEPARATED**

---

## 1. Authority

Implementation truth priority:

```text
1. Actual source/data
2. Confirmed runtime testing
3. This Current State
4. Architecture / State & Data handoff
5. Historical implementation docs
```

This file does not promote prototype-only/PVS behaviour into main-game canon.

---

## 2. Git / Verification Checkpoint

User-confirmed final Git state:

```text
cc7690e Align Phase 8 regression tests with final W3 spawn
9b89340 Complete Tutorial Phase 8 wave graduation
4eae25c Add Tutorial Phase 7 regression coverage
```

At the final Git check, `git status --short` was empty and `HEAD`, `main`, `origin/main`, and `origin/HEAD` pointed to `cc7690e` in the user's output/log decoration.

Gameplay source is unchanged between `9b89340` and `cc7690e`; `cc7690e` aligns two Phase 8 test expectations with the final W3 preferred position.

Automated Tutorial regression after applying that exact delta:

```text
no-DEF       4/4
Phase 6     37/37
Phase Jump  27/27
Phase 7     34/34
Phase 8     30/30
TOTAL      132/132 PASS
```

The documentation-audit container could not independently run Vite build because the supplied ZIP excludes `node_modules`.

---

## 3. Current Combat Model — IMPLEMENTED

Current prototype now implements the migrated combat foundation rather than the old v2.5 Exhaustion model:

- party-wide Shared Team AP;
- Team AP capacity = living Player units × 2;
- AP refresh at Player Turn start and no carry between Player Turns;
- unit switching throughout Player Turn;
- `StartGrid` per living unit at Player Turn start;
- leaving StartGrid commits one movement AP total, not per tile;
- returning before Attack/Skill Movement Lock can refund movement AP;
- Attack spends Team AP and locks that unit's further Movement for the turn;
- repeated Attack remains legal while AP/targeting rules permit;
- global End Turn;
- Stun denies Move/Attack/Skill/Hold but does not remove the living unit's AP contribution.

Tutorial damage currently ignores DEF through Tutorial-specific damage context. Normal prototype combat retains the existing DEF subtraction path. This must not be documented as a global main-game DEF removal.

---

## 4. Enemy Resolution — IMPLEMENTED

Current runtime resolves living enemies sequentially in `spawnOrder`.

Baseline Sword/Spear flow uses real:

```text
Target
→ Intent
→ Movement
→ Action
```

Current basic roles:

- Sword: nearest valid Player / melee engagement pressure;
- Spear: nearest valid Player / `seek_max_effective_atr` spacing / basic attack only when effective;
- Blue Tutorial candidate: stationary `CHARGE → SHOCKWAVE` pattern handled by focused Blue logic.

New Wave enemies receive the next actual Spawn Order and do not receive an attached offensive action at spawn in the current Tutorial Safe-lifecycle PVS.

---

## 5. Tutorial — IMPLEMENTED THROUGH PHASE 8

The Tutorial is one continuous Stage with progressive Region A/B/C activation. Phase transitions do not inherently heal, teleport, refresh AP, clear Status, or reset battle state.

Current authored phases implemented in prototype:

| Phase | Implementation checkpoint |
|---|---|
| 1 | Control & Party Orientation |
| 2 | Shared AP & Tactical Movement |
| 3 | Turn / Intent / Basic Combat |
| 4 | Tactical Range & Offensive Cover |
| 5 | Dynamic Threat & Shared AP Application |
| 6 | Spear / Defensive Cover / Structure Objective |
| 7 | Blue Charge / Shockwave / Stun |
| 8 | Wave Telegraph / Combined Pressure / Graduation |

### Phase 6 current runtime

- real Spear role and movement scorer;
- Tutorial Spear ATK5 override;
- clear incoming attack → defensive Cover → reduced covered attack;
- Spear must die before Structure lesson;
- one 3×3 Hut Structure with one HP pool;
- Structure Basic Attack via normal target/damage path;
- destroyed Tutorial Hut remains in battle state, untargetable and blocking in current implementation;
- Region C becomes available after Phase 6 completion.

### Phase 7 current runtime

- Blue candidate is staged without heal/reset from prior state;
- Charge1 → Charge2 → Shockwave readable cycle;
- actual radius-based Shockwave area;
- `STUN2 → STUN1 → recovered` through generic Status ticking;
- one mandatory Archer attack during controlled evidence;
- Phase 7 ends only after required recovery evidence;
- Blue carries into Phase 8 at normal path HP26 / SHOCKWAVE-ready state.

### Phase 8 current runtime

- W1 Sword guided Wave Telegraph;
- reserved Wave tiles are traversable but invalid as final movement positions for Player and Enemy;
- W1 spawns at Enemy Turn end with no attached attack/move;
- W2 Spear Telegraph begins free-play graduation and activates final Objective;
- persistent high-level prompt: `Anticipate incoming enemies and eliminate all threats.`;
- W2 Spear uses ATK5 Tutorial override;
- when W2 has spawned, W3 telegraphs two Sword enemies;
- preferred W3 positions `(9,1)` and `(14,5)` with authored deterministic fallback pairs;
- W3 two Swords spawn simultaneously under the same Safe lifecycle;
- pending required Waves block Tutorial completion even if the current board is temporarily empty;
- single casualty after Phase 7 is valid; normal living-unit AP recalculation applies;
- first single casualty receives explanatory system feedback;
- full-party Phase 8 defeat restores CP8 when available;
- final Tutorial Victory occurs only after all required Wave entries resolve and no hostile remains.

Exact W3 geometry/count/lifecycle is Tutorial PVS, not universal Wave canon.

---

## 6. Phase Jump / Checkpoints — IMPLEMENTED PROTOTYPE TOOLS

`P` opens the Phase Jump validation popup for Curriculum Entry States 1–8.

Phase Jump is **PROTOTYPE ONLY / NON-UNITY**.

It builds deterministic phase-entry PVS states through domain initializers; it is not a giant saved replay.

Current Tutorial checkpoint infrastructure uses deep tactical snapshots. Relevant later checkpoints include CP6/CP7/CP8 flows; CP8 restores the final-encounter tactical state rather than healing/restarting from Phase 1.

Natural checkpoints and deterministic Phase Jump recipes are distinct concepts.

---

## 7. Objective / Structure / Wave — CURRENT IMPLEMENTATION

Current `objectiveLogic.js` still owns normal `eliminate_all` evaluation and Structure Objective presentation. Tutorial Victory readiness adds an additional Tutorial-state gate.

Structures are stored separately from `playerUnits` / `enemyUnits`.

Wave state is stored separately from living enemy count. This allows:

```text
no living enemy now
+
required Wave still pending
→ no Tutorial Victory
```

This is an implementation result, not a statement that every future Required Wave universally blocks every encounter's Victory.

---

## 8. Run / Profile / Meta Systems — CARRIED CURRENT SOURCE, NOT RE-VALIDATED THIS MILESTONE

The v2.5-era run/profile modules remain present, including run state, route/reward handling, profile persistence, Meta Crystal, and permanent upgrade functions.

`src/logic/run/runState.js` and `src/logic/profile/profileStorage.js` show no relevant post-v2.5 commit changes in the audited repository history. `main.js` received later flow/tutorial changes.

Treat these systems as **carried implementation**, not newly runtime-confirmed by the Phase 6–8 test suite.

The prototype Region 1 settlement boundary remains a DEVELOPMENT EXCEPTION relative to the intended full Village → Town → Castle run.

---

## 9. Known Watches / Non-Claims

- Wave Safe lifecycle is implemented for the Tutorial PVS but universal main-game spawn-to-first-activation timing remains OPEN.
- W3 two-Sword composition, fallback pairs, and exact coordinates are Tutorial PVS.
- Blue is not a locked Region 1 roster member.
- Tutorial no-DEF damage does not remove DEF globally.
- destroyed-Structure walkability is not a universal design decision; Tutorial Hut currently remains blocking.
- current generic Status ticking is sufficient for Stun but may need extension for future status-specific timing semantics.
- UI/debug may still expose legacy DEF information even where Tutorial damage ignores DEF.
- retreat/spawn-camp/Archer AP funnel remain balance/perceived watches rather than technical bugs.
- no comprehensive new runtime revalidation of legacy run/meta-progression was performed during this Tutorial milestone.

---

## 10. Current Resume Point

Phase 8 implementation is closed and committed. Documentation refresh is the active milestone.

After documentation is placed/committed, the strongest validation checkpoint is a **fresh full natural Tutorial Phase 1 → 8 run** using the final W3 geometry, followed by a Game Designer decision on the next design/validation domain. Do not start broad refactors merely because the Tutorial milestone is complete.
