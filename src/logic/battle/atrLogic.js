import {
  evaluateAttackPath
} from "./pathLogic.js";

export function getTileDistance(
  fromUnit,
  toUnit
) {
  const deltaX =
    toUnit.tileX - fromUnit.tileX;

  const deltaY =
    toUnit.tileY - fromUnit.tileY;

  return Math.hypot(deltaX, deltaY);
}

export function getValidBasicAttackTargetsForUnit(
  mapData,
  attacker,
  candidateTargets
) {
  if (!attacker) return [];
  if (attacker.currentHP <= 0) return [];

  if (attacker.turnState === "exhausted") {
    return [];
  }

  return candidateTargets
    .filter((target) => {
      return (
        target.currentHP > 0 &&
        target.side !== attacker.side
      );
    })
    .map((target) => {
      const distance =
        getTileDistance(
          attacker,
          target
        );

      const pathResult =
        evaluateAttackPath(
          mapData,
          attacker,
          target
        );

      return {
        unit: target,
        distance,
        pathResult
      };
    })
    .filter((targetData) => {
      const isInsideAtr =
        targetData.distance <=
        attacker.derivedStats.atr;

      return (
        isInsideAtr &&
        targetData.pathResult.targetValid
      );
    });
}

export function getValidBasicAttackTargets(
  mapData,
  battleState
) {
  const attacker =
    battleState.playerUnits.find((unit) => {
      return (
        unit.battleUnitId ===
        battleState.selectedUnitId
      );
    });

  return getValidBasicAttackTargetsForUnit(
    mapData,
    attacker,
    battleState.enemyUnits
  );
}