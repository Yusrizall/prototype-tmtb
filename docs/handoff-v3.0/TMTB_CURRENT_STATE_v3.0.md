# TMTB Prototype Current State — Handoff v3.0

**Project:** TMTB / BeCan Prototype
**Document Type:** Handoff Snapshot — Current Prototype Implementation State
**Handoff Package Version:** 3.0
**Game Design Reference:** `TMTB_GAME_DESIGN_CONTEXT.md` v3.1 / `TMTB_GAME_DESIGN_DECISIONS_v3.1.md`
**Prototype Implementation Baseline:** **Post-v2.5 / Pre-v3 Combat Migration**
**Verified Baseline Date:** 11 August 2026
**Project Root:** `C:\Datas\prototype-tmtb`
**Status:** **CURRENT IMPLEMENTATION SNAPSHOT — EVIDENCE-AWARE**

---

# 1. Purpose of This Document

Dokumen ini menjawab:

> **Prototype aktual saat ini benar-benar sudah melakukan apa?**

Dokumen ini adalah implementation-facing handoff.

Ia bukan canonical Game Design document.

Jika design v3.1 mengatakan satu hal sementara prototype masih melakukan hal lain, dokumen ini harus mencatat gap tersebut secara eksplisit.

Source-of-truth implementation:

```text
1. Actual source code / data
2. Confirmed runtime testing
3. This Current State snapshot
4. Architecture / State & Data handoff
5. Historical implementation docs
```

Jika dokumen ini bertentangan dengan actual source/runtime terbaru:

```text
actual source/runtime wins
```

---

# 2. Evidence Labels Used Here

Untuk menghindari overclaim, dokumen ini membedakan:

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Actual current source telah diaudit dan behaviour terkait juga dikonfirmasi melalui runtime test pada 11 August 2026.

## AUDITED CURRENT SOURCE

Actual current source/data telah diaudit, tetapi seluruh edge case tidak selalu diretest.

## CARRIED — NO RELEVANT GIT DELTA FOUND

Behaviour berasal dari v2.5 implementation snapshot dan module terkait tidak menunjukkan relevant committed delta setelah tag `v2.5-full-loop-core`.

Ini bukan berarti semua path diretest pada 11 August.

## HISTORICALLY TESTED v2.5

Behaviour sebelumnya dikonfirmasi pada checkpoint v2.5, tetapi tidak seluruhnya dire-run dalam recovery audit 11 August.

## NOT IMPLEMENTED

Tidak ditemukan sebagai current authoritative system.

## UNCOMMITTED WORK

Ada pada local working tree dan telah diklasifikasikan, tetapi belum menjadi commit Git.

---

# 3. Git / Repository Baseline

## VERIFIED 11 AUG 2026

Branch:

```text
main
```

Repository status at audit:

```text
branch up to date with origin/main
```

HEAD:

```text
cbd33ac Add GitHub Pages deployment
```

Known implementation milestone tag:

```text
v2.5-full-loop-core
```

Committed changes after that tag:

```text
4de8acd Adding Game Design Context
4417dc6 Fix data loading for production deployment
cbd33ac Add GitHub Pages deployment
```

Committed post-v2.5 delta was limited primarily to:

- canonical Game Design Context;
- deployment;
- production data-loading support.

No committed v3 combat migration was found.

---

# 4. Current Uncommitted Working-Tree Work

## UNCOMMITTED WORK — RUNTIME CONFIRMED

Modified local files at audit time:

```text
src/main.js
src/style.css
src/ui/flow/basicFlowScreens.js
```

The diff was audited.

These changes primarily implement:

- `run_overview` scene;
- Run Overview navigation;
- Shop relocation/access;
- Tutorial Victory routing to Run Overview;
- post-run result routing to Run Overview;
- Region 1 / Town / Castle overview presentation;
- Meta Crystal display;
- Tutorial completion display;
- Shop copy cleanup;
- Run Overview CSS/presentation.

These changes are **not** Shared AP / Intent / Wave / redesigned Tutorial combat migration.

Runtime test confirmed that Run Overview appears and functions.

Do not discard these local changes casually.

---

# 5. Technology / Deployment

Current prototype uses:

- Vite;
- Vanilla JavaScript;
- HTML;
- CSS;
- JSON;
- browser `fetch`;
- browser `localStorage`;
- Git;
- GitHub;
- GitHub Pages deployment workflow.

## AUDITED CURRENT SOURCE

`vite.config.js`:

```text
base = "/prototype-tmtb/"
```

`src/logic/shared/dataLoader.js` now resolves data through:

```text
import.meta.env.BASE_URL
+
relative data path
```

Current data requests use relative paths such as:

```text
data/units/player_units.json
data/units/enemy_units.json
data/maps/r1_stage1_fixed.json
data/encounters/r1_stage1_baseline_eval_encounter.json
```

This supersedes the old v2.5 documentation warning around direct `/public/data/...` path assumptions.

## GitHub Pages

`.github/workflows/deploy.yml` currently provides:

```text
push to main
or manual workflow_dispatch
→ npm ci
→ npm run build
→ upload ./dist
→ deploy GitHub Pages
```

Deployment infrastructure is current committed repository state.

---

# 6. Current Scene Set

## AUDITED CURRENT SOURCE

Current scene values handled by `main.js` include:

```text
title
main_menu
run_overview
map_selection
battle_intro
battle
reward_selection
run_completion
run_defeat
post_run_shop
```

`run_overview` is post-v2.5 local work.

---

# 7. Current High-Level Flow

Current flow is best represented as:

```text
Title
→ Main Menu
→ Tutorial Gate / Run Overview
```

For a profile with Tutorial incomplete:

```text
Main Menu
→ Start Journey
→ Tutorial Battle (placeholder)
```

Tutorial Victory:

```text
mark tutorialCompleted
→ save profile
→ Run Overview
```

Tutorial Defeat:

```text
retry Tutorial Battle
```

For a profile with Tutorial complete:

```text
Main Menu
→ Start Journey
→ Run Overview
```

From Run Overview:

```text
Start Journey
→ createNewRun()
→ Map Selection
```

Run-stage loop:

```text
Map Selection
→ Battle Intro
→ Battle
→ Reward Selection
→ Map Selection / next node
```

Run settlement:

```text
Run Completion / Run Defeat
→ Return to Run Overview
```

or:

```text
Run Completion / Run Defeat
→ Shop
→ Run Overview
```

Run Overview may also open Shop directly.

---

# 8. Run Overview

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Run Overview is implemented in the local working tree.

Current presentation includes:

```text
Region 1 — Village
Region 2 — Town
Region 3 — Castle

Meta Crystal
Tutorial Status
Start Journey
Shop
Back / Main Menu navigation
```

Current prototype scope:

```text
Region 1
= playable prototype run region

Town / Castle
= visible locked future-region framing
```

Game Designer confirmed that Shop relocation to Run Overview was intentional prior work.

### Important current state behaviour

Opening Run Overview currently clears:

```text
runState
battleState
battleIntroNodeId
```

and sets:

```text
currentScene = "run_overview"
```

Therefore Run Overview acts as a between-run/meta-flow hub in the current local implementation.

This is prototype flow, not automatic final full-game meta-progression canon.

---

# 9. Main Menu / Tutorial Gate

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Main Menu remains the entry point after Title.

`Start Journey` checks:

```text
profileState.tutorialCompleted
```

If false:

```text
startTutorialBattle()
```

If true:

```text
openRunOverview()
```

Reset Data remains available from Main Menu.

Other menu items remain limited/placeholder according to the carried v2.5 state unless changed later.

---

# 10. Tutorial Implementation

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Current Tutorial is still:

```text
Tutorial Stage (Placeholder)
```

It uses the normal old battle setup.

It does **not** implement corrected T1–T3 tutorial design.

Not implemented in the current tutorial include:

```text
Control & Party Orientation authored flow
Camera FLOW SIMULATION
Unity locomotion FLOW SIMULATION
Shared AP lesson
StartGrid/refund lesson
global End Turn lesson
Attack movement-lock/no-Exhaustion lesson
Practice Target
distinct LOS lesson
Current Target / Dynamic Intent lesson
Status lesson
Charge lesson
Wave Telegraph lesson
combined-pressure final lesson
```

This is an expected design-vs-implementation gap.

---

# 11. Current Battle Setup

## AUDITED CURRENT SOURCE

`createInitialBattleState()` currently creates:

```text
phase: "player_phase"
turnCount: 1
selectedUnitId: first player unit
battleControlState: "unit_selected_movement"
actionMenuIndex: 0
selectedAction: null
playerUnits
enemyUnits
resultState: "ongoing"
```

No authoritative Shared Team AP field currently exists.

No authoritative Intent, Wave, Charge, or redesigned Tutorial state exists in this initial battle state.

---

# 12. Current Battle Unit State

## AUDITED CURRENT SOURCE

Current battle units include fields such as:

```text
battleUnitId
unitDefId
name
side
role

tileX
tileY

originTile

currentHP
maxHP

turnState
hasActed

derivedStats

attackType
targetPattern
targetCategory
usesProjectile
requiresPathCheck

spawnLabel
```

