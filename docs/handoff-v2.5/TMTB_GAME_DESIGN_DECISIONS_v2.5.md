# TMTB Game Design Decisions v2.5

**Project:** TMTB / BeCan Prototype  
**Handoff Version:** v2.5  
**Document Type:** Game Design Decision Snapshot  
**Milestone:** Full Game Loop Core  
**Purpose:** Mendokumentasikan rule gameplay, progression, economy, dan keputusan desain aktif pada checkpoint v2.5 serta membedakan keputusan yang locked, tentative, deferred, dan masih open.  
**Last Updated:** 17 July 2026

---

# 1. Decision Status Legend

Gunakan empat status berikut.

## LOCKED

Keputusan aktif yang saat ini menjadi rule prototype dan harus dianggap benar sampai ada keputusan baru.

## TENTATIVE

Keputusan aktif yang sudah digunakan, tetapi angka atau rule masih boleh berubah setelah playtest, balancing, atau feedback akademik.

## DEFERRED

Keputusan atau sistem yang sengaja ditunda demi prioritas milestone.

## OPEN QUESTION

Belum ada keputusan final.

---

# 2. Prototype Design Scope

## LOCKED — Prototype Purpose

Prototype TMTB v2.5 adalah prototype 2D/simulatif untuk memvalidasi:

- mechanic;
- combat flow;
- run progression;
- branching;
- reward flow;
- meta progression;
- balancing awal;
- functional screen requirements.

Prototype ini bukan:

- Unity final;
- final 3D implementation;
- final UI/UX;
- final art production.

---

# 3. Unit Activation

## LOCKED

Satu unit activation terdiri dari:

```text
reposition
→ one action
```

Action dasar:

```text
Attack
Skill
Wait
```

Saat ini hanya:

```text
Attack
Wait
```

yang aktif.

Setelah Attack atau Wait:

```text
turnState = exhausted
```

Unit yang belum exhausted dapat dipilih kembali.

---

# 4. Player Turn

## LOCKED

Player Turn berlangsung sampai semua living player units exhausted.

Flow:

```text
ready units available
→ player performs activations
→ all living players exhausted
→ Enemy Phase
```

Unit yang mati tidak dihitung sebagai unit yang harus menyelesaikan activation.

---

# 5. Enemy Turn / Enemy Phase

## LOCKED

Setelah semua player unit exhausted:

```text
Enemy Phase begins
```

Current enemy flow:

```text
all living enemies move
→ all living enemies attempt attack
→ if all players defeated: battle defeat
→ otherwise next Player Turn
```

Turn count bertambah setelah Enemy Phase selesai.

---

# 6. Turn Count

## LOCKED

Turn count:

```text
starts at 1
```

dan bertambah:

```text
Enemy Phase complete
→ turnCount + 1
```

---

# 7. Unit Turn State

## LOCKED

Current unit turn states:

```text
ready
positioned
exhausted
```

### ready

Unit belum melakukan action.

### positioned

Unit sudah berpindah posisi tetapi belum melakukan action.

### exhausted

Unit sudah menyelesaikan Attack atau Wait.

---

# 8. Movement Origin Rule

## LOCKED

Movement area dihitung dari:

```text
originTile
```

pada activation/turn tersebut.

Reposition sementara tidak mengubah origin.

Pada Player Turn baru:

```text
originTile = current tile
```

---

# 9. Movement Traversal Rules

## LOCKED

Traversal:

```text
obstacle
→ blocked

enemy
→ blocked

ally
→ passable
```

Destination:

```text
obstacle
→ invalid

enemy occupied tile
→ invalid

ally occupied tile
→ invalid
```

Dua unit tidak boleh berakhir pada tile yang sama.

---

# 10. Movement Algorithm

## LOCKED FOR v2.5 IMPLEMENTATION

Reachable movement menggunakan BFS dengan empat arah orthogonal.

Movement range memakai:

```text
derivedStats.move
```

Ini adalah implementation rule aktif v2.5.

---

# 11. ATR Definition

## LOCKED

ATR berarti:

```text
Attack Range
```

Target range dihitung menggunakan jarak Euclidean antar posisi tile unit:

```text
Math.hypot(deltaX, deltaY)
```

Secara desain, ini merepresentasikan radius horizontal flat antar pusat tile.

---

# 12. Melee Path Rule

## LOCKED

Melee target harus:

- berada di dalam ATR;
- tidak terhalang interior obstacle.

Jika line hanya menyentuh:

- edge;
- corner;

maka target tetap valid.

Jika line melewati interior obstacle:

```text
target invalid
```

---

# 13. Ranged Path and Cover Rule

## LOCKED

Ranged target tetap dapat dipilih selama berada di ATR meskipun line melewati cover.

Outcome:

```text
clear
partial cover
full cover
```

Partial cover:

```text
damage reduced before DEF
```

Full cover:

```text
damage = 0
```

Player tetap boleh mengonfirmasi attack yang menghasilkan 0 damage.

Action tetap dikonsumsi.

---

# 14. Damage Formula

## LOCKED FOR CURRENT PROTOTYPE

Current formula:

```text
Final Damage =
floor(
  max(
    0,
    ATK × (1 - Cover Percentage) - DEF
  )
)
```

Current cover percentages:

```text
O30 = 30%
O70 = 70%
OF  = 100%
```

---

# 15. Player Unit Baseline Stats

## LOCKED FOR v2.5 BASELINE

### Guard

```text
Max HP: 25
ATK: 5
DEF: 4
Move: 3
ATR: 1.5
Attack Type: melee
```

### Archer

```text
Max HP: 18
ATK: 7
DEF: 1
Move: 4
ATR: 3.0
Attack Type: ranged
```

---

# 16. Enemy Baseline Stats

## LOCKED FOR v2.5 BASELINE

### Sword Enemy

```text
Max HP: 16
ATK: 6
DEF: 2
Move: 3
ATR: 1.5
Attack Type: melee
```

---

# 17. Permanent Upgrade Effects

## LOCKED FOR v2.5 IMPLEMENTATION

Permanent upgrade effects:

```text
Max HP +2 per level
ATK    +1 per level
DEF    +1 per level
```

Move dan ATR tidak berubah.

Maximum level:

```text
4
```

---

# 18. Permanent Upgrade Costs

## TENTATIVE

Current costs:

```text
30
60
100
150
```

per level progression:

```text
0 → 1 = 30
1 → 2 = 60
2 → 3 = 100
3 → 4 = 150
```

Costs sudah aktif dan persistent, tetapi economy masih perlu balancing.

---

# 19. DEF Upgrade Strength

## OPEN QUESTION

Current implementation:

```text
DEF +1 per level
```

Namun masih terbuka apakah scaling ini terlalu kuat.

Perlu diuji melalui balancing dan run economy.

---

# 20. Tutorial Gate

## LOCKED

New player flow:

```text
tutorialCompleted = false
→ Start Journey
→ Tutorial Battle
```

Returning player flow:

```text
tutorialCompleted = true
→ Start Journey
→ New Run
```

---

# 21. Tutorial Content

## DEFERRED

Current tutorial:

```text
placeholder battle
```

Scripted tutorial belum aktif.

Deferred tutorial goals:

- guided movement;
- unit switching;
- action menu;
- basic attack;
- ATR;
- cover;
- Wait;
- exhaustion;
- phase explanation.

---

# 22. Tutorial Defeat Rule

## LOCKED

Tutorial defeat:

```text
retry tutorial
```

Tidak:

- menggagalkan run;
- mengonversi Crystal;
- membuka Shop.

---

# 23. Region 1 Structure

## LOCKED

Region 1:

