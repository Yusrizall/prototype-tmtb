import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderMapGrid } from "../../src/ui/mapRenderer.js";
import { renderBattleHud } from "../../src/ui/battle/battleHud.js";
import { createBattleStructure } from "../../src/logic/battle/structureLogic.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const readJson = (relativePath) => JSON.parse(
  fs.readFileSync(path.join(root, relativePath), "utf8")
);
const map = readJson("public/data/maps/tutorial_offset_courtyard.json");
const structureDefinitions = readJson("public/data/structures/structure_definitions.json");

function createState() {
  const archer = {
    battleUnitId: "player_archer_1",
    unitDefId: "archer",
    name: "Archer",
    side: "player",
    tileX: 9,
    tileY: 12,
    currentHP: 11,
    maxHP: 18,
    startGrid: { x: 7, y: 13 },
    movementApCommitted: true,
    movementLocked: false,
    derivedStats: { atk: 7, def: 1, move: 4, atr: 3 },
    turnState: "positioned"
  };
  const spear = {
    battleUnitId: "enemy_spear_enemy_2",
    unitDefId: "spear_enemy",
    name: "Spear Enemy",
    side: "enemy",
    tileX: 10,
    tileY: 11,
    currentHP: 15,
    maxHP: 15,
    spawnOrder: 2,
    currentTargetId: archer.battleUnitId,
    currentIntent: { intentType: "basic_attack" },
    derivedStats: { atk: 6, def: 2, move: 4, atr: 3 },
    turnState: "ready"
  };
  const hut = createBattleStructure(structureDefinitions, {
    battleStructureId: "tutorial_hut_1",
    structureDefId: "tutorial_hut",
    topLeft: { x: 11, y: 9 },
    width: 3,
    height: 3
  });

  return {
    stageId: "tutorial_stage",
    flowContext: "tutorial",
    phase: "player_phase",
    turnCount: 7,
    teamApCurrent: 2,
    teamApCapacity: 4,
    selectedUnitId: archer.battleUnitId,
    battleControlState: "attack_targeting",
    actionMenuIndex: 0,
    selectedAction: "attack",
    targetIndex: 1,
    targetType: "structure",
    targetId: hut.battleStructureId,
    resultState: "ongoing",
    encounterName: "Tutorial Stage",
    objectiveType: "eliminate_all",
    objectiveState: {
      status: "active",
      objectiveType: "destroy_structure",
      targetType: "structure",
      targetId: hut.battleStructureId,
      label: "Destroy the Hut"
    },
    playerUnits: [archer],
    enemyUnits: [spear],
    structures: [hut],
    tutorialState: {
      status: "active",
      phaseId: "phase_6_spear_defensive_cover_objective",
      taskId: "first_hut_attack",
      activeRegionIds: ["A", "B"],
      prompt: "Attack the highlighted structure.",
      targetTile: null,
      phase6Entities: {
        spearEnemyId: spear.battleUnitId,
        hutStructureId: hut.battleStructureId
      }
    }
  };
}

function hutTarget(state) {
  return {
    targetType: "structure",
    targetId: "tutorial_hut_1",
    entity: state.structures[0],
    interactionTile: { x: 11, y: 11 },
    targetValid: true,
    distance: Math.sqrt(5),
    rangeValid: true,
    actionPathValid: true,
    losValid: true,
    actionValid: true,
    invalidReason: null,
    pathResult: {
      outcome: "clear",
      coverPercentage: 0,
      crossedObstacles: [],
      actionPathValid: true,
      losValid: true,
      damageBlocked: false
    }
  };
}

test("map renders a 3x3 Hut as one selected Structure target", () => {
  const state = createState();
  const target = hutTarget(state);
  const html = renderMapGrid(map, state, [], [target], [target]);

  assert.equal((html.match(/structure-footprint/g) ?? []).length, 9);
  assert.equal((html.match(/<strong>Hut<\/strong>/g) ?? []).length, 1);
  assert.match(html, /structure-selected/);
  assert.match(html, /structure-objective/);
});

test("HUD presents Phase 6 Objective and generic Structure target interaction tile", () => {
  const state = createState();
  const target = hutTarget(state);
  const html = renderBattleHud(
    { stage1Map: map },
    state,
    [],
    [target],
    [target]
  );

  assert.match(html, /Destroy the Hut/);
  assert.match(html, /<strong>Hut<\/strong>/);
  assert.match(html, /Interaction Tile:\s*11,11/);
  assert.match(html, /Enemy Intent/);
});

test("Training Failed renders explicit retry presentation", () => {
  const state = {
    ...createState(),
    phase: "battle_end",
    battleControlState: "battle_result",
    resultState: "training_failed",
    feedbackMessage: "A required party member was defeated."
  };
  const html = renderBattleHud(
    { stage1Map: map },
    state
  );

  assert.match(html, /TRAINING FAILED/);
  assert.match(html, /Retry/);
});

test("HUD unlocks End Turn for revised Phase 6 retreat, finish, and post-Spear boundaries", () => {
  for (const taskId of [
    "end_turn_for_spear_retreat",
    "finish_spear",
    "end_turn_after_spear_defeated",
    "destroy_hut"
  ]) {
    const state = {
      ...createState(),
      battleControlState: "unit_selected_movement",
      tutorialState: {
        ...createState().tutorialState,
        taskId
      }
    };
    const html = renderBattleHud({ stage1Map: map }, state, [], [], []);
    assert.match(
      html,
      /data-action="end-player-turn"[\s\S]*?>\s*End Turn/s,
      `End Turn button should render for ${taskId}`
    );
    const button = html.match(/<button[^>]*data-action="end-player-turn"[^>]*>[\s\S]*?<\/button>/)?.[0] ?? "";
    assert.doesNotMatch(button, /disabled/, `End Turn should be enabled for ${taskId}`);
  }
});
