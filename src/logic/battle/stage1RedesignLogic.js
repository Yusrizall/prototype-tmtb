import {
  calculateTeamApCapacity,
  createInitialBattleState
} from "./battleSetup.js";
import {
  getActiveWaveReservations,
  initializeWaveState,
  refreshWaveResolutionState,
  spawnTelegraphedWaves,
  telegraphWave
} from "./waveLogic.js";
import {
  appendStage1TelemetryEvent
} from "../telemetry/stage1Telemetry.js";

export const STAGE1_REDESIGN_FLOW = "stage1_redesign";
export const STAGE1_REDESIGN_ID = "r1_stage1_redesign_v0_2";
export const STAGE2_PLACEHOLDER_ID = "r1_stage2_validation_placeholder_v0_1";
export const STAGE1_REWARD = 20;

const BLOCKING_OBSTACLES = new Set(["O30", "O70", "OF", "LOS"]);

export function isStage1RedesignBattle(battleState) {
  return battleState?.flowContext === STAGE1_REDESIGN_FLOW;
}

export function isStage2PlaceholderBattle(battleState) {
  return battleState?.stageId === STAGE2_PLACEHOLDER_ID;
}

export function isStage1Fortified(unit) {
  return Number(unit?.fortifyShield ?? 0) > 0;
}

function createValidationBattleState(
  data,
  {
    participantCode,
    sessionId,
    attemptNumber = 1,
    telemetryEvents = [],
    stageNumber,
    stageId,
    encounter,
    carriedGuardHP = null,
    isRetry = false,
    entrySnapshot = null
  }
) {
  const stageData = {
    ...data,
    stage1Map: data.stage1RedesignMap,
    stage1Encounter: encounter
  };

  const baseState = createInitialBattleState(stageData, null);
  const withWave = initializeWaveState(
    data.stage1RedesignMap,
    baseState,
    encounter.waves ?? []
  );

  const carriedPlayerUnits = withWave.playerUnits.map((unit) => {
    if (unit.unitDefId !== "guard" || !Number.isFinite(carriedGuardHP)) {
      return unit;
    }
    const currentHP = Math.max(0, Math.min(unit.maxHP, Math.floor(carriedGuardHP)));
    return {
      ...unit,
      currentHP,
      stageStartHP: currentHP
    };
  });

  let nextState = {
    ...withWave,
    playerUnits: carriedPlayerUnits,
    stageId,
    flowContext: STAGE1_REDESIGN_FLOW,
    nodeType: "validation",
    objectiveLabel:
      encounter.objectiveLabel ??
      "Eliminate All Required Enemies",
    crystalReward: encounter.crystalReward ?? (stageNumber === 1 ? STAGE1_REWARD : 0),
    resultState: "ongoing",
    stageStartedAt: Date.now(),
    telemetryEvents: [...telemetryEvents],
    stage1Session: {
      participantCode,
      sessionId,
      attemptNumber,
      stageNumber
    },
    validationEntrySnapshot: entrySnapshot ? structuredClone(entrySnapshot) : null,
    stage1Redesign: {
      wave1Cleared: false,
      reinforcementPending: false,
      preparationActive: false,
      rewardSettled: false,
      runCrystalAwarded: 0,
      exportFeedback: null,
      notice: stageNumber === 2
        ? "STAGE 2 VALIDATION PLACEHOLDER — accepted Stage 1 combat rules are reused."
        : "Read Sword Attack Intent, then choose Attack, Fortify, or position."
    }
  };

  if (!isRetry) {
    nextState = appendStage1TelemetryEvent(nextState, "stage_entered", {
      payload: {
        stage_name: encounter.name,
        placeholder: stageNumber === 2,
        entry_hp: nextState.playerUnits[0]?.currentHP ?? null
      }
    });
  }

  nextState = appendStage1TelemetryEvent(nextState, "attempt_started", {
    payload: {
      attempt_number: attemptNumber,
      entry_hp: nextState.playerUnits[0]?.currentHP ?? null
    }
  });

  nextState = appendStage1TelemetryEvent(nextState, "stage_started", {
    payload: {
      guardHP: nextState.playerUnits[0]?.currentHP ?? null,
      guardPosition: nextState.playerUnits[0]
        ? { x: nextState.playerUnits[0].tileX, y: nextState.playerUnits[0].tileY }
        : null,
      sword1Position: nextState.enemyUnits[0]
        ? { x: nextState.enemyUnits[0].tileX, y: nextState.enemyUnits[0].tileY }
        : null
    }
  });

  return appendStage1TelemetryEvent(nextState, "turn_started", {
    payload: {
      teamAp: nextState.teamApCurrent,
      intent: nextState.enemyUnits[0]?.currentIntent ?? null
    }
  });
}

