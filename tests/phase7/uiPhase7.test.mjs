import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhaseJumpState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { applyUnitStatus } from "../../src/logic/battle/statusLogic.js";
import { renderBattleHud } from "../../src/ui/battle/battleHud.js";
import { renderMapGrid } from "../../src/ui/mapRenderer.js";
import { resolveEnemyCurrentIntent } from "../../src/logic/battle/enemyIntentLogic.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};

test("Phase 7 HUD shows STUN duration and Blue STATE / INTENT grammar",()=>{
 let s=createTutorialPhaseJumpState(data,7);
 const guard=s.playerUnits.find(u=>u.unitDefId==="guard");
 s=applyUnitStatus(s,guard.battleUnitId,{statusId:"stun",remainingPlayerTurns:2});
 const html=renderBattleHud({ stage1Map: data.tutorialMap },s,[],[],[],null);
 assert.equal(html.includes("STUN 2"),true);
 assert.equal(html.includes("STATE CHARGE 1/2"),true);
 assert.equal(html.includes("INTENT CHARGE 2/2"),true);
});

test("Shockwave threat overlay appears only when Blue Current Intent is SHOCKWAVE",()=>{
 let s=createTutorialPhaseJumpState(data,7);
 let html=renderMapGrid(data.tutorialMap,s,[],[],[]);
 assert.equal(html.includes("tile-shockwave-threat"),false);
 const id=s.tutorialState.phase7Entities.blueEnemyId;
 s={...s,enemyUnits:s.enemyUnits.map(e=>e.battleUnitId===id?{...e,patternState:{...e.patternState,chargeProgress:2}}:e)};
 s=resolveEnemyCurrentIntent(s,id).battleState;
 html=renderMapGrid(data.tutorialMap,s,[],[],[]);
 assert.equal(html.includes("tile-shockwave-threat"),true);
});

test("HUD Phase Jump overlay exposes phases 1-7",()=>{
 const s=createTutorialPhaseJumpState(data,7);
 const html=renderBattleHud({ stage1Map: data.tutorialMap },s,[],[],[],{open:true,phaseInput:"7",errorMessage:null});
 assert.equal(html.includes("Available phases: 1–7"),true);
 assert.equal(html.includes('max="7"'),true);
});

import { getBattleCameraFocusKey } from "../../src/ui/battle/battleCameraLogic.js";

test("Jump 7 camera focus resolves to Tutorial Region C",()=>{
 const s=createTutorialPhaseJumpState(data,7);
 assert.equal(getBattleCameraFocusKey(s),"tutorial:C");
});

test("HUD unlocks End Turn on an authored Phase 7 End Turn beat",()=>{
 let s=createTutorialPhaseJumpState(data,7);
 s={...s,tutorialState:{...s.tutorialState,taskId:"end_turn_for_second_charge",prompt:"End your turn."}};
 const html=renderBattleHud({stage1Map:data.tutorialMap},s,[],[],[],null);
 const marker='data-action="end-player-turn"';
 const markerIndex=html.indexOf(marker);
 assert.notEqual(markerIndex,-1);
 const buttonStart=html.lastIndexOf("<button",markerIndex);
 const buttonEnd=html.indexOf(">",markerIndex);
 const buttonOpenTag=html.slice(buttonStart,buttonEnd+1);
 assert.equal(buttonOpenTag.includes("disabled"),false);
});

test("inactive Blue does not expose fake Intent during the Phase 7 retry/staging state",()=>{
 const s=createTutorialPhaseJumpState(data,7);
 const blueId=s.tutorialState.phase7Entities.blueEnemyId;
 const staged={
   ...s,
   tutorialState:{...s.tutorialState,taskId:"end_turn_to_begin_phase7",prompt:"End your turn to begin the exercise."},
   enemyUnits:s.enemyUnits.map(enemy=>enemy.battleUnitId===blueId
     ? {...enemy,patternState:{...enemy.patternState,active:false,chargeProgress:0},currentIntent:null,currentTarget:null}
     : enemy),
 };
 const html=renderBattleHud({stage1Map:data.tutorialMap},staged,[],[],[],null);
 assert.equal(html.includes("INTENT NONE"),false);
});
