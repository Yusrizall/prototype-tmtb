import {
  createEnemyBattleUnitFromSpawn
} from "../battle/battleSetup.js";

import {
  isUnitStunned,
  getUnitStatus
} from "../battle/statusLogic.js";

const PHASE_7_ID = "phase_7_status_temporal_threat";

function isTutorialBattle(battleState) {
  return battleState?.flowContext === "tutorial" && Boolean(battleState?.tutorialState);
}

function isPhase7Battle(battleState) {
  return isTutorialBattle(battleState) && battleState.tutorialState.phaseId === PHASE_7_ID;
}

function getUnitByDefId(battleState, unitDefId) {
  return battleState?.playerUnits?.find((unit) => unit.unitDefId === unitDefId) ?? null;
}

function getBlueEnemy(battleState) {
  const blueId = battleState?.tutorialState?.phase7Entities?.blueEnemyId;
  return battleState?.enemyUnits?.find((enemy) => enemy.battleUnitId === blueId) ?? null;
}

function getPhase7Config(battleState) {
  return battleState?.tutorialState?.phase7Config ?? {
    guardStaging: { x: 12, y: 4 },
    archerStaging: { x: 11, y: 3 },
    archerSafe: { x: 9, y: 2 },
    shockwaveRadius: 2,
    stunPlayerTurns: 2
  };
}

function isAt(unit, position) {
  return Boolean(unit && position && unit.tileX === position.x && unit.tileY === position.y);
}

function mergeEvidence(tutorialState, patch) {
  return {
    ...(tutorialState?.evidence ?? {}),
    ...patch
  };
}

export function initializeTutorialPhase7Content(data, battleState) {
  if (!isTutorialBattle(battleState)) return battleState;

  const content = data?.tutorialEncounter?.phase7Content;
  if (!content) {
    throw new Error("Tutorial Phase 7 content tidak ditemukan.");
  }

  const existingBlue = battleState.enemyUnits?.find((enemy) => enemy.unitDefId === "blue_charger_candidate") ?? null;
  let blue = existingBlue;

  if (!blue) {
    const spawnData = content.enemySpawns?.[0];
    if (!spawnData) throw new Error("Tutorial Phase 7 Blue spawn tidak ditemukan.");
    const nextSpawnOrder = Math.max(0, ...(battleState.enemyUnits ?? []).map((enemy) => enemy.spawnOrder ?? 0)) + 1;
    blue = createEnemyBattleUnitFromSpawn(data.enemyUnits, data.tutorialMap, spawnData, nextSpawnOrder);
    blue = {
      ...blue,
      battleUnitId: spawnData.battleUnitId ?? blue.battleUnitId,
      patternState: {
        patternId: "blue_charge_shockwave",
        active: false,
        chargeProgress: 0,
        chargeGoal: 2,
        shockwaveRadius: content.shockwaveRadius ?? 2,
        stunPlayerTurns: content.stunPlayerTurns ?? 2
      },
      currentTargetId: null,
      currentIntent: null
    };
  }

  const alreadyInitialized = Boolean(battleState.tutorialState?.phase7Entities?.blueEnemyId);
  const selectedUnit = battleState.playerUnits?.find((unit) => unit.battleUnitId === battleState.selectedUnitId) ?? null;
  const initialStagingTarget = selectedUnit?.unitDefId === "archer"
    ? content.archerStaging
    : content.guardStaging;

  return {
    ...battleState,
    enemyUnits: existingBlue ? battleState.enemyUnits : [...battleState.enemyUnits, blue],
    tutorialState: {
      ...battleState.tutorialState,
      targetTile:
        battleState.tutorialState.taskId === "proceed_to_region_c"
          ? { ...initialStagingTarget }
          : battleState.tutorialState.targetTile,
      phase7Entities: {
        blueEnemyId: blue.battleUnitId
      },
      phase7Config: {
        guardStaging: { ...content.guardStaging },
        archerStaging: { ...content.archerStaging },
        archerSafe: { ...content.archerSafe },
        shockwaveRadius: content.shockwaveRadius ?? 2,
        stunPlayerTurns: content.stunPlayerTurns ?? 2
      },
      evidence: alreadyInitialized
        ? battleState.tutorialState.evidence
        : mergeEvidence(battleState.tutorialState, {
            phase7Initialized: true,
            phase7GuardStaged: false,
            phase7ArcherStaged: false,
            phase7ExerciseStarted: false,
            phase7FirstChargeObserved: false,
            phase7SecondChargeObserved: false,
            phase7ShockwaveTelegraphObserved: false,
            phase7ArcherReachedSafety: false,
            phase7ShockwaveResolved: false,
            phase7GuardStunned: false,
            phase7ArcherAvoidedShockwave: false,
            phase7SharedApWithStunObserved: false,
            phase7ArcherAttackObserved: false,
            phase7ArcherAttackDamage: null,
            phase7StunOneObserved: false,
            phase7RecoveryObserved: false,
            phase7Complete: false,
            requiredTwoUnitCurriculumComplete: false
          })
    }
  };
}

