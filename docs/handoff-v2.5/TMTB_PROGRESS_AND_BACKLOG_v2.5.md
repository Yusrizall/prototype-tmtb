# TMTB Progress and Backlog v2.5

**Project:** TMTB / BeCan Prototype  
**Handoff Version:** v2.5  
**Document Type:** Progress, Roadmap, and Deferred Backlog Snapshot  
**Current Milestone:** Prototype v2.5 — Full Game Loop Core  
**Current Position:** Full-loop core completed and tested; next recommended phase is stabilization and presentation feedback  
**Last Updated:** 17 July 2026

---

# 1. Purpose

Dokumen ini mencatat:

- apa yang sudah selesai;
- apa yang sudah diuji dan dikonfirmasi;
- apa yang menjadi pekerjaan berikutnya;
- apa yang sengaja ditunda;
- technical debt;
- open questions;
- urutan pengembangan yang disarankan.

Status utama yang digunakan:

```text
DONE
NEXT
DEFERRED
OPTIONAL
OPEN QUESTION
```

Sebuah fitur tidak dianggap `DONE` hanya karena kodenya ada.

Untuk dianggap selesai pada checkpoint ini, behavior utama harus pernah diuji dan hasilnya dikonfirmasi.

---

# 2. Current Milestone

Current milestone:

```text
Prototype v2.5 — Full Game Loop Core
```

Current functional loop:

```text
Title
→ Main Menu
→ Tutorial Gate
→ Tutorial Battle untuk pemain baru
→ New Run
→ Map Selection
→ Branching Stage 1–4
→ Battle Intro
→ Battle
→ Reward Selection
→ Map Progression
→ Run Completion atau Run Defeat
→ Run Crystal Conversion
→ Post-Run Shop
→ Permanent Upgrade
→ Main Menu
→ Journey berikutnya memakai upgrade
```

Status:

```text
DONE
```

---

# 3. Completed Milestones

## 3.1 Project Foundation

Status:

```text
DONE
```

Completed:

- Vite + Vanilla JavaScript project setup.
- HTML/CSS/JSON foundation.
- `public/data` design-data structure.
- JSON loading.
- player unit definitions.
- enemy unit definitions.
- Stage 1 map definition.
- Stage 1 encounter definition.
- Git repository.
- GitHub remote repository.

---

## 3.2 Battle Runtime Setup

Status:

```text
DONE
```

Completed:

- definition data converted into runtime battle units;
- spawn labels resolved from map;
- player units created;
- enemy units created;
- derived stats;
- runtime HP;
- selected player unit;
- turn state;
- battle control state.

---

## 3.3 Movement Core

Status:

```text
DONE
```

Completed and tested:

- BFS reachability;
- orthogonal movement;
- origin-based repositioning;
- Move range;
- obstacle blocking;
- same-side traversal;
- opponent traversal blocking;
- no unit stacking;
- keyboard movement;
- clickable movement tile;
- ready-unit selection.

---

## 3.4 Action and Activation Core

Status:

```text
DONE
```

Completed and tested:

- action menu;
- Attack option;
- Wait option;
- exhaustion;
- unit switching;
- next-ready-unit selection;
- transition to Enemy Phase after all living players are exhausted.

Current limitation:

```text
Skill exists as a menu option but is inactive.
```

---

## 3.5 ATR and Targeting

Status:

```text
DONE
```

Completed and tested:

- Euclidean ATR;
- valid enemy target filtering;
- target cycling;
- target highlight;
- target preview;
- attack line;
- invalid target handling.

---

## 3.6 Path and Cover

Status:

```text
DONE
```

Completed and tested:

- clear path;
- O30 partial cover;
- O70 partial cover;
- OF full cover;
- interior-crossing detection;
- edge/corner touching does not count as interior crossing;
- melee blocked by crossed obstacle;
- ranged remains targetable through cover;
- full cover can resolve as 0 damage.

---

## 3.7 Damage Resolution

Status:

```text
DONE
```

Current formula:

```text
floor(
  max(
    0,
    ATK × (1 - Cover Percentage) - DEF
  )
)
```

Completed and tested:

- damage calculation;
- HP reduction;
- HP clamped at 0;
- target defeat;
- attacker exhaustion;
- shared resolver for player and enemy attacks.

---

## 3.8 Enemy Phase

Status:

```text
DONE
```

Completed and tested:

- Enemy Phase begins after all living players are exhausted;
- enemy movement;
- enemy target selection;
- enemy attack;
- shared movement rules;
- shared ATR/path rules;
- shared damage rules;
- new Player Turn;
- turn count increment;
- player defeat detection.

---

## 3.9 Objective and Battle Result

Status:

```text
DONE
```

Completed and tested:

- `eliminate_all`;
- immediate victory when all enemies are defeated;
- defeat when all player units are defeated;
- battle result overlay;
- victory/defeat routing.

Current limitation:

```text
Only eliminate_all is implemented.
```

---

# 4. Full-Loop Progression Checkpoints

## 4.1 Title and Main Menu

Status:

```text
DONE
```

Implemented:

- Title Screen;
- click/keyboard continuation;
- Main Menu;
- Start Journey;
- Reset Data.

Disabled / not implemented:

```text
Run Notes / Run History
Settings
Credits
Quit
```

---

## 4.2 Tutorial Gate

Status:

```text
DONE
```

Implemented and tested:

```text
new profile
→ Tutorial

tutorial victory
→ tutorialCompleted saved
→ New Run

tutorial defeat
→ Retry Tutorial
```

Current limitation:

```text
Tutorial is still a placeholder battle.
```

---

## 4.3 Run Generation

Status:

```text
DONE
```

Implemented:

```text
Stage 1 fixed
→ 2 unique random Stage 2 nodes
→ 2 unique random Stage 3 nodes
→ Stage 4 fixed
```

Generation occurs once when a run is created.

---

## 4.4 Region Map and Node Preview

Status:

```text
DONE
```

Implemented:

- horizontal Region Graph;
- all generated nodes visible;
- node preview;
- difficulty badge;
- node status;
- Run Crystal display;
- only `available` node can be entered.

---

## 4.5 Branch Commitment

Status:

```text
DONE
```

Implemented and tested:

- preview does not commit branch;
- opening Battle Intro does not commit branch;
- beginning battle commits branch;
- selected node becomes `current`;
- sibling available node becomes `blocked`;
- blocked node remains previewable;
- Stage 2 branching tested;
- Stage 3 branching tested.

---

## 4.6 Battle Intro

Status:

```text
DONE
```

Implemented:

- stage identity;
- location;
- difficulty;
- objective;
- encounter type;
- Crystal reward;
- back-to-map flow;
- begin-battle flow.

---

## 4.7 Reward Selection Flow

Status:

```text
DONE AS FLOW
```

Implemented and tested:

- victory grants stage Run Crystal;
- four unique reward cards generated;
- player must choose one;
- chosen reward ID stored;
- source stage completed;
- next stage tier unlocked;
- Stage 4 also goes through reward selection.

Current limitation:

```text
Reward effects are inactive.
```

---

## 4.8 Run Completion

Status:

```text
DONE
```

Implemented and tested:

```text
Stage 4 victory
→ Stage 4 reward
→ run completed
→ Crystal conversion
→ completion summary
```

Summary includes:

- completed route;
- blocked routes;
- chosen rewards;
- converted Run Crystal;
- Meta Crystal before/after conversion.

---

## 4.9 Run Defeat Settlement

Status:

```text
DONE
```

Implemented and tested:

- defeated current node becomes `failed`;
- run becomes `defeated`;
- previous earned Run Crystal is converted;
- defeat screen shows defeated node;
- completed route shown;
- chosen rewards shown;
- Stage 4 defeat converts only Crystal already earned before the failed stage.

Tutorial defeat does not use run settlement.

---

## 4.10 Crystal Conversion

Status:

```text
DONE FOR CURRENT RULE
```

Current conversion:

```text
100% Run Crystal
→ Meta Crystal
```

Implemented and tested for:

- completion;
- defeat;
- normal double-input protection.

Current rate remains:

```text
TENTATIVE
```

for economy balancing.

---

## 4.11 Post-Run Shop

Status:

```text
DONE
```

Implemented and tested:

- accessible after completed run;
- accessible after defeated run;
- unavailable directly from Main Menu;
- six upgrade tracks;
- purchase validation;
- insufficient funds;
- maximum level;
- stale/double-click purchase protection;
- Meta Crystal deduction;
- persistence;
- return to Main Menu.

---

## 4.12 Permanent Upgrade Application

Status:

```text
DONE
```

Implemented and tested:

```text
Max HP +2 per level
ATK    +1 per level
DEF    +1 per level
```

Confirmed scenarios:

- Tutorial uses base stats.
- Run battle uses upgraded stats.
- Multi-level upgrade math works.
- Next stage uses upgrade.
- Every battle starts at full upgraded Max HP.
- Enemy stats remain unchanged.
- Upgrade persists after refresh.
- Reset Data returns upgrade levels to 0 and restores base stats.

---

# 5. Current Persistence Status

## Profile Persistence

Status:

```text
DONE
```

Persistent through browser `localStorage`:

```text
tutorialCompleted
metaCrystal
permanentUpgrades
```

---

## Active Run Persistence

Status:

```text
DEFERRED
```

Current behavior:

```text
refresh
→ active run lost
```

---

## Active Battle Persistence

Status:

```text
NOT IMPLEMENTED / OPEN QUESTION
```

Current behavior:

```text
refresh during battle
→ active battle lost
```

---

# 6. Current Handoff Documentation Progress

Status at this checkpoint:

```text
DOCUMENT SET COMPLETE
CROSS-DOCUMENT AUDIT COMPLETED
CORRECTED FILES READY FOR REPLACEMENT
```

Current package:

```text
docs/TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md

docs/handoff-v2.5/
├─ README.md
├─ TMTB_CHAT_HANDOFF_v2.5.md
├─ TMTB_CURRENT_STATE_v2.5.md
├─ TMTB_PROTOTYPE_ARCHITECTURE_v2.5.md
├─ TMTB_STATE_AND_DATA_MODEL_v2.5.md
├─ TMTB_GAME_DESIGN_DECISIONS_v2.5.md
├─ TMTB_PROGRESS_AND_BACKLOG_v2.5.md
└─ TMTB_PROJECT_CONTEXT_v2.5.md
```

Next handoff actions:

```text
replace any cross-audit corrected files
→ user review
→ Git commit
→ Git push
→ optional milestone Git tag
```

---

# 7. Immediate Next Actions and Next Development Phase

Before formal Phase 2.6:

```text
Finalize handoff corrections
→ User review
→ Commit
→ Push
→ Optional milestone tag
→ Focused presentation regression
→ Fix blocking issues only
→ Presentation
→ Lecturer feedback
→ Backlog reprioritization
```

Formal next development phase:

## Phase 2.6 — Stabilization

Status:

```text
NEXT AFTER PRESENTATION FEEDBACK
```

Do this before large gameplay expansion.

Priority order:

```text
1. Broader full-loop regression
2. State and flow hardening
3. Stale UI copy cleanup
4. Bug fixing
5. Double-input and scene-state validation
6. Profile/data fallback audit
7. Backlog reprioritization from feedback
8. Release/milestone snapshot
```

---

# 8. Phase 2.6 — Full-Loop Regression

Status:

```text
NEXT
```

Test from current build:

- [ ] Reset Data from an existing profile.
- [ ] New-player Start Journey.
- [ ] Tutorial victory.
- [ ] Tutorial defeat and Retry.
- [ ] Returning-player Start Journey.
- [ ] Stage 1 victory.
- [ ] Stage 2 branch preview.
- [ ] Stage 2 branch commitment.
- [ ] Stage 2 sibling blocking.
- [ ] Stage 3 branch commitment.
- [ ] Stage 3 sibling blocking.
- [ ] Stage 4 victory.
- [ ] Reward selection after every stage.
- [ ] Completion conversion.
- [ ] Defeat on early stage.
- [ ] Defeat after Crystal has already been earned.
- [ ] Stage 4 defeat.
- [ ] Conversion does not double-process.
- [ ] Shop after completion.
- [ ] Shop after defeat.
- [ ] Purchase affordable upgrade.
- [ ] Insufficient Meta Crystal.
- [ ] Maximum upgrade level.
- [ ] Fast/double purchase input.
- [ ] Permanent upgrade persistence after refresh.
- [ ] Permanent upgrade applied to next Journey.
- [ ] Tutorial still ignores permanent upgrades.
- [ ] Enemy stats remain unchanged.
- [ ] Reset Data clears all persistent progression.

---

# 9. Phase 2.6 — State and Flow Hardening

Status:

```text
NEXT
```

Audit:

- [ ] Scene transitions only open from valid state.
- [ ] Reward cannot be applied twice.
- [ ] Crystal conversion cannot be applied twice.
- [ ] Shop purchase cannot be applied twice.
- [ ] `runState` cleared at correct time.
- [ ] `battleState` cleared at correct time.
- [ ] `battleIntroNodeId` cleared at correct time.
- [ ] Enemy Phase timer always cleared when leaving battle.
- [ ] Fast keyboard input during scene transition.
- [ ] Fast mouse double-click during scene transition.
- [ ] Keyboard + mouse mixed duplicate input.
- [ ] All exact `data-action` selectors remain valid.
- [ ] Profile normalization with missing old fields.
- [ ] Invalid saved JSON fallback.
- [ ] Missing/invalid external JSON error presentation.

Some protections already exist and have been tested, but Phase 2.6 should perform a deliberate regression audit across the complete flow.

---

# 10. Phase 2.6 — Stale UI Copy Cleanup

Status:

```text
NEXT
```

Known stale copy found during architecture audit:

## Post-Run Shop

UI still says permanent stat effects will be activated in Checkpoint 2.5D or are not yet applied.

Actual state:

```text
Permanent upgrade effects ARE active in run-stage battles.
```

Required:

- [ ] Update Shop card copy.
- [ ] Update Post-Run Shop notice.

## Battle HUD

Some fallback/input-hint copy still says Enemy Phase is not implemented.

Actual state:

```text
Enemy Phase IS implemented.
```

Required:

- [ ] Remove/update stale Enemy Phase copy.
- [ ] Audit other old checkpoint/debug wording.

Do not mix this cleanup with major feature work.

---

# 11. Presentation Preparation

Status:

```text
NEXT
```

Recommended checklist:

- [ ] Run one complete regression from Reset Data.
- [ ] Verify `npm install` works on presentation computer if needed.
- [ ] Verify `npm run dev`.
- [ ] Verify `http://localhost:5173/`.
- [ ] Prepare a profile with enough Meta Crystal for Shop demonstration.
- [ ] Prepare a demo path:
  `tutorial → map → battle → reward → settlement → shop → upgrade → new journey`.
- [ ] Prepare screenshots or a short backup video for demo failure.
- [ ] Explicitly explain placeholder limitations.
- [ ] Collect lecturer questions and feedback.
- [ ] Add feedback to this backlog after presentation.

Presentation caveats to state clearly:

```text
all stages still share Stage 1 battle content
reward effects inactive
Skill inactive
tutorial placeholder
active run not persistent
visuals intentionally bare-bones
```

---

# 12. Git Workflow for Current Development

The normal checkpoint workflow is now:

```text
Save
→ Test
→ Commit
→ Push
```

Before working on another computer:

```text
Fetch
→ Pull
→ Work
```

At the end of a verified checkpoint:

```text
Test
→ Commit
→ Push
```

Do not use ZIP as the normal version-history mechanism.

---

# 13. Milestone Snapshot

For a meaningful milestone:

```text
verified source
→ updated handoff
→ commit
→ push
→ optional Git tag
```

Suggested tag style:

```text
v2.5-full-loop-core
```

The exact tag name should be confirmed before creation.

---

# 14. Position of ZIP Backup

ZIP is:

```text
OPTIONAL
```

Use ZIP for:

- academic submission;
- presentation package;
- offline archive;
- release handoff when explicitly needed.

Do not make ZIP the default checkpoint method.

---

# 15. Phase 3.1 — Content Differentiation

Status:

```text
DEFERRED
```

Recommended after stabilization and feedback.

---

## 15.1 Unique Maps

- [ ] Make Stage 1 map explicitly its own content.
- [ ] Add Stage 2A map.
- [ ] Add Stage 2B map.
- [ ] Add Stage 2C map.
- [ ] Add Stage 3A map.
- [ ] Add Stage 3B map.
- [ ] Add Stage 3C map.
- [ ] Add Stage 4 map.
- [ ] Differentiate obstacles.
- [ ] Differentiate cover.
- [ ] Differentiate spawn positions.
- [ ] Validate movement/path logic on every map.

---

## 15.2 Unique Encounters

- [ ] Create encounter data per stage node.
- [ ] Connect node to map.
- [ ] Connect node to encounter.
- [ ] Vary enemy composition.
- [ ] Vary enemy count.
- [ ] Vary spawn positions.
- [ ] Create real Stage 4 mini-boss encounter.

---

