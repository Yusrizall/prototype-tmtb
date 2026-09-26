# TMTB Battle Redesign Checkpoint

**Project:** TMTB / BeCan  
**Document Type:** Supporting Design Handoff / Active Redesign Checkpoint  
**Checkpoint Version:** 0.4  
**Date:** 26 September 2026  
**Canonical Status:** **NON-CANONICAL SUPPORTING CHECKPOINT — CANONICAL MIGRATION PENDING**  
**Design Scope:** Post-guidance battle redesign; latest lecturer/team direction; Stage 1 working lock; design hypothesis and validation plan  
**Prototype Implementation Baseline:** Git commit `81259555cd961a9ddfba9e7aa21bdd32abbe5848` on `main`, as last confirmed by the Game Designer  
**Implementation Status:** **STAGE 1 DESIGN SPECIFIED / EXPERIMENTAL IMPLEMENTATION REJECTED / CLEAN REIMPLEMENTATION NOT STARTED**

---

# 1. Purpose

This document preserves the TMTB redesign state after:

- the Stage 1–2 design work recorded in checkpoint v0.3;
- an unsuccessful experimental web-prototype implementation;
- two additional lecturer-guidance sessions;
- an internal team meeting that narrowed the immediate production scope;
- a renewed Stage 1 paper-test and design-hypothesis pass.

This checkpoint exists so the team can distinguish:

```text
current Stage 1 design intent
from
the rejected experimental implementation
from
the stable prototype baseline on main
```

This document does not silently replace:

- `TMTB_GAME_DESIGN_CONTEXT.md`;
- `TMTB_GAME_DESIGN_DECISIONS_v3.4.md`;
- Handoff Package v3.2;
- actual repository source and runtime evidence;
- `TMTB_BATTLE_REDESIGN_CHECKPOINT_2026-09-21_v0.3.md` as the detailed Stage 2 reasoning record.

Its intended lifecycle is:

```text
active Game Designer decisions
→ supporting checkpoint v0.4
→ Stage 1 implementation and five-player exploratory test
→ design review
→ deliberate canonical migration
```

---

# 2. Authority and Reading Rule

## 2.1 Design authority

For the domains covered by this checkpoint:

```text
1. Latest explicit Game Designer decision in the active discussion
2. This v0.4 checkpoint for the Stage 1 redesign delta
3. Checkpoint v0.3 for carried Stage 2 detail
4. TMTB_GAME_DESIGN_CONTEXT.md and GAME_DESIGN_DECISIONS_v3.4.md
5. Handoff v3.2 and older supporting/historical material
```

The latest explicit Game Designer decisions recorded here are authoritative in the active discussion, but the canonical living documents still require deliberate migration.

## 2.2 Implementation authority

```text
1. Actual current repository source/data
2. Confirmed runtime testing
3. TMTB_CURRENT_STATE_v3.2.md
4. Architecture / State & Data / implementation handoffs
5. This design checkpoint
```

This document specifies intended behaviour. It does not prove that the prototype implements it.

## 2.3 Status language

This checkpoint uses the project maintenance vocabulary:

- **LOCKED — ACTIVE DISCUSSION**: explicitly selected by the Game Designer for the next implementation/playtest cycle; canonical migration is still pending.
- **PLANNED**: intended but not implemented or sufficiently validated.
- **TENTATIVE**: selected working value that may change after testing.
- **OPEN**: unresolved and must not be guessed.
- **SUPERSEDED**: intentionally replaced by a later decision.
- **PROTOTYPE ONLY**: limited to the validation build.
- **UNVERIFIED IMPLEMENTATION**: reported source work that has not been accepted as working runtime truth.

---

# 3. Verification Boundary

## 3.1 Reviewed for v0.4

The v0.4 refresh reviewed:

- `TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md`;
- checkpoint v0.3;
- the verified old Tutorial map data `tutorial_offset_courtyard.json`;
- the prototype movement and enemy-movement rules relevant to Stage 1 geometry;
- the latest explicit corrections and selections made by the Game Designer;
- the Game Designer's manual findings from the rejected experimental implementation.

Targeted source inspection verified that the old prototype treats `O30`, `O70`, `OF`, and `LOS` as movement-blocking obstacle tiles and preserves the established StartGrid/AP movement model.

## 3.2 Not verified by v0.4

