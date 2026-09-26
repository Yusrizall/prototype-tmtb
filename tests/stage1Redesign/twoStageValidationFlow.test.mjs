import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  createStage1RedesignBattleState,
  createStage1RetryState,
  createStage2PlaceholderBattleState,
  createStage2RetryState,
  settleStage1Reward
} from "../../src/logic/battle/stage1RedesignLogic.js";
import {
  createBattleResultSnapshot,
  createImmutableBattleResultSnapshot
} from "../../src/logic/battle/battleResultState.js";
import {
  renderBattleResultOverlay
} from "../../src/ui/battle/battleHud.js";
import {
  appendStage1TelemetryEvent
} from "../../src/logic/telemetry/stage1Telemetry.js";
import {
  captureStage2EntrySnapshot,
  captureValidationBattleResult,
  completeValidationBuffDecision,
  createTwoStageValidationSession,
  endTwoStageValidationSession,
  prepareValidationBuffDecision,
  recordValidationBuffSelection,
  recordValidationExportFailed,
  recordValidationExportRequested,
  recordValidationExportSucceeded,
  serializeTwoStageValidationSession,
  setValidationAttemptNumber,
  syncValidationBattleEvents,
  VALIDATION_STAGE_1_ID,
  VALIDATION_STAGE_2_ID
} from "../../src/logic/validation/twoStageValidationFlow.js";

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

function encounter(encounterId, name, crystalReward, waveId, battleUnitId) {
  return {
    encounterId,
    name,
    mapId: map.mapId,
    objectiveType: "eliminate_all",
    objectiveLabel: "Eliminate All Required Enemies",
    playerSpawns: [{ unitId: "guard", spawnLabel: "P1" }],
    enemySpawns: [{ unitId: "sword_enemy", spawnLabel: "E1" }],
    waves: [{
      waveId, required: true, unitId: "sword_enemy", battleUnitId,
      spawnLabel: "E2", telegraphLabel: "SWORD 2"
    }],
    crystalReward
  };
}

const stage1Encounter = encounter(
  VALIDATION_STAGE_1_ID,
  "Stage 1 Redesign Playtest",
  20,
  "stage1_sword_2",
  "enemy_sword_2"
);
const stage2Encounter = {
  ...encounter(
    VALIDATION_STAGE_2_ID,
    "Stage 2 Validation Placeholder",
    0,
    "stage2_placeholder_sword_2",
    "enemy_stage2_placeholder_sword_2"
  ),
  placeholder: true
};
const data = {
  playerUnits,
  enemyUnits,
  stage1RedesignMap: map,
  stage1RedesignEncounter: stage1Encounter,
  stage2ValidationEncounter: stage2Encounter
};

function createSession() {
  return createTwoStageValidationSession({
    participantCode: "P-101",
    sessionId: "session-two-stage",
    timestamp: "2026-09-26T00:00:00.000Z"
  });
}

function createStage1(session = createSession()) {
  return createStage1RedesignBattleState(data, {
    participantCode: session.participantCode,
    sessionId: session.sessionId,
    telemetryEvents: session.events
  });
}

function resultState(state, result, hp, endedAt = 5000) {
  const next = {
    ...state,
    battleControlState: "battle_result",
    phase: "battle_end",
    resultState: result,
    stageStartedAt: 1000,
    stageEndedAt: endedAt,
    playerUnits: state.playerUnits.map((unit) => ({ ...unit, currentHP: hp })),
    enemyUnits: state.enemyUnits.map((unit) => ({ ...unit, currentHP: result === "victory" ? 0 : unit.currentHP }))
  };
  return {
    ...next,
    resultSnapshot:
      next.flowContext === "stage1_redesign"
        ? createImmutableBattleResultSnapshot(next)
        : createBattleResultSnapshot(next)
  };
}

function stage2Entry(session, entryHP) {
  return captureStage2EntrySnapshot(session, {
    stageId: VALIDATION_STAGE_2_ID,
    stage1Session: { attemptNumber: 1 },
    playerUnits: [{
      unitDefId: "guard", currentHP: entryHP, maxHP: 25, tileX: 2, tileY: 10
    }]
  });
}

test("new validation sessions begin active without a terminal outcome", () => {
  const exported = JSON.parse(
    serializeTwoStageValidationSession(createSession())
  );
  assert.equal(exported.status, "active");
  assert.equal(exported.ended_at, null);
  assert.equal(exported.final_session_outcome, null);
});

