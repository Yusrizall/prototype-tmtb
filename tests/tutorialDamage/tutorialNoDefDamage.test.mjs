import test from "node:test";
import assert from "node:assert/strict";
import { resolveBasicAttackBetweenUnits } from "../../src/logic/battle/damageLogic.js";

function unit({ id, side, hp, atk, def }) {
  return {
    battleUnitId: id,
    unitDefId: id,
    name: id,
    side,
    currentHP: hp,
    maxHP: hp,
    turnState: "ready",
    hasActed: false,
    derivedStats: { atk, def, atr: 3 }
  };
}

const clearPath = {
  outcome: "clear",
  coverPercentage: 0,
  actionPathValid: true,
  losValid: true,
  damageBlocked: false
};

const partialCoverPath = {
  outcome: "partial_cover",
  coverPercentage: 0.3,
  actionPathValid: true,
  losValid: true,
  damageBlocked: false
};

test("Tutorial unit damage ignores target DEF on a clear attack", () => {
  const attacker = unit({ id: "attacker", side: "enemy", hp: 15, atk: 5, def: 2 });
  const target = unit({ id: "target", side: "player", hp: 25, atk: 5, def: 4 });
  const state = {
    flowContext: "tutorial",
    playerUnits: [target],
    enemyUnits: [attacker],
    structures: []
  };

  const result = resolveBasicAttackBetweenUnits(
    state,
    attacker.battleUnitId,
    target.battleUnitId,
    clearPath
  );

  assert.equal(result.attackResult.finalDamage, 5);
  assert.equal(result.attackResult.targetDefense, 0);
  assert.equal(result.attackResult.targetHPAfter, 20);
});

test("Tutorial Partial Cover reduces ATK then floors damage without DEF subtraction", () => {
  const attacker = unit({ id: "attacker", side: "enemy", hp: 15, atk: 5, def: 2 });
  const target = unit({ id: "target", side: "player", hp: 25, atk: 5, def: 4 });
  const state = {
    flowContext: "tutorial",
    playerUnits: [target],
    enemyUnits: [attacker],
    structures: []
  };

  const result = resolveBasicAttackBetweenUnits(
    state,
    attacker.battleUnitId,
    target.battleUnitId,
    partialCoverPath
  );

  assert.equal(result.attackResult.attackAfterCover, 3.5);
  assert.equal(result.attackResult.finalDamage, 3);
  assert.equal(result.attackResult.targetHPAfter, 22);
});

test("non-Tutorial unit damage keeps the existing DEF subtraction", () => {
  const attacker = unit({ id: "attacker", side: "player", hp: 18, atk: 7, def: 1 });
  const target = unit({ id: "target", side: "enemy", hp: 16, atk: 6, def: 2 });
  const state = {
    flowContext: "run",
    playerUnits: [attacker],
    enemyUnits: [target],
    structures: []
  };

  const result = resolveBasicAttackBetweenUnits(
    state,
    attacker.battleUnitId,
    target.battleUnitId,
    clearPath
  );

  assert.equal(result.attackResult.finalDamage, 5);
  assert.equal(result.attackResult.targetDefense, 2);
  assert.equal(result.attackResult.targetHPAfter, 11);
});

test("Candidate B preserves the required Phase 3-5 Sword damage choreography", () => {
  let guard = unit({ id: "guard", side: "player", hp: 25, atk: 5, def: 4 });
  let archer = unit({ id: "archer", side: "player", hp: 18, atk: 7, def: 1 });
  let sword = unit({ id: "sword", side: "enemy", hp: 43, atk: 7, def: 2 });
  let state = {
    flowContext: "tutorial",
    playerUnits: [guard, archer],
    enemyUnits: [sword],
    structures: []
  };

  const hit = (attackerId, targetId) => {
    const result = resolveBasicAttackBetweenUnits(state, attackerId, targetId, clearPath);
    assert.ok(result.attackResult);
    state = result.battleState;
    return result.attackResult;
  };

  hit("guard", "sword");
  assert.equal(state.enemyUnits[0].currentHP, 38);

  hit("archer", "sword");
  assert.equal(state.enemyUnits[0].currentHP, 31);

  hit("sword", "guard");
  assert.equal(state.playerUnits.find((u) => u.battleUnitId === "guard").currentHP, 18);

  hit("archer", "sword");
  hit("archer", "sword");
  hit("archer", "sword");
  assert.equal(state.enemyUnits[0].currentHP, 10);

  hit("sword", "archer");
  assert.equal(state.playerUnits.find((u) => u.battleUnitId === "archer").currentHP, 11);

  hit("guard", "sword");
  assert.equal(state.enemyUnits[0].currentHP, 5);

  hit("archer", "sword");
  assert.equal(state.enemyUnits[0].currentHP, 0);
});
