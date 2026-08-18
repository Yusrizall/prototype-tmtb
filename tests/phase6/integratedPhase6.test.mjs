import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  initializeTutorialPhase6Content,
  advanceTutorialPhase6Brief,
  recordTutorialPhase6EndTurn,
  recordTutorialPhase6EnemyMovement,
  recordTutorialPhase6EnemyResolution,
  recordTutorialPhase6PlayerTurnStart,
  recordTutorialPhase6UnitSelection,
  recordTutorialPhase6PlayerMovement,
  recordTutorialPhase6BasicAttack
} from "../../src/logic/tutorial/tutorialPhase6Logic.js";
import { resolveEnemyCurrentTarget } from "../../src/logic/battle/enemyTargetLogic.js";
import { resolveEnemyCurrentIntent } from "../../src/logic/battle/enemyIntentLogic.js";
import { resolveEnemyMovementPhase } from "../../src/logic/battle/enemyMovementLogic.js";
import { resolveEnemyAttackPhase } from "../../src/logic/battle/enemyAttackLogic.js";
import { moveSelectedUnitByDirection } from "../../src/logic/battle/movementLogic.js";
import { getValidPlayerBasicAttackTargets } from "../../src/logic/battle/playerAttackTargetLogic.js";
import { resolveBasicAttack } from "../../src/logic/battle/damageLogic.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const readJson = (relativePath) => JSON.parse(
  fs.readFileSync(path.join(root, relativePath), "utf8")
);
const data = {
  enemyUnits: readJson("public/data/units/enemy_units.json"),
  structureDefinitions: readJson("public/data/structures/structure_definitions.json"),
  tutorialMap: readJson("public/data/maps/tutorial_offset_courtyard.json"),
  tutorialEncounter: readJson("public/data/encounters/tutorial_phase_1_5.json")
};

function player(unitDefId, x, y, hp) {
  const guard = unitDefId === "guard";
  return {
    battleUnitId: `player_${unitDefId}_1`,
    unitDefId,
    name: guard ? "Guard" : "Archer",
    side: "player",
    tileX: x,
    tileY: y,
    currentHP: hp,
    maxHP: guard ? 25 : 18,
    startGrid: { x, y },
    originTile: { x, y },
    movementApCommitted: false,
    movementLocked: false,
    derivedStats: { atk: guard ? 5 : 7, def: guard ? 4 : 1, move: guard ? 3 : 4, atr: guard ? 1.5 : 3 },
    attackType: guard ? "melee" : "ranged",
    turnState: "ready",
    hasActed: false
  };
}

function deadSword() {
  return {
    battleUnitId: "enemy_sword_enemy_1",
    unitDefId: "sword_enemy",
    name: "Sword Enemy",
    side: "enemy",
    tileX: 8,
    tileY: 11,
    currentHP: 0,
    maxHP: 43,
    derivedStats: { atk: 7, def: 2, move: 3, atr: 1.5 },
    attackType: "melee",
    movementRule: "seek_melee_engagement",
    actionRule: "basic_attack",
    spawnOrder: 1,
    turnState: "exhausted",
    hasActed: true,
    currentTargetId: null,
    currentIntent: null
  };
}

function entryState() {
  const guard = player("guard", 6, 12, 18);
  const archer = player("archer", 7, 13, 11);
  return {
    flowContext: "tutorial",
    stageId: "tutorial_stage",
    phase: "player_phase",
    turnCount: 4,
    teamApCurrent: 0,
    teamApCapacity: 4,
    selectedUnitId: archer.battleUnitId,
    battleControlState: "unit_selected_movement",
    actionMenuIndex: 0,
    selectedAction: null,
    targetIndex: 0,
    targetType: null,
    targetId: null,
    resultState: "ongoing",
    objectiveType: "eliminate_all",
    playerUnits: [guard, archer],
    enemyUnits: [deadSword()],
    structures: [],
    tutorialState: {
      status: "active",
      phaseId: "phase_6_spear_defensive_cover_objective",
      taskId: "phase_6_entry",
      activeRegionIds: ["A", "B"],
      prompt: null,
      targetTile: null,
      evidence: {}
    }
  };
}

