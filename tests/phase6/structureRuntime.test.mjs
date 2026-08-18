import test from "node:test";
import assert from "node:assert/strict";
import {
  createBattleStructure,
  createRectangularStructureFootprint,
  findBattleStructureById,
  isStructureBlockingTile,
  isStructureTargetable
} from "../../src/logic/battle/structureLogic.js";
import { getReachableTilesForUnit } from "../../src/logic/battle/movementLogic.js";

const definitions = {
  structures: [{
    structureDefId: "tutorial_hut",
    name: "Hut",
    maxHP: 28,
    baseDEF: 0,
    targetable: true,
    occupiesTacticalSpace: true
  }]
};

const placement = {
  battleStructureId: "tutorial_hut_1",
  structureDefId: "tutorial_hut",
  topLeft: { x: 2, y: 1 },
  width: 3,
  height: 3
};

const map = {
  width: 7,
  height: 5,
  tiles: Array.from({ length: 5 }, () => Array(7).fill("."))
};

const movingUnit = {
  battleUnitId: "player_guard_1",
  side: "player",
  tileX: 0,
  tileY: 2,
  originTile: { x: 0, y: 2 },
  currentHP: 25,
  derivedStats: { move: 5 }
};

test("rectangular Hut footprint contains exactly nine unique tiles", () => {
  const footprint = createRectangularStructureFootprint({ x: 2, y: 1 }, 3, 3);
  assert.equal(footprint.length, 9);
  assert.deepEqual(footprint[0], { x: 2, y: 1 });
  assert.deepEqual(footprint.at(-1), { x: 4, y: 3 });
});

test("Hut is one entity with nine blocking footprint tiles", () => {
  const hut = createBattleStructure(definitions, placement);
  assert.equal(hut.footprint.length, 9);
  assert.equal(hut.currentHP, 28);
  assert.equal(hut.maxHP, 28);
  assert.equal(hut.derivedStats.def, 0);

  const battleState = { structures: [hut] };
  assert.equal(findBattleStructureById(battleState, "tutorial_hut_1"), hut);
  assert.equal(isStructureBlockingTile(battleState, 2, 1), true);
  assert.equal(isStructureBlockingTile(battleState, 4, 3), true);
});

test("destroyed Tutorial Hut remains blocking but is no longer targetable", () => {
  const hut = {
    ...createBattleStructure(definitions, placement),
    currentHP: 0
  };
  const battleState = { structures: [hut] };
  assert.equal(isStructureBlockingTile(battleState, 3, 2), true);
  assert.equal(isStructureTargetable(hut), false);
});

test("movement cannot traverse or end on a Structure footprint", () => {
  const hut = createBattleStructure(definitions, placement);
  const battleState = {
    playerUnits: [movingUnit],
    enemyUnits: [],
    structures: [hut]
  };

  const reachable = getReachableTilesForUnit(
    map,
    battleState,
    movingUnit,
    movingUnit.originTile,
    5
  );

  for (const tile of hut.footprint) {
    assert.equal(
      reachable.some((candidate) => candidate.x === tile.x && candidate.y === tile.y),
      false,
      `Structure tile ${tile.x},${tile.y} must not be reachable`
    );
  }
});
