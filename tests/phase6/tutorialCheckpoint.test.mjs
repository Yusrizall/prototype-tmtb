import test from "node:test";
import assert from "node:assert/strict";
import {
  captureTutorialCheckpoint,
  restoreTutorialCheckpoint
} from "../../src/logic/tutorial/tutorialCheckpointLogic.js";

test("CP6 restore is a deep tactical snapshot and does not recurse", () => {
  const originalState = {
    playerUnits: [{ battleUnitId: "player_guard_1", currentHP: 21 }],
    enemyUnits: [{ battleUnitId: "enemy_spear_enemy_2", currentHP: 15 }],
    structures: [{ battleStructureId: "tutorial_hut_1", currentHP: 28 }],
    teamApCurrent: 0,
    tutorialState: { phaseId: "phase_6_spear_defensive_cover_objective", taskId: "phase_6_entry" }
  };

  const checkpoint = captureTutorialCheckpoint("cp6", originalState);
  originalState.playerUnits[0].currentHP = 1;
  originalState.structures[0].currentHP = 0;

  const restored = restoreTutorialCheckpoint(checkpoint);
  assert.equal(checkpoint.checkpointId, "cp6");
  assert.equal(restored.playerUnits[0].currentHP, 21);
  assert.equal(restored.structures[0].currentHP, 28);
  assert.notStrictEqual(restored, checkpoint.snapshot);
  assert.equal(Object.hasOwn(checkpoint.snapshot, "checkpoint"), false);
  assert.equal(Object.hasOwn(checkpoint.snapshot, "latestTutorialCheckpoint"), false);
});
