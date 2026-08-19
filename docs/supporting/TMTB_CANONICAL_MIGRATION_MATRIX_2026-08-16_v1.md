# TMTB / BeCan — Canonical Migration Matrix

**Document Type:** Supporting Documentation-Migration Plan  
**Date:** 16 August 2026  
**Source Canon:** `TMTB_GAME_DESIGN_CONTEXT.md` v3.1 + `TMTB_GAME_DESIGN_DECISIONS_v3.1.md`  
**Reviewed Supporting Source:** `TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md`  
**Status:** **REVIEWED MIGRATION PLAN — NOT CANONICAL; DOES NOT MODIFY IMPLEMENTATION**

---

## 1. Purpose

This matrix determines which parts of the reviewed Tutorial Design Baseline v1.1 should be migrated into the next canonical Game Design package, which should remain in supporting Tutorial documentation, and which belong only in implementation-facing documentation after a fresh source/runtime audit.

The migration must preserve the separation between:

```text
Game Design Intent
Prototype Validation Scope
Prototype Implementation Truth
Unity / UIUX Implementation Detail
```

This document is a planning artifact. It does **not** itself elevate a supporting/PVS item to canonical status.

---

## 2. Recommended Versioning

If this migration is approved:

```text
TMTB_GAME_DESIGN_CONTEXT.md
Version: 3.2
Date: 16 August 2026

TMTB_GAME_DESIGN_DECISIONS_v3.2.md
Version: 3.2
Date: 16 August 2026
```

Reason: Tutorial/Objective design has materially evolved since v3.1 on 11 August. A minor canonical version increment is sufficient because the core game identity, Shared AP combat model, enemy grammar, and macro run structure remain intact.

The detailed Tutorial baseline should remain a separate supporting document:

```text
docs/supporting/
TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md
```

Exact implementation-handoff versioning should be chosen only after the later fresh repository/runtime audit.

---

# 3. Migration Action Legend

## MIGRATE — CONTEXT + DECISIONS
Current design direction is important enough that both canonical documents should recover it. Context receives the explanatory version; Decisions receives the compact authoritative snapshot.

## MIGRATE — CONTEXT ONLY
Useful canonical design context, but too detailed/conditional for the compact Decisions file.

## UPDATE EXISTING CANON
Existing v3.1 section is materially stale and should be revised rather than duplicated.

## KEEP SUPPORTING
Current detailed design is valid, but exact choreography, coordinates, tuning, copy, or implementation planning should remain in the Tutorial baseline.

## IMPLEMENTATION-FACING LATER
Belongs in Current State / Architecture / State & Data / Progress & Backlog after a fresh actual-source/runtime audit.

## HOLD / OPEN
Do not silently resolve during canonical authoring.

---

# 4. Core Canonical Migration Matrix