This document does not claim:

- a fresh audit of the Game Designer's current local Git working tree;
- that the experimental feature branch still has the exact previously reported files;
- working implementation of the Stage 1 redesign;
- accepted Unity implementation of the redesign;
- five-player test results;
- lecturer approval of the selected Stage 1 design;
- statistical validation;
- final production balance.

All paper-test numbers are predictions derived from rules and geometry, not observed player results.

---

# 4. Why v0.4 Was Needed

## 4.1 Experimental implementation did not preserve the prototype foundation

An experimental Codex implementation was reported on branch:

```text
feat/stage1-2-battle-redesign-playtest
```

The reported branch remained based on commit:

```text
81259555cd961a9ddfba9e7aa21bdd32abbe5848
```

The implementation created an isolated playtest engine and UI. Automated tests and a build reportedly passed, but manual inspection by the Game Designer found major design and regression problems:

- the established battle layout/template was not reused;
- keyboard and mouse control parity was lost;
- StartGrid was absent;
- movement did not consume AP correctly;
- Guard could move and still attack twice or Fortify;
- movement-blocking `O30` obstacles could be traversed;
- the redesign therefore could not validly test the intended battle hypothesis.

The experimental implementation was not accepted as prototype truth and was reported as uncommitted, unmerged, and unpushed.

Required conclusion:

> The next implementation must extend the established battle engine, renderer, control scheme, and AP rules. It must not create another isolated battle interpretation.

## 4.2 Latest guidance from Bu Dea

The Game Designer reported that Bu Dea reviewed the Unity build of the old eight-phase Tutorial and commented mainly on UI clarity.

The Game Designer verbally presented the redesign direction, but this must not be recorded as lecturer approval.

The new assignment was interpreted as:

```text
state a clear design hypothesis
→ define the expected player behaviour/outcome
→ derive telemetry and questionnaire needs
→ test whether observed behaviour supports or challenges the hypothesis
```

## 4.3 Latest guidance from Bu Tia

The Game Designer reported that Bu Tia asked the team to prioritize Bu Dea's validation task so academic documentation can progress before the December progress defence.

Questionnaire structure, wording, and answer models should be grounded in relevant academic references rather than invented without methodological basis.

## 4.4 Team production dependencies

The internal team requested a narrower and more stable design scope:

- UI/UX needs battle HUD, AP, skill, and status requirements;
- the system programmer needs battle-state and game-flow contracts;
- the character/battle programmer needs defined unit states for at least one Hero and two enemies;
- the character artist needs Guard, Sword, Spear, and Archer tropes preserved;
- the environment artist needs Stage 1–2 layout and obstacle/objective functions;
- Stage 1 must be completed first;
- Stage 2 remains the next milestone and should not block Stage 1 delivery.

---

# 5. Relationship to v0.3

## 5.1 Carried from v0.3

- real stages replace the rejected rigid Tutorial as the primary onboarding direction;
- Stage 1 begins with Guard only;
- Stage 1 introduces one baseline melee enemy before a second sequential enemy;
- Shared Team AP and StartGrid movement commitment remain part of the combat foundation;
- Fortify is a Guard Skill, not Hold/Brace;
- Fortify is self-only, costs 2 AP, grants Shield 6, and has no cooldown in the first playtest;
- HP carries forward conceptually while temporary battle state resets;
- Stage 2 remains the next progression step and introduces objective/ranged pressure;
- testing begins at Stage 1, not Stage 2;
- five non-team participants remain the exploratory test target.

## 5.2 Superseded from v0.3

| v0.3 rule | v0.4 replacement |
|---|---|
| Baseline enemy discussed as `Dagger` | Production/design name is **Sword Enemy** |
| Repelled Sword waits until its next activation to Disengage | Sword is knocked back immediately, becomes Stunned, and uses its next activation for Recovery |
| Disengage selects one legal adjacent tile farther from Guard | Knockback follows a one-tile impact vector; no alternative tile search |
| If no Disengage tile exists, Sword stays and clears Repelled | If knockback is blocked, Sword stays but remains Stunned and still performs Recovery |
| Sword 2 telegraph/spawn at `(12,8)` | Working selected spawn is `(10,8)` |
| Exact telegraph created immediately when Sword 1 dies | Immediate reinforcement notice; exact landing telegraph appears during Enemy Transition after End Turn |
| Stage 1–2 implementation was the immediate next step | Stage 1 design/validation is isolated first; Stage 2 implementation is paused |

