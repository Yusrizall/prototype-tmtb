import test from "node:test";
import assert from "node:assert/strict";

import {
  createBattleResultSnapshot,
  isMatchingRunBattleResult
} from "../../src/logic/battle/battleResultState.js";
import {
  createInitialRunState,
  markRunNodeCurrent,
  prepareRunStageVictoryReward,
  markRunDefeated
} from "../../src/logic/run/runState.js";

function createUnit({
  id,
  name,
  startHP,
  currentHP,
  maxHP
}) {
  return {
    battleUnitId: `player_${id}_1`,
    unitDefId: id,
    name,
    stageStartHP: startHP,
    currentHP,
    maxHP,
    derivedStats: { maxHP }
  };
}

function createRunBattleResultState(
  resultState = "victory"
) {
  return {
    encounterId: "stage_1_encounter",
    encounterName: "Stage 1 - Lumberyard",
    stageId: "r1_s1_fixed",
    flowContext: "run_stage",
    nodeType: "stage",
    routeDifficulty: "normal",
    objectiveType: "eliminate_all",
    battleControlState: "battle_result",
    resultState,
    turnCount: 4,
    crystalReward: 20,
    playerUnits: [
      createUnit({
        id: "guard",
        name: "Guard",
        startHP: 25,
        currentHP: 13,
        maxHP: 25
      }),
      createUnit({
        id: "archer",
        name: "Archer",
        startHP: 18,
        currentHP:
          resultState === "defeat" ? 0 : 18,
        maxHP: 18
      })
    ],
    enemyUnits: [
      { battleUnitId: "enemy_1", currentHP: 0 },
      { battleUnitId: "enemy_2", currentHP: 0 }
    ]
  };
}

test("captures stable victory metrics and party HP delta", () => {
  const snapshot = createBattleResultSnapshot(
    createRunBattleResultState()
  );

  assert.deepEqual(snapshot.stage, {
    id: "r1_s1_fixed",
    name: "Stage 1 - Lumberyard",
    nodeType: "stage",
    routeDifficulty: "normal",
    objectiveType: "eliminate_all"
  });

  assert.deepEqual(snapshot.metrics, {
    totalTurns: 4,
    enemyDefeated: 2,
    enemyTotal: 2,
    partySurvived: 2,
    partyTotal: 2,
    crystalGained: 20
  });

  assert.deepEqual(snapshot.party[0], {
    battleUnitId: "player_guard_1",
    unitDefId: "guard",
    name: "Guard",
    stageStartHP: 25,
    currentHP: 13,
    maxHP: 25,
    hpLost: 12,
    status: "survived"
  });
});

test("defeat grants no Crystal and records defeated units", () => {
  const snapshot = createBattleResultSnapshot(
    createRunBattleResultState("defeat")
  );

  assert.equal(snapshot.metrics.crystalGained, 0);
  assert.equal(snapshot.metrics.partySurvived, 1);
  assert.equal(snapshot.party[1].status, "defeated");
  assert.equal(snapshot.party[1].hpLost, 18);
});

test("tutorial result uses tutorial node type and no Crystal", () => {
  const state = {
    ...createRunBattleResultState(),
    stageId: "tutorial_stage",
    encounterName: "Tutorial Courtyard",
    flowContext: "tutorial",
    nodeType: undefined
  };

  const snapshot =
    createBattleResultSnapshot(state);

  assert.equal(snapshot.stage.nodeType, "tutorial");
  assert.equal(snapshot.metrics.crystalGained, 0);
});

test("rejects ongoing or incomplete battle state", () => {
  assert.equal(
    createBattleResultSnapshot({
      battleControlState: "unit_selected_movement",
      resultState: "ongoing"
    }),
    null
  );
});

test("matches a snapshot only to its run node and result", () => {
  const snapshot = createBattleResultSnapshot(
    createRunBattleResultState()
  );

  assert.equal(
    isMatchingRunBattleResult(
      snapshot,
      "r1_s1_fixed",
      "victory"
    ),
    true
  );

  assert.equal(
    isMatchingRunBattleResult(
      snapshot,
      "another_node",
      "victory"
    ),
    false
  );
});

test("victory reward persists an isolated result snapshot", () => {
  const initialRunState =
    createInitialRunState();

  const currentRunState =
    markRunNodeCurrent(
      initialRunState,
      "r1_s1_fixed"
    );

  const snapshot = createBattleResultSnapshot(
    createRunBattleResultState()
  );

  const rewardedRunState =
    prepareRunStageVictoryReward(
      currentRunState,
      "r1_s1_fixed",
      snapshot
    );

  snapshot.party[0].currentHP = 1;

  assert.equal(
    rewardedRunState
      .lastBattleResult
      .party[0]
      .currentHP,
    13
  );
  assert.equal(rewardedRunState.runCrystal, 20);
});

test("defeat persists the matching result without granting stage Crystal", () => {
  const initialRunState =
    createInitialRunState();

  const currentRunState =
    markRunNodeCurrent(
      initialRunState,
      "r1_s1_fixed"
    );

  const snapshot = createBattleResultSnapshot(
    createRunBattleResultState("defeat")
  );

  const defeatedRunState =
    markRunDefeated(
      currentRunState,
      "r1_s1_fixed",
      snapshot
    );

  assert.equal(
    defeatedRunState.lastBattleResult.result,
    "defeat"
  );
  assert.equal(defeatedRunState.runCrystal, 0);
  assert.equal(defeatedRunState.runStatus, "defeated");
});
