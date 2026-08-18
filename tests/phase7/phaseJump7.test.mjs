import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhaseJumpState, createTutorialPhase7RetryCheckpointState, getTutorialPhaseEntryFingerprint } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};
const unit=(s,id)=>s.playerUnits.find(u=>u.unitDefId===id);
const blue=s=>s.enemyUnits.find(e=>e.unitDefId==="blue_charger_candidate");

test("Jump 7 creates deterministic post-CHARGE-1 PVS state",()=>{
 const s=createTutorialPhaseJumpState(data,7);
 assert.equal(s.tutorialState.phaseId,"phase_7_status_temporal_threat");
 assert.equal(s.tutorialState.taskId,"introduce_blue_charge");
 assert.equal(s.teamApCurrent,4);
 assert.deepEqual([unit(s,"guard").currentHP,unit(s,"guard").tileX,unit(s,"guard").tileY],[10,12,4]);
 assert.deepEqual([unit(s,"archer").currentHP,unit(s,"archer").tileX,unit(s,"archer").tileY],[11,11,3]);
 assert.equal(blue(s).currentHP,33);
 assert.equal(blue(s).patternState.chargeProgress,1);
 assert.equal(blue(s).currentIntent.intentLabel,"CHARGE 2/2");
});

test("Jump 7 retry checkpoint is staged pre-exercise with Blue IDLE",()=>{
 const s=createTutorialPhase7RetryCheckpointState(data);
 assert.equal(s.tutorialState.taskId,"end_turn_to_begin_phase7");
 assert.equal(blue(s).patternState.active,false);
 assert.equal(blue(s).patternState.chargeProgress,0);
});

test("Phase 7 fingerprint preserves Status and Blue Pattern/readability fields",()=>{
 const s=createTutorialPhaseJumpState(data,7);
 const fp=getTutorialPhaseEntryFingerprint(s);
 const b=fp.enemyUnits.find(e=>e.unitDefId==="blue_charger_candidate");
 assert.equal(Array.isArray(fp.playerUnits[0].statuses),true);
 assert.equal(b.patternState.chargeProgress,1);
 assert.equal(b.currentIntent.stateLabel,"CHARGE 1/2");
});

test("Jump 7 Blue Pattern Intent resolves without a fake Player target",()=>{
 const s=createTutorialPhaseJumpState(data,7);
 const b=blue(s);
 assert.equal(b.currentTargetId,null);
 assert.equal(b.currentIntent.targetId,null);
 assert.equal(b.currentIntent.intentType,"blue_charge");
});
