function isInsideMap(mapData, x, y) {
  return (
    x >= 0 &&
    y >= 0 &&
    x < mapData.width &&
    y < mapData.height
  );
}

function getTileCode(mapData, x, y) {
  return mapData.tiles[y]?.[x];
}

function isObstacleTile(tileCode) {
  return (
    tileCode === "O30" ||
    tileCode === "O70" ||
    tileCode === "OF"
  );
}

function getAllBattleUnits(battleState) {
  return [
    ...battleState.playerUnits,
    ...battleState.enemyUnits
  ];
}

function findOtherAliveUnitAtTile(
  battleState,
  x,
  y,
  movingUnitId
) {
  return getAllBattleUnits(battleState).find((unit) => {
    const isSameTile =
      unit.tileX === x &&
      unit.tileY === y;

    const isAlive = unit.currentHP > 0;

    const isOtherUnit =
      unit.battleUnitId !== movingUnitId;

    return (
      isSameTile &&
      isAlive &&
      isOtherUnit
    );
  });
}

function canTraverseTile(
  mapData,
  battleState,
  x,
  y,
  movingUnit
) {
  if (!isInsideMap(mapData, x, y)) {
    return false;
  }

  const tileCode = getTileCode(
    mapData,
    x,
    y
  );

  if (isObstacleTile(tileCode)) {
    return false;
  }

  const occupyingUnit =
    findOtherAliveUnitAtTile(
      battleState,
      x,
      y,
      movingUnit.battleUnitId
    );

  if (!occupyingUnit) {
    return true;
  }

  // Unit dengan side yang sama boleh dilewati.
  // Unit lawan memblokir jalur.
  return occupyingUnit.side === movingUnit.side;
}

function canEndMovementAtTile(
  mapData,
  battleState,
  x,
  y,
  movingUnit
) {
  if (!isInsideMap(mapData, x, y)) {
    return false;
  }

  const tileCode = getTileCode(
    mapData,
    x,
    y
  );

  if (isObstacleTile(tileCode)) {
    return false;
  }

  const occupyingUnit =
    findOtherAliveUnitAtTile(
      battleState,
      x,
      y,
      movingUnit.battleUnitId
    );

  // Tidak boleh berhenti di atas unit lain,
  // baik ally maupun lawan.
  return !occupyingUnit;
}

function getTileKey(x, y) {
  return `${x},${y}`;
}

export function getReachableTilesForUnit(
  mapData,
  battleState,
  movingUnit,
  originTile = movingUnit?.originTile,
  moveRange = movingUnit?.derivedStats?.move
) {
  if (!movingUnit) return [];
  if (movingUnit.currentHP <= 0) return [];
  if (!originTile) return [];
  if (!Number.isFinite(moveRange)) return [];

  const queue = [
    {
      x: originTile.x,
      y: originTile.y,
      distance: 0
    }
  ];

  const visitedDistance = new Map();

  visitedDistance.set(
    getTileKey(originTile.x, originTile.y),
    0
  );

  const reachableTiles = [];

  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];

  while (queue.length > 0) {
    const current = queue.shift();

    if (
      canEndMovementAtTile(
        mapData,
        battleState,
        current.x,
        current.y,
        movingUnit
      )
    ) {
      reachableTiles.push({
        x: current.x,
        y: current.y,
        distance: current.distance
      });
    }

    if (current.distance >= moveRange) {
      continue;
    }

    directions.forEach((direction) => {
      const nextX =
        current.x + direction.x;

      const nextY =
        current.y + direction.y;

      const nextDistance =
        current.distance + 1;

      const nextKey =
        getTileKey(nextX, nextY);

      if (
        !canTraverseTile(
          mapData,
          battleState,
          nextX,
          nextY,
          movingUnit
        )
      ) {
        return;
      }

      const previousDistance =
        visitedDistance.get(nextKey);

      if (
        previousDistance !== undefined &&
        previousDistance <= nextDistance
      ) {
        return;
      }

      visitedDistance.set(
        nextKey,
        nextDistance
      );

      queue.push({
        x: nextX,
        y: nextY,
        distance: nextDistance
      });
    });
  }

  return reachableTiles;
}

export function getSelectedPlayerUnit(
  battleState
) {
  return battleState.playerUnits.find((unit) => {
    return (
      unit.battleUnitId ===
      battleState.selectedUnitId
    );
  });
}