| Domain / Current v1.1 Direction | Current Status | Game Design Context v3.2 | Game Design Decisions v3.2 | Supporting Tutorial Baseline | Implementation-facing Docs |
|---|---|---|---|---|---|
| Tutorial remains one continuous Stage | Strong current direction | **UPDATE EXISTING CANON** — retain and strengthen continuity/progressive-reveal direction | **UPDATE** compact continuous-Stage direction | Keep detailed Phase transitions/map | Later implementation method only |
| Current authored Tutorial uses 8 Phases | Current authored baseline; final production count still TENTATIVE | **MIGRATE** current 8-Phase architecture as latest working authored map; explicitly say final Phase count remains TENTATIVE | **MIGRATE** compact list/status | Keep full Phase contracts | No implementation claim |
| Old seven-Phase current mapping | Superseded | Mark `SUPERSEDED` in Tutorial history/status | Remove as current; optionally one supersession note | Preserve provenance | — |
| Phase transition does not inherently reset AP/HP/Status/StartGrid | Current Tutorial authoring principle | Carry / strengthen existing state-continuity section | Compact carry if needed | Keep detailed examples | Runtime implementation later |
| Early lessons isolate; late lessons compose; guidance reduces | Current Tutorial principle | **MIGRATE** in Tutorial philosophy | Optional compact decision principle | Detailed evidence rhythm remains | — |
| Good/legal play should not break Tutorial | Existing + reaffirmed | Carry | Carry | Keep edge cases | — |
| Tutorial Input Gate is allowed for mandatory evidence, but is not a combat rule | **LOCKED current Tutorial Flow principle** | **MIGRATE** new explicit Tutorial orchestration principle | **MIGRATE** compact rule | Keep exact Phase 6/7 windows | Implement later; UI treatment separate |
| Tutorial Input Gate must not teach fake legality such as “Charging enemies cannot be attacked” | Current principle | Include as guardrail under Input Gate / no-fake-rules | Compact guardrail if space permits | Keep examples | UI/runtime later |
| Phase 1–5 current learning arc | Established current baseline; P1–5 implementation evidence separate | **UPDATE** Tutorial Stage current architecture to reflect established P1–5 learning sequence | **MIGRATE** compact Phase names / current direction | Keep exact prompts/coordinates/runtime detail | Current State later |
| Phase 5 final coordinated Sword finish is intended transition | Current design, not implemented | Mention only as current Stage flow boundary, not numeric choreography | No need for exact hit sequence | **KEEP SUPPORTING** exact AP/HP choreography | Implementation later |
| LOS is not a required current Tutorial lesson | Latest explicit Tutorial decision | **UPDATE EXISTING CANON** Tutorial knowledge/dependency sections: remove LOS from current required Tutorial path; mark `DEFERRED / needs future main-game review` | **UPDATE** Tutorial ranged-learning decision | Keep explanation/provenance | Prototype may retain LOS instrument |
| Main-game universal LOS requirement | **Canonical v3.1 conflicts with latest uncertainty; final rule not re-decided** | **HOLD / REOPEN FOR SEPARATE GAME-DESIGN REVIEW**. Do not silently replace with “no LOS.” Add conflict/open note if authoring v3.2 | Same: do not keep an unqualified new final decision without GD approval | Keep current audit note | Prototype current LOS truth stays implementation-specific |
| Practice Target as current Tutorial candidate | No longer used by established current Tutorial | **UPDATE** from active candidate to historical/prototype-only option, not current authored baseline | Remove as active current candidate | Historical provenance only | — |
| Spear Tutorial placement | Resolved: Phase 6 | **UPDATE Spear section**: old “Tutorial placement requires new decision” is stale; current Tutorial uses Spear in Phase 6 | **UPDATE** Baseline Spear placement note | Detailed geometry/scorer hypotheses stay | Spear not implemented yet |
| Phase 6 = Spear + Defensive Cover + Objective Introduction | Current authored baseline | **MIGRATE** learning contract and high-level sequence | **MIGRATE** compact Phase 6 direction | Full turn sequence/coords remain | Later implementation |
| Defensive Cover taught through two real Spear attacks: clear then Partial Cover | Current Tutorial contract | **MIGRATE CONTEXT ONLY** as evidence requirement | Usually omit detailed choreography from Decisions | **KEEP SUPPORTING** exact v0.7 geometry | Later runtime validation |
| Spear P1/P2 are expected real-AI outcomes, not Tutorial waypoints | Current design guardrail | **MIGRATE CONTEXT ONLY** under real-system validation / role-consistent AI | No new compact decision needed | Keep exact positions and adversarial proof | Must verify actual scorer |
| Phase 6 Objective first appears after Cover evidence | Current Tutorial flow | **MIGRATE CONTEXT ONLY** | Optional compact objective-introduction note | Keep exact sequencing | Objective UI later |
| Structures/environment can have functional Objective roles; may be protected or destroyed in game | **Newer explicit game-design direction** | **MIGRATE** into Encounter/Objective design, not only Tutorial | **MIGRATE** objective taxonomy direction | Keep Tutorial-specific Hut implementation | Unity/prototype semantics later |
| `Destroy Structure / Destroy Target` is intended Objective space | Strong explicit direction; exact system rules not final | **UPDATE Objective System** — add as intended/planned core Objective family | **UPDATE** Objective list: add `Destroy Structure/Target` as PLANNED CORE or equivalent; exact rules OPEN | Keep Hut lesson detail | Implement later |
| Tutorial uses `Destroy the Hut` as first Objective-literacy lesson | Current Tutorial direction | **MIGRATE** in Tutorial section | **MIGRATE** compact current Tutorial decision | Full sequence/copy supporting | Implement later |
| First Structure Attack guided; afterward Hut/Spear priority is free | **LOCKED current Tutorial Flow** | **MIGRATE CONTEXT ONLY** | Compact mention only if needed | Keep branches / AP math | Gate/runtime later |
| Phase 6 completion requires Hut destroyed + Spear defeated; order free | Current Tutorial flow | **MIGRATE CONTEXT ONLY** | Could appear compactly as Phase 6 exit contract | Keep branch detail | Implement later |
| Objective may change mid-Stage / mid-turn based on state | Existing trigger framework + current Tutorial usage | **UPDATE/REINFORCE** Objective progression examples | Existing trigger framework mostly sufficient; add Tutorial example only if useful | Keep exact `Destroy Hut → Eliminate remaining threat` flow | Implement later |
| Structure general targetability timing | OPEN | Keep explicitly OPEN in Objective/Structure design | OPEN note only | Keep detailed questions | Must be resolved during implementation design |
| 3×3 Hut = one entity / one HP pool in paper | Tutorial paper assumption only | Do **not** canonicalize as universal Structure rule | — | **KEEP SUPPORTING** | Implementation design later |
| Hut exact attack points, destroyed walkability, exact durability | OPEN / PVS | Do not canonicalize | — | **KEEP SUPPORTING** | Later source/data design |
| Phase 7 = Status & Temporal Threat | Current authored baseline | **UPDATE** old Phase mapping | **UPDATE** compact Phase 7 direction | Full drill detail supporting | Implement later |
| Current Tutorial vehicle = Blue Charge → Shockwave → Stun | Current Tutorial PVS vehicle; Blue roster itself remains TENTATIVE | **UPDATE Tutorial Status/Charge sections**: first current Tutorial application uses Blue; distinguish from roster lock | **UPDATE** old “first Status source OPEN / Status-first corrected baseline” because stale for current Tutorial | Keep choreography | Blue not implemented |
| Blue remains TENTATIVE special-enemy candidate, not locked Region 1 roster | Existing canon carried | Carry, do not inflate status | Carry | Keep Tutorial role detail | — |
| First Shockwave intentionally guarantees exactly one Stunned unit through geometry/instruction; effect itself evaluates actual area | **LOCKED current Tutorial Flow** | **MIGRATE CONTEXT ONLY** as controlled real-system evidence principle | Compact note optional | Keep exact staging | Implement later |
| Stun capability rules | Already canonical | Carry existing main-game Stun rule | Carry | Tutorial applies it | Implement later if absent |
| Tutorial Stun duration = 2 full Player Turns | **TENTATIVE PVS** | Mention only as current Tutorial validation value, not universal Stun rule | Prefer omit numeric value or label clearly TENTATIVE PVS | **KEEP SUPPORTING** full timing | Implement/test later |
| Exactly one required Archer Attack during first Stunned turn | **LOCKED current Tutorial Flow evidence** | **MIGRATE CONTEXT ONLY** at high level (“one real AP-spending action through unstunned unit”) | Too granular for compact Decisions | **KEEP SUPPORTING** exact attack | Implement later |
| Second Stunned turn is duration evidence only | Current Tutorial Flow | Context high-level only | Omit | Keep exact prompt/timing | Later |
| Blue controlled drill remains active until Guard recovers / Phase 8 release | Current Tutorial Flow | **MIGRATE CONTEXT ONLY** | Compact Phase 7 exit if useful | Keep exact state | Implement later |
| Phase 8 = Wave + Combined Pressure / Graduation | Current authored baseline | **MIGRATE** | **MIGRATE** compact Phase 8 direction | Full timeline remains | Implement later |
| 2 required Tutorial Waves: W1 Sword, W2 Spear; Blue may carry from P7 | Current paper/Tutorial baseline; roster count PVS | Context may state current Wave composition hypothesis, clearly TENTATIVE | Decisions should keep only high-level “known enemy first; second known pressure for transfer” unless GD wants exact roster canonical | **KEEP SUPPORTING** exact 2×1 composition/max3 | Implement/test later |
| Wave 1 guided; Wave 2 unassisted; Tutorial Prompt ends at W2 Telegraph | Strong current Tutorial Flow | **MIGRATE** graduation/guidance-reduction contract | **MIGRATE** compact free-play release direction | Exact copy/timeline supporting | UI/runtime later |
| Final free-play has no tactical Tutorial Input Gate | **LOCKED current Tutorial Flow** | **MIGRATE** | Compact carry | Keep valid branches | Implement later |
| Final Objective = `Eliminate all remaining threats`; pending required Wave blocks Victory | Current Tutorial encounter contract | **MIGRATE CONTEXT ONLY**; reinforce Objective ≠ Victory ≠ Wave | Decisions can add current Tutorial victory relevance without making universal Wave rule | Keep exact condition | Implement later |
| Core Wave Telegraph: one preparation window, reserved tile traversable but not final occupancy for either side, no immediate offense at spawn moment | Already canonical v3.1 | **CARRY — do not duplicate as new Tutorial-only rules** | **CARRY** | Baseline references them | Implementation later if absent |
| Current Tutorial candidate: spawn at end of Enemy Turn, then Player response, first normal activation following Enemy Turn | **TENTATIVE Tutorial PVS; universal lifecycle still OPEN** | Do not elevate to universal Wave canon; may mention only in Tutorial PVS note | **DO NOT LOCK** | **KEEP SUPPORTING** | Implement/test later |
| Progressive battlefield reveal A → B → C | Strong current Tutorial direction | **UPDATE Tutorial layout section**: initial courtyard preserved, later regions unlock within one Stage | **MIGRATE** high-level progressive-reveal direction | Full map stays | Implement later |
| Exact 16×16 envelope and A/B/C coordinates | Paper baseline / TENTATIVE | Mention that a 16×16 paper envelope is current prototype candidate only if useful; exact dimensions remain non-canonical | Omit exact size/coords | **KEEP SUPPORTING** | Map/data later |
| Region A Phase 1–5 internal topology/content preserved | Strong implementation/design migration constraint | Context may note preservation of validated early Tutorial area in current prototype plan | Omit from compact Decisions | **KEEP SUPPORTING** exact offset | Implementation migration later |
| Locked future regions must not affect path/target/Intent/objective/spawn | Prototype architecture/design requirement | **MIGRATE CONTEXT ONLY** under progressive reveal / real system validity | Omit | Keep examples | Implement region-state later |
| Before Phase 8, Guard+Archer are Required Tutorial Actors; required-actor defeat = Training Failed/retry | **LOCKED current Tutorial casualty policy** | **MIGRATE** clearly as Tutorial-specific curriculum rule, not main-game casualty rule | **MIGRATE** compact policy | Keep checkpoint detail | Implement later |
| Phase 8 single casualty is legal; only full party defeat stops encounter; victory with one survivor valid | **LOCKED current Tutorial casualty policy** | **MIGRATE** | **MIGRATE** compact boundary | Keep examples | Implement later |
| CP6 / CP7 / CP8 | Accepted current checkpoint candidates, not production-validated | Context may mention checkpoint retry should preserve state; exact CP6/7/8 should remain supporting | Omit exact labels | **KEEP SUPPORTING** | Implementation after audit |
| Checkpoint retry restores captured tactical state, not healing/reset reward | Strong current Tutorial policy | **MIGRATE CONTEXT ONLY** | Compact retry principle optional | Keep state list | Implement later |
| Tutorial copy language/rhythm | Current UIUX/supporting requirement | Keep only high-level tutorial readability principle in Context | Not Decisions | **KEEP SUPPORTING** exact copy/rules | Unity UIUX / prototype later |
| Unity HUD positions / center Tutorial text | UIUX reference, not game-design canon | Do not put detailed screen placement into core Game Design canon except cross-reference if needed | — | Keep supporting UIUX notes/baseline | UIUX implementation docs |
| PVS numbers: Sword31/8, Spear15/6/2, Hut28, Blue25/2, radius≈2, etc. | TENTATIVE PVS | Do not migrate as canonical balance values | Do not migrate | **KEEP SUPPORTING** | Runtime tuning later |
| Current implementation Sword31/10 vs PVS Sword31/8 | Design↔implementation conflict | Do not turn into game-design rule; Context may mention validation numbers live outside canon | — | **KEEP SUPPORTING** warning | **IMPLEMENTATION-FACING LATER** after audit |
| Current source/runtime status V1–V5 | Implementation truth | Do not migrate into Game Design Context/Decisions | — | Supporting baseline may reference | **IMPLEMENTATION-FACING LATER** |
| Recommended implementation Batches A–D | Planning only | Not canon | Not canon | May stay supporting | Progress/Backlog + Chat Handoff later |

