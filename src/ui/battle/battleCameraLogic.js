import {
  getTacticalPositionState
} from "../../logic/battle/tacticalPositionLogic.js";

export const BATTLE_TILE_SIZE = 80;
export const BATTLE_TILE_GAP = 8;
export const BATTLE_TILE_PITCH =
  BATTLE_TILE_SIZE + BATTLE_TILE_GAP;

export const BATTLE_CAMERA_PADDING_PX = 24;

function getTutorialFocusRegionId(
  battleState
) {
  if (
    battleState?.flowContext !==
      "tutorial"
  ) {
    return null;
  }

  const phaseId =
    battleState
      ?.tutorialState
      ?.phaseId ?? "";

  const taskId =
    battleState
      ?.tutorialState
      ?.taskId ?? "";

  if (
    phaseId.startsWith("phase_6_") &&
    taskId === "proceed_to_region_c"
  ) {
    return "C";
  }

  if (phaseId.startsWith("phase_6_")) {
    return "B";
  }

  if (
    phaseId.startsWith("phase_7_") ||
    phaseId.startsWith("phase_8_")
  ) {
    return "C";
  }

  return "A";
}

export function getBattleCameraFocusKey(
  battleState
) {
  const tutorialRegionId =
    getTutorialFocusRegionId(
      battleState
    );

  if (tutorialRegionId) {
    return `tutorial:${tutorialRegionId}`;
  }

  return battleState?.stageId
    ? `stage:${battleState.stageId}`
    : "battle";
}

function addPosition(
  positions,
  x,
  y
) {
  if (
    Number.isInteger(x) &&
    Number.isInteger(y)
  ) {
    positions.push({ x, y });
  }
}

function collectActiveRegionPositions(
  mapData,
  battleState,
  regionId
) {
  const positions = [];

  for (
    let y = 0;
    y < mapData.height;
    y += 1
  ) {
    for (
      let x = 0;
      x < mapData.width;
      x += 1
    ) {
      if (
        regionId &&
        mapData.regionIds?.[y]?.[x] !==
          regionId
      ) {
        continue;
      }

      if (
        getTacticalPositionState(
          mapData,
          battleState,
          x,
          y
        ) !== "active"
      ) {
        continue;
      }

      addPosition(
        positions,
        x,
        y
      );
    }
  }

  return positions;
}

function collectLivingUnitPositions(
  battleState
) {
  if (!battleState) {
    return [];
  }

  const units = [
    ...battleState.playerUnits,
    ...battleState.enemyUnits
  ];

  return units
    .filter((unit) => {
      return unit.currentHP > 0;
    })
    .map((unit) => {
      return {
        x: unit.tileX,
        y: unit.tileY
      };
    });
}

function getBoundsFromPositions(
  positions
) {
  if (positions.length === 0) {
    return null;
  }

  const xValues = positions.map(
    (position) => position.x
  );
  const yValues = positions.map(
    (position) => position.y
  );

  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues)
  };
}

export function getBattleCameraActiveTileBounds(
  mapData,
  battleState
) {
  if (!mapData) {
    return null;
  }

  return getBoundsFromPositions(
    collectActiveRegionPositions(
      mapData,
      battleState,
      null
    )
  );
}

export function getBattleCameraTileBounds(
  mapData,
  battleState
) {
  if (!mapData) {
    return null;
  }

  const tutorialFocusRegionId =
    getTutorialFocusRegionId(
      battleState
    );

  let positions =
    collectActiveRegionPositions(
      mapData,
      battleState,
      tutorialFocusRegionId
    );

  if (positions.length === 0) {
    positions =
      collectActiveRegionPositions(
        mapData,
        battleState,
        null
      );
  }

  if (
    battleState?.flowContext ===
      "tutorial"
  ) {
    positions.push(
      ...collectLivingUnitPositions(
        battleState
      )
    );

    const targetTile =
      battleState
        ?.tutorialState
        ?.targetTile;

    if (targetTile) {
      addPosition(
        positions,
        targetTile.x,
        targetTile.y
      );
    }
  }

  return getBoundsFromPositions(
    positions
  );
}

