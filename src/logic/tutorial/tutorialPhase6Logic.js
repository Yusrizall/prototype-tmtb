import {
  createEnemyBattleUnitFromSpawn
} from "../battle/battleSetup.js";

import {
  createBattleStructure
} from "../battle/structureLogic.js";

import {
  createDormantObjectiveState,
  createDestroyStructureObjectiveState
} from "../battle/objectiveLogic.js";

const PHASE_6_ID =
  "phase_6_spear_defensive_cover_objective";

const PHASE_6_GUARD_COVER_TARGET = {
  x: 7,
  y: 11
};

const PHASE_6_ARCHER_HUT_TARGET = {
  x: 9,
  y: 12
};

function isPhase6Battle(
  battleState
) {
  return Boolean(
    battleState?.flowContext ===
      "tutorial" &&
    battleState?.tutorialState
      ?.phaseId === PHASE_6_ID
  );
}

function activateRegion(
  tutorialState,
  regionId
) {
  const activeRegionIds =
    Array.isArray(
      tutorialState.activeRegionIds
    )
      ? tutorialState.activeRegionIds
      : [];

  if (activeRegionIds.includes(regionId)) {
    return tutorialState;
  }

  return {
    ...tutorialState,
    activeRegionIds: [
      ...activeRegionIds,
      regionId
    ]
  };
}

function getUnitByDefId(
  battleState,
  unitDefId
) {
  return (
    battleState.playerUnits.find((unit) => {
      return unit.unitDefId === unitDefId;
    }) ?? null
  );
}

function createInitialPhase6Evidence(
  previousEvidence = {}
) {
  return {
    ...previousEvidence,
    phase6Initialized: true,
    phase6FirstEndTurnObserved: false,
    phase6FirstSpearAttackObserved: false,
    phase6FirstSpearAttackDamage: null,
    phase6FirstSpearPathOutcome: null,
    phase6GuardCoverMovementObserved: false,
    phase6MandatoryGuardAttackObserved: false,
    phase6SecondEndTurnObserved: false,
    phase6SpearRetreatObserved: false,
    phase6SpearRetreatMovementEvent: null,
    phase6CoveredSpearAttackObserved: false,
    phase6CoveredSpearAttackDamage: null,
    phase6CoveredSpearPathOutcome: null,
    phase6SpearDefeated: false,
    phase6StructureRefreshObserved: false,
    phase6ObjectiveIntroduced: false,
    phase6SwitchedToArcher: false,
    phase6ArcherHutPositionObserved: false,
    phase6FirstHutAttackObserved: false,
    phase6FirstHutAttackDamage: null,
    phase6Complete: false
  };
}

export function initializeTutorialPhase6Content(
  data,
  battleState
) {
  if (
    !isPhase6Battle(battleState) ||
    battleState.tutorialState.taskId !==
      "phase_6_entry"
  ) {
    return battleState;
  }

  const existingSpear =
    battleState.enemyUnits.find((enemy) => {
      return enemy.unitDefId === "spear_enemy";
    }) ?? null;

  const existingHut =
    (battleState.structures ?? []).find((structure) => {
      return (
        structure.battleStructureId ===
        "tutorial_hut_1"
      );
    }) ?? null;

  const phase6Content =
    data?.tutorialEncounter
      ?.phase6Content;

  if (!phase6Content) {
    throw new Error(
      "Tutorial Phase 6 content tidak ditemukan."
    );
  }

  const spawnData =
    phase6Content.enemySpawns?.[0];

  const structurePlacement =
    phase6Content.structures?.[0];

  if (!spawnData || !structurePlacement) {
    throw new Error(
      "Tutorial Phase 6 authored content tidak lengkap."
    );
  }

  const nextSpawnOrder =
    Math.max(
      0,
      ...battleState.enemyUnits.map((enemy) => {
        return Number.isFinite(enemy.spawnOrder)
          ? enemy.spawnOrder
          : 0;
      })
    ) + 1;

  const spear =
    existingSpear ??
    createEnemyBattleUnitFromSpawn(
      data.enemyUnits,
      data.tutorialMap,
      spawnData,
      nextSpawnOrder
    );

  const hut =
    existingHut ??
    createBattleStructure(
      data.structureDefinitions,
      structurePlacement
    );

  const nextEnemyUnits =
    existingSpear
      ? battleState.enemyUnits
      : [
          ...battleState.enemyUnits,
          spear
        ];

  const nextStructures =
    existingHut
      ? battleState.structures
      : [
          ...(battleState.structures ?? []),
          hut
        ];

  const tutorialState =
    battleState.tutorialState;

  const alreadyInitialized =
    tutorialState
      .evidence
      ?.phase6Initialized === true &&
    tutorialState.phase6Entities
      ?.spearEnemyId &&
    tutorialState.phase6Entities
      ?.hutStructureId;

  return {
    ...battleState,
    enemyUnits: nextEnemyUnits,
    structures: nextStructures,
    objectiveState:
      battleState.objectiveState ??
      createDormantObjectiveState(),
    tutorialState: {
      ...tutorialState,
      phase6Entities: {
        spearEnemyId:
          spear.battleUnitId,
        hutStructureId:
          hut.battleStructureId
      },
      evidence:
        alreadyInitialized
          ? tutorialState.evidence
          : createInitialPhase6Evidence(
              tutorialState.evidence
            )
    }
  };
}