test("Stage 2 defeat remains an active attempt until retry or explicit session end", () => {
  let session = stage2Entry(createSession(), 7);
  let stage2 = createStage2PlaceholderBattleState(data, {
    participantCode: session.participantCode,
    sessionId: session.sessionId,
    telemetryEvents: session.events,
    carriedGuardHP: 7,
    entrySnapshot: session.stage2EntrySnapshot
  });
  stage2 = resultState(stage2, "defeat", 0, 8000);
  stage2 = appendStage1TelemetryEvent(stage2, "stage_ended", {
    payload: {
      result: "defeat",
      finalGuardHP: 0,
      durationMs: 7000,
      totalTurns: stage2.turnCount,
      reward: 0
    }
  });
  session = captureValidationBattleResult(session, stage2);
  session = recordValidationExportRequested(session);
  session = recordValidationExportSucceeded(session);

  const defeatedExport = JSON.parse(
    serializeTwoStageValidationSession(session)
  );
  assert.equal(defeatedExport.status, "active");
  assert.equal(defeatedExport.ended_at, null);
  assert.equal(defeatedExport.final_session_outcome, null);
  assert.equal(defeatedExport.stage_2.attempts.length, 1);
  assert.equal(defeatedExport.stage_2.attempts[0].result, "defeat");
  assert.equal(defeatedExport.stage_2.attempts[0].metrics.attemptNumber, 1);
  assert.equal(defeatedExport.stage_2.attempts[0].metrics.finalGuardHP, 0);
  assert.ok(defeatedExport.events.some((event) => (
    event.event_type === "stage_ended" &&
    event.payload.result === "defeat"
  )));
  assert.equal(defeatedExport.events.at(-2).event_type, "export_requested");
  assert.equal(defeatedExport.events.at(-1).event_type, "export_succeeded");

  const retry = createStage2RetryState(data, {
    ...stage2,
    telemetryEvents: session.events
  });
  session = setValidationAttemptNumber(
    session,
    VALIDATION_STAGE_2_ID,
    retry.stage1Session.attemptNumber
  );
  session = syncValidationBattleEvents(session, retry);
  assert.equal(retry.stage1Session.attemptNumber, 2);
  assert.equal(retry.playerUnits[0].currentHP, 7);
  assert.equal(session.stageResults.stage2.length, 1);
  assert.ok(session.events.some((event) => event.event_type === "stage_ended"));
  assert.ok(session.events.some((event) => event.event_type === "retry_selected"));

  let victory = resultState(retry, "victory", 3, 12000);
  victory = appendStage1TelemetryEvent(victory, "stage_ended", {
    payload: {
      result: "victory",
      finalGuardHP: 3,
      durationMs: 11000,
      totalTurns: victory.turnCount,
      reward: 0
    }
  });
  session = captureValidationBattleResult(session, victory);
  const completedExport = JSON.parse(
    serializeTwoStageValidationSession(session)
  );
  assert.equal(completedExport.status, "completed");
  assert.notEqual(completedExport.ended_at, null);
  assert.equal(completedExport.final_session_outcome, "victory");
  assert.deepEqual(
    completedExport.stage_2.attempts.map((attempt) => attempt.result),
    ["defeat", "victory"]
  );
  assert.equal(
    completedExport.events.filter((event) => event.event_type === "session_ended").length,
    1
  );
});

test("a defeat becomes terminal only when the session is explicitly ended", () => {
  const ended = endTwoStageValidationSession(
    createSession(),
    "defeat",
    "2026-09-26T01:00:00.000Z"
  );
  assert.equal(ended.status, "completed");
  assert.equal(ended.endedAt, "2026-09-26T01:00:00.000Z");
  assert.equal(ended.finalOutcome, "defeat");
  assert.equal(ended.events.at(-1).event_type, "session_ended");
});

test("damaged Victory and Defeat results render the immutable terminal Guard HP without a Seconds card", () => {
  const stage1 = createStage1();
  const victory = resultState(stage1, "victory", 7);
  const victorySnapshot = victory.resultSnapshot;
  const victoryHtml = renderBattleResultOverlay(victory);
  assert.match(victoryHtml, />7<\/strong>\s*\/ 25/);
  assert.match(victoryHtml, /-18 HP/);
  assert.doesNotMatch(victoryHtml, /SECONDS/);
  assert.equal(victorySnapshot.metrics.durationMs, 4000);
  assert.equal(Object.isFrozen(victorySnapshot), true);
  assert.equal(Object.isFrozen(victorySnapshot.party[0]), true);

  const defeat = resultState(stage1, "defeat", 0);
  const defeatHtml = renderBattleResultOverlay(defeat, {
    validationExportStatus: "required"
  });
  assert.match(defeatHtml, />0<\/strong>\s*\/ 25/);
  assert.match(defeatHtml, /DEFEATED/);
  assert.doesNotMatch(defeatHtml, /SECONDS/);
});

