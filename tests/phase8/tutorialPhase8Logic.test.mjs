import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhaseJumpState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import {
  PHASE_8_FREE_PLAY_PROMPT,
  advanceTutorialPhase8Brief,
  recordTutorialPhase8PlayerEndTurn,
  recordTutorialPhase8PlayerTurnStart,
  refreshTutorialPhase8Completion,
  isTutorialPhase8InputAllowed
} from "../../src/logic/tutorial/tutorialPhase8Logic.js";
import { spawnTelegraphedWaves } from "../../src/logic/battle/waveLogic.js";
import { evaluateEliminateAllObjective } from "../../src/logic/battle/objectiveLogic.js";
import { isTutorialStageVictoryReady } from "../../src/logic/tutorial/tutorialFlow.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};
const w=(s,id)=>s.waveState.waves.find(x=>x.waveId===id);

function nextPlayerTurn(enemyState){
  const living=enemyState.playerUnits.filter(u=>u.currentHP>0);
  return {
    ...enemyState,
    phase:"player_phase",
    turnCount:enemyState.turnCount+1,
    teamApCurrent:living.length*2,
    teamApCapacity:living.length*2,
    battleControlState:"unit_selected_movement",
    selectedUnitId:living[0]?.battleUnitId??null,
    playerUnits:enemyState.playerUnits.map(u=>u.currentHP>0?{...u,startGrid:{x:u.tileX,y:u.tileY},originTile:{x:u.tileX,y:u.tileY},movementApCommitted:false,movementLocked:false,turnState:"ready",hasActed:false}:u)
  };
}

function startPlayerTurn(previousEnemyState){
  return recordTutorialPhase8PlayerTurnStart(data,previousEnemyState,nextPlayerTurn(previousEnemyState));
}

function advanceToFreePlay(){
  let s=createTutorialPhaseJumpState(data,8);
  for(let i=0;i<3;i+=1)s=advanceTutorialPhase8Brief(s);
  s=recordTutorialPhase8PlayerEndTurn(s,{...s,phase:"enemy_phase"});
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  return startPlayerTurn(s);
}

function advanceToWave3Telegraph(){
  let s=advanceToFreePlay();
  const player=s;
  s=recordTutorialPhase8PlayerEndTurn(player,{...player,phase:"enemy_phase"});
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  return startPlayerTurn(s);
}

test("Phase 8 Wave 1 brief teaches Telegraph, reservation, preparation, then releases full input",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  assert.equal(s.tutorialState.taskId,"explain_wave_telegraph");
  assert.equal(isTutorialPhase8InputAllowed(s,"end_turn"),false);
  s=advanceTutorialPhase8Brief(s);
  assert.equal(s.tutorialState.prompt,"You can move through the marked area, but you cannot end your movement there.");
  s=advanceTutorialPhase8Brief(s);
  assert.equal(s.tutorialState.prompt,"You have this Player Turn to prepare.");
  s=advanceTutorialPhase8Brief(s);
  assert.equal(s.tutorialState.taskId,"prepare_for_wave_1");
  assert.equal(s.tutorialState.prompt,"Prepare for the incoming Sword.");
  for(const input of ["movement_keyboard","switch_unit","open_action_menu","confirm_action","back_action","end_turn"]){
    assert.equal(isTutorialPhase8InputAllowed(s,input),true);
  }
});

test("Wave 1 spawn leads to Wave 2 Telegraph, persistent high-level prompt, and final Objective",()=>{
  const s=advanceToFreePlay();
  assert.equal(w(s,"phase8_wave_1_sword").status,"spawned");
  assert.equal(w(s,"phase8_wave_2_spear").status,"telegraphed");
  assert.equal(w(s,"phase8_wave_3_sword_a").status,"scheduled");
  assert.equal(w(s,"phase8_wave_3_sword_b").status,"scheduled");
  assert.equal(s.tutorialState.taskId,"phase_8_free_play");
  assert.equal(s.tutorialState.prompt,PHASE_8_FREE_PLAY_PROMPT);
  assert.equal(s.objectiveState.label,"ELIMINATE ALL REMAINING THREATS");
  assert.equal(s.tutorialState.evidence.phase8GuidanceReleased,true);
});

test("Wave 2 spawn immediately opens two-Sword Wave 3 Telegraph on preferred split pair",()=>{
  const s=advanceToWave3Telegraph();
  assert.equal(w(s,"phase8_wave_2_spear").status,"spawned");
  assert.equal(w(s,"phase8_wave_3_sword_a").status,"telegraphed");
  assert.equal(w(s,"phase8_wave_3_sword_b").status,"telegraphed");
  assert.deepEqual(w(s,"phase8_wave_3_sword_a").spawnPosition,{x:9,y:1});
  assert.deepEqual(w(s,"phase8_wave_3_sword_b").spawnPosition,{x:14,y:5});
  assert.deepEqual(s.tutorialState.evidence.phase8Wave3SelectedSpawnPair,["E8","E7"]);
  assert.equal(s.tutorialState.prompt,PHASE_8_FREE_PLAY_PROMPT);
});

