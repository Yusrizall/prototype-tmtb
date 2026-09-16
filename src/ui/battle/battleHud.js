import { renderMapGrid } from "../mapRenderer.js";
import {
  getObjectivePresentationLabel
} from "../../logic/battle/objectiveLogic.js";

const ACTION_LABELS = [
  "Attack",
  "Skill"
];

function getStunLabel(unit) {
  const stun = (unit?.statuses ?? []).find((status) => status.statusId === "stun" && status.remainingPlayerTurns > 0);
  return stun ? `STUN ${stun.remainingPlayerTurns}` : null;
}

function isTutorialPhase4(
  battleState
) {
  return (
    battleState?.flowContext ===
      "tutorial" &&
    battleState
      ?.tutorialState
      ?.phaseId ===
      "phase_4_tactical_space"
  );
}

function getSelectedUnit(battleState) {
  const allUnits = [
    ...battleState.playerUnits,
    ...battleState.enemyUnits
  ];

  return allUnits.find((unit) => {
    return unit.battleUnitId === battleState.selectedUnitId;
  });
}

function getSelectedAttackTarget(
  battleState,
  validAttackTargets
) {
  if (validAttackTargets.length === 0) {
    return null;
  }

  const targetById = validAttackTargets.find((targetData) => {
    return (
      targetData.targetType ===
        battleState.targetType &&
      targetData.targetId ===
        battleState.targetId
    );
  });

  if (targetById) {
    return targetById;
  }

  const safeTargetIndex =
    battleState.targetIndex >= 0 &&
    battleState.targetIndex < validAttackTargets.length
      ? battleState.targetIndex
      : 0;

  return validAttackTargets[safeTargetIndex];
}

function renderEnemyIntentSummary(
  battleState
) {
  const isTutorialBattle =
    battleState.flowContext ===
      "tutorial";

  const tutorialState =
    isTutorialBattle
      ? battleState.tutorialState
      : null;

  if (isTutorialBattle) {
    const phase3IntentUnlocked =
      tutorialState?.phaseId ===
        "phase_3_turn_intent_combat" &&
      tutorialState?.taskId !==
        "end_player_turn" &&
      tutorialState?.taskId !==
        "enemy_turn_checkpoint" &&
      tutorialState?.taskId !==
        "introduce_sword_enemy";

    const laterIntentPersistence =
      tutorialState?.phaseId ===
        "phase_4_tactical_space" ||
      tutorialState?.phaseId ===
        "phase_5_dynamic_threat_reading" ||
      tutorialState?.phaseId ===
        "phase_6_spear_defensive_cover_objective" ||
      tutorialState?.phaseId ===
        "phase_7_status_temporal_threat" ||
      tutorialState?.phaseId ===
        "phase_8_wave_graduation";

    if (
      !phase3IntentUnlocked &&
      !laterIntentPersistence
    ) {
      return "";
    }
  } else if (
    battleState.phase !==
      "player_phase"
  ) {
    return "";
  }

  const livingEnemies =
    [...battleState.enemyUnits]
      .filter((enemy) => {
        if (enemy.currentHP <= 0) return false;
        const isInactiveBlue =
          enemy.actionRule === "blue_charge_shockwave" &&
          enemy.patternState?.active === false;
        return !isInactiveBlue;
      })
      .sort((first, second) => {
        return (
          first.spawnOrder -
          second.spawnOrder
        );
      });

  if (livingEnemies.length === 0) {
    return "";
  }

  const intentRows =
    livingEnemies
      .map((enemy) => {
        const target =
          battleState.playerUnits.find((unit) => {
            return (
              unit.battleUnitId ===
                enemy.currentTargetId &&
              unit.currentHP > 0
            );
          });

        const isBluePattern =
          enemy.currentIntent?.intentType === "blue_charge" ||
          enemy.currentIntent?.intentType === "blue_shockwave";

        const intentLabel = isBluePattern
          ? (enemy.currentIntent?.intentLabel ?? "NONE")
          : enemy.currentIntent?.intentType === "basic_attack"
            ? "ATTACK"
            : "NONE";

        const stateLabel = isBluePattern && enemy.currentIntent?.stateLabel
          ? `STATE ${enemy.currentIntent.stateLabel} · `
          : "";

        const targetLabel =
          !isBluePattern && target
            ? ` → ${target.name}`
            : "";

        const pulseClass =
          tutorialState
            ?.intentPulseEnemyId ===
              enemy.battleUnitId
            ? "enemy-intent-row-pulse"
            : "";

        return `
          <p class="${pulseClass}">
            #${enemy.spawnOrder}
            ${stateLabel}INTENT ${intentLabel}${targetLabel}
          </p>
        `;
      })
      .join("");

  return `
    <div class="enemy-intent-summary">
      <h3>Enemy Intent</h3>
      ${intentRows}
    </div>
  `;
}