test("retry creates fresh state without mutating prior result snapshots", () => {
  const victory = resultState(createStage1(), "victory", 7);
  const priorSnapshot = structuredClone(victory.resultSnapshot);
  const retry = createStage1RetryState(data, victory);
  retry.playerUnits[0].currentHP = 3;
  assert.deepEqual(victory.resultSnapshot, priorSnapshot);
  assert.equal(retry.playerUnits[0].currentHP, 3);
  assert.equal(priorSnapshot.party[0].currentHP, 7);
});

test("Stage 1 Victory uses the existing Buff Selection route and records effects as inactive", () => {
  const mainSource = fs.readFileSync(new URL("../../src/main.js", import.meta.url), "utf8");
  assert.match(mainSource, /openValidationBuffSelection\(\)/);
  assert.match(mainSource, /renderRewardSelectionScreen\(\s*validationRewardState \?\? runState/);

  const offers = [
    { buffId: "iron_resolve", name: "Iron Resolve", effects: [{ type: "stat_modifier", target: "guard", stat: "maxHP", amount: 4 }] },
    { buffId: "marching_drill", name: "Marching Drill", effects: [{ type: "stat_modifier", target: "party", stat: "move", amount: 1 }] }
  ];
  let session = prepareValidationBuffDecision(createSession(), offers, "2026-09-26T00:00:01.000Z");
  session = recordValidationBuffSelection(session, "iron_resolve", "2026-09-26T00:00:02.000Z");
  session = recordValidationBuffSelection(session, null, "2026-09-26T00:00:03.000Z");
  session = recordValidationBuffSelection(session, "marching_drill", "2026-09-26T00:00:04.000Z");
  session = completeValidationBuffDecision(session, "marching_drill", "2026-09-26T00:00:06.000Z");
  assert.deepEqual(session.buffDecision.selectionHistory.map((item) => item.selected_buff_id), ["iron_resolve", null, "marching_drill"]);
  assert.equal(session.buffDecision.effectsActive, false);
  assert.equal(session.buffDecision.decisionDurationMs, 5000);
  assert.ok(session.events.some((event) => event.event_type === "buff_confirmed"));
});

test("Stage 2 has separate placeholder identity, carries HP, and never activates the recorded Buff", () => {
  let session = createSession();
  const stage1Result = resultState(createStage1(session), "victory", 7);
  session = captureValidationBattleResult(session, stage1Result);
  session = prepareValidationBuffDecision(session, [{ buffId: "iron_resolve", effects: [{ type: "stat_modifier", target: "guard", stat: "maxHP", amount: 4 }] }]);
  session = completeValidationBuffDecision(session, "iron_resolve");
  session = stage2Entry(session, 7);
  const stage2 = createStage2PlaceholderBattleState(data, {
    participantCode: session.participantCode,
    sessionId: session.sessionId,
    telemetryEvents: session.events,
    carriedGuardHP: 7,
    entrySnapshot: session.stage2EntrySnapshot
  });

  assert.equal(stage2.stageId, VALIDATION_STAGE_2_ID);
  assert.equal(stage2.encounterName, "Stage 2 Validation Placeholder");
  assert.equal(stage2.playerUnits[0].currentHP, 7);
  assert.equal(stage2.playerUnits[0].stageStartHP, 7);
  assert.equal(stage2.playerUnits[0].maxHP, 25);
  assert.equal(stage2.playerUnits[0].derivedStats.atk, 5);
  assert.equal(stage2.playerUnits[0].derivedStats.move, 3);
  assert.equal(stage2.teamApCapacity, 2);
  assert.equal(stage2.crystalReward, 0);
  assert.equal(stage2.appliedRunBuffIds, undefined);
  assert.equal(session.buffDecision.effectsActive, false);
});

test("Stage 2 retry restores its immutable carried entry HP while Stage 1 retry restores 25", () => {
  let session = stage2Entry(createSession(), 7);
  let stage2 = createStage2PlaceholderBattleState(data, {
    participantCode: session.participantCode,
    sessionId: session.sessionId,
    telemetryEvents: session.events,
    carriedGuardHP: 7,
    entrySnapshot: session.stage2EntrySnapshot
  });
  stage2 = resultState(stage2, "defeat", 0);
  const stage2Retry = createStage2RetryState(data, stage2);
  assert.equal(stage2Retry.playerUnits[0].currentHP, 7);
  assert.equal(stage2Retry.playerUnits[0].stageStartHP, 7);
  assert.equal(stage2Retry.stage1Session.attemptNumber, 2);

  const stage1 = resultState(createStage1(), "defeat", 0);
  const stage1Retry = createStage1RetryState(data, stage1);
  assert.equal(stage1Retry.playerUnits[0].currentHP, 25);
});

test("Stage 2 reward is zero, idempotent, and does not touch permanent progression", () => {
  const session = stage2Entry(createSession(), 12);
  const stage2 = createStage2PlaceholderBattleState(data, {
    participantCode: session.participantCode,
    sessionId: session.sessionId,
    telemetryEvents: session.events,
    carriedGuardHP: 12,
    entrySnapshot: session.stage2EntrySnapshot
  });
  const settled = settleStage1Reward({ ...stage2, resultState: "victory" });
  assert.equal(settled.stage1Redesign.runCrystalAwarded, 0);
  assert.equal(settleStage1Reward(settled), settled);
  assert.equal(Object.hasOwn(settled, "metaCrystal"), false);
});

test("one session export contains Stage 1, Buff, Stage 2, duration, and ordered flow events", () => {
  let session = createSession();
  let stage1 = resultState(createStage1(session), "victory", 7);
  session = captureValidationBattleResult(session, stage1);
  const offers = [{ buffId: "iron_resolve" }, { buffId: "marching_drill" }];
  session = prepareValidationBuffDecision(session, offers);
  session = recordValidationBuffSelection(session, "iron_resolve");
  session = completeValidationBuffDecision(session, "iron_resolve");
  session = stage2Entry(session, 7);
  let stage2 = createStage2PlaceholderBattleState(data, {
    participantCode: session.participantCode,
    sessionId: session.sessionId,
    telemetryEvents: session.events,
    carriedGuardHP: 7,
    entrySnapshot: session.stage2EntrySnapshot
  });
  session = syncValidationBattleEvents(session, stage2);
  stage2 = resultState(stage2, "victory", 1, 9000);
  session = captureValidationBattleResult(session, stage2);
  session = recordValidationExportRequested(session);
  session = recordValidationExportSucceeded(session);
  const exported = JSON.parse(serializeTwoStageValidationSession(session));

  assert.equal(exported.participant_code, "P-101");
  assert.equal(exported.session_id, "session-two-stage");
  assert.equal(exported.stage_1.final_hp, 7);
  assert.equal(exported.stage_1.attempts[0].metrics.durationMs, 4000);
  assert.equal(exported.buff_selection.confirmedBuffId, "iron_resolve");
  assert.equal(exported.buff_selection.effects_active, false);
  assert.equal(exported.stage_2.entry_snapshot.entry_hp, 7);
  assert.equal(exported.stage_2.final_hp, 1);
  assert.equal(exported.stage_2.reward, 0);
  assert.equal(exported.final_session_outcome, "victory");
  for (const eventType of [
    "session_started", "battle_result_created", "buff_offers_generated",
    "buff_selection_changed", "buff_confirmed", "stage_transitioned",
    "stage_entered", "attempt_started", "session_ended",
    "export_requested", "export_succeeded"
  ]) {
    assert.ok(exported.events.some((event) => event.event_type === eventType), eventType);
  }
});

test("result action gates require export for defeats and Stage 2 completion, while Stage 1 Victory continues", () => {
  const stage1 = createStage1();
  const stage1Victory = resultState(stage1, "victory", 7);
  const stage1VictoryHtml = renderBattleResultOverlay(stage1Victory, { validationExportStatus: "not_required" });
  assert.match(stage1VictoryHtml, /CONTINUE TO BUFF SELECTION/);
  assert.doesNotMatch(stage1VictoryHtml, /disabled/);

  const stage1Defeat = resultState(stage1, "defeat", 0);
  const requiredHtml = renderBattleResultOverlay(stage1Defeat, { validationExportStatus: "required" });
  assert.match(requiredHtml, /validation-retry" disabled/);
  assert.match(requiredHtml, /validation-main-menu" disabled/);
  const succeededHtml = renderBattleResultOverlay(stage1Defeat, { validationExportStatus: "succeeded" });
  assert.doesNotMatch(succeededHtml, /validation-retry" disabled/);
  assert.doesNotMatch(succeededHtml, /validation-main-menu" disabled/);

  const session = stage2Entry(createSession(), 7);
  const stage2 = resultState(createStage2PlaceholderBattleState(data, {
    participantCode: session.participantCode,
    sessionId: session.sessionId,
    telemetryEvents: session.events,
    carriedGuardHP: 7,
    entrySnapshot: session.stage2EntrySnapshot
  }), "victory", 4);
  const stage2Html = renderBattleResultOverlay(stage2, { validationExportStatus: "required" });
  assert.match(stage2Html, /EXPORT COMPLETE SESSION JSON/);
  assert.match(stage2Html, /validation-main-menu" disabled/);
});

test("export failure changes only telemetry session state and cannot mutate gameplay or result snapshots", () => {
  const battle = resultState(createStage1(), "defeat", 0);
  const before = structuredClone(battle);
  let session = recordValidationExportRequested(createSession());
  session = recordValidationExportFailed(session, "Blob unavailable");
  assert.deepEqual(battle, before);
  assert.equal(session.exportStatus, "failed");
  assert.match(session.exportFeedback, /snapshots are unchanged/);
  assert.equal(session.events.at(-1).event_type, "export_failed");
});
