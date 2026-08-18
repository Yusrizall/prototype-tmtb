import {
  WAVE_STATUS,
  initializeWaveState,
  telegraphWave,
  refreshWaveResolutionState,
  areRequiredWavesResolved,
  getWaveSpawnPosition,
  isWaveSpawnPositionAvailable,
  setScheduledWaveSpawn
} from "../battle/waveLogic.js";

export const PHASE_8_ID = "phase_8_wave_graduation";
export const PHASE_8_FREE_PLAY_PROMPT = "Anticipate incoming enemies and eliminate all threats.";

function isTutorialBattle(battleState) {
  return battleState?.flowContext === "tutorial" && Boolean(battleState?.tutorialState);
}

function isPhase8Battle(battleState) {
  return isTutorialBattle(battleState) && battleState.tutorialState.phaseId === PHASE_8_ID;
}

function mergeEvidence(tutorialState, patch) {
  return {
    ...(tutorialState?.evidence ?? {}),
    ...patch
  };
}

function getWave(battleState, waveId) {
  return battleState?.waveState?.waves?.find((wave) => wave.waveId === waveId) ?? null;
}

function createFinalObjectiveState() {
  return {
    status: "active",
    objectiveType: "eliminate_all",
    targetType: null,
    targetId: null,
    label: "ELIMINATE ALL REMAINING THREATS"
  };
}

function getLivingPlayers(battleState) {
  return (battleState?.playerUnits ?? []).filter((unit) => unit.currentHP > 0);
}

function applySingleCasualtyFeedback(previousBattleState, nextBattleState) {
  const previousLiving = getLivingPlayers(previousBattleState);
  const nextLiving = getLivingPlayers(nextBattleState);
  const tutorialState = nextBattleState.tutorialState;

  if (
    previousLiving.length <= nextLiving.length ||
    nextLiving.length !== 1 ||
    tutorialState.evidence?.phase8SingleCasualtyExplained
  ) {
    return nextBattleState;
  }

  const nextLivingIds = new Set(nextLiving.map((unit) => unit.battleUnitId));
  const fallen = previousLiving.find((unit) => !nextLivingIds.has(unit.battleUnitId)) ?? null;
  const casualtyText = fallen
    ? `${fallen.name} has fallen. 1 unit remaining — Team AP: ${nextBattleState.teamApCapacity}.`
    : `1 unit remaining — Team AP: ${nextBattleState.teamApCapacity}.`;
  const prefix = nextBattleState.feedbackMessage
    ? `${nextBattleState.feedbackMessage} `
    : "";

  return {
    ...nextBattleState,
    feedbackMessage: `${prefix}${casualtyText}`,
    tutorialState: {
      ...tutorialState,
      evidence: mergeEvidence(tutorialState, {
        phase8SingleCasualtyExplained: true,
        phase8FallenUnitId: fallen?.battleUnitId ?? null
      })
    }
  };
}

function selectAndTelegraphWave3Pair(data, battleState) {
  const config = battleState?.tutorialState?.phase8Config ?? {};
  const wave3Ids = config.wave3Ids ?? [];
  const spawnPairs = data?.tutorialEncounter?.phase8Content?.wave3SpawnPairs ?? [];

  if (wave3Ids.length !== 2 || spawnPairs.length === 0) {
    throw new Error("Tutorial Phase 8 Wave 3 membutuhkan dua Sword dan authored fallback pairs.");
  }

  const selectedPair = spawnPairs.find((pair) => {
    if (!Array.isArray(pair) || pair.length !== 2 || pair[0] === pair[1]) {
      return false;
    }

    const first = getWaveSpawnPosition(data.tutorialMap, pair[0]);
    const second = getWaveSpawnPosition(data.tutorialMap, pair[1]);

    return (
      isWaveSpawnPositionAvailable(battleState, first.x, first.y) &&
      isWaveSpawnPositionAvailable(battleState, second.x, second.y)
    );
  }) ?? null;

  if (!selectedPair) {
    throw new Error("Tutorial Phase 8 tidak menemukan Wave 3 spawn pair yang tersedia.");
  }

  let nextState = battleState;
  nextState = setScheduledWaveSpawn(
    data.tutorialMap,
    nextState,
    wave3Ids[0],
    selectedPair[0]
  );
  nextState = telegraphWave(nextState, wave3Ids[0]);
  nextState = setScheduledWaveSpawn(
    data.tutorialMap,
    nextState,
    wave3Ids[1],
    selectedPair[1]
  );
  nextState = telegraphWave(nextState, wave3Ids[1]);

  return {
    ...nextState,
    tutorialState: {
      ...nextState.tutorialState,
      evidence: mergeEvidence(nextState.tutorialState, {
        phase8Wave3Telegraphed: true,
        phase8Wave3SelectedSpawnPair: [...selectedPair]
      })
    }
  };
}