## 15.3 Remove Stage 1 Hard-Coding

Current technical dependency:

```text
dataLoader.js
battleSetup.js
main.js
battleHud.js
```

still assumes:

```text
stage1Map
stage1Encounter
```

Required:

- [ ] Pass explicit `mapData`.
- [ ] Pass explicit `encounterData`.
- [ ] Select content from active node.
- [ ] Stop rendering `data.stage1Map` directly.
- [ ] Validate map/encounter/unit references.

---

# 16. Enemy Variety

Status:

```text
DEFERRED
```

Current:

```text
Sword Enemy only
```

Future backlog:

- [ ] ranged enemy;
- [ ] tank/defensive enemy;
- [ ] fast enemy;
- [ ] mini-boss;
- [ ] role-based AI behavior;
- [ ] encounter composition testing.

---

# 17. Difficulty System

Status:

```text
DEFERRED / OPEN DESIGN
```

Current:

```text
easy
normal
hard
```

are mostly metadata and reward-risk labels.

Future work:

- [ ] Define actual difficulty rules.
- [ ] Decide enemy-count scaling.
- [ ] Decide enemy-stat scaling.
- [ ] Decide composition scaling.
- [ ] Decide spawn/map disadvantage.
- [ ] Connect difficulty to encounter generation.
- [ ] Rebalance Crystal rewards.
- [ ] Explain difficulty reason in UI if useful.

---

# 18. Phase 3.2 — Gameplay Depth

Status:

```text
DEFERRED
```

---

## 18.1 Active Reward Effects

Current:

```text
reward selection works
reward IDs are stored
effects inactive
```

Future:

- [ ] define effect model;
- [ ] apply Guard reward effects;
- [ ] apply Archer reward effects;
- [ ] implement Party Recovery;
- [ ] implement Bonus Run Crystal;
- [ ] decide duplicate reward rules;
- [ ] decide stacking rules;
- [ ] expose active run buffs in UI.

---

## 18.2 Skill System

Current:

```text
Skill option exists
resolver inactive
```

Future:

- [ ] Guard skill;
- [ ] Archer skill;
- [ ] skill targeting;
- [ ] skill range;
- [ ] cover/path interaction;
- [ ] resource/cooldown rule;
- [ ] enemy Skill support if needed.

---

## 18.3 Scripted Tutorial

Current:

```text
placeholder battle
```

Future:

- [ ] guided movement;
- [ ] unit switching;
- [ ] Action Menu guidance;
- [ ] Attack guidance;
- [ ] ATR explanation;
- [ ] cover explanation;
- [ ] Wait explanation;
- [ ] exhaustion explanation;
- [ ] Enemy Phase explanation.

---

## 18.4 HP Carry and Recovery

Current:

```text
every battle starts at full upgraded Max HP
```

Future:

- [ ] decide HP carry rule;
- [ ] decide healing between stages;
- [ ] decide Party Recovery effect;
- [ ] decide defeated-unit behavior;
- [ ] update battle setup;
- [ ] persist party HP in `runState`.

---

## 18.5 Objective Variety

Current:

```text
eliminate_all only
```

Potential backlog:

- [ ] survive turns;
- [ ] defend area;
- [ ] protect target;
- [ ] reach destination;
- [ ] defeat priority target;
- [ ] mini-boss objective;
- [ ] escape.

---

# 19. Phase 3.3 — Roguelite Expansion

Status:

```text
DEFERRED
```

---

## 19.1 Deeper Branch Consequences

Current:

```text
chosen sibling remains playable
other sibling becomes blocked
```

Future:

- [ ] route-specific encounters;
- [ ] route-specific reward pools;
- [ ] route modifiers;
- [ ] Stage 2 affects Stage 3;
- [ ] route affects Stage 4.

---

## 19.2 Event / Non-Battle Nodes

- [ ] Rest;
- [ ] Treasure;
- [ ] Risk/Reward Event;
- [ ] In-Run Shop;
- [ ] Story/Dialogue.

---

## 19.3 Active Run Persistence

- [ ] save `runState`;
- [ ] load active run;
- [ ] validate save version;
- [ ] restore selected/current route;
- [ ] restore Run Crystal;
- [ ] restore chosen rewards;
- [ ] restore future HP carry if implemented.

---

## 19.4 Continue Run

Depends on:

```text
Active Run Persistence
```