function renderRosterPanel(battleState) {
  const rosterItems = battleState.playerUnits
    .map((unit) => {
      const selectedClass =
        unit.battleUnitId === battleState.selectedUnitId
          ? "roster-card-selected"
          : "";

      return `
        <div class="roster-card ${selectedClass}">
          <strong>${unit.name}</strong>
          <span>HP ${unit.currentHP}/${unit.maxHP}</span>
          ${getStunLabel(unit) ? `<span>${getStunLabel(unit)}</span>` : ""}
          <span>
  StartGrid: ${unit.startGrid.x},${unit.startGrid.y}
</span>
          <span>
            Current: ${unit.tileX},${unit.tileY}
          </span>
          <span>
  Movement Commitment:
  ${
    unit.movementApCommitted
      ? "COMMITTED"
      : "NOT COMMITTED"
  }
</span>
<span>
  Movement Lock:
  ${
    unit.movementLocked
      ? "LOCKED"
      : "UNLOCKED"
  }
</span>
        </div>
      `;
    })
    .join("");

  return `
    <aside class="battle-panel roster-panel">
      <h2>Roster</h2>
      ${rosterItems}
      ${renderEnemyIntentSummary(
        battleState
      )}
    </aside>
  `;
}

function renderTargetPreview(
  battleState,
  validAttackTargets
) {
  const selectedTargetData =
    getSelectedAttackTarget(
      battleState,
      validAttackTargets
    );

  if (
    battleState.battleControlState ===
      "attack_targeting" &&
    selectedTargetData
  ) {
    const target =
      selectedTargetData.entity;
    const pathResult =
      selectedTargetData.pathResult;
    const interactionTile =
      selectedTargetData.interactionTile;

    const pathLabels = {
      clear: "CLEAR",
      partial_cover: "PARTIAL COVER",
      full_cover: "FULL COVER",
      melee_blocked: "BLOCKED FOR MELEE"
    };

    const coverPercentage = Math.round(
      (pathResult?.coverPercentage ?? 0) * 100
    );

    const crossedObstacles =
      pathResult?.crossedObstacles ?? [];

    const obstacleText =
      crossedObstacles.length === 0
        ? "None"
        : crossedObstacles
            .map((obstacle) => {
              return `${obstacle.tileCode} at ${obstacle.x},${obstacle.y}`;
            })
            .join(" | ");

    const tutorialPhase4 =
      isTutorialPhase4(battleState);

    const losPreview =
      tutorialPhase4
        ? ""
        : `
          <p>
            LOS:
            <strong>
              ${
                selectedTargetData.losValid
                  ? "VALID"
                  : "BLOCKED"
              }
            </strong>
          </p>
        `;

    const coverReductionPreview =
      tutorialPhase4
        ? ""
        : `
          <p>
            Cover Reduction:
            ${coverPercentage}%
          </p>
        `;

    const targetTypeLabel =
      selectedTargetData.targetType ===
        "structure"
        ? "Structure"
        : "Unit";

    return `
      <div class="target-preview-placeholder">
        <h3>Attack Target</h3>

        <p><strong>${target.name}</strong></p>
        <p>Type: ${targetTypeLabel}</p>

        <p>
          HP: ${target.currentHP}/${target.maxHP}
        </p>

        <p>
          Interaction Tile:
          ${interactionTile.x},${interactionTile.y}
        </p>

        <p>
          Distance:
          ${selectedTargetData.distance.toFixed(2)}
        </p>

        <p>
          Target Validity:
          <strong>VALID</strong>
        </p>

        <p>
          Range:
          <strong>
            ${
              selectedTargetData.rangeValid
                ? "VALID"
                : "OUTSIDE ATR"
            }
          </strong>
        </p>

        ${losPreview}

        <p>
          Action Path:
          <strong>
            ${
              selectedTargetData.actionPathValid
                ? "VALID"
                : "BLOCKED"
            }
          </strong>
        </p>

        <p>
          Action Validity:
          <strong>
            ${
              selectedTargetData.actionValid
                ? "VALID"
                : "INVALID"
            }
          </strong>
        </p>

        <p>
          Path Outcome:
          <strong>
            ${
              pathLabels[pathResult?.outcome] ??
              "UNKNOWN"
            }
          </strong>
        </p>

        ${coverReductionPreview}

        <p>
          Crossed Obstacle:
          ${obstacleText}
        </p>

        <p>
          Damage belum dihitung.
        </p>
      </div>
    `;
  }

  return `
    <div class="target-preview-placeholder">
      <h3>Target Preview</h3>
      <p>Belum ada target aktif.</p>
    </div>
  `;
}