---

# 5. Canonical Section-Level Edit Plan

## 5.1 `TMTB_GAME_DESIGN_CONTEXT.md` → proposed v3.2

### Part IV — Position / Range / Cover / Status

**LOS:** do not silently preserve the Tutorial requirement. Tutorial references to LOS should be removed from required onboarding. The broader main-game rule needs a separate status review because the latest Game Designer statement reopens confidence in whether LOS will exist in final Unity combat.

**Stun:** keep current capability rules. Add no universal `2-turn` duration.

### Part IV / VI — Baseline Spear

Replace the stale statement:

```text
Tutorial placement requires new curriculum decision
```

with current direction:

```text
Current Tutorial placement: Phase 6 — basic ranged pressure / defensive Cover.
Exact prototype stats and runtime scorer remain validation-dependent.
```

### Part V / VII — Objective / Encounter Design

Add the newer structure-objective direction:

- tactical environment structures can have gameplay/objective roles beyond Cover;
- Protect and Destroy use cases are intended design space;
- add `Destroy Structure / Destroy Target` to the planned/core objective family;
- exact Structure targetability, durability, and enemy-vs-Structure Target Rules remain OPEN.

Do not canonize Hut-specific 3×3 semantics.

### Part XI — Tutorial and Onboarding

This is the largest migration target.

