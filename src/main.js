import "./style.css";
import { renderShop, createShopUi } from './ui/flow/shopScreen.js';
import { renderSkillPanel } from './ui/battle/skillPanel.js';
import { SKILLS, resolveSkill, finishSkillEnemyTurn, skillBlockReason } from './logic/battle/skillLogic.js';
import { purchaseSkill } from './logic/profile/profileStorage.js';
let shopUi = createShopUi();
import { loadInitialPrototypeData } from "./logic/shared/dataLoader.js";
import {
  createInitialBattleState,
  calculateTeamApCapacity
} from "./logic/battle/battleSetup.js";import {
  getMovementTiles,
  moveSelectedUnitToTile,
  moveSelectedUnitByDirection,
selectNextPlayerUnit
} from "./logic/battle/movementLogic.js";
import {
  getBasicAttackCandidates,
  getBasicAttackCandidatesForUnit
} from "./logic/battle/atrLogic.js";
import {
  getPlayerBasicAttackCandidates,
  getValidPlayerBasicAttackTargets
} from "./logic/battle/playerAttackTargetLogic.js";
import {
  resolveBasicAttack
} from "./logic/battle/damageLogic.js";
import {
  resolveEnemyMovementPhase
} from "./logic/battle/enemyMovementLogic.js";
import {
  resolveEnemyAttackPhase
} from "./logic/battle/enemyAttackLogic.js";
import {
  resolveEnemyCurrentTarget
} from "./logic/battle/enemyTargetLogic.js";
import {
  resolveEnemyCurrentIntent
} from "./logic/battle/enemyIntentLogic.js";
import {
  isBlueShockwaveEnemy,
  resolveBlueShockwaveActivation
} from "./logic/battle/blueShockwaveLogic.js";
import {
  isUnitStunned,
  tickPlayerTurnStatuses
} from "./logic/battle/statusLogic.js";
import {
  spawnTelegraphedWaves,
  hasPendingRequiredWave,
  refreshWaveResolutionState
} from "./logic/battle/waveLogic.js";
import {
  beginStage1PreparationTurn,
  canEndStage1Turn,
  createStage1RedesignBattleState,
  createStage1RetryState,
  createStage2PlaceholderBattleState,
  createStage2RetryState,
  isStage1RedesignBattle,
  isStage2PlaceholderBattle,
  resolveStage1RecoveryActivation,
  settleStage1Reward,
  spawnStage1Reinforcement,
  updateStage1AfterSwordDefeat
} from "./logic/battle/stage1RedesignLogic.js";
import {
  appendStage1TelemetryEvent,
  createStage1SessionId,
  normalizeParticipantCode
} from "./logic/telemetry/stage1Telemetry.js";
import {
  VALIDATION_STAGE_1_ID,
  VALIDATION_STAGE_2_ID,
  captureStage2EntrySnapshot,
  captureValidationBattleResult,
  completeValidationBuffDecision,
  createTwoStageValidationSession,
  endTwoStageValidationSession,
  prepareValidationBuffDecision,
  recordValidationBuffSelection,
  recordValidationExportFailed,
  recordValidationExportRequested,
  recordValidationExportSucceeded,
  serializeTwoStageValidationSession,
  setValidationAttemptNumber,
  syncValidationBattleEvents
} from "./logic/validation/twoStageValidationFlow.js";
import {
  evaluateEliminateAllObjective
} from "./logic/battle/objectiveLogic.js";
import {
  createBattleResultSnapshot,
  createImmutableBattleResultSnapshot
} from "./logic/battle/battleResultState.js";
import {
  assertTutorialBattlefieldState
} from "./logic/battle/tacticalPositionLogic.js";
import {
  loadProfileState,
  markTutorialCompleted,
  resetProfileState,
  addMetaCrystal,
  purchasePermanentUpgrade
} from "./logic/profile/profileStorage.js";
import {
  createInitialRunState,
  getRunNodeById,
  markRunNodeCurrent,
  prepareRunStageVictoryReward,
  chooseRunReward,
  completeRunIfFinalStageCompleted,
  markRunDefeated
} from "./logic/run/runState.js";
import {
  applyActiveRunBuffsToBattleState,
  generateBuffOffers
} from "./logic/run/buffSystem.js";
import {
  recordTutorialLookMovement,
  recordTutorialUnitSelection,
  recordTutorialPlayerMovement,
  recordTutorialPhase3PlayerMovement,
  recordTutorialPhase4PlayerMovement,
recordTutorialPhase4AttackAttempt,
recordTutorialPhase4AttackTargeting,
recordTutorialPhase4BasicAttack,
recordTutorialPhase5EndTurn,
recordTutorialPhase5EnemyResolution,
recordTutorialPhase5PlayerMovement,
recordTutorialPhase5BasicAttack,
recordTutorialActionMenuOpened,
recordTutorialAttackTargeting,
recordTutorialBasicAttack,
  recordTutorialEndTurn,
  recordTutorialEnemyResolution,
shouldPauseTutorialEnemyResolution,
  advanceTutorialBrief,
  isTutorialStageVictoryReady,
  isTutorialInputAllowed
} from "./logic/tutorial/tutorialFlow.js";
import {
  initializeTutorialPhase6Content,
  recordTutorialPhase6EndTurn,
  recordTutorialPhase6EnemyResolution,
  recordTutorialPhase6EnemyMovement,
  recordTutorialPhase6PlayerTurnStart,
  recordTutorialPhase6UnitSelection,
  recordTutorialPhase6PlayerMovement,
  recordTutorialPhase6BasicAttack,
  isTutorialPhase6BasicAttackTargetAllowed,
  getTutorialPhase6EnemyActivationMode
} from "./logic/tutorial/tutorialPhase6Logic.js";
import {
  initializeTutorialPhase7Content,
  recordTutorialPhase7PlayerMovement,
  recordTutorialPhase7UnitSelection,
  recordTutorialPhase7PlayerEndTurn,
  prepareTutorialPhase7EnemyActivation,
  recordTutorialPhase7EnemyActivation,
  recordTutorialPhase7PlayerTurnStart,
  recordTutorialPhase7PlayerAttack,
  isTutorialPhase7CheckpointReady,
  isTutorialPhase7BasicAttackTargetAllowed,
  getTutorialRequiredActorFailure
} from "./logic/tutorial/tutorialPhase7Logic.js";
import {
  initializeTutorialPhase8Content,
  recordTutorialPhase8PlayerEndTurn,
  recordTutorialPhase8PlayerTurnStart,
  recordTutorialPhase8PlayerAttack,
  isTutorialPhase8CheckpointReady
} from "./logic/tutorial/tutorialPhase8Logic.js";
import {
  captureTutorialCheckpoint,
  restoreTutorialCheckpoint
} from "./logic/tutorial/tutorialCheckpointLogic.js";
import {
  createFreshTutorialBattleState,
  createTutorialPhaseJumpState,
  createTutorialPhase7RetryCheckpointState,
  createTutorialPhase8RetryCheckpointState,
  validateTutorialPhaseJumpInput
} from "./logic/tutorial/tutorialPhaseJumpLogic.js";
import { renderBattleHud } from "./ui/battle/battleHud.js";
import {
  getBattleCameraTileBounds,
  getBattleCameraActiveTileBounds,
  getBattleCameraFocusKey,
  getBattleCameraUnitTileBounds,
  calculateCenteredBattleCameraTranslation,
  clampBattleCameraTranslation,
  panBattleCameraTranslation,
  getBattleCameraDragUpdate
} from "./ui/battle/battleCameraLogic.js";
import {
  renderTitleScreen,
  renderMainMenuScreen,
  renderStage1RedesignEntryScreen,
  renderRunOverviewScreen,
  renderMapSelectionScreen,
  renderBattleIntroScreen,
  renderRewardSelectionScreen,
  renderRunCompletionScreen,
  renderRunDefeatScreen,
  renderPostRunShopScreen
} from "./ui/flow/basicFlowScreens.js";


let appData = null;
let profileState = null;
let runState = null;
let battleIntroNodeId = null;
let battleState = null;
let validationSessionState = null;
let validationRewardState = null;
let enemyPhaseTimerId = null;
let tutorialBriefTimerId = null;
let battleResultPresentationTimerIds = [];
let buffConfirmationTimerId = null;
let latestTutorialCheckpoint = null;

let stage1EntryUiState = {
  participantCode: "",
  errorMessage: null
};

let buffSelectionUiState = {
  selectedBuffId: null,
  warningArmed: false,
  confirming: false,
  activeBuffListOpen: false
};

let activeBuffListOpen = false;

let tutorialPhaseJumpUiState = {
  open: false,
  phaseInput: "1",
  errorMessage: null
};

let battlefieldCameraState = {
  initialized: false,
  focusKey: null,
  translateX: 0,
  translateY: 0
};

let battlefieldCameraDragState = null;
let battlefieldCameraFocusUnitId = null;
let battlefieldCameraSuppressClickUntil = 0;

const BATTLE_CAMERA_DRAG_THRESHOLD_PX = 6;

let currentScene = "title";

const ENEMY_PHASE_DELAY_MS = 900;
// PROTOTYPE ONLY Tutorial presentation timing.
const TUTORIAL_BRIEF_DELAY_MS = 2000;
const BATTLE_RESULT_COUNTER_DELAY_MS = 1000;
const BATTLE_RESULT_CRYSTAL_DELAY_MS = 1600;
const BATTLE_RESULT_PARTY_DELAY_MS = 2200;
const BATTLE_RESULT_READY_DELAY_MS = 3200;
const BATTLE_RESULT_NUMBER_DURATION_MS = 760;

// TENTATIVE prototype validation value.
const PLAYER_BASIC_ATTACK_AP_COST = 1;

const ACTION_OPTIONS = [
  "attack",
  "skill"
];

function renderLoadingScreen() {
  document.querySelector("#app").innerHTML = `
    <main class="app-shell">
      <section class="hero-card">
        <p class="eyebrow">PA Game Designer Prototype</p>
        <h1>TMTB 2D/Simulatif Balancing Prototype</h1>
        <p class="description">
          Loading prototype data...
        </p>
      </section>
    </main>
  `;
}

function renderErrorScreen(error) {
  document.querySelector("#app").innerHTML = `
    <main class="app-shell">
      <section class="hero-card error-card">
        <p class="eyebrow">Prototype Error</p>
        <h1>Prototype gagal dijalankan</h1>
        <p class="description">
          Ada masalah saat membaca data atau menjalankan battle state.
        </p>

        <pre class="error-box">${error.message}</pre>
      </section>
    </main>
  `;
}

function getCurrentBattleMap() {
  if (!appData || !battleState) {
    return null;
  }

  if (
    battleState.flowContext ===
    "tutorial"
  ) {
    return appData.tutorialMap;
  }

  if (isStage1RedesignBattle(battleState)) {
    return appData.stage1RedesignMap;
  }

  return appData.stage1Map;
}

function recordStage1Movement(previousState, nextState) {
  if (!isStage1RedesignBattle(nextState)) return nextState;
  const before = previousState.playerUnits.find((unit) => unit.battleUnitId === previousState.selectedUnitId);
  const after = nextState.playerUnits.find((unit) => unit.battleUnitId === previousState.selectedUnitId);
  if (!before || !after || (before.tileX === after.tileX && before.tileY === after.tileY)) return nextState;
  return appendStage1TelemetryEvent(nextState, "player_moved", {
    actorId: after.battleUnitId,
    payload: {
      from: { x: before.tileX, y: before.tileY },
      to: { x: after.tileX, y: after.tileY },
      apBefore: previousState.teamApCurrent,
      apAfter: nextState.teamApCurrent,
      startGrid: after.startGrid
    }
  });
}

function getStage1FortifyThreatContext(sourceState) {
  const sword = sourceState.enemyUnits.find((unit) => unit.currentHP > 0) ?? null;
  const guard = sourceState.playerUnits.find((unit) => unit.currentHP > 0) ?? null;
  if (!sword || !guard) {
    return { swordCouldThreaten: false, swordId: sword?.battleUnitId ?? null };
  }

  const movementPreview = resolveEnemyMovementPhase(
    getCurrentBattleMap(),
    sourceState,
    [sword.battleUnitId]
  );
  const movedSword = movementPreview.battleState.enemyUnits.find((unit) => (
    unit.battleUnitId === sword.battleUnitId
  ));
  const swordCouldThreaten = getBasicAttackCandidatesForUnit(
    getCurrentBattleMap(),
    movedSword,
    movementPreview.battleState.playerUnits
  ).some((candidate) => (
    candidate.unit.battleUnitId === guard.battleUnitId && candidate.actionValid
  ));

  return {
    swordCouldThreaten,
    swordId: sword.battleUnitId,
    swordPosition: { x: sword.tileX, y: sword.tileY },
    guardPosition: { x: guard.tileX, y: guard.tileY }
  };
}

function getStage1LegalActionContext(sourceState) {
  const legalActions = [];
  if (getMovementTiles(getCurrentBattleMap(), sourceState).length > 0) {
    legalActions.push("move");
  }
  if (
    sourceState.teamApCurrent >= PLAYER_BASIC_ATTACK_AP_COST &&
    getValidPlayerBasicAttackTargets(getCurrentBattleMap(), sourceState).length > 0
  ) {
    legalActions.push("attack");
  }
  if (!skillBlockReason(sourceState, profileState, "fortify")) {
    legalActions.push("fortify");
  }
  return legalActions;
}

function getSelectedPlayerUnit() {
  return battleState.playerUnits.find((unit) => {
    return unit.battleUnitId === battleState.selectedUnitId;
  });
}

function refreshEnemyReadabilityState(
  sourceState
) {
  let nextState = sourceState;

  const enemyOrder =
    [...nextState.enemyUnits]
      .filter((enemy) => {
        return enemy.currentHP > 0;
      })
      .sort((first, second) => {
        return (
          first.spawnOrder -
          second.spawnOrder
        );
      })
      .map((enemy) => {
        return enemy.battleUnitId;
      });

  enemyOrder.forEach((enemyId) => {
    const enemy = nextState.enemyUnits.find((unit) => unit.battleUnitId === enemyId) ?? null;

    if (!isBlueShockwaveEnemy(enemy)) {
      const targetResolution =
        resolveEnemyCurrentTarget(
          nextState,
          enemyId
        );

      nextState =
        targetResolution.battleState;
    }

    const intentResolution =
      resolveEnemyCurrentIntent(
        nextState,
        enemyId
      );

    nextState =
      intentResolution.battleState;
  });

  return nextState;
}

function refreshEnemyReadabilityAfterPlayerMovement(
  previousState,
  nextState
) {
  if (
    !previousState ||
    !nextState ||
    nextState.phase !== "player_phase"
  ) {
    return nextState;
  }

  const playerPositionChanged =
    previousState.playerUnits.some(
      (previousUnit) => {
        const nextUnit =
          nextState.playerUnits.find((unit) => {
            return (
              unit.battleUnitId ===
              previousUnit.battleUnitId
            );
          });

        if (!nextUnit) {
          return false;
        }

        return (
          previousUnit.tileX !==
            nextUnit.tileX ||
          previousUnit.tileY !==
            nextUnit.tileY
        );
      }
    );

  if (!playerPositionChanged) {
    return nextState;
  }

  return refreshEnemyReadabilityState(
    nextState
  );
}

function initializeTutorialPhase6RuntimeIfNeeded(
  sourceState
) {
  const isPhase6Entry =
    sourceState?.flowContext === "tutorial" &&
    sourceState?.tutorialState?.phaseId ===
      "phase_6_spear_defensive_cover_objective" &&
    sourceState?.tutorialState?.taskId ===
      "phase_6_entry";

  const alreadyInitialized =
    Boolean(
      sourceState?.tutorialState
        ?.phase6Entities
        ?.spearEnemyId &&
      sourceState?.tutorialState
        ?.phase6Entities
        ?.hutStructureId
    );

  if (!isPhase6Entry || alreadyInitialized) {
    return sourceState;
  }

  let nextState =
    initializeTutorialPhase6Content(
      {
        enemyUnits: appData.enemyUnits,
        structureDefinitions:
          appData.structureDefinitions,
        tutorialMap: appData.tutorialMap,
        tutorialEncounter:
          appData.tutorialEncounter
      },
      sourceState
    );

  nextState =
    refreshEnemyReadabilityState(
      nextState
    );

  assertTutorialBattlefieldState(
    appData.tutorialMap,
    nextState
  );

  latestTutorialCheckpoint =
    captureTutorialCheckpoint(
      "cp6",
      nextState
    );

  return nextState;
}