export function recordTutorialPhase7PlayerMovement(previousBattleState, nextBattleState) {
  if (!isTutorialBattle(nextBattleState)) return nextBattleState;
  const tutorialState = nextBattleState.tutorialState;
  const config = getPhase7Config(nextBattleState);
  const guard = getUnitByDefId(nextBattleState, "guard");
  const archer = getUnitByDefId(nextBattleState, "archer");

  if (
    tutorialState.phaseId === "phase_6_spear_defensive_cover_objective" &&
    tutorialState.taskId === "proceed_to_region_c" &&
    tutorialState.phase7Entities?.blueEnemyId
  ) {
    const guardStaged = isAt(guard, config.guardStaging);
    const archerStaged = isAt(archer, config.archerStaging);
    if (!guardStaged || !archerStaged) {
      return {
        ...nextBattleState,
        tutorialState: {
          ...tutorialState,
          evidence: mergeEvidence(tutorialState, {
            phase7GuardStaged: guardStaged,
            phase7ArcherStaged: archerStaged
          })
        }
      };
    }

    return {
      ...nextBattleState,
      objectiveState: {
        ...(nextBattleState.objectiveState ?? {}),
        status: "dormant",
        objectiveType: null,
        targetType: null,
        targetId: null,
        label: "—"
      },
      tutorialState: {
        ...tutorialState,
        phaseId: PHASE_7_ID,
        taskId: "end_turn_to_begin_phase7",
        prompt: "End your turn to begin the exercise.",
        targetTile: null,
        evidence: mergeEvidence(tutorialState, {
          phase7GuardStaged: true,
          phase7ArcherStaged: true
        })
      }
    };
  }

  if (isPhase7Battle(nextBattleState) && tutorialState.taskId === "move_archer_to_safety") {
    if (!isAt(archer, config.archerSafe)) return nextBattleState;
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "preserve_guard_in_shockwave",
        prompt: "Leave Guard in position for this exercise.",
        targetTile: null,
        evidence: mergeEvidence(tutorialState, {
          phase7ArcherReachedSafety: true
        })
      }
    };
  }

  return nextBattleState;
}

export function isTutorialPhase7CheckpointReady(battleState) {
  return isPhase7Battle(battleState) && battleState.tutorialState.taskId === "end_turn_to_begin_phase7";
}

export function recordTutorialPhase7PlayerEndTurn(previousBattleState, nextBattleState) {
  if (!isPhase7Battle(previousBattleState)) return nextBattleState;
  const taskId = previousBattleState.tutorialState.taskId;
  const mapping = {
    end_turn_to_begin_phase7: "phase7_first_charge_checkpoint",
    end_turn_for_second_charge: "phase7_second_charge_checkpoint",
    end_turn_for_shockwave: "phase7_shockwave_checkpoint",
    end_turn_after_stun_adaptation: "phase7_stun1_checkpoint",
    end_turn_for_recovery: "phase7_recovery_checkpoint"
  };
  const nextTaskId = mapping[taskId];
  if (!nextTaskId) return nextBattleState;
  return {
    ...nextBattleState,
    tutorialState: {
      ...nextBattleState.tutorialState,
      taskId: nextTaskId,
      prompt: null,
      targetTile: null,
      evidence: mergeEvidence(nextBattleState.tutorialState, {
        ...(taskId === "end_turn_to_begin_phase7" ? { phase7ExerciseStarted: true } : {})
      })
    }
  };
}