Required updates:

1. remove current-required Tutorial LOS dependency;
2. replace seven-Phase current map with current 8-Phase authored baseline, while keeping final production count TENTATIVE;
3. update Phase 1–5 to established current sequence;
4. add Phase 6 Spear / Defensive Cover / Objective literacy;
5. replace Status-first/source-OPEN flow with current Blue Charge→Shockwave→controlled Stun Tutorial vehicle;
6. add Tutorial Input Gate as explicit orchestration principle;
7. add Phase 8 Wave→graduation/free-play flow;
8. update current Tutorial Stage layout from whole-stage Offset Courtyard to progressive A→B→C reveal, with initial courtyard preserved as the early region;
9. update Tutorial Defeat/Retry with Required Tutorial Actors before Phase 8 and normal single-survivor continuation after release;
10. remove stale blocker “exact first Status source”; replace with current validation questions;
11. downgrade Practice Target from current candidate to historical/prototype-only option not used by current baseline;
12. retain exact coordinates/tuning in the supporting baseline instead of bloating canon.

---

## 5.2 `TMTB_GAME_DESIGN_DECISIONS_v3.1.md` → proposed v3.2

The Decisions file should stay compact. It should not duplicate walkthroughs.

Recommended material updates:

### Objective System

Add:

```text
Destroy Structure / Destroy Target
= PLANNED CORE OBJECTIVE DIRECTION
```