## 5.3 Stage 2 relationship

Checkpoint v0.3 remains the detailed supporting record for:

- Protect Hut objective;
- Spear Aim → response → Throw → Reposition;
- projectile trajectory and collision;
- Cover and Projectile Blocker distinctions;
- Stage 2 wave and activation-order paper tests.

Those sections were not revalidated or promoted by v0.4.

The following Stage 2 question remains explicitly open:

> What does Spear do when no preferred Objective or Hero can be targeted from any current valid Aim lane, and how does it choose movement when the preferred Building exists but remains out of range?

No Stage 1 implementer may invent that rule.

---

# 6. Active Workflow and Scope

## 6.1 Current workflow

```text
1. Lock Stage 1 playtest specification
2. Record its design hypothesis
3. Define telemetry and questionnaire variables
4. Produce a constrained Stage 1 implementation brief
5. Audit and resolve the experimental Git branch safely
6. Reimplement Stage 1 using the established prototype foundation
7. Run automated regression and scenario tests
8. Perform Game Designer manual validation
9. Run five-player exploratory test
10. Compare prediction, behaviour, and player explanation
11. Revise Stage 1 or migrate supported decisions
12. Resume Stage 2 design and implementation
```

## 6.2 Immediate scope boundary

The next implementation scope is only:

```text
Stage 1
Guard
Sword 1
Sword 2
Fortify
Repelled / Knockback / Stunned / Recovery
seamless contextual cues
local telemetry contract
result / retry
```

Not in the immediate scope:

- Spear implementation;
- Stage 2 battle implementation;
- Archer redesign;
- Hold/Brace design;
- active Buff effects;
- Shop balancing;
- final economy;
- production Fortify scaling;
- final questionnaire wording;
- canonical documentation migration.

---

# 7. Stage 1 Design Thesis

**LOCKED — ACTIVE DISCUSSION / PLAYTEST BASELINE**

Stage 1 is a real battle, not a forced-input Tutorial.

Its intended mental model is:

```text
read threat and distance
→ choose aggression, defence, or positional setup
→ observe the consequence
→ exploit the response window
→ transfer the model to Sword 2
```

The tactical thesis is:

> Guard can spend tempo to preserve HP through Fortify, accept damage to finish faster through aggression, or use obstacle geometry to improve the efficiency of Fortify.

---

# 8. Preserved Combat Foundation

**LOCKED — MUST NOT REGRESS**

Stage 1 uses the established prototype combat foundation:

- one Guard produces Team AP capacity `2`;
- StartGrid is set at the beginning of each Player Turn;
- leaving StartGrid commits `1 AP`;
- movement within the unit's Move range does not repeatedly consume AP;
- returning to StartGrid before movement lock refunds the movement AP;
- Attack costs `1 AP`;
- Attack locks movement;
- Move → Attack is legal;
- Attack → Move is not legal;
- Attack ×2 is legal when the target is already in range;
- Fortify costs all `2 AP`, so it cannot be combined with movement or Attack under the Stage 1 baseline;
- the player explicitly ends the turn;
- established keyboard and mouse controls remain supported;
- movement-blocking obstacles remain non-traversable.

This foundation is part of the experiment's control condition. Changing it would invalidate comparison with the intended design hypothesis.

---

# 9. Stage 1 Entities and Objective

## 9.1 Objective

```text
Eliminate All Required Enemies
```

Victory requires:

- Sword 1 defeated;
- Sword 2 defeated;
- no required Wave pending.

Defeat occurs when Guard HP reaches zero.

## 9.2 Baseline values

**TENTATIVE — FROZEN FOR FIRST PLAYTEST**

| Unit | HP | ATK | Move | ATR |
|---|---:|---:|---:|---:|
| Guard | 25 | 5 | 3 | 1.5 |
| Sword Enemy | 16 | 6 | 3 | 1.5 |

## 9.3 Roster restriction

Stage 1 contains:

- Guard as the only playable unit;
- Sword as the only enemy type;
- one active Sword at a time;
- no Structure objective;
- no Archer or Spear.

---

# 10. Guard Fortify

**LOCKED — ACTIVE DISCUSSION / PLAYTEST BASELINE**

