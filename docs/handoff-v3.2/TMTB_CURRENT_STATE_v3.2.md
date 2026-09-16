# TMTB Prototype Current State, Handoff v3.2

**Project:** TMTB / BeCan Prototype  
**Document Type:** Current Prototype Implementation Snapshot  
**Handoff Package Version:** 3.2  
**Game Design Reference:** v3.4  
**Source Baseline:** working tree based on Git `54d839f`, with Run Settlement and Shop/Four-Skill checkpoints applied  
**Verification Date:** 6 September 2026  
**Status:** **IMPLEMENTED, 185/185 AUTOMATED TESTS PASSED, BUILD PASSED, GAME DESIGNER RUNTIME CONFIRMED, NOT YET COMMITTED AT DOCUMENT AUTHORING TIME**

---

## 1. Authority

Implementation truth priority:

```text
actual source/data
→ confirmed runtime testing
→ this Current State
→ Architecture and State/Data handoffs
→ historical implementation documents
```

This document records implementation truth. Prototype values and flows do not automatically become production canon.

## 2. Verification Summary

Automated suite:

```text
Tutorial no-DEF                 4
Phase 6                        37
Phase Jump                     27
Phase 7                        34
Phase 8                        30
Battle Result                  16
Buff Selection                  9
Run Settlement                  4
Shop and Skills                24
TOTAL                         185 PASS
```

`npm run build` succeeds with Vite 8.0.14. The Game Designer completed browser/runtime validation and reported all tested behavior safe. Commit and push had not yet been performed when this package was authored, so no new authoritative commit hash is claimed.

## 3. Combat Foundation, Implemented and Confirmed

Current prototype implements:

1. party-wide Shared Team AP;
2. Team AP capacity equal to living Player Units multiplied by 2;
3. StartGrid movement commitment and refund;
4. Attack/Skill Movement Lock;
5. repeated legal Attack/Skill while AP and individual restrictions allow;
6. global End Turn;
7. sequential enemy activation by Spawn Order;
8. Current Target and Current Intent readability;
9. Stun capability denial without removing AP contribution;
10. Cover-reduced damage with DEF removed globally.

Current damage compatibility output retains a zero `targetDefense` result field for old logs, but active unit/Structure definitions, derived stats, calculations, upgrades, and UI no longer use DEF.

## 4. Tutorial, Implemented Through Phase 8

The continuous Tutorial Stage retains the verified eight-Phase curriculum:

| Phase | Current content |
|---|---|
| 1 | Control and Party Orientation |
| 2 | Shared AP and Tactical Movement |
| 3 | Turn, Intent, and Basic Combat |
| 4 | Tactical Range and Offensive Cover |
| 5 | Dynamic Threat and Shared AP Application |
| 6 | Spear, Defensive Cover, and Structure Objective |
| 7 | Blue Charge, Shockwave, and Stun |
| 8 | Wave Telegraph, Combined Pressure, Skills, and Graduation |

Phase 8 supports the four current Skills. Pending required Waves still block premature Tutorial victory. Full-party defeat restores CP8. Tutorial victory uses the focused Tutorial Complete screen and currently routes to Region Overview.

**DESIGN-VS-IMPLEMENTATION GAP:** the latest post-battle design handoff directs `START ADVENTURE` to Map Selection. Current runtime routes to Region Overview. This should be resolved deliberately in a later routing patch rather than silently rewriting either side.

Phase Jump 1 through 8 remains a PROTOTYPE ONLY validation tool.

## 5. Battle Result, Implemented and Confirmed

Normal victory produces an animated Battle Result containing Victory, Stage Name, Node Type, enemies defeated, total turns, stage Run Crystal reward, final Party Status, Active Buff access, and Continue after the presentation sequence.

Tutorial completion does not use this screen. Normal defeat routes directly to Run Settlement.

## 6. Buff Selection, Implemented and Confirmed

After normal victory, two Buff offers are independently generated. The Player may select one, switch selection, deselect, or skip through two empty confirm inputs. Confirming a Buff adds it to `activeRunBuffs`, removes it from the available pool, and applies it to later battles.

The Active Buff List uses ten visible slots in a 5 by 2 model and remains available on Battle Result, Buff Selection, and Map Selection. Current Buff icons and presentation are placeholders.

The current pool contains four Common, three Rare, and two Epic Buffs. Stage rarity weights are 70/20/10; mini-boss, boss, and special nodes use their own higher-tier-biased tables. These values are runtime baselines rather than final balance.

