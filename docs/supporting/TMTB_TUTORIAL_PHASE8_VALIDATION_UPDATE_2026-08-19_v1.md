# TMTB / BeCan — Tutorial Phase 8 Validation Update

**Document Type:** Supporting Tutorial Design / Prototype Validation Delta  
**Date:** 19 August 2026  
**Version:** v1  
**Canonical Reference:** `TMTB_GAME_DESIGN_CONTEXT.md` v3.3 + `TMTB_GAME_DESIGN_DECISIONS_v3.3.md`  
**Pre-Implementation Baseline:** `TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md`  
**Implementation Baseline:** Git `cc7690e` (`9b89340` gameplay implementation + test-only alignment)  
**Status:** **SUPPORTING CURRENT TUTORIAL / PVS DELTA — NON-CANONICAL**

---

## 1. Purpose

This document preserves the decisions and evidence produced **after** Tutorial Baseline v1.1. It exists because v1.1 is a pre-implementation checkpoint and must remain unchanged as a historical/supporting design baseline.

Authority:

```text
Latest explicit Game Designer decision
→ canonical v3.3
→ this validation delta for detailed Phase 6–8/PVS information
→ Tutorial Baseline v1.1
→ older supporting/historical sources
```

Prototype implementation truth still follows actual source/data, confirmed runtime, then implementation handoff.

---

## 2. Phase 6 Delta

### SUPERSEDED baseline detail

The earlier Phase 6 paper direction allowed a first Structure interaction while Spear was still alive and then allowed free Structure-vs-Spear priority.

### Current explicit decision

```text
Spear pressure
→ defensive Cover evidence
→ mandatory Guard attack evidence
→ Spear retreats / covered attack evidence
→ finish Spear
→ Spear must be dead
→ Structure / Destroy Hut lesson begins
→ destroy Hut
→ proceed to Region C
```

The requirement that Spear dies before Structure teaching is **Tutorial choreography**, not a universal combat rule.

Current Tutorial Spear PVS uses encounter ATK override `5`; base Spear definition remains ATK `6` outside that authored Tutorial override.

---

## 3. Phase 7 Delta

The Phase 7 mechanic remained unchanged after implementation, but teaching language was revised after runtime review.

Current mental model:

```text
CHARGE is an enemy Intent.
X/Y is Charge progress.
A Charge activation advances preparation; it does not resolve its payoff immediately.
When Charge progress completes, the prepared action becomes the next/current Intent.
```

Current Blue Tutorial PVS:

```text
Blue HP 33 before required Archer hit
→ HP 26 at normal Phase 8 entry
Charge goal 2
Shockwave radius 2
Shockwave damage 0
Stun duration 2 Player Turns
```

Blue remains a **TENTATIVE SPECIAL ENEMY CANDIDATE / Tutorial validation vehicle** rather than a locked Region 1 roster member.

Phase 7 runtime teaching clarity was confirmed sufficient after the wording revision.

---

## 4. Phase 8 Initial PVS

Initial implemented graduation used:

```text
W1 = 1 Sword, guided Telegraph exposure
W2 = 1 Spear, unassisted/free-play release
Safe lifecycle for both:
Telegraph → Player preparation → existing enemies act → spawn at Enemy Turn end → no attached offense → Player response turn
```

Current W1:

```text
Sword HP16 / ATK6 / Move3 / ATR1.5
spawn (12,5)
```

Current W2:

```text
Spear HP15 / ATK5 / Move4 / ATR3
spawn (15,2)
```

W2 ATK5 deliberately matches the Tutorial Spear pressure used in Phase 6. This does not modify the base Spear definition.

---

## 5. Runtime Finding — Archer AP Funnel

### Predicted

Blue + Sword + Spear was expected to create sufficient combined temporal/melee/ranged pressure.

### Observed

The Game Designer found the ending technically correct but too easy. Archer could funnel Shared AP and clear the incoming enemies before they produced meaningful pressure, while Guard could remain largely irrelevant.

### Perceived

The graduation did not sufficiently test composition of previously learned systems. Wave Telegraph risked becoming a free-target announcement rather than meaningful incoming pressure.

This runtime evidence superseded the earlier paper assumption that exactly two one-enemy Waves / maximum-three-hostile pressure was sufficient for the current Tutorial PVS.

---

## 6. Current Phase 8 PVS After Validation

Current sequence:

```text
W1
1 Sword
GUIDED WAVE EXPOSURE

→

W2
1 Spear
FREE-PLAY RELEASE
persistent high-level prompt:
"Anticipate incoming enemies and eliminate all threats."
Objective:
ELIMINATE ALL REMAINING THREATS

→

when W2 Spear has spawned
W3 Telegraph appears
2 Swords simultaneously incoming

→ one preparation Player Turn

→ W3 two Swords spawn at Enemy Turn end
no attached Move/Attack

→ normal free play until Victory
```