function initializeTutorialPhase7RuntimeIfNeeded(
  sourceState
) {
  const isPhase7Travel =
    sourceState?.flowContext === "tutorial" &&
    sourceState?.tutorialState?.phaseId ===
      "phase_6_spear_defensive_cover_objective" &&
    sourceState?.tutorialState?.taskId ===
      "proceed_to_region_c";

  const alreadyInitialized = Boolean(
    sourceState?.tutorialState?.phase7Entities?.blueEnemyId
  );

  if (!isPhase7Travel || alreadyInitialized) {
    return sourceState;
  }

  let nextState = initializeTutorialPhase7Content(
    {
      enemyUnits: appData.enemyUnits,
      tutorialMap: appData.tutorialMap,
      tutorialEncounter: appData.tutorialEncounter
    },
    sourceState
  );

  nextState = refreshEnemyReadabilityState(nextState);
  assertTutorialBattlefieldState(appData.tutorialMap, nextState);
  return nextState;
}

function initializeTutorialPhase8RuntimeIfNeeded(
  sourceState
) {
  const shouldEnterPhase8 =
    sourceState?.flowContext === "tutorial" &&
    sourceState?.tutorialState?.phaseId ===
      "phase_7_status_temporal_threat" &&
    sourceState?.tutorialState?.taskId ===
      "phase_7_complete_transition";

  if (!shouldEnterPhase8) {
    return sourceState;
  }

  let nextState = initializeTutorialPhase8Content(
    {
      tutorialMap: appData.tutorialMap,
      tutorialEncounter: appData.tutorialEncounter
    },
    sourceState
  );

  nextState = refreshEnemyReadabilityState(nextState);
  assertTutorialBattlefieldState(appData.tutorialMap, nextState);

  if (isTutorialPhase8CheckpointReady(nextState)) {
    latestTutorialCheckpoint = captureTutorialCheckpoint(
      "cp8",
      nextState
    );
  }

  return nextState;
}

function enterEnemyPhase(nextState) {
  if (
    !nextState ||
    nextState.phase !== "player_phase"
  ) {
    return nextState;
  }

  const nextEnemyUnits =
    nextState.enemyUnits.map((enemy) => {
      if (enemy.currentHP <= 0) {
        return {
          ...enemy,
          turnState: "exhausted",
          hasActed: true
        };
      }

      return {
        ...enemy,

        originTile: {
          x: enemy.tileX,
          y: enemy.tileY
        },

        turnState: "ready",
        hasActed: false
      };
    });

  const previousFeedback =
    nextState.feedbackMessage
      ? `${nextState.feedbackMessage} `
      : "";

  return {
    ...nextState,

    phase: "enemy_phase",
    battleControlState: "enemy_phase",

    teamApCurrent: 0,

    selectedUnitId: null,

    enemyUnits: nextEnemyUnits,

    actionMenuIndex: 0,
    selectedAction: null,

    targetIndex: 0,
    targetType: null,
    targetId: null,

    feedbackMessage:
      `${previousFeedback}` +
      "Global End Turn digunakan. " +
      "Sisa Team AP dibuang. " +
      "Enemy Phase dimulai."
  };
}

function endPlayerTurn() {
  if (
    !battleState ||
    battleState.phase !==
      "player_phase" ||
    battleState.battleControlState ===
      "battle_result"
  ) {
    return;
  }

  const stage1TurnGate = canEndStage1Turn(battleState);
  if (!stage1TurnGate.allowed) {
    battleState = {
      ...battleState,
      feedbackMessage: stage1TurnGate.reason
    };
    renderApp();
    return;
  }

  if (isStage1RedesignBattle(battleState)) {
    const legalActions = getStage1LegalActionContext(battleState);
    battleState = appendStage1TelemetryEvent(battleState, "turn_ended", {
      actorId: battleState.selectedUnitId,
      payload: {
        apRemaining: battleState.teamApCurrent,
        preparation: battleState.stage1Redesign.preparationActive,
        legalActions
      }
    });

    if (
      battleState.stage1Redesign.reinforcementPending &&
      !battleState.stage1Redesign.preparationActive
    ) {
      battleState = beginStage1PreparationTurn(getCurrentBattleMap(), battleState);
      renderApp();
      return;
    }
  }

  const previousBattleState =
    battleState;

  const statusTickedBattleState =
    tickPlayerTurnStatuses(
      battleState
    );

  const enemyPhaseBattleState =
    enterEnemyPhase(
      statusTickedBattleState
    );

   const phase3TutorialBattleState =
    recordTutorialEndTurn(
      previousBattleState,
      enemyPhaseBattleState
    );

  const phase5TutorialBattleState =
    recordTutorialPhase5EndTurn(
      previousBattleState,
      phase3TutorialBattleState
    );

  const phase6TutorialBattleState =
    recordTutorialPhase6EndTurn(
      previousBattleState,
      phase5TutorialBattleState
    );

  const phase7TutorialBattleState =
    recordTutorialPhase7PlayerEndTurn(
      previousBattleState,
      phase6TutorialBattleState
    );

  battleState =
    recordTutorialPhase8PlayerEndTurn(
      previousBattleState,
      phase7TutorialBattleState
    );

  const tutorialTaskId =
    battleState
      .tutorialState
      ?.taskId;

  renderApp();

  if (
    tutorialTaskId ===
      "enemy_turn_checkpoint"
  ) {
    scheduleTutorialBriefAdvance();
  }
}

function resolveEnemyPhaseActions() {
  if (
    !battleState ||
    battleState.phase !== "enemy_phase"
  ) {
    return;
  }

  let stateAfterEnemyActions =
    battleState;

  if (
    isStage1RedesignBattle(stateAfterEnemyActions) &&
    stateAfterEnemyActions.stage1Redesign.preparationActive
  ) {
    const landing = spawnStage1Reinforcement(
      appData.enemyUnits,
      getCurrentBattleMap(),
      stateAfterEnemyActions
    );
    stateAfterEnemyActions = refreshEnemyReadabilityState(landing.battleState);
  }

  const movementEvents = [];
  const attackEvents = [];
  let tutorialRequiredActorFailure = null;

  if (
    getTutorialPhase6EnemyActivationMode(
      stateAfterEnemyActions
    ) === "attack_only_continue"
  ) {
    const pendingMovementEvent =
      stateAfterEnemyActions
        .tutorialState
        ?.evidence
        ?.phase6SpearRetreatMovementEvent;

    if (pendingMovementEvent) {
      movementEvents.push(
        pendingMovementEvent
      );
    }
  }

  const enemyOrder =
    [...stateAfterEnemyActions.enemyUnits]
      .filter((enemy) => {
        return enemy.currentHP > 0;
      })
      .sort((first, second) => {
        return (
          first.spawnOrder -
          second.spawnOrder
        );
      })
      .map((enemy) => {
        return enemy.battleUnitId;
      });

  for (const enemyId of enemyOrder) {
    const hasLivingPlayer =
      stateAfterEnemyActions
        .playerUnits
        .some((unit) => {
          return unit.currentHP > 0;
        });

    if (!hasLivingPlayer) {
      break;
    }

    const stateBeforeActivation =
      stateAfterEnemyActions;

    const currentEnemy =
      stateAfterEnemyActions.enemyUnits.find((enemy) => {
        return enemy.battleUnitId === enemyId;
      }) ?? null;

    const recoveryResolution = resolveStage1RecoveryActivation(
      stateAfterEnemyActions,
      enemyId
    );
    if (recoveryResolution.recovered) {
      stateAfterEnemyActions = recoveryResolution.battleState;
      stateAfterEnemyActions = appendStage1TelemetryEvent(
        stateAfterEnemyActions,
        "enemy_activated",
        {
          actorId: enemyId,
          payload: { activation: "recovery", moved: false, attacked: false }
        }
      );
      movementEvents.push(recoveryResolution.event);
      attackEvents.push(recoveryResolution.event);
      continue;
    }

    if (isBlueShockwaveEnemy(currentEnemy)) {
      const preparedBlueState =
        prepareTutorialPhase7EnemyActivation(
          stateAfterEnemyActions
        );

      const blueResolution =
        resolveBlueShockwaveActivation(
          getCurrentBattleMap(),
          preparedBlueState,
          enemyId
        );

      stateAfterEnemyActions =
        refreshEnemyReadabilityState(
          blueResolution.battleState
        );

      stateAfterEnemyActions =
        recordTutorialPhase7EnemyActivation(
          preparedBlueState,
          stateAfterEnemyActions,
          blueResolution.event
        );

      const requiredActorFailure =
        getTutorialRequiredActorFailure(
          stateAfterEnemyActions
        );

      if (requiredActorFailure.failed) {
        tutorialRequiredActorFailure =
          requiredActorFailure;
        break;
      }

      console.log(
        "Blue special activation resolved:",
        blueResolution.event
      );

      continue;
    }

    const targetResolution =
      resolveEnemyCurrentTarget(
        stateAfterEnemyActions,
        enemyId
      );

    stateAfterEnemyActions =
      targetResolution.battleState;

    const currentTarget =
      targetResolution.target;

    const intentResolution =
      resolveEnemyCurrentIntent(
        stateAfterEnemyActions,
        enemyId
      );

    stateAfterEnemyActions =
      intentResolution.battleState;

    if (isStage1RedesignBattle(stateAfterEnemyActions)) {
      stateAfterEnemyActions = appendStage1TelemetryEvent(
        stateAfterEnemyActions,
        "enemy_intent_updated",
        {
          actorId: enemyId,
          targetId: currentTarget?.battleUnitId ?? null,
          payload: { intent: intentResolution.intent }
        }
      );
    }

    const currentIntent =
      intentResolution.intent;

    if (
      !currentTarget ||
      !currentIntent
    ) {
      continue;
    }

    const phase6ActivationMode =
      getTutorialPhase6EnemyActivationMode(
        stateAfterEnemyActions
      );

    const movementResolution =
      phase6ActivationMode ===
        "attack_only_continue"
        ? {
            battleState:
              stateAfterEnemyActions,
            movementEvents: []
          }
        : resolveEnemyMovementPhase(
            getCurrentBattleMap(),
            stateAfterEnemyActions,
            [enemyId]
          );

    stateAfterEnemyActions =
      movementResolution.battleState;

    movementEvents.push(
      ...movementResolution
        .movementEvents
    );

    const movementEvent =
      movementResolution
        .movementEvents[0] ??
      null;

    if (
      phase6ActivationMode ===
        "movement_only_pause"
    ) {
      stateAfterEnemyActions =
        recordTutorialPhase6EnemyMovement(
          stateBeforeActivation,
          stateAfterEnemyActions,
          movementEvent
        );

      battleState =
        stateAfterEnemyActions;

      console.log(
        "Tutorial Phase 6 Spear movement pause:",
        movementEvent
      );

      renderApp();
      scheduleTutorialBriefAdvance();
      return;
    }

    const attackResolution =
      resolveEnemyAttackPhase(
        getCurrentBattleMap(),
        stateAfterEnemyActions,
        [enemyId]
      );

    stateAfterEnemyActions =
      attackResolution.battleState;

    attackEvents.push(
      ...attackResolution
        .attackEvents
    );

    const attackEvent =
      attackResolution
        .attackEvents[0] ??
      null;

    if (isStage1RedesignBattle(stateAfterEnemyActions)) {
      stateAfterEnemyActions = appendStage1TelemetryEvent(
        stateAfterEnemyActions,
        "enemy_activated",
        {
          actorId: enemyId,
          targetId: currentTarget.battleUnitId,
          payload: { movement: movementEvent, attack: attackEvent }
        }
      );
      if (attackEvent?.attacked) {
        stateAfterEnemyActions = appendStage1TelemetryEvent(
          stateAfterEnemyActions,
          "damage_resolved",
          {
            actorId: enemyId,
            targetId: attackEvent.targetId,
            payload: {
              finalDamage: attackEvent.finalDamage,
              shieldAbsorbed: attackEvent.shieldAbsorbed,
              hpDamage: attackEvent.finalDamage - attackEvent.shieldAbsorbed,
              targetHPAfter: attackEvent.targetHPAfter
            }
          }
        );
      }
    }

    stateAfterEnemyActions =
      recordTutorialPhase6EnemyResolution(
        stateBeforeActivation,
        stateAfterEnemyActions,
        {
          movementEvent,
          attackEvent
        }
      );

    const requiredActorFailure =
      getTutorialRequiredActorFailure(
        stateAfterEnemyActions
      );

    if (requiredActorFailure.failed) {
      tutorialRequiredActorFailure =
        requiredActorFailure;
    }

    console.log(
      "Enemy activation resolved:",
      {
        enemyId,

        spawnOrder:
          stateAfterEnemyActions
            .enemyUnits
            .find((enemy) => {
              return (
                enemy.battleUnitId ===
                enemyId
              );
            })
            ?.spawnOrder ??
          null,

        currentTargetId:
          currentTarget.battleUnitId,

        currentTargetName:
          currentTarget.name,

          currentIntent,

        intentChanged:
          intentResolution.intentChanged,

        targetChanged:
          targetResolution.targetChanged,

        movementEvent,
        attackEvent
      }
    );

    if (tutorialRequiredActorFailure) {
      break;
    }
  }

  if (tutorialRequiredActorFailure) {
    battleState = createBattleResultState(
      stateAfterEnemyActions,
      "training_failed",
      "A required party member was defeated."
    );

    clearEnemyPhaseTimer();
    renderApp();
    return;
  }

  const livingPlayersBeforeWaveSpawn =
    stateAfterEnemyActions.playerUnits.filter((unit) => unit.currentHP > 0);

  let waveSpawnEvents = [];

  if (livingPlayersBeforeWaveSpawn.length > 0) {
    const waveSpawnResolution = spawnTelegraphedWaves(
      appData.enemyUnits,
      getCurrentBattleMap(),
      stateAfterEnemyActions
    );

    stateAfterEnemyActions = refreshEnemyReadabilityState(
      waveSpawnResolution.battleState
    );
    waveSpawnEvents = waveSpawnResolution.spawnEvents;
  }

  const livingPlayerUnits =
    stateAfterEnemyActions.playerUnits.filter(
      (unit) => {
        return unit.currentHP > 0;
      }
    );

  const movedEnemyCount =
    movementEvents.filter(
      (eventData) => {
        return eventData.moved;
      }
    ).length;

  const livingEnemyCount =
    enemyOrder.length;

  const successfulAttacks =
    attackEvents.filter(
      (eventData) => {
        return eventData.attacked;
      }
    );

  const enemyAttackCount =
    successfulAttacks.length;

  const totalEnemyDamage =
    successfulAttacks.reduce(
      (total, eventData) => {
        return total + eventData.finalDamage;
      },
      0
    );

  const defeatedPlayerNames =
    successfulAttacks
      .filter((eventData) => {
        return eventData.targetDefeated;
      })
      .map((eventData) => {
        return eventData.targetName;
      });

  // Jika tidak ada player hidup,
  // battle langsung berhenti.
  if (livingPlayerUnits.length === 0) {
    const defeatedText =
      defeatedPlayerNames.length > 0
        ? (
            ` Unit defeated: ` +
            `${defeatedPlayerNames.join(", ")}.`
          )
        : "";

    battleState = createBattleResultState(
      stateAfterEnemyActions,
      "defeat",
      `Enemy Phase selesai. ` +
      `${enemyAttackCount} attack menghasilkan ` +
      `${totalEnemyDamage} total damage.` +
      `${defeatedText} ` +
      `Semua unit player kalah.`
    );

    if (
      battleState.flowContext ===
        "run_stage"
    ) {
      openRunStageDefeatSummary();
      return;
    }

    renderApp();
    return;
  }

  // Jika masih ada player hidup,
  // siapkan Player Turn baru.
  stateAfterEnemyActions = finishSkillEnemyTurn(stateAfterEnemyActions);
  const nextPlayerUnits =
    stateAfterEnemyActions.playerUnits.map(
      (unit) => {
        if (unit.currentHP <= 0) {
          return {
            ...unit,
            turnState: "exhausted",
            hasActed: true
          };
        }

        return {
          ...unit,

          originTile: {
            x: unit.tileX,
            y: unit.tileY
          },

          startGrid: {
            x: unit.tileX,
            y: unit.tileY
          },

          movementApCommitted: false,
          movementLocked: false,

          turnState: "ready",
          hasActed: false
        };
      }
    );

  const firstLivingPlayerUnit =
    nextPlayerUnits.find((unit) => {
      return unit.currentHP > 0;
    });

  const nextTeamApCapacity =
    calculateTeamApCapacity(
      nextPlayerUnits
    );

  const defeatedText =
    defeatedPlayerNames.length > 0
      ? (
          ` Unit defeated: ` +
          `${defeatedPlayerNames.join(", ")}.`
        )
      : "";

    const nextPlayerTurnState =
    refreshEnemyReadabilityState({
      ...stateAfterEnemyActions,

      phase: "player_phase",

      turnCount:
        stateAfterEnemyActions
          .turnCount + 1,

      teamApCurrent:
        nextTeamApCapacity,

      teamApCapacity:
        nextTeamApCapacity,

      selectedUnitId:
        firstLivingPlayerUnit
          ?.battleUnitId ??
        null,

      battleControlState:
        "unit_selected_movement",

      actionMenuIndex: 0,
      selectedAction: null,

      targetIndex: 0,
      targetType: null,
      targetId: null,

      playerUnits:
        nextPlayerUnits,

      feedbackMessage:
        `Enemy Phase selesai: ` +
        `${movedEnemyCount}/${livingEnemyCount} ` +
        `enemy bergerak, ` +
        `${enemyAttackCount} attack, ` +
        `${totalEnemyDamage} total damage.` +
        `${waveSpawnEvents.length > 0 ? ` ${waveSpawnEvents.length} Wave enemy spawned.` : ""} ` +
        `Player Turn baru dimulai.`
    });

  let telemetryReadyPlayerTurnState = nextPlayerTurnState;
  if (isStage1RedesignBattle(telemetryReadyPlayerTurnState)) {
    for (const enemy of telemetryReadyPlayerTurnState.enemyUnits.filter((unit) => unit.currentHP > 0)) {
      telemetryReadyPlayerTurnState = appendStage1TelemetryEvent(
        telemetryReadyPlayerTurnState,
        "enemy_intent_updated",
        {
          actorId: enemy.battleUnitId,
          targetId: enemy.currentIntent?.targetId ?? null,
          payload: { intent: enemy.currentIntent }
        }
      );
    }
  }

  const telemetryPlayerTurnState = isStage1RedesignBattle(telemetryReadyPlayerTurnState)
    ? appendStage1TelemetryEvent(telemetryReadyPlayerTurnState, "turn_started", {
        payload: {
          teamAp: telemetryReadyPlayerTurnState.teamApCurrent,
          intents: telemetryReadyPlayerTurnState.enemyUnits
            .filter((enemy) => enemy.currentHP > 0)
            .map((enemy) => ({ enemyId: enemy.battleUnitId, intent: enemy.currentIntent }))
        }
      })
    : telemetryReadyPlayerTurnState;

   const previousEnemyPhaseState =
    battleState;

  const phase3TutorialBattleState =
    recordTutorialEnemyResolution(
      previousEnemyPhaseState,
      telemetryPlayerTurnState
    );

  const phase5TutorialBattleState =
    recordTutorialPhase5EnemyResolution(
      previousEnemyPhaseState,
      phase3TutorialBattleState
    );

  const phase6TutorialBattleState =
    recordTutorialPhase6PlayerTurnStart(
      previousEnemyPhaseState,
      phase5TutorialBattleState
    );

  const phase7TutorialBattleState =
    recordTutorialPhase7PlayerTurnStart(
      previousEnemyPhaseState,
      phase6TutorialBattleState
    );

  battleState =
    recordTutorialPhase8PlayerTurnStart(
      {
        tutorialMap: appData.tutorialMap,
        tutorialEncounter: appData.tutorialEncounter
      },
      previousEnemyPhaseState,
      phase7TutorialBattleState
    );

  const tutorialTaskId =
    battleState
      .tutorialState
      ?.taskId;

  renderApp();

  if (
    tutorialTaskId ===
      "explain_ap_refresh" ||
    tutorialTaskId ===
      "explain_archer_damage" ||
    tutorialTaskId ===
      "explain_defensive_cover" ||
    tutorialTaskId ===
      "explain_cover_reduction" ||
    tutorialTaskId ===
      "structure_intro" ||
    tutorialTaskId ===
      "introduce_blue_charge" ||
    tutorialTaskId ===
      "explain_charge_complete" ||
    tutorialTaskId ===
      "introduce_guard_stun" ||
    tutorialTaskId ===
      "explain_stun_persistence" ||
    tutorialTaskId ===
      "explain_guard_recovery"
  ) {
    scheduleTutorialBriefAdvance();
  }
}