export function advanceTutorialPhase6Brief(
  battleState
) {
  if (!isPhase6Battle(battleState)) {
    return battleState;
  }

  const tutorialState = battleState.tutorialState;

  switch (tutorialState.taskId) {
    case "phase_6_entry":
      return {
        ...battleState,
        tutorialState: {
          ...tutorialState,
          taskId: "introduce_spear",
          prompt: "This is a Spear enemy.",
          targetTile: null
        }
      };

    case "introduce_spear":
      return {
        ...battleState,
        tutorialState: {
          ...tutorialState,
          taskId: "explain_spear_spacing",
          prompt: "Spear enemies attack from range and prefer to keep their distance.",
          targetTile: null
        }
      };

    case "explain_spear_spacing":
      return {
        ...battleState,
        tutorialState: {
          ...tutorialState,
          taskId: "end_turn_for_clear_attack",
          prompt: "End your turn.",
          targetTile: null
        }
      };

    case "explain_defensive_cover":
      return {
        ...battleState,
        tutorialState: {
          ...tutorialState,
          taskId: "move_guard_closer_to_spear",
          prompt: "Move Guard closer to the Spear.",
          targetTile: { ...PHASE_6_GUARD_COVER_TARGET }
        }
      };

    case "explain_spear_edge_atr":
      return {
        ...battleState,
        tutorialState: {
          ...tutorialState,
          taskId: "resolve_covered_spear_attack",
          prompt: "ENEMY TURN",
          targetTile: null
        }
      };

    case "explain_cover_reduction":
      return {
        ...battleState,
        tutorialState: {
          ...tutorialState,
          taskId: "finish_spear",
          prompt: "Finish the Spear.",
          targetTile: null
        }
      };

    case "structure_intro":
      return {
        ...battleState,
        tutorialState: {
          ...tutorialState,
          taskId: "structure_targeting_intro",
          prompt: "Some buildings and objects can be targeted with normal attacks.",
          targetTile: null
        }
      };

    case "structure_targeting_intro": {
      const hutId = tutorialState.phase6Entities?.hutStructureId;
      return {
        ...battleState,
        objectiveState: createDestroyStructureObjectiveState(hutId),
        tutorialState: {
          ...tutorialState,
          taskId: "switch_to_archer_for_hut",
          prompt: "Press Q to switch to Archer.",
          targetTile: null,
          evidence: {
            ...tutorialState.evidence,
            phase6ObjectiveIntroduced: true
          }
        }
      };
    }

    default:
      return battleState;
  }
}

export function recordTutorialPhase6EndTurn(
  previousBattleState,
  nextBattleState
) {
  if (
    !isPhase6Battle(previousBattleState) ||
    !isPhase6Battle(nextBattleState) ||
    previousBattleState.phase !== "player_phase" ||
    nextBattleState.phase !== "enemy_phase"
  ) {
    return nextBattleState;
  }

  const previousTaskId = previousBattleState.tutorialState.taskId;
  const tutorialState = nextBattleState.tutorialState;

  if (previousTaskId === "end_turn_for_clear_attack") {
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "observe_clear_spear_attack",
        prompt: "ENEMY TURN",
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6FirstEndTurnObserved: true
        }
      }
    };
  }

  if (previousTaskId === "end_turn_for_spear_retreat") {
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "observe_spear_retreat",
        prompt: "ENEMY TURN",
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6SecondEndTurnObserved: true
        }
      }
    };
  }

  if (previousTaskId === "end_turn_after_spear_defeated") {
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "refresh_before_structure_lesson",
        prompt: "ENEMY TURN",
        targetTile: null
      }
    };
  }

  return nextBattleState;
}

