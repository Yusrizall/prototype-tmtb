import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getTutorialPhaseJumpOptions,
  validateTutorialPhaseJumpInput,
  createFreshTutorialBattleState,
  createTutorialPhaseJumpState
} from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";

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

function byDef(state, side, unitDefId) {
  const collection = side === "player" ? state.playerUnits : state.enemyUnits;
  return collection.find((unit) => unit.unitDefId === unitDefId);
}

function compactUnit(unit) {
  return {
    hp: unit.currentHP,
    x: unit.tileX,
    y: unit.tileY,
    startGrid: unit.startGrid ?? null,
    movementApCommitted: unit.movementApCommitted ?? null,
    movementLocked: unit.movementLocked ?? null
  };
}

test("Phase Jump v1 exposes only implemented Tutorial phases 1-6", () => {
  const options = getTutorialPhaseJumpOptions();
  assert.deepEqual(options.map((option) => option.phaseNumber), [1, 2, 3, 4, 5, 6]);
  assert.equal(options[0].label, "Control / Party");
  assert.equal(options[5].label, "Spear / Defensive Cover / Objective");
});

test("Phase Jump input accepts only integer phases 1-6", () => {
  assert.deepEqual(validateTutorialPhaseJumpInput("6"), {
    valid: true,
    phaseNumber: 6,
    errorMessage: null
  });
  assert.equal(validateTutorialPhaseJumpInput("0").valid, false);
  assert.equal(validateTutorialPhaseJumpInput("7").valid, false);
  assert.equal(validateTutorialPhaseJumpInput("").valid, false);
  assert.equal(validateTutorialPhaseJumpInput("abc").valid, false);
  assert.equal(validateTutorialPhaseJumpInput("2.5").valid, false);
  assert.equal(
    validateTutorialPhaseJumpInput("7").errorMessage,
    "Available tutorial phases: 1–6."
  );
});

test("fresh Tutorial factory reproduces Phase 1 start", () => {
  const state = createFreshTutorialBattleState(data);
  const guard = byDef(state, "player", "guard");
  const archer = byDef(state, "player", "archer");
  const sword = byDef(state, "enemy", "sword_enemy");

  assert.equal(state.flowContext, "tutorial");
  assert.equal(state.stageId, "tutorial_stage");
  assert.equal(state.phase, "player_phase");
  assert.equal(state.turnCount, 1);
  assert.equal(state.teamApCurrent, 4);
  assert.equal(state.selectedUnitId, guard.battleUnitId);
  assert.deepEqual(compactUnit(guard), {
    hp: 25, x: 2, y: 10, startGrid: { x: 2, y: 10 }, movementApCommitted: false, movementLocked: false
  });
  assert.deepEqual(compactUnit(archer), {
    hp: 18, x: 2, y: 12, startGrid: { x: 2, y: 12 }, movementApCommitted: false, movementLocked: false
  });
  assert.deepEqual({ hp: sword.currentHP, x: sword.tileX, y: sword.tileY }, { hp: 43, x: 8, y: 11 });
  assert.equal(state.tutorialState.phaseId, "phase_1_control_orientation");
  assert.equal(state.tutorialState.taskId, "look_around");
  assert.equal(state.tutorialState.prompt, "Move the mouse to look around.");
  assert.deepEqual(state.tutorialState.activeRegionIds, ["A"]);
});

test("Jump 2 contract starts Shared AP lesson from clean starting grids", () => {
  const state = createTutorialPhaseJumpState(data, 2);
  const guard = byDef(state, "player", "guard");
  const archer = byDef(state, "player", "archer");
  const sword = byDef(state, "enemy", "sword_enemy");
  assert.equal(state.tutorialState.phaseId, "phase_2_shared_ap_movement");
  assert.equal(state.tutorialState.taskId, "move_guard_to_target_a");
  assert.equal(state.tutorialState.prompt, "Use WASD to move to the highlighted position.");
  assert.deepEqual(state.tutorialState.targetTile, { x: 3, y: 10 });
  assert.equal(state.teamApCurrent, 4);
  assert.equal(state.turnCount, 1);
  assert.deepEqual(compactUnit(guard), {
    hp: 25, x: 2, y: 10, startGrid: { x: 2, y: 10 }, movementApCommitted: false, movementLocked: false
  });
  assert.deepEqual(compactUnit(archer), {
    hp: 18, x: 2, y: 12, startGrid: { x: 2, y: 12 }, movementApCommitted: false, movementLocked: false
  });
  assert.equal(sword.currentHP, 43);
});

