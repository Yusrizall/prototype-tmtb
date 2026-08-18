import test from "node:test";
import assert from "node:assert/strict";
import {
  getPlayerBasicAttackCandidates,
  getValidPlayerBasicAttackTargets
} from "../../src/logic/battle/playerAttackTargetLogic.js";
import { getBasicAttackCandidatesForUnit } from "../../src/logic/battle/atrLogic.js";

function makeMap(width = 16, height = 16) {
  return {
    width,
    height,
    tiles: Array.from({ length: height }, () => Array(width).fill("."))
  };
}

function makeArcher(x = 9, y = 12) {
  return {
    battleUnitId: "player_archer_1",
    unitDefId: "archer",
    name: "Archer",
    side: "player",
    tileX: x,
    tileY: y,
    currentHP: 18,
    derivedStats: { atk: 7, def: 1, move: 4, atr: 3 },
    attackType: "ranged"
  };
}

function makeSword(x = 8, y = 11) {
  return {
    battleUnitId: "enemy_sword_enemy_1",
    unitDefId: "sword_enemy",
    name: "Sword Enemy",
    side: "enemy",
    tileX: x,
    tileY: y,
    currentHP: 16,
    derivedStats: { atk: 6, def: 2, move: 3, atr: 1.5 },
    attackType: "melee"
  };
}

function makeHut() {
  const footprint = [];
  for (let y = 9; y <= 11; y += 1) {
    for (let x = 11; x <= 13; x += 1) {
      footprint.push({ x, y });
    }
  }
  return {
    battleStructureId: "tutorial_hut_1",
    structureDefId: "tutorial_hut",
    name: "Hut",
    currentHP: 28,
    maxHP: 28,
    derivedStats: { def: 0 },
    targetable: true,
    occupiesTacticalSpace: true,
    footprint
  };
}

test("Phase 6 Archer paper position can target Hut through nearest valid footprint", () => {
  const map = makeMap();
  const archer = makeArcher();
  const hut = makeHut();
  const battleState = {
    selectedUnitId: archer.battleUnitId,
    playerUnits: [archer],
    enemyUnits: [],
    structures: [hut]
  };

  const hutTarget = getPlayerBasicAttackCandidates(map, battleState)
    .find((target) => target.targetType === "structure");

  assert.equal(hutTarget.actionValid, true);
  assert.deepEqual(hutTarget.interactionTile, { x: 11, y: 11 });
  assert.ok(Math.abs(hutTarget.distance - Math.sqrt(5)) < 1e-9);
  assert.equal(getValidPlayerBasicAttackTargets(map, battleState).length, 1);
});

test("another valid footprint tile keeps Structure targetable when nearest physical tile is invalid", () => {
  const map = makeMap(5, 4);
  map.tiles[0][1] = "LOS";
  const archer = makeArcher(0, 0);
  archer.derivedStats.atr = 5;
  const hut = {
    ...makeHut(),
    footprint: [{ x: 2, y: 0 }, { x: 2, y: 2 }]
  };
  const battleState = {
    selectedUnitId: archer.battleUnitId,
    playerUnits: [archer],
    enemyUnits: [],
    structures: [hut]
  };

  const hutTarget = getPlayerBasicAttackCandidates(map, battleState)[0];
  assert.equal(hutTarget.actionValid, true);
  assert.deepEqual(hutTarget.interactionTile, { x: 2, y: 2 });
  assert.equal(hutTarget.pathResult.outcome, "clear");
});

test("nearest valid footprint resolves deterministic distance then y then x", () => {
  const map = makeMap(6, 6);
  const archer = makeArcher(0, 0);
  archer.derivedStats.atr = 6;
  const hut = {
    ...makeHut(),
    footprint: [{ x: 2, y: 2 }, { x: 2, y: 0 }, { x: 0, y: 2 }]
  };
  const battleState = {
    selectedUnitId: archer.battleUnitId,
    playerUnits: [archer],
    enemyUnits: [],
    structures: [hut]
  };

  const hutTarget = getPlayerBasicAttackCandidates(map, battleState)[0];
  assert.deepEqual(hutTarget.interactionTile, { x: 2, y: 0 });
});

test("normal enemy Unit descriptor preserves existing spatial candidate semantics", () => {
  const map = makeMap();
  const archer = makeArcher(7, 13);
  const sword = makeSword(8, 11);
  const battleState = {
    selectedUnitId: archer.battleUnitId,
    playerUnits: [archer],
    enemyUnits: [sword],
    structures: []
  };

  const oldCandidate = getBasicAttackCandidatesForUnit(map, archer, [sword])[0];
  const genericCandidate = getPlayerBasicAttackCandidates(map, battleState)[0];

  assert.equal(genericCandidate.targetType, "unit");
  assert.equal(genericCandidate.targetId, sword.battleUnitId);
  assert.equal(genericCandidate.entity, sword);
  assert.deepEqual(genericCandidate.interactionTile, { x: sword.tileX, y: sword.tileY });
  assert.equal(genericCandidate.distance, oldCandidate.distance);
  assert.equal(genericCandidate.actionValid, oldCandidate.actionValid);
  assert.equal(genericCandidate.pathResult.outcome, oldCandidate.pathResult.outcome);
});
