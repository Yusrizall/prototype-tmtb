import {
  getReachableTilesForUnit
} from "./movementLogic.js";

import {
  getEnemyCurrentTarget
} from "./enemyTargetLogic.js";

import {
  getBasicAttackCandidatesForUnit
} from "./atrLogic.js";

function getDistanceBetweenUnitAndTile(
  unit,
  tile
) {
  const deltaX = tile.x - unit.tileX;
  const deltaY = tile.y - unit.tileY;

  return Math.hypot(deltaX, deltaY);
}

function evaluateDestinationForTarget(
  mapData,
  enemy,
  target,
  tile
) {
  const positionedEnemy = {
    ...enemy,

    tileX: tile.x,
    tileY: tile.y
  };

  const attackCandidate =
    getBasicAttackCandidatesForUnit(
      mapData,
      positionedEnemy,
      [target]
    )[0] ?? null;

  const targetDistance =
    getDistanceBetweenUnitAndTile(
      target,
      tile
    );

  return {
    ...tile,

    targetDistance,

    actionValid:
      attackCandidate?.actionValid ??
      false,

    actionPathValid:
      attackCandidate?.actionPathValid ??
      false,

    losValid:
      attackCandidate?.losValid ??
      false,

    pathResult:
      attackCandidate?.pathResult ??
      null,

    spacingError:
      Math.abs(
        targetDistance -
        enemy.derivedStats.atr
      ),

    engagementGap:
      Math.max(
        0,
        targetDistance -
        enemy.derivedStats.atr
      )
  };
}

function compareDeterministicTiles(
  first,
  second
) {
  if (first.distance !== second.distance) {
    return first.distance - second.distance;
  }

  if (first.y !== second.y) {
    return first.y - second.y;
  }

  return first.x - second.x;
}

function chooseMeleeEngagementDestination(
  evaluatedTiles,
  enemy
) {
  const engagementTiles =
    evaluatedTiles
      .filter((tile) => {
        return tile.actionValid;
      })
      .sort((first, second) => {
        if (
          first.targetDistance !==
          second.targetDistance
        ) {
          return (
            first.targetDistance -
            second.targetDistance
          );
        }

        return compareDeterministicTiles(
          first,
          second
        );
      });

  if (engagementTiles.length > 0) {
    return {
      ...engagementTiles[0],

      movementMode:
        "valid_melee_engagement"
    };
  }

  const fallbackTiles =
    [...evaluatedTiles]
      .sort((first, second) => {
        if (
          first.actionPathValid !==
          second.actionPathValid
        ) {
          return first.actionPathValid
            ? -1
            : 1;
        }

        if (
          first.engagementGap !==
          second.engagementGap
        ) {
          return (
            first.engagementGap -
            second.engagementGap
          );
        }

        if (
          first.targetDistance !==
          second.targetDistance
        ) {
          return (
            first.targetDistance -
            second.targetDistance
          );
        }

        return compareDeterministicTiles(
          first,
          second
        );
      });

  const bestFallback =
    fallbackTiles[0];

  const currentTile =
    evaluatedTiles.find((tile) => {
      return (
        tile.x === enemy.tileX &&
        tile.y === enemy.tileY
      );
    });

  const fallbackIsUseful =
    !currentTile ||
    bestFallback.x !== currentTile.x ||
    bestFallback.y !== currentTile.y;

  if (!fallbackIsUseful) {
    return {
      ...bestFallback,

      movementMode: "stay"
    };
  }

  return {
    ...bestFallback,

    movementMode:
      "fallback_approach"
  };
}

function compareSpearEffectiveTiles(
  first,
  second
) {
  if (first.spacingError !== second.spacingError) {
    return first.spacingError - second.spacingError;
  }

  return compareDeterministicTiles(
    first,
    second
  );
}

function compareSpearFallbackTiles(
  first,
  second
) {
  if (
    first.actionPathValid !==
    second.actionPathValid
  ) {
    return first.actionPathValid
      ? -1
      : 1;
  }

  if (first.spacingError !== second.spacingError) {
    return first.spacingError - second.spacingError;
  }

  return compareDeterministicTiles(
    first,
    second
  );
}

