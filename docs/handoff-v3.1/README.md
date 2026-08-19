# TMTB / BeCan — Handoff Package v3.1

**Project:** TMTB / BeCan  
**Document Type:** Active Handoff Package Entry Point  
**Handoff Package Version:** 3.1  
**Canonical Game Design Version:** 3.3  
**Prototype Implementation Baseline:** **Tutorial Phase 8 Wave Graduation + final W3 regression alignment**  
**Authoritative Git Baseline:** `cc7690e0f19f4c50f2f77ff42b1e825c4e7be2d9`  
**Verified Date:** 19 August 2026  
**Project Root:** `C:\Datas\prototype-tmtb`  
**Package Status:** **AUTHORED AFTER REPOSITORY/RUNTIME/TEST AUDIT — READY FOR LOCAL REVIEW/PLACEMENT**

---

## 1. Start Here

TMTB is a Unity-targeted 3D Turn-Based Tactics game with semi/light roguelite run progression and permanent meta progression.

The current web prototype is a 2D/simulative:

```text
Game Designer Validation Tool
+
Unity Functional Flow Reference
```

The most important recovery rule:

```text
GAME DESIGN INTENT
≠
PROTOTYPE IMPLEMENTATION TRUTH
```

---

## 2. Current Versions

```text
Canonical Game Design:   v3.3
Handoff Package:         v3.1
Prototype Git Baseline:  cc7690e
```

These version numbers intentionally mean different things.

---

## 3. Current Implementation Checkpoint

Tutorial migration has reached Phase 8 Wave Graduation.

Current final Tutorial PVS includes:

- continuous Phase 1–8 Stage;
- Shared AP combat migration;
- sequential enemy activation / readable Intent;
- Spear + defensive Cover + Structure Objective;
- Blue Charge/Shockwave/Stun;
- W1 Sword, W2 Spear, W3 two-Sword Wave graduation;
- Wave reservations;
- persistent high-level free-play prompt;
- pending-Wave-aware Tutorial Victory;
- CP8 retry;
- Phase Jump through 8.

Automated Tutorial regression after final W3 test alignment:

```text
132 / 132 PASS
```

The supplied repository ZIP excluded `node_modules`, so the documentation audit did not independently certify Vite build output.

---

## 4. Read Order

For a new chat/session:

```text
1. README.md
2. ../TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
3. TMTB_PROJECT_CONTEXT_v3.1.md
4. TMTB_CHAT_HANDOFF_v3.1.md
5. TMTB_CURRENT_STATE_v3.1.md
6. TMTB_PROGRESS_AND_BACKLOG_v3.1.md
7. ../TMTB_GAME_DESIGN_CONTEXT.md
8. ../TMTB_GAME_DESIGN_DECISIONS_v3.3.md
9. TMTB_PROTOTYPE_ARCHITECTURE_v3.1.md        when technical structure matters
10. TMTB_STATE_AND_DATA_MODEL_v3.1.md         when state/data matters
```

When detailed Tutorial Phase 6–8/PVS provenance matters, also read:

```text
../supporting/TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md
../supporting/TMTB_TUTORIAL_PHASE8_VALIDATION_UPDATE_2026-08-19_v1.md
```

The 19 August validation update is newer for conflicting post-baseline details.

---

## 5. Canonical / Supporting / Historical

### Canonical active

```text
docs/TMTB_GAME_DESIGN_CONTEXT.md              v3.3
docs/TMTB_GAME_DESIGN_DECISIONS_v3.3.md       v3.3
```

### Evergreen governance

```text
docs/TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
```

### Current implementation handoff

```text
docs/handoff-v3.1/*
```

### Supporting

```text
docs/supporting/TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md
docs/supporting/TMTB_TUTORIAL_PHASE8_VALIDATION_UPDATE_2026-08-19_v1.md
docs/supporting/TMTB_CANONICAL_MIGRATION_MATRIX_2026-08-16_v1.md
docs/supporting/TMTB_DOCUMENTATION_REFRESH_AUDIT_2026-08-19_v1.md
```

### Historical

- `docs/handoff-v3.0/` remains historical and should not be overwritten;
- `docs/handoff-v2.5/` remains historical;
- Game Design v3.1 remains historical;
- the package preserves v3.2 design snapshots under `docs/historical/game-design/`;
- legacy root `TMTB_CURRENT_STATE.md` / `TMTB_PROJECT_CONTEXT_v1.0.md` are historical, not current authority.

---

## 6. Why Game Design Advanced to v3.3

v3.2 contained two Tutorial statements superseded by later explicit decisions/runtime work:

- Phase 6 now requires Spear defeat before Structure teaching;
- Phase 8 removes step-by-step tactical guidance but retains a high-level graduation prompt.

Phase 7 Charge teaching language was also clarified.

Exact W3 roster/positions/lifecycle remain supporting PVS detail rather than canonical production rules.

---

## 7. Current Resume Point

```text
Phase 8 implementation closed
→ Git clean/synchronized at cc7690e
→ documentation package v3.1 prepared
```

After local documentation placement and Git closure, recommended next verification:

```text
full natural Tutorial Phase 1 → 8 run
```

Then the Game Designer chooses the next broader design/validation domain.

Do not automatically continue into a speculative refactor or new Region 1 content before that decision.
