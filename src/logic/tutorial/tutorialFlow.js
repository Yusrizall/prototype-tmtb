const LOOK_DIRECTION_THRESHOLD = 24;
const PHASE_2_GUARD_TARGET_A = {
  x: 2,
  y: 1
};

const PHASE_2_ARCHER_TARGET_B = {
  x: 1,
  y: 5
};

const PHASE_2_GUARD_TARGET_C = {
  x: 2,
  y: 0
};

const PHASE_3_GUARD_TARGET_D = {
  x: 3,
  y: 1
};

const PHASE_4_ARCHER_RED_TARGET = {
  x: 2,
  y: 4
};

const PHASE_4_ARCHER_YELLOW_TARGET = {
  x: 2,
  y: 2
};

const PHASE_4_ARCHER_GREEN_TARGET = {
  x: 4,
  y: 4
};

function isTutorialBattle(
  battleState
) {
  return (
    battleState?.flowContext ===
      "tutorial" &&
    battleState?.tutorialState
  );
}

export function createInitialTutorialState() {
  return {
    phaseId:
      "phase_1_control_orientation",

    taskId:
      "look_around",

    prompt:
      "Move the mouse to look around.",

    status:
      "active",

      targetTile: null,
          intentPulseEnemyId: null,

    lookProgress: {
      left: 0,
      right: 0,
      up: 0,
      down: 0
    },

    evidence: {
      lookedLeft: false,
      lookedRight: false,
      lookedUp: false,
      lookedDown: false,

      switchedToArcher: false,
      switchedBackToGuard: false,

reachedGuardTargetA: false,

returnedGuardToStart: false,
movementApRefundObserved: false,

phase2SwitchedToArcher: false,
reachedArcherTargetB: false,

phase2SwitchedBackToGuard: false,
guardTargetCApSpendObserved: false,
reachedGuardTargetC: false,
sharedTeamApObserved: false,

phase3EndTurnObserved: false,
phase3DiscardedAp: null,

phase3SwordIntroduced: false,
phase3IntentExplained: false,

phase3EnemyMovementObserved: false,
phase3NoEnemyAttackObserved: false,

phase3ApRefreshObserved: false,
phase3StartGridRefreshObserved: false,

phase3ReachedGuardTargetD: false,
phase3GuardMovementApObserved: false,

phase3ActionMenuOpened: false,
phase3AttackSelected: false,
phase3SwordTargetSelected: false,

phase3AttackObserved: false,
phase3AttackDamage: null,
phase3AttackApSpendObserved: false,
phase3MovementLockObserved: false,

phase4SwitchedToArcher: false,
phase4OutsideAtrObserved: false,

phase4ReachedRedTarget: false,
phase4FullCoverObserved: false,

phase4ReachedYellowTarget: false,
phase4PartialCoverObserved: false,

phase4ReachedGreenTarget: false,
phase4ClearShotObserved: false,

phase4AttackTargetingObserved: false,
phase4AttackObserved: false,
phase4AttackDamage: null,
phase4AttackApSpendObserved: false,
phase4MovementLockObserved: false,

phase5EndTurnObserved: false,

phase5EnemyAttackObserved: false,
phase5EnemyAttackDamage: null,

phase5PlayerTurnRefreshObserved: false,
phase5InitialGuardTargetObserved: false,

phase5DynamicTargetChangeObserved: false,
phase5PreviousTargetId: null,
phase5CurrentTargetId: null,

phase5TacticalResponseObserved: false,
phase5ResponseType: null,
phase5ResponseAttackDamage: null
    }
  };
}

export function recordTutorialLookMovement(
  battleState,
  movementX,
  movementY
) {
  if (
    !isTutorialBattle(
      battleState
    ) ||
    battleState.tutorialState.phaseId !==
      "phase_1_control_orientation" ||
    battleState.tutorialState.taskId !==
      "look_around"
  ) {
    return battleState;
  }

  const safeMovementX =
    Number.isFinite(movementX)
      ? movementX
      : 0;

  const safeMovementY =
    Number.isFinite(movementY)
      ? movementY
      : 0;

  if (
    safeMovementX === 0 &&
    safeMovementY === 0
  ) {
    return battleState;
  }

  const previousTutorialState =
    battleState.tutorialState;

  const nextLookProgress = {
    ...previousTutorialState
      .lookProgress
  };

  if (safeMovementX < 0) {
    nextLookProgress.left +=
      Math.abs(safeMovementX);
  }

  if (safeMovementX > 0) {
    nextLookProgress.right +=
      safeMovementX;
  }

  if (safeMovementY < 0) {
    nextLookProgress.up +=
      Math.abs(safeMovementY);
  }

  if (safeMovementY > 0) {
    nextLookProgress.down +=
      safeMovementY;
  }

  const nextEvidence = {
    ...previousTutorialState
      .evidence,

    lookedLeft:
      nextLookProgress.left >=
      LOOK_DIRECTION_THRESHOLD,

    lookedRight:
      nextLookProgress.right >=
      LOOK_DIRECTION_THRESHOLD,

    lookedUp:
      nextLookProgress.up >=
      LOOK_DIRECTION_THRESHOLD,

    lookedDown:
      nextLookProgress.down >=
      LOOK_DIRECTION_THRESHOLD
  };

  const lookAroundCompleted =
    nextEvidence.lookedLeft &&
    nextEvidence.lookedRight &&
    nextEvidence.lookedUp &&
    nextEvidence.lookedDown;

  return {
    ...battleState,

    tutorialState: {
      ...previousTutorialState,

      taskId:
        lookAroundCompleted
          ? "switch_to_archer"
          : previousTutorialState
              .taskId,

      prompt:
        lookAroundCompleted
          ? "Press Q to switch to Archer."
          : previousTutorialState
              .prompt,

      lookProgress:
        nextLookProgress,

      evidence:
        nextEvidence
    }
  };
}

