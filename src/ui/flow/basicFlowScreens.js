import {
  PERMANENT_UPGRADE_COSTS,
  MAX_PERMANENT_UPGRADE_LEVEL
} from "../../logic/profile/profileStorage.js";
const MAIN_MENU_ITEMS = [
  {
    id: "start_journey",
    label: "Start Journey",
    action: "start-journey",
    enabled: true
  },
  {
    id: "run_history",
    label: "Run Notes / Run History",
    action: null,
    enabled: false
  },
  {
    id: "settings",
    label: "Settings",
    action: null,
    enabled: false
  },
  {
    id: "credits",
    label: "Credits",
    action: null,
    enabled: false
  },
  {
    id: "reset_data",
    label: "Reset Data",
    action: "reset-data",
    enabled: true
  },
  {
    id: "quit",
    label: "Quit",
    action: null,
    enabled: false
  }
];

const POST_RUN_SHOP_GROUPS = [
  {
    unitId: "guard",
    label: "Guard",

    upgrades: [
      {
        statId: "maxHP",
        label: "Max HP"
      },
      {
        statId: "atk",
        label: "ATK"
      },
      {
        statId: "def",
        label: "DEF"
      }
    ]
  },
  {
    unitId: "archer",
    label: "Archer",

    upgrades: [
      {
        statId: "maxHP",
        label: "Max HP"
      },
      {
        statId: "atk",
        label: "ATK"
      },
      {
        statId: "def",
        label: "DEF"
      }
    ]
  }
];

const GRAPH_NODE_LAYOUT = {
  stage1: {
    left: 20,
    top: 162
  },

  stage2Top: {
    left: 280,
    top: 50
  },

  stage2Bottom: {
    left: 280,
    top: 274
  },

  stage3Top: {
    left: 560,
    top: 50
  },

  stage3Bottom: {
    left: 560,
    top: 274
  },

  stage4: {
    left: 800,
    top: 162
  }
};

function getNodePositionStyle(node) {
  let position = null;

  if (node.stageSlot === 1) {
    position =
      GRAPH_NODE_LAYOUT.stage1;
  }

  if (
    node.stageSlot === 2 &&
    node.graphPosition.row === 1
  ) {
    position =
      GRAPH_NODE_LAYOUT.stage2Top;
  }

  if (
    node.stageSlot === 2 &&
    node.graphPosition.row === 2
  ) {
    position =
      GRAPH_NODE_LAYOUT.stage2Bottom;
  }

  if (
    node.stageSlot === 3 &&
    node.graphPosition.row === 1
  ) {
    position =
      GRAPH_NODE_LAYOUT.stage3Top;
  }

  if (
    node.stageSlot === 3 &&
    node.graphPosition.row === 2
  ) {
    position =
      GRAPH_NODE_LAYOUT.stage3Bottom;
  }

  if (node.stageSlot === 4) {
    position =
      GRAPH_NODE_LAYOUT.stage4;
  }

  if (!position) {
    return "";
  }

  return (
    `left: ${position.left}px; ` +
    `top: ${position.top}px;`
  );
}

function renderRegionConnectionLines() {
  return `
    <svg
      class="region-connection-layer"
      viewBox="0 0 1000 420"
      aria-hidden="true"
    >
      <line
        x1="110"
        y1="210"
        x2="370"
        y2="98"
      />

      <line
        x1="110"
        y1="210"
        x2="370"
        y2="322"
      />

      <line
        x1="370"
        y1="98"
        x2="650"
        y2="98"
      />

      <line
        x1="370"
        y1="98"
        x2="650"
        y2="322"
      />

      <line
        x1="370"
        y1="322"
        x2="650"
        y2="98"
      />

      <line
        x1="370"
        y1="322"
        x2="650"
        y2="322"
      />

      <line
        x1="650"
        y1="98"
        x2="890"
        y2="210"
      />

      <line
        x1="650"
        y1="322"
        x2="890"
        y2="210"
      />
    </svg>
  `;
}

