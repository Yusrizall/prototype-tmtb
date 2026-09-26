# TMTB Stage 1 Implementation Brief

**Project:** TMTB / BeCan  
**Document Type:** Implementation Brief / Stage 1 Validation Slice  
**Brief Version:** 1.0  
**Date:** 26 September 2026  
**Design Authority:** `TMTB_BATTLE_REDESIGN_CHECKPOINT_2026-09-26_v0.4.md`  
**Prototype Baseline:** Commit `81259555cd961a9ddfba9e7aa21bdd32abbe5848` on `main`, last confirmed by the Game Designer  
**Implementation Status:** **NOT IMPLEMENTED / REJECTED EXPERIMENTAL WORK REQUIRES GIT AUDIT**  
**Scope:** Stage 1 only

---

# 1. Implementation Mission

Implement one valid Stage 1 playtest slice that can test this hypothesis:

> Guard players choose between faster but damaging aggression, slower HP-preserving defence, and more efficient positional defence when Sword Intent and Fortify consequences are readable.

The implementation must produce interpretable playtest data.

Therefore:

```text
preserving existing controls/AP/UI rules
is part of implementation correctness
```

A feature-complete screen that changes those foundations is not an acceptable test build.

---

# 2. Mandatory Preflight and Stop Conditions

Before editing:

1. Report repository root.
2. Report active branch and HEAD.
3. Run `git status --short --branch`.
4. Confirm local `main` and `origin/main` relationship after a successful fetch or report why freshness cannot be confirmed.
5. List all modified, staged, and untracked paths.
6. Identify whether the rejected experimental branch/files still exist.
7. Do not discard, overwrite, stage, or move existing user files automatically.

Last reported experimental branch:

```text
feat/stage1-2-battle-redesign-playtest
```

Last reported experimental work included an isolated engine/UI and was not committed, merged, or pushed.

## Stop immediately when

- current Git state differs materially from the known report;
- unrelated user changes exist;
- the accepted main baseline cannot be identified;
- cleaning the rejected experiment would require deleting/discarding work without explicit Game Designer approval;
- a design rule in this brief conflicts with actual current source in a way that changes player behaviour;
- required established controls/AP behaviour cannot be reused without a broader refactor.

Git cleanup or branch replacement requires a separate explicit instruction from the Game Designer.

---

# 3. Source-of-Truth Boundary

For intended Stage 1 behaviour:

```text
1. This brief
2. Battle Redesign Checkpoint v0.4
3. Latest explicit Game Designer correction
```

For actual implementation:

```text
1. Current repository source/data
2. Confirmed runtime behaviour
3. Handoff v3.2 implementation documents
```

If names or structures differ in current source, adapt integration to the repository. Do not adapt away the player-facing rules in this brief without reporting the conflict.

---

# 4. Hard Architecture Constraint

## 4.1 Required approach

The redesign must extend the established prototype battle foundation:

- existing battle screen/layout;
- existing map renderer;
- existing HUD structure;
- existing keyboard and mouse controls;
- existing StartGrid and movement-commitment rules;
- existing Team AP;
- existing movement/attack validation;
- existing obstacle collision;
- existing result/retry/run-flow components where applicable.

## 4.2 Forbidden approach

Do not:

- create another isolated battle engine that reinterprets baseline rules;
- create a replacement click-only battle UI;
- bypass StartGrid movement commitment;
- make movement free;
- allow movement through `O30`, `O70`, `OF`, or `LOS` obstacles;
- overwrite the old Tutorial map or Tutorial flow;
- implement Stage 2, Spear, or Archer in this step;
- redesign the entire controller architecture;
- activate Buff or Shop effects;
- invent missing game-design rules;
- commit, merge, push, or stage files unless separately authorized.

---

# 5. Relevant Integration Surfaces to Audit

The following paths existed in the reviewed prototype snapshot and are likely integration points. Audit their current versions before editing:

```text
src/main.js
src/logic/battle/battleSetup.js
src/logic/battle/movementLogic.js
src/logic/battle/enemyMovementLogic.js
src/logic/battle/enemyTargetLogic.js
src/logic/battle/damageLogic.js
src/logic/battle/skillLogic.js
src/logic/battle/statusLogic.js
src/logic/battle/waveLogic.js
src/logic/battle/pathLogic.js
src/ui/mapRenderer.js
src/ui/battle/battleHud.js
src/ui/flow/basicFlowScreens.js
public/data/maps/tutorial_offset_courtyard.json
public/data/units/player_units.json
public/data/units/enemy_units.json
package.json
```

