import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createFreshTutorialBattleState,
  createTutorialPhaseJumpState,
  getTutorialPhaseEntryFingerprint
} from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { resolveBasicAttackBetweenUnits } from "../../src/logic/battle/damageLogic.js";
import { initializeTutorialPhase6Content } from "../../src/logic/tutorial/tutorialPhase6Logic.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const readJson = (relativePath) => JSON.parse(
  fs.readFileSync(path.join(root, relativePath), "utf8")
);
const data = {
  playerUnits: readJson("public/data/units/player_units.json"),
  enemyUnits: readJson("public/data/units/enemy_units.json"),
  structureDefinitions: readJson("public/data/structures/structure_definitions.json"),
  tutorialMap: readJson("public/data/maps/tutorial_offset_courtyard.json"),
  tutorialEncounter: readJson("public/data/encounters/tutorial_phase_1_5.json")
};

const clearPath = { coverPercentage: 0, damageBlocked: false };

function patchUnit(units, unitDefId, patch) {
  return units.map((unit) => unit.unitDefId === unitDefId
    ? {
        ...unit,
        ...patch,
        startGrid: patch.startGrid ? { ...patch.startGrid } : unit.startGrid,
        originTile: patch.originTile ? { ...patch.originTile } : unit.originTile
      }
    : unit
  );
}

function idFor(state, side, defId) {
  return (side === "player" ? state.playerUnits : state.enemyUnits)
    .find((unit) => unit.unitDefId === defId).battleUnitId;
}

function seedTutorial(state, patch) {
  return {
    ...state,
    tutorialState: {
      ...state.tutorialState,
      ...patch,
      activeRegionIds: [...(patch.activeRegionIds ?? state.tutorialState.activeRegionIds)],
      targetTile: patch.targetTile === undefined
        ? state.tutorialState.targetTile
        : patch.targetTile === null ? null : { ...patch.targetTile }
    }
  };
}

function normalizePlayerPhase(state, { turnCount, ap, selectedUnitId }) {
  return {
    ...state,
    phase: "player_phase",
    turnCount,
    teamApCurrent: ap,
    teamApCapacity: 4,
    selectedUnitId,
    battleControlState: "unit_selected_movement",
    actionMenuIndex: 0,
    selectedAction: null,
    targetIndex: 0,
    targetType: null,
    targetId: null,
    resultState: "ongoing",
    feedbackMessage: null
  };
}

