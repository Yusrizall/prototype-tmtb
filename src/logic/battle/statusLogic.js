function normalizeStatuses(unit) {
  return Array.isArray(unit?.statuses) ? unit.statuses : [];
}

export function getUnitStatus(unit, statusId) {
  return normalizeStatuses(unit).find((status) => status.statusId === statusId) ?? null;
}

export function hasUnitStatus(unit, statusId) {
  return Boolean(getUnitStatus(unit, statusId));
}

export function isUnitStunned(unit) {
  const status = getUnitStatus(unit, "stun");
  return Boolean(status && status.remainingPlayerTurns > 0);
}

export function canPlayerUnitMove(unit) {
  return Boolean(unit && unit.currentHP > 0 && !isUnitStunned(unit));
}

export function canPlayerUnitAttack(unit) {
  return Boolean(unit && unit.currentHP > 0 && !isUnitStunned(unit));
}

export function canPlayerUnitSkill(unit) {
  return Boolean(unit && unit.currentHP > 0 && !isUnitStunned(unit));
}

export function canPlayerUnitHold(unit) {
  return Boolean(unit && unit.currentHP > 0 && !isUnitStunned(unit));
}

export function applyUnitStatus(battleState, unitId, statusData) {
  if (!battleState || !unitId || !statusData?.statusId) {
    return battleState;
  }

  const remainingPlayerTurns = Number(statusData.remainingPlayerTurns);
  if (!Number.isFinite(remainingPlayerTurns) || remainingPlayerTurns <= 0) {
    return battleState;
  }

  return {
    ...battleState,
    playerUnits: (battleState.playerUnits ?? []).map((unit) => {
      if (unit.battleUnitId !== unitId) return unit;
      const statuses = normalizeStatuses(unit).filter((status) => status.statusId !== statusData.statusId);
      return {
        ...unit,
        statuses: [
          ...statuses,
          {
            statusId: statusData.statusId,
            remainingPlayerTurns
          }
        ]
      };
    })
  };
}

export function tickPlayerTurnStatuses(battleState) {
  if (!battleState) return battleState;
  return {
    ...battleState,
    playerUnits: (battleState.playerUnits ?? []).map((unit) => {
      const statuses = normalizeStatuses(unit)
        .map((status) => ({
          ...status,
          remainingPlayerTurns: status.remainingPlayerTurns - 1
        }))
        .filter((status) => status.remainingPlayerTurns > 0);
      return {
        ...unit,
        statuses
      };
    })
  };
}