function renderUnitDetailPanel(
  battleState,
  validAttackTargets
) {
  const selectedUnit = getSelectedUnit(battleState);

  if (!selectedUnit) {
    return `
      <aside class="battle-panel unit-detail-panel">
        <h2>Unit Detail</h2>
        <p>No unit selected.</p>
      </aside>
    `;
  }

  const isAttackTargeting =
    battleState.battleControlState === "attack_targeting";

      const tutorialPhase4 =
    isTutorialPhase4(
      battleState
    );

  const targetPreview = renderTargetPreview(
    battleState,
    validAttackTargets
  );

  return `
    <aside class="battle-panel unit-detail-panel">
      ${
        isAttackTargeting
          ? `
            <h2>Target Selection</h2>
            ${targetPreview}
          `
          : `
            <h2>Unit Detail</h2>
          `
      }

      <div class="unit-detail-card">
        <h3>${selectedUnit.name}</h3>
        <p>Side: ${selectedUnit.side}</p>
        <p>
          HP: ${selectedUnit.currentHP}/${selectedUnit.maxHP}
        </p>
        ${getStunLabel(selectedUnit) ? `<p>Status: ${getStunLabel(selectedUnit)}</p>` : ""}
        <p>ATK: ${selectedUnit.derivedStats.atk}</p>
        <p>Shield: ${selectedUnit.temporaryShield ?? 0}${selectedUnit.interceptBy ? ' · Protected by Guard' : ''}</p>
        <p>Move: ${selectedUnit.derivedStats.move}</p>
        <p>ATR: ${selectedUnit.derivedStats.atr}</p>
        <p>
  StartGrid:
  ${selectedUnit.startGrid.x},
  ${selectedUnit.startGrid.y}
</p>
        <p>
          Current Tile:
          ${selectedUnit.tileX},
          ${selectedUnit.tileY}
          <p>
  Movement Commitment:
  ${
    selectedUnit.movementApCommitted
      ? "COMMITTED"
      : "NOT COMMITTED"
  }
</p>
        </p>
        <p>
  Movement Lock:
  ${
    selectedUnit.movementLocked
      ? "LOCKED"
      : "UNLOCKED"
  }
</p>
        <p>
          Control State:
          ${battleState.battleControlState}
        </p>
      </div>

  ${isAttackTargeting ? "" : targetPreview}
    </aside>
  `;
}

function renderTutorialPrompt(
  battleState
) {
  if (
    battleState.flowContext !==
      "tutorial" ||
    !battleState.tutorialState
  ) {
    return "";
  }

  const prompt =
    battleState.tutorialState.prompt;

  if (!prompt) {
    return "";
  }

  return `
    <section
      class="tutorial-prompt"
      aria-live="polite"
    >
      <span class="tutorial-prompt-label">
        Tutorial
      </span>

      <strong>
        ${prompt}
      </strong>
    </section>
  `;
}

function renderBattleTopBar(battleState) {
  const objectiveLabel =
    battleState.flowContext ===
      "tutorial"
      ? getObjectivePresentationLabel(
          battleState
        )
      : battleState.objectiveType;

  return `
    <header class="battle-top-bar">
      <div>
        <strong>Phase</strong>
        <span>${battleState.phase}</span>
      </div>
      <div>
        <strong>Turn</strong>
        <span>${battleState.turnCount}</span>
      </div>
      <div>
  <strong>Team AP</strong>
  <span>
    ${battleState.teamApCurrent}
    /
    ${battleState.teamApCapacity}
  </span>
</div>
      <div>
        <strong>Objective</strong>
        <span>${objectiveLabel}</span>
      </div>
      <div>
        <strong>Encounter</strong>
        <span>${battleState.encounterName}</span>
      </div>
    </header>
  `;
}