with exact Structure rules OPEN.

### Baseline Spear

Update Tutorial placement from OPEN to current Phase 6 role.

### Tutorial ranged/Cover decision

Current Tutorial teaches ATR + offensive Cover first, then defensive Cover via Spear; LOS is not a required current Tutorial lesson.

### Status / Charge Tutorial

Replace stale decisions:

```text
Status first
exact first Status source OPEN
Blue Charge-first alternative OPEN
```

with:

```text
Current Tutorial validation flow uses Blue:
Charge → Shockwave → controlled one-unit Stun evidence.
Blue roster status remains TENTATIVE.
Tutorial Stun duration remains PVS/TENTATIVE.
```

### Current Tutorial architecture

Replace seven-Phase current structure with the compact 8-Phase authored baseline, explicitly retaining `final production Phase count = TENTATIVE`.

### Tutorial Input Gate

Add compact decision:

> A Tutorial Input Gate may temporarily restrict available inputs to preserve mandatory learning evidence, but it is Tutorial orchestration rather than a combat rule and must not teach false legality.

### Tutorial casualty / release boundary

Add:

- Required Tutorial Actors until the two-unit curriculum is complete;
- required-actor defeat before release causes Training Failure/retry;
- after Phase 8 free play begins, single-survivor continuation is valid and normal living-unit Shared AP applies;
- this is not the main-game casualty rule.