export function prepareTutorialPhase7EnemyActivation(battleState) {
  if (!isPhase7Battle(battleState) || battleState.phase !== "enemy_phase") return battleState;
  if (battleState.tutorialState.taskId !== "phase7_first_charge_checkpoint") return battleState;
  const blueId = battleState.tutorialState.phase7Entities?.blueEnemyId;
  return {
    ...battleState,
    enemyUnits: battleState.enemyUnits.map((enemy) => {
      if (enemy.battleUnitId !== blueId) return enemy;
      return {
        ...enemy,
        patternState: {
          ...enemy.patternState,
          active: true
        }
      };
    })
  };
}

export function recordTutorialPhase7EnemyActivation(previousBattleState, nextBattleState, event) {
  if (!isPhase7Battle(nextBattleState) || !event) return nextBattleState;
  const tutorialState = nextBattleState.tutorialState;
  const taskId = tutorialState.taskId;
  let evidencePatch = {};

  if (event.eventType === "blue_charge") {
    if (taskId === "phase7_first_charge_checkpoint") evidencePatch.phase7FirstChargeObserved = true;
    if (taskId === "phase7_second_charge_checkpoint" || taskId === "phase7_recovery_checkpoint") evidencePatch.phase7SecondChargeObserved = true;
  }

  if (event.eventType === "blue_shockwave" && taskId === "phase7_shockwave_checkpoint") {
    const guard = getUnitByDefId(nextBattleState, "guard");
    const archer = getUnitByDefId(nextBattleState, "archer");
    const affected = new Set(event.affectedUnitIds ?? []);
    evidencePatch = {
      ...evidencePatch,
      phase7ShockwaveResolved: true,
      phase7GuardStunned: Boolean(guard && affected.has(guard.battleUnitId)),
      phase7ArcherAvoidedShockwave: Boolean(archer && !affected.has(archer.battleUnitId))
    };
  }

  return {
    ...nextBattleState,
    tutorialState: {
      ...tutorialState,
      evidence: mergeEvidence(tutorialState, evidencePatch)
    }
  };
}

export function recordTutorialPhase7PlayerTurnStart(previousBattleState, nextBattleState) {
  if (!isPhase7Battle(nextBattleState)) return nextBattleState;
  const previousTask = previousBattleState?.tutorialState?.taskId;
  const tutorialState = nextBattleState.tutorialState;
  const guard = getUnitByDefId(nextBattleState, "guard");
  const blue = getBlueEnemy(nextBattleState);

  if (previousTask === "phase7_first_charge_checkpoint") {
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "introduce_blue_charge",
        prompt: "CHARGE is an enemy Intent that builds over multiple Enemy Turns."
      }
    };
  }

  if (previousTask === "phase7_second_charge_checkpoint") {
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "explain_charge_complete",
        prompt: "CHARGE is complete.",
        evidence: mergeEvidence(tutorialState, { phase7ShockwaveTelegraphObserved: blue?.currentIntent?.intentType === "blue_shockwave" })
      }
    };
  }

  if (previousTask === "phase7_shockwave_checkpoint") {
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "introduce_guard_stun",
        prompt: "Guard is Stunned.",
        evidence: mergeEvidence(tutorialState, {
          phase7SharedApWithStunObserved: isUnitStunned(guard) && nextBattleState.teamApCapacity === 4
        })
      }
    };
  }

  if (previousTask === "phase7_stun1_checkpoint") {
    const stun = getUnitStatus(guard, "stun");
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "explain_stun_persistence",
        prompt: "Guard is still Stunned.",
        evidence: mergeEvidence(tutorialState, { phase7StunOneObserved: stun?.remainingPlayerTurns === 1 })
      }
    };
  }

  if (previousTask === "phase7_recovery_checkpoint") {
    return {
      ...nextBattleState,
      tutorialState: {
        ...tutorialState,
        taskId: "explain_guard_recovery",
        prompt: "Guard has recovered.",
        evidence: mergeEvidence(tutorialState, {
          phase7RecoveryObserved: !isUnitStunned(guard),
          phase7Complete: !isUnitStunned(guard),
          requiredTwoUnitCurriculumComplete: !isUnitStunned(guard)
        })
      }
    };
  }

  return nextBattleState;
}

