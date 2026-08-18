import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderBattleHud } from "../../src/ui/battle/battleHud.js";
import { createTutorialPhaseJumpState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const readJson = (relativePath) => JSON.parse(
  fs.readFileSync(path.join(root, relativePath), "utf8")
);
const data = {
  playerUnits: readJson("public/data/units/player_units.json"),
  enemyUnits: readJson("public/data/units/enemy_units.json"),
  structureDefinitions: readJson("public/data/structures/structure_definitions.json"),
  tutorialMap: readJson("public/data/maps/tutorial_offset_courtyard.json"),
  tutorialEncounter: readJson("public/data/encounters/tutorial_phase_1_5.json"),
  stage1Map: readJson("public/data/maps/tutorial_offset_courtyard.json")
};

function render(uiState) {
  return renderBattleHud(
    data,
    createTutorialPhaseJumpState(data, 3),
    [],
    [],
    [],
    uiState
  );
}

test("Phase Jump popup is absent when debug state is closed", () => {
  const html = render({ open: false, phaseInput: "3", errorMessage: null });
  assert.equal(html.includes("data-tutorial-phase-jump-overlay"), false);
});

test("Phase Jump popup renders PROTOTYPE ONLY controls for phases 1-8", () => {
  const html = render({ open: true, phaseInput: "6", errorMessage: null });
  assert.equal(html.includes("data-tutorial-phase-jump-overlay"), true);
  assert.equal(html.includes("PROTOTYPE ONLY - NON UNITY"), true);
  assert.equal(html.includes("Skip to tutorial phase:"), true);
  assert.equal(html.includes("Available phases: 1–8"), true);
  assert.equal(html.includes('value="6"'), true);
  assert.equal(html.includes("data-tutorial-phase-jump-go"), true);
  assert.equal(html.includes("data-tutorial-phase-jump-cancel"), true);
  assert.equal(html.includes(">GO<"), true);
  assert.equal(html.includes(">CANCEL<"), true);
});

test("Phase Jump popup renders inline validation error", () => {
  const html = render({
    open: true,
    phaseInput: "9",
    errorMessage: "Available tutorial phases: 1–8."
  });
  assert.equal(html.includes("Available tutorial phases: 1–8."), true);
  assert.equal(html.includes("tutorial-phase-jump-error"), true);
});