function renderCommandBand(battleState) {
  const isActionMenuOpen =
    battleState.battleControlState === "action_menu_open";

  const isAttackTargeting =
    battleState.battleControlState === "attack_targeting";

  const tutorialTaskId = battleState.tutorialState?.taskId;
  const tutorialPhaseId = battleState.tutorialState?.phaseId;
  const tutorialEndTurnUnlocked =
    battleState.flowContext !== "tutorial" ||
    (tutorialPhaseId === "phase_3_turn_intent_combat" && tutorialTaskId === "end_player_turn") ||
    (tutorialPhaseId === "phase_4_tactical_space" && tutorialTaskId === "end_turn_for_phase5") ||
    (tutorialPhaseId === "phase_6_spear_defensive_cover_objective" && [
      "end_turn_for_clear_attack",
      "end_turn_for_spear_retreat",
      "finish_spear",
      "end_turn_after_spear_defeated",
      "destroy_hut",
      "proceed_to_region_c"
    ].includes(tutorialTaskId)) ||
    (tutorialPhaseId === "phase_7_status_temporal_threat" && [
      "end_turn_to_begin_phase7",
      "end_turn_for_second_charge",
      "end_turn_for_shockwave",
      "end_turn_after_stun_adaptation",
      "end_turn_for_recovery"
    ].includes(tutorialTaskId)) ||
    (tutorialPhaseId === "phase_8_wave_graduation" && [
      "prepare_for_wave_1",
      "phase_8_free_play"
    ].includes(tutorialTaskId));

  const canEndPlayerTurn =
    battleState.phase ===
      "player_phase" &&
    battleState.battleControlState !==
      "battle_result" &&
    tutorialEndTurnUnlocked;

  const actionButtons = ACTION_LABELS
    .map((label, index) => {
      const selectedClass =
        (
          isActionMenuOpen &&
          index === battleState.actionMenuIndex
        ) ||
        (
          isAttackTargeting &&
          index === 0
        )
          ? "command-active"
          : "";

      const disabledAttribute =
        isActionMenuOpen ? "" : "disabled";

      return `
        <button
          type="button"
          class="${selectedClass}"
          ${disabledAttribute}
        >
          ${label}
        </button>
      `;
    })
    .join("");

  return `
  <section class="command-band">
    ${actionButtons}

    <button
      type="button"
      data-action="end-player-turn"
      ${
        canEndPlayerTurn
          ? ""
          : "disabled"
      }
    >
      End Turn
    </button>
  </section>
`;
}

