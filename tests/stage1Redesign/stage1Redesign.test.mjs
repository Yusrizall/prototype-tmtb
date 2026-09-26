import test from "node:test";
import assert from "node:assert/strict";

import {
  createStage1RedesignBattleState,
  beginStage1PreparationTurn,
  canEndStage1Turn,
  createStage1RetryState,
  isStage1Fortified,
  resolveStage1Knockback,
  resolveStage1RecoveryActivation,
  settleStage1Reward,
  spawnStage1Reinforcement,
  updateStage1AfterSwordDefeat
} from "../../src/logic/battle/stage1RedesignLogic.js";
import {
  resolveEnemyAttackPhase
} from "../../src/logic/battle/enemyAttackLogic.js";
import {
  resolveEnemyMovementPhase
} from "../../src/logic/battle/enemyMovementLogic.js";
import {
  resolveEnemyCurrentIntent
} from "../../src/logic/battle/enemyIntentLogic.js";
import {
  getValidPlayerBasicAttackTargets
} from "../../src/logic/battle/playerAttackTargetLogic.js";
import {
  createBattleResultSnapshot
} from "../../src/logic/battle/battleResultState.js";
import {
  finishSkillEnemyTurn,
  resolveSkill,
  skillBlockReason,
  skillTargets
} from "../../src/logic/battle/skillLogic.js";
import {
  appendStage1TelemetryEvent,
  serializeStage1Telemetry
} from "../../src/logic/telemetry/stage1Telemetry.js";
import {
  renderMainMenuScreen,
  renderStage1RedesignEntryScreen
} from "../../src/ui/flow/basicFlowScreens.js";
import {
  renderBattleHud,
  renderBattleResultOverlay
} from "../../src/ui/battle/battleHud.js";
import {
  renderSkillPanel
} from "../../src/ui/battle/skillPanel.js";

const map = {
  mapId: "r1_stage1_redesign_v0_2",
  name: "Stage 1 Redesign",
  width: 12,
  height: 13,
  tiles: Array.from({ length: 13 }, () => Array(12).fill("."))
};
map.tiles[10][2] = "P1";
map.tiles[11][8] = "E1";
map.tiles[8][10] = "E2";
map.tiles[11][4] = "O30";

const playerUnits = {
  units: [{
    unitId: "guard", name: "Guard", side: "player", role: "frontline",
    maxHP: 25, baseATK: 5, move: 3, atr: 1.5, attackType: "melee",
    targetPattern: "single", targetCategory: "enemy", usesProjectile: false,
    requiresPathCheck: true
  }]
};

const enemyUnits = {
  units: [{
    unitId: "sword_enemy", name: "Sword Enemy", side: "enemy", role: "basic_melee_pressure",
    maxHP: 16, baseATK: 6, move: 3, atr: 1.5, attackType: "melee",
    targetPattern: "single", targetCategory: "player", usesProjectile: false,
    requiresPathCheck: true, movementRule: "seek_melee_engagement", actionRule: "basic_attack"
  }]
};

const encounter = {
  encounterId: "r1_stage1_redesign_v0_2",
  name: "Stage 1 Redesign Playtest",
  mapId: map.mapId,
  objectiveType: "eliminate_all",
  playerSpawns: [{ unitId: "guard", spawnLabel: "P1" }],
  enemySpawns: [{ unitId: "sword_enemy", spawnLabel: "E1" }],
  waves: [{
    waveId: "stage1_sword_2", required: true, unitId: "sword_enemy",
    battleUnitId: "enemy_sword_2", spawnLabel: "E2", telegraphLabel: "SWORD 2"
  }],
  crystalReward: 20
};

const data = {
  playerUnits,
  enemyUnits,
  stage1RedesignMap: map,
  stage1RedesignEncounter: encounter
};

function initial() {
  return createStage1RedesignBattleState(data, {
    participantCode: "P-001",
    sessionId: "session-1"
  });
}

function placeContact(state, swordX, swordY, guardX = 5, guardY = 5) {
  return {
    ...state,
    playerUnits: state.playerUnits.map((unit) => ({
      ...unit, tileX: guardX, tileY: guardY, startGrid: { x: guardX, y: guardY }
    })),
    enemyUnits: state.enemyUnits.map((unit) => ({
      ...unit, tileX: swordX, tileY: swordY,
      currentTargetId: state.playerUnits[0].battleUnitId,
      currentIntent: { intentType: "basic_attack", targetId: state.playerUnits[0].battleUnitId }
    }))
  };
}

