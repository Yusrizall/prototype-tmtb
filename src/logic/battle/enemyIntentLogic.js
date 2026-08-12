import {
  getEnemyCurrentTarget
} from "./enemyTargetLogic.js";

export function getEnemyCurrentIntent(enemy) {
  if (!enemy) {
    return null;
  }

  return enemy.currentIntent ?? null;
}

export function resolveEnemyCurrentIntent(
  battleState,
  enemyId
) {
  const enemy =
    battleState.enemyUnits.find((unit) => {
      return (
        unit.battleUnitId ===
        enemyId
      );
    });

  if (
    !enemy ||
    enemy.currentHP <= 0
  ) {
    return {
      battleState,
      intent: null,
      intentChanged: false
    };
  }

  const target =
    getEnemyCurrentTarget(
      enemy,
      battleState
    );

  const nextIntent =
    target
      ? {
          intentType: "basic_attack",

          targetId:
            target.battleUnitId
        }
      : null;

  const previousIntent =
    enemy.currentIntent ?? null;

  const intentChanged =
    previousIntent?.intentType !==
      nextIntent?.intentType ||
    previousIntent?.targetId !==
      nextIntent?.targetId;

  const nextEnemyUnits =
    battleState.enemyUnits.map((unit) => {
      if (
        unit.battleUnitId !==
        enemyId
      ) {
        return unit;
      }

      return {
        ...unit,
        currentIntent: nextIntent
      };
    });

  return {
    battleState: {
      ...battleState,
      enemyUnits: nextEnemyUnits
    },

    intent: nextIntent,
    intentChanged
  };
}