export function recordTutorialPhase6EnemyResolution(
  previousBattleState,
  nextBattleState,
  context = {}
) {
  if (!isPhase6Battle(nextBattleState)) {
    return nextBattleState;
  }

  const tutorialState = nextBattleState.tutorialState;
  const spearId = tutorialState.phase6Entities?.spearEnemyId;
  const guard = getUnitByDefId(nextBattleState, "guard");
  const attackEvent = context.attackEvent ?? null;

  if (
    !spearId ||
    !guard ||
    !attackEvent ||
    attackEvent.attackerId !== spearId ||
    attackEvent.targetId !== guard.battleUnitId ||
    attackEvent.attacked !== true
  ) {
    return nextBattleState;
  }

  if (tutorialState.taskId === "observe_clear_spear_attack") {
    const clearObserved =
      attackEvent.pathOutcome === "clear" &&
      attackEvent.finalDamage > 0;

    if (!clearObserved) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "explain_defensive_cover",
        prompt: "Ranged attacks can be reduced by Cover.",
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6FirstSpearAttackObserved: true,
          phase6FirstSpearAttackDamage: attackEvent.finalDamage,
          phase6FirstSpearPathOutcome: attackEvent.pathOutcome
        }
      }
    };
  }

  if (tutorialState.taskId === "resolve_covered_spear_attack") {
    const firstDamage = tutorialState.evidence.phase6FirstSpearAttackDamage;
    const coveredObserved =
      attackEvent.pathOutcome === "partial_cover" &&
      Number.isFinite(firstDamage) &&
      attackEvent.finalDamage < firstDamage;

    if (!coveredObserved) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "explain_cover_reduction",
        prompt: "Cover reduced the damage from that attack.",
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6CoveredSpearAttackObserved: true,
          phase6CoveredSpearAttackDamage: attackEvent.finalDamage,
          phase6CoveredSpearPathOutcome: attackEvent.pathOutcome
        }
      }
    };
  }

  return nextBattleState;
}

export function recordTutorialPhase6EnemyMovement(
  previousBattleState,
  nextBattleState,
  movementEvent = null
) {
  if (!isPhase6Battle(nextBattleState)) {
    return nextBattleState;
  }

  const tutorialState = nextBattleState.tutorialState;
  const spearId = tutorialState.phase6Entities?.spearEnemyId;

  if (
    tutorialState.taskId !== "observe_spear_retreat" ||
    !movementEvent ||
    movementEvent.enemyId !== spearId ||
    movementEvent.moved !== true
  ) {
    return nextBattleState;
  }

  return {
    ...nextBattleState,
    tutorialState: {
      ...tutorialState,
      taskId: "explain_spear_edge_atr",
      prompt: "Spear enemies prefer to attack from the edge of their Attack Range.",
      targetTile: null,
      evidence: {
        ...tutorialState.evidence,
        phase6SpearRetreatObserved: true,
        phase6SpearRetreatMovementEvent: movementEvent
      }
    }
  };
}

export function recordTutorialPhase6PlayerTurnStart(
  previousBattleState,
  nextBattleState
) {
  if (
    !isPhase6Battle(nextBattleState) ||
    nextBattleState.phase !== "player_phase" ||
    previousBattleState?.tutorialState?.taskId !== "refresh_before_structure_lesson"
  ) {
    return nextBattleState;
  }

  const tutorialState = nextBattleState.tutorialState;
  const spearId = tutorialState.phase6Entities?.spearEnemyId;
  const spear = nextBattleState.enemyUnits.find((enemy) => enemy.battleUnitId === spearId) ?? null;

  if (!spear || spear.currentHP > 0) {
    return nextBattleState;
  }

  return {
    ...nextBattleState,
    objectiveState: createDormantObjectiveState(),
    tutorialState: {
      ...tutorialState,
      taskId: "structure_intro",
      prompt: "Some structures can become combat objectives.",
      targetTile: null,
      evidence: {
        ...tutorialState.evidence,
        phase6StructureRefreshObserved: true
      }
    }
  };
}

export function recordTutorialPhase6UnitSelection(
  battleState
) {
  if (!isPhase6Battle(battleState)) {
    return battleState;
  }

  const tutorialState =
    battleState.tutorialState;

  if (
    tutorialState.taskId !==
      "switch_to_archer_for_hut"
  ) {
    return battleState;
  }

  const selectedUnit =
    battleState.playerUnits.find((unit) => {
      return (
        unit.battleUnitId ===
        battleState.selectedUnitId
      );
    }) ?? null;

  if (
    selectedUnit?.unitDefId !==
    "archer"
  ) {
    return battleState;
  }

  return {
    ...battleState,
    tutorialState: {
      ...tutorialState,
      taskId:
        "move_archer_for_hut_attack",
      prompt:
        "Move Archer into range of the Hut.",
      targetTile: {
        ...PHASE_6_ARCHER_HUT_TARGET
      },
      evidence: {
        ...tutorialState.evidence,
        phase6SwitchedToArcher: true
      }
    }
  };
}

