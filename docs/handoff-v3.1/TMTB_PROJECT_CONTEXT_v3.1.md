# TMTB Project Context — Handoff v3.1

**Project:** TMTB / BeCan  
**Context Owner:** Game Designer  
**Document Type:** Handoff Snapshot — Project Context  
**Handoff Package Version:** 3.1  
**Canonical Game Design Version:** 3.3  
**Implementation Baseline:** Git `cc7690e`  
**Verified Date:** 19 August 2026  
**Status:** **CURRENT PROJECT-LEVEL CONTEXT**

---

## 1. Project Identity

TMTB / BeCan is intended as:

```text
3D Turn-Based Tactics
+
semi/light roguelite run progression
+
permanent meta progression
```

Target production environment: **Unity**.

The current repository is a Vite + Vanilla JavaScript 2D/simulative prototype.

---

## 2. Prototype Purpose

The prototype has two roles:

```text
Game Designer Validation Tool
+
Unity Functional Flow Reference
```

It exists to produce usable design evidence and preserve important intended onboarding/flow. It is not a promise that every web interaction is the final Unity mechanic.

Examples:

- main game movement is continuous/free 3D movement with tactical-grid resolution;
- web prototype may use direct grid/BFS movement;
- final Unity camera/control feel is not validated by this web prototype;
- combat rules under validation must be systemic rather than fake Tutorial copy.

---

## 3. Main Game vs Prototype vs Implementation

Always separate:

```text
MAIN GAME DESIGN
PROTOTYPE VALIDATION SCOPE
TECHNICAL IMPLEMENTATION
```

A working PVS coordinate, stat override, Wave composition, debug tool, or simplified movement rule does not automatically become main-game canon.

Current full-run canon remains:

```text
Village → Town → Castle → Final Resolution → Settlement → Meta Progression
```

Prototype Region 1 settlement remains a DEVELOPMENT EXCEPTION.

---

## 4. Roles

The user is the primary Game Designer.

The assistant/programming support should help with:

- consistency checks;
- trade-off/edge-case analysis;
- prototype validation design;
- incremental technical implementation;
- source/runtime audit;
- documentation/handoff accuracy.

The assistant does not silently make Game Design decisions.

---

## 5. Source of Truth

Game Design intent:

```text
1. Latest explicit Game Designer decision
2. latest TMTB_GAME_DESIGN_CONTEXT
3. latest TMTB_GAME_DESIGN_DECISIONS
4. latest relevant supporting design handoff
5. historical/legacy docs
```

Prototype implementation truth:

```text
1. actual source/data
2. confirmed runtime testing
3. latest Current State
4. Architecture / State & Data handoff
5. historical implementation docs
```

If design says A and prototype does B, state the gap. Do not silently choose one.

---

## 6. Status Vocabulary

Use explicitly where needed:

```text
LOCKED
PLANNED
TENTATIVE
OPEN
DEFERRED
SUPERSEDED
PROTOTYPE ONLY
DEVELOPMENT EXCEPTION
HISTORICAL DESIGN SEED
```

Implementation evidence should separately distinguish implemented/tested/runtime-confirmed/unverified.

---

## 7. Technical Collaboration Model

User is a Game Designer, not the primary programmer.

Technical workflow:

```text
understand target
→ audit actual state
→ identify exact files
→ one coherent scoped change
→ apply
→ automated test
→ runtime test
→ compare expected vs actual
→ user confirmation
→ Git Save/Test/Commit/Push
```

For errors:

```text
actual error + relevant files
→ isolate smallest cause
→ fix one cause
→ retest
```

Avoid speculative broad refactors.

---

## 8. Design Validation Model

Use:

```text
Intended decision
→ pressure
→ behaviour/system
→ numbers
```

For balancing/playtest:

```text
Predicted
→ Observed
→ Perceived
```

The Phase 8 W3 revision is a current example: paper prediction said two Waves were enough; runtime showed Archer AP funnel made graduation too easy; PVS pressure/geometry was revised rather than inventing unrelated complexity.

---

## 9. Current Project Checkpoint

Tutorial Phases 1–8 are implemented in the web prototype through Wave graduation.

Current documentation package is v3.1 and active canon is v3.3.

Current implementation baseline:

```text
cc7690e
```

Next immediate validation after documentation placement should be a full natural Tutorial 1→8 run, then the Game Designer chooses the next design frontier.