```text
Stage 1 fixed
→ 2 unique Stage 2 variants from A/B/C
→ 2 unique Stage 3 variants from A/B/C
→ Stage 4 fixed
```

Semua generated nodes terlihat sejak awal.

---

# 24. Stage Variant Selection

## LOCKED

Stage 2:

```text
random 2 unique from A/B/C
```

Stage 3:

```text
random 2 unique from A/B/C
```

Generation terjadi sekali saat run dibuat.

---

# 25. Stage 1 Identity

## LOCKED

```text
Stage 1
Lumberjack / Carpentry Area
```

Objective:

```text
eliminate_all
```

---

# 26. Stage 2 Identities

## LOCKED AS CURRENT NODE METADATA

```text
Stage 2A — Village Outskirts
Stage 2B — Village Housing
Stage 2C — Village Crossroads
```

---

# 27. Stage 3 Identities

## LOCKED AS CURRENT NODE METADATA

```text
Stage 3A — Farmstead Entrance
Stage 3B — Rice Field Path
Stage 3C — Irrigation Fields
```

---

# 28. Stage 4 Identity

## LOCKED AS CURRENT NODE METADATA

```text
Stage 4
River Bridge Approach
```

Node type:

```text
mini_boss
```

Actual mini-boss encounter belum ada.

---

# 29. Node Visibility

## LOCKED

Semua generated nodes dapat dilihat dan dipreview.

Hanya node dengan status:

```text
available
```

yang dapat dimasuki.

---

# 30. Branch Commitment

## LOCKED

Branch choice dikunci ketika battle dimulai, bukan ketika:

- preview node;
- membuka Battle Intro.

Saat player mulai battle pada satu sibling node:

```text
selected node
→ current

other available sibling
→ blocked
```

Blocked node tetap dapat dipreview.

---

# 31. Node Status Model

## LOCKED FOR CURRENT PROTOTYPE

Current statuses:

```text
future
available
current
completed
blocked
failed
```

`failed` digunakan setelah run defeat.

---

# 32. Battle Intro

## LOCKED

Setiap run stage melewati Battle Intro.

Battle Intro menampilkan:

- stage;
- location;
- difficulty;
- objective;
- node type;
- Crystal reward.

---

# 33. Current Stage Content Reuse

## TENTATIVE IMPLEMENTATION LIMITATION

Saat ini semua stages masih memakai:

```text
Stage 1 map
Stage 1 encounter
```

Ini bukan final content design.

Unique stage maps dan encounters sengaja ditunda.

---

# 34. Unique Maps

## DEFERRED

Future goal:

- unique Stage 1 map;
- Stage 2A/B/C variation;
- Stage 3A/B/C variation;
- unique Stage 4 map.

---

# 35. Unique Encounters

## DEFERRED

Future goal:

- encounter data per node;
- enemy composition variation;
- spawn variation;
- Stage 4 mini-boss setup.

---

# 36. Difficulty

## TENTATIVE

Current difficulty values:

```text
easy
normal
hard
```

Saat ini sebagian besar berfungsi sebagai:

- label;
- node metadata;
- Crystal risk/reward indicator.

Difficulty belum benar-benar mengubah battle encounter.

---

# 37. Difficulty Behavior

## OPEN QUESTION

Belum final apakah difficulty akan ditentukan melalui:

- enemy count;
- enemy stat scaling;
- enemy role composition;
- spawn disadvantage;
- map danger;
- kombinasi di atas.

---

# 38. Crystal Reward by Node

## TENTATIVE

Current values:

```text
Stage 1 = 20

Stage 2A = 25
Stage 2B = 30
Stage 2C = 40

Stage 3A = 35
Stage 3B = 45
Stage 3C = 55

Stage 4 = 70
```

Values aktif dalam current run progression tetapi masih perlu economy balancing.

---

# 39. Reward Selection Requirement

## LOCKED

Setelah run-stage victory:

```text
reward must be selected
```

