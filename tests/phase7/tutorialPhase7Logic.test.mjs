import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  createTutorialPhase7RetryCheckpointState
} from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import {
  initializeTutorialPhase7Content,
  recordTutorialPhase7PlayerEndTurn,
  prepareTutorialPhase7EnemyActivation,
  recordTutorialPhase7EnemyActivation,
  recordTutorialPhase7PlayerTurnStart,
  advanceTutorialPhase7Brief,
  recordTutorialPhase7PlayerMovement,
  recordTutorialPhase7UnitSelection,
  recordTutorialPhase7PlayerAttack,
  isTutorialPhase7InputAllowed,
  shouldPauseTutorialPhase7EnemyResolution,
  getTutorialRequiredActorFailure
} from "../../src/logic/tutorial/tutorialPhase7Logic.js";
import { isTutorialInputAllowed } from "../../src/logic/tutorial/tutorialFlow.js";
import { createTutorialPhaseJumpState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { resolveBlueShockwaveActivation } from "../../src/logic/battle/blueShockwaveLogic.js";
import { resolveEnemyCurrentIntent } from "../../src/logic/battle/enemyIntentLogic.js";
import { tickPlayerTurnStatuses } from "../../src/logic/battle/statusLogic.js";
import { getValidPlayerBasicAttackTargets } from "../../src/logic/battle/playerAttackTargetLogic.js";
import { resolveBasicAttack } from "../../src/logic/battle/damageLogic.js";

const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};
const unit=(s,id)=>s.playerUnits.find(u=>u.unitDefId===id);
const blue=s=>s.enemyUnits.find(e=>e.unitDefId==="blue_charger_candidate");

function enterEnemy(state) {
  const ticked=tickPlayerTurnStatuses(state);
  return recordTutorialPhase7PlayerEndTurn(state,{...ticked,phase:"enemy_phase"});
}

function resolveBlue(state) {
  const prepared=prepareTutorialPhase7EnemyActivation(state);
  const id=prepared.tutorialState.phase7Entities.blueEnemyId;
  const r=resolveBlueShockwaveActivation(data.tutorialMap,prepared,id);
  let next=resolveEnemyCurrentIntent(r.battleState,id).battleState;
  next=recordTutorialPhase7EnemyActivation(prepared,next,r.event);
  return next;
}

function startPlayer(previousEnemyState) {
  let next={
    ...previousEnemyState,
    phase:"player_phase",
    turnCount:previousEnemyState.turnCount+1,
    teamApCurrent:4,
    teamApCapacity:4,
    selectedUnitId:unit(previousEnemyState,"guard").battleUnitId,
    battleControlState:"unit_selected_movement",
    playerUnits:previousEnemyState.playerUnits.map(u=>u.currentHP>0?{
      ...u,
      originTile:{x:u.tileX,y:u.tileY},
      startGrid:{x:u.tileX,y:u.tileY},
      movementApCommitted:false,
      movementLocked:false,
      turnState:"ready",
      hasActed:false
    }:u)
  };
  const id=next.tutorialState.phase7Entities.blueEnemyId;
  next=resolveEnemyCurrentIntent(next,id).battleState;
  return recordTutorialPhase7PlayerTurnStart(previousEnemyState,next);
}

test("Phase 7 first Charge teaches Charge as an Intent with buildup, delayed payoff, and next-Intent timing",()=>{
 let s=createTutorialPhase7RetryCheckpointState(data);
 s=resolveBlue(enterEnemy(s));
 s=startPlayer(s);
 assert.equal(s.tutorialState.taskId,"introduce_blue_charge");
 assert.equal(s.tutorialState.prompt,"CHARGE is an enemy Intent that builds over multiple Enemy Turns.");
 assert.equal(blue(s).currentIntent.stateLabel,"CHARGE 1/2");
 assert.equal(blue(s).currentIntent.intentLabel,"CHARGE 2/2");
 assert.equal(s.teamApCurrent,4);

 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_charge_progress");
 assert.equal(s.tutorialState.prompt,"The number shows its progress toward completion.");
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_charge_delayed_payoff");
 assert.equal(s.tutorialState.prompt,"Charge does not resolve its payoff immediately.");
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_charge_preparation_window");
 assert.equal(s.tutorialState.prompt,"Charge gives you time to prepare before its payoff.");
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_charge_next_intent");
 assert.equal(s.tutorialState.prompt,"When Charge finishes, the prepared action becomes the enemy's next Intent.");
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"end_turn_for_second_charge");
 assert.equal(s.tutorialState.prompt,"End your turn.");
});