### Phase 8 graduation

Add compact direction:

- first Wave = guided known-pressure exposure;
- next Wave = unassisted confirmation;
- Tutorial tactical guidance is released before final free play;
- normal combat readability remains;
- pending required Waves can prevent Tutorial Victory according to the authored Tutorial encounter.

Do not migrate exact coordinates, exact Wave spawn time, Hut HP, Blue HP, Spear stats, or exact prompts.

---

# 6. What Must Remain Supporting-Only

The following details are intentionally **not** canonical-package material:

- full Phase 6–8 turn-by-turn walkthrough;
- all A/B/C global coordinates;
- Spear P1/P2 expected firing coordinates;
- O30 positions;
- 3×3 Hut footprint coordinates;
- Blue/Guard/Archer staging coordinates;
- W1/W2 exact reserved spawn coordinates;
- 16×16 ASCII blockout;
- current Tutorial safe Wave lifecycle candidate;
- exact checkpoint labels CP6/CP7/CP8;
- exact prototype copy strings;
- current PVS HP/ATK/DEF values;
- exact predicted HP trajectory;
- exact expected free-play TTK;
- numerical branch calculations;
- implementation batch plan.

These remain in `TMTB_TUTORIAL_DESIGN_BASELINE_2026-08-16_v1.1.md` because they are detailed authoring/PVS evidence rather than broad canonical rules.

---

# 7. What Must Wait for Implementation-Facing Refresh

Do not migrate these into canonical Game Design documents as factual implementation claims:

- V1–V5 current code/runtime status;
- current Tutorial Sword stat override actually present in source;
- exact Tutorial map/encounter JSON;
- current `eliminate_all` Victory blocker;
- `tutorialFlow.js` state/task/evidence fields;
- actual current repository module layout;
- region-lock state implementation;
- Spear code/scorer existence;
- Structure target representation;
- Stun/Charge/Blue/Wave runtime implementation;
- checkpoint serialization;
- pending-Wave Victory implementation;
- current Git state.