export function recordTutorialUnitSelection(
  battleState
) {
  if (
    !isTutorialBattle(
      battleState
    )
  ) {
    return battleState;
  }

  const tutorialState =
    battleState.tutorialState;

  const selectedUnit =
    battleState.playerUnits.find((unit) => {
      return (
        unit.battleUnitId ===
        battleState.selectedUnitId
      );
    });

  if (!selectedUnit) {
    return battleState;
  }

  if (
    tutorialState.phaseId ===
    "phase_1_control_orientation"
  ) {
    if (
      tutorialState.taskId ===
        "switch_to_archer"
    ) {
      if (
        selectedUnit.unitDefId !==
        "archer"
      ) {
        return battleState;
      }

      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "switch_back_to_guard",

          prompt:
            "Press Q again to switch back to Guard.",

          evidence: {
            ...tutorialState.evidence,

            switchedToArcher: true
          }
        }
      };
    }

    if (
      tutorialState.taskId ===
        "switch_back_to_guard"
    ) {
      if (
        selectedUnit.unitDefId !==
        "guard"
      ) {
        return battleState;
      }

      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          phaseId:
            "phase_2_shared_ap_movement",

          taskId:
            "move_guard_to_target_a",

          targetTile: {
            ...PHASE_2_GUARD_TARGET_A
          },

          prompt:
            "Use WASD to move to the highlighted position.",

          evidence: {
            ...tutorialState.evidence,

            switchedBackToGuard: true
          }
        }
      };
    }

    return battleState;
  }

  if (
    tutorialState.phaseId ===
      "phase_2_shared_ap_movement" &&
    tutorialState.taskId ===
      "switch_to_archer_for_target_b"
  ) {
    if (
      selectedUnit.unitDefId !==
      "archer"
    ) {
      return battleState;
    }

    return {
      ...battleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "move_archer_to_target_b",

        targetTile: {
          ...PHASE_2_ARCHER_TARGET_B
        },

        prompt:
          "Use WASD to move to the highlighted position.",

        evidence: {
          ...tutorialState.evidence,

          phase2SwitchedToArcher: true
        }
      }
    };
  }
  if (
    tutorialState.phaseId ===
      "phase_2_shared_ap_movement" &&
    tutorialState.taskId ===
      "switch_back_to_guard_for_target_c"
  ) {
    if (
      selectedUnit.unitDefId !==
        "guard"
    ) {
      return battleState;
    }

    return {
      ...battleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "move_guard_to_target_c",

        targetTile: {
          ...PHASE_2_GUARD_TARGET_C
        },

        prompt:
          "Use WASD to move to the highlighted position.",

        evidence: {
          ...tutorialState.evidence,

          phase2SwitchedBackToGuard: true
        }
      }
    };
  }
    if (
    tutorialState.phaseId ===
      "phase_4_tactical_space" &&
    tutorialState.taskId ===
      "switch_to_archer_for_tactical_space"
  ) {
    if (
      selectedUnit.unitDefId !==
        "archer"
    ) {
      return battleState;
    }

    return {
      ...battleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "try_archer_attack_outside_atr",

        targetTile: null,

        prompt:
          "Try to attack the Sword.",

        evidence: {
          ...tutorialState.evidence,

          phase4SwitchedToArcher:
            true
        }
      }
    };
  }
  return battleState;
}

export function recordTutorialPlayerMovement(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    nextBattleState
      .tutorialState
      .phaseId !==
      "phase_2_shared_ap_movement"
  ) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  const isTargetAMovement =
    tutorialState.taskId ===
      "move_guard_to_target_a";

  const isReturnMovement =
    tutorialState.taskId ===
      "return_guard_to_start";

  const isArcherTargetBMovement =
    tutorialState.taskId ===
      "move_archer_to_target_b";

        const isGuardTargetCMovement =
    tutorialState.taskId ===
      "move_guard_to_target_c";

   if (
    !isTargetAMovement &&
    !isReturnMovement &&
    !isArcherTargetBMovement &&
    !isGuardTargetCMovement
  ) {
    return nextBattleState;
  }

  const previousSelectedUnit =
    previousBattleState
      ?.playerUnits
      ?.find((unit) => {
        return (
          unit.battleUnitId ===
          previousBattleState.selectedUnitId
        );
      });

  const selectedUnit =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
          nextBattleState.selectedUnitId
        );
      });

  if (
    !previousSelectedUnit ||
    !selectedUnit
  ) {
    return nextBattleState;
  }

  const positionChanged =
    previousSelectedUnit.tileX !==
      selectedUnit.tileX ||
    previousSelectedUnit.tileY !==
      selectedUnit.tileY;

  if (!positionChanged) {
    return nextBattleState;
  }

  if (isTargetAMovement) {
    if (
      selectedUnit.unitDefId !==
      "guard"
    ) {
      return nextBattleState;
    }

    const reachedTargetA =
      selectedUnit.tileX ===
        PHASE_2_GUARD_TARGET_A.x &&
      selectedUnit.tileY ===
        PHASE_2_GUARD_TARGET_A.y;

    if (!reachedTargetA) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "explain_first_movement_ap",

        targetTile: null,

        prompt:
          "Leaving your starting position costs 1 Action Point (AP).",

        evidence: {
          ...tutorialState.evidence,

          reachedGuardTargetA: true
        }
      }
    };
  }

  if (isReturnMovement) {
    if (
      selectedUnit.unitDefId !==
      "guard"
    ) {
      return nextBattleState;
    }

    const guardStartGrid =
      selectedUnit.startGrid;

    if (!guardStartGrid) {
      return nextBattleState;
    }

    const returnedToStart =
      selectedUnit.tileX ===
        guardStartGrid.x &&
      selectedUnit.tileY ===
        guardStartGrid.y;

    if (!returnedToStart) {
      return nextBattleState;
    }

    const refundObserved =
      previousSelectedUnit
        .movementApCommitted ===
        true &&
      selectedUnit
        .movementApCommitted ===
        false &&
      nextBattleState.teamApCurrent ===
        previousBattleState
          .teamApCurrent + 1;

    if (!refundObserved) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "explain_movement_ap_refund",

        targetTile: null,

        prompt:
          "Returning restores that AP.",

        evidence: {
          ...tutorialState.evidence,

          returnedGuardToStart: true,
          movementApRefundObserved: true
        }
      }
    };
  }

    if (isArcherTargetBMovement) {
    if (
      selectedUnit.unitDefId !==
        "archer"
    ) {
      return nextBattleState;
    }

    const reachedTargetB =
      selectedUnit.tileX ===
        PHASE_2_ARCHER_TARGET_B.x &&
      selectedUnit.tileY ===
        PHASE_2_ARCHER_TARGET_B.y;

    if (!reachedTargetB) {
      return nextBattleState;
    }

    const movementCommitObserved =
      selectedUnit
        .movementApCommitted ===
        true &&
      nextBattleState.teamApCurrent <
        nextBattleState.teamApCapacity;

    if (!movementCommitObserved) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "archer_target_b_checkpoint",

        targetTile: null,

        prompt:
          "Target reached.",

        evidence: {
          ...tutorialState.evidence,

          reachedArcherTargetB: true
        }
      }
    };
  }

    if (
    selectedUnit.unitDefId !==
      "guard"
  ) {
    return nextBattleState;
  }

  const previousArcher =
    previousBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
          "archer"
        );
      });

  const currentArcher =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
          "archer"
        );
      });

  if (
    !previousArcher ||
    !currentArcher
  ) {
    return nextBattleState;
  }

  const guardApSpendObservedNow =
    previousSelectedUnit
      .movementApCommitted ===
      false &&
    selectedUnit
      .movementApCommitted ===
      true &&
    previousArcher
      .movementApCommitted ===
      true &&
    currentArcher
      .movementApCommitted ===
      true &&
    nextBattleState.teamApCurrent ===
      previousBattleState
        .teamApCurrent - 1;

  const guardApSpendWasObserved =
    tutorialState
      .evidence
      .guardTargetCApSpendObserved ===
      true;

  const guardApSpendConfirmed =
    guardApSpendObservedNow ||
    guardApSpendWasObserved;

  const reachedTargetC =
    selectedUnit.tileX ===
      PHASE_2_GUARD_TARGET_C.x &&
    selectedUnit.tileY ===
      PHASE_2_GUARD_TARGET_C.y;

  if (!reachedTargetC) {
    if (!guardApSpendObservedNow) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,

      tutorialState: {
        ...tutorialState,

        evidence: {
          ...tutorialState.evidence,

          guardTargetCApSpendObserved:
            true
        }
      }
    };
  }

  if (
    !guardApSpendConfirmed ||
    currentArcher
      .movementApCommitted !==
      true
  ) {
    return nextBattleState;
  }

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "explain_shared_team_ap",

      targetTile: null,

      prompt:
        "AP is shared by your whole team.",

      evidence: {
        ...tutorialState.evidence,

        guardTargetCApSpendObserved:
          true,

        reachedGuardTargetC: true,
        sharedTeamApObserved: true
      }
    }
  };
}

