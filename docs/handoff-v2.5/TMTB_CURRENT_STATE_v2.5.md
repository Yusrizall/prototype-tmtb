# TMTB Prototype Current State v2.5

**Project:** TMTB / BeCan Prototype  
**Checkpoint:** Prototype v2.5 — Full Game Loop Core  
**Status:** Functional full-loop core; ready for presentation and stabilization  
**Project Root:** `C:\Datas\prototype-tmtb`  
**Last Updated:** 17 July 2026

---

# 1. Purpose of This Document

Dokumen ini menjelaskan kondisi implementasi aktual prototype pada checkpoint v2.5.

Dokumen ini menjawab:

> Prototype saat ini sebenarnya sudah dapat melakukan apa?

Dokumen ini tidak berfungsi sebagai roadmap lengkap.  
Roadmap dan backlog berada di:

```text
TMTB_PROGRESS_AND_BACKLOG_v2.5.md
```

Jika dokumen ini bertentangan dengan source code aktual, lakukan audit terhadap source code terbaru.

---

# 2. Technology and Environment

Prototype menggunakan:

- Vite
- Vanilla JavaScript
- HTML
- CSS
- JSON
- `fetch`
- browser `localStorage`

Environment yang terakhir terkonfirmasi selama pengembangan:

```text
Node.js: v24.16.0
npm: 11.13.0
Local development server:
http://localhost:5173/
```

Repository sekarang dikelola menggunakan Git dan remote repository GitHub.

Workflow normal:

```text
Save
→ Test
→ Commit
→ Push
```

---

# 3. Current Milestone

Current milestone:

```text
Prototype v2.5
Full Game Loop Core
```

Prototype sudah memiliki loop utama berikut:

```text
Title
→ Main Menu
→ Tutorial Gate
→ Tutorial Battle untuk pemain baru
→ Run Generation
→ Map Selection
→ Battle Intro
→ Stage Battle
→ Reward Selection
→ Map Progression
→ Stage 1–4
→ Run Completion atau Run Defeat
→ Run Crystal Conversion
→ Post-Run Shop
→ Permanent Upgrade
→ Main Menu
→ Journey berikutnya menggunakan upgrade
```

Prototype v2.5 merupakan loop permainan utuh pertama.

---

# 4. Current Scene Flow

Scene utama yang saat ini digunakan:

```text
title
main_menu
map_selection
battle_intro
battle
reward_selection
run_completion
run_defeat
post_run_shop
```

Scene dikontrol dari `src/main.js`.

---

# 5. Title Screen

Status: **Implemented**

Behavior:

- Prototype dimulai pada Title Screen.
- Klik pada Title Screen membuka Main Menu.
- Input keyboard apa pun pada Title Screen juga membuka Main Menu.

---

# 6. Main Menu

Status: **Implemented**

Menu aktif:

```text
Start Journey
Reset Data
```

Menu yang masih disabled:

```text
Run Notes / Run History
Settings
Credits
Quit
```

`Start Journey` memeriksa status tutorial.

`Reset Data` menghapus profile progression prototype setelah confirmation dialog.

Data yang di-reset:

- tutorial completion;
- Meta Crystal;
- permanent upgrades.

---

# 7. Tutorial Gate

Status: **Implemented**

Profile memiliki flag:

```text
tutorialCompleted
```

Behavior:

```text
tutorialCompleted = false
→ Start Journey
→ Tutorial Battle
```

```text
tutorialCompleted = true
→ Start Journey
→ Generate New Run
→ Map Selection
```

Tutorial saat ini masih berupa **placeholder battle**, bukan scripted tutorial.

### Tutorial Victory

Victory:

```text
mark tutorial completed
→ save profile
→ create new run
→ open map selection
```

### Tutorial Defeat

Defeat:

```text
retry tutorial battle
```

Tutorial defeat tidak menyelesaikan atau menggagalkan run karena run belum dimulai.

---

# 8. Run Generation

Status: **Implemented**

Region 1 menggunakan struktur:

```text
Stage 1 fixed
→ 2 unique Stage 2 variants dari pool A/B/C
→ 2 unique Stage 3 variants dari pool A/B/C
→ Stage 4 fixed
```