function renderInputHintBar(battleState) {
  const isActionMenuOpen =
    battleState.battleControlState ===
    "action_menu_open";

  const isAttackTargeting =
    battleState.battleControlState ===
    "attack_targeting";

      const tutorialPhase4 =
    isTutorialPhase4(
      battleState
    );

    const isEnemyPhase =
  battleState.phase === "enemy_phase";

  const feedback =
    battleState.feedbackMessage
      ? `<span>${battleState.feedbackMessage}</span>`
      : "";
      const isBattleResult =
  battleState.battleControlState ===
  "battle_result";

if (isBattleResult) {
  const isTutorialBattle =
    battleState.flowContext ===
    "tutorial";

      const isRunStageBattle =
    battleState.flowContext ===
    "run_stage";

    const resultActionText =
    isTutorialBattle
      ? (
          battleState.resultState ===
          "victory"
            ? (
                "Enter / Space / E atau tombol " +
                "= Start Adventure"
              )
            : (
                "Enter / Space / E atau tombol " +
                "= Retry Tutorial"
              )
        )
      : (
          isRunStageBattle
  ? (
      battleState.resultState ===
      "victory"
  ? (
      "Enter / Space / E atau tombol " +
      "= Continue"
    )
  : (
      "Enter / Space / E atau tombol " +
      "= Continue to Run Result"
    )
    )
  : "Enter / Space / E = Continue"
        );

  return `
    <section class="input-hint-bar">
      ${feedback}

      <span>
        Battle Result:
        ${battleState.resultState}
      </span>

      <span>
        Input battle dinonaktifkan
      </span>

      <span>${resultActionText}</span>
    </section>
  `;
}

      if (isEnemyPhase) {
  return `
    <section class="input-hint-bar">
      ${feedback}

      <span>Enemy Phase sedang berjalan</span>

      <span>
        Input player dikunci sementara
      </span>

      <span>
        Enemy Movement dan Attack sedang diproses
      </span>

      <span>
        Player Turn berikutnya dimulai otomatis
      </span>
    </section>
  `;
}

  if (isAttackTargeting) {
    return `
      <section class="input-hint-bar">
        <span>
          A/D atau Left/Right = Change Target
        </span>
        <span>E = Confirm Attack</span>
        <span>Z = Back to Action Menu</span>
        <span>
  ${
    tutorialPhase4
      ? "Preview memakai ATR, path, dan Cover"
      : "Preview memakai ATR, LOS, path, dan cover"
  }
</span>
      </section>
    `;
  }

  if (isActionMenuOpen) {
    return `
      <section class="input-hint-bar">
        <span>
          A/D atau Left/Right = Change Action
        </span>
        <span>E = Confirm</span>
        <span>Z = Back to Movement</span>
        ${feedback}
      </section>
    `;
  }

  return `
    <section class="input-hint-bar">
      ${feedback}
      <span>
        WASD/Arrow = Move selected unit
      </span>
      <span>
        Click cyan tile = Debug move
      </span>
      <span>Q = Change Unit</span>
      <span>
        Enter/Space = Open Action Menu
      </span>
      <span>
  Attack mengunci Movement, bukan unit selection
</span>
      <span>
  T / End Turn = End Player Turn
</span>
    </section>
  `;
}

function formatResultNodeType(nodeType) {
  return String(nodeType ?? "battle")
    .replaceAll("_", " ")
    .toUpperCase();
}

function renderResultMetricIcon(type) {
  if (type === "enemy") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 8a5 5 0 0 1 10 0v3a4 4 0 0 1-2 3.2V17h-2v-2h-2v2H9v-2.8A4 4 0 0 1 7 11V8Z" />
        <path d="M9 9.5h2v2H9zm4 0h2v2h-2z" />
      </svg>
    `;
  }

  if (type === "turn") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 7 7-7 13L5 9l7-7Z" />
      <path d="m5 9 7 3 7-3M12 2v10" />
    </svg>
  `;
}