export function createStage1RedesignBattleState(
  data,
  {
    participantCode,
    sessionId,
    attemptNumber = 1,
    telemetryEvents = [],
    isRetry = false
  }
) {
  return createValidationBattleState(data, {
    participantCode,
    sessionId,
    attemptNumber,
    telemetryEvents,
    isRetry,
    stageNumber: 1,
    stageId: STAGE1_REDESIGN_ID,
    encounter: data.stage1RedesignEncounter
  });
}

export function createStage2PlaceholderBattleState(
  data,
  {
    participantCode,
    sessionId,
    attemptNumber = 1,
    telemetryEvents = [],
    carriedGuardHP,
    isRetry = false,
    entrySnapshot = null
  }
) {
  return createValidationBattleState(data, {
    participantCode,
    sessionId,
    attemptNumber,
    telemetryEvents,
    carriedGuardHP,
    isRetry,
    entrySnapshot,
    stageNumber: 2,
    stageId: STAGE2_PLACEHOLDER_ID,
    encounter: data.stage2ValidationEncounter
  });
}

export function canEndStage1Turn(battleState) {
  if (!isStage1RedesignBattle(battleState)) {
    return { allowed: true, reason: null };
  }

  const reservations = getActiveWaveReservations(battleState);
  const occupiedReservation = reservations.find((reservation) => (
    battleState.playerUnits.some((unit) => (
      unit.currentHP > 0 &&
      unit.tileX === reservation.x &&
      unit.tileY === reservation.y
    ))
  ));

  return occupiedReservation
    ? {
        allowed: false,
        reason: `Cannot end preparation on incoming tile (${occupiedReservation.x},${occupiedReservation.y}).`
      }
    : { allowed: true, reason: null };
}

export function updateStage1AfterSwordDefeat(battleState, enemyId) {
  if (!isStage1RedesignBattle(battleState)) {
    return { battleState, event: null };
  }

  const defeated = battleState.enemyUnits.find((enemy) => (
    enemy.battleUnitId === enemyId && enemy.currentHP <= 0
  ));

  if (!defeated) {
    return { battleState, event: null };
  }

  let nextState = refreshWaveResolutionState(battleState);
  const isSword1 = defeated.spawnOrder === 1 && !nextState.stage1Redesign.wave1Cleared;

  if (isSword1) {
    nextState = {
      ...nextState,
      feedbackMessage:
        "WAVE 1 CLEARED — Reinforcement detected. End Turn to reveal landing zone.",
      stage1Redesign: {
        ...nextState.stage1Redesign,
        wave1Cleared: true,
        reinforcementPending: true,
        notice: "WAVE 1 CLEARED — Reinforcement detected. End Turn to reveal landing zone."
      }
    };
  }

  nextState = appendStage1TelemetryEvent(nextState, "sword_defeated", {
    actorId: defeated.battleUnitId,
    payload: {
      swordIndex: defeated.spawnOrder,
      guardHP: nextState.playerUnits[0]?.currentHP ?? 0,
      reinforcementPending: nextState.stage1Redesign.reinforcementPending
    }
  });

  return {
    battleState: nextState,
    event: {
      enemyId: defeated.battleUnitId,
      swordIndex: defeated.spawnOrder,
      reinforcementPending: nextState.stage1Redesign.reinforcementPending
    }
  };
}