This list is not authorization to edit every file.

Required method:

```text
audit responsibility
→ identify smallest coherent integration
→ edit only required files
```

---

# 6. New Assets

Create new redesign assets rather than modifying old Tutorial assets.

Recommended identifiers:

```text
public/data/maps/r1_stage1_redesign_v0_2.json
public/data/encounters/r1_stage1_redesign_v0_2.json
```

If the current loader requires another naming convention, report and adapt the path while preserving a separate asset identity.

## 6.1 Map

- copy the full `16×16` shape of `tutorial_offset_courtyard.json`;
- do not overwrite the source map;
- preserve movement-blocking collision;
- present Stage 1 obstacles as generic solid obstacles rather than teaching Cover percentages;
- retain the important blocker at `(4,11)`;
- do not allow Guard or Sword to traverse obstacle tiles.

## 6.2 Encounter positions

| Element | Coordinate |
|---|---:|
| Guard | `(2,10)` |
| Sword 1 | `(8,11)` |
| Sword 2 telegraph/spawn | `(10,8)` |

---

# 7. Required Existing Combat Behaviour

These are regression requirements, not new features:

- Team AP capacity is `2` with one living Guard.
- StartGrid is captured at Player Turn start.
- Leaving StartGrid commits `1 AP`.
- Movement after commitment does not repeatedly cost AP.
- Returning to StartGrid before movement lock refunds movement AP.
- Attack costs `1 AP`.
- Attack locks further movement.
- Move → Attack is legal.
- Attack → Move is not legal.
- Attack ×2 is legal when Sword is already in range.
- End Turn remains a global explicit action.
- keyboard and mouse controls both work.
- current camera/pan/zoom behaviour remains available.
- movement-blocking obstacles remain non-traversable.

No Stage 1 test result is valid if these regress.

---

# 8. Stage 1 Values

## 8.1 Guard

```text
HP   25
ATK  5
Move 3
ATR  1.5
```

## 8.2 Sword

```text
HP   16
ATK  6
Move 3
ATR  1.5
```

Sword targets the nearest living Player Hero only. Structures are not valid targets.

---

# 9. Fortify Contract

Fortify is a Guard Skill with:

```text
target: self
cost: 2 Team AP
Shield: 6
cooldown: none
stacking: false
activation: immediate
expiry: Shield reaches 0 or next Player Turn begins
```

Required consequences:

- Guard cannot move then Fortify because movement leaves only 1 AP.
- Guard cannot Attack then Fortify.
- Guard cannot Fortify then Attack.
- casting Fortify replaces no active stack; duplicate stacking is disallowed.
- generic Shield must not automatically confer Guard's `Fortified` interaction.

Derived state:

```text
fortifyShield > 0
→ Fortified = true
```

Damage order:

```text
incoming damage
→ Shield absorption
→ HP overflow
```

The melee-contact trigger reads Fortified at hit start, so a 6-damage Sword hit against Shield 6 still triggers Repelled.

---

# 10. Sword State Contract

Recommended conceptual states:

```text
READY
ATTACK_INTENT
STUNNED_RECOVERY_PENDING
RECOVERING
DEAD
```

Field names must follow current repository conventions. Do not introduce duplicate state ownership if current battle-unit/status structures already provide it.

## 10.1 Normal activation

```text
select nearest living Hero
→ seek legal melee-engagement destination
→ move up to Move 3
→ attack at most once when legal
```

## 10.2 Fortified-contact resolution order

```text
1. Sword attack begins
2. Snapshot whether Guard is Fortified
3. Resolve Shield/HP damage
4. If contact began against Fortified Guard:
   a. emit Repelled
   b. calculate knockback vector
   c. resolve legal or blocked destination
   d. clear Sword attack intent
   e. apply Stunned / Recovery Pending
5. finish activation
```

## 10.3 Knockback vector

Given Guard `(gx, gy)` and Sword `(sx, sy)` at contact:

```text
dx = sign(sx - gx)
dy = sign(sy - gy)
destination = (sx + dx, sy + dy)
```

Consequences:

- cardinal contact pushes cardinally;
- diagonal contact pushes diagonally;
- displacement is exactly one tile;
- only destination legality is checked;
- no alternate-tile search;
- no chain push.

