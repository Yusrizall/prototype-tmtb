import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhase7RetryCheckpointState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { captureTutorialCheckpoint, restoreTutorialCheckpoint } from "../../src/logic/tutorial/tutorialCheckpointLogic.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};

test("CP7 deep snapshot preserves actual carried HP/AP/StartGrid without normalization",()=>{
 let s=createTutorialPhase7RetryCheckpointState(data);
 s={...s,teamApCurrent:1,playerUnits:s.playerUnits.map(u=>u.unitDefId==="guard"?{...u,currentHP:7,startGrid:{x:11,y:4}}:u)};
 const cp=captureTutorialCheckpoint("cp7",s);
 const restored=restoreTutorialCheckpoint(cp);
 const guard=restored.playerUnits.find(u=>u.unitDefId==="guard");
 assert.equal(restored.teamApCurrent,1);
 assert.equal(guard.currentHP,7);
 assert.deepEqual(guard.startGrid,{x:11,y:4});
 s.playerUnits[0].currentHP=1;
 assert.equal(guard.currentHP,7);
});
