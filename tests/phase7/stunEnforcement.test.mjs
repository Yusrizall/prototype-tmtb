import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhaseJumpState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { applyUnitStatus } from "../../src/logic/battle/statusLogic.js";
import { getReachableTilesForUnit } from "../../src/logic/battle/movementLogic.js";
import { getValidPlayerBasicAttackTargets } from "../../src/logic/battle/playerAttackTargetLogic.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};

test("systemic Stun removes movement tiles",()=>{
 let s=createTutorialPhaseJumpState(data,7);
 const g=s.playerUnits.find(u=>u.unitDefId==="guard");
 s=applyUnitStatus(s,g.battleUnitId,{statusId:"stun",remainingPlayerTurns:2});
 const next=s.playerUnits.find(u=>u.unitDefId==="guard");
 assert.deepEqual(getReachableTilesForUnit(data.tutorialMap,s,next),[]);
});

test("systemic Stun removes Player Basic Attack targets",()=>{
 let s=createTutorialPhaseJumpState(data,7);
 const a=s.playerUnits.find(u=>u.unitDefId==="archer");
 s={...s,selectedUnitId:a.battleUnitId};
 assert.equal(getValidPlayerBasicAttackTargets(data.tutorialMap,s).length>0,true);
 s=applyUnitStatus(s,a.battleUnitId,{statusId:"stun",remainingPlayerTurns:2});
 assert.deepEqual(getValidPlayerBasicAttackTargets(data.tutorialMap,s),[]);
});
