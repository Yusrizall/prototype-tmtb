import {
  isMatchingRunBattleResult
} from "../battle/battleResultState.js";
import {
  generateBuffOffers,
  getBuffDefinitions
} from "./buffSystem.js";

const STAGE_2_POOL = [
  {
    nodeId: "r1_s2_a",
    stageSlot: 2,
    variantId: "A",

    shortLabel: "Stage 2A",
    name: "Village Outskirts",

    nodeType: "stage",
    objectiveType: "eliminate_all",

    routeDifficulty: "easy",
    difficultyTag: "easy-normal",

    crystalReward: 25,

    pathRole: "safe_route"
  },
  {
    nodeId: "r1_s2_b",
    stageSlot: 2,
    variantId: "B",

    shortLabel: "Stage 2B",
    name: "Village Housing",

    nodeType: "stage",
    objectiveType: "eliminate_all",

    routeDifficulty: "normal",
    difficultyTag: "normal",

    crystalReward: 30,

    pathRole: "balanced_route"
  },
  {
    nodeId: "r1_s2_c",
    stageSlot: 2,
    variantId: "C",

    shortLabel: "Stage 2C",
    name: "Village Crossroads",

    nodeType: "stage",
    objectiveType: "eliminate_all",

    routeDifficulty: "hard",
    difficultyTag: "normal-hard",

    crystalReward: 40,

    pathRole: "high_risk_route"
  }
];

const STAGE_3_POOL = [
  {
    nodeId: "r1_s3_a",
    stageSlot: 3,
    variantId: "A",

    shortLabel: "Stage 3A",
    name: "Farmstead Entrance",

    nodeType: "stage",
    objectiveType: "eliminate_all",

    routeDifficulty: "easy",
    difficultyTag: "normal-hard",

    crystalReward: 35,

    pathRole: "stable_route"
  },
  {
    nodeId: "r1_s3_b",
    stageSlot: 3,
    variantId: "B",

    shortLabel: "Stage 3B",
    name: "Rice Field Path",

    nodeType: "stage",
    objectiveType: "eliminate_all",

    routeDifficulty: "normal",
    difficultyTag: "hard",

    crystalReward: 45,

    pathRole: "tactical_route"
  },
  {
    nodeId: "r1_s3_c",
    stageSlot: 3,
    variantId: "C",

    shortLabel: "Stage 3C",
    name: "Irrigation Fields",

    nodeType: "stage",
    objectiveType: "eliminate_all",

    routeDifficulty: "hard",
    difficultyTag: "hard-plus",

    crystalReward: 55,

    pathRole: "high_risk_route"
  }
];

const STAGE_1_NODE = {
  nodeId: "r1_s1_fixed",
  stageSlot: 1,
  variantId: "fixed",

  shortLabel: "Stage 1",
  name: "Lumberjack / Carpentry Area",

  nodeType: "stage",
  objectiveType: "eliminate_all",

  routeDifficulty: "normal",
  difficultyTag: "normal-light",

  crystalReward: 20,

  pathRole: "starting_stage"
};

const STAGE_4_NODE = {
  nodeId: "r1_s4_fixed",
  stageSlot: 4,
  variantId: "fixed",

  shortLabel: "Stage 4",
  name: "River Bridge Approach",

  nodeType: "mini_boss",
  objectiveType: "eliminate_all",

  routeDifficulty: "hard",
  difficultyTag: "hard",

  crystalReward: 70,

  pathRole: "region_completion"
};

function cloneData(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function chooseRandomUniqueItems(
  pool,
  itemCount
) {
  const shuffledPool =
    cloneData(pool);

  for (
    let index = shuffledPool.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() * (index + 1)
      );

    const temporaryItem =
      shuffledPool[index];

    shuffledPool[index] =
      shuffledPool[randomIndex];

    shuffledPool[randomIndex] =
      temporaryItem;
  }

  return shuffledPool.slice(
    0,
    itemCount
  );
}

