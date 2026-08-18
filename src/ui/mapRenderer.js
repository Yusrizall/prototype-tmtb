import {
  getTacticalPositionState
} from "../logic/battle/tacticalPositionLogic.js";
import {
  BATTLE_TILE_SIZE,
  BATTLE_TILE_GAP,
  BATTLE_TILE_PITCH
} from "./battle/battleCameraLogic.js";

function getTileLabel(tileCode) {
  if (tileCode === ".") return "";

  // P1/P2/E1/E2 adalah marker spawn di Map Definition.
  // Marker tidak perlu terlihat setelah battle runtime dibuat.
  if (
    tileCode.startsWith("P") ||
    tileCode.startsWith("E")
  ) {
    return "";
  }

  return tileCode;
}

function getTileClass(tileCode) {
  if (tileCode === ".") return "tile-empty";
  if (
  tileCode.startsWith("P") ||
  tileCode.startsWith("E")
) {
  return "tile-empty";
}
  if (tileCode === "O30") return "tile-cover-30";
  if (tileCode === "O70") return "tile-cover-70";
  if (tileCode === "OF") return "tile-full-cover";
  if (tileCode === "LOS") return "tile-los-blocker";

  return "tile-unknown";
}

function getAllBattleUnits(battleState) {
  if (!battleState) return [];

  return [
    ...battleState.playerUnits,
    ...battleState.enemyUnits
  ];
}

function findUnitAtTile(battleState, x, y) {
  const allUnits = getAllBattleUnits(battleState);

  return allUnits.find((unit) => {
    return (
      unit.tileX === x &&
      unit.tileY === y &&
      unit.currentHP > 0
    );
  });
}

function findPlayerStartGridAtTile(
  battleState,
  x,
  y
) {
  if (!battleState) return null;

  return battleState.playerUnits.find((unit) => {
    return (
      unit.currentHP > 0 &&
      unit.startGrid &&
      unit.startGrid.x === x &&
      unit.startGrid.y === y
    );
  });
}

function isTutorialTargetTile(
  battleState,
  x,
  y
) {
  const targetTile =
    battleState
      ?.tutorialState
      ?.targetTile;

  if (!targetTile) {
    return false;
  }

  return (
    targetTile.x === x &&
    targetTile.y === y
  );
}

function isMovementTile(movementTiles, x, y) {
  return movementTiles.some((tile) => {
    return tile.x === x && tile.y === y;
  });
}

function isValidAttackTarget(
  validAttackTargets,
  unit
) {
  if (!unit) return false;

  return validAttackTargets.some((targetData) => {
    return (
      targetData.unit.battleUnitId ===
      unit.battleUnitId
    );
  });
}

function isSelectedAttackTarget(
  battleState,
  unit
) {
  if (!unit) return false;

  return (
    battleState.battleControlState ===
      "attack_targeting" &&
    battleState.targetUnitId === unit.battleUnitId
  );
}

function getSelectedPlayerUnit(battleState) {
  return battleState.playerUnits.find((unit) => {
    return (
      unit.battleUnitId ===
      battleState.selectedUnitId
    );
  });
}