Stage 2 dan Stage 3 dipilih secara random ketika run dibuat.

Generated run menyimpan:

- generated nodes;
- node connections;
- selected node;
- current node;
- completed nodes;
- blocked nodes;
- chosen rewards;
- Run Crystal;
- run result;
- Crystal conversion state.

Active run saat ini hanya disimpan di memory.

Refresh browser akan membuang active run.

---

# 9. Region 1 Nodes

## Stage 1

```text
Stage 1
Lumberjack / Carpentry Area
Difficulty: normal
Crystal Reward: 20
```

## Stage 2 Pool

```text
Stage 2A — Village Outskirts
Difficulty: easy
Crystal Reward: 25

Stage 2B — Village Housing
Difficulty: normal
Crystal Reward: 30

Stage 2C — Village Crossroads
Difficulty: hard
Crystal Reward: 40
```

Dua variant unik dipilih per run.

## Stage 3 Pool

```text
Stage 3A — Farmstead Entrance
Difficulty: easy
Crystal Reward: 35

Stage 3B — Rice Field Path
Difficulty: normal
Crystal Reward: 45

Stage 3C — Irrigation Fields
Difficulty: hard
Crystal Reward: 55
```

Dua variant unik dipilih per run.

## Stage 4

```text
Stage 4
River Bridge Approach
Node Type: mini_boss
Difficulty: hard
Crystal Reward: 70
```

Saat ini Stage 4 belum memiliki encounter mini-boss unik.

---

# 10. Map Selection and Branching

Status: **Implemented**

Semua generated nodes terlihat sejak awal.

Node dapat dipreview tanpa harus tersedia.

Hanya node dengan status:

```text
available
```

yang dapat dimasuki.

Status node yang digunakan:

```text
future
available
current
completed
blocked
failed
```

Branch commitment terjadi ketika battle benar-benar dimulai.

Saat player memasuki salah satu node Stage 2 atau Stage 3:

- node tersebut menjadi `current`;
- sibling node lain pada stage slot yang sama menjadi `blocked`.

Blocked node tetap dapat dilihat pada map tetapi tidak dapat dimasuki.

---

# 11. Battle Intro

Status: **Implemented**

Setiap run stage melewati Battle Intro.

Battle Intro menampilkan:

- stage label;
- stage name;
- difficulty;
- encounter type;
- objective;
- Crystal reward;
- current node status.

Battle Intro juga memberi tahu bahwa encounter masih menggunakan setup Stage 1 sebagai placeholder.

---

# 12. Battle Core

Status: **Implemented and tested as Phase 1 battle core**

Battle core saat ini mencakup:

- player movement;
- BFS-based reachable movement;
- movement dari `originTile`;
- ally traversal;
- occupied destination restriction;
- obstacle blocking;
- opponent blocking;
- unit switching;
- action menu;
- Wait;
- basic Attack;
- ATR targeting;
- target cycling;
- melee/ranged path behavior;
- cover calculation;
- damage resolution;
- HP reduction;
- unit defeat;
- exhaustion;
- player phase completion;
- enemy movement;
- enemy attack;
- enemy phase;
- turn increment;
- `eliminate_all` objective;
- victory;
- defeat;
- battle result state.

### Battle activation

Player unit dapat:

```text
reposition
→ perform one action
```

Action aktif:

```text
Attack
Wait
```

`Skill` masih placeholder dan belum memiliki resolver aktif.

Attack atau Wait membuat unit exhausted.

Ketika semua living player units exhausted:

```text
Player Phase
→ Enemy Phase
```

Setelah Enemy Phase:

```text
Turn Count +1
→ living player units kembali ready
→ Player Phase baru
```

---

# 13. Battle Objective

Objective aktif saat ini:

```text
eliminate_all
```

Victory terjadi ketika seluruh enemy dikalahkan.

Defeat terjadi ketika seluruh player unit dikalahkan.

Objective variety belum diimplementasikan.

---

# 14. Battle Content Limitation

Semua battle saat ini masih menggunakan data:

```text
stage1Map
stage1Encounter
```

Hal ini berlaku untuk:

- Tutorial Battle;
- Stage 1;
- Stage 2 variants;
- Stage 3 variants;
- Stage 4.

Node memiliki:

- nama berbeda;
- difficulty label berbeda;
- Crystal reward berbeda;
- progression identity berbeda.

Namun map dan encounter battle aktual belum berbeda per node.

Difficulty saat ini sebagian besar masih berupa label/progression metadata dan belum benar-benar mengubah encounter.

---

# 15. Reward Selection

Status: **Implemented as flow; effects inactive**

Setelah kemenangan run stage:

1. stage Crystal reward ditambahkan ke `runCrystal`;
2. empat reward unik dipilih secara random dari reward pool;
3. player wajib memilih satu reward;
4. reward ID disimpan;
5. current node menjadi completed;
6. node berikutnya dibuka.

Reward pool placeholder:

```text
Guard Max HP
Guard ATK
Guard DEF
Archer Max HP
Archer ATK
Archer DEF
Party Recovery
Bonus Run Crystal
```

Reward effects saat ini belum diterapkan ke gameplay.

Chosen reward IDs hanya disimpan sebagai bagian dari run state.

Stage 4 tetap memberikan reward selection sebelum run dianggap completed.

---

# 16. Run Completion

Status: **Implemented**

Run selesai setelah:

```text
Stage 4 completed
→ Stage 4 reward chosen
→ no pending reward
→ runStatus = completed
```

Completion screen menampilkan:

- converted Run Crystal;
- Meta Crystal before conversion;
- Meta Crystal after conversion;
- completed route;
- blocked routes;
- chosen rewards.

Dari completion screen player dapat:

- membuka Post-Run Shop;
- kembali ke Main Menu.

---

# 17. Run Defeat

Status: **Implemented**

Jika player kalah pada run stage:

```text
current node
→ failed
```

Run state menjadi:

```text
runStatus = defeated
runResult = defeat
```

Defeat screen menampilkan:

- stage tempat player kalah;
- completed route;
- chosen rewards;
- converted Run Crystal;
- Meta Crystal before/after conversion.

Dari defeat screen player dapat:

- membuka Post-Run Shop;
- kembali ke Main Menu.

Tutorial defeat tidak menggunakan flow ini.

---

# 18. Run Crystal and Meta Crystal

Status: **Implemented**

### Run Crystal

Disimpan pada active `runState`.

Run Crystal diperoleh setelah kemenangan stage ketika reward stage dipersiapkan.

### Meta Crystal

Disimpan pada persistent `profileState`.

Pada:

```text
run completed
```

atau:

```text
run defeated
```

100% Run Crystal dikonversi menjadi Meta Crystal.

Setelah conversion:

```text
runCrystal = 0
crystalConversionCompleted = true
```

Run state juga menyimpan:

```text
convertedRunCrystal
metaCrystalBeforeConversion
metaCrystalAfterConversion
```

Conversion dilindungi oleh flag agar tidak diproses dua kali pada flow normal.

---

# 19. Post-Run Shop

Status: **Implemented**

Shop hanya dapat dibuka setelah run telah settled:

```text
runStatus = completed
```

atau:

```text
runStatus = defeated
```

dan:

```text
crystalConversionCompleted = true
```

Shop tidak tersedia langsung dari Main Menu.

Upgrade tersedia untuk:

```text
Guard
- Max HP
- ATK
- DEF

Archer
- Max HP
- ATK
- DEF
```

Maximum level:

```text
4
```

Cost per level:

```text
Level 0 → 1: 30
Level 1 → 2: 60
Level 2 → 3: 100
Level 3 → 4: 150
```

Purchase memeriksa:

- valid unit;
- valid stat;
- valid current level;
- expected current level;
- available Meta Crystal;
- maximum level.

`expectedCurrentLevel` digunakan sebagai perlindungan terhadap duplicate purchase dari stale/double input.

---

# 20. Permanent Upgrade Application

Status: **Implemented and tested**

Permanent upgrades disimpan pada profile:

```text
guard:
  maxHP
  atk
  def

archer:
  maxHP
  atk
  def
```

Efek saat ini:

```text
Max HP: +2 per level
ATK: +1 per level
DEF: +1 per level
```

Maximum supported level:

```text
4
```

Move dan ATR tidak berubah.

### Tutorial

Tutorial menggunakan:

```text
createInitialBattleState(appData)
```

Tanpa permanent upgrades.

Tutorial tetap memakai base stats.

### Run Stage

Run stage menggunakan:

```text
createInitialBattleState(
  appData,
  profileState?.permanentUpgrades
)
```

Permanent upgrade diterapkan ke player units pada awal battle.

Enemy tidak menerima permanent upgrade.

Setiap stage dimulai dengan:

```text
currentHP = upgraded maxHP
```

HP carry antar-stage belum diterapkan.

---

# 21. Profile Persistence

Status: **Implemented**

Profile disimpan menggunakan browser `localStorage`.

Storage key:

```text
tmtb_profile_v1
```

Persistent data:

```text
version
tutorialCompleted
metaCrystal
permanentUpgrades
```

`loadProfileState()` melakukan normalization terhadap profile lama atau field yang hilang.

Jika JSON profile invalid:

```text
default profile dibuat ulang
```

Profile save bersifat lokal terhadap browser/device.

GitHub tidak menyinkronkan `localStorage`.

Karena itu, profile progression pada PC rumah dan PC kampus dapat berbeda.

---

# 22. Active Run Persistence

Status: **Not implemented**

Data berikut hanya berada di memory:

```text
runState
battleState
currentScene
battleIntroNodeId
```

Refresh browser akan memulai aplikasi kembali dari Title Screen dan active run hilang.

`Continue Run` belum tersedia.

---

# 23. Reset Data

Status: **Implemented**

Reset Data:

- meminta confirmation;
- menghapus tutorial progress;
- mengembalikan Meta Crystal ke 0;
- mengembalikan semua permanent upgrade ke level 0;
- membersihkan active run dan battle state;
- kembali ke Main Menu.

---

# 24. Current Data Loading

Data awal dimuat melalui:

```text
src/logic/shared/dataLoader.js
```

Current implementation melakukan fetch ke:

```text
/public/data/units/player_units.json
/public/data/units/enemy_units.json
/public/data/maps/r1_stage1_fixed.json
/public/data/encounters/r1_stage1_baseline_eval_encounter.json
```

Catatan:

Dokumen lama pernah menyatakan path seharusnya `/data/...`.

Namun implementation aktual pada checkpoint v2.5 menggunakan `/public/data/...`.

Jangan mengubah path ini hanya berdasarkan dokumen lama tanpa melakukan test terhadap environment Vite aktual.

---

# 25. Main Known Limitations

## Content

- Semua stage memakai map Stage 1.
- Semua stage memakai encounter Stage 1.
- Stage 4 belum memiliki mini-boss unik.
- Belum ada enemy variety.
- Difficulty belum memodifikasi battle secara nyata.
- Objective hanya `eliminate_all`.

## Gameplay Depth

- Skill belum aktif.
- Reward effects belum aktif.
- Tutorial masih placeholder battle.
- HP carry belum aktif.
- Party Recovery belum aktif.
- Branch consequences masih terbatas pada route blocking.

## Persistence

- Active run tidak disimpan.
- Battle state tidak disimpan.
- Continue Run belum ada.
- Run History belum ada.

## Menu

Belum aktif:

```text
Run Notes / Run History
Settings
Credits
Quit
```

## UI / Presentation

- Visual masih bare-bones.
- Map graph layout masih hard-coded.
- Battle/map polish masih terbatas.
- Stat breakdown belum menampilkan base/permanent/run bonus secara terpisah.

---

# 26. Known Implementation Inconsistencies to Audit Later

## 26.1 Shop copy is stale

UI Shop masih memiliki teks yang menyatakan:

```text
Permanent stat effect will be activated in Checkpoint 2.5D.
```

dan:

```text
Efek stat belum diterapkan ke battle.
```

Padahal permanent upgrade sudah diterapkan ke run-stage battle.

Ini adalah **stale UI copy**, bukan state implementasi aktual.

## 26.2 Stage data is still hard-coded to Stage 1

