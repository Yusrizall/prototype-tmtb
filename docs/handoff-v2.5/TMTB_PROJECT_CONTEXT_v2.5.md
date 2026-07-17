# TMTB Prototype Project Context v2.5

**Project:** TMTB / BeCan  
**Context Owner:** YA  
**Role:** Game Designer  
**Prototype Version:** v2.5  
**Milestone:** Full Game Loop Core  
**Document Type:** Canonical Project Context  
**Last Updated:** 17 July 2026

---

# 1. Project Identity

TMTB adalah project game turn-based tactics yang secara produksi ditujukan sebagai game 3D.

Prototype yang sedang dikembangkan di repository ini adalah versi:

```text
2D
bare-bones
simulative
functional
```

Prototype digunakan untuk membantu Game Designer memvalidasi sistem dan keputusan desain sebelum atau selama implementasi produksi yang lebih besar.

Current prototype milestone:

```text
TMTB Prototype v2.5
Full Game Loop Core
```

---

# 2. Primary Purpose of the Prototype

Prototype digunakan untuk:

- memvalidasi mechanic;
- memvalidasi combat flow;
- memvalidasi unit activation;
- memvalidasi movement, ATR, path, dan cover;
- memvalidasi battle objective;
- memvalidasi run progression;
- memvalidasi branching;
- memvalidasi reward flow;
- memvalidasi Crystal economy;
- memvalidasi meta progression;
- melakukan balancing awal;
- mengamati parameter gameplay;
- mendukung playtest;
- menyediakan acuan fungsional untuk programmer;
- menyediakan functional-screen reference untuk UI/UX;
- mendukung evaluasi akademik;
- menjadi fondasi future telemetry dan auto-simulation.

---

# 3. What the Prototype Is Not

Prototype ini bukan:

- final Unity implementation;
- final 3D game;
- final production architecture;
- final visual UI;
- final UX;
- final character art;
- final environment art;
- complete content build;
- full commercial release;
- technical tool project yang menggantikan fokus Game Designer.

Prototype harus tetap berfungsi sebagai:

> media validasi desain dan sistem.

Technical complexity hanya ditambahkan bila mendukung kebutuhan validasi tersebut.

---

# 4. Academic Context

Prototype dikembangkan dalam konteks PA Game Designer YA.

Fokus akademik utama berada pada:

- perancangan parameter balancing;
- evaluasi tingkat kesulitan;
- hubungan kemampuan pemain dengan tekanan stage;
- evaluasi gameplay melalui skenario;
- telemetry;
- playtesting;
- interpretasi hasil untuk keputusan balancing.

Prototype 2D/simulatif berfungsi sebagai media demonstrasi dan evaluasi.

Prototype bukan kontribusi utama dalam bentuk:

- engine development;
- complex AI research;
- full automatic simulator;
- technical debugging tool;
- advanced production pipeline.

Model lama seperti:

```text
Current Player Capability
Stage Pressure
Difficulty Gap
```

tetap dapat dipakai sebagai referensi konseptual.

Namun model tersebut tidak boleh menjadi dependency keras pada core battle atau progression sebelum model akademiknya kembali dipastikan.

---

# 5. User Role — YA / Game Designer

YA bertanggung jawab pada:

- mechanic;
- gameplay;
- combat rule;
- game flow;
- progression;
- branching;
- reward structure;
- balancing awal;
- objective;
- encounter design;
- difficulty intent;
- economy intent;
- functional screen requirements;
- technical-functional game design;
- playtest interpretation;
- design decisions.

Prototype dibangun untuk membantu YA mengambil dan menguji keputusan tersebut.

---

# 6. Programmer Role

Programmer produksi bertanggung jawab pada:

- implementasi produksi ke engine final;
- Unity architecture;
- codebase production;
- optimization;
- technical integration;
- production save system;
- production networking bila relevan;
- platform-specific implementation;
- engine-specific technical decisions.