test("Stage 1 starts with one Guard, Sword 1, AP 2, and scheduled Sword 2", () => {
  const state = initial();
  assert.equal(state.flowContext, "stage1_redesign");
  assert.equal(state.playerUnits.length, 1);
  assert.deepEqual([state.playerUnits[0].tileX, state.playerUnits[0].tileY], [2, 10]);
  assert.deepEqual([state.enemyUnits[0].tileX, state.enemyUnits[0].tileY], [8, 11]);
  assert.equal(state.teamApCapacity, 2);
  assert.equal(state.waveState.waves[0].status, "scheduled");
});

test("temporary entry and contextual UI reuse the established menu, HUD, map, Skill, and result presentation", () => {
  const menu = renderMainMenuScreen();
  assert.match(menu, />Play</);
  assert.match(menu, /Stage 1 Redesign Playtest/);

  const emptyEntry = renderStage1RedesignEntryScreen({ participantCode: "", errorMessage: "Code required" });
  assert.match(emptyEntry, /non-personal study code/i);
  assert.match(emptyEntry, /Code required/);

  const state = initial();
  const hud = renderBattleHud({ stage1Map: map }, state);
  assert.match(hud, /battle-screen/);
  assert.match(hud, /STAGE 1 READOUT/);
  assert.match(hud, /Eliminate All Required Enemies/);
  assert.match(hud, /tile-stage1-obstacle/);
  assert.doesNotMatch(hud, />O30</);

  const adjacent = {
    ...state,
    battleControlState: "attack_targeting",
    enemyUnits: state.enemyUnits.map((unit) => ({ ...unit, tileX: 3, tileY: 10 }))
  };
  const adjacentTargets = getValidPlayerBasicAttackTargets(map, adjacent);
  adjacent.targetType = adjacentTargets[0].targetType;
  adjacent.targetId = adjacentTargets[0].targetId;
  const attackHud = renderBattleHud(
    { stage1Map: map },
    adjacent,
    [],
    adjacentTargets,
    adjacentTargets
  );
  assert.doesNotMatch(attackHud, /Cover Reduction/);
  assert.match(attackHud, /solid-obstacle paths/);

  const skill = renderSkillPanel(
    map,
    { ...state, battleControlState: "skill_menu" },
    { unlockedSkills: { guard: [] } }
  );
  assert.match(skill, /Fortify · 2 AP/);
  assert.match(skill, /Gain 6 Shield/);

  const resultState = {
    ...state,
    battleControlState: "battle_result",
    resultState: "victory",
    resultSnapshot: createBattleResultSnapshot({
      ...state,
      battleControlState: "battle_result",
      resultState: "victory"
    })
  };
  const result = renderBattleResultOverlay(resultState);
  assert.match(result, /CONTINUE TO BUFF SELECTION/);
  assert.doesNotMatch(result, /EXPORT JSON/);
  assert.doesNotMatch(result, /SECONDS/);

  let preparation = initial();
  preparation.enemyUnits[0].currentHP = 0;
  preparation = updateStage1AfterSwordDefeat(
    preparation,
    preparation.enemyUnits[0].battleUnitId
  ).battleState;
  preparation = beginStage1PreparationTurn(map, preparation);
  const preparationHud = renderBattleHud({ stage1Map: map }, preparation);
  assert.match(preparationHud, /INCOMING SWORD 2/);
  assert.match(preparationHud, /tile-stage1-threat/);
});

test("Stage 1 Fortify costs 2 AP, is self-only, grants Shield 6, locks movement, and has no cooldown", () => {
  const state = initial();
  assert.deepEqual(skillTargets(map, state, "fortify").map((unit) => unit.battleUnitId), [state.playerUnits[0].battleUnitId]);
  const result = resolveSkill(map, state, { unlockedSkills: { guard: [] } }, "fortify", state.playerUnits[0].battleUnitId);
  assert.equal(result.error, null);
  assert.equal(result.battleState.teamApCurrent, 0);
  assert.equal(result.battleState.playerUnits[0].fortifyShield, 6);
  assert.equal(result.battleState.playerUnits[0].movementLocked, true);
  assert.equal(result.battleState.playerUnits[0].skillCooldowns?.fortify, undefined);
  assert.equal(isStage1Fortified(result.battleState.playerUnits[0]), true);
});

