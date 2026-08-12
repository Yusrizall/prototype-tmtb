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

function getAttackLineClass(pathResult) {
  if (!pathResult) {
    return "attack-line-clear";
  }

  if (pathResult.outcome === "partial_cover") {
    return "attack-line-partial";
  }

  if (pathResult.outcome === "full_cover") {
    return "attack-line-full";
  }

  if (pathResult.outcome === "melee_blocked") {
    return "attack-line-blocked";
  }

  return "attack-line-clear";
}

function renderAttackLine(
  mapData,
  battleState,
  validAttackTargets
) {
  if (
    battleState.battleControlState !==
    "attack_targeting"
  ) {
    return "";
  }

  const attacker =
    getSelectedPlayerUnit(battleState);

  const selectedTargetData =
    getSelectedTargetData(
      battleState,
      validAttackTargets
    );

  if (!attacker || !selectedTargetData) {
    return "";
  }

  const target = selectedTargetData.unit;

  // Nilai ini mengikuti ukuran tile dan gap
  // yang dipakai oleh CSS prototype saat ini.
  const tileSize = 80;
  const tileGap = 8;
  const tilePitch = tileSize + tileGap;

  const gridWidth =
    mapData.width * tileSize +
    (mapData.width - 1) * tileGap;

  const gridHeight =
    mapData.height * tileSize +
    (mapData.height - 1) * tileGap;

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

  const lineClass = getAttackLineClass(
    selectedTargetData.pathResult
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

export function renderMapGrid(
  mapData,
  battleState = null,
  movementTiles = [],
  validAttackTargets = []
) {
  const cells = mapData.tiles
    .flatMap((row, y) => {
      return row.map((tileCode, x) => {
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
    mapData.width * 80 +
    (mapData.width - 1) * 8;

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
        class="map-grid-stage"
        style="width: ${gridPixelWidth}px;"
      >
        ${renderAttackLine(
          mapData,
          battleState,
          validAttackTargets
        )}

        <div
          class="map-grid"
          style="
            grid-template-columns:
            repeat(${mapData.width}, 80px);
          "
        >
          ${cells}
        </div>
      </div>

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
      </div>
    </section>
  `;
}