function createNode(
  nodeDefinition,
  status,
  graphPosition
) {
  return {
    ...cloneData(nodeDefinition),

    status,

    graphPosition: {
      ...graphPosition
    }
  };
}

function createConnections(
  stage1Node,
  stage2Nodes,
  stage3Nodes,
  stage4Node
) {
  const connections = [];

  stage2Nodes.forEach((stage2Node) => {
    connections.push({
      fromNodeId:
        stage1Node.nodeId,

      toNodeId:
        stage2Node.nodeId
    });
  });

  stage2Nodes.forEach((stage2Node) => {
    stage3Nodes.forEach((stage3Node) => {
      connections.push({
        fromNodeId:
          stage2Node.nodeId,

        toNodeId:
          stage3Node.nodeId
      });
    });
  });

  stage3Nodes.forEach((stage3Node) => {
    connections.push({
      fromNodeId:
        stage3Node.nodeId,

      toNodeId:
        stage4Node.nodeId
    });
  });

  return connections;
}

export function createInitialRunState() {
  const selectedStage2Definitions =
    chooseRandomUniqueItems(
      STAGE_2_POOL,
      2
    );

  const selectedStage3Definitions =
    chooseRandomUniqueItems(
      STAGE_3_POOL,
      2
    );

  const stage1Node =
    createNode(
      STAGE_1_NODE,
      "available",
      {
        column: 1,
        row: 1
      }
    );

  const stage2Nodes =
    selectedStage2Definitions.map(
      (definition, index) => {
        return createNode(
          definition,
          "future",
          {
            column: 2,
            row: index + 1
          }
        );
      }
    );

  const stage3Nodes =
    selectedStage3Definitions.map(
      (definition, index) => {
        return createNode(
          definition,
          "future",
          {
            column: 3,
            row: index + 1
          }
        );
      }
    );

  const stage4Node =
    createNode(
      STAGE_4_NODE,
      "future",
      {
        column: 4,
        row: 1
      }
    );

  const generatedNodes = [
    stage1Node,
    ...stage2Nodes,
    ...stage3Nodes,
    stage4Node
  ];

  const nodeConnections =
    createConnections(
      stage1Node,
      stage2Nodes,
      stage3Nodes,
      stage4Node
    );

  return {
    version: 1,

    runId:
      `run_${Date.now()}_` +
      `${Math.floor(Math.random() * 100000)}`,

    regionId: "region_1",

runStatus: "active",
runResult: null,

defeatedNodeId: null,

runCrystal: 0,

crystalConversionCompleted: false,
convertedRunCrystal: 0,

metaCrystalBeforeConversion: null,
metaCrystalAfterConversion: null,

    generatedNodes,
    nodeConnections,

    selectedNodeId:
      stage1Node.nodeId,

    currentNodeId: null,

    completedNodeIds: [],
blockedNodeIds: [],

chosenRewardIds: [],
rewardGrantedNodeIds: [],

availableBuffIds:
  getBuffDefinitions().map((buff) => buff.buffId),

pendingRewardSourceNodeId: null,
pendingRewardOptions: [],

lastBattleResult: null,

activeRunBuffs: []
  };
}

export function getRunNodeById(
  runState,
  nodeId
) {
  return (
    runState?.generatedNodes.find(
      (node) => {
        return node.nodeId === nodeId;
      }
    ) ?? null
  );
}