Blocked destination reasons:

- outside map;
- void;
- obstacle;
- occupied final tile.

Blocked result:

```text
position unchanged
Stunned still applied
Recovery still required
```

## 10.4 Recovery

On the next Sword activation after Stun:

- do not move;
- do not attack;
- present Recovery animation/state;
- clear Stunned at activation end;
- prepare Attack Intent for the following activation.

The Player Turn after Recovery must show the restored Attack Intent.

---

# 11. Wave Contract

## 11.1 Stage entry

- spawn Guard at `(2,10)`;
- spawn Sword 1 at `(8,11)`;
- objective is `Eliminate All Required Enemies`;
- stage is not complete when Sword 1 dies.

## 11.2 After Sword 1 death

Immediately:

- set the first wave as cleared;
- mark reinforcement as pending;
- show a non-modal reinforcement notice;
- retain the remainder of the current Player Turn;
- do not reveal the exact landing tile yet.

Recommended message:

```text
WAVE 1 CLEARED — Reinforcement detected.
End Turn to reveal landing zone.
```

## 11.3 Enemy Transition

After End Turn:

- process no enemy attack;
- create Sword 2 telegraph at `(10,8)`;
- initialize exactly one full preparation Player Turn.

## 11.4 Preparation

- Sword 2 is not yet targetable;
- its landing tile and relevant threat information are visible;
- the reserved tile may be traversed in route calculation but cannot be the Player's final tile when ending preparation;
- an attempted End Turn from the reserved tile must be rejected with clear feedback;
- Fortify is legal even when Sword cannot yet reach Guard;
- the system must not silently prevent or correct premature Fortify.

## 11.5 Landing and first activation

When preparation ends:

- Sword 2 lands at `(10,8)`;
- landing presentation resolves;
- Sword 2 immediately performs its normal activation;
- Stage completes only after Sword 2 dies and no required reinforcement remains.

---

# 12. UI and Control Requirements

## 12.1 Reuse

Reuse the established:

- top battle-status HUD;
- roster/unit-detail presentation;
- map/grid rendering;
- StartGrid marker;
- movement-range display;
- target/attack preview;
- action controls;
- keyboard hints;
- mouse interaction;
- Battle Result presentation.

## 12.2 Required new information

Add only the information necessary to read the new rules:

- Fortify Skill description and AP cost;
- Shield value;
- `Fortified` state;
- Sword Attack Intent;
- `Repelled` feedback;
- `Stunned` / `Recovery` state;
- knockback direction/result;
- reinforcement notice;
- Sword 2 landing telegraph;
- threat range relevant to Fortify timing.

## 12.3 Contextual hints

Hints must be:

- non-modal;
- dismissible only when necessary;
- not required to unlock actions;
- not written as a forced action sequence;
- progressively reduced for Sword 2.

Do not use repeated `text → stop game → OK → next instruction` behaviour.

---

# 13. Result, Retry, and Run Snapshot

Victory:

```text
Sword 1 dead
AND Sword 2 dead
AND no required wave pending
```

Defeat:

```text
Guard HP <= 0
```

Retry must restore:

- Guard HP 25;
- Guard position `(2,10)`;
- Sword 1 alive at `(8,11)`;
- Sword 2 absent;
- wave index;
- Team AP;
- StartGrid;
- Shield/Fortified;
- Stun/Recovery;
- movement locks;
- telegraph state;
- objective state.

Attempt number increments; previous telemetry remains preserved.

On victory:

- show the established Battle Result screen;
- record final HP, turns, duration, and reward;
- working reward is `20` Run Crystal;
- prevent duplicate reward settlement;
- retain the Guard HP snapshot for later Stage 2 entry;
- Buff/Shop screens may remain visible in the broader flow, but their battle effects remain inactive during this validation scope.

---

# 14. Telemetry Contract

## 14.1 Identity envelope

```text
participant_code
session_id
attempt_number
stage_id
timestamp
player_turn
phase
event_type
actor_id
target_id
payload
```

Do not collect unnecessary personal information. `participant_code` should be a study code or user-entered test identifier, not an email requirement.

## 14.2 Required events