function getSelectedTargetData(
  battleState,
  validAttackTargets
) {
  return validAttackTargets.find((targetData) => {
    return (
      targetData.unit.battleUnitId ===
      battleState.targetUnitId
    );
  });
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

function getAttackLineClass(
  pathResult,
  useTutorialCoverColors = false
) {
  if (!pathResult) {
    return useTutorialCoverColors
      ? "tutorial-attack-line-clear"
      : "attack-line-clear";
  }

  if (
    pathResult.outcome ===
      "partial_cover"
  ) {
    return useTutorialCoverColors
      ? "tutorial-attack-line-partial"
      : "attack-line-partial";
  }

  if (
    pathResult.outcome ===
      "full_cover"
  ) {
    return useTutorialCoverColors
      ? "tutorial-attack-line-full"
      : "attack-line-full";
  }

  if (
    pathResult.outcome ===
      "melee_blocked"
  ) {
    return "attack-line-blocked";
  }

  return useTutorialCoverColors
    ? "tutorial-attack-line-clear"
    : "attack-line-clear";
}

function getTutorialPhase4LineCandidate(
  battleState,
  attackCandidates
) {
  if (
    !isTutorialPhase4(
      battleState
    )
  ) {
    return null;
  }

  const attacker =
    getSelectedPlayerUnit(
      battleState
    );

  if (
    !attacker ||
    attacker.unitDefId !==
      "archer"
  ) {
    return null;
  }

  return (
    attackCandidates.find(
      (targetData) => {
        return (
          targetData
            .unit
            .unitDefId ===
            "sword_enemy" &&
          targetData.rangeValid ===
            true
        );
      }
    ) ?? null
  );
}

function renderAttackLine(
  mapData,
  battleState,
  validAttackTargets,
  attackCandidates
) {
  const attacker =
    getSelectedPlayerUnit(
      battleState
    );

  if (!attacker) {
    return "";
  }

  const tutorialPhase4 =
    isTutorialPhase4(
      battleState
    ) &&
    attacker.unitDefId ===
      "archer";

  let selectedTargetData = null;

  if (
    battleState
      .battleControlState ===
      "attack_targeting"
  ) {
    selectedTargetData =
      getSelectedTargetData(
        battleState,
        validAttackTargets
      );
  } else if (tutorialPhase4) {
    selectedTargetData =
      getTutorialPhase4LineCandidate(
        battleState,
        attackCandidates
      );
  }

  if (!selectedTargetData) {
    return "";
  }

  const target =
    selectedTargetData.unit;

  const tileSize = BATTLE_TILE_SIZE;
  const tileGap = BATTLE_TILE_GAP;
  const tilePitch =
    BATTLE_TILE_PITCH;

  const gridWidth =
    mapData.width * tileSize +
    (mapData.width - 1) *
      tileGap;

  const gridHeight =
    mapData.height * tileSize +
    (mapData.height - 1) *
      tileGap;

  const startX =
    attacker.tileX * tilePitch +
    tileSize / 2;

  const startY =
    attacker.tileY * tilePitch +
    tileSize / 2;

  const endX =
    target.tileX * tilePitch +
    tileSize / 2;

  const endY =
    target.tileY * tilePitch +
    tileSize / 2;

  const lineClass =
    getAttackLineClass(
      selectedTargetData
        .pathResult,
      tutorialPhase4
    );

  return `
    <svg
      class="attack-line-overlay"
      width="${gridWidth}"
      height="${gridHeight}"
      viewBox="0 0 ${gridWidth} ${gridHeight}"
      aria-hidden="true"
    >
      <line
        class="attack-line ${lineClass}"
        x1="${startX}"
        y1="${startY}"
        x2="${endX}"
        y2="${endY}"
      />

      <circle
        class="attack-line-point ${lineClass}"
        cx="${startX}"
        cy="${startY}"
        r="6"
      />

      <circle
        class="attack-line-point ${lineClass}"
        cx="${endX}"
        cy="${endY}"
        r="8"
      />
    </svg>
  `;
}

function renderUnitToken(
  unit,
  battleState,
  validAttackTargets = []
) {
  if (!unit) return "";

  const sideClass =
    unit.side === "player"
      ? "unit-player"
      : "unit-enemy";

  const selectedUnitClass =
    unit.battleUnitId ===
    battleState.selectedUnitId
      ? "unit-selected"
      : "";

  const targetable =
    isValidAttackTarget(
      validAttackTargets,
      unit
    );

  const selectedTarget =
    isSelectedAttackTarget(
      battleState,
      unit
    );

  const targetableClass =
    targetable ? "unit-targetable" : "";

  const selectedTargetClass =
    selectedTarget
      ? "unit-target-selected"
      : "";

  const targetMarker = selectedTarget
    ? `<span class="target-marker">TARGET</span>`
    : targetable
      ? `<span class="target-marker">IN ATR</span>`
      : "";

  return `
    <div
      class="
        unit-token
        ${sideClass}
        ${selectedUnitClass}
        ${targetableClass}
        ${selectedTargetClass}
      "
    >
      ${targetMarker}
      <strong>${unit.name}</strong>
      <span>
        HP ${unit.currentHP}/${unit.maxHP}
      </span>
    </div>
  `;
}

function renderMapLegend(
  battleState
) {
  if (
    isTutorialPhase4(
      battleState
    )
  ) {
    return `
      <div class="map-legend">
        <p>
          <strong>Green Line</strong>
          = no Cover affecting the shot
        </p>

        <p>
          <strong>Yellow Line</strong>
          = Partial Cover
        </p>

        <p>
          <strong>Red Line</strong>
          = Full Cover
        </p>

        <p>
          <strong>Cyan Tile</strong>
          = Movement Area
        </p>

        <p>
          <strong>Purple Dashed</strong>
          = Player StartGrid
        </p>

        <p>
          Obstacles block movement.
        </p>

        <p>
          Some obstacles also provide Cover.
        </p>
      </div>
    `;
  }

  return `
    <div class="map-legend">
      <p>
        <strong>Green</strong>
        = Player Unit
      </p>

      <p>
        <strong>Red</strong>
        = Enemy Unit
      </p>

      <p>
        <strong>Cyan Tile</strong>
        = Movement Area
      </p>

      <p>
        <strong>Purple Dashed</strong>
        = Player StartGrid
      </p>

      <p>
        <strong>White Line</strong>
        = Clear Attack Path
      </p>

      <p>
        <strong>Orange Line</strong>
        = Partial Cover
      </p>

      <p>
        <strong>Red Line</strong>
        = Full Cover / Blocked
      </p>

      <p>
        <strong>O30</strong>
        = Partial Cover 30%
      </p>

      <p>
        <strong>O70</strong>
        = Partial Cover 70%
      </p>

      <p>
        <strong>OF</strong>
        = Full Cover
      </p>

      <p>
        <strong>LOS</strong>
        = Prototype LOS Blocker
      </p>
    </div>
  `;
}

export function renderMapGrid(
  mapData,
  battleState = null,
  movementTiles = [],
  validAttackTargets = [],
  attackCandidates = []
) {
  const cells = mapData.tiles
    .flatMap((row, y) => {
      return row.map((tileCode, x) => {
        const tacticalPositionState =
          getTacticalPositionState(
            mapData,
            battleState,
            x,
            y
          );

        if (
          tacticalPositionState !==
            "active"
        ) {
          return `
            <div
              class="map-tile-inactive"
              aria-hidden="true"
            ></div>
          `;
        }

        const tileClass =
          getTileClass(tileCode);

        const tileLabel =
          getTileLabel(tileCode);

        const unit =
          findUnitAtTile(
            battleState,
            x,
            y
          );

          const startGridOwner =
  findPlayerStartGridAtTile(
    battleState,
    x,
    y
  );

const startGridClass =
  startGridOwner
    ? "tile-start-grid"
    : "";

const startGridMarker =
  startGridOwner
    ? (
        `<span class="start-grid-marker">` +
        `START` +
        `</span>`
      )
    : "";

        const movementClass =
          isMovementTile(
            movementTiles,
            x,
            y
          )
            ? "tile-movement"
            : "";

            const tutorialTargetMarker =
  isTutorialTargetTile(
    battleState,
    x,
    y
  )
    ? (
        `<span class="target-marker">` +
        `MOVE HERE` +
        `</span>`
      )
    : "";

        const attackTargetClass =
          isValidAttackTarget(
            validAttackTargets,
            unit
          )
            ? "tile-attack-target"
            : "";

        const selectedAttackTargetClass =
          isSelectedAttackTarget(
            battleState,
            unit
          )
            ? "tile-attack-selected"
            : "";

        return `
          <button
            class="
  map-tile
  ${tileClass}
  ${startGridClass}
  ${movementClass}
              ${attackTargetClass}
              ${selectedAttackTargetClass}
            "
            data-tile-x="${x}"
            data-tile-y="${y}"
            type="button"
          >
            <span class="tile-coordinate">
              ${x},${y}
            </span>

            <span class="tile-label">
  ${unit ? "" : tileLabel}
</span>

${startGridMarker}
${tutorialTargetMarker}

${renderUnitToken(
              unit,
              battleState,
              validAttackTargets
            )}
          </button>
        `;
      });
    })
    .join("");

  const gridPixelWidth =
    mapData.width *
      BATTLE_TILE_SIZE +
    (mapData.width - 1) *
      BATTLE_TILE_GAP;

  const gridPixelHeight =
    mapData.height *
      BATTLE_TILE_SIZE +
    (mapData.height - 1) *
      BATTLE_TILE_GAP;

  return `
    <section class="map-section">
      <div class="map-header">
        <h2>${mapData.name}</h2>
        <p>
          Map size:
          ${mapData.width} x ${mapData.height}
        </p>
      </div>

      <div
        class="battlefield-viewport"
        data-battlefield-viewport
      >
        <div
          class="map-grid-stage"
          data-battlefield-world
          style="
            width: ${gridPixelWidth}px;
            height: ${gridPixelHeight}px;
          "
        >
         ${renderAttackLine(
            mapData,
            battleState,
            validAttackTargets,
            attackCandidates
          )}

          <div
            class="map-grid"
            style="
              grid-template-columns:
              repeat(
                ${mapData.width},
                ${BATTLE_TILE_SIZE}px
              );
            "
          >
            ${cells}
          </div>
        </div>
      </div>

      ${renderMapLegend(
        battleState
      )}
    </section>
  `;
}