function scheduleEnemyPhaseResolution() {
  if (
    !battleState ||
    battleState.phase !== "enemy_phase"
  ) {
    if (enemyPhaseTimerId !== null) {
      window.clearTimeout(enemyPhaseTimerId);
      enemyPhaseTimerId = null;
    }

    return;
  }
    if (
    shouldPauseTutorialEnemyResolution(
      battleState
    )
  ) {
    if (
      enemyPhaseTimerId !== null
    ) {
      window.clearTimeout(
        enemyPhaseTimerId
      );

      enemyPhaseTimerId = null;
    }

    return;
  }

  if (enemyPhaseTimerId !== null) {
    return;
  }

  enemyPhaseTimerId = window.setTimeout(() => {
    enemyPhaseTimerId = null;

    resolveEnemyPhaseActions();
  }, ENEMY_PHASE_DELAY_MS);
}

function canOpenActionMenu() {
  const selectedUnit = getSelectedPlayerUnit();

  if (!selectedUnit) return false;
  if (battleState.phase !== "player_phase") return false;
  if (selectedUnit.currentHP <= 0) return false;
  if (isUnitStunned(selectedUnit)) return false;

  return true;
}

function openActionMenu() {
  if (!canOpenActionMenu()) {
    const selectedUnit = getSelectedPlayerUnit();
    if (selectedUnit && isUnitStunned(selectedUnit)) {
      battleState = {
        ...battleState,
        feedbackMessage: `${selectedUnit.name} is Stunned.`
      };
    }
    return;
  }

  battleState = {
    ...battleState,
    battleControlState: "action_menu_open",
    actionMenuIndex: 0,
    selectedAction: null,
    targetIndex: 0,
    targetType: null,
    targetId: null,
    feedbackMessage: null
  };
}

function closeActionMenu() {
  battleState = {
    ...battleState,
    battleControlState: "unit_selected_movement",
    actionMenuIndex: 0,
    selectedAction: null,
    targetIndex: 0,
    targetType: null,
    targetId: null,
    feedbackMessage: null
  };
}

function moveActionMenuSelection(direction) {
  const optionCount = ACTION_OPTIONS.length;
  const currentIndex = battleState.actionMenuIndex;

  let nextIndex = currentIndex;

  if (direction === "left") {
    nextIndex = (currentIndex - 1 + optionCount) % optionCount;
  }

  if (direction === "right") {
    nextIndex = (currentIndex + 1) % optionCount;
  }

  battleState = {
    ...battleState,
    actionMenuIndex: nextIndex,
    feedbackMessage: null
  };
}

function openAttackTargeting() {
  if (
    battleState.teamApCurrent <
    PLAYER_BASIC_ATTACK_AP_COST
  ) {
    battleState = {
      ...battleState,
      feedbackMessage:
        "Team AP tidak cukup untuk Attack."
    };
    return;
  }

  const validTargets =
    getValidPlayerBasicAttackTargets(
      getCurrentBattleMap(),
      battleState
    );

  if (validTargets.length === 0) {
    const attackCandidates =
      getPlayerBasicAttackCandidates(
        getCurrentBattleMap(),
        battleState
      );

    const reasonLabels = {
      outside_atr: "OUTSIDE ATR",
      no_los: "NO LOS",
      path_blocked: "PATH BLOCKED"
    };

    const invalidSummary =
      attackCandidates.length === 0
        ? "No living opposing target."
        : attackCandidates
            .map((targetData) => {
              const reason =
                reasonLabels[
                  targetData.invalidReason
                ] ?? "INVALID";

              return (
                `${targetData.entity.name}: ` +
                `${reason}`
              );
            })
            .join(" | ");

    battleState = {
      ...battleState,
      feedbackMessage:
        `Tidak ada target Attack valid. ` +
        `${invalidSummary}`
    };
    return;
  }

  const mandatoryHutTargetIndex =
    validTargets.findIndex((targetData) => {
      return (
        battleState.tutorialState?.taskId ===
          "first_hut_attack" &&
        isTutorialPhase6BasicAttackTargetAllowed(
          battleState,
          targetData
        )
      );
    });

  const initialTargetIndex =
    mandatoryHutTargetIndex >= 0
      ? mandatoryHutTargetIndex
      : 0;

  const initialTarget =
    validTargets[initialTargetIndex];

  battleState = {
    ...battleState,
    battleControlState:
      "attack_targeting",
    selectedAction: "attack",
    targetIndex: initialTargetIndex,
    targetType: initialTarget.targetType,
    targetId: initialTarget.targetId,
    feedbackMessage: null
  };
}

function closeSkillPanel() {
  battleState = { ...battleState, battleControlState: battleState.battleControlState === 'skill_targeting' ? 'skill_menu' : 'action_menu_open', selectedSkill: null };
  renderApp();
}

function confirmActionMenuSelection() {
  const selectedAction =
    ACTION_OPTIONS[battleState.actionMenuIndex];

  if (selectedAction === "attack") {
    openAttackTargeting();
    return;
  }
  if (selectedAction === "skill") {
  battleState = {
    ...battleState,
    battleControlState: 'skill_menu',
    selectedSkill: null,
    feedbackMessage: null
  };
}
}

function commitActionMenuSelection(selectedAction = null) {
  if (selectedAction) {
    const selectedIndex = ACTION_OPTIONS.indexOf(selectedAction);
    if (selectedIndex < 0) return null;
    battleState = {
      ...battleState,
      actionMenuIndex: selectedIndex
    };
  }

  const previousBattleState = battleState;
  confirmActionMenuSelection();
  const attackCandidates = getBasicAttackCandidates(
    getCurrentBattleMap(),
    battleState
  );
  const phase3TutorialBattleState = recordTutorialAttackTargeting(
    previousBattleState,
    battleState
  );
  const phase4AttemptBattleState = recordTutorialPhase4AttackAttempt(
    previousBattleState,
    phase3TutorialBattleState,
    attackCandidates
  );
  battleState = recordTutorialPhase4AttackTargeting(
    previousBattleState,
    phase4AttemptBattleState
  );
  return battleState.tutorialState?.taskId ?? null;
}

function moveAttackTargetSelection(direction) {
  const validTargets =
    getValidPlayerBasicAttackTargets(
      getCurrentBattleMap(),
      battleState
    );

  if (validTargets.length === 0) {
    return;
  }

  const currentIndex =
    validTargets.findIndex((targetData) => {
      return (
        targetData.targetType ===
          battleState.targetType &&
        targetData.targetId ===
          battleState.targetId
      );
    });

  let nextIndex =
    currentIndex === -1 ? 0 : currentIndex;

  if (direction === "left") {
    nextIndex =
      (nextIndex - 1 + validTargets.length) %
      validTargets.length;
  }

  if (direction === "right") {
    nextIndex =
      (nextIndex + 1) % validTargets.length;
  }

  const nextTarget =
    validTargets[nextIndex];

  battleState = {
    ...battleState,
    targetIndex: nextIndex,
    targetType: nextTarget.targetType,
    targetId: nextTarget.targetId
  };
}

function createBattleResultState(
  nextState,
  resultState,
  feedbackMessage
) {
  const usesSequentialPresentation =
    nextState.flowContext ===
      "run_stage" &&
    resultState === "victory";

  let resultBattleState = {
    ...nextState,

    phase: "battle_end",
    battleControlState: "battle_result",

    selectedUnitId: null,

    actionMenuIndex: 0,
    selectedAction: null,

    targetIndex: 0,
    targetType: null,
    targetId: null,

    resultState,

    stageEndedAt: Date.now(),

    feedbackMessage,

    resultPresentationReady:
      !usesSequentialPresentation
  };

  if (isStage1RedesignBattle(resultBattleState)) {
    resultBattleState = settleStage1Reward(resultBattleState);
  }

  const resultSnapshot =
    isStage1RedesignBattle(resultBattleState)
      ? createImmutableBattleResultSnapshot(resultBattleState)
      : createBattleResultSnapshot(resultBattleState);

  if (isStage1RedesignBattle(resultBattleState)) {
    resultBattleState = appendStage1TelemetryEvent(
      resultBattleState,
      "stage_ended",
      {
        payload: {
          result: resultSnapshot.result,
          totalTurns: resultSnapshot.metrics.totalTurns,
          finalGuardHP: resultSnapshot.metrics.finalGuardHP,
          durationMs: resultSnapshot.metrics.durationMs,
          reward: resultSnapshot.metrics.crystalGained
        }
      }
    );
  }

  const completedState = {
    ...resultBattleState,
    resultSnapshot
  };

  if (isStage1RedesignBattle(completedState)) {
    validationSessionState =
      captureValidationBattleResult(
        validationSessionState,
        completedState
      );
  }

  return completedState;
}

function createVictoryBattleState(
  nextState,
  previousMessage
) {
  return createBattleResultState(
    nextState,
    "victory",

    `${previousMessage} ` +
    "Objective eliminate_all selesai. " +
    "Semua enemy telah dikalahkan."
  );
}