export function markRunNodeCurrent(
  runState,
  nodeId
) {
  if (!runState) {
    return runState;
  }

  const targetNode =
    getRunNodeById(
      runState,
      nodeId
    );

  if (
    !targetNode ||
    targetNode.status !== "available"
  ) {
    return runState;
  }

  const hasDifferentCurrentNode =
    runState.currentNodeId !== null &&
    runState.currentNodeId !== nodeId;

  if (hasDifferentCurrentNode) {
    return runState;
  }

  const siblingNodeIdsToBlock =
    runState.generatedNodes
      .filter((node) => {
        const isSameStageSlot =
          node.stageSlot ===
          targetNode.stageSlot;

        const isDifferentNode =
          node.nodeId !==
          targetNode.nodeId;

        const isAvailable =
          node.status ===
          "available";

        return (
          isSameStageSlot &&
          isDifferentNode &&
          isAvailable
        );
      })
      .map((node) => {
        return node.nodeId;
      });

  const nextGeneratedNodes =
    runState.generatedNodes.map(
      (node) => {
        if (
          node.nodeId ===
          targetNode.nodeId
        ) {
          return {
            ...node,
            status: "current"
          };
        }

        if (
          siblingNodeIdsToBlock.includes(
            node.nodeId
          )
        ) {
          return {
            ...node,
            status: "blocked"
          };
        }

        return node;
      }
    );

  const previousBlockedNodeIds =
    runState.blockedNodeIds ??
    [];

  const nextBlockedNodeIds = [
    ...new Set([
      ...previousBlockedNodeIds,
      ...siblingNodeIdsToBlock
    ])
  ];

  return {
    ...runState,

    generatedNodes:
      nextGeneratedNodes,

    selectedNodeId:
      targetNode.nodeId,

    currentNodeId:
      targetNode.nodeId,

    blockedNodeIds:
      nextBlockedNodeIds
  };
}

export function prepareRunStageVictoryReward(
  runState,
  nodeId,
  resultSnapshot = null
) {
  if (!runState) {
    return runState;
  }

  const stageNode =
    getRunNodeById(
      runState,
      nodeId
    );

  if (
    !stageNode ||
    stageNode.status !== "current"
  ) {
    return runState;
  }

  const rewardGrantedNodeIds =
    runState.rewardGrantedNodeIds ??
    [];

  const rewardAlreadyGranted =
    rewardGrantedNodeIds.includes(
      nodeId
    );

  if (rewardAlreadyGranted) {
    return runState;
  }

  const rewardOptions = generateBuffOffers({
    nodeType: stageNode.nodeType,
    availableBuffIds: runState.availableBuffIds,
    partyUnitIds: ["guard", "archer"],
    offerCount: 2
  });

  return {
    ...runState,

    runCrystal:
      runState.runCrystal +
      stageNode.crystalReward,

    rewardGrantedNodeIds: [
      ...rewardGrantedNodeIds,
      nodeId
    ],

    pendingRewardSourceNodeId:
      nodeId,

    pendingRewardOptions:
      rewardOptions,

    lastBattleResult:
      isMatchingRunBattleResult(
        resultSnapshot,
        nodeId,
        "victory"
      )
        ? cloneData(resultSnapshot)
        : runState.lastBattleResult
  };
}