Prototype JavaScript bukan blueprint teknis literal yang harus disalin satu-ke-satu ke Unity.

Yang perlu dipertahankan adalah:

- behavior;
- rule;
- data meaning;
- state transition;
- expected result.

---

# 7. UI/UX Designer Role

UI/UX Designer bertanggung jawab pada:

- final visual hierarchy;
- final layout;
- interaction design;
- readability;
- accessibility;
- user experience;
- final screen composition.

Prototype hanya perlu memiliki UI yang cukup jelas untuk:

- memahami state;
- menjalankan test;
- membaca unit data;
- membaca progression;
- membuat keputusan gameplay.

Bare-bones UI bukan indikasi final visual direction.

---

# 8. 3D Artist Role

3D Artist bertanggung jawab pada:

- final character representation;
- final environment;
- production assets;
- visual world-building.

Prototype 2D dapat memakai:

- grid;
- token;
- label;
- simple color coding;

selama informasi gameplay dapat dibaca.

---

# 9. Source-of-Truth Priority

Jika terjadi konflik, gunakan urutan:

```text
1. Keputusan terbaru user di chat aktif
2. Source code dan data aktual repository
3. TMTB_CURRENT_STATE_v2.5.md
4. TMTB_PROGRESS_AND_BACKLOG_v2.5.md
5. TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
6. TMTB_STATE_AND_DATA_MODEL_v2.5.md
7. TMTB_GAME_DESIGN_DECISIONS_v2.5.md
8. TMTB_PROJECT_CONTEXT_v2.5.md
9. Dokumen historical / versi lama
```

Nuance:

## Implementation Truth

Untuk pertanyaan:

> Apa yang sebenarnya dilakukan prototype?

prioritaskan:

```text
actual source
+ confirmed testing
```

## Design Intent

Untuk pertanyaan:

> Rule apa yang seharusnya berlaku?

prioritaskan:

```text
latest user decision
+ latest Game Design Decisions
```

Bila implementation dan design intent berbeda:

```text
mark conflict
→ audit
→ decide intentionally
```

Jangan menyatukannya diam-diam.

---

# 10. Working Method

Default collaboration workflow:

```text
Inspect actual state
→ audit relevant files
→ discuss target
→ make one small change
→ run
→ verify
→ continue
```

Sebelum memberi perubahan kode:

- minta file aktual yang relevan;
- audit file;
- jangan menebak isi file;
- sebutkan path;
- jelaskan blok yang dicari;
- jelaskan apakah menambah, mengganti, atau menghapus;
- berikan kode siap salin;
- jelaskan expected result;
- berikan testing sequence;
- tunggu konfirmasi user.

Jangan menganggap perubahan sudah berhasil sebelum user mengonfirmasi.

---

# 11. File and Folder Creation Rule

Jangan menambah file atau folder tanpa instruksi eksplisit.

Gunakan bentuk seperti:

```text
Tolong buat folder ini:
...

Tolong buat file ini:
...
```

Setelah user mengonfirmasi, baru lanjut.

---

# 12. Development Checkpoint Workflow

Current version-control workflow:

```text
Save
→ Test
→ Commit
→ Push
```

Sebelum bekerja dari komputer lain:

```text
Fetch
→ Pull
→ Work
```

Git digunakan sebagai history dan recovery utama.

ZIP bukan checkpoint harian.

ZIP hanya opsional untuk:

- academic submission;
- presentation package;
- offline archive;
- release archive.

Untuk milestone besar dapat digunakan Git tag.

---

# 13. Current Technology

Prototype menggunakan:

- Vite;
- Vanilla JavaScript;
- ES Modules;
- HTML;
- CSS;
- JSON;
- `fetch`;
- browser `localStorage`.

Current project root:

```text
C:\Datas\prototype-tmtb
```

Current development URL:

```text
http://localhost:5173/
```

Environment yang terakhir terkonfirmasi:

```text
Node.js v24.16.0
npm 11.13.0
```

Current Vite dependency berada pada major version 8.

---

# 14. Architecture Principles

Prinsip yang perlu dipertahankan:

## Data-Driven Direction

Static content sebaiknya berada di:

```text
JSON / config
```

bila relevan.

---

## Definition vs Runtime State

Pisahkan:

```text
definition data
```

dari:

```text
mutable runtime state
```

Contoh:

```text
unit definition
≠ runtime battle unit
```

---

## Core Rules Separate from UI

UI membaca dan menampilkan state.

UI bukan sumber kebenaran untuk:

- damage;
- movement validity;
- target validity;
- progression;
- persistence.

---

## Shared Rule Engine

Player, enemy AI, manual play, dan future auto-simulation sebaiknya memakai rule inti yang sama bila memungkinkan.

Current prototype sudah berbagi:

- movement rules;
- ATR;
- path;
- cover;
- damage.

---

## Incremental Architecture

Jangan memaksakan folder atau architecture lama bila source aktual sudah berkembang berbeda.

Refactor dilakukan berdasarkan kebutuhan aktual.

---

# 15. Current High-Level Architecture

Current layers:

```text
Definition Data
↓
Application Data
↓
Runtime State
↓
Logic
↓
UI Rendering
↓
Input
```

Persistent profile:

```text
localStorage
↔ profileStorage
↔ profileState
```

Run progression:

```text
runState.js
↔ runState
```

Battle:

```text
battleSetup
→ battleState
→ shared battle logic
→ Battle HUD
```

Central orchestration saat ini masih berada di:

```text
src/main.js
```

---

# 16. Current Full Game Loop

Prototype v2.5 memiliki loop:

```text
Title
→ Main Menu
→ Start Journey
→ Tutorial Gate
→ Tutorial Battle untuk pemain baru
→ Run Generation
→ Map Selection
→ Battle Intro
→ Battle
→ Reward Selection
→ Next Stage
→ Stage 4
→ Completion atau Defeat
→ Run Crystal Conversion
→ Post-Run Shop
→ Permanent Upgrade
→ Main Menu
→ New Journey dengan upgrade
```

Ini adalah first complete playable systems loop.

---

# 17. Current Main Menu

Active:

```text
Start Journey
Reset Data
```

Unavailable:

```text
Run Notes / Run History
Settings
Credits
Quit
```

Post-Run Shop tidak dibuka dari Main Menu.

---

# 18. Tutorial Context

New profile:

```text
tutorialCompleted = false
```

Start Journey membuka tutorial.

Tutorial saat ini:

```text
placeholder battle
```

Tutorial victory:

```text
tutorialCompleted = true
→ save
→ New Run
```

Tutorial defeat:

```text
Retry Tutorial
```

Future scripted tutorial masih deferred.

---

# 19. Battle Context

Current player party:

```text
Guard
Archer
```

Current enemy baseline:

```text
Sword Enemy
```

Stage 1 baseline:

```text
Guard + Archer
vs
2 Sword Enemy
```

Current objective:

```text
eliminate_all
```

---

# 20. Unit Activation Context

A unit activation:

```text
reposition
→ one action
```

Action model:

```text
Attack
Skill
Wait
```

Current active actions:

```text
Attack
Wait
```

Skill masih deferred.

Setelah action selesai:

```text
unit exhausted
```

---

# 21. Movement Context

Current movement principles:

- movement uses BFS;
- movement starts from `originTile`;
- ally can be traversed;
- enemy blocks traversal;
- obstacle blocks traversal;
- occupied tile cannot be final destination;
- no unit stacking.

---

# 22. ATR, Path, Cover, and Damage Context

ATR:

```text
Attack Range
```

Current distance uses Euclidean tile distance.

Melee:

```text
obstacle interior crossing
→ target invalid
```

Ranged:

```text
cover can reduce damage
full cover can reduce damage to 0
target can still be selected
action still consumed
```