Current initial action state:

```text
turnState = "ready"
hasActed = false
```

`originTile` is recorded at setup and refreshed at the beginning of later Player Turns.

---

# 13. `originTile`

## AUDITED CURRENT SOURCE

`originTile` is the current implementation's per-turn movement/reference anchor.

Conceptual current behaviour:

```text
Player Turn begins
→ living player originTile refreshed to current position
→ movement reachability uses originTile
```

This is **not yet canonical StartGrid semantics**.

It does not currently own:

```text
Shared AP movement commitment
leave-StartGrid AP spend
return refund
Attack/Skill refund lock conditions
```

However it is a strong implementation seed for future StartGrid migration.

---

# 14. Current Player Turn Model

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Current prototype still uses the old per-unit Ready / Exhausted model.

Conceptual flow:

```text
select ready player unit
→ reposition
→ Attack or Wait
→ unit becomes Exhausted
```

When all living Player Units are Exhausted:

```text
Player Phase
→ Enemy Phase automatically
```

After Enemy Phase:

```text
turnCount + 1
→ living player units become ready
→ originTile refreshed
→ new Player Phase
```

This is current implementation truth.

It is **not** current v3.1 game-design intent.

---

# 15. Shared Team AP Status

## NOT IMPLEMENTED

Current battle state/controller does not yet implement:

```text
Team AP = Living Player Units × 2
```

There is no current authoritative:

```text
teamAP
teamAPCurrent
teamAPMax
```

in the audited battle state.

Movement and actions are therefore not currently using the v3.1 Shared AP economy.

---

# 16. Current Movement

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Movement currently:

- uses grid/BFS reachability;
- uses `originTile` as the movement reference;
- allows reposition before action;
- does not consume Shared AP;
- does not mark a unit as acted merely by repositioning;
- becomes unavailable after the unit is Exhausted;
- respects blocked/occupied movement rules from the existing battle logic.

Current implementation roughly supports:

```text
reposition
vs
action commitment
```

but not the new Shared AP commitment/refund economy.

---

# 17. StartGrid / Movement Commitment / Refund

## NOT IMPLEMENTED AS v3.1 SEMANTICS

Although `originTile` exists, the current prototype does not implement:

```text
leave StartGrid
→ spend 1 Team AP
```

or:

```text
return to StartGrid before commitment
→ refund movement AP
```

Therefore:

```text
originTile
≠
fully implemented StartGrid system
```

---

# 18. Current Action Menu

## AUDITED CURRENT SOURCE

Current command/action menu still contains:

```text
Attack
Skill
Wait
```

Active resolution:

```text
Attack
Wait
```

`Skill` remains present as an option but has no active normal resolver in the audited controller.

---

# 19. Current Attack Commitment

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Current basic Attack:

```text
resolves damage
→ sets attacker turnState = "exhausted"
→ hasActed = true
```

Therefore a player unit that attacks cannot continue acting under the current old turn model.

This means current prototype does **not** implement v3.1:

```text
Attack/Skill
→ Movement locked
→ unit remains usable/selectable
→ repeated action may still be legal
```

Repeated actions are blocked by the old Exhaustion model.

---

# 20. Current Wait

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Wait currently:

```text
turnState = "exhausted"
hasActed = true
```

This is old implementation behaviour.

Canonical v3.1 design treats the old Wait/Exhaustion model as superseded and has Hold as the current unfinished direction.

Do not interpret current Wait implementation as current game-design intent.

---

# 21. Global End Turn

## NOT IMPLEMENTED

The Player Turn currently ends automatically when all living Player Units are Exhausted.

There is no current global End Turn control implementing the v3.1 rule:

```text
END TURN
→ discard unused Team AP
→ Enemy Turn
```

---

# 22. Current ATR

## AUDITED CURRENT SOURCE

Current attack range uses Euclidean tile-center distance:

```text
hypot(deltaX, deltaY)
```

Current unit data:

```text
Guard ATR  = 1.5
Archer ATR = 3.0
Sword ATR  = 1.5
```

This is current implementation behaviour.

The exact future prototype metric should be validated against design needs rather than assumed canonical solely because it already exists.

---

# 23. Current Cover / Obstacle Behaviour

## AUDITED CURRENT SOURCE

Current obstacle/cover values:

```text
O30 = 30%
O70 = 70%
OF  = 100% / Full Cover
```

Current damage relationship is effectively:

```text
floor(max(0, ATK × (1 - Cover) - DEF))
```