test("Jump 3 contract is Phase 2 completion before the first Enemy Turn", () => {
  const state = createTutorialPhaseJumpState(data, 3);
  const guard = byDef(state, "player", "guard");
  const archer = byDef(state, "player", "archer");
  const sword = byDef(state, "enemy", "sword_enemy");
  assert.equal(state.tutorialState.phaseId, "phase_3_turn_intent_combat");
  assert.equal(state.tutorialState.taskId, "end_player_turn");
  assert.equal(state.tutorialState.prompt, "When you're done, end your turn.");
  assert.equal(state.teamApCurrent, 2);
  assert.equal(state.turnCount, 1);
  assert.deepEqual(compactUnit(guard), {
    hp: 25, x: 3, y: 9, startGrid: { x: 2, y: 10 }, movementApCommitted: true, movementLocked: false
  });
  assert.deepEqual(compactUnit(archer), {
    hp: 18, x: 2, y: 14, startGrid: { x: 2, y: 12 }, movementApCommitted: true, movementLocked: false
  });
  assert.deepEqual({ hp: sword.currentHP, x: sword.tileX, y: sword.tileY }, { hp: 43, x: 8, y: 11 });
});

test("Jump 4 contract preserves real Phase 3 Guard attack consequences", () => {
  const state = createTutorialPhaseJumpState(data, 4);
  const guard = byDef(state, "player", "guard");
  const archer = byDef(state, "player", "archer");
  const sword = byDef(state, "enemy", "sword_enemy");
  assert.equal(state.tutorialState.phaseId, "phase_4_tactical_space");
  assert.equal(state.tutorialState.taskId, "switch_to_archer_for_tactical_space");
  assert.equal(state.tutorialState.prompt, "Press Q to switch to Archer.");
  assert.equal(state.teamApCurrent, 2);
  assert.equal(state.turnCount, 2);
  assert.equal(state.selectedUnitId, guard.battleUnitId);
  assert.deepEqual(compactUnit(guard), {
    hp: 25, x: 5, y: 10, startGrid: { x: 3, y: 9 }, movementApCommitted: true, movementLocked: true
  });
  assert.deepEqual(compactUnit(archer), {
    hp: 18, x: 2, y: 14, startGrid: { x: 2, y: 14 }, movementApCommitted: false, movementLocked: false
  });
  assert.deepEqual({ hp: sword.currentHP, x: sword.tileX, y: sword.tileY }, { hp: 38, x: 5, y: 11 });
});

test("Jump 5 contract preserves Phase 4 completion before Phase 5-forming Enemy Turn", () => {
  const state = createTutorialPhaseJumpState(data, 5);
  const guard = byDef(state, "player", "guard");
  const archer = byDef(state, "player", "archer");
  const sword = byDef(state, "enemy", "sword_enemy");
  assert.equal(state.tutorialState.phaseId, "phase_4_tactical_space");
  assert.equal(state.tutorialState.taskId, "end_turn_for_phase5");
  assert.equal(state.tutorialState.prompt, "End your turn.");
  assert.equal(state.teamApCurrent, 0);
  assert.equal(state.turnCount, 2);
  assert.equal(state.selectedUnitId, archer.battleUnitId);
  assert.deepEqual(compactUnit(guard), {
    hp: 25, x: 5, y: 10, startGrid: { x: 3, y: 9 }, movementApCommitted: true, movementLocked: true
  });
  assert.deepEqual(compactUnit(archer), {
    hp: 18, x: 5, y: 13, startGrid: { x: 2, y: 14 }, movementApCommitted: true, movementLocked: true
  });
  assert.deepEqual({ hp: sword.currentHP, x: sword.tileX, y: sword.tileY }, { hp: 31, x: 5, y: 11 });
});

test("Jump 6 contract reuses normal Phase 6 initialization", () => {
  const state = createTutorialPhaseJumpState(data, 6);
  const guard = byDef(state, "player", "guard");
  const archer = byDef(state, "player", "archer");
  const sword = byDef(state, "enemy", "sword_enemy");
  const spear = byDef(state, "enemy", "spear_enemy");
  const hut = state.structures.find((structure) => structure.battleStructureId === "tutorial_hut_1");

  assert.equal(state.tutorialState.phaseId, "phase_6_spear_defensive_cover_objective");
  assert.equal(state.tutorialState.taskId, "phase_6_entry");
  assert.equal(state.tutorialState.prompt, null);
  assert.deepEqual(state.tutorialState.activeRegionIds, ["A", "B"]);
  assert.equal(state.teamApCurrent, 0);
  assert.equal(state.turnCount, 4);
  assert.equal(state.selectedUnitId, archer.battleUnitId);
  assert.deepEqual(compactUnit(guard), {
    hp: 18, x: 6, y: 12, startGrid: { x: 6, y: 9 }, movementApCommitted: true, movementLocked: true
  });
  assert.deepEqual(compactUnit(archer), {
    hp: 11, x: 7, y: 13, startGrid: { x: 5, y: 13 }, movementApCommitted: true, movementLocked: true
  });
  assert.deepEqual({ hp: sword.currentHP, x: sword.tileX, y: sword.tileY }, { hp: 0, x: 5, y: 12 });
  assert.deepEqual({ hp: spear.currentHP, x: spear.tileX, y: spear.tileY }, { hp: 15, x: 10, y: 8 });
  assert.equal(hut.currentHP, 28);
  assert.equal(hut.footprint.length, 9);
  assert.equal(state.objectiveState.status, "dormant");
  assert.equal(state.objectiveState.label, "—");
});