Current damage:

```text
floor(
  max(
    0,
    ATK × (1 - Cover Percentage) - DEF
  )
)
```

---

# 23. Current Baseline Units

## Guard

```text
HP 25
ATK 5
DEF 4
Move 3
ATR 1.5
```

## Archer

```text
HP 18
ATK 7
DEF 1
Move 4
ATR 3
```

## Sword Enemy

```text
HP 16
ATK 6
DEF 2
Move 3
ATR 1.5
```

These are v2.5 baseline values.

They are not guaranteed final production balance.

---

# 24. Region 1 Context

Current Region 1 structure:

```text
Stage 1 fixed
→ two Stage 2 variants from A/B/C
→ two Stage 3 variants from A/B/C
→ Stage 4 fixed
```

Stage 2 and Stage 3 are randomly generated as two unique variants.

All generated nodes are visible.

Only:

```text
available
```

nodes can be entered.

Branch choice becomes committed when battle begins.

Sibling branch becomes:

```text
blocked
```

---

# 25. Current Content Limitation

Current stage identity and progression differ.

Actual battle content does not.

All stages currently reuse:

```text
Stage 1 map
Stage 1 encounter
```

Therefore current differences are primarily:

- node ID;
- location name;
- difficulty label;
- Crystal reward;
- route progression.

Unique maps and encounters are deferred.

---

# 26. Reward Context

After run-stage victory:

```text
Run Crystal granted
→ 4 reward options
→ choose 1
→ progression continues
```

Reward selection is implemented.

Reward effects are not active.

Current chosen rewards are stored as IDs for run progression and summary.

Stage 4 also gives reward selection before completion.

---

# 27. Crystal Context

## Run Crystal

Temporary currency during active run.

## Meta Crystal

Persistent currency.

Used for permanent upgrades.

Current settlement rule:

```text
100% Run Crystal
→ Meta Crystal
```

on:

```text
completion
or
defeat
```

The 100% conversion rate remains tentative for balancing.

---

# 28. Post-Run Shop Context

Shop is accessible after:

```text
run completed
or
run defeated
```

and after Crystal conversion.

Current permanent upgrade tracks:

```text
Guard Max HP
Guard ATK
Guard DEF

Archer Max HP
Archer ATK
Archer DEF
```

Maximum level:

```text
4
```

Costs:

```text
30
60
100
150
```

---

# 29. Permanent Upgrade Context

Current effects:

```text
Max HP +2 per level
ATK +1 per level
DEF +1 per level
```

Tutorial ignores permanent upgrades.

Run-stage battle applies permanent upgrades to player units.

Enemies do not receive them.

Every current battle starts player units at full upgraded Max HP.

HP carry is deferred.

---

# 30. Persistence Context

Persistent profile:

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

Stored in:

```text
browser localStorage
```

Not persistent:

```text
active run
active battle
current scene
```

Refresh therefore loses active run progress.

`localStorage` also does not synchronize through Git or GitHub.

Different computers can have different profile progression.

---

# 31. Current Milestone Interpretation

v2.5 should be treated as:

```text
Full Game Loop Core
```

It demonstrates systems integration.

It should not be described as:

```text
content complete
production ready
final balanced
final polished
```

---

# 32. Current Presentation Value

v2.5 can demonstrate:

```text
new-player tutorial gate
→ branching run
→ tactical battle
→ reward
→ progression
→ completion/defeat
→ currency settlement
→ permanent upgrade
→ stronger future run
```

This is sufficient to explain the intended systemic loop.

---

# 33. Current Presentation Caveats

Communicate clearly:

- Tutorial is placeholder.
- Skill is inactive.
- All run stages reuse Stage 1 battle content.
- Reward effects are inactive.
- Difficulty is mostly metadata.
- HP carry is absent.
- Active run persistence is absent.
- Run History is absent.
- Visuals are intentionally functional/bare-bones.