| Event | Required payload examples |
|---|---|
| `stage_started` | entry HP, positions, attempt |
| `turn_started` | AP, unit positions, active Intent |
| `player_moved` | from, to, AP before/after, StartGrid |
| `player_attacked` | target, damage, target HP |
| `fortify_used` | position, Shield, whether Sword could threaten next activation |
| `turn_ended` | AP remaining, legal/relevant actions available |
| `enemy_intent_updated` | intent, target, predicted threat |
| `enemy_activated` | movement, attack, Recovery |
| `damage_resolved` | Shield absorbed, HP damage |
| `repelled_triggered` | Guard/Sword positions, contact vector |
| `knockback_resolved` | requested destination, moved/blocked, reason |
| `stun_recovery` | apply/start/end |
| `sword_defeated` | sword index, turn, Guard HP |
| `wave_telegraph_shown` | tile, preparation count |
| `stage_ended` | result, duration, turns, final HP |
| `retry_selected` | prior result, next attempt |

## 14.3 Local-first requirement

The battle must remain playable if remote telemetry fails.

Required first layer:

- in-memory/local event buffer;
- exportable JSON;
- visible confirmation that export succeeded or failed;
- no battle-rule dependency on telemetry transport.

## 14.4 Remote transport boundary

Supabase upload may be added only after the core battle passes automated and manual validation.

If added:

- use the public anon configuration only;
- never expose a service-role key;
- rely on insert-only RLS already configured by the Game Designer;
- queue/fallback locally when network insert fails;
- do not block player flow on upload;
- keep the transport adapter separate from event generation.

Remote telemetry is not allowed to obscure whether the battle rules themselves work.

---

# 15. Required Automated Tests

## 15.1 Regression tests

Existing tests must remain passing.

At minimum, preserve tests for:

- StartGrid AP commitment/refund;
- movement lock after Attack/Skill;
- keyboard/mouse action equivalence where testable;
- obstacle traversal rejection;
- damage and Shield order;
- result/retry flow;
- one-time reward settlement.

## 15.2 New Stage 1 rule tests

### Fortify

- costs exactly 2 AP;
- grants Shield 6;
- cannot combine with movement or Attack;
- does not stack;
- has no cooldown;
- expires on next Player Turn;
- generic Shield does not confer Fortified.

### Repelled and Knockback

- melee contact against Fortified triggers Repelled;
- non-Fortified contact does not;
- projectile-style damage does not;
- cardinal knockback moves one tile;
- diagonal knockback moves one tile diagonally;
- obstacle/void/edge/occupied destination blocks displacement;
- blocked displacement still applies Stunned;
- no alternative tile search occurs.

### Stunned and Recovery

- Stunned Sword has no Attack Intent;
- next activation does not move or attack;
- Recovery clears Stunned at activation end;
- Attack Intent returns for the following activation;
- Sword attacks normally on that following activation.

### Wave

- Sword 1 death does not complete Stage 1;
- reinforcement notice appears immediately;
- exact telegraph waits for Enemy Transition;
- preparation lasts one complete Player Turn;
- Sword 2 is not targetable during preparation;
- reserved landing tile cannot be the final preparation position;
- Sword 2 lands at `(10,8)`;
- Sword 2 immediately activates after landing;
- victory occurs only after Sword 2 dies.

### Retry

- all Stage 1 state returns to the initial snapshot;
- attempt number increments;
- previous telemetry is not erased.

### Telemetry

- required events contain the identity envelope;
- AP remaining includes the legal-action context;
- premature Fortify can be derived;
- remote failure does not interrupt battle;
- event export produces valid JSON.

---

# 16. Manual Acceptance Scenarios

The Game Designer must manually validate the implementation before external testing.

## Scenario A — Control and baseline regression

- Start Stage 1.
- Confirm established HUD/layout.
- Move with keyboard and mouse.
- Confirm leaving StartGrid consumes 1 AP.
- Return before action and confirm AP refund.
- Confirm obstacles cannot be crossed.
- Confirm Attack locks movement.

## Scenario B — Aggressive route

- rush toward Sword 1;
- accept incoming damage;
- confirm Attack ×2 when already adjacent;
- verify fast clear and HP loss.

## Scenario C — Standard Fortify route

- let Sword enter threat range;
- Fortify;
- verify Shield 6 absorbs Sword ATK 6;
- verify immediate knockback and Stun;
- use Move + Attack in the response window;
- verify Sword Recovery consumes one activation.

## Scenario D — Blocked knockback