function resetEnemyForTurn(state, spearId) {
  return {
    ...state,
    phase: "enemy_phase",
    teamApCurrent: 0,
    selectedUnitId: null,
    battleControlState: "enemy_phase",
    enemyUnits: state.enemyUnits.map((enemy) => enemy.battleUnitId === spearId
      ? { ...enemy, originTile: { x: enemy.tileX, y: enemy.tileY }, turnState: "ready", hasActed: false }
      : enemy)
  };
}

function refreshSpearTargetAndIntent(state, spearId) {
  const target = resolveEnemyCurrentTarget(state, spearId);
  const intent = resolveEnemyCurrentIntent(target.battleState, spearId);
  return { state: intent.battleState, target: target.target, intent: intent.intent };
}

function startPlayerTurn(state, selectedUnitId) {
  return {
    ...state,
    phase: "player_phase",
    teamApCurrent: 4,
    teamApCapacity: 4,
    selectedUnitId,
    battleControlState: "unit_selected_movement",
    playerUnits: state.playerUnits.map((unit) => unit.currentHP > 0 ? {
      ...unit,
      startGrid: { x: unit.tileX, y: unit.tileY },
      originTile: { x: unit.tileX, y: unit.tileY },
      movementApCommitted: false,
      movementLocked: false,
      turnState: "ready",
      hasActed: false
    } : unit)
  };
}