export function advanceTutorialPhase7Brief(battleState) {
  if (!isPhase7Battle(battleState)) return battleState;
  const tutorialState = battleState.tutorialState;
  const config = getPhase7Config(battleState);
  const transitions = {
    introduce_blue_charge: { taskId: "explain_charge_progress", prompt: "The number shows its progress toward completion." },
    explain_charge_progress: { taskId: "explain_charge_delayed_payoff", prompt: "Charge does not resolve its payoff immediately." },
    explain_charge_delayed_payoff: { taskId: "explain_charge_preparation_window", prompt: "Charge gives you time to prepare before its payoff." },
    explain_charge_preparation_window: { taskId: "explain_charge_next_intent", prompt: "When Charge finishes, the prepared action becomes the enemy's next Intent." },
    explain_charge_next_intent: { taskId: "end_turn_for_second_charge", prompt: "End your turn." },
    explain_charge_complete: { taskId: "explain_shockwave_current_intent", prompt: "SHOCKWAVE is now the enemy's Current Intent." },
    explain_shockwave_current_intent: { taskId: "explain_shockwave_stun", prompt: "Shockwave applies Stun to units inside its area." },
    explain_shockwave_stun: { taskId: "move_archer_to_safety", prompt: "Move Archer out of the Shockwave area.", targetTile: config.archerSafe },
    preserve_guard_in_shockwave: { taskId: "end_turn_for_shockwave", prompt: "End your turn.", targetTile: null },
    introduce_guard_stun: { taskId: "explain_stun_duration_2", prompt: "STUN 2 means Guard will remain Stunned for 2 Player Turns." },
    explain_stun_duration_2: { taskId: "explain_stun_shared_ap", prompt: "Stunned units cannot act, but they still contribute Team AP." },
    explain_stun_shared_ap: { taskId: "switch_to_archer_for_stun_adaptation", prompt: "Press Q to switch to Archer." },
    explain_stun_persistence: { taskId: "explain_stun_duration_1", prompt: "STUN 1 means 1 Player Turn remains." },
    explain_stun_duration_1: { taskId: "end_turn_for_recovery", prompt: "End your turn." },
    explain_guard_recovery: { taskId: "phase_7_complete_hold", prompt: "PROTOTYPE ONLY\nPhase 7 complete. Phase 8 is not implemented yet." }
  };
  const transition = transitions[tutorialState.taskId];
  if (!transition) return battleState;
  return {
    ...battleState,
    tutorialState: {
      ...tutorialState,
      ...transition
    }
  };
}

export function recordTutorialPhase7UnitSelection(battleState) {
  if (!isTutorialBattle(battleState)) return battleState;
  const tutorialState = battleState.tutorialState;

  if (
    tutorialState.phaseId === "phase_6_spear_defensive_cover_objective" &&
    tutorialState.taskId === "proceed_to_region_c" &&
    tutorialState.phase7Entities?.blueEnemyId
  ) {
    const selected = battleState.playerUnits.find((unit) => unit.battleUnitId === battleState.selectedUnitId) ?? null;
    const config = getPhase7Config(battleState);
    const target = selected?.unitDefId === "archer" ? config.archerStaging : config.guardStaging;
    return {
      ...battleState,
      tutorialState: {
        ...tutorialState,
        targetTile: { ...target }
      }
    };
  }

  if (!isPhase7Battle(battleState)) return battleState;
  if (tutorialState.taskId !== "switch_to_archer_for_stun_adaptation") return battleState;
  const selected = battleState.playerUnits.find((unit) => unit.battleUnitId === battleState.selectedUnitId) ?? null;
  if (selected?.unitDefId !== "archer") return battleState;
  return {
    ...battleState,
    tutorialState: {
      ...tutorialState,
      taskId: "attack_blue_once",
      prompt: "Attack Blue with Archer."
    }
  };
}

