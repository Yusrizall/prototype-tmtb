const MAX_SUPPORTED_UPGRADE_LEVEL = 4;

const PERMANENT_UPGRADE_EFFECTS = {
  maxHPPerLevel: 2,
  atkPerLevel: 1,
  defPerLevel: 1
};

function findSpawnPosition(
  mapData,
  spawnLabel
) {
  for (
    let y = 0;
    y < mapData.tiles.length;
    y += 1
  ) {
    const row = mapData.tiles[y];

    for (
      let x = 0;
      x < row.length;
      x += 1
    ) {
      if (row[x] === spawnLabel) {
        return { x, y };
      }
    }
  }

  throw new Error(
    `Spawn label tidak ditemukan di map: ${spawnLabel}`
  );
}

function findUnitDefinition(
  unitCollection,
  unitId
) {
  const unitDefinition =
    unitCollection.units.find(
      (unit) => {
        return unit.unitId === unitId;
      }
    );

  if (!unitDefinition) {
    throw new Error(
      `Unit definition tidak ditemukan: ${unitId}`
    );
  }

  return unitDefinition;
}

function getSafeUpgradeLevel(value) {
  const numericValue =
    Number(value);

  if (
    !Number.isInteger(numericValue) ||
    numericValue < 0
  ) {
    return 0;
  }

  return Math.min(
    numericValue,
    MAX_SUPPORTED_UPGRADE_LEVEL
  );
}

function createDerivedStats(
  unitDefinition,
  permanentUpgradeLevels = null
) {
  const maxHPUpgradeLevel =
    getSafeUpgradeLevel(
      permanentUpgradeLevels?.maxHP
    );

  const atkUpgradeLevel =
    getSafeUpgradeLevel(
      permanentUpgradeLevels?.atk
    );

  const defUpgradeLevel =
    getSafeUpgradeLevel(
      permanentUpgradeLevels?.def
    );

  return {
    maxHP:
      unitDefinition.maxHP +
      (
        maxHPUpgradeLevel *
        PERMANENT_UPGRADE_EFFECTS
          .maxHPPerLevel
      ),

    atk:
      unitDefinition.baseATK +
      (
        atkUpgradeLevel *
        PERMANENT_UPGRADE_EFFECTS
          .atkPerLevel
      ),

    def:
      unitDefinition.baseDEF +
      (
        defUpgradeLevel *
        PERMANENT_UPGRADE_EFFECTS
          .defPerLevel
      ),

    move:
      unitDefinition.move,

    atr:
      unitDefinition.atr
  };
}

function createBattleUnit(
  unitDefinition,
  spawnLabel,
  position,
  index,
  permanentUpgradeLevels = null
) {
  const derivedStats =
    createDerivedStats(
      unitDefinition,
      permanentUpgradeLevels
    );

  return {
    battleUnitId:
      `${unitDefinition.side}_` +
      `${unitDefinition.unitId}_` +
      `${index + 1}`,

    unitDefId:
      unitDefinition.unitId,

    name:
      unitDefinition.name,

    side:
      unitDefinition.side,

    role:
      unitDefinition.role,

    tileX:
      position.x,

    tileY:
      position.y,

    originTile: {
      x: position.x,
      y: position.y
    },

    currentHP:
      derivedStats.maxHP,

    maxHP:
      derivedStats.maxHP,

    turnState: "ready",
    hasActed: false,

    derivedStats,

    attackType:
      unitDefinition.attackType,

    targetPattern:
      unitDefinition.targetPattern,

    targetCategory:
      unitDefinition.targetCategory,

    usesProjectile:
      unitDefinition.usesProjectile,

    requiresPathCheck:
      unitDefinition.requiresPathCheck,

    spawnLabel
  };
}

function createPlayerBattleUnits(
  data,
  permanentUpgrades = null
) {
  return data
    .stage1Encounter
    .playerSpawns
    .map((spawnData, index) => {
      const unitDefinition =
        findUnitDefinition(
          data.playerUnits,
          spawnData.unitId
        );

      const position =
        findSpawnPosition(
          data.stage1Map,
          spawnData.spawnLabel
        );

      const unitPermanentUpgrades =
        permanentUpgrades
          ?.[unitDefinition.unitId] ??
        null;

      const battleUnit =
  createBattleUnit(
    unitDefinition,
    spawnData.spawnLabel,
    position,
    index,
    unitPermanentUpgrades
  );

return {
  ...battleUnit,

  startGrid: {
    x: position.x,
    y: position.y
  },

movementApCommitted: false,
movementLocked: false
};
    });
}

function createEnemyBattleUnits(data) {
  return data
    .stage1Encounter
    .enemySpawns
    .map((spawnData, index) => {
      const unitDefinition =
        findUnitDefinition(
          data.enemyUnits,
          spawnData.unitId
        );

      const position =
        findSpawnPosition(
          data.stage1Map,
          spawnData.spawnLabel
        );

      const battleUnit =
        createBattleUnit(
          unitDefinition,
          spawnData.spawnLabel,
          position,
          index
        );

      return {
  ...battleUnit,

  spawnOrder: index + 1,

  currentTargetId: null,
  currentIntent: null
};
    });
}

export function calculateTeamApCapacity(
  playerUnits
) {
  const livingPlayerUnitCount =
    playerUnits.filter((unit) => {
      return unit.currentHP > 0;
    }).length;

  return livingPlayerUnitCount * 2;
}

export function createInitialBattleState(
  data,
  permanentUpgrades = null
) {
  const playerUnits =
    createPlayerBattleUnits(
      data,
      permanentUpgrades
    );

  const enemyUnits =
    createEnemyBattleUnits(data);

    const teamApCapacity =
  calculateTeamApCapacity(
    playerUnits
  );

  return {
    encounterId:
      data.stage1Encounter.encounterId,

    encounterName:
      data.stage1Encounter.name,

    mapId:
      data.stage1Encounter.mapId,

    objectiveType:
      data.stage1Encounter.objectiveType,

    phase: "player_phase",
    turnCount: 1,

    teamApCurrent:
  teamApCapacity,

teamApCapacity,

    selectedUnitId:
      playerUnits[0]?.battleUnitId ??
      null,

    battleControlState:
      "unit_selected_movement",

    actionMenuIndex: 0,
    selectedAction: null,

    playerUnits,
    enemyUnits,

    resultState: "ongoing"
  };
}