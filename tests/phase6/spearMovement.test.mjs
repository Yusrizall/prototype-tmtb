import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveEnemyMovementPhase } from "../../src/logic/battle/enemyMovementLogic.js";
import { resolveEnemyAttackPhase } from "../../src/logic/battle/enemyAttackLogic.js";
import { createBattleStructure } from "../../src/logic/battle/structureLogic.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const tutorialMap = JSON.parse(
  fs.readFileSync(path.join(root, "public/data/maps/tutorial_offset_courtyard.json"), "utf8")
);
const structureDefinitions = JSON.parse(
  fs.readFileSync(path.join(root, "public/data/structures/structure_definitions.json"), "utf8")
);

function player(unitDefId, x, y, hp, def) {
  return {
    battleUnitId: `player_${unitDefId}_1`,
    unitDefId,
    name: unitDefId === "guard" ? "Guard" : "Archer",
    side: "player",
    tileX: x,
    tileY: y,
    currentHP: hp,
    derivedStats: { atk: unitDefId === "guard" ? 5 : 7, def, move: unitDefId === "guard" ? 3 : 4, atr: unitDefId === "guard" ? 1.5 : 3 },
    attackType: unitDefId === "guard" ? "melee" : "ranged"
  };
}

function spear(x, y, targetId) {
  return {
    battleUnitId: "enemy_spear_enemy_2",
    unitDefId: "spear_enemy",
    name: "Spear Enemy",
    side: "enemy",
    tileX: x,
    tileY: y,
    originTile: { x, y },
    currentHP: 15,
    derivedStats: { atk: 6, def: 2, move: 4, atr: 3 },
    attackType: "ranged",
    movementRule: "seek_max_effective_atr",
    actionRule: "basic_attack_if_effective",
    currentTargetId: targetId,
    currentIntent: { intentType: "basic_attack", targetId },
    spawnOrder: 2,
    turnState: "ready",
    hasActed: false
  };
}

function phase6Hut() {
  return createBattleStructure(structureDefinitions, {
    battleStructureId: "tutorial_hut_1",
    structureDefId: "tutorial_hut",
    topLeft: { x: 11, y: 9 },
    width: 3,
    height: 3
  });
}

function tutorialState(players, enemy) {
  return {
    flowContext: "tutorial",
    tutorialState: { activeRegionIds: ["A", "B"] },
    playerUnits: players,
    enemyUnits: [enemy],
    structures: [phase6Hut()]
  };
}

test("Sword keeps existing melee-seeking destination preference", () => {
  const map = { width: 7, height: 7, tiles: Array.from({ length: 7 }, () => Array(7).fill(".")) };
  const guard = player("guard", 0, 0, 25, 4);
  const sword = {
    battleUnitId: "enemy_sword_enemy_1",
    unitDefId: "sword_enemy",
    name: "Sword Enemy",
    side: "enemy",
    tileX: 3,
    tileY: 3,
    originTile: { x: 3, y: 3 },
    currentHP: 16,
    derivedStats: { atk: 6, def: 2, move: 3, atr: 1.5 },
    attackType: "melee",
    movementRule: "seek_melee_engagement",
    actionRule: "basic_attack",
    currentTargetId: guard.battleUnitId,
    spawnOrder: 1
  };
  const state = { playerUnits: [guard], enemyUnits: [sword], structures: [] };
  const result = resolveEnemyMovementPhase(map, state, [sword.battleUnitId]);
  assert.deepEqual(result.movementEvents[0].to, { x: 2, y: 1 });
  assert.equal(result.movementEvents[0].movementMode, "fallback_approach");
});

test("Spear naturally finds Phase 6 P1 from S0", () => {
  const guard = player("guard", 6, 12, 21, 4);
  const archer = player("archer", 7, 13, 11, 1);
  const enemy = spear(10, 8, guard.battleUnitId);
  const state = tutorialState([guard, archer], enemy);

  const result = resolveEnemyMovementPhase(tutorialMap, state, [enemy.battleUnitId]);
  const movedSpear = result.battleState.enemyUnits[0];
  assert.deepEqual({ x: movedSpear.tileX, y: movedSpear.tileY }, { x: 8, y: 10 });
  assert.equal(result.movementEvents[0].movementMode, "max_effective_atr_engagement");
  assert.equal(result.movementEvents[0].pathOutcome, "clear");
});

test("Spear backs away to Phase 6 P2 after Guard moves into Cover", () => {
  const guard = player("guard", 7, 11, 19, 4);
  const archer = player("archer", 7, 13, 11, 1);
  const enemy = spear(8, 10, guard.battleUnitId);
  const state = tutorialState([guard, archer], enemy);

  const result = resolveEnemyMovementPhase(tutorialMap, state, [enemy.battleUnitId]);
  const movedSpear = result.battleState.enemyUnits[0];
  assert.deepEqual({ x: movedSpear.tileX, y: movedSpear.tileY }, { x: 10, y: 11 });
  assert.equal(result.movementEvents[0].targetDistance, 3);
  assert.equal(result.movementEvents[0].pathOutcome, "partial_cover");
});

test("Partial Cover remains a usable Spear shot even when final damage floors to zero", () => {
  const guard = player("guard", 7, 11, 19, 4);
  const enemy = spear(10, 11, guard.battleUnitId);
  const state = tutorialState([guard], enemy);

  const result = resolveEnemyAttackPhase(tutorialMap, state, [enemy.battleUnitId]);
  const event = result.attackEvents[0];
  assert.equal(event.attacked, true);
  assert.equal(event.pathOutcome, "partial_cover");
  assert.equal(event.finalDamage, 0);
});

test("Spear effective-shot rule declines damageBlocked Full Cover", () => {
  const map = { width: 5, height: 1, tiles: [[".", ".", "OF", ".", "."]] };
  const guard = player("guard", 0, 0, 25, 4);
  const enemy = spear(4, 0, guard.battleUnitId);
  enemy.derivedStats.atr = 5;
  const state = { playerUnits: [guard], enemyUnits: [enemy], structures: [] };

  const result = resolveEnemyAttackPhase(map, state, [enemy.battleUnitId]);
  assert.equal(result.attackEvents[0].attacked, false);
  assert.equal(result.attackEvents[0].reason, "current_target_ineffective");
});

test("Spear stays when current tile is already the best effective spacing", () => {
  const map = { width: 7, height: 7, tiles: Array.from({ length: 7 }, () => Array(7).fill(".")) };
  const guard = player("guard", 1, 3, 25, 4);
  const enemy = spear(4, 3, guard.battleUnitId);
  const state = { playerUnits: [guard], enemyUnits: [enemy], structures: [] };

  const result = resolveEnemyMovementPhase(map, state, [enemy.battleUnitId]);
  assert.equal(result.movementEvents[0].moved, false);
  assert.deepEqual(result.movementEvents[0].to, { x: 4, y: 3 });
});