---

# 34. Immediate Project Direction

Current recommended sequence:

```text
Finish Handoff v2.5
→ Cross-Document Audit
→ User Review
→ Commit
→ Push
→ Optional Milestone Tag
→ Focused Presentation Regression
→ Presentation
→ Lecturer Feedback
→ Stabilization / Reprioritization
```

Do not expand multiple major systems immediately before presentation unless required by a blocking issue.

---

# 35. Next Development Phase

Before formal development resumes, run a focused full-loop presentation regression and fix only blocking issues.

After presentation and lecturer feedback, the recommended next formal development phase is:

```text
Phase 2.6 — Stabilization
```

Focus:

- broader full-loop regression;
- scene/state hardening;
- duplicate-input audit;
- stale UI copy cleanup;
- save fallback audit;
- bug fixing;
- backlog reprioritization from feedback.

After Phase 2.6:

```text
Content Differentiation
→ Gameplay Depth
→ Roguelite Expansion
→ Balance and Polish
```

---

# 36. Deferred Major Systems

Current deferred systems include:

- unique maps;
- unique encounters;
- enemy variety;
- active difficulty scaling;
- active reward effects;
- Skill system;
- scripted tutorial;
- HP carry;
- recovery system;
- objective variety;
- deeper branch consequences;
- event nodes;
- active run persistence;
- Continue Run;
- Run History;
- Settings;
- Credits;
- stat breakdown UI;
- telemetry;
- auto-simulation.

---

# 37. Telemetry Direction

Telemetry remains part of the long-term academic/prototype direction.

Preferred future sequence:

```text
define stable evaluation data
→ collect structured result data
→ JSON export
→ analyze
→ add CSV only when useful
```

Telemetry should not be stored as ad-hoc UI state.

---

# 38. Auto-Simulation Direction

Future auto-simulation should preferably use:

```text
JavaScript / Node.js
```

so that manual play and simulation can reuse the same core battle rules.

Python may be used later for:

- data analysis;
- statistics;
- visualization;
- exported result processing.

Python is not the primary prototype runtime.

---

# 39. Historical Documents

Older documents remain useful for context.

Examples:

```text
Master Design Note Prototype V0
Prototype Architecture Note V0
State & Data Model Summary V0
UI Flow Summary V0
Control & Input Mapping Summary V0
Patch Revisi
Prototype Progress Tracker
Context Export
TMTB_PROJECT_CONTEXT_v1.0
TMTB_CURRENT_STATE.md
TMTB_PROTOTYPE_V2_5_TODO_AND_DEFERRED_BACKLOG.md
```

They are historical references.

They do not override:

- current user decisions;
- actual source;
- current handoff documents.

---

# 40. Handoff Package Relationship

This Project Context should be read together with:

```text
README.md
TMTB_CHAT_HANDOFF_v2.5.md
TMTB_CURRENT_STATE_v2.5.md
TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
TMTB_STATE_AND_DATA_MODEL_v2.5.md
TMTB_GAME_DESIGN_DECISIONS_v2.5.md
TMTB_PROGRESS_AND_BACKLOG_v2.5.md
```

Document roles:

```text
Project Context
→ Why the project exists

Current State
→ What currently works

Architecture
→ Where implementation lives

State & Data Model
→ What data exists and how it changes

Game Design Decisions
→ Which rules are intentional

Progress & Backlog
→ What is done and what comes next

Chat Handoff
→ How to work with the user
```

---

# 41. Core Project Principles

> Prototype for validation, not production imitation.

> Actual source defines implementation truth.

> Latest design decision defines intended rule.

> Definition data and runtime state should remain distinct.

> Shared rules should be reused.

> UI should display rules, not secretly redefine them.

> One tested change is more valuable than many unverified changes.

> Stabilize before expanding.

> Audit first. Document second.

This document represents the canonical project context for **TMTB Prototype v2.5 — Full Game Loop Core**.