test("completed Charge explains that SHOCKWAVE is now Current Intent before explaining Stun",()=>{
 let s=createTutorialPhase7RetryCheckpointState(data);
 s=resolveBlue(enterEnemy(s));
 s=startPlayer(s);
 for (let i=0;i<5;i+=1) s=advanceTutorialPhase7Brief(s);
 s=resolveBlue(enterEnemy(s));
 s=startPlayer(s);
 assert.equal(s.tutorialState.taskId,"explain_charge_complete");
 assert.equal(s.tutorialState.prompt,"CHARGE is complete.");
 assert.equal(blue(s).currentIntent.intentLabel,"SHOCKWAVE");

 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_shockwave_current_intent");
 assert.equal(s.tutorialState.prompt,"SHOCKWAVE is now the enemy's Current Intent.");
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_shockwave_stun");
 assert.equal(s.tutorialState.prompt,"Shockwave applies Stun to units inside its area.");
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"move_archer_to_safety");
});

test("STUN 2 and STUN 1 explicitly teach remaining Player-Turn duration",()=>{
 let s=createTutorialPhaseJumpState(data,7);
 const guard=unit(s,"guard");
 s={...s,tutorialState:{...s.tutorialState,taskId:"introduce_guard_stun",prompt:"Guard is Stunned."},playerUnits:s.playerUnits.map(u=>u.battleUnitId===guard.battleUnitId?{...u,statuses:[{statusId:"stun",remainingPlayerTurns:2}]}:u)};

 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_stun_duration_2");
 assert.equal(s.tutorialState.prompt,"STUN 2 means Guard will remain Stunned for 2 Player Turns.");
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_stun_shared_ap");
 assert.equal(s.tutorialState.prompt,"Stunned units cannot act, but they still contribute Team AP.");

 s={...s,tutorialState:{...s.tutorialState,taskId:"explain_stun_persistence",prompt:"Guard is still Stunned."}};
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"explain_stun_duration_1");
 assert.equal(s.tutorialState.prompt,"STUN 1 means 1 Player Turn remains.");
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"end_turn_for_recovery");
 assert.equal(s.tutorialState.prompt,"End your turn.");
});

test("Shockwave safety gate allows Q to Archer and blocks Guard movement",()=>{
 let s=createTutorialPhase7RetryCheckpointState(data);
 s={...s,tutorialState:{...s.tutorialState,phaseId:"phase_7_status_temporal_threat",taskId:"move_archer_to_safety"}};
 assert.equal(isTutorialPhase7InputAllowed(s,"switch_unit"),true);
 assert.equal(isTutorialPhase7InputAllowed(s,"movement_keyboard"),false);
 s={...s,selectedUnitId:unit(s,"archer").battleUnitId};
 assert.equal(isTutorialPhase7InputAllowed(s,"movement_keyboard"),true);
});

test("Phase 7 enemy resolution only runs on authored activation checkpoint tasks",()=>{
 let s=createTutorialPhase7RetryCheckpointState(data);
 s={...s,phase:"enemy_phase",tutorialState:{...s.tutorialState,phaseId:"phase_7_status_temporal_threat",taskId:"introduce_blue_charge"}};
 assert.equal(shouldPauseTutorialPhase7EnemyResolution(s),true);
 s={...s,tutorialState:{...s.tutorialState,taskId:"phase7_second_charge_checkpoint"}};
 assert.equal(shouldPauseTutorialPhase7EnemyResolution(s),false);
});

test("required actors remain required until Phase 7 completion",()=>{
 let s=createTutorialPhase7RetryCheckpointState(data);
 s={...s,playerUnits:s.playerUnits.map(u=>u.unitDefId==="guard"?{...u,currentHP:0}:u)};
 assert.equal(getTutorialRequiredActorFailure(s).failed,true);
 s={...s,tutorialState:{...s.tutorialState,evidence:{...s.tutorialState.evidence,requiredTwoUnitCurriculumComplete:true}}};
 assert.equal(getTutorialRequiredActorFailure(s).failed,false);
});

