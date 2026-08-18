import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  initializeTutorialPhase6Content,
  advanceTutorialPhase6Brief,
  recordTutorialPhase6EndTurn,
  recordTutorialPhase6EnemyResolution,
  recordTutorialPhase6EnemyMovement,
  recordTutorialPhase6PlayerTurnStart,
  recordTutorialPhase6UnitSelection,
  recordTutorialPhase6PlayerMovement,
  recordTutorialPhase6BasicAttack,
  isTutorialPhase6InputAllowed,
  isTutorialPhase6BasicAttackTargetAllowed,
  getTutorialPhase6RequiredActorFailure,
  getTutorialPhase6EnemyActivationMode,
  shouldPauseTutorialPhase6EnemyResolution
} from "../../src/logic/tutorial/tutorialPhase6Logic.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const data = {
  enemyUnits: readJson("public/data/units/enemy_units.json"),
  structureDefinitions: readJson("public/data/structures/structure_definitions.json"),
  tutorialMap: readJson("public/data/maps/tutorial_offset_courtyard.json"),
  tutorialEncounter: readJson("public/data/encounters/tutorial_phase_1_5.json")
};

function player(unitDefId, x, y, hp) {
  return {
    battleUnitId: `player_${unitDefId}_1`,
    unitDefId,
    name: unitDefId === "guard" ? "Guard" : "Archer",
    side: "player",
    tileX: x,
    tileY: y,
    currentHP: hp,
    maxHP: unitDefId === "guard" ? 25 : 18,
    startGrid: { x, y },
    originTile: { x, y },
    movementApCommitted: false,
    movementLocked: false,
    derivedStats: { atk: unitDefId === "guard" ? 5 : 7, def: unitDefId === "guard" ? 4 : 1, move: unitDefId === "guard" ? 3 : 4, atr: unitDefId === "guard" ? 1.5 : 3 },
    attackType: unitDefId === "guard" ? "melee" : "ranged",
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
    maxHP: 31,
    derivedStats: { atk: 8, def: 2, move: 3, atr: 1.5 },
    attackType: "melee",
    movementRule: "seek_melee_engagement",
    actionRule: "basic_attack",
    spawnOrder: 1,
    currentTargetId: null,
    currentIntent: null
  };
}

function phase6EntryState() {
  const guard = player("guard", 6, 12, 21);
  const archer = player("archer", 7, 13, 11);
  return {
    flowContext: "tutorial",
    phase: "player_phase",
    turnCount: 5,
    teamApCurrent: 0,
    teamApCapacity: 4,
    selectedUnitId: archer.battleUnitId,
    battleControlState: "unit_selected_movement",
    playerUnits: [guard, archer],
    enemyUnits: [deadSword()],
    structures: [],
    resultState: "ongoing",
    tutorialState: {
      status: "active",
      phaseId: "phase_6_spear_defensive_cover_objective",
      taskId: "phase_6_entry",
      prompt: null,
      targetTile: null,
      activeRegionIds: ["A", "B"],
      evidence: { phase5Complete: true }
    }
  };
}

test("Phase 6 initialization is idempotent and preserves carried tactical state", () => {
  const before = phase6EntryState();
  const once = initializeTutorialPhase6Content(data, before);
  const twice = initializeTutorialPhase6Content(data, once);

  const spears = twice.enemyUnits.filter((unit) => unit.unitDefId === "spear_enemy");
  assert.equal(spears.length, 1);
  assert.deepEqual({ x: spears[0].tileX, y: spears[0].tileY }, { x: 10, y: 8 });
  assert.equal(twice.structures.length, 1);
  assert.equal(twice.structures[0].battleStructureId, "tutorial_hut_1");
  assert.equal(twice.structures[0].footprint.length, 9);
  assert.equal(twice.teamApCurrent, 0);
  assert.deepEqual(twice.playerUnits.map((unit) => unit.currentHP), [21, 11]);
  assert.deepEqual(twice.tutorialState.activeRegionIds, ["A", "B"]);
  assert.equal(twice.objectiveState.status, "dormant");
  assert.equal(twice.tutorialState.phase6Entities.spearEnemyId, spears[0].battleUnitId);
  assert.equal(twice.tutorialState.phase6Entities.hutStructureId, "tutorial_hut_1");
});