Current ranged targeting can retain a target through Full Cover while damage becomes 0.

This already supports part of the desired separation:

```text
Target Validity
≠
Action Effectiveness
```

---

# 24. Distinct LOS Status

## NOT IMPLEMENTED AS A SEPARATE AUTHORITATIVE RULE

The audited targeting/path system does not yet expose a distinct ranged validity state equivalent to:

```text
inside ATR
+
No LOS
→ ranged action invalid
```

Current path evaluation focuses on relationships such as:

```text
clear
partial_cover
full_cover
melee_blocked
```

Therefore current prototype cannot yet validate the corrected tutorial distinction:

```text
LOS
≠
Cover
```

with the required fidelity.

---

# 25. Current Enemy Content

## AUDITED CURRENT SOURCE / DATA

Current audited enemy roster used by the baseline encounter:

```text
Sword Enemy
```

No current prototype implementation of the tentative Orange/Purple/Blue special-enemy trio was found.

---

# 26. Current Enemy Movement Targeting

## AUDITED CURRENT SOURCE

Current enemy movement selects a nearest living player.

Current observed priority:

```text
1. nearest distance
2. battleUnitId tie-break
```

Destination selection is deterministic and considers:

```text
closest target distance
then shorter move
then lower Y
then lower X
```

This is useful deterministic behaviour, but it is procedural old AI rather than the canonical v3.1 Intent grammar.

---

# 27. Current Enemy Attack Targeting

## AUDITED CURRENT SOURCE

Enemy attack chooses valid targets again during the attack pass.

Current observed priority:

```text
1. nearest valid target
2. lower HP
3. battleUnitId
```

Therefore:

```text
movement target
may differ from
attack target
```

There is no authoritative Current Target object tying movement/action into one readable plan.

---

# 28. Current Enemy Phase Orchestration

## VERIFIED SOURCE + RUNTIME 11 AUG 2026

Internal current execution:

```text
Enemy A moves
Enemy B moves
...

↓

Enemy A attacks
Enemy B attacks
...
```

Within each pass, later enemies read updated board state.

However current full activation is **not**:

```text
Enemy A Move + Action
→ Enemy B Move + Action
→ ...
```

Therefore canonical sequential full activation is not implemented.

---

# 29. Current Enemy Phase Presentation

## VERIFIED RUNTIME 11 AUG 2026

Player-facing experience is simply:

```text
Enemy Phase
→ resolution delay
→ enemies have moved and attacked
```

There is no current player-facing:

```text
Enemy Movement Phase
Enemy Attack Phase
Intent
Current Target
Dynamic Intent
```

The source contains separate movement/attack passes, but those are not taught/presented as player-facing sub-phases.

---

# 30. Spawn Order Status

## PARTIAL IMPLEMENTATION SEED — NOT EXPLICIT SYSTEM

Current static enemy units are built from encounter:

```text
enemySpawns[]
```

and processed through enemy array order.

For the current baseline encounter:

```text
1. E1 Sword
2. E2 Sword
```

Therefore encounter insertion order currently acts as a practical execution-order seed.

However no explicit authoritative:

```text
spawnOrder
```

state/property was found.

Dynamic Wave spawning is not implemented.

---

# 31. Intent / Current Target / Dynamic Intent

## NOT IMPLEMENTED

No authoritative current prototype system was found for:

```text
Intent
player-readable Current Target
Dynamic Intent
enemy Pattern
Wave-linked Intent
```

Current enemy decisions are procedural and split between movement and attack logic.

---

# 32. Status / Charge

## NOT IMPLEMENTED FOR CURRENT VALIDATION TARGET

No current audited tutorial/combat implementation of the v3.1 advanced concepts:

```text
Status
Stun teaching
Charge
multi-activation temporal threat
```

was found.

These remain future migration/validation domains.

---

# 33. Wave Telegraph / Reserved Spawn

## NOT IMPLEMENTED

Current prototype does not implement the canonical Wave Telegraph system:

```text
Telegraph
reserved spawn position
preparation window
Spawn
new enemy Intent
```

Current encounter enemies are static setup content.

---

# 34. Current Baseline Map / Encounter

## AUDITED CURRENT DATA

Current fixed battle map:

```text
7 × 5
```

Approximate layout:

```text
      x0   x1   x2   x3   x4   x5   x6
y0    .    .    .   O30   .    E1   .
y1    .    P1   .    .    .    .    .
y2    .    .   O70   .    OF   .    .
y3    .    P2   .    .    .    .    .
y4    .    .    .   O30   .    E2   .
```

Where:

```text
P1 = Guard
P2 = Archer
E1 = Sword Enemy
E2 = Sword Enemy
```

Current encounter:

```text
Guard + Archer
vs
2 × Sword Enemy
```

Objective:

```text
eliminate_all
```

Victory:

```text
all required enemies defeated
```

Defeat:

```text
all players defeated
```

Reward:

```text
20 Crystal
```

This is the old implementation baseline.

It is not the corrected Tutorial `Offset Courtyard` working design.

---

# 35. Current Unit Stats

## AUDITED CURRENT DATA

| Unit | HP | ATK | DEF | Move | ATR | Type |
|---|---:|---:|---:|---:|---:|---|
| Guard | 25 | 5 | 4 | 3 | 1.5 | melee |
| Archer | 18 | 7 | 1 | 4 | 3.0 | ranged |
| Sword | 16 | 6 | 2 | 3 | 1.5 | melee |

Current definitions also include:

```text
attackType
targetPattern
targetCategory
usesProjectile
requiresPathCheck
```

These fields should not automatically be treated as final v3.1 grammar.

---

# 36. Cover Teaching Limitation in Current Matchup

## AUDITED / DERIVED FROM CURRENT DATA

Archer:

```text
ATK = 7
```

Sword:

```text
DEF = 2
```

Approximate current damage:

```text
Clear:
5

O30:
2

O70:
0

Full Cover:
0
```

Therefore O70 and Full Cover can appear identical in damage outcome for this matchup.

This is not necessarily a bug.

It is a teaching/readability limitation of the current content and supports using deliberately designed tutorial geometry/content later rather than treating the existing Stage 1 battle as final ATR/LOS/Cover teaching content.

---

# 37. Current Objective

## CARRIED / CURRENT SOURCE STRUCTURE

Current battle objective remains:

```text
eliminate_all
```

Objective variety is not implemented in the audited current content.

---

# 38. Stage / Encounter Content

## AUDITED CURRENT SOURCE + CARRIED FROM v2.5

Current battle setup still uses:

```text
stage1Map
stage1Encounter
```

as the actual battle data across prototype battles.

Therefore current Stage 2/3/4 route identity can differ while battle map/encounter content remains duplicated.

This remains a major content limitation.

---

# 39. Run Generation / Branching

## CARRIED — NO RELEVANT GIT DELTA FOUND
## HISTORICALLY TESTED v2.5

The v2.5 implementation provides:

```text
Stage 1 fixed
→ 2 unique Stage 2 variants from A/B/C
→ 2 unique Stage 3 variants from A/B/C
→ Stage 4 fixed
```

Node state vocabulary includes:

```text
future
available
current
completed
blocked
failed
```

Branch commitment blocks sibling nodes in the selected stage slot.

No relevant post-v2.5 Git delta was found in the run-state module during the recovery audit.

This subsystem was not exhaustively re-run from Stage 1 through Stage 4 during the 11 August baseline smoke test.

---

# 40. Reward Selection

## CARRIED — NO RELEVANT GIT DELTA FOUND
## HISTORICALLY TESTED v2.5

After run-stage victory, the current historical implementation:

- adds stage Crystal reward to Run Crystal;
- generates reward options;
- requires one selection;
- stores chosen reward ID;
- completes the node;
- progresses the map.

Current reward effects remain inactive according to the carried implementation baseline unless later source audit proves otherwise.

Reward flow remains part of the existing run loop.

---

# 41. Run Completion / Defeat / Settlement

## CARRIED SOURCE + CURRENT ROUTING UPDATE

The existing run system supports:

```text
run completed
or
run defeated
```

with Run Crystal settlement/conversion into Meta Crystal.

Historical v2.5 testing confirmed conversion flow and double-process protection.

Current local routing update changes what happens after settlement:

```text
Run Completion / Run Defeat
→ Run Overview
```

or:

```text
Run Completion / Run Defeat
→ Shop
→ Run Overview
```

rather than the old default Shop/Main Menu flow.

The full Stage 1–4 settlement loop was not exhaustively re-run during the 11 August recovery smoke test.

---

# 42. Run Crystal / Meta Crystal

## CARRIED — NO RELEVANT GIT DELTA FOUND
## HISTORICALLY TESTED v2.5

Current existing systems include:

```text
runCrystal
metaCrystal
crystalConversionCompleted
convertedRunCrystal
metaCrystalBeforeConversion
metaCrystalAfterConversion
```

Current prototype historically converts 100% of remaining Run Crystal on completion/defeat.

No later implementation delta to the relevant state/storage modules was identified during this audit.