export function beginStage1PreparationTurn(mapData, battleState) {
  if (
    !isStage1RedesignBattle(battleState) ||
    !battleState.stage1Redesign.reinforcementPending ||
    battleState.stage1Redesign.preparationActive
  ) {
    return battleState;
  }

  const waveId = battleState.waveState.waves.find((wave) => wave.required)?.waveId;
  if (!waveId) return battleState;

  let nextState = telegraphWave(
    battleState,
    waveId,
    { allowPlayerOccupation: true }
  );
  const playerUnits = nextState.playerUnits.map((unit) => ({
    ...unit,
    fortifyShield: 0,
    originTile: { x: unit.tileX, y: unit.tileY },
    startGrid: { x: unit.tileX, y: unit.tileY },
    movementApCommitted: false,
    movementLocked: false,
    turnState: unit.currentHP > 0 ? "ready" : "exhausted",
    hasActed: unit.currentHP <= 0
  }));
  const capacity = calculateTeamApCapacity(playerUnits);

  nextState = {
    ...nextState,
    phase: "player_phase",
    turnCount: nextState.turnCount + 1,
    teamApCurrent: capacity,
    teamApCapacity: capacity,
    selectedUnitId: playerUnits.find((unit) => unit.currentHP > 0)?.battleUnitId ?? null,
    battleControlState: "unit_selected_movement",
    playerUnits,
    feedbackMessage: "Sword 2 landing zone revealed. One complete preparation turn begins.",
    stage1Redesign: {
      ...nextState.stage1Redesign,
      preparationActive: true,
      notice: "SWORD 2 INCOMING at (10,8). Prepare, then End Turn."
    }
  };

  nextState = appendStage1TelemetryEvent(nextState, "wave_telegraph_shown", {
    payload: { tile: { x: 10, y: 8 }, preparationTurns: 1 }
  });

  return appendStage1TelemetryEvent(nextState, "turn_started", {
    payload: { teamAp: capacity, preparation: true }
  });
}

export function spawnStage1Reinforcement(enemyDefinitions, mapData, battleState) {
  if (!isStage1RedesignBattle(battleState) || !battleState.stage1Redesign.preparationActive) {
    return { battleState, spawnEvents: [] };
  }

  const result = spawnTelegraphedWaves(enemyDefinitions, mapData, battleState);
  let nextState = {
    ...result.battleState,
    feedbackMessage: "Sword 2 landed and immediately begins its activation.",
    stage1Redesign: {
      ...result.battleState.stage1Redesign,
      reinforcementPending: false,
      preparationActive: false,
      notice: "Sword 2 landed. Its normal activation begins immediately."
    }
  };

  for (const event of result.spawnEvents) {
    nextState = appendStage1TelemetryEvent(nextState, "enemy_activated", {
      actorId: event.spawnedEnemyId,
      payload: { activation: "landing", position: { x: event.x, y: event.y } }
    });
  }

  return { battleState: nextState, spawnEvents: result.spawnEvents };
}

function getKnockbackBlockedReason(mapData, battleState, enemy, destination) {
  if (
    destination.x < 0 || destination.y < 0 ||
    destination.x >= mapData.width || destination.y >= mapData.height
  ) return "edge";

  const tile = mapData.tiles?.[destination.y]?.[destination.x];
  if (tile === "X" || tile == null) return "void";
  if (BLOCKING_OBSTACLES.has(tile)) return "obstacle";

  const occupied = [...battleState.playerUnits, ...battleState.enemyUnits].some((unit) => (
    unit.currentHP > 0 &&
    unit.battleUnitId !== enemy.battleUnitId &&
    unit.tileX === destination.x &&
    unit.tileY === destination.y
  ));
  return occupied ? "occupied" : null;
}