| Property | Rule |
|---|---|
| Category | Guard core Skill |
| Target | self only |
| Cost | 2 Team AP |
| Shield | 6 |
| Cooldown | none in the first playtest |
| Stacking | non-stacking |
| Activation | immediate |
| Expiry | Shield reaches 0 or next Player Turn begins |

`Fortified` is Guard-specific and derived from active Fortify Shield:

```text
Fortify Shield > 0
→ Guard is Fortified
```

Generic Shield on another unit would not automatically provide Guard's Repelled interaction.

Damage order:

```text
incoming damage
→ Shield
→ remaining damage to HP
```

The Repelled trigger checks whether Guard was Fortified at the start of the melee hit. A Sword hit that removes the final Shield point still triggers Repelled.

Projectile damage never triggers Repelled.

---

# 11. Sword Tactical Identity and State Loop

## 11.1 Identity

**LOCKED — ACTIVE DISCUSSION**

```text
basic direct melee pressure
```

Sword:

- targets the nearest living Player Hero;
- does not target Structures;
- may update its target based on the state when the Player ends the turn;
- seeks a legal melee-engagement tile;
- attacks at most once per normal activation.

## 11.2 Fortified-contact sequence

```text
Sword attacks Fortified Guard
→ Shield resolves
→ Repelled triggers
→ immediate one-tile knockback attempt
→ Sword Attack Intent clears
→ Sword becomes Stunned
→ Player receives a response window
→ Sword spends its next activation on Recovery only
→ Stunned clears at the end of Recovery
→ Attack Intent returns for the following activation
```

## 11.3 Knockback

**LOCKED — ACTIVE DISCUSSION**

- Forced displacement is exactly one tile away from Guard.
- Horizontal/vertical contact pushes horizontally/vertically.
- Diagonal contact pushes diagonally.
- Knockback is not normal pathfinding movement.
- Only the destination tile is resolved.
- Sword does not search for an alternative destination.
- No chain push exists in Stage 1.
- A destination is blocked by obstacle, void, edge, or occupied tile.
- On blocked knockback, Sword remains in place but is still Stunned.

Blocked knockback is an intentional positional reward, not merely an error fallback.

## 11.4 Recovery duration

**LOCKED — ACTIVE DISCUSSION**

Recovery consumes exactly one Sword activation:

```text
E1: attack → Repelled → Stunned
P2: Guard response window
E2: Recovery only; no movement and no attack
P3: Attack Intent is visible again
E3: Sword may attack normally
```

The longer interpretation in which Sword remains inactive through E3 and attacks only on E4 is not selected.

---

# 12. Stage 1 Map and Encounter

## 12.1 Map source

**LOCKED — ACTIVE DISCUSSION**

- use the full `16×16` shape from `tutorial_offset_courtyard.json`;
- create a new redesign map asset;
- do not overwrite the old Tutorial map;
- Stage 1 obstacles are presented as solid obstacles, not as a Cover lesson;
- the old percentage-cover labels should not be exposed in the Stage 1 learning UI;
- obstacle collision remains active.

## 12.2 Working positions

| Element | Coordinate |
|---|---:|
| Guard StartGrid | `(2,10)` |
| Sword 1 | `(8,11)` |
| Sword 2 Telegraph/Spawn | `(10,8)` |
| Important positional blocker | `(4,11)` |

The old `(12,8)` Sword 2 candidate is superseded for the Stage 1 playtest baseline.

## 12.3 Kiting result

A targeted paper simulation using the verified map walkability, Move 3, ATR 1.5, and deterministic pursuit found no repeatable safe kiting cycle from the selected opening.

The longest safe branch found avoided contact for several activations but eventually reached a forced threat state.

This is paper evidence only. Runtime movement and pathfinding must still be tested.

---

# 13. Wave and Telegraph Lifecycle

**LOCKED — ACTIVE DISCUSSION**

## 13.1 Sword 1 defeat

When Sword 1 dies:

1. Stage remains active.
2. A non-modal reinforcement notice appears immediately.
3. Exact landing position is not yet revealed.
4. The Player retains control of the remainder of the current turn.
5. The UI indicates that End Turn advances the reinforcement state.

Recommended concise message:

```text
WAVE 1 CLEARED — Reinforcement detected.
End Turn to reveal landing zone.
```