export function getBattleCameraUnitTileBounds(
  unit
) {
  if (
    !unit ||
    !Number.isInteger(unit.tileX) ||
    !Number.isInteger(unit.tileY)
  ) {
    return null;
  }

  return {
    minX: unit.tileX,
    maxX: unit.tileX,
    minY: unit.tileY,
    maxY: unit.tileY
  };
}

function getTileBoundsPixelRect(
  tileBounds
) {
  if (!tileBounds) {
    return null;
  }

  const left =
    tileBounds.minX *
    BATTLE_TILE_PITCH;
  const top =
    tileBounds.minY *
    BATTLE_TILE_PITCH;

  const width =
    (tileBounds.maxX -
      tileBounds.minX) *
      BATTLE_TILE_PITCH +
    BATTLE_TILE_SIZE;

  const height =
    (tileBounds.maxY -
      tileBounds.minY) *
      BATTLE_TILE_PITCH +
    BATTLE_TILE_SIZE;

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height
  };
}

export function calculateCenteredBattleCameraTranslation({
  tileBounds,
  viewportWidth,
  viewportHeight
}) {
  if (
    !tileBounds ||
    viewportWidth <= 0 ||
    viewportHeight <= 0
  ) {
    return null;
  }

  const rect =
    getTileBoundsPixelRect(
      tileBounds
    );

  return {
    translateX:
      (viewportWidth - rect.width) /
        2 -
      rect.left,
    translateY:
      (viewportHeight - rect.height) /
        2 -
      rect.top
  };
}

function clampCameraAxis({
  requestedTranslation,
  contentStart,
  contentEnd,
  viewportSize,
  padding
}) {
  const contentSize =
    contentEnd - contentStart;
  const availableSize = Math.max(
    1,
    viewportSize - padding * 2
  );

  if (contentSize <= availableSize) {
    return (
      (viewportSize - contentSize) /
        2 -
      contentStart
    );
  }

  const minimumTranslation =
    viewportSize -
    padding -
    contentEnd;
  const maximumTranslation =
    padding - contentStart;

  return Math.min(
    maximumTranslation,
    Math.max(
      minimumTranslation,
      requestedTranslation
    )
  );
}

export function clampBattleCameraTranslation({
  translateX,
  translateY,
  tileBounds,
  viewportWidth,
  viewportHeight,
  padding = BATTLE_CAMERA_PADDING_PX
}) {
  if (
    !tileBounds ||
    viewportWidth <= 0 ||
    viewportHeight <= 0
  ) {
    return null;
  }

  const rect =
    getTileBoundsPixelRect(
      tileBounds
    );

  return {
    translateX: clampCameraAxis({
      requestedTranslation:
        translateX,
      contentStart: rect.left,
      contentEnd: rect.right,
      viewportSize: viewportWidth,
      padding
    }),
    translateY: clampCameraAxis({
      requestedTranslation:
        translateY,
      contentStart: rect.top,
      contentEnd: rect.bottom,
      viewportSize: viewportHeight,
      padding
    })
  };
}

export function panBattleCameraTranslation({
  currentTranslation,
  deltaX,
  deltaY,
  tileBounds,
  viewportWidth,
  viewportHeight,
  padding = BATTLE_CAMERA_PADDING_PX
}) {
  return clampBattleCameraTranslation({
    translateX:
      currentTranslation.translateX +
      deltaX,
    translateY:
      currentTranslation.translateY +
      deltaY,
    tileBounds,
    viewportWidth,
    viewportHeight,
    padding
  });
}

export function getBattleCameraDragUpdate({
  startClientX,
  startClientY,
  currentClientX,
  currentClientY,
  threshold = 6
}) {
  const deltaX =
    currentClientX - startClientX;
  const deltaY =
    currentClientY - startClientY;

  return {
    deltaX,
    deltaY,
    hasDragged:
      Math.hypot(deltaX, deltaY) >=
      threshold
  };
}