test("revised Phase 6 teaches close pressure, Spear retreat, Cover, then Structure in sequence", () => {
  let state = initializeTutorialPhase6Content(data, phase6EntryState());
  const spearId = state.tutorialState.phase6Entities.spearEnemyId;
  const guardId = state.playerUnits.find((unit) => unit.unitDefId === "guard").battleUnitId;

  state = advanceTutorialPhase6Brief(state);
  state = advanceTutorialPhase6Brief(state);
  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.tutorialState.taskId, "end_turn_for_clear_attack");

  state = recordTutorialPhase6EndTurn(state, { ...state, phase: "enemy_phase" });
  assert.equal(state.tutorialState.taskId, "observe_clear_spear_attack");

  state = recordTutorialPhase6EnemyResolution(state, state, {
    attackEvent: {
      attackerId: spearId,
      targetId: guardId,
      attacked: true,
      pathOutcome: "clear",
      finalDamage: 2
    }
  });
  assert.equal(state.tutorialState.taskId, "explain_defensive_cover");
  assert.equal(state.tutorialState.prompt, "Ranged attacks can be reduced by Cover.");

  state = { ...state, phase: "player_phase", teamApCurrent: 4, selectedUnitId: guardId };
  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.tutorialState.taskId, "move_guard_closer_to_spear");
  assert.equal(state.tutorialState.prompt, "Move Guard closer to the Spear.");

  const movedGuard = {
    ...state,
    playerUnits: state.playerUnits.map((unit) =>
      unit.battleUnitId === guardId ? { ...unit, tileX: 7, tileY: 11 } : unit
    )
  };
  state = recordTutorialPhase6PlayerMovement(state, movedGuard);
  assert.equal(state.tutorialState.taskId, "attack_spear_with_guard");
  assert.equal(state.tutorialState.prompt, "Attack the Spear with Guard.");

  const spearBefore = state.enemyUnits.find((unit) => unit.battleUnitId === spearId).currentHP;
  const afterGuardHit = {
    ...state,
    enemyUnits: state.enemyUnits.map((unit) =>
      unit.battleUnitId === spearId ? { ...unit, currentHP: spearBefore - 3 } : unit
    )
  };
  state = recordTutorialPhase6BasicAttack(state, afterGuardHit, {
    attackerId: guardId,
    targetType: "unit",
    targetId: spearId,
    targetHPBefore: spearBefore,
    targetHPAfter: spearBefore - 3,
    finalDamage: 3,
    targetDefeated: false
  });
  assert.equal(state.tutorialState.taskId, "end_turn_for_spear_retreat");
  assert.equal(state.tutorialState.prompt, "End your turn.");

  state = recordTutorialPhase6EndTurn(state, { ...state, phase: "enemy_phase" });
  assert.equal(state.tutorialState.taskId, "observe_spear_retreat");

  state = recordTutorialPhase6EnemyMovement(state, state, {
    enemyId: spearId,
    from: { x: 8, y: 10 },
    to: { x: 10, y: 11 },
    moved: true,
    movementMode: "max_effective_atr_engagement"
  });
  assert.equal(state.tutorialState.taskId, "explain_spear_edge_atr");
  assert.equal(
    state.tutorialState.prompt,
    "Spear enemies prefer to attack from the edge of their Attack Range."
  );

  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.tutorialState.taskId, "resolve_covered_spear_attack");

  state = recordTutorialPhase6EnemyResolution(state, state, {
    attackEvent: {
      attackerId: spearId,
      targetId: guardId,
      attacked: true,
      pathOutcome: "partial_cover",
      finalDamage: 0
    }
  });
  assert.equal(state.tutorialState.taskId, "explain_cover_reduction");
  assert.equal(state.tutorialState.prompt, "Cover reduced the damage from that attack.");

  state = { ...state, phase: "player_phase", teamApCurrent: 4, selectedUnitId: guardId };
  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.tutorialState.taskId, "finish_spear");
  assert.equal(state.tutorialState.prompt, "Finish the Spear.");

  const defeatedSpearState = {
    ...state,
    enemyUnits: state.enemyUnits.map((unit) =>
      unit.battleUnitId === spearId ? { ...unit, currentHP: 0 } : unit
    )
  };
  state = recordTutorialPhase6BasicAttack(state, defeatedSpearState, {
    attackerId: guardId,
    targetType: "unit",
    targetId: spearId,
    targetHPBefore: 2,
    targetHPAfter: 0,
    finalDamage: 2,
    targetDefeated: true
  });
  assert.equal(state.tutorialState.taskId, "end_turn_after_spear_defeated");
  assert.equal(state.tutorialState.prompt, "End your turn.");
  assert.equal(state.objectiveState.status, "dormant");

  state = recordTutorialPhase6EndTurn(state, { ...state, phase: "enemy_phase" });
  assert.equal(state.tutorialState.taskId, "refresh_before_structure_lesson");

  state = recordTutorialPhase6PlayerTurnStart(state, {
    ...state,
    phase: "player_phase",
    teamApCurrent: 4,
    selectedUnitId: guardId
  });
  assert.equal(state.tutorialState.taskId, "structure_intro");
  assert.equal(state.tutorialState.prompt, "Some structures can become combat objectives.");

  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.tutorialState.taskId, "structure_targeting_intro");
  assert.equal(
    state.tutorialState.prompt,
    "Some buildings and objects can be targeted with normal attacks."
  );

  state = advanceTutorialPhase6Brief(state);
  assert.equal(state.tutorialState.taskId, "switch_to_archer_for_hut");
  assert.equal(state.tutorialState.prompt, "Press Q to switch to Archer.");
  assert.equal(state.objectiveState.label, "Destroy the Hut");
});