export function resolveStage1Knockback(mapData, battleState, enemyId, guardId) {
  const enemy = battleState.enemyUnits.find((unit) => unit.battleUnitId === enemyId);
  const guard = battleState.playerUnits.find((unit) => unit.battleUnitId === guardId);
  if (!isStage1RedesignBattle(battleState) || !enemy || !guard) {
    return { battleState, event: null };
  }

  const dx = Math.sign(enemy.tileX - guard.tileX);
  const dy = Math.sign(enemy.tileY - guard.tileY);
  const requestedDestination = { x: enemy.tileX + dx, y: enemy.tileY + dy };
  const blockedReason = getKnockbackBlockedReason(mapData, battleState, enemy, requestedDestination);
  const moved = blockedReason === null;
  const nextEnemy = {
    ...enemy,
    tileX: moved ? requestedDestination.x : enemy.tileX,
    tileY: moved ? requestedDestination.y : enemy.tileY,
    currentIntent: null,
    stage1RecoveryState: "pending",
    turnState: "exhausted",
    hasActed: true
  };
  const event = {
    requestedDestination,
    resolvedDestination: { x: nextEnemy.tileX, y: nextEnemy.tileY },
    moved,
    blockedReason
  };

  let nextState = {
    ...battleState,
    enemyUnits: battleState.enemyUnits.map((unit) => (
      unit.battleUnitId === enemyId ? nextEnemy : unit
    )),
    feedbackMessage: moved
      ? `REPELLED — ${enemy.name} knocked back to (${nextEnemy.tileX},${nextEnemy.tileY}) and Stunned.`
      : `REPELLED — knockback blocked by ${blockedReason}; ${enemy.name} is still Stunned.`
  };
  nextState = appendStage1TelemetryEvent(nextState, "repelled_triggered", {
    actorId: guardId,
    targetId: enemyId,
    payload: { guardPosition: { x: guard.tileX, y: guard.tileY }, swordPosition: { x: enemy.tileX, y: enemy.tileY }, vector: { dx, dy } }
  });
  nextState = appendStage1TelemetryEvent(nextState, "knockback_resolved", {
    actorId: enemyId,
    targetId: guardId,
    payload: event
  });
  nextState = appendStage1TelemetryEvent(nextState, "stun_recovery", {
    actorId: enemyId,
    payload: { state: "applied" }
  });
  return { battleState: nextState, event };
}

export function resolveStage1RecoveryActivation(battleState, enemyId) {
  const enemy = battleState.enemyUnits.find((unit) => unit.battleUnitId === enemyId);
  if (!isStage1RedesignBattle(battleState) || enemy?.stage1RecoveryState !== "pending") {
    return { battleState, recovered: false, event: null };
  }

  let nextState = {
    ...battleState,
    enemyUnits: battleState.enemyUnits.map((unit) => unit.battleUnitId === enemyId
      ? {
          ...unit,
          stage1RecoveryState: null,
          currentIntent: null,
          turnState: "exhausted",
          hasActed: true
        }
      : unit),
    feedbackMessage: `${enemy.name} spends this activation Recovering. No movement or attack.`
  };
  nextState = appendStage1TelemetryEvent(nextState, "stun_recovery", {
    actorId: enemyId,
    payload: { state: "recovered", moved: false, attacked: false }
  });
  return {
    battleState: nextState,
    recovered: true,
    event: { enemyId, moved: false, attacked: false, reason: "stun_recovery" }
  };
}

export function settleStage1Reward(battleState) {
  if (
    !isStage1RedesignBattle(battleState) ||
    battleState.resultState !== "victory" ||
    battleState.stage1Redesign.rewardSettled
  ) {
    return battleState;
  }

  return {
    ...battleState,
    stage1Redesign: {
      ...battleState.stage1Redesign,
      rewardSettled: true,
      runCrystalAwarded: battleState.crystalReward ?? STAGE1_REWARD
    }
  };
}

export function createStage1RetryState(data, previousState) {
  const nextAttempt = (previousState.stage1Session?.attemptNumber ?? 1) + 1;
  const withRetryEvent = appendStage1TelemetryEvent(previousState, "retry_selected", {
    payload: {
      previousResult: previousState.resultState,
      nextAttempt
    }
  });

  return createStage1RedesignBattleState(data, {
    participantCode: previousState.stage1Session.participantCode,
    sessionId: previousState.stage1Session.sessionId,
    attemptNumber: nextAttempt,
    telemetryEvents: withRetryEvent.telemetryEvents,
    isRetry: true
  });
}

export function createStage2RetryState(data, previousState) {
  const nextAttempt = (previousState.stage1Session?.attemptNumber ?? 1) + 1;
  const withRetryEvent = appendStage1TelemetryEvent(previousState, "retry_selected", {
    payload: {
      previousResult: previousState.resultState,
      nextAttempt,
      retryStage: 2
    }
  });
  const entrySnapshot = previousState.validationEntrySnapshot;
  return createStage2PlaceholderBattleState(data, {
    participantCode: previousState.stage1Session.participantCode,
    sessionId: previousState.stage1Session.sessionId,
    attemptNumber: nextAttempt,
    telemetryEvents: withRetryEvent.telemetryEvents,
    carriedGuardHP: entrySnapshot?.entry_hp ?? previousState.playerUnits[0]?.stageStartHP,
    entrySnapshot,
    isRetry: true
  });
}