function chooseMaxEffectiveAtrDestination(
  evaluatedTiles,
  enemy
) {
  const effectiveTiles =
    evaluatedTiles
      .filter((tile) => {
        return (
          tile.actionValid === true &&
          tile.pathResult?.damageBlocked !== true
        );
      })
      .sort(compareSpearEffectiveTiles);

  if (effectiveTiles.length > 0) {
    const best = effectiveTiles[0];
    const stayed =
      best.x === enemy.tileX &&
      best.y === enemy.tileY;

    return {
      ...best,
      movementMode:
        stayed
          ? "stay_at_preferred_atr"
          : "max_effective_atr_engagement"
    };
  }

  const fallbackTiles =
    [...evaluatedTiles]
      .sort(compareSpearFallbackTiles);

  const bestFallback = fallbackTiles[0];
  const currentTile =
    evaluatedTiles.find((tile) => {
      return (
        tile.x === enemy.tileX &&
        tile.y === enemy.tileY
      );
    }) ?? null;

  if (!bestFallback) {
    return null;
  }

  const meaningfullyImproves =
    !currentTile ||
    compareSpearFallbackTiles(
      bestFallback,
      currentTile
    ) < 0;

  if (!meaningfullyImproves) {
    return {
      ...(currentTile ?? bestFallback),
      movementMode: "stay"
    };
  }

  return {
    ...bestFallback,
    movementMode: "fallback_preferred_spacing"
  };
}

function chooseEnemyDestination(
  mapData,
  battleState,
  enemy,
  target
) {
  const reachableTiles =
    getReachableTilesForUnit(
      mapData,
      battleState,
      enemy,
      {
        x: enemy.tileX,
        y: enemy.tileY
      },
      enemy.derivedStats.move
    );

  if (reachableTiles.length === 0) {
    return null;
  }

  const evaluatedTiles =
    reachableTiles.map((tile) => {
      return evaluateDestinationForTarget(
        mapData,
        enemy,
        target,
        tile
      );
    });

  switch (
    enemy.movementRule ??
    "seek_melee_engagement"
  ) {
    case "seek_max_effective_atr":
      return chooseMaxEffectiveAtrDestination(
        evaluatedTiles,
        enemy
      );

    case "seek_melee_engagement":
    default:
      return chooseMeleeEngagementDestination(
        evaluatedTiles,
        enemy
      );
  }
}

function moveEnemyToTile(
  battleState,
  enemyId,
  destination
) {
  const nextEnemyUnits =
    battleState.enemyUnits.map((enemy) => {
      if (
        enemy.battleUnitId !== enemyId
      ) {
        return enemy;
      }

      return {
        ...enemy,

        tileX: destination.x,
        tileY: destination.y,

        turnState: "positioned",
        hasActed: false
      };
    });

  return {
    ...battleState,
    enemyUnits: nextEnemyUnits
  };
}

export function resolveEnemyMovementPhase(
  mapData,
  battleState,
  enemyIds = null
) {
  let nextBattleState = battleState;

  const movementEvents = [];

  const enemyOrder =
    Array.isArray(enemyIds)
      ? enemyIds
      : [...battleState.enemyUnits]
          .filter((enemy) => {
            return enemy.currentHP > 0;
          })
          .sort((first, second) => {
            return (
              first.spawnOrder -
              second.spawnOrder
            );
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

    const target =
      getEnemyCurrentTarget(
        currentEnemy,
        nextBattleState
      );

    if (!target) {
      movementEvents.push({
        enemyId:
          currentEnemy.battleUnitId,

        enemyName:
          currentEnemy.name,

        targetId: null,
        targetName: null,

        moved: false,

        reason:
          "no_current_target"
      });

      return;
    }

    const destination =
      chooseEnemyDestination(
        mapData,
        nextBattleState,
        currentEnemy,
        target
      );

    if (!destination) {
      movementEvents.push({
        enemyId: currentEnemy.battleUnitId,
        enemyName: currentEnemy.name,
        targetId: target.battleUnitId,
        targetName: target.name,
        moved: false,
        reason: "no_reachable_tile"
      });

      return;
    }

    const moved =
      destination.x !== currentEnemy.tileX ||
      destination.y !== currentEnemy.tileY;

    nextBattleState =
      moveEnemyToTile(
        nextBattleState,
        currentEnemy.battleUnitId,
        destination
      );

    movementEvents.push({
      enemyId: currentEnemy.battleUnitId,
      enemyName: currentEnemy.name,

      targetId: target.battleUnitId,
      targetName: target.name,

      from: {
        x: currentEnemy.tileX,
        y: currentEnemy.tileY
      },

      to: {
        x: destination.x,
        y: destination.y
      },

      moved,

      movementMode:
        destination.movementMode,

      targetDistance:
        destination.targetDistance,

      spacingError:
        destination.spacingError,

      pathOutcome:
        destination.pathResult?.outcome ??
        null
    });
  });

  return {
    battleState: nextBattleState,
    movementEvents
  };
}