After canonical v3.2 is authored and audited:

```text
fresh repository/source/runtime audit
→ Current State refresh
→ Architecture refresh
→ State & Data refresh
→ Progress & Backlog refresh
→ Chat Handoff / README refresh
```

---

# 8. Explicit Canonical Conflicts / Decisions Requiring Care

## 8.1 Main-game LOS

This is the only material area where the migration should **not** quietly choose a final rule.

v3.1 currently states that all ranged attacks require LOS. The latest Tutorial discussion explicitly says LOS has not been deeply designed by the Game Designer, should not be taught in the current Tutorial, and may not exist in the final Unity gameplay in its present form.

Therefore the safe migration is:

```text
Tutorial LOS requirement
→ DEFERRED / removed from current curriculum

Main-game universal LOS rule
→ REQUIRES SEPARATE GAME-DESIGN REVIEW
→ do not silently rewrite as “no LOS”
→ do not pretend the confidence conflict does not exist
```

Recommended canonical treatment before final authoring: mark the universal main-game LOS requirement as **REOPENED / UNDER REVIEW** only if the Game Designer explicitly approves that status change.

## 8.2 Destroy Structure status

The latest explicit Game Designer direction is strong enough that structure Objective gameplay should migrate beyond Tutorial-only supporting notes. The safe status is:

```text
Structures having gameplay/objective roles
= CURRENT INTENDED DIRECTION

Destroy Structure / Destroy Target objective family
= PLANNED CORE

Exact Structure targeting / durability / enemy objective rules
= OPEN
```

Do not mark Hut-specific mechanics as universal.

## 8.3 Eight Phase status

Safe wording:

```text
Current authored Tutorial baseline = 8 Phases
Final production Tutorial Phase count = TENTATIVE
```

Do not label “8” as a permanent technical requirement.

## 8.4 Tutorial vs Main-game casualty

Required Tutorial Actor policy must be explicitly scoped:

```text
Tutorial curriculum orchestration only
≠ main-game casualty/permadeath rule
```

---

# 9. Proposed Canonical Migration Order

If this matrix is approved:

```text
1. Author TMTB_GAME_DESIGN_CONTEXT.md v3.2
   → targeted migration, not rewrite from blank

2. Author TMTB_GAME_DESIGN_DECISIONS_v3.2.md
   → compact snapshot derived from approved Context v3.2

3. Cross-document canonical consistency audit
   Context ↔ Decisions ↔ Tutorial Baseline v1.1

4. New-chat recovery test
   Verify that canon alone recovers:
   - current combat direction;
   - current Tutorial 8-Phase authored map;
   - LOS Tutorial deferral;
   - Structure Objective direction;
   - Phase 6 Spear role;
   - Phase 7 Blue controlled Status/Charge role;
   - Phase 8 Wave/free-play direction;
   - Tutorial casualty boundary;
   while still directing detailed geometry/PVS questions to the supporting baseline.

5. Preserve Tutorial Baseline v1.1 as supporting provenance

6. Fresh repository/runtime audit

7. Refresh implementation-facing handoff package

8. Only then choose first implementation migration batch
```

---

# 10. Matrix Verdict

**PASS — canonical migration scope is now sufficiently separated.**

The reviewed Tutorial baseline should not be copied wholesale into canon.

The canonical package should absorb:

- the new current Tutorial architecture;
- current Tutorial orchestration principles;
- the new Spear placement;
- current Objective/Structure design direction;
- current Blue/Charge/Stun Tutorial role;
- current Wave/graduation direction;
- current Tutorial casualty boundary;
- updated OPEN/SUPERSEDED status.

The supporting Tutorial baseline should continue to own:

- walkthrough detail;
- map coordinates;
- PVS tuning;
- exact prompts;
- validation branches;
- implementation migration planning.

Implementation truth remains a separate later audit/migration task.