function renderRegionNode(
  node,
  selectedNodeId
) {
  const statusClass =
    `region-node-${node.status}`;

  const isSelected =
    node.nodeId === selectedNodeId;

  const selectedClass =
    isSelected
      ? "region-node-selected"
      : "";

  const routeDifficulty =
    node.routeDifficulty ?? "normal";

  const difficultyClass =
    `region-difficulty-${routeDifficulty}`;

  const positionStyle =
    getNodePositionStyle(node);

  return `
    <button
      type="button"
      class="
        region-node
        ${statusClass}
        ${selectedClass}
      "
      style="${positionStyle}"
      data-action="select-region-node"
      data-node-id="${node.nodeId}"
      aria-pressed="${isSelected}"
    >
      <span class="region-node-slot">
        ${node.shortLabel}
      </span>

      <strong class="region-node-name">
        ${node.name}
      </strong>

      <span
        class="
          region-node-difficulty
          ${difficultyClass}
        "
      >
        ${routeDifficulty}
      </span>

      <span class="region-node-status">
        ${node.status}
      </span>
    </button>
  `;
}

function renderGeneratedRegionGraph(
  runState
) {
  if (!runState) {
    return `
      <section class="status-panel">
        <h2>Run State Missing</h2>

        <p>
          Region belum berhasil digenerate.
        </p>
      </section>
    `;
  }

  const renderedNodes =
  runState.generatedNodes
    .map((node) => {
      return renderRegionNode(
        node,
        runState.selectedNodeId
      );
    })
    .join("");

  return `
    <section class="region-graph-panel">
      <header class="region-graph-header">
        <div>
          <strong>Region Graph</strong>
          <span>
            Stage 1 → Branch → Branch → Stage 4
          </span>
        </div>

        <div>
          <strong>Run Crystal</strong>
          <span>${runState.runCrystal}</span>
        </div>
      </header>

      <div class="region-graph-scroll">
        <div class="region-graph-stage">
          ${renderRegionConnectionLines()}
          ${renderedNodes}
        </div>
      </div>
    </section>
  `;
}

function renderSelectedNodePreview(
  runState
) {
  if (!runState) {
    return "";
  }

  const selectedNode =
    runState.generatedNodes.find(
      (node) => {
        return (
          node.nodeId ===
          runState.selectedNodeId
        );
      }
    );

  if (!selectedNode) {
    return `
      <section class="region-node-preview">
        <h2>Node Preview</h2>

        <p>
          Pilih salah satu node pada map.
        </p>
      </section>
    `;
  }

  const routeDifficulty =
    selectedNode.routeDifficulty ??
    "normal";

  const difficultyClass =
    `region-difficulty-${routeDifficulty}`;

  const canEnterNode =
    selectedNode.status ===
    "available";

  const entryStateClass =
    canEnterNode
      ? "region-entry-available"
      : "region-entry-locked";

    const entryStateTextByStatus = {
    available:
      "Available to enter",

    future:
      "Not reachable yet",

    current:
      "Battle currently active",

    completed:
      "Stage completed",

    blocked:
      "Route blocked by branch choice"
  };

  const entryStateText =
    entryStateTextByStatus[
      selectedNode.status
    ] ??
    "Stage unavailable";
        const entryButtonClass =
    canEnterNode
      ? "main-menu-button-active"
      : "main-menu-button-disabled";

  const entryButtonDisabled =
    canEnterNode
      ? ""
      : "disabled";

  return `
    <section class="region-node-preview">
      <header class="region-node-preview-header">
        <div>
          <p class="eyebrow">
            Selected Node
          </p>

          <h2>${selectedNode.name}</h2>

          <span>
            ${selectedNode.shortLabel}
          </span>
        </div>

        <span
          class="
            region-node-difficulty
            ${difficultyClass}
          "
        >
          ${routeDifficulty}
        </span>
      </header>

      <div class="region-node-preview-grid">
        <div>
          <span>Encounter Type</span>
          <strong>
            ${selectedNode.nodeType}
          </strong>
        </div>

        <div>
          <span>Objective</span>
          <strong>
            ${selectedNode.objectiveType}
          </strong>
        </div>

        <div>
          <span>Crystal Reward</span>
          <strong>
            ${selectedNode.crystalReward}
          </strong>
        </div>

        <div>
          <span>Progression Status</span>
          <strong>
            ${selectedNode.status}
          </strong>
        </div>
      </div>

      <p
        class="
          region-node-entry-state
          ${entryStateClass}
        "
      >
        ${entryStateText}
      </p>
            <div class="region-node-preview-actions">
        <button
          type="button"
          class="
            main-menu-button
            ${entryButtonClass}
          "
          data-action="open-battle-intro"
          ${entryButtonDisabled}
        >
          <span>Enter Stage</span>

          <small>
            ${
              canEnterNode
                ? "Available"
                : "Locked"
            }
          </small>
        </button>
      </div>
    </section>
  `;
}