## 13.2 Enemy Transition

After the Player ends the turn:

- no enemy combat action occurs;
- Sword 2 landing telegraph appears at `(10,8)`;
- one full Player preparation turn begins.

## 13.3 Preparation and spawn

- the telegraph remains active for one complete Player Turn;
- the reserved landing tile may be traversed by path calculation but may not be the final occupied tile when the Player ends preparation;
- when preparation ends, Sword 2 lands during the Enemy phase;
- Sword 2 immediately performs its normal activation after landing.

Only one enemy lands, so spawn-order ambiguity does not affect Stage 1.

---

# 14. Contextual Learning Ledger

**PLANNED**

Stage 1 uses contextual, non-modal support rather than forced steps.

| Situation | Exposed concept | UI support |
|---|---|---|
| Stage entry | camera, selection, movement | highlight existing mouse/WASD hints and StartGrid |
| Sword approaches | Intent, target, threat distance | world/HUD Intent and threat-range cue |
| Sword becomes reachable | Attack and ATR | existing valid-target feedback |
| Incoming attack becomes relevant | Fortify timing | highlight Skill affordance without prescribing use |
| Fortified contact | Shield, Repelled, Knockback, Stunned | status icons and concise combat feedback |
| Sword Recovery | response window | Recovery Intent/state remains visible |
| Sword 1 dies | Wave transition | reinforcement notice and End Turn cue |
| Sword 2 telegraph | preparation and transfer | landing cue; no repeated long explanation |

The ledger records exposure. It must not become a rigid tutorial gate.

---

# 15. Stage 1 Paper-Test Matrix

## 15.1 Sword 1 representative outcomes

| Approach | Player Turns | Damage Taken | Guard HP |
|---|---:|---:|---:|
| Aggressive Rush | 3 | 12 | 13 |
| Mixed | 5 | 6 | 19 |
| Standard Defensive | 6 | 0 | 25 |
| Positional Defense | 4 | 0 | 25 |

Positional Defense uses the `(4,11)` blocker to prevent knockback and enables Guard to Attack ×2 during the response window.

## 15.2 Sword 2 spawn comparison

Safe no-additional-damage paper routes from preparation through Sword 2 defeat produced:

| Sword 1 outcome position | Spawn `(12,8)` | Spawn `(10,8)` |
|---|---:|---:|
| Aggressive end position | 4 turns | 4 turns |
| Mixed end position | 7 turns | 6 turns |
| Standard Defensive end position | 6 turns | 6 turns |
| Positional end position | 7 turns | 5 turns |

`(10,8)` is selected because it reduces dead approach time while preserving a full preparation turn.

## 15.3 Whole-stage representative predictions

| Combined approach | Predicted Player Turns | Predicted final HP |
|---|---:|---:|
| Aggressive → Aggressive | approximately 6 | approximately 1 |
| Aggressive → Safe | approximately 7 | approximately 13 |
| Mixed → Safe | approximately 11 | approximately 19 |
| Standard Defensive → Safe | approximately 12 | approximately 25 |
| Positional Defense → Safe | approximately 9 | approximately 25 |

These are geometry/rule predictions, not player-test results.

---

# 16. Design Hypothesis

## 16.1 Primary hypothesis

> If Stage 1 presents one Guard against two sequential Sword enemies, with readable Intent and the Fortify–Repelled–Stunned–Recovery interaction, players will make threat- and position-dependent choices: aggression will finish battle faster at higher HP cost, while defence or positional play will preserve HP at a tempo cost.

## 16.2 Supporting hypotheses

### H1 — Cause and effect

Players understand:

```text
Fortify
→ Fortified Shield
→ melee contact
→ Repelled / Knockback / Stunned
→ response window
→ Recovery
→ Attack Intent returns
```

### H2 — Meaningful trade-off

Players can explain why Attack, Fortify, and positioning produce different tempo and HP outcomes.

### H3 — Intent and timing

Players consider whether Sword can attack on the next activation rather than using Fortify merely because an enemy exists.

### H4 — Learning transfer

Players require less support and make a more informed response against Sword 2.

### H5 — Positional mastery

Some players may discover that obstacle/edge geometry can block knockback and improve response-window efficiency.

H5 is not a required first-play success condition.

---

# 17. Telemetry and Measurement

## 17.1 Required common envelope

