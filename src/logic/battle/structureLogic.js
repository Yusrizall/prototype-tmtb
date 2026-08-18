function findStructureDefinition(
  structureDefinitions,
  structureDefId
) {
  const definition =
    structureDefinitions?.structures?.find((structure) => {
      return structure.structureDefId === structureDefId;
    }) ?? null;

  if (!definition) {
    throw new Error(
      `Structure definition tidak ditemukan: ${structureDefId}`
    );
  }

  return definition;
}

export function createRectangularStructureFootprint(
  topLeft,
  width,
  height
) {
  if (
    !Number.isInteger(topLeft?.x) ||
    !Number.isInteger(topLeft?.y) ||
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error(
      "Structure footprint rectangle tidak valid."
    );
  }

  const footprint = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      footprint.push({
        x: topLeft.x + x,
        y: topLeft.y + y
      });
    }
  }

  return footprint;
}

export function createBattleStructure(
  structureDefinitions,
  placement
) {
  const definition = findStructureDefinition(
    structureDefinitions,
    placement?.structureDefId
  );

  const footprint = createRectangularStructureFootprint(
    placement.topLeft,
    placement.width,
    placement.height
  );

  return {
    battleStructureId: placement.battleStructureId,
    structureDefId: definition.structureDefId,
    name: definition.name,
    footprint,
    topLeft: {
      x: placement.topLeft.x,
      y: placement.topLeft.y
    },
    width: placement.width,
    height: placement.height,
    currentHP: definition.maxHP,
    maxHP: definition.maxHP,
    derivedStats: {
      def: definition.baseDEF
    },
    targetable: definition.targetable === true,
    occupiesTacticalSpace:
      definition.occupiesTacticalSpace === true
  };
}

export function findBattleStructureById(
  battleState,
  battleStructureId
) {
  return (
    battleState?.structures?.find((structure) => {
      return structure.battleStructureId === battleStructureId;
    }) ?? null
  );
}

export function isStructureTargetable(structure) {
  return Boolean(
    structure &&
    structure.targetable === true &&
    structure.currentHP > 0
  );
}

export function findBlockingStructureAtTile(
  battleState,
  x,
  y
) {
  return (
    battleState?.structures?.find((structure) => {
      if (structure.occupiesTacticalSpace !== true) {
        return false;
      }

      return structure.footprint?.some((tile) => {
        return tile.x === x && tile.y === y;
      });
    }) ?? null
  );
}

export function isStructureBlockingTile(
  battleState,
  x,
  y
) {
  return Boolean(
    findBlockingStructureAtTile(
      battleState,
      x,
      y
    )
  );
}