function renderShopUpgradeCard(
  profileState,
  unitGroup,
  upgrade
) {
  const currentLevel =
    profileState
      ?.permanentUpgrades
      ?.[unitGroup.unitId]
      ?.[upgrade.statId] ?? 0;

  const isMaximumLevel =
    currentLevel >=
    MAX_PERMANENT_UPGRADE_LEVEL;

  const nextCost =
    isMaximumLevel
      ? null
      : PERMANENT_UPGRADE_COSTS[
          currentLevel
        ];

  const metaCrystal =
    profileState?.metaCrystal ?? 0;

  const canAfford =
    !isMaximumLevel &&
    metaCrystal >= nextCost;

  const buttonClass =
    canAfford
      ? "main-menu-button-active"
      : "main-menu-button-disabled";

  const buttonDisabled =
    canAfford
      ? ""
      : "disabled";

  const purchaseLabel =
    isMaximumLevel
      ? "Maximum Level"
      : canAfford
        ? `Buy Level ${currentLevel + 1}`
        : "Not Enough Crystal";

  const costText =
    isMaximumLevel
      ? "MAX"
      : `${nextCost} Meta Crystal`;

  return `
    <article class="shop-upgrade-card">
      <header class="shop-upgrade-header">
        <div>
          <span>
            ${unitGroup.label}
          </span>

          <strong>
            ${upgrade.label}
          </strong>
        </div>

        <span class="shop-upgrade-level">
          Level ${currentLevel} /
          ${MAX_PERMANENT_UPGRADE_LEVEL}
        </span>
      </header>

      <div class="shop-upgrade-info">
        <span>Next Cost</span>
        <strong>${costText}</strong>
      </div>

      <p>
        Permanent stat effect will be
        activated in Checkpoint 2.5D.
      </p>

      <button
        type="button"
        class="
          main-menu-button
          ${buttonClass}
        "
        data-action="buy-permanent-upgrade"
        data-unit-id="${unitGroup.unitId}"
        data-stat-id="${upgrade.statId}"
        data-expected-level="${currentLevel}"
        ${buttonDisabled}
      >
        <span>${purchaseLabel}</span>

        <small>
          ${
            isMaximumLevel
              ? "MAX"
              : costText
          }
        </small>
      </button>
    </article>
  `;
}

export function renderTitleScreen() {
  return `
    <main
      class="flow-screen title-screen"
      data-screen="title"
    >
      <section class="flow-card title-card">
        <p class="eyebrow">
          Game Designer Prototype
        </p>

        <h1>TMTB</h1>

        <p class="description">
          Turn-Based Tactics Prototype
        </p>

        <p class="flow-screen-hint">
          Press any key or click anywhere
        </p>
      </section>
    </main>
  `;
}