Step-by-step tactical Tutorial guidance is off in free play. The persistent text is high-level graduation framing, not a tactical solution.

---

## 7. W3 Geometry and Fallback PVS

Preferred pair:

```text
Sword A = (9,1)
Sword B = (14,5)
```

The earlier preferred north position `(10,0)` was changed after the Game Designer observed that Archer at `(12,2)` could remain inside ATR3 and continue the dominant spawn-camp funnel.

Current authored deterministic fallback pair order:

```text
1. (9,1)  + (14,5)
2. (9,1)  + (15,4)
3. (14,0) + (9,4)
4. (15,1) + (10,5)
```

Runtime chooses the first pair whose two positions are available **before Telegraph**. Once telegraphed, the pair is fixed.

Status:

- exact pair geometry: **TENTATIVE TUTORIAL PVS**;
- fallback-pair algorithm: **PROTOTYPE ONLY authored robustness rule**;
- not a universal production Wave spawn algorithm.

---

## 8. Wave Reservation and Lifecycle Boundary

Current prototype implements systemic reservation semantics:

```text
reserved spawn position
→ traversable
→ invalid final occupied position for Player or Enemy
```

Current Tutorial PVS lifecycle:

```text
Telegraph during Player Turn
→ one Player preparation window
→ existing enemies resolve sequentially
→ telegraphed Wave enemy/enemies spawn at end of Enemy Turn
→ spawned enemies receive no attached Move/Attack
→ new Player Turn response
→ first normal activation on a later Enemy Turn
```

This **Safe lifecycle remains TENTATIVE as a Tutorial PVS**. Its existence in prototype source does not close the universal main-game Wave spawn-to-first-activation design question.

---

## 9. Casualty / Victory Current Behaviour

After Phase 7 curriculum completion:

```text
single Player casualty
→ valid play
→ next Player Turn Team AP recalculates from living units
→ one survivor = 2 Team AP
```

A short system feedback explains the first single casualty/AP consequence.

Full-party defeat in Phase 8 restores CP8 when available.

Tutorial Victory requires:

```text
all required Waves RESOLVED
AND
no living hostile remains
```

An empty board while a required Wave is still scheduled/telegraphed/spawned-but-unresolved does **not** produce Tutorial Victory.

---

## 10. Implementation / Verification Evidence

Gameplay milestone:

```text
9b89340 Complete Tutorial Phase 8 wave graduation
```

Test-only alignment:

```text
cc7690e Align Phase 8 regression tests with final W3 spawn
```

Final implementation baseline for documentation:

```text
cc7690e0f19f4c50f2f77ff42b1e825c4e7be2d9
```

Regression suite after applying the final two test-expectation changes:

```text
Tutorial no-DEF   4 / 4
Phase 6          37 / 37
Phase Jump       27 / 27
Phase 7          34 / 34
Phase 8          30 / 30
------------------------
TOTAL           132 / 132 PASS
```

The documentation audit environment did not independently run `vite build` because the supplied ZIP did not include `node_modules`. This is an environment limitation, not evidence of a build failure.

Runtime evidence from the Game Designer:

- Phase 8 technical flow behaved according to scenario; no technical bug was reported during the validation pass.
- difficulty/pressure was iterated through real playtest observations, producing W3 and the `(9,1)` preferred north spawn revision.

---

## 11. Status Summary

| Item | Current Status |
|---|---|
| Phase 8 = Wave / Combined Pressure / Graduation | CURRENT AUTHORED TUTORIAL DIRECTION |
| W1 guided Wave exposure | CURRENT |
| W2 free-play release | CURRENT |
| persistent high-level free-play prompt | CURRENT TUTORIAL PRESENTATION |
| W3 two Sword pressure | TENTATIVE TUTORIAL PVS, runtime-driven |
| preferred W3 `(9,1)+(14,5)` | TENTATIVE TUTORIAL PVS |
| authored fallback pair order | PROTOTYPE ONLY / TENTATIVE |
| Safe Wave lifecycle | TENTATIVE TUTORIAL PVS |
| reserved tile traversable / no final occupancy | CURRENT systemic prototype rule; broader design direction carried |
| pending required Wave blocks Tutorial Victory | CURRENT Tutorial contract |
| single casualty allowed after P7 | CURRENT Tutorial policy |
| Blue as Region 1 roster member | NOT LOCKED / remains TENTATIVE candidate |

---

## 12. Remaining Validation Watches

Do not silently retune from paper assumptions. Future playtest should continue to observe:

- whether Archer AP funnel remains a dominant option;
- whether W3 split geometry creates meaningful Movement / Movement Lock decisions;
- Guard tactical relevance during graduation;
- Region B retreat / pressure serialization;
- spawn camping around known Telegraph positions;
- Safe lifecycle generosity;
- one-survivor fairness;
- final encounter pacing and perceived pressure.

Use:

```text
Predicted → Observed → Perceived
```

before changing numbers or lifecycle.
