# TMTB Handoff Maintenance Protocol

**Project:** TMTB / BeCan
**Document Type:** Evergreen Documentation / Handoff Maintenance Protocol
**Last Updated:** 11 August 2026
**Status:** **EVERGREEN GOVERNANCE DOCUMENT**
**Applies To:** Canonical design docs, handoff packages, supporting handoffs, historical snapshots, repository/source audit, and future project recovery.

---

# 1. Purpose

This document defines the official protocol for creating, updating, auditing, using, and preserving TMTB project documentation.

The protocol exists so the project can be resumed safely when:

- moving to a new chat;
- moving to a new ChatGPT account;
- moving to another device;
- returning after a long break;
- using another assistant;
- handing work to a programmer/collaborator;
- completing a major design or implementation checkpoint;
- recovering context after chat/project memory is lost.

The primary risks this protocol is designed to prevent are:

- design intent being confused with current prototype behaviour;
- old implementation docs being treated as current truth;
- tentative design being promoted to locked design accidentally;
- supporting discussion notes silently replacing canonical docs;
- historical files overriding later explicit Game Designer decisions;
- assistant assumptions replacing actual source/runtime evidence;
- documentation being version-bumped without repository/source audit;
- implementation being changed before the recovered project state is documented;
- future recovery requiring the Game Designer to manually re-explain major systems.

Primary operating principle:

> **Audit first. Document second. Implement only after the documentation state is trustworthy enough for the next task.**

For code changes:

> **Actual files first. Assumptions second.**

---

# 2. Core Documentation Philosophy

TMTB documentation is not one single source file.

Different documents exist for different responsibilities.

The project must distinguish:

```text
GAME-DESIGN INTENT
from
PROTOTYPE IMPLEMENTATION TRUTH
```

and also distinguish:

```text
CANONICAL
SUPPORTING
HISTORICAL
```

A document may be accurate within its historical checkpoint while no longer being current.

Therefore:

```text
Old document
≠
wrong document

Old document
=
historical snapshot unless explicitly superseded/removed
```

The goal is not to erase history.

The goal is to make current authority unmistakable.

---

# 3. Version Semantics

TMTB must NOT use one version number to imply several different things.

The following concepts are separate.

## 3.1 Game Design Version

Represents the current canonical game-design state.

Example:

```text
Game Design v3.1
```

This version may advance because game design materially evolves even if the prototype has not yet implemented those changes.

---

## 3.2 Handoff Package Version

Represents the generation/checkpoint of the portable documentation package.

Example:

```text
Handoff Package v3.0
```

This means:

```text
third-generation active documentation package
```

It does NOT mean:

```text
prototype combat implementation = v3.0
```

---

## 3.3 Prototype Implementation Baseline / Milestone

Represents what the prototype actually implements.

Use explicit wording when a simple version number would be misleading.

Example:

```text
Prototype Implementation Baseline:
Post-v2.5 / Pre-v3 Combat Migration

Verified:
11 August 2026
```

A Git tag may still represent an implementation milestone when appropriate, for example:

```text
v2.5-full-loop-core
```

---

## 3.4 Required Metadata

Implementation-facing handoff documents should clearly state:

```text
Handoff Package Version
Verification Date
Prototype Implementation Baseline
```

Canonical design documents should clearly state:

```text
Game Design Version
Date
Canonical Status
```

Do not infer implementation completeness from a documentation filename.

---

# 4. Document Classes

Every important project document should belong to a recognizable class.

## 4.1 CANONICAL LIVING DOCUMENT

A continuously maintained authoritative document.

Current examples:

```text
TMTB_GAME_DESIGN_CONTEXT.md
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
```

A living document may be updated in place.

Historical copies may still be preserved through Git history or deliberate snapshots.

---

## 4.2 CANONICAL SNAPSHOT

A versioned compact snapshot of canonical decisions at a known point.

Example:

```text
TMTB_GAME_DESIGN_DECISIONS_v3.1.md
```

