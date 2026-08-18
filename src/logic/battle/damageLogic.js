import {
  findBattleStructureById,
  isStructureTargetable
} from "./structureLogic.js";

export function calculateBasicAttackDamage(
  attacker,
  target,
  pathResult,
  options = {}
) {
  const coverPercentage =
    pathResult?.coverPercentage ?? 0;

  const attackAfterCover =
    attacker.derivedStats.atk *
    (1 - coverPercentage);

  const targetDefense =
    options.ignoreDefense === true
      ? 0
      : target.derivedStats.def;

  const damageBeforeFloor =
    Math.max(
      0,
      attackAfterCover -
        targetDefense
    );

  const finalDamage =
    Math.floor(damageBeforeFloor);

  return {
    baseAttack:
      attacker.derivedStats.atk,

    coverPercentage,
    attackAfterCover,

    targetDefense,

    finalDamage
  };
}

function getAllBattleUnits(battleState) {
  return [
    ...battleState.playerUnits,
    ...battleState.enemyUnits
  ];
}

function findBattleUnitById(
  battleState,
  unitId
) {
  return getAllBattleUnits(
    battleState
  ).find((unit) => {
    return unit.battleUnitId === unitId;
  });
}

function updateUnitCollection(
  units,
  attackerId,
  targetId,
  targetHPAfter
) {
  return units.map((unit) => {
    if (unit.battleUnitId === attackerId) {
      return {
        ...unit,
        turnState: "exhausted",
        hasActed: true
      };
    }

    if (unit.battleUnitId === targetId) {
      return {
        ...unit,
        currentHP: targetHPAfter
      };
    }

    return unit;
  });
}

function markAttackerActed(
  units,
  attackerId
) {
  return units.map((unit) => {
    if (unit.battleUnitId !== attackerId) {
      return unit;
    }

    return {
      ...unit,
      turnState: "exhausted",
      hasActed: true
    };
  });
}

export function resolveBasicAttackBetweenUnits(
  battleState,
  attackerUnitId,
  targetUnitId,
  pathResult
) {
  const attacker =
    findBattleUnitById(
      battleState,
      attackerUnitId
    );

  const target =
    findBattleUnitById(
      battleState,
      targetUnitId
    );

  if (!attacker || !target) {
    return {
      battleState,
      attackResult: null
    };
  }

  if (
    attacker.currentHP <= 0 ||
    target.currentHP <= 0 ||
    attacker.side === target.side
  ) {
    return {
      battleState,
      attackResult: null
    };
  }

  const damageData =
    calculateBasicAttackDamage(
      attacker,
      target,
      pathResult,
      {
        ignoreDefense:
          battleState.flowContext ===
          "tutorial"
      }
    );

  const targetHPAfter =
    Math.max(
      0,
      target.currentHP -
        damageData.finalDamage
    );

  const nextPlayerUnits =
    updateUnitCollection(
      battleState.playerUnits,
      attacker.battleUnitId,
      target.battleUnitId,
      targetHPAfter
    );

  const nextEnemyUnits =
    updateUnitCollection(
      battleState.enemyUnits,
      attacker.battleUnitId,
      target.battleUnitId,
      targetHPAfter
    );

  return {
    battleState: {
      ...battleState,
      playerUnits: nextPlayerUnits,
      enemyUnits: nextEnemyUnits
    },

    attackResult: {
      ...damageData,

      attackerId:
        attacker.battleUnitId,

      attackerName:
        attacker.name,

      attackerSide:
        attacker.side,

      targetType: "unit",

      targetId:
        target.battleUnitId,

      targetName:
        target.name,

      targetSide:
        target.side,

      targetHPBefore:
        target.currentHP,

      targetHPAfter,

      targetDefeated:
        targetHPAfter <= 0,

      targetDestroyed: false
    }
  };
}

export function resolveBasicAttackAgainstStructure(
  battleState,
  attackerUnitId,
  targetStructureId,
  pathResult
) {
  const attacker =
    findBattleUnitById(
      battleState,
      attackerUnitId
    );

  const target =
    findBattleStructureById(
      battleState,
      targetStructureId
    );

  if (
    !attacker ||
    attacker.currentHP <= 0 ||
    attacker.side !== "player" ||
    !isStructureTargetable(target)
  ) {
    return {
      battleState,
      attackResult: null
    };
  }

  const damageData =
    calculateBasicAttackDamage(
      attacker,
      target,
      pathResult,
      {
        ignoreDefense:
          battleState.flowContext ===
          "tutorial"
      }
    );

  const targetHPAfter =
    Math.max(
      0,
      target.currentHP -
        damageData.finalDamage
    );

  const nextPlayerUnits =
    markAttackerActed(
      battleState.playerUnits,
      attacker.battleUnitId
    );

  const nextEnemyUnits =
    markAttackerActed(
      battleState.enemyUnits,
      attacker.battleUnitId
    );

  const nextStructures =
    (battleState.structures ?? []).map((structure) => {
      if (
        structure.battleStructureId !==
          target.battleStructureId
      ) {
        return structure;
      }

      return {
        ...structure,
        currentHP: targetHPAfter
      };
    });

  return {
    battleState: {
      ...battleState,
      playerUnits: nextPlayerUnits,
      enemyUnits: nextEnemyUnits,
      structures: nextStructures
    },

    attackResult: {
      ...damageData,

      attackerId:
        attacker.battleUnitId,

      attackerName:
        attacker.name,

      attackerSide:
        attacker.side,

      targetType: "structure",

      targetId:
        target.battleStructureId,

      targetName:
        target.name,

      targetSide: "structure",

      targetHPBefore:
        target.currentHP,

      targetHPAfter,

      targetDefeated: false,

      targetDestroyed:
        targetHPAfter <= 0
    }
  };
}

export function resolveBasicAttack(
  battleState,
  targetType,
  targetId,
  pathResult
) {
  const attacker =
    battleState.playerUnits.find((unit) => {
      return (
        unit.battleUnitId ===
        battleState.selectedUnitId
      );
    });

  if (!attacker) {
    return {
      battleState,
      attackResult: null
    };
  }

  if (targetType === "structure") {
    return resolveBasicAttackAgainstStructure(
      battleState,
      attacker.battleUnitId,
      targetId,
      pathResult
    );
  }

  if (targetType !== "unit") {
    return {
      battleState,
      attackResult: null
    };
  }

  return resolveBasicAttackBetweenUnits(
    battleState,
    attacker.battleUnitId,
    targetId,
    pathResult
  );
}
