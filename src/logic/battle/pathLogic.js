const OBSTACLE_DEFINITIONS = {
  O30: {
    coverType: "partial_cover",
    coverPercentage: 0.3
  },
  O70: {
    coverType: "partial_cover",
    coverPercentage: 0.7
  },
  OF: {
    coverType: "full_cover",
    coverPercentage: 1
  }
};

const LOS_BLOCKER_TILE_CODE = "LOS";

const EPSILON = 0.0000001;

function getUnitCenter(unit) {
  return {
    x: unit.tileX + 0.5,
    y: unit.tileY + 0.5
  };
}

function getAxisInteriorInterval(
  start,
  delta,
  minimum,
  maximum
) {
  if (Math.abs(delta) < EPSILON) {
    const isStrictlyInside =
      start > minimum + EPSILON &&
      start < maximum - EPSILON;

    return isStrictlyInside
      ? {
          start: -Infinity,
          end: Infinity
        }
      : null;
  }

  const firstTime = (minimum - start) / delta;
  const secondTime = (maximum - start) / delta;

  return {
    start: Math.min(firstTime, secondTime),
    end: Math.max(firstTime, secondTime)
  };
}

function segmentCrossesTileInterior(
  start,
  end,
  tileX,
  tileY
) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  const xInterval = getAxisInteriorInterval(
    start.x,
    deltaX,
    tileX,
    tileX + 1
  );

  const yInterval = getAxisInteriorInterval(
    start.y,
    deltaY,
    tileY,
    tileY + 1
  );

  if (!xInterval || !yInterval) {
    return false;
  }

  const enterTime = Math.max(
    xInterval.start,
    yInterval.start,
    0
  );

  const exitTime = Math.min(
    xInterval.end,
    yInterval.end,
    1
  );

  // Harus benar-benar melewati interior.
  // Menyentuh tepi atau sudut saja tidak dihitung.
  return (
    enterTime + EPSILON < exitTime &&
    exitTime > EPSILON &&
    enterTime < 1 - EPSILON
  );
}

function getCrossedObstacles(
  mapData,
  attacker,
  target
) {
  const start = getUnitCenter(attacker);
  const end = getUnitCenter(target);
  const crossedObstacles = [];

  mapData.tiles.forEach((row, y) => {
    row.forEach((tileCode, x) => {
      const obstacleDefinition =
        OBSTACLE_DEFINITIONS[tileCode];

      if (!obstacleDefinition) {
        return;
      }

      const crossesInterior =
        segmentCrossesTileInterior(
          start,
          end,
          x,
          y
        );

      if (!crossesInterior) {
        return;
      }

      crossedObstacles.push({
        x,
        y,
        tileCode,
        ...obstacleDefinition
      });
    });
  });

  return crossedObstacles;
}

function getCrossedLosBlockers(
  mapData,
  attacker,
  target
) {
  const start = getUnitCenter(attacker);
  const end = getUnitCenter(target);
  const crossedLosBlockers = [];

  mapData.tiles.forEach((row, y) => {
    row.forEach((tileCode, x) => {
      if (
        tileCode !==
        LOS_BLOCKER_TILE_CODE
      ) {
        return;
      }

      const crossesInterior =
        segmentCrossesTileInterior(
          start,
          end,
          x,
          y
        );

      if (!crossesInterior) {
        return;
      }

      crossedLosBlockers.push({
        x,
        y,
        tileCode
      });
    });
  });

  return crossedLosBlockers;
}

export function evaluateAttackPath(
  mapData,
  attacker,
  target
) {
  const crossedObstacles =
    getCrossedObstacles(
      mapData,
      attacker,
      target
    );

  const crossedLosBlockers =
    getCrossedLosBlockers(
      mapData,
      attacker,
      target
    );

  const strongestObstacle =
    crossedObstacles.length > 0
      ? crossedObstacles.reduce(
          (strongest, obstacle) => {
            return (
              obstacle.coverPercentage >
              strongest.coverPercentage
            )
              ? obstacle
              : strongest;
          }
        )
      : null;

  const coverPercentage =
    strongestObstacle
      ?.coverPercentage ?? 0;

  const isFullCover =
    coverPercentage >= 1;

  const hasSolidPathObstacle =
    crossedObstacles.length > 0 ||
    crossedLosBlockers.length > 0;

  if (
    attacker.attackType === "melee" &&
    hasSolidPathObstacle
  ) {
    return {
      outcome: "melee_blocked",

      coverPercentage,

      actionPathValid: false,

      losValid: true,

      damageBlocked: true,

      strongestObstacle,

      crossedObstacles,

      crossedLosBlockers
    };
  }

  const losValid =
    attacker.attackType !== "ranged" ||
    crossedLosBlockers.length === 0;

  if (!losValid) {
    return {
      outcome: "no_los",

      coverPercentage,

      actionPathValid: true,

      losValid: false,

      damageBlocked:
        isFullCover,

      strongestObstacle,

      crossedObstacles,

      crossedLosBlockers
    };
  }

  if (!strongestObstacle) {
    return {
      outcome: "clear",

      coverPercentage: 0,

      actionPathValid: true,

      losValid: true,

      damageBlocked: false,

      strongestObstacle: null,

      crossedObstacles,

      crossedLosBlockers
    };
  }

  return {
    outcome:
      isFullCover
        ? "full_cover"
        : "partial_cover",

    coverPercentage,

    actionPathValid: true,

    losValid: true,

    damageBlocked:
      isFullCover,

    strongestObstacle,

    crossedObstacles,

    crossedLosBlockers
  };
}