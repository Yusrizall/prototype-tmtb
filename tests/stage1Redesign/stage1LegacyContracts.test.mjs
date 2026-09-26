import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  getMovementTiles,
  moveSelectedUnitToTile
} from "../../src/logic/battle/movementLogic.js";
import {
  getValidPlayerBasicAttackTargets
} from "../../src/logic/battle/playerAttackTargetLogic.js";
import {
  resolveBasicAttackBetweenUnits
} from "../../src/logic/battle/damageLogic.js";
import {
  resolveSkill
} from "../../src/logic/battle/skillLogic.js";

const openMap = {
  width: 6,
  height: 5,
  tiles: Array.from({ length: 5 }, () => Array(6).fill("."))
};

function unit(id, side, x, y, overrides = {}) {
  return {
    battleUnitId: id,
    unitDefId: id === "guard" ? "guard" : "sword_enemy",
    name: id,
    side,
    currentHP: 25,
    maxHP: 25,
    tileX: x,
    tileY: y,
    startGrid: { x, y },
    originTile: { x, y },
    movementApCommitted: false,
    movementLocked: false,
    statuses: [],
    attackType: "melee",
    usesProjectile: false,
    requiresPathCheck: true,
    derivedStats: { atk: side === "player" ? 5 : 6, atr: 1.5, move: 3 },
    ...overrides
  };
}

function state() {
  return {
    phase: "player_phase",
    flowContext: "stage1_redesign",
    battleControlState: "unit_selected_movement",
    selectedUnitId: "guard",
    teamApCurrent: 2,
    teamApCapacity: 2,
    playerUnits: [unit("guard", "player", 1, 2)],
    enemyUnits: [unit("sword", "enemy", 4, 2, { currentTargetId: "guard" })],
    structures: [],
    waveState: { waves: [] }
  };
}

test("legacy StartGrid movement commits one AP once and refunds it on return", () => {
  const initial = state();
  const moved = moveSelectedUnitToTile(openMap, initial, 2, 2);
  assert.equal(moved.teamApCurrent, 1);
  assert.equal(moved.playerUnits[0].movementApCommitted, true);

  const movedAgain = moveSelectedUnitToTile(openMap, moved, 3, 2);
  assert.equal(movedAgain.teamApCurrent, 1);

  const returned = moveSelectedUnitToTile(openMap, movedAgain, 1, 2);
  assert.equal(returned.teamApCurrent, 2);
  assert.equal(returned.playerUnits[0].movementApCommitted, false);
});

test("movement locks reject Attack then Move while Move then Attack remains legal", () => {
  let current = state();
  current.enemyUnits[0].tileX = 3;
  current = moveSelectedUnitToTile(openMap, current, 2, 2);
  assert.equal(current.teamApCurrent, 1);
  assert.equal(getValidPlayerBasicAttackTargets(openMap, current).length, 1);

  const locked = {
    ...current,
    playerUnits: current.playerUnits.map((entry) => ({ ...entry, movementLocked: true }))
  };
  assert.deepEqual(getMovementTiles(openMap, locked), []);
});

test("two basic attacks remain legal when the Sword is already in range and AP remains", () => {
  let current = state();
  current.enemyUnits[0].tileX = 2;
  current.teamApCurrent = 2;
  let first = resolveBasicAttackBetweenUnits(current, "guard", "sword", { coverPercentage: 0 });
  assert.equal(first.attackResult.finalDamage, 5);
  current = { ...first.battleState, teamApCurrent: 1 };
  const second = resolveBasicAttackBetweenUnits(current, "guard", "sword", { coverPercentage: 0 });
  assert.equal(second.attackResult.finalDamage, 5);
  assert.equal(second.battleState.enemyUnits[0].currentHP, 15);
});

test("movement cannot traverse or occupy legacy obstacle tiles", () => {
  const obstacleMap = structuredClone(openMap);
  obstacleMap.tiles[2][2] = "O30";
  const current = state();
  const blocked = moveSelectedUnitToTile(obstacleMap, current, 3, 2);
  assert.equal(blocked.playerUnits[0].tileX, 1);
  assert.equal(getMovementTiles(obstacleMap, current).some((tile) => tile.x === 2 && tile.y === 2), false);
});

test("legacy Skill resolution still locks movement", () => {
  const legacy = { ...state(), flowContext: "run_stage", battleControlState: "skill_targeting" };
  const result = resolveSkill(openMap, legacy, { unlockedSkills: { guard: [] } }, "fortify", "guard");
  assert.equal(result.error, null);
  assert.equal(result.battleState.playerUnits[0].movementLocked, true);
  assert.equal(result.battleState.playerUnits[0].temporaryShield, 4);
});

test("Shield absorbs damage before HP", () => {
  const current = state();
  current.playerUnits[0].temporaryShield = 4;
  const result = resolveBasicAttackBetweenUnits(current, "sword", "guard", { coverPercentage: 0 });
  assert.equal(result.attackResult.shieldAbsorbed, 4);
  assert.equal(result.battleState.playerUnits[0].currentHP, 23);
});

test("runtime keeps shared keyboard and mouse battle action paths", () => {
  const source = fs.readFileSync("src/main.js", "utf8");
  assert.match(source, /function handleKeyboardInput\s*\(/);
  assert.match(source, /\.map-tile[\s\S]*addEventListener\s*\(\s*["']click["']/);
  assert.match(source, /data-action=["']end-player-turn["']/);
  assert.match(source, /commitSelectedBasicAttack\s*\(/);
  assert.match(source, /data-action-choice/);
});
