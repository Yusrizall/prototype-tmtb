export function evaluateEliminateAllObjective(
  battleState
) {
  if (
    battleState.objectiveType !==
    "eliminate_all"
  ) {
    return {
      resolved: false,
      resultState: "ongoing",
      reason: "unsupported_objective"
    };
  }

  const livingEnemyUnits =
    battleState.enemyUnits.filter((enemy) => {
      return enemy.currentHP > 0;
    });

  if (livingEnemyUnits.length > 0) {
    return {
      resolved: false,
      resultState: "ongoing",
      reason: "enemies_remaining",
      remainingEnemyCount:
        livingEnemyUnits.length
    };
  }

  return {
    resolved: true,
    resultState: "victory",
    reason: "all_enemy_units_defeated",
    remainingEnemyCount: 0
  };
}