export function renderMainMenuScreen() {
  const menuButtons =
    MAIN_MENU_ITEMS
      .map((item) => {
        if (item.enabled) {
          return `
            <button
              type="button"
              class="
                main-menu-button
                main-menu-button-active
              "
              data-action="${item.action}"
            >
              <span>${item.label}</span>
            </button>
          `;
        }

        return `
          <button
            type="button"
            class="
              main-menu-button
              main-menu-button-disabled
            "
            disabled
          >
            <span>${item.label}</span>
            <small>Unavailable</small>
          </button>
        `;
      })
      .join("");

  return `
    <main class="flow-screen">
      <section class="flow-card main-menu-card">
        <header class="main-menu-header">
          <p class="eyebrow">
            TMTB Prototype
          </p>

          <h1>Main Menu</h1>

          <p class="description">
            Full Game Loop Skeleton
          </p>
        </header>

        <nav
          class="main-menu-options"
          aria-label="Main Menu"
        >
          ${menuButtons}
        </nav>

        <p class="flow-screen-hint">
          Enter / Space / E = Start Journey
          · R = Reset Data
        </p>
      </section>
    </main>
  `;
}

export function renderMapSelectionScreen(
  profileState,
  runState
) {
  const metaCrystal =
    profileState?.metaCrystal ?? 0;

  const stage2Names =
    runState?.generatedNodes
      .filter((node) => {
        return node.stageSlot === 2;
      })
      .map((node) => {
        return node.shortLabel;
      })
      .join(" + ") ?? "None";

  const stage3Names =
    runState?.generatedNodes
      .filter((node) => {
        return node.stageSlot === 3;
      })
      .map((node) => {
        return node.shortLabel;
      })
      .join(" + ") ?? "None";

        const availableNodeNames =
    runState?.generatedNodes
      .filter((node) => {
        return (
          node.status ===
          "available"
        );
      })
      .map((node) => {
        return node.shortLabel;
      })
      .join(" + ") || "None";

  return `
    <main class="flow-screen map-flow-screen">
      <section class="flow-card map-flow-card">
        <header class="main-menu-header">
          <p class="eyebrow">
            Region 1 — Village
          </p>

          <h1>Map Selection</h1>

          <p class="description">
            Susunan region digenerate saat
            journey dimulai.
          </p>
        </header>

        ${renderGeneratedRegionGraph(
  runState
)}

${renderSelectedNodePreview(
  runState
)}

<section class="map-flow-info-grid">
          <article class="status-panel">
            <h2>Generated Route</h2>

            <p>
              Stage 2 Pool:
              <strong>${stage2Names}</strong>
            </p>

            <p>
              Stage 3 Pool:
              <strong>${stage3Names}</strong>
            </p>

           <p>
  Available Nodes:
  <strong>
    ${availableNodeNames}
  </strong>
</p>
          </article>

          <article class="status-panel">
            <h2>Profile / Run</h2>

            <p>
              Tutorial Completed:
              <strong>
                ${
                  profileState
                    ?.tutorialCompleted
                    ? "Yes"
                    : "No"
                }
              </strong>
            </p>

            <p>
              Meta Crystal:
              <strong>
                ${metaCrystal}
              </strong>
            </p>

            <p>
              Run ID:
              <strong>
                ${
                  runState?.runId ??
                  "None"
                }
              </strong>
            </p>
          </article>
        </section>

        <p class="flow-screen-hint">
  Klik node mana pun untuk membuka
  preview. Hanya node AVAILABLE yang
  nantinya dapat dimasuki.
</p>

        <button
          type="button"
          class="
            main-menu-button
            main-menu-button-active
          "
          data-action="back-main-menu"
        >
          <span>Back to Main Menu</span>
        </button>
      </section>
    </main>
  `;
}