export function recordTutorialPhase7PlayerAttack(previousBattleState, nextBattleState, attackEvent = null) {
  if (!isPhase7Battle(nextBattleState) || previousBattleState?.tutorialState?.taskId !== "attack_blue_once" || !attackEvent) {
    return nextBattleState;
  }
  const archer = getUnitByDefId(nextBattleState, "archer");
  const blue = getBlueEnemy(nextBattleState);
  if (!archer || !blue || attackEvent.attackerId !== archer.battleUnitId || attackEvent.targetId !== blue.battleUnitId || attackEvent.finalDamage <= 0) {
    return nextBattleState;
  }
  return {
    ...nextBattleState,
    tutorialState: {
      ...nextBattleState.tutorialState,
      taskId: "end_turn_after_stun_adaptation",
      prompt: "End your turn.",
      evidence: mergeEvidence(nextBattleState.tutorialState, {
        phase7ArcherAttackObserved: true,
        phase7ArcherAttackDamage: attackEvent.finalDamage
      })
    }
  };
}

export function isTutorialPhase7InputAllowed(battleState, inputType) {
  if (!isPhase7Battle(battleState)) return true;
  if (battleState.battleControlState === "battle_result") return true;
  const taskId = battleState.tutorialState.taskId;

  if (["end_turn_to_begin_phase7", "end_turn_for_second_charge", "end_turn_for_shockwave", "end_turn_after_stun_adaptation", "end_turn_for_recovery"].includes(taskId)) {
    return inputType === "end_turn";
  }
  if (taskId === "move_archer_to_safety") {
    if (inputType === "switch_unit") return true;
    if (inputType !== "movement_keyboard") return false;
    const selected = battleState.playerUnits.find((unit) => unit.battleUnitId === battleState.selectedUnitId) ?? null;
    return selected?.unitDefId === "archer";
  }
  if (taskId === "switch_to_archer_for_stun_adaptation") return inputType === "switch_unit";
  if (taskId === "attack_blue_once") {
    if (inputType === "movement_keyboard" && battleState.battleControlState === "attack_targeting") return true;
    return ["open_action_menu", "confirm_action", "back_action"].includes(inputType);
  }
  return false;
}

export function isTutorialPhase7BasicAttackTargetAllowed(battleState, targetData) {
  if (!isPhase7Battle(battleState)) return true;
  if (battleState.tutorialState.taskId !== "attack_blue_once") return true;
  return targetData?.targetType === "unit" && targetData?.targetId === battleState.tutorialState.phase7Entities?.blueEnemyId;
}

export function shouldPauseTutorialPhase7EnemyResolution(battleState) {
  if (!isPhase7Battle(battleState) || battleState.phase !== "enemy_phase") return false;
  return ![
    "phase7_first_charge_checkpoint",
    "phase7_second_charge_checkpoint",
    "phase7_shockwave_checkpoint",
    "phase7_stun1_checkpoint",
    "phase7_recovery_checkpoint"
  ].includes(battleState.tutorialState.taskId);
}

export function getTutorialRequiredActorFailure(battleState) {
  if (!isTutorialBattle(battleState)) return { failed: false, defeatedUnitId: null, defeatedUnitName: null };
  const phaseId = battleState.tutorialState.phaseId ?? "";
  const relevant = phaseId.startsWith("phase_6_") || phaseId.startsWith("phase_7_");
  if (!relevant || battleState.tutorialState.evidence?.requiredTwoUnitCurriculumComplete === true) {
    return { failed: false, defeatedUnitId: null, defeatedUnitName: null };
  }
  const defeated = battleState.playerUnits.find((unit) => (unit.unitDefId === "guard" || unit.unitDefId === "archer") && unit.currentHP <= 0) ?? null;
  return {
    failed: Boolean(defeated),
    defeatedUnitId: defeated?.battleUnitId ?? null,
    defeatedUnitName: defeated?.name ?? null
  };
}
