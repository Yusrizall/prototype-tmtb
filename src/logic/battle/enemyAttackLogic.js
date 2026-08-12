import {
  getValidBasicAttackTargetsForUnit
} from "./atrLogic.js";

import {
  resolveBasicAttackBetweenUnits
} from "./damageLogic.js";

import {
  getEnemyCurrentTarget,
  resolveEnemyCurrentTarget
} from "./enemyTargetLogic.js";

import {
  getEnemyCurrentIntent,
  resolveEnemyCurrentIntent
} from "./enemyIntentLogic.js";


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
  battleState,
  enemyIds = null
) {
  let nextBattleState = battleState;

  const attackEvents = [];

  const enemyOrder =
    Array.isArray(enemyIds)
      ? enemyIds
      : battleState.enemyUnits
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

  let target =
      getEnemyCurrentTarget(
        currentEnemy,
        nextBattleState
      );

    if (!target) {
      const targetResolution =
        resolveEnemyCurrentTarget(
          nextBattleState,
          currentEnemy.battleUnitId
        );

      nextBattleState =
        targetResolution.battleState;

      target =
        targetResolution.target;
    }

    if (!target) {
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

        targetId: null,
        targetName: null,

        attacked: false,

        reason:
          "no_current_target"
      });

      return;
    }

    let refreshedEnemy =
      nextBattleState.enemyUnits.find((enemy) => {
        return (
          enemy.battleUnitId ===
          currentEnemy.battleUnitId
        );
      });

    let currentIntent =
      getEnemyCurrentIntent(
        refreshedEnemy
      );

    const intentMatchesTarget =
      currentIntent?.intentType ===
        "basic_attack" &&
      currentIntent?.targetId ===
        target.battleUnitId;

    if (!intentMatchesTarget) {
      const intentResolution =
        resolveEnemyCurrentIntent(
          nextBattleState,
          currentEnemy.battleUnitId
        );

      nextBattleState =
        intentResolution.battleState;

      currentIntent =
        intentResolution.intent;

      refreshedEnemy =
        nextBattleState.enemyUnits.find((enemy) => {
          return (
            enemy.battleUnitId ===
            currentEnemy.battleUnitId
          );
        });
    }

    if (
      !currentIntent ||
      currentIntent.intentType !==
        "basic_attack" ||
      currentIntent.targetId !==
        target.battleUnitId
    ) {
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

        targetId:
          target.battleUnitId,

        targetName:
          target.name,

        attacked: false,

        reason:
          "current_intent_unavailable"
      });

      return;
    }

    const validTargets =
      getValidBasicAttackTargetsForUnit(
        mapData,
        refreshedEnemy,
        [target]
      );

    const selectedTargetData =
      validTargets[0] ?? null;

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

        targetId:
          target.battleUnitId,

        targetName:
          target.name,

        attacked: false,

        reason:
          "current_target_action_unavailable"
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

    if (
      resolution
        .attackResult
        .targetDefeated
    ) {
      nextBattleState = {
        ...nextBattleState,

        enemyUnits:
          nextBattleState.enemyUnits.map(
            (enemy) => {
              if (
                enemy.battleUnitId !==
                currentEnemy.battleUnitId
              ) {
                return enemy;
              }

              return {
                ...enemy,
                currentTargetId: null,
currentIntent: null
              };
            }
          )
      };
    }

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