`main.js` dan battle logic masih menggunakan:

```text
appData.stage1Map
```

untuk movement, targeting, enemy phase, dan battle rendering.

`battleSetup.js` juga menggunakan:

```text
stage1Encounter
stage1Map
```

untuk semua battle.

Hal ini perlu direfactor sebelum unique stage content dapat diterapkan.

## 26.3 Skill menu option is present but inactive

Action menu memiliki:

```text
attack
skill
wait
```

Namun resolver aktif hanya menangani:

```text
attack
wait
```

Skill masih placeholder.

---

# 27. Testing Status Confirmed Before This Handoff

Checkpoint yang sebelumnya telah diuji dan dikonfirmasi user:

## Battle Core

- movement;
- Wait;
- Attack;
- ATR targeting;
- path and cover;
- damage;
- exhaustion;
- enemy phase;
- victory;
- defeat.

## Run Progression

- run generation;
- Stage 2 branch commitment;
- Stage 3 branch commitment;
- sibling blocking;
- reward selection;
- Stage 4 completion.

## Settlement

- completion conversion;
- defeat conversion;
- conversion does not double-process in tested flow.

## Shop

- purchase;
- insufficient funds;
- maximum level;
- duplicate/double-click protection;
- persistence.

## Permanent Upgrade Application

- tutorial remains base stats;
- run stage uses upgraded stats;
- multiple upgrade levels calculate correctly;
- next stage still receives upgrades;
- stage starts at full upgraded HP;
- enemies remain unchanged;
- upgrades persist after refresh;
- Reset Data returns upgrades to level 0 and base stats.

---

# 28. Current Presentation Position

Prototype v2.5 is considered suitable to demonstrate:

```text
new-player tutorial gate
→ branching journey
→ turn-based battle
→ stage reward
→ progression
→ completion/defeat settlement
→ meta currency
→ permanent shop upgrade
→ upgraded future journey
```

The prototype should be presented as a **functional systems prototype**, not a content-complete or production-ready game.

Important presentation caveats:

- stage content is still duplicated;
- reward effects are inactive;
- Skill is inactive;
- tutorial is placeholder;
- active run resume is unavailable;
- visuals are intentionally bare-bones.

---

# 29. Next Recommended Development Step

Immediate sequence:

```text
Finish Handoff v2.5
→ Cross-document audit
→ User review
→ Commit
→ Push
→ Optional milestone tag
→ Focused presentation regression
→ Present v2.5
→ collect lecturer feedback
→ update backlog
→ Phase 2.6 Stabilization
```

A focused full-loop regression should happen before presentation so blocking issues can be found without starting large feature work.

After presentation feedback, Phase 2.6 should focus on:

1. broader full-loop regression;
2. state and flow hardening;
3. stale UI copy cleanup;
4. double-input audit;
5. scene-state validation;
6. profile/data fallback audit;
7. bug fixing and backlog reprioritization;
8. release snapshot and updated handoff.

Do not add large gameplay systems immediately before presentation unless required to fix a blocking bug.

---

# 30. Current State Summary

```text
Title                         DONE
Main Menu                     DONE
Tutorial Gate                 DONE
Tutorial Placeholder Battle   DONE
Run Generation                DONE
Branching Map                 DONE
Battle Intro                  DONE
Battle Core                   DONE
Reward Selection Flow         DONE
Reward Effects                INACTIVE
Run Completion                DONE
Run Defeat                    DONE
Crystal Conversion            DONE
Post-Run Shop                 DONE
Permanent Upgrade Purchase    DONE
Permanent Upgrade Application DONE
Profile Persistence           DONE
Reset Data                    DONE

Unique Stage Maps             DEFERRED
Unique Encounters             DEFERRED
Enemy Variety                 DEFERRED
Active Difficulty Scaling     DEFERRED
Skill System                  DEFERRED
Scripted Tutorial             DEFERRED
HP Carry                      DEFERRED
Active Run Persistence        DEFERRED
Run History                   DEFERRED
Settings / Credits            DEFERRED
```

Current milestone:

> Prototype v2.5 — Full Game Loop Core complete enough for presentation and ready for stabilization.