export function recordTutorialPhase6PlayerMovement(
  previousBattleState,
  nextBattleState
) {
  if (!isPhase6Battle(nextBattleState)) {
    return nextBattleState;
  }

  const tutorialState = nextBattleState.tutorialState;

  if (tutorialState.taskId === "move_guard_closer_to_spear") {
    const guard = getUnitByDefId(nextBattleState, "guard");

    if (
      guard?.tileX !== PHASE_6_GUARD_COVER_TARGET.x ||
      guard?.tileY !== PHASE_6_GUARD_COVER_TARGET.y
    ) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "attack_spear_with_guard",
        prompt: "Attack the Spear with Guard.",
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6GuardCoverMovementObserved: true
        }
      }
    };
  }

  if (tutorialState.taskId === "move_archer_for_hut_attack") {
    const archer = getUnitByDefId(nextBattleState, "archer");

    if (
      archer?.tileX !== PHASE_6_ARCHER_HUT_TARGET.x ||
      archer?.tileY !== PHASE_6_ARCHER_HUT_TARGET.y
    ) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "first_hut_attack",
        prompt: "Attack the highlighted structure.",
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6ArcherHutPositionObserved: true
        }
      }
    };
  }

  return nextBattleState;
}

function completePhase6AfterHutDestroyed(
  battleState
) {
  const tutorialState = battleState.tutorialState;
  const hutId = tutorialState.phase6Entities?.hutStructureId;
  const spearId = tutorialState.phase6Entities?.spearEnemyId;
  const hut = battleState.structures?.find((structure) => structure.battleStructureId === hutId) ?? null;
  const spear = battleState.enemyUnits?.find((enemy) => enemy.battleUnitId === spearId) ?? null;

  if (!hut || hut.currentHP > 0 || !spear || spear.currentHP > 0) {
    return battleState;
  }

  const regionActivatedTutorialState = activateRegion(tutorialState, "C");

  return {
    ...battleState,
    objectiveState: createDormantObjectiveState(),
    tutorialState: {
      ...regionActivatedTutorialState,
      taskId: "proceed_to_region_c",
      prompt: "Proceed to the next area.",
      targetTile: null,
      evidence: {
        ...tutorialState.evidence,
        phase6Complete: true
      }
    }
  };
}

export function recordTutorialPhase6BasicAttack(
  previousBattleState,
  nextBattleState,
  attackResult = null
) {
  if (!isPhase6Battle(nextBattleState)) {
    return nextBattleState;
  }

  const tutorialState = nextBattleState.tutorialState;
  const spearId = tutorialState.phase6Entities?.spearEnemyId;
  const hutId = tutorialState.phase6Entities?.hutStructureId;
  const guard = getUnitByDefId(nextBattleState, "guard");

  if (tutorialState.taskId === "attack_spear_with_guard") {
    const mandatoryGuardHitObserved =
      attackResult?.attackerId === guard?.battleUnitId &&
      attackResult?.targetType === "unit" &&
      attackResult?.targetId === spearId &&
      Number.isFinite(attackResult?.targetHPBefore) &&
      Number.isFinite(attackResult?.targetHPAfter) &&
      attackResult.targetHPAfter < attackResult.targetHPBefore &&
      attackResult.targetHPAfter > 0;

    if (!mandatoryGuardHitObserved) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "end_turn_for_spear_retreat",
        prompt: "End your turn.",
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6MandatoryGuardAttackObserved: true
        }
      }
    };
  }

  if (tutorialState.taskId === "finish_spear") {
    const spearDefeated =
      attackResult?.targetType === "unit" &&
      attackResult?.targetId === spearId &&
      attackResult?.targetDefeated === true;

    if (!spearDefeated) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,
      objectiveState: createDormantObjectiveState(),
      tutorialState: {
        ...tutorialState,
        taskId: "end_turn_after_spear_defeated",
        prompt: "End your turn.",
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6SpearDefeated: true
        }
      }
    };
  }

  if (tutorialState.taskId === "first_hut_attack") {
    const realHutDamageObserved =
      attackResult?.targetType === "structure" &&
      attackResult?.targetId === hutId &&
      Number.isFinite(attackResult?.targetHPBefore) &&
      Number.isFinite(attackResult?.targetHPAfter) &&
      attackResult.targetHPAfter < attackResult.targetHPBefore;

    if (!realHutDamageObserved) {
      return nextBattleState;
    }

    const afterFirstHutAttack = {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "destroy_hut",
        prompt: null,
        targetTile: null,
        evidence: {
          ...tutorialState.evidence,
          phase6FirstHutAttackObserved: true,
          phase6FirstHutAttackDamage: attackResult.finalDamage
        }
      }
    };

    return completePhase6AfterHutDestroyed(afterFirstHutAttack);
  }

  if (tutorialState.taskId === "destroy_hut") {
    return completePhase6AfterHutDestroyed(nextBattleState);
  }

  return nextBattleState;
}