test("Stage 1 Fortify cannot combine with movement or Attack and does not stack", () => {
  const profile = { unlockedSkills: { guard: [] } };
  const moved = { ...initial(), teamApCurrent: 1 };
  assert.match(skillBlockReason(moved, profile, "fortify"), /Team AP/);
  const attacked = { ...initial(), teamApCurrent: 1 };
  assert.match(skillBlockReason(attacked, profile, "fortify"), /Team AP/);
  const cast = resolveSkill(map, initial(), profile, "fortify", initial().playerUnits[0].battleUnitId).battleState;
  const resetAp = { ...cast, teamApCurrent: 2 };
  assert.match(skillBlockReason(resetAp, profile, "fortify"), /already/i);
});

test("Fortify expires at the next Player Turn while generic Shield never confers Fortified", () => {
  const generic = initial();
  generic.playerUnits[0].temporaryShield = 6;
  assert.equal(isStage1Fortified(generic.playerUnits[0]), false);
  const cast = resolveSkill(map, initial(), { unlockedSkills: { guard: [] } }, "fortify", initial().playerUnits[0].battleUnitId).battleState;
  const expired = finishSkillEnemyTurn(cast);
  assert.equal(expired.playerUnits[0].fortifyShield, 0);
  assert.equal(isStage1Fortified(expired.playerUnits[0]), false);
});

test("Fortified melee hit consumes Shield before HP and triggers cardinal Repelled", () => {
  let state = placeContact(initial(), 6, 5);
  state.playerUnits[0].fortifyShield = 6;
  const result = resolveEnemyAttackPhase(map, { ...state, phase: "enemy_phase" });
  assert.equal(result.attackEvents[0].shieldAbsorbed, 6);
  assert.equal(result.battleState.playerUnits[0].currentHP, 25);
  assert.equal(result.attackEvents[0].repelledTriggered, true);
  assert.deepEqual([result.battleState.enemyUnits[0].tileX, result.battleState.enemyUnits[0].tileY], [7, 5]);
  assert.equal(result.battleState.enemyUnits[0].stage1RecoveryState, "pending");
});

test("non-Fortified and projectile-style hits never trigger Repelled", () => {
  let state = placeContact(initial(), 6, 5);
  let result = resolveEnemyAttackPhase(map, { ...state, phase: "enemy_phase" });
  assert.equal(result.attackEvents[0].repelledTriggered, false);

  state = placeContact(initial(), 6, 5);
  state.playerUnits[0].fortifyShield = 6;
  state.enemyUnits[0].usesProjectile = true;
  state.enemyUnits[0].attackType = "ranged";
  result = resolveEnemyAttackPhase(map, { ...state, phase: "enemy_phase" });
  assert.equal(result.attackEvents[0].repelledTriggered, false);
});

test("knockback supports diagonal movement and blocks obstacle, void, edge, and occupied destinations without alternatives", () => {
  let state = placeContact(initial(), 6, 6);
  let result = resolveStage1Knockback(map, state, state.enemyUnits[0].battleUnitId, state.playerUnits[0].battleUnitId);
  assert.deepEqual(result.event.resolvedDestination, { x: 7, y: 7 });
  assert.equal(result.event.moved, true);

  const blockers = [
    { name: "obstacle", tile: "O30", sword: [6, 5], destination: [7, 5], reason: "obstacle" },
    { name: "void", tile: "X", sword: [6, 5], destination: [7, 5], reason: "void" },
    { name: "edge", tile: null, sword: [11, 5], guard: [10, 5], destination: [12, 5], reason: "edge" }
  ];
  for (const item of blockers) {
    const localMap = structuredClone(map);
    if (item.tile) localMap.tiles[item.destination[1]][item.destination[0]] = item.tile;
    state = placeContact(initial(), item.sword[0], item.sword[1], ...(item.guard ?? [5, 5]));
    result = resolveStage1Knockback(localMap, state, state.enemyUnits[0].battleUnitId, state.playerUnits[0].battleUnitId);
    assert.equal(result.event.moved, false, item.name);
    assert.equal(result.event.blockedReason, item.reason, item.name);
    assert.equal(result.battleState.enemyUnits[0].stage1RecoveryState, "pending", item.name);
  }

  state = placeContact(initial(), 6, 5);
  state.playerUnits.push({ ...state.playerUnits[0], battleUnitId: "occupied", tileX: 7, tileY: 5 });
  result = resolveStage1Knockback(map, state, state.enemyUnits[0].battleUnitId, state.playerUnits[0].battleUnitId);
  assert.equal(result.event.blockedReason, "occupied");
});

