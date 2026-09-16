# TMTB Progress and Backlog, Handoff v3.2

**Project:** TMTB / BeCan Prototype  
**Handoff Package Version:** 3.2  
**Game Design Reference:** v3.4  
**Last Updated:** 6 September 2026  
**Status:** **CURRENT CHECKPOINT AND FUTURE-WORK SNAPSHOT**

---

## 1. Current Milestone

```text
Battle Result
→ Buff Selection
→ Run Settlement
→ Permanent Shop
→ four playable Skills
→ global DEF removal
→ automated/build/runtime validation complete
→ documentation migration v3.2
→ Git closure pending
```

Evidence:

```text
185/185 automated tests PASS
npm run build PASS
Game Designer runtime test PASS
```

## 2. DONE, Combat and Tutorial Foundation

1. Shared Team AP and living-unit contribution;
2. StartGrid movement commitment/refund;
3. Attack/Skill Movement Lock and repeated legal action;
4. global End Turn;
5. sequential Enemy activation in Spawn Order;
6. Current Target/Current Intent readability;
7. continuous Tutorial Phase 1 through 8;
8. Phase 6 Spear, defensive Cover, and Hut Objective;
9. Phase 7 Blue Charge/Shockwave/Stun;
10. Phase 8 Wave Telegraph, W3 pressure, pending-Wave victory gate, CP8 retry;
11. Phase Jump 1 through 8;
12. global no-DEF damage/data migration.

## 3. DONE, Post-Battle and Run Flow

1. animated normal-victory Battle Result;
2. focused Tutorial success/failure screens;
3. two-card Buff Selection with independent rarity rolls;
4. selection, deselection, switching, and two-confirm skip;
5. persistent run Buff ownership and next-battle application;
6. Active Buff List on relevant screens;
7. Run Failed and Run Complete Settlement using one layout;
8. battle-result history aggregation;
9. idempotent Run Crystal to Meta Crystal conversion;
10. terminal return to Main Menu.

## 4. DONE, Permanent Shop and Skills

1. Region Overview-only Shop access;
2. Guard/Archer pages and locked Support/Trickster pages;
3. Max HP and ATK four-level upgrade tracks;
4. increasing price curves, Max state, and insufficient-funds feedback;
5. immediate atomic persistence and rapid-input protection;
6. profile payload version 2 and legacy DEF migration;
7. Fortify, Pinning Shot, Intercept, and Volley;
8. AP, cooldown, targeting, cancellation, Status, Cover, Shield, Intercept, and Immobilize regression tests;
9. keyboard and pointer Skill Panel interactions.

## 5. NEXT, Git Closure

```text
copy docs package into repository
→ inspect exact status/diff
→ npm test
→ npm run build
→ stage intended files
→ git diff --cached --check
→ commit
→ push
→ verify HEAD equals origin/main
→ verify clean working tree
```

Do not claim a post-`54d839f` commit until user Git output confirms it.

## 6. NEXT, Design Choice

After Git closure, the next broad work domain is not automatically selected. Plausible frontiers include:

1. Shop economy and difficulty pacing playtest across the four-stage prototype;
2. Skill usability, targeting readability, and tactical-value validation;
3. Buff pool expansion and future Skill-enhancement Buffs;
4. Region 1 encounter/composition authoring under the migrated combat model;
5. special-enemy candidate validation;
6. broader Objective/Structure design;
7. future Tactical Space/LOS review when deliberately prioritized;
8. UI/UX production redesign using the compact designer handoff.

The Game Designer chooses the frontier explicitly.

Before broader feature work, resolve the small routing gap where canonical Tutorial `START ADVENTURE` targets Map Selection while current runtime enters Region Overview.

## 7. PLANNED

1. full-game Archer unlock after first Stage 3 entry and fielding only at Stage 3 or later;
2. Support and Trickster region unlocks, identity, stats, upgrades, and Skills;
3. temporary Buff enhancement of owned Skills;
4. expanded Buff pool and possible future permanent pool unlocks;
5. final character art, icons, Skill visuals, projectile/AoE presentation;
6. Town and Castle content and full-run Settlement boundary;
7. HP carry and attrition implementation aligned with main-game design.

## 8. OPEN OR DEFERRED, PRESERVED

### Combat and Units

1. final Hold effect and restrictions;
2. final Normal Attack AP value after balancing;
3. future Skill roster and final tuning;
4. Skill-enhancement Buff interaction rules;
5. status-specific duration/tick conventions;
6. AP handling when a contributing unit dies mid-turn;
7. continuous Unity movement allowance and StartGrid measurement;
8. future Tactical Space/LOS rule and any later Tutorial treatment;
9. Trickster and Support detailed identities.

### Enemy, Encounter, and Tutorial

1. final combat-distance and deterministic tie rules;
2. Orange/Purple/Blue production roster membership and parameters;
3. Mini-Boss/Boss Pattern design;
4. Protect, Destroy, and future Objective semantics;
5. Structure durability, destruction, walkability, and enemy interaction;
6. universal Wave relevance, Telegraph density, spawn timing, and first activation;
7. final Region 1 compositions;
8. final production Tutorial Phase count, geometry, checkpoint granularity, and combined-pressure tuning.

### Run, Rewards, Economy, and UI

1. recovery, Rest, between-region healing, and defeated-unit persistence;
2. unfinished-run resume model;
3. reward probability, rarity, repetition, stacking, and caps;
4. In-Run Shop;
5. future permanent upgrade categories and Global Shop need;
6. final Shop/Settlement/Battle Result presentation and animation timing;
7. future conversion or completion-bonus reconsideration after full-run pacing;
8. Death Marker and Run History as UI/UX candidates;
9. final telemetry and balancing thresholds.

## 9. DEFERRED TECHNICAL WATCHES

These are not automatic refactor tasks:

1. `main.js` integration weight;
2. large `tutorialFlow.js` legacy core;
3. specific rather than generic Skill engine;
4. generic Status timing limitations;
5. minimal Tutorial-driven Wave system;
6. placeholder icons/art and absent graphical AoE target preview;
7. old text highlighter still recognizing the string DEF;
8. no automated browser visual suite.

## 10. SUPERSEDED OR HISTORICAL

Do not resume as current rules:

1. old per-unit Exhausted Player Turn;
2. all-enemies-move then all-enemies-attack phase;
3. universal current ranged LOS rule or LOS Tutorial lesson;
4. seven-Phase Tutorial mapping;
5. Phase 6 free Hut/Spear priority;
6. two one-enemy Waves as sufficient final Phase 8 pressure;
7. full removal of Phase 8 high-level guidance;
8. DEF as unit, Structure, damage, or Shop stat;
9. Main Menu permanent Shop access;
10. milestone-hidden permanent Shop;
11. permanent Movement, ATR, or Team AP Shop upgrades in the current direction;
12. separate Battle Result for normal defeat.
