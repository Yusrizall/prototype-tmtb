import {
  getReachableTilesForUnit
} from "./movementLogic.js";

function getDistanceBetweenUnitAndTile(
  unit,
  tile
) {
  const deltaX = tile.x - unit.tileX;
  const deltaY = tile.y - unit.tileY;

  return Math.hypot(deltaX, deltaY);
}

function getLivingPlayerUnits(battleState) {
  return battleState.playerUnits.filter((unit) => {
    return unit.currentHP > 0;
  });
}

function chooseNearestPlayer(
  enemy,
  battleState
) {
  const livingPlayers =
    getLivingPlayerUnits(battleState);

  if (livingPlayers.length === 0) {
    return null;
  }

  return [...livingPlayers].sort((first, second) => {
    const firstDistance =
      getDistanceBetweenUnitAndTile(
        enemy,
        {
          x: first.tileX,
          y: first.tileY
        }
      );

    const secondDistance =
      getDistanceBetweenUnitAndTile(
        enemy,
        {
          x: second.tileX,
          y: second.tileY
        }
      );

    if (firstDistance !== secondDistance) {
      return firstDistance - secondDistance;
    }

    return first.battleUnitId.localeCompare(
      second.battleUnitId
    );
  })[0];
}

function chooseEnemyDestination(
  mapData,
  battleState,
  enemy,
  target
) {
  const currentDistance =
    getDistanceBetweenUnitAndTile(
      target,
      {
        x: enemy.tileX,
        y: enemy.tileY
      }
    );

  // Bila sudah berada dalam ATR,
  // enemy tidak perlu bergerak.
  if (
    currentDistance <=
    enemy.derivedStats.atr
  ) {
    return {
      x: enemy.tileX,
      y: enemy.tileY,
      distance: 0,
      targetDistance: currentDistance
    };
  }

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

  const rankedTiles =
    reachableTiles.map((tile) => {
      return {
        ...tile,

        targetDistance:
          getDistanceBetweenUnitAndTile(
            target,
            tile
          )
      };
    });

  rankedTiles.sort((first, second) => {
    if (
      first.targetDistance !==
      second.targetDistance
    ) {
      return (
        first.targetDistance -
        second.targetDistance
      );
    }

    if (first.distance !== second.distance) {
      return first.distance - second.distance;
    }

    if (first.y !== second.y) {
      return first.y - second.y;
    }

    return first.x - second.x;
  });

  return rankedTiles[0];
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
  battleState
) {
  let nextBattleState = battleState;

  const movementEvents = [];

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

    if (!currentEnemy) {
      return;
    }

    const target =
      chooseNearestPlayer(
        currentEnemy,
        nextBattleState
      );

    if (!target) {
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
      targetDistance:
        destination.targetDistance
    });
  });

  return {
    battleState: nextBattleState,
    movementEvents
  };
}