test("Structure lesson begins only after Spear defeat and Hut destruction completes Phase 6", () => {
  let state = initializeTutorialPhase6Content(data, phase6EntryState());
  const spearId = state.tutorialState.phase6Entities.spearEnemyId;
  const hutId = state.tutorialState.phase6Entities.hutStructureId;
  const archerId = state.playerUnits.find((unit) => unit.unitDefId === "archer").battleUnitId;

  state = {
    ...state,
    enemyUnits: state.enemyUnits.map((enemy) =>
      enemy.battleUnitId === spearId ? { ...enemy, currentHP: 0 } : enemy
    ),
    objectiveState: { status: "active", objectiveType: "destroy_structure", targetType: "structure", targetId: hutId, label: "Destroy the Hut" },
    selectedUnitId: archerId,
    tutorialState: { ...state.tutorialState, taskId: "switch_to_archer_for_hut" }
  };

  state = recordTutorialPhase6UnitSelection(state);
  assert.equal(state.tutorialState.taskId, "move_archer_for_hut_attack");

  const movedArcher = {
    ...state,
    playerUnits: state.playerUnits.map((unit) =>
      unit.battleUnitId === archerId ? { ...unit, tileX: 9, tileY: 12 } : unit
    )
  };
  state = recordTutorialPhase6PlayerMovement(state, movedArcher);
  assert.equal(state.tutorialState.taskId, "first_hut_attack");

  const hutBefore = state.structures[0].currentHP;
  state = recordTutorialPhase6BasicAttack(state, {
    ...state,
    structures: state.structures.map((structure) => ({ ...structure, currentHP: hutBefore - 7 }))
  }, {
    targetType: "structure",
    targetId: hutId,
    targetHPBefore: hutBefore,
    targetHPAfter: hutBefore - 7,
    finalDamage: 7,
    targetDestroyed: false
  });
  assert.equal(state.tutorialState.taskId, "destroy_hut");
  assert.equal(state.objectiveState.label, "Destroy the Hut");

  state = recordTutorialPhase6BasicAttack(state, {
    ...state,
    structures: state.structures.map((structure) => ({ ...structure, currentHP: 0 }))
  }, {
    targetType: "structure",
    targetId: hutId,
    targetHPBefore: 7,
    targetHPAfter: 0,
    finalDamage: 7,
    targetDestroyed: true
  });
  assert.equal(state.tutorialState.taskId, "proceed_to_region_c");
  assert.equal(state.tutorialState.activeRegionIds.includes("C"), true);
  assert.equal(state.objectiveState.label, "—");
  assert.equal(state.resultState, "ongoing");
});

test("first Hut Attack allows A/D target cycling while attack targeting is active", () => {
  const state = {
    ...phase6EntryState(),
    battleControlState: "attack_targeting",
    tutorialState: {
      ...phase6EntryState().tutorialState,
      taskId: "first_hut_attack"
    }
  };
  assert.equal(isTutorialPhase6InputAllowed(state, "movement_keyboard"), true);
  assert.equal(isTutorialPhase6InputAllowed(state, "confirm_action"), true);
});

