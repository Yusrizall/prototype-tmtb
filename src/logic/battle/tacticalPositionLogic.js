function isInsideMap(
  mapData,
  x,
  y
) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    y >= 0 &&
    x < mapData.width &&
    y < mapData.height
  );
}

function getTileCode(
  mapData,
  x,
  y
) {
  return mapData.tiles?.[y]?.[x];
}

function getRegionId(
  mapData,
  x,
  y
) {
  return mapData.regionIds?.[y]?.[x] ?? null;
}

function hasRegionMetadata(mapData) {
  return Array.isArray(mapData?.regionIds);
}

function getKnownRegionIds(mapData) {
  if (!hasRegionMetadata(mapData)) {
    return new Set();
  }

  return new Set(
    mapData.regionIds
      .flat()
      .filter((regionId) => {
        return typeof regionId === "string";
      })
  );
}

export function getTacticalPositionState(
  mapData,
  battleState,
  x,
  y
) {
  if (
    !mapData ||
    !isInsideMap(
      mapData,
      x,
      y
    )
  ) {
    return "outside";
  }

  const tileCode = getTileCode(
    mapData,
    x,
    y
  );

  if (tileCode === "X") {
    return "void";
  }

  if (!hasRegionMetadata(mapData)) {
    return "active";
  }

  const regionId = getRegionId(
    mapData,
    x,
    y
  );

  if (!regionId) {
    return "void";
  }

  if (
    battleState?.flowContext !==
      "tutorial"
  ) {
    return "active";
  }

  const activeRegionIds =
    battleState
      ?.tutorialState
      ?.activeRegionIds;

  if (!Array.isArray(activeRegionIds)) {
    return "locked";
  }

  return activeRegionIds.includes(regionId)
    ? "active"
    : "locked";
}

export function isTacticalPositionActive(
  mapData,
  battleState,
  x,
  y
) {
  return (
    getTacticalPositionState(
      mapData,
      battleState,
      x,
      y
    ) === "active"
  );
}

export function assertTutorialBattlefieldState(
  mapData,
  battleState
) {
  if (
    battleState?.flowContext !==
      "tutorial"
  ) {
    return true;
  }

  if (!hasRegionMetadata(mapData)) {
    throw new Error(
      "Tutorial map tidak memiliki regionIds."
    );
  }

  const activeRegionIds =
    battleState
      ?.tutorialState
      ?.activeRegionIds;

  if (!Array.isArray(activeRegionIds)) {
    throw new Error(
      "Tutorial state tidak memiliki activeRegionIds yang valid."
    );
  }

  const knownRegionIds =
    getKnownRegionIds(mapData);

  activeRegionIds.forEach((regionId) => {
    if (!knownRegionIds.has(regionId)) {
      throw new Error(
        `Tutorial region aktif tidak ditemukan di map: ${regionId}`
      );
    }
  });

  const livingUnits = [
    ...battleState.playerUnits,
    ...battleState.enemyUnits
  ].filter((unit) => {
    return unit.currentHP > 0;
  });

  livingUnits.forEach((unit) => {
    if (
      !isTacticalPositionActive(
        mapData,
        battleState,
        unit.tileX,
        unit.tileY
      )
    ) {
      throw new Error(
        `Living unit berada di tactical position inactive: ` +
        `${unit.battleUnitId} @ ${unit.tileX},${unit.tileY}`
      );
    }
  });

  const structures =
    Array.isArray(battleState.structures)
      ? battleState.structures
      : [];

  structures.forEach((structure) => {
    structure.footprint?.forEach((tile) => {
      if (
        !isTacticalPositionActive(
          mapData,
          battleState,
          tile.x,
          tile.y
        )
      ) {
        throw new Error(
          `Structure berada di tactical position inactive: ` +
          `${structure.battleStructureId ?? structure.name} @ ` +
          `${tile.x},${tile.y}`
        );
      }
    });
  });

  return true;
}