Its purpose is quick reference, not full reasoning history.

---

## 4.3 HANDOFF SNAPSHOT

A versioned documentation package describing the project at a checkpoint.

Typical documents:

```text
README.md
TMTB_CHAT_HANDOFF_vX.X.md
TMTB_CURRENT_STATE_vX.X.md
TMTB_PROTOTYPE_ARCHITECTURE_vX.X.md
TMTB_STATE_AND_DATA_MODEL_vX.X.md
TMTB_PROGRESS_AND_BACKLOG_vX.X.md
TMTB_PROJECT_CONTEXT_vX.X.md
```

A handoff snapshot is portable context.

It is NOT a replacement for source code.

---

## 4.4 SUPPORTING HANDOFF

A structured `.md` document used to preserve important domain discussion, recovery work, audit evidence, or design reasoning that is too detailed for core canonical documents.

Examples:

```text
Enemy Design Discussion Handoff
Tutorial Design Corrected Handoff
Prototype Recovery / Repository Audit Handoff
```

Supporting handoffs:

- may contain detailed reasoning;
- may preserve unresolved alternatives;
- may record evidence/provenance;
- do not automatically become canonical;
- must declare their status explicitly;
- should identify which canonical documents remain above them.

A supporting handoff can later be mined for canonical decisions.

Do not silently merge the entire supporting handoff into canon.

---

## 4.5 HISTORICAL SNAPSHOT

A previously current document retained for provenance.

Examples:

```text
handoff-v2.5/*
old root CURRENT_STATE
old TODO/backlog snapshots
```

Historical snapshots:

- remain useful for understanding evolution;
- do not override current source-of-truth;
- should not be retroactively rewritten merely to match current rules.

---

## 4.6 VERBATIM / RECOVERY EVIDENCE

Raw chat exports, verbatim text files, or other recovery artifacts.

Example:

```text
TMTB-CHAT ARCHIVE VERBATIM 1.txt
```

Use them when provenance or lost-discussion recovery is needed.

They are not normal current-reading documents.

Preferred format:

```text
.md
= structured supporting handoff

.txt
= acceptable verbatim / historical evidence
```

---

# 5. Design Status Language

Game-design documents should use explicit status language.

Current status vocabulary:

```text
LOCKED
PLANNED
TENTATIVE
OPEN
SUPERSEDED
PROTOTYPE ONLY
DEVELOPMENT EXCEPTION
HISTORICAL DESIGN SEED
```

## LOCKED

Current canonical direction.

## PLANNED

Intended, but incomplete or not yet sufficiently validated.

## TENTATIVE

Working direction/value that may still change.

## OPEN

Not yet decided.

## SUPERSEDED

An intentionally replaced rule.

## PROTOTYPE ONLY

A rule/content/tool used only for prototype validation/evaluation.

## DEVELOPMENT EXCEPTION

A temporary divergence accepted because of development scope.

## HISTORICAL DESIGN SEED

An old idea retained only as reference/input.

Do not promote:

```text
TENTATIVE
or
OPEN
```

to:

```text
LOCKED
```

without an explicit Game Designer decision.

---

# 6. Source-of-Truth Hierarchy

TMTB uses separate hierarchies for design and implementation.

This separation is mandatory.

---

## 6.1 Game-Design Intent

Use this order:

```text
1. Latest explicit Game Designer decision in the active discussion
2. Latest TMTB_GAME_DESIGN_CONTEXT
3. Latest TMTB_GAME_DESIGN_DECISIONS
4. Latest relevant domain-specific supporting handoff
5. Historical / legacy design documents
```

If a supporting handoff contains a later explicit Game Designer decision that has not yet been migrated into canon, record the gap and update the canonical documents deliberately.

Do not silently treat every supporting recommendation as canonical.

---

## 6.2 Prototype Implementation Truth

Use this order:

```text
1. Actual source code / data in the current repository
2. Confirmed runtime testing
3. Latest TMTB_CURRENT_STATE
4. Latest Architecture / State & Data / implementation handoff
5. Historical implementation documents
```

