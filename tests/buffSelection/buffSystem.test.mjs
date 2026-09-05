import test from "node:test";
import assert from "node:assert/strict";

import {
  applyActiveRunBuffsToBattleState,
  generateBuffOffers,
  rollBuffRarity
} from "../../src/logic/run/buffSystem.js";
import {
  chooseRunReward,
  createInitialRunState,
  markRunNodeCurrent,
  prepareRunStageVictoryReward
} from "../../src/logic/run/runState.js";

test("rarity rolls use node-type weights at their boundaries", () => {
  assert.equal(rollBuffRarity("stage", () => 0.69), "common");
  assert.equal(rollBuffRarity("stage", () => 0.70), "rare");
  assert.equal(rollBuffRarity("stage", () => 0.90), "epic");
  assert.equal(rollBuffRarity("mini_boss", () => 0.19), "common");
  assert.equal(rollBuffRarity("mini_boss", () => 0.20), "rare");
  assert.equal(rollBuffRarity("mini_boss", () => 0.70), "epic");
});

test("two offer slots roll independently and never duplicate the same buff", () => {
  const values = [0.05, 0, 0.75, 0];
  const offers = generateBuffOffers({
    nodeType: "stage",
    random: () => values.shift(),
    offerCount: 2
  });

  assert.equal(offers.length, 2);
  assert.equal(offers[0].rarity, "common");
  assert.equal(offers[1].rarity, "rare");
  assert.notEqual(offers[0].buffId, offers[1].buffId);
});

test("confirming a buff adds it to the run and removes it from the pool", () => {
  const initial = createInitialRunState();
  const current = markRunNodeCurrent(initial, initial.selectedNodeId);
  const prepared = prepareRunStageVictoryReward(current, current.currentNodeId);
  const selected = prepared.pendingRewardOptions[0];
  const resolved = chooseRunReward(prepared, selected.buffId);

  assert.equal(resolved.activeRunBuffs.at(-1).buffId, selected.buffId);
  assert.equal(resolved.availableBuffIds.includes(selected.buffId), false);
  assert.equal(resolved.pendingRewardOptions.length, 0);
  assert.equal(resolved.currentNodeId, null);
});

test("confirming no buff skips cleanly without removing anything from the pool", () => {
  const initial = createInitialRunState();
  const current = markRunNodeCurrent(initial, initial.selectedNodeId);
  const prepared = prepareRunStageVictoryReward(current, current.currentNodeId);
  const resolved = chooseRunReward(prepared, null);

  assert.deepEqual(resolved.activeRunBuffs, []);
  assert.deepEqual(resolved.availableBuffIds, prepared.availableBuffIds);
  assert.equal(resolved.pendingRewardOptions.length, 0);
  assert.equal(resolved.currentNodeId, null);
});

test("active stat and AP buffs modify the next battle state", () => {
  const battleState = {
    teamApCapacity: 2,
    teamApCurrent: 2,
    playerUnits: [
      {
        unitDefId: "guard",
        maxHP: 25,
        currentHP: 25,
        stageStartHP: 25,
        derivedStats: { maxHP: 25, atk: 5, def: 4, move: 3, atr: 1.5 }
      },
      {
        unitDefId: "archer",
        maxHP: 18,
        currentHP: 18,
        stageStartHP: 18,
        derivedStats: { maxHP: 18, atk: 7, def: 1, move: 4, atr: 3 }
      }
    ]
  };
  const activeBuffs = [
    {
      buffId: "test_party_hp",
      effects: [{ type: "stat_modifier", target: "party", stat: "maxHP", amount: 3 }]
    },
    {
      buffId: "test_ap",
      effects: [{ type: "team_ap_modifier", amount: 1 }]
    }
  ];
  const result = applyActiveRunBuffsToBattleState(battleState, activeBuffs);

  assert.equal(result.playerUnits[0].maxHP, 28);
  assert.equal(result.playerUnits[1].maxHP, 21);
  assert.equal(result.teamApCapacity, 3);
  assert.equal(result.teamApCurrent, 3);
  assert.deepEqual(result.appliedRunBuffIds, ["test_party_hp", "test_ap"]);
});