export function renderBattleIntroScreen(
  runState,
  battleIntroNodeId
) {
  const stageNode =
    runState?.generatedNodes.find(
      (node) => {
        return (
          node.nodeId ===
          battleIntroNodeId
        );
      }
    );

  if (!stageNode) {
    return `
      <main class="flow-screen">
        <section
          class="
            flow-card
            battle-intro-card
            error-card
          "
        >
          <p class="eyebrow">
            Battle Intro Error
          </p>

          <h1>Stage tidak ditemukan</h1>

          <p class="description">
            Node yang dipilih tidak tersedia
            di dalam active run.
          </p>

          <button
            type="button"
            class="
              main-menu-button
              main-menu-button-active
            "
            data-action="back-map-selection"
          >
            <span>Back to Map</span>
          </button>
        </section>
      </main>
    `;
  }

  const routeDifficulty =
    stageNode.routeDifficulty ??
    "normal";

  const difficultyClass =
    `region-difficulty-${routeDifficulty}`;

  return `
    <main class="flow-screen">
      <section
        class="
          flow-card
          battle-intro-card
        "
      >
        <header class="battle-intro-header">
          <div>
            <p class="eyebrow">
              ${stageNode.shortLabel}
            </p>

            <h1>${stageNode.name}</h1>

            <p class="description">
              Review encounter information
              before beginning the battle.
            </p>
          </div>

          <span
            class="
              region-node-difficulty
              ${difficultyClass}
            "
          >
            ${routeDifficulty}
          </span>
        </header>

        <section class="battle-intro-summary">
          <div>
            <span>Encounter Type</span>
            <strong>
              ${stageNode.nodeType}
            </strong>
          </div>

          <div>
            <span>Objective</span>
            <strong>
              ${stageNode.objectiveType}
            </strong>
          </div>

          <div>
            <span>Crystal Reward</span>
            <strong>
              ${stageNode.crystalReward}
            </strong>
          </div>

          <div>
            <span>Current Status</span>
            <strong>
              ${stageNode.status}
            </strong>
          </div>
        </section>

        <section class="battle-intro-notice">
          <h2>Prototype Encounter</h2>

          <p>
            Stage ini sementara memakai
            map dan enemy setup Stage 1.
          </p>

          <p>
            Nama stage, difficulty, objective,
            dan reward tetap mengikuti node
            yang dipilih.
          </p>
        </section>

        <div class="battle-intro-actions">
          <button
            type="button"
            class="
              main-menu-button
              main-menu-button-active
            "
            data-action="begin-stage-battle"
          >
            <span>Begin Battle</span>
            <small>Enter / E / Space</small>
          </button>

          <button
            type="button"
            class="
              main-menu-button
              main-menu-button-active
            "
            data-action="back-map-selection"
          >
            <span>Back to Map</span>
            <small>Z / Escape</small>
          </button>
        </div>
      </section>
    </main>
  `;
}
export function renderRewardSelectionScreen(
  runState
) {
  const sourceNode =
    runState?.generatedNodes.find(
      (node) => {
        return (
          node.nodeId ===
          runState.pendingRewardSourceNodeId
        );
      }
    );

  const rewardOptions =
    runState?.pendingRewardOptions ??
    [];

  if (
    !runState ||
    !sourceNode ||
    rewardOptions.length !== 4
  ) {
    return `
      <main class="flow-screen">
        <section
          class="
            flow-card
            reward-selection-card
            error-card
          "
        >
          <p class="eyebrow">
            Reward State Error
          </p>

          <h1>Reward tidak tersedia</h1>

          <p class="description">
            Reward Selection tidak memiliki
            sumber stage atau empat opsi
            reward yang valid.
          </p>
        </section>
      </main>
    `;
  }

    const rewardCards =
    rewardOptions
      .map((reward, index) => {
        return `
          <button
            type="button"
            class="
              reward-card
              reward-card-selectable
            "
            data-action="choose-run-reward"
            data-reward-id="${reward.rewardId}"
          >
            <span class="reward-card-number">
              Option ${index + 1}
            </span>

            <strong class="reward-card-name">
              ${reward.name}
            </strong>

            <span class="reward-card-category">
              ${reward.category}
            </span>

            <p>
              ${reward.description}
            </p>

            <span class="reward-card-status">
              Effect Inactive
            </span>

            <span class="reward-card-select-prompt">
              Click or press ${index + 1}
            </span>
          </button>
        `;
      })
      .join("");

  return `
    <main class="flow-screen">
      <section
        class="
          flow-card
          reward-selection-card
        "
      >
        <header class="reward-selection-header">
          <div>
            <p class="eyebrow">
              Stage Victory Reward
            </p>

            <h1>Choose a Reward</h1>

            <p class="description">
              ${sourceNode.shortLabel}
              berhasil diselesaikan.
            </p>
          </div>

          <div class="reward-crystal-summary">
            <span>Run Crystal Earned</span>

            <strong>
              +${sourceNode.crystalReward}
            </strong>

            <small>
              Total: ${runState.runCrystal}
            </small>
          </div>
        </header>

        <section class="reward-card-grid">
          ${rewardCards}
        </section>

        <section class="reward-selection-notice">
  <strong>
    Reward effects are inactive.
  </strong>

  <p>
    Pilih satu kartu untuk menyimpan
    reward dan melanjutkan progression
    region.
  </p>
</section>

<p class="flow-screen-hint">
  Klik kartu atau tekan angka 1–4.
  Pilihan tidak dapat dibatalkan.
</p>
      </section>
    </main>
  `;
}

