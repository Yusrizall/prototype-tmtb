import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhaseJumpState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { PHASE_8_FREE_PLAY_PROMPT, advanceTutorialPhase8Brief, recordTutorialPhase8PlayerEndTurn, recordTutorialPhase8PlayerTurnStart } from "../../src/logic/tutorial/tutorialPhase8Logic.js";
import { spawnTelegraphedWaves } from "../../src/logic/battle/waveLogic.js";
import { renderBattleHud } from "../../src/ui/battle/battleHud.js";
import { renderMapGrid } from "../../src/ui/mapRenderer.js";
import { getBattleCameraFocusKey } from "../../src/ui/battle/battleCameraLogic.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json"),stage1Map:read("public/data/maps/tutorial_offset_courtyard.json")};

function nextPlayerTurn(s){return {...s,phase:"player_phase",turnCount:s.turnCount+1,teamApCurrent:s.playerUnits.filter(u=>u.currentHP>0).length*2,teamApCapacity:s.playerUnits.filter(u=>u.currentHP>0).length*2,battleControlState:"unit_selected_movement"};}
function start(s){return recordTutorialPhase8PlayerTurnStart(data,s,nextPlayerTurn(s));}
function toFreePlay(){let s=createTutorialPhaseJumpState(data,8);for(let i=0;i<3;i+=1)s=advanceTutorialPhase8Brief(s);s=recordTutorialPhase8PlayerEndTurn(s,{...s,phase:"enemy_phase"});s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;return start(s);}
function toWave3(){let s=toFreePlay();s=recordTutorialPhase8PlayerEndTurn(s,{...s,phase:"enemy_phase"});s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;return start(s);}

test("Phase 8 map renders INCOMING SWORD reservation while Blue SHOCKWAVE remains readable",()=>{
  const s=createTutorialPhaseJumpState(data,8);
  const map=renderMapGrid(data.tutorialMap,s,[],[],[]);
  const hud=renderBattleHud(data,s,[],[],[],null);
  assert.equal(map.includes("tile-wave-reserved"),true);
  assert.equal(map.includes("INCOMING SWORD"),true);
  assert.equal(hud.includes("STATE CHARGE 2/2"),true);
  assert.equal(hud.includes("INTENT SHOCKWAVE"),true);
});

test("Phase 8 End Turn is locked during explanation and enabled for preparation",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  let html=renderBattleHud(data,s,[],[],[],null);
  let marker=html.indexOf('data-action="end-player-turn"');
  let tag=html.slice(html.lastIndexOf("<button",marker),html.indexOf(">",marker)+1);
  assert.equal(tag.includes("disabled"),true);
  for(let i=0;i<3;i+=1)s=advanceTutorialPhase8Brief(s);
  html=renderBattleHud(data,s,[],[],[],null);
  marker=html.indexOf('data-action="end-player-turn"');
  tag=html.slice(html.lastIndexOf("<button",marker),html.indexOf(">",marker)+1);
  assert.equal(tag.includes("disabled"),false);
});

test("Wave 2 Telegraph keeps high-level graduation prompt with Objective plus normal combat information",()=>{
  const s=toFreePlay();
  const hud=renderBattleHud(data,s,[],[],[],null);
  const map=renderMapGrid(data.tutorialMap,s,[],[],[]);
  assert.equal(hud.includes('class="tutorial-prompt"'),true);
  assert.equal(hud.includes(PHASE_8_FREE_PLAY_PROMPT),true);
  assert.equal(hud.includes("ELIMINATE ALL REMAINING THREATS"),true);
  assert.equal(hud.includes("Enemy Intent"),true);
  assert.equal(map.includes("INCOMING SPEAR"),true);
});

test("Wave 3 shows two simultaneous INCOMING SWORD markers on split preferred positions",()=>{
  const s=toWave3();
  const map=renderMapGrid(data.tutorialMap,s,[],[],[]);
  const markers=[...map.matchAll(/INCOMING SWORD/g)];
  assert.equal(markers.length,2);
  assert.equal(s.tutorialState.prompt,PHASE_8_FREE_PLAY_PROMPT);
});

test("Phase Jump UI and camera expose Phase 8",()=>{
  const s=createTutorialPhaseJumpState(data,8);
  const hud=renderBattleHud(data,s,[],[],[],{open:true,phaseInput:"8",errorMessage:null});
  assert.equal(hud.includes("Available phases: 1–8"),true);
  assert.equal(hud.includes('max="8"'),true);
  assert.equal(getBattleCameraFocusKey(s),"tutorial:C");
});
