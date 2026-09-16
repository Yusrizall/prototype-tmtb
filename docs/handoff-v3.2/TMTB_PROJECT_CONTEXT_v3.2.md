# TMTB Project Context, Handoff v3.2

**Project:** TMTB / BeCan  
**Context Owner:** Game Designer  
**Handoff Package Version:** 3.2  
**Canonical Game Design Version:** 3.4  
**Verified Date:** 6 September 2026  
**Status:** **CURRENT PROJECT-LEVEL CONTEXT**

---

## 1. Project Identity

```text
TMTB / BeCan
= 3D Turn-Based Tactics
+ semi/light roguelite run progression
+ permanent meta progression
```

Production target is Unity. The current repository is a Vite and Vanilla JavaScript 2D/simulative prototype.

## 2. Prototype Purpose

The prototype is both:

```text
Game Designer Validation Tool
+ Unity Functional Flow Reference
```

It exists to produce evidence for design decisions and preserve functional flow. It is not an automatic representation of final Unity visuals, controls, architecture, spatial movement, or balancing.

Main-game movement is continuous/free 3D movement with tactical-grid resolution. Prototype movement may use direct grid/BFS logic.

## 3. Mandatory Separation

Always distinguish:

```text
MAIN GAME DESIGN
PROTOTYPE VALIDATION SCOPE
TECHNICAL IMPLEMENTATION
```

Full-run canon remains:

```text
Village → Town → Castle → Final Resolution → Run Settlement → Meta Progression
```

Region 1 ending a prototype run is a DEVELOPMENT EXCEPTION.

## 4. Roles

The user is the primary Game Designer. Technical assistance supports consistency analysis, trade-offs, edge cases, prototype implementation, testing, repository audit, and documentation. It does not silently make or promote design decisions.

## 5. Source of Truth

Game Design intent:

```text
latest explicit Game Designer decision
→ Game Design Context v3.4
→ Game Design Decisions v3.4
→ relevant supporting handoff
→ historical material
```

Prototype implementation truth:

```text
actual source/data
→ confirmed runtime testing
→ Current State v3.2
→ Architecture and State/Data v3.2
→ historical implementation docs
```

Design and implementation may differ. State the gap rather than silently merging them.

## 6. Status Vocabulary

Design:

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

Implementation:

```text
IMPLEMENTED
TESTED
CONFIRMED
UNVERIFIED
NOT IMPLEMENTED
KNOWN STALE COPY
UNCOMMITTED WORK
HISTORICAL
```

## 7. Current Validated Scope

The current prototype validates:

1. Shared Team AP, StartGrid, Movement Lock, and sequential enemy activation;
2. continuous Tutorial Phase 1 through 8;
3. Spear/Cover/Structure, Blue/Stun, and Wave Telegraph graduation;
4. Battle Result and Buff Selection;
5. Run Settlement Failed/Complete;
6. permanent Shop for Max HP, ATK, and first additional Skills;
7. Fortify, Intercept, Pinning Shot, and Volley;
8. global no-DEF combat and save migration.

All 185 tests pass, production build passes, and the Game Designer confirmed runtime behavior.

## 8. Validation Philosophy

Use:

```text
intended decision
→ pressure
→ behaviour/system
→ numbers
```

For balancing:

```text
Predicted → Observed → Perceived
```

Working values are hypotheses. Prototype success does not make exact values production-final.

## 9. Technical Collaboration Workflow

```text
understand target
→ audit actual state
→ identify exact files
→ make one coherent scoped change
→ automated test
→ runtime test
→ compare expected and actual
→ Game Designer confirmation
→ Save, Commit, Push
```

Avoid broad speculative refactors and never claim commit/push without evidence.

## 10. Current Project Checkpoint

Game Design v3.4 and Handoff Package v3.2 close the End Screen, Buff Selection, Run Settlement, Shop, four-Skill, and no-DEF migration. The code was runtime-confirmed but remained uncommitted when this package was authored.

Immediate operational resume point is Git closure. After that, the Game Designer explicitly selects the next design/validation domain.
