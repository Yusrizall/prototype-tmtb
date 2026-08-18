import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhaseJumpState } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { getReachableTilesForUnit, moveSelectedUnitToTile } from "../../src/logic/battle/movementLogic.js";
import {
  WAVE_STATUS,
  getActiveWaveReservations,
  isWaveReservedFinalPosition,
  isWaveSpawnPositionAvailable,
  setScheduledWaveSpawn,
  telegraphWave,
  spawnTelegraphedWaves,
  refreshWaveResolutionState,
  hasPendingRequiredWave,
  areRequiredWavesResolved
} from "../../src/logic/battle/waveLogic.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};
const wave=(s,id)=>s.waveState.waves.find(w=>w.waveId===id);

test("Wave 1 starts TELEGRAPHED while Wave 2 and both Wave 3 Swords remain SCHEDULED",()=>{
  const s=createTutorialPhaseJumpState(data,8);
  assert.equal(wave(s,"phase8_wave_1_sword").status,WAVE_STATUS.TELEGRAPHED);
  assert.equal(wave(s,"phase8_wave_2_spear").status,WAVE_STATUS.SCHEDULED);
  assert.equal(wave(s,"phase8_wave_3_sword_a").status,WAVE_STATUS.SCHEDULED);
  assert.equal(wave(s,"phase8_wave_3_sword_b").status,WAVE_STATUS.SCHEDULED);
  assert.deepEqual(getActiveWaveReservations(s),[{waveId:"phase8_wave_1_sword",x:12,y:5,label:"SWORD"}]);
  assert.equal(isWaveReservedFinalPosition(s,12,5),true);
});

test("reserved tile is traversable but excluded as final movement position",()=>{
  const s=createTutorialPhaseJumpState(data,8);
  const guard=s.playerUnits.find(u=>u.unitDefId==="guard");
  const tiles=getReachableTilesForUnit(data.tutorialMap,s,guard,{x:12,y:4},3);
  assert.equal(tiles.some(t=>t.x===12&&t.y===5),false);
  assert.equal(tiles.some(t=>t.x===12&&t.y===6),true);
  const blocked=moveSelectedUnitToTile(data.tutorialMap,s,12,5);
  const blockedGuard=blocked.playerUnits.find(u=>u.unitDefId==="guard");
  assert.deepEqual({x:blockedGuard.tileX,y:blockedGuard.tileY},{x:12,y:4});
  const traversed=moveSelectedUnitToTile(data.tutorialMap,s,12,6);
  const traversedGuard=traversed.playerUnits.find(u=>u.unitDefId==="guard");
  assert.deepEqual({x:traversedGuard.tileX,y:traversedGuard.tileY},{x:12,y:6});
});

test("reserved final-position rule applies to Enemy movement too",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s=telegraphWave(s,"phase8_wave_2_spear");
  const sword=s.enemyUnits.find(e=>e.battleUnitId==="tutorial_wave_sword_1");
  const movedEnemy={...sword,tileX:15,tileY:3,originTile:{x:15,y:3},derivedStats:{...sword.derivedStats,move:2}};
  s={...s,enemyUnits:s.enemyUnits.map(e=>e.battleUnitId===sword.battleUnitId?movedEnemy:e)};
  const tiles=getReachableTilesForUnit(data.tutorialMap,s,movedEnemy,{x:15,y:3},2);
  assert.equal(tiles.some(t=>t.x===15&&t.y===2),false);
  assert.equal(tiles.some(t=>t.x===15&&t.y===1),true);
});

test("Wave spawn creates a unique next-Spawn-Order enemy with no attached resolution",()=>{
  const s=createTutorialPhaseJumpState(data,8);
  const r=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,{...s,phase:"enemy_phase"});
  const sword=r.battleState.enemyUnits.find(e=>e.battleUnitId==="tutorial_wave_sword_1");
  assert.ok(sword);
  assert.deepEqual({x:sword.tileX,y:sword.tileY},{x:12,y:5});
  assert.equal(sword.spawnOrder,4);
  assert.equal(sword.currentHP,16);
  assert.equal(sword.currentTargetId,null);
  assert.equal(sword.currentIntent,null);
  assert.equal(r.spawnEvents.length,1);
  assert.equal(wave(r.battleState,"phase8_wave_1_sword").status,WAVE_STATUS.SPAWNED);
});

