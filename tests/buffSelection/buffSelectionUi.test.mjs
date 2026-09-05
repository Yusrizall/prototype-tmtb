import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  renderMapSelectionScreen,
  renderRewardSelectionScreen
} from "../../src/ui/flow/basicFlowScreens.js";
import {
  createInitialRunState,
  markRunNodeCurrent,
  prepareRunStageVictoryReward
} from "../../src/logic/run/runState.js";

function createPreparedRun() {
  const initial = createInitialRunState();
  const current = markRunNodeCurrent(initial, initial.selectedNodeId);
  return prepareRunStageVictoryReward(current, current.currentNodeId);
}

test("Buff Selection renders two complete cards without visible rarity labels", () => {
  const html = renderRewardSelectionScreen(createPreparedRun());

  assert.match(html, /MAKE YOUR CHOICE/);
  assert.equal((html.match(/data-action="toggle-buff-choice"/g) ?? []).length, 2);
  assert.match(html, /CONFIRM CHOICE/);
  assert.doesNotMatch(html, />COMMON</);
  assert.doesNotMatch(html, />RARE</);
  assert.doesNotMatch(html, />EPIC</);
});

test("selection, warning, and collection animation states render explicitly", () => {
  const runState = createPreparedRun();
  const buffId = runState.pendingRewardOptions[0].buffId;
  const selectedHtml = renderRewardSelectionScreen(runState, { selectedBuffId: buffId });
  const warningHtml = renderRewardSelectionScreen(runState, { warningArmed: true });
  const confirmingHtml = renderRewardSelectionScreen(runState, { selectedBuffId: buffId, confirming: true });

  assert.match(selectedHtml, /buff-choice-selected/);
  assert.match(selectedHtml, /aria-pressed="true"/);
  assert.match(warningHtml, /buff-skip-warning-visible/);
  assert.match(warningHtml, /No buff selected\. Are you sure\?/);
  assert.match(confirmingHtml, /buff-choice-confirming/);
  assert.match(confirmingHtml, /ADDING BUFF/);
});

test("Active Buff List uses a fixed five-by-two slot model on selection and map screens", () => {
  const runState = createPreparedRun();
  runState.activeRunBuffs = [runState.pendingRewardOptions[0]];
  const selectionHtml = renderRewardSelectionScreen(runState, { activeBuffListOpen: true });
  const mapHtml = renderMapSelectionScreen({ tutorialCompleted: true, metaCrystal: 0 }, runState, true);

  assert.equal((selectionHtml.match(/active-buff-slot/g) ?? []).length, 10);
  assert.equal((mapHtml.match(/active-buff-slot/g) ?? []).length, 10);
  assert.match(selectionHtml, /active-buff-access-open/);
  assert.match(mapHtml, /active-buff-access-open/);
});

test("runtime owns two-press skip, delayed collection, next-battle effects, and tutorial overview routing", async () => {
  const mainSource = await readFile(new URL("../../src/main.js", import.meta.url), "utf8");

  assert.match(mainSource, /warningArmed:[\s\S]*confirmPendingBuffChoice/);
  assert.match(mainSource, /completePendingBuffChoice\(null\)/);
  assert.match(mainSource, /setTimeout\(\(\) => \{[\s\S]*completePendingBuffChoice/);
  assert.match(mainSource, /applyActiveRunBuffsToBattleState/);
  assert.match(mainSource, /markTutorialCompleted[\s\S]*openRunOverview\(\)/);
});
