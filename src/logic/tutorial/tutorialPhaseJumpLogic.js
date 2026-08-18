import {
  createInitialBattleState
} from "../battle/battleSetup.js";
import {
  createInitialTutorialState
} from "./tutorialFlow.js";
import {
  initializeTutorialPhase6Content
} from "./tutorialPhase6Logic.js";

export const TUTORIAL_PHASE_JUMP_MIN = 1;
export const TUTORIAL_PHASE_JUMP_MAX = 6;

const PHASE_OPTIONS = [
  { phaseNumber: 1, label: "Control / Party" },
  { phaseNumber: 2, label: "Shared AP / Movement" },
  { phaseNumber: 3, label: "Turn / Intent / Basic Combat" },
  { phaseNumber: 4, label: "Tactical Range / Offensive Cover" },
  { phaseNumber: 5, label: "Dynamic Threat / Shared AP Application" },
  { phaseNumber: 6, label: "Spear / Defensive Cover / Objective" }
];

const PHASE_JUMP_ERROR =
  "Available tutorial phases: 1–6.";

export function getTutorialPhaseJumpOptions() {
  return PHASE_OPTIONS.map((option) => ({ ...option }));
}

export function validateTutorialPhaseJumpInput(value) {
  const normalized =
    typeof value === "string"
      ? value.trim()
      : String(value ?? "").trim();

  if (!/^\d+$/.test(normalized)) {
    return {
      valid: false,
      phaseNumber: null,
      errorMessage: PHASE_JUMP_ERROR
    };
  }

  const phaseNumber = Number(normalized);

  if (
    !Number.isInteger(phaseNumber) ||
    phaseNumber < TUTORIAL_PHASE_JUMP_MIN ||
    phaseNumber > TUTORIAL_PHASE_JUMP_MAX
  ) {
    return {
      valid: false,
      phaseNumber: null,
      errorMessage: PHASE_JUMP_ERROR
    };
  }

  return {
    valid: true,
    phaseNumber,
    errorMessage: null
  };
}

export function createFreshTutorialBattleState(data) {
  const tutorialBattleData = {
    ...data,
    stage1Map: data.tutorialMap,
    stage1Encounter: data.tutorialEncounter
  };

  return {
    ...createInitialBattleState(tutorialBattleData),
    stageId: "tutorial_stage",
    flowContext: "tutorial",
    tutorialState: createInitialTutorialState(),
    encounterName: "Tutorial Stage (Placeholder)"
  };
}

function patchUnitByDefId(units, unitDefId, patch) {
  return units.map((unit) => {
    if (unit.unitDefId !== unitDefId) {
      return unit;
    }

    const next = {
      ...unit,
      ...patch
    };

    if (patch.startGrid) {
      next.startGrid = { ...patch.startGrid };
    }

    if (patch.originTile) {
      next.originTile = { ...patch.originTile };
    }

    return next;
  });
}

function getBattleUnitId(state, side, unitDefId) {
  const collection =
    side === "player"
      ? state.playerUnits
      : state.enemyUnits;

  return collection.find((unit) => {
    return unit.unitDefId === unitDefId;
  })?.battleUnitId ?? null;
}

function resetTransientCombatSelection(state) {
  return {
    ...state,
    phase: "player_phase",
    battleControlState: "unit_selected_movement",
    actionMenuIndex: 0,
    selectedAction: null,
    targetIndex: 0,
    targetType: null,
    targetId: null,
    resultState: "ongoing",
    feedbackMessage: null
  };
}

function seedTutorialState(state, patch) {
  return {
    ...state,
    tutorialState: {
      ...state.tutorialState,
      ...patch,
      activeRegionIds:
        patch.activeRegionIds
          ? [...patch.activeRegionIds]
          : state.tutorialState.activeRegionIds,
      targetTile:
        patch.targetTile === undefined
          ? state.tutorialState.targetTile
          : patch.targetTile === null
            ? null
            : { ...patch.targetTile },
      evidence: {
        ...state.tutorialState.evidence,
        ...(patch.evidence ?? {})
      }
    }
  };
}