function naturalReference(phaseNumber) {
  let state = createFreshTutorialBattleState(data);
  const guardId = idFor(state, "player", "guard");
  const archerId = idFor(state, "player", "archer");
  const swordId = idFor(state, "enemy", "sword_enemy");

  if (phaseNumber === 1) return state;

  if (phaseNumber === 2) {
    return seedTutorial(state, {
      phaseId: "phase_2_shared_ap_movement",
      taskId: "move_guard_to_target_a",
      prompt: "Use WASD to move to the highlighted position.",
      targetTile: { x: 3, y: 10 },
      activeRegionIds: ["A"]
    });
  }

  state = normalizePlayerPhase(state, { turnCount: 1, ap: 2, selectedUnitId: guardId });
  state = {
    ...state,
    playerUnits: patchUnit(
      patchUnit(state.playerUnits, "guard", {
        tileX: 3, tileY: 9,
        originTile: { x: 2, y: 10 }, startGrid: { x: 2, y: 10 },
        movementApCommitted: true, movementLocked: false,
        turnState: "positioned", hasActed: false
      }),
      "archer",
      {
        tileX: 2, tileY: 14,
        originTile: { x: 2, y: 12 }, startGrid: { x: 2, y: 12 },
        movementApCommitted: true, movementLocked: false,
        turnState: "positioned", hasActed: false
      }
    )
  };
  state = seedTutorial(state, {
    phaseId: "phase_3_turn_intent_combat",
    taskId: "end_player_turn",
    prompt: "When you're done, end your turn.",
    targetTile: null,
    activeRegionIds: ["A"]
  });
  if (phaseNumber === 3) return state;

  // Natural Phase 3 consequences: Sword moves to (5,11), Player Turn refreshes,
  // Guard moves to (5,10), then the real current damage resolver hits Sword.
  state = normalizePlayerPhase(state, { turnCount: 2, ap: 3, selectedUnitId: guardId });
  state = {
    ...state,
    playerUnits: patchUnit(
      patchUnit(state.playerUnits, "guard", {
        tileX: 5, tileY: 10,
        originTile: { x: 3, y: 9 }, startGrid: { x: 3, y: 9 },
        movementApCommitted: true, movementLocked: false,
        turnState: "positioned", hasActed: false
      }),
      "archer",
      {
        tileX: 2, tileY: 14,
        originTile: { x: 2, y: 14 }, startGrid: { x: 2, y: 14 },
        movementApCommitted: false, movementLocked: false,
        turnState: "ready", hasActed: false
      }
    ),
    enemyUnits: patchUnit(state.enemyUnits, "sword_enemy", {
      tileX: 5, tileY: 11,
      originTile: { x: 8, y: 11 },
      turnState: "ready", hasActed: false
    })
  };
  let attack = resolveBasicAttackBetweenUnits(state, guardId, swordId, clearPath);
  state = {
    ...attack.battleState,
    teamApCurrent: 2,
    playerUnits: patchUnit(attack.battleState.playerUnits, "guard", {
      movementLocked: true,
      turnState: "positioned",
      hasActed: true
    })
  };
  state = seedTutorial(state, {
    phaseId: "phase_4_tactical_space",
    taskId: "switch_to_archer_for_tactical_space",
    prompt: "Press Q to switch to Archer.",
    targetTile: null,
    activeRegionIds: ["A"]
  });
  if (phaseNumber === 4) return state;

  // Natural Phase 4: Archer ends at green position (5,13) and attacks Sword once.
  state = {
    ...state,
    teamApCurrent: 1,
    selectedUnitId: archerId,
    playerUnits: patchUnit(state.playerUnits, "archer", {
      tileX: 5, tileY: 13,
      originTile: { x: 2, y: 14 }, startGrid: { x: 2, y: 14 },
      movementApCommitted: true, movementLocked: false,
      turnState: "positioned", hasActed: false
    })
  };
  attack = resolveBasicAttackBetweenUnits(state, archerId, swordId, clearPath);
  state = {
    ...attack.battleState,
    teamApCurrent: 0,
    playerUnits: patchUnit(attack.battleState.playerUnits, "archer", {
      movementLocked: true,
      turnState: "positioned",
      hasActed: true
    })
  };
  state = seedTutorial(state, {
    phaseId: "phase_4_tactical_space",
    taskId: "end_turn_for_phase5",
    prompt: "End your turn.",
    targetTile: null,
    activeRegionIds: ["A"]
  });
  if (phaseNumber === 5) return state;

  // Natural Phase 5 damage derives from the current damage model, so future
  // no-DEF changes intentionally move this reference and expose stale recipes.
  state = {
    ...state,
    playerUnits: patchUnit(
      patchUnit(state.playerUnits, "guard", {
        currentHP: 25,
        tileX: 6, tileY: 12,
        originTile: { x: 6, y: 9 }, startGrid: { x: 6, y: 9 },
        movementApCommitted: true, movementLocked: true,
        turnState: "positioned", hasActed: true
      }),
      "archer",
      {
        currentHP: 18,
        tileX: 7, tileY: 13,
        originTile: { x: 5, y: 13 }, startGrid: { x: 5, y: 13 },
        movementApCommitted: true, movementLocked: true,
        turnState: "positioned", hasActed: true
      }
    ),
    enemyUnits: patchUnit(state.enemyUnits, "sword_enemy", {
      currentHP: 23,
      tileX: 5, tileY: 11,
      originTile: { x: 5, y: 11 },
      turnState: "ready", hasActed: false
    })
  };

  // Sword first Phase 5 hit on Guard.
  attack = resolveBasicAttackBetweenUnits(state, swordId, guardId, clearPath);
  state = attack.battleState;

  // Three real Archer hits take Sword 23 -> 8 under current rules.
  for (let i = 0; i < 3; i += 1) {
    attack = resolveBasicAttackBetweenUnits(state, archerId, swordId, clearPath);
    state = attack.battleState;
  }

  // Second real Sword hit on Archer after reposition.
  attack = resolveBasicAttackBetweenUnits(state, swordId, archerId, clearPath);
  state = attack.battleState;

  // Final Guard then Archer hits defeat Sword.
  attack = resolveBasicAttackBetweenUnits(state, guardId, swordId, clearPath);
  state = attack.battleState;
  attack = resolveBasicAttackBetweenUnits(state, archerId, swordId, clearPath);
  state = attack.battleState;

  state = normalizePlayerPhase(state, { turnCount: 4, ap: 0, selectedUnitId: archerId });
  state = {
    ...state,
    playerUnits: patchUnit(
      patchUnit(state.playerUnits, "guard", {
        tileX: 6, tileY: 12,
        originTile: { x: 6, y: 9 }, startGrid: { x: 6, y: 9 },
        movementApCommitted: true, movementLocked: true,
        turnState: "positioned", hasActed: true
      }),
      "archer",
      {
        tileX: 7, tileY: 13,
        originTile: { x: 5, y: 13 }, startGrid: { x: 5, y: 13 },
        movementApCommitted: true, movementLocked: true,
        turnState: "positioned", hasActed: true
      }
    ),
    enemyUnits: patchUnit(state.enemyUnits, "sword_enemy", {
      currentHP: 0,
      tileX: 5, tileY: 12,
      originTile: { x: 5, y: 11 },
      turnState: "exhausted", hasActed: true,
      currentTargetId: null, currentIntent: null
    })
  };
  state = seedTutorial(state, {
    phaseId: "phase_6_spear_defensive_cover_objective",
    taskId: "phase_6_entry",
    prompt: null,
    targetTile: null,
    activeRegionIds: ["A", "B"]
  });
  return initializeTutorialPhase6Content(data, state);
}