test("Wave 3 uses first fully available authored fallback pair when preferred pair is occupied",()=>{
  let s=advanceToFreePlay();
  const player=s;
  s=recordTutorialPhase8PlayerEndTurn(player,{...player,phase:"enemy_phase"});
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s={
    ...s,
    playerUnits:s.playerUnits.map(u=>u.unitDefId==="guard"?{...u,tileX:14,tileY:5}:u)
  };
  s=startPlayerTurn(s);
  assert.deepEqual(s.tutorialState.evidence.phase8Wave3SelectedSpawnPair,["E8","E9"]);
  assert.deepEqual(w(s,"phase8_wave_3_sword_a").spawnPosition,{x:9,y:1});
  assert.deepEqual(w(s,"phase8_wave_3_sword_b").spawnPosition,{x:15,y:4});
});

test("Wave 3 fallback selection is deterministic through the authored pair order",()=>{
  let s=advanceToFreePlay();
  const player=s;
  s=recordTutorialPhase8PlayerEndTurn(player,{...player,phase:"enemy_phase"});
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  const livingEnemies=s.enemyUnits.filter(e=>e.currentHP>0);
  const blockers=[{x:14,y:5},{x:9,y:1},{x:14,y:0}];
  s={
    ...s,
    playerUnits:s.playerUnits.map((u,index)=>index<2?{...u,tileX:blockers[index].x,tileY:blockers[index].y}:u),
    enemyUnits:s.enemyUnits.map((e)=>{
      if(e.battleUnitId!==livingEnemies[0]?.battleUnitId)return e;
      return {...e,tileX:blockers[2].x,tileY:blockers[2].y};
    })
  };
  s=startPlayerTurn(s);
  assert.deepEqual(s.tutorialState.evidence.phase8Wave3SelectedSpawnPair,["E12","E13"]);
  assert.deepEqual(w(s,"phase8_wave_3_sword_a").spawnPosition,{x:15,y:1});
  assert.deepEqual(w(s,"phase8_wave_3_sword_b").spawnPosition,{x:10,y:5});
});

test("Wave 3 uses Safe lifecycle for both Swords and creates no further Wave",()=>{
  let s=advanceToWave3Telegraph();
  const player=s;
  s=recordTutorialPhase8PlayerEndTurn(player,{...player,phase:"enemy_phase"});
  assert.equal(s.tutorialState.taskId,"phase8_wave3_enemy_checkpoint");
  const spawn=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s);
  assert.equal(spawn.spawnEvents.length,2);
  s=spawn.battleState;
  s=startPlayerTurn(s);
  assert.equal(s.tutorialState.taskId,"phase_8_free_play");
  assert.equal(w(s,"phase8_wave_3_sword_a").status,"spawned");
  assert.equal(w(s,"phase8_wave_3_sword_b").status,"spawned");
  assert.equal(s.waveState.waves.length,4);
  assert.equal(s.tutorialState.evidence.phase8Wave3Spawned,true);
  assert.equal(s.tutorialState.prompt,PHASE_8_FREE_PLAY_PROMPT);
});

test("empty board while a required Wave is pending does not complete Tutorial",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  s={...s,enemyUnits:s.enemyUnits.map(e=>({...e,currentHP:0}))};
  s=refreshTutorialPhase8Completion(s);
  assert.equal(s.tutorialState.status,"active");
  assert.equal(s.tutorialState.evidence.phase8Complete,false);
});

test("board-empty eliminate_all is still blocked while a required Wave is pending",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  s={...s,enemyUnits:s.enemyUnits.map(e=>({...e,currentHP:0}))};
  const objective=evaluateEliminateAllObjective(s);
  assert.equal(objective.resultState,"victory");
  assert.equal(isTutorialStageVictoryReady(s),false);
  s=refreshTutorialPhase8Completion(s);
  assert.equal(isTutorialStageVictoryReady(s),false);
});

test("Tutorial completes only when all four required spawn entries are RESOLVED and no hostile remains",()=>{
  let s=advanceToWave3Telegraph();
  s=recordTutorialPhase8PlayerEndTurn(s,{...s,phase:"enemy_phase"});
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s={...s,enemyUnits:s.enemyUnits.map(e=>({...e,currentHP:0}))};
  s=refreshTutorialPhase8Completion(s);
  assert.equal(w(s,"phase8_wave_1_sword").status,"resolved");
  assert.equal(w(s,"phase8_wave_2_spear").status,"resolved");
  assert.equal(w(s,"phase8_wave_3_sword_a").status,"resolved");
  assert.equal(w(s,"phase8_wave_3_sword_b").status,"resolved");
  assert.equal(s.tutorialState.status,"complete");
  assert.equal(s.tutorialState.evidence.phase8Complete,true);
});

test("first real single casualty explains AP consequence while free-play prompt stays visible",()=>{
  let previous=advanceToFreePlay();
  const next={...previous,teamApCurrent:2,teamApCapacity:2,playerUnits:previous.playerUnits.map(u=>u.unitDefId==="guard"?{...u,currentHP:0}:u)};
  const result=recordTutorialPhase8PlayerTurnStart(data,previous,next);
  assert.equal(result.tutorialState.prompt,PHASE_8_FREE_PLAY_PROMPT);
  assert.equal(result.feedbackMessage.includes("Guard has fallen."),true);
  assert.equal(result.feedbackMessage.includes("Team AP: 2"),true);
  assert.equal(result.tutorialState.evidence.phase8SingleCasualtyExplained,true);
});
