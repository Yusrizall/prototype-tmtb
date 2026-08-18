import {
  applyUnitStatus
} from "./statusLogic.js";

const BLUE_ACTION_RULE = "blue_charge_shockwave";

function getEnemyById(battleState, enemyId) {
  return battleState?.enemyUnits?.find((enemy) => enemy.battleUnitId === enemyId) ?? null;
}

export function isBlueShockwaveEnemy(enemy) {
  return Boolean(enemy?.actionRule === BLUE_ACTION_RULE || enemy?.patternState?.patternId === BLUE_ACTION_RULE);
}

export function getBlueReadableState(enemy) {
  if (!isBlueShockwaveEnemy(enemy) || enemy.currentHP <= 0 || enemy.patternState?.active === false) {
    return { stateLabel: null, intentType: null, intentLabel: null };
  }

  const progress = enemy.patternState?.chargeProgress ?? 0;
  const goal = enemy.patternState?.chargeGoal ?? 2;

  if (progress >= goal) {
    return {
      stateLabel: `CHARGE ${goal}/${goal}`,
      intentType: "blue_shockwave",
      intentLabel: "SHOCKWAVE"
    };
  }

  const stateLabel = progress > 0 ? `CHARGE ${progress}/${goal}` : null;
  const nextCharge = Math.min(goal, progress + 1);
  return {
    stateLabel,
    intentType: "blue_charge",
    intentLabel: `CHARGE ${nextCharge}/${goal}`
  };
}

function tacticalDistance(first, second) {
  return Math.hypot(first.tileX - second.tileX, first.tileY - second.tileY);
}

export function getBlueShockwaveThreatTiles(mapData, battleState, enemyId) {
  const blue = getEnemyById(battleState, enemyId);
  const readable = getBlueReadableState(blue);
  if (!blue || readable.intentType !== "blue_shockwave") return [];

  const radius = blue.patternState?.shockwaveRadius ?? 2;
  const tiles = [];
  for (let y = 0; y < mapData.tiles.length; y += 1) {
    for (let x = 0; x < mapData.tiles[y].length; x += 1) {
      if (mapData.tiles[y][x] === "X") continue;
      if (Math.hypot(x - blue.tileX, y - blue.tileY) <= radius) {
        tiles.push({ x, y });
      }
    }
  }
  return tiles;
}

export function resolveBlueShockwaveActivation(mapData, battleState, enemyId) {
  const blue = getEnemyById(battleState, enemyId);
  if (!blue || !isBlueShockwaveEnemy(blue) || blue.currentHP <= 0 || blue.patternState?.active === false) {
    return { battleState, event: null };
  }

  const progress = blue.patternState?.chargeProgress ?? 0;
  const goal = blue.patternState?.chargeGoal ?? 2;

  if (progress < goal) {
    const nextProgress = progress + 1;
    const nextEnemyUnits = battleState.enemyUnits.map((enemy) => {
      if (enemy.battleUnitId !== enemyId) return enemy;
      return {
        ...enemy,
        patternState: {
          ...enemy.patternState,
          chargeProgress: nextProgress
        },
        turnState: "exhausted",
        hasActed: true
      };
    });
    return {
      battleState: { ...battleState, enemyUnits: nextEnemyUnits },
      event: {
        eventType: "blue_charge",
        enemyId,
        chargeProgress: nextProgress,
        chargeGoal: goal
      }
    };
  }

  const radius = blue.patternState?.shockwaveRadius ?? 2;
  const stunPlayerTurns = blue.patternState?.stunPlayerTurns ?? 2;
  const affectedUnitIds = (battleState.playerUnits ?? [])
    .filter((unit) => unit.currentHP > 0 && tacticalDistance(blue, unit) <= radius)
    .map((unit) => unit.battleUnitId);

  let nextState = battleState;
  affectedUnitIds.forEach((unitId) => {
    nextState = applyUnitStatus(nextState, unitId, {
      statusId: "stun",
      remainingPlayerTurns: stunPlayerTurns
    });
  });

  nextState = {
    ...nextState,
    enemyUnits: nextState.enemyUnits.map((enemy) => {
      if (enemy.battleUnitId !== enemyId) return enemy;
      return {
        ...enemy,
        patternState: {
          ...enemy.patternState,
          chargeProgress: 0
        },
        turnState: "exhausted",
        hasActed: true
      };
    })
  };

  return {
    battleState: nextState,
    event: {
      eventType: "blue_shockwave",
      enemyId,
      radius,
      stunPlayerTurns,
      finalDamage: 0,
      affectedUnitIds
    }
  };
}