- use the `(4,11)` blocker setup;
- trigger diagonal knockback into the blocker;
- verify Sword remains in place;
- verify Stunned/Recovery still applies;
- verify Guard can Attack ×2 without pursuit.

## Scenario E — Wave transition

- defeat Sword 1;
- confirm stage does not finish;
- confirm reinforcement notice;
- End Turn;
- confirm telegraph at `(10,8)`;
- use one full preparation turn;
- confirm Sword 2 landing and immediate activation.

## Scenario F — Premature Fortify

- Fortify during preparation while Sword cannot reach Guard;
- confirm action remains legal;
- confirm Shield expires normally;
- confirm telemetry marks the threat context without altering the result.

## Scenario G — Defeat/retry

- allow Guard to die;
- confirm defeat result;
- retry;
- verify complete initial-state restoration and incremented attempt.

## Scenario H — Victory/result/export

- defeat Sword 2;
- verify Stage 1 victory and one-time reward;
- verify result metrics;
- export telemetry JSON;
- inspect that turns, Fortify, damage, knockback, wave, and final result are present.

---

# 17. Recommended Implementation Order

Implement in small verified increments.

## Step 0 — Repository resolution

- audit current branch and dirty tree;
- classify rejected experimental files;
- obtain Game Designer approval for any cleanup/branch action;
- establish a safe feature branch from the accepted baseline.

## Step 1 — Baseline capture

- run the existing full test suite;
- run production build;
- manually open the existing battle screen;
- record baseline control/AP/obstacle behaviour.

Stop if the baseline itself is not healthy.

## Step 2 — Stage 1 data and route shell

- create separate map/encounter assets;
- load them through the established battle screen;
- verify Guard/Sword placement;
- do not add new mechanics yet.

## Step 3 — Fortify migration

- update the existing Skill/status path;
- test AP, Shield, expiry, and movement lock;
- verify existing skills/regressions.

## Step 4 — Sword state interaction

- add immediate knockback;
- add blocked resolution;
- add Stunned/Recovery;
- update Intent visibility;
- run focused tests and manual scenarios.

## Step 5 — Wave transition

- add reinforcement pending state;
- add Enemy Transition telegraph;
- add full preparation lifecycle;
- spawn/activate Sword 2;
- add victory condition.

## Step 6 — Contextual UI

- expose new status/Intent information through existing HUD/world cues;
- preserve controls and layout;
- avoid forced-modal Tutorial logic.

## Step 7 — Telemetry

- generate local events from accepted battle transitions;
- implement JSON export;
- validate derived metrics;
- only then consider remote transport.

## Step 8 — Closure validation

- run complete tests;
- run production build;
- run `git diff --check`;
- perform all manual scenarios;
- report status without committing or pushing.

---

# 18. Acceptance Gate

Implementation is ready for Game Designer review only when:

- all pre-existing automated tests pass;
- all new Stage 1 tests pass;
- production build passes;
- no unrelated files were changed;
- old Tutorial assets/behaviour were not overwritten;
- established battle layout and controls remain recognizable and functional;
- movement/AP/obstacle regression scenarios pass;
- Fortify and Sword state scenarios pass;
- Sword 2 transition works;
- retry and reward snapshots work;
- telemetry export is valid;
- limitations and unverified items are explicitly reported.

Passing automated tests alone is insufficient. Manual Game Designer acceptance is required before external testing.

---

# 19. Required Final Implementation Report

The implementer must report:

1. repository root, branch, and HEAD;
2. files changed/created;
3. how the established battle engine/UI was reused;
4. exact Stage 1 rules implemented;
5. tests added;
6. full test result;
7. production build result;
8. manual checks completed and not completed;
9. telemetry/export result;
10. known deviations or open decisions;
11. final Git status;
12. explicit confirmation that nothing was staged, committed, merged, or pushed unless separately authorized.

Do not claim player validation, lecturer approval, or design success from implementation tests.

---

# 20. Definition of Done

```text
repository audited
→ established foundation preserved
→ Stage 1 rules implemented
→ automated regressions pass
→ production build passes
→ manual scenarios pass
→ telemetry export verified
→ Game Designer accepts runtime behaviour
→ external testing may begin
```

Until the Game Designer accepts the runtime, status remains:

```text
IMPLEMENTED IN SOURCE / PENDING MANUAL ACCEPTANCE
```

not:

```text
DESIGN VALIDATED
```