Each event should include:

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

## 17.2 Minimum events

- `stage_started`;
- `turn_started`;
- `player_moved`;
- `player_attacked`;
- `fortify_used`;
- `turn_ended`;
- `enemy_intent_updated`;
- `enemy_activated`;
- `damage_resolved`;
- `repelled_triggered`;
- `knockback_resolved`;
- `stun_recovery`;
- `sword_defeated`;
- `wave_telegraph_shown`;
- `stage_ended`;
- `retry_selected`.

## 17.3 Derived measures

- completion and retry;
- completion time;
- total Player Turns;
- final HP and damage taken;
- Fortify count;
- premature Fortify count;
- Shield damage absorbed;
- blocked knockback count;
- response-window attacks;
- Sword 1 and Sword 2 time-to-kill;
- first-to-second Sword adaptation;
- AP remaining at End Turn;
- avoidable AP waste;
- per-decision-window strategy sequence.

AP remaining is not automatically a mistake. Interpretation requires the available legal/relevant actions at End Turn.

## 17.4 Questionnaire role

Telemetry records behaviour. The questionnaire records interpretation and player reasoning.

The final questionnaire should assess:

- control/AP clarity;
- Intent comprehension;
- Fortify and response-window comprehension;
- telegraph comprehension;
- decision rationale;
- perceived agency;
- perceived pacing.

Exact wording, scale, and scoring remain **OPEN pending academic-source review**.

---

# 18. Exploratory Success Criteria

The first test uses five non-team participants. These are working design gates, not statistical proof and not yet journal-derived thresholds.

## 18.1 Technical validity gate

A session is interpretable only if:

- AP and StartGrid behaviour are correct;
- obstacles block movement;
- Fortify, Shield, damage, and expiry are correct;
- Knockback, Stun, Recovery, and Intent timing are correct;
- Wave transition is correct;
- required telemetry is complete.

Core-rule failure makes the session **INCONCLUSIVE**, not a negative design result.

## 18.2 Working design gates

| Dimension | Working criterion |
|---|---|
| Completion | at least 4/5 clear Stage 1 on the first attempt |
| Core interaction | at least 4/5 can explain Fortify and the response window |
| Intent | at least 4/5 understand Sword's next action |
| Transfer | at least 3/5 show a more informed or faster response against Sword 2 |
| Choice variety | at least two distinct approaches appear across the five participants |
| Rationale | at least 4/5 can explain an Attack/Fortify/positioning decision |
| AP/control clarity | at least 4/5 understand movement commitment and AP use |
| Pacing | at least 4/5 finish within approximately seven minutes |
| Agency | at least 4/5 report that their decisions changed the battle outcome |

## 18.3 Result classification

- **SUPPORTED**: core comprehension, directional trade-off, and transfer are observed.
- **PARTIALLY SUPPORTED**: the interaction is understood but pacing, balance, UI, or transfer remains weak.
- **NOT SUPPORTED**: players do not understand or use the intended decision loop.
- **INCONCLUSIVE**: bugs, UI/control failures, or missing data prevent design interpretation.

---

# 19. Risks and Interpretation Warnings

## 19.1 Strategy dominance

If most players choose defence, possible explanations include:

- Fortify is dominant;
- HP carry-over makes safety rational;
- speed has no reward;
- aggression is too costly;
- the encounter or UI over-signals Fortify.

Do not infer the cause from action count alone.

## 19.2 Premature Fortify

Fortify during a non-threatening preparation state remains legal.

Repeated premature Fortify may indicate:

- threat range is unclear;
- the player misunderstands Shield duration;
- the player is experimenting;
- Fortify has been presented as a universal answer.

Questionnaire reasoning is required.

## 19.3 Blocked knockback

Blocked knockback can be deliberate or accidental.

Telemetry should record geometry and the follow-up action. The questionnaire should determine whether the player understood the interaction.

## 19.4 Small sample

Five participants provide exploratory design evidence. Results must not be presented as statistical generalization.

---

# 20. Design-to-Implementation Conflict Register