Actual source and confirmed runtime beat implementation documentation.

If source and runtime disagree, investigate the runtime path and exact source revision before documenting a conclusion.

---

## 6.3 Design vs Implementation Conflict

If design says:

```text
A
```

while prototype still implements:

```text
B
```

write the conflict explicitly.

Possible classifications include:

```text
deferred feature
old implementation
prototype simplification
temporary development exception
bug
migration gap
unverified implementation
```

Never silently rewrite one side to match the other.

---

# 7. Core Active Documentation Set

The current portable active set should remain compact enough to upload into a new chat while still preserving the major project domains.

Recommended active set:

```text
1. README.md

2. TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md

3. TMTB_PROJECT_CONTEXT_vX.X.md

4. TMTB_CHAT_HANDOFF_vX.X.md

5. TMTB_CURRENT_STATE_vX.X.md

6. TMTB_PROTOTYPE_ARCHITECTURE_vX.X.md

7. TMTB_STATE_AND_DATA_MODEL_vX.X.md

8. TMTB_PROGRESS_AND_BACKLOG_vX.X.md

9. TMTB_GAME_DESIGN_CONTEXT.md

10. TMTB_GAME_DESIGN_DECISIONS_vY.Y.md
```

The handoff package version `X.X` and game-design version `Y.Y` may differ.

Supporting handoffs are uploaded only when the task needs their detailed reasoning/evidence.

---

# 8. Recommended Repository Documentation Structure

Exact folder structure may evolve, but the responsibilities should remain clear.

Recommended conceptual structure:

```text
docs/
├─ TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
├─ TMTB_GAME_DESIGN_CONTEXT.md
├─ TMTB_GAME_DESIGN_DECISIONS_vY.Y.md
│
├─ supporting/
│  ├─ <enemy design supporting handoff>
│  ├─ <tutorial supporting handoff>
│  └─ <repository audit supporting handoff>
│
├─ handoff-vX.X/
│  ├─ README.md
│  ├─ TMTB_CHAT_HANDOFF_vX.X.md
│  ├─ TMTB_CURRENT_STATE_vX.X.md
│  ├─ TMTB_PROTOTYPE_ARCHITECTURE_vX.X.md
│  ├─ TMTB_STATE_AND_DATA_MODEL_vX.X.md
│  ├─ TMTB_PROGRESS_AND_BACKLOG_vX.X.md
│  └─ TMTB_PROJECT_CONTEXT_vX.X.md
│
└─ handoff-vOLD/
   └─ historical snapshot
```

The exact `supporting/` location is an organizational choice.

The important rule is:

```text
canonical
supporting
historical
```

must not be ambiguous.

---

# 9. Responsibilities of Core Documents

---

## 9.1 README.md

### Purpose

Entry point to the active documentation package.

README should answer:

```text
What is this project?
What is the current Game Design version?
What is the Handoff Package version?
What is the verified prototype implementation baseline?
Which documents are canonical?
Which documents are supporting?
Which documents are historical?
What should be read first?
Where should work resume?
```

README is written last because it describes the final assembled package.

---

## 9.2 TMTB_PROJECT_CONTEXT_vX.X.md

### Purpose

Stable project-level context.

Should include:

- project identity;
- purpose;
- academic context if still relevant;
- user/Game Designer role;
- programmer/collaborator role;
- prototype purpose;
- Main Game vs Prototype distinction;
- prototype validation philosophy;
- prototype as functional Unity flow reference;
- technology;
- high-level non-goals;
- source-of-truth split;
- design-status terminology;
- collaboration principles.

It should not become a detailed current implementation snapshot.

---

## 9.3 TMTB_CHAT_HANDOFF_vX.X.md

### Purpose

Instructions for how a new assistant should resume and work with the Game Designer.

Should include:

- do not assume memory;
- source-of-truth hierarchy;
- distinction between design intent and implementation truth;
- required audit workflow;
- exact technical assistance style;
- one-small-change rule;
- expected result / test / regression workflow;
- no claim of success before user confirmation;
- relevant supporting-handoff usage;
- exact current resume point.

It should prevent needless re-discussion of already recovered design.

---

## 9.4 TMTB_CURRENT_STATE_vX.X.md

### Purpose

Verified current prototype behaviour.

This is implementation-facing.

It must distinguish:

```text
IMPLEMENTED
TESTED
CONFIRMED
NOT IMPLEMENTED
UNVERIFIED
KNOWN STALE UI/COPY
UNCOMMITTED WORK
```

It should answer:

> What does the prototype actually do now?

Do not put desired future v3.x mechanics into current state as if implemented.

---

## 9.5 TMTB_PROTOTYPE_ARCHITECTURE_vX.X.md

### Purpose

Actual repository/module structure.

Must be based on:

```text
actual tracked tree
actual source
actual imports/responsibilities
```

For important modules record, when useful:

```text
Path
Responsibility
Inputs
Outputs
Called by
Calls
Does NOT own
Audit/verification status
```

Architecture may include known migration pressure.

It must not prescribe a speculative refactor as if it already exists.

---

## 9.6 TMTB_STATE_AND_DATA_MODEL_vX.X.md

### Purpose

Actual current runtime/data state.

Document:

- profile state;
- run state;
- battle state;
- battle unit state;
- tutorial flow state if implemented;
- map/encounter/unit JSON;
- persistence;
- transitions;
- ownership of mutations.

Separate clearly:

```text
CURRENT RUNTIME STATE
```

from:

```text
DESIGN-TARGET STATE NOT YET IMPLEMENTED
```

Future fields are migration targets, not current schema.

---

## 9.7 TMTB_PROGRESS_AND_BACKLOG_vX.X.md

### Purpose

Current project checkpoint + future work.

Use statuses such as:

```text
DONE
IN PROGRESS
NEXT
PLANNED
DEFERRED
OPTIONAL
SUPERSEDED
HISTORICAL
```

A feature is not `DONE` merely because code was written.

Testing/confirmation requirements must be respected.

Historical backlog items should be re-audited and classified rather than copied forward blindly.

---

## 9.8 TMTB_GAME_DESIGN_CONTEXT.md

### Purpose

Full canonical living game-design context.

Contains:

- current systems;
- interactions;
- terminology;
- design philosophy;
- statuses;
- current working directions;
- relevant prototype validation principles.

It is about intended design.

Do not insert current old implementation behaviour as a gameplay rule merely because the prototype still does it.

---

## 9.9 TMTB_GAME_DESIGN_DECISIONS_vY.Y.md

### Purpose

Compact canonical design snapshot.

It should summarize:

```text
LOCKED rules
PLANNED items
important TENTATIVE directions
OPEN questions
SUPERSEDED rules
PROTOTYPE ONLY exceptions/candidates
DEVELOPMENT EXCEPTIONS
```

Do not reproduce long discussion reasoning.

Use supporting handoffs for detail.

---

## 9.10 TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md

### Purpose

Evergreen governance for the documentation system itself.

Update only when the maintenance/recovery protocol changes materially.

Do not create a duplicate version inside every handoff folder unless there is a deliberate archival need.

---

# 10. Why Documents Stay Separate

Do not merge all context into one giant file.

Separation reduces:

- hidden stale information;
- domain confusion;
- accidental design/implementation merging;
- unnecessary reading;
- maintenance burden;
- conflict-detection difficulty.

Typical ownership:

```text
Design rule changes
→ Game Design Context / Decisions

Actual runtime behaviour changes
→ Current State

Module/file responsibility changes
→ Architecture

State field / persistence changes
→ State & Data

Project milestone/backlog changes
→ Progress & Backlog

Collaboration workflow changes
→ Chat Handoff

Project purpose/scope changes
→ Project Context

Documentation-governance changes
→ Maintenance Protocol
```

Supporting handoffs preserve detailed domain reasoning when core docs would become bloated.

