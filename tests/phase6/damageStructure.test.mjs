import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveBasicAttack,
  resolveBasicAttackBetweenUnits
} from "../../src/logic/battle/damageLogic.js";

const clearPathResult = {
  outcome: "clear",
  coverPercentage: 0,
  actionPathValid: true,
  losValid: true,
  damageBlocked: false
};

function makeArcher() {
  return {
    battleUnitId: "player_archer_1",
    unitDefId: "archer",
    name: "Archer",
    side: "player",
    currentHP: 18,
    turnState: "ready",
    hasActed: false,
    derivedStats: { atk: 7, def: 1, atr: 3 }
  };
}

function makeHut(hp = 28) {
  return {
    battleStructureId: "tutorial_hut_1",
    structureDefId: "tutorial_hut",
    name: "Hut",
    currentHP: hp,
    maxHP: 28,
    derivedStats: { def: 0 },
    targetable: true,
    occupiesTacticalSpace: true,
    footprint: [{ x: 11, y: 11 }]
  };
}

function makeSword() {
  return {
    battleUnitId: "enemy_sword_enemy_1",
    unitDefId: "sword_enemy",
    name: "Sword Enemy",
    side: "enemy",
    currentHP: 16,
    turnState: "ready",
    hasActed: false,
    derivedStats: { atk: 6, def: 2, atr: 1.5 }
  };
}

test("Structure Basic Attack updates one Hut HP pool", () => {
  const archer = makeArcher();
  const battleState = {
    selectedUnitId: archer.battleUnitId,
    playerUnits: [archer],
    enemyUnits: [],
    structures: [makeHut()]
  };

  const result = resolveBasicAttack(
    battleState,
    "structure",
    "tutorial_hut_1",
    clearPathResult
  );

  assert.equal(result.attackResult.targetType, "structure");
  assert.equal(result.attackResult.targetId, "tutorial_hut_1");
  assert.equal(result.attackResult.targetHPBefore, 28);
  assert.equal(result.attackResult.targetHPAfter, 21);
  assert.equal(result.attackResult.targetDestroyed, false);
  assert.equal(result.attackResult.targetDefeated, false);
  assert.equal(result.battleState.structures.length, 1);
  assert.equal(result.battleState.structures[0].currentHP, 21);
});

test("destroying Hut keeps its Structure record", () => {
  const archer = makeArcher();
  const battleState = {
    selectedUnitId: archer.battleUnitId,
    playerUnits: [archer],
    enemyUnits: [],
    structures: [makeHut(5)]
  };

  const result = resolveBasicAttack(
    battleState,
    "structure",
    "tutorial_hut_1",
    clearPathResult
  );

  assert.equal(result.battleState.structures.length, 1);
  assert.equal(result.battleState.structures[0].currentHP, 0);
  assert.equal(result.attackResult.targetDestroyed, true);
  assert.equal(result.attackResult.targetDefeated, false);
});

test("unit-vs-unit Basic Attack keeps existing damage result and explicit target type", () => {
  const archer = makeArcher();
  const sword = makeSword();
  const unitBattleState = {
    playerUnits: [archer],
    enemyUnits: [sword],
    structures: []
  };

  const result = resolveBasicAttackBetweenUnits(
    unitBattleState,
    archer.battleUnitId,
    sword.battleUnitId,
    clearPathResult
  );

  assert.equal(result.attackResult.finalDamage, 5);
  assert.equal(result.attackResult.targetHPAfter, 11);
  assert.equal(result.attackResult.targetType, "unit");
  assert.equal(result.attackResult.targetDestroyed, false);
  assert.equal(result.attackResult.targetDefeated, false);
});