- [ ] detect active saved run;
- [ ] enable Continue Run;
- [ ] define abandoned-run behavior.

---

## 19.5 Run History

- [ ] store run summaries;
- [ ] result;
- [ ] route;
- [ ] defeated/completed stage;
- [ ] chosen rewards;
- [ ] converted Crystal;
- [ ] timestamp;
- [ ] optional telemetry reference.

---

# 20. Phase 3.4 — Balance and Polish

Status:

```text
DEFERRED
```

---

## 20.1 Battle Balance

Current baseline:

```text
Guard:
HP 25 / ATK 5 / DEF 4 / Move 3 / ATR 1.5

Archer:
HP 18 / ATK 7 / DEF 1 / Move 4 / ATR 3

Sword Enemy:
HP 16 / ATK 6 / DEF 2 / Move 3 / ATR 1.5
```

Tasks:

- [ ] measure turns-to-kill;
- [ ] measure incoming damage;
- [ ] test Guard survivability;
- [ ] test Archer risk/reward;
- [ ] test cover impact;
- [ ] test DEF permanent upgrade scaling;
- [ ] test different enemy compositions.

---

## 20.2 Progression Economy

Current values:

```text
Upgrade costs:
30 / 60 / 100 / 150

Run Crystal conversion:
100%

Permanent bonuses:
Max HP +2
ATK +1
DEF +1
per level
```

Tasks:

- [ ] calculate average runs to max upgrades;
- [ ] test whether defeat is too rewarding;
- [ ] test completion reward;
- [ ] test risk/reward of hard routes;
- [ ] evaluate non-100% conversion;
- [ ] evaluate completion bonus;
- [ ] evaluate defeat penalty;
- [ ] decide whether all stats share same cost curve;
- [ ] record balancing results in spreadsheet.

---

## 20.3 UI / UX Polish

- [ ] base/permanent/run stat breakdown;
- [ ] clearer attack prediction;
- [ ] damage preview;
- [ ] cover icon/percentage;
- [ ] better defeated-unit feedback;
- [ ] enemy intent readability;
- [ ] phase transition presentation;
- [ ] objective-specific UI;
- [ ] accessibility review.

---

# 21. Technical Cleanup

Status:

```text
DEFERRED AFTER STABILIZATION
```

---

## 21.1 `main.js` Organization

Current `main.js` owns:

```text
startup
scene routing
input routing
battle orchestration
enemy timing
settlement
Crystal conversion
Shop routing
```

Future cleanup:

- [ ] separate scene controller;
- [ ] separate input controller;
- [ ] separate settlement logic;
- [ ] separate Shop controller if useful;
- [ ] centralize scene constants;
- [ ] centralize status constants;
- [ ] reduce magic strings.

Do not refactor all at once.

---

## 21.2 Reward Module

- [ ] move reward definitions out of `runState.js` when effects become active;
- [ ] create reward effect resolver;
- [ ] create run buff model.

---

## 21.3 Graph Rendering

Current graph layout is hard-coded.

Future:

- [ ] derive connection lines from `nodeConnections`;
- [ ] derive node placement from graph data;
- [ ] keep horizontal scroll fallback.

---

## 21.4 CSS Organization

Current:

```text
one large src/style.css
```

Future optional cleanup:

- [ ] split styles by flow/battle/component when maintenance requires it.

---

## 21.5 Legacy / Likely Unused Files

Audit later before deleting:

```text
src/counter.js
src/assets/hero.png
src/assets/javascript.svg
src/assets/vite.svg
public/icons.svg
```

`public/favicon.svg` is active and should not be treated as unused.

No deletion should occur without a fresh reference audit.

---

# 22. Automated Tests

Status:

```text
DEFERRED BUT RECOMMENDED
```

High-value targets:

- [ ] BFS reachability;
- [ ] movement occupancy rules;
- [ ] ATR;
- [ ] path interior crossing;
- [ ] cover selection;
- [ ] damage formula;
- [ ] enemy target selection;
- [ ] objective resolver;
- [ ] run generation;
- [ ] branch blocking;
- [ ] reward grant duplication;
- [ ] final-stage completion;
- [ ] defeat mutation;
- [ ] conversion idempotency;
- [ ] purchase validation;
- [ ] permanent upgrade application;
- [ ] profile normalization.

---

# 23. Optional Long-Term Features

Status:

```text
OPTIONAL
```

Not required for the current academic prototype:

- audio and music;
- character portraits;
- dialogue;
- story progression;
- multiple regions;
- more playable units;
- equipment;
- status effects;
- buffs/debuffs;
- area-of-effect attacks;
- height/elevation;
- destructible cover;
- procedural maps;
- advanced boss mechanics;
- achievements;
- save slots;
- save export/import;
- advanced playtest analytics.

---

# 24. Telemetry and Auto-Simulation

Status:

```text
DEFERRED
```

Long-term direction:

```text
Manual Play
and
Auto-Simulation
↓
share the same core battle rules
```

Telemetry direction:

```text
structured result data
→ JSON export first
→ CSV later if useful
```

Do not build a separate simulator with different combat rules.

---

# 25. Open Questions

Status:

```text
OPEN QUESTION
```

- [ ] Is DEF +1 per permanent-upgrade level too strong?
- [ ] Should Run Crystal conversion remain 100%?
- [ ] Should defeat have a conversion penalty?
- [ ] Should completion have a bonus?
- [ ] Should Shop eventually be accessible from Main Menu?
- [ ] What is the final HP carry rule?
- [ ] What happens to a defeated unit in later stages?
- [ ] Can rewards repeat?
- [ ] Can rewards stack?
- [ ] What should determine difficulty?
- [ ] Should hard routes always grant more Crystal?
- [ ] Should Stage 4 remain fixed in future versions?
- [ ] Should tutorial eventually be skippable?
- [ ] Should active battle be saved on refresh?
- [ ] Is Run History needed for academic evaluation?
- [ ] What should Quit do in the browser build?

---

# 26. Recommended Development Order

## Phase 2.6

```text
Stabilization
→ Presentation
→ Lecturer Feedback
```

## Phase 3.1

```text
Content Differentiation
```

## Phase 3.2

```text
Gameplay Depth
```

## Phase 3.3

```text
Roguelite Expansion
```

## Phase 3.4

```text
Balance and Polish
```

Long-term:

```text
Telemetry
→ Auto-Simulation
```

---

# 27. Definition of Done for a Development Checkpoint

A checkpoint is complete when:

- [ ] relevant current files were audited before implementation;
- [ ] intended behavior is clear;
- [ ] code/data change is saved;
- [ ] prototype runs;
- [ ] primary test passes;
- [ ] relevant regression tests pass;
- [ ] keyboard input tested where relevant;
- [ ] mouse input tested where relevant;
- [ ] fast/double input tested where relevant;
- [ ] refresh/persistence tested where relevant;
- [ ] Reset Data tested when profile state is affected;
- [ ] user confirms actual result;
- [ ] relevant handoff/backlog documentation is updated;
- [ ] Git commit is created;
- [ ] commit is pushed to GitHub.

For major milestones:

- [ ] optional Git tag is created and pushed.

ZIP is not a required Definition-of-Done item.

---

# 28. Current Recommended Action

At the v2.5 handoff checkpoint:

```text
Finish handoff package
→ cross-document consistency audit
→ user review
→ commit
→ push
→ optional v2.5 milestone tag
→ run presentation regression
→ present
→ collect feedback
→ begin Phase 2.6 stabilization / reprioritize based on feedback
```

Do not begin a large content or gameplay expansion before the handoff and stabilization pass are complete unless a new project requirement changes the priority.

---

# 29. Summary

```text
Full Game Loop Core          DONE
Core Battle                  DONE
Branching Run                DONE
Reward Flow                  DONE
Completion / Defeat          DONE
Crystal Conversion           DONE
Post-Run Shop                DONE
Permanent Upgrade Effects    DONE
Profile Persistence          DONE

Handoff v2.5                 CROSS-AUDIT CORRECTIONS READY
Presentation Regression      NEXT
Presentation Feedback        NEXT
Phase 2.6 Stabilization      NEXT AFTER FEEDBACK

Unique Content               DEFERRED
Active Reward Effects        DEFERRED
Skill System                 DEFERRED
Scripted Tutorial            DEFERRED
HP Carry                     DEFERRED
Active Run Persistence       DEFERRED
Run History                  DEFERRED
Telemetry                    DEFERRED
Auto-Simulation              DEFERRED
```

Current direction:

> Stabilize what already works before expanding what exists.

This document represents the progress and backlog snapshot of **TMTB Prototype v2.5 — Full Game Loop Core**.