export function getMovementTiles(
  mapData,
  battleState
) {
  const selectedUnit =
    getSelectedPlayerUnit(battleState);

  if (!selectedUnit) return [];

  if (battleState.phase !== "player_phase") {
    return [];
  }

  if (selectedUnit.currentHP <= 0) {
  return [];
}

if (selectedUnit.movementLocked) {
  return [];
}

  const movementTiles =
  getReachableTilesForUnit(
    mapData,
    battleState,
    selectedUnit,
    selectedUnit.startGrid,
    selectedUnit.derivedStats.move
  );

const canSpendMovementAp =
  battleState.teamApCurrent > 0;

if (
  selectedUnit.movementApCommitted ||
  canSpendMovementAp
) {
  return movementTiles;
}

return movementTiles.filter((tile) => {
  return (
    tile.x === selectedUnit.startGrid.x &&
    tile.y === selectedUnit.startGrid.y
  );
});
}

export function isValidMovementTile(
  mapData,
  battleState,
  x,
  y
) {
  const movementTiles =
    getMovementTiles(
      mapData,
      battleState
    );

  return movementTiles.some((tile) => {
    return tile.x === x && tile.y === y;
  });
}

export function moveSelectedUnitToTile(
  mapData,
  battleState,
  x,
  y
) {
  const selectedUnit =
    getSelectedPlayerUnit(battleState);

  if (!selectedUnit) {
    return battleState;
  }

  const canMove =
    isValidMovementTile(
      mapData,
      battleState,
      x,
      y
    );

  if (!canMove) {
    return battleState;
  }

  const isDestinationStartGrid =
  x === selectedUnit.startGrid.x &&
  y === selectedUnit.startGrid.y;

const requiresMovementApCommit =
  !selectedUnit.movementApCommitted &&
  !isDestinationStartGrid;

const requiresMovementApRefund =
  selectedUnit.movementApCommitted &&
  isDestinationStartGrid &&
  !selectedUnit.movementLocked;

if (
  requiresMovementApCommit &&
  battleState.teamApCurrent <= 0
) {
  return {
    ...battleState,

    feedbackMessage:
      "Team AP tidak cukup untuk meninggalkan StartGrid."
  };
}

const nextTeamApCurrent =
  requiresMovementApCommit
    ? battleState.teamApCurrent - 1
    : requiresMovementApRefund
      ? Math.min(
          battleState.teamApCapacity,
          battleState.teamApCurrent + 1
        )
      : battleState.teamApCurrent;

const nextPlayerUnits =
  battleState.playerUnits.map((unit) => {
    if (
      unit.battleUnitId !==
      selectedUnit.battleUnitId
    ) {
      return unit;
    }

    return {
      ...unit,

      tileX: x,
      tileY: y,

      movementApCommitted:
        requiresMovementApRefund
          ? false
          : (
              unit.movementApCommitted ||
              requiresMovementApCommit
            ),

      turnState:
  isDestinationStartGrid
    ? "ready"
    : "positioned"
    };
  });

let nextFeedbackMessage =
  battleState.feedbackMessage;

if (requiresMovementApCommit) {
  nextFeedbackMessage =
    "Movement committed. " +
    `Team AP ${nextTeamApCurrent}/` +
    `${battleState.teamApCapacity}.`;
}

if (requiresMovementApRefund) {
  nextFeedbackMessage =
    "Returned to StartGrid. " +
    "Movement AP refunded. " +
    `Team AP ${nextTeamApCurrent}/` +
    `${battleState.teamApCapacity}.`;
}

return {
  ...battleState,

  teamApCurrent:
    nextTeamApCurrent,

  playerUnits:
    nextPlayerUnits,

  feedbackMessage:
    nextFeedbackMessage
};
}

export function selectNextPlayerUnit(
  battleState
) {
  const selectableUnits =
    battleState.playerUnits.filter((unit) => {
      return unit.currentHP > 0;
    });

  if (selectableUnits.length === 0) {
    return battleState;
  }

  const currentIndex =
    selectableUnits.findIndex((unit) => {
      return (
        unit.battleUnitId ===
        battleState.selectedUnitId
      );
    });

  const nextIndex =
    currentIndex === -1
      ? 0
      : (
          currentIndex + 1
        ) % selectableUnits.length;

  return {
    ...battleState,
    selectedUnitId:
      selectableUnits[nextIndex].battleUnitId
  };
}

export function moveSelectedUnitByDirection(
  mapData,
  battleState,
  direction
) {
  const selectedUnit =
    getSelectedPlayerUnit(battleState);

  if (!selectedUnit) {
    return battleState;
  }

  const directionOffset = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  const offset =
    directionOffset[direction];

  if (!offset) {
    return battleState;
  }

  const targetX =
    selectedUnit.tileX + offset.x;

  const targetY =
    selectedUnit.tileY + offset.y;

  return moveSelectedUnitToTile(
    mapData,
    battleState,
    targetX,
    targetY
  );
}