---

# 11. Audit-First Documentation Workflow

Do not copy an old handoff and merely bump the version number.

Use this sequence.

---

## Step 1 — Establish the Target of the Documentation Refresh

State clearly:

```text
What changed?
Why is a new package/update needed?
Which domains may be stale?
```

Do not begin by rewriting every document.

---

## Step 2 — Audit Git State

Check:

```bash
git status
git log -1 --oneline
git branch --show-current
git tag --list
```

If relevant, compare against the last known milestone:

```bash
git log --oneline <old-tag>..HEAD
git diff --name-status <old-tag>..HEAD
git diff --stat <old-tag>..HEAD
```

If working tree is dirty:

```text
DO NOT discard changes automatically.
```

Classify them first.

---

## Step 3 — Audit Repository Structure

Use:

```bash
git ls-files
```

or export it.

Purpose:

- identify tracked files;
- detect new/deleted/moved modules;
- locate stale root documents;
- identify deployment/config additions;
- avoid relying on old architecture trees.

---

## Step 4 — Audit Existing Documentation

For each relevant document classify:

```text
KEEP
UPDATE
REPLACE
SUPPORTING-ONLY
HISTORICAL
```

For individual claims/items classify when useful:

```text
CARRIED
NEW
SUPERSEDED
CONFLICT
MISSING
HISTORICAL
```

A new file version should be a result of this audit, not its starting point.

---

## Step 5 — Audit Relevant Actual Source / Data

Only inspect files necessary to establish the documentation truth.

Check:

- current controller/orchestration;
- state initialization;
- actual state fields;
- data schemas;
- storage;
- routing;
- rule modules;
- deployment config;
- tutorial flow;
- current UI when it materially affects state/flow claims.

Do not inspect every file indiscriminately if it does not advance the documentation question.

---

## Step 6 — Confirm Runtime Behaviour

Separate:

```text
IMPLEMENTED IN SOURCE
```

from:

```text
CONFIRMED AT RUNTIME
```

A function existing in source does not automatically mean the user-facing flow works.

Record:

```text
Expected from source
Observed
Match?
Notes
```

when a structured baseline test is useful.

---

## Step 7 — Audit Latest Design Decisions / Supporting Recovery

Review:

```text
latest explicit Game Designer decisions
canonical design docs
relevant supporting design handoffs
```

Determine whether:

```text
canon already contains the decision
or
canon requires deliberate migration
```

Do not leave important later decisions stranded forever in chat/supporting notes.

---

## Step 8 — Create a Supporting Audit / Recovery Handoff When Useful

If the audit or recovery is substantial, create a structured `.md` supporting handoff before rewriting core documents.

Recommended sections:

```text
source/date/status
scope
audit method
verified findings
runtime confirmations
conflicts
reusable seeds
known gaps
exact resume point
```

This preserves evidence and prevents the core docs from becoming reasoning archives.

---

## Step 9 — Build a Documentation Inventory + Migration Matrix

Before authoring:

- list target core documents;
- classify each existing document;
- identify primary authority for each section;
- mark `CARRIED / NEW / SUPERSEDED / MISSING / HISTORICAL`;
- decide version semantics;
- decide authoring order.

Only after this matrix is stable should large-scale documentation authoring begin.

---

## Step 10 — Author One Document Domain at a Time

Recommended general order when a major design recovery and implementation audit have both occurred:

```text
1. Maintenance Protocol
2. Game Design Context
3. Game Design Decisions
4. Current State
5. Prototype Architecture
6. State & Data Model
7. Progress & Backlog
8. Project Context
9. Chat Handoff
10. README
```

This order may change when project circumstances require it.

README remains best written last.

---

## Step 11 — Cross-Document Consistency Audit

Before package completion, verify that related claims agree.

Example:

If Current State says:

```text
Run Overview is implemented and runtime-confirmed.
```

then:

- Architecture should identify the responsible flow/controller modules;
- Progress & Backlog should not list Run Overview as unimplemented;
- Chat Handoff should not describe the old route as current;
- README should point to the new package, not the old checkpoint.

Design-vs-implementation differences are allowed.

Unmarked contradictions are not.

---

## Step 12 — New-Chat Recovery Simulation

Before declaring a major portable package complete, test the package conceptually:

> If a new assistant had only the active portable set, could it correctly understand the project without old chat history?

The package should allow a new assistant to determine:

```text
what TMTB is
current canonical design
actual prototype baseline
important design-vs-implementation gaps
which documents are authoritative
which supporting handoffs exist
what work is already recovered
what remains open
how to work with the Game Designer
where to resume
```

If a major recovered decision would still require manual re-briefing, the package is not yet complete.

---

# 12. Trigger Rules for Updating Documents

## Update Game Design Context when:

- a core design rule changes;
- a major tutorial structure materially evolves;
- a new system interaction becomes canonical;
- terminology/status governance changes materially.

## Create/update Game Design Decisions snapshot when:

- enough canonical decisions have changed to justify a new compact checkpoint;
- superseded/open/tentative status has materially shifted.

## Update Current State when:

- actual prototype flow changes;
- major current behaviour changes;
- implementation gaps change;
- runtime-confirmed state changes;
- important uncommitted work becomes committed or is discarded.

## Update Architecture when:

- files/folders/modules change;
- module responsibilities change;
- deployment architecture changes;
- controller/routing responsibilities change;
- dependencies move.

## Update State & Data Model when:

- runtime state fields change;
- JSON schemas change;
- persistence changes;
- state ownership/transitions change.

## Update Progress & Backlog when:

- checkpoints complete;
- priorities change;
- migration domains change;
- design blockers change;
- historical backlog items are reclassified.

## Update Project Context when:

- project purpose changes;
- prototype role changes;
- team roles change;
- academic scope changes;
- core technology changes;
- source-of-truth/collaboration framing changes materially.

## Update Chat Handoff when:

- collaboration workflow changes;
- resume point changes materially;
- assistant operating rules change;
- supporting-handoff usage changes.

## Update Maintenance Protocol when:

- documentation/recovery governance itself changes.

---

# 13. Historical Preservation

Do not overwrite historical handoff folders merely because they are stale.

Example:

```text
handoff-v2.5
```

remains a historical checkpoint.

When creating a new package:

```text
handoff-v2.5
→ preserved

handoff-v3.0
→ new active snapshot
```

Historical root documents with ambiguous names should eventually be reorganized or renamed if they can mislead future readers, but preserve their contents/provenance.

Do not retroactively rewrite old docs just to make them agree with later design.

---

# 14. Supporting-Handoff Lifecycle

Supporting handoffs are intentionally non-canonical unless explicitly promoted.

Recommended lifecycle:

```text
discussion / recovery / audit
→ structured supporting handoff
→ review against source-of-truth
→ migrate canonical/current facts into proper core docs
→ retain supporting handoff for detail/provenance
```

After migration, mark or understand the supporting handoff as:

```text
supporting detail
not primary active authority
```

Do not delete it merely because the core docs were updated.

---

# 15. Implementation Documentation Status Language

Implementation-facing documentation should use evidence-aware terminology.

Recommended:

```text
IMPLEMENTED
TESTED
CONFIRMED
UNVERIFIED
NOT IMPLEMENTED
KNOWN STALE COPY
UNCOMMITTED WORK
HISTORICAL
```

Examples:

```text
IMPLEMENTED + RUNTIME CONFIRMED:
Run Overview routing.

IMPLEMENTED IN SOURCE, NOT RETESTED:
a carried legacy path.

NOT IMPLEMENTED:
Shared Team AP.

KNOWN STALE COPY:
old tutorial navigation text.
```

Do not use `LOCKED` to describe whether code exists.

`LOCKED` is a game-design status.

---

# 16. Prototype Coding Workflow

Documentation refresh does not replace source audit before future coding.

For each technical change:

```text
Understand target
→ audit current relevant files
→ identify smallest coherent change
→ provide exact edit
→ run
→ compare expected vs actual
→ regression test
→ wait for Game Designer confirmation
→ continue
```

Before giving an edit, provide when possible:

- exact path;
- exact function/block to find;
- add/replace/delete method;
- copy-ready code;
- expected result;
- ordered test;
- regression test.

Do not assume:

```text
save
run
test
success
```

until confirmed.

---

# 17. Error / Regression Workflow

When a new error appears:

```text
actual error
+
relevant current files
→ audit latest change
→ isolate smallest cause
→ fix one thing
→ retest
```

Do not respond to a regression with a broad speculative refactor.

Actual current source/data + runtime evidence beat implementation docs.

---

# 18. Git Workflow

Default development workflow:

```text
Save
→ Test
→ Commit
→ Push
```

Before working on another device:

```text
Fetch
→ Pull
→ Work
```

A local commit alone is not a complete remote backup.

Push deliberate checkpoints.

---

# 19. Milestones and Git Tags

Use Git tags for meaningful implementation milestones.

Examples:

```text
v2.5-full-loop-core
```

Do not create a tag merely because documentation changed unless the documentation checkpoint itself is deliberately being tagged.

Game Design version, Handoff Package version, and Git implementation tag may differ.

This is expected.

---

# 20. ZIP Backup

ZIP is optional, not the routine checkpoint mechanism.

Use ZIP for:

- academic submission;
- presentation package;
- offline archive;
- release bundle.

Routine development should use Git.

---

# 21. Using the Project in a New Chat

Recommended portable upload set:

```text
README.md
TMTB_HANDOFF_MAINTENANCE_PROTOCOL.md
TMTB_PROJECT_CONTEXT_vX.X.md
TMTB_CHAT_HANDOFF_vX.X.md
TMTB_CURRENT_STATE_vX.X.md
TMTB_PROTOTYPE_ARCHITECTURE_vX.X.md
TMTB_STATE_AND_DATA_MODEL_vX.X.md
TMTB_PROGRESS_AND_BACKLOG_vX.X.md
TMTB_GAME_DESIGN_CONTEXT.md
TMTB_GAME_DESIGN_DECISIONS_vY.Y.md
```

Then provide a short instruction such as:

```text
Ini adalah active project source package terbaru TMTB.

Baca dokumen sesuai authority/read-order yang dijelaskan.

Bedakan canonical Game Design dari actual prototype implementation.

Jangan mengulang keputusan yang sudah dipreservasi kecuali ada konflik baru.

Jika task berikutnya coding:
minta/audit actual relevant source files sebelum memberikan edit.
```

Supporting Enemy/Tutorial/Audit handoffs should be uploaded when their detail is relevant.

---

# 22. Do Not Upload the Entire Repository Without Reason

The active documentation package is intended to restore project context.

It does NOT eliminate the need for actual source files when coding.

Use:

```text
Task
→ identify relevant files
→ upload/read those actual files
→ audit
→ edit
```

For a broad repository audit, tracked-file lists and selected central files may be needed.

For a small bug, only the relevant files should be loaded.

---

# 23. New-Chat Read Order

Recommended default read order:

```text
1. README
2. Maintenance Protocol
3. Project Context
4. Game Design Context
5. Game Design Decisions
6. Current State
7. Prototype Architecture
8. State & Data Model
9. Progress & Backlog
10. Chat Handoff
```

Why:

- establish documentation governance;
- establish project purpose;
- establish intended design;
- then inspect actual implementation state;
- finish with exact resume/collaboration instructions.

Supporting handoffs are read on demand.

---

# 24. Cross-Document Consistency Rules

The package is allowed to contain design-vs-implementation gaps.

Example:

```text
Game Design:
Shared Team AP is current direction.

Current State:
prototype still uses Ready / Exhausted.
```

This is valid if explicitly marked as a migration gap.

Invalid package state:

```text
Current State:
Shared AP implemented.

State & Data:
no Team AP state exists.

Architecture:
old Exhaustion only.

Progress:
Shared AP still not started.
```

That is an unmarked contradiction.

When a rule changes, update all documents whose responsibilities are affected.

---

# 25. Quality Checklist

Before declaring a major handoff/documentation refresh complete:

## Governance

- [ ] Game Design version is explicit.
- [ ] Handoff Package version is explicit.
- [ ] Prototype Implementation Baseline is explicit.
- [ ] Canonical/supporting/historical classes are clear.

## Git / Repository

- [ ] Git state is understood.
- [ ] Relevant commit/tag history is understood.
- [ ] Tracked repository structure is audited.
- [ ] Important uncommitted work is classified.

## Design

- [ ] Latest explicit Game Designer decisions are preserved.
- [ ] Canonical Context is current.
- [ ] Decisions snapshot matches Context.
- [ ] TENTATIVE/OPEN content was not silently promoted.

## Implementation

- [ ] Current State reflects actual source/runtime.
- [ ] Implemented vs confirmed is distinguished.
- [ ] Architecture matches actual repository.
- [ ] State/Data reflects actual fields/schemas.
- [ ] Known design-vs-implementation gaps are explicit.

## Backlog

- [ ] Historical backlog was audited, not blindly copied.
- [ ] DONE items have sufficient evidence.
- [ ] Current NEXT is explicit.
- [ ] Deferred/open items remain visible.

## Supporting / Historical

- [ ] Supporting handoffs have clear non-canonical status.
- [ ] Historical snapshots remain preserved.
- [ ] Verbatim evidence is not treated as normal active authority.

## Cross-Document

- [ ] File names/versions/dates are consistent.
- [ ] No major unmarked contradiction exists.
- [ ] README read order matches actual package.
- [ ] Chat Handoff resume point matches Progress & Backlog.

## Recovery Test

- [ ] A new assistant could recover the project without old chat history.
- [ ] Major recovered systems do not require manual re-briefing.
- [ ] Actual source is still requested/audited before coding.

---

# 26. Definition of Done — Documentation Refresh

A major documentation refresh is done when:

```text
Repository / source / runtime audited as needed
→ design recovery audited
→ supporting evidence preserved
→ documentation inventory completed
→ migration matrix completed
→ core documents authored
→ cross-document consistency audited
→ new-chat recovery scenario checked
→ Game Designer reviews result
→ files saved to repository
→ relevant tests complete
→ commit
→ push
```

A Git tag is optional and should reflect a deliberate milestone.

---

# 27. Definition of Done — Supporting Recovery / Audit Handoff

A supporting handoff is sufficient when it preserves:

```text
source/date/status
scope
authority relationship
verified findings or explicit decisions
important conflicts
open questions
what must NOT be inferred
exact resume point
```

It does not need to reproduce every historical message.

Its purpose is reliable recovery, not verbatim archival completeness.

---

# 28. Current TMTB Documentation Governance Example

As of the 11 August 2026 recovery/documentation checkpoint:

```text
Canonical Game Design:
v3.1

Handoff Package:
v3.0

Verified Prototype Implementation Baseline:
Post-v2.5 / Pre-v3 Combat Migration
Verified 11 August 2026
```

This example exists to demonstrate version separation.

Future updates should replace the metadata in active handoff documents rather than assuming this example remains current forever.

---

# 29. Final Principle

A good TMTB project-source package should allow a new assistant to understand:

```text
what TMTB is
→ what the Game Designer currently intends
→ what the prototype actually implements
→ where those two differ
→ what evidence supports the implementation claims
→ which files are authoritative
→ which handoffs preserve detailed reasoning
→ what is historical
→ what remains open
→ how to work with the Game Designer
→ where to resume
```

without requiring the Game Designer to reconstruct months of discussion manually.

The documentation system exists to preserve clarity, not just information volume.

> **Audit first. Document second. Keep design intent and implementation truth explicitly separate.**
