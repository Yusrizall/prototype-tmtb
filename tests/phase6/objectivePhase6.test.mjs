import test from "node:test";
import assert from "node:assert/strict";
import {
  createDormantObjectiveState,
  createDestroyStructureObjectiveState,
  getObjectivePresentationLabel,
  evaluateEliminateAllObjective
} from "../../src/logic/battle/objectiveLogic.js";

const ids = {
  hutStructureId: "tutorial_hut_1",
  spearEnemyId: "enemy_spear_enemy_2"
};

function state({ hutHP = 28, spearHP = 15 } = {}) {
  return {
    objectiveType: "eliminate_all",
    enemyUnits: [{
      battleUnitId: ids.spearEnemyId,
      currentHP: spearHP
    }],
    structures: [{
      battleStructureId: ids.hutStructureId,
      currentHP: hutHP
    }]
  };
}

test("dormant Objective presents dash", () => {
  const objectiveState = createDormantObjectiveState();
  assert.equal(objectiveState.status, "dormant");
  assert.equal(objectiveState.label, "—");
  assert.equal(getObjectivePresentationLabel({ objectiveState }), "—");
});

test("Destroy Structure Objective has explicit Structure target", () => {
  const objectiveState = createDestroyStructureObjectiveState(ids.hutStructureId);
  assert.equal(objectiveState.status, "active");
  assert.equal(objectiveState.objectiveType, "destroy_structure");
  assert.equal(objectiveState.targetType, "structure");
  assert.equal(objectiveState.targetId, ids.hutStructureId);
  assert.equal(objectiveState.label, "Destroy the Hut");
});

test("normal eliminate_all still resolves normal run Victory", () => {
  const normalBattle = {
    objectiveType: "eliminate_all",
    enemyUnits: [{ currentHP: 0 }]
  };
  const result = evaluateEliminateAllObjective(normalBattle);
  assert.equal(result.resolved, true);
  assert.equal(result.resultState, "victory");
});
