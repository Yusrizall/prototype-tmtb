# TMTB Chat Handoff, Handoff v3.2

**Project:** TMTB / BeCan  
**Handoff Package Version:** 3.2  
**Canonical Game Design Version:** 3.4  
**Verified Date:** 6 September 2026  
**Status:** **CURRENT RECOVERY AND COLLABORATION HANDOFF**

---

## 1. Recovery Rule

Do not assume memory from another chat, account, or device. Read the active package and then audit actual relevant source before coding.

Recommended order:

```text
README
→ Maintenance Protocol
→ Project Context
→ Game Design Context v3.4
→ Game Design Decisions v3.4
→ Current State
→ Architecture
→ State and Data
→ Progress and Backlog
→ this Chat Handoff
```

Supporting handoffs are read when domain detail or provenance is needed.

## 2. Source-of-Truth Split

Game Design:

```text
latest explicit Game Designer decision
→ Context v3.4
→ Decisions v3.4
→ relevant supporting handoff
→ historical material
```

Implementation:

```text
actual source/data
→ confirmed runtime
→ Current State v3.2
→ Architecture and State/Data v3.2
→ historical implementation docs
```

Never infer implementation merely because a design rule is canonical. Never downgrade current design merely because an old implementation differs.

## 3. Current Resume Point

The prototype has implemented and runtime-confirmed:

1. Shared AP combat and continuous Tutorial Phase 1 through 8;
2. Battle Result and Buff Selection;
3. Run Settlement Failed and Complete;
4. Region Overview permanent Shop;
5. Max HP and ATK upgrade progression;
6. global DEF removal and profile migration;
7. Fortify, Intercept, Pinning Shot, and Volley.

Evidence is 185/185 automated tests, successful production build, and Game Designer browser validation.

At package authoring time these latest changes were not yet committed. Resume with Git inspection and closure. After push, ask the Game Designer which design frontier to continue.

## 4. Important Current Design Facts

1. Full run is Village, Town, Castle, Final Resolution, Settlement, Meta Progression.
2. Region 1 settlement is a development exception.
3. DEF is removed globally.
4. Cover remains separate and active.
5. permanent Shop is an abstract 2D UI accessed only from Region Overview.
6. Settlement returns to Main Menu and never opens Shop directly.
7. all collected Run Crystal converts on defeat and completion.
8. Max HP, ATK, and additional Skill unlocks are current permanent progression.
9. Movement, ATR, and Team AP are excluded from current permanent Shop upgrades.
10. core Skill is available without grind; additional Skills may be permanently purchased.
11. Skill enhancement is intended through temporary Run Buffs, not permanent Skill levels.
12. Hold, future LOS review, many Structure rules, universal Wave lifecycle, and future roster content remain open or deferred.

## 5. Important Current Implementation Facts

1. profile payload is version 2 under storage key `tmtb_profile_v1`.
2. legacy DEF upgrade state is discarded without refund.
3. Guard and Archer are available from the start only for prototype validation.
4. Support and Trickster are visible and locked.
5. Shop purchases are immediate, atomic, finite, and non-refundable.
6. four current Skills use Shared AP, Movement Lock, cooldown 2, and explicit target validation.
7. Skills are enabled in normal battles and Tutorial Phase 8, not earlier guided phases.
8. Normal defeat skips Battle Result and enters Run Settlement Failed.
9. Stage 4 victory passes through Battle Result and Buff Selection before Run Complete Settlement.
10. Tutorial completion currently routes to Region Overview without Crystal/Buff/Settlement. Canonical UI flow targets Map Selection, so this is an explicit routing gap requiring a later decision/fix.

## 6. Prototype Numbers Are Not Production Locks

Current values include:

```text
Max HP +2, costs 30/60/100/150
ATK +1, costs 40/80/130/190
four levels
Intercept/Volley unlock cost 150
Fortify Shield 4
Volley 60% ATK
Skill cooldown 2
```

Treat these as prototype/tentative balancing baselines. Do not promote them without explicit Game Designer confirmation.

## 7. Technical Assistance Style

For technical changes:

```text
understand target
→ audit actual relevant files
→ isolate one coherent change
→ state exact paths and expected behavior
→ implement
→ automated test
→ runtime checklist
→ Game Designer confirmation
→ Git closure
```

When debugging, use the actual error and latest relevant changes. Fix the smallest cause first. Avoid speculative broad refactors.

## 8. Git Closure Workflow

```text
git status
git diff --check
npm test
npm run build
stage exact intended files
git diff --cached --check
git diff --cached --stat
commit
push
verify HEAD and origin/main
verify clean working tree
```

Do not claim commit or push until user output confirms it.

## 9. Common Failure Modes

Do not:

1. use Handoff v3.1 as current implementation truth;
2. treat Game Design v3.1 or v3.3 as current canon after v3.4 placement;
3. reintroduce DEF through units, Structures, Buffs, or Shop;
4. treat current Skill numbers as final production balance;
5. make Shop available from Main Menu, Settlement, or an active run;
6. create a Global Shop page without valid inventory;
7. treat Archer's prototype availability as the final unlock rule;
8. treat Tutorial W3 composition/fallbacks as universal Wave design;
9. invent final LOS, Hold, Status, Structure, or Support/Trickster rules;
10. confuse Run Crystal with Meta Crystal;
11. claim runtime safety without testing;
12. use web research to replace project sources unless explicitly requested.

## 10. Supporting Documents Worth Loading On Demand

```text
TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md
TMTB_TUTORIAL_PHASE8_VALIDATION_UPDATE_2026-08-19_v1.md
TMTB_BUFF_SELECTION_IMPLEMENTATION_CHECKPOINT_v1.0.md
TMTB_RUN_SETTLEMENT_IMPLEMENTATION_CHECKPOINT_v1.0.md
TMTB_SHOP_AND_SKILLS_CHECKPOINT_v1.0.md
TMTB_UIUX_DESIGNER_HANDOFF_v1.0.txt
```

Supporting documents preserve detail and provenance. They do not outrank current canon or actual source/runtime.