sebelum progression dilanjutkan.

---

# 40. Number of Reward Options

## LOCKED FOR v2.5

Setiap victory memberikan:

```text
4 unique reward options
```

dari current placeholder reward pool.

---

# 41. Reward Effects

## DEFERRED

Current reward selection hanya menyimpan:

```text
rewardId
```

Efek reward belum aktif.

Deferred effects termasuk:

- Guard Max HP;
- Guard ATK;
- Guard DEF;
- Archer Max HP;
- Archer ATK;
- Archer DEF;
- Party Recovery;
- Bonus Run Crystal.

---

# 42. Reward Stacking

## OPEN QUESTION

Current implementation dapat menampilkan reward yang pernah dipilih pada stage sebelumnya karena setiap Reward Selection membuat empat opsi baru tanpa mengecualikan `chosenRewardIds`.

Belum diputuskan apakah behavior tersebut akan menjadi final design.

Masih terbuka:

- apakah reward dapat muncul berulang antar-stage;
- apakah duplicate reward boleh dipilih lebih dari sekali dalam satu run;
- bagaimana stacking dihitung;
- apakah ada maximum stack.

---

# 43. Stage 4 Reward

## LOCKED

Stage 4 tetap memberikan Reward Selection sebelum run completion pada v2.5.

Behavior yang locked:

```text
Stage 4 victory
→ Reward Selection
→ choose reward
→ Run Completion
```

Rationale jangka panjang untuk behavior ini, termasuk kemungkinan continuation beyond Region 1, belum ditetapkan sebagai keputusan desain final dalam handoff ini.

---

# 44. Run Crystal

## LOCKED

Run Crystal adalah currency sementara selama active run.

Run Crystal:

```text
earned from stage victory
→ stored in runState
```

---

# 45. Meta Crystal

## LOCKED

Meta Crystal adalah permanent currency.

Meta Crystal disimpan pada profile dan digunakan untuk:

```text
Post-Run Shop
```

---

# 46. Crystal Conversion

## TENTATIVE

Current rule:

```text
100% Run Crystal
→ Meta Crystal
```

berlaku saat:

```text
run completed
run defeated
```

Current implementation has no conversion penalty.

---

# 47. Crystal Conversion Rate

## OPEN QUESTION

Belum final apakah:

```text
100%
```

akan tetap digunakan.

Future possibilities:

- defeat penalty;
- completion bonus;
- variable conversion rate.

---

# 48. Run Completion

## LOCKED

Run dianggap completed setelah:

```text
Stage 4 completed
→ Stage 4 reward chosen
→ no pending reward
```

---

# 49. Run Defeat

## LOCKED

Run defeat terjadi ketika seluruh player units kalah pada run-stage battle.

Current node:

```text
current
→ failed
```

Run:

```text
active
→ defeated
```

---

# 50. Post-Run Shop Access

## LOCKED

Shop hanya tersedia setelah:

```text
run completion
```

atau:

```text
run defeat
```

dan setelah Crystal conversion selesai.

Shop tidak tersedia langsung dari Main Menu pada v2.5.

---

# 51. Main Menu Shop Access

## OPEN QUESTION

Belum diputuskan apakah future build akan mengizinkan Shop dibuka dari Main Menu.

Current v2.5 answer:

```text
NO
```

---

# 52. Permanent Upgrade Persistence

## LOCKED

Permanent upgrades:

```text
persist across runs
```

dan disimpan di profile.

Journey baru menggunakan upgrades tersebut.

---

# 53. Tutorial Permanent Upgrade Rule

## LOCKED

Tutorial menggunakan base stats.

Permanent upgrades tidak diterapkan pada tutorial.

---

# 54. Run Battle Permanent Upgrade Rule

## LOCKED

Run-stage battles menggunakan permanent upgrades.

Player units receive upgrades.

Enemy units do not.

---

# 55. HP at Battle Start