export function advanceTutorialBrief(
  battleState
) {
  if (
    !isTutorialBattle(
      battleState
    )
  ) {
    return battleState;
  }

  const tutorialState =
    battleState.tutorialState;

  if (
    tutorialState.phaseId ===
      "phase_2_shared_ap_movement"
  ) {
    if (
      tutorialState.taskId ===
        "explain_first_movement_ap"
    ) {
      const guard =
        battleState.playerUnits.find((unit) => {
          return (
            unit.unitDefId ===
              "guard" &&
            unit.currentHP > 0
          );
        });

      if (
        !guard ||
        !guard.startGrid
      ) {
        return battleState;
      }

      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "return_guard_to_start",

          targetTile: {
            x: guard.startGrid.x,
            y: guard.startGrid.y
          },

          prompt:
            "Return to your starting position."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_movement_ap_refund"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "switch_to_archer_for_target_b",

          targetTile: null,

          prompt:
            "Press Q to switch to Archer."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "archer_target_b_checkpoint"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "switch_back_to_guard_for_target_c",

          targetTile: null,

          prompt:
            "Press Q to switch back to Guard."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_shared_team_ap"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "explain_movement_range",

          targetTile: null,

          prompt:
            "Highlighted tiles show this unit's Movement Range."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_movement_range"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          phaseId:
            "phase_3_turn_intent_combat",

          taskId:
            "end_player_turn",

          targetTile: null,

          prompt:
            "When you're done, end your turn."
        }
      };
    }

    return battleState;
  }

  if (
    tutorialState.phaseId ===
      "phase_3_turn_intent_combat"
  ) {
    if (
      tutorialState.taskId ===
        "enemy_turn_checkpoint"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "introduce_sword_enemy",

          prompt:
            "This is a Sword enemy. It targets the nearest unit and moves toward it to attack.",

          evidence: {
            ...tutorialState.evidence,

            phase3SwordIntroduced: true
          }
        }
      };
    }

    if (
      tutorialState.taskId ===
        "introduce_sword_enemy"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "explain_enemy_intent",

          prompt:
            "Intent shows what an enemy is trying to do.",

          evidence: {
            ...tutorialState.evidence,

            phase3IntentExplained: true
          }
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_enemy_intent"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "enemy_resolution_ready",

          prompt:
            "Watch the Sword act."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_ap_refresh"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "explain_new_startgrids",

          prompt:
            "These are your new starting positions.",

          evidence: {
            ...tutorialState.evidence,

            phase3StartGridRefreshObserved:
              true
          }
        }
      };
    }
            if (
      tutorialState.taskId ===
        "explain_new_startgrids"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "move_guard_to_target_d",

          targetTile: {
            ...PHASE_3_GUARD_TARGET_D
          },

          prompt:
            "Use WASD to move to the highlighted position."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_attack_movement_lock"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          phaseId:
            "phase_4_tactical_space",

          taskId:
            "switch_to_archer_for_tactical_space",

          targetTile: null,

          prompt:
            "Press Q to switch to Archer."
        }
      };
    }
  }


    if (
    tutorialState.phaseId ===
      "phase_4_tactical_space"
  ) {
    if (
      tutorialState.taskId ===
        "explain_archer_atr"
    ) {
      return {
        ...battleState,

        battleControlState:
          "unit_selected_movement",

        actionMenuIndex: 0,
        selectedAction: null,

        targetIndex: 0,
        targetUnitId: null,

        feedbackMessage: null,

        tutorialState: {
          ...tutorialState,

          taskId:
            "move_archer_to_red_cover",

          targetTile: {
            ...PHASE_4_ARCHER_RED_TARGET
          },

          prompt:
            "Reposition into Attack Range."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_full_cover"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "explain_obstacle_blocking",

          prompt:
            "Obstacles block movement."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_obstacle_blocking"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "explain_obstacle_cover",

          prompt:
            "Some obstacles also provide Cover."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_obstacle_cover"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "move_archer_to_yellow_cover",

          targetTile: {
            ...PHASE_4_ARCHER_YELLOW_TARGET
          },

          prompt:
            "Reposition for a better shot."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_partial_cover"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "move_archer_to_green_clear",

          targetTile: {
            ...PHASE_4_ARCHER_GREEN_TARGET
          },

          prompt:
            "Reposition for a clearer shot."
        }
      };
    }

    if (
      tutorialState.taskId ===
        "explain_clear_shot"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "attack_sword_from_clear",

          targetTile: null,

          prompt:
            "Attack the Sword."
        }
      };
    }
        if (
      tutorialState.taskId ===
        "phase_4_attack_checkpoint"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "end_turn_for_phase5",

          targetTile: null,

          prompt:
            "End your turn."
        }
      };
    }
  }
    if (
    tutorialState.phaseId ===
      "phase_5_dynamic_threat_reading"
  ) {
    if (
      tutorialState.taskId ===
        "explain_dynamic_intent"
    ) {
      return {
        ...battleState,

        tutorialState: {
          ...tutorialState,

          taskId:
            "respond_to_threat",

          intentPulseEnemyId:
            null,

          targetTile: null,

          prompt:
            "Respond to the threat."
        }
      };
    }
  }

  return battleState;
}