This reflects prototype implementation, not necessarily all final balancing/presentation details.

---

# 43. Post-Run Shop

## CURRENT LOCAL FLOW + CARRIED SHOP SYSTEM

Current Shop can be opened from:

```text
Run Overview
```

and from a settled:

```text
Run Completion
Run Defeat
```

result scene.

After Shop:

```text
Return to Run Overview
```

Permanent upgrade purchase logic remains carried from the v2.5 implementation.

The local working-tree patch also cleans stale Shop copy so it no longer claims permanent effects are inactive.

---

# 44. Permanent Upgrades

## CARRIED — HISTORICALLY TESTED v2.5

Current permanent upgrade categories:

```text
Guard:
Max HP
ATK
DEF

Archer:
Max HP
ATK
DEF
```

Maximum level:

```text
4
```

Current effects:

```text
Max HP +2 per level
ATK    +1 per level
DEF    +1 per level
```

Move and ATR are unchanged by these upgrades.

Tutorial battle uses base player stats.

Run-stage battle applies persistent upgrades when battle state is created.

No relevant later source delta was found in battle setup/profile storage during this audit.

---

# 45. Profile Persistence

## CARRIED — HISTORICALLY TESTED v2.5

Profile persistence uses browser:

```text
localStorage
```

Historical storage key:

```text
tmtb_profile_v1
```

Persistent profile includes:

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

Current local Run Overview reads profile state such as:

```text
tutorialCompleted
metaCrystal
```

No current evidence suggests server/cloud persistence.

---

# 46. Active Run Persistence

## NOT IMPLEMENTED / CARRIED LIMITATION

Active runtime values such as:

```text
runState
battleState
currentScene
battleIntroNodeId
```

remain in memory.

Continue Run / active-run persistence was not found as a current implemented system.

Refresh/reload can therefore lose the active run flow.

---

# 47. Reset Data

## CARRIED / CURRENT SOURCE

Reset Data currently resets profile progression and clears active in-memory flow state.

Current reset confirmation refers to:

```text
Tutorial progress
Meta Crystal
permanent upgrades
```

After reset, flow returns to Main Menu.

---

# 48. Current Battle HUD

## AUDITED CURRENT SOURCE

Current HUD remains coupled to the old implementation model.

Current displayed/debug concepts include:

```text
ready / exhausted
Origin
Current position
Turn State
```

Current command band contains:

```text
Attack
Skill
Wait
```

Not currently represented as proper current systems:

```text
Team AP
canonical StartGrid label/semantics
global End Turn
Movement Lock state
Intent
Current Target
Wave Telegraph
```

The existing `originTile` display can be useful as a future migration/debugging seed.

---

# 49. Known Stale UI / Copy

## AUDITED CURRENT SOURCE

Some HUD/flow copy remains stale relative to current behaviour.

Known examples include old text implying:

```text
Enemy Phase belum diimplementasikan
```

even though Enemy Phase is functioning.

Tutorial Victory HUD copy may still reference:

```text
Continue to Map Selection
```

while the local current routing is:

```text
Tutorial Victory
→ Run Overview
```

These strings are:

```text
KNOWN STALE COPY
```

and must not be treated as implementation truth.

---

# 50. Skill Status

## NOT IMPLEMENTED AS ACTIVE NORMAL ACTION

The UI/action model contains a Skill option, but the audited current controller only has active normal resolution for:

```text
Attack
Wait
```

Skill remains placeholder/inactive in the current implementation baseline.

---

# 51. Current Presentation Position

The current prototype can still be presented as a functional systems prototype demonstrating:

```text
new-player Tutorial gate
→ Run Overview
→ branching Region 1 journey
→ old turn-based battle core
→ stage reward flow
→ run progression
→ completion/defeat settlement
→ Meta Crystal
→ permanent Shop upgrade
→ future journey with upgrades
```

Important caveats:

- Tutorial is placeholder;
- current combat is pre-v3.1;
- all stages still reuse baseline battle content;
- reward effects remain inactive;
- Skill is inactive;
- active-run persistence is unavailable;
- visuals remain prototype-level;
- advanced current design systems are not implemented.

---

# 52. Runtime Baseline Confirmed 11 August 2026

Game Designer confirmed:

## Startup

```text
Prototype launches normally.
Main Menu opens.
No console error observed.
```

## Run Overview

```text
Run Overview appears.
Navigation works.
Shop relocation flow is functional.
```

## Tutorial Battle

```text
Tutorial battle can be entered.
```

## Current Player Turn

Observed current prototype matches old implementation:

```text
movement/reposition has no Shared AP
Attack / Wait commit/exhaust unit
all living Player Units completed/exhausted
→ Enemy Phase
```

## Enemy Phase

Player-visible behaviour:

```text
single Enemy Phase
→ resolution
→ enemies have moved and attacked
```

No readable Intent or v3.1 sequential per-enemy activation presentation exists.

## Result / Navigation

Battle result and tested post-battle navigation remained functional.

---

# 53. What Was NOT Fully Re-Tested During This Recovery Audit

The 11 August runtime pass was a baseline/smoke validation, not a complete v2.5 regression suite.

Not exhaustively re-run during this audit:

- every Stage 2/3 branch combination;
- full Stage 1→4 completion path;
- all defeat settlement paths;
- every reward option;
- every Shop edge case;
- all permanent-upgrade levels;
- persistence failure/fallback cases;
- all Cover/path edge cases;
- every enemy tie-break case.

Where these systems are documented here, their evidence may be:

```text
historically tested v2.5
+
no relevant Git delta found
```

rather than newly reconfirmed in every edge case.

---

# 54. Current Design-vs-Implementation Gap

Current canonical Game Design is v3.1.

Current prototype is still:

```text
Post-v2.5 / Pre-v3 Combat Migration
```

Major current gaps:

| Domain | Current Prototype | Design v3.1 Target |
|---|---|---|
| Player Turn ownership | per-unit Ready/Exhausted | party-wide Player Turn |
| Shared resource | none | Team AP = Living Players × 2 |
| positional anchor | `originTile` | StartGrid semantics |
| movement AP | free | leave StartGrid spends AP |
| movement refund | none | return-before-commit refund |
| Attack commitment | Exhaust unit | Movement lock only |
| repeated action | blocked | allowed if AP/legal |
| Wait | Exhaust unit | old Wait superseded |
| End Turn | automatic all Exhausted | explicit global End Turn |
| LOS | no separate authoritative validity | ranged requires LOS |
| enemy execution | all Move then all Attack | sequential full activation |
| enemy order | array/insertion order | explicit Spawn Order baseline |
| Current Target | procedural/non-readable | actual readable target state |
| Intent | absent | required |
| Dynamic Intent | absent | required |
| Status | absent from new tutorial validation | required advanced concept |
| Charge | absent | required advanced concept |
| Wave Telegraph | absent | required |
| Tutorial | placeholder | corrected continuous T1–T3 flow |
| Unity-only onboarding | absent | FLOW SIMULATION where appropriate |

---

# 55. Useful Existing Migration Seeds

Current implementation already contains reusable foundations:

```text
originTile
→ candidate StartGrid migration seed

BFS movement
→ reusable prototype tactical movement foundation

attack/damage pipeline
→ reusable after action-state decoupling

Cover/path geometry
→ useful Tactical Space foundation

Full Cover targetable + 0 damage
→ already supports validity/effectiveness separation

deterministic Sword movement
→ useful readable-AI foundation

enemySpawns / enemyUnits array order
→ candidate explicit Spawn Order seed

JSON definition/data loading
→ reusable for testing/migration
```

These are implementation seeds.

They are not automatically canonical implementations.

---

# 56. Current Major Limitations

## Combat Migration

- no Shared Team AP;
- no canonical StartGrid commitment/refund;
- old Exhaustion remains authoritative;
- no global End Turn;
- repeated player actions unavailable;
- Wait remains old implementation;
- distinct LOS is missing;
- no Intent / Dynamic Intent;
- no sequential full enemy activation;
- no Status/Charge/Wave.

## Tutorial

- placeholder battle;
- no corrected T1–T3 authored flow;
- no Flow Simulation layer;
- no Practice Target.

## Content

- all stages still use Stage 1 battle data;
- Sword-only baseline enemy content;
- Stage 4 lacks unique mini-boss encounter;
- objective variety absent;
- difficulty is not deeply reflected in battle content.

## Player Systems

- Skill inactive;
- reward effects inactive;
- HP carry absent.

## Persistence

- active run not persisted;
- Continue Run absent;
- Run History absent.

## Presentation

- prototype-level visuals;
- stale HUD copy remains;
- debug/old Ready–Exhausted terminology remains;
- final UI/UX not represented.

---

# 56A. Known Low-Risk Stale Code Reference

## AUDITED SOURCE NOTE — NEEDS VERIFICATION BEFORE CLEANUP

Current audited `main.js` contains a callback reference to:

```text
finishDefeatedRunToMainMenu()
```

No matching function definition was found in the audited file.

The current uncommitted flow diff appears to remove the related `run-defeat-main-menu` button, so this path is likely unreachable in the tested baseline.

