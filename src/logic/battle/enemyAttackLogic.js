import {
  getValidBasicAttackTargetsForUnit
} from "./atrLogic.js";

import {
  resolveBasicAttackBetweenUnits
} from "./damageLogic.js";

function chooseEnemyAttackTarget(validTargets) {
  if (validTargets.length === 0) {
    return null;
  }

  return [...validTargets].sort((first, second) => {
    // Prioritas pertama: target paling dekat.
    if (first.distance !== second.distance) {
      return first.distance - second.distance;
    }

    // Jika jaraknya sama, pilih target dengan HP lebih rendah.
    if (
      first.unit.currentHP !==
      second.unit.currentHP
    ) {
      return (
        first.unit.currentHP -
        second.unit.currentHP
      );
    }

    // Tie-breaker agar hasil selalu konsisten.
    return first.unit.battleUnitId.localeCompare(
      second.unit.battleUnitId
    );
  })[0];
}

function exhaustEnemyWithoutAttack(
  battleState,
  enemyId
) {
  const nextEnemyUnits =
    battleState.enemyUnits.map((enemy) => {
      if (enemy.battleUnitId !== enemyId) {
        return enemy;
      }

      return {
        ...enemy,
        turnState: "exhausted",
        hasActed: true
      };
    });

  return {
    ...battleState,
    enemyUnits: nextEnemyUnits
  };
}

export function resolveEnemyAttackPhase(
  mapData,
  battleState
) {
  let nextBattleState = battleState;

  const attackEvents = [];

  const enemyOrder =
    battleState.enemyUnits
      .filter((enemy) => {
        return enemy.currentHP > 0;
      })
      .map((enemy) => {
        return enemy.battleUnitId;
      });

  enemyOrder.forEach((enemyId) => {
    const currentEnemy =
      nextBattleState.enemyUnits.find((enemy) => {
        return enemy.battleUnitId === enemyId;
      });

    if (
      !currentEnemy ||
      currentEnemy.currentHP <= 0
    ) {
      return;
    }

    const livingPlayers =
      nextBattleState.playerUnits.filter((unit) => {
        return unit.currentHP > 0;
      });

    if (livingPlayers.length === 0) {
      return;
    }

    const validTargets =
      getValidBasicAttackTargetsForUnit(
        mapData,
        currentEnemy,
        livingPlayers
      );

    const selectedTargetData =
      chooseEnemyAttackTarget(validTargets);

    if (!selectedTargetData) {
      nextBattleState =
        exhaustEnemyWithoutAttack(
          nextBattleState,
          currentEnemy.battleUnitId
        );

      attackEvents.push({
        attackerId:
          currentEnemy.battleUnitId,

        attackerName:
          currentEnemy.name,

        attacked: false,
        reason: "no_valid_target"
      });

      return;
    }

    const resolution =
      resolveBasicAttackBetweenUnits(
        nextBattleState,
        currentEnemy.battleUnitId,
        selectedTargetData.unit.battleUnitId,
        selectedTargetData.pathResult
      );

    if (!resolution.attackResult) {
      nextBattleState =
        exhaustEnemyWithoutAttack(
          nextBattleState,
          currentEnemy.battleUnitId
        );

      attackEvents.push({
        attackerId:
          currentEnemy.battleUnitId,

        attackerName:
          currentEnemy.name,

        attacked: false,
        reason: "attack_resolution_failed"
      });

      return;
    }

    nextBattleState =
      resolution.battleState;

    attackEvents.push({
      ...resolution.attackResult,

      attacked: true,

      distance:
        selectedTargetData.distance,

      pathOutcome:
        selectedTargetData.pathResult.outcome
    });
  });

  return {
    battleState: nextBattleState,
    attackEvents
  };
}