function buildPhase2Entry(state) {
  const guardId = getBattleUnitId(state, "player", "guard");

  return seedTutorialState(
    {
      ...resetTransientCombatSelection(state),
      selectedUnitId: guardId,
      teamApCurrent: 4,
      teamApCapacity: 4,
      turnCount: 1
    },
    {
      phaseId: "phase_2_shared_ap_movement",
      taskId: "move_guard_to_target_a",
      prompt: "Use WASD to move to the highlighted position.",
      targetTile: { x: 3, y: 10 },
      activeRegionIds: ["A"],
      evidence: {
        lookedLeft: true,
        lookedRight: true,
        lookedUp: true,
        lookedDown: true,
        switchedToArcher: true,
        switchedBackToGuard: true
      }
    }
  );
}

function buildPhase3Entry(state) {
  const guardId = getBattleUnitId(state, "player", "guard");

  let nextState = resetTransientCombatSelection(state);
  nextState = {
    ...nextState,
    teamApCurrent: 2,
    teamApCapacity: 4,
    turnCount: 1,
    selectedUnitId: guardId,
    playerUnits: patchUnitByDefId(
      patchUnitByDefId(nextState.playerUnits, "guard", {
        tileX: 3,
        tileY: 9,
        originTile: { x: 2, y: 10 },
        startGrid: { x: 2, y: 10 },
        movementApCommitted: true,
        movementLocked: false,
        turnState: "positioned",
        hasActed: false
      }),
      "archer",
      {
        tileX: 2,
        tileY: 14,
        originTile: { x: 2, y: 12 },
        startGrid: { x: 2, y: 12 },
        movementApCommitted: true,
        movementLocked: false,
        turnState: "positioned",
        hasActed: false
      }
    )
  };

  return seedTutorialState(nextState, {
    phaseId: "phase_3_turn_intent_combat",
    taskId: "end_player_turn",
    prompt: "When you're done, end your turn.",
    targetTile: null,
    activeRegionIds: ["A"],
    evidence: {
      reachedGuardTargetA: true,
      returnedGuardToStart: true,
      movementApRefundObserved: true,
      phase2SwitchedToArcher: true,
      reachedArcherTargetB: true,
      phase2SwitchedBackToGuard: true,
      guardTargetCApSpendObserved: true,
      reachedGuardTargetC: true,
      sharedTeamApObserved: true
    }
  });
}

function buildPhase4Entry(state) {
  const guardId = getBattleUnitId(state, "player", "guard");

  let nextState = resetTransientCombatSelection(state);
  nextState = {
    ...nextState,
    teamApCurrent: 2,
    teamApCapacity: 4,
    turnCount: 2,
    selectedUnitId: guardId,
    playerUnits: patchUnitByDefId(
      patchUnitByDefId(nextState.playerUnits, "guard", {
        currentHP: 25,
        tileX: 5,
        tileY: 10,
        originTile: { x: 3, y: 9 },
        startGrid: { x: 3, y: 9 },
        movementApCommitted: true,
        movementLocked: true,
        turnState: "positioned",
        hasActed: true
      }),
      "archer",
      {
        currentHP: 18,
        tileX: 2,
        tileY: 14,
        originTile: { x: 2, y: 14 },
        startGrid: { x: 2, y: 14 },
        movementApCommitted: false,
        movementLocked: false,
        turnState: "ready",
        hasActed: false
      }
    ),
    enemyUnits: patchUnitByDefId(nextState.enemyUnits, "sword_enemy", {
      currentHP: 38,
      tileX: 5,
      tileY: 11,
      originTile: { x: 8, y: 11 },
      turnState: "ready",
      hasActed: false
    })
  };

  return seedTutorialState(nextState, {
    phaseId: "phase_4_tactical_space",
    taskId: "switch_to_archer_for_tactical_space",
    prompt: "Press Q to switch to Archer.",
    targetTile: null,
    activeRegionIds: ["A"],
    evidence: {
      phase3EndTurnObserved: true,
      phase3SwordIntroduced: true,
      phase3IntentExplained: true,
      phase3EnemyMovementObserved: true,
      phase3NoEnemyAttackObserved: true,
      phase3ApRefreshObserved: true,
      phase3StartGridRefreshObserved: true,
      phase3ReachedGuardTargetD: true,
      phase3GuardMovementApObserved: true,
      phase3ActionMenuOpened: true,
      phase3AttackSelected: true,
      phase3SwordTargetSelected: true,
      phase3AttackObserved: true,
      phase3AttackDamage: 5,
      phase3AttackApSpendObserved: true,
      phase3MovementLockObserved: true
    }
  });
}