## 7. Run Settlement, Implemented and Confirmed

```text
Normal defeat → RUN FAILED → Main Menu
Prototype Stage 4 victory → Battle Result → Buff Selection → RUN COMPLETE → Main Menu
```

Both settlement states use the same layout and contain run summary, final party condition, Active Buffs, and Run Crystal total. Settlement does not show Meta Crystal balance, conversion before/after values, or a Shop button. Crystal conversion is idempotent and occurs once per run terminal state.

## 8. Permanent Shop, Implemented and Confirmed

Shop is accessible only from Region Overview. It is outside Map Selection and the active run.

Current pages: Guard and Archer are active for prototype validation; Support and Trickster are visible and locked.

| Character | Stat | Effect | Levels | Costs |
|---|---|---:|---:|---|
| Guard/Archer | Max HP | +2 each | 4 | 30, 60, 100, 150 |
| Guard/Archer | ATK | +1 each | 4 | 40, 80, 130, 190 |

Purchases are immediate and persisted. Insufficient funds, stale level requests, invalid units/stats, rapid duplicate input, owned Skills, and maximum levels are guarded. There is no refund/respec and no Global page.

## 9. Four Skills, Implemented and Confirmed

| Skill | Access | Cost | Current effect |
|---|---|---:|---|
| Fortify | Guard core | 1 AP | grants 4 non-stacking Shield to self/ally within range 2 |
| Intercept | Guard Shop unlock, 150 Meta Crystal | 1 AP | redirects one protected ally's first incoming basic attack while Guard remains valid and in range |
| Pinning Shot | Archer core | 1 AP | Immobilizes one enemy for one Enemy Turn without damage; attacking remains legal |
| Volley | Archer Shop unlock, 150 Meta Crystal | 2 AP | hits enemies in a 3 by 3 area for floor(ATK × 0.6 × remaining Cover multiplier), without friendly fire |

All four currently use cooldown 2. Cast on Player Turn 1 means unavailable on Turn 2 and ready on Turn 3. Shield, Intercept protection, and Immobilize expire after the next Enemy Turn. Casting spends Shared Team AP and locks caster movement. Cancel spends nothing.

Skill input path:

```text
select unit → Action → Skill → select Skill → select target → resolve
```

The panel supports pointer input and Tab, Enter, Space, Esc, and Z. Underlying battle input is blocked while the panel is active.

## 10. Profile and Save Migration

Storage key remains `tmtb_profile_v1`; normalized payload version is 2.

Current profile includes Tutorial completion, Meta Crystal, Guard/Archer Max HP and ATK upgrade levels, plus Guard/Archer unlocked Skill arrays. Legacy DEF levels are discarded without refund. Existing Tutorial completion, Meta Crystal, and valid Max HP/ATK levels are preserved.

## 11. Run State Additions

Current run state includes:

```text
lastBattleResult
battleResultHistory[]
activeRunBuffs[]
crystalConversionCompleted
metaCrystalBeforeConversion
metaCrystalAfterConversion
```

`battleResultHistory` supports settlement aggregation. Conversion bookkeeping prevents duplicate Meta Crystal awards.

## 12. Current Simplifications and Non-Claims

1. Guard and Archer are both available from the start in the prototype. Planned full-game Archer gating is not implemented.
2. Support and Trickster unlock progression is not implemented.
3. Shop icons, character portraits, Skill artwork, projectile animation, and graphical Volley area targeting are placeholders or absent.
4. Skill enhancement through Buffs is not implemented.
5. The former Layered Plates Buff now gives +2 Max HP while retaining its stable ID. This is a provisional compatibility replacement.
6. Current Shop prices, rewards, Skill numbers, range, and cooldown are validation baselines.
7. Tutorial Wave Safe lifecycle and authored W3 fallback pairs are not universal production rules.
8. In-Run Shop, global Shop progression, respec, and Buff-pool unlocks remain unimplemented.

## 13. Current Resume Point

Implementation and runtime validation are closed for Battle Result, Buff Selection, Run Settlement, Shop, global DEF removal, and the four-Skill slice. The immediate remaining milestone action is:

```text
place Handoff v3.2
→ inspect Git diff
→ run npm test and npm run build
→ commit
→ push
→ verify clean synchronized main
```

After Git closure, the next Game Design frontier should be chosen explicitly rather than inferred from implementation.
