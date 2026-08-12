const DISTANCE_EPSILON = 0.0000001;

function getCombatDistance(
  enemy,
  playerUnit
) {
  const deltaX =
    playerUnit.tileX - enemy.tileX;

  const deltaY =
    playerUnit.tileY - enemy.tileY;

  return Math.hypot(
    deltaX,
    deltaY
  );
}

function getValidPlayerCandidates(
  battleState
) {
  return battleState.playerUnits.filter((unit) => {
    return unit.currentHP > 0;
  });
}

export function getEnemyCurrentTarget(
  enemy,
  battleState
) {
  if (
    !enemy ||
    !enemy.currentTargetId
  ) {
    return null;
  }

  return battleState.playerUnits.find((unit) => {
    return (
      unit.battleUnitId ===
        enemy.currentTargetId &&
      unit.currentHP > 0
    );
  }) ?? null;
}

export function resolveEnemyCurrentTarget(
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
      target: null,
      targetChanged: false
    };
  }

  const candidates =
    getValidPlayerCandidates(
      battleState
    );

  if (candidates.length === 0) {
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
          currentTargetId: null
        };
      });

    return {
      battleState: {
        ...battleState,
        enemyUnits: nextEnemyUnits
      },

      target: null,

      targetChanged:
        enemy.currentTargetId !== null
    };
  }

  const evaluatedCandidates =
    candidates.map((unit) => {
      return {
        unit,
        distance:
          getCombatDistance(
            enemy,
            unit
          )
      };
    });

  const minimumDistance =
    Math.min(
      ...evaluatedCandidates.map(
        (candidateData) => {
          return candidateData.distance;
        }
      )
    );

  const tiedCandidates =
    evaluatedCandidates.filter(
      (candidateData) => {
        return (
          Math.abs(
            candidateData.distance -
            minimumDistance
          ) <= DISTANCE_EPSILON
        );
      }
    );

  const preservedCurrentTarget =
    tiedCandidates.find(
      (candidateData) => {
        return (
          candidateData
            .unit
            .battleUnitId ===
          enemy.currentTargetId
        );
      }
    );

  const selectedTargetData =
    preservedCurrentTarget ??
    [...tiedCandidates].sort(
      (first, second) => {
        return (
          first
            .unit
            .battleUnitId
            .localeCompare(
              second
                .unit
                .battleUnitId
            )
        );
      }
    )[0];

  const selectedTarget =
    selectedTargetData.unit;

  const targetChanged =
    enemy.currentTargetId !==
    selectedTarget.battleUnitId;

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

        currentTargetId:
          selectedTarget.battleUnitId
      };
    });

  return {
    battleState: {
      ...battleState,
      enemyUnits: nextEnemyUnits
    },

    target:
      selectedTarget,

    targetChanged
  };
}