export function calculateBasicAttackDamage(
  attacker,
  target,
  pathResult
) {
  const coverPercentage =
    pathResult?.coverPercentage ?? 0;

  const attackAfterCover =
    attacker.derivedStats.atk *
    (1 - coverPercentage);

  const damageBeforeFloor =
    Math.max(
      0,
      attackAfterCover -
        target.derivedStats.def
    );

  const finalDamage =
    Math.floor(damageBeforeFloor);

  return {
    baseAttack:
      attacker.derivedStats.atk,

    coverPercentage,
    attackAfterCover,

    targetDefense:
      target.derivedStats.def,

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
      pathResult
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
        targetHPAfter <= 0
    }
  };
}

export function resolveBasicAttack(
  battleState,
  targetUnitId,
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

  return resolveBasicAttackBetweenUnits(
    battleState,
    attacker.battleUnitId,
    targetUnitId,
    pathResult
  );
}