test("Wave 2 Spear uses Tutorial no-DEF ATK5 override and next Spawn Order",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,{...s,phase:"enemy_phase"}).battleState;
  s=telegraphWave(s,"phase8_wave_2_spear");
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  const spear=s.enemyUnits.find(e=>e.battleUnitId==="tutorial_wave_spear_1");
  assert.ok(spear);
  assert.equal(spear.spawnOrder,5);
  assert.equal(spear.derivedStats.atk,5);
  assert.equal(spear.currentHP,15);
});

test("scheduled Wave can be reassigned to an authored fallback spawn before Telegraph",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  assert.equal(isWaveSpawnPositionAvailable(s,10,0),true);
  s={...s,playerUnits:s.playerUnits.map(u=>u.unitDefId==="guard"?{...u,tileX:10,tileY:0}:u)};
  assert.equal(isWaveSpawnPositionAvailable(s,10,0),false);
  s=setScheduledWaveSpawn(data.tutorialMap,s,"phase8_wave_3_sword_a","E8");
  assert.deepEqual(wave(s,"phase8_wave_3_sword_a").spawnPosition,{x:9,y:1});
  s=telegraphWave(s,"phase8_wave_3_sword_a");
  assert.equal(isWaveReservedFinalPosition(s,9,1),true);
});

test("simultaneously telegraphed Wave 3 Swords spawn at split positions with consecutive Spawn Order",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s=telegraphWave(s,"phase8_wave_2_spear");
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s=setScheduledWaveSpawn(data.tutorialMap,s,"phase8_wave_3_sword_a","E6");
  s=telegraphWave(s,"phase8_wave_3_sword_a");
  s=setScheduledWaveSpawn(data.tutorialMap,s,"phase8_wave_3_sword_b","E7");
  s=telegraphWave(s,"phase8_wave_3_sword_b");
  const r=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s);
  const a=r.battleState.enemyUnits.find(e=>e.battleUnitId==="tutorial_wave_sword_2");
  const b=r.battleState.enemyUnits.find(e=>e.battleUnitId==="tutorial_wave_sword_3");
  assert.equal(r.spawnEvents.length,2);
  assert.deepEqual({x:a.tileX,y:a.tileY,order:a.spawnOrder,hp:a.currentHP},{x:10,y:0,order:6,hp:16});
  assert.deepEqual({x:b.tileX,y:b.tileY,order:b.spawnOrder,hp:b.currentHP},{x:14,y:5,order:7,hp:16});
});

test("required Wave remains pending until all spawned required enemies are defeated and refreshed",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s=telegraphWave(s,"phase8_wave_2_spear");
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s=setScheduledWaveSpawn(data.tutorialMap,s,"phase8_wave_3_sword_a","E6");
  s=telegraphWave(s,"phase8_wave_3_sword_a");
  s=setScheduledWaveSpawn(data.tutorialMap,s,"phase8_wave_3_sword_b","E7");
  s=telegraphWave(s,"phase8_wave_3_sword_b");
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  assert.equal(hasPendingRequiredWave(s),true);
  s={...s,enemyUnits:s.enemyUnits.map(e=>e.battleUnitId==="tutorial_wave_sword_2"?{...e,currentHP:0}:e)};
  s=refreshWaveResolutionState(s);
  assert.equal(wave(s,"phase8_wave_3_sword_a").status,WAVE_STATUS.RESOLVED);
  assert.equal(wave(s,"phase8_wave_3_sword_b").status,WAVE_STATUS.SPAWNED);
  assert.equal(areRequiredWavesResolved(s),false);
});
