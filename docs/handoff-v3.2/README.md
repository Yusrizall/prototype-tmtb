# TMTB / BeCan, Handoff Package v3.2

**Project:** TMTB / BeCan  
**Document Type:** Active Handoff Package Entry Point  
**Handoff Package Version:** 3.2  
**Canonical Game Design Version:** 3.4  
**Prototype Baseline:** Battle Result, Buff Selection, Run Settlement, Shop, Four Skills, and Global no-DEF Migration  
**Source Base:** Git `54d839f` plus runtime-confirmed uncommitted checkpoint changes  
**Verified Date:** 6 September 2026  
**Status:** **READY FOR REPOSITORY PLACEMENT, FINAL GIT CLOSURE PENDING**

---

## 1. Start Here

TMTB is a Unity-targeted 3D Turn-Based Tactics game with semi/light roguelite run progression and permanent meta progression.

The web prototype is:

```text
Game Designer Validation Tool
+ Unity Functional Flow Reference
```

Mandatory distinction:

```text
GAME DESIGN INTENT
≠
PROTOTYPE IMPLEMENTATION TRUTH
```

## 2. Current Versions

```text
Canonical Game Design: v3.4
Handoff Package:       v3.2
Last committed base:   54d839f
Latest checkpoint:     runtime-confirmed, Git closure pending
```

The version numbers intentionally represent different domains.

## 3. Current Implementation Checkpoint

Implemented and Game Designer-confirmed:

1. Shared AP combat and continuous Tutorial Phase 1 through 8;
2. animated Battle Result;
3. two-card Buff Selection and Active Buff List;
4. Run Failed/Run Complete Settlement;
5. Region Overview-only permanent Shop;
6. Max HP/ATK progression and Skill ownership;
7. Fortify, Intercept, Pinning Shot, and Volley;
8. global DEF removal and save migration.

Verification:

```text
185/185 tests PASS
npm run build PASS
runtime validation PASS
```

## 4. Active Package Files

Canonical and governance:

```text
docs/TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
docs/TMTB_GAME_DESIGN_CONTEXT.md
docs/TMTB_GAME_DESIGN_DECISIONS_v3.4.md
```

Implementation handoff:

```text
docs/handoff-v3.2/README.md
docs/handoff-v3.2/TMTB_PROJECT_CONTEXT_v3.2.md
docs/handoff-v3.2/TMTB_CURRENT_STATE_v3.2.md
docs/handoff-v3.2/TMTB_PROTOTYPE_ARCHITECTURE_v3.2.md
docs/handoff-v3.2/TMTB_STATE_AND_DATA_MODEL_v3.2.md
docs/handoff-v3.2/TMTB_PROGRESS_AND_BACKLOG_v3.2.md
docs/handoff-v3.2/TMTB_CHAT_HANDOFF_v3.2.md
```

## 5. Read Order

```text
1. README.md
2. ../TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
3. TMTB_PROJECT_CONTEXT_v3.2.md
4. ../TMTB_GAME_DESIGN_CONTEXT.md
5. ../TMTB_GAME_DESIGN_DECISIONS_v3.4.md
6. TMTB_CURRENT_STATE_v3.2.md
7. TMTB_PROTOTYPE_ARCHITECTURE_v3.2.md
8. TMTB_STATE_AND_DATA_MODEL_v3.2.md
9. TMTB_PROGRESS_AND_BACKLOG_v3.2.md
10. TMTB_CHAT_HANDOFF_v3.2.md
```

## 6. Authority Classes

Current canonical design:

```text
TMTB_GAME_DESIGN_CONTEXT.md v3.4
TMTB_GAME_DESIGN_DECISIONS_v3.4.md
```

Evergreen governance:

```text
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
```

Current implementation handoff:

```text
handoff-v3.2/*
```

Handoff v3.1, v3.0, v2.5, Game Design v3.3/v3.2/v3.1, and legacy root documents become historical after v3.2 is committed. Preserve them and do not overwrite historical folders.

Supporting handoffs remain supporting evidence, including Tutorial baseline/update, Buff Selection checkpoint, Run Settlement checkpoint, Shop/Skills checkpoint, and UI/UX Designer handoff.

## 7. Major v3.4 Design Migration

1. DEF is removed globally.
2. current damage uses ATK and Cover without DEF subtraction.
3. Shop is an abstract 2D UI accessed only from Region Overview.
4. permanent progression currently uses Max HP, ATK, and additional Skill unlocks.
5. Movement, ATR, and Team AP are excluded from the permanent Shop.
6. core Skills are available without grind; additional Skills are permanent Shop unlocks.
7. Skill enhancement is intended through temporary Run Buffs.
8. Battle Result, Buff Selection, and Run Settlement have distinct functions and flows.
9. all collected Run Crystal converts on defeat and completion.
10. unchanged OPEN, TENTATIVE, PLANNED, DEFERRED, and HOLD decisions are preserved.

## 8. Current Resume Point

```text
copy this package to docs
→ preserve historical folders
→ inspect diff
→ run tests/build
→ commit
→ push
→ verify synchronized clean main
```

After Git closure, the Game Designer chooses the next broader design and validation domain explicitly.

Known small gap to resolve deliberately: canonical Tutorial `START ADVENTURE` targets Map Selection, while current runtime routes to Region Overview.