test("guided Guard attack only permits Spear and Structure teaching only permits Hut", () => {
  const initialized = initializeTutorialPhase6Content(data, phase6EntryState());
  const hutId = initialized.tutorialState.phase6Entities.hutStructureId;
  const spearId = initialized.tutorialState.phase6Entities.spearEnemyId;
  const guardId = initialized.playerUnits.find((unit) => unit.unitDefId === "guard").battleUnitId;

  const guardAttackState = {
    ...initialized,
    selectedUnitId: guardId,
    tutorialState: { ...initialized.tutorialState, taskId: "attack_spear_with_guard" }
  };
  assert.equal(isTutorialPhase6BasicAttackTargetAllowed(guardAttackState, { targetType: "unit", targetId: spearId }), true);
  assert.equal(isTutorialPhase6BasicAttackTargetAllowed(guardAttackState, { targetType: "structure", targetId: hutId }), false);

  const finishSpearState = {
    ...initialized,
    tutorialState: { ...initialized.tutorialState, taskId: "finish_spear" }
  };
  assert.equal(isTutorialPhase6BasicAttackTargetAllowed(finishSpearState, { targetType: "unit", targetId: spearId }), true);
  assert.equal(isTutorialPhase6BasicAttackTargetAllowed(finishSpearState, { targetType: "structure", targetId: hutId }), false);

  const hutState = {
    ...initialized,
    tutorialState: { ...initialized.tutorialState, taskId: "destroy_hut" }
  };
  assert.equal(isTutorialPhase6BasicAttackTargetAllowed(hutState, { targetType: "structure", targetId: hutId }), true);
});


test("destroy_hut End Turn does not pause an empty Enemy Phase", () => {
  const base = initializeTutorialPhase6Content(data, phase6EntryState());
  const state = {
    ...base,
    phase: "enemy_phase",
    teamApCurrent: 0,
    enemyUnits: base.enemyUnits.map((unit) => ({ ...unit, currentHP: 0 })),
    structures: base.structures.map((structure) => ({
      ...structure,
      currentHP: 7
    })),
    tutorialState: {
      ...base.tutorialState,
      taskId: "destroy_hut"
    }
  };

  assert.equal(shouldPauseTutorialPhase6EnemyResolution(state), false);
});


test("Phase 6 enemy activation mode splits Spear retreat movement from covered Attack", () => {
  const base = initializeTutorialPhase6Content(data, phase6EntryState());
  const movementState = {
    ...base,
    phase: "enemy_phase",
    tutorialState: { ...base.tutorialState, taskId: "observe_spear_retreat" }
  };
  assert.equal(getTutorialPhase6EnemyActivationMode(movementState), "movement_only_pause");

  const attackState = {
    ...movementState,
    tutorialState: { ...movementState.tutorialState, taskId: "resolve_covered_spear_attack" }
  };
  assert.equal(getTutorialPhase6EnemyActivationMode(attackState), "attack_only_continue");

  const normalState = {
    ...movementState,
    tutorialState: { ...movementState.tutorialState, taskId: "observe_clear_spear_attack" }
  };
  assert.equal(getTutorialPhase6EnemyActivationMode(normalState), "full_activation");
});

test("required Guard or Archer defeat produces Phase 6 failure predicate", () => {
  const state = initializeTutorialPhase6Content(data, phase6EntryState());
  const failedState = {
    ...state,
    playerUnits: state.playerUnits.map((unit) => unit.unitDefId === "archer" ? { ...unit, currentHP: 0 } : unit)
  };
  const failure = getTutorialPhase6RequiredActorFailure(failedState);
  assert.equal(failure.failed, true);
  assert.equal(failure.defeatedUnitName, "Archer");
});

test("Training Failed result input can reach the Retry handler", () => {
  const state = {
    ...phase6EntryState(),
    phase: "battle_end",
    battleControlState: "battle_result",
    resultState: "training_failed",
    tutorialState: {
      ...phase6EntryState().tutorialState,
      taskId: "observe_clear_spear_attack"
    }
  };

  assert.equal(
    isTutorialPhase6InputAllowed(state, "confirm_action"),
    true
  );
  assert.equal(
    isTutorialPhase6InputAllowed(state, "open_action_menu"),
    true
  );
});
