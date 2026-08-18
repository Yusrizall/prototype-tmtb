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

export function evaluateBasicAttackSpatialCandidate(
  mapData,
  attacker,
  targetPoint
) {
  const distance =
    getTileDistance(
      attacker,
      targetPoint
    );

  const pathResult =
    evaluateAttackPath(
      mapData,
      attacker,
      targetPoint
    );

  const rangeValid =
    distance <= attacker.derivedStats.atr;

  const actionPathValid =
    pathResult.actionPathValid;

  const losValid =
    pathResult.losValid;

  const actionValid =
    rangeValid &&
    actionPathValid &&
    losValid;

  let invalidReason = null;

  if (!rangeValid) {
    invalidReason = "outside_atr";
  } else if (!actionPathValid) {
    invalidReason = "path_blocked";
  } else if (!losValid) {
    invalidReason = "no_los";
  }

  return {
    distance,
    rangeValid,
    actionPathValid,
    losValid,
    actionValid,
    invalidReason,
    pathResult
  };
}

export function getBasicAttackCandidatesForUnit(
  mapData,
  attacker,
  candidateTargets
) {
  if (!attacker) return [];

  if (attacker.currentHP <= 0) {
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
      return {
        unit: target,
        targetValid: true,
        ...evaluateBasicAttackSpatialCandidate(
          mapData,
          attacker,
          target
        )
      };
    });
}

export function getValidBasicAttackTargetsForUnit(
  mapData,
  attacker,
  candidateTargets
) {
  return getBasicAttackCandidatesForUnit(
    mapData,
    attacker,
    candidateTargets
  ).filter((targetData) => {
    return targetData.actionValid;
  });
}

export function getBasicAttackCandidates(
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

  return getBasicAttackCandidatesForUnit(
    mapData,
    attacker,
    battleState.enemyUnits
  );
}

export function getValidBasicAttackTargets(
  mapData,
  battleState
) {
  return getBasicAttackCandidates(
    mapData,
    battleState
  ).filter((targetData) => {
    return targetData.actionValid;
  });
}