export function isTutorialPhase6InputAllowed(
  battleState,
  inputType
) {
  if (!isPhase6Battle(battleState)) {
    return true;
  }

  const taskId = battleState.tutorialState.taskId;

  if (battleState.battleControlState === "battle_result") {
    return true;
  }

  if ([
    "end_turn_for_clear_attack",
    "end_turn_for_spear_retreat",
    "end_turn_after_spear_defeated"
  ].includes(taskId)) {
    return inputType === "end_turn";
  }

  if ([
    "move_guard_closer_to_spear",
    "move_archer_for_hut_attack"
  ].includes(taskId)) {
    return inputType === "movement_keyboard";
  }

  if (taskId === "switch_to_archer_for_hut") {
    return inputType === "switch_unit";
  }

  if (["attack_spear_with_guard", "first_hut_attack"].includes(taskId)) {
    if (
      inputType === "movement_keyboard" &&
      battleState.battleControlState === "attack_targeting"
    ) {
      return true;
    }

    return ["open_action_menu", "confirm_action", "back_action"].includes(inputType);
  }

  if (["finish_spear", "destroy_hut"].includes(taskId)) {
    return true;
  }

  if (taskId === "proceed_to_region_c") {
    return ["movement_keyboard", "switch_unit", "end_turn"].includes(inputType);
  }

  return false;
}

export function isTutorialPhase6BasicAttackTargetAllowed(
  battleState,
  targetData
) {
  if (!isPhase6Battle(battleState)) {
    return true;
  }

  const taskId = battleState.tutorialState.taskId;
  const spearId = battleState.tutorialState.phase6Entities?.spearEnemyId;
  const hutId = battleState.tutorialState.phase6Entities?.hutStructureId;

  if (taskId === "attack_spear_with_guard") {
    const selectedUnit = battleState.playerUnits.find((unit) => unit.battleUnitId === battleState.selectedUnitId) ?? null;
    return Boolean(
      selectedUnit?.unitDefId === "guard" &&
      targetData?.targetType === "unit" &&
      targetData?.targetId === spearId
    );
  }

  if (taskId === "finish_spear") {
    return Boolean(
      targetData?.targetType === "unit" &&
      targetData?.targetId === spearId
    );
  }

  if (["first_hut_attack", "destroy_hut"].includes(taskId)) {
    return Boolean(
      targetData?.targetType === "structure" &&
      targetData?.targetId === hutId
    );
  }

  return true;
}

export function getTutorialPhase6EnemyActivationMode(
  battleState
) {
  if (!isPhase6Battle(battleState)) {
    return "full_activation";
  }

  const taskId = battleState.tutorialState.taskId;

  if (taskId === "observe_spear_retreat") {
    return "movement_only_pause";
  }

  if (taskId === "resolve_covered_spear_attack") {
    return "attack_only_continue";
  }

  return "full_activation";
}

export function shouldPauseTutorialPhase6EnemyResolution(
  battleState
) {
  if (
    !isPhase6Battle(battleState) ||
    battleState.phase !== "enemy_phase"
  ) {
    return false;
  }

  return ![
    "observe_clear_spear_attack",
    "observe_spear_retreat",
    "resolve_covered_spear_attack",
    "finish_spear",
    "refresh_before_structure_lesson",
    "destroy_hut",
    "proceed_to_region_c"
  ].includes(battleState.tutorialState.taskId);
}

export function getTutorialPhase6RequiredActorFailure(
  battleState
) {
  if (!isPhase6Battle(battleState)) {
    return {
      failed: false,
      defeatedUnitId: null,
      defeatedUnitName: null
    };
  }

  const requiredUnit =
    battleState.playerUnits.find((unit) => {
      return (
        (
          unit.unitDefId === "guard" ||
          unit.unitDefId === "archer"
        ) &&
        unit.currentHP <= 0
      );
    }) ?? null;

  if (!requiredUnit) {
    return {
      failed: false,
      defeatedUnitId: null,
      defeatedUnitName: null
    };
  }

  return {
    failed: true,
    defeatedUnitId:
      requiredUnit.battleUnitId,
    defeatedUnitName:
      requiredUnit.name
  };
}