test("integrated revised Phase 6 resolves P1, Guard pressure, P2 pause, Spear finish, then Hut", () => {
  let state = initializeTutorialPhase6Content(data, entryState());
  const spearId = state.tutorialState.phase6Entities.spearEnemyId;
  const hutId = state.tutorialState.phase6Entities.hutStructureId;
  const guardId = state.playerUnits.find((u) => u.unitDefId === "guard").battleUnitId;
  const archerId = state.playerUnits.find((u) => u.unitDefId === "archer").battleUnitId;

  let readable = refreshSpearTargetAndIntent(state, spearId);
  state = readable.state;
  assert.equal(readable.target.battleUnitId, guardId);

  state = advanceTutorialPhase6Brief(state);
  state = advanceTutorialPhase6Brief(state);
  state = advanceTutorialPhase6Brief(state);
  state = recordTutorialPhase6EndTurn(state, resetEnemyForTurn(state, spearId));

  readable = refreshSpearTargetAndIntent(state, spearId);
  state = readable.state;
  const firstMove = resolveEnemyMovementPhase(data.tutorialMap, state, [spearId]);
  state = firstMove.battleState;
  assert.deepEqual(firstMove.movementEvents[0].to, { x: 8, y: 10 });
  const firstAttack = resolveEnemyAttackPhase(data.tutorialMap, state, [spearId]);
  state = firstAttack.battleState;
  assert.equal(firstAttack.attackEvents[0].pathOutcome, "clear");
  assert.equal(firstAttack.attackEvents[0].finalDamage, 5);
  state = recordTutorialPhase6EnemyResolution(state, state, { attackEvent: firstAttack.attackEvents[0] });

  state = startPlayerTurn(state, guardId);
  state = advanceTutorialPhase6Brief(state);
  let previous = state;
  state = moveSelectedUnitByDirection(data.tutorialMap, state, "right");
  state = recordTutorialPhase6PlayerMovement(previous, state);
  previous = state;
  state = moveSelectedUnitByDirection(data.tutorialMap, state, "up");
  state = recordTutorialPhase6PlayerMovement(previous, state);
  assert.equal(state.tutorialState.taskId, "attack_spear_with_guard");

  const guardSpearTarget = getValidPlayerBasicAttackTargets(data.tutorialMap, state)
    .find((target) => target.targetType === "unit" && target.targetId === spearId);
  assert.ok(guardSpearTarget);
  let attack = resolveBasicAttack(state, "unit", spearId, guardSpearTarget.pathResult);
  assert.equal(attack.attackResult.targetHPAfter, 10);
  state = recordTutorialPhase6BasicAttack(state, attack.battleState, attack.attackResult);
  assert.equal(state.tutorialState.taskId, "end_turn_for_spear_retreat");

  state = recordTutorialPhase6EndTurn(state, resetEnemyForTurn(state, spearId));
  readable = refreshSpearTargetAndIntent(state, spearId);
  state = readable.state;
  const retreatMove = resolveEnemyMovementPhase(data.tutorialMap, state, [spearId]);
  state = retreatMove.battleState;
  assert.deepEqual(retreatMove.movementEvents[0].to, { x: 10, y: 11 });
  state = recordTutorialPhase6EnemyMovement(state, state, retreatMove.movementEvents[0]);
  assert.equal(state.tutorialState.taskId, "explain_spear_edge_atr");
  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.tutorialState.taskId, "resolve_covered_spear_attack");

  const coveredAttack = resolveEnemyAttackPhase(data.tutorialMap, state, [spearId]);
  state = coveredAttack.battleState;
  assert.equal(coveredAttack.attackEvents[0].pathOutcome, "partial_cover");
  assert.equal(coveredAttack.attackEvents[0].finalDamage, 3);
  state = recordTutorialPhase6EnemyResolution(state, state, { attackEvent: coveredAttack.attackEvents[0] });
  state = startPlayerTurn(state, guardId);
  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.tutorialState.taskId, "finish_spear");

  // Archer closes one tile, then uses two real Attacks to finish the 10 HP Spear.
  state = { ...state, selectedUnitId: archerId };
  previous = state;
  state = moveSelectedUnitByDirection(data.tutorialMap, state, "right");
  state = recordTutorialPhase6PlayerMovement(previous, state);
  for (let i = 0; i < 2; i += 1) {
    const target = getValidPlayerBasicAttackTargets(data.tutorialMap, state)
      .find((candidate) => candidate.targetType === "unit" && candidate.targetId === spearId);
    assert.ok(target);
    attack = resolveBasicAttack(state, "unit", spearId, target.pathResult);
    state = recordTutorialPhase6BasicAttack(state, attack.battleState, attack.attackResult);
  }
  assert.equal(state.enemyUnits.find((u) => u.battleUnitId === spearId).currentHP, 0);
  assert.equal(state.tutorialState.taskId, "end_turn_after_spear_defeated");

  const emptyEnemyTurn = { ...state, phase: "enemy_phase", teamApCurrent: 0 };
  state = recordTutorialPhase6EndTurn(state, emptyEnemyTurn);
  const refreshedPlayer = startPlayerTurn(state, guardId);
  state = recordTutorialPhase6PlayerTurnStart(state, refreshedPlayer);
  assert.equal(state.tutorialState.taskId, "structure_intro");
  assert.equal(state.teamApCurrent, 4);
  assert.equal(state.objectiveState.label, "—");

  state = advanceTutorialPhase6Brief(state);
  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.objectiveState.label, "Destroy the Hut");
  assert.equal(state.tutorialState.taskId, "switch_to_archer_for_hut");

  state = { ...state, selectedUnitId: archerId };
  state = recordTutorialPhase6UnitSelection(state);
  for (const direction of ["right", "up"]) {
    previous = state;
    state = moveSelectedUnitByDirection(data.tutorialMap, state, direction);
    state = recordTutorialPhase6PlayerMovement(previous, state);
  }
  assert.equal(state.tutorialState.taskId, "first_hut_attack");

  for (let i = 0; i < 4; i += 1) {
    const hutTarget = getValidPlayerBasicAttackTargets(data.tutorialMap, state)
      .find((candidate) => candidate.targetType === "structure" && candidate.targetId === hutId);
    assert.ok(hutTarget);
    attack = resolveBasicAttack(state, "structure", hutId, hutTarget.pathResult);
    state = recordTutorialPhase6BasicAttack(state, attack.battleState, attack.attackResult);
  }

  assert.equal(state.structures.find((s) => s.battleStructureId === hutId).currentHP, 0);
  assert.equal(state.tutorialState.taskId, "proceed_to_region_c");
  assert.equal(state.tutorialState.activeRegionIds.includes("C"), true);
  assert.equal(state.objectiveState.label, "—");
  assert.equal(state.resultState, "ongoing");
});
