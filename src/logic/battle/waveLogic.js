import {
  createEnemyBattleUnitFromSpawn
} from "./battleSetup.js";

export const WAVE_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  TELEGRAPHED: "telegraphed",
  SPAWNED: "spawned",
  RESOLVED: "resolved"
});

export function getWaveSpawnPosition(mapData, spawnLabel) {
  for (let y = 0; y < mapData.tiles.length; y += 1) {
    for (let x = 0; x < mapData.tiles[y].length; x += 1) {
      if (mapData.tiles[y][x] === spawnLabel) {
        return { x, y };
      }
    }
  }

  throw new Error(`Wave spawn label tidak ditemukan di map: ${spawnLabel}`);
}

function getWaveById(battleState, waveId) {
  return battleState?.waveState?.waves?.find((wave) => wave.waveId === waveId) ?? null;
}

function isAliveUnitAtPosition(battleState, position) {
  return [
    ...(battleState?.playerUnits ?? []),
    ...(battleState?.enemyUnits ?? [])
  ].some((unit) => (
    unit.currentHP > 0 &&
    unit.tileX === position.x &&
    unit.tileY === position.y
  ));
}

function assertReservationAvailable(battleState, wave) {
  if (isAliveUnitAtPosition(battleState, wave.spawnPosition)) {
    throw new Error(
      `Wave reservation ${wave.waveId} tidak tersedia di ` +
      `${wave.spawnPosition.x},${wave.spawnPosition.y}.`
    );
  }
}

export function initializeWaveState(mapData, battleState, waveConfigs = []) {
  if (!Array.isArray(waveConfigs) || waveConfigs.length === 0) {
    return {
      ...battleState,
      waveState: { waves: [] }
    };
  }

  const waves = waveConfigs.map((config) => ({
    waveId: config.waveId,
    required: config.required !== false,
    unitId: config.unitId,
    battleUnitId: config.battleUnitId ?? null,
    spawnLabel: config.spawnLabel,
    spawnPosition: getWaveSpawnPosition(mapData, config.spawnLabel),
    telegraphLabel: config.telegraphLabel ?? config.unitId,
    statOverrides: config.statOverrides ? { ...config.statOverrides } : null,
    status: config.status ?? WAVE_STATUS.SCHEDULED,
    spawnedEnemyId: null,
    spawnOrder: null
  }));

  return {
    ...battleState,
    waveState: { waves }
  };
}

export function telegraphWave(battleState, waveId) {
  const wave = getWaveById(battleState, waveId);
  if (!wave) {
    throw new Error(`Wave tidak ditemukan: ${waveId}`);
  }

  if (wave.status !== WAVE_STATUS.SCHEDULED) {
    return battleState;
  }

  assertReservationAvailable(battleState, wave);

  return {
    ...battleState,
    waveState: {
      ...battleState.waveState,
      waves: battleState.waveState.waves.map((item) => (
        item.waveId === waveId
          ? { ...item, status: WAVE_STATUS.TELEGRAPHED }
          : item
      ))
    }
  };
}


export function isWaveSpawnPositionAvailable(battleState, x, y) {
  const position = { x, y };

  if (isAliveUnitAtPosition(battleState, position)) {
    return false;
  }

  return !getActiveWaveReservations(battleState).some((reservation) => (
    reservation.x === x && reservation.y === y
  ));
}

export function setScheduledWaveSpawn(mapData, battleState, waveId, spawnLabel) {
  const wave = getWaveById(battleState, waveId);
  if (!wave) {
    throw new Error(`Wave tidak ditemukan: ${waveId}`);
  }

  if (wave.status !== WAVE_STATUS.SCHEDULED) {
    throw new Error(`Wave ${waveId} tidak lagi SCHEDULED.`);
  }

  const spawnPosition = getWaveSpawnPosition(mapData, spawnLabel);
  if (!isWaveSpawnPositionAvailable(
    battleState,
    spawnPosition.x,
    spawnPosition.y
  )) {
    throw new Error(
      `Wave spawn ${waveId} tidak tersedia di ` +
      `${spawnPosition.x},${spawnPosition.y}.`
    );
  }

  return {
    ...battleState,
    waveState: {
      ...battleState.waveState,
      waves: battleState.waveState.waves.map((item) => (
        item.waveId === waveId
          ? {
              ...item,
              spawnLabel,
              spawnPosition
            }
          : item
      ))
    }
  };
}