test("integrated Phase 7 resolves Charge → Shockwave → STUN2 → STUN1 → recovery → hold",()=>{
 let s=createTutorialPhase7RetryCheckpointState(data);
 // Charge 1
 s=resolveBlue(enterEnemy(s));
 s=startPlayer(s);
 for (let i=0;i<5;i+=1) s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"end_turn_for_second_charge");
 // Charge 2
 s=resolveBlue(enterEnemy(s));
 s=startPlayer(s);
 assert.equal(s.tutorialState.taskId,"explain_charge_complete");
 assert.equal(blue(s).currentIntent.intentLabel,"SHOCKWAVE");
 s=advanceTutorialPhase7Brief(s);
 s=advanceTutorialPhase7Brief(s);
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"move_archer_to_safety");
 // select Archer and move safe
 s={...s,selectedUnitId:unit(s,"archer").battleUnitId,playerUnits:s.playerUnits.map(u=>u.unitDefId==="archer"?{...u,tileX:9,tileY:2}:u)};
 s=recordTutorialPhase7PlayerMovement(s,s);
 assert.equal(s.tutorialState.taskId,"preserve_guard_in_shockwave");
 s=advanceTutorialPhase7Brief(s);
 // Shockwave
 s=resolveBlue(enterEnemy(s));
 s=startPlayer(s);
 assert.equal(unit(s,"guard").statuses[0].remainingPlayerTurns,2);
 assert.equal(unit(s,"archer").statuses.length,0);
 assert.equal(s.teamApCurrent,4);
 assert.equal(s.tutorialState.taskId,"introduce_guard_stun");
 s=advanceTutorialPhase7Brief(s);
 s=advanceTutorialPhase7Brief(s);
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"switch_to_archer_for_stun_adaptation");
 // select Archer
 s={...s,selectedUnitId:unit(s,"archer").battleUnitId};
 s=recordTutorialPhase7UnitSelection(s);
 assert.equal(s.tutorialState.taskId,"attack_blue_once");
 // real attack
 const targets=getValidPlayerBasicAttackTargets(data.tutorialMap,s);
 const target=targets.find(t=>t.targetId===blue(s).battleUnitId);
 assert.ok(target);
 const r=resolveBasicAttack(s,target.targetType,target.targetId,target.pathResult);
 assert.equal(r.attackResult.finalDamage,7);
 let attacked={...r.battleState,teamApCurrent:3,selectedUnitId:s.selectedUnitId,tutorialState:s.tutorialState};
 attacked=recordTutorialPhase7PlayerAttack(s,attacked,r.attackResult);
 assert.equal(blue(attacked).currentHP,26);
 assert.equal(attacked.tutorialState.taskId,"end_turn_after_stun_adaptation");
 // STUN1 + next Charge1
 s=resolveBlue(enterEnemy(attacked));
 s=startPlayer(s);
 assert.equal(unit(s,"guard").statuses[0].remainingPlayerTurns,1);
 assert.equal(s.tutorialState.taskId,"explain_stun_persistence");
 s=advanceTutorialPhase7Brief(s);
 s=advanceTutorialPhase7Brief(s);
 // recover + Charge2
 s=resolveBlue(enterEnemy(s));
 s=startPlayer(s);
 assert.equal(unit(s,"guard").statuses.length,0);
 assert.equal(s.tutorialState.taskId,"explain_guard_recovery");
 assert.equal(blue(s).currentIntent.intentLabel,"SHOCKWAVE");
 assert.equal(s.tutorialState.evidence.requiredTwoUnitCurriculumComplete,true);
 s=advanceTutorialPhase7Brief(s);
 assert.equal(s.tutorialState.taskId,"phase_7_complete_hold");
 assert.equal(s.tutorialState.prompt.includes("Phase 7 complete"),true);
});


test("Phase 6 Region C travel permits End Turn and Blue initializes inactive before staging",()=>{
  let s=createTutorialPhaseJumpState(data,6);
  s={
    ...s,
    tutorialState:{
      ...s.tutorialState,
      taskId:"proceed_to_region_c",
      prompt:"Proceed to the next area.",
      activeRegionIds:["A","B","C"]
    }
  };
  s=initializeTutorialPhase7Content({enemyUnits:data.enemyUnits,tutorialMap:data.tutorialMap,tutorialEncounter:data.tutorialEncounter},s);
  const b=blue(s);
  assert.equal(isTutorialInputAllowed(s,"end_turn"),true);
  assert.equal(b.patternState.active,false);
  assert.equal(b.patternState.chargeProgress,0);
  assert.equal(b.currentIntent,null);
});

test("Phase 7 travel staging target follows selected Guard/Archer without teleporting",()=>{
  let s=createTutorialPhaseJumpState(data,6);
  s={...s,tutorialState:{...s.tutorialState,taskId:"proceed_to_region_c",prompt:"Proceed to the next area.",activeRegionIds:["A","B","C"]}};
  s=initializeTutorialPhase7Content({enemyUnits:data.enemyUnits,tutorialMap:data.tutorialMap,tutorialEncounter:data.tutorialEncounter},s);
  // Jump 6 selects Archer, so first guide is Archer staging.
  assert.deepEqual(s.tutorialState.targetTile,{x:11,y:3});
  s={...s,selectedUnitId:unit(s,"guard").battleUnitId};
  s=recordTutorialPhase7UnitSelection(s);
  assert.deepEqual(s.tutorialState.targetTile,{x:12,y:4});
});

test("real Player Basic Attack result needs no synthetic attacked=true for Phase 7 progression",()=>{
 let s=createTutorialPhaseJumpState(data,7);
 s={...s,tutorialState:{...s.tutorialState,taskId:"attack_blue_once",prompt:"Attack Blue with Archer."},selectedUnitId:unit(s,"archer").battleUnitId};
 const target=getValidPlayerBasicAttackTargets(data.tutorialMap,s).find(t=>t.targetId===blue(s).battleUnitId);
 const r=resolveBasicAttack(s,target.targetType,target.targetId,target.pathResult);
 assert.equal(Object.hasOwn(r.attackResult,"attacked"),false);
 const next=recordTutorialPhase7PlayerAttack(s,{...r.battleState,tutorialState:s.tutorialState},r.attackResult);
 assert.equal(next.tutorialState.taskId,"end_turn_after_stun_adaptation");
});
