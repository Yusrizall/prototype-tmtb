import { renderMapGrid } from "../mapRenderer.js";

const ACTION_LABELS = [
  "Attack",
  "Skill",
  "Wait"
];

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
      targetData.unit.battleUnitId ===
      battleState.targetUnitId
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
          <span>Status: ${unit.turnState}</span>
          <span>
            Origin: ${unit.originTile.x},${unit.originTile.y}
          </span>
          <span>
            Current: ${unit.tileX},${unit.tileY}
          </span>
        </div>
      `;
    })
    .join("");

  return `
    <aside class="battle-panel roster-panel">
      <h2>Roster</h2>
      ${rosterItems}
    </aside>
  `;
}

function renderTargetPreview(
  battleState,
  validAttackTargets
) {
  const selectedTargetData = getSelectedAttackTarget(
    battleState,
    validAttackTargets
  );

  if (
    battleState.battleControlState === "attack_targeting" &&
    selectedTargetData
  ) {
    const target = selectedTargetData.unit;
    const pathResult = selectedTargetData.pathResult;

    const pathLabels = {
      clear: "CLEAR",
      partial_cover: "PARTIAL COVER",
      full_cover: "FULL COVER",
      melee_blocked: "BLOCKED FOR MELEE"
    };

    const coverPercentage = Math.round(
      pathResult.coverPercentage * 100
    );

    const obstacleText =
      pathResult.crossedObstacles.length === 0
        ? "None"
        : pathResult.crossedObstacles
            .map((obstacle) => {
              return `${obstacle.tileCode} at ${obstacle.x},${obstacle.y}`;
            })
            .join(" | ");

    return `
      <div class="target-preview-placeholder">
        <h3>Attack Target</h3>

        <p><strong>${target.name}</strong></p>

        <p>
          HP: ${target.currentHP}/${target.maxHP}
        </p>

        <p>
          Tile: ${target.tileX},${target.tileY}
        </p>

        <p>
          Distance:
          ${selectedTargetData.distance.toFixed(2)}
        </p>

        <p>
          ATR Status:
          <strong>VALID</strong>
        </p>

        <p>
          Path Outcome:
          <strong>
            ${pathLabels[pathResult.outcome]}
          </strong>
        </p>

        <p>
          Cover Reduction:
          ${coverPercentage}%
        </p>

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
        <p>ATK: ${selectedUnit.derivedStats.atk}</p>
        <p>DEF: ${selectedUnit.derivedStats.def}</p>
        <p>Move: ${selectedUnit.derivedStats.move}</p>
        <p>ATR: ${selectedUnit.derivedStats.atr}</p>
        <p>
          Origin Tile:
          ${selectedUnit.originTile.x},
          ${selectedUnit.originTile.y}
        </p>
        <p>
          Current Tile:
          ${selectedUnit.tileX},
          ${selectedUnit.tileY}
        </p>
        <p>Turn State: ${selectedUnit.turnState}</p>
        <p>
          Control State:
          ${battleState.battleControlState}
        </p>
      </div>

      ${isAttackTargeting ? "" : targetPreview}
    </aside>
  `;
}

function renderBattleTopBar(battleState) {
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
        <strong>Objective</strong>
        <span>${battleState.objectiveType}</span>
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

    const isEnemyPhase =
  battleState.phase === "enemy_phase";

  const livingPlayerUnits =
    battleState.playerUnits.filter(
      (unit) => unit.currentHP > 0
    );

  const allPlayersExhausted =
    livingPlayerUnits.length > 0 &&
    livingPlayerUnits.every(
      (unit) => {
        return unit.turnState === "exhausted";
      }
    );

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
                "= Continue to Map Selection"
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
      "= Continue to Reward"
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
          Preview memakai ATR, path, dan cover
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

  if (allPlayersExhausted) {
    return `
      <section class="input-hint-bar">
        ${feedback}
        <span>
          Semua unit player sudah exhausted
        </span>
        <span>
          Enemy Phase belum diimplementasikan
        </span>
        <span>
          Refresh browser untuk mengulang battle
          sementara
        </span>
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
        Movement belum membuat unit exhausted
      </span>
    </section>
  `;
}

function renderBattleResultOverlay(
  battleState
) {
  if (
    battleState.battleControlState !==
    "battle_result"
  ) {
    return "";
  }

  const isVictory =
    battleState.resultState ===
    "victory";

  const isTutorialBattle =
    battleState.flowContext ===
    "tutorial";

      const isRunStageBattle =
    battleState.flowContext ===
    "run_stage";

  const resultTitle =
    isVictory
      ? "VICTORY"
      : "DEFEAT";

  const resultClass =
    isVictory
      ? "battle-result-victory"
      : "battle-result-defeat";

  const resultDescription =
    isVictory
      ? (
          isTutorialBattle
            ? (
                "Tutorial Stage berhasil " +
                "diselesaikan."
              )
            : (
                "Objective selesai. Semua " +
                "enemy telah dikalahkan."
              )
        )
      : (
          isTutorialBattle
            ? (
                "Tutorial Stage gagal. " +
                "Coba kembali."
              )
            : (
                "Semua unit player telah " +
                "dikalahkan."
              )
        );

   const primaryActionLabel =
  isTutorialBattle
    ? (
        isVictory
          ? "Continue to Map Selection"
          : "Retry Tutorial"
      )
    : (
        isRunStageBattle
          ? (
             isVictory
  ? "Continue to Reward"
  : "Continue to Run Result"
            )
          : "Continue"
      );

const primaryButtonClass =
  "main-menu-button-active";

const primaryButtonDisabled =
  "";

  return `
    <section
      class="battle-result-overlay"
      aria-live="polite"
    >
      <div
        class="
          battle-result-card
          ${resultClass}
        "
      >
        <p class="battle-result-label">
          ${
            isTutorialBattle
              ? "Tutorial Result"
              : "Battle Result"
          }
        </p>

        <h2>${resultTitle}</h2>

        <p>
          Objective:
          ${battleState.objectiveType}
        </p>

        <p>${resultDescription}</p>

        <p>
          ${
            battleState.feedbackMessage ??
            ""
          }
        </p>

        <button
  type="button"
  class="
    main-menu-button
    ${primaryButtonClass}
  "
  data-action="battle-result-primary"
  ${primaryButtonDisabled}
>
          <span>${primaryActionLabel}</span>
        </button>

        <p class="battle-result-note">
          Enter / Space / E juga dapat
          digunakan.
        </p>
      </div>
    </section>
  `;
}

export function renderBattleHud(
  data,
  battleState,
  movementTiles = [],
  validAttackTargets = []
) {
  const actionMenuClass =
    battleState.battleControlState === "action_menu_open"
      ? "action-menu-active"
      : "";

  return `
    <main class="battle-screen ${actionMenuClass}">
      ${renderBattleTopBar(battleState)}

      <section class="battle-layout">
        ${renderRosterPanel(battleState)}

        <section class="battlefield-panel">
         ${renderMapGrid(
          data.stage1Map,
          battleState,
          movementTiles,
          validAttackTargets
        )}
        </section>

        ${renderUnitDetailPanel(
          battleState,
          validAttackTargets
        )}
      </section>

      ${renderCommandBand(battleState)}
      ${renderInputHintBar(battleState)}
      ${renderBattleResultOverlay(battleState)}
</main>
  `;
}