export function chooseRunReward(
  runState,
  rewardId
) {
  if (!runState) {
    return runState;
  }

  const sourceNodeId =
    runState.pendingRewardSourceNodeId;

  const sourceNode =
    getRunNodeById(
      runState,
      sourceNodeId
    );

  const rewardOptions =
    runState.pendingRewardOptions ??
    [];

  const selectedReward = rewardId
    ? rewardOptions.find(
      (reward) => {
        return (
          reward.buffId ===
          rewardId
        );
      }
    )
    : null;

  const isValidCurrentSource =
    sourceNode &&
    sourceNode.status === "current" &&
    runState.currentNodeId ===
      sourceNodeId;

  if (
    !isValidCurrentSource ||
    (rewardId && !selectedReward)
  ) {
    return runState;
  }

  const nextNodeIds =
    runState.nodeConnections
      .filter((connection) => {
        return (
          connection.fromNodeId ===
          sourceNodeId
        );
      })
      .map((connection) => {
        return connection.toNodeId;
      });

  const nextGeneratedNodes =
    runState.generatedNodes.map(
      (node) => {
        if (
          node.nodeId ===
          sourceNodeId
        ) {
          return {
            ...node,
            status: "completed"
          };
        }

        const shouldUnlockNode =
          nextNodeIds.includes(
            node.nodeId
          ) &&
          node.status === "future";

        if (shouldUnlockNode) {
          return {
            ...node,
            status: "available"
          };
        }

        return node;
      }
    );

  const nextSelectedNode =
    nextGeneratedNodes.find(
      (node) => {
        return (
          nextNodeIds.includes(
            node.nodeId
          ) &&
          node.status === "available"
        );
      }
    );

  const completedNodeIds =
    runState.completedNodeIds ??
    [];

  const nextCompletedNodeIds =
    completedNodeIds.includes(
      sourceNodeId
    )
      ? completedNodeIds
      : [
          ...completedNodeIds,
          sourceNodeId
        ];

  const chosenRewardIds =
    runState.chosenRewardIds ??
    [];

  return {
    ...runState,

    generatedNodes:
      nextGeneratedNodes,

    selectedNodeId:
      nextSelectedNode?.nodeId ??
      sourceNodeId,

    currentNodeId: null,

    completedNodeIds:
      nextCompletedNodeIds,

    chosenRewardIds: selectedReward
      ? [...chosenRewardIds, selectedReward.buffId]
      : chosenRewardIds,

    availableBuffIds: selectedReward
      ? (runState.availableBuffIds ?? []).filter(
          (buffId) => buffId !== selectedReward.buffId
        )
      : runState.availableBuffIds,

    activeRunBuffs: selectedReward
      ? [...(runState.activeRunBuffs ?? []), cloneData(selectedReward)]
      : runState.activeRunBuffs,

    pendingRewardSourceNodeId:
      null,

    pendingRewardOptions: []
  };
}

export function completeRunIfFinalStageCompleted(
  runState
) {
  if (
    !runState ||
    runState.runStatus !== "active"
  ) {
    return runState;
  }

  const finalStageNode =
    runState.generatedNodes.find(
      (node) => {
        return node.stageSlot === 4;
      }
    );

  const hasPendingReward =
    runState.pendingRewardSourceNodeId !==
      null ||
    (
      runState.pendingRewardOptions
        ?.length ?? 0
    ) > 0;

  const canCompleteRun =
    finalStageNode?.status ===
      "completed" &&
    runState.currentNodeId === null &&
    !hasPendingReward;

  if (!canCompleteRun) {
    return runState;
  }

  return {
    ...runState,

    runStatus: "completed",
    runResult: "completed",

    selectedNodeId:
      finalStageNode.nodeId
  };
}

export function markRunDefeated(
  runState,
  nodeId,
  resultSnapshot = null
) {
  if (
    !runState ||
    runState.runStatus !== "active"
  ) {
    return runState;
  }

  const defeatedNode =
    getRunNodeById(
      runState,
      nodeId
    );

  const isValidCurrentNode =
    defeatedNode &&
    defeatedNode.status === "current" &&
    runState.currentNodeId === nodeId;

  if (!isValidCurrentNode) {
    return runState;
  }

  const nextGeneratedNodes =
    runState.generatedNodes.map(
      (node) => {
        if (node.nodeId !== nodeId) {
          return node;
        }

        return {
          ...node,
          status: "failed"
        };
      }
    );

  return {
    ...runState,

    runStatus: "defeated",
    runResult: "defeat",

    defeatedNodeId: nodeId,

    generatedNodes:
      nextGeneratedNodes,

    selectedNodeId: nodeId,
    currentNodeId: null,

    pendingRewardSourceNodeId:
      null,

    pendingRewardOptions: [],

    lastBattleResult:
      isMatchingRunBattleResult(
        resultSnapshot,
        nodeId,
        "defeat"
      )
        ? cloneData(resultSnapshot)
        : runState.lastBattleResult
  };
}
