import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhaseJumpState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { captureTutorialCheckpoint, restoreTutorialCheckpoint } from "../../src/logic/tutorial/tutorialCheckpointLogic.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};

test("CP8 snapshot preserves live Blue/Wave/AP tactical state without heal or normalization",()=>{
  const s=createTutorialPhaseJumpState(data,8);
  const cp=captureTutorialCheckpoint("cp8",s);
  const restored=restoreTutorialCheckpoint(cp);
  assert.equal(cp.checkpointId,"cp8");
  assert.deepEqual(restored,s);
  restored.playerUnits[0].currentHP=1;
  assert.equal(s.playerUnits[0].currentHP,10);
});