export function recordTutorialPhase3PlayerMovement(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    nextBattleState
      .tutorialState
      .phaseId !==
      "phase_3_turn_intent_combat" ||
    nextBattleState
      .tutorialState
      .taskId !==
      "move_guard_to_target_d"
  ) {
    return nextBattleState;
  }

  const previousGuard =
    previousBattleState
      ?.playerUnits
      ?.find((unit) => {
        return (
          unit.unitDefId ===
            "guard" &&
          unit.battleUnitId ===
            previousBattleState
              .selectedUnitId
        );
      });

  const currentGuard =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
            "guard" &&
          unit.battleUnitId ===
            nextBattleState
              .selectedUnitId
        );
      });

  if (
    !previousGuard ||
    !currentGuard
  ) {
    return nextBattleState;
  }

  const positionChanged =
    previousGuard.tileX !==
      currentGuard.tileX ||
    previousGuard.tileY !==
      currentGuard.tileY;

  if (!positionChanged) {
    return nextBattleState;
  }

  const reachedTargetD =
    currentGuard.tileX ===
      PHASE_3_GUARD_TARGET_D.x &&
    currentGuard.tileY ===
      PHASE_3_GUARD_TARGET_D.y;

  if (!reachedTargetD) {
    return nextBattleState;
  }

  const movementApObserved =
    currentGuard
      .movementApCommitted ===
      true &&
    nextBattleState.teamApCurrent ===
      nextBattleState
        .teamApCapacity - 1;

  if (!movementApObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "open_action_menu",

      targetTile: null,

      prompt:
        "Open the Action menu.",

      evidence: {
        ...tutorialState.evidence,

        phase3ReachedGuardTargetD:
          true,

        phase3GuardMovementApObserved:
          true
      }
    }
  };
}

export function recordTutorialActionMenuOpened(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_3_turn_intent_combat" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "open_action_menu"
  ) {
    return nextBattleState;
  }

  const selectedGuard =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            nextBattleState
              .selectedUnitId &&
          unit.unitDefId ===
            "guard"
        );
      });

  const actionMenuObserved =
    selectedGuard &&
    nextBattleState
      .battleControlState ===
      "action_menu_open" &&
    nextBattleState
      .actionMenuIndex ===
      0;

  if (!actionMenuObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "select_attack",

      prompt:
        "Select Attack.",

      evidence: {
        ...tutorialState.evidence,

        phase3ActionMenuOpened:
          true
      }
    }
  };
}

export function recordTutorialAttackTargeting(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_3_turn_intent_combat" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "select_attack"
  ) {
    return nextBattleState;
  }

  const selectedTarget =
    nextBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            nextBattleState
              .targetUnitId
        );
      });

  const attackTargetingObserved =
    nextBattleState
      .battleControlState ===
      "attack_targeting" &&
    nextBattleState
      .selectedAction ===
      "attack" &&
    selectedTarget?.unitDefId ===
      "sword_enemy" &&
    selectedTarget.currentHP > 0;

  if (!attackTargetingObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "select_sword_target",

      prompt:
        "Select the Sword.",

      evidence: {
        ...tutorialState.evidence,

        phase3AttackSelected:
          true,

        phase3SwordTargetSelected:
          true
      }
    }
  };
}

export function recordTutorialBasicAttack(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_3_turn_intent_combat" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "select_sword_target"
  ) {
    return nextBattleState;
  }

  const previousGuard =
    previousBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
            "guard"
        );
      });

  const currentGuard =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousGuard
              ?.battleUnitId
        );
      });

  const previousSword =
    previousBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
            "sword_enemy"
        );
      });

  const currentSword =
    nextBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousSword
              ?.battleUnitId
        );
      });

  if (
    !previousGuard ||
    !currentGuard ||
    !previousSword ||
    !currentSword
  ) {
    return nextBattleState;
  }

  const damageObserved =
    Math.max(
      0,
      previousSword.currentHP -
        currentSword.currentHP
    );

  const attackObserved =
    damageObserved > 0 &&
    nextBattleState.teamApCurrent ===
      previousBattleState
        .teamApCurrent - 1 &&
    previousGuard
      .movementLocked ===
      false &&
    currentGuard
      .movementLocked ===
      true &&
    currentGuard.tileX ===
      previousGuard.tileX &&
    currentGuard.tileY ===
      previousGuard.tileY;

  if (!attackObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "explain_attack_movement_lock",

      targetTile: null,

      prompt:
        "After attacking, this unit can no longer move this turn.",

      evidence: {
        ...tutorialState.evidence,

        phase3AttackObserved:
          true,

        phase3AttackDamage:
          damageObserved,

        phase3AttackApSpendObserved:
          true,

        phase3MovementLockObserved:
          true
      }
    }
  };
}