test("Recovery consumes one activation, clears Stunned, and restores Attack Intent afterward", () => {
  let state = placeContact(initial(), 6, 5);
  state = resolveStage1Knockback(map, state, state.enemyUnits[0].battleUnitId, state.playerUnits[0].battleUnitId).battleState;
  const before = { ...state.enemyUnits[0] };
  const recovery = resolveStage1RecoveryActivation(state, before.battleUnitId);
  const after = recovery.battleState.enemyUnits[0];
  assert.equal(recovery.recovered, true);
  assert.deepEqual([after.tileX, after.tileY], [before.tileX, before.tileY]);
  assert.equal(after.stage1RecoveryState, null);
  assert.equal(after.currentIntent, null);
  assert.equal(after.hasActed, true);

  const recoveredIntent = resolveEnemyCurrentIntent(
    {
      ...recovery.battleState,
      enemyUnits: recovery.battleState.enemyUnits.map((unit) => ({
        ...unit,
        turnState: "ready",
        hasActed: false
      }))
    },
    after.battleUnitId
  );
  assert.equal(recoveredIntent.intent.intentType, "basic_attack");

  const moved = resolveEnemyMovementPhase(
    map,
    { ...recoveredIntent.battleState, phase: "enemy_phase" },
    [after.battleUnitId]
  );
  const attacked = resolveEnemyAttackPhase(
    map,
    moved.battleState,
    [after.battleUnitId]
  );
  assert.equal(attacked.attackEvents[0].attacked, true);
});

test("Sword 1 defeat opens notice, transition reveals telegraph, and preparation blocks ending on reserved tile", () => {
  let state = initial();
  state.enemyUnits[0].currentHP = 0;
  state = updateStage1AfterSwordDefeat(state, state.enemyUnits[0].battleUnitId).battleState;
  assert.equal(state.resultState, "ongoing");
  assert.equal(state.stage1Redesign.reinforcementPending, true);
  assert.equal(state.waveState.waves[0].status, "scheduled");

  state.playerUnits[0].tileX = 10;
  state.playerUnits[0].tileY = 8;
  state = beginStage1PreparationTurn(map, state);
  assert.equal(state.phase, "player_phase");
  assert.equal(state.stage1Redesign.preparationActive, true);
  assert.equal(state.waveState.waves[0].status, "telegraphed");
  assert.equal(
    getValidPlayerBasicAttackTargets(map, state).some((target) => target.targetId === "enemy_sword_2"),
    false
  );

  assert.equal(canEndStage1Turn(state).allowed, false);
});

test("Sword 2 lands at 10,8, activates immediately, and victory waits for its defeat", () => {
  let state = initial();
  state.enemyUnits[0].currentHP = 0;
  state = updateStage1AfterSwordDefeat(state, state.enemyUnits[0].battleUnitId).battleState;
  state = beginStage1PreparationTurn(map, state);
  state = { ...state, phase: "enemy_phase" };
  const landing = spawnStage1Reinforcement(enemyUnits, map, state);
  const sword2 = landing.battleState.enemyUnits.find((unit) => unit.battleUnitId === "enemy_sword_2");
  assert.deepEqual([sword2.tileX, sword2.tileY], [10, 8]);
  assert.equal(landing.spawnEvents.length, 1);
  assert.equal(landing.battleState.stage1Redesign.reinforcementPending, false);

  const beforeActivation = { ...sword2 };
  const activated = resolveEnemyAttackPhase(map, {
    ...landing.battleState,
    enemyUnits: landing.battleState.enemyUnits.map((unit) => unit.battleUnitId === sword2.battleUnitId
      ? { ...unit, tileX: 3, tileY: 10, currentTargetId: landing.battleState.playerUnits[0].battleUnitId, currentIntent: { intentType: "basic_attack", targetId: landing.battleState.playerUnits[0].battleUnitId } }
      : unit)
  }, [sword2.battleUnitId]);
  assert.equal(activated.attackEvents[0].attacked, true);
  assert.notDeepEqual(activated.battleState.enemyUnits.find((unit) => unit.battleUnitId === sword2.battleUnitId), beforeActivation);
});

