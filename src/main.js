import "./style.css";
import { loadInitialPrototypeData } from "./logic/shared/dataLoader.js";
import { createInitialBattleState } from "./logic/battle/battleSetup.js";
import {
  getMovementTiles,
  moveSelectedUnitToTile,
  moveSelectedUnitByDirection,
  selectNextReadyPlayerUnit
} from "./logic/battle/movementLogic.js";
import {
  getValidBasicAttackTargets
} from "./logic/battle/atrLogic.js";
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
  evaluateEliminateAllObjective
} from "./logic/battle/objectiveLogic.js";
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
import { renderBattleHud } from "./ui/battle/battleHud.js";
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

let currentScene = "title";

const ENEMY_PHASE_DELAY_MS = 900;

const ACTION_OPTIONS = [
  "attack",
  "skill",
  "wait"
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

function getSelectedPlayerUnit() {
  return battleState.playerUnits.find((unit) => {
    return unit.battleUnitId === battleState.selectedUnitId;
  });
}

function getLivingPlayerUnits(state) {
  return state.playerUnits.filter((unit) => {
    return unit.currentHP > 0;
  });
}

function areAllLivingPlayerUnitsExhausted(state) {
  const livingPlayerUnits =
    getLivingPlayerUnits(state);

  return (
    livingPlayerUnits.length > 0 &&
    livingPlayerUnits.every((unit) => {
      return unit.turnState === "exhausted";
    })
  );
}

function enterEnemyPhaseIfNeeded(nextState) {
  if (
    !areAllLivingPlayerUnitsExhausted(nextState)
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
    selectedUnitId: null,

    enemyUnits: nextEnemyUnits,

    actionMenuIndex: 0,
    selectedAction: null,

    targetIndex: 0,
    targetUnitId: null,

    feedbackMessage:
      `${previousFeedback}` +
      "Player Turn selesai. " +
      "Enemy Phase dimulai."
  };
}

function resolveEnemyPhaseActions() {
  if (
    !battleState ||
    battleState.phase !== "enemy_phase"
  ) {
    return;
  }

  // Langkah 1: seluruh enemy melakukan movement.
  const movementResolution =
    resolveEnemyMovementPhase(
      appData.stage1Map,
      battleState
    );

  const stateAfterEnemyMovement =
    movementResolution.battleState;

  // Langkah 2: seluruh enemy mencoba menyerang.
  const attackResolution =
    resolveEnemyAttackPhase(
      appData.stage1Map,
      stateAfterEnemyMovement
    );

  const stateAfterEnemyActions =
    attackResolution.battleState;

  const livingPlayerUnits =
    stateAfterEnemyActions.playerUnits.filter(
      (unit) => {
        return unit.currentHP > 0;
      }
    );

  const movedEnemyCount =
    movementResolution.movementEvents.filter(
      (eventData) => {
        return eventData.moved;
      }
    ).length;

  const livingEnemyCount =
    stateAfterEnemyActions.enemyUnits.filter(
      (enemy) => {
        return enemy.currentHP > 0;
      }
    ).length;

  const successfulAttacks =
    attackResolution.attackEvents.filter(
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

  // Jika tidak ada player hidup, battle langsung berhenti.
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
      targetUnitId: null,

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

  // Jika masih ada player hidup, siapkan Player Turn baru.
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

          turnState: "ready",
          hasActed: false
        };
      }
    );

  const firstLivingPlayerUnit =
    nextPlayerUnits.find((unit) => {
      return unit.currentHP > 0;
    });

  const defeatedText =
    defeatedPlayerNames.length > 0
      ? (
          ` Unit defeated: ` +
          `${defeatedPlayerNames.join(", ")}.`
        )
      : "";

  battleState = {
    ...stateAfterEnemyActions,

    phase: "player_phase",

    turnCount:
      stateAfterEnemyActions.turnCount + 1,

    selectedUnitId:
      firstLivingPlayerUnit?.battleUnitId ??
      null,

    battleControlState:
      "unit_selected_movement",

    actionMenuIndex: 0,
    selectedAction: null,

    targetIndex: 0,
    targetUnitId: null,

    playerUnits: nextPlayerUnits,

    feedbackMessage:
      `Enemy Phase selesai: ` +
      `${movedEnemyCount}/${livingEnemyCount} ` +
      `enemy bergerak, ` +
      `${enemyAttackCount} attack, ` +
      `${totalEnemyDamage} total damage.` +
      `${defeatedText} ` +
      `Player Turn baru dimulai.`
  };

  renderApp();
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
  if (selectedUnit.turnState === "exhausted") return false;

  return true;
}