export function initializeTutorialPhase8Content(data, battleState) {
  if (!isTutorialBattle(battleState)) return battleState;

  const content = data?.tutorialEncounter?.phase8Content;
  if (!content?.waves || content.waves.length < 4) {
    throw new Error("Tutorial Phase 8 membutuhkan W1, W2, dan dua authored Wave 3 Sword.");
  }

  let nextState = initializeWaveState(
    data.tutorialMap,
    battleState,
    content.waves
  );

  const firstWaveId = content.waves[0].waveId;
  nextState = telegraphWave(nextState, firstWaveId);

  return {
    ...nextState,
    objectiveState: {
      ...(nextState.objectiveState ?? {}),
      status: "dormant",
      objectiveType: null,
      targetType: null,
      targetId: null,
      label: "—"
    },
    tutorialState: {
      ...nextState.tutorialState,
      phaseId: PHASE_8_ID,
      taskId: "explain_wave_telegraph",
      prompt: "A Wave Telegraph shows where an enemy will enter the battlefield.",
      targetTile: null,
      status: "active",
      phase8Config: {
        wave1Id: content.waves[0].waveId,
        wave2Id: content.waves[1]?.waveId ?? null,
        wave3Ids: [
          content.waves[2]?.waveId ?? null,
          content.waves[3]?.waveId ?? null
        ].filter(Boolean)
      },
      evidence: mergeEvidence(nextState.tutorialState, {
        phase8Initialized: true,
        phase8Wave1Telegraphed: true,
        phase8Wave1Spawned: false,
        phase8Wave2Telegraphed: false,
        phase8Wave2Spawned: false,
        phase8Wave3Telegraphed: false,
        phase8Wave3Spawned: false,
        phase8GuidanceReleased: false,
        phase8SingleCasualtyExplained: false,
        phase8Complete: false
      })
    }
  };
}

export function isTutorialPhase8CheckpointReady(battleState) {
  return isPhase8Battle(battleState) && battleState.tutorialState.taskId === "explain_wave_telegraph";
}

export function advanceTutorialPhase8Brief(battleState) {
  if (!isPhase8Battle(battleState)) return battleState;
  const tutorialState = battleState.tutorialState;

  const transitions = {
    explain_wave_telegraph: {
      taskId: "explain_wave_reservation",
      prompt: "You can move through the marked area, but you cannot end your movement there."
    },
    explain_wave_reservation: {
      taskId: "explain_wave_preparation",
      prompt: "You have this Player Turn to prepare."
    },
    explain_wave_preparation: {
      taskId: "prepare_for_wave_1",
      prompt: "Prepare for the incoming Sword."
    }
  };

  const transition = transitions[tutorialState.taskId];
  if (!transition) return battleState;

  return {
    ...battleState,
    tutorialState: {
      ...tutorialState,
      ...transition
    }
  };
}

export function recordTutorialPhase8PlayerEndTurn(previousBattleState, nextBattleState) {
  if (!isPhase8Battle(previousBattleState)) return nextBattleState;
  const previousTask = previousBattleState.tutorialState.taskId;

  if (previousTask === "prepare_for_wave_1") {
    return {
      ...nextBattleState,
      tutorialState: {
        ...nextBattleState.tutorialState,
        taskId: "phase8_wave1_enemy_checkpoint",
        prompt: null
      }
    };
  }

  const wave2Id = previousBattleState.tutorialState.phase8Config?.wave2Id;
  const wave3Ids = previousBattleState.tutorialState.phase8Config?.wave3Ids ?? [];
  const wave2 = getWave(previousBattleState, wave2Id);
  const wave3 = wave3Ids.map((waveId) => getWave(previousBattleState, waveId));

  if (
    previousTask === "phase_8_free_play" &&
    wave3.length === 2 &&
    wave3.every((wave) => wave?.status === WAVE_STATUS.TELEGRAPHED)
  ) {
    return {
      ...nextBattleState,
      tutorialState: {
        ...nextBattleState.tutorialState,
        taskId: "phase8_wave3_enemy_checkpoint",
        prompt: PHASE_8_FREE_PLAY_PROMPT
      }
    };
  }

  if (previousTask === "phase_8_free_play" && wave2?.status === WAVE_STATUS.TELEGRAPHED) {
    return {
      ...nextBattleState,
      tutorialState: {
        ...nextBattleState.tutorialState,
        taskId: "phase8_wave2_enemy_checkpoint",
        prompt: PHASE_8_FREE_PLAY_PROMPT
      }
    };
  }

  return nextBattleState;
}