test("retry fully restores initial state, increments attempt, and preserves earlier telemetry", () => {
  let state = appendStage1TelemetryEvent(initial(), "player_moved", { payload: { apBefore: 2, apAfter: 1 } });
  state.playerUnits[0].currentHP = 1;
  state.playerUnits[0].fortifyShield = 6;
  const retry = createStage1RetryState(data, state);
  assert.equal(retry.stage1Session.attemptNumber, 2);
  assert.equal(retry.playerUnits[0].currentHP, 25);
  assert.deepEqual([retry.playerUnits[0].tileX, retry.playerUnits[0].tileY], [2, 10]);
  assert.equal(retry.playerUnits[0].fortifyShield ?? 0, 0);
  assert.equal(retry.teamApCurrent, 2);
  assert.equal(retry.playerUnits[0].movementApCommitted, false);
  assert.equal(retry.playerUnits[0].movementLocked, false);
  assert.equal(retry.waveState.waves[0].status, "scheduled");
  assert.equal(retry.stage1Redesign.preparationActive, false);
  assert.equal(retry.stage1Redesign.reinforcementPending, false);
  assert.ok(retry.telemetryEvents.some((event) => event.event_type === "player_moved"));
  assert.ok(retry.telemetryEvents.some((event) => event.event_type === "retry_selected"));
});

test("Stage 1 result snapshot records validation metrics without changing legacy result shape", () => {
  const state = {
    ...initial(),
    battleControlState: "battle_result",
    resultState: "victory",
    stageStartedAt: 1000,
    stageEndedAt: 4500,
    turnCount: 7,
    enemyUnits: initial().enemyUnits.map((unit) => ({ ...unit, currentHP: 0 }))
  };
  const snapshot = createBattleResultSnapshot(state);
  assert.equal(snapshot.metrics.durationMs, 3500);
  assert.equal(snapshot.metrics.attemptNumber, 1);
  assert.equal(snapshot.metrics.finalGuardHP, 25);
  assert.equal(snapshot.metrics.crystalGained, 20);
});

test("reward settlement is one-time and telemetry exports a complete identity envelope", () => {
  let state = settleStage1Reward({ ...initial(), resultState: "victory" });
  assert.equal(state.stage1Redesign.rewardSettled, true);
  assert.equal(state.stage1Redesign.runCrystalAwarded, 20);
  assert.equal(settleStage1Reward(state), state);

  state = appendStage1TelemetryEvent(state, "fortify_used", {
    actorId: state.playerUnits[0].battleUnitId,
    payload: { apBefore: 2, apAfter: 0, swordCouldThreaten: false }
  });
  const parsed = JSON.parse(serializeStage1Telemetry(state));
  const event = parsed.events.at(-1);
  for (const key of ["participant_code", "session_id", "attempt_number", "stage_id", "timestamp", "player_turn", "phase", "event_type", "actor_id", "target_id", "payload"]) {
    assert.ok(Object.hasOwn(event, key), key);
  }
});

test("every required telemetry event keeps the identity envelope and capture failure never mutates combat state", () => {
  const requiredEvents = [
    "stage_started", "turn_started", "player_moved", "player_attacked",
    "fortify_used", "turn_ended", "enemy_intent_updated", "enemy_activated",
    "damage_resolved", "repelled_triggered", "knockback_resolved",
    "stun_recovery", "sword_defeated", "wave_telegraph_shown",
    "stage_ended", "retry_selected"
  ];
  let state = initial();
  for (const eventType of requiredEvents) {
    state = appendStage1TelemetryEvent(state, eventType, {
      actorId: "actor",
      targetId: "target",
      payload: { apBefore: 2, apAfter: 1 }
    });
  }

  const events = state.telemetryEvents.slice(-requiredEvents.length);
  assert.deepEqual(events.map((event) => event.event_type), requiredEvents);
  for (const event of events) {
    for (const key of ["participant_code", "session_id", "attempt_number", "stage_id", "timestamp", "player_turn", "phase", "event_type", "actor_id", "target_id", "payload"]) {
      assert.ok(Object.hasOwn(event, key), `${event.event_type}:${key}`);
    }
  }

  const guardBefore = structuredClone(state.playerUnits[0]);
  const safeFailure = appendStage1TelemetryEvent(state, "player_moved", {
    payload: { cannotClone: () => true }
  });
  assert.deepEqual(safeFailure.playerUnits[0], guardBefore);
  assert.equal(safeFailure.telemetryEvents.at(-1).payload.telemetry_capture_error, "payload_not_cloneable");
  assert.doesNotThrow(() => JSON.parse(serializeStage1Telemetry(safeFailure)));
});