export function renderRunCompletionScreen(
  profileState,
  runState
) {
  const hasValidCompletionState =
    runState?.runStatus ===
      "completed" &&
    runState
      ?.crystalConversionCompleted ===
      true;

  if (!hasValidCompletionState) {
    return `
      <main class="flow-screen">
        <section
          class="
            flow-card
            run-completion-card
            error-card
          "
        >
          <p class="eyebrow">
            Run Completion Error
          </p>

          <h1>Run belum dapat diselesaikan</h1>

          <p class="description">
            Completion state atau Crystal
            Conversion belum valid.
          </p>
        </section>
      </main>
    `;
  }

  const completedNodes =
    runState.generatedNodes
      .filter((node) => {
        return (
          node.status ===
          "completed"
        );
      })
      .sort((firstNode, secondNode) => {
        return (
          firstNode.stageSlot -
          secondNode.stageSlot
        );
      });

  const blockedNodes =
    runState.generatedNodes.filter(
      (node) => {
        return (
          node.status ===
          "blocked"
        );
      }
    );

  const completedNodeItems =
    completedNodes
      .map((node) => {
        return `
          <li>
            <strong>
              ${node.shortLabel}
            </strong>

            <span>
              ${node.name}
            </span>
          </li>
        `;
      })
      .join("");

  const blockedNodeItems =
    blockedNodes.length > 0
      ? blockedNodes
          .map((node) => {
            return `
              <li>
                <strong>
                  ${node.shortLabel}
                </strong>

                <span>
                  ${node.name}
                </span>
              </li>
            `;
          })
          .join("")
      : `
          <li>
            <span>None</span>
          </li>
        `;

  const chosenRewardItems =
    runState.chosenRewardIds.length > 0
      ? runState.chosenRewardIds
          .map((rewardId) => {
            const rewardLabel =
              rewardId
                .replace(
                  /^reward_/,
                  ""
                )
                .replaceAll(
                  "_",
                  " "
                );

            return `
              <li>
                <span>${rewardLabel}</span>
              </li>
            `;
          })
          .join("")
      : `
          <li>
            <span>None</span>
          </li>
        `;

  return `
    <main class="flow-screen">
      <section
        class="
          flow-card
          run-completion-card
        "
      >
        <header class="run-completion-header">
          <p class="eyebrow">
            Region 1 Completed
          </p>

          <h1>RUN COMPLETED</h1>

          <p class="description">
            River Bridge Approach telah
            diamankan dan perjalanan region
            selesai.
          </p>
        </header>

        <section class="run-completion-summary">
          <div>
            <span>Run Crystal Converted</span>

            <strong>
              ${runState.convertedRunCrystal}
            </strong>
          </div>

          <div>
            <span>Meta Crystal Before</span>

            <strong>
              ${
                runState
                  .metaCrystalBeforeConversion
              }
            </strong>
          </div>

          <div>
            <span>Meta Crystal After</span>

            <strong>
              ${
                runState
                  .metaCrystalAfterConversion
              }
            </strong>
          </div>

          <div>
            <span>Profile Total</span>

            <strong>
              ${profileState?.metaCrystal ?? 0}
            </strong>
          </div>
        </section>

        <section class="run-completion-panel-grid">
          <article>
            <h2>Completed Route</h2>

            <ul class="run-completion-list">
              ${completedNodeItems}
            </ul>
          </article>

          <article>
            <h2>Blocked Routes</h2>

            <ul class="run-completion-list">
              ${blockedNodeItems}
            </ul>
          </article>

          <article>
            <h2>Chosen Rewards</h2>

            <ul class="run-completion-list">
              ${chosenRewardItems}
            </ul>
          </article>
        </section>

        <div class="run-completion-actions">
          <button
  type="button"
  class="
    main-menu-button
    main-menu-button-active
  "
  data-action="open-post-run-shop"
>
  <span>Continue to Shop</span>
  <small>Post-Run Only</small>
</button>

          <button
            type="button"
            class="
              main-menu-button
              main-menu-button-active
            "
            data-action="run-completion-main-menu"
          >
            <span>Return to Main Menu</span>
            <small>Enter / E / Space</small>
          </button>
        </div>
      </section>
    </main>
  `;
}

