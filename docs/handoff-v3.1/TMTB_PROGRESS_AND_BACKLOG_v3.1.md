# TMTB Progress & Backlog — Handoff v3.1

**Project:** TMTB / BeCan Prototype  
**Document Type:** Handoff Snapshot — Progress / Backlog  
**Handoff Package Version:** 3.1  
**Game Design Reference:** v3.3  
**Implementation Baseline:** Git `cc7690e`  
**Last Updated:** 19 August 2026  
**Status:** **CURRENT CHECKPOINT / NEXT-WORK SNAPSHOT**

---

## 1. Current Milestone

```text
Tutorial Phase 8 Wave Graduation
→ implemented
→ runtime-playtested by Game Designer
→ pressure revised from observed Archer AP funnel
→ committed/pushed
→ regression expectations aligned
→ documentation refresh in progress
```

Final Git baseline:

```text
cc7690e Align Phase 8 regression tests with final W3 spawn
```

---

## 2. DONE — Combat Migration / Tutorial

### Shared AP and action commitment

- Shared Team AP migration;
- StartGrid / Movement AP commitment/refund;
- Attack Movement Lock;
- repeated Attack under Shared AP;
- global End Turn.

### Enemy behaviour/readability

- sequential enemy resolution;
- Spawn Order baseline;
- Current Target / Current Intent readability;
- Sword real melee role;
- Spear ranged spacing scorer.

### Continuous Tutorial

- revised Phase 5 core;
- continuous Stage / progressive battlefield;
- camera viewport support;
- revised Phase 6 Spear + defensive Cover + Structure Objective;
- Phase Jump validation tool through Phase 8;
- Tutorial-only no-DEF alignment;
- Phase 7 Blue Charge/Shockwave/Stun;
- Phase 7 regression coverage;
- Phase 8 systemic Wave/reservation/graduation;
- W3 two-Sword pressure revision and final `(9,1)` preferred north spawn.

### Verification

- Phase 8 technical scenario reported bug-free by Game Designer during validation;
- automated Tutorial suite: **132/132 PASS** after final test expectation alignment.

---

## 3. DONE — Documentation Recovery/Migration

- Game Design v3.2 Tutorial migration source recovered;
- post-v3.2 Phase 6–8 decisions audited;
- Handoff v3.1 documentation package authored;
- active canon advanced to v3.3 to remove stale Phase 6/Phase 8 wording rather than silently carrying conflicts.

Final repository placement/Git commit for the documentation package remains a separate user-side step after reviewing/copying these files.

---

## 4. NEXT — Full Natural Tutorial Regression

After documentation placement, the strongest next verification is:

```text
fresh Tutorial start
→ natural Phase 1
→ ...
→ natural Phase 8 Victory
```

Purpose:

- verify the entire continuous-stage chain after all late migrations;
- verify no hidden state drift exists between deterministic Phase Jump tests and the full natural route;
- observe final W3 pressure in a complete-run context;
- record final Predicted → Observed → Perceived notes for graduation difficulty.

This should be treated as a validation checkpoint, not an excuse to retune automatically.

---

## 5. NEXT DESIGN DECISION AFTER FULL TUTORIAL VALIDATION

The next broad design domain is **not automatically chosen by implementation**.

Likely candidates include:

- Region 1 encounter/composition authoring under the migrated combat model;
- special-enemy candidate validation / roster decisions;
- broader Objective/Structure design;
- run-onboarding integration;
- future Tactical Space / LOS review when it becomes relevant.

The Game Designer should choose the next decision frontier explicitly after the final Tutorial checkpoint.

---

## 6. PLANNED / OPEN — Main Game Design

Carried important open/deferred areas include:

- exact Hold effect;
- Skills;
- final main-game LOS role (deferred future review);
- exact Structure targetability/durability/destruction/walkability rules;
- enemy-vs-Structure target/Objective rules;
- universal Wave spawn-to-first-activation lifecycle;
- Wave Telegraph information density;
- which Orange/Purple/Blue candidates enter production/Region 1 roster;
- final Region 1 compositions;
- Town/Castle internal structure;
- final production Tutorial Phase count.

Do not promote current Tutorial PVS values into answers for these OPEN/TENTATIVE questions.

---

## 7. VALIDATION WATCHES — Phase 8

Current design watches from runtime iteration:

```text
Archer Shared-AP funnel
spawn camping around Telegraph positions
Guard relevance
W3 split-pressure effectiveness
Region B retreat / serialization
Safe Wave lifecycle generosity
single-survivor fairness
final graduation duration / pressure
```

Use real playtest evidence before retuning.

---

## 8. TECHNICAL DEBT / WATCHES

Not immediate refactor tasks:

- `main.js` integration weight;
- large `tutorialFlow.js` legacy core;
- generic Status timing may need future source-specific semantics;
- Wave engine is intentionally minimal rather than production-generic;
- Tutorial debug/UI may expose DEF despite no-DEF Tutorial damage;
- legacy run/profile paths have less current regression coverage than Tutorial.

Only promote these to active work when they obstruct the next validation target.

---

## 9. SUPERSEDED / HISTORICAL

Do not resume these as current rules:

- old per-unit Exhausted Player Turn model;
- all enemies move then all enemies attack baseline;
- old seven-Phase Tutorial map;
- LOS lesson in current Tutorial;
- Phase 6 free Hut/Spear priority after first Hut interaction;
- exactly two one-enemy Waves as sufficient current Phase 8 pressure;
- full disappearance of all Tutorial text during Phase 8 free play;
- preferred W3 north spawn `(10,0)`.

Historical docs may still contain those statements and must be read with date/version/status awareness.
