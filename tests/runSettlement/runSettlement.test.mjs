import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  renderRunSettlementScreen
} from "../../src/ui/flow/runSettlementScreen.js";

function createSnapshot(result, stageName, enemyDefeated, turns) {
  return {
    result,
    stage: { name: stageName },
    metrics: { enemyDefeated, totalTurns: turns },
    party: [
      { name: "Guard", currentHP: 21, maxHP: 25, status: "survived" },
      { name: "Archer", currentHP: 0, maxHP: 18, status: "defeated" }
    ]
  };
}

function createRunState(result = "completed") {
  const finalSnapshot = createSnapshot(
    result === "completed" ? "victory" : "defeat",
    result === "completed" ? "Stage 4 — River Bridge Approach" : "Stage 2B — Village Housing",
    3,
    6
  );
  return {
    runStatus: result,
    runResult: result === "completed" ? "completed" : "defeat",
    crystalConversionCompleted: true,
    convertedRunCrystal: 75,
    completedNodeIds: result === "completed" ? ["stage_1", "stage_4"] : ["stage_1"],
    generatedNodes: [
      { nodeId: "stage_1", nodeType: "stage", status: "completed" },
      { nodeId: "stage_2", nodeType: "stage", status: result === "completed" ? "completed" : "failed" },
      { nodeId: "stage_4", nodeType: "mini_boss", status: result === "completed" ? "completed" : "future" }
    ],
    battleResultHistory: [
      createSnapshot("victory", "Stage 1 — Lumberyard", 2, 4),
      finalSnapshot
    ],
    lastBattleResult: finalSnapshot,
    activeRunBuffs: [
      { name: "Iron Resolve", icon: "G", rarity: "common", description: "Guard gains +4 Max HP for this run." },
      { name: "Rallying Rhythm", icon: "R", rarity: "rare", description: "Gain +1 Team AP Capacity for this run." }
    ]
  };
}

test("complete and failed runs share one settlement layout with result-specific heading", () => {
  const completeHtml = renderRunSettlementScreen(createRunState("completed"));
  const failedHtml = renderRunSettlementScreen(createRunState("defeated"));

  assert.match(completeHtml, /RUN COMPLETE/);
  assert.match(failedHtml, /RUN FAILED/);
  assert.match(completeHtml, /run-settlement-card/);
  assert.match(failedHtml, /run-settlement-card/);
  assert.match(failedHtml, /Village Housing/);
});

test("settlement aggregates run history and separates Run Crystal from Meta Crystal", () => {
  const html = renderRunSettlementScreen(createRunState());

  assert.match(html, /Enemies Defeated[\s\S]*5/);
  assert.match(html, /Total Turns[\s\S]*10/);
  assert.match(html, /RUN CRYSTAL[\s\S]*\+75/);
  assert.doesNotMatch(html, /Meta Crystal/);
  assert.doesNotMatch(html, /Shop/);
});

test("settlement presents final party condition and an always-visible buff list", () => {
  const html = renderRunSettlementScreen(createRunState());

  assert.match(html, /FINAL PARTY STATUS/);
  assert.match(html, /21 \/ 25/);
  assert.match(html, /0 \/ 18/);
  assert.match(html, /DEFEATED/);
  assert.match(html, /ACTIVE BUFFS/);
  assert.match(html, /Iron Resolve/);
  assert.match(html, /Rallying Rhythm/);
  assert.match(html, /run-settlement-main-menu/);
});

test("runtime routes settlement primary actions to Main Menu", async () => {
  const mainSource = await readFile(new URL("../../src/main.js", import.meta.url), "utf8");

  assert.match(mainSource, /run-settlement-main-menu[\s\S]*openMainMenu\(\)/);
  assert.match(mainSource, /currentScene ===[\s\S]*"run_completion"[\s\S]*openMainMenu\(\)/);
  assert.match(mainSource, /currentScene ===[\s\S]*"run_defeat"[\s\S]*openMainMenu\(\)/);
});