export function renderRunDefeatScreen(
  profileState,
  runState
) {
  const hasValidDefeatState =
    runState?.runStatus ===
      "defeated" &&
    runState?.runResult ===
      "defeat" &&
    runState
      ?.crystalConversionCompleted ===
      true;

  const defeatedNode =
    runState?.generatedNodes.find(
      (node) => {
        return (
          node.nodeId ===
          runState.defeatedNodeId
        );
      }
    );

  if (
    !hasValidDefeatState ||
    !defeatedNode
  ) {
    return `
      <main class="flow-screen">
        <section
          class="
            flow-card
            run-defeat-card
            error-card
          "
        >
          <p class="eyebrow">
            Run Defeat Error
          </p>

          <h1>Defeat state tidak valid</h1>

          <p class="description">
            Stage kekalahan atau Crystal
            Conversion belum tersedia.
          </p>
        </section>
      </main>
    `;
  }

  const completedNodes =
    runState.generatedNodes
      .filter((node) => {
        return (
          node.status ===
          "completed"
        );
      })
      .sort((firstNode, secondNode) => {
        return (
          firstNode.stageSlot -
          secondNode.stageSlot
        );
      });

  const completedNodeItems =
    completedNodes.length > 0
      ? completedNodes
          .map((node) => {
            return `
              <li>
                <strong>
                  ${node.shortLabel}
                </strong>

                <span>
                  ${node.name}
                </span>
              </li>
            `;
          })
          .join("")
      : `
          <li>
            <span>None</span>
          </li>
        `;

  const chosenRewardItems =
    runState.chosenRewardIds.length > 0
      ? runState.chosenRewardIds
          .map((rewardId) => {
            const rewardLabel =
              rewardId
                .replace(
                  /^reward_/,
                  ""
                )
                .replaceAll(
                  "_",
                  " "
                );

            return `
              <li>
                <span>${rewardLabel}</span>
              </li>
            `;
          })
          .join("")
      : `
          <li>
            <span>None</span>
          </li>
        `;

  return `
    <main class="flow-screen">
      <section
        class="
          flow-card
          run-defeat-card
        "
      >
        <header class="run-defeat-header">
          <p class="eyebrow">
            Region 1 Run Result
          </p>

          <h1>RUN DEFEATED</h1>

          <p class="description">
            Party dikalahkan pada
            ${defeatedNode.shortLabel} —
            ${defeatedNode.name}.
          </p>
        </header>

        <section class="run-completion-summary">
          <div>
            <span>Run Crystal Converted</span>

            <strong>
              ${runState.convertedRunCrystal}
            </strong>
          </div>

          <div>
            <span>Meta Crystal Before</span>

            <strong>
              ${
                runState
                  .metaCrystalBeforeConversion
              }
            </strong>
          </div>

          <div>
            <span>Meta Crystal After</span>

            <strong>
              ${
                runState
                  .metaCrystalAfterConversion
              }
            </strong>
          </div>

          <div>
            <span>Stages Completed</span>

            <strong>
              ${completedNodes.length}
            </strong>
          </div>
        </section>

        <section class="run-completion-panel-grid">
          <article>
            <h2>Defeated At</h2>

            <ul class="run-completion-list">
              <li>
                <strong>
                  ${defeatedNode.shortLabel}
                </strong>

                <span>
                  ${defeatedNode.name}
                </span>
              </li>
            </ul>
          </article>

          <article>
            <h2>Completed Route</h2>

            <ul class="run-completion-list">
              ${completedNodeItems}
            </ul>
          </article>

          <article>
            <h2>Chosen Rewards</h2>

            <ul class="run-completion-list">
              ${chosenRewardItems}
            </ul>
          </article>
        </section>

        <div class="run-completion-actions">
          <button
  type="button"
  class="
    main-menu-button
    main-menu-button-active
  "
  data-action="open-post-run-shop"
>
  <span>Continue to Shop</span>
  <small>Post-Run Only</small>
</button>

          <button
            type="button"
            class="
              main-menu-button
              main-menu-button-active
            "
            data-action="run-defeat-main-menu"
          >
            <span>Return to Main Menu</span>
            <small>Enter / E / Space</small>
          </button>
        </div>
      </section>
    </main>
  `;
}