export function recordTutorialPhase8PlayerTurnStart(data, previousBattleState, nextBattleState) {
  if (!isPhase8Battle(nextBattleState)) return nextBattleState;

  const previousTask = previousBattleState?.tutorialState?.taskId;
  let state = nextBattleState;
  const tutorialState = state.tutorialState;
  const wave1Id = tutorialState.phase8Config?.wave1Id;
  const wave2Id = tutorialState.phase8Config?.wave2Id;
  const wave3Ids = tutorialState.phase8Config?.wave3Ids ?? [];

  if (previousTask === "phase8_wave1_enemy_checkpoint") {
    const wave1 = getWave(state, wave1Id);
    if (![WAVE_STATUS.SPAWNED, WAVE_STATUS.RESOLVED].includes(wave1?.status)) {
      throw new Error("Tutorial Phase 8 Wave 1 belum spawn pada Player Turn berikutnya.");
    }

    state = telegraphWave(state, wave2Id);
    state = {
      ...state,
      objectiveState: createFinalObjectiveState(),
      tutorialState: {
        ...state.tutorialState,
        taskId: "phase_8_free_play",
        prompt: PHASE_8_FREE_PLAY_PROMPT,
        evidence: mergeEvidence(state.tutorialState, {
          phase8Wave1Spawned: true,
          phase8Wave2Telegraphed: true,
          phase8GuidanceReleased: true
        })
      }
    };
  } else if (previousTask === "phase8_wave2_enemy_checkpoint") {
    const wave2 = getWave(state, wave2Id);
    if (![WAVE_STATUS.SPAWNED, WAVE_STATUS.RESOLVED].includes(wave2?.status)) {
      throw new Error("Tutorial Phase 8 Wave 2 belum spawn pada Player Turn berikutnya.");
    }

    state = selectAndTelegraphWave3Pair(data, state);
    state = {
      ...state,
      tutorialState: {
        ...state.tutorialState,
        taskId: "phase_8_free_play",
        prompt: PHASE_8_FREE_PLAY_PROMPT,
        evidence: mergeEvidence(state.tutorialState, {
          phase8Wave2Spawned: true
        })
      }
    };
  } else if (previousTask === "phase8_wave3_enemy_checkpoint") {
    const wave3 = wave3Ids.map((waveId) => getWave(state, waveId));
    if (
      wave3.length !== 2 ||
      !wave3.every((wave) => [WAVE_STATUS.SPAWNED, WAVE_STATUS.RESOLVED].includes(wave?.status))
    ) {
      throw new Error("Tutorial Phase 8 Wave 3 belum spawn lengkap pada Player Turn berikutnya.");
    }

    state = {
      ...state,
      tutorialState: {
        ...state.tutorialState,
        taskId: "phase_8_free_play",
        prompt: PHASE_8_FREE_PLAY_PROMPT,
        evidence: mergeEvidence(state.tutorialState, {
          phase8Wave3Spawned: true
        })
      }
    };
  }

  return applySingleCasualtyFeedback(previousBattleState, state);
}

export function refreshTutorialPhase8Completion(battleState) {
  if (!isPhase8Battle(battleState)) return battleState;

  let nextState = refreshWaveResolutionState(battleState);
  const noLivingEnemies = nextState.enemyUnits.every((enemy) => enemy.currentHP <= 0);
  const complete = areRequiredWavesResolved(nextState) && noLivingEnemies;

  if (!complete) return nextState;

  return {
    ...nextState,
    tutorialState: {
      ...nextState.tutorialState,
      status: "complete",
      evidence: mergeEvidence(nextState.tutorialState, {
        phase8Complete: true
      })
    }
  };
}

export function recordTutorialPhase8PlayerAttack(previousBattleState, nextBattleState) {
  if (!isPhase8Battle(nextBattleState)) return nextBattleState;
  return refreshTutorialPhase8Completion(nextBattleState);
}

export function isTutorialPhase8InputAllowed(battleState, inputType) {
  if (!isPhase8Battle(battleState)) return true;
  if (battleState.battleControlState === "battle_result") return true;

  const taskId = battleState.tutorialState.taskId;
  if ([
    "explain_wave_telegraph",
    "explain_wave_reservation",
    "explain_wave_preparation"
  ].includes(taskId)) {
    return false;
  }

  return true;
}

export function shouldPauseTutorialPhase8EnemyResolution() {
  return false;
}
