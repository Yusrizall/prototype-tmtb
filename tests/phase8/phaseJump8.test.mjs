import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createTutorialPhaseJumpState, getTutorialPhaseEntryFingerprint } from "../../src/logic/tutorial/tutorialPhaseJumpLogic.js";
import { spawnTelegraphedWaves, telegraphWave, setScheduledWaveSpawn } from "../../src/logic/battle/waveLogic.js";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data={playerUnits:read("public/data/units/player_units.json"),enemyUnits:read("public/data/units/enemy_units.json"),structureDefinitions:read("public/data/structures/structure_definitions.json"),tutorialMap:read("public/data/maps/tutorial_offset_courtyard.json"),tutorialEncounter:read("public/data/encounters/tutorial_phase_1_5.json")};

test("Jump 8 creates deterministic Phase 8 entry PVS",()=>{
  const s=createTutorialPhaseJumpState(data,8);
  const guard=s.playerUnits.find(u=>u.unitDefId==="guard");
  const archer=s.playerUnits.find(u=>u.unitDefId==="archer");
  const blue=s.enemyUnits.find(e=>e.unitDefId==="blue_charger_candidate");
  assert.equal(s.tutorialState.phaseId,"phase_8_wave_graduation");
  assert.equal(s.tutorialState.taskId,"explain_wave_telegraph");
  assert.deepEqual({hp:guard.currentHP,x:guard.tileX,y:guard.tileY},{hp:10,x:12,y:4});
  assert.deepEqual({hp:archer.currentHP,x:archer.tileX,y:archer.tileY},{hp:11,x:9,y:2});
  assert.equal(blue.currentHP,26);
  assert.equal(blue.currentIntent.stateLabel,"CHARGE 2/2");
  assert.equal(blue.currentIntent.intentLabel,"SHOCKWAVE");
  assert.equal(s.teamApCurrent,4);
  assert.deepEqual(s.waveState.waves.map(w=>w.status),["telegraphed","scheduled","scheduled","scheduled"]);
});

test("Phase 8 fingerprint remains unambiguous after duplicate Sword/Spear archetypes and simultaneous Wave 3 spawn",()=>{
  let s=createTutorialPhaseJumpState(data,8);
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s=telegraphWave(s,"phase8_wave_2_spear");
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  s=setScheduledWaveSpawn(data.tutorialMap,s,"phase8_wave_3_sword_a","E6");
  s=telegraphWave(s,"phase8_wave_3_sword_a");
  s=setScheduledWaveSpawn(data.tutorialMap,s,"phase8_wave_3_sword_b","E7");
  s=telegraphWave(s,"phase8_wave_3_sword_b");
  s=spawnTelegraphedWaves(data.enemyUnits,data.tutorialMap,s).battleState;
  const f=getTutorialPhaseEntryFingerprint(s);
  assert.equal(f.enemyUnits.some(e=>e.battleUnitId==="tutorial_wave_sword_1"&&e.spawnOrder===4),true);
  assert.equal(f.enemyUnits.some(e=>e.battleUnitId==="tutorial_wave_spear_1"&&e.spawnOrder===5),true);
  assert.equal(f.enemyUnits.some(e=>e.battleUnitId==="tutorial_wave_sword_2"&&e.spawnOrder===6),true);
  assert.equal(f.enemyUnits.some(e=>e.battleUnitId==="tutorial_wave_sword_3"&&e.spawnOrder===7),true);
  assert.equal(f.waves.length,4);
  assert.deepEqual(f.waves.map(w=>w.status),["spawned","spawned","spawned","spawned"]);
});