| Domain | Stable/main baseline | Rejected experiment | v0.4 design target |
|---|---|---|---|
| Battle UI | established full HUD/grid layout | isolated simplified screen | reuse established UI and extend it |
| Controls | keyboard + mouse | mostly click interaction | preserve keyboard + mouse parity |
| StartGrid | implemented foundation | absent | mandatory |
| Movement AP | commitment rule | movement did not cost AP correctly | mandatory preserved rule |
| Obstacles | `O30/O70/OF/LOS` block movement | reported traversable `O30` | non-traversable |
| Fortify | older implemented Skill differs | isolated candidate implementation | 2 AP, Shield 6, self-only, no cooldown |
| Repelled response | absent/older design | experiment based on v0.3 | immediate knockback + Stun + Recovery |
| Sword 2 | not implemented as v0.4 | experiment used earlier data | telegraph/spawn `(10,8)` |
| Telemetry | no accepted v0.4 validation data | local JSON export reportedly worked | minimum event contract + local fallback |

This register is a migration guide, not a current-source claim.

---

# 21. Decision Register

## 21.1 Locked in the active discussion

- use the name Sword Enemy;
- Stage 1 contains Guard and two sequential Sword enemies;
- use the old full-map shape in a new redesign asset;
- preserve existing AP, StartGrid, obstacle, control, and HUD foundation;
- Fortify is self-only, 2 AP, Shield 6, non-stacking, and no-cooldown for the test;
- melee contact against Fortified Guard triggers immediate one-tile knockback;
- blocked knockback leaves Sword in place but Stunned;
- Sword spends exactly one activation on Recovery;
- Sword 2 uses `(10,8)` as the working spawn;
- exact landing telegraph appears during Enemy Transition;
- Sword 2 receives one full preparation turn and activates immediately after landing;
- Stage 1 validation uses telemetry plus player explanation;
- Stage 1 implementation must extend, not replace, the established prototype foundation.

## 21.2 Tentative values frozen for first test

- Guard and Sword stats;
- approximate seven-minute pacing gate;
- five-player exploratory thresholds;
- reward `20` Run Crystal;
- frozen Buff/Shop behaviour after Stage 1.

## 21.3 Open but non-blocking for Stage 1 implementation

- final UI wording and animations;
- final obstacle art representation;
- production Fortify scaling/cooldown;
- academic questionnaire source and exact scale;
- whether speed later receives an explicit reward;
- final canonical document version after migration.

## 21.4 Explicitly outside Stage 1 implementation authority

- resolving Spear no-target/no-valid-Aim-lane behaviour;
- revising Stage 2 layout;
- redesigning Archer;
- implementing Hold/Brace;
- activating Buffs or Shop upgrades;
- changing production economy.

---

# 22. Exact Resume Point

```text
Stage 1 design hypothesis and playtest baseline are specified
→ next: audit the current local Git branch and classify rejected experimental files
→ preserve user documentation and work
→ return to or create a safe implementation branch from the accepted main baseline
→ implement Stage 1 only using the dedicated implementation brief
→ run automated regression, build, and manual Game Designer validation
→ only then prepare five-player testing and questionnaire deployment
```

Do not resume from the v0.3 instruction to implement Stage 1 and Stage 2 together.

---

# 23. Change Log

## v0.4 — 26 September 2026

- recorded later lecturer guidance and team production constraints;
- classified the experimental isolated playtest implementation as rejected/unaccepted;
- narrowed immediate scope to Stage 1;
- standardized the enemy name as Sword Enemy;
- replaced delayed Disengage with immediate Knockback + Stunned + one Recovery activation;
- defined blocked-knockback positional reward;
- rechecked the old map, obstacle collision, and Stage 1 geometry;
- selected Sword 2 spawn `(10,8)` over `(12,8)`;
- revised the reinforcement/telegraph transition;
- documented Stage 1 paper-test predictions;
- specified the primary and supporting design hypotheses;
- defined minimum telemetry, exploratory gates, and interpretation warnings;
- created a new implementation boundary that requires reuse of the established prototype foundation.

## v0.3 — 21 September 2026

Preserved as the detailed Stage 1–2 paper-test and implementation-planning checkpoint. Stage 1 rules listed as superseded in this v0.4 document must no longer be implemented from v0.3.

---

# Final Checkpoint Principle

Stage 1 is ready to be implemented as a design experiment, not declared successful.

```text
clear hypothesis
→ preserved prototype foundation
→ deterministic Stage 1 rules
→ valid telemetry
→ manual verification
→ player test
→ evidence-based revision
```

Implementation success and design success remain separate claims.