function openActionMenu() {
  if (!canOpenActionMenu()) {
    return;
  }

  battleState = {
    ...battleState,
    battleControlState: "action_menu_open",
    actionMenuIndex: 0,
    selectedAction: null,
    targetIndex: 0,
    targetUnitId: null,
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
    targetUnitId: null,
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

function resolveWaitAction() {
  const selectedUnit = getSelectedPlayerUnit();

  if (!selectedUnit) {
    return;
  }

  const nextPlayerUnits = battleState.playerUnits.map((unit) => {
    if (unit.battleUnitId !== selectedUnit.battleUnitId) {
      return unit;
    }

    return {
      ...unit,
      turnState: "exhausted",
      hasActed: true
    };
  });

  let nextBattleState = {
    ...battleState,
    playerUnits: nextPlayerUnits,
    battleControlState: "unit_selected_movement",
    actionMenuIndex: 0,
    selectedAction: null,
    targetIndex: 0,
    targetUnitId: null,
    feedbackMessage: null
  };

  nextBattleState = selectNextReadyPlayerUnit(
  nextBattleState
);

nextBattleState = enterEnemyPhaseIfNeeded(
  nextBattleState
);

battleState = nextBattleState;
}

function openAttackTargeting() {
  const validTargets = getValidBasicAttackTargets(
  appData.stage1Map,
  battleState
);

  if (validTargets.length === 0) {
    battleState = {
      ...battleState,
      feedbackMessage:
  "Tidak ada target valid dalam ATR/path unit ini."
    };

    return;
  }

  battleState = {
    ...battleState,
    battleControlState: "attack_targeting",
    selectedAction: "attack",
    targetIndex: 0,
    targetUnitId: validTargets[0].unit.battleUnitId,
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

  if (selectedAction === "wait") {
    resolveWaitAction();
  }
}

function moveAttackTargetSelection(direction) {
  const validTargets = getValidBasicAttackTargets(
  appData.stage1Map,
  battleState
);

  if (validTargets.length === 0) {
    return;
  }

  const currentIndex = validTargets.findIndex((targetData) => {
    return (
      targetData.unit.battleUnitId ===
      battleState.targetUnitId
    );
  });

  let nextIndex = currentIndex === -1 ? 0 : currentIndex;

  if (direction === "left") {
    nextIndex =
      (nextIndex - 1 + validTargets.length) %
      validTargets.length;
  }

  if (direction === "right") {
    nextIndex = (nextIndex + 1) % validTargets.length;
  }

  battleState = {
    ...battleState,
    targetIndex: nextIndex,
    targetUnitId:
      validTargets[nextIndex].unit.battleUnitId
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
    targetUnitId: null,

    resultState: "victory",

    feedbackMessage:
      `${previousMessage} ` +
      "Objective eliminate_all selesai. " +
      "Semua enemy telah dikalahkan."
  };
}

function confirmBasicAttack() {
  const validTargets =
    getValidBasicAttackTargets(
      appData.stage1Map,
      battleState
    );

  const selectedTargetData =
    validTargets.find((targetData) => {
      return (
        targetData.unit.battleUnitId ===
        battleState.targetUnitId
      );
    });

  if (!selectedTargetData) {
    battleState = {
      ...battleState,
      feedbackMessage:
        "Target attack tidak lagi valid."
    };

    return;
  }

  const resolution = resolveBasicAttack(
    battleState,
    selectedTargetData.unit.battleUnitId,
    selectedTargetData.pathResult
  );

  if (!resolution.attackResult) {
    battleState = {
      ...battleState,
      feedbackMessage:
        "Attack gagal diselesaikan."
    };

    return;
  }

  const attackResult = resolution.attackResult;

  const resultMessage =
    attackResult.targetDefeated
      ? (
          `${attackResult.attackerName} memberikan ` +
          `${attackResult.finalDamage} damage kepada ` +
          `${attackResult.targetName}. Target defeated.`
        )
      : (
          `${attackResult.attackerName} memberikan ` +
          `${attackResult.finalDamage} damage kepada ` +
          `${attackResult.targetName}. ` +
          `HP ${attackResult.targetHPBefore} → ` +
          `${attackResult.targetHPAfter}.`
        );
        const objectiveEvaluation =
  evaluateEliminateAllObjective(
    resolution.battleState
  );

if (
  objectiveEvaluation.resolved &&
  objectiveEvaluation.resultState ===
    "victory"
) {
  battleState =
    createVictoryBattleState(
      resolution.battleState,
      resultMessage
    );

  return;
}

  let nextBattleState = {
    ...resolution.battleState,

    battleControlState:
      "unit_selected_movement",

    actionMenuIndex: 0,
    selectedAction: null,

    targetIndex: 0,
    targetUnitId: null,

    feedbackMessage: resultMessage
  };

  nextBattleState =
  selectNextReadyPlayerUnit(
    nextBattleState
  );

nextBattleState =
  enterEnemyPhaseIfNeeded(
    nextBattleState
  );

battleState = nextBattleState;
}

function closeAttackTargeting() {
  battleState = {
    ...battleState,
    battleControlState: "action_menu_open",
    selectedAction: null,
    targetIndex: 0,
    targetUnitId: null,
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

  battleState = {
    ...createInitialBattleState(
      appData
    ),

    stageId: "tutorial_stage",
    flowContext: "tutorial",

    encounterName:
      "Tutorial Stage (Placeholder)"
  };

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

  battleState = {
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

          battleState =
            moveSelectedUnitToTile(
              appData.stage1Map,
              battleState,
              x,
              y
            );

          renderApp();
        }
      );
    }
  );

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
        appData.stage1Map,
        battleState
      )
    : [];

  const validAttackTargets =
    battleState.battleControlState ===
    "attack_targeting"
      ? getValidBasicAttackTargets(
          appData.stage1Map,
          battleState
        )
      : [];

  document.querySelector(
    "#app"
  ).innerHTML = renderBattleHud(
    appData,
    battleState,
    movementTiles,
    validAttackTargets
  );

  attachBattleEvents();
  scheduleEnemyPhaseResolution();
}

function renderApp() {
  const appElement =
    document.querySelector("#app");

  if (currentScene !== "battle") {
    clearEnemyPhaseTimer();
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
  const isLeft = key === "a" || key === "arrowleft";
  const isRight = key === "d" || key === "arrowright";

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

  confirmBasicAttack();
  renderApp();
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

    confirmActionMenuSelection();
    renderApp();
    return;
  }

  if (key === "z") {
    event.preventDefault();
    closeActionMenu();
    renderApp();
  }
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

    battleState = moveSelectedUnitByDirection(
      appData.stage1Map,
      battleState,
      movementKeyMap[key]
    );

    renderApp();
    return;
  }

  if (key === "q") {
    event.preventDefault();

    battleState = selectNextReadyPlayerUnit(battleState);

    renderApp();
    return;
  }

  const isOpenMenuInput =
    key === "enter" || event.code === "Space";

  if (isOpenMenuInput) {
    event.preventDefault();

    openActionMenu();
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

    renderApp();
  } catch (error) {
    console.error(error);
    renderErrorScreen(error);
  }
}

startApp();