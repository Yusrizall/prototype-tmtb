import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  renderBattleResultOverlay
} from "../../src/ui/battle/battleHud.js";

function createResultSnapshot(
  result = "victory"
) {
  return {
    version: 1,
    result,
    flowContext: "run_stage",
    stage: {
      id: "r1_s1_fixed",
      name: "Stage 1 - Lumberyard",
      nodeType: "stage",
      routeDifficulty: "normal",
      objectiveType: "eliminate_all"
    },
    metrics: {
      totalTurns: 4,
      enemyDefeated: 2,
      enemyTotal: 2,
      partySurvived: 2,
      partyTotal: 2,
      crystalGained: 20
    },
    party: [
      {
        battleUnitId: "player_guard_1",
        unitDefId: "guard",
        name: "Guard",
        stageStartHP: 25,
        currentHP: 13,
        maxHP: 25,
        hpLost: 12,
        status: "survived"
      },
      {
        battleUnitId: "player_archer_1",
        unitDefId: "archer",
        name: "Archer",
        stageStartHP: 18,
        currentHP: 18,
        maxHP: 18,
        hpLost: 0,
        status: "survived"
      }
    ]
  };
}

function createBattleState(overrides = {}) {
  return {
    battleControlState: "battle_result",
    resultState: "victory",
    flowContext: "run_stage",
    resultPresentationReady: false,
    resultSnapshot: createResultSnapshot(),
    ...overrides
  };
}

test("normal victory renders the approved full result structure", () => {
  const html = renderBattleResultOverlay(
    createBattleState()
  );

  assert.match(html, /battle-result-card-expanded/);
  assert.match(html, />VICTORY</);
  assert.match(html, /Stage 1 - Lumberyard/);
  assert.match(html, />STAGE</);
  assert.match(html, /PARTY STATUS/);
  assert.match(html, /RUN CRYSTAL/);
  assert.match(html, /data-target="20"/);
  assert.match(html, /data-start="25"/);
  assert.match(html, /data-target="13"/);
  assert.match(html, />-12</);
});

test("normal victory locks Continue until presentation completes", () => {
  const lockedHtml = renderBattleResultOverlay(
    createBattleState()
  );

  const readyHtml = renderBattleResultOverlay(
    createBattleState({
      resultPresentationReady: true
    })
  );

  assert.match(
    lockedHtml,
    /battle-result-continue-locked/
  );
  assert.match(lockedHtml, /disabled/);
  assert.doesNotMatch(
    readyHtml,
    /battle-result-continue-locked/
  );
});

test("normal victory exposes the active run buff list", () => {
  const html = renderBattleResultOverlay(
    createBattleState(),
    {
      activeRunBuffs: [
        {
          name: "Iron Resolve",
          icon: "G",
          rarity: "common",
          description: "Guard gains +4 Max HP."
        }
      ],
      activeBuffListOpen: true
    }
  );

  assert.match(html, /ACTIVE BUFFS/);
  assert.match(html, /active-buff-access-open/);
  assert.equal(
    (html.match(/active-buff-slot/g) ?? []).length,
    10
  );
});

test("tutorial victory renders a focused ending without battle metrics", () => {
  const html = renderBattleResultOverlay(
    createBattleState({
      flowContext: "tutorial",
      resultPresentationReady: true,
      resultSnapshot: {
        ...createResultSnapshot(),
        flowContext: "tutorial"
      }
    })
  );

  assert.match(html, /TUTORIAL COMPLETE/);
  assert.match(html, /START ADVENTURE/);
  assert.doesNotMatch(html, /PARTY STATUS/);
  assert.doesNotMatch(html, /RUN CRYSTAL/);
});

test("tutorial full defeat renders immediate Retry only", () => {
  const html = renderBattleResultOverlay(
    createBattleState({
      flowContext: "tutorial",
      resultState: "defeat",
      resultPresentationReady: true
    })
  );

  assert.match(html, />DEFEAT</);
  assert.match(html, />RETRY</);
  assert.match(
    html,
    /All of your units have been defeated\./
  );
  assert.doesNotMatch(html, /PARTY STATUS/);
});

test("normal defeat has no separate Battle Result overlay", () => {
  const html = renderBattleResultOverlay(
    createBattleState({
      resultState: "defeat",
      resultSnapshot:
        createResultSnapshot("defeat")
    })
  );

  assert.equal(html, "");
});

test("runtime routes tutorial completion to Region Overview", async () => {
  const mainSource = await readFile(
    new URL("../../src/main.js", import.meta.url),
    "utf8"
  );

  assert.match(
    mainSource,
    /markTutorialCompleted[\s\S]*openRunOverview\(\)/
  );
});

test("runtime routes normal defeat directly to run settlement scene", async () => {
  const mainSource = await readFile(
    new URL("../../src/main.js", import.meta.url),
    "utf8"
  );

  assert.match(
    mainSource,
    /livingPlayerUnits\.length === 0[\s\S]*openRunStageDefeatSummary\(\)/
  );
});

test("result sequence cannot be bypassed by system motion preference", async () => {
  const [mainSource, styleSource] =
    await Promise.all([
      readFile(
        new URL("../../src/main.js", import.meta.url),
        "utf8"
      ),
      readFile(
        new URL("../../src/style.css", import.meta.url),
        "utf8"
      )
    ]);

  assert.doesNotMatch(
    mainSource,
    /prefers-reduced-motion/
  );
  assert.doesNotMatch(
    styleSource,
    /prefers-reduced-motion/
  );
  assert.match(
    mainSource,
    /BATTLE_RESULT_READY_DELAY_MS = 3200/
  );
});