export function recordTutorialPhase4AttackAttempt(
  previousBattleState,
  nextBattleState,
  attackCandidates = []
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_4_tactical_space" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "try_archer_attack_outside_atr"
  ) {
    return nextBattleState;
  }

  const selectedArcher =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            nextBattleState
              .selectedUnitId &&
          unit.unitDefId ===
            "archer"
        );
      });

  const swordCandidate =
    attackCandidates.find(
      (targetData) => {
        return (
          targetData
            .unit
            .unitDefId ===
          "sword_enemy"
        );
      }
    );

  const outsideAtrObserved =
    selectedArcher &&
    swordCandidate &&
    swordCandidate.rangeValid ===
      false &&
    swordCandidate.invalidReason ===
      "outside_atr" &&
    nextBattleState
      .battleControlState ===
      "action_menu_open";

  if (!outsideAtrObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "explain_archer_atr",

      targetTile: null,

      prompt:
        "Attack Range (ATR) shows how far a unit can attack.",

      evidence: {
        ...tutorialState.evidence,

        phase4OutsideAtrObserved:
          true
      }
    }
  };
}

export function recordTutorialPhase4PlayerMovement(
  previousBattleState,
  nextBattleState,
  attackCandidates = []
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    nextBattleState
      .tutorialState
      .phaseId !==
      "phase_4_tactical_space"
  ) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  const movementTask =
    tutorialState.taskId;

  const isRedTask =
    movementTask ===
      "move_archer_to_red_cover";

  const isYellowTask =
    movementTask ===
      "move_archer_to_yellow_cover";

  const isGreenTask =
    movementTask ===
      "move_archer_to_green_clear";

  if (
    !isRedTask &&
    !isYellowTask &&
    !isGreenTask
  ) {
    return nextBattleState;
  }

  const previousArcher =
    previousBattleState
      ?.playerUnits
      ?.find((unit) => {
        return (
          unit.battleUnitId ===
            previousBattleState
              .selectedUnitId &&
          unit.unitDefId ===
            "archer"
        );
      });

  const currentArcher =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            nextBattleState
              .selectedUnitId &&
          unit.unitDefId ===
            "archer"
        );
      });

  if (
    !previousArcher ||
    !currentArcher
  ) {
    return nextBattleState;
  }

  const positionChanged =
    previousArcher.tileX !==
      currentArcher.tileX ||
    previousArcher.tileY !==
      currentArcher.tileY;

  if (!positionChanged) {
    return nextBattleState;
  }

  const swordCandidate =
    attackCandidates.find(
      (targetData) => {
        return (
          targetData
            .unit
            .unitDefId ===
          "sword_enemy"
        );
      }
    );

  if (!swordCandidate) {
    return nextBattleState;
  }

  if (isRedTask) {
    const reachedRed =
      currentArcher.tileX ===
        PHASE_4_ARCHER_RED_TARGET.x &&
      currentArcher.tileY ===
        PHASE_4_ARCHER_RED_TARGET.y;

    const fullCoverObserved =
      reachedRed &&
      currentArcher
        .movementApCommitted ===
        true &&
      swordCandidate.rangeValid ===
        true &&
      swordCandidate.actionValid ===
        true &&
      swordCandidate
        .pathResult
        ?.outcome ===
        "full_cover";

    if (!fullCoverObserved) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "explain_full_cover",

        targetTile: null,

        prompt:
          "Red means Full Cover.",

        evidence: {
          ...tutorialState.evidence,

          phase4ReachedRedTarget:
            true,

          phase4FullCoverObserved:
            true
        }
      }
    };
  }

  if (isYellowTask) {
    const reachedYellow =
      currentArcher.tileX ===
        PHASE_4_ARCHER_YELLOW_TARGET.x &&
      currentArcher.tileY ===
        PHASE_4_ARCHER_YELLOW_TARGET.y;

    const partialCoverObserved =
      reachedYellow &&
      swordCandidate.rangeValid ===
        true &&
      swordCandidate.actionValid ===
        true &&
      swordCandidate
        .pathResult
        ?.outcome ===
        "partial_cover";

    if (!partialCoverObserved) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "explain_partial_cover",

        targetTile: null,

        prompt:
          "Yellow means Partial Cover.",

        evidence: {
          ...tutorialState.evidence,

          phase4ReachedYellowTarget:
            true,

          phase4PartialCoverObserved:
            true
        }
      }
    };
  }

  const reachedGreen =
    currentArcher.tileX ===
      PHASE_4_ARCHER_GREEN_TARGET.x &&
    currentArcher.tileY ===
      PHASE_4_ARCHER_GREEN_TARGET.y;

  const clearShotObserved =
    reachedGreen &&
    swordCandidate.rangeValid ===
      true &&
    swordCandidate.actionValid ===
      true &&
    swordCandidate
      .pathResult
      ?.outcome ===
      "clear" &&
    swordCandidate
      .pathResult
      ?.coverPercentage ===
      0;

  if (!clearShotObserved) {
    return nextBattleState;
  }

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "explain_clear_shot",

      targetTile: null,

      prompt:
        "Green means no Cover is affecting the shot.",

      evidence: {
        ...tutorialState.evidence,

        phase4ReachedGreenTarget:
          true,

        phase4ClearShotObserved:
          true
      }
    }
  };
}

export function recordTutorialPhase4AttackTargeting(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_4_tactical_space" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "attack_sword_from_clear"
  ) {
    return nextBattleState;
  }

  const target =
    nextBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            nextBattleState
              .targetUnitId
        );
      });

  const targetingObserved =
    nextBattleState
      .battleControlState ===
      "attack_targeting" &&
    nextBattleState
      .selectedAction ===
      "attack" &&
    target?.unitDefId ===
      "sword_enemy";

  if (!targetingObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "confirm_sword_attack_from_clear",

      prompt:
        "Attack the Sword.",

      evidence: {
        ...tutorialState.evidence,

        phase4AttackTargetingObserved:
          true
      }
    }
  };
}

