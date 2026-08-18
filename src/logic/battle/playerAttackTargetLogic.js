import {
  evaluateBasicAttackSpatialCandidate,
  getBasicAttackCandidatesForUnit
} from "./atrLogic.js";

import {
  isStructureTargetable
} from "./structureLogic.js";

function getSelectedLivingPlayerAttacker(
  battleState
) {
  return (
    battleState?.playerUnits?.find((unit) => {
      return (
        unit.battleUnitId ===
          battleState.selectedUnitId &&
        unit.currentHP > 0
      );
    }) ?? null
  );
}

function compareSpatialCandidates(
  first,
  second
) {
  if (first.distance !== second.distance) {
    return first.distance - second.distance;
  }

  if (first.interactionTile.y !== second.interactionTile.y) {
    return first.interactionTile.y - second.interactionTile.y;
  }

  return first.interactionTile.x - second.interactionTile.x;
}

function createUnitAttackTargetDescriptor(
  targetData
) {
  return {
    targetType: "unit",
    targetId: targetData.unit.battleUnitId,
    entity: targetData.unit,
    interactionTile: {
      x: targetData.unit.tileX,
      y: targetData.unit.tileY
    },
    targetValid: targetData.targetValid,
    distance: targetData.distance,
    rangeValid: targetData.rangeValid,
    actionPathValid: targetData.actionPathValid,
    losValid: targetData.losValid,
    actionValid: targetData.actionValid,
    invalidReason: targetData.invalidReason,
    pathResult: targetData.pathResult
  };
}

function createStructureAttackTargetDescriptor(
  mapData,
  attacker,
  structure
) {
  const footprintCandidates =
    structure.footprint.map((tile) => {
      const targetPoint = {
        tileX: tile.x,
        tileY: tile.y
      };

      return {
        interactionTile: {
          x: tile.x,
          y: tile.y
        },
        ...evaluateBasicAttackSpatialCandidate(
          mapData,
          attacker,
          targetPoint
        )
      };
    });

  const validCandidates =
    footprintCandidates
      .filter((candidate) => {
        return candidate.actionValid;
      })
      .sort(compareSpatialCandidates);

  const orderedPhysicalCandidates =
    [...footprintCandidates]
      .sort(compareSpatialCandidates);

  const selectedSpatialCandidate =
    validCandidates[0] ??
    orderedPhysicalCandidates[0] ??
    null;

  if (!selectedSpatialCandidate) {
    return null;
  }

  return {
    targetType: "structure",
    targetId: structure.battleStructureId,
    entity: structure,
    targetValid: true,
    ...selectedSpatialCandidate,
    actionValid: validCandidates.length > 0
  };
}

export function getPlayerBasicAttackCandidates(
  mapData,
  battleState
) {
  const attacker =
    getSelectedLivingPlayerAttacker(
      battleState
    );

  if (!attacker) {
    return [];
  }

  const unitTargets =
    getBasicAttackCandidatesForUnit(
      mapData,
      attacker,
      battleState.enemyUnits ?? []
    ).map(createUnitAttackTargetDescriptor);

  const structureTargets =
    (battleState.structures ?? [])
      .filter(isStructureTargetable)
      .map((structure) => {
        return createStructureAttackTargetDescriptor(
          mapData,
          attacker,
          structure
        );
      })
      .filter(Boolean);

  return [
    ...unitTargets,
    ...structureTargets
  ];
}

export function getValidPlayerBasicAttackTargets(
  mapData,
  battleState
) {
  return getPlayerBasicAttackCandidates(
    mapData,
    battleState
  ).filter((targetData) => {
    return targetData.actionValid;
  });
}