function buildPhase5Entry(state) {
  const archerId = getBattleUnitId(state, "player", "archer");

  let nextState = buildPhase4Entry(state);
  nextState = {
    ...nextState,
    teamApCurrent: 0,
    selectedUnitId: archerId,
    playerUnits: patchUnitByDefId(
      patchUnitByDefId(nextState.playerUnits, "guard", {
        currentHP: 25,
        tileX: 5,
        tileY: 10,
        originTile: { x: 3, y: 9 },
        startGrid: { x: 3, y: 9 },
        movementApCommitted: true,
        movementLocked: true,
        turnState: "positioned",
        hasActed: true
      }),
      "archer",
      {
        currentHP: 18,
        tileX: 5,
        tileY: 13,
        originTile: { x: 2, y: 14 },
        startGrid: { x: 2, y: 14 },
        movementApCommitted: true,
        movementLocked: true,
        turnState: "positioned",
        hasActed: true
      }
    ),
    enemyUnits: patchUnitByDefId(nextState.enemyUnits, "sword_enemy", {
      currentHP: 31,
      tileX: 5,
      tileY: 11,
      originTile: { x: 8, y: 11 },
      turnState: "ready",
      hasActed: false
    })
  };

  return seedTutorialState(nextState, {
    phaseId: "phase_4_tactical_space",
    taskId: "end_turn_for_phase5",
    prompt: "End your turn.",
    targetTile: null,
    activeRegionIds: ["A"],
    evidence: {
      phase4SwitchedToArcher: true,
      phase4OutsideAtrObserved: true,
      phase4ReachedRedTarget: true,
      phase4FullCoverObserved: true,
      phase4ReachedYellowTarget: true,
      phase4PartialCoverObserved: true,
      phase4ReachedGreenTarget: true,
      phase4ClearShotObserved: true,
      phase4AttackTargetingObserved: true,
      phase4AttackObserved: true,
      phase4AttackDamage: 7,
      phase4AttackApSpendObserved: true,
      phase4MovementLockObserved: true
    }
  });
}

function buildPhase6Entry(data, state) {
  const archerId = getBattleUnitId(state, "player", "archer");

  let nextState = resetTransientCombatSelection(state);
  nextState = {
    ...nextState,
    teamApCurrent: 0,
    teamApCapacity: 4,
    turnCount: 4,
    selectedUnitId: archerId,
    playerUnits: patchUnitByDefId(
      patchUnitByDefId(nextState.playerUnits, "guard", {
        currentHP: 18,
        tileX: 6,
        tileY: 12,
        originTile: { x: 6, y: 9 },
        startGrid: { x: 6, y: 9 },
        movementApCommitted: true,
        movementLocked: true,
        turnState: "positioned",
        hasActed: true
      }),
      "archer",
      {
        currentHP: 11,
        tileX: 7,
        tileY: 13,
        originTile: { x: 5, y: 13 },
        startGrid: { x: 5, y: 13 },
        movementApCommitted: true,
        movementLocked: true,
        turnState: "positioned",
        hasActed: true
      }
    ),
    enemyUnits: patchUnitByDefId(nextState.enemyUnits, "sword_enemy", {
      currentHP: 0,
      tileX: 5,
      tileY: 12,
      originTile: { x: 5, y: 11 },
      turnState: "exhausted",
      hasActed: true,
      currentTargetId: null,
      currentIntent: null
    })
  };

  nextState = seedTutorialState(nextState, {
    phaseId: "phase_6_spear_defensive_cover_objective",
    taskId: "phase_6_entry",
    prompt: null,
    targetTile: null,
    activeRegionIds: ["A", "B"],
    evidence: {
      phase5SwordDefeated: true,
      phase5Complete: true
    }
  });

  return initializeTutorialPhase6Content(data, nextState);
}

