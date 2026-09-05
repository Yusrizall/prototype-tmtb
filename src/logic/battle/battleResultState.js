const VALID_RESULT_STATES = new Set([
  "victory",
  "defeat",
  "training_failed"
]);

function toSafeNonNegativeInteger(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(numericValue)
  );
}

function createPartyResultEntry(unit) {
  const maxHP =
    toSafeNonNegativeInteger(
      unit?.maxHP ??
      unit?.derivedStats?.maxHP
    );

  const currentHP = Math.min(
    maxHP,
    toSafeNonNegativeInteger(
      unit?.currentHP
    )
  );

  const stageStartHP = Math.min(
    maxHP,
    toSafeNonNegativeInteger(
      unit?.stageStartHP ?? maxHP
    )
  );

  return {
    battleUnitId:
      unit?.battleUnitId ?? null,

    unitDefId:
      unit?.unitDefId ?? null,

    name:
      unit?.name ?? "Unknown Unit",

    stageStartHP,
    currentHP,
    maxHP,

    hpLost:
      Math.max(
        0,
        stageStartHP - currentHP
      ),

    status:
      currentHP > 0
        ? "survived"
        : "defeated"
  };
}

export function createBattleResultSnapshot(
  battleState
) {
  if (
    !battleState ||
    battleState.battleControlState !==
      "battle_result" ||
    !VALID_RESULT_STATES.has(
      battleState.resultState
    )
  ) {
    return null;
  }

  const party = (
    battleState.playerUnits ?? []
  ).map(createPartyResultEntry);

  const enemies =
    battleState.enemyUnits ?? [];

  const enemyDefeated =
    enemies.filter((enemy) => {
      return (
        toSafeNonNegativeInteger(
          enemy?.currentHP
        ) === 0
      );
    }).length;

  const crystalGained =
    battleState.resultState === "victory" &&
    battleState.flowContext === "run_stage"
      ? toSafeNonNegativeInteger(
          battleState.crystalReward
        )
      : 0;

  return {
    version: 1,

    result:
      battleState.resultState,

    flowContext:
      battleState.flowContext ?? null,

    stage: {
      id:
        battleState.stageId ??
        battleState.encounterId ??
        null,

      name:
        battleState.encounterName ??
        "Unknown Stage",

      nodeType:
        battleState.nodeType ??
        (
          battleState.flowContext ===
            "tutorial"
            ? "tutorial"
            : null
        ),

      routeDifficulty:
        battleState.routeDifficulty ??
        null,

      objectiveType:
        battleState.objectiveType ??
        null
    },

    metrics: {
      totalTurns:
        Math.max(
          1,
          toSafeNonNegativeInteger(
            battleState.turnCount
          )
        ),

      enemyDefeated,

      enemyTotal:
        enemies.length,

      partySurvived:
        party.filter((unit) => {
          return unit.status === "survived";
        }).length,

      partyTotal:
        party.length,

      crystalGained
    },

    party
  };
}

export function isMatchingRunBattleResult(
  resultSnapshot,
  nodeId,
  expectedResult
) {
  return Boolean(
    resultSnapshot &&
    resultSnapshot.version === 1 &&
    resultSnapshot.flowContext ===
      "run_stage" &&
    resultSnapshot.stage?.id === nodeId &&
    resultSnapshot.result ===
      expectedResult
  );
}
