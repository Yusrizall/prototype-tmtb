import "./style.css";
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
  getBasicAttackCandidates
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
  spawnTelegraphedWaves
} from "./logic/battle/waveLogic.js";
import {
  evaluateEliminateAllObjective
} from "./logic/battle/objectiveLogic.js";
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
let enemyPhaseTimerId = null;
let tutorialBriefTimerId = null;
let latestTutorialCheckpoint = null;

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

  return appData.stage1Map;
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
    [...battleState.enemyUnits]
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
    battleState = {
      ...stateAfterEnemyActions,
      phase: "battle_end",
      battleControlState: "battle_result",
      selectedUnitId: null,
      actionMenuIndex: 0,
      selectedAction: null,
      targetIndex: 0,
      targetType: null,
      targetId: null,
      resultState: "training_failed",
      feedbackMessage:
        "A required party member was defeated."
    };

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

    battleState = {
      ...stateAfterEnemyActions,

      phase: "battle_end",
      battleControlState: "battle_result",

      selectedUnitId: null,

      actionMenuIndex: 0,
      selectedAction: null,

      targetIndex: 0,
      targetType: null,
      targetId: null,

      resultState: "defeat",

      feedbackMessage:
        `Enemy Phase selesai. ` +
        `${enemyAttackCount} attack menghasilkan ` +
        `${totalEnemyDamage} total damage.` +
        `${defeatedText} ` +
        `Semua unit player kalah.`
    };

    renderApp();
    return;
  }

  // Jika masih ada player hidup,
  // siapkan Player Turn baru.
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

   const previousEnemyPhaseState =
    battleState;

  const phase3TutorialBattleState =
    recordTutorialEnemyResolution(
      previousEnemyPhaseState,
      nextPlayerTurnState
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
    feedbackMessage:
      "Skill belum diimplementasikan pada prototype."
  };
}
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