export function getActiveWaveReservations(battleState) {
  return (battleState?.waveState?.waves ?? [])
    .filter((wave) => wave.status === WAVE_STATUS.TELEGRAPHED)
    .map((wave) => ({
      waveId: wave.waveId,
      x: wave.spawnPosition.x,
      y: wave.spawnPosition.y,
      label: wave.telegraphLabel
    }));
}

export function isWaveReservedFinalPosition(battleState, x, y) {
  return getActiveWaveReservations(battleState).some((reservation) => (
    reservation.x === x && reservation.y === y
  ));
}

export function spawnTelegraphedWaves(enemyDefinitions, mapData, battleState) {
  const telegraphed = (battleState?.waveState?.waves ?? [])
    .filter((wave) => wave.status === WAVE_STATUS.TELEGRAPHED);

  if (telegraphed.length === 0) {
    return {
      battleState,
      spawnEvents: []
    };
  }

  let nextState = battleState;
  const spawnEvents = [];

  for (const sourceWave of telegraphed) {
    const wave = getWaveById(nextState, sourceWave.waveId);
    assertReservationAvailable(nextState, wave);

    const nextSpawnOrder = Math.max(
      0,
      ...(nextState.enemyUnits ?? []).map((enemy) => enemy.spawnOrder ?? 0)
    ) + 1;

    const spawnData = {
      unitId: wave.unitId,
      spawnLabel: wave.spawnLabel,
      statOverrides: wave.statOverrides ?? undefined
    };

    const createdEnemy = createEnemyBattleUnitFromSpawn(
      enemyDefinitions,
      mapData,
      spawnData,
      nextSpawnOrder
    );

    const spawnedEnemy = {
      ...createdEnemy,
      battleUnitId: wave.battleUnitId ?? createdEnemy.battleUnitId
    };

    nextState = {
      ...nextState,
      enemyUnits: [...nextState.enemyUnits, spawnedEnemy],
      waveState: {
        ...nextState.waveState,
        waves: nextState.waveState.waves.map((item) => (
          item.waveId === wave.waveId
            ? {
                ...item,
                status: WAVE_STATUS.SPAWNED,
                spawnedEnemyId: spawnedEnemy.battleUnitId,
                spawnOrder: nextSpawnOrder
              }
            : item
        ))
      }
    };

    spawnEvents.push({
      eventType: "wave_spawn",
      waveId: wave.waveId,
      spawnedEnemyId: spawnedEnemy.battleUnitId,
      unitId: spawnedEnemy.unitDefId,
      spawnOrder: nextSpawnOrder,
      x: spawnedEnemy.tileX,
      y: spawnedEnemy.tileY
    });
  }

  return {
    battleState: nextState,
    spawnEvents
  };
}

export function refreshWaveResolutionState(battleState) {
  if (!battleState?.waveState?.waves) return battleState;

  let changed = false;
  const waves = battleState.waveState.waves.map((wave) => {
    if (wave.status !== WAVE_STATUS.SPAWNED || !wave.spawnedEnemyId) {
      return wave;
    }

    const spawnedEnemy = battleState.enemyUnits.find(
      (enemy) => enemy.battleUnitId === wave.spawnedEnemyId
    ) ?? null;

    if (!spawnedEnemy || spawnedEnemy.currentHP > 0) {
      return wave;
    }

    changed = true;
    return {
      ...wave,
      status: WAVE_STATUS.RESOLVED
    };
  });

  if (!changed) return battleState;

  return {
    ...battleState,
    waveState: {
      ...battleState.waveState,
      waves
    }
  };
}

export function hasPendingRequiredWave(battleState) {
  return (battleState?.waveState?.waves ?? []).some((wave) => (
    wave.required && wave.status !== WAVE_STATUS.RESOLVED
  ));
}

export function areRequiredWavesResolved(battleState) {
  const requiredWaves = (battleState?.waveState?.waves ?? [])
    .filter((wave) => wave.required);

  return requiredWaves.length > 0 && requiredWaves.every(
    (wave) => wave.status === WAVE_STATUS.RESOLVED
  );
}
