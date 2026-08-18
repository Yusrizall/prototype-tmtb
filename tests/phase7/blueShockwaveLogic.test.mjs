import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhase7RetryCheckpointState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { recordTutorialPhase7PlayerEndTurn, prepareTutorialPhase7EnemyActivation } from "../../src/logic/tutorial/tutorialPhase7Logic.js";
import { resolveBlueShockwaveActivation, getBlueReadableState, getBlueShockwaveThreatTiles } from "../../src/logic/battle/blueShockwaveLogic.js";
import { resolveEnemyCurrentIntent } from "../../src/logic/battle/enemyIntentLogic.js";

const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={
  playerUnits:read("public/data/units/player_units.json"),
  enemyUnits:read("public/data/units/enemy_units.json"),
  structureDefinitions:read("public/data/structures/structure_definitions.json"),
  tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),
  tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")
};

function blueId(state){return state.tutorialState.phase7Entities.blueEnemyId;}
function blue(state){return state.enemyUnits.find(e=>e.battleUnitId===blueId(state));}

test("Blue readable state advances Charge 1/2, Charge 2/2, then SHOCKWAVE", () => {
  let state=createTutorialPhase7RetryCheckpointState(data);
  state=recordTutorialPhase7PlayerEndTurn(state,{...state,phase:"enemy_phase"});
  state=prepareTutorialPhase7EnemyActivation(state);
  let r=resolveBlueShockwaveActivation(data.tutorialMap,state,blueId(state));
  assert.deepEqual(getBlueReadableState(blue(r.battleState)),{stateLabel:"CHARGE 1/2",intentType:"blue_charge",intentLabel:"CHARGE 2/2"});
  r=resolveBlueShockwaveActivation(data.tutorialMap,r.battleState,blueId(state));
  assert.deepEqual(getBlueReadableState(blue(r.battleState)),{stateLabel:"CHARGE 2/2",intentType:"blue_shockwave",intentLabel:"SHOCKWAVE"});
});

test("Shockwave radius 2 Stuns Guard and leaves Archer at distance 3 safe with zero damage", () => {
  let state=createTutorialPhase7RetryCheckpointState(data);
  const id=blueId(state);
  state={...state, enemyUnits:state.enemyUnits.map(e=>e.battleUnitId===id?{...e,patternState:{...e.patternState,active:true,chargeProgress:2}}:e)};
  const guardBefore=state.playerUnits.find(u=>u.unitDefId==="guard").currentHP;
  const archerBefore=state.playerUnits.find(u=>u.unitDefId==="archer").currentHP;
  // Put Archer on the approved safe tile.
  state={...state,playerUnits:state.playerUnits.map(u=>u.unitDefId==="archer"?{...u,tileX:9,tileY:2}:u)};
  const r=resolveBlueShockwaveActivation(data.tutorialMap,state,id);
  const guard=r.battleState.playerUnits.find(u=>u.unitDefId==="guard");
  const archer=r.battleState.playerUnits.find(u=>u.unitDefId==="archer");
  assert.equal(guard.statuses[0].remainingPlayerTurns,2);
  assert.equal(archer.statuses.length,0);
  assert.equal(guard.currentHP,guardBefore);
  assert.equal(archer.currentHP,archerBefore);
  assert.equal(r.event.finalDamage,0);
});

test("Shockwave threat tiles render only for SHOCKWAVE Current Intent", () => {
  let state=createTutorialPhase7RetryCheckpointState(data);
  const id=blueId(state);
  assert.equal(getBlueShockwaveThreatTiles(data.tutorialMap,state,id).length,0);
  state={...state, enemyUnits:state.enemyUnits.map(e=>e.battleUnitId===id?{...e,patternState:{...e.patternState,active:true,chargeProgress:2}}:e)};
  state=resolveEnemyCurrentIntent(state,id).battleState;
  const tiles=getBlueShockwaveThreatTiles(data.tutorialMap,state,id);
  assert.equal(tiles.some(t=>t.x===12&&t.y===4),true);
  assert.equal(tiles.some(t=>t.x===9&&t.y===2),false);
});