## LOCKED FOR v2.5

Setiap battle dimulai dengan:

```text
currentHP = current maxHP
```

Termasuk setelah permanent Max HP upgrade.

---

# 56. HP Carry

## DEFERRED

HP carry antar-stage belum aktif.

Future system may include:

- carried damage;
- recovery;
- death consequences;
- rest/healing node;
- Party Recovery reward.

---

# 57. Unit Death Across Stages

## OPEN QUESTION

Belum diputuskan apakah unit yang kalah:

- tetap unavailable;
- kembali di stage berikutnya;
- revive dengan penalty;
- dipulihkan sebagian.

---

# 58. Skill System

## DEFERRED

Action slot `Skill` ada di UI.

Skill resolver belum aktif.

Future decisions needed:

- Guard skill;
- Archer skill;
- cooldown/cost;
- targeting;
- ATR;
- cover interaction;
- path interaction.

---

# 59. Objective Variety

## DEFERRED

Current objective:

```text
eliminate_all
```

Potential future objectives:

```text
survive_turns
defend_area
reach_destination
defeat_priority_target
escape
```

---

# 60. Enemy Variety

## DEFERRED

Current enemy variety:

```text
Sword Enemy only
```

Future candidates:

- ranged;
- tank;
- fast;
- mini-boss.

---

# 61. Enemy AI

## LOCKED FOR CURRENT SIMPLE AI

Current AI behavior:

```text
choose nearest living player
→ move closer
→ attack nearest valid target
```

Attack target tie-breaking:

```text
nearest
→ lower HP
→ deterministic battleUnitId
```

This is current baseline AI, not final role-based AI.

---

# 62. Branch Consequences

## DEFERRED

Current branch consequence:

```text
sibling route blocked
```

Deferred deeper consequences:

- route-specific encounters;
- route-specific rewards;
- route modifiers;
- Stage 2 influencing Stage 3;
- route influencing Stage 4.

---

# 63. Event Nodes

## DEFERRED

Potential future nodes:

- Rest;
- Treasure;
- Risk/Reward Event;
- In-Run Shop;
- Story/Dialogue.

---

# 64. Active Run Persistence

## DEFERRED

Refresh currently discards active run.

Future system may save:

- runState;
- selected node;
- route status;
- Run Crystal;
- chosen rewards;
- party HP;
- scene;
- possibly battle state.

---

# 65. Continue Run

## DEFERRED

Main Menu currently has no Continue Run.

Depends on active run persistence.

---

# 66. Active Battle Persistence

## OPEN QUESTION

Belum diputuskan apakah future save system harus menyimpan battle state mid-combat.

---

# 67. Run History

## DEFERRED

Run Notes / Run History menu exists but is disabled.

Potential future stored data:

- result;
- route;
- last stage;
- rewards;
- converted Crystal;
- date;
- duration.

---

# 68. Settings

## DEFERRED

Settings menu exists but disabled.

Potential future scope:

- audio;
- fullscreen;
- animation speed;
- control reference;
- safer reset confirmation.

---

# 69. Credits

## DEFERRED

Credits menu exists but disabled.

Potential content:

- project/team roles;
- academic prototype note;
- asset attribution;
- software/library attribution.

---

# 70. Quit

## OPEN QUESTION

For browser build, Quit may:

- remain disabled;
- be removed;
- become Exit to Title.

---

# 71. Stat Explanation UI

## DEFERRED

Current battle HUD shows final derived stats.

Future desired breakdown:

```text
Base
Permanent Bonus
Run Bonus
Final
```

---

# 72. Battle Feedback

## DEFERRED

Future candidates:

- clearer damage numbers;
- defeated indicator;
- animation;
- attack prediction;
- cover icon;
- invalid target reason;
- enemy intent.

---

# 73. Map Presentation

## TENTATIVE

Current Region Graph is horizontal:

```text
Stage 1
→ Stage 2 branches
→ Stage 3 branches
→ Stage 4
```

Narrow screens use horizontal scrolling.

Current layout is functional but hard-coded.

---

# 74. Dynamic Region Graph

## DEFERRED

Future goal:

```text
render graph from nodeConnections
```

instead of hard-coded coordinates and connection lines.

---

# 75. Run Seed

## DEFERRED

Run generation currently uses random selection without exposed/debuggable seed.

Future run seed may help:

- reproducibility;
- debugging;
- playtest comparison.

---

# 76. Battle Rule Sharing

## LOCKED AS DESIGN PRINCIPLE

Manual play and future auto-simulation should share the same core rules where possible.

Current implementation already shares:

- movement;
- ATR;
- path;
- damage;

between player and enemy systems.

This principle should be preserved.

---

# 77. UI Responsibility Principle

## LOCKED AS DESIGN PRINCIPLE

UI should:

```text
read state
render information
collect input
```

UI should not become the authoritative source for:

- damage;
- movement validity;
- target validity;
- progression;
- persistence.

---

# 78. Data-Driven Direction

## LOCKED AS DESIGN PRINCIPLE

Static definitions should preferentially live in:

```text
JSON / config
```

Runtime state should remain separate.

Current implementation is only partially data-driven and still has Stage 1 hard-coding.

---

# 79. Telemetry

## DEFERRED

Telemetry/evaluation is part of long-term prototype purpose but is not active in v2.5.

Preferred direction:

```text
JSON export first
→ CSV later
```

when telemetry structure is stable.

---

# 80. Auto-Simulation

## DEFERRED

Auto-simulation is not active.

Future direction should reuse JavaScript/Node.js core rules where practical.

---

# 81. Current Design Decision Summary

## LOCKED

```text
Unit activation = reposition + one action
Attack/Wait exhaust unit
Player Turn ends when all living players exhausted
Enemy Phase follows
Turn count increments after Enemy Phase
BFS movement
Ally traversable
Opponent blocks traversal
No stacking
Euclidean ATR
Melee interior-obstacle block
Ranged cover remains targetable
Full cover may produce 0 damage and still consume action
Current damage formula
Baseline Guard/Archer/Sword Enemy stats
Tutorial gate
Tutorial defeat retry
Region 1 branching structure
Node preview for all generated nodes
Only available nodes enterable
Branch commitment at battle start
Reward required after victory
4 reward options
Stage 4 reward before completion
Run defeat settlement
Post-run-only Shop
Permanent upgrades persist
Tutorial ignores permanent upgrades
Run stages apply permanent upgrades
Every battle starts full HP
```

## TENTATIVE

```text
Permanent upgrade costs
Difficulty labels and Crystal values
100% Crystal conversion
Current content reuse as temporary implementation
Current horizontal map presentation
```

## DEFERRED

```text
Unique maps
Unique encounters
Enemy variety
Active reward effects
Skill system
Scripted tutorial
HP carry
Objective variety
Branch consequences
Event nodes
Active run persistence
Continue Run
Run History
Settings
Credits
Stat breakdown UI
Battle feedback polish
Dynamic region graph
Run seed
Telemetry
Auto-simulation
```

## OPEN QUESTION

```text
DEF upgrade strength
Future Crystal conversion rate
Main Menu Shop access
HP carry final rule
Unit death across stages
Reward stacking
Difficulty implementation
Active battle persistence
Quit behavior
```

---

# 82. Principle for Future Changes

When a design rule changes:

1. update this document;
2. mark old status correctly;
3. verify whether source code matches the new design;
4. update Current State if behavior changed;
5. update State & Data Model if fields changed;
6. update Progress & Backlog if task status changed.

Do not silently treat implementation behavior as a design decision when the rule was never intentionally approved.

This document represents the game design decision snapshot of **TMTB Prototype v2.5 — Full Game Loop Core**.
