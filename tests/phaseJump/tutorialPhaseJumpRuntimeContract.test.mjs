import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const mainSource = fs.readFileSync("src/main.js", "utf8");

test("main runtime owns a cancellable Tutorial brief timer", () => {
  assert.match(mainSource, /let tutorialBriefTimerId = null;/);
  assert.match(mainSource, /function clearTutorialBriefTimer\(\)/);
  assert.match(mainSource, /tutorialBriefTimerId\s*=\s*window\.setTimeout/);
});

test("Phase Jump input is intercepted before normal Tutorial Input Gate", () => {
  const popupHandlerIndex = mainSource.indexOf("handleTutorialPhaseJumpKeyboardInput");
  const normalGateIndex = mainSource.indexOf("isTutorialInputAllowed(\n    battleState,\n    tutorialInputType");
  assert.notEqual(popupHandlerIndex, -1);
  assert.notEqual(normalGateIndex, -1);
  assert.ok(popupHandlerIndex < normalGateIndex);
});

test("GO rebuilds state through Phase Jump logic and refreshes CP6", () => {
  assert.match(mainSource, /createTutorialPhaseJumpState\(/);
  assert.match(mainSource, /validateTutorialPhaseJumpInput\(/);
  assert.match(mainSource, /refreshEnemyReadabilityState\(/);
  assert.match(mainSource, /assertTutorialBattlefieldState\(/);
  assert.match(mainSource, /captureTutorialCheckpoint\(\s*"cp6"/);
});

test("battle renderer receives transient Phase Jump UI state", () => {
  assert.match(mainSource, /renderBattleHud\([\s\S]*tutorialPhaseJumpUiState[\s\S]*\)/);
});

test("Phase Jump popup blocks Tutorial mouse-look mutation", () => {
  const mouseHandlerStart = mainSource.indexOf("function handleTutorialMouseMove");
  const mouseGateIndex = mainSource.indexOf("isTutorialInputAllowed(\n      battleState,\n      \"mouse_look\"", mouseHandlerStart);
  const popupGuardIndex = mainSource.indexOf("tutorialPhaseJumpUiState.open", mouseHandlerStart);
  assert.notEqual(mouseHandlerStart, -1);
  assert.notEqual(mouseGateIndex, -1);
  assert.notEqual(popupGuardIndex, -1);
  assert.ok(popupGuardIndex < mouseGateIndex);
});

test("opening Phase Jump clears active camera drag transient without resetting camera translation", () => {
  const openStart = mainSource.indexOf("function openTutorialPhaseJump");
  const openEnd = mainSource.indexOf("function closeTutorialPhaseJump", openStart);
  const openSource = mainSource.slice(openStart, openEnd);
  assert.match(openSource, /battlefieldCameraDragState\s*=\s*null/);
  assert.doesNotMatch(openSource, /resetBattlefieldCameraState\(/);
});
