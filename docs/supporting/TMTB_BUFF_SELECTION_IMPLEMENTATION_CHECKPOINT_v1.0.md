# TMTB Buff Selection Implementation Checkpoint v1.0

**Date:** 6 September 2026  
**Status:** Implemented, automated verification passed, pending user runtime validation  
**Scope:** Patch 3 vertical slice

## Implemented Flow

```text
Normal Stage Victory
→ Battle Result
→ Buff Selection
→ select and confirm one Buff, or confirm twice without a selection
→ Map Selection
```

Tutorial completion follows the corrected route:

```text
Tutorial Phase 8 Victory
→ Tutorial Ending
→ START ADVENTURE
→ Region Overview
```

Tutorial completion does not enter Buff Selection or Map Selection directly.

## Implemented Buff Selection Contract

- Two offer slots are generated independently.
- Node Type controls the prototype rarity weights.
- Rarity is communicated through card treatment without visible rarity text.
- Clicking a card selects it, clicking it again deselects it, and clicking the other card switches selection.
- Confirming a selection adds the Buff to `activeRunBuffs` and removes its ID from `availableBuffIds`.
- The first confirmation with no selection shows `No buff selected. Are you sure?`.
- A second confirmation while still empty skips the Buff.
- Selecting a card clears the skip warning.
- Confirming a Buff plays a short collection animation before routing onward.
- Active Buff List uses ten visible slots in a five by two grid on Battle Result, Buff Selection, and Map Selection.
- Implemented stat modifiers affect the next normal battle state for Max HP, ATK, DEF, Movement, Attack Range, and Team AP Capacity.

## Prototype Boundaries

- Buff names, numerical balance, rarity weights, and visual art remain provisional.
- Icons are typographic placeholders.
- The modifier layer supports the current numerical prototype effects. It is not a universal trigger or behavior engine.
- Shop integration and unlock progression remain outside this patch.
