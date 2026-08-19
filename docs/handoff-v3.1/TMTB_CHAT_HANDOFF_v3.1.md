# TMTB Chat Handoff — Handoff v3.1

**Project:** TMTB / BeCan  
**Document Type:** Handoff Snapshot — Chat / Collaboration / Recovery Instructions  
**Handoff Package Version:** 3.1  
**Canonical Game Design Version:** 3.3  
**Implementation Baseline:** Git `cc7690e`  
**Verified Date:** 19 August 2026  
**Status:** **CURRENT RESUME / COLLABORATION HANDOFF**

---

## 1. Recovery Rule

Do not assume memory from another chat/account/device.

Read current sources in this order:

```text
README
→ Maintenance Protocol
→ Project Context
→ Chat Handoff
→ Current State
→ Progress & Backlog
→ canonical Game Design v3.3
→ Architecture / State & Data as task requires
→ supporting Phase 8 validation delta when Tutorial detail matters
```

Before any code change, audit actual relevant source again. Documentation is a recovery accelerator, not a substitute for source audit.

---

## 2. Critical Source-of-Truth Split

Game Design:

```text
latest explicit GD decision
→ Context v3.3
→ Decisions v3.3
→ supporting design handoff
→ historical docs
```

Implementation:

```text
actual source/data
→ confirmed runtime
→ Current State v3.1
→ Architecture / State & Data v3.1
→ historical docs
```

Never say “the prototype implements X” merely because X is canonical design.

---

## 3. Current Resume Point

Final implementation milestone:

```text
cc7690e Align Phase 8 regression tests with final W3 spawn
```

Phase 8 is technically implemented and the Game Designer reported the tested scenario technically safe/no bug. Difficulty was iterated through real runtime evidence.

Documentation refresh is the current checkpoint.

After docs are placed/committed, recommended next evidence step:

```text
fresh full natural Tutorial
Phase 1 → Phase 8 Victory
```

Then ask the Game Designer which broader design frontier to continue. Do not automatically start new enemy/Region 1 content.

---

## 4. Mandatory Tutorial Refresh Order

If discussing Tutorial flow/order again, read:

```text
1. latest explicit decisions
2. Game Design Context v3.3
3. Game Design Decisions v3.3
4. Tutorial Baseline v1.1
5. Phase 8 Validation Update v1
6. implementation docs/source only for implementation truth
```

Important supersessions:

- Phase 6: Spear must die before Structure lesson.
- Phase 7: Charge is an Intent with X/Y progress; payoff becomes next/current Intent after completion.
- Phase 8: old two-Wave-only assumption is superseded for current PVS; W3 two-Sword pressure exists.
- Phase 8: step-by-step tactical guidance is off, but a high-level graduation prompt remains.
- preferred W3 north spawn `(10,0)` is superseded by `(9,1)`.

Do not modify Baseline v1.1 itself; use the newer validation delta for post-baseline changes.

---

## 5. Technical Assistance Style

For implementation work provide:

- exact path;
- block/function to locate;
- exact change type;
- copy-ready code/file where practical;
- expected result;
- ordered automated tests;
- runtime validation path;
- regression tests.

Work in coherent batches when the feature is tightly coupled, but keep scope bounded.

Do not claim Save/Build/Test/Commit/Push succeeded until evidence/user confirmation exists.

---

## 6. Git Workflow

Normal milestone closure:

```text
Save
→ Test
→ inspect git status/diff
→ stage exact files
→ diff --cached --check
→ Commit
→ Push
→ verify HEAD == origin/main
→ verify clean working tree
```

Avoid `git add .` when file scope/noise is uncertain.

On another machine:

```text
Fetch → Pull → Work
```

---

## 7. Current Implementation Facts Worth Recovering Quickly

- Shared AP / StartGrid / Movement Lock model is implemented.
- sequential enemy activation in Spawn Order is implemented.
- Tutorial-only no-DEF damage exists; normal prototype DEF path remains.
- continuous Tutorial map/Phases 1–8 are implemented.
- Phase 6 Structure/Hut, Phase 7 Blue/Stun, Phase 8 Wave are actual source systems.
- `P` Phase Jump 1–8 is PROTOTYPE ONLY.
- current Wave state is `scheduled/telegraphed/spawned/resolved`.
- Phase 8 W3 fallback pairs are authored PVS, not generic Wave design.
- CP8 restores tactical snapshot on final-phase full-party defeat.
- automated Tutorial regression baseline is 132/132 after final test alignment.

---

## 8. Current Design Facts Worth Recovering Quickly

- full game: Village → Town → Castle → settlement/meta;
- Shared AP combat direction remains canon;
- Hold exact effect OPEN;
- Skills OPEN/PLANNED;
- LOS is deferred for future Tactical Space review and not in current Tutorial;
- Cover remains separate from LOS;
- Blue/Orange/Purple are candidate special enemies, not locked Region 1 roster;
- Structures/Objectives are intended design space but many universal Structure rules remain OPEN;
- universal Wave lifecycle remains OPEN even though current Tutorial Safe lifecycle is implemented.

---

## 9. Common Recovery Failure Modes

Do not:

- use handoff-v3.0 as current implementation truth;
- treat root legacy `TMTB_CURRENT_STATE.md` as current;
- copy old Phase 6 free-priority wording;
- assume two Waves are still the final current Tutorial PVS;
- promote exact W3 coordinates to main-game canon;
- rewrite Wave/Pattern/Status architecture just because the prototype now has one candidate implementation;
- use web research to replace project sources unless external research is explicitly requested.