function createVictoryBattleState(
  nextState,
  previousMessage
) {
  return {
    ...nextState,

    phase: "battle_end",
    battleControlState: "battle_result",

    selectedUnitId: null,

    actionMenuIndex: 0,
    selectedAction: null,

    targetIndex: 0,
    targetType: null,
    targetId: null,

    resultState: "victory",

    feedbackMessage:
      `${previousMessage} ` +
      "Objective eliminate_all selesai. " +
      "Semua enemy telah dikalahkan."
  };
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

function resolvePostAttackBattleOutcome(
  sourceState
) {
  const objectiveEvaluation =
    evaluateEliminateAllObjective(
      sourceState
    );

  const objectiveVictory =
    objectiveEvaluation.resolved &&
    objectiveEvaluation.resultState ===
      "victory";

  if (!objectiveVictory) {
    return sourceState;
  }

  if (
    sourceState.flowContext ===
      "tutorial" &&
    !isTutorialStageVictoryReady(
      sourceState
    )
  ) {
    return sourceState;
  }

  return createVictoryBattleState(
    sourceState,
    sourceState.feedbackMessage ?? ""
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
  battleIntroNodeId = null;

  currentScene = "main_menu";

  renderApp();
}

function openRunOverview() {
  clearEnemyPhaseTimer();

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

  battleState =
    refreshEnemyReadabilityState({
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
  });

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

  if (!runState) {
    createNewRun();
  }

  battleIntroNodeId = null;
  battleState = null;

  currentScene = "map_selection";

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
      stageNode.nodeId
    );

  console.log(
    "Run stage victory reward prepared:",
    {
      stageNode,
      runState
    }
  );

  battleState = null;
  currentScene =
    "reward_selection";

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
      defeatedNode.nodeId
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

function choosePendingRunReward(
  rewardId
) {
  if (
    currentScene !==
      "reward_selection" ||
    !runState
  ) {
    return;
  }

  const selectedReward =
    runState.pendingRewardOptions
      ?.find((reward) => {
        return (
          reward.rewardId ===
          rewardId
        );
      });

  const sourceNodeId =
    runState
      .pendingRewardSourceNodeId;

  const nextRunState =
    chooseRunReward(
      runState,
      rewardId
    );

  if (nextRunState === runState) {
    return;
  }

  runState =
    completeRunIfFinalStageCompleted(
      nextRunState
    );

  console.log(
    "Run reward chosen:",
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

function handleBattleResultPrimaryAction() {
  if (
    !battleState ||
    battleState.battleControlState !==
      "battle_result"
  ) {
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
      '[data-action="choose-run-reward"]'
    );

  rewardChoiceButtons.forEach(
    (rewardButton) => {
      rewardButton.addEventListener(
        "click",
        () => {
          const rewardId =
            rewardButton.dataset
              .rewardId;

          choosePendingRunReward(
            rewardId
          );
        }
      );
    }
  );
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
  const tileButtons =
    document.querySelectorAll(
      ".map-tile"
    );

  tileButtons.forEach(
    (tileButton) => {
      tileButton.addEventListener(
        "click",
        () => {
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

          const x = Number(
            tileButton.dataset.tileX
          );

          const y = Number(
            tileButton.dataset.tileY
          );

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
  tutorialPhaseJumpUiState
);

  attachBattleEvents();
  updateBattlefieldCamera();

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
    runState
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
        runState
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
      renderPostRunShopScreen(
        profileState,
        runState
      );

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

    const previousBattleState =
      battleState;

    const selectedTargetData =
      getPlayerBasicAttackCandidates(
        getCurrentBattleMap(),
        battleState
      ).find((targetData) => {
        return (
          targetData.targetType ===
            battleState.targetType &&
          targetData.targetId ===
            battleState.targetId
        );
      }) ?? null;

    const attackResult =
      confirmBasicAttack();

    if (!attackResult) {
      renderApp();
      return;
    }

    const phase3TutorialBattleState =
      recordTutorialBasicAttack(
        previousBattleState,
        battleState
      );

    const phase4TutorialBattleState =
      recordTutorialPhase4BasicAttack(
        previousBattleState,
        phase3TutorialBattleState,
        selectedTargetData
      );

    const phase5TutorialBattleState =
      recordTutorialPhase5BasicAttack(
        previousBattleState,
        phase4TutorialBattleState
      );

    const phase6InitializedBattleState =
      initializeTutorialPhase6RuntimeIfNeeded(
        phase5TutorialBattleState
      );

    const phase6TutorialBattleState =
      recordTutorialPhase6BasicAttack(
        previousBattleState,
        phase6InitializedBattleState,
        attackResult
      );

    const phase7InitializedBattleState =
      initializeTutorialPhase7RuntimeIfNeeded(
        phase6TutorialBattleState
      );

    const phase7AttackBattleState =
      recordTutorialPhase7PlayerAttack(
        previousBattleState,
        phase7InitializedBattleState,
        attackResult
      );

    battleState =
      recordTutorialPhase8PlayerAttack(
        previousBattleState,
        phase7AttackBattleState,
        attackResult
      );

    assertTutorialBattlefieldState(
      getCurrentBattleMap(),
      battleState
    );

    battleState =
      resolvePostAttackBattleOutcome(
        battleState
      );

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

    const previousBattleState =
      battleState;

    confirmActionMenuSelection();

    const attackCandidates =
      getBasicAttackCandidates(
        getCurrentBattleMap(),
        battleState
      );

    const phase3TutorialBattleState =
      recordTutorialAttackTargeting(
        previousBattleState,
        battleState
      );

    const phase4AttemptBattleState =
      recordTutorialPhase4AttackAttempt(
        previousBattleState,
        phase3TutorialBattleState,
        attackCandidates
      );

    battleState =
      recordTutorialPhase4AttackTargeting(
        previousBattleState,
        phase4AttemptBattleState
      );

    const tutorialTaskId =
      battleState
        .tutorialState
        ?.taskId;

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
      rewardNumber <= 4;

    if (isRewardNumberInput) {
      event.preventDefault();

      const rewardOption =
        runState
          ?.pendingRewardOptions
          ?.[rewardNumber - 1];

      if (rewardOption) {
        choosePendingRunReward(
          rewardOption.rewardId
        );
      }
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

    finishCompletedRunToRunOverview();
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

    finishDefeatedRunToRunOverview();
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