export function recordTutorialPhase4BasicAttack(
  previousBattleState,
  nextBattleState,
  selectedTargetData = null
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_4_tactical_space" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "confirm_sword_attack_from_clear"
  ) {
    return nextBattleState;
  }

  const previousArcher =
    previousBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousBattleState
              .selectedUnitId &&
          unit.unitDefId ===
            "archer"
        );
      });

  const currentArcher =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousArcher
              ?.battleUnitId
        );
      });

  const previousSword =
    previousBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            selectedTargetData
              ?.unit
              ?.battleUnitId &&
          unit.unitDefId ===
            "sword_enemy"
        );
      });

  const currentSword =
    nextBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousSword
              ?.battleUnitId
        );
      });

  if (
    !previousArcher ||
    !currentArcher ||
    !previousSword ||
    !currentSword ||
    !selectedTargetData
  ) {
    return nextBattleState;
  }

  const clearCandidateObserved =
    selectedTargetData.actionValid ===
      true &&
    selectedTargetData
      .pathResult
      ?.outcome ===
      "clear" &&
    selectedTargetData
      .pathResult
      ?.coverPercentage ===
      0;

  const damageObserved =
    Math.max(
      0,
      previousSword.currentHP -
        currentSword.currentHP
    );

  const attackObserved =
    clearCandidateObserved &&
    damageObserved > 0 &&
    nextBattleState.teamApCurrent ===
      previousBattleState
        .teamApCurrent - 1 &&
    previousArcher
      .movementLocked ===
      false &&
    currentArcher
      .movementLocked ===
      true;

  if (!attackObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "phase_4_attack_checkpoint",

      targetTile: null,

      prompt:
        "Green means no Cover is affecting the shot.",

      evidence: {
        ...tutorialState.evidence,

        phase4AttackObserved:
          true,

        phase4AttackDamage:
          damageObserved,

        phase4AttackApSpendObserved:
          true,

        phase4MovementLockObserved:
          true
      }
    }
  };
}

export function recordTutorialPhase5EndTurn(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_4_tactical_space" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "end_turn_for_phase5"
  ) {
    return nextBattleState;
  }

  const playerPositionsPreserved =
    previousBattleState
      .playerUnits
      .every((previousUnit) => {
        const nextUnit =
          nextBattleState
            .playerUnits
            .find((unit) => {
              return (
                unit.battleUnitId ===
                  previousUnit
                    .battleUnitId
              );
            });

        if (!nextUnit) {
          return false;
        }

        return (
          nextUnit.tileX ===
            previousUnit.tileX &&
          nextUnit.tileY ===
            previousUnit.tileY
        );
      });

  const endTurnObserved =
    previousBattleState.phase ===
      "player_phase" &&
    nextBattleState.phase ===
      "enemy_phase" &&
    nextBattleState.teamApCurrent ===
      0 &&
    playerPositionsPreserved;

  if (!endTurnObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      phaseId:
        "phase_5_dynamic_threat_reading",

      taskId:
        "phase5_enemy_turn",

      targetTile: null,

      intentPulseEnemyId:
        null,

      prompt:
        "ENEMY TURN",

      evidence: {
        ...tutorialState.evidence,

        phase5EndTurnObserved:
          true
      }
    }
  };
}

export function recordTutorialPhase5EnemyResolution(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_5_dynamic_threat_reading" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "phase5_enemy_turn"
  ) {
    return nextBattleState;
  }

  const previousGuard =
    previousBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
            "guard"
        );
      });

  const nextGuard =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousGuard
              ?.battleUnitId
        );
      });

  const previousArcher =
    previousBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
            "archer"
        );
      });

  const nextArcher =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousArcher
              ?.battleUnitId
        );
      });

  const nextSword =
    nextBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
            "sword_enemy" &&
          unit.currentHP > 0
        );
      });

  if (
    !previousGuard ||
    !nextGuard ||
    !previousArcher ||
    !nextArcher ||
    !nextSword
  ) {
    return nextBattleState;
  }

  const guardDamageObserved =
    Math.max(
      0,

      previousGuard.currentHP -
        nextGuard.currentHP
    );

  const archerUnaffected =
    previousArcher.currentHP ===
      nextArcher.currentHP;

  const playerTurnStarted =
    previousBattleState.phase ===
      "enemy_phase" &&
    nextBattleState.phase ===
      "player_phase" &&
    nextBattleState.turnCount ===
      previousBattleState
        .turnCount + 1;

  const apRefreshed =
    nextBattleState
      .teamApCapacity > 0 &&
    nextBattleState
      .teamApCurrent ===
        nextBattleState
          .teamApCapacity;

  const startGridsRefreshed =
    nextBattleState
      .playerUnits
      .filter((unit) => {
        return unit.currentHP > 0;
      })
      .every((unit) => {
        return (
          unit.startGrid &&
          unit.startGrid.x ===
            unit.tileX &&
          unit.startGrid.y ===
            unit.tileY
        );
      });

  const initialGuardTargetObserved =
    nextSword.currentTargetId ===
      nextGuard.battleUnitId &&
    nextSword
      .currentIntent
      ?.intentType ===
      "basic_attack";

  if (
    guardDamageObserved <= 0 ||
    !archerUnaffected ||
    !playerTurnStarted ||
    !apRefreshed ||
    !startGridsRefreshed ||
    !initialGuardTargetObserved
  ) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "watch_dynamic_intent",

      targetTile: null,

      intentPulseEnemyId:
        null,

      prompt:
        "Watch how the Sword's Intent changes.",

      evidence: {
        ...tutorialState.evidence,

        phase5EnemyAttackObserved:
          true,

        phase5EnemyAttackDamage:
          guardDamageObserved,

        phase5PlayerTurnRefreshObserved:
          true,

        phase5InitialGuardTargetObserved:
          true
      }
    }
  };
}