function renderBattleResultParty(party) {
  return party
    .slice(0, 4)
    .map((unit) => {
      const startPercent =
        unit.maxHP > 0
          ? Math.round(
              (unit.stageStartHP / unit.maxHP) *
              100
            )
          : 0;

      const finalPercent =
        unit.maxHP > 0
          ? Math.round(
              (unit.currentHP / unit.maxHP) *
              100
            )
          : 0;

      const resultLabel =
        unit.status === "defeated"
          ? `<strong class="battle-result-unit-defeated">DEFEATED</strong>`
          : unit.hpLost > 0
            ? `<strong class="battle-result-hp-loss">-${unit.hpLost}</strong>`
            : "";

      return `
        <article
          class="battle-result-unit-row"
          data-result-party-row
        >
          <div
            class="battle-result-unit-portrait"
            aria-hidden="true"
          >
            ${unit.name.slice(0, 1).toUpperCase()}
          </div>

          <div class="battle-result-unit-main">
            <div class="battle-result-unit-heading">
              <strong>${unit.name}</strong>

              <span>
                <strong
                  data-result-hp-current
                  data-start="${unit.stageStartHP}"
                  data-target="${unit.currentHP}"
                >${unit.stageStartHP}</strong>
                / ${unit.maxHP}
              </span>
            </div>

            <div
              class="battle-result-hp-track"
              role="progressbar"
              aria-label="${unit.name} HP"
              aria-valuemin="0"
              aria-valuemax="${unit.maxHP}"
              aria-valuenow="${unit.currentHP}"
            >
              <span
                class="battle-result-hp-fill"
                data-result-hp-fill
                data-start-percent="${startPercent}"
                data-target-percent="${finalPercent}"
                style="width: ${startPercent}%"
              ></span>
            </div>
          </div>

          <div class="battle-result-unit-outcome">
            ${resultLabel}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderBattleActiveBuffAccess(
  activeRunBuffs = [],
  isOpen = false
) {
  const slots = Array.from({ length: 10 }, (_, index) => {
    const buff = activeRunBuffs[index];
    return buff
      ? `<div class="active-buff-slot active-buff-filled buff-rarity-${buff.rarity}" title="${buff.name}: ${buff.description}"><span>${buff.icon}</span></div>`
      : '<div class="active-buff-slot" aria-hidden="true"></div>';
  }).join("");

  return `
    <div class="active-buff-access ${isOpen ? "active-buff-access-open" : ""}">
      <button type="button" class="active-buff-toggle" data-action="toggle-active-buff-list" aria-expanded="${isOpen}" title="Active Buff List">
        <span class="active-buff-toggle-icon">✦</span>
        <strong>${activeRunBuffs.length}</strong>
      </button>
      <section class="active-buff-popover" aria-label="Active Buff List">
        <header><strong>ACTIVE BUFFS</strong><span>${activeRunBuffs.length} / 10</span></header>
        <div class="active-buff-grid">${slots}</div>
        ${activeRunBuffs.length === 0 ? '<p>No active buffs yet.</p>' : ''}
      </section>
    </div>
  `;
}

function renderRunVictoryResult(
  battleState,
  runUiState = null
) {
  const snapshot =
    battleState.resultSnapshot;

  if (!snapshot) {
    return `
      <section class="battle-result-overlay">
        <div class="battle-result-card battle-result-defeat">
          <h2>RESULT DATA ERROR</h2>
          <p>Battle Result snapshot is unavailable.</p>
        </div>
      </section>
    `;
  }

  const isReady =
    battleState.resultPresentationReady ===
      true;

  return `
    <section
      class="battle-result-overlay battle-result-overlay-full"
      data-battle-result-sequence
      aria-live="polite"
    >
      <div
        class="battle-result-card battle-result-card-expanded battle-result-victory"
      >
        ${renderBattleActiveBuffAccess(
          runUiState?.activeRunBuffs,
          runUiState?.activeBuffListOpen
        )}
        <header class="battle-result-stage-identity">
          <div>
            <span>STAGE</span>
            <strong>${snapshot.stage.name}</strong>
          </div>

          <span class="battle-result-node-type">
            ${formatResultNodeType(
              snapshot.stage.nodeType
            )}
          </span>
        </header>

        <div class="battle-result-main-title">
          <h2>VICTORY</h2>
        </div>

        <div class="battle-result-content-grid">
          <section class="battle-result-left-column">
            <div class="battle-result-summary">
              <article title="Enemy Defeated">
                <span class="battle-result-metric-icon">
                  ${renderResultMetricIcon("enemy")}
                </span>
                <strong
                  data-result-counter
                  data-target="${snapshot.metrics.enemyDefeated}"
                >0</strong>
              </article>

              <article title="Total Turn">
                <span class="battle-result-metric-icon">
                  ${renderResultMetricIcon("turn")}
                </span>
                <strong
                  data-result-counter
                  data-target="${snapshot.metrics.totalTurns}"
                >0</strong>
              </article>
            </div>

            <div class="battle-result-crystal">
              <span class="battle-result-crystal-icon">
                ${renderResultMetricIcon("crystal")}
              </span>

              <div>
                <span>RUN CRYSTAL</span>
                <strong>
                  +<span
                    data-result-counter
                    data-target="${snapshot.metrics.crystalGained}"
                  >0</span>
                </strong>
              </div>
            </div>
          </section>

          <section class="battle-result-party-status">
            <h3>PARTY STATUS</h3>

            <div class="battle-result-party-list">
              ${renderBattleResultParty(
                snapshot.party
              )}
            </div>
          </section>
        </div>

        <footer class="battle-result-actions">
          <button
            type="button"
            class="main-menu-button battle-result-continue ${
              isReady
                ? "main-menu-button-active"
                : "battle-result-continue-locked"
            }"
            data-action="battle-result-primary"
            ${isReady ? "" : "disabled"}
          >
            <span>CONTINUE</span>
            <small>Enter / E / Space</small>
          </button>
        </footer>
      </div>
    </section>
  `;
}

function renderTutorialResult(
  battleState
) {
  const isVictory =
    battleState.resultState ===
      "victory";

  const isTrainingFailed =
    battleState.resultState ===
      "training_failed";

  const resultTitle = isVictory
    ? "TUTORIAL COMPLETE"
    : isTrainingFailed
      ? "TRAINING FAILED"
      : "DEFEAT";

  const resultMessage = isVictory
    ? (
        "You have completed the tutorial. " +
        "Your adventure is ready to begin."
      )
    : isTrainingFailed
      ? "A required party member was defeated."
      : "All of your units have been defeated.";

  const actionLabel = isVictory
    ? "START ADVENTURE"
    : "RETRY";

  return `
    <section
      class="battle-result-overlay tutorial-result-overlay"
      aria-live="polite"
    >
      <div
        class="tutorial-result-card ${
          isVictory
            ? "tutorial-result-complete"
            : "tutorial-result-defeat"
        }"
      >
        <p class="tutorial-result-kicker">
          ${isVictory ? "TRAINING COMPLETE" : "TRY AGAIN"}
        </p>

        <h2>${resultTitle}</h2>
        <p>${resultMessage}</p>

        <button
          type="button"
          class="main-menu-button main-menu-button-active"
          data-action="battle-result-primary"
        >
          <span>${actionLabel}</span>
          <small>Enter / E / Space</small>
        </button>
      </div>
    </section>
  `;
}

export function renderBattleResultOverlay(
  battleState,
  runUiState = null
) {
  if (
    battleState.battleControlState !==
    "battle_result"
  ) {
    return "";
  }

  const isTutorialBattle =
    battleState.flowContext ===
    "tutorial";

  if (isTutorialBattle) {
    return renderTutorialResult(
      battleState
    );
  }

  if (
    battleState.flowContext ===
      "run_stage" &&
    battleState.resultState ===
      "victory"
  ) {
    return renderRunVictoryResult(
      battleState,
      runUiState
    );
  }

  return "";
}


function escapeTutorialPhaseJumpValue(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderTutorialPhaseJumpOverlay(uiState) {
  if (!uiState?.open) {
    return "";
  }

  const phaseInput =
    escapeTutorialPhaseJumpValue(
      uiState.phaseInput
    );

  const errorMessage =
    uiState.errorMessage
      ? `<p class="tutorial-phase-jump-error">${uiState.errorMessage}</p>`
      : "";

  return `
    <section
      class="tutorial-phase-jump-overlay"
      data-tutorial-phase-jump-overlay
    >
      <div class="tutorial-phase-jump-modal">
        <p class="tutorial-phase-jump-eyebrow">
          PROTOTYPE ONLY - NON UNITY
        </p>
        <h2>Skip to tutorial phase:</h2>
        <input
          type="number"
          min="1"
          max="8"
          step="1"
          value="${phaseInput}"
          data-tutorial-phase-jump-input
          aria-label="Tutorial phase number"
        />
        <p class="tutorial-phase-jump-available">
          Available phases: 1–8
        </p>
        ${errorMessage}
        <div class="tutorial-phase-jump-actions">
          <button type="button" data-tutorial-phase-jump-go>GO</button>
          <button type="button" data-tutorial-phase-jump-cancel>CANCEL</button>
        </div>
      </div>
    </section>
  `;
}
export function renderBattleHud(
  data,
  battleState,
  movementTiles = [],
  validAttackTargets = [],
  attackCandidates = [],
  tutorialPhaseJumpUiState = null,
  runUiState = null
) {
  const actionMenuClass =
    battleState.battleControlState === "action_menu_open"
      ? "action-menu-active"
      : "";

  return `
    <main class="battle-screen ${actionMenuClass}">
      ${renderBattleTopBar(battleState)}

      ${renderTutorialPrompt(
        battleState
      )}

      <section class="battle-layout">
        ${renderRosterPanel(battleState)}

        <section class="battlefield-panel">
         ${renderMapGrid(
  data.stage1Map,
  battleState,
  movementTiles,
  validAttackTargets,
  attackCandidates
)}
        </section>

        ${renderUnitDetailPanel(
  battleState,
  validAttackTargets
)}
      </section>

      ${renderCommandBand(battleState)}
      ${renderInputHintBar(battleState)}
      ${renderBattleResultOverlay(battleState, runUiState)}
      ${renderTutorialPhaseJumpOverlay(
        tutorialPhaseJumpUiState
      )}
</main>
  `;
}