function confirmBasicAttack() {
  if (
    battleState.teamApCurrent <
    PLAYER_BASIC_ATTACK_AP_COST
  ) {
    battleState = {
      ...battleState,
      battleControlState:
        "unit_selected_movement",
      selectedAction: null,
      targetIndex: 0,
      targetType: null,
      targetId: null,
      feedbackMessage:
        "Team AP tidak cukup untuk Attack."
    };
    return null;
  }

  const validTargets =
    getValidPlayerBasicAttackTargets(
      getCurrentBattleMap(),
      battleState
    );

  const selectedTargetData =
    validTargets.find((targetData) => {
      return (
        targetData.targetType ===
          battleState.targetType &&
        targetData.targetId ===
          battleState.targetId
      );
    }) ?? null;

  if (!selectedTargetData) {
    battleState = {
      ...battleState,
      feedbackMessage:
        "Target attack tidak lagi valid."
    };
    return null;
  }

  if (
    !isTutorialPhase6BasicAttackTargetAllowed(
      battleState,
      selectedTargetData
    )
  ) {
    battleState = {
      ...battleState,
      feedbackMessage:
        "Attack the highlighted structure."
    };
    return null;
  }

  if (
    !isTutorialPhase7BasicAttackTargetAllowed(
      battleState,
      selectedTargetData
    )
  ) {
    battleState = {
      ...battleState,
      feedbackMessage:
        "Attack Blue with Archer."
    };
    return null;
  }

  const resolution =
    resolveBasicAttack(
      battleState,
      selectedTargetData.targetType,
      selectedTargetData.targetId,
      selectedTargetData.pathResult
    );

  if (!resolution.attackResult) {
    battleState = {
      ...battleState,
      feedbackMessage:
        "Attack gagal diselesaikan."
    };
    return null;
  }

  const attackResult =
    resolution.attackResult;

  const committedPlayerUnits =
    resolution.battleState.playerUnits.map(
      (unit) => {
        if (
          unit.battleUnitId !==
          attackResult.attackerId
        ) {
          return unit;
        }

        const isAtStartGrid =
          unit.tileX === unit.startGrid.x &&
          unit.tileY === unit.startGrid.y;

        return {
          ...unit,
          movementLocked: true,
          turnState:
            isAtStartGrid
              ? "ready"
              : "positioned"
        };
      }
    );

  const nextTeamApCurrent =
    Math.max(
      0,
      resolution.battleState.teamApCurrent -
        PLAYER_BASIC_ATTACK_AP_COST
    );

  const battleStateAfterAttackCommitment = {
    ...resolution.battleState,
    teamApCurrent: nextTeamApCurrent,
    playerUnits: committedPlayerUnits
  };

  const targetResolutionLabel =
    attackResult.targetDestroyed
      ? "Target destroyed."
      : attackResult.targetDefeated
        ? "Target defeated."
        : (
            `HP ${attackResult.targetHPBefore} → ` +
            `${attackResult.targetHPAfter}.`
          );

  battleState = {
    ...battleStateAfterAttackCommitment,
    battleControlState:
      "unit_selected_movement",
    actionMenuIndex: 0,
    selectedAction: null,
    targetIndex: 0,
    targetType: null,
    targetId: null,
    feedbackMessage:
      `${attackResult.attackerName} memberikan ` +
      `${attackResult.finalDamage} damage kepada ` +
      `${attackResult.targetName}. ` +
      `${targetResolutionLabel} ` +
      `Team AP ${nextTeamApCurrent}/` +
      `${battleState.teamApCapacity}.`
  };

  return attackResult;
}

function commitSelectedBasicAttack() {
  const previousBattleState = battleState;
  const selectedTargetData = getPlayerBasicAttackCandidates(
    getCurrentBattleMap(),
    battleState
  ).find((targetData) => (
    targetData.targetType === battleState.targetType &&
    targetData.targetId === battleState.targetId
  )) ?? null;

  const attackResult = confirmBasicAttack();
  if (!attackResult) return false;

  const phase3TutorialBattleState = recordTutorialBasicAttack(
    previousBattleState,
    battleState
  );
  const phase4TutorialBattleState = recordTutorialPhase4BasicAttack(
    previousBattleState,
    phase3TutorialBattleState,
    selectedTargetData
  );
  const phase5TutorialBattleState = recordTutorialPhase5BasicAttack(
    previousBattleState,
    phase4TutorialBattleState
  );
  const phase6InitializedBattleState = initializeTutorialPhase6RuntimeIfNeeded(
    phase5TutorialBattleState
  );
  const phase6TutorialBattleState = recordTutorialPhase6BasicAttack(
    previousBattleState,
    phase6InitializedBattleState,
    attackResult
  );
  const phase7InitializedBattleState = initializeTutorialPhase7RuntimeIfNeeded(
    phase6TutorialBattleState
  );
  const phase7AttackBattleState = recordTutorialPhase7PlayerAttack(
    previousBattleState,
    phase7InitializedBattleState,
    attackResult
  );

  battleState = recordTutorialPhase8PlayerAttack(
    previousBattleState,
    phase7AttackBattleState,
    attackResult
  );

  if (isStage1RedesignBattle(battleState)) {
    battleState = appendStage1TelemetryEvent(battleState, "player_attacked", {
      actorId: attackResult.attackerId,
      targetId: attackResult.targetId,
      payload: {
        apBefore: previousBattleState.teamApCurrent,
        apAfter: battleState.teamApCurrent,
        damage: attackResult.finalDamage,
        targetHPBefore: attackResult.targetHPBefore,
        targetHPAfter: attackResult.targetHPAfter
      }
    });
    battleState = appendStage1TelemetryEvent(battleState, "damage_resolved", {
      actorId: attackResult.attackerId,
      targetId: attackResult.targetId,
      payload: {
        finalDamage: attackResult.finalDamage,
        shieldAbsorbed: attackResult.shieldAbsorbed ?? 0,
        hpDamage: attackResult.finalDamage - (attackResult.shieldAbsorbed ?? 0),
        targetHPAfter: attackResult.targetHPAfter
      }
    });

    if (attackResult.targetDefeated) {
      battleState = updateStage1AfterSwordDefeat(
        battleState,
        attackResult.targetId
      ).battleState;
    }
  }

  assertTutorialBattlefieldState(
    getCurrentBattleMap(),
    battleState
  );
  battleState = resolvePostAttackBattleOutcome(battleState);
  return true;
}

function resolvePostAttackBattleOutcome(
  sourceState
) {
  const refreshedSourceState = isStage1RedesignBattle(sourceState)
    ? refreshWaveResolutionState(sourceState)
    : sourceState;

  if (
    isStage1RedesignBattle(refreshedSourceState) &&
    hasPendingRequiredWave(refreshedSourceState)
  ) {
    return refreshedSourceState;
  }

  const objectiveEvaluation =
    evaluateEliminateAllObjective(
      refreshedSourceState
    );

  const objectiveVictory =
    objectiveEvaluation.resolved &&
    objectiveEvaluation.resultState ===
      "victory";

  if (!objectiveVictory) {
    return refreshedSourceState;
  }

  if (
    refreshedSourceState.flowContext ===
      "tutorial" &&
    !isTutorialStageVictoryReady(
      refreshedSourceState
    )
  ) {
    return refreshedSourceState;
  }

  return createVictoryBattleState(
    refreshedSourceState,
    refreshedSourceState.feedbackMessage ?? ""
  );
}

function closeAttackTargeting() {
  battleState = {
    ...battleState,
    battleControlState: "action_menu_open",
    selectedAction: null,
    targetIndex: 0,
    targetType: null,
    targetId: null,
    feedbackMessage: null
  };
}

function clearEnemyPhaseTimer() {
  if (enemyPhaseTimerId === null) {
    return;
  }

  window.clearTimeout(enemyPhaseTimerId);
  enemyPhaseTimerId = null;
}

function clearTutorialBriefTimer() {
  if (tutorialBriefTimerId === null) {
    return;
  }

  window.clearTimeout(
    tutorialBriefTimerId
  );
  tutorialBriefTimerId = null;
}

function clearBattleResultPresentationTimers() {
  battleResultPresentationTimerIds
    .forEach((timerId) => {
      window.clearTimeout(timerId);
    });

  battleResultPresentationTimerIds = [];
}

function clearBuffConfirmationTimer() {
  if (buffConfirmationTimerId === null) {
    return;
  }

  window.clearTimeout(buffConfirmationTimerId);
  buffConfirmationTimerId = null;
}

function queueBattleResultPresentationStep(
  callback,
  delay
) {
  const timerId = window.setTimeout(
    callback,
    delay
  );

  battleResultPresentationTimerIds.push(
    timerId
  );
}

function animateBattleResultNumber(
  element,
  startValue,
  targetValue
) {
  const safeStart =
    Math.max(0, Number(startValue) || 0);

  const safeTarget =
    Math.max(0, Number(targetValue) || 0);

  const startedAt =
    window.performance.now();

  function updateValue(now) {
    if (!element.isConnected) {
      return;
    }

    const progress = Math.min(
      1,
      (
        now - startedAt
      ) / BATTLE_RESULT_NUMBER_DURATION_MS
    );

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    element.textContent = String(
      Math.round(
        safeStart +
        (
          safeTarget - safeStart
        ) * easedProgress
      )
    );

    if (progress < 1) {
      window.requestAnimationFrame(
        updateValue
      );
    }
  }

  window.requestAnimationFrame(
    updateValue
  );
}

function completeBattleResultPresentation() {
  if (
    !battleState ||
    battleState.flowContext !==
      "run_stage" ||
    battleState.resultState !==
      "victory" ||
    battleState.battleControlState !==
      "battle_result"
  ) {
    return;
  }

  battleState = {
    ...battleState,
    resultPresentationReady: true
  };

  const continueButton =
    document.querySelector(
      '[data-action="battle-result-primary"]'
    );

  if (continueButton) {
    continueButton.disabled = false;
    continueButton.classList.remove(
      "battle-result-continue-locked"
    );
    continueButton.classList.add(
      "main-menu-button-active"
    );
  }
}

function scheduleBattleResultPresentation() {
  if (
    !battleState ||
    battleState.flowContext !==
      "run_stage" ||
    battleState.resultState !==
      "victory" ||
    battleState.battleControlState !==
      "battle_result" ||
    battleState.resultPresentationReady ||
    battleResultPresentationTimerIds.length > 0
  ) {
    return;
  }

  const resultContainer =
    document.querySelector(
      "[data-battle-result-sequence]"
    );

  if (!resultContainer) {
    return;
  }

  queueBattleResultPresentationStep(
    () => {
      resultContainer
        .querySelectorAll(
          ".battle-result-summary [data-result-counter]"
        )
        .forEach((element) => {
          animateBattleResultNumber(
            element,
            0,
            element.dataset.target
          );
        });
    },
    BATTLE_RESULT_COUNTER_DELAY_MS
  );

  queueBattleResultPresentationStep(
    () => {
      const crystalCounter =
        resultContainer.querySelector(
          ".battle-result-crystal [data-result-counter]"
        );

      if (crystalCounter) {
        animateBattleResultNumber(
          crystalCounter,
          0,
          crystalCounter.dataset.target
        );
      }
    },
    BATTLE_RESULT_CRYSTAL_DELAY_MS
  );

  queueBattleResultPresentationStep(
    () => {
      resultContainer
        .querySelectorAll(
          "[data-result-hp-current]"
        )
        .forEach((element) => {
          animateBattleResultNumber(
            element,
            element.dataset.start,
            element.dataset.target
          );
        });

      resultContainer
        .querySelectorAll(
          "[data-result-hp-fill]"
        )
        .forEach((element) => {
          element.style.width =
            `${element.dataset.targetPercent ?? 0}%`;
        });
    },
    BATTLE_RESULT_PARTY_DELAY_MS
  );

  queueBattleResultPresentationStep(
    completeBattleResultPresentation,
    BATTLE_RESULT_READY_DELAY_MS
  );
}

function canUseTutorialPhaseJump() {
  return (
    currentScene === "battle" &&
    battleState?.flowContext ===
      "tutorial"
  );
}

function focusTutorialPhaseJumpInput() {
  const input =
    document.querySelector(
      "[data-tutorial-phase-jump-input]"
    );

  if (!input) {
    return;
  }

  input.focus();
  input.select();
}

function openTutorialPhaseJump() {
  if (!canUseTutorialPhaseJump()) {
    return;
  }

  clearEnemyPhaseTimer();
  clearTutorialBriefTimer();
  battlefieldCameraDragState = null;

  tutorialPhaseJumpUiState = {
    ...tutorialPhaseJumpUiState,
    open: true,
    errorMessage: null
  };

  renderApp();
  focusTutorialPhaseJumpInput();
}

function closeTutorialPhaseJump() {
  if (!tutorialPhaseJumpUiState.open) {
    return;
  }

  tutorialPhaseJumpUiState = {
    ...tutorialPhaseJumpUiState,
    open: false,
    errorMessage: null
  };

  renderApp();
  scheduleTutorialBriefAdvance();
}

function performTutorialPhaseJump() {
  if (!canUseTutorialPhaseJump()) {
    return;
  }

  const validation =
    validateTutorialPhaseJumpInput(
      tutorialPhaseJumpUiState
        .phaseInput
    );

  if (!validation.valid) {
    tutorialPhaseJumpUiState = {
      ...tutorialPhaseJumpUiState,
      errorMessage:
        validation.errorMessage
    };

    renderApp();
    focusTutorialPhaseJumpInput();
    return;
  }

  clearEnemyPhaseTimer();
  clearTutorialBriefTimer();
  resetBattlefieldCameraState();

  let nextState =
    createTutorialPhaseJumpState(
      appData,
      validation.phaseNumber
    );

  nextState =
    refreshEnemyReadabilityState(
      nextState
    );

  assertTutorialBattlefieldState(
    appData.tutorialMap,
    nextState
  );

  battleState = nextState;

  if (validation.phaseNumber === 6) {
    latestTutorialCheckpoint = captureTutorialCheckpoint(
      "cp6",
      battleState
    );
  } else if (validation.phaseNumber === 7) {
    const retryState = createTutorialPhase7RetryCheckpointState(appData);
    latestTutorialCheckpoint = captureTutorialCheckpoint(
      "cp7",
      retryState
    );
  } else if (validation.phaseNumber === 8) {
    const retryState = createTutorialPhase8RetryCheckpointState(appData);
    latestTutorialCheckpoint = captureTutorialCheckpoint(
      "cp8",
      retryState
    );
  } else {
    latestTutorialCheckpoint = null;
  }

  tutorialPhaseJumpUiState = {
    open: false,
    phaseInput: String(
      validation.phaseNumber
    ),
    errorMessage: null
  };

  renderApp();
  scheduleTutorialBriefAdvance();
}

function handleTutorialPhaseJumpKeyboardInput(
  event,
  key
) {
  if (tutorialPhaseJumpUiState.open) {
    if (
      key === "p" ||
      key === "escape"
    ) {
      event.preventDefault();
      closeTutorialPhaseJump();
      return true;
    }

    if (key === "enter") {
      event.preventDefault();
      performTutorialPhaseJump();
      return true;
    }

    event.stopPropagation();
    return true;
  }

  if (
    key === "p" &&
    canUseTutorialPhaseJump()
  ) {
    event.preventDefault();
    openTutorialPhaseJump();
    return true;
  }

  return false;
}

function openMainMenu() {
  clearBuffConfirmationTimer();
  battleIntroNodeId = null;

  currentScene = "main_menu";

  renderApp();
}

function openStage1RedesignEntry() {
  clearEnemyPhaseTimer();
  clearTutorialBriefTimer();
  clearBattleResultPresentationTimers();
  battleState = null;
  stage1EntryUiState = {
    participantCode: "",
    errorMessage: null
  };
  currentScene = "stage1_redesign_entry";
  renderApp();
}

function startStage1Redesign() {
  const participantCode = normalizeParticipantCode(
    stage1EntryUiState.participantCode
  );

  if (!participantCode) {
    stage1EntryUiState = {
      ...stage1EntryUiState,
      errorMessage: "Enter a non-personal participant code before starting."
    };
    renderApp();
    return;
  }

  clearEnemyPhaseTimer();
  clearTutorialBriefTimer();
  clearBattleResultPresentationTimers();
  resetBattlefieldCameraState();

  const sessionId = createStage1SessionId();
  validationSessionState =
    createTwoStageValidationSession({
      participantCode,
      sessionId
    });
  validationRewardState = null;

  battleState = refreshEnemyReadabilityState(
    createStage1RedesignBattleState(appData, {
      participantCode,
      sessionId,
      telemetryEvents:
        validationSessionState.events
    })
  );

  for (const enemy of battleState.enemyUnits.filter((unit) => unit.currentHP > 0)) {
    battleState = appendStage1TelemetryEvent(
      battleState,
      "enemy_intent_updated",
      {
        actorId: enemy.battleUnitId,
        targetId: enemy.currentIntent?.targetId ?? null,
        payload: { intent: enemy.currentIntent }
      }
    );
  }

  validationSessionState =
    syncValidationBattleEvents(
      validationSessionState,
      battleState
    );

  currentScene = "battle";
  renderApp();
}