Runtime smoke test produced no error.

Classification:

```text
KNOWN STALE / LIKELY UNREACHABLE CODE REFERENCE
```

Do not remove or rewrite it from documentation alone.

Verify actual current UI reachability/source before cleanup.

---

# 57. Current Documentation Status

Current design recovery:

```text
Game Design Context v3.1
CURRENT canonical target

Game Design Decisions v3.1
CURRENT canonical snapshot
```

Supporting design/evidence:

```text
Enemy Design Discussion Handoff v4
Tutorial Design Corrected Handoff v1
Prototype Recovery / Repository Audit Handoff v1
```

Historical implementation package:

```text
handoff-v2.5/*
```

The 10-file Handoff Package v3.0 has been authored, completed its first cross-document consistency audit, and completed the resulting fix pass.

The new-chat recovery simulation has passed. Current next project step is Game Designer review followed by final local repository placement and Git verification.

---

# 58. Current Work Status

Completed in the current recovery cycle:

```text
Game-design recovery/migration
Enemy design recovery
Tutorial T1–T3 correction
Prototype Validation Scope correction
Repository/source/runtime audit
Documentation inventory
Documentation migration matrix
10-file Handoff Package v3.0 authoring
first cross-document consistency audit
```

Cross-document fix pass:

```text
DONE
```

New-chat recovery simulation:

```text
PASSED
```

Current next:

```text
Game Designer review
→ local repository placement
→ Git verification
```

No combat migration should be considered started merely because migration gaps are now documented.

---

# 59. Durable Resume Reference

For the current project resume point, use:

```text
README.md
+
TMTB_PROGRESS_AND_BACKLOG_v3.0.md
+
TMTB_CHAT_HANDOFF_v3.0.md
```

Current post-package direction:

```text
new-chat recovery simulation
→ Game Designer review / local placement / Git verification
→ Prototype migration planning
→ V1 Player Turn Economy
→ fresh relevant source audit
→ choose the smallest coherent technical checkpoint
```

Do not infer that combat migration has started merely because the migration target is documented.
---

# 60. Current State Summary

```text
REPOSITORY
main / origin-main aligned at audit
post-v2.5 deployment commits present
Run Overview local work uncommitted

DEPLOYMENT
Vite
GitHub Pages workflow
BASE_URL-aware JSON loading

META / FLOW
Title                         IMPLEMENTED
Main Menu                     IMPLEMENTED
Tutorial Gate                 IMPLEMENTED
Run Overview                  IMPLEMENTED / RUNTIME CONFIRMED / UNCOMMITTED
Shop from Run Overview        IMPLEMENTED / RUNTIME CONFIRMED / UNCOMMITTED
Run Generation                CARRIED
Branching Map                 CARRIED
Battle Intro                  CARRIED
Reward Selection              CARRIED
Run Completion                CARRIED
Run Defeat                    CARRIED
Crystal Conversion            CARRIED
Permanent Shop Upgrade        CARRIED / historically tested
Profile Persistence           CARRIED / historically tested

BATTLE
old Ready / Exhausted model   IMPLEMENTED / CONFIRMED
originTile                    IMPLEMENTED
BFS Movement                  IMPLEMENTED / CONFIRMED
Attack                        IMPLEMENTED / CONFIRMED
Wait                          IMPLEMENTED / CONFIRMED
Skill                         INACTIVE
ATR                           IMPLEMENTED
Cover                         IMPLEMENTED
distinct LOS                  NOT IMPLEMENTED
Enemy Move-all/Attack-all     IMPLEMENTED / CONFIRMED
Intent                        NOT IMPLEMENTED
Dynamic Intent                NOT IMPLEMENTED
Shared AP                     NOT IMPLEMENTED
StartGrid v3.1 semantics      NOT IMPLEMENTED
global End Turn               NOT IMPLEMENTED
Status / Charge               NOT IMPLEMENTED
Wave Telegraph                NOT IMPLEMENTED

TUTORIAL
placeholder battle            IMPLEMENTED / CONFIRMED
corrected T1–T3               NOT IMPLEMENTED
Unity FLOW SIMULATION         NOT IMPLEMENTED

CONTENT
unique stage battles          DEFERRED
enemy variety                 DEFERRED
objective variety             DEFERRED
reward effects                INACTIVE
HP carry                      DEFERRED
active-run persistence        NOT IMPLEMENTED
```

Current implementation baseline:

> **Post-v2.5 / Pre-v3 Combat Migration — verified 11 August 2026.**

---

**End of Current State**