test("phase-entry fingerprint excludes UI/timer/camera transients", () => {
  const state = {
    ...createTutorialPhaseJumpState(data, 3),
    targetIndex: 9,
    targetType: "unit",
    targetId: "ignored",
    cameraWhatever: { x: 999 }
  };
  const fingerprint = getTutorialPhaseEntryFingerprint(state);
  assert.equal("targetIndex" in fingerprint, false);
  assert.equal("targetType" in fingerprint, false);
  assert.equal("targetId" in fingerprint, false);
  assert.equal("cameraWhatever" in fingerprint, false);
});

for (const phaseNumber of [1, 2, 3, 4, 5, 6]) {
  test(`Jump ${phaseNumber} fingerprint matches current natural Curriculum Entry contract`, () => {
    const natural = naturalReference(phaseNumber);
    const jumped = createTutorialPhaseJumpState(data, phaseNumber);
    assert.deepEqual(
      getTutorialPhaseEntryFingerprint(jumped),
      getTutorialPhaseEntryFingerprint(natural)
    );
  });
}

test("Jump 5 intentionally remains on Phase 4 transition task", () => {
  const fingerprint = getTutorialPhaseEntryFingerprint(createTutorialPhaseJumpState(data, 5));
  assert.equal(fingerprint.tutorial.phaseId, "phase_4_tactical_space");
  assert.equal(fingerprint.tutorial.taskId, "end_turn_for_phase5");
});

test("Jump 6 fingerprint contains normal Phase 6 Spear and Hut initialization", () => {
  const fingerprint = getTutorialPhaseEntryFingerprint(createTutorialPhaseJumpState(data, 6));
  assert.equal(fingerprint.enemyUnits.some((unit) => unit.unitDefId === "spear_enemy" && unit.currentHP === 15), true);
  assert.equal(fingerprint.structures.some((structure) => structure.structureDefId === "tutorial_hut" && structure.currentHP === 28), true);
});

test("phase-entry fingerprint preserves Enemy Intent target identity", () => {
  const state = createTutorialPhaseJumpState(data, 3);
  const guardId = state.playerUnits.find((unit) => unit.unitDefId === "guard").battleUnitId;
  const withIntent = {
    ...state,
    enemyUnits: state.enemyUnits.map((enemy) => enemy.unitDefId === "sword_enemy"
      ? {
          ...enemy,
          currentTargetId: guardId,
          currentIntent: { intentType: "basic_attack", targetId: guardId }
        }
      : enemy
    )
  };
  const fingerprint = getTutorialPhaseEntryFingerprint(withIntent);
  const sword = fingerprint.enemyUnits.find((enemy) => enemy.unitDefId === "sword_enemy");
  assert.equal(sword.currentTargetId, guardId);
  assert.deepEqual(sword.currentIntent, { intentType: "basic_attack", targetId: guardId });
});