function retryValidationStage() {
  if (!isStage1RedesignBattle(battleState)) return;
  if (
    battleState.battleControlState === "battle_result" &&
    validationSessionState?.exportStatus !== "succeeded"
  ) {
    return;
  }
  clearEnemyPhaseTimer();
  clearBattleResultPresentationTimers();
  resetBattlefieldCameraState();

  const isStage2 =
    isStage2PlaceholderBattle(battleState);
  const retrySourceState = {
    ...battleState,
    telemetryEvents:
      validationSessionState?.events ??
      battleState.telemetryEvents
  };
  battleState = refreshEnemyReadabilityState(
    isStage2
      ? createStage2RetryState(appData, retrySourceState)
      : createStage1RetryState(appData, retrySourceState)
  );
  validationSessionState =
    setValidationAttemptNumber(
      validationSessionState,
      battleState.stageId,
      battleState.stage1Session.attemptNumber
    );
  validationSessionState =
    syncValidationBattleEvents(
      validationSessionState,
      battleState
    );
  renderApp();
}

function exportValidationTelemetry() {
  if (!isStage1RedesignBattle(battleState)) return;

  const battleStateBeforeExport = battleState;
  validationSessionState =
    recordValidationExportRequested(
      validationSessionState
    );

  try {
    const succeededSession =
      recordValidationExportSucceeded(
        validationSessionState
      );
    const serialized =
      serializeTwoStageValidationSession(
        succeededSession
      );
    JSON.parse(serialized);
    const blob = new Blob([serialized], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `tmtb-validation-${validationSessionState.sessionId}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    validationSessionState = succeededSession;
  } catch (error) {
    validationSessionState =
      recordValidationExportFailed(
        validationSessionState,
        error?.message ?? "unknown browser error"
      );
  }

  battleState = battleStateBeforeExport;

  renderApp();
}

function returnValidationToMainMenu() {
  if (!isStage1RedesignBattle(battleState)) return;
  if (validationSessionState?.exportStatus !== "succeeded") return;
  clearEnemyPhaseTimer();
  clearBattleResultPresentationTimers();
  validationSessionState =
    endTwoStageValidationSession(
      validationSessionState,
      battleState.resultState
    );
  battleState = null;
  validationRewardState = null;
  openMainMenu();
}

function openRunOverview() {
  clearEnemyPhaseTimer();
  clearBattleResultPresentationTimers();
  clearBuffConfirmationTimer();

  runState = null;
  battleIntroNodeId = null;
  battleState = null;

  currentScene = "run_overview";

  renderApp();
}

function resetPrototypeData() {
  const resetConfirmed =
    window.confirm(
      "Reset all prototype progress?\n\n" +
      "Tutorial progress, Meta Crystal, " +
      "dan permanent upgrades akan dihapus."
    );

  if (!resetConfirmed) {
    return;
  }

  clearEnemyPhaseTimer();

  profileState =
  resetProfileState();

runState = null;
battleIntroNodeId = null;
battleState = null;

currentScene = "main_menu";
  console.log(
    "Prototype profile reset:",
    profileState
  );

  renderApp();
}

function startTutorialBattle() {
  clearEnemyPhaseTimer();
  clearTutorialBriefTimer();
  clearBattleResultPresentationTimers();
  resetBattlefieldCameraState();
  latestTutorialCheckpoint = null;
  tutorialPhaseJumpUiState = {
    open: false,
    phaseInput: "1",
    errorMessage: null
  };

  const initialTutorialBattleState =
    createFreshTutorialBattleState(
      appData
    );

  assertTutorialBattlefieldState(
    appData.tutorialMap,
    initialTutorialBattleState
  );

  battleState =
    refreshEnemyReadabilityState(
      initialTutorialBattleState
    );

  currentScene = "battle";

  console.log(
    "Tutorial battle started:",
    battleState
  );

  renderApp();
}

function createNewRun() {
  battleIntroNodeId = null;

  runState =
    createInitialRunState();

  console.log(
    "New run generated:",
    runState
  );

  return runState;
}

function selectRunNode(nodeId) {
  if (!runState) {
    return;
  }

  const selectedNode =
    getRunNodeById(
      runState,
      nodeId
    );

  if (!selectedNode) {
    return;
  }

  runState = {
    ...runState,

    selectedNodeId:
      selectedNode.nodeId
  };

  renderApp();
}

function openSelectedStageBattleIntro() {
  if (!runState) {
    return;
  }

  const selectedNode =
    getRunNodeById(
      runState,
      runState.selectedNodeId
    );

  if (
    !selectedNode ||
    selectedNode.status !==
      "available"
  ) {
    return;
  }

  battleIntroNodeId =
    selectedNode.nodeId;

  currentScene = "battle_intro";

  renderApp();
}

function closeBattleIntro() {
  openMapSelection();
}

function beginSelectedStageBattle() {
  resetBattlefieldCameraState();

  if (
    !runState ||
    !battleIntroNodeId
  ) {
    return;
  }

  const stageNode =
    getRunNodeById(
      runState,
      battleIntroNodeId
    );

  if (
    !stageNode ||
    stageNode.status !==
      "available"
  ) {
    openMapSelection();
    return;
  }

  runState =
    markRunNodeCurrent(
      runState,
      stageNode.nodeId
    );

  const baseRunBattleState = {
  ...createInitialBattleState(
    appData,
    profileState?.permanentUpgrades
  ),

    stageId:
      stageNode.nodeId,

    flowContext:
      "run_stage",

    encounterName:
      `${stageNode.shortLabel} — ` +
      `${stageNode.name}`,

    routeDifficulty:
      stageNode.routeDifficulty,

    crystalReward:
      stageNode.crystalReward,

    nodeType:
      stageNode.nodeType
  };

  battleState = refreshEnemyReadabilityState(
    applyActiveRunBuffsToBattleState(
      baseRunBattleState,
      runState.activeRunBuffs
    )
  );

  battleIntroNodeId = null;
  currentScene = "battle";

  console.log(
    "Run stage battle started:",
    {
      stageNode,
      runState,
      battleState
    }
  );

  renderApp();
}

function openMapSelection() {
  clearEnemyPhaseTimer();
  clearBattleResultPresentationTimers();

  if (!runState) {
    createNewRun();
  }

  battleIntroNodeId = null;
  battleState = null;

  currentScene = "map_selection";
  activeBuffListOpen = false;

  renderApp();
}

function startJourney() {
  if (
    profileState?.tutorialCompleted
  ) {
    openRunOverview();
    return;
  }

  startTutorialBattle();
}

function startRunFromOverview() {
  if (
    currentScene !==
      "run_overview"
  ) {
    return;
  }

  createNewRun();
  openMapSelection();
}

function openRunStageRewardSelection() {
  if (
    !runState ||
    !battleState
  ) {
    return;
  }

  const isRunStageVictory =
    battleState.flowContext ===
      "run_stage" &&
    battleState.resultState ===
      "victory";

  if (!isRunStageVictory) {
    return;
  }

  clearBattleResultPresentationTimers();

  const stageNode =
    getRunNodeById(
      runState,
      battleState.stageId
    );

  if (!stageNode) {
    return;
  }

  runState =
    prepareRunStageVictoryReward(
      runState,
      stageNode.nodeId,
      battleState.resultSnapshot
    );

  console.log(
    "Run stage victory reward prepared:",
    {
      stageNode,
      runState
    }
  );

  battleState = null;
  buffSelectionUiState = {
    selectedBuffId: null,
    warningArmed: false,
    confirming: false,
    activeBuffListOpen: false
  };
  currentScene =
    "reward_selection";

  renderApp();
}

function openValidationBuffSelection() {
  if (
    !isStage1RedesignBattle(battleState) ||
    isStage2PlaceholderBattle(battleState) ||
    battleState.resultState !== "victory"
  ) {
    return;
  }

  clearBattleResultPresentationTimers();
  const offers = generateBuffOffers({
    nodeType: "stage",
    partyUnitIds: ["guard"],
    offerCount: 2
  });

  validationSessionState =
    prepareValidationBuffDecision(
      validationSessionState,
      offers
    );
  validationRewardState = {
    generatedNodes: [{
      nodeId: VALIDATION_STAGE_1_ID,
      shortLabel: "STAGE 1",
      name: "Stage 1 Redesign"
    }],
    pendingRewardSourceNodeId:
      VALIDATION_STAGE_1_ID,
    pendingRewardOptions: offers,
    activeRunBuffs: []
  };
  battleState = null;
  buffSelectionUiState = {
    selectedBuffId: null,
    warningArmed: false,
    confirming: false,
    activeBuffListOpen: false
  };
  currentScene = "reward_selection";
  renderApp();
}

function startStage2ValidationPlaceholder() {
  const carriedGuardHP =
    validationSessionState?.stage1FinalHP;
  if (!Number.isFinite(carriedGuardHP)) return;

  const entryState = {
    stageId: VALIDATION_STAGE_2_ID,
    stage1Session: { attemptNumber: 1 },
    playerUnits: [{
      unitDefId: "guard",
      currentHP: carriedGuardHP,
      maxHP: 25,
      tileX: 2,
      tileY: 10
    }]
  };
  validationSessionState =
    captureStage2EntrySnapshot(
      validationSessionState,
      entryState
    );

  const entrySnapshot =
    validationSessionState.stage2EntrySnapshot;
  battleState = refreshEnemyReadabilityState(
    createStage2PlaceholderBattleState(appData, {
      participantCode:
        validationSessionState.participantCode,
      sessionId:
        validationSessionState.sessionId,
      attemptNumber: 1,
      telemetryEvents:
        validationSessionState.events,
      carriedGuardHP,
      entrySnapshot
    })
  );

  for (const enemy of battleState.enemyUnits.filter((unit) => unit.currentHP > 0)) {
    battleState = appendStage1TelemetryEvent(
      battleState,
      "enemy_intent_updated",
      {
        actorId: enemy.battleUnitId,
        targetId: enemy.currentIntent?.targetId ?? null,
        payload: { intent: enemy.currentIntent }
      }
    );
  }

  validationSessionState =
    syncValidationBattleEvents(
      validationSessionState,
      battleState
    );
  clearBattleResultPresentationTimers();
  resetBattlefieldCameraState();
  currentScene = "battle";
  renderApp();
}

function openCompletedRunSummary() {
  if (
    !runState ||
    runState.runStatus !==
      "completed"
  ) {
    return;
  }

  if (
    !runState
      .crystalConversionCompleted
  ) {
    const conversionAmount =
      Math.max(
        0,
        Math.floor(
          Number(
            runState.runCrystal
          ) || 0
        )
      );

    const metaCrystalBefore =
      profileState?.metaCrystal ?? 0;

    profileState =
      addMetaCrystal(
        profileState,
        conversionAmount
      );

    runState = {
      ...runState,

      runCrystal: 0,

      crystalConversionCompleted:
        true,

      convertedRunCrystal:
        conversionAmount,

      metaCrystalBeforeConversion:
        metaCrystalBefore,

      metaCrystalAfterConversion:
        profileState.metaCrystal
    };

    console.log(
      "Run Crystal converted:",
      {
        conversionAmount,
        profileState,
        runState
      }
    );
  }

  battleIntroNodeId = null;
  battleState = null;

  currentScene =
    "run_completion";

  renderApp();
}

function openRunStageDefeatSummary() {
  if (
    !runState ||
    !battleState
  ) {
    return;
  }

  const isRunStageDefeat =
    battleState.flowContext ===
      "run_stage" &&
    battleState.resultState ===
      "defeat";

  if (!isRunStageDefeat) {
    return;
  }

  clearBattleResultPresentationTimers();

  const defeatedNode =
    getRunNodeById(
      runState,
      battleState.stageId
    );

  if (!defeatedNode) {
    return;
  }

  const nextRunState =
    markRunDefeated(
      runState,
      defeatedNode.nodeId,
      battleState.resultSnapshot
    );

  if (nextRunState === runState) {
    return;
  }

  runState = nextRunState;

  if (
    !runState
      .crystalConversionCompleted
  ) {
    const conversionAmount =
      Math.max(
        0,
        Math.floor(
          Number(
            runState.runCrystal
          ) || 0
        )
      );

    const metaCrystalBefore =
      profileState?.metaCrystal ?? 0;

    profileState =
      addMetaCrystal(
        profileState,
        conversionAmount
      );

    runState = {
      ...runState,

      runCrystal: 0,

      crystalConversionCompleted:
        true,

      convertedRunCrystal:
        conversionAmount,

      metaCrystalBeforeConversion:
        metaCrystalBefore,

      metaCrystalAfterConversion:
        profileState.metaCrystal
    };
  }

  console.log(
    "Run defeated and settled:",
    {
      defeatedNode,
      profileState,
      runState
    }
  );

  battleIntroNodeId = null;
  battleState = null;

  currentScene =
    "run_defeat";

  renderApp();
}

function finishCompletedRunToRunOverview() {
  if (
    currentScene !==
      "run_completion"
  ) {
    return;
  }

  openRunOverview();
}

function finishDefeatedRunToRunOverview() {
  if (
    currentScene !==
      "run_defeat"
  ) {
    return;
  }

  openRunOverview();
}

function openPostRunShop() {
  if (currentScene !== 'run_overview') return;
  shopUi = createShopUi();
  const isRunOverviewScene =
    currentScene ===
      "run_overview";

  const isResultScene =
    currentScene ===
      "run_completion" ||
    currentScene ===
      "run_defeat";

  const hasSettledRun =
    runState &&
    (
      runState.runStatus ===
        "completed" ||
      runState.runStatus ===
        "defeated"
    ) &&
    runState
      .crystalConversionCompleted ===
      true;

  const canOpenFromResult =
    isResultScene &&
    hasSettledRun;

  if (
    !isRunOverviewScene &&
    !canOpenFromResult
  ) {
    return;
  }

  currentScene =
    "post_run_shop";

  renderApp();
}

function buyPermanentUpgrade(
  unitId,
  statId,
  expectedCurrentLevel
) {
  if (
    currentScene !==
      "post_run_shop" ||
    !profileState
  ) {
    return;
  }

  const nextProfileState =
    purchasePermanentUpgrade(
      profileState,
      unitId,
      statId,
      expectedCurrentLevel
    );

  if (
    nextProfileState ===
    profileState
  ) {
    return;
  }

  profileState =
    nextProfileState;

  console.log(
    "Permanent upgrade purchased:",
    {
      unitId,
      statId,
      profileState
    }
  );

  renderApp();
}

function finishPostRunShopToRunOverview() {
  if (
    currentScene !==
      "post_run_shop"
  ) {
    return;
  }

  openRunOverview();
}

function completePendingBuffChoice(buffId) {
  const isValidationChoice =
    Boolean(validationRewardState);
  const rewardState =
    validationRewardState ?? runState;
  if (
    currentScene !==
      "reward_selection" ||
    !rewardState
  ) {
    return;
  }

  const selectedReward = buffId
    ? rewardState.pendingRewardOptions
      ?.find((reward) => {
        return (
          reward.buffId ===
          buffId
        );
      })
    : null;

  const sourceNodeId =
    rewardState
      .pendingRewardSourceNodeId;

  if (isValidationChoice) {
    validationSessionState =
      completeValidationBuffDecision(
        validationSessionState,
        buffId
      );
    validationRewardState = {
      ...validationRewardState,
      activeRunBuffs:
        selectedReward ? [selectedReward] : []
    };
    startStage2ValidationPlaceholder();
    return;
  }

  const nextRunState =
    chooseRunReward(
      runState,
      buffId
    );

  if (nextRunState === runState) {
    return;
  }

  runState =
    completeRunIfFinalStageCompleted(
      nextRunState
    );

  console.log(
    "Run buff choice resolved:",
    {
      sourceNodeId,
      selectedReward,
      runState
    }
  );

  if (
    runState.runStatus ===
    "completed"
  ) {
    openCompletedRunSummary();
    return;
  }

  openMapSelection();
}

function togglePendingBuffChoice(buffId) {
  const rewardState =
    validationRewardState ?? runState;
  const isValidOption =
    rewardState?.pendingRewardOptions?.some(
      (buff) => buff.buffId === buffId
    );

  if (
    currentScene !== "reward_selection" ||
    buffSelectionUiState.confirming ||
    !isValidOption
  ) {
    return;
  }

  buffSelectionUiState = {
    ...buffSelectionUiState,
    selectedBuffId:
      buffSelectionUiState.selectedBuffId === buffId
        ? null
        : buffId,
    warningArmed: false
  };

  if (validationRewardState) {
    validationSessionState =
      recordValidationBuffSelection(
        validationSessionState,
        buffSelectionUiState.selectedBuffId
      );
  }

  renderApp();
}

function confirmPendingBuffChoice() {
  if (
    currentScene !== "reward_selection" ||
    buffSelectionUiState.confirming
  ) {
    return;
  }

  const selectedBuffId =
    buffSelectionUiState.selectedBuffId;

  if (
    !selectedBuffId &&
    !buffSelectionUiState.warningArmed
  ) {
    buffSelectionUiState = {
      ...buffSelectionUiState,
      warningArmed: true
    };
    renderApp();
    return;
  }

  if (!selectedBuffId) {
    completePendingBuffChoice(null);
    return;
  }

  buffSelectionUiState = {
    ...buffSelectionUiState,
    confirming: true,
    warningArmed: false
  };
  renderApp();

  buffConfirmationTimerId =
    window.setTimeout(() => {
      buffConfirmationTimerId = null;
      completePendingBuffChoice(
        selectedBuffId
      );
    }, 700);
}

function toggleActiveBuffList() {
  if (currentScene === "reward_selection") {
    buffSelectionUiState = {
      ...buffSelectionUiState,
      activeBuffListOpen:
        !buffSelectionUiState.activeBuffListOpen
    };
  } else {
    activeBuffListOpen =
      !activeBuffListOpen;
  }

  if (currentScene === "battle") {
    document.querySelector(
      ".active-buff-access"
    )?.classList.toggle(
      "active-buff-access-open",
      activeBuffListOpen
    );
    document.querySelector(
      ".active-buff-toggle"
    )?.setAttribute(
      "aria-expanded",
      String(activeBuffListOpen)
    );
    return;
  }

  renderApp();
}

function handleBattleResultPrimaryAction() {
  if (
    !battleState ||
    battleState.battleControlState !==
      "battle_result"
  ) {
    return;
  }

  const isLockedRunVictory =
    battleState.flowContext ===
      "run_stage" &&
    battleState.resultState ===
      "victory" &&
    battleState.resultPresentationReady !==
      true;

  if (isLockedRunVictory) {
    return;
  }

  if (isStage1RedesignBattle(battleState)) {
    if (
      !isStage2PlaceholderBattle(battleState) &&
      battleState.resultState === "victory"
    ) {
      openValidationBuffSelection();
    }
    return;
  }

  const isTutorialBattle =
    battleState.flowContext ===
    "tutorial";

  if (isTutorialBattle) {
    if (
      battleState.resultState ===
        "training_failed"
    ) {
      if (!latestTutorialCheckpoint) {
        throw new Error(
          "Tutorial checkpoint tidak tersedia untuk retry."
        );
      }

      clearEnemyPhaseTimer();
      battleState =
        restoreTutorialCheckpoint(
          latestTutorialCheckpoint
        );
      resetBattlefieldCameraState();

      assertTutorialBattlefieldState(
        appData.tutorialMap,
        battleState
      );

      renderApp();
      scheduleTutorialBriefAdvance();
      return;
    }

    if (
      battleState.resultState ===
      "victory"
    ) {
      profileState =
        markTutorialCompleted(
          profileState
        );

      console.log(
        "Tutorial completed. " +
        "Profile saved:",
        profileState
      );

      openRunOverview();

return;
    }

    if (
      battleState.resultState ===
        "defeat"
    ) {
      if (latestTutorialCheckpoint?.checkpointId === "cp8") {
        clearEnemyPhaseTimer();
        battleState = restoreTutorialCheckpoint(
          latestTutorialCheckpoint
        );
        resetBattlefieldCameraState();

        assertTutorialBattlefieldState(
          appData.tutorialMap,
          battleState
        );

        renderApp();
        scheduleTutorialBriefAdvance();
        return;
      }

      startTutorialBattle();
    }

    return;
  }

  const isRunStageBattle =
    battleState.flowContext ===
    "run_stage";

  if (!isRunStageBattle) {
  return;
}

if (
  battleState.resultState ===
    "victory"
) {
  openRunStageRewardSelection();
  return;
}

if (
  battleState.resultState ===
    "defeat"
) {
  openRunStageDefeatSummary();
}
}

function attachFlowEvents() {
  const titleScreen =
    document.querySelector(
      '[data-screen="title"]'
    );

  if (titleScreen) {
    titleScreen.addEventListener(
      "click",
      () => {
        openMainMenu();
      }
    );
  }

  const startJourneyButton =
    document.querySelector(
      '[data-action="start-journey"]'
    );

    const startRunFromOverviewButton =
  document.querySelector(
    '[data-action="start-run-from-overview"]'
  );

if (startRunFromOverviewButton) {
  startRunFromOverviewButton
    .addEventListener(
      "click",
      () => {
        startRunFromOverview();
      }
    );
}

  if (startJourneyButton) {
    startJourneyButton.addEventListener(
      "click",
      () => {
        startJourney();
      }
    );
  }

  document.querySelector('[data-action="open-stage1-redesign"]')?.addEventListener(
    "click",
    openStage1RedesignEntry
  );

  const stage1ParticipantInput = document.querySelector(
    "[data-stage1-participant-code]"
  );
  stage1ParticipantInput?.addEventListener("input", (event) => {
    stage1EntryUiState = {
      participantCode: event.target.value,
      errorMessage: null
    };
  });

  document.querySelector('[data-action="start-stage1-redesign"]')?.addEventListener(
    "click",
    startStage1Redesign
  );
    const resetDataButton =
    document.querySelector(
      '[data-action="reset-data"]'
    );

  if (resetDataButton) {
    resetDataButton.addEventListener(
      "click",
      () => {
        resetPrototypeData();
      }
    );
  }
    const backMainMenuButton =
    document.querySelector(
      '[data-action="back-main-menu"]'
    );

    const backRunOverviewButton =
  document.querySelector(
    '[data-action="back-run-overview"]'
  );

if (backRunOverviewButton) {
  backRunOverviewButton
    .addEventListener(
      "click",
      () => {
        openRunOverview();
      }
    );
}

  if (backMainMenuButton) {
    backMainMenuButton.addEventListener(
      "click",
      () => {
        openMainMenu();
      }
    );
  }
    const regionNodeButtons =
    document.querySelectorAll(
      '[data-action="select-region-node"]'
    );

  regionNodeButtons.forEach(
    (nodeButton) => {
      nodeButton.addEventListener(
        "click",
        () => {
          const nodeId =
            nodeButton.dataset.nodeId;

          selectRunNode(nodeId);
        }
      );
    }
  );
    const openBattleIntroButton =
    document.querySelector(
      '[data-action="open-battle-intro"]'
    );

  if (openBattleIntroButton) {
    openBattleIntroButton.addEventListener(
      "click",
      () => {
        openSelectedStageBattleIntro();
      }
    );
  }

  const beginStageBattleButton =
    document.querySelector(
      '[data-action="begin-stage-battle"]'
    );

  if (beginStageBattleButton) {
    beginStageBattleButton.addEventListener(
      "click",
      () => {
        beginSelectedStageBattle();
      }
    );
  }

  const backMapSelectionButton =
    document.querySelector(
      '[data-action="back-map-selection"]'
    );

  if (backMapSelectionButton) {
    backMapSelectionButton.addEventListener(
      "click",
      () => {
        closeBattleIntro();
      }
    );
  }
    const rewardChoiceButtons =
    document.querySelectorAll(
      '[data-action="toggle-buff-choice"]'
    );

  rewardChoiceButtons.forEach(
    (rewardButton) => {
      rewardButton.addEventListener(
        "click",
        () => {
          const rewardId =
            rewardButton.dataset
              .buffId;

          togglePendingBuffChoice(
            rewardId
          );
        }
      );
    }
  );
  const confirmBuffChoiceButton =
    document.querySelector(
      '[data-action="confirm-buff-choice"]'
    );

  if (confirmBuffChoiceButton) {
    confirmBuffChoiceButton.addEventListener(
      "click",
      () => {
        confirmPendingBuffChoice();
      }
    );
  }

  document.querySelectorAll(
    '[data-action="toggle-active-buff-list"]'
  ).forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        toggleActiveBuffList();
      }
    );
  });
    const runCompletionOverviewButton =
  document.querySelector(
    '[data-action="run-completion-overview"]'
  );

if (runCompletionOverviewButton) {
  runCompletionOverviewButton
    .addEventListener(
      "click",
      () => {
        finishCompletedRunToRunOverview();
      }
    );
}

const runDefeatOverviewButton =
  document.querySelector(
    '[data-action="run-defeat-overview"]'
  );

if (runDefeatOverviewButton) {
  runDefeatOverviewButton
    .addEventListener(
      "click",
      () => {
        finishDefeatedRunToRunOverview();
      }
    );
}

  const runSettlementMainMenuButton =
    document.querySelector(
      '[data-action="run-settlement-main-menu"]'
    );

  if (runSettlementMainMenuButton) {
    runSettlementMainMenuButton.addEventListener(
      "click",
      () => {
        openMainMenu();
      }
    );
  }

  const runDefeatMainMenuButton =
  document.querySelector(
    '[data-action="run-defeat-main-menu"]'
  );

if (runDefeatMainMenuButton) {
  runDefeatMainMenuButton
    .addEventListener(
      "click",
      () => {
        finishDefeatedRunToMainMenu();
      }
    );
}
  const openPostRunShopButton =
    document.querySelector(
      '[data-action="open-post-run-shop"]'
    );

  if (openPostRunShopButton) {
    openPostRunShopButton
      .addEventListener(
        "click",
        () => {
          openPostRunShop();
        }
      );
  }

  const shopPurchaseButtons =
    document.querySelectorAll(
      '[data-action="buy-permanent-upgrade"]'
    );

  shopPurchaseButtons.forEach(
    (purchaseButton) => {
      purchaseButton.addEventListener(
        "click",
        () => {
          purchaseButton.disabled =
            true;

          const unitId =
            purchaseButton.dataset.unitId;

          const statId =
            purchaseButton.dataset.statId;

          const expectedCurrentLevel =
            Number(
              purchaseButton.dataset
                .expectedLevel
            );

          buyPermanentUpgrade(
            unitId,
            statId,
            expectedCurrentLevel
          );
        }
      );
    }
  );

  const shopRunOverviewButton =
  document.querySelector(
    '[data-action="post-run-shop-run-overview"]'
  );

if (shopRunOverviewButton) {
  shopRunOverviewButton
    .addEventListener(
      "click",
      () => {
        finishPostRunShopToRunOverview();
      }
    );
}

  
}

function attachBattleEvents() {
  document.querySelectorAll(
    '[data-action="toggle-active-buff-list"]'
  ).forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        toggleActiveBuffList();
      }
    );
  });

  document.querySelectorAll("[data-action-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      if (battleState.battleControlState !== "action_menu_open") return;
      const tutorialTaskId = commitActionMenuSelection(
        button.dataset.actionChoice
      );
      renderApp();
      if (tutorialTaskId === "explain_archer_atr") {
        scheduleTutorialBriefAdvance();
      }
    });
  });

  const tileButtons =
    document.querySelectorAll(
      ".map-tile"
    );

  tileButtons.forEach(
    (tileButton) => {
      tileButton.addEventListener(
        "click",
        () => {
          const x = Number(tileButton.dataset.tileX);
          const y = Number(tileButton.dataset.tileY);

          if (battleState.battleControlState === "attack_targeting") {
            if (!isTutorialInputAllowed(battleState, "confirm_action")) return;
            const clickedTarget = getValidPlayerBasicAttackTargets(
              getCurrentBattleMap(),
              battleState
            ).find((targetData) => (
              targetData.entity?.tileX === x &&
              targetData.entity?.tileY === y
            ));

            if (!clickedTarget) return;
            battleState = {
              ...battleState,
              targetType: clickedTarget.targetType,
              targetId: clickedTarget.targetId
            };
            commitSelectedBasicAttack();
            renderApp();
            return;
          }

          if (
  !isTutorialInputAllowed(
    battleState,
    "movement"
  )
) {
  return;
}
          if (
            battleState
              .battleControlState !==
            "unit_selected_movement"
          ) {
            return;
          }

          const previousBattleState =
            battleState;

          const movedBattleState =
            moveSelectedUnitToTile(
              getCurrentBattleMap(),
              battleState,
              x,
              y
            );

          battleState =
            refreshEnemyReadabilityAfterPlayerMovement(
              previousBattleState,
              movedBattleState
            );
          battleState = recordStage1Movement(
            previousBattleState,
            battleState
          );

          renderApp();
        }
      );
    }
  );

  attachBattlefieldCameraEvents();

  const phaseJumpInput =
    document.querySelector(
      "[data-tutorial-phase-jump-input]"
    );

  if (phaseJumpInput) {
    phaseJumpInput.addEventListener(
      "input",
      (event) => {
        tutorialPhaseJumpUiState = {
          ...tutorialPhaseJumpUiState,
          phaseInput:
            event.target.value,
          errorMessage: null
        };
      }
    );
  }

  const phaseJumpGoButton =
    document.querySelector(
      "[data-tutorial-phase-jump-go]"
    );

  if (phaseJumpGoButton) {
    phaseJumpGoButton.addEventListener(
      "click",
      () => {
        performTutorialPhaseJump();
      }
    );
  }

  const phaseJumpCancelButton =
    document.querySelector(
      "[data-tutorial-phase-jump-cancel]"
    );

  if (phaseJumpCancelButton) {
    phaseJumpCancelButton.addEventListener(
      "click",
      () => {
        closeTutorialPhaseJump();
      }
    );
  }

  const resultPrimaryButton =
    document.querySelector(
      '[data-action="battle-result-primary"]'
    );

  if (resultPrimaryButton) {
    resultPrimaryButton.addEventListener(
      "click",
      () => {
        handleBattleResultPrimaryAction();
      }
    );
  }

  document.querySelector('[data-action="validation-continue-buffs"]')?.addEventListener(
    "click",
    openValidationBuffSelection
  );
  document.querySelector('[data-action="validation-export"]')?.addEventListener(
    "click",
    exportValidationTelemetry
  );
  document.querySelector('[data-action="validation-retry"]')?.addEventListener(
    "click",
    retryValidationStage
  );
  document.querySelector('[data-action="validation-main-menu"]')?.addEventListener(
    "click",
    returnValidationToMainMenu
  );
  const endPlayerTurnButton =
  document.querySelector(
    '[data-action="end-player-turn"]'
  );

if (endPlayerTurnButton) {
  endPlayerTurnButton.addEventListener(
    "click",
    () => {
      if (
        !isTutorialInputAllowed(
          battleState,
          "end_turn"
        )
      ) {
        return;
      }

      endPlayerTurn();
    }
  );
}
}

function resetBattlefieldCameraState() {
  battlefieldCameraState = {
    initialized: false,
    focusKey: null,
    translateX: 0,
    translateY: 0
  };

  battlefieldCameraDragState = null;
  battlefieldCameraFocusUnitId = null;
  battlefieldCameraSuppressClickUntil = 0;
}

function requestBattlefieldCameraFocusOnUnit(
  unitId
) {
  battlefieldCameraFocusUnitId =
    unitId ?? null;
}

function getBattlefieldCameraElements() {
  const viewport =
    document.querySelector(
      "[data-battlefield-viewport]"
    );

  const world =
    document.querySelector(
      "[data-battlefield-world]"
    );

  if (!viewport || !world) {
    return null;
  }

  return {
    viewport,
    world
  };
}

function applyBattlefieldCameraTranslation(
  world,
  translation
) {
  world.style.transform =
    `translate(` +
    `${translation.translateX}px, ` +
    `${translation.translateY}px` +
    `)`;
}

function getBattlefieldCameraFocusUnit() {
  if (
    !battleState ||
    !battlefieldCameraFocusUnitId
  ) {
    return null;
  }

  return [
    ...battleState.playerUnits,
    ...battleState.enemyUnits
  ].find((unit) => {
    return (
      unit.battleUnitId ===
      battlefieldCameraFocusUnitId
    );
  }) ?? null;
}

function updateBattlefieldCamera() {
  if (
    currentScene !== "battle" ||
    !battleState
  ) {
    return;
  }

  const cameraElements =
    getBattlefieldCameraElements();

  if (!cameraElements) {
    return;
  }

  const {
    viewport,
    world
  } = cameraElements;

  const mapData =
    getCurrentBattleMap();

  const activeTileBounds =
    getBattleCameraActiveTileBounds(
      mapData,
      battleState
    );

  if (!activeTileBounds) {
    return;
  }

  const focusKey =
    getBattleCameraFocusKey(
      battleState
    );

  const focusUnit =
    getBattlefieldCameraFocusUnit();

  const requestedFocusBounds =
    focusUnit
      ? getBattleCameraUnitTileBounds(
          focusUnit
        )
      : getBattleCameraTileBounds(
          mapData,
          battleState
        );

  const shouldRecenter =
    !battlefieldCameraState.initialized ||
    battlefieldCameraState.focusKey !==
      focusKey ||
    Boolean(focusUnit);

  let nextTranslation = null;

  if (shouldRecenter) {
    nextTranslation =
      calculateCenteredBattleCameraTranslation({
        tileBounds:
          requestedFocusBounds ??
          activeTileBounds,
        viewportWidth:
          viewport.clientWidth,
        viewportHeight:
          viewport.clientHeight
      });
  } else {
    nextTranslation = {
      translateX:
        battlefieldCameraState
          .translateX,
      translateY:
        battlefieldCameraState
          .translateY
    };
  }

  const clampedTranslation =
    clampBattleCameraTranslation({
      ...nextTranslation,
      tileBounds: activeTileBounds,
      viewportWidth:
        viewport.clientWidth,
      viewportHeight:
        viewport.clientHeight
    });

  if (!clampedTranslation) {
    return;
  }

  battlefieldCameraState = {
    initialized: true,
    focusKey,
    ...clampedTranslation
  };

  battlefieldCameraFocusUnitId = null;

  applyBattlefieldCameraTranslation(
    world,
    battlefieldCameraState
  );
}

function finishBattlefieldCameraDrag(
  viewport,
  pointerId,
  shouldSuppressClick
) {
  if (
    viewport.hasPointerCapture?.(
      pointerId
    )
  ) {
    viewport.releasePointerCapture(
      pointerId
    );
  }

  viewport.classList.remove(
    "is-camera-dragging"
  );

  if (shouldSuppressClick) {
    battlefieldCameraSuppressClickUntil =
      Date.now() + 150;
  }

  battlefieldCameraDragState = null;
}

function attachBattlefieldCameraEvents() {
  const cameraElements =
    getBattlefieldCameraElements();

  if (!cameraElements) {
    return;
  }

  const {
    viewport,
    world
  } = cameraElements;

  viewport.addEventListener(
    "pointerdown",
    (event) => {
      if (
        !event.isPrimary ||
        (
          event.pointerType === "mouse" &&
          event.button !== 0
        )
      ) {
        return;
      }

      battlefieldCameraDragState = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startTranslation: {
          translateX:
            battlefieldCameraState
              .translateX,
          translateY:
            battlefieldCameraState
              .translateY
        },
        hasDragged: false
      };
    }
  );

  viewport.addEventListener(
    "pointermove",
    (event) => {
      if (
        !battlefieldCameraDragState ||
        battlefieldCameraDragState
          .pointerId !==
          event.pointerId
      ) {
        return;
      }

      const dragUpdate =
        getBattleCameraDragUpdate({
          startClientX:
            battlefieldCameraDragState
              .startClientX,
          startClientY:
            battlefieldCameraDragState
              .startClientY,
          currentClientX:
            event.clientX,
          currentClientY:
            event.clientY,
          threshold:
            BATTLE_CAMERA_DRAG_THRESHOLD_PX
        });

      if (
        !battlefieldCameraDragState
          .hasDragged &&
        !dragUpdate.hasDragged
      ) {
        return;
      }

      if (
        !battlefieldCameraDragState
          .hasDragged
      ) {
        viewport.setPointerCapture?.(
          event.pointerId
        );
      }

      battlefieldCameraDragState = {
        ...battlefieldCameraDragState,
        hasDragged: true
      };

      event.preventDefault();

      viewport.classList.add(
        "is-camera-dragging"
      );

      const mapData =
        getCurrentBattleMap();

      const activeTileBounds =
        getBattleCameraActiveTileBounds(
          mapData,
          battleState
        );

      if (!activeTileBounds) {
        return;
      }

      const nextTranslation =
        panBattleCameraTranslation({
          currentTranslation:
            battlefieldCameraDragState
              .startTranslation,
          deltaX: dragUpdate.deltaX,
          deltaY: dragUpdate.deltaY,
          tileBounds:
            activeTileBounds,
          viewportWidth:
            viewport.clientWidth,
          viewportHeight:
            viewport.clientHeight
        });

      if (!nextTranslation) {
        return;
      }

      battlefieldCameraState = {
        initialized: true,
        focusKey:
          getBattleCameraFocusKey(
            battleState
          ),
        ...nextTranslation
      };

      applyBattlefieldCameraTranslation(
        world,
        battlefieldCameraState
      );
    }
  );

  viewport.addEventListener(
    "pointerup",
    (event) => {
      if (
        !battlefieldCameraDragState ||
        battlefieldCameraDragState
          .pointerId !==
          event.pointerId
      ) {
        return;
      }

      finishBattlefieldCameraDrag(
        viewport,
        event.pointerId,
        battlefieldCameraDragState
          .hasDragged
      );
    }
  );

  viewport.addEventListener(
    "pointercancel",
    (event) => {
      if (
        !battlefieldCameraDragState ||
        battlefieldCameraDragState
          .pointerId !==
          event.pointerId
      ) {
        return;
      }

      finishBattlefieldCameraDrag(
        viewport,
        event.pointerId,
        false
      );
    }
  );

  viewport.addEventListener(
    "click",
    (event) => {
      if (
        Date.now() >
        battlefieldCameraSuppressClickUntil
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    },
    true
  );
}

function renderBattleScene() {
  if (!battleState) {
    return;
  }

  const isMovementState =
    battleState.battleControlState ===
    "unit_selected_movement";

  const movementTiles = isMovementState
    ? getMovementTiles(
        getCurrentBattleMap(),
        battleState
      )
    : [];

    const attackCandidates =
    battleState.phase ===
      "player_phase"
      ? getPlayerBasicAttackCandidates(
          getCurrentBattleMap(),
          battleState
        )
      : [];

  const validAttackTargets =
    battleState
      .battleControlState ===
      "attack_targeting"
      ? attackCandidates.filter(
          (targetData) => {
            return (
              targetData.actionValid
            );
          }
        )
      : [];

const battleRenderData = {
  ...appData,

  stage1Map:
    getCurrentBattleMap()
};

document.querySelector(
  "#app"
).innerHTML = renderBattleHud(
  battleRenderData,
  battleState,
  movementTiles,
  validAttackTargets,
  attackCandidates,
  tutorialPhaseJumpUiState,
  {
    activeRunBuffs:
      validationRewardState?.activeRunBuffs ??
      runState?.activeRunBuffs ?? [],
    activeBuffListOpen,
    validationExportStatus:
      validationSessionState?.exportStatus ?? null,
    validationExportFeedback:
      validationSessionState?.exportFeedback ?? null
  }
);

  document.querySelector('#app').insertAdjacentHTML('beforeend', renderSkillPanel(getCurrentBattleMap(), battleState, profileState));
  const skillPanel = document.querySelector('.skill-panel');
  if (skillPanel) {
    for (const child of document.querySelector('#app').children) if (child !== skillPanel) child.inert = true;
    skillPanel.querySelector('button:not(:disabled)')?.focus({ preventScroll: true });
  }
  for (const unit of [...battleState.playerUnits, ...battleState.enemyUnits]) {
    const labels = [
      unit.fortifyShield > 0 ? `FORTIFIED · SHIELD ${unit.fortifyShield}` : '',
      unit.temporaryShield > 0 ? `SHIELD ${unit.temporaryShield}` : '',
      unit.stage1RecoveryState === 'pending' ? 'STUNNED · RECOVERY' : '',
      unit.interceptBy ? 'PROTECTED' : '',
      unit.pinnedEnemyTurns > 0 ? 'PINNED' : ''
    ].filter(Boolean);
    const tile = document.querySelector(`[data-tile-x="${unit.tileX}"][data-tile-y="${unit.tileY}"]`);
    if (tile && labels.length) { const badge = document.createElement('span'); badge.className = 'skill-status-badge'; badge.textContent = labels.join(' · '); tile.append(badge); }
  }
  document.querySelectorAll('[data-skill-id]').forEach(button => button.addEventListener('click', () => {
    battleState = { ...battleState, selectedSkill: button.dataset.skillId, battleControlState: 'skill_targeting' };
    renderApp();
  }));
  document.querySelector('[data-skill-back]')?.addEventListener('click', closeSkillPanel);
  document.querySelectorAll('[data-skill-target]').forEach(button => button.addEventListener('click', () => {
    const previous = battleState;
    const stage1ThreatContext = isStage1RedesignBattle(previous)
      ? getStage1FortifyThreatContext(previous)
      : null;
    const result = resolveSkill(getCurrentBattleMap(), battleState, profileState, battleState.selectedSkill, button.dataset.skillTarget);
    battleState = result.error ? { ...battleState, feedbackMessage: result.error } : result.battleState;
    if (!result.error) {
      if (isStage1RedesignBattle(battleState) && previous.selectedSkill === 'fortify') {
        battleState = appendStage1TelemetryEvent(battleState, 'fortify_used', {
          actorId: previous.selectedUnitId,
          targetId: button.dataset.skillTarget,
          payload: {
            apBefore: previous.teamApCurrent,
            apAfter: battleState.teamApCurrent,
            shield: 6,
            ...stage1ThreatContext
          }
        });
      }
      battleState = recordTutorialPhase8PlayerAttack(previous, battleState, { attackerId: previous.selectedUnitId, finalDamage: 0 });
      battleState = refreshEnemyReadabilityState(battleState);
      battleState = resolvePostAttackBattleOutcome(battleState);
    }
    renderApp();
  }));

  attachBattleEvents();
  updateBattlefieldCamera();
  scheduleBattleResultPresentation();

  if (!tutorialPhaseJumpUiState.open) {
    scheduleEnemyPhaseResolution();
  }
}

function renderApp() {
  const appElement =
    document.querySelector("#app");

  if (currentScene !== "battle") {
    clearEnemyPhaseTimer();
    clearTutorialBriefTimer();
    clearBattleResultPresentationTimers();
  }

  if (currentScene === "title") {
    appElement.innerHTML =
      renderTitleScreen();

    attachFlowEvents();
    return;
  }

  if (currentScene === "main_menu") {
    appElement.innerHTML =
      renderMainMenuScreen();

    attachFlowEvents();
    return;
  }

  if (currentScene === "stage1_redesign_entry") {
    appElement.innerHTML = renderStage1RedesignEntryScreen(
      stage1EntryUiState
    );
    attachFlowEvents();
    document.querySelector("[data-stage1-participant-code]")?.focus();
    return;
  }

  if (
  currentScene ===
    "run_overview"
) {
  appElement.innerHTML =
    renderRunOverviewScreen(
      profileState
    );

  attachFlowEvents();
  return;
}

    if (
    currentScene ===
    "map_selection"
  ) {
    appElement.innerHTML =
  renderMapSelectionScreen(
    profileState,
    runState,
    activeBuffListOpen
  );

    attachFlowEvents();
    return;
  }

    if (
    currentScene ===
    "battle_intro"
  ) {
    appElement.innerHTML =
      renderBattleIntroScreen(
        runState,
        battleIntroNodeId
      );

    attachFlowEvents();
    return;
  }

    if (
    currentScene ===
    "reward_selection"
  ) {
    appElement.innerHTML =
      renderRewardSelectionScreen(
        validationRewardState ?? runState,
        buffSelectionUiState
      );

    attachFlowEvents();
    return;
  }

    if (
    currentScene ===
    "run_completion"
  ) {
    appElement.innerHTML =
      renderRunCompletionScreen(
        profileState,
        runState
      );

    attachFlowEvents();
    return;
  }
  if (
  currentScene ===
  "run_defeat"
) {
  appElement.innerHTML =
    renderRunDefeatScreen(
      profileState,
      runState
    );

  attachFlowEvents();
  return;
}

  if (
    currentScene ===
    "post_run_shop"
  ) {
    appElement.innerHTML =
      renderShop(profileState, shopUi, appData.playerUnits);

    document.querySelector('[data-shop-back]').addEventListener('click', finishPostRunShopToRunOverview);
    document.querySelectorAll('[data-shop-unit]').forEach(b => b.addEventListener('click', () => {
      shopUi = { ...shopUi, unit: b.dataset.shopUnit, tab: 'upgrades', item: 'maxHP', message: '' }; renderApp();
    }));
    document.querySelectorAll('[data-shop-tab]').forEach(b => b.addEventListener('click', () => {
      shopUi = { ...shopUi, tab: b.dataset.shopTab, item: b.dataset.shopTab === 'upgrades' ? 'maxHP' : shopUi.unit === 'guard' ? 'fortify' : 'pinning_shot', message: '' }; renderApp();
    }));
    document.querySelectorAll('[data-shop-item]').forEach(b => b.addEventListener('click', () => {
      shopUi = { ...shopUi, item: b.dataset.shopItem, message: '' }; renderApp();
    }));
    document.querySelector('[data-shop-buy]')?.addEventListener('click', (event) => {
      if (Date.now() < shopUi.busyUntil) return;
      shopUi.busyUntil = Date.now() + 450;
      const before = profileState;
      try {
        profileState = SKILLS[shopUi.item] ? purchaseSkill(profileState, shopUi.item) : purchasePermanentUpgrade(profileState, shopUi.unit, shopUi.item, Number(event.currentTarget.dataset.level));
        shopUi.message = before === profileState ? 'Not enough Meta Crystal or item unavailable.' : 'Saved.';
      } catch {
        shopUi.message = 'Could not save. Purchase cancelled. Check browser storage.';
      }
      renderApp();
      document.querySelector('.shop-detail')?.classList.add(before === profileState ? 'shop-error' : 'shop-success');
      if (before !== profileState) {
        const balance = document.querySelector('.shop-balance');
        const start = performance.now();
        const after = profileState.metaCrystal;
        const animate = now => {
          if (!balance?.isConnected) return;
          const t = Math.min(1, (now - start) / 350);
          balance.textContent = `◆ ${Math.round(before.metaCrystal + (after - before.metaCrystal) * t)}`;
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
      document.querySelector('[data-shop-buy]:not(:disabled)')?.focus({ preventScroll: true });
    });

    attachFlowEvents();
    return;
  }

  if (currentScene === "battle") {
    renderBattleScene();
    return;
  }

  appElement.innerHTML = `
    <main class="app-shell">
      <section class="hero-card error-card">
        <p class="eyebrow">
          Scene Error
        </p>

        <h1>Unknown Scene</h1>

        <p class="description">
          Scene "${currentScene}"
          belum memiliki renderer.
        </p>
      </section>
    </main>
  `;
}


function handleAttackTargetingInput(event, key) {
  const isLeft =
    key === "a" || key === "arrowleft";
  const isRight =
    key === "d" || key === "arrowright";

  if (isLeft) {
    event.preventDefault();
    moveAttackTargetSelection("left");
    renderApp();
    return;
  }

  if (isRight) {
    event.preventDefault();
    moveAttackTargetSelection("right");
    renderApp();
    return;
  }

  if (key === "e") {
    event.preventDefault();
    if (!commitSelectedBasicAttack()) {
      renderApp();
      return;
    }

    const tutorialTaskId =
      battleState.tutorialState?.taskId;

    renderApp();

    if (
      tutorialTaskId ===
        "explain_attack_movement_lock" ||
      tutorialTaskId ===
        "phase_4_attack_checkpoint" ||
      tutorialTaskId ===
        "phase_6_entry"
    ) {
      scheduleTutorialBriefAdvance();
    }

    return;
  }

  if (key === "z") {
    event.preventDefault();
    closeAttackTargeting();
    renderApp();
  }
}

function handleActionMenuInput(event, key) {
  const isLeft = key === "a" || key === "arrowleft";
  const isRight = key === "d" || key === "arrowright";

  if (isLeft) {
    event.preventDefault();
    moveActionMenuSelection("left");
    renderApp();
    return;
  }

  if (isRight) {
    event.preventDefault();
    moveActionMenuSelection("right");
    renderApp();
    return;
  }

      if (key === "e") {
    event.preventDefault();
    const tutorialTaskId = commitActionMenuSelection();

    renderApp();

    if (
      tutorialTaskId ===
        "explain_archer_atr"
    ) {
      scheduleTutorialBriefAdvance();
    }

    return;
  }

  if (key === "z") {
    event.preventDefault();
    closeActionMenu();
    renderApp();
  }
}

function scheduleTutorialBriefAdvance() {
  if (tutorialBriefTimerId !== null) {
    return;
  }

  tutorialBriefTimerId =
    window.setTimeout(() => {
      tutorialBriefTimerId = null;

    if (
      currentScene !== "battle" ||
      !battleState ||
      tutorialPhaseJumpUiState.open
    ) {
      return;
    }

    const nextBattleState =
      advanceTutorialBrief(
        battleState
      );

    if (
      nextBattleState ===
      battleState
    ) {
      return;
    }

    battleState =
      initializeTutorialPhase8RuntimeIfNeeded(
        nextBattleState
      );

    const nextTutorialTaskId =
      battleState
        .tutorialState
        ?.taskId;

    renderApp();

  const shouldContinueBriefChain =
  nextTutorialTaskId ===
    "explain_movement_range" ||
  nextTutorialTaskId ===
    "introduce_sword_enemy" ||
  nextTutorialTaskId ===
    "explain_enemy_intent" ||
  nextTutorialTaskId ===
    "explain_new_startgrids" ||
  nextTutorialTaskId ===
    "explain_obstacle_blocking" ||
  nextTutorialTaskId ===
    "explain_obstacle_cover" ||
  nextTutorialTaskId ===
    "explain_nearest_target" ||
  nextTutorialTaskId ===
    "explain_remaining_team_ap" ||
  nextTutorialTaskId ===
    "explain_pressure_redirect" ||
  nextTutorialTaskId ===
    "explain_guard_durability" ||
  nextTutorialTaskId ===
    "phase_5_recovery_checkpoint" ||
  nextTutorialTaskId ===
    "introduce_spear" ||
  nextTutorialTaskId ===
    "explain_spear_spacing" ||
  nextTutorialTaskId ===
    "structure_targeting_intro" ||
  nextTutorialTaskId ===
    "explain_charge_progress" ||
  nextTutorialTaskId ===
    "explain_charge_delayed_payoff" ||
  nextTutorialTaskId ===
    "explain_charge_preparation_window" ||
  nextTutorialTaskId ===
    "explain_charge_next_intent" ||
  nextTutorialTaskId ===
    "end_turn_for_second_charge" ||
  nextTutorialTaskId ===
    "explain_shockwave_current_intent" ||
  nextTutorialTaskId ===
    "explain_shockwave_stun" ||
  nextTutorialTaskId ===
    "move_archer_to_safety" ||
  nextTutorialTaskId ===
    "end_turn_for_shockwave" ||
  nextTutorialTaskId ===
    "explain_stun_duration_2" ||
  nextTutorialTaskId ===
    "explain_stun_shared_ap" ||
  nextTutorialTaskId ===
    "switch_to_archer_for_stun_adaptation" ||
  nextTutorialTaskId ===
    "explain_stun_duration_1" ||
  nextTutorialTaskId ===
    "end_turn_for_recovery" ||
  nextTutorialTaskId ===
    "explain_wave_telegraph" ||
  nextTutorialTaskId ===
    "explain_wave_reservation" ||
  nextTutorialTaskId ===
    "explain_wave_preparation";

    if (
      shouldContinueBriefChain
    ) {
      scheduleTutorialBriefAdvance();
    }
  }, TUTORIAL_BRIEF_DELAY_MS);
}

function handleMovementInput(event, key) {
  const movementKeyMap = {
    w: "up",
    arrowup: "up",
    s: "down",
    arrowdown: "down",
    a: "left",
    arrowleft: "left",
    d: "right",
    arrowright: "right"
  };

  if (movementKeyMap[key]) {
    event.preventDefault();

    const previousBattleState =
      battleState;

    const movedBattleState =
      moveSelectedUnitByDirection(
        getCurrentBattleMap(),
        battleState,
        movementKeyMap[key]
      );

    const readableBattleState =
  refreshEnemyReadabilityAfterPlayerMovement(
    previousBattleState,
    movedBattleState
  );

const phase2TutorialBattleState =
  recordTutorialPlayerMovement(
    previousBattleState,
    readableBattleState
  );

const phase3TutorialBattleState =
  recordTutorialPhase3PlayerMovement(
    previousBattleState,
    phase2TutorialBattleState
  );

const phase4AttackCandidates =
  getBasicAttackCandidates(
    getCurrentBattleMap(),
    phase3TutorialBattleState
  );

const phase4TutorialBattleState =
  recordTutorialPhase4PlayerMovement(
    previousBattleState,
    phase3TutorialBattleState,
    phase4AttackCandidates
  );

const phase5TutorialBattleState =
  recordTutorialPhase5PlayerMovement(
    previousBattleState,
    phase4TutorialBattleState
  );

const phase6TutorialBattleState =
  recordTutorialPhase6PlayerMovement(
    previousBattleState,
    phase5TutorialBattleState
  );

const phase7InitializedBattleState =
  initializeTutorialPhase7RuntimeIfNeeded(
    phase6TutorialBattleState
  );

battleState =
  recordTutorialPhase7PlayerMovement(
    previousBattleState,
    phase7InitializedBattleState
  );

battleState = recordStage1Movement(
  previousBattleState,
  battleState
);

if (isTutorialPhase7CheckpointReady(battleState)) {
  latestTutorialCheckpoint =
    captureTutorialCheckpoint(
      "cp7",
      battleState
    );
}

const tutorialTaskId =
  battleState
    .tutorialState
    ?.taskId;

renderApp();

if (
  tutorialTaskId ===
    "explain_first_movement_ap" ||
  tutorialTaskId ===
    "explain_movement_ap_refund" ||
  tutorialTaskId ===
    "archer_target_b_checkpoint" ||
  tutorialTaskId ===
    "explain_shared_team_ap" ||
  tutorialTaskId ===
    "explain_full_cover" ||
  tutorialTaskId ===
    "explain_partial_cover" ||
  tutorialTaskId ===
    "explain_clear_shot" ||
  tutorialTaskId ===
    "explain_dynamic_intent" ||
  tutorialTaskId ===
    "explain_recovered_intent" ||
  tutorialTaskId ===
    "preserve_guard_in_shockwave"
) {
  scheduleTutorialBriefAdvance();
}
    return;
  }

  if (key === "q") {
  event.preventDefault();

  const switchedBattleState =
    selectNextPlayerUnit(
      battleState
    );

  const phase1To5SelectionState =
    recordTutorialUnitSelection(
      switchedBattleState
    );

  const phase6SelectionState =
    recordTutorialPhase6UnitSelection(
      phase1To5SelectionState
    );

  battleState =
    recordTutorialPhase7UnitSelection(
      phase6SelectionState
    );

  requestBattlefieldCameraFocusOnUnit(
    battleState.selectedUnitId
  );

  renderApp();
  return;
}

  const isOpenMenuInput =
    key === "enter" || event.code === "Space";

   if (isOpenMenuInput) {
    event.preventDefault();

    const previousBattleState =
      battleState;

    openActionMenu();

    battleState =
      recordTutorialActionMenuOpened(
        previousBattleState,
        battleState
      );

    renderApp();
  }
}

function handleTutorialMouseMove(
  event
) {
  if (
    currentScene !== "battle" ||
    !battleState
  ) {
    return;
  }

  if (tutorialPhaseJumpUiState.open) {
    return;
  }

  if (
    !isTutorialInputAllowed(
      battleState,
      "mouse_look"
    )
  ) {
    return;
  }

  const nextBattleState =
    recordTutorialLookMovement(
      battleState,
      event.movementX,
      event.movementY
    );

  if (
    nextBattleState ===
    battleState
  ) {
    return;
  }

  const previousTaskId =
    battleState
      .tutorialState
      ?.taskId;

  battleState =
    nextBattleState;

  const nextTaskId =
    battleState
      .tutorialState
      ?.taskId;

  if (
    previousTaskId !==
    nextTaskId
  ) {
    renderApp();
  }
}

function handleKeyboardInput(event) {
  const key =
    event.key.toLowerCase();

  if (currentScene === "title") {
    event.preventDefault();

    openMainMenu();
    return;
  }

  if (
    currentScene === "main_menu"
  ) {
    if (key === "p") {
      event.preventDefault();
      openStage1RedesignEntry();
      return;
    }

    if (key === "r") {
      event.preventDefault();

      resetPrototypeData();
      return;
    }

    const isStartJourneyInput =
      key === "enter" ||
      key === "e" ||
      event.code === "Space";

    if (isStartJourneyInput) {
      event.preventDefault();

      startJourney();
    }

    return;
  }

  if (currentScene === "stage1_redesign_entry") {
    const isBeginInput =
      key === "enter" ||
      key === "e" ||
      event.code === "Space";
    const isBackInput = key === "escape" || key === "z";

    if (isBeginInput) {
      event.preventDefault();
      startStage1Redesign();
      return;
    }
    if (isBackInput) {
      event.preventDefault();
      openMainMenu();
    }
    return;
  }

  if (
  currentScene ===
    "run_overview"
) {
  const isStartRunInput =
    key === "enter" ||
    key === "e" ||
    event.code === "Space";

  const isBackInput =
    key === "escape" ||
    key === "z";

  if (isStartRunInput) {
    event.preventDefault();

    startRunFromOverview();
    return;
  }

  if (isBackInput) {
    event.preventDefault();

    openMainMenu();
  }

  return;
}

  if (
    currentScene ===
    "map_selection"
  ) {
    const isEnterStageInput =
      key === "enter" ||
      key === "e" ||
      event.code === "Space";

    if (isEnterStageInput) {
      event.preventDefault();

      openSelectedStageBattleIntro();
    }

    return;
  }

  if (
    currentScene ===
    "battle_intro"
  ) {

    const isBeginBattleInput =
      key === "enter" ||
      key === "e" ||
      event.code === "Space";

    const isBackToMapInput =
      key === "z" ||
      key === "escape";

    if (isBeginBattleInput) {
      event.preventDefault();

      beginSelectedStageBattle();
      return;
    }

    if (isBackToMapInput) {
      event.preventDefault();

      closeBattleIntro();
    }

    return;
  }

    if (
    currentScene ===
    "reward_selection"
  ) {
    const rewardNumber =
      Number(key);

    const isRewardNumberInput =
      Number.isInteger(
        rewardNumber
      ) &&
      rewardNumber >= 1 &&
      rewardNumber <= 2;

    if (isRewardNumberInput) {
      event.preventDefault();

      const rewardOption =
        (validationRewardState ?? runState)
          ?.pendingRewardOptions
          ?.[rewardNumber - 1];

      if (rewardOption) {
        togglePendingBuffChoice(
          rewardOption.buffId
        );
      }

      return;
    }

    const isConfirmInput =
      key === "enter" ||
      key === "e" ||
      event.code === "Space";

    if (isConfirmInput) {
      event.preventDefault();
      confirmPendingBuffChoice();
    }

    return;
  }

   if (
  currentScene ===
    "run_completion"
) {
  const isReturnToOverviewInput =
    key === "enter" ||
    key === "e" ||
    event.code === "Space";

  if (isReturnToOverviewInput) {
    event.preventDefault();

    openMainMenu();
  }

  return;
}

  if (
  currentScene ===
    "run_defeat"
) {
  const isReturnToOverviewInput =
    key === "enter" ||
    key === "e" ||
    event.code === "Space";

  if (isReturnToOverviewInput) {
    event.preventDefault();

    openMainMenu();
  }

  return;
}

  if (
    currentScene ===
    "post_run_shop"
  ) {
    if (key === "escape") {
      event.preventDefault();

      finishPostRunShopToRunOverview();
    }

    return;
  }

  if (
    currentScene !== "battle" ||
    !battleState
  ) {
    return;
  }

  if (['skill_menu', 'skill_targeting'].includes(battleState.battleControlState)) {
    if (key === 'escape' || key === 'z') { event.preventDefault(); closeSkillPanel(); }
    // Native Tab / Enter / Space navigation remains available to dialog buttons.
    return;
  }

  if (
    handleTutorialPhaseJumpKeyboardInput(
      event,
      key
    )
  ) {
    return;
  }

  const tutorialMovementKeys = [
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright"
];

const isTutorialOpenActionMenuInput =
  key === "enter" ||
  event.code === "Space";

const tutorialInputType =
  tutorialMovementKeys.includes(
    key
  )
    ? "movement_keyboard"
    : key === "q"
      ? "switch_unit"
      : key === "t"
        ? "end_turn"
        : isTutorialOpenActionMenuInput
          ? "open_action_menu"
          : key === "e"
            ? "confirm_action"
            : key === "z"
              ? "back_action"
              : "other_battle_input";

if (
  !isTutorialInputAllowed(
    battleState,
    tutorialInputType
  )
) {
  event.preventDefault();
  return;
}

  if (
    battleState
      .battleControlState ===
    "battle_result"
  ) {
    if (
      isStage1RedesignBattle(battleState) &&
      event.target?.closest?.('[data-action^="validation-"]')
    ) {
      return;
    }

    const isResultConfirmInput =
      key === "enter" ||
      key === "e" ||
      event.code === "Space";

    if (isResultConfirmInput) {
      event.preventDefault();

      handleBattleResultPrimaryAction();
    }

    return;
  }

  if (
  key === "t" &&
  battleState.phase === "player_phase"
) {
  event.preventDefault();

  endPlayerTurn();
  return;
}

  if (
    battleState
      .battleControlState ===
    "attack_targeting"
  ) {
    handleAttackTargetingInput(
      event,
      key
    );

    return;
  }

  if (
    battleState
      .battleControlState ===
    "action_menu_open"
  ) {
    handleActionMenuInput(
      event,
      key
    );

    return;
  }

  if (
    battleState
      .battleControlState ===
    "unit_selected_movement"
  ) {
    handleMovementInput(
      event,
      key
    );
  }
}

async function startApp() {
  try {
    renderLoadingScreen();

   appData =
  await loadInitialPrototypeData();

profileState =
  loadProfileState();

runState = null;
battleIntroNodeId = null;
battleState = null;

currentScene = "title";

    console.log("Prototype data loaded:", appData);
    console.log(
  "Profile state loaded:",
  profileState
);
    console.log(
  "Initial scene:",
  currentScene
);

    document.addEventListener(
      "keydown",
      handleKeyboardInput
    );

    document.addEventListener(
  "mousemove",
  handleTutorialMouseMove
);

    window.addEventListener(
      "resize",
      updateBattlefieldCamera
    );

    renderApp();
  } catch (error) {
    console.error(error);
    renderErrorScreen(error);
  }
}

startApp();