export function recordTutorialPhase5PlayerMovement(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    nextBattleState
      .tutorialState
      .phaseId !==
      "phase_5_dynamic_threat_reading"
  ) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  const previousSelectedUnit =
    previousBattleState
      ?.playerUnits
      ?.find((unit) => {
        return (
          unit.battleUnitId ===
            previousBattleState
              .selectedUnitId
        );
      });

  const currentSelectedUnit =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            nextBattleState
              .selectedUnitId
        );
      });

  if (
    !previousSelectedUnit ||
    !currentSelectedUnit
  ) {
    return nextBattleState;
  }

  const positionChanged =
    previousSelectedUnit.tileX !==
      currentSelectedUnit.tileX ||
    previousSelectedUnit.tileY !==
      currentSelectedUnit.tileY;

  if (!positionChanged) {
    return nextBattleState;
  }

  if (
    tutorialState.taskId ===
      "watch_dynamic_intent"
  ) {
    const previousSword =
      previousBattleState
        .enemyUnits
        .find((unit) => {
          return (
            unit.unitDefId ===
              "sword_enemy" &&
            unit.currentHP > 0
          );
        });

    const currentSword =
      nextBattleState
        .enemyUnits
        .find((unit) => {
          return (
            unit.battleUnitId ===
              previousSword
                ?.battleUnitId
          );
        });

    const previousTarget =
      previousBattleState
        .playerUnits
        .find((unit) => {
          return (
            unit.battleUnitId ===
              previousSword
                ?.currentTargetId
          );
        });

    const currentTarget =
      nextBattleState
        .playerUnits
        .find((unit) => {
          return (
            unit.battleUnitId ===
              currentSword
                ?.currentTargetId
          );
        });

    if (
      !previousSword ||
      !currentSword ||
      !previousTarget ||
      !currentTarget
    ) {
      return nextBattleState;
    }

    const dynamicTargetChanged =
      previousTarget.unitDefId ===
        "guard" &&
      currentTarget.unitDefId ===
        "archer" &&
      previousSword.currentTargetId !==
        currentSword.currentTargetId &&
      currentSword
        .currentIntent
        ?.intentType ===
        "basic_attack";

    if (!dynamicTargetChanged) {
      return nextBattleState;
    }

    return {
      ...nextBattleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "explain_dynamic_intent",

        targetTile: null,

        intentPulseEnemyId:
          currentSword.battleUnitId,

        prompt:
          "Enemy Intent can change when the battlefield changes.",

        evidence: {
          ...tutorialState.evidence,

          phase5DynamicTargetChangeObserved:
            true,

          phase5PreviousTargetId:
            previousTarget
              .battleUnitId,

          phase5CurrentTargetId:
            currentTarget
              .battleUnitId
        }
      }
    };
  }

  if (
    tutorialState.taskId ===
      "respond_to_threat"
  ) {
    return {
      ...nextBattleState,

      tutorialState: {
        ...tutorialState,

        taskId:
          "phase_5_complete_checkpoint",

        targetTile: null,

        intentPulseEnemyId:
          null,

        prompt:
          "Threat response complete.",

        evidence: {
          ...tutorialState.evidence,

          phase5TacticalResponseObserved:
            true,

          phase5ResponseType:
            "reposition"
        }
      }
    };
  }

  return nextBattleState;
}

export function recordTutorialPhase5BasicAttack(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_5_dynamic_threat_reading" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "respond_to_threat"
  ) {
    return nextBattleState;
  }

  const previousAttacker =
    previousBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousBattleState
              .selectedUnitId
        );
      });

  const currentAttacker =
    nextBattleState
      .playerUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousAttacker
              ?.battleUnitId
        );
      });

  const previousTarget =
    previousBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousBattleState
              .targetUnitId
        );
      });

  const currentTarget =
    nextBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.battleUnitId ===
            previousTarget
              ?.battleUnitId
        );
      });

  if (
    !previousAttacker ||
    !currentAttacker ||
    !previousTarget ||
    !currentTarget
  ) {
    return nextBattleState;
  }

  const attackDamage =
    Math.max(
      0,

      previousTarget.currentHP -
        currentTarget.currentHP
    );

  const attackCommitted =
    previousBattleState
      .battleControlState ===
      "attack_targeting" &&
    nextBattleState.teamApCurrent ===
      previousBattleState
        .teamApCurrent - 1 &&
    previousAttacker
      .movementLocked ===
      false &&
    currentAttacker
      .movementLocked ===
      true &&
    currentTarget.currentHP <=
      previousTarget.currentHP;

  if (!attackCommitted) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "phase_5_complete_checkpoint",

      targetTile: null,

      intentPulseEnemyId:
        null,

      prompt:
        "Threat response complete.",

      evidence: {
        ...tutorialState.evidence,

        phase5TacticalResponseObserved:
          true,

        phase5ResponseType:
          "attack",

        phase5ResponseAttackDamage:
          attackDamage
      }
    }
  };
}

export function recordTutorialEndTurn(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_3_turn_intent_combat" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "end_player_turn"
  ) {
    return nextBattleState;
  }

  const playerPositionsPreserved =
    previousBattleState
      .playerUnits
      .every((previousUnit) => {
        const nextUnit =
          nextBattleState
            .playerUnits
            .find((unit) => {
              return (
                unit.battleUnitId ===
                previousUnit.battleUnitId
              );
            });

        if (!nextUnit) {
          return false;
        }

        return (
          nextUnit.tileX ===
            previousUnit.tileX &&
          nextUnit.tileY ===
            previousUnit.tileY
        );
      });

  const endTurnObserved =
    previousBattleState.phase ===
      "player_phase" &&
    nextBattleState.phase ===
      "enemy_phase" &&
    previousBattleState.teamApCurrent >
      0 &&
    nextBattleState.teamApCurrent ===
      0 &&
    playerPositionsPreserved;

  if (!endTurnObserved) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "enemy_turn_checkpoint",

      targetTile: null,

      prompt:
        "ENEMY TURN",

      evidence: {
        ...tutorialState.evidence,

        phase3EndTurnObserved: true,

        phase3DiscardedAp:
          previousBattleState
            .teamApCurrent
      }
    }
  };
}