export function createTutorialPhaseJumpState(data, phaseNumber) {
  const validation = validateTutorialPhaseJumpInput(phaseNumber);

  if (!validation.valid) {
    throw new Error(validation.errorMessage);
  }

  const freshState = createFreshTutorialBattleState(data);

  switch (validation.phaseNumber) {
    case 1:
      return freshState;
    case 2:
      return buildPhase2Entry(freshState);
    case 3:
      return buildPhase3Entry(freshState);
    case 4:
      return buildPhase4Entry(freshState);
    case 5:
      return buildPhase5Entry(freshState);
    case 6:
      return buildPhase6Entry(data, freshState);
    default:
      throw new Error(PHASE_JUMP_ERROR);
  }
}

function normalizePlayerUnit(unit) {
  return {
    unitDefId: unit.unitDefId,
    currentHP: unit.currentHP,
    tileX: unit.tileX,
    tileY: unit.tileY,
    startGrid: unit.startGrid ? { ...unit.startGrid } : null,
    movementApCommitted: unit.movementApCommitted ?? false,
    movementLocked: unit.movementLocked ?? false,
    turnState: unit.turnState ?? null,
    hasActed: unit.hasActed ?? false,
    alive: unit.currentHP > 0
  };
}

function normalizeEnemyUnit(unit) {
  return {
    unitDefId: unit.unitDefId,
    currentHP: unit.currentHP,
    tileX: unit.tileX,
    tileY: unit.tileY,
    currentTargetId: unit.currentTargetId ?? null,
    currentIntent: unit.currentIntent
      ? {
          intentType: unit.currentIntent.intentType ?? null,
          targetId: unit.currentIntent.targetId ?? null
        }
      : null,
    alive: unit.currentHP > 0
  };
}

function normalizeStructure(structure) {
  return {
    battleStructureId: structure.battleStructureId,
    structureDefId: structure.structureDefId,
    currentHP: structure.currentHP,
    targetable: structure.targetable ?? null,
    footprint: (structure.footprint ?? []).map((tile) => ({
      x: tile.x,
      y: tile.y
    }))
  };
}

export function getTutorialPhaseEntryFingerprint(battleState) {
  const tutorialState = battleState?.tutorialState ?? {};
  const objectiveState = battleState?.objectiveState ?? null;

  return {
    phase: battleState?.phase ?? null,
    turnCount: battleState?.turnCount ?? null,
    teamApCurrent: battleState?.teamApCurrent ?? null,
    teamApCapacity: battleState?.teamApCapacity ?? null,
    selectedUnitId: battleState?.selectedUnitId ?? null,
    battleControlState: battleState?.battleControlState ?? null,
    playerUnits: (battleState?.playerUnits ?? [])
      .map(normalizePlayerUnit)
      .sort((a, b) => a.unitDefId.localeCompare(b.unitDefId)),
    enemyUnits: (battleState?.enemyUnits ?? [])
      .map(normalizeEnemyUnit)
      .sort((a, b) => a.unitDefId.localeCompare(b.unitDefId)),
    structures: (battleState?.structures ?? [])
      .map(normalizeStructure)
      .sort((a, b) => a.battleStructureId.localeCompare(b.battleStructureId)),
    tutorial: {
      phaseId: tutorialState.phaseId ?? null,
      taskId: tutorialState.taskId ?? null,
      prompt: tutorialState.prompt ?? null,
      targetTile: tutorialState.targetTile
        ? { ...tutorialState.targetTile }
        : null,
      activeRegionIds: [...(tutorialState.activeRegionIds ?? [])],
      status: tutorialState.status ?? null
    },
    objective: objectiveState
      ? {
          status: objectiveState.status ?? null,
          objectiveType: objectiveState.objectiveType ?? null,
          targetType: objectiveState.targetType ?? null,
          targetId: objectiveState.targetId ?? null,
          label: objectiveState.label ?? null
        }
      : null
  };
}