export function renderPostRunShopScreen(
  profileState,
  runState
) {
  const hasValidSettledRun =
    (
      runState?.runStatus ===
        "completed" ||
      runState?.runStatus ===
        "defeated"
    ) &&
    runState
      ?.crystalConversionCompleted ===
      true;

  if (!hasValidSettledRun) {
    return `
      <main class="flow-screen">
        <section
          class="
            flow-card
            post-run-shop-card
            error-card
          "
        >
          <p class="eyebrow">
            Shop Access Error
          </p>

          <h1>Shop tidak tersedia</h1>

          <p class="description">
            Post-Run Shop hanya dapat
            dibuka setelah run diselesaikan
            atau dikalahkan.
          </p>
        </section>
      </main>
    `;
  }

  const shopGroups =
    POST_RUN_SHOP_GROUPS
      .map((unitGroup) => {
        const upgradeCards =
          unitGroup.upgrades
            .map((upgrade) => {
              return renderShopUpgradeCard(
                profileState,
                unitGroup,
                upgrade
              );
            })
            .join("");

        return `
          <section class="shop-unit-section">
            <header>
              <p class="eyebrow">
                Permanent Upgrades
              </p>

              <h2>${unitGroup.label}</h2>
            </header>

            <div class="shop-upgrade-list">
              ${upgradeCards}
            </div>
          </section>
        `;
      })
      .join("");

  const resultLabel =
    runState.runStatus ===
      "completed"
      ? "Run Completed"
      : "Run Defeated";

  return `
    <main class="flow-screen">
      <section
        class="
          flow-card
          post-run-shop-card
        "
      >
        <header class="post-run-shop-header">
          <div>
            <p class="eyebrow">
              ${resultLabel}
            </p>

            <h1>Post-Run Shop</h1>

            <p class="description">
              Spend Meta Crystal on
              permanent upgrades for future
              journeys.
            </p>
          </div>

          <div class="shop-balance">
            <span>Meta Crystal</span>

            <strong>
              ${profileState?.metaCrystal ?? 0}
            </strong>
          </div>
        </header>

        <section class="post-run-shop-grid">
          ${shopGroups}
        </section>

        <section class="post-run-shop-notice">
          <strong>
            Upgrade levels are saved.
          </strong>

          <p>
            Efek stat belum diterapkan ke
            battle. Efek tersebut akan
            diaktifkan pada Checkpoint 2.5D.
          </p>
        </section>

        <div class="post-run-shop-actions">
          <button
            type="button"
            class="
              main-menu-button
              main-menu-button-active
            "
            data-action="post-run-shop-main-menu"
          >
            <span>Return to Main Menu</span>
            <small>Escape</small>
          </button>
        </div>
      </section>
    </main>
  `;
}