export function recordTutorialEnemyResolution(
  previousBattleState,
  nextBattleState
) {
  if (
    !isTutorialBattle(
      nextBattleState
    ) ||
    previousBattleState
      ?.tutorialState
      ?.phaseId !==
      "phase_3_turn_intent_combat" ||
    previousBattleState
      ?.tutorialState
      ?.taskId !==
      "enemy_resolution_ready"
  ) {
    return nextBattleState;
  }

  const previousSword =
    previousBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
  "sword_enemy" &&
          unit.currentHP > 0
        );
      });

  const nextSword =
    nextBattleState
      .enemyUnits
      .find((unit) => {
        return (
          unit.unitDefId ===
            "sword_enemy" &&
          unit.currentHP > 0
        );
      });

  if (
    !previousSword ||
    !nextSword
  ) {
    return nextBattleState;
  }

  const swordMoved =
    previousSword.tileX !==
      nextSword.tileX ||
    previousSword.tileY !==
      nextSword.tileY;

  const noPlayerDamage =
    previousBattleState
      .playerUnits
      .every((previousUnit) => {
        const nextUnit =
          nextBattleState
            .playerUnits
            .find((unit) => {
              return (
                unit.battleUnitId ===
                  previousUnit.battleUnitId
              );
            });

        if (!nextUnit) {
          return false;
        }

        return (
          nextUnit.currentHP ===
            previousUnit.currentHP
        );
      });

  const playerTurnStarted =
    previousBattleState.phase ===
      "enemy_phase" &&
    nextBattleState.phase ===
      "player_phase" &&
    nextBattleState.turnCount ===
      previousBattleState.turnCount + 1;

  const apRefreshed =
    nextBattleState.teamApCapacity >
      0 &&
    nextBattleState.teamApCurrent ===
      nextBattleState.teamApCapacity;

  const startGridsRefreshed =
    nextBattleState
      .playerUnits
      .filter((unit) => {
        return unit.currentHP > 0;
      })
      .every((unit) => {
        return (
          unit.startGrid &&
          unit.startGrid.x ===
            unit.tileX &&
          unit.startGrid.y ===
            unit.tileY
        );
      });

  if (
    !swordMoved ||
    !noPlayerDamage ||
    !playerTurnStarted ||
    !apRefreshed ||
    !startGridsRefreshed
  ) {
    return nextBattleState;
  }

  const tutorialState =
    nextBattleState.tutorialState;

  return {
    ...nextBattleState,

    tutorialState: {
      ...tutorialState,

      taskId:
        "explain_ap_refresh",

      targetTile: null,

      prompt:
        "AP refreshes at the start of your turn.",

      evidence: {
        ...tutorialState.evidence,

        phase3EnemyMovementObserved:
          true,

        phase3NoEnemyAttackObserved:
          true,

        phase3ApRefreshObserved:
          true
      }
    }
  };
}

export function shouldPauseTutorialEnemyResolution(
  battleState
) {
  if (
    !isTutorialBattle(
      battleState
    ) ||
    battleState.phase !==
      "enemy_phase" ||
    battleState
      .tutorialState
      .phaseId !==
      "phase_3_turn_intent_combat"
  ) {
    return false;
  }

  return (
    battleState
      .tutorialState
      .taskId !==
      "enemy_resolution_ready"
  );
}

export function isTutorialInputAllowed(
  battleState,
  inputType
) {
  if (
    !isTutorialBattle(
      battleState
    )
  ) {
    return true;
  }

  const tutorialState =
    battleState.tutorialState;

  if (
    tutorialState.phaseId ===
    "phase_1_control_orientation"
  ) {
    if (
      tutorialState.taskId ===
      "look_around"
    ) {
      return (
        inputType ===
        "mouse_look"
      );
    }

    if (
      tutorialState.taskId ===
        "switch_to_archer" ||
      tutorialState.taskId ===
        "switch_back_to_guard"
    ) {
      return (
        inputType ===
        "switch_unit"
      );
    }

    return false;
  }

  if (
    tutorialState.phaseId ===
    "phase_2_shared_ap_movement"
  ) {
    if (
  tutorialState.taskId ===
    "move_guard_to_target_a" ||
  tutorialState.taskId ===
    "return_guard_to_start" ||
  tutorialState.taskId ===
    "move_archer_to_target_b" ||
  tutorialState.taskId ===
    "move_guard_to_target_c"
) {
      return (
        inputType ===
        "movement_keyboard"
      );
    }

        if (
      tutorialState.taskId ===
        "switch_to_archer_for_target_b" ||
      tutorialState.taskId ===
        "switch_back_to_guard_for_target_c"
    ) {
      return (
        inputType ===
        "switch_unit"
      );
    }

    return false;
  }

  if (
    tutorialState.phaseId ===
      "phase_3_turn_intent_combat"
  ) {
    if (
      tutorialState.taskId ===
        "end_player_turn"
    ) {
      return (
        inputType ===
        "end_turn"
      );
    }

    if (
      tutorialState.taskId ===
        "move_guard_to_target_d"
    ) {
      return (
        inputType ===
        "movement_keyboard"
      );
    }

    if (
      tutorialState.taskId ===
        "open_action_menu"
    ) {
      return (
        inputType ===
        "open_action_menu"
      );
    }

    if (
      tutorialState.taskId ===
        "select_attack" ||
      tutorialState.taskId ===
        "select_sword_target"
    ) {
      return (
        inputType ===
        "confirm_action"
      );
    }

    return false;
  }
    if (
    tutorialState.phaseId ===
      "phase_4_tactical_space"
  ) {
    if (
      tutorialState.taskId ===
        "switch_to_archer_for_tactical_space"
    ) {
      return (
        inputType ===
        "switch_unit"
      );
    }

    if (
      tutorialState.taskId ===
        "try_archer_attack_outside_atr"
    ) {
      return (
        inputType ===
          "open_action_menu" ||
        inputType ===
          "confirm_action" ||
        inputType ===
          "back_action"
      );
    }

    if (
      tutorialState.taskId ===
        "move_archer_to_red_cover" ||
      tutorialState.taskId ===
        "move_archer_to_yellow_cover" ||
      tutorialState.taskId ===
        "move_archer_to_green_clear"
    ) {
      return (
        inputType ===
          "movement_keyboard" ||
        inputType ===
          "open_action_menu" ||
        inputType ===
          "confirm_action" ||
        inputType ===
          "back_action"
      );
    }

    if (
      tutorialState.taskId ===
        "attack_sword_from_clear"
    ) {
      return (
        inputType ===
          "open_action_menu" ||
        inputType ===
          "confirm_action" ||
        inputType ===
          "back_action"
      );
    }

    if (
      tutorialState.taskId ===
        "confirm_sword_attack_from_clear"
    ) {
      return (
        inputType ===
          "confirm_action"
      );
    }
        if (
      tutorialState.taskId ===
        "end_turn_for_phase5"
    ) {
      return (
        inputType ===
          "end_turn"
      );
    }

    return false;
  }
  if (
    tutorialState.phaseId ===
      "phase_5_dynamic_threat_reading"
  ) {
    if (
      tutorialState.taskId ===
        "watch_dynamic_intent"
    ) {
      return (
        inputType ===
          "movement_keyboard"
      );
    }

    if (
      tutorialState.taskId ===
        "respond_to_threat"
    ) {
      return (
        inputType ===
          "movement_keyboard" ||
        inputType ===
          "switch_unit" ||
        inputType ===
          "open_action_menu" ||
        inputType ===
          "confirm_action" ||
        inputType ===
          "back_action"
      );
    }

    return false;
  }
  return true;
}